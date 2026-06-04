/**
 * Neonatal Mechanical Ventilation — Clinical Decision Support Engine
 *
 * References:
 *   Sweet DG et al. European Consensus Guidelines on RDS, 2023
 *   PPHN: Abman SH et al. Circulation 2015
 *   PALICC-2 PCCM 2023 (OI/OSI thresholds)
 *   British Association of Perinatal Medicine (BAPM) ventilation guidelines
 *   Goldsmith JP et al. Assisted Ventilation of the Neonate, 6th ed.
 *
 * Safety: Structured bedside guidance only.
 * All outputs use "consider", "suggested starting range", "reassess" language.
 * NOT a substitute for clinical judgment or senior NICU/neonatology review.
 */

import { calculateOI, calculateOSI } from "./formulas";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NeonatalDiagnosis =
  | "rds"
  | "ttn"
  | "mas"
  | "pphn"
  | "cdh"
  | "neonatal-pneumonia"
  | "apnea"
  | "neonatal-air-leak"
  | "other-neonatal";

export type NeonatalAgeUnit = "days" | "months";
export type NeonatalWarningSeverity = "info" | "warning" | "critical";

export interface NeonatalAgeInput {
  value: number;
  unit: NeonatalAgeUnit;
}

export interface NeonatalMVInputs {
  age: NeonatalAgeInput | null;
  gestationalAgeWeeks: number | null;
  weightKg: number | null;
  diagnosis: NeonatalDiagnosis | "";

  fio2Percent: number | null;
  peep: number | null;
  pip: number | null;
  mapAirway: number | null;
  rr: number | null;
  itime: number | null;
  measuredVtMl: number | null;

  ph: number | null;
  pco2: number | null;
  pao2: number | null;
  spo2: number | null;
}

export interface NeonatalWarning {
  code: string;
  severity: NeonatalWarningSeverity;
  title: string;
  message: string;
  action?: string;
}

// ─── Scenario guide ───────────────────────────────────────────────────────────

export interface NeonatalScenarioGuide {
  diagnosisLabel: string;
  mode: string;
  vtTarget: string;
  peepRange: string;
  rrRange: string;
  itime: string;
  fio2Start: string;
  spo2Target: string;
  ventTarget: string;
  specialConsiderations: string[];
  seniorReviewIf: string[];
  hfovConsiderIf: string;
}

// ─── Oxygenation result ───────────────────────────────────────────────────────

export interface NeonatalOxygenationResult {
  oi: number | null;
  osi: number | null;
  usedIndex: "OI" | "OSI" | null;
  warnSpO2Unreliable: boolean;
  hfovConsiderationThreshold: boolean;
  ecmoDiscussionThreshold: boolean;
  hyperoxiaRisk: boolean;
  vtPerKg: number | null;
  vtPerKgNote: string;
  drivingPressure: number | null;
  dpSeverity: "ok" | "concern" | "danger" | null;
  dpMessage: string;
  warnings: NeonatalWarning[];
}

// ─── Ventilation result ───────────────────────────────────────────────────────

export interface NeonatalVentilationResult {
  hasData: boolean;
  phCategory: "normal" | "acidosis" | "alkalosis" | null;
  pco2Category: "normal" | "high" | "low" | null;
  hypocarbiaDanger: boolean;
  permissiveApplies: boolean;
  permissiveNote: string;
  pphnAcidosisFlag: boolean;
  advice: string[];
  warnings: NeonatalWarning[];
}

// ─── Initial setup (pre-gas starter settings) ────────────────────────────────

export interface NeonatalInitialSettings {
  diagnosisLabel: string;
  modeSuggestion: string;
  vtMl: string;
  vtPerKg: string;
  rr: string;
  peep: string;
  pipStart: string;
  itime: string;
  fio2Start: string;
  spo2Target: string;
  co2Target: string;
  keyCautions: string[];
  titrationNote: string;
}

// ─── Weaning ──────────────────────────────────────────────────────────────────

export interface NeonatalWeaningCriterion {
  id: string;
  label: string;
  met: boolean | null;
  note: string;
}

export interface NeonatalWeaningResult {
  status: "consider" | "not-ready" | "no-data";
  criteria: NeonatalWeaningCriterion[];
  blockers: string[];
  transitionConcept: string;
  note: string;
}

// ─── Full output ──────────────────────────────────────────────────────────────

