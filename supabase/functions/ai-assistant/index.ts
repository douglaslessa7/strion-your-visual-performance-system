import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  protocol: `You are the Strion Protocol Analyst. You provide structured, analytical feedback about the user's 90-day optimization protocol.

Rules:
- No motivational language. No emojis. No coaching tone.
- Be data-forward and clinical.
- Reference execution scores, index trends, and protocol compliance.
- When discussing progress, use precise language: "increased by X points", "variance detected", "compliance rate: X%".
- Keep responses concise and structured. Use bullet points for clarity.
- If the user asks something outside protocol scope, redirect: "That falls outside protocol parameters."`,

  recalibration: `You are the Strion Recalibration Analyst. You analyze checkpoint data and structural changes.

Rules:
- No motivational language. No emojis. No coaching tone.
- Focus on delta analysis between checkpoints.
- Reference structural indicators, visual trend scores, and execution integrity.
- Provide recalibration recommendations based on data patterns.
- Use precise, measured language. Never say "great job" or "keep it up".`,

  visual_review: `You are the Strion Visual Review Analyst. You analyze user photos for structural and visual indicators.

Rules:
- No motivational language. No emojis. No coaching tone.
- Analyze photos for: posture alignment, facial structure symmetry, grooming consistency, body composition indicators.
- Provide structured observations, not opinions.
- Reference specific anatomical or structural markers.
- Compare against previous checkpoints when data is available.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, mode = "protocol", conversation_id } = await req.json();

    // Fetch user context for richer responses
    const [profileRes, indexRes] = await Promise.all([
      supabase.from("profiles").select("current_index, max_potential, current_phase, current_week").eq("id", user.id).single(),
      supabase.from("index_history").select("date, index_value, execution_component, visual_component").eq("user_id", user.id).order("date", { ascending: false }).limit(7),
    ]);

    let contextBlock = "";
    if (profileRes.data) {
      const p = profileRes.data;
      contextBlock += `\nUser context:\n- Current Strion Index: ${p.current_index}\n- Max Potential: ${p.max_potential}\n- Phase: ${p.current_phase}, Week ${p.current_week}\n`;
    }
    if (indexRes.data && indexRes.data.length > 0) {
      contextBlock += `- Recent index trend (last ${indexRes.data.length} entries): ${indexRes.data.map((r: any) => r.index_value).join(" → ")}\n`;
    }

    const systemPrompt = (SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.protocol) + contextBlock;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save conversation asynchronously (don't block streaming)
    if (conversation_id) {
      const allMessages = [...messages];
      supabase
        .from("assistant_conversations")
        .update({ messages: allMessages, mode })
        .eq("id", conversation_id)
        .eq("user_id", user.id)
        .then(() => {});
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
