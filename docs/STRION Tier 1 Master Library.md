# STRION — Scientific Practice Library
## Tier 1: Face
### Master Consolidated Document
**Sources:** Claude Tier 1 + ChatGPT Tier 1 + Gemini Tier 1 Research
**Status:** Final — ready for LLM protocol selection

---

## META-NOTES FOR LLM IMPLEMENTATION

This library is the **only source of truth** for Tier 1 protocol generation. The LLM selects from these cards — it does not invent practices. Rules:

- Each practice card has an ID (T1-P01 through T1-P12). Reference by ID when building protocols.
- Evidence levels: **A** (RCT/meta-analysis) → **B** (prospective cohort/controlled study) → **C** (case series/expert consensus) → **D** (anecdotal/theoretical).
- When assigning practices to a user, match the user's **lowest-scoring Tier 1 variable** to the **Primary Variables** field of each card.
- Sequencing matters. Never prescribe T1-P02 before Day 30 (see caveat). T1-P01 is always the first intervention if BF% > 20%.
- Some variables have a **non-surgical ceiling of zero** (canthal tilt, facial thirds, fWHR skeletal component). The LLM must communicate these ceilings honestly.

---

## SECTION 1 — PRACTICE CARDS

---

### T1-P01 — Systemic Fat Loss Protocol
**Evidence Level:** A
**Primary Variables:** Facial fat distribution · Mandibular definition · fWHR (soft tissue component)
**Secondary Variables:** Zygomatic prominence · Facial proportions (lower third)

**Mechanism:** Caloric deficit mobilizes subcutaneous adipose tissue including facial fat compartments (superficial temporal, buccal, submental). Facial adiposity is highly correlated with BMI (r = 0.71, meta-analysis) and is the single strongest predictor of male facial attractiveness, outperforming symmetry and masculinity. Reduced facial fat exposes underlying bone structure — zygomatic arch, mandibular border, and submental definition.

**Key Studies:**
- Re & Rule (2016, SPPS): Just-noticeable-difference = 1.33 kg/m² BMI change. Attractiveness threshold for males = **2.59 kg/m² BMI decrease** (~8.2 kg for average male).
- Rantala et al. (2013, Proc Royal Soc B, N=69): Peak male attractiveness at approximately **12% body fat**. Adiposity — not masculinity — was the primary mediator of attractiveness.
- Tower et al. (2018): **7% midfacial fat volume loss per 10 kg total body weight lost**.
- Jafar et al. (2024, Aesthetic Surgery Journal, systematic review, 14 studies): Superficial temporal fat pad −41.8%, cheek fat pad −69.9% (Ozempic rapid weight loss context, n=5).
- Peters et al. (2020, J Cranio-Maxillo-Facial Surgery, N=23, 3D scanning): Tragion–menton distance decreased **3.4 mm** (p < 0.0001); mean neck volume loss 75.2 mL.
- de Jager et al. (2018, Frontiers in Psychology, meta-analysis of 7 studies, N=458): Correlation between perceived facial adiposity and actual BMI: **r = 0.71**.

**Protocol:**
- Caloric deficit 300–500 kcal/day targeting 0.5–0.75 kg/week fat loss
- Protein ≥ 1.6–2.2 g/kg/day (preserves lean mass during deficit)
- Concurrent resistance training 3x/week
- Minimum target: ΔBMI 1.33 kg/m² (JND threshold); optimal target: ΔBMI 2.59 kg/m² (attractiveness shift)

**90-Day Ceiling:**
- Starting BF 25%: potential loss of 5–8 kg fat in 90 days → crosses attractiveness threshold
- Quantified facial change: ~1.9–3.4 mm changes in facial landmark distances (Peters 2020)
- ~7% reduction per 10 kg in midfacial fat volume (Tower 2018)

**Caveats:**
- Buccal (deep) fat pad is resistant to caloric restriction and may persist even at low BF%
- Excessive weight loss (BMI < 20) causes midface volume loss, nasolabial deepening, adds ~3 years to perceived age
- Genetics determine ~60% of fat distribution order — facial fat loss sequence is not controllable
- **Chipmunk Effect warning (Gemini):** Starting zygomatic resistance training (T1-P02) while BF > 20% pushes hypertrophying muscle into overlying fat, widening face rather than defining it. Start T1-P02 only after visible facial fat reduction (Day 30 minimum, ideally at BF < 20%)
- "Pseudoptosis phase" (Gemini): Around Day 30, deflated fat compartments may cause a temporary "saggy" appearance — this is the correct time to begin T1-P02 to fill the deflated midface

---

### T1-P02 — Targeted Zygomatic & Midface Resistance Training
**Evidence Level:** B
**Primary Variables:** Zygomatic prominence · Facial symmetry (soft tissue)
**Secondary Variables:** Mandibular definition (lower cheek border)

**Mechanism:** Repeated isotonic and isometric contractions of zygomaticus major, zygomaticus minor, and levator labii superioris stimulate modest muscular hypertrophy and increased neural tone, increasing soft tissue volume over the zygomatic arch. Effect is equivalent to low-load skeletal muscle hypertrophy but in facial musculature. Hwang (2018) confirmed via ultrasonography: +6.5% CSA of zygomaticus major after 8 weeks.

