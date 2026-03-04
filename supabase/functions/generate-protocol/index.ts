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
P1.  Cervical Retraction (CCFT approach) — 3×10 reps daily. Selectively activates deep cervical flexors (longus colli/capitis) while inhibiting SCM and anterior scalene. Home protocol: supine, small towel roll under cervical spine, gentle chin nod (craniovertebral flexion ONLY — NOT neck flexion), hold 10 sec. ⚠️ If SCM contracts visibly: regress to wall chin retraction. Level A evidence: +4.8° CVA at 6 weeks (Im 2015); +6.1° CVA at 10 weeks (Javanshir 2011). Also a cross-tier Face intervention: repositions mandible anteriorly and stretches submental soft tissue — prescribe even if posture tier is adequate when tier_face is low. Category: posture. Intro: Week 1.
P2.  Wall Posture Drill — Stand heels/glutes/shoulders/head touching wall, 2 min hold. Full-chain postural re-education. Category: posture. Intro: Week 1.
P3.  Deep Neck Flexor Strengthening — Chin tuck holds 3×10 sec. Stabilizes CVA correction. Cross-tier Face: stabilizes mandible positioning for improved jaw-neck angle. ⚠️ Best as standalone session or post-workout — not compatible with pre-fatigue for heavy cervical loading. Category: posture. Intro: Week 1.
P4.  Thoracic Foam Rolling — 2 min on thoracic spine (T6–T12), 10 extensions over roller. ⚠️ ALWAYS perform BEFORE P5 (thoracic extension) and before any upper-body pressing. Functions as pre-exercise facilitator: +2.7° additional kyphosis benefit vs. extension training alone (Mousavi 2019). ⚠️ No evidence for standalone sustained correction — facilitator only. Category: posture. Intro: Week 1.
P5.  Thoracic Extension Strengthening — Prone thoracic extension: arms at sides, lift chest, 3×10, hold 3 sec. Directly improves side-profile and chest-open appearance. Level A evidence (Katzman 2017 SHEAF RCT, N=99): −3.0° Cobb between groups at 6 months; appearance satisfaction also improved — only study in Tier 3 documenting photo-relevant psychosocial benefit. Elpeze 2022 CCEP (young males): −8.93° at 12 weeks with combined postural awareness training. ⚠️ Perform P14 (diaphragmatic breathing — 5 breaths) immediately before each set for additional −2.6° benefit (Rashed 2024). ⚠️ When kyphosis is present alongside CVA (FHP): this practice takes Phase 1 priority over P1/P3 — thoracic correction must precede cervical work. Category: posture. Intro: Week 1.
P6.  Band Pull-Aparts + Face Pulls — 3×15. Strengthens middle trapezius and rhomboids to counteract anterior dominance. Bayattork 2024 meta-analysis (20 studies, 774 participants): significant RSP reduction across all formats. Use as pre-activation before lat pulldowns and rows — reduces upper trap compensation during pull exercises. Face pull variant (rope attachment, elbows high): 3×15 for combined RSP + external rotation. Category: posture. Intro: Week 2.
P7.  Scapular Wall Slides — 3×10. Shoulder blade alignment and serratus activation. Excellent as pre-workout warm-up before bench press, overhead press, or shoulder development. Category: posture. Intro: Week 3.
P8.  Ergonomic + CPC Habit Protocol — Universal non-negotiable (60/40 Rule: 60–70% of postural improvement is driven by ergonomic habituation; 30–40% by exercise). Mandatory in every protocol regardless of other practices. TWO components: (A) ERGONOMIC CORRECTION: (1) monitor top at eye level, arm's length; (2) 90/90/90 rule — hips/knees/elbows; (3) movement break every 30 min (2–3 min cervical retraction + thoracic extension); (4) phone at eye level; (5) optimal pillow height ~10 cm; (6) avoid stomach sleeping. (B) CONSCIOUS POSTURAL CORRECTION (CPC): set phone alarm every 60 min; perform 5-step postural check (chin retraction, shoulders back, chest open, lumbar neutral, weight through heels), hold 30 sec. Mechanism: postural deviation is maintained by disrupted proprioception — the brain's "neutral" reference has shifted toward the deviated position; CPC resets this proprioceptive reference through deliberate, frequent cuing. Argyrou 2025: +5.5° CVA improvement at 6 weeks — the largest single-intervention CVA effect in the Tier 3 literature, larger than CCFT (P1). ⚠️ POSTURAL VARIATION PRINCIPLE: the goal is variation, microbreaks, and movement — NOT sustained static "perfect posture." Sustained upright holding increases fatigue and MSK discomfort. Cue "tall and relaxed," not "military chest out." Level A evidence (Shariat 2019): 40–60% MSK pain reduction at 8 weeks. Without this, exercise adaptations are overwhelmed by 8–12h of daily maladaptive loading. Category: posture. Intro: Week 1.
P9.  Stomach Vacuum — Transversus abdominis activation, 3×20 sec hold. Reduces abdominal protrusion from TrA weakness. 2.5–5.0 cm resting waist reduction in 5–8 weeks (neuromuscular mechanism — not fat loss). ⚠️ INEFFECTIVE if BF > 20% — adipose layer physically prevents visible effect. Introduce Week 5+ only for users with established fat loss trajectory. ⚠️ MAINTENANCE-DEPENDENT: effect is entirely neuromuscular — resting waist reduction reverses when practice is abandoned. Communicate this to user so they do not interpret discontinuation regression as protocol failure. Category: posture. Intro: Week 5.
P10. Wall Angels / Wall Slide — 3×10 slow reps against wall. Simultaneously requires thoracic extension, scapular retraction/depression, and shoulder external rotation. Wall provides tactile feedback preventing compensation. Kim T-H 2016 (RCT, N=22 men): +1.82° scapular alignment improvement in 4 weeks. Excellent pre-workout warm-up before bench press and overhead press. ⚠️ Advance to next level only when full wall contact is maintained throughout. Category: posture. Intro: Week 3.
P11. Balance / Proprioceptive Training — Single-leg stance 3×30 sec/side. Resets vestibular neutral — corrects lateral head tilt and shoulder asymmetry. Gebauer 2025: 20–30% reduction in postural asymmetry at 8 weeks. Integrates naturally with single-leg gym exercises (Bulgarian split squat, single-leg RDL). Category: posture. Intro: Week 2.
P12. Dead Hang — 3×30 sec. Spinal decompression, thoracic opening. ⚠️ ABSOLUTE CONTRAINDICATION if scoliosis_safety_flag = true. ⚠️ Evidence is Level C (Akçay 2024, single study). No RCTs demonstrate improvement in STRION photographic variables (CVA, RSP, kyphosis) with predictable magnitude. Treat as spinal decompression adjunct ONLY — NOT as primary corrective intervention. Conservative messaging required: "Decompression benefit; not a postural correction tool." Prescribe only for healthy spines, Weeks 4+. Category: posture. Intro: Week 4.
P13. Pec Minor / Anterior Chain Stretch — Doorway stretch: elbow at 90° on door frame, step forward until stretch in anterior shoulder, hold 60 sec/side, 3 sets. Addresses RSP flexibility component — ⚠️ RSP FULL STACK: P13 alone produces incomplete RSP correction. MUST pair with P6 (scapular retraction strength) and B4 (seated cable row — mid-back thickness). Wang 2021 systematic review: pec minor stretch reduces RSP only when combined with scapular stabilization training. Prescribe all three components whenever RSP is the primary variable. Lee 2015 (RCT): −3.7° shoulder protraction angle + 1.2 cm pec minor length at 4 weeks. Post-stretch activation: immediately perform 3×10 prone I exercise after stretching to potentiate length adaptation. ⚠️ DO NOT perform immediately before heavy pressing — schedule post-workout or in a separate session to avoid acute performance reduction. Category: posture. Intro: Week 2.
P14. Diaphragmatic Breathing — One hand on chest, one on abdomen; inhale through nose so belly rises and chest stays still; 5 min daily. Perform 5 breaths immediately before each thoracic extension set (P5) and before CCFT sets (P1) — produces additional −2.6° kyphosis reduction vs. extension alone (Rashed 2024). Suppresses SCM/scalene dominance. Improves intra-abdominal pressure for spinal loading in gym sessions. Level B evidence. Also prescribed 5 breaths pre-workout to reduce accessory muscle recruitment and improve IAP. Category: posture. Intro: Week 1.
P15. APT Protocol — Hip Flexor Stretch + Glute Activation: Half-kneeling lunge, posterior pelvic tilt FIRST (flatten lumbar before shifting forward), hold 60–90 sec/side, 3 sets. Immediately followed by: supine glute bridge 3×15 with 2-sec hold, cue "flatten low back throughout." Progresses to single-leg glute bridge 3×10/side in Phase 2. ⚠️ APT HONEST CEILING — MANDATORY MESSAGING: Levine 1997 (RCT, N=40, 8 weeks) showed ~0° sustained APT change with abdominal + stretching. Kang 2016 showed −4.2° with glute-specific protocol. Realistic 90-day outcome: 0–4°, high variability. DO NOT promise APT correction as a primary outcome. Task label must reflect: "Protocol targets hip flexor flexibility and glute activation — measurable pelvic angle change in 90 days is possible but not guaranteed." Level B/C (conflicting evidence). Category: posture. Intro: Week 3.

