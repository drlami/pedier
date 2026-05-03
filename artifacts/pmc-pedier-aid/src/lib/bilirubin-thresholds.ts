/**
 * AAP 2022 Neonatal Hyperbilirubinemia Threshold Data — Four Separate Tables
 *
 * Source: Kemper AR, Newman TB, Slaughter JL, et al.
 * Clinical Practice Guideline Revision: Management of Hyperbilirubinemia
 * in the Newborn Infant 35 or More Weeks of Gestation.
 * Pediatrics. 2022;150(3):e2022058864.
 * https://doi.org/10.1542/peds.2022-058864
 *
 * This module implements four distinct published nomogram curves:
 *   Figure 1 — Phototherapy thresholds, NO additional NTX risk factors
 *   Figure 2 — Phototherapy thresholds, ≥1 additional NTX risk factor
 *   Figure 3 — Exchange transfusion thresholds, NO additional NTX risk factors
 *   Figure 4 — Exchange transfusion thresholds, ≥1 additional NTX risk factor
 *
 * KEY CLINICAL DISTINCTION:
 *   Gestational age < 38 weeks is itself a recognised neurotoxicity risk factor.
 *   However, the GA-based risk is already encoded in the curve selection within
 *   each figure (Figures 1 & 3 show separate curves for GA 35, 36, 37, ≥38 etc.).
 *   The boolean flag `hasNeurotoxicityRisk` in this module therefore refers only
 *   to ADDITIONAL risk factors BEYOND gestational age:
 *     • Albumin < 3.0 g/dL
 *     • Isoimmune haemolytic disease / positive DAT
 *     • G6PD deficiency or other haemolytic condition
 *     • Sepsis
 *     • Significant clinical instability in the previous 24 hours
 *
 * Figure grouping:
 *   • Figures 1 & 3 (no additional NTX): separate curves for GA 35, 36, 37,
 *     38, 39, ≥40 (Figs 1) and GA 35, 36, 37, ≥38 (Fig 3).
 *   • Figures 2 & 4 (≥1 additional NTX): curves for GA 35, 36, 37, ≥38.
 *     GA 38, 39, 40, 41 all share the "≥38 weeks" curve.
 *
 * Values are digitised from the published nomogram figures.
 * Interpolation is linear between anchor points.
 *
 * ⚠ Verify all values against the published figures before clinical use.
 *
 * Units: mg/dL throughout. Multiply by 17.104 to convert to µmol/L.
 */

// ─── Conversion ──────────────────────────────────────────────────────────────

export const UMOL_TO_MGDL = 1 / 17.104;
export const MGDL_TO_UMOL = 17.104;

export function convertToMgdL(value: number, unit: 'mg/dL' | 'µmol/L'): number {
  return unit === 'µmol/L' ? value * UMOL_TO_MGDL : value;
}

// ─── Figure 1: Phototherapy — No Additional NTX Risk Factors ─────────────────
// Y-axis: 6–24 mg/dL. Six curves: ≥40, 39, 38, 37, 36, 35 weeks.
// GA 41 treated identically to GA 40 (≥40 weeks curve).
// ⚠ Verify against published Figure 1 before clinical use.

