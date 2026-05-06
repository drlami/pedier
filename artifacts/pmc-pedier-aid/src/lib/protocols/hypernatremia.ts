import type { DiseaseProtocol, FormData, Severity } from './types';

/*
  Pediatric Hypernatremia Protocol - Scenario Oriented

  Core safety:
  - If shock: restore circulation first with 0.9% saline boluses.
  - Chronic or unknown duration: Na correction should not exceed 0.5 mEq/L/hr
    or about 10–12 mEq/L/day.
  - Moderate/severe hypernatremia requires admission and serial sodium checks.
*/

const round = (n: number): number => Math.round(n);

const calculateMaintenanceRate = (weight: number): number => {
  if (!weight || weight <= 0) return 0;

  let daily = 0;

  if (weight <= 10) {
    daily = 100 * weight;
  } else if (weight <= 20) {
    daily = 1000 + 50 * (weight - 10);
  } else {
    daily = 1500 + 20 * (weight - 20);
  }

  return daily / 24;
};

const getTBWFactor = (ageGroup: string): number => {
  if (ageGroup === 'Infant < 1 year') return 0.7;
  if (ageGroup === 'Adolescent') return 0.5;
  return 0.6;
};

const calculateCorrectionHours = (sodium: number, isAcute: boolean): number => {
  if (!sodium || sodium <= 145) return 0;

  if (isAcute) {
    return 24;
  }

  const sodiumToCorrect = sodium - 145;
  const daysNeeded = Math.ceil(sodiumToCorrect / 10);

  return Math.max(daysNeeded * 24, 48);
};

const calculateHypernatremiaPlan = (
  weight: number,
  sodium: number,
  ageGroup: string,
  isAcute: boolean
) => {
  const tbwFactor = getTBWFactor(ageGroup);
  const correctionHours = calculateCorrectionHours(sodium, isAcute);
  const maintenanceRate = calculateMaintenanceRate(weight);

  if (!weight || weight <= 0 || !sodium || sodium <= 145 || correctionHours === 0) {
    return {
      tbwFactor,
      correctionHours,
      deficitML: 0,
      maintenanceRate: round(maintenanceRate),
      deficitRate: 0,
      totalRate: round(maintenanceRate),
      correctionDays: 0,
      shockBolus10: weight > 0 ? round(weight * 10) : 0,
      shockBolus20: weight > 0 ? round(weight * 20) : 0,
    };
  }

  const deficitL = tbwFactor * weight * ((sodium / 140) - 1);
  const deficitML = deficitL * 1000;
  const deficitRate = deficitML / correctionHours;
  const totalRate = maintenanceRate + deficitRate;

  return {
    tbwFactor,
    correctionHours,
    deficitML: round(deficitML),
    maintenanceRate: round(maintenanceRate),
    deficitRate: round(deficitRate),
    totalRate: round(totalRate),
    correctionDays: Math.round((correctionHours / 24) * 10) / 10,
    shockBolus10: round(weight * 10),
    shockBolus20: round(weight * 20),
  };
};

const classifyScenario = (data: FormData): string => {
  const sodium = Number(data.sodiumLevel);
  const volumeStatus = String(data.volumeStatus || '');
  const hasShock = Boolean(data.hasShock);
  const hasSevereSymptoms = Boolean(data.hasSevereSymptoms);
  const hasPolyuria = Boolean(data.hasPolyuria);

  if (!sodium || sodium <= 145) return 'No significant hypernatremia';
  if (hasShock) return 'Hypovolemic hypernatremia with shock';
  if (volumeStatus === 'Hypervolemic') return 'Hypervolemic hypernatremia / sodium overload';
  if (hasSevereSymptoms || sodium >= 170) return 'Severe symptomatic hypernatremia';
  if (sodium >= 160) return 'Severe hypernatremia';
  if (hasPolyuria && volumeStatus === 'Euvolemic') return 'Euvolemic hypernatremia - suspected diabetes insipidus';
  if (sodium >= 150) return 'Moderate hypernatremia';
  return 'Mild hypernatremia';
};

