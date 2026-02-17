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

    // Authenticate user
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

    const { photoSetId, checkpointDay } = await req.json();
    if (!photoSetId || !checkpointDay) {
      return new Response(JSON.stringify({ error: "Missing photoSetId or checkpointDay" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch current profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("current_index, max_potential, current_phase, current_week")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch new photo set
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

    // Fetch previous photo set for comparison
    const { data: previousSets } = await supabaseAdmin
      .from("photo_sets")
      .select("*")
      .eq("user_id", user.id)
      .lt("checkpoint_day", checkpointDay)
      .order("checkpoint_day", { ascending: false })
      .limit(1);

    // Fetch execution history for the period
    const { data: executionHistory } = await supabaseAdmin
      .from("daily_execution")
      .select("execution_score")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(30);

    const avgExecution = executionHistory && executionHistory.length > 0
      ? executionHistory.reduce((sum, e) => sum + Number(e.execution_score), 0) / executionHistory.length
      : 0;

    // Generate signed URLs for new photos
    const photoUrls: string[] = [];
    const urlFields = ["selfie_front_url", "selfie_side_url", "body_front_url", "body_side_url"];

    for (const field of urlFields) {
      const path = (photoSet as Record<string, unknown>)[field] as string | null;
      if (path) {
        const { data } = await supabaseAdmin.storage
          .from("user-photos")
          .createSignedUrl(path, 300);
        if (data?.signedUrl) photoUrls.push(data.signedUrl);
      }
    }

    // Generate signed URLs for previous photos (for comparison)
    const previousPhotoUrls: string[] = [];
    if (previousSets && previousSets.length > 0) {
      for (const field of urlFields) {
        const path = (previousSets[0] as Record<string, unknown>)[field] as string | null;
        if (path) {
          const { data } = await supabaseAdmin.storage
            .from("user-photos")
            .createSignedUrl(path, 300);
          if (data?.signedUrl) previousPhotoUrls.push(data.signedUrl);
        }
      }
    }

    const previousIndex = profile.current_index ?? 60;

    const systemPrompt = `You are Strion's recalibration engine. You compare checkpoint photos against previous photos to measure visual progress and recalculate the Strion Index.

The Strion Index formula:
- Execution Integrity: 50% (provided as average execution score)
- Visual Trend Score: 30% (based on photo comparison)
- Structural Indicators: 20% (based on current photos)

Current data:
- Previous index: ${previousIndex}
- Average execution score: ${avgExecution.toFixed(1)}%
- Checkpoint day: ${checkpointDay}
- Max potential: ${profile.max_potential ?? 85}

Rules:
- The new index should reflect genuine visual changes, not arbitrary jumps
- Index changes between checkpoints should typically be 1-5 points
- Never exceed the user's max potential
- Be analytical. No motivational language.
- Provide exactly 3 observations about structural changes`;

    const userContent: unknown[] = [
      {
        type: "text",
        text: `Checkpoint Day ${checkpointDay} recalibration. Compare new photos against previous checkpoint photos and compute updated index.\n\nNew checkpoint photos:`,
      },
      ...photoUrls.map((url) => ({ type: "image_url", image_url: { url } })),
    ];

    if (previousPhotoUrls.length > 0) {
      userContent.push({ type: "text", text: "Previous checkpoint photos for comparison:" });
      for (const url of previousPhotoUrls) {
        userContent.push({ type: "image_url", image_url: { url } });
      }
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
                name: "recalibration_result",
                description: "Return recalibration results with updated index and observations.",
                parameters: {
                  type: "object",
                  properties: {
                    new_index: {
                      type: "number",
                      description: "Updated Strion Index after recalibration",
                    },
                    visual_component: {
                      type: "number",
                      description: "Visual trend score (0-100)",
                    },
                    structural_component: {
                      type: "number",
                      description: "Structural indicators score (0-100)",
                    },
                    execution_component: {
                      type: "number",
                      description: "Execution integrity score (0-100)",
                    },
                    observations: {
                      type: "array",
                      items: { type: "string" },
                      description: "Exactly 3 structural change observations",
                    },
                    index_delta: {
                      type: "number",
                      description: "Change from previous index (positive or negative)",
                    },
                  },
                  required: [
                    "new_index",
                    "visual_component",
                    "structural_component",
                    "execution_component",
                    "observations",
                    "index_delta",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "recalibration_result" },
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

    const result = JSON.parse(toolCall.function.arguments);

    // Store new index history
    await supabaseAdmin.from("index_history").insert({
      user_id: user.id,
      index_value: result.new_index,
      execution_component: result.execution_component,
      visual_component: result.visual_component,
      structural_component: result.structural_component,
      metadata: {
        source: "recalibration",
        checkpoint_day: checkpointDay,
        photo_set_id: photoSetId,
        index_delta: result.index_delta,
      },
    });

    // Store checkpoint record
    await supabaseAdmin.from("checkpoints").upsert(
      {
        user_id: user.id,
        checkpoint_day: checkpointDay,
        photo_set_id: photoSetId,
        previous_index: previousIndex,
        new_index: result.new_index,
        recalibration_notes: {
          observations: result.observations,
          avg_execution: avgExecution,
          visual_component: result.visual_component,
          structural_component: result.structural_component,
        },
      },
      { onConflict: "user_id,checkpoint_day" }
    );

    // Update profile with new index
    await supabaseAdmin
      .from("profiles")
      .update({ current_index: result.new_index })
      .eq("id", user.id);

    return new Response(
      JSON.stringify({
        ...result,
        previous_index: previousIndex,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("recalibrate error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
