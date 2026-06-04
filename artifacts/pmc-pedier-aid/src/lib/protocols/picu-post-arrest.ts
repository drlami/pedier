import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Post-cardiac-arrest care (Master Management Pathway). */
export const picuPostArrestProtocol: DiseaseProtocol = {
  id: 'picu-post-arrest',
  name: 'Post-cardiac-arrest care',
  system: 'Shock & Cardiovascular',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Care after return of spontaneous circulation (ROSC): physiologic targets, neuroprotection, identifying the cause, and avoiding secondary injury.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'The arrest may be over but the brain injury is still evolving — post-ROSC care is about preventing secondary injury. Aim for NORMAL physiology: normoxia (avoid hyperoxia AND hypoxia), normocapnia, normotension, normoglycemia, normothermia (treat fever aggressively), and seizure control. Hunt and fix the cause (Hs & Ts). Resist early prognostication.',
    stages: [
      {
        label: 'Stage 1: Immediate Post-ROSC Stabilisation',
        shortLabel: 'Post-ROSC',
        color: 'red',
        cards: [
          {
            title: 'Airway, breathing & oxygenation targets',
            isCritical: true,
            orders: [
              'Secure airway/confirm ETT; controlled ventilation. Target SpO2 94–99% — wean FiO2 to AVOID hyperoxia; avoid hypoxia.',
              'Target normocapnia (PaCO2 35–45 mmHg) unless specific indication; obtain ABG and titrate.',
              '12-lead ECG; treat reversible rhythm causes; continuous monitoring.',
            ],
            nursing: ['Continuous SpO2, EtCO2, ECG, BP', 'ABG within 15–30 min of ROSC', 'Head midline, HOB 30° if no contraindication'],
            triggers: ['SpO2 < 94% or > 99% on high FiO2', 'Hypotension for age', 'Recurrent arrhythmia'],
          },
          {
            title: 'Hemodynamic support',
            calculator: { id: 'map-cpp-calc', title: 'MAP & CPP Calculator' },
            orders: [
              'Treat post-arrest hypotension: fluid bolus(es) 10 mL/kg and start a vasoactive infusion to keep BP ≥ 5th centile (aim ≥ 50th).',
              'Epinephrine or norepinephrine/dopamine infusion titrated to perfusion and MAP.',
              'Identify and treat the cause — Hs (hypoxia, hypovolemia, H+, hypo/hyperkalemia, hypothermia) & Ts (tension pneumothorax, tamponade, toxins, thrombosis).',
            ],
            nursing: ['Arterial line for continuous BP', 'Hourly urine output', 'Serial lactate'],
            prescriptions: [
              { drug: 'Epinephrine (infusion)', dose: '0.05–0.3 mcg/kg/min', route: 'IV', frequency: 'Titrate', calculation: (w: number) => `start ${(0.05 * w).toFixed(2)} mcg/min`, notes: 'Titrate to MAP/perfusion.' },
              { drug: '0.9% saline bolus', dose: '10 mL/kg', route: 'IV', frequency: 'Reassess', calculation: (w: number) => `${10 * w} mL`, notes: 'Cautious if cardiac dysfunction.' },
            ],
            triggers: ['Escalating vasoactive needs', 'Ongoing/unidentified cause of arrest'],
          },
        ],
      },
      {
        label: 'Stage 2: Targeted Physiology',
        shortLabel: 'Targets',
        color: 'amber',
        cards: [
          {
            title: 'Temperature, glucose & seizures',
            orders: [
              'Targeted temperature management: actively prevent fever; maintain normothermia (or therapeutic hypothermia 32–34°C per local protocol) for 5 days of continuous normothermia.',
              'Maintain normoglycemia — treat hypo- and hyperglycemia; avoid wide swings.',
              'Treat clinical and electrographic seizures; start continuous EEG if comatose.',
              'Correct electrolytes (K, Ca, Mg) and acidosis.',
            ],
            nursing: ['Continuous core temperature; cooling/warming as needed', 'Hourly glucose initially', 'Shiver control if cooling'],
            triggers: ['Temperature > 37.5–38°C', 'Seizure activity', 'Glucose lability'],
          },
        ],
      },
      {
        label: 'Stage 3: Neuroprotection & Monitoring',
        shortLabel: 'Neuroprotect',
        color: 'indigo',
        cards: [
          {
            title: 'Neuroprotection',
            orders: [
              'Sedation/analgesia to prevent surges; avoid hypotension; head midline, HOB 30°.',
              'Continuous EEG; treat non-convulsive seizures; serial neuro exam off sedation where feasible.',
              'Maintain CPP/MAP; avoid hypo/hyperthermia, hypo/hyperglycemia, hypo/hypercarbia.',
              'Investigate cause: imaging, echo, labs, toxicology as indicated.',
            ],
            nursing: ['cEEG electrodes', 'Neuro obs as ordered', 'Minimise noxious stimulation'],
            triggers: ['New pupillary change / seizures', 'Rising ICP signs'],
          },
        ],
      },
      {
        label: 'Stage 4: Ongoing Care & Prognostication',
        shortLabel: 'Ongoing',
        color: 'emerald',
        cards: [
          {
            title: 'Organ support & family',
            orders: [
              'Multi-organ support: lung-protective ventilation, renal/hepatic monitoring, nutrition when stable.',
              'Delay neurological prognostication — use multimodal assessment over days, not hours.',
              'Family communication and support; involve the team in goals of care.',
            ],
            nursing: ['Daily multi-organ review', 'Family updates', 'Nutrition assessment'],
            triggers: ['Multi-organ dysfunction', 'Goals-of-care discussion needed'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Post-ROSC targets', recommendations: ['Normoxia, normocapnia, normotension, normoglycemia, normothermia, seizure control.', 'Treat the cause (Hs & Ts).', 'Neuroprotection + cEEG; delay prognostication.'] }],
  getDisposition: () => ['Admit to PICU; continuous neuromonitoring and organ support.'],
  getRedFlags: () => ['Hyperoxia (SpO2 100% on high FiO2)', 'Fever after arrest', 'Seizures / status epilepticus', 'Recurrent hypotension or arrhythmia', 'Rising lactate'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Epinephrine infusion', dose: '0.05–0.3 mcg/kg/min', notes: 'Post-arrest hypotension.' },
      { drugName: '0.9% saline bolus', dose: w ? `${10 * w} mL` : '10 mL/kg', notes: 'Cautious if cardiac dysfunction.' },
    ];
  },
  getReferences: () => [
    { title: 'AHA PALS — Post-Cardiac Arrest Care', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
    { title: 'ILCOR/AHA Pediatric Post-resuscitation Care Guidelines', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901' },
  ],
};
