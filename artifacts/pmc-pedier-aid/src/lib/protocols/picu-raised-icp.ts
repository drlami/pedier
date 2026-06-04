import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Raised intracranial pressure & neuroprotection (Master Management Pathway).
 * Tiered escalation modelled on pediatric severe-TBI / neurocritical-care guidance.
 */
export const picuRaisedIcpProtocol: DiseaseProtocol = {
  id: 'picu-raised-icp',
  name: 'Raised ICP & neuroprotection',
  system: 'Neurocritical Care',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Recognition of raised intracranial pressure and the tiered neuroprotection pathway — from general measures through hyperosmolar therapy to refractory/salvage interventions.',
  image: { url: '', hint: '' },

  questions: [],

  mmpData: {
    snapshot:
      'The brain lives on perfusion: CPP = MAP − ICP. Protect it by lowering ICP AND defending MAP. Avoid the secondary-injury enemies — hypoxia, hypotension, hypercarbia, hyperthermia, hypo/hyperglycemia, hyponatremia, and seizures. Treat in tiers: general neuroprotective measures first, then hyperosmolar therapy (hypertonic saline preferred), escalating to refractory measures. Acute herniation (blown pupil, Cushing triad, posturing) = emergency: brief hyperventilation + hyperosmolar bolus + neurosurgery NOW.',
    stages: [
      {
        label: 'Stage 1: Recognise & General Neuroprotection',
        shortLabel: 'Neuroprotect',
        color: 'red',
        cards: [
          {
            title: 'Recognise raised ICP / herniation',
            isCritical: true,
            orders: [
              'Signs: declining GCS (drop ≥ 2), unequal/fixed/dilated pupil, Cushing triad (hypertension + bradycardia + irregular respiration), abnormal posturing, papilledema, tense fontanelle in infants.',
              'Acute herniation is a clinical emergency — do not wait for imaging to start treatment.',
              'Identify cause: trauma, hydrocephalus/VP-shunt block, CNS infection, tumour, metabolic (DKA, liver failure), hypoxic-ischemic injury.',
              'Urgent non-contrast CT head once stabilised; involve neurosurgery early.',
            ],
            nursing: [
              'Continuous SpO2, BP (arterial line preferred), EtCO2 if ventilated',
              'Neuro obs (GCS + pupils) every 15–30 min',
              'Glucose and temperature checks',
            ],
            triggers: [
              'Blown / asymmetric pupil',
              'GCS drop ≥ 2 points',
              'Cushing triad or abnormal posturing',
            ],
          },
          {
            title: 'General neuroprotective measures (all patients)',
            calculator: { id: 'map-cpp-calc', title: 'MAP & CPP Calculator' },
            orders: [
              'Airway/breathing: secure airway if GCS ≤ 8; target normoxia (SpO2 ≥ 94%) and NORMOCAPNIA (PaCO2 35–40 mmHg). Avoid routine hyperventilation.',
              'Circulation: avoid hypotension — keep MAP adequate for age to maintain CPP (target CPP ≥ 40–50 mmHg, age-dependent). Use fluids/vasopressors as needed.',
              'Head midline, head-of-bed elevated 30°, avoid tight ETT ties / neck-line obstruction of venous drainage.',
              'Analgesia + sedation to prevent surges; treat pain/agitation; avoid hypotension from sedatives.',
              'Maintain normothermia (treat fever aggressively), normoglycemia, and normonatremia–mild hypernatremia (Na 145–155). Avoid hyponatremia & hypotonic fluids.',
            ],
            nursing: [
              'Cluster care; minimise noxious stimulation/suctioning surges',
              'Keep head midline; neutral neck position',
              'Active fever control; warming/cooling to normothermia',
            ],
            triggers: [
              'SpO2 < 94% or PaCO2 outside 35–40 mmHg',
              'MAP below age target / falling CPP',
              'Temperature > 38°C',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Tier 1 — Hyperosmolar & Seizure Control',
        shortLabel: 'Tier 1',
        color: 'amber',
        cards: [
          {
            title: 'Hyperosmolar therapy & seizure control',
            isCritical: true,
            orders: [
              'For sustained ICP ≥ 20 mmHg or clinical signs: give hyperosmolar therapy — hypertonic saline 3% is preferred first-line.',
              'Mannitol is an alternative (ensure euvolemia; avoid if hypotensive or renal failure); maintain serum osmolality < 320 mOsm/L.',
              'Monitor sodium and osmolality; target Na 145–155 mmol/L with 3% saline therapy.',
              'Treat seizures promptly (benzodiazepine → levetiracetam/phenytoin); consider continuous EEG if persistently obtunded — non-convulsive seizures raise ICP.',
              'Ensure adequate analgesia/sedation depth before escalating further.',
            ],
            nursing: [
              'Central or large-bore access for 3% saline',
              'Serial Na / osmolality as ordered',
              'Strict fluid balance; urinary catheter',
            ],
            prescriptions: [
              {
                drug: 'Hypertonic saline 3%',
                dose: '3–5 mL/kg (max ~250 mL)',
                route: 'IV bolus',
                frequency: 'Over 10–20 min, repeat to target Na',
                calculation: (w: number) => `${Math.min(3 * w, 250)}–${Math.min(5 * w, 250)} mL`,
                notes: 'Preferred first-line. Central line preferred; may repeat. Target Na 145–155, osm < 360.',
              },
              {
                drug: 'Mannitol 20%',
                dose: '0.25–1 g/kg',
                route: 'IV',
                frequency: 'Over 20–30 min',
                calculation: (w: number) => `${(0.5 * w).toFixed(1)} g (= ${(2.5 * w).toFixed(1)} mL of 20%)`,
                notes: 'Alternative to 3% saline. Ensure euvolemia; hold if hypotensive or osm > 320. Watch for diuresis-related hypovolemia.',
              },
              {
                drug: 'Levetiracetam',
                dose: '40–60 mg/kg (max 4.5 g)',
                route: 'IV',
                frequency: 'Loading',
                calculation: (w: number) => `${Math.min(40 * w, 4500)} mg`,
                notes: 'Seizure control / prophylaxis per indication. Phenytoin 20 mg/kg is an alternative.',
              },
            ],
            triggers: [
              'ICP remains ≥ 20 mmHg despite Tier 1',
              'Na rising too fast (> 8–10 mmol/L per day) or osm > 320',
              'Clinical signs of ongoing herniation',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Tier 2 — Refractory ICP',
        shortLabel: 'Tier 2',
        color: 'indigo',
        cards: [
          {
            title: 'Refractory ICP measures',
            orders: [
              'CSF drainage via external ventricular drain (EVD) if hydrocephalus / available — discuss with neurosurgery.',
              'Deepen sedation; consider neuromuscular blockade to control surges and ventilator dyssynchrony.',
              'Optimise CPP (vasopressors to defend MAP); repeat imaging to exclude a surgical lesion.',
              'Mild controlled hyperventilation (PaCO2 30–35 mmHg) only as a temporising bridge with neuromonitoring — avoid prophylactic/aggressive hyperventilation (causes ischemia).',
            ],
            nursing: [
              'EVD level/zeroing and output monitoring',
              'Train-of-four if paralysed',
              'Continuous EtCO2 + ABG correlation',
            ],
            triggers: [
              'ICP refractory despite Tier 2',
              'New focal deficit / pupil change',
              'Surgical lesion on repeat imaging',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Tier 3 — Salvage Therapies',
        shortLabel: 'Salvage',
        color: 'red',
        cards: [
          {
            title: 'Salvage / last-line interventions',
            isCritical: true,
            orders: [
              'Decompressive craniectomy — neurosurgical decision for refractory raised ICP.',
              'Barbiturate (pentobarbital/thiopental) coma with continuous EEG and hemodynamic support — requires invasive monitoring.',
              'Targeted temperature management (controlled normothermia/mild hypothermia per local protocol).',
              'For acute herniation NOW: brief hyperventilation + hyperosmolar bolus + immediate neurosurgical intervention.',
            ],
            nursing: [
              'Continuous EEG for burst suppression',
              'Anticipate hypotension with barbiturates — vasopressor ready',
              'Maintain target temperature; shiver control',
            ],
            triggers: [
              'Failure of all tiers — discuss goals of care / prognosis with team & family',
            ],
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
      title: 'Tiered neuroprotection',
      recommendations: [
        'General measures: head 30° midline, normoxia, normocapnia (PaCO2 35–40), defend MAP/CPP, normothermia, normoglycemia, Na 145–155.',
        'Tier 1: hypertonic saline 3% (preferred) or mannitol; treat seizures.',
        'Tier 2: CSF drainage, deeper sedation ± paralysis, brief hyperventilation as bridge.',
        'Tier 3: decompressive craniectomy, barbiturate coma, targeted temperature.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU with neurosurgical involvement; invasive ICP/CPP monitoring as indicated.'],
  getRedFlags: () => [
    'Blown / asymmetric pupil',
    'Cushing triad (hypertension + bradycardia + irregular breathing)',
    'GCS drop ≥ 2 or GCS ≤ 8',
    'Abnormal posturing (decorticate/decerebrate)',
    'Hyponatremia or hypotonic fluids in a brain-injured child',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Hypertonic saline 3%', dose: w ? `${Math.min(3 * w, 250)}–${Math.min(5 * w, 250)} mL` : '3–5 mL/kg', notes: 'Preferred first-line hyperosmolar; target Na 145–155.' },
      { drugName: 'Mannitol 20%', dose: w ? `${(0.5 * w).toFixed(1)} g` : '0.25–1 g/kg', notes: 'Ensure euvolemia; osm < 320.' },
      { drugName: 'Levetiracetam', dose: w ? `${Math.min(40 * w, 4500)} mg` : '40–60 mg/kg', notes: 'Seizure control.' },
    ];
  },
  getReferences: () => [
    { title: 'Guidelines for Management of Pediatric Severe TBI, 3rd Ed (2019)', url: 'https://journals.lww.com/pccmjournal/fulltext/2019/03001/guidelines_for_the_management_of_pediatric_severe.1.aspx' },
    { title: 'PALS — Post-resuscitation & neurologic care (AHA)', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
  ],
};