**Key Studies:**
- Alam et al. (2018, JAMA Dermatology, N=16 completers, women 40–65): ~2.7 years perceived age reduction at 20 weeks. Upper and lower cheek fullness significantly improved (p = 0.003). Single-arm; co-author conflict.
- Hwang et al. (2018, Aesthetic Surgery Journal, N=50 women, 8 weeks): Ultrasonography confirmed +6.5% CSA zygomaticus major, +7.7% CSA digastric. Jawline surface distance reduced ~1.3 mm.
- D'Ottavio et al. (2023): 3D volumetric scanning showed measurable midfacial volume changes at 3 months with facial resistance training.
- Manincor et al. (2024, systematic review, 7 studies): Evidence converges on modest but real hypertrophy/toning effects from targeted facial muscle training.
- Van Borsel et al. (2014, Aesthetic Surgery Journal, systematic review): "Evidence to date is insufficient to determine whether facial exercises are effective for facial rejuvenation" — conservative benchmark for calibrating expectations.

**Protocol:**
- **Start date: Day 30 minimum** (after initial fat loss creates space for hypertrophy to show — see T1-P01 chipmunk effect caveat)
- Weeks 5–8 (Days 30–60): 30 min daily
- Weeks 9–12 (Days 60–90): 30 min every other day (3–4x/week)
- Core exercise — "Happy Cheeks Sculpting":
  - Smile without showing teeth
  - Force lips together firmly
  - Contract cheeks upward toward the outer corners of the eyes
  - Apply gentle manual resistance with index fingers against cheeks
  - 3 sets × 10–15 reps with 20-second isometric hold each rep
- Progressive overload: increase finger resistance every 2 weeks

**90-Day Ceiling (from Day 30 start = 8 weeks of training):**
- ~6–8% CSA increase in zygomaticus major
- Subtle but measurable midfacial volume increase and improved cheek definition
- ~2.7 years perceived age reduction if combined with fat loss (extrapolated from Alam 2018)

**Caveats:**
- All primary study data in women (40–65). Male generalization is extrapolated from skeletal muscle physiology.
- Effect is in soft tissue (muscle volume) — NOT in bone. The zygomatic arch itself does not change.
- Risk of deepening dynamic wrinkles with uncontrolled/excessive isotonic movements
- Requires BF < 20% to be visually meaningful (muscle hypertrophy is obscured by fat layer above)
- Results reverse within weeks of stopping — this is a maintenance-dependent practice

---

### T1-P03 — Bilateral Masticatory Habituation
**Evidence Level:** B
**Primary Variables:** Facial symmetry (masseteric/mandibular)
**Secondary Variables:** Mandibular definition

**Mechanism:** Unilateral preferred chewing side (PCS) leads to asymmetric masseteric hypertrophy and, over years, cumulative structural asymmetry. Palma et al. (2024) confirmed 92.1% of sampled individuals have measurably wider hemiface on their dominant chewing side. Correcting chewing laterality reduces the asymmetric muscular overload and gradually normalizes masseteric tone bilaterally.

**Key Studies:**
- Palma et al. (2024, N=76 adults): **92.1% had wider hemiface on dominant chewing side**; 85.5% showed chin deviation from midline correlated with PCS (p < 0.05). EMG confirmed asymmetric activation patterns.
- Yamasaki et al. (2016): Missing teeth force unilateral mastication → measurable masseteric asymmetry via surface EMG within months.
- Cohort with stereofotogrammetry (N=748, including 296 men) — ChatGPT source: "Preferred chewing side had no statistically significant effect on facial asymmetry." Note: this contradicts Palma 2024 and likely reflects that PCS is one of multiple asymmetry contributors, not the sole driver.

**Protocol:**
- Prerequisite: Dental pain/malocclusion must be addressed first — unilateral chewing due to pain cannot be corrected behaviorally
- Consciously distribute food bolus bilaterally during all meals
- Options: (a) strict alternation — 3 chews left, 3 right; or (b) simultaneous bilateral chewing where food permits
- Duration: Continuous habit change. Effects accumulate over 8–12+ weeks

**90-Day Ceiling:**
- Normalization of TMJ resting tension
- Reduction in jaw deviation and mid-chin deviation
- Mild softening of dominant-side masseter hypertonia
- No bone reshaping in 90 days — only muscular/soft-tissue normalization

**Caveats:**
- Skeletal asymmetry (crossbite, hemimandibular hyperplasia) CANNOT be corrected behaviorally
- Bone remodeling from years of unilateral chewing takes years to reverse — 90 days is insufficient for structural change
- Evidence base is moderate; the conflicting cohort study (N=748) limits confidence

---

### T1-P04 — Corrective Oral Posture (Suprahyoid Activation)
**Evidence Level:** C (for soft-tissue submental effect) / D (for skeletal claims — explicitly REJECTED)
**Primary Variables:** Mandibular definition (submental contour)
**Secondary Variables:** Facial thirds (lower third)