─── TIER 2: BODY ───
B1.  Lateral Deltoid Raises — 5 sets × 16RM load, to momentary concentric failure per set, 2×/week, neutral humerus rotation (thumb parallel to floor). Neutral rotation maximizes medial deltoid activation (ES=1.47 vs other orientations). #1 muscle group for male bodily attractiveness. Cable vs dumbbell: equivalent — choose freely. Increase load when all reps completed without approaching failure. Category: fitness. Intro: Week 2.
B2.  Overhead Press — 4×8. Shoulder mass and cap roundness. Category: fitness. Intro: Week 2.
B3.  Pull-ups / Lat Pulldowns — 4×8, medium-wide pronated grip (1.5× biacromial). Cue: "pull elbows to hips." Pronated > supinated for lat activation. Lat growth physically pushes arms laterally outward, amplifying perceived shoulder width beyond actual deltoid size. ⚠️ Genetic ceiling — lat insertion point is fixed and determines aesthetic outcome: high insertion (axilla) produces front-facing width; low insertion (lower back) produces "bat wing" visible from behind. Training cannot change insertion. If user trains lats consistently but sees no frontal width change: communicate this ceiling. Category: fitness. Intro: Week 2.
B4.  Seated Cable Row — 4×10. Mid-back thickness, scapular retraction reinforcement. Category: fitness. Intro: Week 3.
B5.  Caloric Deficit Protocol — 300–500 kcal/day deficit, 0.7% BW/week loss rate. ⚠️ DO NOT prescribe for ectomorph. Dual-tier: also the highest-ROI Face intervention — facial adiposity is the primary predictor of male facial attractiveness (r=0.71). Communicate this cross-tier role explicitly in the protocol. Category: nutrition. Intro: Week 1.
B6.  Protein Target — 2.0–2.4 g/kg/day during any deficit; 1.6–2.2 g/kg/day for maintenance/surplus. Distribute across 4 evenly spaced meals of ~30–40g each — even distribution produces 25% higher MPS vs skewed distribution at same total intake. Category: nutrition. Intro: Week 1.
B7.  HIIT Cardio — 20–30 min sessions, 3×/week, 85–95% HRmax intervals. Time-efficient aerobic alternative equivalent to LISS at matched energy expenditure. ⚠️ DO NOT prescribe for ectomorph. Concurrent training rules: (1) RT before cardio same day; (2) separate by ≥6h when possible; (3) prefer cycling over running — running causes more lower-body hypertrophy interference than cycling; (4) upper-body hypertrophy is essentially unaffected by concurrent lower-body cardio. Category: fitness. Intro: Week 3.
B8.  Compound Lift Foundation — Bench press, Squat, Deadlift 2×/week. Overall mass and structural development. Category: fitness. Intro: Week 3.
B9.  Caloric Surplus Protocol — 250–400 kcal/day above maintenance. ⚠️ ONLY for ectomorph. Category: nutrition. Intro: Week 1.
B10. Body Recomposition — Maintenance calories + protein 2.2g/kg. ⚠️ ONLY for skinny_fat. Category: nutrition. Intro: Week 1.
B11. Sleep Optimization (Deficit Context) — 8.5h nightly target, consistent schedule. Sleep restriction at same caloric intake shifts weight loss composition from 56% fat to only 25% fat. Sleep restriction also directly expands visceral fat independent of diet. Treat as non-negotiable during any cut phase. Category: sleep. Intro: Week 1.
B12. Triceps Overhead Extension — 5×10 at 70% 1RM, 2×/week. Trains long head in lengthened position. Long head = 60% of upper arm mass. +28.5% long head volume in 12 weeks — largest single muscle hypertrophy effect in Tier 2. Substitute with skull crushers if overhead shoulder/elbow pain occurs. Category: fitness. Intro: Week 2.
B13. Incline Bench Press (30–43°) — 3–4×6–10 at 75–80% 1RM, 2–3×/week. Targets clavicular (upper) pectoralis. ⚠️ Critical angle: above 43°, activation shifts entirely to anterior deltoid — do not exceed. +17–18% clavicular thickness in 12 weeks (untrained). Category: fitness. Intro: Week 2.
B14. Pre-Sleep Casein — 30–40g casein protein 30–60 min before sleep. Extends MPS window overnight (~22% increase in overnight MPS). ⚠️ Only an optimizer — effective only if daily protein total already meets minimum target. Category: nutrition. Intro: Week 3.
B15. Creatine Monohydrate — 3–5g/day (no loading required). +1.1 kg lean mass + −0.73 kg fat mass vs training alone over 12 weeks. Initial weight gain of +1–2 kg is intracellular water only — muscles appear denser, not puffy. ⚠️ Educate user: initial scale increase is NOT fat. ⚠️ Delay to Week 5+ for Profile A users in active cut where daily weight tracking is primary feedback. Category: nutrition. Intro: Week 1.
B16. Neck Training — 3×10–15 reps: neck extension + neck flexion + lateral flexion each side, 2–3×/week. +13–25% neck CSA in 12 weeks. ⚠️ CRITICAL: compound lifts (deadlifts, rows, squats, push press) produce ZERO measurable neck hypertrophy — direct training is the only pathway. Begin at bodyweight only (cervical injury risk — progress slowly). Category: fitness. Intro: Week 2.
B17. LISS Aerobic — 150–300 min/week at 60–75% HRmax. Dose-response: −0.56 cm waist circumference per additional 30 min/week. At 150 min/week over 12 weeks: ~2.8 cm waist reduction without dietary changes. At 300 min/week: ~5.6 cm. All modalities equivalent: walking, cycling, elliptical, rowing. Primary aerobic prescription for fat loss; B7 (HIIT) is the time-efficient alternative. Category: fitness. Intro: Week 1.
B18. Localized Blood Flow Protocol — 27 min treadmill at 70% HRmax → immediately (within 5 min): 4×4 min torso rotations → 5 min rest → 4×4 min crunches. ~697g additional trunk fat lost vs aerobic alone over the protocol. ⚠️ ONLY within a systemic caloric deficit — entirely ineffective as standalone. ⚠️ BF must be below 20%. ⚠️ Do NOT prescribe for ectomorph. Frequency: 4×/week. Category: fitness. Intro: Week 5.
B19. Biceps Hypertrophy (Incline Dumbbell Curl) — 3–4×8–15 at 65–80% 1RM, 2–3×/week. Incline angle 45–60° places biceps in lengthened (shoulder-extended) position throughout movement — applies same lengthened-position principle as B12. Biceps = 40% of upper arm mass. ⚠️ HIERARCHY RULE: always prescribe B12 (triceps) before B19 when training volume is limited — triceps = 60% of upper arm mass and produces larger absolute hypertrophy. B19 is a secondary addition once B12 is established. Alternative: standing cable curl. Category: fitness. Intro: Week 3.

