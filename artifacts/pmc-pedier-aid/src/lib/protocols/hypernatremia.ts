import type { DiseaseProtocol, FormData, Severity } from './types';

/*
  Pediatric Hypernatremia Protocol
  Sodium unit: mEq/L

  Main safety rule:
  - Chronic or unknown duration: correct Na by ≤0.5 mEq/L/hour
  - Maximum fall: about 10–12 mEq/L/day
  - Very high Na needs longer correction time
*/

const calculateCorrectionHours = (sodium: number, isAcute: boolean): number => {
  if (!sodium || sodium <= 145) return 0;

  // Acute hypernatremia <48h may be corrected faster,
  // but only with senior/PICU supervision.
  if (isAcute) return 24;

  // Chronic or unknown duration:
  // Aim to bring Na gradually toward 145 mEq/L.
  // Use about 10 mEq/L/day as a safe target.
  const sodiumToCorrect = sodium - 145;
  const daysNeeded = Math.ceil(sodiumToCorrect / 10);

  // Minimum 48 hours for clinically significant hypernatremia.
  return Math.max(daysNeeded * 24, 48);
};

const calculateHypernatremiaFluids = (
  weight: number,
  sodium: number,
  ageGroup: string,
  isAcute: boolean
): {
  deficit: number;
  maintenanceRate: number;
  deficitRate: number;
  totalRate: number;
  tbwFactor: number;
  correctionHours: number;
} => {
  const correctionHours = calculateCorrectionHours(sodium, isAcute);

  if (!weight || weight <= 0 || !sodium || sodium <= 145 || correctionHours === 0) {
    return {
      deficit: 0,
      maintenanceRate: 0,
      deficitRate: 0,
      totalRate: 0,
      tbwFactor: 0.6,
      correctionHours,
    };
  }

  // Pediatric total body water factor
  let tbwFactor = 0.6;

  if (ageGroup === 'Infant < 1 year') {
    tbwFactor = 0.7;
  }

  if (ageGroup === 'Adolescent') {
    tbwFactor = 0.5;
  }

  // Holiday-Segar maintenance fluid calculation
  let dailyMaintenance = 0;

  if (weight <= 10) {
    dailyMaintenance = 100 * weight;
  } else if (weight <= 20) {
    dailyMaintenance = 1000 + 50 * (weight - 10);
  } else {
    dailyMaintenance = 1500 + 20 * (weight - 20);
  }

  const maintenanceRate = dailyMaintenance / 24;

  // Free water deficit
  // Unit: mL
  // Formula: TBW × weight × [(Na / 140) - 1]
  const deficitL = tbwFactor * weight * ((sodium / 140) - 1);
  const deficitML = deficitL * 1000;

  const deficitRate = deficitML / correctionHours;
  const totalRate = maintenanceRate + deficitRate;

  return {
    deficit: Math.round(deficitML),
    maintenanceRate: Math.round(maintenanceRate),
    deficitRate: Math.round(deficitRate),
    totalRate: Math.round(totalRate),
    tbwFactor,
    correctionHours,
  };
};

const getRecommendedFluid = (sodium: number, volumeStatus: string): string => {
  if (volumeStatus === 'Hypervolemic') {
    return 'Hypervolemic hypernatremia: needs senior/PICU review. Usually free water replacement ± diuretics depending on cause. Avoid routine saline correction without specialist input.';
  }

  if (sodium >= 170) {
    return 'Na ≥170 mEq/L: PICU-level care recommended. Use carefully titrated hypotonic fluid such as D5W or D5 + 0.2% NaCl depending on sodium trend and volume status.';
  }

  if (sodium >= 160) {
    return 'Na 160–169 mEq/L: usually D5 + 0.2% NaCl after circulation is restored. Add KCl only after urine output is confirmed and potassium is known.';
  }

  if (sodium >= 150) {
    return 'Na 150–159 mEq/L: usually D5 + 0.45% NaCl. Add KCl only after urine output is confirmed and potassium is known.';
  }

  if (sodium > 145) {
    return 'Na 146–149 mEq/L: oral or enteral fluids are preferred if the child is stable and tolerating intake.';
  }

  return 'No hypernatremia correction fluid required.';
};

