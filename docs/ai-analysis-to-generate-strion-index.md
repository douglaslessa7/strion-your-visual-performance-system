# MASTER DOCUMENT: STRION INDEX - VARIABLE MAPPING (VERSION 4.0)

_An exhaustive mapping for aesthetic, health, and performance phenotyping._

## 0. Reliability Gates and Capture Quality

Photos cannot measure biological variables directly; they infer proxies with a margin of error. Therefore, before any scoring, the AI must pass the image through quality "gates". If the photo fails, the AI must reduce the Confidence Interval or request a new capture.

- **0.1 Camera Geometry and Pose:**
  - **Yaw / Pitch / Roll (Head Pose):** Affects symmetry, jaw width, and nose. Measured using `solvePnP` from landmarks.
  - **Focal Length:** Wide-angle selfie lenses distort and enlarge the nose while reducing the jaw and ears. The AI must read the photo's EXIF data or infer distortion based on face size within the frame.
- **0.2 Image Quality Metrics:**
  - **Blur / Sharpness:** Measured via Laplacian variance. Blur artificially hides pores and wrinkles.
  - **Noise and Exposure Clipping:** Low light increases image noise, which the AI might confuse with poor skin texture. Measured via SNR (Signal-to-Noise Ratio) in the skin region.
- **0.3 Occlusions:**
  - Hair covering the forehead/eyebrows, glasses, hands on the face, or a beard covering the jawline. The AI must flag these and down-weight the affected variables.

---

## 1. Facial Analysis: Structure, Dermatology, and Grooming

The face is the strongest overall attractiveness predictor. Extraction is done via 68 to 468+ landmarks using MediaPipe Face Mesh or 3DMM.

### 1.1 Vertical and Horizontal Proportions (Macro Proportions)

- **Averageness (Effect Size d = 1.45):** The single most powerful isolated effect. Measured by projecting the face shape into a latent space and calculating the distance to the demographic mean face.
- **Facial Thirds (Vertical):** The balance between Trichion-Glabella (Upper), Glabella-Subnasale (Middle), and Subnasale-Menton (Lower). Deviations indicate a long midface or a short chin. The ideal global eye-to-mouth distance is exactly **36%** of total facial length.
- **Facial Fifths (Horizontal):** The face width should be approximately 5x the eye width. The ideal interocular distance is **46%** of the face width.
- **Facial Width-to-Height Ratio (fWHR):** Bizygomatic width divided by upper-face height. Highly correlated with perceived dominance, but data on aggression is mixed and varies by population.

### 1.2 Fluctuating Asymmetry and Midline Integrity

- **Global Symmetry (Bilateral):** Measured by the mean absolute deviation (after Procrustes alignment) by mirroring left and right landmarks. Average effect size of r ≈ 0.25.
- **Midline Integrity:** Assesses whether the philtrum, nose tip, chin point, and glabella align on a perfect vertical axis. Deviations here are highly noticeable to human perception.
- **Feature-Level Asymmetry:** The AI must analyze left-right deltas in eye height, canthal tilt, nasal axis, nostril size, and mouth corner height. Severe penalty thresholds: Eyelids (2 mm), mouth (3 mm), nose (4 mm).

### 1.3 Midface, Jaw, Chin, and Malar Projection