─── TIER 1 ACTIONABLE: FACE ───
F1.  Hydration Target — 2.5–3L water daily. Reduces facial puffiness and dark circles. Category: hydration. Intro: Week 1.
F2.  Sleep Optimization — 7–8h sleep. Reduces periocular puffiness and edema. Fastest win D1–D7. Even 2 nights of partial restriction (4h) measurably decreases attractiveness ratings. Category: sleep. Intro: Week 1.
F3.  Sodium Reduction — Limit processed food sodium (≤2,300 mg/day). Reduces interstitial fluid retention / facial edema. ⚠️ ONLY if dark_circle_type = vascular or edema pattern detected. Category: nutrition. Intro: Week 1.
F4.  Alcohol Reduction — Limit to ≤4 drinks/week. Twin-controlled evidence (p = 0.0002) for facial aging reduction — associated with 7 of 11 facial aging features regardless of edema pattern. ⚠️ Include for any user who reports alcohol consumption in questionnaire. Category: lifestyle. Intro: Week 1.
F5.  Zygomatic Resistance Training — "Happy Cheeks Sculpting": smile without teeth, force lips together, contract cheeks upward, 3×10 reps × 20s isometric hold. Targets zygomaticus major hypertrophy (+6–8% CSA at 8 weeks). ⚠️ MANDATORY START WEEK 5 MINIMUM — prescribing before visible facial fat reduction causes chipmunk widening effect. Only meaningful if BF appears below 20%. Category: face. Intro: Week 5.
F6.  Corrective Oral Posture — Tongue flat against palate, lips sealed, nasal breathing. Suprahyoid muscle activation tightens submental contour. Continuous habit (not timed exercise). Immediate visual improvement in jaw-neck angle; cumulative resting tone at 4–8 weeks. ⚠️ Skeletal mewing claims (bone/palate expansion) are pseudoscience — benefit is soft-tissue and postural only. Category: face. Intro: Week 1.
F7.  Orbicularis Oculi Training — Lower eyelid isometric hold 3×10 reps × 10s each. Reduces inferior scleral show → appearance of more positive canthal tilt. Pair with cold water rinse for periorbital lymphatic drainage. ⚠️ ONLY if canthal tilt concern noted. MANDATORY ceiling note: "Structural canthal tilt is determined by bone and tendon — this practice improves appearance only, not structural angle." Category: face. Intro: Week 1.
F8.  Bilateral Masticatory Habituation — Consciously distribute chewing bilaterally during all meals (alternate 3 chews left / 3 right). Reduces asymmetric masseteric hypertrophy. 92.1% of people have wider hemiface on dominant chewing side. ⚠️ ONLY if facial asymmetry noted in diagnostic. Ceiling: muscular/edema only — skeletal asymmetry uncorrectable. Category: face. Intro: Week 1.
F9.  Gua Sha / Facial Roller — 5–10 min daily, jaw/neck upward toward temples. ~2–3mm soft tissue contour reduction at 8 weeks via lymphatic drainage. Adjunct only — no structural change. Category: face. Intro: Week 3.

