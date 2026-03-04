import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTOCOL LIBRARY
// Evidence-based practices organized by tier.
// Each practice includes: code, description, frequency, earliest intro week,
// category, and a brief mechanism/evidence note.
// ─────────────────────────────────────────────────────────────────────────────
const PROTOCOL_LIBRARY = `
━━━ STRION PROTOCOL LIBRARY ━━━

─── TIER 3: POSTURE ───
P1.  Cervical Retraction — 3×10 reps daily. Corrects forward head posture. Fastest visible change D1–D14. Category: posture. Intro: Week 1.
P2.  Wall Posture Drill — Stand heels/glutes/shoulders/head touching wall, 2 min hold. Full-chain postural re-education. Category: posture. Intro: Week 1.
P3.  Deep Neck Flexor Strengthening — Chin tuck holds 3×10 sec. Stabilizes CVA correction. Category: posture. Intro: Week 1.
P4.  Thoracic Foam Rolling — 2 min on thoracic spine, 10 extensions. Reduces kyphosis, opens chest. Category: posture. Intro: Week 1.
P5.  Thoracic Extension over chair — 10 reps. Upper back mobility, directly improves side profile. Category: posture. Intro: Week 2.
P6.  Band Pull-Aparts — 3×15. Rhomboid + mid-trap activation. Retracts protracted shoulders. Category: posture. Intro: Week 2.
P7.  Scapular Wall Slides — 3×10. Shoulder blade alignment and serratus activation. Category: posture. Intro: Week 3.
P8.  Posture Habit Anchor — Cervical retraction cue set at phone/desk/sitting. Highest long-term compliance. Category: posture. Intro: Week 1.
P9.  Stomach Vacuum — Transversus abdominis activation, 3×20 sec hold. Reduces abdominal protrusion from TrA weakness. Category: posture. Intro: Week 2.
P10. Wall Angels — 3×10 slow reps against wall. Serratus anterior + lower trapezius. Corrects scapular winging. Category: posture. Intro: Week 3.
P11. Balance / Proprioceptive Training — Single-leg stance 3×30 sec/side. Resets vestibular neutral — corrects lateral head tilt. Category: posture. Intro: Week 2.
P12. Dead Hang — 3×30 sec. Spinal decompression, thoracic opening. ⚠️ CONTRAINDICATED if scoliosis_safety_flag = true. Category: posture. Intro: Week 4.

─── TIER 2: BODY ───
B1.  Lateral Deltoid Raises — 4×12. Highest ROI for V-taper width. Lateral deltoid head. Category: fitness. Intro: Week 2.
B2.  Overhead Press — 4×8. Shoulder mass and cap roundness. Category: fitness. Intro: Week 2.
B3.  Pull-ups / Lat Pulldowns — 4×8. Lat width — V-taper foundation. Category: fitness. Intro: Week 2.
B4.  Seated Cable Row — 4×10. Mid-back thickness, shoulder retraction reinforcement. Category: fitness. Intro: Week 3.
B5.  Caloric Deficit Protocol — 300–500 kcal/day deficit. Systematic fat loss. ⚠️ DO NOT prescribe for ectomorph. Category: nutrition. Intro: Week 1.
B6.  Protein Target — 1.6–2.2g per kg bodyweight. Muscle preservation during fat loss or building. Category: nutrition. Intro: Week 1.
B7.  HIIT Cardio — 3×/week, 20 min. Fat loss acceleration, vascular definition. ⚠️ DO NOT prescribe for ectomorph. Category: fitness. Intro: Week 3.
B8.  Compound Lift Foundation — Bench press, Squat, Deadlift 2×/week. Overall mass and structural development. Category: fitness. Intro: Week 3.
B9.  Caloric Surplus Protocol — 250–400 kcal/day above maintenance. Mass gain for lean phenotypes. ⚠️ ONLY for ectomorph. Category: nutrition. Intro: Week 1.
B10. Body Recomposition — Maintenance calories + high protein (2.2g/kg). Simultaneous fat loss and muscle gain. ⚠️ ONLY for skinny_fat. Category: nutrition. Intro: Week 1.
B11. Sleep for Recovery — 7–9h nightly. GH release, muscle protein synthesis. Doubles as face/skin intervention. Category: sleep. Intro: Week 1.

─── TIER 1 ACTIONABLE: FACE ───
F1.  Hydration Target — 2.5–3L water daily. Reduces facial puffiness and dark circles. Category: hydration. Intro: Week 1.
F2.  Sleep Optimization — 7–8h sleep. Reduces periocular puffiness and edema. Fastest win D1–D7. Category: sleep. Intro: Week 1.
F3.  Sodium Reduction — Limit processed food sodium. Reduces interstitial fluid retention / facial edema. ⚠️ ONLY if dark_circle_type = vascular or edema pattern detected. Category: nutrition. Intro: Week 1.
F4.  Alcohol Reduction — Limit to ≤2 drinks/week. Reduces facial puffiness and periorbital edema. ⚠️ ONLY if edema pattern detected. Category: lifestyle. Intro: Week 1.

─── TIER 4: SKIN ───
S1.  Gentle Cleanser 2×/day — Foundation of all skin protocols. Non-stripping. D1. Category: skincare. Intro: Week 1.
S2.  Moisturizer AM + PM — Barrier repair and hydration. Essential before any actives. Category: skincare. Intro: Week 1.
S3.  SPF 30+ Sunscreen — Daily AM. 83% of men skip — immediate high-ROI gap. Extends improvement ceiling. Category: skincare. Intro: Week 1.
S4.  Niacinamide 5–10% serum — Sebum control, pore visibility, tone uniformity, redness, mild acne. Best-tolerated multi-target active. ⚠️ PRIMARY for dark_circle_type = pigmentary. Category: skincare. Intro: Week 2.
S5.  Salicylic Acid 2% (BHA) — 3×/week. Texture, pore size, post-acne marks. ⚠️ PRIMARY for acne_subtype = comedonal. Category: skincare. Intro: Week 2.
S6.  Benzoyl Peroxide 2.5–5% — 50–80% inflammatory lesion reduction achievable in 90 days. ⚠️ PRIMARY for acne_subtype = inflammatory. MANDATORY if inflammatory acne present. Category: skincare. Intro: Week 2.
S7.  Retinol 0.25–0.5% — Texture, tone, luminosity, collagen. Introduce after 4 weeks of barrier prep. Category: skincare. Intro: Week 5.
S8.  Low-glycemic diet + dairy reduction — IGF-1/mTORC1 pathway reduces acne load. Effect at D30–D60. ⚠️ ONLY if acne present (any subtype). Category: nutrition. Intro: Week 1.
S9.  Ceramide barrier repair moisturizer — Essential if compromised barrier (flaking, dehydration lines). Must precede retinol introduction. Category: skincare. Intro: Week 1.
S10. Caffeine eye cream — Vasoconstriction reduces vascular dark circles. ⚠️ ONLY if dark_circle_type = vascular. Category: skincare. Intro: Week 2.
S11. MEDICAL REFERRAL — Nodular/cystic acne exceeds OTC ceiling. Dermatologist required for these lesions. ⚠️ MANDATORY if acne_subtype = nodular_cystic. Category: skincare. Intro: Week 1.

─── TIER 5: GROOMING ───
G1.  Beard Neckline Definition — Define at 2 finger-widths above Adam's apple. D1. Highest grooming ROI per minute. ⚠️ ONLY if beard_present = true. Category: grooming. Intro: Week 1.
G2.  Eyebrow Cleanup — Remove glabellar (between-brow) hair. D1. Photo-detectable immediately. Category: grooming. Intro: Week 1.
G3.  Haircut Optimization — Cut aligned to face shape and fWHR. Calibrate to hair_texture_type. ⚠️ If dandruff_flag = true: treat scalp first, defer haircut recommendation to Week 3. Category: grooming. Intro: Week 1.
G4.  Dandruff Treatment — Ketoconazole 2% shampoo 2×/week. 73% improvement by D7. ⚠️ MANDATORY and FIRST priority if dandruff_flag = true. Category: grooming. Intro: Week 1.
G5.  Tooth Whitening Strips — 14% HP strips, 14-day cycle. ΔE ≥3.3 photo-detectable change. ⚠️ ONLY if dental_discoloration_flag = true. Category: grooming. Intro: Week 2.
G6.  Heavy Stubble Maintenance — Maintain 7–10mm. Strongest evidence base for beard attractiveness. ⚠️ ONLY if beard_present = true, Intro Week 4+. Category: grooming. Intro: Week 4.
G7.  Daily Grooming Consistency Check — Mirror check: beard, hair, brows, lips, nasal area. D1. Category: grooming. Intro: Week 1.
G8.  Fragrance — Daily application. Self-confidence mechanism. Non-photo-detectable but high in-person ROI. Category: grooming. Intro: Week 1.
G9.  Clean Shave Optimization — Technique, razor quality, post-shave routine. ⚠️ ONLY if beard_present = false. Category: grooming. Intro: Week 1.
G10. Nasal + Ear Hair Removal — Trim protruding nasal and/or ear hair. ⚠️ ONLY if flagged in diagnostic. D1. Category: grooming. Intro: Week 1.
G11. Lip Hydration — Lip balm AM and PM, gentle exfoliation 2×/week. ⚠️ ONLY if chapping/flaking noted. Category: grooming. Intro: Week 1.
G12. Resting Expression Awareness — Conscious relaxation of jaw and DAO (mouth corners). Mirror practice 2×/day. ⚠️ ONLY if resting_expression_flag = true. Category: grooming. Intro: Week 1.
G13. Scalp Massage — 4 min daily. Supports hair follicle circulation. ⚠️ ONLY if hair_loss_flag = true. Category: grooming. Intro: Week 1.
G14. Minoxidil 5% (topical) — Evidence-based hair retention/regrowth. ⚠️ ONLY if hair_loss_flag = true. Long-term commitment required. Category: grooming. Intro: Week 2.

─── FOUNDATION HABITS (all users) ───
H1.  Hydration Log — Track daily water intake target (2.5–3L). D1. Category: hydration. Intro: Week 1.
H2.  Sleep Schedule — Consistent sleep/wake time. D1. Foundation for all physical recovery. Category: sleep. Intro: Week 1.
H3.  Screen Cutoff 1h before bed — Sleep quality improvement. Category: sleep. Intro: Week 1.
`;

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────────────────
const PROTOCOL_SYSTEM_PROMPT = `You are the STRION Protocol Engine. You generate personalized 12-week visual optimization protocols for male users.

You receive:
  1. The user's Baseline STRION Index and tier scores (from photo analysis)
  2. All diagnostic routing flags (from photo analysis)
  3. The user's questionnaire responses
  4. The STRION Protocol Library — evidence-based practices to select from

━━━ PROTOCOL ARCHITECTURE ━━━

PHASE 1 — Foundation (Weeks 1–4)
  Goal: Quick wins, habit formation, immediate visible changes.
  Priority tiers: Posture (fastest visible change), Grooming D1 ROI, Skincare fundamentals, Hydration + Sleep.
  Tasks per week: 5–6. Keep achievable. Weeks 1–2 must feel easy.

PHASE 2 — Structure (Weeks 5–8)
  Goal: Build physical structure, deepen routines, increase intensity.
  Priority tiers: Body (shoulders + back), Skin actives deepening, Posture reinforcement.
  Tasks per week: 6–7. Introduce progressive overload in fitness.

PHASE 3 — Refinement (Weeks 9–12)
  Goal: Polish, optimize, consolidate gains.
  Priority tiers: Advanced grooming precision, retinol introduction, body composition optimization.
  Tasks per week: 6–7.

━━━ STEP 1: READ THE DIAGNOSTIC FLAGS — DO THIS BEFORE BUILDING ANYTHING ━━━

The diagnostic engine has already classified this user. Read every flag and apply the routing rules below before selecting a single practice.

─── BODY PHENOTYPE (body_phenotype) — CRITICAL ROUTING GATE ───
This is the most consequential flag. Prescribing the wrong nutrition protocol here is a clinical error.

  • "ectomorph":
    - DO NOT prescribe B5 (caloric deficit) or B7 (HIIT cardio).
    - MUST prescribe B9 (caloric surplus) and B6 (protein target).
    - Fitness focus: hypertrophy compound movements (B8) + lateral delts (B1) for immediate frame perception.
    - Body score ceiling is high — frame development is the primary lever.

  • "endomorph":
    - MUST prescribe B5 (caloric deficit) and B7 (HIIT cardio) from Phase 1.
    - DO NOT prescribe B9 (caloric surplus).
    - WHR reduction is the highest ROI lever — prioritize systemic deficit before any hypertrophy.
    - If WHR is above 0.90: defer heavy compound lifts to Phase 2.

  • "skinny_fat":
    - MUST prescribe B10 (recomposition) instead of B5 or B9.
    - High protein (2.2g/kg) is mandatory.
    - Fitness focus: resistance training over cardio. B1 + B3 + B8 from Phase 1.

  • "mesomorph":
    - Standard protocol. Apply B6 + appropriate deficit or maintenance based on body fat stage.
    - Fitness: full compound + isolation split from Phase 2.

─── ACNE SUBTYPE (acne_subtype) — DIVERGENT SKINCARE ROUTING ───

  • "nodular_cystic":
    - MUST include S11 (medical referral) in Week 1.
    - DO NOT prescribe S6 (BPO), S5 (BHA), or S7 (retinol) for the affected lesions.
    - Standard barrier support only (S1, S2, S3) until dermatologist clears actives.

  • "inflammatory":
    - MUST prescribe S6 (BPO) from Week 2.
    - Add S8 (low-glycemic diet) from Week 1.
    - DO NOT introduce S5 (BHA) or S7 (retinol) before Week 6 — risk of barrier overload.

  • "comedonal":
    - MUST prescribe S5 (BHA) from Week 2.
    - Add S4 (niacinamide) for tone support.
    - S7 (retinol) can be introduced from Week 5.

  • "none":
    - Standard maintenance: S1, S2, S3, S4 from Week 1.
    - S7 (retinol) from Week 5 for texture and tone optimization.

─── DARK CIRCLE TYPE (dark_circle_type) ───
  • "vascular": Prescribe S10 (caffeine eye cream) + F3 (sodium reduction) + F2 (sleep).
  • "pigmentary": Prescribe S4 (niacinamide) — double-duty: pigmentation + tone. No caffeine cream needed.
  • "none": No periorbital-specific intervention needed.

─── SCOLIOSIS SAFETY FLAG (scoliosis_safety_flag) ───
  • If TRUE: DO NOT prescribe P12 (dead hang) under any circumstances.
    Replace P12 with P10 (wall angels) and P11 (balance training).
    Add mandatory note to posture tasks: "High-load spinal traction contraindicated — consult physiotherapist."

─── BEARD / GROOMING ROUTING (beard_present) ───
  • TRUE: Prescribe G1 (neckline), G6 (heavy stubble at Week 4), G7 (daily check). Skip G9.
  • FALSE: Prescribe G9 (shave optimization). Skip G1, G6.

─── DANDRUFF FLAG (dandruff_flag) ───
  • If TRUE: G4 (ketoconazole) is MANDATORY in Week 1 and takes absolute priority.
    Defer G3 (haircut optimization) to Week 3 minimum — scalp must be treated first.

─── HAIR LOSS FLAG (hair_loss_flag) ───
  • If TRUE: Add G13 (scalp massage) Week 1 and G14 (minoxidil) Week 2.
    Note in task label: long-term commitment required — results at D90+.

─── DENTAL DISCOLORATION FLAG (dental_discoloration_flag) ───
  • If TRUE: Add G5 (tooth whitening strips) in Week 2. One of the highest D14 photo-detectable ROI practices.

─── RESTING EXPRESSION FLAG (resting_expression_flag) ───
  • If TRUE: Add G12 (resting expression awareness) in Week 1. Zero cost, zero risk.

─── TIER CONFIDENCE (tier_confidence) ───
  • If any tier confidence = "low": reduce that tier's protocol weight.
    Example: if posture confidence = low (body side photo was poor), don't over-prescribe posture corrections — the AI had limited visibility.
  • Note low-confidence tiers in the protocol context for the user.

━━━ STEP 2: APPLY QUESTIONNAIRE PERSONALIZATION ━━━

1. TRAINING FREQUENCY
   0 days/week: No gym equipment assumed. Bodyweight + resistance bands only in Phase 1. Introduce gym in Phase 2 if user commits.
   1–2 days/week: Structure 2×/week sessions. Introduce compounds in Phase 2.
   3+ days/week: Full compound + isolation split from Phase 1 Week 3.

2. PRIMARY GOAL (more attractive / more imposing / cleaner look)
   "more attractive": Prioritize face actionables (F1, F2), skin, and grooming quick wins.
   "more imposing": Prioritize shoulder width (B1, B2), neck (note in body tasks), posture.
   "cleaner look": Prioritize skin protocol and grooming precision.

3. SKIN CONCERNS (from questionnaire — cross-reference with acne_subtype flag)
   If user reports acne AND acne_subtype = inflammatory → reinforce S6 urgency in label.
   If user reports dryness → prioritize S9 (ceramide) and S2 before any actives.

━━━ STEP 3: BUILD THE 12-WEEK PROTOCOL ━━━

TASK LABEL RULES:
  • Labels must be SHORT and action-oriented: "Cervical Retraction — 3×10" not a paragraph of instructions.
  • Include sets/reps or duration where applicable.
  • If a task has a constraint (e.g., contraindication, condition), reflect it in the label briefly.
  • No motivational language. No emojis.

PROGRESSIVE PRACTICE INTRODUCTION:
  Weeks 1–2: Foundation only — D1-eligible practices (posture basics, cleanser, SPF, grooming D1 ROI, hydration, sleep).
  Weeks 3–4: Add D7+ practices (niacinamide, BHA or BPO, resistance band work, posture reinforcement).
  Weeks 5–8: Add D14+ practices (compounds, HIIT if applicable, deeper actives, whitening if flagged).
  Weeks 9–12: Add D30+ practices (retinol, heavy stubble maintenance, advanced grooming precision).

PRIORITIZATION LOGIC:
  • Lowest-scoring tiers get the most protocol attention.
  • If tier_posture < 55: front-load P1, P2, P3, P4 in Week 1.
  • If tier_skin < 55: front-load S1, S2, S3 in Week 1; add acne-specific active in Week 2.
  • If tier_grooming < 55: front-load G1 or G9 + G2 + G7 in Week 1.
  • If tier_body < 55: introduce body phenotype-appropriate nutrition in Week 1; fitness in Week 2.

━━━ RULES ━━━
  • Use ONLY practices from the Protocol Library. Do not invent new practices.
  • Every flag listed in the diagnostic must influence at least one protocol decision.
  • Return exactly 12 week objects using the assign_protocol function.
  • Task labels must be specific and concise. No paragraph-length labels.
  • No motivational language.`;