**Mechanism — REAL COMPONENT:** The suprahyoid muscle group (mylohyoid, geniohyoid, stylohyoid, digastric) contracts isometrically when the tongue is elevated against the palate. This physically elevates the hyoid bone and tightens submental fascia, reducing the appearance of a "soft double chin" from descended hyoid position. Effect is immediate and partially cumulative (increased resting tone over weeks).

**Mechanism — REJECTED COMPONENT:** Claims that tongue posture moves the maxilla forward, widens the palate, or remodels craniofacial bone in adults are **Level D — no evidence, biologically implausible** after midpalatal suture fusion. The AAO found "zero peer-reviewed studies supporting mewing's effectiveness." John Mew lost his dental license; Mike Mew was expelled from the British Orthodontic Society.

**Key Studies:**
- Solow & Tallgren (1976, Am J Physical Anthropology, N=120 Danish males): Head extension associated with large anterior facial heights — correlational.
- Ye et al. (2025, J Craniomandibular Function, N=40): Significant differences in craniocervical angles between neutral and FHP; vertical craniofacial variables influenced by head posture.
- MARPE/MSE devices (meta-analysis 2022, 14 studies): Achieve 4.56 mm midpalatal suture opening in adults — **but require mechanical appliances delivering kilograms of force**, not tongue pressure.
- Syed et al. (2019, Dental Press J Orthodontics, N=90): "No significant differences in resting tongue posture among groups; moderate to weak correlation between tongue posture and dental arch widths."

**Protocol:**
- Lips sealed continuously
- Teeth in light contact (not clenched)
- Entire tongue dorsum flat against hard and soft palate — gentle upward pressure, no anterior force
- Obligate nasal breathing (most functionally important element)
- Continuous habit (not a timed exercise)
- Effect: Immediate visual improvement in jaw-neck angle; cumulative resting tone improvement over 4–8 weeks

**90-Day Ceiling:**
- Eradication of mouth-breathing habit (real and medically valuable)
- Increased resting tone of suprahyoid muscles → improved submental contour
- Elimination of "soft double chin" caused by descended hyoid (not fat)
- **Zero millimeters of actual bone change**

**Caveats:**
- Popular "mewing" skeletal claims are pseudoscience — do not present the skeletal claims to users
- Midpalatal suture fused in majority of adults over 25 (~52% partial fusion at 21–25; ~50% fully fused at 31–35)
- Forcing tongue too hard risks TMD, tooth tipping, and perioral tension
- The benefit is real — but it is soft-tissue and postural, not structural

---

### T1-P05 — Orbicularis Oculi Tension Control
**Evidence Level:** C
**Primary Variables:** Canthal tilt (appearance only — see ceiling note)
**Secondary Variables:** Facial symmetry (periocular)

**Mechanism:** The orbicularis oculi (specifically the pretarsal portion) interacts functionally with the levator palpebrae superioris. Selective isometric contraction of the lower eyelid component — without full eye closure — increases lower-lid tone. This reduces inferior scleral show (white space below iris), creates a more horizontally compressed eye shape, and produces the appearance of a more positive canthal tilt. Additionally reduces morning periorbital edema through micro-lymphatic stimulation.

**Key Studies:**
- sEMG studies confirm functional interaction between orbicularis oculi layers and eyelid apposition (Gemini source — no single RCT in healthy young males)
- Clinical orbicularis training literature: Significant improvements in eyelid closure strength (20.5 → 25.3 kPa) with structured training protocols
- Ahn et al. (2025, J Cosmetic Dermatology, RCT, N=34 women): Periocular muscle tone improvements with facial massage protocols

**Protocol:**
- Gentle isometric hold: engage lower eyelid to lift upward, WITHOUT fully closing eyes
- Hold 10–15 seconds per rep, 10 repetitions
- Perform daily, preferably morning
- Pair with cold water rinse (splashing) to stimulate periorbital lymphatic drainage and reduce morning puffiness

**90-Day Ceiling:**
- Tighter lower eyelid position
- Reduced inferior scleral show → more alert-appearing eyes
- Reduced morning periorbital puffiness and dark circles
- Appearance of more positive canthal tilt angle

**Caveats (CRITICAL — must communicate to user):**
- This practice **CANNOT change actual canthal tilt** — canthal tilt is determined by the skeletal anchoring of the lateral canthal tendon to the orbital bone. Only canthoplasty/canthopexy changes structural canthal tilt.
- This practice only produces the *appearance* of improved canthal tilt through eyelid tone
- Over-squinting risks permanent crow's feet
- This is the ONLY non-surgical approach to canthal tilt appearance — and it is Level C evidence

---

### T1-P06 — Sleep Optimization
**Evidence Level:** B
**Primary Variables:** Facial fat distribution (puffiness/edema) · Skin quality
**Secondary Variables:** Facial symmetry (asymmetric edema)