const getSuggestedFluid = (
  sodium: number,
  volumeStatus: string,
  hasShock: boolean
): string => {
  if (hasShock) {
    return 'Start with 0.9% normal saline bolus for shock. After perfusion improves, start controlled correction fluid.';
  }

  if (volumeStatus === 'Hypervolemic') {
    return 'Avoid routine saline. Consider free water replacement plus diuretic/renal support depending on cause. Discuss urgently with senior/PICU/nephrology.';
  }

  if (volumeStatus === 'Euvolemic') {
    return 'Usually free water replacement using enteral water if safe, D5W, or D5 + 0.45% NaCl depending on sodium trend and clinical setting.';
  }

  if (sodium >= 160) {
    return 'After circulation is restored: commonly D5 + 0.45% NaCl or D5 + 0.2% NaCl, adjusted by serial sodium trend.';
  }

  if (sodium >= 150) {
    return 'Usually D5 + 0.45% NaCl if IV correction is needed. Enteral/oral correction may be considered only if stable and tolerating.';
  }

  if (sodium > 145) {
    return 'Oral or enteral rehydration is preferred if stable, alert, not vomiting persistently, and reliable follow-up is available.';
  }

  return 'No hypernatremia correction fluid required.';
};

const getCorrectionTargetText = (sodium: number, isAcute: boolean): string => {
  if (!sodium || sodium <= 145) return 'No correction target needed.';

  if (isAcute) {
    return 'Acute hypernatremia <48 hours: may be corrected faster than chronic cases, but only with senior/PICU supervision.';
  }

  const hours = calculateCorrectionHours(sodium, false);

  return `Chronic or unknown duration: target sodium fall ≤0.5 mEq/L/hr and usually ≤10–12 mEq/L/day. Estimated correction duration: about ${hours} hours.`;
};