- **Jaw Width and Shape:** Bigonial width and frontal jawline curvature act as masculinity metrics.
- **Chin Projection (Pogonion) and Profile:** Projection relative to the vertical facial plane and mentolabial angle (ideal between 107° and 118°). A reduction of -2.5mm drastically affects the score.
- **Facial Adiposity (Leanness Cues):** The best isolated predictor of health. Measured via cheek-to-jaw contour curvature, lower-face width, and submental angle/shadow (double chin), requiring lighting normalization.
- **Malar Projection and Midface Fullness (The Ogee Curve):**
  - **Definition & Distinction:** The critical distinction the AI must make is between bone width and tissue projection. While fWHR measures the fixed bizygomatic skeletal width in the frontal plane, "Malar Projection" measures the anterior volume (soft tissue overlying the zygomatic bone) in the sagittal and oblique planes. In facial aesthetics, this is represented by the Ogee Curve — an architectural double "S" line that, in a well-developed face, flows convexly over the zygomatic eminence and dips concavely into the buccal/lower midface region before meeting the jawline.
  - **Computational Extraction (Frontal Photometry):** Since the AI cannot measure 3D depth with millimeter precision from a native 2D frontal image, it must utilize photometric analysis based on Specular Highlights. The AI segments the malar region: a flat or deflated midface will present a diffuse, low-intensity light reflection. A high, well-developed malar projection will create concentrated, high-intensity specular peaks on the cheekbones, validating soft tissue volume.
  - **Computational Extraction (Profile/Semi-Profile Landmarks):** Using landmarks (e.g., MediaPipe), the AI extracts the contour line from the external canthus to the oral commissure. A linear or sunken contour (lack of convexity in the Ogee Curve) generates a low "Midface Fullness Score," regardless of whether the frontal fWHR width is high.
  - **Protocol Mapping Trigger:** It is this exact variable (Malar Projection/Ogee Curve) — and not fWHR — that must trigger the prescription of practices T1-P02 (Targeted Zygomatic Resistance Training) and T1-P11 (Gua Sha), ensuring the AI focuses on muscular/soft-tissue volume gain where bone structure permits.

---

### 1.4 Periorbital Region (Eyes), Nose, and Lips

- **Eyes and Eyelids (Palpebral Fissure):** The AI maps eye width/height (Eye Aspect Ratio) and Scleral Show (inferior sclera exposure). The ideal male Canthal Tilt is positive (1° to 2°), measured by the arctangent of canthi coordinates.
- **Under-Eye Quality:** The AI segments the region to measure dark circles (chromatic shift to blue/purple/brown), tear trough depth proxy via shadow geometry, and puffiness (edema) via bulge contours.
- **Nose:** Tip projection, presence of a dorsal hump (profile curvature), and nostril symmetry.
- **Mouth and Expression:** Upper-to-lower lip ratio, vermilion area divided by lower-face area, and mouth corner tilt (neutral vs. downturned, which severely affects perceived affect and sociability).

### 1.5 Skin and Dermatological Markers (Pixel-Level)

- **Color Transformation (CIELAB):** The AI converts the image to the CIELAB color space to measure ΔE variation. It rewards homogeneous redness (a* axis, vascularization) and yellowness (b* axis, carotenoids).
- **Uniformity and Dyschromia:** Skin segmentation to detect clustered high-ΔE patches (hyperpigmentation, erythema/redness, and post-acne marks).
- **Texture and Pores (Frequency):** Measured through GLCM entropy, contrast, and multi-scale wavelet analysis. Pore visibility is calculated by the high-frequency dot pattern band energy.
- **Acne and Scars:** Active detection of lesions (papules/pustules) and texture classification for atrophic scars.
- **Hydration vs. Oiliness:** Oiliness is assessed by mapping specular hotspots on the T-zone. Dehydration is read via micro-lines and dullness (low specular highlights with high texture).
- **Aging Indicators:** Detection of periorbital wrinkle ridges and nasolabial fold depth.

### 1.5.1 Fitzpatrick Phototype Calibration & Hardware Limitations (The Fitzpatrick Gate)

- **Skin Tone Latent Classification (The Fitzpatrick Gate):** Before the AI can reliably evaluate pixel-level dyschromia, erythema, or contrast-dependent variables, it must mathematically classify the user's baseline skin tone into a computational proxy of the Fitzpatrick scale (Types I through VI). This classification does not serve as a score, but as a **hard routing gate** that dictates which visual algorithms are permitted to run and which must be suppressed to avoid false data generation.
- **The Erythema (FR) Blindspot (Fitzpatrick V-VI Hard Block):** `[CRITICAL ARCHITECTURAL CONSTRAINT]` The AI must programmatically disable the Facial Redness (FR) optimization scoring and detection pipeline for users identified as Fitzpatrick V and VI. In melanin-rich skin, the high concentration of epidermal melanin completely masks the underlying hemoglobin color signal. If the algorithm attempts to measure the a\* (red/green) axis in the CIELAB color space for these users, it will yield statistically invalid data, drastically reducing the AUROC reliability. Consequently, the AI is strictly prohibited from prescribing practices targeting FR (e.g., rosacea protocols, acute post-shave erythema evaluation) based on 2D photography for Fitzpatrick V-VI profiles.
- **STU Contrast Recalibration (PIH vs. Baseline):** For the evaluation of Post-Inflammatory Hyperpigmentation (PIH) and overall Skin Tone Uniformity (STU), the AI must dynamically recalibrate its contrast-detection thresholds based on the initial Fitzpatrick Gate. PIH presents with maximum photographic contrast against the background skin in Fitzpatrick III and IV. However, it presents with exceedingly low contrast in Fitzpatrick I (where erythema is dominant) and Fitzpatrick VI (where the hyperpigmentation blends with the high baseline melanin). The AI must adjust its Confidence Interval (CI) inversely to the contrast threshold, preventing the system from falsely scoring a Fitzpatrick VI user as having "perfect STU" simply because the camera sensor lacked the dynamic range to separate the PIH from the baseline skin tone.

