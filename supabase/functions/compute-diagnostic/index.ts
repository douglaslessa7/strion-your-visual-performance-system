import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    // Get user from auth token
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { photoSetId, responses } = await req.json();

    // Admin client for service operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch photo set
    const { data: photoSet } = await supabaseAdmin
      .from("photo_sets")
      .select("*")
      .eq("id", photoSetId)
      .eq("user_id", user.id)
      .single();

    if (!photoSet) {
      return new Response(JSON.stringify({ error: "Photo set not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate signed URLs for photos
    const photoUrls: string[] = [];
    const urlFields = [
      "selfie_front_url",
      "selfie_side_url",
      "body_front_url",
      "body_side_url",
    ];

    for (const field of urlFields) {
      const path = photoSet[field];
      if (path) {
        const { data } = await supabaseAdmin.storage
          .from("user-photos")
          .createSignedUrl(path, 300);
        if (data?.signedUrl) photoUrls.push(data.signedUrl);
      }
    }

    // Build AI prompt with questionnaire data and photo URLs
    const systemPrompt = `You are Strion's diagnostic engine. You analyze male appearance data to compute a structured performance index.

Given the user's questionnaire responses and photos, compute:
1. An initial Strion Index (typically 55-75 for new users)
2. A personalized maximum potential (typically 82-92)
3. Exactly 3 structural improvement opportunities

The Strion Index formula weights:
- Execution Integrity: 50% (starts at 0 for new users)
- Visual Trend Score: 30% (based on photo analysis)
- Structural Indicators: 20% (based on questionnaire + photos)

For the initial diagnostic, base the index primarily on structural indicators and visual assessment since there's no execution history.

Be analytical. No motivational language.`;

    const userPrompt = `Questionnaire responses: ${JSON.stringify(responses)}

Photos have been provided for analysis (front selfie, side selfie, front body, side body).

Compute the diagnostic. Return your analysis using the provided function.`;

    // Build messages - include photo URLs as image content if available
    const userContent: any[] = [{ type: "text", text: userPrompt }];
    for (const url of photoUrls) {
      userContent.push({ type: "image_url", image_url: { url } });
    }

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
            { role: "user", content: userContent },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "compute_diagnostic",
                description:
                  "Return the computed Strion diagnostic results.",
                parameters: {
                  type: "object",
                  properties: {
                    index_value: {
                      type: "number",
                      description: "Initial Strion Index (55-75 range)",
                    },
                    max_potential: {
                      type: "number",
                      description:
                        "Personalized maximum potential (82-92 range)",
                    },
                    projected_min: {
                      type: "number",
                      description: "Projected 90-day minimum index",
                    },
                    projected_max: {
                      type: "number",
                      description: "Projected 90-day maximum index",
                    },
                    visual_component: {
                      type: "number",
                      description: "Visual trend score (0-100)",
                    },
                    structural_component: {
                      type: "number",
                      description: "Structural indicators score (0-100)",
                    },
                    opportunities: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Exactly 3 structural improvement opportunities",
                    },
                  },
                  required: [
                    "index_value",
                    "max_potential",
                    "projected_min",
                    "projected_max",
                    "visual_component",
                    "structural_component",
                    "opportunities",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "compute_diagnostic" },
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      throw new Error(`AI gateway returned ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const diagnostic = JSON.parse(toolCall.function.arguments);

    // Store index history
    await supabaseAdmin.from("index_history").insert({
      user_id: user.id,
      index_value: diagnostic.index_value,
      execution_component: 0,
      visual_component: diagnostic.visual_component,
      structural_component: diagnostic.structural_component,
      metadata: { source: "initial_diagnostic", photo_set_id: photoSetId },
    });

    // Update profile
    await supabaseAdmin
      .from("profiles")
      .update({
        current_index: diagnostic.index_value,
        max_potential: diagnostic.max_potential,
        onboarding_completed: true,
        protocol_start_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", user.id);

    return new Response(JSON.stringify(diagnostic), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("compute-diagnostic error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
