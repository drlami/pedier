import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Fluid & electrolyte resuscitation (Master Management Pathway). */
export const picuFluidElectrolytesProtocol: DiseaseProtocol = {
  id: 'picu-fluid-electrolytes',
  name: 'Fluid & electrolyte resuscitation',
  system: 'Renal, Fluids & Electrolytes',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Principles of resuscitation, deficit and maintenance fluids in the critically ill child, with safe correction of sodium and other key electrolytes.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Three questions drive every fluid plan: is the child shocked (resuscitate), how dry are they (deficit), and what are they losing (maintenance + ongoing)? Use ISOTONIC fluids for resuscitation and maintenance — hypotonic fluids cause hospital-acquired hyponatremia and cerebral edema. Correct sodium SLOWLY (the brain punishes haste both ways), and check glucose, potassium, and calcium alongside.',
    stages: [
      {
        label: 'Stage 1: Assess Volume Status',
        shortLabel: 'Assess',
        color: 'blue',
        cards: [
          {
            title: 'Is the child shocked or dehydrated?',
            orders: [
              'Assess perfusion (mentation, cap refill, pulses, urine output, lactate) and hydration (mucous membranes, eyes, skin turgor, weight change).',
              'Estimate % dehydration: mild ~5%, moderate ~7–10%, severe > 10% (shock).',
              'Send baseline: U&E, glucose, gas, calcium/magnesium/phosphate; weigh the child.',
              'Identify the fluid disorder (losses, sepsis, SIADH, DI, renal) — it changes the prescription.',
            ],
            nursing: ['Strict fluid balance + daily weights', 'Hourly urine output if unwell', 'Baseline bloods'],
            triggers: ['Shock → resuscitation pathway', 'Severe electrolyte derangement', 'Anuria/oliguria'],
          },
        ],
      },
      {
        label: 'Stage 2: Resuscitation, Deficit & Maintenance',
        shortLabel: 'Fluids',
        color: 'amber',
        cards: [
          {
            title: 'Prescribe the fluids',
            orders: [
              'Resuscitation: isotonic crystalloid 10–20 mL/kg bolus (10 mL/kg if cardiac/DKA risk); reassess after each.',
              'Maintenance (Holliday-Segar): 100 mL/kg/day for first 10 kg + 50 mL/kg/day for 10–20 kg + 20 mL/kg/day above 20 kg.',
              'Use ISOTONIC maintenance fluid (e.g. 0.9% NaCl + 5% dextrose ± KCl) — avoid hypotonic fluids.',
              'Replace deficit over 24–48 h on top of maintenance; account for ongoing losses; consider fluid restriction in SIADH, overload, AKI, or raised ICP.',
            ],
            nursing: ['Reassess perfusion + liver/chest after each bolus', 'Add KCl once UO confirmed', 'Recheck electrolytes 4–6 hourly initially'],
            prescriptions: [
              { drug: 'Isotonic bolus', dose: '10–20 mL/kg', route: 'IV/IO', frequency: 'Reassess', calculation: (w: number) => `${10 * w}–${20 * w} mL`, notes: '10 mL/kg if cardiac/DKA.' },
              { drug: 'Maintenance fluid', dose: 'Holliday-Segar (isotonic + dextrose)', route: 'IV', frequency: 'Continuous', calculation: (w: number) => {
                  const day = w <= 10 ? 100 * w : w <= 20 ? 1000 + 50 * (w - 10) : Math.min(1500 + 20 * (w - 20), 2400);
                  return `${day} mL/day ≈ ${(day / 24).toFixed(0)} mL/h`;
                }, notes: 'Use isotonic fluid; restrict in SIADH/overload/raised ICP.' },
            ],
            triggers: ['Hyponatremia developing on fluids — review tonicity', 'Fluid overload', 'Persistent losses outpacing replacement'],
          },
        ],
      },
      {
        label: 'Stage 3: Electrolyte Correction',
        shortLabel: 'Electrolytes',
        color: 'red',
        cards: [
          {
            title: 'Safe correction of key electrolytes',
            isCritical: true,
            orders: [
              'Sodium: correct slowly — do NOT change serum Na by more than ~8–10 mmol/L per 24 h (risk of osmotic demyelination or cerebral edema). Symptomatic hyponatremia with seizures → 3% saline 2–5 mL/kg bolus to stop seizures only.',
              'Potassium: replace cautiously with cardiac monitoring (typical IV 0.25–0.5 mmol/kg over ≥ 1–2 h; max rates per local policy); never push IV K. Treat hyperkalemia per the hyperkalemia/AKI pathway.',
              'Calcium: treat symptomatic/ionised hypocalcemia with calcium gluconate 10% 0.5 mL/kg slow IV with monitoring.',
              'Magnesium and phosphate: replace as indicated; correct magnesium to help refractory hypokalemia/hypocalcemia.',
            ],
            nursing: ['ECG monitoring during K/Ca correction', 'Serial sodium during correction', 'Dedicated/diluted lines for electrolytes'],
            prescriptions: [
              { drug: 'Hypertonic saline 3% (symptomatic hypoNa)', dose: '2–5 mL/kg', route: 'IV', frequency: 'To stop seizures', calculation: (w: number) => `${2 * w}–${5 * w} mL`, notes: 'Only for severe symptomatic hyponatremia; aim to raise Na ~4–6 mmol/L.' },
              { drug: 'Potassium chloride', dose: '0.25–0.5 mmol/kg over ≥ 1–2 h', route: 'IV', frequency: 'With ECG', calculation: (w: number) => `${(0.25 * w).toFixed(1)}–${(0.5 * w).toFixed(1)} mmol`, notes: 'Never bolus; max rate per local policy.' },
              { drug: 'Calcium gluconate 10%', dose: '0.5 mL/kg (max 20 mL)', route: 'IV slow', frequency: 'Symptomatic hypoCa', calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mL`, notes: 'Cardiac monitoring; separate line from bicarbonate.' },
            ],
            triggers: ['Na correcting too fast (> 8–10/24 h) → adjust fluids', 'Arrhythmia during correction', 'Refractory hypokalemia → check magnesium'],
          },
        ],
      },
      {
        label: 'Stage 4: Monitor & Reassess',
        shortLabel: 'Monitor',
        color: 'emerald',
        cards: [
          {
            title: 'Ongoing monitoring',
            orders: [
              'Reassess fluid balance, weight, and electrolytes regularly; adjust the prescription to the clinical trajectory.',
              'Transition to enteral fluids/feeds as soon as safe.',
              'Watch for and correct the consequences of the underlying disorder (e.g. SIADH, DI, renal losses).',
            ],
            nursing: ['Cumulative balance review', 'Trend electrolytes', 'Advance enteral feeds when able'],
            triggers: ['Unexpected electrolyte shift', 'Ongoing overload or depletion'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Fluid & electrolyte essentials', recommendations: ['Resuscitate shock with isotonic boluses; estimate deficit; calculate maintenance (Holliday-Segar).', 'Use isotonic fluids — avoid hypotonic (hyponatremia/cerebral edema).', 'Correct sodium slowly (≤ 8–10 mmol/L/24 h); replace K with ECG monitoring; treat Ca/Mg.', 'Restrict fluids in SIADH/overload/AKI/raised ICP.'] }],
  getDisposition: () => ['Manage in PICU/HDU with serial electrolytes and fluid-balance review.'],
  getRedFlags: () => ['Hospital-acquired hyponatremia on hypotonic fluids', 'Rapid sodium correction', 'Severe hyper/hypokalemia with ECG changes', 'Symptomatic hypocalcemia (tetany/seizure)', 'Fluid overload'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    const day = w ? (w <= 10 ? 100 * w : w <= 20 ? 1000 + 50 * (w - 10) : Math.min(1500 + 20 * (w - 20), 2400)) : 0;
    return [
      { drugName: 'Isotonic bolus', dose: w ? `${10 * w}–${20 * w} mL` : '10–20 mL/kg', notes: 'Reassess after each.' },
      { drugName: 'Maintenance rate', dose: w ? `${(day / 24).toFixed(0)} mL/h (${day} mL/day)` : 'Holliday-Segar', notes: 'Isotonic + dextrose.' },
      { drugName: 'Calcium gluconate 10%', dose: w ? `${Math.min(0.5 * w, 20).toFixed(1)} mL` : '0.5 mL/kg', notes: 'Symptomatic hypocalcemia.' },
    ];
  },
  getReferences: () => [
    { title: 'NICE NG29 — IV fluid therapy in children and young people', url: 'https://www.nice.org.uk/guidance/ng29' },
    { title: 'AAP Clinical Practice Guideline — Maintenance IV fluids (isotonic)', url: 'https://publications.aap.org/pediatrics/article/142/6/e20183083/37529' },
  ],
};
