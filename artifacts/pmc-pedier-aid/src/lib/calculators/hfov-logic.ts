/**
 * Pediatric & Neonatal HFOV — Clinical Decision Support Engine
 *
 * References:
 *   PALICC-2: Pediatric Acute Lung Injury Consensus Conference Group, PCCM 2023
 *   PEMVECC: Kneyber et al. Pediatr Crit Care Med 2017;18(8):e274–e310
 *   Neonatal HFOV: Henderson-Smart et al. Cochrane 2009 + institutional NICU protocols
 *   PPHN: Abman et al. Circulation 2015
 *
 * Safety: Structured bedside guidance only.
 * All outputs use "consider", "suggested starting range", and "reassess" language.
 * NOT a substitute for clinical judgment or senior PICU/NICU review.
 */

import { calculateOI, calculateOSI } from "./formulas";

// ─── Core types ───────────────────────────────────────────────────────────────

export type HFOVPathway = "pediatric" | "neonatal";
export type AgeUnit = "days" | "months" | "years";
export type WarningSeverity = "info" | "warning" | "critical";

export type HFOVDiagnosis =
  | "pards"
  | "pneumonia"
  | "air-leak"
  | "phtn"
  | "rds"
  | "mas"
  | "pphn"
  | "cdh"
  | "neonatal-air-leak"
  | "other";

export interface AgeInput {
  value: number;
  unit: AgeUnit;
}

export interface HFOVInputs {
  pathway: HFOVPathway | "";
  age: AgeInput | null;
  gestationalAgeWeeks: number | null;
  weightKg: number | null;
  diagnosis: HFOVDiagnosis | "";

  conventionalFailed: boolean | null;
  convFio2Percent: number | null;
  convMap: number | null;
  convPeep: number | null;
  convPip: number | null;
  convRr: number | null;
  convVtMl: number | null;

  onHFOV: boolean;
  hfovMap: number | null;
  hfovAmplitude: number | null;
  hfovFreqHz: number | null;
  hfovFio2Percent: number | null;
  hfovItime: number | null;

  ph: number | null;
  pco2: number | null;
  pao2: number | null;
  spo2: number | null;

  haemodynamicConcern: boolean;
  pneumothoraxPresent: boolean;
}

export interface HFOVWarning {
  code: string;
  severity: WarningSeverity;
  title: string;
  message: string;
  action?: string;
}

// ─── Indication result ────────────────────────────────────────────────────────

export interface HFOVIndicationResult {
  criteriaMetCount: number;
  metCriteria: string[];
  unmetCriteria: string[];
  hfovConsidered: boolean;
  warnings: HFOVWarning[];
  note: string;
}

// ─── Contraindication result ──────────────────────────────────────────────────

export interface HFOVContraindication {
  label: string;
  severity: "absolute" | "relative";
  reason: string;
}

export interface HFOVContraindicationResult {
  hasAbsolute: boolean;
  items: HFOVContraindication[];
}

// ─── Setup guide ──────────────────────────────────────────────────────────────

export interface HFOVSetupGuide {
  diagnosisLabel: string;
  mapConcept: string;
  suggestedMapRange: string;
  amplitudeConcept: string;
  suggestedAmplitudeRange: string;
  suggestedFreqHz: string;
  fio2Start: string;
  itime: string;
  oxyTarget: string;
  ventTarget: string;
  cxrTarget: string;
  specialCautions: string[];
  seniorReviewIf: string[];
}

// ─── Oxygenation result ───────────────────────────────────────────────────────

export type HFOVPARDSGrade = "no-criteria" | "mild" | "moderate" | "severe" | "no-data";

export interface HFOVOxygenationResult {
  oi: number | null;
  osi: number | null;
  usedIndex: "OI" | "OSI" | null;
  grade: HFOVPARDSGrade;
  gradeLabel: string;
  pf: number | null;
  warnSpO2Unreliable: boolean;
  ecmoDiscussionTrigger: boolean;
  warnings: HFOVWarning[];
}

// ─── Ventilation result ───────────────────────────────────────────────────────

export interface HFOVVentilationResult {
  hasData: boolean;
  phCategory: "normal" | "acidosis" | "alkalosis" | null;
  pco2Category: "normal" | "high" | "low" | null;
  permissiveApplies: boolean;
  permissiveNote: string;
  hypocarbiaDanger: boolean;
  pphnAcidosisFlag: boolean;
  advice: string[];
  warnings: HFOVWarning[];
}

// ─── Adjustment logic ─────────────────────────────────────────────────────────

export interface HFOVAdjustmentGuide {
  id: string;
  scenario: string;
  priority: "critical" | "high" | "medium";
  detected: string;
  steps: string[];
  seniorReview: boolean;
  seniorNote?: string;
}

// ─── Weaning ──────────────────────────────────────────────────────────────────

export interface HFOVWeaningCriterion {
  id: string;
  label: string;
  met: boolean | null;
  note: string;
}

export interface HFOVWeaningResult {
  status: "consider-weaning" | "not-ready" | "no-data";
  blockers: string[];
  criteria: HFOVWeaningCriterion[];
  transitionConcept: string;
  note: string;
}

// ─── Full output ──────────────────────────────────────────────────────────────