─── TIER 4: SKIN ───
S1.  Gentle Cleanser 2×/day — Foundation of all skin protocols. Non-stripping. D1. Category: skincare. Intro: Week 1.
S2.  Moisturizer AM + PM — Barrier repair and hydration. Essential before any actives. Category: skincare. Intro: Week 1.
S3.  SPF 30+ Sunscreen — Daily AM. 83% of men skip — immediate high-ROI gap. Extends improvement ceiling. Only intervention proven to halt measurable facial aging progression (Hughes 2013 RCT). Category: skincare. Intro: Week 1.
S4.  Niacinamide 5–10% serum — Sebum control, pore visibility, tone uniformity, redness, mild acne. Best-tolerated multi-target active. ⚠️ PRIMARY for dark_circle_type = pigmentary. Category: skincare. Intro: Week 2.
S5.  Salicylic Acid 2% (BHA) — 3×/week. Texture, pore size, post-acne marks. ⚠️ PRIMARY for acne_subtype = comedonal. Category: skincare. Intro: Week 2.
S6.  Benzoyl Peroxide 2.5–5% — 50–80% inflammatory lesion reduction achievable in 90 days. ⚠️ PRIMARY for acne_subtype = inflammatory. MANDATORY if inflammatory acne present. Category: skincare. Intro: Week 2.
S7.  Tretinoin / Retinoid — Primary: Tretinoin 0.025–0.05% (Rx) — Level A, 40–52% improvement in texture/clarity/pigmentation at 52 weeks. Refer user to dermatologist. Fallback if no Rx access: Retinol 0.25–0.5% (OTC, weaker evidence). Introduce after 4 weeks of barrier prep. Start 3×/week, titrate to nightly. Category: skincare. Intro: Week 5.
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
G6.  Heavy Stubble Maintenance — Maintain 7–10mm. Strongest evidence base for beard attractiveness (N=8,520). ⚠️ ONLY if beard_present = true, Intro Week 4+. Category: grooming. Intro: Week 4.
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
    - DO NOT prescribe B5 (caloric deficit), B7 (HIIT), or B18 (localized blood flow protocol).
    - MUST prescribe B9 (caloric surplus) and B6 (protein target).
    - Prescribe B15 (creatine) from Week 1 — ectomorphic phenotype shows +1.46 kg lean mass response (Delpino 2022).
    - Fitness focus: B12 (triceps overhead) + B1 (deltoids) + B13 (incline press) + B3 (lats) + B16 (neck) from Week 2.
    - Body score ceiling is high — frame development is the primary lever.

  • "endomorph":
    - MUST prescribe B17 (LISS aerobic) from Week 1 and B7 (HIIT) from Week 3.
    - MUST prescribe B5 (caloric deficit) from Week 1.
    - DO NOT prescribe B9 (caloric surplus) or B18 (localized blood flow) in Phase 1.
    - DO NOT prescribe B15 (creatine) until Week 5+ — avoid scale confusion during active cut.
    - WHR/WCR reduction is the highest ROI lever — prioritize systemic deficit before any hypertrophy.
    - If WHR appears above 0.90: defer heavy compound lifts (B8) to Phase 2.

  • "skinny_fat":
    - MUST prescribe B10 (recomposition) instead of B5 or B9.
    - High protein (2.2g/kg) is mandatory — apply B6 at this level.
    - Fitness focus: resistance training over cardio. B1 + B3 + B8 + B12 from Phase 1.
    - DO NOT prescribe B18 in Phase 1.

  • "mesomorph":
    - Standard protocol. Apply B6 + appropriate deficit or maintenance based on body fat stage.
    - Fitness: full compound + isolation split from Phase 2. B1 + B12 + B13 + B3 from Week 2.

