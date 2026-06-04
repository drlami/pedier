/**
 * Standard Pediatric Clinical Formulas
 * Sources: PALS, AAP, Harriet Lane Handbook
 */

/**
 * 4-2-1 Rule for Hourly Maintenance Fluids
 * @param weightKg Patient weight in kg
 * @returns hourly rate in mL/hr
 */
export const calculateMaintenanceFluids = (weightKg: number): number => {
  if (weightKg <= 10) return weightKg * 4;
  if (weightKg <= 20) return 40 + (weightKg - 10) * 2;
  return 60 + (weightKg - 20) * 1;
};

/**
 * Bedside Schwartz Formula for estimated GFR (Updated 2009/2024)
 * @param heightCm Patient height in cm
 * @param creatinine Serum creatinine
 * @param constant The k-constant (default 0.413 for IDMS-enzymatic child)
 * @param isSiUnits Boolean, if true creatinine is in µmol/L
 * @returns eGFR in mL/min/1.73m²
 */
export const calculateSchwartzGFR = (
  heightCm: number, 
  creatinine: number, 
  constant: number = 0.413,
  isSiUnits: boolean = false
): number => {
  if (creatinine <= 0) return 0;
  
  if (isSiUnits) {
    // k multiplier for µmol/L is typically k * 88.4
    // Standard child multiplier (0.413 * 88.4) ≈ 36.5
    const siMultiplier = constant * 88.4;
    return (siMultiplier * heightCm) / creatinine;
  }
  
  return (constant * heightCm) / creatinine;
};

/**
 * Parkland Formula for Burn Resuscitation (first 24h)
 * @param weightKg Patient weight in kg
 * @param bsaBurned Percentage of Body Surface Area burned
 * @returns Total LR volume in mL for 24h
 */
export const calculateParklandResuscitation = (weightKg: number, bsaBurned: number): number => {
  return 4 * weightKg * bsaBurned;
};

/**
 * Corrected Sodium for Hyperglycemia
 * @param measuredSodium in mEq/L
 * @param glucose in mg/dL
 * @returns Corrected Sodium
 */
export const calculateCorrectedSodium = (measuredSodium: number, glucose: number): number => {
  if (glucose < 100) return measuredSodium;
  return measuredSodium + 1.6 * ((glucose - 100) / 100);
};

/**
 * Estimated Blood Volume (EBV) by age
 */
export const calculateEBV = (weightKg: number, ageMonths: number): number => {
  let multiplier = 75; // Child/Adult default
  if (ageMonths <= 1) multiplier = 90; // Neonate
  else if (ageMonths <= 12) multiplier = 80; // Infant
  return weightKg * multiplier;
};

/**
 * Total Fluid Deficit Volume
 * @param weightKg Patient weight
 * @param percentDehydration Estimated % dehydration (e.g. 5)
 * @returns mL of deficit
 */
export const calculateTotalDeficit = (weightKg: number, percentDehydration: number): number => {
  return weightKg * percentDehydration * 10;
};

/**
 * Sodium Deficit (for Hyponatremia)
 * @param weightKg Patient weight
 * @param measuredNa Current serum sodium
 * @param targetNa Target serum sodium (usually 135)
 * @returns mEq of Sodium needed
 */
export const calculateSodiumDeficit = (weightKg: number, measuredNa: number, targetNa: number = 135): number => {
  if (measuredNa >= targetNa) return 0;
  return (targetNa - measuredNa) * weightKg * 0.6;
};

/**
 * Free Water Deficit (for Hypernatremia)
 * @param weightKg Patient weight
 * @param measuredNa Current serum sodium
 * @returns mL of free water needed
 */
export const calculateFreeWaterDeficit = (weightKg: number, measuredNa: number): number => {
  if (measuredNa <= 145) return 0;
  return weightKg * 0.6 * (1 - (145 / measuredNa)) * 1000;
};

/**
 * Body Surface Area (Mosteller Formula)
 * @param weightKg Patient weight in kg
 * @param heightCm Patient height in cm
 * @returns BSA in m²
 */
export const calculateBSA = (weightKg: number, heightCm: number): number => {
  return Math.sqrt((heightCm * weightKg) / 3600);
};

/**
 * Corrected QT Interval (Bazett Formula)
 * @param qtMs QT interval in milliseconds
 * @param rrMs RR interval in milliseconds
 * @returns QTc in milliseconds
 */
export const calculateQTc = (qtMs: number, rrMs: number): number => {
  if (rrMs <= 0) return 0;
  const rrSec = rrMs / 1000;
  return qtMs / Math.sqrt(rrSec);
};

/**
 * Corrected Calcium for Albumin
 * @param measuredCa Total serum calcium in mg/dL
 * @param albumin Serum albumin in g/dL
 * @returns Corrected Calcium in mg/dL
 */
export const calculateCorrectedCalcium = (measuredCa: number, albumin: number): number => {
  if (albumin >= 4.0) return measuredCa;
  return measuredCa + 0.8 * (4.0 - albumin);
};

/**
 * Oxygenation Index (OI) — PALICC-2 primary severity index
 * Requires invasive MV with PEEP ≥5 cmH₂O per PALICC-2
 * @param fio2Fraction FiO2 as a fraction (0.21–1.0)
 * @param mapCmH2O Mean airway pressure in cmH₂O
 * @param pao2mmHg Arterial PaO2 in mmHg
 * @returns OI (dimensionless)
 */
export const calculateOI = (fio2Fraction: number, mapCmH2O: number, pao2mmHg: number): number => {
  if (pao2mmHg <= 0) return 0;
  return (fio2Fraction * mapCmH2O * 100) / pao2mmHg;
};

/**
 * Oxygen Saturation Index (OSI) — PALICC-2 non-invasive surrogate for OI
 * Valid only when SpO2 ≤ 97% (saturation curve linear region)
 * @param fio2Fraction FiO2 as a fraction (0.21–1.0)
 * @param mapCmH2O Mean airway pressure in cmH₂O
 * @param spo2Percent SpO2 as a percentage (1–100)
 * @returns OSI (dimensionless)
 */
export const calculateOSI = (fio2Fraction: number, mapCmH2O: number, spo2Percent: number): number => {
  if (spo2Percent <= 0) return 0;
  return (fio2Fraction * mapCmH2O * 100) / spo2Percent;
};