const getCorrectionTarget = (sodium: number, isAcute: boolean): string => {
  if (isAcute) {
    return 'Acute hypernatremia <48 hours: may correct faster, around 1–2 mEq/L/hour, but only with senior/PICU supervision.';
  }

  const hours = calculateCorrectionHours(sodium, false);
  const days = Math.round(hours / 24);

  return `Chronic or unknown duration: correct slowly, ≤0.5 mEq/L/hour and usually ≤10–12 mEq/L/day. Estimated correction duration: about ${hours} hours, approximately ${days} day(s).`;
};

export const hypernatremiaProtocol: DiseaseProtocol = {
  id: 'hypernatremia',
  name: 'Hypernatremia',
  system: 'Electrolyte Disturbances',

  description:
    'Pediatric-oriented management of hypernatremia using weight, serum sodium in mEq/L, age group, symptoms, volume status, and safe correction duration.',

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
      info: 'Enter serum sodium in mEq/L.',
    },
    {
      id: 'ageGroup',
      questionText: 'Age Group',
      type: 'radio',
      options: ['Infant < 1 year', 'Child 1–12 years', 'Adolescent'],
    },
    {
      id: 'volumeStatus',
      questionText: 'Clinical Volume Status',
      type: 'radio',
      options: ['Hypovolemic', 'Euvolemic', 'Hypervolemic'],
      info: 'Hypovolemic: dehydration or shock. Euvolemic: consider diabetes insipidus. Hypervolemic: sodium overload, renal failure, or iatrogenic sodium load.',
    },
    {
      id: 'hasShock',
      questionText: 'Is the child in shock or poor perfusion?',
      type: 'boolean',
      info: 'Cold extremities, weak pulses, delayed capillary refill, hypotension, lethargy.',
    },
    {
      id: 'hasSevereSymptoms',
      questionText: 'Are there severe neurologic symptoms?',
      type: 'boolean',
      info: 'Seizure, coma, marked altered mental status, severe irritability, or abnormal movements.',
    },
    {
      id: 'isAcute',
      questionText: 'Did hypernatremia develop acutely <48 hours?',
      type: 'boolean',
      info: 'If unknown, treat as chronic and correct slowly.',
    },
    {
      id: 'hasPolyuria',
      questionText: 'Is there polyuria or persistent high urine output?',
      type: 'boolean',
      info: 'Consider diabetes insipidus if hypernatremia persists with dilute urine and polyuria.',
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
    const hasSevereSymptoms = Boolean(data.hasSevereSymptoms);
    const hasShock = Boolean(data.hasShock);

    if (!sodium || sodium <= 145) {
      return {
        level: 'unknown',
        details: ['No significant hypernatremia entered. Recheck sodium level and clinical status.'],
      };
    }

    if (hasShock || hasSevereSymptoms || sodium >= 160) {
      return {
        level: 'severe',
        details: [
          'Severe or high-risk hypernatremia.',
          'Requires urgent senior review, controlled correction, and frequent sodium monitoring.',
        ],
      };
    }

    if (sodium >= 150) {
      return {
        level: 'moderate',
        details: [
          'Moderate hypernatremia: Na 150–159 mEq/L.',
          'Requires careful fluid management and repeat sodium monitoring.',
        ],
      };
    }

    return {
      level: 'unknown',
      details: [
        'Mild hypernatremia: Na 146–149 mEq/L.',
        'May be managed orally if clinically stable, tolerating fluids, and reliable follow-up is available.',
      ],
    };
  },

  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel) || 0;
    const ageGroup = String(data.ageGroup || 'Child 1–12 years');
    const volumeStatus = String(data.volumeStatus || 'Hypovolemic');
    const isAcute = Boolean(data.isAcute);
    const hasShock = Boolean(data.hasShock);
    const hasPolyuria = Boolean(data.hasPolyuria);
    const hasOngoingLosses = Boolean(data.hasOngoingLosses);

    const {
      deficit,
      maintenanceRate,
      deficitRate,
      totalRate,
      tbwFactor,
      correctionHours,
    } = calculateHypernatremiaFluids(weight, sodium, ageGroup, isAcute);

    const correctionDays =
      correctionHours > 0 ? Math.round((correctionHours / 24) * 10) / 10 : 0;

    const recommendedFluid = getRecommendedFluid(sodium, volumeStatus);

    const management = [];

    management.push({
      title: '1) Immediate Safety Check',
      recommendations: [
        'Assess ABCs, mental status, perfusion, hydration severity, urine output, and weight.',
        'Check glucose immediately if altered mental status or seizure.',
        'If seizure is present, treat seizure urgently while also managing sodium safely.',
        'Do not rapidly correct chronic or unknown-duration hypernatremia.',
      ],
    });

    if (hasShock || volumeStatus === 'Hypovolemic') {
      management.push({
        title: '2) Resuscitation Phase',
        recommendations: [
          'If shock or poor perfusion: give 0.9% normal saline 10–20 mL/kg IV bolus.',
          'Repeat bolus only as needed until circulation and perfusion improve.',
          'Restore intravascular volume first before starting controlled sodium correction.',
          'Do not use hypotonic correction fluid before shock is corrected.',
        ],
      });
    }

    management.push({
      title: '3) Controlled Sodium Correction Plan',
      recommendations: [
        getCorrectionTarget(sodium, isAcute),
        `Serum sodium entered: ${sodium} mEq/L.`,
        `Free water deficit: approximately ${deficit} mL.`,
        `TBW factor used: ${tbwFactor}.`,
        `Estimated correction duration: ${correctionHours} hours, approximately ${correctionDays} day(s).`,
        `Maintenance rate: approximately ${maintenanceRate} mL/hr.`,
        `Deficit replacement rate: approximately ${deficitRate} mL/hr.`,
        `Estimated total IV rate: approximately ${totalRate} mL/hr.`,
        `Suggested correction fluid: ${recommendedFluid}`,
        'Add potassium only after urine output is established and serum potassium is known.',
        'This rate is only an initial estimate. Adjust according to serial sodium levels.',
      ],
    });

    management.push({
      title: '4) Monitoring and Recalculation',
      recommendations: [
        'Check serum sodium every 2–4 hours initially.',
        'Monitor glucose, potassium, chloride, bicarbonate, urea, creatinine, calcium, and serum osmolality if available.',
        'Strict input/output charting is essential.',
        'Monitor weight, urine output, neurologic status, and signs of cerebral edema.',
        'Recalculate free water deficit whenever sodium changes significantly.',
        'If sodium is falling too fast, reduce free water delivery or increase sodium concentration of IV fluid.',
        'If sodium is not falling, reassess ongoing losses, fluid calculation, renal function, and diabetes insipidus.',
      ],
    });

    if (hasPolyuria) {
      management.push({
        title: '5) Polyuria / Suspected Diabetes Insipidus',
        recommendations: [
          'Consider diabetes insipidus if hypernatremia persists with high urine output.',
          'Check urine osmolality and urine specific gravity.',
          'Check paired serum and urine osmolality if available.',
          'Discuss with senior pediatrician or endocrinology before desmopressin unless diagnosis is clear.',
        ],
      });
    }

    if (hasOngoingLosses) {
      management.push({
        title: '6) Ongoing Losses',
        recommendations: [
          'Replace ongoing losses in addition to maintenance and calculated deficit.',
          'Examples include diarrhea, vomiting, fever, burns, excessive sweating, or high stoma output.',
          'Fluid type for ongoing losses depends on source and electrolyte composition.',
          'Frequent reassessment is required because ongoing losses may prevent sodium from falling as expected.',
        ],
      });
    }

    management.push({
      title: '7) Pediatric Causes to Consider',
      recommendations: [
        'Gastroenteritis with inadequate free water intake.',
        'Incorrect formula preparation.',
        'Breastfeeding failure in neonates or young infants.',
        'Diabetes insipidus.',
        'Iatrogenic sodium load, hypertonic saline, sodium bicarbonate, or excessive salt intake.',
        'Renal disease or impaired urinary concentrating ability.',
      ],
    });

    return management;
  },

  getDisposition: (severity, data) => {
    const sodium = Number(data.sodiumLevel);
    const hasShock = Boolean(data.hasShock);
    const hasSevereSymptoms = Boolean(data.hasSevereSymptoms);
    const hasPolyuria = Boolean(data.hasPolyuria);

    if (hasShock || hasSevereSymptoms || sodium >= 160 || severity.level === 'severe') {
      return [
        'Admit urgently.',
        'PICU or high-dependency care is recommended for Na ≥160 mEq/L, neurologic symptoms, shock, seizures, coma, rapid sodium change, or need for frequent monitoring.',
      ];
    }

    if (sodium >= 150 || severity.level === 'moderate') {
      return [
        'Admit to pediatric ward for controlled correction and serial sodium monitoring.',
        'Consider PICU if sodium is rising, monitoring cannot be done frequently, or there are neurologic concerns.',
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
    'Signs of shock or poor perfusion.',
    'Serum sodium ≥160 mEq/L.',
    'Serum sodium ≥170 mEq/L: very high risk, usually PICU-level care.',
    'Rapidly rising sodium.',
    'Sodium falling faster than 0.5 mEq/L/hour in chronic or unknown-duration hypernatremia.',
    'Polyuria or very dilute urine: suspect diabetes insipidus.',
    'Neonate or young infant with poor feeding, weight loss, or breastfeeding failure.',
    'Renal impairment or oliguria.',
    'Hypervolemia or suspected sodium overload.',
  ],

  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel) || 0;
    const ageGroup = String(data.ageGroup || 'Child 1–12 years');
    const volumeStatus = String(data.volumeStatus || 'Hypovolemic');
    const isAcute = Boolean(data.isAcute);

    const {
      deficit,
      maintenanceRate,
      deficitRate,
      totalRate,
      tbwFactor,
      correctionHours,
    } = calculateHypernatremiaFluids(weight, sodium, ageGroup, isAcute);

    const recommendedFluid = getRecommendedFluid(sodium, volumeStatus);
    const correctionDays =
      correctionHours > 0 ? Math.round((correctionHours / 24) * 10) / 10 : 0;

    return [
      {
        drugName: 'Free Water Deficit',
        dose: 'TBW × weight × [(Na / 140) - 1]',
        notes:
          weight > 0 && sodium > 145
            ? `Sodium unit: mEq/L. TBW factor used: ${tbwFactor}. Calculated deficit: ${deficit} mL.`
            : 'Enter weight and sodium >145 mEq/L to calculate.',
      },
      {
        drugName: 'Correction Duration',
        dose: `${correctionHours} hours`,
        notes:
          sodium > 145
            ? `Estimated duration: approximately ${correctionDays} day(s). Higher sodium requires longer correction time.`
            : 'Enter sodium >145 mEq/L to calculate correction duration.',
      },
      {
        drugName: 'Maintenance Fluid Rate',
        dose: `${maintenanceRate} mL/hr`,
        notes:
          weight > 0
            ? 'Calculated using Holiday-Segar method.'
            : 'Enter weight to calculate maintenance.',
      },
      {
        drugName: 'Deficit Replacement Rate',
        dose: `${deficitRate} mL/hr`,
        notes:
          weight > 0 && sodium > 145
            ? `Deficit correction over ${correctionHours} hours.`
            : 'Enter weight and sodium to calculate.',
      },
      {
        drugName: 'Estimated Total IV Rate',
        dose: `${totalRate} mL/hr`,
        notes:
          weight > 0 && sodium > 145
            ? 'Initial estimate = maintenance + deficit replacement. Adjust based on serial sodium.'
            : 'Enter weight and sodium to calculate.',
      },
      {
        drugName: 'Suggested Correction Fluid',
        dose: recommendedFluid,
        notes:
          'Fluid choice must be adjusted according to sodium trend, volume status, urine output, and senior review.',
      },
      {
        drugName: 'Correction Target',
        dose: isAcute
          ? 'Acute: 1–2 mEq/L/hr only with senior/PICU supervision'
          : 'Chronic/unknown: ≤0.5 mEq/L/hr, usually ≤10–12 mEq/L/day',
        notes: isAcute
          ? 'Only if truly acute <48 hours. If uncertain, treat as chronic.'
          : 'Slow correction reduces risk of cerebral edema.',
      },
      {
        drugName: 'Shock Bolus',
        dose: '0.9% Normal Saline 10–20 mL/kg IV',
        notes:
          'Use only if shock or poor perfusion. Restore circulation before controlled sodium correction.',
      },
    ];
  },

  getReferences: () => [
    {
      title: 'Royal Children’s Hospital Melbourne: Hypernatraemia Guideline',
      url: 'https://www.rch.org.au/clinicalguide/guideline_index/Hypernatraemia/',
    },
    {
      title: 'MSD Manual Professional: Hypernatremia in Children',
      url: 'https://www.msdmanuals.com/professional/pediatrics/electrolyte-and-fluid-disorders-in-children/hypernatremia-in-children',
    },
    {
      title: 'Nelson Textbook of Pediatrics: Hypernatremia and Disorders of Water Balance',
      url: 'https://www.elsevier.com/books/nelson-textbook-of-pediatrics/9780323883054',
    },
  ],
};