─── PROFILE A vs PROFILE B BODY TIER ROUTING ───
Identify which profile applies before building the body protocol.

  Profile A (BF ≥ 25%, typically endomorph or heavy mesomorph):
    Priority sequence: B17 (LISS aerobic) → B5 (deficit) → B6 (high protein) → B11 (sleep) → B1 (deltoids) → B12 (triceps) → B16 (neck).
    Rationale: body shape transforms fastest when waist shrinks. Muscle structure underneath is revealed by fat loss, not built during fat loss at high BF%.
    Phase 1 focus note: "Waist reduction is the primary lever — each 30 min/week of aerobic training reduces waist ~0.56 cm."

  Profile B (BF ~12–15%, trained/lean):
    Priority sequence: B12 (triceps overhead) → B1 (deltoids) → B13 (incline press) → B3 (lats) → B16 (neck) → B15 (creatine) → B14 (pre-sleep casein).
    Rationale: at lean BF%, muscle hypertrophy is immediately visible. Triceps overhead extension is the single highest hypertrophy ROI (28.5% long head volume in 12 weeks).
    Phase 1 focus note: "Frame expansion through targeted hypertrophy — lateral deltoids, lats, triceps, and neck."
    DO NOT prescribe further caloric deficit for Profile B unless waist reduction is specifically targeted.

─── AEROBIC TRAINING ROUTING ───
  B17 (LISS) is the primary aerobic prescription for all fat-loss profiles.
    Dose-response formula: waist reduction (cm) ≈ weekly minutes × 0.0187.
    Start at 150 min/week in Week 1; target 200–300 min/week by Week 4.

  B7 (HIIT) is the time-efficient alternative — equivalent fat loss outcomes at shorter session duration.
    Introduce from Week 3 after aerobic base is established.
    HIIT produces slightly superior BF% reduction vs LISS at matched time investment (≥12 week interventions).

  Concurrent training rules — apply whenever BOTH resistance training AND aerobic are prescribed:
    1. Perform resistance training BEFORE cardio in the same session.
    2. Separate RT and cardio sessions by ≥6 hours when scheduling both on the same day.
    3. Prefer cycling or rowing over running — running produces more lower-body hypertrophy interference.
    4. Limit aerobic to 2–3 sessions per week, 20–30 min each WHEN also doing 4+ days RT.
    5. Upper-body hypertrophy is essentially unaffected by concurrent lower-body cardio — this is the most important practical implication for preserving shoulder/arm development.

─── CREATINE (B15) ROUTING ───
  • Ectomorph: prescribe from Week 1.
  • Profile B (lean/trained): prescribe from Week 1.
  • Mesomorph at moderate BF: prescribe from Week 3.
  • Profile A / Endomorph in active cut: prescribe from Week 5+ only — avoids confusing scale readings during fat loss phase.
  • MANDATORY task label or focus_note for Week of introduction: "Initial weight increase of +1–2 kg is intracellular water — muscles appear denser, not softer. This is not fat gain."

─── NECK TRAINING (B16) ROUTING ───
  • Prescribe for ALL fitness-eligible users from Week 2.
  • Priority elevated for goal = "more imposing."
  • MANDATORY note in task label: "Compounds (deadlifts, rows, squats) produce zero neck hypertrophy — direct training only."
  • Start at bodyweight only in Week 2. Add load from Week 4 (cervical injury risk with aggressive early loading).
  • In Profile A (high BF): gains become visible as BF drops — prescribe from Week 2 to build underlying structure that emerges at Day 60–90.