### 1.5.2 Acne Subtype Topographic Differentiation (ACL-C vs. ACL-I vs. ACL-N)

The AI cannot aggregate all blemishes into a single "Acne Lesion Count." Because the STRION protocol mandates entirely divergent chemical treatments based on the lesion's etiology (e.g., BHA for comedones vs. BPO/Azelaic Acid for inflammation), the computer vision pipeline must topologically map, segment, and strictly classify every detected lesion into one of three categories:

- **Comedonal (ACL-C):** The AI scans for micro-topographic irregularities (elevations representing closed comedones/whiteheads) or pinpoint dark follicular plugs (open comedones/blackheads) that strictly lack surrounding erythema. The absence of a vascular/inflammatory response in the surrounding pixels is the defining computational marker. This detection routes the LLM to Salicylic Acid (BHA) and AHA exfoliant pathways.
- **Inflammatory (ACL-I):** The AI detects these lesions through a dual-verification process: focal erythema (a spike in the a\* redness channel) surrounding a raised topographic elevation (papule), or a central high-luminance, yellow/white accumulation indicating leukocytic pus (pustule). This detection is the mandatory trigger for Benzoyl Peroxide (BPO), Azelaic Acid, and targeted topical anti-inflammatory protocols.
- **Nodular/Cystic (ACL-N) & The Medical Gateway:** `[SAFETY PROTOCOL]` If the AI detects an inflammatory lesion with a diameter exceeding the 10mm threshold, or multiple deeply contiguous inflammatory clusters that distort the underlying facial geometry, it must classify them as ACL-N. This classification triggers an absolute programmatic hard-block for cosmetic acne protocol generation. It forces the system to output a clinical referral disclaimer, bypassing all OTC (Over-The-Counter) active ingredient recommendations for those specific lesions.

### 1.6 Grooming (Hair, Beard, and Eyebrows)

- **Hair (Hairline and Density):** Hairline position (Trichion-Glabella distance / total face height). Detection of M-shaped recession (Norwood scale) and proxies for crown thinning and scalp show-through. Maintenance evaluates frizz and uneven edges.
- **Beard and Facial Hair:** Mapped by coverage, density (opacity), neckline/cheek line precision, symmetry, and length category. Preference is frequency-dependent (culture/time trends), with _heavy stubble_ being the overall peak in the literature.
- **Eyebrows:** Thickness (~25% of the eye width is ideal), density, arch height, interbrow distance, and grooming cleanliness. The AI uses a skeleton curve fit on the segmentation.

---

## 2. Body Analysis: Anthropometry, Musculature, and Posture

Body extraction is done via OpenPose/BlazePose (17 to 33+ keypoints) for angles, and segmentation silhouettes to estimate circumferences. Optionally, a 3D SMPL model is fitted to deduce volume.

### 2.1 Silhouette Ratios (Scientifically Anchored)