const PHOTO_NO_NTX: Record<number, [number, number][]> = {
  // GA 35 weeks (lowest curve — dashed pink)
  35: [
    [0,   6.5], [12,  8.0], [24, 10.5], [36, 12.0],
    [48, 13.5], [60, 15.0], [72, 16.0], [84, 17.5],
    [96, 19.0], [120, 19.0], [168, 19.0], [240, 19.5], [336, 19.5],
  ],
  // GA 36 weeks (solid orange)
  36: [
    [0,   7.0], [12,  9.0], [24, 11.5], [36, 13.0],
    [48, 14.5], [60, 16.0], [72, 17.0], [84, 18.5],
    [96, 19.5], [120, 19.5], [168, 20.0], [240, 20.5], [336, 21.0],
  ],
  // GA 37 weeks (dashed cyan)
  37: [
    [0,   7.5], [12,  9.5], [24, 12.0], [36, 14.0],
    [48, 15.5], [60, 17.0], [72, 18.0], [84, 19.5],
    [96, 20.0], [120, 20.5], [168, 20.5], [240, 21.0], [336, 21.0],
  ],
  // GA 38 weeks (solid maroon)
  38: [
    [0,   8.0], [12, 10.5], [24, 13.0], [36, 15.0],
    [48, 16.5], [60, 18.0], [72, 19.0], [84, 20.5],
    [96, 21.0], [120, 21.0], [168, 21.5], [240, 21.5], [336, 21.8],
  ],
  // GA 39 weeks (dashed orange)
  39: [
    [0,   8.5], [12, 11.0], [24, 13.5], [36, 15.5],
    [48, 17.0], [60, 18.5], [72, 19.5], [84, 21.0],
    [96, 21.5], [120, 21.5], [168, 22.0], [240, 22.0], [336, 22.0],
  ],
  // GA ≥ 40 weeks (solid dark teal — highest). GA 41 uses these same values.
  40: [
    [0,   9.0], [12, 11.5], [24, 14.0], [36, 16.0],
    [48, 17.5], [60, 19.0], [72, 20.0], [84, 21.5],
    [96, 22.0], [120, 22.0], [168, 22.0], [240, 22.0], [336, 22.0],
  ],
  41: [
    [0,   9.0], [12, 11.5], [24, 14.0], [36, 16.0],
    [48, 17.5], [60, 19.0], [72, 20.0], [84, 21.5],
    [96, 22.0], [120, 22.0], [168, 22.0], [240, 22.0], [336, 22.0],
  ],
};

// ─── Figure 2: Phototherapy — ≥1 Additional NTX Risk Factor ──────────────────
// Y-axis: 4–20 mg/dL. Four curves: ≥38, 37, 36, 35 weeks.
// GA 38, 39, 40, 41 all share the "≥38 weeks" curve (key = 38).
// ⚠ Verify against published Figure 2 before clinical use.

const PHOTO_WITH_NTX: Record<number, [number, number][]> = {
  // GA 35 weeks (dashed cyan — lowest)
  35: [
    [0,   4.5], [12,  6.5], [24,  8.0], [36, 10.0],
    [48, 11.0], [60, 12.5], [72, 14.0], [84, 15.5],
    [96, 16.0], [120, 16.0], [168, 16.5], [240, 17.0], [336, 17.5],
  ],
  // GA 36 weeks (solid maroon/red)
  36: [
    [0,   5.5], [12,  7.5], [24,  9.5], [36, 11.5],
    [48, 12.5], [60, 14.0], [72, 15.5], [84, 16.5],
    [96, 17.0], [120, 17.0], [168, 17.5], [240, 17.5], [336, 18.0],
  ],
  // GA 37 weeks (dashed orange)
  37: [
    [0,   6.5], [12,  8.5], [24, 11.0], [36, 13.0],
    [48, 14.5], [60, 16.0], [72, 17.0], [84, 17.5],
    [96, 18.0], [120, 18.0], [168, 18.5], [240, 18.5], [336, 18.5],
  ],
  // GA ≥ 38 weeks (solid dark teal — highest). Used for GA 38, 39, 40, 41.
  38: [
    [0,   7.0], [12,  9.0], [24, 12.0], [36, 14.0],
    [48, 15.5], [60, 17.0], [72, 17.5], [84, 18.0],
    [96, 18.0], [120, 18.0], [168, 18.5], [240, 18.5], [336, 18.5],
  ],
};

// ─── Figure 3: Exchange Transfusion — No Additional NTX Risk Factors ─────────
// Y-axis: 14–28 mg/dL. Four curves: ≥38, 37, 36, 35 weeks.
// Dotted lines at early hours indicate extrapolation in the published figure.
// GA 38, 39, 40, 41 all share the "≥38 weeks" curve (key = 38).
// ⚠ Verify against published Figure 3 before clinical use.

