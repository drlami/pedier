import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// ─── Scenario classifier (used by UI only — does not touch medical thresholds) ──

export type HyperkalemiaUrgency = 'low' | 'moderate' | 'high' | 'emergency';

export interface HyperkalemiaScenario {
  scenarioNumber: 1 | 2 | 3 | 4 | 5;
  label: string;
  subtitle: string;
  urgency: HyperkalemiaUrgency;
  immediateActions: string[];
  medications: DrugDose[] | null;
  monitoring: string[];
  finalDecision: string[];
}

export function classifyHyperkalemiaScenario(data: FormData, severity: Severity): HyperkalemiaScenario {
  const potassium = Number(data.potassiumLevel) || 0;
  const weight = Number(data.weight) || 0;

  // Pre-compute weight-based doses (mirrors getDrugDoses)
  const cg_min = weight > 0 ? `${(0.5 * weight).toFixed(1)} mL` : '0.5–1 mL/kg';
  const cg_max = weight > 0 ? `${Math.min(1 * weight, 20).toFixed(1)} mL` : 'max 20 mL';
  const insulinDose = weight > 0 ? `${(0.1 * weight).toFixed(2)} units` : '0.1 units/kg';
  const dextroseG = weight > 0 ? `${(0.5 * weight).toFixed(1)} g` : '0.5 g/kg';
  const d10Ml = weight > 0 ? `${(5 * weight).toFixed(1)} mL` : '5 mL/kg';
  const d25Ml = weight > 0 ? `${(2 * weight).toFixed(1)} mL` : '2 mL/kg';
  const bicarbMin = weight > 0 ? `${(1 * weight).toFixed(1)}` : '1';
  const bicarbMax = weight > 0 ? `${(2 * weight).toFixed(1)}` : '2';
  const furosemideMin = weight > 0 ? `${(1 * weight).toFixed(1)}` : '1';
  const furosemideMax = weight > 0 ? `${(2 * weight).toFixed(1)}` : '2';

  const cgDrug: DrugDose = {
    drugName: 'Calcium Gluconate 10%',
    dose: `0.5–1 mL/kg IV = ${cg_min}–${cg_max} IV over 5–10 min. Max 20 mL/dose.`,
    notes: 'Give FIRST for ECG changes, arrhythmia, or K+ ≥ 6.5. Stabilizes myocardium only — does NOT lower K+. Repeat after 5–10 min if ECG changes persist. Use calcium gluconate (not chloride) via peripheral line.',
  };
  const insulinDrug: DrugDose = {
    drugName: 'Regular Insulin + Dextrose',
    dose: `Insulin 0.1 units/kg IV = ${insulinDose} + Dextrose 0.5 g/kg = ${dextroseG} (D10W ${d10Ml} OR D25W ${d25Ml}).`,
    notes: 'Shifts K+ intracellularly. Always give dextrose with insulin unless patient is clearly hyperglycaemic. Monitor glucose every 30 min for ≥ 2–3 hours.',
  };
  const salbutamolDrug: DrugDose = {
    drugName: 'Salbutamol / Albuterol (nebulized)',
    dose: weight >= 25 ? '10 mg nebulized' : '2.5–5 mg nebulized',
    notes: 'Adjunct for intracellular K+ shift. Do NOT use as sole emergency therapy in severe hyperkalemia. Watch for tachycardia and tremor.',
  };
  const bicarbDrug: DrugDose = {
    drugName: 'Sodium Bicarbonate',
    dose: `1–2 mEq/kg IV slowly = ${bicarbMin}–${bicarbMax} mEq IV.`,
    notes: 'Indicated ONLY when significant metabolic acidosis is present. Not routine for all hyperkalemia cases.',
  };
  const furosemideDrug: DrugDose = {
    drugName: 'Furosemide',
    dose: `1–2 mg/kg IV = ${furosemideMin}–${furosemideMax} mg IV.`,
    notes: 'Helps remove K+ via urine only if adequate renal function and urine output. Do NOT rely on in oliguria/renal failure.',
  };
  const dialysisDrug: DrugDose = {
    drugName: 'Dialysis / Renal Replacement Therapy',
    dose: 'Urgent nephrology/PICU consultation required.',
    notes: 'Indicated for refractory severe hyperkalemia, renal failure with oliguria/anuria, persistent ECG changes, or failure of medical therapy.',
  };
  const binderDrug: DrugDose = {
    drugName: 'Potassium Binder (e.g. Resonium)',
    dose: 'As per local formulary and senior guidance.',
    notes: 'Slow-onset gut K+ removal. Not adequate as sole emergency treatment. Avoid in ileus, post-op gut, or high NEC risk.',
  };

  // ── Scenario 4: pseudohyperkalemia — check first (takes priority over mild)
  if (
    data.sampleHemolyzed &&
    !data.hasEkgChanges &&
    !data.hasMuscleWeakness &&
    potassium < 6.5
  ) {
    return {
      scenarioNumber: 4,
      label: 'Suspected Pseudohyperkalemia',
      subtitle: 'Hemolyzed / suspicious sample — child clinically well, no ECG changes',
      urgency: 'moderate',
      immediateActions: [
        'Repeat venous or arterial potassium urgently using a carefully collected, non-hemolyzed sample.',
        'Stop potassium-containing IV fluids and medications while awaiting repeat result.',
        'Obtain 12-lead ECG immediately to rule out true hyperkalemia effect.',
        'Do NOT initiate calcium, insulin, or salbutamol based on this result alone.',
        'If renal failure, acidosis, symptoms, or ECG changes are present, treat as true hyperkalemia until confirmed otherwise.',
      ],
      medications: null,
      monitoring: [
        'Continuous clinical observation while awaiting repeat potassium.',
        'If repeat K+ is high (≥ 6.0) OR ECG becomes abnormal → escalate immediately to Scenario 2 or 3.',
        'If repeat K+ is normal and ECG is normal → reassure and document.',
      ],
      finalDecision: [
        'Do not discharge until repeat potassium result is available and ECG is confirmed normal.',
        'If repeat K+ is elevated, manage according to the confirmed level (Scenario 1, 2, or 3).',
      ],
    };
  }

  // ── Scenario 5: renal failure / oliguria — overlaps with any severity
  if (data.hasRenalFailure) {
    return {
      scenarioNumber: 5,
      label: 'Hyperkalemia with Renal Failure / Oliguria',
      subtitle: 'Renal failure, oliguria, or anuria — definitive K+ removal is required',
      urgency: 'high',
      immediateActions: [
        'Place on continuous cardiac monitor and obtain 12-lead ECG immediately.',
        'Urgent nephrology consultation — do not delay.',
        'Stop all potassium sources (IV fluids, supplements, K+-sparing drugs).',
        'If ECG changes or K+ ≥ 6.5: give IV calcium gluconate immediately as bridge therapy.',
        'Give insulin/dextrose and nebulized salbutamol to temporize while arranging definitive removal.',
        'Prepare dialysis pathway — renal replacement therapy is the definitive treatment.',
      ],
      medications: [
        ...(data.hasEkgChanges || potassium >= 6.5 ? [cgDrug] : []),
        insulinDrug,
        salbutamolDrug,
        ...(data.hasAcidosis ? [bicarbDrug] : []),
        dialysisDrug,
        binderDrug,
      ],
      monitoring: [
        'Continuous ECG until K+ is safe and ECG is normal.',
        'Repeat serum potassium every 1–2 hours.',
        'Strict intake/output monitoring — record urine output hourly.',
        'Blood glucose every 30 min after insulin/dextrose for ≥ 2–3 hours.',
        'Monitor for hypoglycemia especially in young children.',
      ],
      finalDecision: [
        'PICU / high-dependency unit admission required.',
        'Urgent nephrology, PICU, and senior pediatrician involvement.',
        'Dialysis is the definitive treatment — arrange urgently if K+ is refractory, ECG changes persist, or oliguria/anuria is present.',
        'Do not discharge until potassium is safe, renal function is managed, and a follow-up plan is in place.',
      ],
    };
  }

  // ── Scenario 3: severe / ECG changes / arrhythmia / K+ ≥ 6.5
  if (data.hasEkgChanges || data.hasMuscleWeakness || potassium >= 6.5) {
    return {
      scenarioNumber: 3,
      label: 'Severe Hyperkalemia — Emergency',
      subtitle: 'ECG changes, arrhythmia, muscle weakness, or K+ ≥ 6.5 mEq/L',
      urgency: 'emergency',
      immediateActions: [
        'Immediate cardiac monitor + 12-lead ECG.',
        'Call senior clinician / PICU NOW.',
        'Stop ALL potassium sources immediately.',
        'FIRST: IV Calcium Gluconate — stabilizes myocardium. Give even before repeat labs.',
        'THEN: Insulin/dextrose IV + nebulized salbutamol to shift K+ into cells.',
        'Sodium bicarbonate ONLY if significant metabolic acidosis is confirmed.',
        'Start K+ removal: furosemide only if adequate urine output; potassium binder per senior guidance.',
        'Repeat ECG 15–30 minutes after calcium. Repeat serum K+ 30–60 min after shifting therapy.',
        'Prepare for dialysis if K+ remains ≥ 6.5 or ECG does not normalise after initial treatment.',
      ],
      medications: [
        cgDrug,
        insulinDrug,
        salbutamolDrug,
        ...(data.hasAcidosis ? [bicarbDrug] : []),
        furosemideDrug,
        binderDrug,
        dialysisDrug,
      ],
      monitoring: [
        'Continuous ECG monitoring until K+ is safe and ECG fully normalizes.',
        'Repeat serum K+ 30–60 min after shifting therapy, then every 1–2 hours until stable.',
        'Blood glucose every 30 min for ≥ 2–3 hours after insulin/dextrose.',
        'Watch closely for hypoglycemia — especially in young children, renal failure, or poor oral intake.',
        'Strict urine output monitoring.',
        'Repeat 12-lead ECG 15–30 min after calcium, and after any treatment change.',
      ],
      finalDecision: [
        'PICU / high-dependency monitored admission — mandatory.',
        'Urgent senior pediatrician, PICU, and nephrology involvement.',
        'Dialysis pathway if: refractory hyperkalemia, renal failure, oliguria/anuria, or persistent ECG changes after initial therapy.',
        'Do NOT discharge until K+ is safe, ECG normalizes, and underlying cause is addressed.',
      ],
    };
  }

  // ── Scenario 2: moderate, clinically stable, no ECG changes
  if (potassium >= 6.0) {
    return {
      scenarioNumber: 2,
      label: 'Moderate Hyperkalemia — Urgent',
      subtitle: 'K+ 6.0–6.4 mEq/L, clinically stable, no ECG changes',
      urgency: 'high',
      immediateActions: [
        'Place on continuous cardiac monitor immediately.',
        'Obtain 12-lead ECG — do not delay treatment if clinically concerning.',
        'Stop all potassium sources (IV fluids, supplements, K+-raising drugs).',
        'Repeat serum K+ if sample quality is uncertain, but do NOT delay management if high-risk.',
        'Consider insulin/dextrose and nebulized salbutamol for K+ shifting if K+ is rising, renal impairment is present, or patient is high-risk.',
        'Consider furosemide for K+ removal ONLY if urine output and renal function are adequate.',
        'Discuss with senior clinician or nephrology if renal impairment or poor response to initial measures.',
      ],
      medications: [
        insulinDrug,
        salbutamolDrug,
        furosemideDrug,
        binderDrug,
      ],
      monitoring: [
        'Continuous cardiac monitoring.',
        'Repeat serum potassium every 1–2 hours.',
        'Blood glucose every 30 min for ≥ 2–3 hours if insulin/dextrose given.',
        'Monitor for hypoglycemia after insulin.',
        'Urine output monitoring.',
        'Repeat ECG if K+ rises or symptoms develop — escalate to Scenario 3 immediately if ECG changes appear.',
      ],
      finalDecision: [
        'Admit to monitored ward or observe in ED with continuous cardiac monitoring.',
        'Do not discharge until K+ is improving, ECG is confirmed normal, the underlying cause is addressed, and a safe follow-up plan is in place.',
        'Escalate to PICU/nephrology if K+ does not improve or ECG changes develop.',
      ],
    };
  }

  // ── Scenario 1: mild, asymptomatic, no ECG changes
  if (potassium >= 5.5) {
    return {
      scenarioNumber: 1,
      label: 'Mild Hyperkalemia — Watchful Management',
      subtitle: 'K+ 5.5–5.9 mEq/L, asymptomatic, no ECG changes',
      urgency: 'low',
      immediateActions: [
        'Obtain ECG and confirm it is normal before classifying as mild.',
        data.sampleHemolyzed
          ? 'Repeat K+ with a careful, non-hemolyzed sample — this result may be falsely elevated.'
          : 'Repeat K+ if result is unexpected or sample quality is uncertain.',
        'Stop all potassium sources: K+-containing IV fluids, supplements, and K+-raising medications.',
        'Assess renal function (creatinine/urea), hydration status, acid-base balance, and review all current medications.',
        'No emergency calcium, insulin, or salbutamol needed while ECG is normal and patient is well.',
      ],
      medications: null,
      monitoring: [
        'Repeat serum potassium in 2–4 hours to confirm trend.',
        'Repeat ECG if K+ rises or symptoms develop.',
        'If K+ rises to ≥ 6.0 or ECG changes appear → escalate to Scenario 2 or 3 immediately.',
        'Review dietary potassium intake if chronic/recurrent mild hyperkalemia.',
      ],
      finalDecision: [
        'May be managed with observation or outpatient follow-up ONLY if: child is clinically well, ECG is normal, repeat K+ is stable or improving, no renal failure, and a safe follow-up plan exists.',
        'Admit if: K+ is rising, cause is unknown, renal impairment is present, or reliable follow-up cannot be arranged.',
      ],
    };
  }

  // ── Fallback: potassium not yet entered or not in hyperkalemic range
  return {
    scenarioNumber: 1,
    label: 'Assessment Incomplete',
    subtitle: 'Enter potassium level and clinical details to classify the scenario',
    urgency: 'low',
    immediateActions: [
      'Enter serum potassium level (mEq/L) and patient weight.',
      'Answer the clinical questions about ECG changes, symptoms, renal function, and sample quality.',
      'The scenario and management plan will update automatically.',
    ],
    medications: null,
    monitoring: [],
    finalDecision: [],
  };
}

