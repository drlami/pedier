/**
 * Pediatric Mechanical Ventilation — Clinical Decision Support Engine
 *
 * References:
 *   PALICC-2: Pediatric Acute Lung Injury Consensus Conference 2023
 *   PEMVECC: Pediatric Mechanical Ventilation Consensus Conference, Pediatr Crit Care Med 2017
 *   PALS 2020 guidelines (AHA/AAP)
 *
 * Safety: This module provides structured bedside guidance only.
 * It does NOT replace clinical judgment or senior/PICU specialist review.
 * All outputs use "consider", "suggested range", and "reassess" language.
 */

import { calculateOI, calculateOSI } from "./formulas";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Diagnosis =
  | "normal"
  | "pneumonia"
  | "pards"
  | "asthma"
  | "bronchiolitis"
  | "shock"
  | "neuromuscular"
  | "raised-icp"
  | "post-arrest"
  | "other";

export type AgeUnit = "days" | "months" | "years";
export type WarningSeverity = "info" | "warning" | "critical";

export interface AgeInput {
  value: number;
  unit: AgeUnit;
}

export interface MVInputs {
  age: AgeInput | null;
  weightKg: number | null;
  diagnosis: Diagnosis | "";
  intubated: boolean;
  ettCuffed: boolean | null;
  ettSizeMm: number | null;
  ettDepthCm: number | null;
  fio2Percent: number | null;    // 21–100
  peep: number | null;           // cmH₂O
  pip: number | null;            // Peak / Plateau pressure cmH₂O
  mapAirway: number | null;      // Mean airway pressure cmH₂O
  rr: number | null;             // breaths/min (set RR)
  itime: number | null;          // inspiratory time seconds
  measuredVtMl: number | null;   // measured tidal volume mL
  ph: number | null;
  pco2: number | null;           // mmHg
  pao2: number | null;           // arterial PaO2 mmHg
  hco3: number | null;           // mEq/L (optional)
  spo2: number | null;           // %
  lactate: number | null;        // mmol/L
}

export interface MVWarning {
  code: string;
  severity: WarningSeverity;
  title: string;
  message: string;
  action?: string;
}

// ─── Airway ──────────────────────────────────────────────────────────────────

export interface MVAirwayResult {
  estimatedSizeUncuffed: string;
  estimatedSizeCuffed: string;
  estimatedDepthOral: string;
  estimatedDepthNasal: string;
  warnings: MVWarning[];
  note: string;
}

// ─── Oxygenation ─────────────────────────────────────────────────────────────

export type PARDSGrade = "no-criteria" | "mild" | "moderate" | "severe" | "no-data";

export interface PARDSSeverity {
  grade: PARDSGrade;
  label: string;
  oi: number | null;
  osi: number | null;
  usedIndex: "OI" | "OSI" | null;
  pf: number | null;
  warnSpO2Unreliable: boolean;
  warnPeepInsufficient: boolean;
}

export interface MVOxygenationResult {
  pards: PARDSSeverity;
  drivingPressure: number | null;
  dpSeverity: "ok" | "concern" | "danger" | null;
  dpMessage: string;
  vtPerKg: number | null;
  vtPerKgNote: string;
  warnings: MVWarning[];
}

// ─── Ventilation ─────────────────────────────────────────────────────────────

export interface MVVentilationResult {
  hasData: boolean;
  phCategory: "normal" | "acidosis" | "alkalosis" | null;
  pco2Category: "normal" | "high" | "low" | null;
  permissiveApplies: boolean;
  permissiveNote: string;
  advice: string[];
  warnings: MVWarning[];
}

// ─── Scenario guide ──────────────────────────────────────────────────────────

export interface MVScenarioGuide {
  diagnosisLabel: string;
  mode: string;
  vtTarget: string;
  peepRange: string;
  rrRange: string;
  itime: string;
  fio2Start: string;
  oxyTarget: string;
  ventTarget: string;
  cautions: string[];
  seniorReviewIf: string[];
}

// ─── Initial setup (pre-gas starter settings) ────────────────────────────────

export interface MVInitialSettings {
  diagnosisLabel: string;
  modeSuggestion: string;
  vtMl: string;          // computed absolute mL for this weight
  vtPerKg: string;       // mL/kg basis used
  rr: string;            // bpm
  peep: string;          // cmH₂O
  pressureTarget: string; // how to set pressure / PIP
  itime: string;
  ieRatio: string;
  fio2Start: string;
  spo2Target: string;
  co2Target: string;
  keyCautions: string[];
  titrationNote: string;
}

// ─── Weaning ─────────────────────────────────────────────────────────────────

export interface WeaningCriterion {
  id: string;
  label: string;
  met: boolean | null;
  note: string;
}

export interface MVWeaningResult {
  overallStatus: "proceed-with-assessment" | "not-ready" | "no-data";
  criteria: WeaningCriterion[];
  blockers: string[];
  note: string;
}

// ─── Full output ─────────────────────────────────────────────────────────────