const EXCHANGE_NO_NTX: Record<number, [number, number][]> = {
  // GA 35 weeks (dashed cyan — lowest)
  35: [
    [0,  14.5], [12, 15.5], [24, 18.5], [36, 20.5],
    [48, 21.5], [60, 23.0], [72, 24.0], [84, 24.5],
    [96, 24.5], [120, 25.0], [168, 25.5], [240, 26.0], [336, 26.5],
  ],
  // GA 36 weeks (solid maroon/red)
  36: [
    [0,  15.5], [12, 16.5], [24, 19.5], [36, 22.0],
    [48, 23.0], [60, 24.5], [72, 25.5], [84, 26.0],
    [96, 26.0], [120, 26.0], [168, 26.5], [240, 26.5], [336, 26.5],
  ],
  // GA 37 weeks (dashed orange)
  37: [
    [0,  16.0], [12, 17.5], [24, 20.0], [36, 23.0],
    [48, 24.5], [60, 25.5], [72, 26.5], [84, 27.0],
    [96, 27.0], [120, 27.0], [168, 27.0], [240, 27.0], [336, 27.0],
  ],
  // GA ≥ 38 weeks (solid dark teal — highest). Used for GA 38, 39, 40, 41.
  38: [
    [0,  17.0], [12, 18.5], [24, 21.0], [36, 23.5],
    [48, 25.0], [60, 26.5], [72, 27.0], [84, 27.0],
    [96, 27.0], [120, 27.0], [168, 27.0], [240, 27.0], [336, 27.0],
  ],
};

// ─── Figure 4: Exchange Transfusion — ≥1 Additional NTX Risk Factor ──────────
// Y-axis: 12–24 mg/dL. Four curves: ≥38, 37, 36, 35 weeks.
// Dotted lines at early hours indicate extrapolation in the published figure.
// GA 38, 39, 40, 41 all share the "≥38 weeks" curve (key = 38).
// ⚠ Verify against published Figure 4 before clinical use.

const EXCHANGE_WITH_NTX: Record<number, [number, number][]> = {
  // GA 35 weeks (dashed cyan — lowest)
  35: [
    [0,  13.0], [12, 13.5], [24, 16.0], [36, 18.5],
    [48, 19.0], [60, 20.0], [72, 20.5], [84, 21.0],
    [96, 21.0], [120, 21.5], [168, 21.5], [240, 22.0], [336, 23.0],
  ],
  // GA 36 weeks (solid maroon/red)
  36: [
    [0,  14.0], [12, 15.0], [24, 17.0], [36, 19.5],
    [48, 20.5], [60, 21.5], [72, 22.0], [84, 22.0],
    [96, 22.0], [120, 22.5], [168, 22.5], [240, 23.0], [336, 23.0],
  ],
  // GA 37 weeks (dashed orange)
  37: [
    [0,  14.5], [12, 16.0], [24, 18.5], [36, 20.5],
    [48, 21.5], [60, 22.5], [72, 22.5], [84, 23.0],
    [96, 23.0], [120, 23.5], [168, 23.5], [240, 23.5], [336, 23.5],
  ],
  // GA ≥ 38 weeks (solid dark teal — highest). Used for GA 38, 39, 40, 41.
  38: [
    [0,  15.5], [12, 17.0], [24, 19.0], [36, 21.0],
    [48, 22.0], [60, 22.5], [72, 23.0], [84, 23.5],
    [96, 23.5], [120, 23.5], [168, 23.5], [240, 23.5], [336, 23.5],
  ],
};

// ─── Interpolation ────────────────────────────────────────────────────────────

/** Linear interpolation between anchor points for a given age in hours. */
function interpolate(anchors: [number, number][], ageHours: number): number {
  if (ageHours <= anchors[0][0]) return anchors[0][1];
  if (ageHours >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];

  for (let i = 1; i < anchors.length; i++) {
    const [h0, v0] = anchors[i - 1];
    const [h1, v1] = anchors[i];
    if (ageHours <= h1) {
      const t = (ageHours - h0) / (h1 - h0);
      return v0 + t * (v1 - v0);
    }
  }
  return anchors[anchors.length - 1][1];
}

// ─── GA Clamping ─────────────────────────────────────────────────────────────

/**
 * Clamp GA for the 6-curve Figure 1 table (GA 35–41; GA 41 uses GA 40 values).
 */
function clampGAPhotoNoNTX(ga: number): number {
  return Math.min(41, Math.max(35, Math.round(ga)));
}

/**
 * Clamp GA for the 4-curve tables (Figures 2, 3, 4).
 * GA 38, 39, 40, 41 → key 38 ("≥38 weeks" curve).
 */