export interface HFOVFullOutput {
  hasMinimumData: boolean;
  pathway: HFOVPathway | null;
  ageMonths: number | null;
  isPreterm: boolean;
  globalWarnings: HFOVWarning[];
  indications: HFOVIndicationResult | null;
  contraindications: HFOVContraindicationResult | null;
  oxygenation: HFOVOxygenationResult | null;
  ventilation: HFOVVentilationResult | null;
  setupGuide: HFOVSetupGuide | null;
  adjustments: HFOVAdjustmentGuide[];
  weaning: HFOVWeaningResult | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function ageToMonths(age: AgeInput): number {
  if (age.unit === "days") return age.value / 30.4;
  if (age.unit === "months") return age.value;
  return age.value * 12;
}

function isNeonatalByAge(ageMonths: number): boolean {
  return ageMonths < 1;
}

export const DIAG_LABELS: Record<string, string> = {
  pards: "Pediatric ARDS (PARDS)",
  pneumonia: "Severe Pneumonia",
  "air-leak": "Air Leak Syndrome",
  phtn: "Pulmonary Hypertension",
  rds: "Neonatal RDS",
  mas: "Meconium Aspiration Syndrome",
  pphn: "PPHN",
  cdh: "Congenital Diaphragmatic Hernia (CDH)",
  "neonatal-air-leak": "Neonatal Air Leak / PIE",
  other: "Other",
};

// ─── Global safety validation ─────────────────────────────────────────────────

function validateGlobal(inputs: HFOVInputs, ageMonths: number): HFOVWarning[] {
  const w: HFOVWarning[] = [];

  if (inputs.pneumothoraxPresent) {
    w.push({
      code: "pneumothorax-present",
      severity: "critical",
      title: "Pneumothorax present — drain before HFOV",
      message: "HFOV is contraindicated with an undrained pneumothorax. The high mean airway pressure will worsen tension and haemodynamic collapse. Chest drain insertion must precede HFOV initiation.",
      action: "Insert chest drain before starting HFOV",
    });
  }

  if (inputs.haemodynamicConcern) {
    w.push({
      code: "haemodynamic-instability",
      severity: "warning",
      title: "Haemodynamic instability — resuscitate first",
      message: "HFOV high sustained MAP impairs venous return and may worsen shock. Ensure adequate resuscitation (fluids, vasoactives) before HFOV initiation. Senior PICU/NICU review required.",
      action: "Resuscitate before HFOV — senior review",
    });
  }

  if (inputs.pathway === "neonatal" && inputs.gestationalAgeWeeks !== null && inputs.gestationalAgeWeeks < 28) {
    w.push({
      code: "extreme-preterm",
      severity: "critical",
      title: "Extreme preterm neonate (< 28 weeks)",
      message: "Extreme prematurity requires subspecialist neonatology expertise for HFOV decisions. Lung mechanics, CO₂ sensitivity, and brain injury risk differ significantly from term neonates. NICU specialist review before any HFOV initiation.",
      action: "NICU specialist review before HFOV",
    });
  }

  if (inputs.weightKg !== null && inputs.weightKg < 0.8) {
    w.push({
      code: "very-low-weight",
      severity: "warning",
      title: "Very low birth weight (< 800g)",
      message: "HFOV in very low birth weight infants requires extreme caution. Amplitude changes have amplified effects. NICU specialist review essential.",
    });
  }

  if (inputs.ph !== null && inputs.ph < 7.10) {
    w.push({
      code: "severe-acidosis",
      severity: "critical",
      title: "Severe acidosis — pH < 7.10",
      message: "Severe acidosis compromises cardiac function. Determine respiratory vs metabolic cause. HFOV may help if respiratory — but senior PICU/NICU review required urgently.",
      action: "Senior/PICU/NICU review immediately",
    });
  }

  if (inputs.pco2 !== null && inputs.pco2 < 30 && inputs.pathway === "neonatal") {
    w.push({
      code: "hypocarbia-neonate",
      severity: "critical",
      title: "Severe hypocarbia in neonate — PaCO₂ < 30 mmHg",
      message: "PaCO₂ < 30 mmHg in neonates is associated with periventricular leukomalacia, hearing loss, and adverse neurodevelopmental outcomes. Reduce amplitude immediately. Target PaCO₂ ≥ 40 mmHg in most neonatal diagnoses.",
      action: "Reduce amplitude urgently — recheck ABG in 20–30 min",
    });
  }

  if (inputs.pco2 !== null && inputs.pco2 < 30 && inputs.pathway === "pediatric") {
    w.push({
      code: "hypocarbia-pediatric",
      severity: "warning",
      title: "Hypocarbia — PaCO₂ < 30 mmHg",
      message: "PaCO₂ < 30 mmHg causes cerebral vasoconstriction and reduced cerebral oxygen delivery. Avoid unless deliberate therapeutic hyperventilation is being used (e.g. acute ICP crisis). Reduce amplitude to allow PaCO₂ to rise.",
      action: "Reduce amplitude — target PaCO₂ ≥ 35 mmHg",
    });
  }

  if (inputs.spo2 !== null && inputs.spo2 < 80) {
    w.push({
      code: "critical-hypoxemia",
      severity: "critical",
      title: "Critical hypoxaemia — SpO₂ < 80%",
      message: "Severe hypoxaemia requires immediate troubleshooting. Check DOPES. Increase FiO₂ to 100% while assessing. Consider need for ECMO consultation.",
      action: "DOPES immediately — FiO₂ to 100%",
    });
  }

  return w;
}

// ─── Indication assessment ────────────────────────────────────────────────────

export function assessIndications(inputs: HFOVInputs, ageMonths: number): HFOVIndicationResult {
  const met: string[] = [];
  const unmet: string[] = [];
  const warnings: HFOVWarning[] = [];
  const fio2Frac = inputs.convFio2Percent ? inputs.convFio2Percent / 100 : null;

  // Compute OI if possible
  let oi: number | null = null;
  if (fio2Frac && inputs.convMap && inputs.pao2) {
    oi = parseFloat(calculateOI(fio2Frac, inputs.convMap, inputs.pao2).toFixed(1));
  }
  let osi: number | null = null;
  if (fio2Frac && inputs.convMap && inputs.spo2 && inputs.spo2 <= 97) {
    osi = parseFloat(calculateOSI(fio2Frac, inputs.convMap, inputs.spo2).toFixed(1));
  }

  const oiVal = oi ?? osi;
  const oiLabel = oi !== null ? `OI ${oi}` : osi !== null ? `OSI ${osi}` : null;

  if (inputs.pathway === "pediatric") {
    // Conventional failure
    if (inputs.conventionalFailed === true) {
      met.push("Conventional ventilation failed / optimised conventional settings inadequate");
    } else if (inputs.conventionalFailed === false) {
      unmet.push("Conventional ventilation not yet optimised — optimise before considering HFOV");
    }

    // OI threshold
    const oiThreshold = 12;
    if (oiVal !== null && oiVal >= oiThreshold) {
      met.push(`${oiLabel} ≥ ${oiThreshold} — refractory hypoxaemia criterion met (PALICC-2 context)`);
    } else if (oiVal !== null) {
      unmet.push(`${oiLabel} < ${oiThreshold} — oxygenation criterion not yet met`);
    }

    // High pressure
    if (inputs.convPip !== null && inputs.convPip >= 30) {
      met.push(`PIP ${inputs.convPip} cmH₂O ≥ 30 — high conventional pressure criterion met`);
    }
    if (inputs.convMap !== null && inputs.convMap >= 15) {
      met.push(`MAP ${inputs.convMap} cmH₂O ≥ 15 — high conventional MAP criterion met`);
    }

    // Diagnosis-specific
    if (inputs.diagnosis === "air-leak") {
      met.push("Air leak syndrome — HFOV minimises tidal volume and peak pressure");
    }
    if (inputs.diagnosis === "pards" || inputs.diagnosis === "pneumonia") {
      if (oiVal !== null && oiVal >= 16) {
        met.push(`${oiLabel} ≥ 16 — severe PARDS criterion met per PALICC-2`);
      }
    }

  } else {
    // Neonatal pathway
    if (inputs.conventionalFailed === true) {
      met.push("Conventional ventilation failed or inadequate for diagnosis");
    }

    const oiNeonatalThreshold = inputs.diagnosis === "rds" ? 8 : 10;
    if (oiVal !== null && oiVal >= oiNeonatalThreshold) {
      met.push(`${oiLabel} ≥ ${oiNeonatalThreshold} — refractory hypoxaemia criterion for neonatal pathway`);
    }

    if (inputs.convMap !== null && inputs.convMap >= 12) {
      met.push(`MAP ${inputs.convMap} cmH₂O ≥ 12 — high neonatal MAP criterion met`);
    }

    if (inputs.diagnosis === "neonatal-air-leak") {
      met.push("Pulmonary interstitial emphysema / air leak — HFOV low-pressure strategy is indicated");
    }

    if (inputs.diagnosis === "rds") {
      met.push("RDS — HFOV established evidence as rescue or primary ventilation strategy");
    }

    if (inputs.diagnosis === "mas") {
      met.push("MAS — HFOV appropriate if conventional fails; exclude severe air trapping component");
      warnings.push({
        code: "mas-air-trapping",
        severity: "warning",
        title: "MAS — assess for air trapping",
        message: "MAS may have an obstructive component with air trapping. Assess carefully before HFOV — if severe air trapping, HFOV may worsen hyperinflation. Senior NICU review before initiation.",
      });
    }

    if (inputs.diagnosis === "pphn") {
      met.push("PPHN — HFOV may support lung recruitment for iNO efficacy; senior NICU/paediatric cardiology review");
    }

    if (inputs.diagnosis === "cdh") {
      met.push("CDH — HFOV considered on individualised basis; senior surgical/NICU review essential");
      warnings.push({
        code: "cdh-caution",
        severity: "warning",
        title: "CDH — complex, senior review before HFOV",
        message: "CDH ventilation is highly individualised. Permissive hypercapnia strategy is standard. HFOV may be considered if conventional fails, but risks of overdistension of contralateral lung require specialist supervision.",
      });
    }
  }

  const considered = met.length >= 1 && !inputs.pneumothoraxPresent;

  if (met.length === 0) {
    warnings.push({
      code: "no-indication",
      severity: "info",
      title: "No clear HFOV indication from data entered",
      message: "Enter more clinical data (OI/OSI, conventional settings, diagnosis) to assess HFOV criteria.",
    });
  }

  return {
    criteriaMetCount: met.length,
    metCriteria: met,
    unmetCriteria: unmet,
    hfovConsidered: considered,
    warnings,
    note: "HFOV should never be initiated from a single number alone. All clinical criteria, haemodynamics, and senior/PICU/NICU input must be considered together.",
  };
}

// ─── Contraindication assessment ──────────────────────────────────────────────

export function assessContraindications(inputs: HFOVInputs): HFOVContraindicationResult {
  const items: HFOVContraindication[] = [];

  if (inputs.pneumothoraxPresent) {
    items.push({
      label: "Undrained pneumothorax",
      severity: "absolute",
      reason: "High sustained MAP will cause tension pneumothorax. Insert chest drain before HFOV.",
    });
  }

  if (inputs.diagnosis === "air-leak" && inputs.pneumothoraxPresent) {
    items.push({
      label: "Tension pneumothorax + HFOV plan",
      severity: "absolute",
      reason: "Cannot start HFOV without draining the pneumothorax first.",
    });
  }

  if (inputs.haemodynamicConcern) {
    items.push({
      label: "Significant haemodynamic instability",
      severity: "relative",
      reason: "HFOV high MAP reduces venous return and can worsen shock. Resuscitate adequately before transition. Senior review required.",
    });
  }

  const isObstructive = inputs.diagnosis === "mas";
  if (isObstructive) {
    items.push({
      label: "Possible obstructive physiology (MAS)",
      severity: "relative",
      reason: "HFOV can worsen gas trapping in obstructive disease. Carefully assess air trapping component before proceeding.",
    });
  }

  if (inputs.pathway === "neonatal" && inputs.gestationalAgeWeeks !== null && inputs.gestationalAgeWeeks < 24) {
    items.push({
      label: "Periviability (< 24 weeks gestation)",
      severity: "absolute",
      reason: "HFOV in periviable neonates requires ethics and senior NICU review. Not a routine bedside decision.",
    });
  }

  return {
    hasAbsolute: items.some((i) => i.severity === "absolute"),
    items,
  };
}

// ─── Setup guide ──────────────────────────────────────────────────────────────

export function getSetupGuide(inputs: HFOVInputs, ageMonths: number): HFOVSetupGuide | null {
  if (!inputs.diagnosis || !inputs.pathway) return null;

  const w = inputs.weightKg ?? 3;
  const ga = inputs.gestationalAgeWeeks;
  const cmap = inputs.convMap;
  const cpip = inputs.convPip;

  // MAP range calculation
  function mapRange(addLow: number, addHigh: number, base?: number | null): string {
    if (base) return `${base + addLow}–${base + addHigh} cmH₂O (conv MAP ${base} + ${addLow}–${addHigh})`;
    return `(enter current MAP to calculate)`;
  }

  // Amplitude range from PIP
  function ampRange(): string {
    if (cpip && cpip > 0) {
      return `${cpip + 10}–${cpip + 20} cmH₂O (PIP ${cpip} + 10–20). Starting range only — titrate to chest wiggle.`;
    }
    return "2–3× MAP as starting concept. Titrate to visible chest wiggle from clavicles to mid-thigh. Reassess immediately.";
  }

  // Frequency by age/weight
  function freqBySize(): string {
    if (inputs.pathway === "neonatal") {
      if (w < 0.75) return "12–15 Hz (extreme preterm)";
      if (w < 1.5)  return "10–12 Hz (very preterm)";
      if (w < 2.5)  return "10–12 Hz (preterm/near-term)";
      return "8–10 Hz (term neonate)";
    }
    // Pediatric
    if (ageMonths < 12)  return "8–10 Hz";
    if (ageMonths < 36)  return "6–8 Hz";
    if (ageMonths < 96)  return "5–7 Hz";
    return "4–6 Hz";
  }

  const diagLabel = DIAG_LABELS[inputs.diagnosis] ?? "Other";

  switch (inputs.diagnosis) {
    case "pards":
    case "pneumonia":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "Open-lung MAP strategy. Set MAP 2–5 cmH₂O above conventional MAP to recruit collapsed alveoli. Reassess oxygenation and haemodynamics after each change.",
        suggestedMapRange: mapRange(2, 5, cmap),
        amplitudeConcept: "Titrate amplitude to achieve visible chest wiggle from clavicles to mid-thigh. Higher amplitude improves CO₂ clearance. Reassess ABG 30–60 min after initiation. Safety ceiling: maximum amplitude ~90 cmH₂O in small patients (< 10 kg); very high amplitudes risk pneumothorax and haemodynamic compromise.",
        suggestedAmplitudeRange: ampRange(),
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0 (100%). Wean rapidly once oxygenation responds. Target SpO₂ 88–92% (PARDS) per PALICC-2.",
        itime: "33% (standard). Do not routinely change.",
        oxyTarget: "SpO₂ 88–92% acceptable in PARDS (permissive hypoxaemia). OI/OSI reassessment after 30–60 min.",
        ventTarget: "Permissive hypercapnia acceptable: pH ≥ 7.20, PaCO₂ tolerated up to 55–60 mmHg if pH adequate. Adjust amplitude/frequency for CO₂.",
        cxrTarget: "Target 8.5–9 posterior ribs on AP CXR. Check 1–2 hours after initiation. Overdistension (> 9 ribs) → reduce MAP.",
        specialCautions: [
          "Ensure neuromuscular blockade and deep sedation before connecting — patient must not breathe against oscillator.",
          "Monitor BP, HR, and SpO₂ continuously for first 30 min — MAP impairs venous return.",
          "ABG at 30–60 min post-initiation, then after every significant change.",
          "Chest wiggle must be visible — if absent, amplitude is insufficient.",
        ],
        seniorReviewIf: [
          "OI ≥ 16 or OSI ≥ 12.3 — severe PARDS, escalation discussion (prone, ECMO)",
          "MAP > 25 cmH₂O required for adequate oxygenation",
          "Haemodynamic compromise after HFOV initiation",
          "No OI/OSI response after 2 hours",
        ],
      };

    case "air-leak":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "LOW pressure strategy. Goal is to allow air leak to resolve by minimising airway pressure. Match or set HFOV MAP equal to or no more than 1–2 cmH₂O ABOVE conventional MAP.",
        suggestedMapRange: mapRange(0, 2, cmap),
        amplitudeConcept: "Lowest amplitude that achieves adequate chest wiggle and CO₂ clearance. Air leak worsens with high pressure.",
        suggestedAmplitudeRange: ampRange(),
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0. Wean as oxygenation improves.",
        itime: "33%.",
        oxyTarget: "Accept lower oxygenation targets temporarily. SpO₂ ≥ 88% acceptable if permissive hypoxaemia allows healing.",
        ventTarget: "Permissive hypercapnia acceptable. Avoid aggressive CO₂ correction that would require high amplitude.",
        cxrTarget: "Monitor for resolution of PIE/pneumothorax. Do not use CXR lung volume target as primary guide in air leak.",
        specialCautions: [
          "Do NOT perform aggressive lung recruitment in air leak — worsens leak.",
          "Ensure chest drain is in situ and functioning before HFOV if pneumothorax present.",
          "Monitor for bilateral tension — serial CXR or POCUS.",
          "Serial CXR every 4–6h or sooner if clinical deterioration.",
        ],
        seniorReviewIf: [
          "Haemodynamic compromise",
          "Air leak not resolving after 12–24h",
          "Bilateral PIE",
          "Consider ECMO if refractory",
        ],
      };

