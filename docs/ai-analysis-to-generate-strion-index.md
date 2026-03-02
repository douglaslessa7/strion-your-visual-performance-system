# MASTER DOCUMENT: STRION INDEX - VARIABLE MAPPING (VERSION 4.0)
*An exhaustive mapping for aesthetic, health, and performance phenotyping.*

## 0. Reliability Gates and Capture Quality
Photos cannot measure biological variables directly; they infer proxies with a margin of error. Therefore, before any scoring, the AI must pass the image through quality "gates". If the photo fails, the AI must reduce the Confidence Interval or request a new capture.

* **0.1 Camera Geometry and Pose:**
  * **Yaw / Pitch / Roll (Head Pose):** Affects symmetry, jaw width, and nose. Measured using `solvePnP` from landmarks.
  * **Focal Length:** Wide-angle selfie lenses distort and enlarge the nose while reducing the jaw and ears. The AI must read the photo's EXIF data or infer distortion based on face size within the frame.
* **0.2 Image Quality Metrics:**
  * **Blur / Sharpness:** Measured via Laplacian variance. Blur artificially hides pores and wrinkles.
  * **Noise and Exposure Clipping:** Low light increases image noise, which the AI might confuse with poor skin texture. Measured via SNR (Signal-to-Noise Ratio) in the skin region.
* **0.3 Occlusions:**
  * Hair covering the forehead/eyebrows, glasses, hands on the face, or a beard covering the jawline. The AI must flag these and down-weight the affected variables.

---

## 1. Facial Analysis: Structure, Dermatology, and Grooming
The face is the strongest overall attractiveness predictor. Extraction is done via 68 to 468+ landmarks using MediaPipe Face Mesh or 3DMM.



### 1.1 Vertical and Horizontal Proportions (Macro Proportions)
* **Averageness (Effect Size d = 1.45):** The single most powerful isolated effect. Measured by projecting the face shape into a latent space and calculating the distance to the demographic mean face.
* **Facial Thirds (Vertical):** The balance between Trichion-Glabella (Upper), Glabella-Subnasale (Middle), and Subnasale-Menton (Lower). Deviations indicate a long midface or a short chin. The ideal global eye-to-mouth distance is exactly **36%** of total facial length.
* **Facial Fifths (Horizontal):** The face width should be approximately 5x the eye width. The ideal interocular distance is **46%** of the face width.
* **Facial Width-to-Height Ratio (fWHR):** Bizygomatic width divided by upper-face height. Highly correlated with perceived dominance, but data on aggression is mixed and varies by population.

### 1.2 Fluctuating Asymmetry and Midline Integrity
* **Global Symmetry (Bilateral):** Measured by the mean absolute deviation (after Procrustes alignment) by mirroring left and right landmarks. Average effect size of r ≈ 0.25.
* **Midline Integrity:** Assesses whether the philtrum, nose tip, chin point, and glabella align on a perfect vertical axis. Deviations here are highly noticeable to human perception.
* **Feature-Level Asymmetry:** The AI must analyze left-right deltas in eye height, canthal tilt, nasal axis, nostril size, and mouth corner height. Severe penalty thresholds: Eyelids (2 mm), mouth (3 mm), nose (4 mm).

### 1.3 Lower Third, Jaw, and Chin
* **Jaw Width and Shape:** Bigonial width and frontal jawline curvature act as masculinity metrics.
* **Chin Projection (Pogonion) and Profile:** Projection relative to the vertical facial plane and mentolabial angle (ideal between 107° and 118°). A reduction of -2.5mm drastically affects the score.
* **Facial Adiposity (Leanness Cues):** The best isolated predictor of health. Measured via cheek-to-jaw contour curvature, lower-face width, and submental angle/shadow (double chin), requiring lighting normalization.

### 1.4 Periorbital Region (Eyes), Nose, and Lips
* **Eyes and Eyelids (Palpebral Fissure):** The AI maps eye width/height (Eye Aspect Ratio) and Scleral Show (inferior sclera exposure). The ideal male Canthal Tilt is positive (1° to 2°), measured by the arctangent of canthi coordinates.
* **Under-Eye Quality:** The AI segments the region to measure dark circles (chromatic shift to blue/purple/brown), tear trough depth proxy via shadow geometry, and puffiness (edema) via bulge contours.
* **Nose:** Tip projection, presence of a dorsal hump (profile curvature), and nostril symmetry.
* **Mouth and Expression:** Upper-to-lower lip ratio, vermilion area divided by lower-face area, and mouth corner tilt (neutral vs. downturned, which severely affects perceived affect and sociability).

### 1.5 Skin and Dermatological Markers (Pixel-Level)
* **Color Transformation (CIELAB):** The AI converts the image to the CIELAB color space to measure ΔE variation. It rewards homogeneous redness (a* axis, vascularization) and yellowness (b* axis, carotenoids).
* **Uniformity and Dyschromia:** Skin segmentation to detect clustered high-ΔE patches (hyperpigmentation, erythema/redness, and post-acne marks).
* **Texture and Pores (Frequency):** Measured through GLCM entropy, contrast, and multi-scale wavelet analysis. Pore visibility is calculated by the high-frequency dot pattern band energy.
* **Acne and Scars:** Active detection of lesions (papules/pustules) and texture classification for atrophic scars.
* **Hydration vs. Oiliness:** Oiliness is assessed by mapping specular hotspots on the T-zone. Dehydration is read via micro-lines and dullness (low specular highlights with high texture).
* **Aging Indicators:** Detection of periorbital wrinkle ridges and nasolabial fold depth.