// ─────────────────────────────────────────────────────────────────────────────
// EDGE FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
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
      { global: { headers: { Authorization: authHeader } } },
    );
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

    // Fetch profile, questionnaire, and full diagnostic metadata
    const [profileRes, questionnaireRes, indexRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", user.id).single(),
      supabaseAdmin
        .from("questionnaire_responses")
        .select("responses")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from("index_history")
        .select("metadata")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
    ]);

    const profile = profileRes.data;
    const questionnaire = questionnaireRes.data?.responses;
    const meta = indexRes.data?.metadata ?? {};

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Build the diagnostic context block ──────────────────────────────────
    // All 13 routing flags are passed explicitly so the LLM cannot miss them.
    const tierScores = meta.tier_scores ?? {};
    const tierConfidence = meta.tier_confidence ?? {};

    const diagnosticBlock = `
USER DIAGNOSTIC SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━
Baseline STRION Index : ${profile.current_index ?? "N/A"}
Max Potential (90d)   : ${profile.max_potential ?? "N/A"}

TIER SCORES (0–100):
  Face     : ${tierScores.face ?? "N/A"}  [confidence: ${tierConfidence.face ?? "unknown"}]
  Body     : ${tierScores.body ?? "N/A"}  [confidence: ${tierConfidence.body ?? "unknown"}]
  Posture  : ${tierScores.posture ?? "N/A"}  [confidence: ${tierConfidence.posture ?? "unknown"}]
  Skin     : ${tierScores.skin ?? "N/A"}  [confidence: ${tierConfidence.skin ?? "unknown"}]
  Grooming : ${tierScores.grooming ?? "N/A"}  [confidence: ${tierConfidence.grooming ?? "unknown"}]

CLINICAL OBSERVATIONS:
  Posture notes : ${meta.posture_notes ?? "None recorded"}
  Skin notes    : ${meta.skin_notes ?? "None recorded"}

ROUTING FLAGS — READ ALL BEFORE BUILDING PROTOCOL:
  body_phenotype            : ${meta.body_phenotype ?? "mesomorph"}
  acne_subtype              : ${meta.acne_subtype ?? "none"}
  dark_circle_type          : ${meta.dark_circle_type ?? "none"}
  fitzpatrick_estimate      : ${meta.fitzpatrick_estimate ?? "III-IV"}
  beard_present             : ${meta.beard_present ?? false}
  hair_texture_type         : ${meta.hair_texture_type ?? "straight"}
  hair_loss_flag            : ${meta.hair_loss_flag ?? false}
  dandruff_flag             : ${meta.dandruff_flag ?? false}
  dental_discoloration_flag : ${meta.dental_discoloration_flag ?? false}
  scoliosis_safety_flag     : ${meta.scoliosis_safety_flag ?? false}
  resting_expression_flag   : ${meta.resting_expression_flag ?? false}
  photo_quality_notes       : ${meta.photo_quality_notes ?? ""}
`;

    const userPrompt = `Generate the personalized 12-week STRION protocol for this user.

${diagnosticBlock}

USER QUESTIONNAIRE:
${JSON.stringify(questionnaire, null, 2)}

PROTOCOL LIBRARY:
${PROTOCOL_LIBRARY}

Instructions:
1. Read every routing flag in the diagnostic block.
2. Apply all routing rules from the system prompt exactly.
3. Build the 12-week protocol selecting from the Protocol Library only.
4. Return results using the assign_protocol function.`;

    // ── AI call ──────────────────────────────────────────────────────────────
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
                              label: { type: "string", description: "Short, action-oriented task label" },
                              category: {
                                type: "string",
                                description:
                                  "posture / fitness / nutrition / skincare / grooming / hydration / sleep / lifestyle",
                              },
                              duration: { type: "string", description: "e.g. '10 min', '3×10 reps', 'daily'" },
                              code: { type: "string", description: "Library practice code (e.g. P1, B3, S6)" },
                            },
                            required: ["label", "category", "code"],
                          },
                        },
                        focus_note: {
                          type: "string",
                          description: "One sentence: the primary optimization focus for this week. Clinical tone.",
                        },
                      },
                      required: ["phase", "week", "tasks", "focus_note"],
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
        return new Response(JSON.stringify({ error: status === 429 ? "Rate limited" : "Credits exhausted" }), {
          status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway returned ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const protocol = JSON.parse(toolCall.function.arguments);

    // ── Save to database ─────────────────────────────────────────────────────
    const assignments = protocol.weeks.map(
      (w: {
        phase: string;
        week: number;
        focus_note: string;
        tasks: { label: string; category: string; duration?: string; code: string }[];
      }) => ({
        user_id: user.id,
        phase: w.phase,
        week: w.week,
        tasks: w.tasks,
        focus_note: w.focus_note,
      }),
    );

    const { error: insertError } = await supabaseAdmin.from("protocol_assignments").insert(assignments);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save protocol");
    }

    return new Response(JSON.stringify({ success: true, weeks: protocol.weeks.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-protocol error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