**Mechanism:** Sleep deprivation increases cortisol, impairs lymphatic drainage, and reduces skin barrier function. Periorbital edema, vascular congestion (dark circles, red eyes), and reduced skin turgor result from disrupted circadian repair processes. Effects are acute (visible within 1–2 nights of deprivation) and reversible.

**Key Studies:**
- Axelsson et al. (2010, BMJ, N=23 photographed/65 raters): Sleep-deprived individuals rated significantly less healthy, less attractive, and more tired (all p < 0.001).
- Sundelin et al. (2013, Sleep, N=10/40 raters): Six specific facial cues identified: hanging eyelids, swollen eyes, darker under-eye circles, paler skin, more wrinkles, droopier mouth corners.
- Sundelin et al. (2017, Royal Society Open Science, N=25/122 raters): Even partial restriction (4h/night × 2 nights) decreased rated attractiveness (p < 0.05).
- Oyetakin-White et al. (2015, Clin Exp Dermatology, N=60 women): Good sleepers had intrinsic aging score of 2.2 vs. 4.4 for poor sleepers; 30% greater skin barrier recovery.

**Protocol:**
- 7–9 hours per night (non-negotiable floor)
- Consistent sleep-wake schedule within ±30 minutes daily
- Sleep position: supine reduces asymmetric facial compression (no rigorous data, but mechanistically sound)

**90-Day Ceiling:**
- Elimination of deprivation-related puffiness, dark circles, skin pallor
- Improved skin barrier function (~30% recovery per Oyetakin-White)
- This is primarily a **prevention/maintenance** practice — it prevents degradation rather than producing new structural gains

**Caveats:**
- No effect on bone, fat, or muscle — purely soft tissue and skin
- Must be ongoing — benefits reverse immediately with resumed deprivation

---

### T1-P07 — Dietary Sodium Reduction
**Evidence Level:** C
**Primary Variables:** Facial fat distribution (water retention / puffiness)
**Secondary Variables:** Mandibular definition (indirectly, by reducing overlying edema)

**Mechanism:** Excess dietary sodium increases extracellular fluid volume via osmotic gradients. The face — with thin skin and loose subcutaneous tissue — is particularly susceptible to visible edema. Skin can serve as a sodium reservoir (Wiig et al. 2017). Reducing intake decreases baseline extracellular fluid load, revealing bone architecture more clearly.

**Key Studies:**
- Titze et al. (2017, JCI, N=10 men): Complex, non-linear sodium-water balance relationships. Demonstrated sodium reservoir function of skin.
- WHO, ACC/AHA clinical consensus: Sodium excess causes tissue edema.
- No RCT specifically quantifies facial puffiness from sodium manipulation.

**Protocol:**
- Reduce dietary sodium to ≤2,300 mg/day (ideally ≤1,500 mg)
- Avoid processed foods, restaurant meals, canned goods
- Effects of single high-sodium meal resolve within 12–24 hours

**90-Day Ceiling:**
- Reduced baseline facial puffiness → improved perceived mandibular and zygomatic definition
- Entirely transient — maintained only with ongoing restriction

**Caveats:**
- No quantified facial-specific effect size exists (Level C)
- Individual sodium sensitivity varies enormously
- Effect is purely on water/fluid — not fat or bone

---

### T1-P08 — Alcohol Reduction
**Evidence Level:** B
**Primary Variables:** Skin quality · Facial fat distribution (inflammatory puffiness)
**Secondary Variables:** Sleep quality (indirect)

**Mechanism:** Alcohol causes peripheral vasodilation (facial flushing), impairs collagen synthesis by fibroblasts, depletes dermal carotenoids, and increases systemic inflammation. Chronic use promotes midface volume loss and periorbital puffiness.

**Key Studies:**
- Guyuron et al. (2009, PRS, N=186 identical twin pairs): Alcohol avoidance significantly associated with younger appearance (**p = 0.0002**). Twin design controls for genetics.
- Goodman et al. (2019, JCAD, N=3,267 women): Heavy drinking (≥8 drinks/week) significantly associated with 7 of 11 facial aging features: upper facial lines, under-eye puffiness, oral commissures, midface volume loss, visible blood vessels.
- Mendelian randomization (2024, PubMed 38178620): Found no causal association between alcohol intake and facial aging via genetic instruments — confounding possible in observational studies.

**Protocol:**
- Reduce to ≤4 standard drinks/week or eliminate entirely
- Effects dose-dependent

**90-Day Ceiling:**
- Reduced facial puffiness and periorbital edema
- Improved skin tone, color, and visible capillary reduction
- Net perceived age benefit: modest but real

**Caveats:**
- MR study suggests some observational association may be confounded
- Effects primarily on skin and soft tissue, not structure

---

### T1-P09 — Skincare: Tretinoin + Broad-Spectrum Sunscreen
**Evidence Level:** A
**Primary Variables:** Skin quality
**Secondary Variables:** Perceived facial definition (improved skin tightness enhances bone architecture visibility)

**Mechanism:** Tretinoin (all-trans retinoic acid) stimulates collagen synthesis, increases epidermal thickness, inhibits matrix metalloproteinases (collagen degraders), and normalizes keratinocyte turnover. UV protection prevents photoaging. Improved skin tightness and reduced texture enhance visibility of underlying structure — a lean, well-defined face appears less defined through poor skin quality.