    case "phtn":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "Adequate recruitment without overdistension. HFOV aims to provide stable lung volume for vasodilator (iNO) efficacy. Start MAP 1–2 cmH₂O above conventional MAP.",
        suggestedMapRange: mapRange(1, 2, cmap),
        amplitudeConcept: "Standard amplitude for CO₂ clearance. Avoid hypocarbia — mild permissive hypercapnia may be beneficial for pulmonary vasodilation in some cases.",
        suggestedAmplitudeRange: ampRange(),
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0. High FiO₂ is a pulmonary vasodilator — maintain initially.",
        itime: "33%.",
        oxyTarget: "SpO₂ ≥ 94%. Avoid hypoxaemia — worsens pulmonary vasoconstriction.",
        ventTarget: "Avoid acidosis (worsens PVR). Target pH ≥ 7.35. Avoid hypocarbia (cerebral vasoconstriction and paradoxical PVR effect).",
        cxrTarget: "8–9 posterior ribs. Adequate recruitment important for iNO distribution.",
        specialCautions: [
          "iNO initiation/titration requires senior PICU/NICU/cardiac team involvement.",
          "Avoid hypoxia and acidosis — both cause severe pulmonary vasoconstriction.",
          "Monitor echocardiography for RV function and septal position.",
          "Consider early ECMO discussion if failing — PPHN on HFOV can deteriorate rapidly.",
        ],
        seniorReviewIf: [
          "No response to FiO₂ + HFOV + iNO within 1–2 hours",
          "RV dysfunction on echo",
          "Systemic hypotension",
          "ECMO criteria approaching",
        ],
      };

    case "rds":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "Lung recruitment strategy. RDS has diffuse atelectasis — HFOV MAP opens alveoli and prevents cyclic collapse. Start at MAP equivalent to or 1–2 above conventional MAP.",
        suggestedMapRange: ga && ga < 28
          ? `12–16 cmH₂O (very preterm — start at lower end, titrate)${cmap ? ` · conv MAP ${cmap}` : ""}`
          : ga && ga < 34
          ? `12–18 cmH₂O (preterm)${cmap ? ` · conv MAP ${cmap}` : ""}`
          : `14–18 cmH₂O (near-term/term RDS)${cmap ? ` · conv MAP ${cmap}` : ""}`,
        amplitudeConcept: "Titrate to visible chest wiggle from clavicles to mid-thigh. In extreme preterm infants, amplitude has larger effect — start at lower end and titrate. Reassess every 30 min.",
        suggestedAmplitudeRange: w < 1
          ? "15–25 cmH₂O starting range (titrate carefully in very low BW)"
          : w < 2
          ? "20–30 cmH₂O starting range"
          : "25–35 cmH₂O starting range — titrate to chest wiggle",
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0. Wean rapidly as oxygenation responds to lung recruitment.",
        itime: "33%. Some centres use 50% for severe RDS — institutional protocol.",
        oxyTarget: "SpO₂ 91–95% (preterm), 93–97% (term). Avoid hyperoxia — associated with retinopathy (ROP) and chronic lung disease.",
        ventTarget: "Permissive hypercapnia acceptable: pH ≥ 7.25, PaCO₂ 45–55 mmHg. Avoid hypocarbia (PaCO₂ < 35) — risk of periventricular leukomalacia.",
        cxrTarget: "8–9 posterior ribs. Check CXR 1–2h after initiation. Overdistension (> 9 ribs) → reduce MAP by 1 cmH₂O.",
        specialCautions: [
          "Surfactant therapy: administer before or alongside HFOV as per gestational age protocol.",
          "Hypocarbia is high-risk in preterm neonates — monitor TcCO₂ continuously if available.",
          "Avoid fluid overload — worsens RDS.",
          "Caffeine for apnoea of prematurity if applicable.",
          "Hyperoxia avoidance is critical in preterm — wean FiO₂ as rapidly as tolerated.",
        ],
        seniorReviewIf: [
          "OI > 20 despite optimal HFOV",
          "Haemodynamic instability",
          "Pulmonary hypertension component (echo)",
          "Inadequate surfactant response",
          "PaCO₂ < 35 mmHg or > 65 mmHg",
        ],
      };

    case "mas":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "MAS has mixed pathophysiology: atelectatic areas AND overinflated (obstructed) areas. HFOV MAP must balance recruitment with avoiding overdistension of hyperinflated segments. Start at or slightly above conventional MAP — caution with aggressive recruitment.",
        suggestedMapRange: mapRange(0, 2, cmap) + " — start at lower end in MAS",
        amplitudeConcept: "Standard amplitude for chest wiggle. MAS may have significant airway resistance — assess chest wiggle carefully.",
        suggestedAmplitudeRange: ampRange(),
        suggestedFreqHz: w < 2.5 ? "8–10 Hz" : "8 Hz",
        fio2Start: "Start FiO₂ 1.0. Wean as response observed.",
        itime: "33%.",
        oxyTarget: "SpO₂ ≥ 92–95%. Avoid hypoxaemia — worsens PPHN component.",
        ventTarget: "pH ≥ 7.30. Avoid severe hypercapnia — worsens any PPHN component. Moderate permissive hypercapnia acceptable (PaCO₂ 45–55 mmHg).",
        cxrTarget: "CXR difficult to interpret in MAS — heterogeneous pattern. Monitor lung volume trend.",
        specialCautions: [
          "High risk of pneumothorax in MAS — monitor closely, have drain equipment at bedside.",
          "PPHN component common — consider iNO if refractory hypoxaemia (senior NICU decision).",
          "Consider pulmonary lavage if severe meconium impaction (specialist decision).",
          "HFOV may worsen air trapping in obstructive MAS — assess carefully before initiation.",
        ],
        seniorReviewIf: [
          "Worsening on HFOV — may indicate obstructive component",
          "PPHN not responding to O₂/HFOV",
          "Pneumothorax",
          "OI > 25 — ECMO criteria assessment",
        ],
      };

    case "pphn":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "Adequate lung recruitment for iNO efficacy. Avoid atelectasis (increases PVR) and overdistension (impairs RV). Balance is critical. Start at conventional MAP or MAP + 1–2 cmH₂O.",
        suggestedMapRange: mapRange(0, 2, cmap),
        amplitudeConcept: "Achieve adequate chest wiggle for CO₂ clearance. Avoid severe acidosis (worsens PPHN) and hypocarbia (may increase PVR).",
        suggestedAmplitudeRange: ampRange(),
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0 — O₂ is a pulmonary vasodilator. Maintain until iNO or PPHN resolves.",
        itime: "33%.",
        oxyTarget: "SpO₂ ≥ 94% pre-ductal (right hand). Monitor pre- and post-ductal SpO₂ simultaneously if possible.",
        ventTarget: "Avoid acidosis (pH ≥ 7.35). Mild hyperventilation (PaCO₂ 35–40) may help in severe PPHN — only with specialist direction. Avoid hypocarbia.",
        cxrTarget: "Adequate lung inflation — 8–9 ribs. Underinflation worsens PPHN.",
        specialCautions: [
          "iNO: initiation requires senior NICU/PICU/cardiology team. Monitor methaemoglobin.",
          "Ensure no structural cardiac disease (ductal-dependent lesion) before iNO.",
          "Echo monitoring of RV function and ductal shunt direction is essential.",
          "Early ECMO consultation if OI > 25 or PPHN not responding.",
          "Avoid hypoxia, acidosis, hypothermia, hypoglycaemia — all worsen pulmonary vasoconstriction.",
        ],
        seniorReviewIf: [
          "No response to FiO₂ + HFOV within 30–60 min",
          "OI ≥ 25 — ECMO criteria",
          "RV failure on echo",
          "Systemic hypotension",
        ],
      };

    case "cdh":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "Low-pressure, gentle ventilation strategy. The ipsilateral lung is hypoplastic — avoid overdistension. The contralateral lung is the primary gas-exchange organ. Start at conventional MAP or slightly below.",
        suggestedMapRange: cmap ? `${Math.max(10, cmap - 1)}–${cmap + 1} cmH₂O (gentle approach)` : "10–14 cmH₂O (low range — individualise)",
        amplitudeConcept: "Minimum amplitude for adequate chest wiggle and CO₂ clearance. Avoid aggressive ventilation.",
        suggestedAmplitudeRange: "20–35 cmH₂O starting range — titrate gently. Lower in very small infants.",
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0. Wean slowly — hypoxia worsens PVR.",
        itime: "33%.",
        oxyTarget: "Pre-ductal SpO₂ ≥ 85–90% (permissive hypoxaemia is standard in CDH).",
        ventTarget: "Permissive hypercapnia: pH ≥ 7.20, PaCO₂ 45–65 mmHg. Avoid aggressive ventilation targeting normocapnia — high risk of overdistension injury.",
        cxrTarget: "Assess for herniated bowel position and contralateral lung inflation. Standard rib target not applicable.",
        specialCautions: [
          "CDH management is highly individualised — surgical team and senior NICU involvement at all times.",
          "Permissive hypercapnia and permissive hypoxaemia are intentional — avoid aggressive correction.",
          "High risk of PPHN — monitor pre/post-ductal saturation.",
          "ECMO discussion should be early if not responding to gentle ventilation strategy.",
          "Post-repair ventilation may differ — surgical team guidance essential.",
        ],
        seniorReviewIf: [
          "Any deterioration — ECMO discussion urgently",
          "pH < 7.20 despite gentle settings",
          "Haemodynamic compromise",
          "Pre-ductal SpO₂ < 80%",
        ],
      };

    case "neonatal-air-leak":
      return {
        diagnosisLabel: diagLabel,
        mapConcept: "LOW pressure strategy. Goal is resolution of PIE/air leak by minimising airway pressure. Set MAP equal to or below conventional MAP.",
        suggestedMapRange: cmap ? `${Math.max(8, cmap - 2)}–${cmap} cmH₂O (low — match or below conventional)` : "8–12 cmH₂O (low strategy)",
        amplitudeConcept: "Lowest amplitude achieving adequate chest wiggle. PIE resolves faster with low pressure.",
        suggestedAmplitudeRange: "15–25 cmH₂O — lowest effective range. Titrate carefully.",
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0. Wean as tolerated.",
        itime: "33%.",
        oxyTarget: "Accept SpO₂ ≥ 88% with permissive hypoxaemia to allow low pressure strategy.",
        ventTarget: "Permissive hypercapnia acceptable (pH ≥ 7.20) to avoid high amplitude requirements.",
        cxrTarget: "Serial CXR 4–6 hourly to monitor PIE resolution. Avoid further barotrauma.",
        specialCautions: [
          "Ensure any pneumothorax is drained before HFOV.",
          "Unilateral PIE: selective intubation of unaffected bronchus may be considered (specialist decision).",
          "Do NOT recruit aggressively.",
          "Monitor for contralateral spread of PIE.",
        ],
        seniorReviewIf: [
          "Bilateral PIE not resolving",
          "Haemodynamic compromise",
          "Worsening pneumothorax",
          "Consider ECMO if refractory",
        ],
      };

    default:
      return {
        diagnosisLabel: "Other / Unspecified",
        mapConcept: "Set MAP based on conventional ventilation failure and oxygenation index. Start 2–4 cmH₂O above conventional MAP.",
        suggestedMapRange: mapRange(2, 4, cmap),
        amplitudeConcept: "Titrate amplitude to chest wiggle. Start at 2–3× MAP or convPIP + 10–20 cmH₂O. Safety ceiling: do not exceed 90 cmH₂O in small patients (< 10 kg); risk of pneumothorax and haemodynamic compromise at very high amplitudes.",
        suggestedAmplitudeRange: ampRange(),
        suggestedFreqHz: freqBySize(),
        fio2Start: "Start FiO₂ 1.0. Wean as oxygenation stabilises.",
        itime: "33%.",
        oxyTarget: "SpO₂ 92–97% unless diagnosis requires different target.",
        ventTarget: "Target pH 7.30–7.45, PaCO₂ 40–50 mmHg unless diagnosis-specific permissive strategy applies.",
        cxrTarget: "8–9 posterior ribs on AP/PA CXR.",
        specialCautions: ["Senior/PICU/NICU review for all non-standard settings."],
        seniorReviewIf: ["Any diagnostic uncertainty", "Failure to respond in 2 hours"],
      };
  }
}