// ─── Protocol definition ─────────────────────────────────────────────────────

export const hyperkalemiaProtocol: DiseaseProtocol = {
  id: 'hyperkalemia',
  name: 'Hyperkalemia',
  system: 'Electrolyte Disturbances',
  description:
    'Pediatric emergency protocol for elevated serum potassium. Focuses on confirming true hyperkalemia, ECG risk, myocardial stabilization, intracellular shifting, potassium removal, monitoring, and disposition.',
  image: {
    url: 'https://picsum.photos/seed/hyperkalemia/600/400',
    hint: 'heart ecg',
  },

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'potassiumLevel', questionText: 'Serum Potassium (K+)', type: 'number', unit: 'mEq/L' },
    {
      id: 'sampleHemolyzed',
      questionText: 'Is the potassium sample hemolyzed or suspicious for pseudohyperkalemia?',
      type: 'boolean',
      info: 'Hemolysis, difficult blood draw, very high platelets/WBC, prolonged tourniquet, or delayed sample processing may falsely elevate K+.',
    },
    {
      id: 'hasEkgChanges',
      questionText: 'Are there ECG changes suggestive of hyperkalemia?',
      type: 'boolean',
      info: 'Peaked T waves, PR prolongation, flattened/absent P waves, QRS widening, bradycardia, AV block, ventricular rhythm, sine-wave pattern.',
    },
    {
      id: 'hasMuscleWeakness',
      questionText: 'Is there muscle weakness, paralysis, or concerning symptoms?',
      type: 'boolean',
    },
    {
      id: 'hasRenalFailure',
      questionText: 'Is there renal failure, oliguria, or anuria?',
      type: 'boolean',
    },
    {
      id: 'hasAcidosis',
      questionText: 'Is there significant metabolic acidosis?',
      type: 'boolean',
      info: 'Consider if low pH/HCO3 on blood gas. Sodium bicarbonate is mainly useful when acidosis is present.',
    },
    {
      id: 'onPotassiumMeds',
      questionText: 'Is the patient receiving potassium or drugs that increase K+?',
      type: 'boolean',
      info: 'Examples: K-containing IV fluids, potassium supplements, ACE inhibitors, ARBs, spironolactone, NSAIDs, trimethoprim, tacrolimus/cyclosporine.',
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const potassium = Number(data.potassiumLevel);

    if (!potassium || potassium <= 0) {
      return {
        level: 'unknown',
        details: ['Enter serum potassium level and assess ECG/symptoms.'],
      };
    }

    if (data.hasEkgChanges || data.hasMuscleWeakness || potassium >= 6.5) {
      return {
        level: 'severe',
        details: [
          'Severe / life-threatening hyperkalemia.',
          'Treat immediately if ECG changes, symptoms, or K+ ≥ 6.5 mEq/L.',
          'Do not delay emergency treatment while waiting for repeat labs if patient is unstable or ECG is abnormal.',
        ],
      };
    }

    if (potassium >= 6.0) {
      return {
        level: 'moderate',
        details: [
          'Moderate hyperkalemia.',
          'Requires urgent assessment, ECG monitoring, repeat potassium confirmation, and active treatment depending on trend/risk factors.',
        ],
      };
    }

    if (potassium >= 5.5) {
      return {
        level: 'mild',
        details: [
          'Mild hyperkalemia.',
          'Confirm result, look for pseudohyperkalemia, stop potassium sources, and treat underlying cause.',
        ],
      };
    }

    return {
      level: 'unknown',
      details: ['Potassium is not in hyperkalemic range. Continue clinical assessment if symptoms or ECG abnormality exist.'],
    };
  },

  getManagement: (severity, data) => {
    const potassium = Number(data.potassiumLevel);
    const management = [];

    management.push({
      title: 'Immediate First Steps for Any Suspected Hyperkalemia',
      recommendations: [
        'Place patient on cardiac monitor if K+ ≥ 6.0, symptoms, renal failure, or any ECG concern.',
        'Obtain 12-lead ECG immediately.',
        'Repeat potassium urgently if result is unexpected or sample may be hemolyzed.',
        'Stop all potassium intake: K-containing IV fluids, oral/IV potassium, TPN potassium, and potassium-raising medications.',
        'Check glucose, calcium, magnesium, creatinine/urea, blood gas, bicarbonate, and urine output.',
        'Treat dehydration/shock if present, but avoid potassium-containing fluids.',
      ],
    });

    if (data.sampleHemolyzed && !data.hasEkgChanges && !data.hasMuscleWeakness && potassium < 6.5) {
      management.push({
        title: 'Possible Pseudohyperkalemia',
        recommendations: [
          'Repeat urgent venous or arterial potassium with careful non-hemolyzed sample.',
          'Do not ignore the value if renal failure, acidosis, symptoms, or ECG changes are present.',
          'If repeat potassium is normal and ECG is normal, avoid unnecessary hyperkalemia medications.',
        ],
      });
    }

    if (severity.level === 'severe') {
      management.push({
        title: 'SEVERE Hyperkalemia — Emergency Treatment',
        recommendations: [
          '1. Stabilize myocardium FIRST if ECG changes, symptoms, or K+ ≥ 6.5: give IV calcium gluconate immediately.',
          'Calcium protects the heart but does NOT lower potassium.',
          'Repeat calcium after 5–10 minutes if ECG changes persist.',
          '2. Shift potassium into cells: give regular insulin IV with dextrose, plus nebulized salbutamol.',
          '3. Give sodium bicarbonate only if significant metabolic acidosis is present.',
          '4. Remove potassium from body: furosemide if urine output and renal function are adequate.',
          '5. Urgent nephrology/PICU consultation if renal failure, oliguria/anuria, refractory hyperkalemia, or K+ remains ≥ 6.5 after initial therapy.',
          '6. Prepare for dialysis if refractory, severe renal failure, or ongoing dangerous ECG changes.',
        ],
      });
    } else if (severity.level === 'moderate') {
      management.push({
        title: 'MODERATE Hyperkalemia',
        recommendations: [
          'Cardiac monitor and urgent ECG.',
          'Repeat potassium to confirm, especially if no risk factors or sample may be hemolyzed.',
          'Stop potassium sources and correct reversible causes.',
          'If K+ is rising, renal failure is present, acidosis is present, or ECG is abnormal: treat as severe.',
          'Consider insulin/dextrose and nebulized salbutamol if persistent K+ ≥ 6.0 or high-risk patient.',
          'Consider furosemide only if adequate urine output.',
          'Discuss with senior clinician/nephrology if renal impairment or poor response.',
        ],
      });
    } else if (severity.level === 'mild') {
      management.push({
        title: 'MILD Hyperkalemia',
        recommendations: [
          'Repeat potassium if unexpected or possible hemolysis.',
          'Review medications and stop potassium sources.',
          'Assess renal function, hydration status, and acid-base status.',
          'Dietary potassium restriction may be considered if persistent/chronic.',
          'No emergency calcium/insulin is needed if ECG normal, patient well, and K+ < 6.0.',
        ],
      });
    } else {
      management.push({
        title: 'Assessment Needed',
        recommendations: [
          'Enter potassium level, weight, ECG status, symptoms, renal function, and acidosis status.',
        ],
      });
    }

    management.push({
      title: 'Monitoring After Treatment',
      recommendations: [
        'Continuous ECG monitoring until potassium is safe and ECG is normal.',
        'Repeat serum potassium 30–60 minutes after emergency shifting therapy, then every 1–2 hours until stable.',
        'Check blood glucose at baseline, then every 30 minutes for at least 2–3 hours after insulin/dextrose.',
        'Monitor for hypoglycemia after insulin, especially in young children, renal failure, poor intake, or low baseline glucose.',
        'Strict input/output and urine output monitoring.',
      ],
    });

    return management;
  },

  getDisposition: (severity, data) => {
    const potassium = Number(data.potassiumLevel);

    if (severity.level === 'severe') {
      return [
        'PICU / high-dependency monitored admission.',
        'Urgent senior pediatrician, PICU, and nephrology involvement.',
        'Dialysis pathway if refractory hyperkalemia, renal failure, oliguria/anuria, or persistent ECG changes.',
      ];
    }

    if (severity.level === 'moderate') {
      return [
        'Admit to monitored setting or observe in ED with continuous cardiac monitoring depending on response and cause.',
        'Do not discharge until potassium is improving, ECG is normal, cause is addressed, and follow-up plan is safe.',
      ];
    }

    if (severity.level === 'mild') {
      return [
        'May be managed with observation or outpatient follow-up only if child is well, ECG is normal, repeat potassium is stable/improving, and no renal failure or high-risk cause.',
      ];
    }

    return ['Disposition depends on potassium level, ECG, symptoms, renal function, and repeat confirmed result.'];
  },

  getRedFlags: () => [
    'Any ECG change: peaked T waves, absent P waves, PR prolongation, QRS widening, bradycardia, AV block, ventricular rhythm, or sine-wave pattern.',
    'K+ ≥ 6.5 mEq/L.',
    'Muscle weakness, paralysis, collapse, palpitations, or arrhythmia.',
    'Renal failure, oliguria, or anuria.',
    'Rapidly rising potassium.',
    'Severe metabolic acidosis.',
    'Ongoing potassium intake or potassium-raising medication.',
    'Refractory hyperkalemia after initial calcium + shifting therapy.',
  ],

  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    const calciumGluconateMin = weight > 0 ? (0.5 * weight).toFixed(1) : '';
    const calciumGluconateMax = weight > 0 ? Math.min(1 * weight, 20).toFixed(1) : '';

    const insulinDose = weight > 0 ? (0.1 * weight).toFixed(2) : '';
    const dextroseG = weight > 0 ? (0.5 * weight).toFixed(1) : '';
    const d10Ml = weight > 0 ? (5 * weight).toFixed(1) : '';
    const d25Ml = weight > 0 ? (2 * weight).toFixed(1) : '';

    const bicarbMin = weight > 0 ? (1 * weight).toFixed(1) : '';
    const bicarbMax = weight > 0 ? (2 * weight).toFixed(1) : '';

    const furosemideMin = weight > 0 ? (1 * weight).toFixed(1) : '';
    const furosemideMax = weight > 0 ? (2 * weight).toFixed(1) : '';

    if (weight > 0) {
      doses.push({
        drugName: 'Calcium Gluconate 10%',
        dose: `0.5–1 mL/kg IV = ${calciumGluconateMin}–${calciumGluconateMax} mL IV over 5–10 minutes. Max commonly 20 mL per dose.`,
        notes:
          'Use immediately for ECG changes, symptoms, or severe hyperkalemia. Stabilizes myocardium only; does not lower K+. Repeat after 5–10 min if ECG changes persist. Prefer calcium gluconate via peripheral line.',
      });

      doses.push({
        drugName: 'Regular Insulin + Dextrose',
        dose: `Regular insulin 0.1 units/kg IV = ${insulinDose} units + dextrose 0.5 g/kg = ${dextroseG} g. Equivalent: D10W ${d10Ml} mL OR D25W ${d25Ml} mL.`,
        notes:
          'Shifts K+ intracellularly. Give dextrose with insulin unless clearly hyperglycemic and senior clinician decides otherwise. Monitor glucose every 30 min for at least 2–3 hours.',
      });

      doses.push({
        drugName: 'Salbutamol / Albuterol nebulized',
        dose: '2.5–5 mg nebulized in smaller children; 10 mg nebulized in larger children/adolescents. May repeat depending on response.',
        notes:
          'Adjunct for intracellular K+ shift. Do not use as the only emergency therapy in life-threatening hyperkalemia. Watch tachycardia/tremor.',
      });

      doses.push({
        drugName: 'Sodium Bicarbonate',
        dose: `1–2 mEq/kg IV = ${bicarbMin}–${bicarbMax} mEq IV slowly.`,
        notes:
          'Use mainly if significant metabolic acidosis is present. Not routine for all hyperkalemia.',
      });

      doses.push({
        drugName: 'Furosemide',
        dose: `1–2 mg/kg IV = ${furosemideMin}–${furosemideMax} mg IV.`,
        notes:
          'Helps remove K+ only if adequate renal function and urine output. Avoid relying on it in anuria/renal failure.',
      });

      doses.push({
        drugName: 'Potassium Binder',
        dose: 'Use only according to local formulary/senior advice.',
        notes:
          'Slow onset. Not adequate as sole emergency treatment. Avoid sodium polystyrene sulfonate/Kayexalate in ileus, bowel obstruction, post-op gut, or high NEC risk.',
      });

      doses.push({
        drugName: 'Dialysis / Renal Replacement Therapy',
        dose: 'Urgent nephrology/PICU consultation.',
        notes:
          'Indicated for refractory severe hyperkalemia, renal failure with oliguria/anuria, persistent ECG changes, or failure of medical therapy.',
      });
    } else {
      doses.push({
        drugName: 'Calcium Gluconate 10%',
        dose: '0.5–1 mL/kg IV over 5–10 minutes. Max commonly 20 mL per dose.',
        notes:
          'Use immediately for ECG changes, symptoms, or severe hyperkalemia. Repeat after 5–10 min if ECG changes persist.',
      });

      doses.push({
        drugName: 'Regular Insulin + Dextrose',
        dose: 'Regular insulin 0.1 units/kg IV + dextrose 0.5 g/kg IV. Examples: D10W 5 mL/kg or D25W 2 mL/kg.',
        notes:
          'Monitor glucose every 30 min for at least 2–3 hours after insulin.',
      });

      doses.push({
        drugName: 'Salbutamol / Albuterol nebulized',
        dose: '2.5–5 mg nebulized in smaller children; 10 mg nebulized in larger children/adolescents.',
        notes: 'Adjunct for intracellular K+ shift. Watch tachycardia.',
      });

      doses.push({
        drugName: 'Sodium Bicarbonate',
        dose: '1–2 mEq/kg IV slowly.',
        notes: 'Use mainly if significant metabolic acidosis is present.',
      });

      doses.push({
        drugName: 'Furosemide',
        dose: '1–2 mg/kg IV.',
        notes: 'Only if adequate renal function and urine output.',
      });

      doses.push({
        drugName: 'Dialysis / Renal Replacement Therapy',
        dose: 'Urgent nephrology/PICU consultation.',
        notes: 'For refractory severe hyperkalemia or renal failure/anuria.',
      });
    }

    return doses;
  },

  getReferences: () => [
    {
      title: "Royal Children's Hospital Melbourne: Clinical Practice Guideline — Hyperkalaemia",
      url: 'https://www.rch.org.au/clinicalguide/guideline_index/hyperkalaemia/',
    },
    {
      title: 'NHSGGC: Hyperkalaemia Emergency Management — Paediatric Intensive Care Unit',
      url: 'https://rightdecisions.scot.nhs.uk/ggc-clinical-guidelines/paediatrics/intensive-and-critical-care-paediatric/hyperkalaemia-emergency-management-paediatric-intensive-care-unit-387/',
    },
    {
      title: "Children's Health Queensland: Hyperkalaemia — Emergency Management in Children",
      url: 'https://www.childrens.health.qld.gov.au/__data/assets/pdf_file/0017/180206/af2e5e382600d8b7ef80587e718f4e2d3d5d4b1d.pdf',
    },
    {
      title: "Starship Children's Health: Hyperkalaemia in Children",
      url: 'https://www.starship.org.nz/guidelines/hyperkalemia-in-children/',
    },
  ],
};