export interface NeonatalMVFullOutput {
  hasMinimumData: boolean;
  gestationalAgeWeeks: number | null;
  isPreterm: boolean;
  isExtremePreterm: boolean;
  globalWarnings: NeonatalWarning[];
  oxygenation: NeonatalOxygenationResult | null;
  ventilation: NeonatalVentilationResult | null;
  scenario: NeonatalScenarioGuide | null;
  initialSettings: NeonatalInitialSettings | null;
  weaning: NeonatalWeaningResult | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const NEONATAL_DIAG_LABELS: Record<string, string> = {
  rds:                 "Neonatal RDS",
  ttn:                 "Transient Tachypnoea of Newborn (TTN)",
  mas:                 "Meconium Aspiration Syndrome (MAS)",
  pphn:                "Persistent Pulmonary Hypertension (PPHN)",
  cdh:                 "Congenital Diaphragmatic Hernia (CDH)",
  "neonatal-pneumonia": "Neonatal Pneumonia / Sepsis",
  apnea:               "Apnoea of Prematurity",
  "neonatal-air-leak": "Neonatal Air Leak / PIE",
  "other-neonatal":    "Other Neonatal",
};

// ─── Global safety validation ─────────────────────────────────────────────────

function validateGlobal(inputs: NeonatalMVInputs, ga: number | null): NeonatalWarning[] {
  const w: NeonatalWarning[] = [];

  if (ga !== null && ga < 24) {
    w.push({
      code: "periviability",
      severity: "critical",
      title: "Periviable gestation (< 24 weeks)",
      message: "Ventilation decisions at periviability require ethics consultation, senior neonatology, and parental involvement. This tool does not apply at this gestational age.",
      action: "Ethics + senior neonatology consultation",
    });
  } else if (ga !== null && ga < 28) {
    w.push({
      code: "extreme-preterm",
      severity: "critical",
      title: "Extreme preterm (< 28 weeks) — specialist required",
      message: "Extreme prematurity requires subspecialist neonatology at all ventilation decisions. Lung mechanics, CO₂ sensitivity, surfactant dosing, and brain injury risk differ significantly. All suggested ranges require expert adaptation.",
      action: "Senior neonatologist review before any ventilator change",
    });
  }

  if (inputs.weightKg !== null && inputs.weightKg < 0.5) {
    w.push({
      code: "micro-preterm",
      severity: "critical",
      title: "Weight < 500g — micro-preterm",
      message: "Infants < 500g require highly individualised management. All ventilator parameters in this tool are approximations only. NICU specialist review essential.",
    });
  }

  if (inputs.pco2 !== null && inputs.pco2 < 30) {
    w.push({
      code: "severe-hypocarbia",
      severity: "critical",
      title: `Severe hypocarbia — PaCO₂ ${inputs.pco2} mmHg`,
      message: "PaCO₂ < 30 mmHg in neonates is associated with periventricular leukomalacia (PVL), intraventricular haemorrhage (IVH), and sensorineural hearing loss. Reduce PIP/amplitude immediately. Recheck ABG in 20–30 minutes.",
      action: "Reduce ventilation urgently — recheck ABG in 20–30 min",
    });
  } else if (inputs.pco2 !== null && inputs.pco2 < 35) {
    w.push({
      code: "hypocarbia",
      severity: "warning",
      title: `Hypocarbia — PaCO₂ ${inputs.pco2} mmHg`,
      message: "PaCO₂ < 35 mmHg carries risk of cerebral vasoconstriction and brain injury in neonates. Reduce ventilation to target PaCO₂ ≥ 40 mmHg for most diagnoses. Reassess ABG.",
      action: "Reduce PIP/RR — recheck ABG",
    });
  }

  if (inputs.spo2 !== null && inputs.spo2 > 95 && ga !== null && ga < 36) {
    w.push({
      code: "hyperoxia-preterm",
      severity: "warning",
      title: `Hyperoxia in preterm — SpO₂ ${inputs.spo2}%`,
      message: "SpO₂ > 95% in preterm infants (< 36 weeks) increases risk of retinopathy of prematurity (ROP) and bronchopulmonary dysplasia (BPD). Target SpO₂ 91–95%. Wean FiO₂.",
    });
  }

  if (inputs.spo2 !== null && inputs.spo2 > 98) {
    w.push({
      code: "hyperoxia-term",
      severity: "warning",
      title: `Hyperoxia — SpO₂ ${inputs.spo2}%`,
      message: "SpO₂ > 98% in neonates indicates hyperoxia. Wean FiO₂ to lowest tolerated value. Hyperoxia causes oxidative injury to lungs, retina, and brain.",
    });
  }

  if (inputs.ph !== null && inputs.ph < 7.10) {
    w.push({
      code: "severe-acidosis",
      severity: "critical",
      title: "Severe acidosis — pH < 7.10",
      message: "Severe acidosis impairs cardiac output and response to vasoactives. Worsens PPHN. Assess respiratory vs metabolic cause. Senior NICU review immediately.",
      action: "Senior NICU review immediately",
    });
  }

  if (inputs.fio2Percent !== null && inputs.fio2Percent > 80) {
    w.push({
      code: "high-fio2-neonatal",
      severity: "warning",
      title: `FiO₂ ${inputs.fio2Percent}% — consider escalation`,
      message: "FiO₂ > 80% in a ventilated neonate suggests inadequate response to conventional ventilation. Consider HFOV consultation, iNO if PPHN component, and ECMO discussion (OI-guided). Senior review.",
    });
  }

  return w;
}

// ─── Scenario guides ──────────────────────────────────────────────────────────

export function getNeonatalScenarioGuide(inputs: NeonatalMVInputs): NeonatalScenarioGuide | null {
  if (!inputs.diagnosis) return null;
  const ga = inputs.gestationalAgeWeeks;
  const isPreterm = ga !== null && ga < 37;
  const spo2Target = isPreterm ? "91–95% (preterm target — avoid hyperoxia)" : "93–97%";

  switch (inputs.diagnosis) {
    case "rds":
      return {
        diagnosisLabel: "Neonatal RDS",
        mode: "SIMV + PS or A/C (volume-targeted preferred if available). Consider HFNC/CPAP first — INSURE or LISA/MIST surfactant technique avoids prolonged intubation in eligible preterm infants.",
        vtTarget: "Suggested 4–5 mL/kg. Volume-targeted ventilation (VTV) reduces BPD risk. Reassess with measured VT — accept permissive hypercapnia to achieve low VT.",
        peepRange: `${isPreterm ? "4–6" : "5–6"} cmH₂O. Maintains FRC and prevents alveolar collapse. Reassess based on oxygenation and CXR lung volume.`,
        rrRange: "40–60 bpm. Adjust to target CO₂. Higher RR compensates for lower VT.",
        itime: "0.3–0.4 s. Short I-time avoids air trapping. I:E 1:1.5 to 1:2.",
        fio2Start: `Start ${isPreterm ? "0.30" : "0.40"}. Titrate to SpO₂ target. Wean rapidly as surfactant takes effect.`,
        spo2Target,
        ventTarget: `Permissive hypercapnia acceptable: pH ≥ 7.25, PaCO₂ 45–55 mmHg. Avoid PaCO₂ < 35 — risk of PVL/IVH${isPreterm ? " (highest risk in extreme preterm)" : ""}.`,
        specialConsiderations: [
          "Surfactant: administer early (within 2h of birth in eligible preterm). INSURE or LISA/MIST preferred over intubation-surfactant-extubation delay.",
          "Caffeine: prescribe for apnoea of prematurity if preterm < 34 weeks.",
          isPreterm ? "Avoid hyperoxia — SpO₂ 91–95% target reduces ROP and BPD." : "SpO₂ target 93–97% for term infants.",
          "Volume-targeted ventilation (VTV) reduces BPD, air leak, and IVH vs pressure-limited alone.",
          "CXR: target 8–9 posterior ribs. Repeat after surfactant — oxygenation often improves rapidly.",
          "Plan for early extubation to CPAP or HFNC once FiO₂ ≤ 0.30–0.35 and MAP ≤ 6–7 cmH₂O.",
        ],
        seniorReviewIf: [
          "OI > 8–10 — consider HFOV (senior NICU decision)",
          "No improvement after surfactant × 2 doses",
          "FiO₂ > 0.60 required",
          "pH < 7.20",
        ],
        hfovConsiderIf: "OI > 8–10 on optimised conventional MV, or persistent FiO₂ > 0.60",
      };

    case "ttn":
      return {
        diagnosisLabel: "Transient Tachypnoea of Newborn (TTN)",
        mode: "CPAP or HFNC first — most TTN does not require intubation. If intubated, use gentle conventional ventilation. Plan early extubation (TTN is self-limited, typically 12–72 hours).",
        vtTarget: "4–5 mL/kg. Lungs are usually well-compliant with fluid-filled alveoli — low pressures are effective.",
        peepRange: "4–5 cmH₂O. Helps clear alveolar fluid. Avoid high PEEP — risk of overdistension.",
        rrRange: "40–60 bpm.",
        itime: "0.3–0.4 s.",
        fio2Start: "Titrate to SpO₂ target. Often < 0.40 is sufficient.",
        spo2Target: "93–97%.",
        ventTarget: "Target near-normal pH and PaCO₂ 35–50 mmHg. TTN rarely causes significant CO₂ retention.",
        specialConsiderations: [
          "TTN is self-limited — avoid prolonged intubation.",
          "Furosemide: not routinely recommended in current evidence.",
          "Ensure correct diagnosis — exclude RDS, neonatal pneumonia, congenital heart disease.",
          "Oxygen therapy and CPAP are usually sufficient. Intubation reserved for worsening.",
        ],
        seniorReviewIf: [
          "Not improving by 6–12 hours",
          "FiO₂ > 0.40 requirement",
          "Diagnosis in doubt",
        ],
        hfovConsiderIf: "Rarely needed — unexpected deterioration should prompt diagnosis reassessment",
      };

    case "mas":
      return {
        diagnosisLabel: "Meconium Aspiration Syndrome (MAS)",
        mode: "A/C or SIMV. MAS has mixed pathophysiology — both obstructive (air trapping) and atelectatic areas. Individualise settings carefully.",
        vtTarget: "4–6 mL/kg. Heterogeneous lung disease — monitor for overdistension of obstructed segments.",
        peepRange: "4–5 cmH₂O. Keep PEEP low — obstructive component risks air trapping with higher PEEP. Reassess if atelectasis dominant.",
        rrRange: "40–50 bpm. Longer expiratory time reduces air trapping.",
        itime: "0.3–0.4 s. Short I-time critical in obstructive disease.",
        fio2Start: "Start 1.0. Wean as oxygenation improves. Maintain high FiO₂ if PPHN component present.",
        spo2Target: "≥ 94–97%. Hypoxia worsens PPHN component.",
        ventTarget: "Moderate permissive hypercapnia acceptable (pH ≥ 7.25). Avoid acidosis if PPHN present — worsens pulmonary vasoconstriction.",
        specialConsiderations: [
          "High risk of pneumothorax — have chest drain equipment at bedside.",
          "PPHN component is common in severe MAS — monitor pre/post-ductal SpO₂. Consider iNO (senior NICU/paediatric cardiology decision).",
          "Consider tracheal lavage with surfactant if severe (specialist decision).",
          "Avoid high PEEP — obstructive physiology worsens with air trapping.",
          "HFOV may be needed if refractory — senior NICU decision.",
        ],
        seniorReviewIf: [
          "OI > 10 — HFOV consideration",
          "PPHN not responding to O₂",
          "Pneumothorax",
          "OI > 25 — ECMO criteria",
        ],
        hfovConsiderIf: "OI > 10 on optimised conventional MV, or refractory hypoxaemia with PPHN",
      };

    case "pphn":
      return {
        diagnosisLabel: "Persistent Pulmonary Hypertension (PPHN)",
        mode: "A/C or SIMV. Goal is adequate lung recruitment for iNO efficacy while avoiding acidosis and hypoxia.",
        vtTarget: "4–5 mL/kg. Normal lung compliance expected in idiopathic PPHN. Avoid overdistension.",
        peepRange: "4–6 cmH₂O. Adequate PEEP prevents atelectasis — important for iNO distribution. Do not use high PEEP if RV compromised.",
        rrRange: "40–60 bpm. Normalise CO₂ — avoid hypercapnia (worsens PVR).",
        itime: "0.3–0.4 s.",
        fio2Start: "Start 1.0 (100%). O₂ is a pulmonary vasodilator — maintain high FiO₂ until iNO or improvement.",
        spo2Target: "Pre-ductal SpO₂ ≥ 94–97%. Monitor pre-ductal (right hand) and post-ductal (foot) simultaneously.",
        ventTarget: "Normocapnia: PaCO₂ 35–45 mmHg. Avoid acidosis (worsens PVR). Avoid hypocarbia. Target pH ≥ 7.35.",
        specialConsiderations: [
          "iNO: starting dose 20 ppm. Requires senior NICU/cardiology input. Monitor methaemoglobin.",
          "Exclude structural cardiac disease (ductal-dependent lesion) before iNO.",
          "Echocardiography essential — assess RV function, ductal shunt direction, septal position.",
          "Pre/post-ductal SpO₂ monitoring: persistent pre-post gap > 10% confirms right-to-left shunting.",
          "ECMO: early consultation if OI > 25–40 or no response to iNO + HFOV.",
          "Avoid hypothermia, hypoglycaemia, pain/agitation — all worsen pulmonary vasoconstriction.",
        ],
        seniorReviewIf: [
          "No response to FiO₂ + optimised MV within 30–60 min",
          "OI ≥ 25 — ECMO referral criteria",
          "RV failure on echo",
          "Systemic hypotension",
        ],
        hfovConsiderIf: "OI > 10–15, or to optimise lung recruitment for iNO efficacy (senior NICU + cardiology decision)",
      };

    case "cdh":
      return {
        diagnosisLabel: "Congenital Diaphragmatic Hernia (CDH)",
        mode: "Gentle ventilation strategy. Permissive hypercapnia is standard. The contralateral lung is the primary gas-exchange organ — protect it from overdistension.",
        vtTarget: "3–5 mL/kg. Low VT is central to CDH strategy. Accept hypercapnia.",
        peepRange: "3–5 cmH₂O. Low PEEP — the hypoplastic ipsilateral lung cannot tolerate high pressure.",
        rrRange: "40–60 bpm. Use RR to compensate for low VT if needed.",
        itime: "0.3–0.4 s.",
        fio2Start: "Start 1.0. Maintain high FiO₂ — hypoxia worsens PPHN component.",
        spo2Target: "Pre-ductal SpO₂ ≥ 85–90% (permissive hypoxaemia is standard in CDH strategy).",
        ventTarget: "Permissive hypercapnia: pH ≥ 7.20, PaCO₂ 45–65 mmHg. Do NOT target normocapnia — risks overdistension.",
        specialConsiderations: [
          "CDH management requires surgical team + senior NICU involvement at all times.",
          "Avoid bag-mask ventilation after delivery — will cause bowel distension.",
          "PPHN component almost always present — pre/post-ductal SpO₂ monitoring mandatory.",
          "iNO: consider for PPHN component (cardiology/NICU team decision).",
          "Early ECMO discussion — if not responding to gentle ventilation strategy.",
          "Post-repair ventilation: timing of repair and post-op ventilation is highly individualised — surgical team guidance.",
        ],
        seniorReviewIf: [
          "Any deterioration — ECMO discussion urgently",
          "pH < 7.20 despite gentle settings",
          "Pre-ductal SpO₂ < 80%",
          "Post-repair haemodynamic instability",
        ],
        hfovConsiderIf: "HFOV use in CDH is controversial and centre-dependent — senior NICU + surgical team decision only",
      };

    case "neonatal-pneumonia":
      return {
        diagnosisLabel: "Neonatal Pneumonia / Sepsis",
        mode: "A/C or SIMV + PS. Settings depend on severity — may range from mild to severe ARDS-like picture.",
        vtTarget: "4–5 mL/kg. Heterogeneous pneumonia — monitor measured VT and Pplat.",
        peepRange: "4–6 cmH₂O. Higher PEEP if significant consolidation/atelectasis. Reassess daily.",
        rrRange: "40–60 bpm.",
        itime: "0.3–0.4 s.",
        fio2Start: "Titrate to SpO₂ target. Wean as pneumonia resolves.",
        spo2Target: isPreterm ? "91–95%" : "93–97%.",
        ventTarget: "Target pH 7.30–7.45, PaCO₂ 40–55 mmHg. Permissive hypercapnia acceptable if lung-protective settings required.",
        specialConsiderations: [
          "Blood culture and appropriate antibiotics — GBS, E. coli, Listeria in early-onset; Gram-negative and CoNS in late-onset.",
          "Sepsis may cause cardiovascular collapse post-intubation — have fluid and inotropes ready.",
          "Consider surfactant if early GBS/strep pneumonia with severe RDS-like picture (senior decision).",
          "Monitor for PPHN component, particularly in term infants with severe pneumonia.",
        ],
        seniorReviewIf: [
          "OI > 8–10 — HFOV consideration",
          "Haemodynamic compromise",
          "Not improving on appropriate antibiotics",
        ],
        hfovConsiderIf: "OI > 8–10 or refractory hypoxaemia",
      };

    case "apnea":
      return {
        diagnosisLabel: "Apnoea of Prematurity",
        mode: "CPAP or HFNC preferred — avoid intubation where possible. If intubated, use minimal settings with early extubation plan.",
        vtTarget: "4–5 mL/kg if intubated. Aim for minimal support.",
        peepRange: "4–5 cmH₂O.",
        rrRange: "30–50 bpm backup rate only — allow spontaneous breathing.",
        itime: "0.3–0.4 s.",
        fio2Start: "Lowest FiO₂ maintaining SpO₂ target.",
        spo2Target: "91–95% (preterm).",
        ventTarget: "Near-normal pH and CO₂. Avoid over-ventilation.",
        specialConsiderations: [
          "Caffeine citrate: 20 mg/kg loading dose, then 5–10 mg/kg/day maintenance — most effective treatment for AOP.",
          "Central vs obstructive apnoea: distinguish using respiratory effort monitoring.",
          "CPAP/HFNC effectively treats most AOP without intubation.",
          "Prolonged intubation should be avoided — increases BPD risk.",
          "Consider DOXAPRAM only in refractory cases after caffeine failure (senior decision).",
        ],
        seniorReviewIf: [
          "Frequent apnoeas (> 6/hr) despite caffeine",
          "Severe/prolonged apnoeas requiring intervention",
          "Diagnosis in doubt",
        ],
        hfovConsiderIf: "Not typically indicated for isolated AOP — if deteriorating, reassess diagnosis",
      };

    case "neonatal-air-leak":
      return {
        diagnosisLabel: "Neonatal Air Leak / Pulmonary Interstitial Emphysema (PIE)",
        mode: "Low-pressure strategy. Minimise airway pressure and tidal volume to allow resolution.",
        vtTarget: "3–4 mL/kg. Minimum effective VT.",
        peepRange: "3–4 cmH₂O. Lowest effective PEEP.",
        rrRange: "40–60 bpm — higher RR compensates for lower VT.",
        itime: "0.25–0.35 s. Short I-time reduces peak pressure exposure.",
        fio2Start: "Start 1.0. Wean as tolerated — accept lower oxygenation to allow low-pressure strategy.",
        spo2Target: "≥ 88–90% acceptable (permissive hypoxaemia for low-pressure strategy).",
        ventTarget: "Permissive hypercapnia acceptable (pH ≥ 7.20). Avoid high amplitudes/PIPs.",
        specialConsiderations: [
          "Ensure chest drain is in situ and functioning before or immediately after HFOV initiation if pneumothorax present.",
          "Unilateral PIE: selective intubation of unaffected bronchus may be considered (specialist decision).",
          "HFOV is the preferred mode for severe PIE — senior NICU decision.",
          "Serial CXR every 4–6 hours to monitor PIE resolution.",
          "Prone or lateral (PIE side down) positioning may help in unilateral PIE.",
        ],
        seniorReviewIf: [
          "Bilateral PIE not resolving within 24–48h",
          "Haemodynamic compromise",
          "Worsening pneumothorax",
        ],
        hfovConsiderIf: "Preferred mode for significant PIE — senior NICU decision",
      };

    default:
      return {
        diagnosisLabel: "Other Neonatal",
        mode: "Individualise based on clinical picture. Consult senior neonatology.",
        vtTarget: "4–5 mL/kg suggested starting range.",
        peepRange: "4–6 cmH₂O. Titrate to oxygenation and haemodynamics.",
        rrRange: "40–60 bpm.",
        itime: "0.3–0.4 s.",
        fio2Start: "Titrate to SpO₂ target.",
        spo2Target: isPreterm ? "91–95% (preterm)" : "93–97% (term).",
        ventTarget: "Target pH 7.25–7.45, PaCO₂ 40–55 mmHg unless diagnosis requires different strategy.",
        specialConsiderations: ["Senior NICU review for all non-standard diagnoses."],
        seniorReviewIf: ["Any uncertainty about diagnosis or appropriate ventilator targets"],
        hfovConsiderIf: "OI > 8–10 on optimised conventional MV",
      };
  }
}

// ─── Oxygenation assessment ───────────────────────────────────────────────────

export function assessNeonatalOxygenation(inputs: NeonatalMVInputs): NeonatalOxygenationResult {
  const warnings: NeonatalWarning[] = [];
  const fio2Frac = inputs.fio2Percent ? inputs.fio2Percent / 100 : null;
  const warnSpO2 = inputs.spo2 !== null && inputs.spo2 > 97;

  let oi: number | null = null;
  let osi: number | null = null;
  let usedIndex: "OI" | "OSI" | null = null;

  if (fio2Frac && inputs.mapAirway && inputs.pao2 && inputs.pao2 > 0) {
    oi = parseFloat(calculateOI(fio2Frac, inputs.mapAirway, inputs.pao2).toFixed(1));
    usedIndex = "OI";
  }
  if (fio2Frac && inputs.mapAirway && inputs.spo2 && !warnSpO2) {
    osi = parseFloat(calculateOSI(fio2Frac, inputs.mapAirway, inputs.spo2).toFixed(1));
    if (!usedIndex) usedIndex = "OSI";
  }

  const oiVal = oi ?? osi;
  const hfovConsiderationThreshold = oiVal !== null && oiVal >= 8;
  const ecmoDiscussionThreshold    = oiVal !== null && oiVal >= 25;
  const ga = inputs.gestationalAgeWeeks;
  const hyperoxiaRisk = (inputs.spo2 !== null && inputs.spo2 > 95 && ga !== null && ga < 36) ||
                        (inputs.spo2 !== null && inputs.spo2 > 98);

  if (hfovConsiderationThreshold && !ecmoDiscussionThreshold) {
    warnings.push({
      code: "hfov-consider",
      severity: "warning",
      title: `${usedIndex} ${oiVal} ≥ 8 — HFOV consideration threshold`,
      message: "OI ≥ 8 on conventional MV is a recognised trigger to consider HFOV in neonates. Senior NICU review required for this decision.",
      action: "Senior NICU review — HFOV discussion",
    });
  }

  if (ecmoDiscussionThreshold) {
    warnings.push({
      code: "ecmo-trigger-neonatal",
      severity: "critical",
      title: `${usedIndex} ${oiVal} ≥ 25 — ECMO discussion threshold`,
      message: "OI ≥ 25 is a recognised ECMO referral criterion in many neonatal centres. If HFOV + iNO fail to improve oxygenation, ECMO consultation should be initiated urgently.",
      action: "ECMO referral consultation",
    });
  }

  if (warnSpO2) {
    warnings.push({
      code: "spo2-unreliable",
      severity: "info",
      title: "SpO₂ > 97% — OSI unreliable",
      message: "SpO₂ on the flat portion of the dissociation curve — OSI underestimates severity. Obtain arterial PaO₂ for accurate OI.",
    });
  }

  if (inputs.fio2Percent !== null && inputs.fio2Percent > 60) {
    warnings.push({
      code: "high-fio2-neonatal-oxy",
      severity: "warning",
      title: `FiO₂ ${inputs.fio2Percent}% — reassess and consider escalation`,
      message: "FiO₂ > 60% in a ventilated neonate suggests inadequate conventional MV response. Consider HFOV and iNO (PPHN component). Senior review.",
    });
  }

  // VT/kg
  let vtPerKg: number | null = null;
  let vtPerKgNote = "";
  if (inputs.measuredVtMl && inputs.weightKg) {
    vtPerKg = parseFloat((inputs.measuredVtMl / inputs.weightKg).toFixed(1));
    if (vtPerKg > 6)       { vtPerKgNote = "↑ Above neonatal target — risk of volutrauma"; warnings.push({ code: "high-vt-neonatal", severity: "warning", title: `VT ${vtPerKg} mL/kg — above target`, message: "VT > 6 mL/kg exceeds lung-protective targets for neonates. Consider reducing PIP." }); }
    else if (vtPerKg >= 4)  vtPerKgNote = "Within target range (4–5 mL/kg)";
    else                    vtPerKgNote = "↓ Low — check for air leak or ETT obstruction";
  }

  // Driving pressure
  let dp: number | null = null;
  let dpSev: "ok" | "concern" | "danger" | null = null;
  let dpMsg = "";
  if (inputs.pip !== null && inputs.peep !== null) {
    dp = parseFloat((inputs.pip - inputs.peep).toFixed(1));
    if (dp < 12)       { dpSev = "ok";      dpMsg = "Acceptable (< 12 cmH₂O)"; }
    else if (dp <= 18) { dpSev = "concern"; dpMsg = "Elevated — aim to reduce"; }
    else               { dpSev = "danger";  dpMsg = "HIGH — VILI risk. Reduce PIP or increase PEEP"; warnings.push({ code: "high-dp-neonatal", severity: "warning", title: `Driving pressure ΔP ${dp} cmH₂O — elevated`, message: "Driving pressure > 18 cmH₂O in neonates increases VILI risk. Consider reducing PIP." }); }
  }

  return { oi, osi, usedIndex, warnSpO2Unreliable: warnSpO2, hfovConsiderationThreshold, ecmoDiscussionThreshold, hyperoxiaRisk, vtPerKg, vtPerKgNote, drivingPressure: dp, dpSeverity: dpSev, dpMessage: dpMsg, warnings };
}

// ─── Ventilation assessment ───────────────────────────────────────────────────

export function assessNeonatalVentilation(inputs: NeonatalMVInputs): NeonatalVentilationResult {
  const warnings: NeonatalWarning[] = [];
  if (inputs.ph === null && inputs.pco2 === null) {
    return { hasData: false, phCategory: null, pco2Category: null, hypocarbiaDanger: false, permissiveApplies: false, permissiveNote: "", pphnAcidosisFlag: false, advice: [], warnings };
  }

  const advice: string[] = [];
  let phCat: "normal" | "acidosis" | "alkalosis" | null = null;
  let pco2Cat: "normal" | "high" | "low" | null = null;

  if (inputs.ph !== null)  phCat  = inputs.ph  < 7.25 ? "acidosis" : inputs.ph  > 7.45 ? "alkalosis" : "normal";
  if (inputs.pco2 !== null) pco2Cat = inputs.pco2 > 50  ? "high"     : inputs.pco2 < 35  ? "low"       : "normal";

  const hypocarbiaDanger = inputs.pco2 !== null && inputs.pco2 < 35;
  const pphnDiag = inputs.diagnosis === "pphn" || inputs.diagnosis === "mas" || inputs.diagnosis === "cdh";
  const pphnAcidosisFlag = pphnDiag && phCat === "acidosis";

  // Permissive hypercapnia
  let permissiveApplies = false;
  let permissiveNote = "";
  const permissiveDiagnoses = ["rds", "cdh", "neonatal-air-leak", "apnea"];
  if (inputs.ph !== null && inputs.ph >= 7.25 && pco2Cat === "high" && permissiveDiagnoses.includes(inputs.diagnosis)) {
    permissiveApplies = true;
    permissiveNote = "Permissive hypercapnia is acceptable for this neonatal diagnosis (pH ≥ 7.25, PaCO₂ 45–55 mmHg typical). Do NOT increase ventilation aggressively — prioritise lung protection. Monitor for PaCO₂ > 60 which may need reassessment.";
  }

  // Generate advice
  if (hypocarbiaDanger) {
    advice.push("HYPOCARBIA: Reduce RR or PIP. PaCO₂ < 35 mmHg is a brain injury risk in neonates (PVL, IVH). Recheck ABG within 20–30 minutes after any reduction.");
  }

  if (phCat === "acidosis" && pco2Cat === "high" && !permissiveApplies) {
    if (pphnAcidosisFlag) {
      advice.push("Respiratory acidosis with PPHN/MAS/CDH: Acidosis directly worsens pulmonary vasoconstriction. Consider increasing RR cautiously. Avoid PIP increases that raise Pplat. Treat metabolic component if present. Senior NICU review.");
    } else {
      advice.push(`Respiratory acidosis: Consider increasing RR by 5–10 bpm. If severe (pH < 7.20), reassess VT (check for air leak/obstruction). ${inputs.ph !== null && inputs.ph < 7.20 ? "pH < 7.20 requires urgent intervention — senior NICU review." : ""}`);
    }
  }

  if (phCat === "alkalosis" && pco2Cat === "low") {
    advice.push("Respiratory alkalosis / Hypocarbia: Reduce RR by 5–10 bpm or reduce PIP cautiously. Hypocarbia < 35 mmHg is a neonatal brain injury risk. Urgent correction required. Recheck ABG in 20–30 min.");
  }

  if (pphnAcidosisFlag) {
    warnings.push({ code: "pphn-acidosis-neonatal", severity: "critical", title: "Acidosis with PPHN/MAS/CDH", message: `pH ${inputs.ph} — acidosis causes severe pulmonary vasoconstriction, worsening PPHN. Treat urgently. Consider bicarbonate if metabolic component. Senior NICU/cardiology review.`, action: "Senior NICU/cardiology review immediately" });
  }

  return { hasData: true, phCategory: phCat, pco2Category: pco2Cat, hypocarbiaDanger, permissiveApplies, permissiveNote, pphnAcidosisFlag, advice, warnings };
}

// ─── Weaning assessment ───────────────────────────────────────────────────────

export function assessNeonatalWeaning(inputs: NeonatalMVInputs): NeonatalWeaningResult {
  const criteria: NeonatalWeaningCriterion[] = [];
  const blockers: string[] = [];

  const fio2Ok = inputs.fio2Percent !== null ? inputs.fio2Percent <= 35 : null;
  criteria.push({ id: "fio2", label: "FiO₂ ≤ 35% (wean FiO₂ before reducing PEEP/pressures)", met: fio2Ok, note: inputs.fio2Percent !== null ? `Current FiO₂ ${inputs.fio2Percent}%` : "Not entered" });
  if (fio2Ok === false) blockers.push(`FiO₂ ${inputs.fio2Percent}% — still too high. Wean FiO₂ before considering extubation.`);

  const peepOk = inputs.peep !== null ? inputs.peep <= 5 : null;
  criteria.push({ id: "peep", label: "PEEP ≤ 5 cmH₂O", met: peepOk, note: inputs.peep !== null ? `Current PEEP ${inputs.peep} cmH₂O` : "Not entered" });
  if (peepOk === false) blockers.push(`PEEP ${inputs.peep} cmH₂O — wean to ≤ 5 before extubation attempt.`);

  const gasOk = inputs.ph !== null ? inputs.ph >= 7.25 && inputs.ph <= 7.50 : null;
  criteria.push({ id: "gas", label: "Stable gas exchange (pH 7.25–7.50)", met: gasOk, note: inputs.ph !== null ? `pH ${inputs.ph}${inputs.pco2 ? ` · PaCO₂ ${inputs.pco2}` : ""}` : "ABG not entered" });
  if (gasOk === false) blockers.push(`pH ${inputs.ph} outside stable range.`);

  const hypocarbia = inputs.pco2 !== null && inputs.pco2 < 35;
  if (hypocarbia) blockers.push(`PaCO₂ ${inputs.pco2} mmHg — correct hypocarbia before extubation.`);

  criteria.push({ id: "disease", label: "Improving underlying disease process", met: null, note: "Clinical assessment required" });
  criteria.push({ id: "spontaneous", label: "Adequate spontaneous respiratory effort / respiratory drive", met: null, note: "Assess on minimal support (low PS 5–6 cmH₂O)" });
  criteria.push({ id: "caffeine", label: "Caffeine prescribed if preterm < 34 weeks (reduces extubation failure)", met: null, note: "Check prescriptions" });
  criteria.push({ id: "post-ext", label: "Post-extubation support plan ready (CPAP / HFNC at bedside)", met: null, note: "CPAP 5–7 cmH₂O or HFNC 2–4 L/min typically used post-extubation" });

  const failedCount = criteria.filter((c) => c.met === false).length;
  const metCount    = criteria.filter((c) => c.met === true).length;
  const status: NeonatalWeaningResult["status"] = failedCount > 0 ? "not-ready" : metCount >= 2 ? "consider" : "no-data";

  return {
    status,
    criteria,
    blockers,
    transitionConcept: "When FiO₂ ≤ 0.30–0.35 and PIP ≤ 18–20 cmH₂O on low RR backup, consider extubation to CPAP 5–7 cmH₂O or HFNC. Caffeine must be in place for preterm infants. Have CPAP/HFNC immediately at bedside. Observe for apnoea in first 4–6 hours post-extubation.",
    note: "Extubation readiness is a clinical judgment. Never extubate based solely on computed criteria. Timing, post-extubation support, and caffeine status are all critical. Senior NICU review required.",
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

// ─── Initial setup computation ────────────────────────────────────────────────

export function computeNeonatalInitialSettings(inputs: NeonatalMVInputs): NeonatalInitialSettings | null {
  if (!inputs.diagnosis || inputs.weightKg === null || inputs.weightKg <= 0) return null;
  const w = inputs.weightKg;
  const ga = inputs.gestationalAgeWeeks;
  const isPreterm = ga !== null && ga < 37;

  type Prof = {
    label: string; mode: string; vtMin: number; vtMax: number;
    peep: string; pipStart: string; rr: string; itime: string;
    fio2: string; spo2: string; co2: string; cautions: string[]; titrate: string;
  };

  const spo2Preterm = isPreterm ? "91–95% (preterm — avoid hyperoxia/ROP)" : "93–97%";
  const fio2Preterm = isPreterm ? "0.30" : "0.40";

  const D = inputs.diagnosis;
  const profiles: Record<string, Prof> = {
    rds: {
      label: "Neonatal RDS",
      mode: "Volume-targeted (VTV) preferred — reduces BPD/IVH. SIMV+PS or A/C. Consider CPAP/LISA first if eligible.",
      vtMin: 4, vtMax: 5, peep: "5 cmH₂O (4–6)", pipStart: "Start PIP ~16–20 cmH₂O; titrate to VT 4–5 mL/kg + visible chest rise",
      rr: "40–60 bpm", itime: "0.3–0.4 s",
      fio2: `${fio2Preterm} start (titrate; wean rapidly post-surfactant)`, spo2: spo2Preterm, co2: "Permissive: pH ≥ 7.25, PaCO₂ 45–55. Avoid < 35 (PVL/IVH risk)",
      cautions: ["Give surfactant early (INSURE/LISA preferred).", "Caffeine if preterm < 34 weeks.", isPreterm ? "Avoid hyperoxia — SpO₂ 91–95%." : "Term SpO₂ 93–97%."],
      titrate: "ABG/CBG 30–60 min after initiation and after surfactant. Wean FiO₂ rapidly.",
    },
    ttn: {
      label: "Transient Tachypnoea of Newborn",
      mode: "CPAP/HFNC first. If intubated, gentle conventional ventilation with early extubation plan.",
      vtMin: 4, vtMax: 5, peep: "4–5 cmH₂O", pipStart: "Start PIP ~14–18 cmH₂O; titrate to VT + chest rise (well-compliant lungs)",
      rr: "40–60 bpm", itime: "0.3–0.4 s",
      fio2: "Titrate (often < 0.40 sufficient)", spo2: "93–97%", co2: "Near-normal PaCO₂ 35–50 mmHg",
      cautions: ["TTN is self-limited — avoid prolonged intubation.", "Exclude RDS, pneumonia, CHD."],
      titrate: "Most TTN resolves 12–72h. Reassess diagnosis if not improving.",
    },
    mas: {
      label: "Meconium Aspiration Syndrome",
      mode: "A/C or SIMV. Mixed obstructive + atelectatic — individualise.",
      vtMin: 4, vtMax: 6, peep: "4–5 cmH₂O (LOW — air trapping risk)", pipStart: "Start PIP ~18–22 cmH₂O; titrate to VT 4–6 mL/kg",
      rr: "40–50 bpm (longer expiration)", itime: "0.3–0.4 s",
      fio2: "1.0 start (maintain if PPHN component)", spo2: "≥ 94–97% (hypoxia worsens PPHN)", co2: "Moderate permissive: pH ≥ 7.25. Avoid acidosis if PPHN",
      cautions: ["High pneumothorax risk — chest drain at bedside.", "PPHN component common — monitor pre/post-ductal SpO₂, consider iNO.", "Avoid high PEEP — worsens trapping."],
      titrate: "ABG 30–60 min. Consider HFOV if OI > 10.",
    },
    pphn: {
      label: "Persistent Pulmonary Hypertension (PPHN)",
      mode: "A/C or SIMV. Adequate recruitment for iNO efficacy without overdistension.",
      vtMin: 4, vtMax: 5, peep: "4–6 cmH₂O", pipStart: "Start PIP ~18–22 cmH₂O; titrate to VT 4–5 mL/kg",
      rr: "40–60 bpm", itime: "0.3–0.4 s",
      fio2: "1.0 (100%) — O₂ is a pulmonary vasodilator", spo2: "Pre-ductal ≥ 94–97% (monitor pre + post-ductal)", co2: "Normocapnia PaCO₂ 35–45. Avoid acidosis (worsens PVR) and hypocarbia",
      cautions: ["iNO 20 ppm — senior NICU/cardiology decision; monitor methaemoglobin.", "Exclude ductal-dependent cardiac lesion before iNO.", "Echo essential. Early ECMO if OI > 25."],
      titrate: "ABG 30–60 min. Pre-post ductal gap > 10% confirms shunt. Avoid hypothermia/pain.",
    },
    cdh: {
      label: "Congenital Diaphragmatic Hernia",
      mode: "Gentle ventilation. Permissive hypercapnia standard. Protect contralateral lung.",
      vtMin: 3, vtMax: 5, peep: "3–5 cmH₂O (LOW)", pipStart: "Start PIP low ~16–20 cmH₂O; keep PIP minimal — avoid overdistension",
      rr: "40–60 bpm", itime: "0.3–0.4 s",
      fio2: "1.0 start (hypoxia worsens PPHN)", spo2: "Pre-ductal ≥ 85–90% (permissive hypoxaemia)", co2: "Permissive hypercapnia: pH ≥ 7.20, PaCO₂ 45–65. Do NOT target normocapnia",
      cautions: ["Surgical + senior NICU at all times.", "Avoid bag-mask ventilation (bowel distension).", "PPHN almost always present — pre/post-ductal monitoring.", "Early ECMO discussion."],
      titrate: "ABG 30–60 min. Accept permissive hypercapnia/hypoxaemia. Escalate early if failing.",
    },
    "neonatal-pneumonia": {
      label: "Neonatal Pneumonia / Sepsis",
      mode: "A/C or SIMV+PS. Severity-dependent.",
      vtMin: 4, vtMax: 5, peep: "4–6 cmH₂O (higher if consolidation)", pipStart: "Start PIP ~18–22 cmH₂O; titrate to VT 4–5 mL/kg",
      rr: "40–60 bpm", itime: "0.3–0.4 s",
      fio2: "Titrate to SpO₂ target", spo2: spo2Preterm, co2: "pH 7.30–7.45, PaCO₂ 40–55. Permissive OK if lung-protective needed",
      cautions: ["Blood culture + antibiotics (GBS/E.coli/Listeria early-onset).", "Sepsis may cause post-intubation collapse — fluid/inotropes ready.", "Monitor for PPHN component."],
      titrate: "ABG 30–60 min. Reassess if not improving on antibiotics.",
    },
    apnea: {
      label: "Apnoea of Prematurity",
      mode: "CPAP/HFNC preferred. If intubated, minimal settings + early extubation.",
      vtMin: 4, vtMax: 5, peep: "4–5 cmH₂O", pipStart: "Start PIP ~14–18 cmH₂O; minimal effective support",
      rr: "30–50 bpm backup (allow spontaneous breathing)", itime: "0.3–0.4 s",
      fio2: "Lowest maintaining SpO₂ target", spo2: "91–95% (preterm)", co2: "Near-normal — avoid over-ventilation",
      cautions: ["Caffeine citrate 20 mg/kg load then 5–10 mg/kg/day — most effective.", "Distinguish central vs obstructive apnoea.", "Avoid prolonged intubation (BPD risk)."],
      titrate: "Reassess frequently — extubate to CPAP/HFNC early.",
    },
    "neonatal-air-leak": {
      label: "Neonatal Air Leak / PIE",
      mode: "Low-pressure strategy. Minimise pressure and VT. Consider HFOV.",
      vtMin: 3, vtMax: 4, peep: "3–4 cmH₂O (lowest effective)", pipStart: "Start PIP low ~14–18 cmH₂O; minimum effective — air leak resolves with low pressure",
      rr: "40–60 bpm (compensates for low VT)", itime: "0.25–0.35 s",
      fio2: "1.0 start, accept permissive hypoxaemia", spo2: "≥ 88–90% (permissive)", co2: "Permissive hypercapnia: pH ≥ 7.20",
      cautions: ["Ensure chest drain in situ before/with HFOV if pneumothorax.", "HFOV preferred for significant PIE.", "Do NOT recruit aggressively.", "Serial CXR 4–6 hourly."],
      titrate: "ABG 30–60 min. Prioritise low pressure over CO₂ normalisation.",
    },
    "other-neonatal": {
      label: "Other Neonatal",
      mode: "Individualise. Senior neonatology.",
      vtMin: 4, vtMax: 5, peep: "4–6 cmH₂O", pipStart: "Start PIP ~16–20 cmH₂O; titrate to VT 4–5 mL/kg + chest rise",
      rr: "40–60 bpm", itime: "0.3–0.4 s",
      fio2: "Titrate to SpO₂ target", spo2: spo2Preterm, co2: "pH 7.25–7.45, PaCO₂ 40–55",
      cautions: ["Senior NICU review for non-standard diagnoses."],
      titrate: "ABG 30–60 min after initiation.",
    },
  };

  const p = profiles[D] ?? profiles["other-neonatal"];
  // Neonatal VT often < 10 mL — show 1 decimal
  const vtLow = (w * p.vtMin).toFixed(1);
  const vtHigh = (w * p.vtMax).toFixed(1);

  return {
    diagnosisLabel: p.label,
    modeSuggestion: p.mode,
    vtMl: `${vtLow}–${vtHigh} mL`,
    vtPerKg: `${p.vtMin}–${p.vtMax} mL/kg × ${w.toFixed(2)} kg`,
    rr: p.rr,
    peep: p.peep,
    pipStart: p.pipStart,
    itime: p.itime,
    fio2Start: p.fio2,
    spo2Target: p.spo2,
    co2Target: p.co2,
    keyCautions: p.cautions,
    titrationNote: p.titrate,
  };
}

export function runNeonatalMVAssessment(inputs: NeonatalMVInputs): NeonatalMVFullOutput {
  const hasMinimumData = inputs.weightKg !== null && inputs.age !== null;
  const ga = inputs.gestationalAgeWeeks;
  const isPreterm      = ga !== null && ga < 37;
  const isExtremePreterm = ga !== null && ga < 28;

  if (!hasMinimumData) {
    return { hasMinimumData: false, gestationalAgeWeeks: ga, isPreterm: false, isExtremePreterm: false, globalWarnings: [], oxygenation: null, ventilation: null, scenario: null, initialSettings: null, weaning: null };
  }

  return {
    hasMinimumData: true,
    gestationalAgeWeeks: ga,
    isPreterm,
    isExtremePreterm,
    globalWarnings:  validateGlobal(inputs, ga),
    oxygenation:     assessNeonatalOxygenation(inputs),
    ventilation:     assessNeonatalVentilation(inputs),
    scenario:        getNeonatalScenarioGuide(inputs),
    initialSettings: computeNeonatalInitialSettings(inputs),
    weaning:         assessNeonatalWeaning(inputs),
  };
}
