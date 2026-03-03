import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DIAGNOSTIC_SYSTEM_PROMPT = `You are the STRION Diagnostic Engine. You analyze male appearance photos to compute the Baseline STRION Index — a structured visual performance score.

━━━ SCORING FRAMEWORK ━━━

The Baseline STRION Index is composed of 5 tiers. You must score each tier independently from 0–100, then compute the weighted composite.

TIER WEIGHTS (total = 100%):
  Tier 1 — Face:     28%
  Tier 2 — Body:     27%
  Tier 3 — Posture:  20%
  Tier 4 — Skin:     15%
  Tier 5 — Grooming: 10%

━━━ WHAT TO ANALYZE PER TIER ━━━

TIER 1 — FACE (from front selfie photo)
Evaluate:
  • Facial averageness and typicality (symmetrical and proportionate?)
  • Facial symmetry — left/right alignment of eyes, ears, jawline
  • fWHR (facial width-to-height ratio) — wider faces with defined cheekbones score higher
  • Facial adiposity — is the jawline defined or obscured by fat?
  • Canthal tilt — do outer eye corners sit higher than inner corners? (positive tilt scores higher)
  • Dark circles or periocular puffiness
  • Resting expression — neutral, composed, relaxed jaw
Note: Fixed genetic structure (averageness, skeletal proportions, fWHR) anchors the score. Actionable variables (adiposity, dark circles, expression) can shift it slightly.

TIER 2 — BODY (from front body + side body photos)
Evaluate:
  • Shoulder-to-waist ratio (V-taper) — wider shoulders relative to waist scores higher
  • Visible muscle development: shoulders, chest, arms, lats
  • Body fat tier: under 10% / 10–15% / 15–20% / 20–25% / over 25%
  • Definition markers: visible muscle separation, early vascularity, ab visibility
  • Overall physical structure and frame perception

TIER 3 — POSTURE (from side body + side selfie photos)
Evaluate:
  • CVA — Cervical Vertebral Angle: does the head project forward from the spine? (severe forward head = low score)
  • Shoulder alignment: protracted (rolled forward) or retracted and aligned?
  • Thoracic curvature: excessive kyphosis (rounded upper back)?
  • Overall vertical alignment from ear to shoulder to hip
Note: Score conservatively — most new users have moderate posture issues.

TIER 4 — SKIN (from front selfie)
Evaluate:
  • Skin tone uniformity and clarity
  • Visible acne, active breakouts, or lesion count
  • Texture: rough, bumpy, or smooth surface
  • Oiliness or shine
  • Post-inflammatory hyperpigmentation (dark spots from past acne)

TIER 5 — GROOMING (from front selfie)
Scoring principle: Score the QUALITY OF EXECUTION of the current grooming style — not the presence or absence of a beard.
  • Clean shave, well executed = high score
  • Well-maintained beard = high score
  • Inconsistent, patchy, or neglected facial hair = low score
  • Hair: clean, styled with intention, proportionate to face?
  • Eyebrows: groomed or unkempt? Visible unibrow or extreme asymmetry?

━━━ COMPOSITE CALCULATION ━━━

Baseline STRION Index = (T1 × 0.28) + (T2 × 0.27) + (T3 × 0.20) + (T4 × 0.15) + (T5 × 0.10)

Typical ranges for new users:
  • 45–60: Multiple areas with significant opportunity
  • 60–70: Average starting point — solid foundation with clear gaps
  • 70–78: Above average baseline
  • Above 78: Uncommon — reserve for exceptionally optimized individuals

━━━ MAX POTENTIAL ━━━

Realistic ceiling achievable through 90-day protocol execution.
  • Posture + Grooming: highest ceiling (near-complete correction possible)
  • Skin: high ceiling if acne/texture present
  • Body: moderate ceiling in 90 days
  • Face: low ceiling (mostly fixed genetics)
  • Typical range: 80–92. Do not exceed 92.

━━━ OPPORTUNITIES ━━━

Exactly 3 highest-ROI improvement opportunities. Be specific:
  Not: "improve fitness"
  Yes: "Shoulder-to-waist ratio is below baseline; lateral deltoid and lat development would shift perceived V-taper significantly."

━━━ RULES ━━━
  • Analyze ONLY the photos. Do not use questionnaire data.
  • Be analytical and precise. No motivational language. No emojis.
  • Score conservatively.
  • Return results using the compute_diagnostic function.`;

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

    // Only receives photoSetId — questionnaire is NOT used here
    const { photoSetId } = await req.json();

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

    // Generate signed URLs
    const photoUrls: { label: string; url: string }[] = [];
    const urlFields = [
      { field: "selfie_front_url", label: "Front selfie (face analysis)" },
      { field: "selfie_side_url", label: "Side selfie (CVA + canthal tilt)" },
      { field: "body_front_url", label: "Front body (V-taper + muscle development)" },
      { field: "body_side_url", label: "Side body (posture + thoracic alignment)" },
    ];

    for (const { field, label } of urlFields) {
      const path = (photoSet as Record<string, unknown>)[field] as string | null;
      if (path) {
        const { data } = await supabaseAdmin.storage
          .from("user-photos")
          .createSignedUrl(path, 300);
        if (data?.signedUrl) photoUrls.push({ label, url: data.signedUrl });
      }
    }

    if (photoUrls.length === 0) {
      return new Response(JSON.stringify({ error: "No photos found in photo set" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContent: unknown[] = [
      {
        type: "text",
        text: `Analyze the following ${photoUrls.length} photos and compute the Baseline STRION Index.\n\nPhotos:\n${photoUrls.map(p => `- ${p.label}`).join("\n")}\n\nApply the full 5-tier scoring framework. Return results using the compute_diagnostic function.`,
      },
      ...photoUrls.map(({ url }) => ({ type: "image_url", image_url: { url } })),
    ];

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: DIAGNOSTIC_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "compute_diagnostic",
              description: "Return the computed STRION Baseline diagnostic with full tier breakdown.",
              parameters: {
                type: "object",
                properties: {
                  tier_face:     { type: "number", description: "Tier 1 Face score (0–100)" },
                  tier_body:     { type: "number", description: "Tier 2 Body score (0–100)" },
                  tier_posture:  { type: "number", description: "Tier 3 Posture score (0–100)" },
                  tier_skin:     { type: "number", description: "Tier 4 Skin score (0–100)" },
                  tier_grooming: { type: "number", description: "Tier 5 Grooming score (0–100)" },
                  index_value:   { type: "number", description: "Baseline STRION Index — weighted composite" },
                  max_potential: { type: "number", description: "Realistic max achievable in 90 days (80–92)" },
                  projected_min: { type: "number", description: "Conservative 90-day projection" },
                  projected_max: { type: "number", description: "Optimistic 90-day projection" },
                  opportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 specific, actionable structural improvement opportunities",
                  },
                  posture_notes: { type: "string", description: "Clinical observation about posture (CVA severity, shoulder protraction)" },
                  skin_notes:    { type: "string", description: "Clinical observation about skin condition (acne severity, texture, tone)" },
                },
                required: [
                  "tier_face", "tier_body", "tier_posture", "tier_skin", "tier_grooming",
                  "index_value", "max_potential", "projected_min", "projected_max",
                  "opportunities", "posture_notes", "skin_notes",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "compute_diagnostic" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      throw new Error(`AI gateway returned ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const diagnostic = JSON.parse(toolCall.function.arguments);

    // Save to index_history with full tier breakdown
    await supabaseAdmin.from("index_history").insert({
      user_id: user.id,
      index_value: diagnostic.index_value,
      execution_component: 0,
      visual_component: Math.round(
        (diagnostic.tier_face * 0.28) +
        (diagnostic.tier_body * 0.27) +
        (diagnostic.tier_posture * 0.20)
      ),
      structural_component: Math.round(
        (diagnostic.tier_skin * 0.15) +
        (diagnostic.tier_grooming * 0.10)
      ),
      metadata: {
        source: "initial_diagnostic",
        photo_set_id: photoSetId,
        tier_scores: {
          face:     diagnostic.tier_face,
          body:     diagnostic.tier_body,
          posture:  diagnostic.tier_posture,
          skin:     diagnostic.tier_skin,
          grooming: diagnostic.tier_grooming,
        },
        posture_notes: diagnostic.posture_notes,
        skin_notes:    diagnostic.skin_notes,
      },
    });

    // Update profile
    await supabaseAdmin
      .from("profiles")
      .update({
        current_index:        diagnostic.index_value,
        max_potential:        diagnostic.max_potential,
        onboarding_completed: true,
        protocol_start_date:  new Date().toISOString().split("T")[0],
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