**Key Studies:**
- Huang & Lee (2025, Dermatology Practical & Conceptual, meta-analysis, 8 RCTs, N=1,361): Tretinoin significantly improved fine and coarse wrinkles compared to vehicle.
- Hughes et al. (2013, Annals of Internal Medicine, RCT, N=903, 4.5 years): Daily sunscreen users showed **no detectable increase in skin aging** vs. measurable aging progression in discretionary users. Highest-quality evidence for any lifestyle intervention preventing facial aging.
- Randhawa et al. (2016, Dermatologic Surgery, N=32, 52 weeks): **40–52% improvement in texture, clarity, and pigmentation by week 52; 100% of subjects showed improvement.**
- Rasool et al. (2025, American Journal of Medicine, meta-analysis, 23 RCTs, N=1,474): **Collagen supplements show no significant effect** on skin aging when controlling for industry funding and study quality.

**Protocol:**
- Tretinoin 0.025–0.05% applied nightly (start 3x/week for first 4 weeks, titrate to nightly)
- Broad-spectrum SPF 30+ daily, including cloudy days
- Moisturizer during retinoid acclimatization period
- Full effect timeline: initial improvement at ~12 weeks; continued improvement to 52+ weeks

**90-Day Ceiling:**
- Improved skin texture, reduced fine wrinkles
- Improved pigmentation uniformity, tighter-appearing skin
- 40–52% measurable improvement at 52 weeks (Randhawa) — at 90 days (~13 weeks), improvement is real but partial

**Caveats:**
- Tretinoin requires prescription (Rx) — the app must refer, not prescribe
- Initial purging/irritation period (4–8 weeks): redness, peeling, photosensitivity
- Does not change bone, fat, or facial proportions
- OTC retinol: "very little, if any, trustworthy evidence" (JCAD systematic review 2021)
- Collagen supplements: debunked at Level A by Rasool 2025

---

### T1-P10 — Posture Correction (Cervical/Head Alignment)
**Evidence Level:** C
**Primary Variables:** Mandibular definition (perceived, via jaw-neck angle)
**Secondary Variables:** Facial thirds (lower)

**Mechanism:** Forward head posture (FHP) shifts the mandible posteriorly in the visual plane, compresses the submental space (pushing soft tissue forward to create a "double chin" appearance), and reduces the visible jaw-neck angle. Correcting FHP repositions the mandible anteriorly in the observer's line of sight and stretches submental soft tissue. Effect is partly immediate (visual repositioning) and partly cumulative (postural habit change over 4–8 weeks).

**Key Studies:**
- Solow & Tallgren (1976, N=120 Danish males): Head extension associated with large anterior facial heights — correlational.
- Gomes et al. (2014, European Journal of Orthodontics, 12 studies systematic review): Significant associations between craniocervical posture and craniofacial morphology; correlation coefficients low to moderate.
- Ye et al. (2025, J Craniomandibular Function, N=40): Significant differences in craniocervical angles between neutral and FHP.

**Protocol:**
- Chin tucks: 3 sets × 10 reps daily
- Thoracic extension exercises: 3 sets × 10 reps daily (thoracic opener, doorframe stretch)
- Ergonomic workstation: screen at eye level, no downward-gaze screen time
- Conscious postural awareness throughout the day

**90-Day Ceiling:**
- Immediate visual improvement in jaw-neck angle when upright
- Habitual postural change over 4–8 weeks of consistent practice
- Improved submental contour through stretched soft tissue
- **No bone remodeling; no permanent facial structural change**

**Caveats:**
- All evidence is correlational; no RCT measures facial outcomes from posture correction in adults
- Causal direction of posture-morphology relationships unresolved
- Effect is visual repositioning, not anatomical change

---

### T1-P11 — Gua Sha / Facial Roller Massage
**Evidence Level:** B
**Primary Variables:** Facial fat distribution (soft tissue contour)
**Secondary Variables:** Zygomatic prominence (perceived)

**Mechanism:** Mechanical lymphatic stimulation and temporary increased microcirculation (4× baseline for ~7.5 min; Nielsen 2007). Reduces interstitial fluid accumulation and mild soft tissue edema. Ahn 2025 demonstrated measurable contour reduction via 3D scanning — attributed to soft tissue mobilization and reduced muscle tone, not bone.

**Key Studies:**
- Ahn et al. (2025, J Cosmetic Dermatology, RCT, N=34 women, 8 weeks): Gua sha: **2.23–2.40 mm facial contour reduction** (p < 0.001). Facial roller: 2.75–3.26 mm (p < 0.001). No placebo control.

**Protocol:**
- Gua sha stone or facial roller, daily use
- Duration: 5–10 min per session, starting at jaw/neck, moving upward toward temples
- Minimum 8 weeks for measurable effect

**90-Day Ceiling:**
- ~2–3 mm soft tissue contour reduction in women (only available data)
- Temporary increased circulation, reduced morning puffiness
- No structural change