[Image of CIELAB color space]


### 1.6 Grooming (Hair, Beard, and Eyebrows)
* **Hair (Hairline and Density):** Hairline position (Trichion-Glabella distance / total face height). Detection of M-shaped recession (Norwood scale) and proxies for crown thinning and scalp show-through. Maintenance evaluates frizz and uneven edges.
* **Beard and Facial Hair:** Mapped by coverage, density (opacity), neckline/cheek line precision, symmetry, and length category. Preference is frequency-dependent (culture/time trends), with *heavy stubble* being the overall peak in the literature.
* **Eyebrows:** Thickness (~25% of the eye width is ideal), density, arch height, interbrow distance, and grooming cleanliness. The AI uses a skeleton curve fit on the segmentation.

---

## 2. Body Analysis: Anthropometry, Musculature, and Posture
Body extraction is done via OpenPose/BlazePose (17 to 33+ keypoints) for angles, and segmentation silhouettes to estimate circumferences. Optionally, a 3D SMPL model is fitted to deduce volume.



### 2.1 Silhouette Ratios (Scientifically Anchored)
* **Waist-to-Chest Ratio (WCR):** The primary determinant of women's ratings of male bodily attractiveness (explains 56% of the variance). Ideal between 0.70 and 0.75. The AI segments the torso silhouette and converts 2D widths into proxy circumferences via learned calibration.
* **Shoulder-to-Waist Ratio (SWR):** Biacromial width divided by the waist. The classic V-Taper (ideal ~1.6).
* **The BMI Problem:** Not directly measurable from photos and conflates muscle with fat. Silhouette-derived WCR and SWR are orders of magnitude more actionable and stable.

### 2.2 Muscle Mass Distribution (Region-by-Region Assessment)
Each group is scored by size, shape, separation, symmetry, and proportion to the structural frame:
* **Anterior (Front):** Deltoids (cap roundness), Chest (upper vs. lower fullness), Arms (biceps/triceps fullness), Forearms (thickness), Abs/Obliques visibility, Quad sweep, and Calves.
* **Posterior (Back):** Traps, Rear deltoids, Lats (width and flare), Mid-back thickness, Spinal erector definition, Glutes (upper/lower fullness), Hamstrings (tie-in), and Calves.
* **Definition Markers:** Muscle striations on the chest/shoulders, vascularity, and lower-back "Christmas tree" separation. Read via edge-density and oriented texture statistics.
* **Body Fat Tiers:** The AI categorizes into categorical leanness "Tiers" (e.g., stages 1-7) based on abdominal definition and vascularity, rather than a rigid percentage, given lighting variations in 2D photos.

### 2.3 Posture, Alignment, and Symmetry (Front/Side/Back)
* **Head and Neck:** Forward Head Posture (ear anterior to shoulder in side view). Cervical angle proxy.
* **Thorax and Shoulders:** Rounded/protracted shoulders, height asymmetry, and scapular winging proxy (visible in back view).
* **Spinal Curves and Pelvis:** Thoracic kyphosis (upper-back rounding) and lumbar lordosis. Anterior Pelvic Tilt proxy (inferred from the waistband line + lumbar curve + glute projection).
* **Knees/Feet:** Knee valgus/varus (kneecap alignment relative to hip/ankle) and foot pronation.
* **Body Symmetry:** Region width comparisons (left arm vs. right arm, left lat flare vs. right). Severe asymmetries diminish the athletic look.

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
7. *Optional*: 3DMM fit for stable shape features.
8. Scoring Model (Regression/Ranking/Classification) + Uncertainty.

### 3.2 Body Pipeline
1. Person Detection.
2. Pose Estimation (OpenPose/BlazePose).
3. Segmentation (Silhouette, Torso, Limbs).
4. Width/Ratio measurements at normalized body heights.
5. *Optional*: SMPL body fit for volume/shape inference.
6. Posture Metrics.
7. Score Aggregation.

---

## 4. Aggregation Structure, Weighting, and Product
The document reinforces the need to anchor the app's ethics and scientific defensibility by grouping variables based on their actionability.

* **The Core Weighting Rule:** The Global Score must place a higher weight on **Face > Body** for overall perceived attractiveness (consistent with Currie & Little), but STRION will allow the user to adjust this emphasis based on context (e.g., professional vs. short-term dating focus).
* **Product Positioning:** STRION generates an **"Optimization Index + Confidence Interval"**, rather than dictating an "absolute truth" of beauty.
* **Demographic Calibration:** The AI adjusts penalties to avoid bias against different skin tones, lighting conditions, or hair types.
* **Actionability Map (ROI-Ranked Levers):** The app will guide the user through the highest Return on Investment levers:
  * *Highly Changeable (Days/Weeks):* Skin clarity, grooming (beard/hair), and immediate posture.
  * *Moderately Changeable (Months-Years):* WCR/SWR via hypertrophy and fat loss, which also results in reduced facial adiposity.
  * *Mostly Fixed:* Craniofacial geometry, height, and clavicle width. (These establish the "baseline" and should not be optimization targets for the AI).