function clampGAFourCurves(ga: number): number {
  return Math.min(38, Math.max(35, Math.round(ga)));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the phototherapy threshold (mg/dL).
 *
 * @param gaWeeks         Gestational age in weeks at birth (35–41).
 * @param ageHours        Postnatal age in hours (0–336).
 * @param hasNeurotoxicityRisk  Whether ANY additional NTX risk factor is present
 *                        BEYOND gestational age (albumin < 3.0 g/dL, isoimmune
 *                        haemolysis, G6PD deficiency, sepsis, instability).
 *                        Do NOT include GA < 38 weeks here — it is already
 *                        encoded in the curve selection by gestational age.
 *
 * Uses Figure 1 when hasNeurotoxicityRisk = false,
 * or   Figure 2 when hasNeurotoxicityRisk = true.
 */
export function getPhototherapyThreshold(
  gaWeeks: number,
  ageHours: number,
  hasNeurotoxicityRisk: boolean,
): number {
  if (hasNeurotoxicityRisk) {
    const ga = clampGAFourCurves(gaWeeks);
    return interpolate(PHOTO_WITH_NTX[ga], ageHours);
  }
  const ga = clampGAPhotoNoNTX(gaWeeks);
  return interpolate(PHOTO_NO_NTX[ga], ageHours);
}

/**
 * Returns the exchange transfusion threshold (mg/dL).
 *
 * Uses Figure 3 when hasNeurotoxicityRisk = false,
 * or   Figure 4 when hasNeurotoxicityRisk = true.
 *
 * See note on `hasNeurotoxicityRisk` above — GA < 38 weeks should NOT be
 * passed as a risk factor; it is encoded in the GA curve selection.
 */
export function getExchangeThreshold(
  gaWeeks: number,
  ageHours: number,
  hasNeurotoxicityRisk: boolean,
): number {
  const ga = clampGAFourCurves(gaWeeks);
  return hasNeurotoxicityRisk
    ? interpolate(EXCHANGE_WITH_NTX[ga], ageHours)
    : interpolate(EXCHANGE_NO_NTX[ga], ageHours);
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

export interface ChartPoint {
  hours: number;
  phototherapy: number;
  exchange: number;
}

/** Generates 0–336 hour chart data (every 4 hours) for one GA + risk profile. */
export function getChartData(gaWeeks: number, hasNeurotoxicityRisk: boolean): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let h = 0; h <= 336; h += 4) {
    points.push({
      hours: h,
      phototherapy: parseFloat(getPhototherapyThreshold(gaWeeks, h, hasNeurotoxicityRisk).toFixed(1)),
      exchange: parseFloat(getExchangeThreshold(gaWeeks, h, hasNeurotoxicityRisk).toFixed(1)),
    });
  }
  return points;
}

// ─── Clinical Recommendation Engine ──────────────────────────────────────────

export type BilirubinZone =
  | 'below'        // Safe — below phototherapy threshold
  | 'near'         // Within 2 mg/dL of phototherapy threshold — repeat soon
  | 'phototherapy' // At or above phototherapy threshold
  | 'escalation'   // Within 2 mg/dL of exchange threshold — escalate care
  | 'exchange';    // At or above exchange threshold — urgent action

export interface BilirubinResult {
  zone: BilirubinZone;
  phototherapyThreshold: number;
  exchangeThreshold: number;
  distanceFromPhototherapy: number; // negative = above threshold
  distanceFromExchange: number;     // negative = above threshold
  confirmTSB: boolean;              // TcB close to threshold or > 15 mg/dL
  redFlags: string[];
  recommendation: string;
  followUpTiming: string | null;
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
}

export interface BilirubinInputs {
  gaWeeks: number;
  ageHours: number;
  bilirubinMgdL: number;
  bilirubinType: 'TSB' | 'TcB';
  hasNeurotoxicityRisk: boolean; // Additional NTX risk factors BEYOND gestational age
  // Optional
  rateOfRise?: number;         // mg/dL/hour
  directBilirubin?: number;    // mg/dL
  weightKg?: number;
  jaundiceFirst24h?: boolean;
  suspectedHemolysis?: boolean;
}