export interface MVFullOutput {
  hasMinimumData: boolean;
  ageMonths: number | null;
  globalWarnings: MVWarning[];
  airway: MVAirwayResult | null;
  oxygenation: MVOxygenationResult | null;
  ventilation: MVVentilationResult | null;
  scenario: MVScenarioGuide | null;
  initialSettings: MVInitialSettings | null;
  weaning: MVWeaningResult | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function ageToMonths(age: AgeInput): number {
  if (age.unit === "days") return age.value / 30.4;
  if (age.unit === "months") return age.value;
  return age.value * 12;
}

function ageGroupLabel(ageMonths: number): string {
  if (ageMonths < 1) return "Neonate";
  if (ageMonths < 12) return "Infant";
  if (ageMonths < 36) return "Toddler";
  if (ageMonths < 96) return "Child";
  return "Adolescent";
}

// ─── Airway assessment ───────────────────────────────────────────────────────

export function assessAirway(inputs: MVInputs, ageMonths: number): MVAirwayResult {
  const w = inputs.weightKg ?? 3;
  const ageYears = ageMonths / 12;
  const warnings: MVWarning[] = [];

  let uncuffed = "";
  let cuffed = "";
  let depthOral = "";
  let depthNasal = "";

  if (ageMonths < 1) {
    // Neonate: weight-based
    if (w < 1)       { uncuffed = "2.5"; cuffed = "2.5 (use uncuffed)"; }
    else if (w < 2)  { uncuffed = "3.0"; cuffed = "2.5–3.0"; }
    else if (w < 3)  { uncuffed = "3.0–3.5"; cuffed = "3.0"; }
    else             { uncuffed = "3.5"; cuffed = "3.0–3.5"; }
    const d = w + 6;
    depthOral = `${d.toFixed(0)}–${(d + 1).toFixed(0)} cm at lip`;
    depthNasal = `${(d + 3).toFixed(0)}–${(d + 4).toFixed(0)} cm at nare`;
    warnings.push({
      code: "neonatal-high-risk",
      severity: "warning",
      title: "Neonatal airway — high risk",
      message: "Neonatal intubation requires specialist-level skill. Consider senior/neonatology support immediately.",
    });
  } else if (ageMonths < 12) {
    // Infant
    uncuffed = ageMonths < 6 ? "3.5" : "3.5–4.0";
    cuffed = "3.0–3.5";
    const d = 10 + ageMonths / 6;
    depthOral = `${d.toFixed(0)}–${(d + 1).toFixed(0)} cm at lip`;
    depthNasal = `${(d + 3).toFixed(0)}–${(d + 4).toFixed(0)} cm at nare`;
  } else {
    // Child >1 yr: (age/4) + 4 uncuffed; (age/4) + 3.5 cuffed
    const uc = ageYears / 4 + 4;
    const c = ageYears / 4 + 3.5;
    uncuffed = uc.toFixed(1);
    cuffed = c.toFixed(1);
    const d = ageYears / 2 + 12;
    depthOral = `${d.toFixed(0)}–${(d + 1).toFixed(0)} cm at lip`;
    depthNasal = `${(d + 3).toFixed(0)}–${(d + 4).toFixed(0)} cm at nare`;
  }

  // Warn if provided ETT size deviates significantly from estimate
  if (inputs.ettSizeMm !== null && ageMonths >= 12) {
    const expectedCuffed = ageYears / 4 + 3.5;
    if (Math.abs(inputs.ettSizeMm - expectedCuffed) > 0.6) {
      warnings.push({
        code: "ett-size-deviation",
        severity: "info",
        title: "ETT size differs from formula estimate",
        message: `Entered ${inputs.ettSizeMm} mm; formula suggests ~${expectedCuffed.toFixed(1)} mm (cuffed). Confirm tube position clinically.`,
      });
    }
  }

  return {
    estimatedSizeUncuffed: uncuffed,
    estimatedSizeCuffed: cuffed,
    estimatedDepthOral: depthOral,
    estimatedDepthNasal: depthNasal,
    warnings,
    note:
      "Formula estimates only (PALS / Harriet Lane). Confirm by direct laryngoscopy, bilateral auscultation, chest rise, end-tidal CO₂ waveform, and post-intubation CXR.",
  };
}

// ─── Oxygenation assessment ──────────────────────────────────────────────────

function gradePARDS(oi: number | null, osi: number | null): { grade: PARDSGrade; label: string } {
  // Prefer OI; fall back to OSI
  if (oi !== null) {
    if (oi < 4)       return { grade: "no-criteria", label: "No PARDS oxygenation criteria" };
    if (oi < 8)       return { grade: "mild",        label: "Mild PARDS" };
    if (oi < 16)      return { grade: "moderate",    label: "Moderate PARDS" };
    return              { grade: "severe",             label: "Severe PARDS" };
  }
  if (osi !== null) {
    if (osi < 5)      return { grade: "no-criteria", label: "No PARDS oxygenation criteria (OSI)" };
    if (osi < 7.5)    return { grade: "mild",        label: "Mild PARDS (OSI)" };
    if (osi < 12.3)   return { grade: "moderate",    label: "Moderate PARDS (OSI)" };
    return              { grade: "severe",             label: "Severe PARDS (OSI)" };
  }
  return { grade: "no-data", label: "Insufficient data" };
}

export function assessOxygenation(inputs: MVInputs): MVOxygenationResult {
  const warnings: MVWarning[] = [];
  const fio2Frac = inputs.fio2Percent !== null ? inputs.fio2Percent / 100 : null;

  // OI / OSI
  let oi: number | null = null;
  let osi: number | null = null;
  let usedIndex: "OI" | "OSI" | null = null;
  const warnSpO2Unreliable = inputs.spo2 !== null && inputs.spo2 > 97;
  const warnPeepInsufficient = inputs.peep !== null && inputs.peep < 5;

  if (fio2Frac !== null && inputs.mapAirway !== null && inputs.pao2 !== null && inputs.pao2 > 0) {
    oi = parseFloat(calculateOI(fio2Frac, inputs.mapAirway, inputs.pao2).toFixed(1));
    usedIndex = "OI";
  }
  if (fio2Frac !== null && inputs.mapAirway !== null && inputs.spo2 !== null && inputs.spo2 > 0 && !warnSpO2Unreliable) {
    osi = parseFloat(calculateOSI(fio2Frac, inputs.mapAirway, inputs.spo2).toFixed(1));
    if (usedIndex === null) usedIndex = "OSI";
  }

  const pards = gradePARDS(oi, osi);
  const pf = (fio2Frac && inputs.pao2) ? parseFloat((inputs.pao2 / fio2Frac).toFixed(0)) : null;

  // Safety warnings from oxygenation
  if (pards.grade === "severe") {
    warnings.push({
      code: "severe-pards",
      severity: "critical",
      title: "Severe PARDS — Senior/PICU review required",
      message: `${usedIndex === "OI" ? `OI ${oi}` : `OSI ${osi}`} meets severe PARDS criteria. Consider lung-protective VT 3–6 mL/kg, high PEEP strategy, prone positioning, and HFOV or ECMO consultation per PALICC-2.`,
      action: "Escalate to PICU intensivist now",
    });
  } else if (pards.grade === "moderate") {
    warnings.push({
      code: "moderate-pards",
      severity: "warning",
      title: "Moderate PARDS — Reassess and consider senior review",
      message: `${usedIndex === "OI" ? `OI ${oi}` : `OSI ${osi}`} meets moderate PARDS criteria per PALICC-2. Ensure lung-protective ventilation and reassess response.`,
    });
  }

  if (inputs.fio2Percent !== null && inputs.fio2Percent > 80) {
    warnings.push({
      code: "high-fio2-critical",
      severity: "critical",
      title: "FiO₂ > 80% — Urgent reassessment",
      message: "Very high FiO₂ risk of oxygen toxicity. If oxygenation remains inadequate, consider PEEP optimisation, prone, HFOV, or ECMO consultation.",
      action: "Senior/PICU review",
    });
  } else if (inputs.fio2Percent !== null && inputs.fio2Percent > 60) {
    warnings.push({
      code: "high-fio2",
      severity: "warning",
      title: "FiO₂ > 60%",
      message: "Elevated FiO₂. Consider optimising PEEP or recruitment before accepting high FiO₂ chronically.",
    });
  }

  if (inputs.spo2 !== null && inputs.spo2 < 85) {
    warnings.push({
      code: "severe-hypoxemia",
      severity: "critical",
      title: "Severe hypoxemia — SpO₂ < 85%",
      message: "Immediate assessment needed. Check DOPES. Increase FiO₂ to 100% while troubleshooting.",
      action: "DOPES protocol + senior review",
    });
  }

  if (warnSpO2Unreliable) {
    warnings.push({
      code: "spo2-unreliable",
      severity: "info",
      title: "SpO₂ > 97% — OSI unreliable",
      message: "SpO₂ on the flat part of the oxyhemoglobin dissociation curve. OSI underestimates severity. Use OI (PaO₂) if possible.",
    });
  }

  if (warnPeepInsufficient) {
    warnings.push({
      code: "low-peep-pards",
      severity: "info",
      title: "PEEP < 5 cmH₂O",
      message: "PALICC-2 PARDS criteria require PEEP ≥ 5 cmH₂O on invasive MV. OI/OSI displayed but PARDS classification may not apply.",
    });
  }

  // Driving pressure
  let dp: number | null = null;
  let dpSeverity: "ok" | "concern" | "danger" | null = null;
  let dpMessage = "";
  if (inputs.pip !== null && inputs.peep !== null) {
    dp = parseFloat((inputs.pip - inputs.peep).toFixed(1));
    if (dp < 15)      { dpSeverity = "ok";      dpMessage = "Acceptable (< 15 cmH₂O)"; }
    else if (dp <= 20) { dpSeverity = "concern"; dpMessage = "INCREASED CONCERN — consider reducing PEEP or Pplat"; }
    else              { dpSeverity = "danger";   dpMessage = "HIGH VILI RISK — Reduce PEEP or Pplat. Senior review."; }

    if (dpSeverity === "danger") {
      warnings.push({
        code: "high-driving-pressure",
        severity: "critical",
        title: `High driving pressure ΔP = ${dp} cmH₂O`,
        message: "Driving pressure > 20 cmH₂O is associated with VILI. Consider reducing PEEP or Pplat. Reassess with senior.",
        action: "Optimise PEEP/Pplat balance",
      });
    } else if (dpSeverity === "concern") {
      warnings.push({
        code: "elevated-driving-pressure",
        severity: "warning",
        title: `Elevated driving pressure ΔP = ${dp} cmH₂O`,
        message: "Aim to reduce driving pressure to < 15 cmH₂O where possible without compromising oxygenation.",
      });
    }
  }

  if (inputs.pip !== null && inputs.pip > 30) {
    warnings.push({
      code: "high-pip",
      severity: "warning",
      title: `High PIP/Pplat ${inputs.pip} cmH₂O`,
      message: "PALICC-2 recommends keeping Pplat ≤ 28 cmH₂O in PARDS. High PIP risks barotrauma. Consider mode change or compliance assessment.",
    });
  }

  // VT/kg
  let vtPerKg: number | null = null;
  let vtPerKgNote = "";
  if (inputs.measuredVtMl !== null && inputs.weightKg && inputs.weightKg > 0) {
    vtPerKg = parseFloat((inputs.measuredVtMl / inputs.weightKg).toFixed(1));
    if (vtPerKg > 10) {
      vtPerKgNote = "HIGH — consider reducing VT. Volutrauma risk.";
      warnings.push({
        code: "high-vt-kg",
        severity: "warning",
        title: `Measured VT ${vtPerKg} mL/kg — volutrauma risk`,
        message: "VT > 10 mL/kg exceeds lung-protective targets. Consider reducing PIP or switching to volume-targeted mode.",
      });
    } else if (vtPerKg > 8) {
      vtPerKgNote = "Above lung-protective range — reassess";
    } else if (vtPerKg >= 4) {
      vtPerKgNote = "Within acceptable range";
    } else {
      vtPerKgNote = "LOW — check for leak, obstruction, or compliance change";
    }
  }

  return {
    pards: { ...pards, oi, osi, usedIndex, pf, warnSpO2Unreliable, warnPeepInsufficient },
    drivingPressure: dp,
    dpSeverity,
    dpMessage,
    vtPerKg,
    vtPerKgNote,
    warnings,
  };
}

// ─── Ventilation assessment ──────────────────────────────────────────────────

export function assessVentilation(inputs: MVInputs): MVVentilationResult {
  const warnings: MVWarning[] = [];

  if (inputs.ph === null && inputs.pco2 === null) {
    return { hasData: false, phCategory: null, pco2Category: null, permissiveApplies: false, permissiveNote: "", advice: [], warnings };
  }

  const advice: string[] = [];
  let phCategory: "normal" | "acidosis" | "alkalosis" | null = null;
  let pco2Category: "normal" | "high" | "low" | null = null;

  if (inputs.ph !== null) {
    if (inputs.ph < 7.25)     phCategory = "acidosis";
    else if (inputs.ph > 7.45) phCategory = "alkalosis";
    else                       phCategory = "normal";
  }

  if (inputs.pco2 !== null) {
    if (inputs.pco2 > 50)  pco2Category = "high";
    else if (inputs.pco2 < 35) pco2Category = "low";
    else                       pco2Category = "normal";
  }

  const isObstructive = inputs.diagnosis === "asthma" || inputs.diagnosis === "bronchiolitis";
  const isNeurologic = inputs.diagnosis === "raised-icp" || inputs.diagnosis === "post-arrest";

  // Permissive hypercapnia logic
  let permissiveApplies = false;
  let permissiveNote = "";

  if (inputs.ph !== null && inputs.ph >= 7.20 && pco2Category === "high") {
    if (inputs.diagnosis === "pards" || inputs.diagnosis === "pneumonia") {
      permissiveApplies = true;
      permissiveNote = "Permissive hypercapnia (pH ≥ 7.20) is generally acceptable in PARDS to allow lung-protective ventilation per PALICC-2. Senior review if deteriorating.";
    } else if (isObstructive) {
      permissiveApplies = true;
      permissiveNote = "Permissive hypercapnia is standard in severe asthma/obstructive disease. Prioritise adequate expiratory time. DO NOT increase RR to correct PaCO₂.";
    }
  }

  // Generate advice
  if (phCategory === "acidosis" && pco2Category === "high") {
    if (isObstructive) {
      advice.push("Respiratory acidosis with obstructive physiology: DO NOT increase RR — this worsens air trapping. Consider extending expiratory time (lower RR, adjust I:E). Permissive hypercapnia is acceptable if pH ≥ 7.20.");
    } else if (isNeurologic) {
      advice.push("Respiratory acidosis in neurologic patient: Consider increasing RR or VT cautiously. Avoid severe hypercapnia (PaCO₂ > 50) as it raises ICP. Target PaCO₂ 35–40. Senior/neurology review.");
    } else {
      if (inputs.ph !== null && inputs.ph < 7.20) {
        advice.push("Severe respiratory acidosis (pH < 7.20): Consider increasing minute ventilation (RR then VT). Reassess after change. Senior review required.");
      } else {
        advice.push("Respiratory acidosis: Consider cautious increase in RR or VT/PIP if not contraindicated. Reassess with repeat ABG.");
      }
    }
  }

  if (phCategory === "alkalosis" && pco2Category === "low") {
    if (isNeurologic) {
      advice.push("Hypocapnia in neurologic patient: causes cerebral vasoconstriction and ischaemia. Reduce RR or VT/PIP carefully. Target PaCO₂ 35–40. Reassess ABG.");
    } else {
      advice.push("Respiratory alkalosis: Consider reducing RR or VT/PIP. Reassess after change.");
    }
  }

  if (phCategory === "normal" && pco2Category === "normal") {
    advice.push("Gas exchange appears adequate for ventilatory target. Continue current settings and reassess.");
  }

  // Severe warnings
  if (inputs.ph !== null && inputs.ph < 7.10) {
    warnings.push({
      code: "severe-acidosis",
      severity: "critical",
      title: "Severe acidosis pH < 7.10 — Senior/PICU review",
      message: "pH < 7.10 is critically low. Assess metabolic vs respiratory contribution. Consider bicarbonate only if metabolic component significant. Escalate immediately.",
      action: "Escalate to senior/PICU immediately",
    });
  } else if (inputs.ph !== null && inputs.ph < 7.20) {
    warnings.push({
      code: "significant-acidosis",
      severity: "warning",
      title: "Significant acidosis pH < 7.20",
      message: "pH < 7.20 requires close monitoring. Assess cause and trajectory. Senior review.",
    });
  }

  if (inputs.pco2 !== null && inputs.pco2 > 70) {
    warnings.push({
      code: "severe-hypercapnia",
      severity: "warning",
      title: `Severe hypercapnia PaCO₂ ${inputs.pco2} mmHg`,
      message: "PaCO₂ > 70 requires clinical context assessment. Acceptable in obstructive disease with permissive strategy; concerning in neurologic injury. Senior review.",
    });
  }

  if (inputs.pco2 !== null && inputs.pco2 < 30) {
    warnings.push({
      code: "significant-hypocapnia",
      severity: "warning",
      title: `Significant hypocapnia PaCO₂ ${inputs.pco2} mmHg`,
      message: "PaCO₂ < 30 causes cerebral vasoconstriction. Unless intentional (brief ICP rescue — senior-directed only), reduce minute ventilation.",
    });
  }

  return {
    hasData: true,
    phCategory,
    pco2Category,
    permissiveApplies,
    permissiveNote,
    advice,
    warnings,
  };
}

// ─── Scenario starting settings ──────────────────────────────────────────────

export function getScenarioGuide(inputs: MVInputs, ageMonths: number): MVScenarioGuide | null {
  if (!inputs.diagnosis) return null;
  const ag = ageGroupLabel(ageMonths);

  const rrByAge = (): string => {
    if (ageMonths < 1)   return "30–50";
    if (ageMonths < 12)  return "25–40";
    if (ageMonths < 36)  return "20–30";
    if (ageMonths < 96)  return "15–25";
    return "12–20";
  };

  switch (inputs.diagnosis) {
    case "normal":
      return {
        diagnosisLabel: "Normal Lungs / Post-operative",
        mode: "Consider A/C Volume-targeted or Pressure-controlled (SIMV±PS). Volume-targeted helps limit volutrauma.",
        vtTarget: "Suggested 6–8 mL/kg ideal body weight. Reassess with measured VT.",
        peepRange: "4–6 cmH₂O. Physiological PEEP to prevent atelectasis.",
        rrRange: `${rrByAge()} bpm (${ag} range). Adjust for PaCO₂/pH.`,
        itime: "0.5–1.0 s. I:E 1:2 to 1:3. Adjust by age.",
        fio2Start: "Start 0.40–0.50. Titrate to SpO₂ target.",
        oxyTarget: "SpO₂ 92–97%. Wean FiO₂ to ≤ 0.40 as tolerated.",
        ventTarget: "Target pH 7.35–7.45, PaCO₂ 35–45 mmHg.",
        cautions: ["Reassess VT/kg after each setting change.", "Confirm ETT position post-intubation (CXR + ETCO₂)."],
        seniorReviewIf: ["Oxygenation fails to respond to initial settings", "Unexpected high pressures"],
      };

    case "pneumonia":
      return {
        diagnosisLabel: "Pneumonia (non-PARDS)",
        mode: "Volume-targeted or Pressure-controlled. Consider SIMV + PS to support spontaneous breathing.",
        vtTarget: "Suggested 6–8 mL/kg. If worsening hypoxaemia consider reducing to 5–6 mL/kg.",
        peepRange: "5–8 cmH₂O. Higher if consolidation/atelectasis present.",
        rrRange: `${rrByAge()} bpm. May need higher to compensate if VT reduced.`,
        itime: "0.5–1.0 s adjusted for age.",
        fio2Start: "Titrate to SpO₂ target. Avoid prolonged FiO₂ > 0.60.",
        oxyTarget: "SpO₂ 92–97%. Wean FiO₂ as oxygenation improves.",
        ventTarget: "pH 7.35–7.45, PaCO₂ 35–45 mmHg.",
        cautions: [
          "Monitor for progression to PARDS — reassess OI/OSI daily.",
          "Secretion management and positioning may significantly improve oxygenation.",
        ],
        seniorReviewIf: ["OI ≥ 4 develops (PARDS criteria met)", "FiO₂ requirement escalating"],
      };

    case "pards":
      return {
        diagnosisLabel: "PARDS / Severe ARDS (PALICC-2)",
        mode: "Volume-targeted preferred if available (easier to monitor VT/kg). Pressure-controlled acceptable with strict VT monitoring.",
        vtTarget: "Lung-protective: suggested 3–6 mL/kg. Start 6 mL/kg and reduce if Pplat > 28 or driving pressure > 15 cmH₂O. Reassess after every change.",
        peepRange: "8–15 cmH₂O. Titrate to best oxygenation without haemodynamic compromise. Higher PEEP for moderate/severe (PALICC-2). Individualise — no fixed table.",
        rrRange: `Higher than age-normal to compensate for low VT. Max RR limited by I:E (avoid air trapping). Assess with ETCO₂/ABG.`,
        itime: "Shorter inspiratory time to allow adequate expiratory time. Monitor ETCO₂.",
        fio2Start: "Start 1.0 (100%). Wean to lowest tolerated once oxygenation stable.",
        oxyTarget: "SpO₂ 88–92% acceptable in moderate/severe PARDS (permissive hypoxaemia). Higher target acceptable if easily achievable on low FiO₂.",
        ventTarget: "Permissive hypercapnia acceptable (pH ≥ 7.20) to achieve lung protection per PALICC-2. Avoid Pplat > 28 cmH₂O.",
        cautions: [
          "Keep Pplat ≤ 28 cmH₂O (PALICC-2).",
          "Aim driving pressure < 15 cmH₂O where achievable.",
          "Prone positioning consideration for moderate/severe PARDS (senior-directed).",
          "Neuromuscular blockade: consider in severe PARDS to improve synchrony (senior decision).",
          "HFOV: consider escalation if conventional MV fails (PALICC-2 — senior/PICU decision).",
        ],
        seniorReviewIf: [
          "OI ≥ 8 (moderate) or ≥ 16 (severe)",
          "FiO₂ > 0.80 required",
          "pH < 7.20 despite optimised settings",
          "Haemodynamic compromise with high PEEP",
        ],
      };

    case "asthma":
      return {
        diagnosisLabel: "Severe Asthma / Status Asthmaticus",
        mode: "A/C Volume-targeted preferred to detect dynamic hyperinflation via peak vs plateau pressure differential. Avoid patient dyssynchrony.",
        vtTarget: "6–8 mL/kg. Do NOT aggressively reduce VT — prioritise expiratory time over tight VT targets.",
        peepRange: "0–5 cmH₂O. Low PEEP — intrinsic PEEP from air trapping may be significant. Measure auto-PEEP if possible.",
        rrRange: "10–16 bpm (lower than age-normal). CRITICAL: Low RR extends expiratory time and reduces air trapping. DO NOT increase RR to correct hypercapnia.",
        itime: "Shorter I-time. Target I:E ≥ 1:3 to 1:5 to allow full exhalation.",
        fio2Start: "Titrate to SpO₂ > 92%. High FiO₂ is generally acceptable during acute crisis.",
        oxyTarget: "SpO₂ ≥ 92%.",
        ventTarget: "Permissive hypercapnia is expected and acceptable. pH ≥ 7.20 target. DO NOT increase RR to lower PaCO₂ — worsens air trapping.",
        cautions: [
          "Disconnect vent circuit briefly if sudden collapse suspected (rule out tension pneumothorax vs severe air trapping).",
          "Monitor peak vs plateau pressure differential — rising gradient suggests worsening bronchospasm.",
          "Auto-PEEP risk is high. Monitor for haemodynamic instability.",
          "Aggressively continue bronchodilator therapy (MDI via adaptor or continuous nebulisation).",
          "Sedation optimisation critical — fighting the vent worsens dyssynchrony and air trapping.",
        ],
        seniorReviewIf: [
          "pH < 7.20 despite optimised settings",
          "Haemodynamic collapse",
          "Auto-PEEP > 10 cmH₂O",
          "Suspected pneumothorax",
        ],
      };

    case "bronchiolitis":
      return {
        diagnosisLabel: "Bronchiolitis / RSV lower respiratory tract",
        mode: "Pressure-controlled or volume-targeted. CPAP or HFNC may avoid intubation — intubate only if failing non-invasive support.",
        vtTarget: "5–7 mL/kg. Adjust for secretion burden — may need higher RR if small VT.",
        peepRange: "5–8 cmH₂O. Supports small airways kept open by PEEP.",
        rrRange: `${rrByAge()} bpm. Adjust to ABG/ETCO₂.`,
        itime: "0.5–0.8 s. Monitor for air trapping — some obstructive physiology.",
        fio2Start: "Titrate to SpO₂ target.",
        oxyTarget: "SpO₂ ≥ 92–94%.",
        ventTarget: "Target near-normal PaCO₂. Mild permissive hypercapnia may be acceptable.",
        cautions: [
          "Aggressive secretion management — suction frequently.",
          "Watch for air trapping (similar to asthma component).",
          "Atelectasis is common — position changes and physiotherapy may help.",
        ],
        seniorReviewIf: ["Worsening hypoxaemia on ≥ 60% FiO₂", "Severe respiratory acidosis"],
      };

    case "shock":
      return {
        diagnosisLabel: "Shock / Haemodynamic Instability",
        mode: "Any mode — minimise mean airway pressure where possible without sacrificing oxygenation.",
        vtTarget: "6–8 mL/kg. Avoid high PEEP if compromising venous return.",
        peepRange: "Lowest PEEP compatible with adequate oxygenation (4–6 cmH₂O). High PEEP impairs preload → worsens shock.",
        rrRange: `${rrByAge()} bpm. Normalise gas exchange — avoid severe hypercapnia or hypocapnia.`,
        itime: "Standard for age. Avoid prolonged I-time if it raises mean airway pressure.",
        fio2Start: "Start 1.0. Wean as oxygenation stabilises.",
        oxyTarget: "SpO₂ ≥ 92–95%.",
        ventTarget: "Target near-normal pH and PaCO₂. Severe acidosis worsens cardiac function — treat metabolic component.",
        cautions: [
          "CRITICAL: Post-intubation cardiovascular collapse is common in shock. Prepare vasopressors and fluid bolus BEFORE intubation.",
          "Positive pressure ventilation reduces preload — monitor BP and HR continuously.",
          "Ketamine preferred induction agent if haemodynamically unstable.",
          "Minimise ventilator-induced haemodynamic effects.",
        ],
        seniorReviewIf: [
          "Haemodynamic deterioration after intubation",
          "Unable to maintain SpO₂ on reasonable support",
          "Concurrent ARDS physiology",
        ],
      };

    case "neuromuscular":
      return {
        diagnosisLabel: "Neuromuscular Weakness (GBS, myopathy, etc.)",
        mode: "Pressure support (PSV) if spontaneous effort adequate. A/C if no respiratory drive. Titrate carefully — may have normal lung compliance.",
        vtTarget: "6–8 mL/kg. Lungs often normal — lower pressures needed.",
        peepRange: "4–6 cmH₂O. Prevent atelectasis.",
        rrRange: `${rrByAge()} bpm or match patient's own drive.`,
        itime: "Standard for age.",
        fio2Start: "Start 0.40. Titrate to SpO₂ target.",
        oxyTarget: "SpO₂ ≥ 94–97%. Target near-normal oxygenation.",
        ventTarget: "Normocapnia: pH 7.35–7.45, PaCO₂ 35–45 mmHg.",
        cautions: [
          "Secretion management critical — cough may be absent or weak.",
          "Tracheostomy should be considered early in prolonged/progressive weakness.",
          "Daily NIF (negative inspiratory force) assessment if able.",
          "Autonomic instability possible (e.g. GBS) — anticipate cardiac arrhythmias.",
        ],
        seniorReviewIf: ["Progressive weakness", "Autonomic dysfunction", "Planning for prolonged ventilation"],
      };

    case "raised-icp":
    case "post-arrest":
      return {
        diagnosisLabel: inputs.diagnosis === "raised-icp" ? "Raised ICP / Severe TBI" : "Post-Cardiac Arrest (POCA)",
        mode: "Volume-targeted preferred — predictable minute ventilation. Avoid high PEEP unless oxygenation critically requires it.",
        vtTarget: "6–8 mL/kg. Normal lung compliance expected.",
        peepRange: "4–6 cmH₂O. Avoid high PEEP — impairs cerebral venous return and raises ICP.",
        rrRange: `${rrByAge()} bpm. Titrate to normocapnia. ETCO₂ monitoring strongly recommended.`,
        itime: "Standard for age.",
        fio2Start: inputs.diagnosis === "post-arrest" ? "Start 1.0 peri-arrest. Wean to FiO₂ 0.21–0.50 targeting SpO₂ 94–98% per post-arrest protocol." : "Start 0.40–0.60. Titrate.",
        oxyTarget: inputs.diagnosis === "post-arrest"
          ? "SpO₂ 94–98%. Avoid hyperoxia (SpO₂ > 99%) — linked to worse neurological outcomes in POCA."
          : "SpO₂ ≥ 94%. Avoid hypoxia.",
        ventTarget: "STRICT NORMOCAPNIA: PaCO₂ 35–40 mmHg. Avoid hypocapnia (cerebral vasoconstriction/ischaemia) and hypercapnia (vasodilation/raised ICP). Short-term mild hyperventilation (PaCO₂ 30–35) ONLY as bridge to ICP intervention — senior/neurosurgery directed.",
        cautions: [
          "Continuous ETCO₂ monitoring essential.",
          "Head of bed 30° elevation unless contraindicated.",
          "Avoid succinylcholine if raised ICP suspected (use rocuronium).",
          inputs.diagnosis === "post-arrest" ? "Temperature management: maintain normothermia. Avoid fever." : "Monitor for Cushing triad (bradycardia, hypertension, irregular breathing).",
        ],
        seniorReviewIf: [
          "PaCO₂ trending out of normocapnic range",
          "Signs of herniation (pupils, Cushing)",
          inputs.diagnosis === "post-arrest" ? "Persistent haemodynamic instability" : "ICP > 20 mmHg",
        ],
      };

    case "other":
    default:
      return {
        diagnosisLabel: "Other / Unspecified",
        mode: "Select mode based on clinical picture and available equipment.",
        vtTarget: "Suggested 6–8 mL/kg. Adjust based on diagnosis and compliance.",
        peepRange: "4–8 cmH₂O. Titrate to oxygenation and haemodynamics.",
        rrRange: `${rrByAge()} bpm. Adjust to target pH/PaCO₂.`,
        itime: "0.5–1.0 s adjusted for age. Monitor I:E ratio.",
        fio2Start: "Start 0.40–0.60. Titrate to SpO₂ target.",
        oxyTarget: "SpO₂ 92–97%. Adjust for clinical context.",
        ventTarget: "Target pH 7.35–7.45, PaCO₂ 35–45 mmHg unless clinically indicated otherwise.",
        cautions: ["Reassess frequently and document rationale for non-standard settings."],
        seniorReviewIf: ["Any uncertainty about diagnosis or appropriate ventilator targets"],
      };
  }
}

// ─── Global safety validation ─────────────────────────────────────────────────

function validateSafety(inputs: MVInputs, ageMonths: number): MVWarning[] {
  const warnings: MVWarning[] = [];

  if (inputs.weightKg !== null && inputs.weightKg < 3) {
    warnings.push({
      code: "very-low-weight",
      severity: "warning",
      title: `Low weight ${inputs.weightKg} kg — specialist care required`,
      message: "Very small patients require specialist neonatal/PICU expertise. All suggested ranges are approximations only.",
    });
  }

  if (ageMonths < 1) {
    warnings.push({
      code: "neonatal-patient",
      severity: "warning",
      title: "Neonatal patient — specialist input required",
      message: "Neonatal mechanical ventilation differs significantly from older children. Involve neonatology or PICU at first contact.",
    });
  }

  if (inputs.lactate !== null && inputs.lactate >= 2) {
    warnings.push({
      code: "hemodynamic-instability",
      severity: inputs.lactate >= 4 ? "critical" : "warning",
      title: `Lactate ${inputs.lactate} mmol/L — haemodynamic concern`,
      message: inputs.lactate >= 4
        ? "Severe hyperlactataemia. Shock and organ dysfunction likely. Senior/PICU review. Weaning contraindicated."
        : "Elevated lactate suggests haemodynamic instability. Address perfusion before weaning or reducing ventilator support.",
      action: inputs.lactate >= 4 ? "Senior/PICU review immediately" : undefined,
    });
  }

  return warnings;
}

// ─── Weaning assessment ───────────────────────────────────────────────────────

export function assessWeaning(inputs: MVInputs): MVWeaningResult {
  const criteria: WeaningCriterion[] = [];
  const blockers: string[] = [];

  // 1. Oxygenation adequacy
  const fio2Ok = inputs.fio2Percent !== null ? inputs.fio2Percent <= 40 : null;
  const peepOk = inputs.peep !== null ? inputs.peep <= 8 : null;
  criteria.push({
    id: "oxygenation",
    label: "Acceptable oxygenation on low support",
    met: fio2Ok === true && peepOk === true ? true : (fio2Ok === false || peepOk === false) ? false : null,
    note: `FiO₂ ≤ 40% ${inputs.fio2Percent !== null ? `(current ${inputs.fio2Percent}%)` : "(not entered)"}; PEEP ≤ 8 cmH₂O ${inputs.peep !== null ? `(current ${inputs.peep})` : "(not entered)"}`,
  });

  if (fio2Ok === false) blockers.push("FiO₂ still > 40% — oxygenation support too high");
  if (peepOk === false) blockers.push("PEEP still > 8 cmH₂O — consider gradual weaning first");

  // 2. Ventilation stability
  const ventOk = inputs.ph !== null ? (inputs.ph >= 7.30 && inputs.ph <= 7.50) : null;
  criteria.push({
    id: "ventilation",
    label: "Adequate ventilation (acceptable pH/PaCO₂ on current settings)",
    met: ventOk,
    note: inputs.ph !== null ? `pH ${inputs.ph}` : "No ABG/VBG entered",
  });
  if (ventOk === false) blockers.push("pH outside acceptable range for extubation attempt");

  // 3. Haemodynamic stability (lactate gate)
  const haemoOk = inputs.lactate !== null ? inputs.lactate < 2 : null;
  criteria.push({
    id: "haemodynamics",
    label: "Haemodynamic stability (lactate < 2 mmol/L, minimal or no vasoactives)",
    met: haemoOk,
    note: inputs.lactate !== null ? `Lactate ${inputs.lactate} mmol/L` : "Lactate not entered — assess clinically",
  });
  if (haemoOk === false) blockers.push(`Lactate ${inputs.lactate} mmol/L — haemodynamic instability. Weaning not advised.`);

  // 4. Improving disease
  criteria.push({
    id: "disease-improving",
    label: "Improving underlying disease process",
    met: null,
    note: "Clinical assessment required — cannot be computed",
  });

  // 5. Mental status / airway protection
  criteria.push({
    id: "airway-protection",
    label: "Adequate mental status and airway protective reflexes (cough, gag)",
    met: null,
    note: "Assess cough strength, gag reflex, and GCS at bedside",
  });

  // 6. Secretion burden
  criteria.push({
    id: "secretions",
    label: "Manageable secretion burden (suction < every 2h)",
    met: null,
    note: "Copious secretions predict extubation failure",
  });

  // 7. SBT
  criteria.push({
    id: "sbt",
    label: "Successful Spontaneous Breathing Trial (SBT) — T-piece or low PS (5–8 cmH₂O)",
    met: null,
    note: "Perform 30–120 min SBT if other criteria met. Abort if clinical deterioration.",
  });

  // 8. Cuff leak
  criteria.push({
    id: "leak-test",
    label: "Consider cuff leak test if high-risk for post-extubation stridor",
    met: null,
    note: "Particularly important in infants, after prolonged intubation, or prior failed extubation",
  });

  const metCount = criteria.filter((c) => c.met === true).length;
  const failedCount = criteria.filter((c) => c.met === false).length;

  let overallStatus: MVWeaningResult["overallStatus"] = "no-data";
  if (failedCount > 0) overallStatus = "not-ready";
  else if (metCount >= 3) overallStatus = "proceed-with-assessment";

  return {
    overallStatus,
    criteria,
    blockers,
    note: "Weaning readiness is a clinical assessment, not an automated verdict. Never declare a patient 'ready for extubation' based solely on computed criteria. Senior/PICU review is required before extubation.",
  };
}

// ─── Main entry point ────────────────────────────────────────────────────────

// ─── Initial setup computation ────────────────────────────────────────────────

export function computeInitialSettings(inputs: MVInputs, ageMonths: number): MVInitialSettings | null {
  if (!inputs.diagnosis || inputs.weightKg === null || inputs.weightKg <= 0) return null;
  const w = inputs.weightKg;

  // Age-based RR and I-time
  const rrByAge =
    ageMonths < 1   ? "30–40" :
    ageMonths < 12  ? "25–35" :
    ageMonths < 36  ? "20–30" :
    ageMonths < 96  ? "15–25" : "12–20";
  const itimeByAge =
    ageMonths < 1   ? "0.35–0.45" :
    ageMonths < 12  ? "0.5–0.7" :
    ageMonths < 36  ? "0.6–0.8" :
    ageMonths < 96  ? "0.8–1.0" : "0.9–1.2";

  // Per-diagnosis numeric profile
  type Prof = {
    label: string; mode: string; vtMin: number; vtMax: number;
    peep: string; pressure: string; fio2: string; spo2: string; co2: string;
    rr?: string; itime?: string; ie?: string; cautions: string[]; titrate: string;
  };

  const D = inputs.diagnosis;
  const profiles: Record<string, Prof> = {
    normal: {
      label: "Normal Lungs / Post-operative",
      mode: "Volume-targeted A/C or SIMV+PS (volume-targeted limits volutrauma)",
      vtMin: 6, vtMax: 8, peep: "5 cmH₂O", pressure: "Titrate pressure to deliver VT below; keep Pplat ≤ 28 cmH₂O",
      fio2: "0.40–0.50", spo2: "94–98%", co2: "PaCO₂ 35–45 mmHg, pH 7.35–7.45",
      ie: "1:2 to 1:3",
      cautions: ["Confirm ETT position (CXR + ETCO₂) after intubation."],
      titrate: "Obtain ABG 30–60 min after initiation and re-titrate.",
    },
    pneumonia: {
      label: "Pneumonia (non-PARDS)",
      mode: "Volume-targeted A/C or SIMV+PS",
      vtMin: 6, vtMax: 8, peep: "5–8 cmH₂O (higher if consolidation/atelectasis)", pressure: "Titrate pressure to VT below; keep Pplat ≤ 28 cmH₂O",
      fio2: "Titrate to SpO₂ target; avoid prolonged > 0.60", spo2: "92–97%", co2: "PaCO₂ 35–45 mmHg",
      ie: "1:2",
      cautions: ["Monitor for progression to PARDS — reassess OI/OSI daily."],
      titrate: "Obtain ABG 30–60 min after initiation. Reassess if oxygenation worsens.",
    },
    pards: {
      label: "PARDS / Severe ARDS (PALICC-2)",
      mode: "Volume-targeted preferred (precise VT control). Pressure-controlled acceptable with strict VT monitoring",
      vtMin: 5, vtMax: 6, peep: "8–10 cmH₂O start (titrate to oxygenation/haemodynamics)", pressure: "Titrate pressure to VT below; keep Pplat ≤ 28 cmH₂O, driving pressure < 15",
      fio2: "1.0 (100%) initially, wean rapidly", spo2: "88–92% (permissive hypoxaemia)", co2: "Permissive hypercapnia OK: pH ≥ 7.20",
      ie: "1:1.5 to 1:2",
      cautions: ["Start VT 6 mL/kg, reduce toward 3–6 if Pplat > 28 or ΔP > 15.", "Consider neuromuscular blockade if dyssynchronous (senior decision).", "Consider prone positioning for moderate/severe PARDS."],
      titrate: "Obtain ABG 30–60 min after initiation. Reassess OI/OSI; escalate if severe.",
    },
    asthma: {
      label: "Severe Asthma / Obstructive",
      mode: "Volume-targeted A/C (detects air trapping via peak–plateau gap)",
      vtMin: 6, vtMax: 8, peep: "0–5 cmH₂O (LOW — intrinsic PEEP from trapping)", pressure: "Titrate pressure to VT; monitor peak vs plateau gap",
      fio2: "Titrate to SpO₂ ≥ 92%", spo2: "≥ 92%", co2: "Permissive hypercapnia expected: pH ≥ 7.20",
      rr: "LOW for age (10–16 bpm) — extends expiratory time", itime: "0.6–0.8 s", ie: "≥ 1:3 to 1:5 (long expiration)",
      cautions: ["CRITICAL: Use LOW RR. Do NOT increase RR to correct CO₂ — worsens air trapping.", "Monitor for auto-PEEP and pneumothorax.", "Disconnect circuit briefly if sudden collapse (rule out trapping vs pneumothorax)."],
      titrate: "Obtain ABG 30–60 min. Prioritise expiratory time over CO₂ normalisation.",
    },
    bronchiolitis: {
      label: "Bronchiolitis",
      mode: "Pressure-controlled or volume-targeted",
      vtMin: 5, vtMax: 7, peep: "5–6 cmH₂O", pressure: "Titrate pressure to VT; watch for air trapping",
      fio2: "Titrate to SpO₂ target", spo2: "≥ 92–94%", co2: "Mild permissive hypercapnia acceptable",
      ie: "1:2 to 1:3",
      cautions: ["Aggressive secretion clearance.", "Some obstructive physiology — watch air trapping."],
      titrate: "Obtain ABG 30–60 min after initiation.",
    },
    shock: {
      label: "Shock / Haemodynamic Instability",
      mode: "Any mode — minimise mean airway pressure",
      vtMin: 6, vtMax: 8, peep: "4–6 cmH₂O (LOW — high PEEP impairs preload)", pressure: "Titrate pressure to VT; minimise mean airway pressure",
      fio2: "1.0 initially, wean as stable", spo2: "≥ 92–95%", co2: "Near-normal pH/PaCO₂ — avoid severe acidosis",
      ie: "1:2",
      cautions: ["CRITICAL: Prepare vasopressors + fluid BEFORE intubation — post-intubation collapse common.", "Ketamine preferred induction if unstable.", "Minimise PEEP if hypotension."],
      titrate: "Monitor BP/HR continuously. Obtain ABG once stabilised.",
    },
    neuromuscular: {
      label: "Neuromuscular Weakness",
      mode: "PSV if spontaneous effort adequate; A/C if no drive",
      vtMin: 6, vtMax: 8, peep: "4–6 cmH₂O", pressure: "Titrate pressure to VT (lungs often normal — low pressures)",
      fio2: "0.40, titrate", spo2: "≥ 94–97%", co2: "Normocapnia: PaCO₂ 35–45 mmHg",
      ie: "1:2",
      cautions: ["Secretion management critical — cough may be weak.", "Daily NIF assessment if able.", "Consider early tracheostomy if prolonged."],
      titrate: "Obtain ABG 30–60 min after initiation.",
    },
    "raised-icp": {
      label: "Raised ICP / Severe TBI",
      mode: "Volume-targeted (predictable minute ventilation)",
      vtMin: 6, vtMax: 8, peep: "4–6 cmH₂O (avoid high PEEP — impairs cerebral venous return)", pressure: "Titrate pressure to VT",
      fio2: "0.40–0.60, titrate", spo2: "≥ 94%", co2: "STRICT normocapnia PaCO₂ 35–40 mmHg",
      ie: "1:2",
      cautions: ["Continuous ETCO₂ essential.", "Avoid hypocapnia (ischaemia) and hypercapnia (raised ICP).", "Head of bed 30°. Avoid succinylcholine — use rocuronium."],
      titrate: "Obtain ABG early; correlate ETCO₂ to PaCO₂. Avoid PaCO₂ swings.",
    },
    "post-arrest": {
      label: "Post-Cardiac Arrest",
      mode: "Volume-targeted (predictable minute ventilation)",
      vtMin: 6, vtMax: 8, peep: "4–6 cmH₂O", pressure: "Titrate pressure to VT",
      fio2: "1.0 peri-arrest, wean to SpO₂ 94–98% (avoid hyperoxia)", spo2: "94–98% (avoid > 99%)", co2: "Normocapnia PaCO₂ 35–45 mmHg",
      ie: "1:2",
      cautions: ["Avoid hyperoxia — worse neuro outcomes.", "Maintain normothermia, avoid fever.", "Continuous ETCO₂."],
      titrate: "Obtain ABG 30–60 min. Target normocapnia and normoxia.",
    },
    other: {
      label: "Other / Unspecified",
      mode: "Select mode by clinical picture",
      vtMin: 6, vtMax: 8, peep: "4–8 cmH₂O", pressure: "Titrate pressure to VT; keep Pplat ≤ 28–30 cmH₂O",
      fio2: "0.40–0.60, titrate", spo2: "92–97%", co2: "PaCO₂ 35–45 mmHg unless otherwise indicated",
      ie: "1:2",
      cautions: ["Document rationale for any non-standard settings."],
      titrate: "Obtain ABG 30–60 min after initiation.",
    },
  };

  const p = profiles[D] ?? profiles.other;
  const vtLow = Math.round(w * p.vtMin);
  const vtHigh = Math.round(w * p.vtMax);

  return {
    diagnosisLabel: p.label,
    modeSuggestion: p.mode,
    vtMl: `${vtLow}–${vtHigh} mL`,
    vtPerKg: `${p.vtMin}–${p.vtMax} mL/kg × ${w} kg`,
    rr: `${p.rr ?? rrByAge} bpm`,
    peep: p.peep,
    pressureTarget: p.pressure,
    itime: `${p.itime ?? itimeByAge} s`,
    ieRatio: p.ie ?? "1:2",
    fio2Start: p.fio2,
    spo2Target: p.spo2,
    co2Target: p.co2,
    keyCautions: p.cautions,
    titrationNote: p.titrate,
  };
}

export function runMVAssessment(inputs: MVInputs): MVFullOutput {
  const hasMinimumData = inputs.weightKg !== null && inputs.age !== null;
  const ageMonths = inputs.age ? ageToMonths(inputs.age) : null;

  if (!hasMinimumData || ageMonths === null) {
    return {
      hasMinimumData: false,
      ageMonths: null,
      globalWarnings: [],
      airway: null,
      oxygenation: null,
      ventilation: null,
      scenario: null,
      initialSettings: null,
      weaning: null,
    };
  }

  const globalWarnings = validateSafety(inputs, ageMonths);

  return {
    hasMinimumData: true,
    ageMonths,
    globalWarnings,
    airway: assessAirway(inputs, ageMonths),
    oxygenation: assessOxygenation(inputs),
    ventilation: assessVentilation(inputs),
    scenario: getScenarioGuide(inputs, ageMonths),
    initialSettings: computeInitialSettings(inputs, ageMonths),
    weaning: assessWeaning(inputs),
  };
}