- **Waist-to-Chest Ratio (WCR):** The primary determinant of women's ratings of male bodily attractiveness (explains 56% of the variance). Ideal between 0.70 and 0.75. The AI segments the torso silhouette and converts 2D widths into proxy circumferences via learned calibration.
- **Shoulder-to-Waist Ratio (SWR):** Biacromial width divided by the waist. The classic V-Taper (ideal ~1.6).
- **The BMI Problem:** Not directly measurable from photos and conflates muscle with fat. Silhouette-derived WCR and SWR are orders of magnitude more actionable and stable.
- **Waist-to-Hip Ratio (WHR) and Pelvic-Lumbar Proportions:** While WCR and SWR dominate the upper-body attractiveness variance, WHR is the critical diagnostic metric for assessing central adiposity, pelvic structure, and overall systemic health. The ideal male WHR is ~0.90.
  - _Landmark Mapping:_ The AI calculates this ratio by identifying and extracting two distinct horizontal axes from the segmentation data:
    - _Waist Minimum (Numerator):_ The narrowest horizontal circumference proxy, typically located just above the umbilicus and below the inferior border of the rib cage in the frontal silhouette.
    - _Hip Maximum (Denominator):_ The widest horizontal circumference proxy at the pelvic region. The AI must cross-reference the frontal silhouette with the sagittal silhouette to locate the level of the greater trochanters and the maximum posterior projection of the gluteus maximus.
  - _Adiposity Phenotyping:_ Deviations significantly above the 0.90 threshold strongly flag the accumulation of android (central) fat. This measurement acts as a hard constraint, mandating a reprioritization of the user's protocol toward structured aerobic output and systemic deficit before any localized hypertrophy interventions are recommended.

### 2.2 Muscle Mass Distribution (Region-by-Region Assessment)

Each group is scored by size, shape, separation, symmetry, and proportion to the structural frame:

- **Anterior (Front):** Deltoids (cap roundness), Chest (upper vs. lower fullness), Arms (biceps/triceps fullness), Forearms (thickness), Abs/Obliques visibility, Quad sweep, and Calves.
- **Posterior (Back):** Traps, Rear deltoids, Lats (width and flare), Mid-back thickness, Spinal erector definition, Glutes (upper/lower fullness), Hamstrings (tie-in), and Calves.
- **Definition Markers:** Muscle striations on the chest/shoulders, vascularity, and lower-back "Christmas tree" separation. Read via edge-density and oriented texture statistics.
- **Body Fat Tiers:** The AI categorizes into categorical leanness "Tiers" (e.g., stages 1-7) based on abdominal definition and vascularity, rather than a rigid percentage, given lighting variations in 2D photos.
- - **Sagittal Abdominal Diameter (SAD) vs. Frontal Definition (Visceral & TrA Diagnostics):** To accurately prescribe precise abdominal interventions (e.g., neuromuscular transversus abdominis control vs. systemic caloric deficit), the AI must execute a logical cross-reference between the frontal definition and the side-profile protrusion.
  - _Frontal Definition Proxy:_ The AI scans the abdominal region in the frontal photo for high-frequency edge density, analyzing the visibility of the linea alba and the tendinous inscriptions of the rectus abdominis. This serves as the primary proxy for subcutaneous leanness.
  - _Sagittal Abdominal Diameter (SAD):_ In the side-profile photo, the AI measures the maximum horizontal distance from the small of the back (lumbar curve) to the furthest anterior point of the abdominal wall.
  - _Diagnostic Logic Gates:_
    - _High Frontal Definition + High SAD (Protrusion):_ The user presents low subcutaneous fat but significant abdominal distension. The AI flags this as either Transversus Abdominis (TrA) neuromuscular weakness or elevated Visceral Adipose Tissue (VAT). This strictly triggers targeted interventions (e.g., Stomach Vacuum / Tonal Corset training) and sleep optimization protocols.
    - _Low Frontal Definition + High SAD:_ Standard compound adiposity (subcutaneous + visceral). This triggers primary systemic deficit and aerobic protocols; it strictly inhibits neuromuscular TrA interventions until body fat drops below the 20% threshold.
    - _Low Frontal Definition + Low SAD:_ The classic "skinny-fat" or under-muscled phenotype. This triggers body recomposition protocols prioritized over aggressive caloric deficits.
- - **Cervical/Neck Hypertrophy and Width (Frontal & Sagittal Extraction):** Neck circumference is a primary evolutionary cue for perceived physical dominance and formidability (explaining significant variance in upper-body attractiveness, per Sell et al., 2017). The AI must evaluate the cervical musculature independently of the user's shoulder width or overall body fat.
  - _Frontal Cervical Width (Formidability Proxy):_ The AI must extract the horizontal neck diameter at the level of the cricoid cartilage from the frontal segmentation silhouette.
  - _Neck-to-Jaw Ratio:_ The AI compares the extracted cervical width to the Bigonial Width (jawline). The ideal proxy for maximum masculine formidability is a 1:1 ratio (where the neck width equals or slightly exceeds the jaw width). A significant negative deviation heavily penalizes the perceived upper-body strength score.
  - _Sagittal Depth and Musculature:_ In the side-profile image, the AI measures the anterior-posterior depth of the neck. It utilizes edge-detection and shadow mapping to assess the hypertrophy of the sternocleidomastoid (SCM) and splenius capitis muscles.
  - _Isolation from Posture:_ This volumetric measurement must be strictly isolated from the Cervical Vertebral Angle (Forward Head Posture). A user may possess significant cervical hypertrophy but poor alignment; the AI must parse the structural mass independently of the cervical spine geometry.