// ─── Oxygenation assessment ───────────────────────────────────────────────────

function gradeOxByIndex(oi: number | null, osi: number | null): { grade: HFOVPARDSGrade; label: string } {
  if (oi !== null) {
    if (oi < 4)  return { grade: "no-criteria", label: "No PARDS oxygenation criteria" };
    if (oi < 8)  return { grade: "mild",        label: "Mild PARDS (OI 4–8)" };
    if (oi < 16) return { grade: "moderate",    label: "Moderate PARDS (OI 8–16)" };
    return              { grade: "severe",       label: "Severe PARDS (OI ≥ 16)" };
  }
  if (osi !== null) {
    if (osi < 5)    return { grade: "no-criteria", label: "No PARDS criteria (OSI < 5)" };
    if (osi < 7.5)  return { grade: "mild",        label: "Mild PARDS (OSI 5–7.5)" };
    if (osi < 12.3) return { grade: "moderate",    label: "Moderate PARDS (OSI 7.5–12.3)" };
    return               { grade: "severe",        label: "Severe PARDS (OSI ≥ 12.3)" };
  }
  return { grade: "no-data", label: "Insufficient data" };
}

export function assessOxygenation(inputs: HFOVInputs): HFOVOxygenationResult {
  const warnings: HFOVWarning[] = [];
  const fio2Frac = inputs.onHFOV
    ? (inputs.hfovFio2Percent ? inputs.hfovFio2Percent / 100 : null)
    : (inputs.convFio2Percent ? inputs.convFio2Percent / 100 : null);
  const mapVal = inputs.onHFOV ? inputs.hfovMap : inputs.convMap;

  let oi: number | null = null;
  let osi: number | null = null;
  const warnSpO2 = inputs.spo2 !== null && inputs.spo2 > 97;

  if (fio2Frac && mapVal && inputs.pao2) {
    oi = parseFloat(calculateOI(fio2Frac, mapVal, inputs.pao2).toFixed(1));
  }
  if (fio2Frac && mapVal && inputs.spo2 && !warnSpO2) {
    osi = parseFloat(calculateOSI(fio2Frac, mapVal, inputs.spo2).toFixed(1));
  }

  const { grade, label } = gradeOxByIndex(oi, osi);
  const usedIndex: "OI" | "OSI" | null = oi !== null ? "OI" : osi !== null ? "OSI" : null;
  const pf = fio2Frac && inputs.pao2 ? parseFloat((inputs.pao2 / fio2Frac).toFixed(0)) : null;
  const ecmoTrigger = (oi !== null && oi >= 25) || (osi !== null && osi >= 18);

  if (grade === "severe") {
    warnings.push({
      code: "severe-pards-hfov",
      severity: "critical",
      title: "Severe PARDS on HFOV — escalation review",
      message: `${usedIndex} ${usedIndex === "OI" ? oi : osi} meets severe criteria. If no OI/OSI improvement after 2 hours on optimised HFOV, consider prone positioning, ECMO consultation, and senior team review per PALICC-2.`,
      action: "Senior/PICU escalation review",
    });
  }

  if (ecmoTrigger) {
    warnings.push({
      code: "ecmo-trigger",
      severity: "critical",
      title: `${usedIndex} ${usedIndex === "OI" ? oi : osi} — ECMO discussion threshold`,
      message: "OI ≥ 25 (or OSI equivalent) is a recognised ECMO referral threshold in many centres. If HFOV fails to improve oxygenation, ECMO consultation should be initiated urgently.",
      action: "ECMO consultation",
    });
  }

  if (warnSpO2) {
    warnings.push({
      code: "spo2-unreliable-hfov",
      severity: "info",
      title: "SpO₂ > 97% — OSI unreliable",
      message: "SpO₂ is on the flat part of the oxyhemoglobin curve. OSI underestimates severity. Obtain arterial PaO₂ for accurate OI calculation.",
    });
  }

  return { oi, osi, usedIndex, grade, gradeLabel: label, pf, warnSpO2Unreliable: warnSpO2, ecmoDiscussionTrigger: ecmoTrigger, warnings };
}

