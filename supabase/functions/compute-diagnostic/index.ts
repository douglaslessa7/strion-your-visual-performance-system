import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DIAGNOSTIC_SYSTEM_PROMPT = `You are the STRION Diagnostic Engine. You analyze male appearance photos to compute the Baseline STRION Index — a structured visual performance score.

━━━ STEP 0: PHOTO QUALITY GATE ━━━

Before scoring, assess photo quality. Flag any significant issues in photo_quality_notes.
  • Head pose: if the face is turned significantly (yaw/pitch/roll), symmetry and jaw readings are affected. Note it.
  • Blur or low sharpness: artificially hides pores and skin texture. Down-weight skin score confidence.
  • Lighting: harsh or dim lighting alters skin tone readings. Note if extreme.
  • Occlusions: glasses, hair over face, beard covering jaw, hands. Note which features are obscured and down-weight those variables.
Do NOT reject photos for minor issues. Flag what's affected and proceed with reduced confidence on those variables.

━━━ SCORING FRAMEWORK ━━━

The Baseline STRION Index is composed of 5 tiers. Score each tier independently from 0–100, then compute the weighted composite.

TIER WEIGHTS (total = 100%):
  Tier 1 — Face:     28%
  Tier 2 — Body:     27%
  Tier 3 — Posture:  20%
  Tier 4 — Skin:     15%
  Tier 5 — Grooming: 10%

━━━ TIER 1 — FACE (from front selfie) ━━━

MACRO PROPORTIONS:
  • Facial thirds (vertical): upper (hairline→brow), middle (brow→nose base), lower (nose→chin). Balanced thirds score higher. Long midface or short chin = penalty.
  • Facial fifths (horizontal): face width ≈ 5× eye width. Ideal interocular distance is ~46% of face width.
  • fWHR: bizygomatic width relative to upper-face height. Wider face with defined cheekbones scores higher.
  • Malar projection: does the midface have good cheekbone volume? An ideal face has convex fullness over the cheekbones (Ogee curve) that dips slightly into the lower midface. Flat or deflated midface = penalty.

SYMMETRY:
  • Global bilateral symmetry: left/right alignment of eyes, ears, jawline, mouth corners.
  • Midline integrity: philtrum, nose tip, chin point, and glabella should align on a single vertical axis.
  • Severe asymmetry thresholds: eye height >2mm difference, mouth corners >3mm = penalty.

JAW, CHIN, AND LOWER FACE:
  • Jaw width and definition: visible mandibular angle?
  • Chin projection: well-projected relative to the vertical facial plane.
  • Submental area: any soft tissue accumulation under the chin (early double chin)?

FACIAL ADIPOSITY VS. EDEMA — CRITICAL DISTINCTION:
  The periorbital region (eyelids) is the proxy for distinguishing fat from fluid retention. Subcutaneous fat does NOT accumulate on eyelids; fluid does.
  • ADIPOSITY pattern: rounded lower face / soft jaw definition + periorbital skin is TAUT, bone contours visible, deep tear troughs → classify as adiposity. Routes to fat loss protocol.
  • EDEMA pattern: rounded lower face + periorbital area is PUFFY, soft, swollen, tissue bulging above/below eye → classify as edema. Routes to sleep/hydration protocol.
  • Note the dominant pattern in skin_notes or posture_notes.

PERIORBITAL:
  • Canthal tilt: outer eye corners should sit HIGHER than inner corners (positive tilt = ideal). Flat or negative tilt = penalty. Note qualitative severity.
  • Dark circles: chromatic shift (blue/purple = vascular/hollow origin; brown/tan = pigmentary origin; absent = none). Set dark_circle_type accordingly — the protocol routes to different actives for each.
  • Periorbital puffiness: swelling above or below eyes.

NOSE:
  • Tip projection: well-projected or bulbous/flat?
  • Dorsal profile (from side photo): straight, slight hump, or pronounced hump?
  • Nostril symmetry: visible asymmetry?
  • Nasal vestibule: visible protruding nasal hair below the alar rim (nostrils) in the front photo = hard grooming penalty. Flag in grooming notes.

RESTING EXPRESSION AND MOUTH:
  • Mouth corners at rest: neutral/horizontal, or visibly turned downward? Downturned corners at rest (DAO tension) are a significant negative perception cue. Set resting_expression_flag = true if clearly downturned.
  • Upper-to-lower lip ratio: balanced or significantly disproportionate?
  • Lip surface quality: visible chapping, flaking, or cracking?

━━━ TIER 2 — BODY (from front body + side body) ━━━

SILHOUETTE RATIOS:
  • Shoulder-to-Waist Ratio (SWR): biacromial width ÷ waist width. Ideal ~1.6. Classic V-taper. Primary visual target.
  • Waist-to-Chest Ratio (WCR): waist ÷ chest width. Ideal 0.70–0.75. Strongest predictor of perceived male attractiveness.
  • Waist-to-Hip Ratio (WHR): waist ÷ hip width. Ideal male ~0.90. WHR significantly above 0.90 signals central adiposity → prioritize systemic deficit before hypertrophy.

MUSCLE DEVELOPMENT (region by region):
  • Deltoids: lateral cap roundness — highest ROI for V-taper perception.
  • Chest: upper vs. lower fullness.
  • Arms: biceps/triceps fullness, forearm thickness.
  • Lats: visible width and flare in frontal photo.
  • Traps and rear deltoids: if back photo available.

BODY FAT STAGING (categorical — do not give a precise % number):
  Stage 1 (<8%): very visible striations, vascularity throughout.
  Stage 2 (8–12%): defined abs, clear muscle separation.
  Stage 3 (12–15%): abs visible in good light, early upper-body definition.
  Stage 4 (15–20%): soft appearance, no clear abdominal definition.
  Stage 5 (20–25%): significant softness, loss of silhouette.
  Stage 6 (>25%): prominent adiposity, high WHR likely.

ABDOMINAL SAGITTAL ASSESSMENT (from side photo):
  • Does the abdomen protrude forward significantly?
  • Low frontal definition + high sagittal protrusion → standard adiposity (caloric deficit route).
  • Relatively intact frontal definition + notable sagittal protrusion → possible visceral fat or TrA (transversus abdominis) weakness. Flag in posture_notes for vacuum/core protocol.
  • Low frontal definition + low sagittal protrusion → under-muscled/skinny-fat phenotype.

NECK:
  • Cervical width relative to jawline: neck width approximately equal to jaw width = strong formidability signal. Thin neck relative to jaw = notable penalty on body score.

BODY PHENOTYPE CLASSIFICATION — CRITICAL ROUTING GATE:
  Before scoring, classify the user's structural phenotype. This is the single most important routing gate for the protocol — a wrong prescription here causes clinical errors.
  • "ectomorph": narrow frame, low muscle mass, low body fat, thin limbs, low WHR. Protocol must NOT prescribe caloric deficit — routes to surplus + hypertrophy.
  • "mesomorph": visible muscle development, proportionate frame, moderate body fat. Standard protocol applies.
  • "endomorph": wide frame, high body fat (Stage 4+), high WHR, soft tissue dominance. Protocol must prioritize systemic deficit and cardiovascular output BEFORE hypertrophy.
  • "skinny_fat": low muscle development + moderate-to-high body fat, low sagittal protrusion (see abdominal assessment). Recomposition protocol — neither pure deficit nor pure surplus.
  Set body_phenotype accordingly.

━━━ TIER 3 — POSTURE (from side body + back/posterior if available) ━━━

SAFETY GATE — CHECK FIRST:
  On the posterior/back photo (if available), scan for: significant spinal curvature (C or S deviation), marked shoulder height asymmetry (one shoulder visibly higher >1.5cm), pelvic obliquity (one hip clearly higher). If two or more of these are strongly present → set scoliosis_safety_flag = true. This does NOT lower the posture score on its own but blocks heavy spinal loading in the protocol generator.

FORWARD HEAD POSTURE (CVA):
  • From the side photo: is the ear positioned anterior to the shoulder center?
  • Classify severity: None / Mild (ear ~1cm forward) / Moderate (3–5cm) / Severe (>5cm).
  • Score conservatively — most new users have at least mild FHP.

SHOULDER PROTRACTION (RSP):
  • Do the shoulders roll significantly forward from the spine?
  • Classify: Aligned / Mild / Moderate / Severe protraction.
  • Severe shoulder protraction reduces perceived upper-body width regardless of muscle development.

LATERAL HEAD TILT:
  • From the front photo: is the head tilted to one side? A tilt exceeding ~3° from vertical is significant. Note in posture_notes if present.

THORACIC KYPHOSIS:
  • Upper-back rounding from the side view. Classify severity (None / Mild / Moderate / Severe).

ANTERIOR PELVIC TILT:
  • From side profile: excessive lumbar arch with forward-tilting pelvis and glute prominence?

OVERALL VERTICAL ALIGNMENT:
  • Ear → shoulder → hip → ankle alignment from side view. How close to vertical?

━━━ TIER 4 — SKIN (from front selfie) ━━━

FITZPATRICK CALIBRATION GATE — ASSESS FIRST:
  Estimate skin tone range: I-II (very light/light) / III-IV (medium/olive) / V-VI (dark/very dark).
  Set fitzpatrick_estimate accordingly.
  IMPORTANT: For Fitzpatrick V-VI, do NOT penalize for visible facial redness or erythema — melanin density at this level masks hemoglobin signal. Focus evaluation on texture, acne lesion count, and PIH instead.

TONE AND UNIFORMITY:
  • Skin tone consistency across the face.
  • Visible PIH (post-inflammatory hyperpigmentation): dark spots from past acne.
  • Visible erythema/redness: note location and extent (Fitzpatrick I-IV only).

ACNE SUBTYPE CLASSIFICATION — CRITICAL (routes to divergent protocols):
  Classify the DOMINANT lesion type visible and set acne_subtype:
  • "nodular_cystic": any lesion visibly >10mm, or multiple deeply inflamed clusters that distort facial geometry → TRIGGERS MEDICAL REFERRAL in protocol. Do not recommend OTC actives for these lesions.
  • "inflammatory": papules (raised bumps with surrounding redness) or pustules (yellow/white center with red surround). Routes to Benzoyl Peroxide and/or Azelaic Acid.
  • "comedonal": blackheads or whiteheads WITHOUT visible surrounding redness. Routes to Salicylic Acid and AHA exfoliants.
  • "none": no significant active acne. Standard maintenance protocol.
  If both comedonal and inflammatory are present, classify as "inflammatory" (the higher-priority intervention).

TEXTURE:
  • Surface roughness, enlarged pore visibility, skin smoothness.
  • Atrophic (pitted) scarring: note if present — these are permanent, flag separately from active acne.

OILINESS:
  • Visible shine on T-zone (forehead, nose, chin) in photo?

BARRIER INTEGRITY:
  • Visible flaking, dehydration lines, or extreme dryness?

━━━ TIER 5 — GROOMING (from front selfie) ━━━

SCORING PRINCIPLE: Score the QUALITY OF EXECUTION of the current grooming style — NOT the presence or absence of a beard.
  • Well-executed clean shave = high
  • Well-maintained, intentional beard = high
  • Patchy, inconsistent, or neglected facial hair = low
  • Unkempt, undefined neckline, unintentional half-grown look = low

BEARD:
  • Is facial hair present? Set beard_present = true or false.
  • If present: density (patchy vs. full), neckline precision (defined or undefined), length category, overall intentionality.

HAIR:
  • Hairline position: any visible M-shaped recession or significant crown thinning? → set hair_loss_flag = true if Norwood 2+ pattern is detectable.
  • Hair texture type: straight / wavy / curly / coily. Set hair_texture_type accordingly. This affects how haircut recommendations are verbalized (for curly/coily, visible length ≠ actual length after shrinkage).
  • Scalp pathology: visible dandruff or flakes on hair roots, scalp, or dark clothing on shoulders? → set dandruff_flag = true. Ketoconazole protocol takes absolute priority over any haircut recommendation.
  • Overall style: intentional and proportionate to face shape, or unkempt?

EYEBROWS:
  • Groomed or unkempt?
  • Visible unibrow or glabellar hair present?
  • Asymmetry: >3mm height difference between brows is consciously perceptible — note if severe.

HYGIENE FLAGS (binary — these are hard penalties):
  • Nasal hair: visible protruding hair below the alar rim (nostrils) in the frontal photo = fail. Note in grooming notes.
  • Ear hair: visible terminal hair on tragus or helix in the side photo = fail. Note in grooming notes.

DENTAL (only if smile is visible in photo):
  • Assess tooth color. Significant yellowing or discoloration → set dental_discoloration_flag = true.
  • Lighting correction: if both the whites of the eyes AND the teeth appear similarly yellow-tinted, this is likely a white-balance issue — do NOT penalize dental score.

LIPS:
  • Visible chapping, flaking, or cracking of the lip surface? Note if severe.

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
  • Face: low ceiling (mostly fixed genetics — averageness, fWHR, skeletal structure)
  • Typical range: 80–92. Do not exceed 92.

━━━ OPPORTUNITIES ━━━

Exactly 3 highest-ROI improvement opportunities. Be clinical and specific:
  Not: "improve fitness"
  Yes: "Moderate shoulder protraction detected — scapular retraction and rhomboid activation would significantly alter perceived upper-body width in photos."
  Yes: "Inflammatory acne (ACL-I) on mid-cheek region — targeted BPO intervention estimated to reduce visible lesion count 50–80% within 90 days."

━━━ RULES ━━━
  • Analyze ONLY the photos. Do not use questionnaire data.
  • Be analytical and precise. No motivational language. No emojis.
  • Score conservatively. When in doubt, score lower rather than higher.
  • When a photo is occluded or low quality for a specific variable, note uncertainty in photo_quality_notes rather than inventing data.
  • Do NOT claim exact millimeter measurements or pixel calculations — observe and classify qualitatively.
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
      { field: "selfie_front_url", label: "Front selfie (face, skin, grooming analysis)" },
      { field: "selfie_side_url", label: "Side selfie (CVA, canthal tilt, profile)" },
      { field: "body_front_url", label: "Front body (V-taper, WCR, SWR, WHR, muscle development)" },
      { field: "body_side_url", label: "Side body (posture, thoracic alignment, abdominal SAD)" },
    ];

    for (const { field, label } of urlFields) {
      const path = (photoSet as Record<string, unknown>)[field] as string | null;
      if (path) {
        const { data } = await supabaseAdmin.storage.from("user-photos").createSignedUrl(path, 300);
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
        text: `Analyze the following ${photoUrls.length} photos and compute the Baseline STRION Index.\n\nPhotos:\n${photoUrls.map((p) => `- ${p.label}`).join("\n")}\n\nApply the full 5-tier scoring framework including all classification gates. Return results using the compute_diagnostic function.`,
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
              description: "Return the computed STRION Baseline diagnostic with full tier breakdown and routing flags.",
              parameters: {
                type: "object",
                properties: {
                  // ── Tier scores ──────────────────────────────────────────────
                  tier_face: { type: "number", description: "Tier 1 Face score (0–100)" },
                  tier_body: { type: "number", description: "Tier 2 Body score (0–100)" },
                  tier_posture: { type: "number", description: "Tier 3 Posture score (0–100)" },
                  tier_skin: { type: "number", description: "Tier 4 Skin score (0–100)" },
                  tier_grooming: { type: "number", description: "Tier 5 Grooming score (0–100)" },

                  // ── Composite ────────────────────────────────────────────────
                  index_value: { type: "number", description: "Baseline STRION Index — weighted composite" },
                  max_potential: { type: "number", description: "Realistic max achievable in 90 days (80–92 ceiling)" },
                  projected_min: { type: "number", description: "Conservative 90-day projection" },
                  projected_max: { type: "number", description: "Optimistic 90-day projection" },

                  // ── Qualitative observations ─────────────────────────────────
                  opportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 specific, clinical, high-ROI improvement opportunities",
                  },
                  posture_notes: {
                    type: "string",
                    description:
                      "Clinical posture observations: CVA severity, shoulder protraction level, lateral tilt, kyphosis, pelvic tilt, abdominal protrusion pattern",
                  },
                  skin_notes: {
                    type: "string",
                    description:
                      "Clinical skin observations: acne lesion distribution, PIH extent, texture condition, oiliness, barrier state, adiposity vs edema pattern",
                  },

                  // ── Protocol routing flags (NEW) ─────────────────────────────
                  acne_subtype: {
                    type: "string",
                    enum: ["none", "comedonal", "inflammatory", "nodular_cystic"],
                    description:
                      "Dominant acne lesion classification. Drives divergent skincare protocol routing: comedonal→BHA/AHA, inflammatory→BPO/Azelaic Acid, nodular_cystic→medical referral block",
                  },
                  beard_present: {
                    type: "boolean",
                    description:
                      "True if significant facial hair is present. Routes beard vs clean-shave grooming protocol.",
                  },
                  fitzpatrick_estimate: {
                    type: "string",
                    enum: ["I-II", "III-IV", "V-VI"],
                    description:
                      "Estimated Fitzpatrick skin tone range. Calibrates skin scoring — blocks erythema penalty for V-VI.",
                  },
                  hair_loss_flag: {
                    type: "boolean",
                    description:
                      "True if Norwood 2+ recession or visible crown thinning detected. Activates scalp/hair loss intervention protocol.",
                  },
                  dental_discoloration_flag: {
                    type: "boolean",
                    description:
                      "True if significant tooth discoloration is visible when smiling. Activates tooth whitening protocol.",
                  },
                  scoliosis_safety_flag: {
                    type: "boolean",
                    description:
                      "True if structural spinal asymmetry is detected (spinal curvature, shoulder height asymmetry, pelvic obliquity). Blocks heavy spinal loading practices in protocol.",
                  },
                  photo_quality_notes: {
                    type: "string",
                    description:
                      "Any quality issues detected: blur, occlusions, pose angle, extreme lighting. Empty string if photos are adequate.",
                  },

                  // ── Additional routing flags ──────────────────────────────────
                  body_phenotype: {
                    type: "string",
                    enum: ["ectomorph", "mesomorph", "endomorph", "skinny_fat"],
                    description:
                      "Structural phenotype classification. Critical routing gate: ectomorph→surplus+hypertrophy, endomorph→deficit+cardio first, skinny_fat→recomposition, mesomorph→standard.",
                  },
                  dark_circle_type: {
                    type: "string",
                    enum: ["none", "vascular", "pigmentary"],
                    description:
                      "Dark circle etiology from chromatic shift: vascular (blue/purple)→caffeine/sleep protocol, pigmentary (brown/tan)→niacinamide protocol, none→no intervention.",
                  },
                  hair_texture_type: {
                    type: "string",
                    enum: ["straight", "wavy", "curly", "coily"],
                    description:
                      "Hair morphology classification. Affects haircut prescription verbalization — curly/coily requires shrinkage-factor note to barber instructions.",
                  },
                  dandruff_flag: {
                    type: "boolean",
                    description:
                      "True if visible dandruff or scalp flaking detected. Activates ketoconazole protocol as absolute priority before any haircut recommendation.",
                  },
                  resting_expression_flag: {
                    type: "boolean",
                    description:
                      "True if mouth corners are visibly downturned at rest (DAO tension). Activates resting expression awareness protocol.",
                  },
                  tier_confidence: {
                    type: "object",
                    description:
                      "Confidence level (high/medium/low) for each tier score based on photo quality and occlusions.",
                    properties: {
                      face: { type: "string", enum: ["high", "medium", "low"] },
                      body: { type: "string", enum: ["high", "medium", "low"] },
                      posture: { type: "string", enum: ["high", "medium", "low"] },
                      skin: { type: "string", enum: ["high", "medium", "low"] },
                      grooming: { type: "string", enum: ["high", "medium", "low"] },
                    },
                    required: ["face", "body", "posture", "skin", "grooming"],
                  },
                },
                required: [
                  "tier_face",
                  "tier_body",
                  "tier_posture",
                  "tier_skin",
                  "tier_grooming",
                  "index_value",
                  "max_potential",
                  "projected_min",
                  "projected_max",
                  "opportunities",
                  "posture_notes",
                  "skin_notes",
                  "acne_subtype",
                  "beard_present",
                  "fitzpatrick_estimate",
                  "hair_loss_flag",
                  "dental_discoloration_flag",
                  "scoliosis_safety_flag",
                  "photo_quality_notes",
                  "body_phenotype",
                  "dark_circle_type",
                  "hair_texture_type",
                  "dandruff_flag",
                  "resting_expression_flag",
                  "tier_confidence",
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
      if (status === 429)
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      throw new Error(`AI gateway returned ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const diagnostic = JSON.parse(toolCall.function.arguments);

    // Save to index_history with full tier breakdown and routing flags
    await supabaseAdmin.from("index_history").insert({
      user_id: user.id,
      index_value: diagnostic.index_value,
      execution_component: 0,
      visual_component: Math.round(
        diagnostic.tier_face * 0.28 + diagnostic.tier_body * 0.27 + diagnostic.tier_posture * 0.2,
      ),
      structural_component: Math.round(diagnostic.tier_skin * 0.15 + diagnostic.tier_grooming * 0.1),
      metadata: {
        source: "initial_diagnostic",
        photo_set_id: photoSetId,
        tier_scores: {
          face: diagnostic.tier_face,
          body: diagnostic.tier_body,
          posture: diagnostic.tier_posture,
          skin: diagnostic.tier_skin,
          grooming: diagnostic.tier_grooming,
        },
        // Clinical notes
        posture_notes: diagnostic.posture_notes,
        skin_notes: diagnostic.skin_notes,
        // Protocol routing flags — read by generate-protocol
        acne_subtype: diagnostic.acne_subtype,
        beard_present: diagnostic.beard_present,
        fitzpatrick_estimate: diagnostic.fitzpatrick_estimate,
        hair_loss_flag: diagnostic.hair_loss_flag,
        dental_discoloration_flag: diagnostic.dental_discoloration_flag,
        scoliosis_safety_flag: diagnostic.scoliosis_safety_flag,
        photo_quality_notes: diagnostic.photo_quality_notes,
        body_phenotype: diagnostic.body_phenotype,
        dark_circle_type: diagnostic.dark_circle_type,
        hair_texture_type: diagnostic.hair_texture_type,
        dandruff_flag: diagnostic.dandruff_flag,
        resting_expression_flag: diagnostic.resting_expression_flag,
        tier_confidence: diagnostic.tier_confidence,
      },
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
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
