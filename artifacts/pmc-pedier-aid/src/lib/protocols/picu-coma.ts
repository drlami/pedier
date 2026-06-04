import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Coma / altered consciousness approach (Master Management Pathway). */
export const picuComaProtocol: DiseaseProtocol = {
  id: 'picu-coma',
  name: 'Coma / altered consciousness approach',
  system: 'Neurocritical Care',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Structured approach to the comatose or encephalopathic child — stabilise, empiric reversal of treatable causes, focused workup, and neuroprotection.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      "Coma is a symptom, not a diagnosis — stabilise first, then think causes systematically (AEIOU-TIPS). Don't Ever Forget Glucose. Give empiric antidotes/antibiotics when the history fits rather than waiting for confirmation, and protect the brain (intubate if GCS ≤ 8, treat seizures and raised ICP). A non-convulsive seizure is an easily-missed, treatable cause.",
    stages: [
      {
        label: 'Stage 1: Stabilise & Assess',
        shortLabel: 'Stabilise',
        color: 'red',
        cards: [
          {
            title: 'ABC, glucose & rapid neuro exam',
            isCritical: true,
            orders: [
              'Airway/breathing/circulation; high-flow O2; secure airway and intubate if GCS ≤ 8 or unable to protect airway.',
              'Check capillary glucose immediately — treat hypoglycemia (DEFG: Don\'t Ever Forget Glucose).',
              'Rapid neuro exam: GCS/AVPU, pupils (size/reactivity), posturing, focal signs, brainstem reflexes, signs of trauma or meningism.',
              'Look for raised ICP / herniation — if present, treat immediately (see Raised ICP pathway).',
            ],
            nursing: ['Continuous SpO2, HR, BP, EtCO2 if intubated', 'Neuro obs (GCS + pupils) every 15–30 min', 'Temperature + glucose'],
            triggers: ['GCS ≤ 8 or dropping', 'Unequal/fixed pupils', 'Cushing triad / posturing'],
          },
        ],
      },
      {
        label: 'Stage 2: Empiric Reversal & Workup',
        shortLabel: 'Reverse + Workup',
        color: 'amber',
        cards: [
          {
            title: 'Treat reversible causes & investigate',
            orders: [
              'Causes — AEIOU-TIPS: Alcohol/Acidosis, Epilepsy/Electrolytes, Insulin (glucose), Opiates/Overdose, Uremia, Trauma/Temperature, Infection, Psychiatric/Poisoning, Shock/Stroke.',
              'Empiric therapy as indicated: dextrose for hypoglycemia, naloxone for suspected opioids, treat seizures (benzodiazepine), empiric ceftriaxone + aciclovir if CNS infection possible, thiamine if malnourished.',
              'Bloods: glucose, gas, electrolytes (Na, Ca, Mg), ammonia, LFTs, renal function, FBC, CRP, culture, toxicology, ± metabolic screen.',
              'Imaging: urgent CT head if focal signs/trauma/raised ICP; lumbar puncture once safe (after imaging if indicated, not if raised ICP/coagulopathy).',
            ],
            nursing: ['Send full workup bloods together', 'Prepare antidotes/antimicrobials', 'Reassess GCS after each intervention'],
            prescriptions: [
              { drug: 'Dextrose 10%', dose: '2–5 mL/kg', route: 'IV', frequency: 'If hypoglycemic', calculation: (w: number) => `${2.5 * w}–${5 * w} mL`, notes: '≈ 0.25 g/kg as 2.5 mL/kg D10.' },
              { drug: 'Naloxone', dose: '0.01–0.1 mg/kg (max 2 mg)', route: 'IV/IM/IN', frequency: 'Suspected opioid', calculation: (w: number) => `${Math.min(0.1 * w, 2).toFixed(2)} mg`, notes: 'Repeat/infuse for long-acting opioids.' },
              { drug: 'Ceftriaxone', dose: '50–100 mg/kg (max 2 g)', route: 'IV', frequency: 'If meningitis possible', calculation: (w: number) => `${Math.min(80 * w, 2000)} mg`, notes: 'Add aciclovir if encephalitis suspected.' },
            ],
            triggers: ['No glucose/opioid cause found and still comatose → escalate workup', 'Fever / meningism → cover CNS infection now'],
          },
        ],
      },
      {
        label: 'Stage 3: Neuroprotection',
        shortLabel: 'Neuroprotect',
        color: 'indigo',
        cards: [
          {
            title: 'Protect the brain',
            orders: [
              'If raised ICP suspected, follow the Raised ICP pathway (hyperosmolar therapy, HOB 30°, normocapnia, defend CPP).',
              'Continuous EEG if persistently obtunded — treat non-convulsive seizures.',
              'Maintain normoxia, normocapnia, normotension, normoglycemia, normothermia, and normonatremia.',
              'Sedation/analgesia balanced against the need for serial neuro exam.',
            ],
            nursing: ['cEEG if available', 'Neuro obs as ordered', 'Avoid hypotonic fluids'],
            triggers: ['Seizures on EEG', 'Signs of evolving raised ICP'],
          },
        ],
      },
      {
        label: 'Stage 4: Targeted Management',
        shortLabel: 'Targeted',
        color: 'emerald',
        cards: [
          {
            title: 'Cause-directed care',
            orders: [
              'Direct therapy to the confirmed cause (metabolic, infective, toxic, structural, epileptic, hepatic, etc.).',
              'Involve relevant specialties: neurology, metabolic, toxicology, neurosurgery.',
              'Ongoing supportive care and re-evaluation as the diagnosis clarifies.',
            ],
            nursing: ['Reassess GCS trend', 'Specialty liaison', 'Supportive care bundle'],
            triggers: ['Diagnostic uncertainty → broaden differential / repeat workup'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Coma approach essentials', recommendations: ['ABC + glucose; intubate if GCS ≤ 8.', 'Empiric reversal: dextrose, naloxone, treat seizures, empiric antimicrobials if infection possible.', 'Workup: bloods incl. ammonia/tox, CT, LP when safe.', 'Neuroprotection + cEEG; treat the cause.'] }],
  getDisposition: () => ['Admit to PICU; neuromonitoring and cause-directed therapy.'],
  getRedFlags: () => ['GCS ≤ 8 or dropping', 'Unequal/fixed pupils, posturing', 'Hypoglycemia', 'Fever/meningism', 'Focal neurology or trauma'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Dextrose 10%', dose: w ? `${2.5 * w} mL` : '2.5 mL/kg', notes: 'If hypoglycemic.' },
      { drugName: 'Naloxone', dose: w ? `${Math.min(0.1 * w, 2).toFixed(2)} mg` : '0.01–0.1 mg/kg', notes: 'Suspected opioid.' },
      { drugName: 'Ceftriaxone', dose: w ? `${Math.min(80 * w, 2000)} mg` : '50–100 mg/kg', notes: '+ aciclovir if encephalitis.' },
    ];
  },
  getReferences: () => [
    { title: 'RCPCH — The management of a child with a decreased conscious level', url: 'https://www.rcpch.ac.uk/resources/management-decreased-conscious-level-evidence-statement' },
    { title: 'AHA PALS — Neurologic emergencies', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
  ],
};