### 2.3 Posture, Alignment, and Symmetry (Front/Side/Back)

- **Scoliosis Risk Flag and Absolute Protocol Contraindication (Safety Gateway):**
  - **Architectural Purpose:** The AI must establish a strict safety gateway before generating any functional postural prescription. Specifically, the system must differentiate between functional postural deviations (which are actionable via the STRION 90-day protocol) and structural pathological deviations (which require absolute contraindication for specific practices, such as `T3-P12 — Dead Hang`).
  - **Computational Extraction (Posterior View):** To accurately flag potential structural scoliosis (curves exceeding functional ranges, typically >15-20° Cobb angle proxy), the computer vision pipeline must actively scan the posterior/dorsal photograph for the "Structural Triad of Lateral Deviation." This is executed by mapping specific bilateral landmarks and assessing their spatial relationships against a true vertical/horizontal grid.
    - _Metric 1: Shoulder Level Asymmetry (Acromial Elevation):_ The AI extracts the y-axis coordinates of the left and right Acromion processes. A vertical delta (Δ) exceeding predefined normative thresholds (e.g., >1.0 to 1.5 cm difference in apparent height, adjusting for pixel-to-cm camera distance estimation) constitutes the first flag.
    - _Metric 2: Pelvic Obliquity (Iliac Crest Elevation):_ The AI extracts the y-axis coordinates of the left and right posterior superior iliac spines (PSIS) or the highest visible points of the iliac crests via silhouette segmentation. A horizontal tilt deviation (>3-5 degrees from the true horizontal plane) constitutes the second flag.
    - _Metric 3: Lateral Deviation of the Spinal Furrow:_ Using shadow mapping and edge-detection along the dorsal midline, the AI traces the path of the spinous processes from C7 down to L5. Instead of a linear vertical drop, a detected 'C' or 'S' curvature pattern crossing the central longitudinal axis constitutes the third and most critical flag.
  - **Actionable Routing & Hard Block:**
    - If the AI detects a high-confidence positive on the Spinal Furrow deviation (Metric 3), either in isolation or combined with Metrics 1 and 2, the system triggers a `STRUCTURAL_REFERRAL_FLAG`.
    - This flag implements a programmatic hard block at the LLM protocol generation phase. It absolutely prohibits the inclusion of spinal traction exercises (e.g., `T3-P12 — Dead Hang`) and replaces them with a mandatory medical referral disclaimer, stating: _"STRION has detected asymmetrical structural patterns that fall outside the scope of functional correction. High-load spinal traction is contraindicated. Please consult a physiotherapist or orthopedic specialist."_
- **Head and Neck:** Forward Head Posture (ear anterior to shoulder in side view). Cervical angle proxy.
- - **Frontal Cervical Alignment and Lateral Head Tilt (Frontal View):**
  - **Architectural Purpose:** While the Cervico-Vertebral Angle (CVA) measures Forward Head Posture exclusively in the sagittal plane (side profile), the AI must also evaluate cervical symmetry in the coronal/frontal plane. Chronic lateral head tilt indicates unilateral hypertonicity (e.g., overactive upper trapezius, levator scapulae, or sternocleidomastoid on one side) and disrupts the perceived facial symmetry and overall upper-body formidability.
  - **Computational Extraction:**
    - _Interpupillary Axis Alignment:_ The AI utilizes the high-density facial mesh (e.g., MediaPipe Face Mesh) to extract the center coordinates of the left and right pupils. It calculates the line connecting these two points and measures its angular deviation relative to the true horizontal plane of the image frame.
    - _Glabella-Gnathion Vertical Axis:_ Simultaneously, the AI maps the midline of the face by drawing a vector from the Glabella (center of the brow ridge) down to the Gnathion (lowest point of the chin). The system measures the angle of this vector against the true vertical axis.
    - _Shoulder Baseline Cross-Reference:_ To ensure the head tilt is an isolated cervical deviation and not a result of the user leaning their entire torso, the AI cross-references the interpupillary tilt angle with the biacromial (shoulder) tilt angle.
  - **Diagnostic Thresholds and Protocol Triggers:**
    - An isolated lateral head tilt deviation exceeding 3 degrees from the true vertical/horizontal axes is flagged as a clinically significant postural asymmetry.
    - _Actionable Routing:_ Detection of a >3° tilt automatically triggers the prescription of unilateral functional release protocols on the elevated/shortened side, alongside the integration of secondary balance and proprioceptive training practices (`T3-P13 — Balance Training`) to reset the user's internal vestibular and visual "neutral" resting state.
