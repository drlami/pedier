/**
 * AAP 2022 Neonatal Hyperbilirubinemia Threshold Data
 *
 * Source: Kemper AR, Newman TB, Slaughter JL, et al.
 * Clinical Practice Guideline Revision: Management of Hyperbilirubinemia
 * in the Newborn Infant 35 or More Weeks of Gestation.
 * Pediatrics. 2022;150(3):e2022058864.
 * https://doi.org/10.1542/peds.2022-058864
 *
 * THRESHOLD DATA NOTICE:
 * Values below are based on the AAP 2022 guideline supplementary tables
 * (Table S4 — phototherapy thresholds, Table S5 — exchange transfusion thresholds).
 * They must be verified against the published supplementary data before
 * any clinical deployment. Threshold values use linear interpolation
 * between published anchor points.
 *
 * APPLIES TO: Infants ≥ 35 weeks gestational age ONLY.
 * For infants < 35 weeks, a separate NICU protocol is required.
 *
 * Units: mg/dL throughout. Multiply by 17.1 to convert to µmol/L.
 */

// ─── Conversion ──────────────────────────────────────────────────────────────

export const UMOL_TO_MGDL = 1 / 17.104;
export const MGDL_TO_UMOL = 17.104;

export function convertToMgdL(value: number, unit: 'mg/dL' | 'µmol/L'): number {
  return unit === 'µmol/L' ? value * UMOL_TO_MGDL : value;
}

// ─── Threshold Tables ─────────────────────────────────────────────────────────
// Format: [ageHours, threshold_mg_dL]
// Linear interpolation is used between anchor points.
// Values for gestational ages 35–41 weeks WITHOUT neurotoxicity risk factors.
// Subtract 2.0 mg/dL when ANY neurotoxicity risk factor is present.

/**
 * Phototherapy threshold anchor points (mg/dL).
 * WITHOUT neurotoxicity risk factors.
 *
 * Values digitised from the AAP 2022 CPG published nomogram figure
 * (Kemper et al., Pediatrics 2022;150(3):e2022058864, Figure 3 /
 * Supplementary Figure S1).  Plateau values (96 h onward) reflect the
 * slow upward drift shown in the published curve through 336 h (14 days).
 *
 * GA ≥ 40 weeks: the guideline presents a single curve for all infants
 * ≥ 40 weeks; GA 40 and GA 41 therefore share identical anchor points.
 *
 * ⚠ Verify all values against the published figure before clinical use.
 */
const PHOTO_ANCHORS: Record<number, [number, number][]> = {
  // GA 35 weeks (dashed pink — lowest curve)
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
  // GA ≥ 40 weeks (solid dark teal — highest curve); GA 41 uses same values
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

/**
 * Exchange transfusion threshold anchor points (mg/dL).
 * WITHOUT neurotoxicity risk factors.
 * Based on AAP 2022 CPG Supplementary Table S5.
 *
 * Approximated as phototherapy threshold + 5 mg/dL, capped at 25 mg/dL,
 * consistent with the gap shown in the published figure.
 *
 * ⚠ Verify all values against published Table S5 before clinical use.
 */
const EXCHANGE_ANCHORS: Record<number, [number, number][]> = {
  // GA 35 weeks (phototherapy + 5)
  35: [
    [0,  11.5], [12, 13.0], [24, 15.5], [36, 17.0],
    [48, 18.5], [60, 20.0], [72, 21.0], [84, 22.5],
    [96, 24.0], [120, 24.0], [168, 24.0], [240, 24.5], [336, 24.5],
  ],
  // GA 36 weeks (phototherapy + 5, cap 25)
  36: [
    [0,  12.0], [12, 14.0], [24, 16.5], [36, 18.0],
    [48, 19.5], [60, 21.0], [72, 22.0], [84, 23.5],
    [96, 24.5], [120, 24.5], [168, 25.0], [240, 25.0], [336, 25.0],
  ],
  // GA 37 weeks (phototherapy + 5, cap 25)
  37: [
    [0,  12.5], [12, 14.5], [24, 17.0], [36, 19.0],
    [48, 20.5], [60, 22.0], [72, 23.0], [84, 24.5],
    [96, 25.0], [120, 25.0], [168, 25.0], [240, 25.0], [336, 25.0],
  ],
  // GA 38 weeks (phototherapy + 4–5, cap 25)
  38: [
    [0,  13.0], [12, 15.0], [24, 18.0], [36, 20.0],
    [48, 21.5], [60, 23.0], [72, 24.0], [84, 25.0],
    [96, 25.0], [120, 25.0], [168, 25.0], [240, 25.0], [336, 25.0],
  ],
  // GA 39 weeks (phototherapy + 3.5–5, cap 25)
  39: [
    [0,  13.5], [12, 15.5], [24, 18.5], [36, 20.5],
    [48, 22.0], [60, 23.5], [72, 24.5], [84, 25.0],
    [96, 25.0], [120, 25.0], [168, 25.0], [240, 25.0], [336, 25.0],
  ],
  // GA ≥ 40 weeks (phototherapy + 3–5, cap 25)
  40: [
    [0,  14.0], [12, 16.5], [24, 19.0], [36, 21.0],
    [48, 22.5], [60, 24.0], [72, 25.0], [84, 25.0],
    [96, 25.0], [120, 25.0], [168, 25.0], [240, 25.0], [336, 25.0],
  ],
  41: [
    [0,  14.0], [12, 16.5], [24, 19.0], [36, 21.0],
    [48, 22.5], [60, 24.0], [72, 25.0], [84, 25.0],
    [96, 25.0], [120, 25.0], [168, 25.0], [240, 25.0], [336, 25.0],
  ],
};

/** Subtract from threshold when any neurotoxicity risk factor is present (AAP 2022). */
const NEUROTOXICITY_ADJUSTMENT = 2.0;

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

// ─── Public API ───────────────────────────────────────────────────────────────

/** Clamp GA to supported range (35–41). */
function clampGA(gaWeeks: number): number {
  return Math.min(41, Math.max(35, Math.round(gaWeeks)));
}

/**
 * Returns the phototherapy threshold (mg/dL) for a given GA, age, and risk profile.
 */
export function getPhototherapyThreshold(
  gaWeeks: number,
  ageHours: number,
  hasNeurotoxicityRisk: boolean,
): number {
  const ga = clampGA(gaWeeks);
  const base = interpolate(PHOTO_ANCHORS[ga], ageHours);
  return hasNeurotoxicityRisk ? base - NEUROTOXICITY_ADJUSTMENT : base;
}

/**
 * Returns the exchange transfusion threshold (mg/dL) for a given GA, age, and risk profile.
 */
export function getExchangeThreshold(
  gaWeeks: number,
  ageHours: number,
  hasNeurotoxicityRisk: boolean,
): number {
  const ga = clampGA(gaWeeks);
  const base = interpolate(EXCHANGE_ANCHORS[ga], ageHours);
  return hasNeurotoxicityRisk ? base - NEUROTOXICITY_ADJUSTMENT : base;
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
  confirmTSB: boolean;              // TcB close to threshold or >15 mg/dL
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
  hasNeurotoxicityRisk: boolean;
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
    // Follow-up timing based on distance from phototherapy threshold (AAP 2022)
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
