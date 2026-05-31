import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Status Epilepticus (Inpatient Management)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AES (American Epilepsy Society), NICE, and RCH Melbourne
 */
export const wardStatusEpilepticusProtocol: DiseaseProtocol = {
  id: 'ward-status-epilepticus',
  name: 'Status Epilepticus Master Pathway',
  system: 'Neurological System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive senior directive for seizure emergencies: Stepwise benzodiazepine protocols, 2nd-line loading doses, and PICU refractory management.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical neurological monitoring"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Initial Stabilization (0-10 Mins)",
        shortLabel: "Initial Stabilization (0-10 Mins)",
        color: "red",
        cards: [
          {
            title: "Phase 1: ABC & Rapid Diagnostics",
            isCritical: true,
            instructions: [
              "1. Airway/Breathing: High-flow O2 via non-rebreather. Position in recovery position.",
              "2. Glucose Check: URGENT fingerstick. If < 60 mg/dL → Give 2-5 mL/kg D10W.",
              "3. Access: Attempt IV/IO. If unsuccessful within 5 mins, move to IM/PR benzodiazepines.",
              "4. Targeted Labs: Electrolytes (Na/Ca/Mg), VBG (Lactate), and Toxicology screen."
            ]
          },
          {
            title: "1st-Line: Benzodiazepines (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "IF SEIZURE > 5 MINUTES",
            instructions: [
              "Standard: Give ONE dose. Repeat once only after 5 mins if seizure continues."
            ],
            prescriptions: [
              {
                drug: "Lorazepam (IV)",
                dose: "0.1 mg/kg (Max 4mg)",
                route: "IV / IO",
                frequency: "Repeat once if needed",
                calculation: (w) => `${(w * 0.1).toFixed(1)} mg`,
                notes: "Gold standard for IV access."
              },
              {
                drug: "Midazolam (IM/Buccal)",
                dose: "0.2 mg/kg (Max 10mg)",
                route: "IM / Buccal",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 0.2).toFixed(1)} mg`,
                notes: "Preferred if no IV access."
              }
            ]
          }
        ]
      },
      {
        label: "2nd-Line / Anticonvulsant Load (10-30 Mins)",
        shortLabel: "2nd-Line / Anticonvulsant Load (10-30 Mins)",
        color: "amber",
        cards: [
          {
            title: "2nd-Line Loading Directive (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "IF SEIZURE PERSISTS POST-BENZOS",
            isCritical: true,
            instructions: [
              "1. Action: Start loading dose immediately. Do not wait for 2nd benzo dose to finish.",
              "2. Choice: Levetiracetam is often preferred due to lower side effect profile.",
              "3. Monitoring: Continuous ECG and BP during loading."
            ],
            prescriptions: [
              {
                drug: "Levetiracetam (Keppra) IV",
                dose: "40-60 mg/kg (Max 3000mg)",
                route: "IV Infusion",
                frequency: "Over 15 minutes",
                calculation: (w) => `${(w * 40).toFixed(0)} - ${(w * 60).toFixed(0)} mg`,
                notes: "Modern 1st choice for 2nd-line."
              },
              {
                drug: "Fosphenytoin (IV)",
                dose: "20 mg PE/kg (Max 1500mg PE)",
                route: "IV Infusion",
                frequency: "Over 20 minutes",
                calculation: (w) => `${(w * 20).toFixed(0)} mg PE`,
                notes: "Rate: 3mg PE/kg/min (Max 150mg PE/min)."
              }
            ]
          }
        ]
      },
      {
        label: "Refractory Status & PICU (30-60 Mins)",
        shortLabel: "Refractory Status & PICU (30-60 Mins)",
        color: "red",
        cards: [
          {
            title: "Refractory Management",
            threshold: "SEIZURE > 30 MINS",
            isCritical: true,
            instructions: [
              "1. PICU Transfer: Mandatory. Prepare for intubation (RSI) for airway protection.",
              "2. Continuous EEG: Required to rule out non-convulsive status epilepticus (NCSE).",
              "3. Anesthetic Infusions: Transition to Midazolam, Propofol, or Thiopental infusions."
            ],
            prescriptions: [
              {
                drug: "Midazolam (IV Infusion)",
                dose: "0.15 mg/kg Load",
                route: "IV Infusion",
                frequency: "Then 1-5 mcg/kg/min",
                calculation: (w) => `Load: ${(w * 0.15).toFixed(1)} mg`,
                notes: "Titrate to burst-suppression on EEG."
              }
            ]
          }
        ]
      },
      {
        label: "Post-Ictal Recovery & Maintenance",
        shortLabel: "Post-Ictal Recovery & Maintenance",
        color: "emerald",
        cards: [
          {
            title: "Post-Status Workup",
            instructions: [
              "1. Imaging: MRI Brain preferred after stabilization to identify structural causes.",
              "2. CSF: Mandatory if fever or unknown etiology (Meningitis/Encephalitis).",
              "3. Maintenance: Start or adjust regular AEDs (Anti-Epileptic Drugs)."
            ]
          },
          {
            title: "Long-Term Management",
            instructions: [
              "1. EEG: Outpatient sleep-deprived EEG within 2-4 weeks.",
              "2. Rescue: Provide Midazolam or Diazepam rescue plan for home use.",
              "3. Clinic: Referral to Pediatric Neurology."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'severe', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AES: Evidence-Based Guideline for Status Epilepticus", url: "https://www.aesnet.org/clinical-care/clinical-guidelines" },
    { title: "NICE Guideline: Epilepsies in children and young people", url: "https://www.nice.org.uk/guidance/ng217" },
    { title: "RCH Melbourne: Status Epilepticus CPG", url: "https://www.rch.org.au/clinicalguide/guideline_index/Status_Epilepticus/" }
  ],
};