- **Thorax and Shoulders (RSP Quantification):**
  - **Architectural Purpose:** Rounded/protracted shoulders cannot be evaluated as a binary "yes/no" condition. Because the Tier 3 STRION protocol sets precise numerical targets for practice progression (e.g., optimal is 4–6 cm; moderate is 8.1–10 cm), the AI must possess a mathematically defensible method to extract this exact distance in centimeters from a 2D photograph.
  - **Computational Extraction (Posterior/Dorsal View):**
    - _Landmark Identification:_ The AI relies on the posterior body photograph. Using advanced pose estimation models (e.g., OpenPose or BlazePose), it must pinpoint two highly specific anatomical markers on the dominant and non-dominant sides:
      1.  The **C7 Spinous Process** (the most prominent vertebra at the base of the neck, serving as the static medial anchor).
      2.  The **Posterior-Lateral Border of the Acromion** (the outermost bony tip of the shoulder blade, serving as the mobile lateral anchor).
    - _2D to Centimeter Projection (The Calibration Challenge):_ To output a value in centimeters (e.g., "Your RSP is 8.5 cm"), the AI must convert pixel distance into real-world metrics. It achieves this by estimating the user's absolute dimensions using known reference proxies (such as standard head height or user-inputted body height) to establish a pixels-per-centimeter (px/cm) ratio for the specific image.
    - _Distance Calculation:_ The system calculates the projected horizontal distance between the C7 coordinate and the Acromion coordinate. A distance significantly exceeding the normative 4–6 cm baseline indicates anterior displacement (protraction) of the scapula over the thoracic rib cage.
  - **Secondary Scapular Dysfunction Metrics:**
    - _Scapular Winging Proxies:_ In addition to the C7-Acromion distance, the AI scans the posterior topography using shadow mapping and specular highlights. Abrupt, high-contrast shadows along the medial border or the inferior angle of the scapula indicate scapular winging (loss of serratus anterior and lower trapezius control), further validating the severity of the RSP diagnosis and prioritizing serratus-activation practices (e.g., `T3-P10 — Wall Angels`).
- **Spinal Curves and Pelvis:** Thoracic kyphosis (upper-back rounding) and lumbar lordosis. Anterior Pelvic Tilt proxy (inferred from the waistband line + lumbar curve + glute projection).
- **Knees/Feet:** Knee valgus/varus (kneecap alignment relative to hip/ankle) and foot pronation.
- **Body Symmetry:** Region width comparisons (left arm vs. right arm, left lat flare vs. right). Severe asymmetries diminish the athletic look.

---

## 3. STRION Computational Architecture (Execution Pipelines)

To implement this commercially, the AI will run on these exact sequential pipelines:

### 3.1 Face Pipeline