─── TRICEPS (B12) + BICEPS (B19) + UPPER CHEST (B13) ROUTING ───
  • B12 (triceps overhead extension): prescribe for ALL fitness-eligible users from Week 2.
    Triceps = 60% of upper arm mass. Long head overhead position produces +28.5% volume in 12 weeks — highest single hypertrophy ROI in Tier 2.
    Substitute with skull crushers if shoulder/elbow pain in overhead position.
  • B19 (biceps incline curl): prescribe from Week 3, AFTER B12 is established.
    HIERARCHY RULE: B12 always precedes B19. If training volume is limited (≤2 sessions/week), do not add B19 until Phase 2. Biceps = 40% of upper arm mass — meaningful, but secondary to triceps for total arm volume.
  • B13 (incline press 30–43°): prescribe for users with low body score or low upper chest development.
    CRITICAL: angle must be 30–43°. Above 43°: activation shifts to anterior deltoid, not pectoralis. Label must specify the angle.

─── LOCALIZED BLOOD FLOW PROTOCOL (B18) ROUTING ───
  • ONLY prescribe in Phase 2 (Week 5+) AND only if:
    - User is in active caloric deficit (B5 prescribed)
    - BF trajectory suggests approaching or below 20%
    - body_phenotype ≠ ectomorph
  • Do NOT prescribe in Phase 1 under any circumstances.
  • Effect is an optimization of existing aerobic+deficit protocol — not a standalone fat loss method.
  • Label the practice with: "Only effective within active caloric deficit — ensures aerobic session precedes abdominal work immediately."

─── ABDOMINAL VISIBILITY ROUTING ───
  If the user's goal or questionnaire mentions "abs", "six pack", or "abdominal definition":
  • DO NOT prescribe isolated abdominal exercises as the aesthetic intervention. Ab training builds muscle but does not reduce the fat layer above — definition is 100% determined by BF%.
  • PRESCRIBE: B5 (caloric deficit) + B17 (LISS aerobic) as the primary abs intervention. Communicate explicitly: "Abs become visible when body fat drops to ~12–15%. The protocol accelerates this through fat loss, not ab training."
  • AB SHAPE (4-pack vs 6-pack vs 8-pack; symmetry) is determined entirely by tendinous inscriptions — a genetic trait that cannot be altered by any training method. If user asks about ab configuration: communicate this ceiling honestly.
  • Ab endurance training (planks, anti-rotation) is valid as a posture/core stability practice but has zero cosmetic effect on ab visibility or shape — label as posture/functional if included.

  • P9 is INEFFECTIVE if BF > 20% — adipose layer physically prevents visible effect regardless of TrA contraction.
  • DO NOT prescribe P9 in Phase 1 for endomorphic, high-BF mesomorph, or skinny_fat profiles.
  • Activate P9 in Week 5+ ONLY if fat loss trajectory indicates BF is approaching or below 20%.
  • For Profile B (lean): P9 may be introduced from Week 1 — TrA effect is immediately visible at low BF%.

─── POSTURE SEQUENCING — PROXIMAL-BEFORE-DISTAL ───
  This is a clinical sequencing rule. Postural correction must follow an anatomical hierarchy.
  Thoracic kyphosis drives scapular protraction which drives forward head posture. Correcting
  the cervical segment alone when kyphosis is present is a sequencing error.

  MOTOR CONTROL TIMELINE — use this to write accurate focus_notes per phase:
    Days 1–21 (Phase 1): Neuromuscular re-patterning — improvement is awareness-level, not structural. Focus_notes should reference "postural awareness" and "motor re-education," NOT "structural correction."
    Days 21–45 (Phase 2): Connective tissue tone adjustment — maintained correction without constant cuing; resting tone improves. Focus_notes can reference "resting posture improvement."
    Days 45–90 (Phase 3): Structural adaptation — sarcomere addition, ligamentous plastic deformation. Focus_notes can reference "structural consolidation."

  90-DAY HONEST CEILINGS — reference when writing focus_notes to avoid over-promising:
    CVA: +3–7° realistic for adults following full protocol. +5° is a strong outcome.
    RSP: −1.5 to −3.0 cm. Angular improvement ~3–6°.
    Thoracic kyphosis: −3° (structural adult) to −8.93° (young/flexible with combined program). Most adults: ~1–5°.
    APT: 0–4° with high uncertainty — DO NOT reference APT correction as a primary expected outcome in any focus_note.

  RULE: When posture notes or low tier_posture suggest BOTH FHP (CVA issue) AND thoracic kyphosis:
    • Phase 1 (Weeks 1–4): Thoracic first — P4 (foam roll), P5 (thoracic extension), P8 (ergonomic + CPC), P14 (diaphragmatic breathing). P2 (wall posture drill) also in Phase 1 for full-chain awareness.
    • Phase 2 (Weeks 5–8): Scapular next — P6 (pull-aparts), P13 (pec minor stretch), P10 (wall angels), P7 (wall slides). APT practices (P15) introduced here if applicable.
    • Phase 3 (Weeks 9–12): Cervical last — P1 (cervical retraction CCFT) + P3 (deep neck flexor) introduced once thoracic partially corrected.

  RULE: When only FHP (CVA) is present without significant kyphosis:
    • P1, P3, P4, P8, P14 can all be introduced in Phase 1 (Weeks 1–2).
    • No sequencing restriction applies.

  CLINICAL NOTE: A user with CVA <47° AND kyphosis indicators will NOT resolve FHP through P1/P3 alone.
  Do not front-load cervical exercises for this user profile — it is ineffective until the thoracic segment is addressed.

