import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// ─── Scenario Classification ──────────────────────────────────────────────────

export interface HyperkalemiaScenario {
  scenarioNumber: 1 | 2 | 3 | 4 | 5 | null;
  label: string;
  description: string;
  urgency: 'low' | 'moderate' | 'high' | 'emergency';
  immediateActions: string[];
  medications: DrugDose[] | null;
  monitoring: string[];
  finalDecision: string[];
}

export function classifyHyperkalemiaScenario(data: FormData, _severity: Severity): HyperkalemiaScenario {
  const potassium = Number(data.potassiumLevel);
  const weight = Number(data.weight) || 0;

  if (!potassium || potassium <= 0) {
    return {
      scenarioNumber: null,
      label: 'Awaiting Assessment',
      description: 'Enter serum potassium level and answer all questions to classify the patient scenario.',
      urgency: 'low',
      immediateActions: ['Enter serum potassium level and complete clinical assessment.'],
      medications: null,
      monitoring: ['Clinical monitoring while assessment is ongoing.'],
      finalDecision: ['Disposition depends on potassium level, ECG, symptoms, and clinical context.'],
    };
  }

  // Weight-based dose strings
  const caMin  = weight > 0 ? `${(0.5 * weight).toFixed(1)} mL` : '—';
  const caMax  = weight > 0 ? `${Math.min(weight, 20).toFixed(1)} mL` : '—';
  const ins    = weight > 0 ? `${(0.1 * weight).toFixed(2)} units` : '0.1 units/kg';
  const d10    = weight > 0 ? `${(5 * weight).toFixed(1)} mL` : '5 mL/kg';
  const d25    = weight > 0 ? `${(2 * weight).toFixed(1)} mL` : '2 mL/kg';
  const dextG  = weight > 0 ? `${(0.5 * weight).toFixed(1)} g` : '0.5 g/kg';
  const biMin  = weight > 0 ? `${(1 * weight).toFixed(1)} mEq` : '—';
  const biMax  = weight > 0 ? `${(2 * weight).toFixed(1)} mEq` : '—';
  const fuMin  = weight > 0 ? `${(1 * weight).toFixed(1)} mg` : '—';
  const fuMax  = weight > 0 ? `${(2 * weight).toFixed(1)} mg` : '—';

  // ── Scenario 3: Emergency — ECG changes, symptoms, or K+ ≥ 6.5 ──────────────
  if (data.hasEkgChanges || data.hasMuscleWeakness || potassium >= 6.5) {
    const meds: DrugDose[] = [
      {
        drugName: 'Calcium Gluconate 10% — GIVE FIRST',
        dose: weight > 0
          ? `0.5–1 mL/kg IV = ${caMin}–${caMax} IV over 5–10 min. Max 20 mL/dose.`
          : '0.5–1 mL/kg IV over 5–10 min. Max 20 mL/dose.',
        notes:
          'Cardiac membrane stabilization ONLY — does NOT lower K+. Repeat after 5–10 min if ECG changes persist. Give via peripheral line.',
      },
      {
        drugName: 'Regular Insulin + Dextrose',
        dose: weight > 0
          ? `Insulin 0.1 units/kg IV = ${ins} + dextrose ${dextG}: D10W ${d10} OR D25W ${d25}.`
          : 'Insulin 0.1 units/kg IV + D10W 5 mL/kg OR D25W 2 mL/kg.',
        notes: 'Shifts K+ intracellularly. Give dextrose with insulin. Monitor glucose every 30 min for ≥ 2–3 h.',
      },
      {
        drugName: 'Salbutamol nebulized',
        dose: '2.5–5 mg nebulized (smaller child); 10 mg nebulized (larger child/adolescent).',
        notes: 'Adjunct intracellular K+ shift. Do NOT rely on it alone. Watch tachycardia/tremor.',
      },
      ...(data.hasAcidosis
        ? [
            {
              drugName: 'Sodium Bicarbonate (acidosis present)',
              dose: weight > 0
                ? `1–2 mEq/kg IV = ${biMin}–${biMax} IV slowly.`
                : '1–2 mEq/kg IV slowly.',
              notes: 'Only if significant metabolic acidosis confirmed on blood gas. Not routine for all hyperkalemia.',
            },
          ]
        : []),
      {
        drugName: 'Furosemide (if urine output adequate)',
        dose: weight > 0
          ? `1–2 mg/kg IV = ${fuMin}–${fuMax} IV.`
          : '1–2 mg/kg IV.',
        notes: 'K+ removal — use ONLY if adequate urine output and renal function. Do not give if oliguria/anuria.',
      },
    ];

    return {
      scenarioNumber: 3,
      label: 'Scenario 3 — EMERGENCY: Severe Hyperkalemia',
      description: data.hasEkgChanges
        ? 'ECG changes present — immediate cardiac membrane stabilization required.'
        : data.hasMuscleWeakness
        ? 'Symptoms (weakness / paralysis) present — emergency treatment required.'
        : 'K+ ≥ 6.5 mEq/L — life-threatening hyperkalemia.',
      urgency: 'emergency',
      immediateActions: [
        'Attach continuous cardiac monitor and obtain 12-lead ECG immediately.',
        'Establish IV/IO access — draw repeat K+, glucose, calcium, creatinine, blood gas.',
        'Give IV Calcium Gluconate NOW if ECG changes, arrhythmia, or severe instability — do not delay.',
        'Stop ALL potassium sources: K-containing fluids, oral/IV K+, TPN K+, and K+-raising medications.',
        ...(data.hasRenalFailure
          ? ['Urgent nephrology AND PICU consultation — renal failure present, dialysis pathway required.']
          : ['Urgent senior pediatrician involvement. Involve PICU/nephrology if refractory or deteriorating.']),
        'Prepare for dialysis if refractory hyperkalemia, persistent ECG changes, or oliguria/anuria.',
      ],
      medications: meds,
      monitoring: [
        'Continuous ECG monitoring until K+ is safe and ECG normalized.',
        'Repeat serum K+ 30–60 min after shifting therapy, then every 1–2 h until stable.',
        'Blood glucose every 30 min for at least 2–3 h after insulin/dextrose.',
        'Monitor for hypoglycemia — especially young children, renal failure, or poor oral intake.',
        'Strict urine output monitoring.',
        'Repeat 12-lead ECG after treatment and with each K+ recheck.',
      ],
      finalDecision: [
        'PICU / high-dependency monitored admission.',
        'Urgent senior pediatrician, PICU, and nephrology involvement.',
        ...(data.hasRenalFailure
          ? ['Active dialysis pathway — renal failure with severe hyperkalemia.']
          : ['Dialysis pathway if refractory, persistent ECG changes, or oliguria/anuria develops.']),
      ],
    };
  }

  // ── Scenario 4: Pseudohyperkalemia — hemolyzed, clinically well, no ECG changes ──
  if (
    data.sampleHemolyzed &&
    !data.hasEkgChanges &&
    !data.hasMuscleWeakness &&
    !data.hasRenalFailure &&
    potassium < 6.5
  ) {
    return {
      scenarioNumber: 4,
      label: 'Scenario 4 — Suspected Pseudohyperkalemia',
      description: 'Hemolyzed or suspicious sample in a clinically stable child with no ECG changes and no renal failure.',
      urgency: 'moderate',
      immediateActions: [
        'Repeat potassium urgently with a fresh, carefully collected non-hemolyzed venous or arterial sample.',
        'Obtain 12-lead ECG while awaiting the repeat result.',
        'Do NOT start hyperkalemia medications until repeat result is confirmed high.',
        'Stop any potassium-raising medications or K-containing supplements while awaiting result.',
        'If repeat K+ is elevated, ECG changes appear, or the child deteriorates — escalate to Scenario 2 or 3 immediately.',
      ],
      medications: null,
      monitoring: [
        'Cardiac monitor while awaiting repeat potassium result.',
        'Repeat ECG if any new symptoms or clinical change.',
        'Reassess fully once repeat potassium is available.',
      ],
      finalDecision: [
        'Observe in ED until repeat potassium result is available.',
        'If repeat K+ is normal and ECG is normal: may discharge with primary care or outpatient follow-up.',
        'If repeat K+ remains elevated or any ECG changes develop: escalate to Scenario 2 or 3 immediately.',
      ],
    };
  }

  // ── Scenario 5: Renal failure / oliguria / anuria ────────────────────────────
  if (data.hasRenalFailure && potassium >= 5.5) {
    const meds: DrugDose[] = [
      {
        drugName: 'Regular Insulin + Dextrose (temporizing)',
        dose: weight > 0
          ? `Insulin 0.1 units/kg IV = ${ins} + D10W ${d10} OR D25W ${d25}.`
          : 'Insulin 0.1 units/kg IV + D10W 5 mL/kg OR D25W 2 mL/kg.',
        notes: 'Intracellular K+ shift — temporizing only. Monitor glucose every 30 min for ≥ 2–3 h.',
      },
      {
        drugName: 'Salbutamol nebulized (temporizing)',
        dose: '2.5–5 mg nebulized (smaller child); 10 mg nebulized (larger child/adolescent).',
        notes: 'Adjunct temporizing measure. Watch tachycardia.',
      },
      {
        drugName: 'Dialysis / Renal Replacement Therapy',
        dose: 'Urgent nephrology consultation for dialysis planning.',
        notes:
          'Definitive K+ removal in renal failure with oliguria/anuria or refractory hyperkalemia. Furosemide is unreliable and likely ineffective in this setting.',
      },
    ];

    return {
      scenarioNumber: 5,
      label: 'Scenario 5 — Hyperkalemia with Renal Failure',
      description: 'Renal failure or oliguria/anuria present — medical therapy alone is unlikely to be sufficient.',
      urgency: 'high',
      immediateActions: [
        'Urgent nephrology consultation — dialysis may be required.',
        'Attach cardiac monitor and obtain 12-lead ECG now.',
        'Stop ALL potassium sources immediately.',
        'Begin temporizing medical measures while arranging nephrology review.',
        'Monitor strict urine output.',
        'If ECG changes develop — escalate to Scenario 3 and give calcium immediately.',
      ],
      medications: meds,
      monitoring: [
        'Continuous cardiac monitoring.',
        'Repeat K+ every 1–2 h and after each intervention.',
        'Blood glucose every 30 min if insulin/dextrose given.',
        'Strict urine output charting.',
        'Repeat ECG with each K+ recheck.',
      ],
      finalDecision: [
        'PICU / nephrology-led admission.',
        'Prepare for renal replacement therapy if K+ not responding or persistently ≥ 6.0 with oliguria.',
        'Do not discharge until K+ is safe, cause identified, and renal management plan established.',
      ],
    };
  }

  // ── Scenario 2: Moderate — K 6.0–6.4, stable, no ECG changes ────────────────
  if (potassium >= 6.0) {
    const meds: DrugDose[] = [
      {
        drugName: 'Regular Insulin + Dextrose (if persistent or high-risk)',
        dose: weight > 0
          ? `Insulin 0.1 units/kg IV = ${ins} + D10W ${d10} OR D25W ${d25}.`
          : 'Insulin 0.1 units/kg IV + D10W 5 mL/kg OR D25W 2 mL/kg.',
        notes: 'Consider if K+ persists ≥ 6.0 or patient is high-risk. Monitor glucose every 30 min.',
      },
      {
        drugName: 'Salbutamol nebulized (adjunct)',
        dose: '2.5–5 mg nebulized (smaller child); 10 mg nebulized (larger child/adolescent).',
        notes: 'Adjunct K+ shift alongside insulin/dextrose. Watch tachycardia.',
      },
      {
        drugName: 'Furosemide (if urine output adequate)',
        dose: weight > 0
          ? `1–2 mg/kg IV = ${fuMin}–${fuMax} IV.`
          : '1–2 mg/kg IV.',
        notes: 'K+ removal via urine — only if good urine output and renal function. Not useful if oliguria.',
      },
    ];

    return {
      scenarioNumber: 2,
      label: 'Scenario 2 — Moderate Hyperkalemia, Clinically Stable',
      description: 'K+ 6.0–6.4 mEq/L without ECG changes or symptoms. Requires urgent monitoring and active management.',
      urgency: 'high',
      immediateActions: [
        'Attach continuous cardiac monitor and obtain 12-lead ECG immediately.',
        'Confirm potassium with repeat sample (particularly if sample quality is uncertain).',
        'Stop all potassium sources: K-containing fluids, supplements, and K+-raising medications.',
        'Check glucose, creatinine, blood gas, calcium, and urine output.',
        ...(data.hasAcidosis ? ['Address metabolic acidosis — acidosis worsens hyperkalemia.'] : []),
        'If K+ is rising, renal failure develops, or ECG becomes abnormal — escalate to Scenario 3 immediately.',
      ],
      medications: meds,
      monitoring: [
        'Continuous cardiac monitoring.',
        'Repeat K+ every 1–2 h until stable and clearly improving.',
        'Blood glucose every 30 min if insulin/dextrose given.',
        'Urine output monitoring.',
        'Repeat ECG if any change in clinical status.',
      ],
      finalDecision: [
        'Admit to monitored setting or observe in ED with continuous cardiac monitoring.',
        'Do not discharge until K+ is improving, ECG is normal, cause is identified and addressed.',
        'Discuss with senior clinician if K+ not improving or any deterioration.',
      ],
    };
  }

  // ── Scenario 1: Mild — K 5.5–5.9, asymptomatic, no ECG changes ─────────────
  if (potassium >= 5.5) {
    return {
      scenarioNumber: 1,
      label: 'Scenario 1 — Mild Hyperkalemia, Asymptomatic',
      description: 'K+ 5.5–5.9 mEq/L with no ECG changes and no symptoms. Focus on confirming result and addressing cause.',
      urgency: 'low',
      immediateActions: [
        data.sampleHemolyzed
          ? 'Repeat potassium urgently — sample may be hemolyzed and result may be falsely elevated.'
          : 'Confirm potassium with repeat sample if result is unexpected.',
        'Stop all potassium sources: K-containing fluids, supplements, and K+-raising medications.',
        'Assess renal function, medications, dietary potassium intake, and acid-base status.',
        'Obtain 12-lead ECG if not already done.',
        'No emergency calcium, insulin, or salbutamol required at this stage if ECG is normal and child is well.',
      ],
      medications: null,
      monitoring: [
        'Repeat potassium in 2–4 h or sooner if clinical concern.',
        'Obtain or repeat ECG if any new symptoms or K+ rises.',
        'Monitor urine output and renal function.',
      ],
      finalDecision: [
        'May be managed with observation or outpatient follow-up if: child is well, ECG is normal, repeat K+ is stable or improving, and no renal failure or high-risk cause identified.',
        'Re-evaluate immediately if K+ rises above 6.0 or any symptoms/ECG changes develop.',
      ],
    };
  }

  // K+ below hyperkalemic range
  return {
    scenarioNumber: null,
    label: 'Potassium Not in Hyperkalemic Range',
    description:
      'Serum potassium is below the hyperkalemic threshold. Continue clinical assessment if symptoms or ECG findings suggest otherwise.',
    urgency: 'low',
    immediateActions: ['Continue clinical assessment. Re-check potassium if symptoms or ECG concern is present.'],
    medications: null,
    monitoring: ['Standard clinical monitoring as per clinical presentation.'],
    finalDecision: ['Manage as per underlying clinical presentation.'],
  };
}

// ─── Protocol Definition (unchanged medical logic) ───────────────────────────

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
      title: 'Royal Children\u2019s Hospital Melbourne: Clinical Practice Guideline \u2014 Hyperkalaemia',
      url: 'https://www.rch.org.au/clinicalguide/guideline_index/hyperkalaemia/',
    },
    {
      title: 'NHSGGC: Hyperkalaemia Emergency Management \u2014 Paediatric Intensive Care Unit',
      url: 'https://rightdecisions.scot.nhs.uk/ggc-clinical-guidelines/paediatrics/intensive-and-critical-care-paediatric/hyperkalaemia-emergency-management-paediatric-intensive-care-unit-387/',
    },
    {
      title: 'Children\u2019s Health Queensland: Hyperkalaemia \u2014 Emergency Management in Children',
      url: 'https://www.childrens.health.qld.gov.au/__data/assets/pdf_file/0017/180206/af2e5e382600d8b7ef80587e718f4e2d3d5d4b1d.pdf',
    },
    {
      title: 'Starship Children\u2019s Health: Hyperkalaemia in Children',
      url: 'https://www.starship.org.nz/guidelines/hyperkalemia-in-children/',
    },
  ],
};