export const hypernatremiaProtocol: DiseaseProtocol = {
  id: 'hypernatremia',
  name: 'Hypernatremia',
  system: 'Electrolyte Disturbances',

  description:
    'Scenario-oriented pediatric hypernatremia calculator. It classifies the child by sodium level, volume status, shock, neurologic symptoms, acute/chronic duration, polyuria/DI risk, and ongoing losses, then gives targeted management.',

  image: {
    url: 'https://picsum.photos/seed/hypernatremia/600/400',
    hint: 'dehydration child',
  },

  questions: [
    {
      id: 'weight',
      questionText: 'Patient Weight',
      type: 'number',
      unit: 'kg',
    },
    {
      id: 'sodiumLevel',
      questionText: 'Serum Sodium Na+',
      type: 'number',
      unit: 'mEq/L',
      info: 'Enter measured serum sodium in mEq/L.',
    },
    {
      id: 'ageGroup',
      questionText: 'Age Group',
      type: 'select',
      options: [
        { label: 'Infant < 1 year', value: 'Infant < 1 year' },
        { label: 'Child 1–12 years', value: 'Child 1–12 years' },
        { label: 'Adolescent', value: 'Adolescent' },
      ],
    },
    {
      id: 'volumeStatus',
      questionText: 'Clinical Volume Status',
      type: 'select',
      options: [
        { label: 'Hypovolemic', value: 'Hypovolemic' },
        { label: 'Euvolemic', value: 'Euvolemic' },
        { label: 'Hypervolemic', value: 'Hypervolemic' },
      ],
      info: 'Hypovolemic: dehydration/shock. Euvolemic: consider diabetes insipidus. Hypervolemic: sodium overload or iatrogenic sodium gain.',
    },
    {
      id: 'hasShock',
      questionText: 'Is the child in shock or poor perfusion?',
      type: 'boolean',
      info: 'Cold extremities, weak pulses, delayed capillary refill, hypotension, lethargy, or poor peripheral perfusion.',
    },
    {
      id: 'hasSevereSymptoms',
      questionText: 'Are there severe neurologic symptoms?',
      type: 'boolean',
      info: 'Seizure, coma, marked altered mental status, severe irritability, abnormal movements, or signs of cerebral dysfunction.',
    },
    {
      id: 'isAcute',
      questionText: 'Did hypernatremia develop acutely <48 hours?',
      type: 'boolean',
      info: 'If uncertain, treat as chronic or unknown duration and correct slowly.',
    },
    {
      id: 'hasPolyuria',
      questionText: 'Is there polyuria or persistent high urine output?',
      type: 'boolean',
      info: 'Consider diabetes insipidus if hypernatremia persists with high urine output and dilute urine.',
    },
    {
      id: 'hasOngoingLosses',
      questionText: 'Are there ongoing losses?',
      type: 'boolean',
      info: 'Diarrhea, vomiting, fever, burns, excessive sweating, or high stoma output.',
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const sodium = Number(data.sodiumLevel);
    const hasShock = Boolean(data.hasShock);
    const hasSevereSymptoms = Boolean(data.hasSevereSymptoms);
    const volumeStatus = String(data.volumeStatus || '');

    const scenario = classifyScenario(data);

    if (!sodium || sodium <= 145) {
      return {
        level: 'unknown',
        details: [
          'No significant hypernatremia entered.',
          'Recheck serum sodium and clinical status.',
        ],
      };
    }

    if (
      hasShock ||
      hasSevereSymptoms ||
      sodium >= 160 ||
      volumeStatus === 'Hypervolemic'
    ) {
      return {
        level: 'severe',
        details: [
          `Scenario: ${scenario}.`,
          'High-risk hypernatremia requiring urgent senior review and controlled correction.',
        ],
      };
    }

    if (sodium >= 150) {
      return {
        level: 'moderate',
        details: [
          `Scenario: ${scenario}.`,
          'Moderate hypernatremia requiring careful correction and repeat sodium monitoring.',
        ],
      };
    }

    return {
      level: 'unknown',
      details: [
        `Scenario: ${scenario}.`,
        'Mild hypernatremia. Oral/enteral correction may be enough if clinically stable.',
      ],
    };
  },

  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel) || 0;
    const ageGroup = String(data.ageGroup || 'Child 1–12 years');
    const volumeStatus = String(data.volumeStatus || 'Hypovolemic');
    const hasShock = Boolean(data.hasShock);
    const hasSevereSymptoms = Boolean(data.hasSevereSymptoms);
    const isAcute = Boolean(data.isAcute);
    const hasPolyuria = Boolean(data.hasPolyuria);
    const hasOngoingLosses = Boolean(data.hasOngoingLosses);

    const scenario = classifyScenario(data);
    const plan = calculateHypernatremiaPlan(weight, sodium, ageGroup, isAcute);
    const suggestedFluid = getSuggestedFluid(sodium, volumeStatus, hasShock);
    const correctionTarget = getCorrectionTargetText(sodium, isAcute);

    const management = [];

    management.push({
      title: 'Scenario Result',
      recommendations: [
        `Scenario: ${scenario}.`,
        `Severity level: ${severity.level}.`,
        sodium > 145
          ? `Serum sodium: ${sodium} mEq/L.`
          : 'No significant hypernatremia entered.',
        volumeStatus ? `Volume status: ${volumeStatus}.` : 'Volume status not selected.',
        isAcute
          ? 'Duration: reported acute <48 hours.'
          : 'Duration: chronic or unknown, so slow correction is safest.',
      ],
    });

    if (!sodium || sodium <= 145) {
      management.push({
        title: 'No Hypernatremia Management Needed',
        recommendations: [
          'No hypernatremia correction plan is generated because sodium is not >145 mEq/L.',
          'If the child is clinically unwell, reassess hydration, glucose, renal function, and repeat electrolytes.',
        ],
      });

      return management;
    }

    if (hasShock) {
      management.push({
        title: 'Immediate Priority: Shock Resuscitation',
        recommendations: [
          'This is the first priority before free-water correction.',
          `Give 0.9% normal saline ${plan.shockBolus10}–${plan.shockBolus20} mL IV bolus, equal to 10–20 mL/kg.`,
          'Reassess perfusion after each bolus: heart rate, pulses, capillary refill, blood pressure, mental status, urine output.',
          'Repeat bolus only if shock or poor perfusion persists.',
          'Do not start hypotonic correction fluid before circulation is restored.',
        ],
      });
    }

    if (volumeStatus === 'Hypervolemic') {
      management.push({
        title: 'Hypervolemic Hypernatremia / Sodium Overload',
        recommendations: [
          'Likely sodium gain rather than pure water loss.',
          'Look for hypertonic saline, sodium bicarbonate, salt poisoning, incorrect fluid, renal impairment, or iatrogenic sodium load.',
          'Avoid routine saline-based correction unless there is shock.',
          'Discuss urgently with senior pediatrician/PICU/nephrology.',
          'Treatment usually requires controlled free water replacement, possible diuretic support, and careful sodium monitoring.',
        ],
      });
    }

    if (hasSevereSymptoms) {
      management.push({
        title: 'Severe Neurologic Symptoms',
        recommendations: [
          'Treat seizure, coma, or severe altered mental status as emergency.',
          'Check bedside glucose immediately.',
          'Manage airway, breathing, circulation, and seizure control according to local pediatric emergency protocol.',
          'Do not rapidly overcorrect chronic or unknown-duration hypernatremia because of risk of cerebral edema.',
          'Urgent senior/PICU review is recommended.',
        ],
      });
    }

    if (!hasShock && volumeStatus !== 'Hypervolemic') {
      if (sodium >= 160) {
        management.push({
          title: 'Severe Hypernatremia Correction Plan',
          recommendations: [
            'Admit urgently. PICU or high-dependency care is preferred if available.',
            correctionTarget,
            `Calculated free water deficit: approximately ${plan.deficitML} mL.`,
            `TBW factor used: ${plan.tbwFactor}.`,
            `Estimated correction duration: ${plan.correctionHours} hours, approximately ${plan.correctionDays} day(s).`,
            `Maintenance rate: approximately ${plan.maintenanceRate} mL/hr.`,
            `Deficit replacement rate: approximately ${plan.deficitRate} mL/hr.`,
            `Initial estimated total rate: approximately ${plan.totalRate} mL/hr.`,
            `Suggested fluid: ${suggestedFluid}`,
            'This is an initial estimate only. Adjust according to sodium trend every 2–4 hours.',
          ],
        });
      } else if (sodium >= 150) {
        management.push({
          title: 'Moderate Hypernatremia Correction Plan',
          recommendations: [
            'Usually admit to pediatric ward for controlled correction and serial sodium monitoring.',
            correctionTarget,
            `Calculated free water deficit: approximately ${plan.deficitML} mL.`,
            `Estimated correction duration: ${plan.correctionHours} hours.`,
            `Maintenance rate: approximately ${plan.maintenanceRate} mL/hr.`,
            `Deficit replacement rate: approximately ${plan.deficitRate} mL/hr.`,
            `Initial estimated total rate: approximately ${plan.totalRate} mL/hr.`,
            `Suggested fluid: ${suggestedFluid}`,
            'If clinically stable and able to tolerate enteral fluids, discuss whether enteral correction is appropriate.',
          ],
        });
      } else {
        management.push({
          title: 'Mild Hypernatremia Plan',
          recommendations: [
            'Mild hypernatremia may be managed with oral or enteral fluids if the child is alert, stable, and tolerating intake.',
            'Use ORS or appropriate enteral fluid depending on clinical context.',
            'Repeat sodium if symptoms persist, dehydration is significant, or follow-up reliability is uncertain.',
            'Admit if young infant, poor intake, persistent vomiting, unreliable follow-up, abnormal neurologic status, or worsening sodium.',
          ],
        });
      }
    }

    if (hasPolyuria || volumeStatus === 'Euvolemic') {
      management.push({
        title: 'Polyuria / Suspected Diabetes Insipidus Scenario',
        recommendations: [
          'Consider diabetes insipidus if hypernatremia persists with high urine output and dilute urine.',
          'Check urine specific gravity, urine osmolality, serum osmolality, glucose, urea, creatinine, calcium, and potassium.',
          'Strict input/output charting is essential.',
          'Avoid empiric desmopressin unless diagnosis is clear or after senior/endocrine/PICU discussion.',
          'If urine output is very high, replace ongoing urinary losses carefully while monitoring sodium trend.',
        ],
      });
    }

    if (hasOngoingLosses) {
      management.push({
        title: 'Ongoing Losses Scenario',
        recommendations: [
          'Ongoing losses must be replaced in addition to maintenance and calculated deficit.',
          'Examples: diarrhea, vomiting, fever, burns, excessive sweating, or high stoma output.',
          'If sodium is not falling as expected, ongoing water loss may be exceeding the calculated replacement.',
          'Reassess stool/vomit/stoma losses, urine output, and fluid balance frequently.',
          'Fluid type for replacement depends on the source and electrolyte composition of the loss.',
        ],
      });
    }

    management.push({
      title: 'Monitoring',
      recommendations: [
        'Check serum sodium every 2–4 hours initially in moderate/severe cases.',
        'Monitor glucose, potassium, chloride, bicarbonate, urea, creatinine, calcium, and osmolality if available.',
        'Strict input/output charting and daily or more frequent weight are important.',
        'Monitor neurologic status and signs of cerebral edema.',
        'If sodium falls too fast: reduce free water delivery or increase sodium concentration of fluid.',
        'If sodium does not fall: reassess ongoing losses, calculation, renal function, and diabetes insipidus.',
        'Add potassium only after urine output is established and serum potassium is known.',
      ],
    });

    management.push({
      title: 'Final Decision',
      recommendations: [
        hasShock || hasSevereSymptoms || sodium >= 160 || volumeStatus === 'Hypervolemic'
          ? 'Final decision: high-risk hypernatremia. Admit urgently and consider PICU/high-dependency care.'
          : sodium >= 150
          ? 'Final decision: moderate hypernatremia. Admit for controlled correction and serial sodium monitoring.'
          : hasPolyuria
          ? 'Final decision: mild hypernatremia but polyuria/DI concern. Senior review and possible admission are recommended.'
          : 'Final decision: mild stable hypernatremia. Oral/enteral fluids may be considered if stable, tolerating intake, and reliable follow-up is available.',
      ],
    });

    return management;
  },

  getDisposition: (severity, data) => {
    const sodium = Number(data.sodiumLevel);
    const hasShock = Boolean(data.hasShock);
    const hasSevereSymptoms = Boolean(data.hasSevereSymptoms);
    const hasPolyuria = Boolean(data.hasPolyuria);
    const volumeStatus = String(data.volumeStatus || '');

    if (!sodium || sodium <= 145) {
      return ['No hypernatremia disposition required based on entered sodium.'];
    }

    if (
      hasShock ||
      hasSevereSymptoms ||
      sodium >= 160 ||
      volumeStatus === 'Hypervolemic' ||
      severity.level === 'severe'
    ) {
      return [
        'Admit urgently.',
        'PICU or high-dependency care is recommended for shock, neurologic symptoms, Na ≥160 mEq/L, hypervolemic sodium overload, rapid sodium change, or need for frequent monitoring.',
      ];
    }

    if (sodium >= 150 || severity.level === 'moderate') {
      return [
        'Admit to pediatric ward for controlled correction and serial sodium monitoring.',
        'Consider PICU if sodium is rising, monitoring cannot be done frequently, or neurologic concerns appear.',
      ];
    }

    if (hasPolyuria) {
      return [
        'Consider admission or urgent senior review because persistent polyuria may indicate diabetes insipidus.',
      ];
    }

    return [
      'Mild, asymptomatic hypernatremia may be managed with oral or enteral fluids if clinically stable, tolerating intake, and reliable follow-up is available.',
      'Repeat serum sodium should be arranged if outpatient management is chosen.',
    ];
  },

  getRedFlags: () => [
    'Seizure, coma, altered mental status, or severe irritability.',
    'Shock or poor perfusion.',
    'Serum sodium ≥160 mEq/L.',
    'Serum sodium ≥170 mEq/L: very high risk, usually PICU-level care.',
    'Rapidly rising sodium.',
    'Sodium falling faster than 0.5 mEq/L/hr in chronic or unknown-duration hypernatremia.',
    'Polyuria or very dilute urine: suspect diabetes insipidus.',
    'Neonate or young infant with poor feeding, excessive weight loss, or breastfeeding failure.',
    'Renal impairment or oliguria.',
    'Hypervolemia or suspected sodium overload.',
  ],

  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel) || 0;
    const ageGroup = String(data.ageGroup || 'Child 1–12 years');
    const volumeStatus = String(data.volumeStatus || 'Hypovolemic');
    const hasShock = Boolean(data.hasShock);
    const isAcute = Boolean(data.isAcute);

    const plan = calculateHypernatremiaPlan(weight, sodium, ageGroup, isAcute);
    const suggestedFluid = getSuggestedFluid(sodium, volumeStatus, hasShock);

    return [
      {
        drugName: 'Shock Bolus',
        dose:
          weight > 0
            ? `0.9% Normal Saline ${plan.shockBolus10}–${plan.shockBolus20} mL IV`
            : '0.9% Normal Saline 10–20 mL/kg IV',
        notes:
          'Use only if shock or poor perfusion. Restore circulation before controlled sodium correction.',
      },
      {
        drugName: 'Free Water Deficit',
        dose: 'TBW × weight × [(Na / 140) - 1]',
        notes:
          weight > 0 && sodium > 145
            ? `TBW factor used: ${plan.tbwFactor}. Calculated deficit: ${plan.deficitML} mL.`
            : 'Enter weight and sodium >145 mEq/L to calculate.',
      },
      {
        drugName: 'Correction Duration',
        dose:
          sodium > 145
            ? `${plan.correctionHours} hours`
            : 'Enter sodium >145 mEq/L',
        notes:
          sodium > 145
            ? `Estimated duration: approximately ${plan.correctionDays} day(s).`
            : 'No correction duration calculated.',
      },
      {
        drugName: 'Maintenance Fluid Rate',
        dose:
          weight > 0
            ? `${plan.maintenanceRate} mL/hr`
            : 'Enter weight to calculate',
        notes: 'Calculated using Holiday-Segar method.',
      },
      {
        drugName: 'Deficit Replacement Rate',
        dose:
          weight > 0 && sodium > 145
            ? `${plan.deficitRate} mL/hr`
            : 'Enter weight and sodium to calculate',
        notes: 'Replace deficit over the calculated correction duration.',
      },
      {
        drugName: 'Estimated Total IV Rate',
        dose:
          weight > 0 && sodium > 145
            ? `${plan.totalRate} mL/hr`
            : 'Enter weight and sodium to calculate',
        notes:
          'Initial estimate = maintenance + deficit replacement. Adjust according to serial sodium.',
      },
      {
        drugName: 'Suggested Fluid',
        dose: suggestedFluid,
        notes:
          'Fluid choice must be adjusted according to volume status, sodium trend, urine output, and senior review.',
      },
      {
        drugName: 'Safe Correction Target',
        dose: isAcute
          ? 'Acute <48h: faster correction only with senior/PICU supervision'
          : 'Chronic/unknown: ≤0.5 mEq/L/hr, usually ≤10–12 mEq/L/day',
        notes: isAcute
          ? 'If duration is uncertain, treat as chronic.'
          : 'Slow correction reduces risk of cerebral edema.',
      },
    ];
  },

  getReferences: () => [
    {
      title: 'Royal Children’s Hospital Melbourne: Hypernatraemia Guideline',
      url: 'https://www.rch.org.au/clinicalguide/guideline_index/Hypernatraemia/',
    },
    {
      title: 'MSD Manual Professional: Hypernatremia',
      url: 'https://www.msdmanuals.com/professional/nephrology/electrolyte-disorders/hypernatremia',
    },
    {
      title: 'MSD Manual Professional: Neonatal Hypernatremia',
      url: 'https://www.msdmanuals.com/professional/pediatrics/metabolic-electrolyte-and-toxic-disorders-in-neonates/neonatal-hypernatremia',
    },
  ],
};