// ─── Ventilation assessment ───────────────────────────────────────────────────

export function assessVentilation(inputs: HFOVInputs): HFOVVentilationResult {
  const warnings: HFOVWarning[] = [];
  if (inputs.ph === null && inputs.pco2 === null) {
    return { hasData: false, phCategory: null, pco2Category: null, permissiveApplies: false, permissiveNote: "", hypocarbiaDanger: false, pphnAcidosisFlag: false, advice: [], warnings };
  }

  const advice: string[] = [];
  let phCat: "normal" | "acidosis" | "alkalosis" | null = null;
  let pco2Cat: "normal" | "high" | "low" | null = null;

  if (inputs.ph !== null) {
    phCat = inputs.ph < 7.25 ? "acidosis" : inputs.ph > 7.45 ? "alkalosis" : "normal";
  }
  if (inputs.pco2 !== null) {
    pco2Cat = inputs.pco2 > 50 ? "high" : inputs.pco2 < 35 ? "low" : "normal";
  }

  const hypocarbiaDanger = inputs.pathway === "neonatal" && inputs.pco2 !== null && inputs.pco2 < 35;
  const pphnAcidosisFlag = (inputs.diagnosis === "pphn" || inputs.diagnosis === "mas") && phCat === "acidosis";

  let permissiveApplies = false;
  let permissiveNote = "";

  if (inputs.ph !== null && inputs.ph >= 7.20 && pco2Cat === "high") {
    if (["pards", "pneumonia", "air-leak", "neonatal-air-leak", "rds", "cdh"].includes(inputs.diagnosis)) {
      permissiveApplies = true;
      permissiveNote = inputs.pathway === "neonatal"
        ? "Permissive hypercapnia is accepted in this neonatal diagnosis (pH ≥ 7.25, PaCO₂ 45–55 mmHg typical). Do NOT increase amplitude aggressively to normalise PaCO₂ — this increases barotrauma risk. Monitor TcCO₂ continuously if available."
        : "Permissive hypercapnia is acceptable in this diagnosis (pH ≥ 7.20). Do not increase amplitude aggressively to normalise CO₂ — prioritise lung protection.";
    }
  }

  // Advice generation
  if (phCat === "acidosis" && pco2Cat === "high") {
    if (permissiveApplies && inputs.ph !== null && inputs.ph >= 7.20) {
      advice.push("Respiratory acidosis with permissive strategy: pH ≥ 7.20 is acceptable. Do NOT aggressively increase amplitude. Continue monitoring.");
    } else {
      advice.push("Respiratory acidosis: Consider increasing amplitude by 5–10 cmH₂O. If amplitude already high, consider decreasing frequency (Hz) — lower frequency increases tidal VT on HFOV.");
    }
  }

  if (phCat === "alkalosis" && pco2Cat === "low") {
    if (hypocarbiaDanger) {
      advice.push("HYPOCARBIA in neonate: Reduce amplitude immediately. PaCO₂ < 35 in neonates is associated with periventricular leukomalacia. Recheck ABG within 20–30 minutes.");
    } else {
      advice.push("Hypocapnia: Consider reducing amplitude by 5–10 cmH₂O, or increasing frequency (Hz) — higher frequency reduces VT per oscillation.");
    }
  }

  if (pphnAcidosisFlag) {
    advice.push("Acidosis in PPHN/MAS: Acidosis causes severe pulmonary vasoconstriction and worsens PPHN. Treat urgently. Consider bicarbonate if metabolic component. Senior NICU review.");
    warnings.push({
      code: "pphn-acidosis",
      severity: "critical",
      title: "Acidosis with PPHN — pulmonary vasoconstriction risk",
      message: `pH ${inputs.ph} in ${DIAG_LABELS[inputs.diagnosis] ?? inputs.diagnosis}. Acidosis directly worsens pulmonary vasoconstriction. Treat ventilatory and metabolic causes urgently.`,
      action: "Senior NICU/PICU review",
    });
  }

  if (hypocarbiaDanger) {
    warnings.push({
      code: "hypocarbia-danger",
      severity: "critical",
      title: `Hypocarbia PaCO₂ ${inputs.pco2} mmHg — neonatal brain injury risk`,
      message: "PaCO₂ < 35 mmHg in neonates is associated with periventricular leukomalacia, IVH, and neurodevelopmental injury. Reduce amplitude immediately and recheck ABG in 20–30 minutes.",
      action: "Reduce amplitude urgently",
    });
  }

  return { hasData: true, phCategory: phCat, pco2Category: pco2Cat, permissiveApplies, permissiveNote, hypocarbiaDanger, pphnAcidosisFlag, advice, warnings };
}

