import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Severe DKA / cerebral edema (Master Management Pathway).
 * Built on ISPAD 2022 / BSPED principles. The "Fluid & Insulin" card embeds
 * the interactive PicuDkaCalculator (id: 'picu-dka-calc').
 */
export const picuSevereDkaProtocol: DiseaseProtocol = {
  id: 'picu-severe-dka',
  name: 'Severe DKA / cerebral edema',
  system: 'Renal, Fluids & Electrolytes',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Management of severe diabetic ketoacidosis — controlled rehydration, the two-bag system, potassium, insulin infusion, and recognition/treatment of cerebral edema.',
  image: { url: '', hint: '' },

  questions: [],

  mmpData: {
    snapshot:
      'Severe DKA kills through cerebral edema, hypokalemia, and the acidosis itself — and over-aggressive fluids are a driver of cerebral edema, so resuscitate deliberately, not aggressively. Sequence: restore circulation with a measured bolus, then replace deficit + maintenance SLOWLY over 48 h, add potassium early (insulin drives it intracellularly), and start insulin 1–2 h AFTER fluids at 0.05–0.1 units/kg/h with NO bolus. Watch the brain like a hawk in the first 12 h — headache, falling GCS, bradycardia with rising BP = cerebral edema until proven otherwise.',
    stages: [
      {
        label: 'Stage 1: Recognise & Resuscitate',
        shortLabel: 'Resuscitate',
        color: 'red',
        cards: [
          {
            title: 'Confirm DKA & assess severity',
            isCritical: true,
            orders: [
              'Diagnosis: hyperglycemia (> 11 mmol/L / 200 mg/dL) + ketosis/ketonuria + acidosis (pH < 7.3 or HCO₃ < 15).',
              'Severity by pH/HCO₃: mild (pH < 7.3), moderate (pH < 7.2), severe (pH < 7.1 or HCO₃ < 5).',
              'Send: glucose, VBG, U&E, ketones (β-hydroxybutyrate), calcium/magnesium/phosphate, osmolality; weigh the child.',
              'Identify precipitant (new diagnosis, infection, insulin omission); examine neuro status as a baseline.',
            ],
            nursing: [
              'Continuous cardiorespiratory + SpO₂ monitoring; ECG for T-waves (K⁺)',
              'Strict hourly fluid balance; urinary catheter if obtunded',
              'Baseline neuro obs (GCS + pupils) — repeat hourly',
            ],
            triggers: [
              'Shock (poor perfusion / hypotension)',
              'GCS reduced at presentation',
              'pH < 7.1 / HCO₃ < 5 (severe)',
            ],
          },
          {
            title: 'Initial fluid bolus',
            orders: [
              'If shocked: 10 mL/kg 0.9% saline over 30–60 min; reassess and repeat cautiously only if still shocked.',
              'Avoid rapid large-volume boluses in the non-shocked child — they contribute to cerebral edema.',
              'Then move to deliberate deficit + maintenance replacement over 48 h (next stage / calculator).',
            ],
            nursing: [
              'Reassess perfusion after each bolus',
              'Do not exceed cautious boluses without senior review',
            ],
            triggers: ['Persistent shock after 20 mL/kg → senior/PICU consultant'],
          },
        ],
      },
      {
        label: 'Stage 2: Fluids, Potassium & Insulin',
        shortLabel: 'Fluids + Insulin',
        color: 'blue',
        cards: [
          {
            title: 'Fluid, potassium & insulin calculator',
            calculator: { id: 'picu-dka-calc', title: 'DKA Fluid & Insulin Calculator' },
            orders: [
              'Replace deficit (5–10% by severity) + maintenance evenly over 48 h — use the calculator for the exact rate.',
              'Two-bag system (Bag 1 no dextrose, Bag 2 D10) titrated by glucose; add D10 once glucose < ~250–300 mg/dL (14–17 mmol/L).',
              'Potassium: add 40 mmol/L once urine output confirmed and K not high. If K < 3.0–3.3, give KCl and DELAY insulin until rising.',
              'Insulin: start 1–2 h AFTER fluids at 0.05–0.1 units/kg/h infusion, NO bolus. Prepare 50 units in 50 mL saline (1 unit/mL).',
              'Continue insulin until acidosis resolves (pH > 7.3, HCO₃ > 15, ketones < 0.6) — not just until glucose normalises.',
            ],
            nursing: [
              'Hourly glucose; 1–2 hourly VBG/ketones/U&E initially',
              'Hourly fluid balance; titrate two-bag ratio to glucose',
              'Do NOT stop insulin for low glucose — increase dextrose instead',
            ],
            prescriptions: [
              {
                drug: 'Regular insulin infusion',
                dose: '0.05–0.1 units/kg/h',
                route: 'IV',
                frequency: 'Continuous, no bolus',
                calculation: (w: number) => `${(0.05 * w).toFixed(2)}–${(0.1 * w).toFixed(2)} units/h (= mL/h at 1 u/mL)`,
                notes: 'Start 1–2 h after fluids. 50 units in 50 mL 0.9% NaCl.',
              },
              {
                drug: 'Potassium chloride',
                dose: '40 mmol/L (20 mmol per 500 mL)',
                route: 'IV in fluids',
                frequency: 'Once UO + K not high',
                calculation: (w: number) => `20 mmol per 500 mL bag`,
                notes: 'Hold if K > 5.5 or anuric; replace first if K < 3.0–3.3 and delay insulin.',
              },
            ],
            triggers: [
              'Glucose falling > 5 mmol/L (90 mg/dL) per hour — slow it / add dextrose',
              'K < 3.0 despite replacement — hold insulin, senior review',
              'Failure to clear acidosis — reassess insulin delivery, sepsis, dose',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Cerebral Edema Watch & Rescue',
        shortLabel: 'Cerebral Edema',
        color: 'red',
        cards: [
          {
            title: 'Cerebral edema — recognise & treat',
            isCritical: true,
            calculator: { id: 'picu-dka-calc', title: 'Rescue doses (calculator)' },
            orders: [
              'Highest risk in the first 12 h, younger children, new diagnosis, severe acidosis, and with rapid osmotic shifts.',
              'Warning signs: headache, recurrence of vomiting, irritability/drowsiness, falling GCS, incontinence, bradycardia + rising BP, cranial nerve palsy, abnormal breathing.',
              'Act IMMEDIATELY on suspicion (do not wait for imaging): reduce IV fluid rate by ~⅓, give hyperosmolar therapy, elevate head of bed 30° midline.',
              'Hypertonic saline 3% 2.5–5 mL/kg over 10–15 min OR mannitol 0.5–1 g/kg over 20 min (see calculator for volumes).',
              'Secure airway if needed (target normocapnia — avoid aggressive hyperventilation); arrange urgent CT AFTER stabilising; PICU/neuro.',
            ],
            nursing: [
              'Neuro obs hourly (more if any concern)',
              'Have 3% saline / mannitol immediately available',
              'Escalate at first warning sign — do not wait',
            ],
            triggers: [
              'Any cerebral-edema warning sign → treat now + call consultant',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Resolution & Transition',
        shortLabel: 'Transition',
        color: 'emerald',
        cards: [
          {
            title: 'Resolution & transition to subcutaneous insulin',
            orders: [
              'Resolution criteria: pH > 7.3, HCO₃ > 15, β-hydroxybutyrate < 0.6, child alert and tolerating oral fluids.',
              'Transition: give subcutaneous insulin and continue the IV infusion for 30–60 min of overlap before stopping.',
              'Monitor and replace phosphate/magnesium if symptomatic; continue electrolyte surveillance.',
              'Diabetes team review, education, and identify/treat the precipitant before discharge planning.',
            ],
            nursing: [
              'First SC dose given with a meal',
              'Do not stop IV insulin until SC overlap complete',
              'Hypoglycemia watch during transition',
            ],
            triggers: ['Recurrent ketosis after transition → revert to IV insulin pathway'],
          },
        ],
      },
    ],
  },

  // --- Data layer / fallback ---
  calculateSeverity: (data: FormData): Severity => {
    const level: SeverityLevel = 'unknown';
    return { level, details: ['See Master Management Pathway above.'] };
  },
  getManagement: () => [
    {
      title: 'Severe DKA essentials',
      recommendations: [
        'Measured bolus only if shocked; replace deficit + maintenance over 48 h.',
        'Two-bag system titrated by glucose; potassium 40 mmol/L once UO and K not high.',
        'Insulin 0.05–0.1 units/kg/h, 1–2 h after fluids, no bolus; continue until acidosis clears.',
        'Cerebral edema: act on suspicion — reduce fluids, 3% saline or mannitol, head up, urgent CT.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU/HDU for severe DKA; continuous monitoring and hourly neuro obs.'],
  getRedFlags: () => [
    'Headache / falling GCS / irritability (cerebral edema)',
    'Bradycardia with rising blood pressure',
    'Potassium < 3.0 or peaked T-waves',
    'Glucose falling faster than 5 mmol/L (90 mg/dL)/h',
    'Failure of acidosis to improve',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: '0.9% saline bolus', dose: w ? `${10 * w} mL` : '10 mL/kg', notes: 'Only if shocked; reassess.' },
      { drugName: 'Insulin infusion', dose: w ? `${(0.05 * w).toFixed(2)}–${(0.1 * w).toFixed(2)} u/h` : '0.05–0.1 units/kg/h', notes: 'Start 1–2 h after fluids, no bolus.' },
      { drugName: 'Hypertonic saline 3%', dose: w ? `${(2.5 * w).toFixed(0)}–${(5 * w).toFixed(0)} mL` : '2.5–5 mL/kg', notes: 'Cerebral edema rescue.' },
      { drugName: 'Mannitol', dose: w ? `${(0.5 * w).toFixed(1)}–${(1 * w).toFixed(1)} g` : '0.5–1 g/kg', notes: 'Cerebral edema rescue.' },
    ];
  },
  getReferences: () => [
    { title: 'ISPAD Clinical Practice Consensus Guidelines 2022: DKA & HHS', url: 'https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406' },
    { title: 'BSPED Integrated Care Pathway for DKA', url: 'https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/' },
  ],
};