1. Face Detection (RetinaFace-like).
2. Landmarking (68 to 1000 points extraction).
3. Alignment and Pose Normalization.
4. Geometric Feature Extraction (Ratios/Angles).
5. Skin Segmentation and Artifact Removal (ignore beard and eyebrow pixels).
6. Skin Feature Extraction (Texture/Color via CIELAB/GLCM).
7. **Computational Differentiation Matrix: Adiposity vs. Edema (The Periorbital Proxy Rule)**
   - **The Biological Constraint:** The AI cannot determine systemic body fat percentage (BF%) with absolute clinical precision using only a facial photograph. This creates a severe risk of the AI confusing Structural Subcutaneous Adiposity (which requires the T1-P01 Systemic Fat Loss recommendation) with Transient Interstitial Fluid Retention/Edema (which requires the T1-P07 Sodium Reduction or T1-P08 Alcohol Reduction recommendation).
   - **The Proxy Protocol (Ground Truth):** To resolve this computational ambiguity, the AI is programmed to utilize the periorbital region (upper and lower eyelids) as the definitive proxy for inflammation and edema. Biologically, adipose tissue (subcutaneous fat) does not accumulate in thick volumes on the eyelids; however, interstitial fluid accumulates rapidly there due to the extreme thinness of periorbital skin and the laxity of the underlying connective tissue.
   - **Execution Logic (Boolean Trigger via Segmentation):** The AI cross-references lower face contour data with periorbital segmentation:
     - **Condition A (Adiposity Dominant):** IF the lower third bounding box indicates high volume (rounded/obscured mandibular curvature) AND the periorbital segmentation shows taut skin, visible bone contour, or deep tear troughs (absence of fluid pockets/edema), THEN the system classifies the facial volume as Adiposity. Primary protocol triggered: T1-P01.
     - **Condition B (Edema/Inflammation Dominant):** IF the lower third bounding box indicates high volume AND the periorbital segmentation detects significant puffiness (edema measured via shadow geometry, tissue bulging, and chromatic shift), THEN the system classifies a significant portion of that facial volume as Fluid Retention. Primary protocols triggered: T1-P07, T1-P08, and T1-P06.
8. **Multimodal Data Integration (The "Blindspot" Resolution Pipeline)**
   To maintain scientific validity and defensibility, the computer vision pipeline must be programmed to recognize the absolute physical limits of 2D RGB imaging. When a variable cannot be accurately quantified via pixels, the AI must halt the visual estimation and fuse the partial photographic data with user-input proxy data (Hybrid Logic Gates) before generating the final Optimization Score.
   - **Hybrid Gate 1: Periocular Etiology (PA-P vs. PA-V vs. PA-S):**
     - _Visual Extraction:_ The AI extracts the chromatic shift in the periorbital region (detecting blue/purple vs. brown/black pixels) and maps the structural geometry (using shadow depth to detect a tear trough hollow).
     - _System Limitation:_ A 2D photograph cannot perform the clinical "pinch test" (stretching the skin to see if the darkness dissipates) to definitively separate vascular pooling (PA-V) from structural shadowing (PA-S).
     - _Prompt Trigger & Data Fusion:_ If the AI detects dark circles yielding a penalty score greater than 4, the application must temporarily halt the final scoring and push a mandatory micro-questionnaire to the user interface: _"1. Are your dark circles mostly brown, or blue/purple? 2. Do they visibly improve when you are well-rested? 3. Is there a physical indentation or hollow under your eyes?"_ The AI then fuses the NLP (Natural Language Processing) text response with the visual segmentation data to classify the exact etiology, ensuring the LLM routes the user to the correct topical active (e.g., Niacinamide for pigmentary PA-P, vs. Caffeine for vascular PA-V).
   - **Hybrid Gate 2: Surface Shine (SSh) vs. Lighting Specularity:**
     - _System Limitation:_ Specular reflection on a 2D photograph is entirely dictated by the intensity, angle, and proximity of the ambient light source (e.g., a bare lightbulb vs. a clouded window). Relying purely on pixel luminance to estimate Sebumeter-equivalent output will mathematically result in critical failure.
     - _Prompt Trigger & Data Fusion:_ To track Surface Shine accurately, the AI must prompt the user to execute the "Blotting Paper Proxy" protocol. The user photographs a standard sebum blotting paper pressed to their forehead against a white background. The AI then runs segmentation and opacity analysis exclusively on the blotting paper's oil saturation pattern, completely bypassing all facial lighting confounders to quantify true sebum output.
   - **Hybrid Gate 3: Skin Hydration (SH) Invisibility:**
     - _System Limitation:_ The water content of the stratum corneum (measured clinically via Corneometer capacitance) is completely invisible to RGB smartphone cameras until the user reaches a state of severe clinical dehydration (manifesting as gross macroscopic flaking and dehydration lines).
     - _Prompt Trigger & Data Fusion:_ Hydration optimization must be routed purely through a subjective comfort questionnaire (e.g., _"How tight or dry does your skin feel after cleansing?"_). The AI is instructed to ignore visual hydration estimation entirely unless the edge-detection algorithms pick up severe epidermal flaking.
