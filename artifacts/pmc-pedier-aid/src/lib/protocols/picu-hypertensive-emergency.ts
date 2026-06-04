import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Hypertensive emergency (Master Management Pathway). */
export const picuHypertensiveEmergencyProtocol: DiseaseProtocol = {
  id: 'picu-hypertensive-emergency',
  name: 'Hypertensive emergency',
  system: 'Shock & Cardiovascular',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Severe hypertension with end-organ dysfunction — controlled, gradual blood-pressure reduction with IV infusions and a search for the (usually renal) cause.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'A hypertensive EMERGENCY is severe hypertension WITH acute end-organ damage (encephalopathy, seizures, retinopathy, heart failure/pulmonary edema, AKI); without organ damage it is an urgency. The cardinal rule is GRADUAL reduction — drop the BP by no more than ~25% in the first 8 hours, then normalise over 24–48 h. Lowering too fast causes cerebral/retinal/renal ischemia. Use titratable IV infusions, and remember most paediatric severe HTN is renal.',
    stages: [
      {
        label: 'Stage 1: Recognise & Assess End-Organ Damage',
        shortLabel: 'Recognise',
        color: 'red',
        cards: [
          {
            title: 'Confirm severe HTN + end-organ signs',
            isCritical: true,
            orders: [
              'Confirm BP with an appropriately sized cuff (and arterial line if treating); compare to age/height-based norms (emergency ≈ > 95th centile + 30 mmHg or stage 2 with symptoms).',
              'Assess end-organ damage: encephalopathy (headache, vomiting, seizures, ↓GCS), visual symptoms/retinopathy, heart failure/pulmonary edema, AKI/hematuria.',
              'Workup for cause: U&E/creatinine, urinalysis, renal ultrasound ± Doppler; consider endocrine (catecholamines, cortisol, thyroid), coarctation (4-limb BP), drugs.',
              'Identify reversible contributors: pain, fluid overload, drugs, raised ICP.',
            ],
            nursing: ['Manual + automated BP, correct cuff size', 'Continuous BP (arterial line) once treating', 'Neuro obs; fundoscopy as able'],
            triggers: ['Encephalopathy / seizures', 'Pulmonary edema / heart failure', 'Rapidly rising creatinine'],
          },
        ],
      },
      {
        label: 'Stage 2: Controlled Reduction',
        shortLabel: 'Controlled',
        color: 'amber',
        cards: [
          {
            title: 'Gradual, monitored BP lowering',
            isCritical: true,
            orders: [
              'Use a titratable IV infusion in an HDU/PICU setting with continuous (ideally invasive) BP monitoring.',
              'Target: reduce BP by ≤ 25% of the planned total reduction in the first 6–8 hours, a further reduction over the next 8–12 h, then normalise over 24–48 h.',
              'Avoid abrupt large drops (watch out with sublingual/short-acting boluses) — risk of cerebral, optic, and renal ischemia.',
              'Treat seizures, manage fluid overload (diuretic if pulmonary edema), and treat the underlying cause.',
            ],
            nursing: ['Continuous arterial BP; titrate to target', 'Frequent neuro obs', 'Strict fluid balance'],
            triggers: ['BP falling faster than target → reduce infusion', 'Neuro deterioration during reduction'],
          },
        ],
      },
      {
        label: 'Stage 3: Agents',
        shortLabel: 'Agents',
        color: 'red',
        cards: [
          {
            title: 'IV antihypertensive options',
            calculator: undefined,
            orders: [
              'Labetalol — infusion or intermittent boluses (avoid in asthma, heart block, decompensated heart failure).',
              'Nicardipine — titratable infusion, generally well tolerated.',
              'Sodium nitroprusside — potent titratable infusion (monitor for cyanide/thiocyanate with prolonged/high doses or renal impairment).',
              'Hydralazine — intermittent boluses where infusions are not available.',
            ],
            nursing: ['Dedicated infusion line; titrate per protocol', 'Light protection for nitroprusside', 'Monitor HR with labetalol'],
            prescriptions: [
              { drug: 'Labetalol', dose: 'Bolus 0.2–1 mg/kg; infusion 0.25–3 mg/kg/h', route: 'IV', frequency: 'Titrate', calculation: (w: number) => `bolus ${(0.2 * w).toFixed(1)}–${(1 * w).toFixed(1)} mg (max 20–40 mg)`, notes: 'Avoid in asthma/heart block/decompensated HF.' },
              { drug: 'Nicardipine', dose: '0.5–5 mcg/kg/min', route: 'IV infusion', frequency: 'Titrate', calculation: (w: number) => `start ${(0.5 * w).toFixed(1)} mcg/min`, notes: 'Titratable; reflex tachycardia possible.' },
              { drug: 'Sodium nitroprusside', dose: '0.5–8 mcg/kg/min', route: 'IV infusion', frequency: 'Titrate', calculation: (w: number) => `start ${(0.5 * w).toFixed(1)} mcg/min`, notes: 'Light-protect; cyanide risk with high/prolonged dose or renal failure.' },
              { drug: 'Hydralazine', dose: '0.1–0.2 mg/kg (max 20 mg)', route: 'IV bolus', frequency: 'q4–6h', calculation: (w: number) => `${(0.1 * w).toFixed(1)}–${(0.2 * w).toFixed(1)} mg`, notes: 'Intermittent option; reflex tachycardia.' },
            ],
            triggers: ['Inadequate control → second agent / nephrology input', 'Adverse effect of agent'],
          },
        ],
      },
      {
        label: 'Stage 4: Cause & Transition',
        shortLabel: 'Cause',
        color: 'emerald',
        cards: [
          {
            title: 'Find the cause & transition to oral',
            orders: [
              'Complete the secondary-hypertension workup (renal parenchymal/renovascular, endocrine, coarctation, drugs).',
              'Once BP is controlled and stable, transition from IV infusion to oral antihypertensives with overlap.',
              'Involve nephrology ± cardiology/endocrinology for ongoing management.',
              'Arrange follow-up and education; address contributing factors.',
            ],
            nursing: ['Wean infusion as oral agents take effect', 'Continue BP monitoring during transition', 'Specialty liaison'],
            triggers: ['Rebound hypertension on transition', 'Treatable secondary cause identified'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Hypertensive emergency essentials', recommendations: ['Emergency = severe HTN + end-organ damage.', 'Reduce gradually — ≤ 25% in the first 8 h, normalise over 24–48 h.', 'Titratable IV infusion (labetalol, nicardipine, nitroprusside) with continuous BP.', 'Find the cause (usually renal); transition to oral once stable.'] }],
  getDisposition: () => ['Admit to PICU/HDU with continuous (invasive) BP monitoring; nephrology input.'],
  getRedFlags: () => ['Hypertensive encephalopathy / seizures', 'Pulmonary edema / heart failure', 'Acute kidney injury', 'Visual disturbance / retinopathy', 'Too-rapid BP fall causing ischemia'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Labetalol', dose: w ? `bolus ${(0.2 * w).toFixed(1)}–${(1 * w).toFixed(1)} mg` : '0.2–1 mg/kg bolus; 0.25–3 mg/kg/h', notes: 'Avoid in asthma/heart block.' },
      { drugName: 'Nicardipine', dose: w ? `start ${(0.5 * w).toFixed(1)} mcg/min` : '0.5–5 mcg/kg/min', notes: 'Titratable infusion.' },
      { drugName: 'Sodium nitroprusside', dose: w ? `start ${(0.5 * w).toFixed(1)} mcg/min` : '0.5–8 mcg/kg/min', notes: 'Cyanide risk; light-protect.' },
    ];
  },
  getReferences: () => [
    { title: 'AAP Clinical Practice Guideline — Screening & Management of High BP in Children (2017)', url: 'https://publications.aap.org/pediatrics/article/140/3/e20171904/38358' },
    { title: 'Pediatric hypertensive crisis — review', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6722035/' },
  ],
};
