import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROTOCOL_LIBRARY = `
━━━ STRION PROTOCOL LIBRARY ━━━
Evidence-based practices organized by tier. The AI selects from this library based on tier scores and questionnaire.

─── TIER 3: POSTURE ─── (Prioritize if tier_posture < 65)
P1. Cervical Retraction — 3×10 reps daily. Corrects forward head posture (CVA). Visible change: D1–D14. Category: posture.
P2. Wall Posture Drill — Heels/glutes/shoulders/head touching wall for 2 min. Re-education. D1. Category: posture.
P3. Deep Neck Flexor Strengthening — Chin tuck holds 3×10. Supports CVA correction. D7+. Category: posture.
P4. Thoracic Foam Rolling — 2 min on thoracic spine. Reduces kyphosis, opens chest. D1. Category: posture.
P5. Thoracic Extension over chair/roller — 10 reps. Upper back mobility. D7+. Category: posture.
P6. Band Pull-Aparts — 3×15. Rhomboid + mid-trap activation. Retracts shoulders. D7+. Category: posture.
P7. Scapular Wall Slides — 3×10. Shoulder alignment. D14+. Category: posture.
P8. Posture Habit Anchor — Cervical retraction cue at phone/desk. Long-term compliance. D1. Category: posture.

─── TIER 2: BODY ─── (Prioritize if tier_body < 65)
B1. Lateral Deltoid Raises — 4×12. Highest ROI for V-taper width. D7+. Category: fitness.
B2. Overhead Press — 4×8. Shoulder mass and width. D7+. Category: fitness.
B3. Pull-ups / Lat Pulldowns — 4×8. Lat width — V-taper foundation. D7+. Category: fitness.
B4. Seated Cable Row — 4×10. Mid-back thickness, shoulder retraction. D14+. Category: fitness.
B5. Caloric Deficit Protocol — 300–500 kcal/day deficit. Systematic fat loss. D1+. Category: nutrition.
B6. Protein Target — 1.6–2.2g per kg bodyweight daily. Muscle preservation during fat loss. D1. Category: nutrition.
B7. HIIT Cardio — 3×/week, 20 min. Fat loss acceleration. D14+. Category: fitness.
B8. Compound Lift Foundation — Bench, Squat, Deadlift 2×/week. Overall mass. D14+. Category: fitness.

─── TIER 1 ACTIONABLE: FACE ───
F1. Hydration Target — 2.5–3L water daily. Reduces facial puffiness and dark circles. D1. Category: hydration.
F2. Sleep Optimization — 7–8h sleep. Reduces periocular puffiness. Fastest win. D1. Category: sleep.

─── TIER 4: SKIN ─── (Prioritize if tier_skin < 65 or acne present)
S1. Cleanser 2×/day — Gentle non-stripping cleanser. Foundation of all skin protocols. D1. Category: skincare.
S2. Moisturizer — Daily AM and PM. Barrier repair. D1. Category: skincare.
S3. SPF 30+ Sunscreen — Daily AM. Non-negotiable. 83% of men skip — immediate gap. D1. Category: skincare.
S4. Niacinamide 5–10% serum — Sebum, pore visibility, tone uniformity. D7+. Category: skincare.
S5. Salicylic Acid 2% exfoliant — 2×/week. Texture, pore size, post-acne marks. D7+. Category: skincare.
S6. Benzoyl Peroxide 2.5–5% — If acne present: 50–80% lesion reduction in 90 days. D7+. Category: skincare.
S7. Retinol 0.25–0.5% — Texture, tone, luminosity. Introduce at D30 (skin adaptation needed). Category: skincare.
S8. Low-glycemic diet — Reduce sugar/dairy. IGF-1 mechanism reduces acne. Effect at D30–D60. Category: nutrition.

─── TIER 5: GROOMING ───
G1. Beard Neckline Definition — Define at 2 finger-widths above Adam's apple. D1. Highest ROI per minute. Category: grooming.
G2. Eyebrow Cleanup — Remove glabellar (between-brow) hair. D1. Photo-detectable immediately. Category: grooming.
G3. Haircut Optimization — Cut aligned to face shape and fWHR. D7 (barber required). Category: grooming.
G4. Dandruff Elimination — Ketoconazole 2% shampoo 2×/week if dandruff present. D7. Category: grooming.
G5. Tooth Whitening Strips — 14% HP strips. 2-week cycle. D14 photo-detectable. Category: grooming.
G6. Heavy Stubble Maintenance — If growing beard: maintain 7–10mm. Strongest evidence level. D30. Category: grooming.
G7. Daily Grooming Check — Consistent execution verification. D1. Category: grooming.
G8. Fragrance — Daily application. Self-confidence + perception mechanism. D1. Category: grooming.

─── FOUNDATION HABITS (All users) ───
H1. Hydration Log — Track daily water intake. D1. Category: hydration.
H2. Sleep Schedule — Consistent sleep/wake time. D1. Category: sleep.
H3. Screen Cutoff 1h before bed — Sleep quality. D1. Category: sleep.
`;