**Caveats:**
- No male data; all study data in women
- No placebo control in the RCT
- Changes are in soft tissue only — no bone effect
- Contour changes may be partially transient
- McGill OSS: social media gua sha is heavily diluted from traditional practice

---

### T1-P12 — Hydration Optimization
**Evidence Level:** C
**Primary Variables:** Skin quality
**Secondary Variables:** Facial fat distribution (marginal puffiness reduction)

**Key Studies:**
- Akdeniz et al. (2018, Skin Research and Technology, systematic review): Only 6 studies met inclusion criteria; "overall evidence is weak in quantity and methodological quality."
- Korean RCT (2024, Annals of Dermatology, N=43 women): Additional 2L/day water alone did NOT significantly change stratum corneum hydration; moisturizer significantly more effective.

**Protocol:**
- ~3.7L total daily fluid intake for adult males (IOM recommendation)
- Primary benefit is in previously dehydrated individuals only

**90-Day Ceiling:** Marginal skin hydration improvement if previously dehydrated. Negligible structural change.

**Caveats:** Least impactful Tier 1 practice. Include only as a baseline hygiene behavior. Do not over-emphasize.

---

## SECTION 2 — VARIABLE → PRACTICE MAPPING

### Excess Facial Fat / Round Face
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P01 Systemic Fat Loss | A |
| 2 | T1-P06 Sleep Optimization | B |
| 3 | T1-P07 Sodium Reduction | C |
| 4 | T1-P08 Alcohol Reduction | B |
| 5 | T1-P11 Gua Sha (adjunct) | B |

**Clinical note:** Adipose tissue is the primary driver of "round face" in nearly all cases. All other interventions are adjuncts. Do not prescribe T1-P02 until BF < 20%.

---

### Weak Mandibular Definition (Undefined Jawline)
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P01 Systemic Fat Loss | A |
| 2 | T1-P10 Posture Correction | C |
| 3 | T1-P04 Corrective Oral Posture | C |
| 4 | T1-P07 Sodium Reduction (adjunct) | C |

**Clinical note:** If BF < 15% and jawline remains weak, the limitation is skeletal (gonial angle, ramus height). Non-surgical ceiling reached. Communicate this honestly.

---

### fWHR Outside Ideal Range (Too Wide)
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P01 Systemic Fat Loss | A |
| 2 | T1-P06 Sleep Optimization | B |

**Clinical note:** fWHR = bizygomatic width / upper facial height. The bizygomatic bone width is genetically fixed. Only the **soft tissue overlay** is modifiable (fWHR correlates with BMI at r = 0.31). The skeletal component cannot be changed non-surgically. Maximum fWHR reduction via fat loss: ~3–5%. If the skeletal bizygomatic width is the driver, this is a non-surgical zero-ceiling variable.

---

### Low Zygomatic Prominence (Flat Cheekbones)
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P01 Systemic Fat Loss (reveals existing bone) | A |
| 2 | T1-P02 Zygomatic Resistance Training (starts Day 30) | B |
| 3 | T1-P11 Gua Sha (adjunct) | B |

**Clinical note:** The zygomatic bone projection is genetically determined (polygenic, population-specific). Perceived prominence is modifiable through: (1) fat loss that reveals existing contour, and (2) muscular volume above the arch. The bone itself does not change without malar implants.

---

### Facial Asymmetry
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P03 Bilateral Masticatory Habituation | B |
| 2 | T1-P06 Sleep Optimization (reduces asymmetric edema) | B |
| 3 | T1-P04 Corrective Oral Posture | C |

**Clinical note:** Facial asymmetry has identified genetic contributions (GWAS: NFATC1, SOX5, NBAS). Skeletal asymmetry (mandibular, orbital) is not correctable non-surgically. Soft-tissue asymmetry from unilateral habits may be marginally improvable through habit correction. Maximum realistic improvement in 90 days: reduction of muscular and edema-related asymmetry; zero change in skeletal asymmetry.

---

### Negative or Neutral Canthal Tilt
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P05 Orbicularis Oculi Tension Control | C |

**Clinical note:** Canthal tilt is determined by orbital bone structure and lateral canthal tendon insertion. **Non-surgical ceiling is zero for structural change.** T1-P05 produces only the *appearance* of improved canthal tilt through lower eyelid tone. If structural canthal tilt is the user's primary concern, they must be informed that no behavioral practice can change it. Only canthoplasty/canthopexy addresses structural canthal tilt.

---

### Disproportionate Facial Thirds
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P01 Systemic Fat Loss (lower third soft tissue) | A |
| 2 | T1-P10 Posture Correction (visual) | C |

**Clinical note:** Facial third proportions are overwhelmingly determined by skeletal relationships established during development. **Non-surgical ceiling is near-zero for structural change.** The only modifiable component is lower-third soft tissue overlay (submental fat, platysma tone). Skeletal corrections require orthognathic surgery.

---