9. **Facial Hair Microenvironment Routing (The BEARD_PRESENT Boolean)**
   - **Beard Detection and Masking:** The AI must run a high-density segmentation mask over the lower third of the face (mandible, chin, upper lip, neck) to identify the presence and density of facial hair.
   - **Boolean Trigger (`BEARD_PRESENT`):** If the detected hair density obscures the underlying skin surface, the AI cannot simply "ignore" the pixels. It must actively trigger the boolean `BEARD_PRESENT = TRUE`. This executes two mandatory architectural shifts:
     1. _Confidence Interval Override:_ It forces the Confidence Interval (CI) to zero for acne (ACL) and texture (ST) mapping strictly within the covered coordinates. This prevents the system from generating false negatives (assuming the skin is clear just because it is hidden).
     2. _Protocol LLM Routing:_ It acts as the direct trigger for the `T4-P30 (Beard Skin Management)` protocol. It forces the LLM to fork the protocol generation, shifting the prescription from standard facial cleansers to follicular-penetrating, beard-specific protocols (e.g., instructing the use of BHA or Niacinamide serums that can penetrate the hair channel, and mandating mechanical beard cleansing).
10. _Optional_: 3DMM fit for stable shape features.
11. Scoring Model (Regression/Ranking/Classification) + Uncertainty.

### 3.2 Body Pipeline (Updated Execution Architecture)

1. **Person Detection:** Bounding box extraction utilizing a robust architecture (e.g., YOLOv8) to isolate the user from the background.
2. **Pose Estimation:** 33+ keypoint extraction via BlazePose or OpenPose to map skeletal joints, limbs, and critical angles.
3. **Segmentation:** High-precision background removal and distinct silhouette extraction for the Torso, Limbs, and Pelvic regions.
4. **Width/Ratio Measurements:** Calculation of horizontal spans at normalized body heights to establish WCR, SWR, WHR, and Neck-to-Jaw ratios.
5. **Optional - SMPL Body Fit:** 3D mesh projection for volumetric and shape inference to bypass 2D lens distortion and improve circumference estimations.
6. **Posture Metrics:** Angle calculation for Cervical Vertebral Angle (FHP), thoracic kyphosis, and pelvic tilt.
7. **Phenotype & Profile Classification Gateway (CRITICAL STEP):** Before generating the final optimization score, the AI must categorize the user's structural and compositional state. This metadata is strictly required to route the correct protocol logic.
   - _Structural Phenotype:_ Proximity mapping to Ectomorph, Mesomorph, or Endomorph baselines using bone-to-mass ratios.
   - _Actionable Profile Routing:_ The AI strictly assigns a logic gate tag based on the extracted data (e.g., `PROFILE_A: BF > 25%` or `PROFILE_B: Trained/Lean`). This acts as the absolute source of truth for the LLM protocol generator, preventing contradictory prescriptions (e.g., prescribing a caloric surplus to an Endomorph with high central adiposity).
8. **Score Aggregation:** Final computation of the baseline STRION Index and the actionable Optimization Score, coupled with the Confidence Interval metric based on photo capture quality.

---

## 4. Aggregation Structure, Weighting, and Product

The document reinforces the need to anchor the app's ethics and scientific defensibility by grouping variables based on their actionability.

- **The Core Weighting Rule:** The Global Score must place a higher weight on **Face > Body** for overall perceived attractiveness (consistent with Currie & Little), but STRION will allow the user to adjust this emphasis based on context (e.g., professional vs. short-term dating focus).
- **Product Positioning:** STRION generates an **"Optimization Index + Confidence Interval"**, rather than dictating an "absolute truth" of beauty.
- **Demographic Calibration:** The AI adjusts penalties to avoid bias against different skin tones, lighting conditions, or hair types.
- **Actionability Map (ROI-Ranked Levers):** The app will guide the user through the highest Return on Investment levers:
  - _Highly Changeable (Days/Weeks):_ Skin clarity, grooming (beard/hair), and immediate posture.
  - _Moderately Changeable (Months-Years):_ WCR/SWR via hypertrophy and fat loss, which also results in reduced facial adiposity.
  - _Mostly Fixed:_ Craniofacial geometry, height, and clavicle width. (These establish the "baseline" and should not be optimization targets for the AI).
