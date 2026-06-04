import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Status epilepticus (refractory) — time-staged Master Management Pathway.
 * Built on the pediatric SE treatment algorithm (AES/ILAE/NCS):
 * stabilisation → emergent (benzodiazepine) → urgent control (second-line)
 * → refractory (anesthetic infusions) → super-refractory.
 */
export const picuStatusEpilepticusProtocol: DiseaseProtocol = {
  id: 'picu-status-epilepticus',
  name: 'Status epilepticus (refractory)',
  system: 'Neurocritical Care',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Time-driven management of convulsive status epilepticus, from first-line benzodiazepines through second-line agents to refractory and super-refractory anesthetic infusions.',
  image: { url: '', hint: '' },

  questions: [],

  mmpData: {
    snapshot:
      'Status epilepticus is a stopwatch emergency — neuronal injury and pharmacoresistance both increase with time. Treat by the clock, not by appearance. Give a properly-dosed benzodiazepine early (under-dosing is the commonest error); if seizing continues at ~20 min move to a second-line agent; at ~40 min it is refractory — intubate and start an anesthetic infusion with continuous EEG. Throughout: check glucose, send a cause workup, and never forget pyridoxine in infants and treatable causes (hyponatremia, hypocalcemia, hypoglycemia, ingestion, infection).',
    stages: [
      {
        label: 'Stage 1: 0–5 min — Stabilise',
        shortLabel: '0–5 min',
        color: 'red',
        cards: [
          {
            title: 'Stabilisation & immediate workup',
            isCritical: true,
            orders: [
              'ABC: airway positioning, high-flow O2, suction; attach monitoring; note the TIME seizure started.',
              'Check capillary glucose immediately — treat hypoglycemia (see prescriptions).',
              'Obtain IV/IO access; send glucose, electrolytes (Na, Ca, Mg), gas, CBC, ± AED levels, ± toxicology, ± culture.',
              'In infants/neonates give a pyridoxine trial if refractory; consider treatable causes early.',
            ],
            nursing: [
              'Continuous SpO2, HR, BP; recovery position between events',
              'Document seizure start time and semiology',
              'Prepare benzodiazepine + airway equipment',
            ],
            triggers: [
              'No IV access → use IM midazolam / buccal or PR route',
              'Hypoglycemia on bedside glucose',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: 5–20 min — Emergent (Benzodiazepine)',
        shortLabel: '5–20 min',
        color: 'amber',
        cards: [
          {
            title: 'First-line benzodiazepine',
            isCritical: true,
            threshold: 'GIVE EARLY — ADEQUATE DOSE',
            orders: [
              'Give a benzodiazepine; may repeat ONCE after 5 min if still seizing.',
              'IV available: lorazepam 0.1 mg/kg (max 4 mg) OR midazolam 0.15 mg/kg.',
              'No IV: IM midazolam 0.2 mg/kg (max 10 mg), or buccal midazolam 0.3 mg/kg, or rectal diazepam 0.5 mg/kg.',
              'Do not exceed two doses of benzodiazepine — respiratory depression risk; prepare for airway support.',
            ],
            nursing: [
              'Monitor for apnea/hypotension after each dose',
              'Have bag-mask ready',
              'Note times of all drug doses',
            ],
            prescriptions: [
              {
                drug: 'Lorazepam',
                dose: '0.1 mg/kg (max 4 mg)',
                route: 'IV',
                frequency: 'May repeat ×1 at 5 min',
                calculation: (w: number) => `${Math.min(0.1 * w, 4).toFixed(1)} mg`,
                notes: 'First-line if IV access. Preferred where available.',
              },
              {
                drug: 'Midazolam (IM)',
                dose: '0.2 mg/kg (max 10 mg)',
                route: 'IM',
                frequency: 'If no IV',
                calculation: (w: number) => `${Math.min(0.2 * w, 10).toFixed(1)} mg`,
                notes: 'Buccal 0.3 mg/kg is an alternative non-IV route.',
              },
              {
                drug: 'Diazepam (rectal)',
                dose: '0.5 mg/kg (max 20 mg)',
                route: 'PR',
                frequency: 'If no IV',
                calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mg`,
                notes: 'Alternative pre-hospital / no-access route.',
              },
            ],
            triggers: [
              'Still seizing after 2 benzodiazepine doses → second-line agent now',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: 20–40 min — Urgent Control (Second-line)',
        shortLabel: '20–40 min',
        color: 'indigo',
        cards: [
          {
            title: 'Second-line antiseizure medication',
            orders: [
              'Choose ONE second-line agent (all reasonable per ESETT): levetiracetam, fosphenytoin/phenytoin, or valproate.',
              'Levetiracetam 40–60 mg/kg IV (max 4.5 g) over 15 min — favourable safety profile.',
              'Fosphenytoin 20 mg PE/kg (max 1500 mg PE) — cardiac monitoring; phenytoin requires slow rate (max 1 mg/kg/min).',
              'Valproate 40 mg/kg IV (max 3 g) — avoid in hepatic/mitochondrial disease & metabolic disorders.',
              'If still seizing, a different second-line agent may be tried while preparing for refractory management.',
            ],
            nursing: [
              'ECG/BP monitoring during phenytoin/fosphenytoin',
              'Separate line / flush for phenytoin (precipitation)',
              'Reassess seizure activity continuously',
            ],
            prescriptions: [
              {
                drug: 'Levetiracetam',
                dose: '40–60 mg/kg (max 4.5 g)',
                route: 'IV',
                frequency: 'Over 15 min',
                calculation: (w: number) => `${Math.min(50 * w, 4500)} mg`,
                notes: 'Common first choice second-line — minimal hemodynamic effect.',
              },
              {
                drug: 'Fosphenytoin',
                dose: '20 mg PE/kg (max 1500 mg PE)',
                route: 'IV/IM',
                frequency: 'Single load',
                calculation: (w: number) => `${Math.min(20 * w, 1500)} mg PE`,
                notes: 'Cardiac monitoring. Phenytoin alternative: 20 mg/kg, max rate 1 mg/kg/min.',
              },
              {
                drug: 'Valproate',
                dose: '40 mg/kg (max 3 g)',
                route: 'IV',
                frequency: 'Over 10 min',
                calculation: (w: number) => `${Math.min(40 * w, 3000)} mg`,
                notes: 'Avoid in hepatic dysfunction, mitochondrial/metabolic disease, and < 2 yr with unclear diagnosis.',
              },
            ],
            triggers: [
              'Seizing > 40 min / failed second-line → REFRACTORY status: intubate + anesthetic infusion',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: > 40 min — Refractory & Super-Refractory',
        shortLabel: 'Refractory',
        color: 'red',
        cards: [
          {
            title: 'Refractory SE — intubate & infuse',
            isCritical: true,
            orders: [
              'Refractory SE = ongoing seizures despite adequate benzodiazepine + one second-line agent: intubate and start a continuous anesthetic infusion.',
              'Midazolam infusion first-line: bolus 0.15 mg/kg then 0.05–0.4 mg/kg/h (≈ 1–6 mcg/kg/min), titrate to seizure cessation/burst-suppression.',
              'Alternative: propofol infusion (caution — propofol infusion syndrome with prolonged/high-dose use).',
              'Start continuous EEG as soon as possible; titrate infusion to seizure suppression or burst-suppression.',
              'Support hemodynamics (fluids/vasopressors); continue a maintenance second-line agent.',
            ],
            nursing: [
              'Continuous EEG electrodes / monitoring',
              'Anticipate hypotension — vasopressor ready',
              'Hourly infusion titration documentation',
            ],
            prescriptions: [
              {
                drug: 'Midazolam (infusion)',
                dose: 'Bolus 0.15 mg/kg, then 0.05–0.4 mg/kg/h',
                route: 'IV',
                frequency: 'Titrate to cEEG',
                calculation: (w: number) => `bolus ${(0.15 * w).toFixed(1)} mg; infuse ${(0.05 * w).toFixed(2)}–${(0.4 * w).toFixed(2)} mg/h`,
                notes: 'First-line refractory infusion. Titrate up every 5–15 min to seizure control.',
              },
              {
                drug: 'Phenobarbital',
                dose: '20 mg/kg (max 1 g)',
                route: 'IV',
                frequency: 'If infusions unavailable',
                calculation: (w: number) => `${Math.min(20 * w, 1000)} mg`,
                notes: 'Significant respiratory depression/sedation — airway support essential.',
              },
            ],
            triggers: [
              'Super-refractory (> 24 h or recurs on weaning anesthesia) → add ketamine infusion, consider thiopental/pentobarbital coma, immunotherapy/metabolic workup',
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
      title: 'Time-staged algorithm',
      recommendations: [
        '0–5 min: ABC, glucose, IV/IO, note time.',
        '5–20 min: benzodiazepine (lorazepam 0.1 mg/kg IV / midazolam IM/buccal), may repeat once.',
        '20–40 min: second-line — levetiracetam, fosphenytoin, or valproate.',
        '> 40 min refractory: intubate + midazolam/propofol infusion with continuous EEG.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU; continuous EEG and airway support for refractory SE.'],
  getRedFlags: () => [
    'Seizure > 5 min (treat as status)',
    'Hypoglycemia / hyponatremia / hypocalcemia as cause',
    'Respiratory depression after benzodiazepines',
    'Ongoing seizures after second-line agent (refractory)',
    'Focal features / fever — consider CNS infection, give empiric cover',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Lorazepam (IV)', dose: w ? `${Math.min(0.1 * w, 4).toFixed(1)} mg` : '0.1 mg/kg (max 4 mg)', notes: 'First-line, may repeat ×1.' },
      { drugName: 'Levetiracetam', dose: w ? `${Math.min(50 * w, 4500)} mg` : '40–60 mg/kg (max 4.5 g)', notes: 'Second-line.' },
      { drugName: 'Fosphenytoin', dose: w ? `${Math.min(20 * w, 1500)} mg PE` : '20 mg PE/kg', notes: 'Second-line, cardiac monitoring.' },
      { drugName: 'Midazolam infusion', dose: '0.05–0.4 mg/kg/h', notes: 'Refractory SE after intubation.' },
      { drugName: 'Dextrose 10%', dose: w ? `${2.5 * w} mL` : '2.5 mL/kg', notes: 'If hypoglycemic.' },
    ];
  },
  getReferences: () => [
    { title: 'AES Guideline: Treatment of Convulsive Status Epilepticus (2016)', url: 'https://onlinelibrary.wiley.com/doi/10.5698/1535-7597-16.1.48' },
    { title: 'Neurocritical Care Society — Status Epilepticus Guideline', url: 'https://link.springer.com/article/10.1007/s12028-012-9695-z' },
  ],
};