### Skin Quality
| Priority | Practice | Evidence Level |
|----------|----------|---------------|
| 1 | T1-P09 Skincare: Tretinoin + Sunscreen | A |
| 2 | T1-P06 Sleep Optimization | B |
| 3 | T1-P08 Alcohol Reduction | B |
| 4 | T1-P12 Hydration Optimization | C |

---

## SECTION 3 — RANKING BY 90-DAY IMPACT

Ordered by estimated magnitude of visible change achievable within 90 days:

**Rank 1 — T1-P01: Systemic Fat Loss** | Level A
Facial adiposity is the single strongest predictor of male facial attractiveness. A man starting at 25% BF on a disciplined deficit can cross the attractiveness threshold (ΔBMI 2.59 kg/m²) within 90 days. Documented facial landmark changes of 1.9–3.4 mm. ~7% midfacial fat volume reduction per 10 kg lost. Nothing else comes close to this impact for users with BF > 20%.

**Rank 2 — T1-P09: Skincare (Tretinoin + Sunscreen)** | Level A
At 90 days (~13 weeks), initial meaningful improvement. At 52 weeks, 40–52% improvement in texture/clarity/pigmentation. Uniquely, this is the only Level A practice targeting skin quality. Prevents measurable aging progression (Hughes 2013 RCT). High ROI for the effort.

**Rank 3 — T1-P06: Sleep Optimization** | Level B
Even partial sleep restriction (4h × 2 nights) significantly decreases attractiveness ratings. Restoring adequate sleep eliminates up to 6 specific facial cues of fatigue immediately. Highest effort-to-result ratio of any practice — zero cost, immediate effect.

**Rank 4 — T1-P08: Alcohol Reduction** | Level B
Twin-controlled, genetics-adjusted evidence (p = 0.0002). Eliminates 7 specific facial aging features with heavy-drinking reduction. Combined with fat loss, accelerates results significantly.

**Rank 5 — T1-P10: Posture Correction** | Level C
Immediate visual improvement in jaw-neck angle upon adopting correct posture — no waiting period. Does not change structure but creates better-structure appearance immediately. Low investment, high per-session ROI.

**Rank 6 — T1-P04: Corrective Oral Posture** | Level C
Immediate submental tightening via suprahyoid activation. Cumulative resting tone improvement over weeks. Importantly, promotes nasal breathing which has independent health benefits.

**Rank 7 — T1-P02: Zygomatic Resistance Training** | Level B
Meaningful but requires 8+ weeks of training AND prior fat loss to be visible. Best results when started at Day 30 after initial deficit. 6–8% CSA increase in zygomaticus major by Day 90. The highest-ceiling structural soft-tissue modifier available non-surgically.

**Rank 8 — T1-P03: Bilateral Masticatory Habituation** | Level B
Addresses a real and surprisingly common driver of facial asymmetry (92.1% of people affected). Low effort, continuous habit change, meaningful long-term payoff. 90-day ceiling is modest.

**Rank 9 — T1-P07: Sodium Reduction** | Level C
Well-established mechanism, zero quantified facial effect size. Meaningful adjunct to fat loss by reducing overlying edema.

**Rank 10 — T1-P05: Orbicularis Oculi Tension Control** | Level C
Only available non-surgical approach to canthal tilt appearance. Evidence is weak but mechanism is plausible and risk is low.

**Rank 11 — T1-P11: Gua Sha** | Level B
2–3 mm contour reduction in women only. No male data. Modest, transient effect. Useful as a low-effort adjunct.

**Rank 12 — T1-P12: Hydration Optimization** | Level C
Least impactful. Include only as a baseline hygiene recommendation, not as a protocol centerpiece.

---

## SECTION 4 — NON-SURGICAL CEILINGS PER VARIABLE

| Variable | Modifiable Component | Non-Surgical Ceiling | Structural Ceiling |
|----------|---------------------|---------------------|-------------------|
| Facial fat distribution | High | Excellent — direct response to caloric deficit | Buccal fat pad resistant |
| Mandibular definition | Moderate | Good if BF > 15% is the issue; zero if skeletal | Gonial angle, ramus height fixed |
| fWHR | Low | ~3–5% via fat loss (soft tissue only) | Bizygomatic bone width fixed |
| Zygomatic prominence | Moderate | Fat loss reveals + training adds muscle volume | Zygomatic bone projection fixed |
| Facial asymmetry | Low | Muscular/edema component only | Skeletal asymmetry uncorrectable |
| Canthal tilt | Near-zero | Appearance only via T1-P05 | Canthal tendon anchoring fixed |
| Facial thirds | Near-zero | Lower third soft tissue only | Skeletal proportions fixed |
| Skin quality | High | Excellent — Level A interventions available | N/A |

---

## SECTION 5 — OPTIMAL 90-DAY SEQUENCING

### Phase 1 — Weeks 1–4 (Days 1–30): Foundation
**Start immediately:**
- T1-P01 Systemic fat loss (caloric deficit + aerobic training + resistance training)
- T1-P06 Sleep optimization
- T1-P07 Sodium reduction
- T1-P08 Alcohol reduction
- T1-P09 Skincare (tretinoin + sunscreen)
- T1-P10 Posture correction
- T1-P04 Corrective oral posture