// ─── Adjustment guide ─────────────────────────────────────────────────────────

export function generateAdjustments(inputs: HFOVInputs, oxy: HFOVOxygenationResult, vent: HFOVVentilationResult): HFOVAdjustmentGuide[] {
  const guides: HFOVAdjustmentGuide[] = [];

  if (inputs.spo2 !== null && inputs.spo2 < 88) {
    guides.push({
      id: "hypoxemia",
      scenario: "Hypoxaemia / Low SpO₂",
      priority: inputs.spo2 < 80 ? "critical" : "high",
      detected: `SpO₂ ${inputs.spo2}%${oxy.oi ? ` · OI ${oxy.oi}` : oxy.osi ? ` · OSI ${oxy.osi}` : ""}`,
      steps: [
        "1. DOPES first — check ETT, circuit, oscillator function",
        "2. Increase FiO₂ to 1.0 (100%) immediately",
        "3. Consider increasing MAP by 1–2 cmH₂O (improves alveolar recruitment)",
        "4. Assess CXR for lung volume — if underdistended, higher MAP may help",
        "5. Monitor haemodynamics after MAP increase",
        "6. If no response in 30–60 min → senior/PICU/NICU review",
        inputs.pathway === "neonatal" ? "7. Consider iNO if PPHN component (senior decision)" : "7. Consider prone positioning or ECMO consultation if severe PARDS",
      ],
      seniorReview: oxy.grade === "severe" || (inputs.spo2 !== null && inputs.spo2 < 80),
      seniorNote: oxy.ecmoDiscussionTrigger ? "ECMO threshold approaching — early consultation recommended" : undefined,
    });
  }

  if (vent.pco2Category === "high" && inputs.ph !== null && inputs.ph < 7.25) {
    guides.push({
      id: "hypercapnia",
      scenario: "Hypercapnia / Inadequate CO₂ clearance",
      priority: inputs.ph < 7.15 ? "critical" : "high",
      detected: `PaCO₂ ${inputs.pco2} mmHg, pH ${inputs.ph}`,
      steps: [
        "1. Check chest wiggle — if absent/reduced, obstruction or leak may be the cause",
        "2. Suction ETT — mucus plugging is very common on HFOV",
        "3. Check for cuff leak — can reduce CO₂ clearance significantly",
        "4. Consider increasing Amplitude (ΔP) by 5–10 cmH₂O",
        "5. Consider decreasing Frequency (Hz) by 1–2 — lower Hz increases oscillatory VT",
        vent.permissiveApplies ? "6. Permissive hypercapnia applies — only correct if pH < 7.20" : "6. Correct CO₂ to target range",
        "7. Reassess ABG 30–60 min after change",
      ],
      seniorReview: inputs.ph !== null && inputs.ph < 7.15,
    });
  }

  if (vent.hypocarbiaDanger || (vent.pco2Category === "low" && inputs.pco2 !== null && inputs.pco2 < 30)) {
    guides.push({
      id: "hypocarbia",
      scenario: inputs.pathway === "neonatal" ? "Hypocarbia — Neonatal Brain Injury Risk" : "Hypocapnia / Excessive CO₂ clearance",
      priority: inputs.pathway === "neonatal" ? "critical" : "high",
      detected: `PaCO₂ ${inputs.pco2} mmHg${inputs.ph ? ` · pH ${inputs.ph}` : ""}`,
      steps: [
        "1. Reduce Amplitude (ΔP) by 5–10 cmH₂O immediately",
        "2. Consider increasing Frequency (Hz) by 1–2 — higher Hz reduces oscillatory VT",
        "3. Reassess ABG in 20–30 min (not 60 min — hypocarbia needs faster correction)",
        inputs.pathway === "neonatal" ? "4. PaCO₂ < 35 in neonates associated with PVL and IVH — urgent correction required" : "4. Avoid severe hypocapnia — cerebral vasoconstriction risk",
        "5. TcCO₂ monitoring recommended if available",
      ],
      seniorReview: inputs.pathway === "neonatal",
      seniorNote: inputs.pathway === "neonatal" ? "Neonatal hypocarbia is a brain injury risk — senior NICU review for target PaCO₂" : undefined,
    });
  }

  if (inputs.haemodynamicConcern || (inputs.hfovMap !== null && inputs.hfovMap > 22)) {
    guides.push({
      id: "haemodynamic",
      scenario: "Haemodynamic Deterioration / High MAP",
      priority: "high",
      detected: inputs.hfovMap ? `HFOV MAP ${inputs.hfovMap} cmH₂O${inputs.haemodynamicConcern ? " + haemodynamic concern flagged" : ""}` : "Haemodynamic concern flagged",
      steps: [
        "1. Assess for overdistension — check CXR (> 9 posterior ribs = overdistended)",
        "2. Consider reducing MAP by 1–2 cmH₂O if overdistended",
        "3. Fluid bolus 10 mL/kg if preload-depleted",
        "4. Start or increase vasopressor/inotrope if hypotensive (senior decision)",
        "5. If MAP reduction worsens oxygenation → balance is the challenge → senior review",
        "6. Echocardiography to assess RV and preload",
      ],
      seniorReview: true,
      seniorNote: "Haemodynamic compromise on HFOV requires urgent senior review — MAP reduction vs oxygenation trade-off is a specialist decision",
    });
  }

  if (inputs.diagnosis === "air-leak" || inputs.diagnosis === "neonatal-air-leak" || inputs.pneumothoraxPresent) {
    guides.push({
      id: "air-leak",
      scenario: "Air Leak / Pneumothorax",
      priority: "critical",
      detected: inputs.pneumothoraxPresent ? "Pneumothorax present" : "Air leak syndrome diagnosis",
      steps: [
        "1. Ensure chest drain is in situ and functioning",
        "2. If tension suspected → needle decompress immediately, do not wait for imaging",
        "3. Reduce MAP toward conventional MAP or below",
        "4. Use minimum amplitude achieving adequate chest wiggle",
        "5. Accept permissive hypercapnia and lower SpO₂ targets to allow low-pressure strategy",
        "6. Serial CXR every 4–6 hours to monitor resolution",
        "7. Do NOT perform lung recruitment manoeuvres",
      ],
      seniorReview: true,
      seniorNote: "Air leak on HFOV requires senior review — escalation to ECMO if bilateral PIE or failing",
    });
  }

  return guides;
}