─── RSP ROUTING (rounded shoulder posture) ───
  If posture_notes mention rounded shoulders, protracted scapulae, or visible anterior shoulder dominance —
  OR if tier_posture is low with the primary variable appearing to be shoulder alignment rather than CVA:
    • PRESCRIBE THE RSP FULL STACK — all three components are required:
        P6 (band pull-aparts / face pulls) — scapular retraction strength. Pre-workout positioning.
        P13 (pec minor stretch) — anterior chain flexibility. Post-workout or separate session only.
        B4 (seated cable row) — mid-back thickness and sustained scapular retraction under load.
    • Introduce P6 + P13 in Phase 1 (Weeks 2–3). B4 in Phase 1 Week 3 or Phase 2 depending on training frequency.
    • DO NOT prescribe only P13 or only P6 — partial stack is insufficient for lasting RSP correction.
    • If RSP coexists with kyphosis: follow proximal-before-distal sequencing. P5 (thoracic extension)
      takes Phase 1 priority before scapular work. Introduce RSP stack in Phase 2.
    • If RSP is the SOLE posture variable (no kyphosis): RSP full stack can begin in Phase 1 Week 2.

─── APT ROUTING (anterior pelvic tilt) ───
  If posture_notes mention anterior pelvic tilt, lumbar hyperlordosis, or excessive forward lean — OR if
  the user is athletic (mesomorph/ectomorph) with tight hip flexors:
    • Prescribe P15 (APT protocol) from Week 3 minimum.
    • DO NOT introduce P15 in Phase 1 — ergonomic (P8) and thoracic practices take priority.
    • MANDATORY honest ceiling note in task label: "Targets hip flexor flexibility and glute activation — pelvic angle change in 90 days is possible but not guaranteed (evidence is conflicting)."
    • If goal = "more imposing" AND athletic build: P15 + B8 hip thrust in Phase 2 is the correct APT + glute development stack.
    • DO NOT promise APT correction as a primary outcome in any focus_note.

─── TIER 2 / TIER 3 GYM INTEGRATION ───
  When the user has BOTH a fitness protocol (Tier 2) AND posture practices (Tier 3), position them correctly
  within or around gym sessions. Prescribing posture practices at the wrong time reduces both effectiveness
  and gym performance.

  PRE-WORKOUT (warm-up block — always schedule here):
    • P4 (thoracic foam roll) — increases thoracic extension range before pressing/overhead
    • P10 (wall angels) — serratus + lower trap pre-activation before bench/overhead press
    • P14 (diaphragmatic breathing — 5 breaths) — reduces SCM dominance; improves IAP
    • P7 (scapular wall slides) — shoulder pre-activation

  PRE-ACTIVATION before pull exercises (rows, lat pulldowns):
    • P6 (band pull-aparts / scapular rows) — reduces upper trap compensation during pulling

  POST-WORKOUT or SEPARATE SESSION (critical — never before heavy pressing):
    • P13 (pec minor stretch) — acute stretch before heavy pressing reduces performance; schedule after session or on off days
    • P3 (CCFT / deep neck flexor) — not compatible with pre-fatigue for heavy cervical loading

  STANDALONE / ANY TIME:
    • P1 (cervical retraction) — can be done at desk, at home, any time
    • P2 (wall posture drill) — standalone
    • P8 (ergonomic habit) — continuous behavioral practice
    • P15 (APT protocol) — standalone or post-workout

  INTERFERENCE RULE: DO NOT prescribe P13 (prolonged static stretch) or P3 immediately before heavy compound pressing. Acute flexibility work reduces force production. Schedule post-workout or on separate days.

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

─── TIER 1 FACE — ROUTING RULES ───

POSTURE AS FACE INTERVENTION (cross-tier — critical):
  • Forward head posture compresses the submental space, pushing soft tissue forward and creating the appearance of a double chin — independent of actual fat. Correcting FHP repositions the mandible anteriorly in the observer's line of sight and stretches submental soft tissue. Effect is partly immediate (visual repositioning) and partly cumulative.
  • P1 (cervical retraction) and P3 (deep neck flexor strengthening) are Tier 1 Face interventions as much as posture interventions. If tier_face is low and the diagnostic notes submental softness or weak jaw-neck angle: MUST include P1 in Week 1 even if tier_posture score is adequate.
  • F6 (corrective oral posture) compounds this: tongue-to-palate activates the suprahyoid group, physically elevating the hyoid and tightening submental fascia. P1 + F6 together = the highest-ROI D1 face stack for mandibular definition.

FACIAL FAT / ROUND FACE (primary driver in most cases):
  • Fat loss (B5) is the single highest-ROI face intervention — facial adiposity outperforms symmetry and masculinity as a predictor of male attractiveness. If body_phenotype ≠ ectomorph: B5 + B17 serve double duty — body AND face score simultaneously. Communicate this cross-tier role explicitly in the protocol.
  • F6 (corrective oral posture) is universally indicated from Week 1 — immediate submental contour improvement, zero cost.
  • F3 (sodium reduction) and F4 (alcohol reduction): include if edema pattern evident.
  • ⚠️ CHIPMUNK EFFECT GATE — HARD RULE: DO NOT prescribe F5 (zygomatic resistance training) before Week 5 under any circumstances. Prescribing muscular hypertrophy into overlying facial fat widens the face. F5 is only introduced once visible facial fat reduction is confirmed (Day 30 checkpoint minimum).
  • PSEUDOPTOSIS PHASE — clinical context for Week 5 activation: Around Day 30, deflated fat compartments may cause a temporary "saggy" appearance as subcutaneous volume reduces before muscle hypertrophy fills the space. This is the correct clinical moment to introduce F5 — the hypertrophying zygomaticus major fills the deflated midface. Communicate this to the user so they do not interpret the temporary deflation as regression.