**Rationale:** All lifestyle modifications require habit formation. Starting all simultaneously leverages initial motivation. Fat loss is the highest-ROI intervention and must begin immediately. Skincare takes 12 weeks to show full effect — start ASAP. **Do NOT start T1-P02 yet** — fat must deflate first to avoid chipmunk effect.

**Day 30 checkpoint:** Photo analysis. If facial fat reduction is visible and user has entered "pseudoptosis phase" (deflated fat compartments), activate Phase 2.

---

### Phase 2 — Weeks 5–8 (Days 30–60): Refinement
**Add:**
- T1-P02 Zygomatic/midface resistance training (30 min daily)
- T1-P03 Bilateral masticatory habituation (if asymmetry noted at Day 30)
- T1-P05 Orbicularis oculi training (if canthal tilt is a concern)

**Continue all Phase 1 practices.**

**Rationale:** Fat has been reduced sufficiently for muscle hypertrophy to be visible. Tretinoin begins showing initial effects at ~12 weeks. Aerobic training can increase to 225–300 min/week if fat loss plateau is encountered.

---

### Phase 3 — Weeks 9–12 (Days 60–90): Optimization
**Maintain all practices. Optimize:**
- Protein increase to 2.2 g/kg/day to support concurrent recomposition
- T1-P02 shifts to 3–4x/week (every other day) maintenance protocol
- Assess remaining deficiencies: if structural variables (canthal tilt, jaw taper) are still limiting after BF is at target, communicate non-surgical ceiling to user

**Day 90 checkpoint:** Full photo analysis. Variables improved by non-surgical means should be evident. Remaining deficiencies are likely skeletal in origin.

---

### Sequencing Rationale (Critical Rule)
**Fat loss must precede assessment of bone-structure-dependent variables.** A man cannot accurately assess his mandibular definition, zygomatic prominence, or fWHR until he is at a relatively lean body fat level (~12–15%). Attempting to "fix" jawline definition with exercises while carrying 25% BF is addressing the wrong variable. The app should communicate this sequencing clearly to users.

---

## SECTION 6 — KEY SCIENTIFIC CONFLICTS RESOLVED

### Conflict: Does chewing/jaw training build visible masseter mass?

**ChatGPT / Claude position (DEFINITIVE):** The best available RCT is Jung et al. (2024, J Oral Rehabilitation, N=58, 6 months). Result: bite force increased significantly; masseter muscle thickness — NO significant change; mandibular shape — NO significant change. This is Level A negative evidence.

**Gemini / ChatGPT NMES position:** NMES synchronized with chewing in ELDERLY (≥65) produced Cohen's d = 0.6 for masseter thickness (Park 2020). However: population is sarcopenic elderly recovering from atrophy — NOT healthy young adults. Not transferable.

**Resolution for library:** Chewing exercises for visible jaw definition are **NOT included** in the practice library as a recommended practice. The Jung 2024 RCT settles this for healthy adults. TMJ risk (63% report TMD symptoms with >3 hours/day gum chewing) makes the risk-benefit calculation decisively negative.

---

### Conflict: Can collagen supplements improve facial skin?

**Resolution:** Rasool et al. (2025, Am J Medicine, meta-analysis, 23 RCTs, N=1,474) — no significant effect when controlling for industry funding. **Collagen supplements are not included in the practice library.**

---

### Conflict: Does spot reduction of facial fat exist?

**Resolution for Tier 1:** No. Facial fat loss occurs as part of systemic fat loss. The distribution of where fat is lost first is partially genetic and cannot be targeted. T1-P01 is the only evidence-based approach.

*(Note: Tier 2 research by Gemini found Brobakken 2023 suggesting regional bias for abdominal fat with combined aerobic + abdominal endurance training — this is a Tier 2 question, not Tier 1.)*

---

## SECTION 7 — PRACTICES EXPLICITLY REJECTED (Do Not Include in Protocols)

| Practice | Reason | Evidence |
|----------|---------|----------|
| Mewing (skeletal claims) | Zero peer-reviewed studies; AAO rejected; founders lost credentials | Level D |
| Jawline exercisers (Jawzrsize) | Zero independent studies; Jung 2024 RCT showed zero masseter change | Level D |
| Bone smashing | No clinical evidence; real fracture/nerve damage risk | Level D |
| Collagen supplements | Debunked at Level A (Rasool 2025, 23 RCTs) | A (negative) |
| OTC retinol (as skincare centerpiece) | "Very little, if any, trustworthy evidence" (JCAD 2021) | D |
| Facial yoga for jawline definition | Alam 2018 showed jawline did NOT improve significantly; cheek fullness only | C |
| High-resistance gum chewing | Jung 2024 RCT: zero masseter change; 63% TMD risk | A (negative) |

---

*Document compiled from: Claude Tier 1 Research, ChatGPT Tier 1 Research, Gemini Tier 1 Research. Perplexity Tier 1 research addressed tech stack (vision models/APIs) — not practice library. Date: 2026-02-23.*
