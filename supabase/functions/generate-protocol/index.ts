import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Predefined task template library organized by category
const TASK_TEMPLATES: Record<string, { label: string; duration?: string; category: string }[]> = {
  posture: [
    { label: "Posture Drill", duration: "10 min", category: "posture" },
    { label: "Cervical Retraction Hold", duration: "5 min", category: "posture" },
    { label: "Wall Angel Reps", duration: "8 min", category: "posture" },
    { label: "Thoracic Extension", duration: "6 min", category: "posture" },
  ],
  skincare: [
    { label: "Morning Skincare Routine", category: "skincare" },
    { label: "Evening Skincare Routine", category: "skincare" },
    { label: "SPF Application", category: "skincare" },
    { label: "Exfoliation Treatment", category: "skincare" },
  ],
  grooming: [
    { label: "Grooming Check", category: "grooming" },
    { label: "Hair Maintenance", category: "grooming" },
    { label: "Beard/Facial Hair Trim", category: "grooming" },
    { label: "Nail & Hand Care", category: "grooming" },
  ],
  fitness: [
    { label: "Shoulder Mobility", duration: "8 min", category: "fitness" },
    { label: "Upper Body Compound Set", duration: "25 min", category: "fitness" },
    { label: "Core Stability Circuit", duration: "12 min", category: "fitness" },
    { label: "Full Body Resistance", duration: "30 min", category: "fitness" },
    { label: "Stretching & Recovery", duration: "15 min", category: "fitness" },
  ],
  hydration: [
    { label: "Hydration Target", category: "hydration" },
    { label: "Water Intake Log", category: "hydration" },
  ],
  sleep: [
    { label: "Sleep Hygiene Protocol", category: "sleep" },
    { label: "Screen Cutoff — 1hr before bed", category: "sleep" },
  ],
  nutrition: [
    { label: "Protein Target", category: "nutrition" },
    { label: "Micronutrient Check", category: "nutrition" },
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabaseUser = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user profile and diagnostic data
    const [profileRes, questionnaireRes, indexRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", user.id).single(),
      supabaseAdmin.from("questionnaire_responses").select("responses").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
      supabaseAdmin.from("index_history").select("metadata").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
    ]);

    const profile = profileRes.data;
    const questionnaire = questionnaireRes.data?.responses;

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if protocol already exists
    const { data: existing } = await supabaseAdmin
      .from("protocol_assignments")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ message: "Protocol already generated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ask AI to select and customize tasks from templates based on diagnostic
    const allTemplates = Object.values(TASK_TEMPLATES).flat();

    const systemPrompt = `You are Strion's protocol engine. Given a user's diagnostic data, select and assign daily tasks from the provided template library for a 12-week protocol (3 phases of 4 weeks each).

Rules:
- Assign 5-7 tasks per week
- Phase 1 (Foundation, weeks 1-4): Focus on habits, posture basics, skincare fundamentals
- Phase 2 (Structure, weeks 5-8): Increase intensity, add fitness, refine grooming
- Phase 3 (Refinement, weeks 9-12): Optimize all areas, advanced routines
- Tasks should progressively build in complexity
- Personalize based on diagnostic opportunities and questionnaire data
- Each task object must have: label (string), category (string), and optionally duration (string)
- Return the result using the provided function`;

    const userPrompt = `User diagnostic data:
- Current Index: ${profile.current_index}
- Max Potential: ${profile.max_potential}
- Questionnaire: ${JSON.stringify(questionnaire)}

Available task templates:
${JSON.stringify(allTemplates, null, 2)}

Generate the full 12-week protocol.`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "assign_protocol",
                description: "Assign the 12-week protocol with tasks per week.",
                parameters: {
                  type: "object",
                  properties: {
                    weeks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          phase: { type: "string", enum: ["foundation", "structure", "refinement"] },
                          week: { type: "integer", description: "1-12" },
                          tasks: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                label: { type: "string" },
                                category: { type: "string" },
                                duration: { type: "string" },
                              },
                              required: ["label", "category"],
                            },
                          },
                        },
                        required: ["phase", "week", "tasks"],
                      },
                    },
                  },
                  required: ["weeks"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "assign_protocol" } },
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      if (status === 429 || status === 402) {
        return new Response(
          JSON.stringify({ error: status === 429 ? "Rate limited" : "Credits exhausted" }),
          { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway returned ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const protocol = JSON.parse(toolCall.function.arguments);

    // Insert all 12 weeks into protocol_assignments
    const assignments = protocol.weeks.map((w: any) => ({
      user_id: user.id,
      phase: w.phase,
      week: w.week,
      tasks: w.tasks,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("protocol_assignments")
      .insert(assignments);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save protocol");
    }

    return new Response(JSON.stringify({ success: true, weeks: protocol.weeks.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-protocol error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