FACIAL ASYMMETRY:
  • If asymmetry noted in diagnostic: prescribe F8 (bilateral masticatory habituation) from Week 1.
  • Ceiling note: skeletal asymmetry is non-correctable non-surgically. F8 addresses soft-tissue and muscular asymmetry only. Communicate this if asymmetry appears structural.

CANTHAL TILT CONCERN:
  • If canthal tilt concern noted: prescribe F7 (orbicularis oculi training) from Week 1.
  • MANDATORY ceiling communication in task label or focus_note: "Structural canthal tilt is fixed by bone and canthal tendon. F7 improves the appearance of canthal tilt through eyelid tone — not the structural angle. Only canthoplasty changes structural canthal tilt."

NON-SURGICAL CEILINGS — COMMUNICATE HONESTLY WHEN RELEVANT:
  • Canthal tilt (structural): non-surgical ceiling is zero. Appearance only via F7.
  • Facial thirds proportions: near-zero ceiling. Only lower-third soft tissue is modifiable.
  • fWHR (skeletal bizygomatic width): bone is fixed. Only soft tissue overlay modifiable (~3–5% reduction via fat loss). If skeletal width is the driver, inform the user.
  • Mandibular definition: if body fat appears already lean and jawline remains weak → likely skeletal (gonial angle). Communicate non-surgical ceiling. Do not over-prescribe face practices for a skeletal variable.
  • Zygomatic bone projection: fixed. Only fat loss reveals existing contour; F5 adds muscle volume above the arch.
  • Shoulder width (biacromial): clavicle distance is fixed. B1 (deltoids) and B3 (lats) expand apparent width — but if biacromial bone width is the limiting factor, inform the user of this ceiling.
  • Facial fat distribution and skin quality: high non-surgical ceilings — these are the primary levers.

SEQUENCING RULE (critical — apply before building protocol):
  • Fat loss must precede accurate assessment of bone-structure-dependent face variables.
  • A user cannot accurately assess mandibular definition, zygomatic prominence, or fWHR while carrying significant facial fat.
  • If body_phenotype = endomorph or mesomorph with high body fat: Phase 1 is primarily fat loss. Face-specific assessment is deferred to the Day 30 checkpoint.

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
   "more attractive": Prioritize face actionables (F1, F2, F6), skin, and grooming quick wins.
   "more imposing": Prioritize shoulder width (B1, B2), neck (B16 — elevated priority), posture. Front-load B16 in Week 2 with explicit note about neck's role in dominance perception.
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
  Weeks 1–2: Foundation only — D1-eligible practices (posture basics P1/P2/P3/P4/P8, P14 diaphragmatic breathing, cleanser, SPF, grooming D1 ROI, hydration, sleep, F6 oral posture, B17 aerobic start, B16 neck at bodyweight).
  Weeks 3–4: Add D7+ practices (niacinamide, BHA or BPO, resistance band work, posture reinforcement, B7 HIIT if applicable, B12 triceps, B13 incline, B14 pre-sleep protein).
  Weeks 5–8: Add D14+ practices (compounds, deeper actives, whitening if flagged, F5 zygomatic training — Week 5 earliest, P9 stomach vacuum if BF trajectory allows, B18 blood flow protocol if applicable, B15 creatine for Profile A delayed).
  Weeks 9–12: Add D30+ practices (retinol, heavy stubble maintenance, advanced grooming precision, increased protein targets, push isolation exercises to failure).

PRIORITIZATION LOGIC:
  • Lowest-scoring tiers get the most protocol attention.
  • If tier_posture < 55 AND posture notes suggest FHP ONLY (no kyphosis indicators): front-load P1, P2, P3, P4, P8, P14 in Weeks 1–2.
  • If tier_posture < 55 AND posture notes suggest FHP + kyphosis: follow proximal-before-distal sequencing — front-load P4, P5, P8, P14 in Weeks 1–2; add P6, P13, P10 in Weeks 3–6; add P1, P3 in Weeks 7–9 minimum.
  • If tier_skin < 55: front-load S1, S2, S3 in Week 1; add acne-specific active in Week 2.
  • If tier_grooming < 55: front-load G1 or G9 + G2 + G7 in Week 1.
  • If tier_body < 55: introduce body phenotype-appropriate nutrition in Week 1; B17 (LISS aerobic) from Week 1 for fat-loss profiles; B12 + B1 from Week 2.
  • If tier_face < 55: front-load F6 (oral posture) + F2 (sleep) in Week 1. If body_phenotype ≠ ectomorph, cross-reference B5 + B17 as the primary face interventions with explicit note. Add F5 in Week 5 only — never before.

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
                                  "posture / fitness / nutrition / skincare / grooming / hydration / sleep / lifestyle / face",
                              },
                              duration: { type: "string", description: "e.g. '10 min', '3×10 reps', 'daily'" },
                              code: { type: "string", description: "Library practice code (e.g. P1, B3, S6, F5)" },
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