export function calculateBilirubinResult(inputs: BilirubinInputs): BilirubinResult {
  const {
    gaWeeks, ageHours, bilirubinMgdL, bilirubinType,
    hasNeurotoxicityRisk, rateOfRise, directBilirubin,
    jaundiceFirst24h, suspectedHemolysis,
  } = inputs;

  const ptThreshold = parseFloat(getPhototherapyThreshold(gaWeeks, ageHours, hasNeurotoxicityRisk).toFixed(1));
  const etThreshold = parseFloat(getExchangeThreshold(gaWeeks, ageHours, hasNeurotoxicityRisk).toFixed(1));
  const distFromPT = parseFloat((ptThreshold - bilirubinMgdL).toFixed(1));
  const distFromET = parseFloat((etThreshold - bilirubinMgdL).toFixed(1));

  // TcB confirmation rule (AAP 2022):
  // Confirm with TSB if TcB is within 3 mg/dL of phototherapy threshold, or TcB > 15 mg/dL.
  const confirmTSB =
    bilirubinType === 'TcB' && (distFromPT <= 3 || bilirubinMgdL > 15);

  // Red flags
  const redFlags: string[] = [];
  if (jaundiceFirst24h) redFlags.push('Jaundice onset < 24 hours of age (requires urgent TSB)');
  if (suspectedHemolysis) redFlags.push('Suspected hemolytic disease (requires urgent evaluation)');
  if (rateOfRise !== undefined && rateOfRise > 0.2)
    redFlags.push(`Rapid bilirubin rise: ${rateOfRise.toFixed(2)} mg/dL/h (> 0.2 mg/dL/h)`);
  if (directBilirubin !== undefined && directBilirubin > 1.0)
    redFlags.push(`Elevated direct/conjugated bilirubin: ${directBilirubin.toFixed(1)} mg/dL — evaluate for cholestasis`);
  if (bilirubinMgdL >= etThreshold)
    redFlags.push('Bilirubin at or above exchange transfusion threshold — emergency action required');

  // Determine zone
  let zone: BilirubinZone;
  let recommendation: string;
  let followUpTiming: string | null;
  let urgency: BilirubinResult['urgency'];

  if (bilirubinMgdL >= etThreshold) {
    zone = 'exchange';
    recommendation =
      'Urgent NICU/neonatology consult. Prepare for exchange transfusion. ' +
      'Ensure intensive phototherapy is in place while awaiting consultation. ' +
      'Draw TSB, blood group, DAT, FBC, reticulocyte count, G6PD.';
    followUpTiming = 'Immediate (within 1 hour)';
    urgency = 'emergency';
  } else if (distFromET <= 2) {
    zone = 'escalation';
    recommendation =
      'Bilirubin is within 2 mg/dL of exchange transfusion threshold. ' +
      'Escalate care to senior paediatrician/neonatologist immediately. ' +
      'Start intensive phototherapy without delay. Prepare for possible exchange transfusion. ' +
      'Confirm with TSB if TcB; repeat bilirubin in 2–4 hours.';
    followUpTiming = 'Repeat TSB in 2–4 hours';
    urgency = 'emergency';
  } else if (bilirubinMgdL >= ptThreshold) {
    zone = 'phototherapy';
    recommendation =
      'Start intensive phototherapy. Ensure adequate hydration and feeding. ' +
      'Confirm with TSB if result is TcB. Repeat bilirubin in 4–6 hours after starting phototherapy. ' +
      'Discontinue phototherapy when bilirubin is ≥ 2 mg/dL below the phototherapy threshold.';
    followUpTiming = 'Repeat TSB in 4–6 hours';
    urgency = 'urgent';
  } else if (distFromPT <= 2) {
    zone = 'near';
    recommendation =
      'Bilirubin is approaching the phototherapy threshold. ' +
      'Ensure adequate feeding. Confirm with TSB if result is TcB. ' +
      'Repeat bilirubin in 4–8 hours.';
    followUpTiming = 'Repeat bilirubin in 4–8 hours';
    urgency = 'soon';
  } else {
    zone = 'below';
    let followUp: string;
    if (distFromPT < 3) {
      followUp = 'Repeat bilirubin in 8–12 hours';
    } else if (distFromPT < 5) {
      followUp = 'Repeat bilirubin in 12–24 hours';
    } else {
      followUp = ageHours < 72
        ? 'Repeat bilirubin in 24 hours (or at next outpatient visit if stable)'
        : 'Follow up in 1–2 days per AAP guidelines';
    }
    recommendation =
      'Bilirubin is below phototherapy threshold. Continue to monitor. ' +
      'Support adequate breastfeeding. ' + followUp + '.';
    followUpTiming = followUp;
    urgency = 'routine';
  }

  return {
    zone,
    phototherapyThreshold: ptThreshold,
    exchangeThreshold: etThreshold,
    distanceFromPhototherapy: distFromPT,
    distanceFromExchange: distFromET,
    confirmTSB,
    redFlags,
    recommendation,
    followUpTiming,
    urgency,
  };
}