// ─── Weaning assessment ───────────────────────────────────────────────────────

export function assessWeaning(inputs: HFOVInputs): HFOVWeaningResult {
  const criteria: HFOVWeaningCriterion[] = [];
  const blockers: string[] = [];

  const fio2Src = inputs.onHFOV ? inputs.hfovFio2Percent : inputs.convFio2Percent;
  const mapSrc  = inputs.onHFOV ? inputs.hfovMap : null;

  // FiO₂ criterion
  const fio2Target = inputs.pathway === "neonatal" ? 40 : 50;
  const fio2Ok = fio2Src !== null ? fio2Src <= fio2Target : null;
  criteria.push({
    id: "fio2",
    label: `FiO₂ ≤ ${fio2Target}% (wean FiO₂ first — before reducing MAP)`,
    met: fio2Ok,
    note: fio2Src !== null ? `Current FiO₂: ${fio2Src}%` : "FiO₂ not entered",
  });
  if (fio2Ok === false) blockers.push(`FiO₂ ${fio2Src}% — still too high. Wean FiO₂ before reducing MAP.`);

  // MAP criterion
  const mapTarget = inputs.pathway === "neonatal"
    ? (inputs.diagnosis === "neonatal-air-leak" ? 8 : 10)
    : 16;
  const mapOk = mapSrc !== null ? mapSrc <= mapTarget : null;
  criteria.push({
    id: "map",
    label: `MAP ≤ ${mapTarget} cmH₂O before transition to conventional`,
    met: mapOk,
    note: mapSrc !== null ? `Current HFOV MAP: ${mapSrc} cmH₂O` : "HFOV MAP not entered",
  });
  if (mapOk === false) blockers.push(`HFOV MAP ${mapSrc} cmH₂O — above transition threshold of ${mapTarget} cmH₂O.`);

  // Gas exchange stability
  const gasOk = inputs.ph !== null ? inputs.ph >= 7.25 && inputs.ph <= 7.50 : null;
  criteria.push({
    id: "gas-exchange",
    label: "Stable gas exchange on current settings (pH 7.25–7.50)",
    met: gasOk,
    note: inputs.ph !== null ? `pH ${inputs.ph}${inputs.pco2 ? ` · PaCO₂ ${inputs.pco2}` : ""}` : "ABG not entered",
  });
  if (gasOk === false) blockers.push(`pH ${inputs.ph} outside stable range for weaning attempt.`);

  // Haemodynamic stability
  const haemoOk = inputs.haemodynamicConcern ? false : null;
  criteria.push({
    id: "haemodynamics",
    label: "Haemodynamic stability — no escalating vasoactives, no shock",
    met: haemoOk === false ? false : null,
    note: inputs.haemodynamicConcern ? "Haemodynamic concern flagged — weaning deferred" : "Assess clinically",
  });
  if (inputs.haemodynamicConcern) blockers.push("Haemodynamic instability — address before HFOV weaning.");

  // No active air leak
  const airLeakOk = inputs.pneumothoraxPresent ? false : null;
  criteria.push({
    id: "air-leak",
    label: "No active worsening air leak or undrained pneumothorax",
    met: airLeakOk === false ? false : null,
    note: inputs.pneumothoraxPresent ? "Pneumothorax flagged — drain before weaning" : "Assess clinically / CXR",
  });

  // Clinical improvement
  criteria.push({ id: "disease", label: "Improving underlying disease process", met: null, note: "Clinical assessment — cannot be automated" });

  // Neonatal-specific
  if (inputs.pathway === "neonatal") {
    criteria.push({
      id: "apnea",
      label: "Consider apnoea risk during transition (especially preterm < 34 weeks)",
      met: null,
      note: "Have caffeine/methylxanthine prescribed. Prepare for CPAP/HFNC post-transition.",
    });
  }

  const failedCount = criteria.filter((c) => c.met === false).length;
  const metCount    = criteria.filter((c) => c.met === true).length;

  const status: HFOVWeaningResult["status"] = failedCount > 0 ? "not-ready" : metCount >= 2 ? "consider-weaning" : "no-data";

  const transitionConcept = inputs.pathway === "neonatal"
    ? "When MAP ≤ 10–12 cmH₂O (RDS/MAS) or ≤ 8 cmH₂O (PIE) and FiO₂ ≤ 40%, consider transition to CPAP or synchronised conventional ventilation. Have CPAP/HFNC ready at the bedside."
    : "When MAP ≤ 14–16 cmH₂O and FiO₂ ≤ 40–50%, consider transition back to conventional mechanical ventilation. Reconnect to conventional vent using settings appropriate for current lung disease stage.";

  return {
    status,
    blockers,
    criteria,
    transitionConcept,
    note: "Weaning from HFOV requires clinical assessment. Never declare a patient ready based solely on MAP and FiO₂. Senior/PICU/NICU review before transition.",
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function runHFOVAssessment(inputs: HFOVInputs): HFOVFullOutput {
  const hasMinimumData = inputs.weightKg !== null && inputs.age !== null && inputs.pathway !== "";
  const ageMonths = inputs.age ? ageToMonths(inputs.age) : null;
  const pathway = inputs.pathway || null;
  const isPreterm = inputs.gestationalAgeWeeks !== null && inputs.gestationalAgeWeeks < 37;

  if (!hasMinimumData || ageMonths === null || !pathway) {
    return { hasMinimumData: false, pathway: null, ageMonths: null, isPreterm: false, globalWarnings: [], indications: null, contraindications: null, oxygenation: null, ventilation: null, setupGuide: null, adjustments: [], weaning: null };
  }

  const globalWarnings = validateGlobal(inputs, ageMonths);
  const oxygenation    = assessOxygenation(inputs);
  const ventilation    = assessVentilation(inputs);
  const adjustments    = generateAdjustments(inputs, oxygenation, ventilation);

  return {
    hasMinimumData: true,
    pathway: pathway as HFOVPathway,
    ageMonths,
    isPreterm,
    globalWarnings,
    indications:       assessIndications(inputs, ageMonths),
    contraindications: assessContraindications(inputs),
    oxygenation,
    ventilation,
    setupGuide:        getSetupGuide(inputs, ageMonths),
    adjustments,
    weaning:           assessWeaning(inputs),
  };
}