const PROTOCOL_SYSTEM_PROMPT = `You are the STRION Protocol Engine. You generate personalized 12-week visual optimization protocols for male users.

You receive:
  1. The user's Baseline STRION Index and tier scores (from photo analysis)
  2. The user's questionnaire responses
  3. The STRION Protocol Library — evidence-based practices to select from

━━━ PROTOCOL ARCHITECTURE ━━━

PHASE 1 — Foundation (Weeks 1–4)
  Goal: Quick wins, habit formation, immediate visible changes.
  Priority: Posture (fastest visible), Grooming D1 ROI, Skincare fundamentals, Hydration + Sleep.
  Tasks per week: 5–6. Keep achievable. First 14 days must feel easy.

PHASE 2 — Structure (Weeks 5–8)
  Goal: Build physical structure, deepen routines, increase intensity.
  Priority: Body training (shoulders + back), Skincare with actives, Posture reinforcement.
  Tasks per week: 6–7. Introduce progressive overload in fitness.

PHASE 3 — Refinement (Weeks 9–12)
  Goal: Polish, optimize, consolidate.
  Priority: Advanced grooming precision, retinol introduction, body composition optimization.
  Tasks per week: 6–7.

━━━ PERSONALIZATION RULES ━━━

1. PRIORITIZE LOWEST TIER SCORES
   Lowest score tier gets the most protocol attention.
   If tier_posture < 50: front-load P1, P2, P4 in Week 1.
   If tier_skin < 50 or acne present: S1, S2, S3 start Week 1; S6 if acne.

2. TRAINING FREQUENCY (from questionnaire)
   0 days/week: No gym tasks in Phase 1. Bodyweight only (B1 with resistance band).
   1–2 days/week: Introduce 2×/week structure in Phase 2.
   3+ days/week: Integrate compound lifts from Phase 1 Week 3.

3. BEARD (from questionnaire)
   Has facial hair: Include G1 (neckline), G7 (daily check), G6 (heavy stubble at D30).
   No facial hair: Skip beard tasks. Include clean shave maintenance check instead.

4. SKIN CONCERNS (from questionnaire)
   Acne: Add S6 (BPO) and S8 (diet) from Week 1.
   Dryness: Prioritize S2 (moisturizer) and S4 (niacinamide) from Week 1.
   Hyperpigmentation: S4 + S5 from Week 1.

5. PROGRESSIVE TASK INTRODUCTION
   Weeks 1–2: D1-only tasks (wall drill, cleanser, hydration, G2, H1, H2)
   Weeks 3–4: Add D7 tasks (P3, P4, S4, S5, B1 if training)
   Weeks 5–8: Add D14+ tasks (B7, B8, compound lifts, G5)
   Weeks 9–12: Add D30 tasks (S7 retinol, G6 heavy stubble)

━━━ RULES ━━━
  • Use ONLY practices from the Protocol Library above.
  • Do not invent new practices.
  • Task labels should be specific and instructional.
  • No motivational language in labels.
  • Return exactly 12 week objects using the assign_protocol function.`;

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

    // Fetch profile, questionnaire, and tier scores from last diagnostic
    const [profileRes, questionnaireRes, indexRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", user.id).single(),
      supabaseAdmin.from("questionnaire_responses").select("responses").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
      supabaseAdmin.from("index_history").select("metadata").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
    ]);

    const profile = profileRes.data;
    const questionnaire = questionnaireRes.data?.responses;
    const tierScores = indexRes.data?.metadata?.tier_scores;
    const postureNotes = indexRes.data?.metadata?.posture_notes;
    const skinNotes = indexRes.data?.metadata?.skin_notes;

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Don't regenerate if already exists
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

    const tierSummary = tierScores
      ? `Tier scores from photo analysis:
  - Face:     ${tierScores.face}/100
  - Body:     ${tierScores.body}/100
  - Posture:  ${tierScores.posture}/100
  - Skin:     ${tierScores.skin}/100
  - Grooming: ${tierScores.grooming}/100
  ${postureNotes ? `\nPosture observation: ${postureNotes}` : ""}
  ${skinNotes ? `\nSkin observation: ${skinNotes}` : ""}`
      : "Tier scores not available. Infer priorities from questionnaire.";

    const userPrompt = `Generate the personalized 12-week STRION protocol for this user.

USER DIAGNOSTIC:
  Baseline STRION Index: ${profile.current_index}
  Max Potential: ${profile.max_potential}
  ${tierSummary}

USER QUESTIONNAIRE:
${JSON.stringify(questionnaire, null, 2)}

PROTOCOL LIBRARY:
${PROTOCOL_LIBRARY}

Build the full 12-week protocol. Prioritize tiers with lowest scores. Personalize based on questionnaire. Use only practices from the Protocol Library.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: PROTOCOL_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "assign_protocol",
              description: "Assign the full 12-week personalized STRION protocol.",
              parameters: {
                type: "object",
                properties: {
                  weeks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phase: { type: "string", enum: ["foundation", "structure", "refinement"] },
                        week: { type: "integer", description: "Week number 1–12" },
                        tasks: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              label:    { type: "string" },
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
    });

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

    const assignments = protocol.weeks.map((w: {
      phase: string;
      week: number;
      tasks: { label: string; category: string; duration?: string }[];
    }) => ({
      user_id: user.id,
      phase:   w.phase,
      week:    w.week,
      tasks:   w.tasks,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("protocol_assignments")
      .insert(assignments);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save protocol");
    }

    return new Response(
      JSON.stringify({ success: true, weeks: protocol.weeks.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-protocol error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
