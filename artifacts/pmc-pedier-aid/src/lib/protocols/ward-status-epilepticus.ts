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
  description: 'Status Epilepticus is a medical emergency characterized by a single seizure lasting more than five minutes or recurrent seizures without a return to baseline mental status between episodes. This exhaustive directive covers stepwise benzodiazepine protocols, second-line loading doses, and Pediatric Intensive Care Unit (PICU) refractory management.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical neurological monitoring"
  },
  questions: [], 

  mmpData: {
    snapshot: "Status Epilepticus management is a time-critical race against neuronal injury. The management philosophy follows the '10-20-30' rule: (1) Stop the seizure within 10 minutes using Benzodiazepines, (2) Load with long-acting Anticonvulsants by 20 minutes if refractory, and (3) Secure the airway and escalate to Intensive Care for anesthetic infusions if the seizure exceeds 30-60 minutes. Early glucose checks and stabilization of physiology are as critical as the medications themselves.",
    stages: [
      {
        label: "Stage 1: Initial Stabilization (0-10 Minutes)",
        shortLabel: "Stabilization",
        color: "red",
        cards: [
          {
            title: "Phase 1: Airway, Breathing, Circulation & Rapid Diagnostics",
            isCritical: true,
            orders: [
              "1. Airway/Breathing: High-flow Oxygen via non-rebreather mask. Position in recovery position.",
              "2. Glucose Check: URGENT fingerstick. If Blood Glucose < 60 mg/dL → Give 2-5 mL/kg 10% Dextrose (D10W).",
              "3. Access: Attempt Intravenous or Intraosseous access. If unsuccessful within 5 minutes, move to Intramuscular or Rectal benzodiazepines.",
              "4. Targeted Laboratory Tests: Electrolytes (Sodium, Calcium, Magnesium), Venous Blood Gas (Lactate), and Toxicology screen."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Monitor Oxygen Saturation, Heart Rate, and Respiratory Rate continuously.",
              "Record Blood Pressure every 5-15 minutes during drug loading.",
              "Maintain strict seizure safety: side rails up, padded bed, suction and oxygen ready at bedside.",
              "Record the exact duration and semiology of the seizure (e.g., focal versus generalized).",
              "Check Blood Glucose levels immediately and repeat if mental status remains altered."
            ]
          },
          {
            title: "1st-Line Physician Orders: Benzodiazepines [DR]",
            threshold: "IF SEIZURE > 5 MINUTES",
            orders: [
              "Standard: Give ONE dose. Repeat once only after 5 minutes if seizure continues."
            ],
            prescriptions: [
              {
                drug: "Lorazepam (Intravenous)",
                dose: "0.1 mg/kg (Maximum 4mg)",
                route: "Intravenous / Intraosseous",
                frequency: "Repeat once if needed",
                calculation: (w) => `${(w * 0.1).toFixed(1)} mg`,
                notes: "Gold standard for Intravenous access."
              },
              {
                drug: "Midazolam (Intramuscular/Buccal)",
                dose: "0.2 mg/kg (Maximum 10mg)",
                route: "Intramuscular / Buccal",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 0.2).toFixed(1)} mg`,
                notes: "Preferred if no Intravenous access."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Anticonvulsant Loading (10-30 Minutes)",
        shortLabel: "Loading",
        color: "amber",
        cards: [
          {
            title: "2nd-Line Loading Directive [DR]",
            threshold: "IF SEIZURE PERSISTS POST-BENZOS",
            isCritical: true,
            orders: [
              "1. Action: Start loading dose immediately. Do not wait for second benzodiazepine dose to finish.",
              "2. Choice: Levetiracetam is often preferred due to lower side effect profile.",
              "3. Monitoring: Continuous Electrocardiogram and Blood Pressure during loading."
            ],
            prescriptions: [
              {
                drug: "Levetiracetam (Keppra) Intravenous",
                dose: "40-60 mg/kg (Maximum 3000mg)",
                route: "Intravenous Infusion",
                frequency: "Over 15 minutes",
                calculation: (w) => `${(w * 40).toFixed(0)} - ${(w * 60).toFixed(0)} mg`,
                notes: "Modern 1st choice for 2nd-line."
              },
              {
                drug: "Fosphenytoin (Intravenous)",
                dose: "20 mg PE/kg (Maximum 1500mg PE)",
                route: "Intravenous Infusion",
                frequency: "Over 20 minutes",
                calculation: (w) => `${(w * 20).toFixed(0)} mg PE`,
                notes: "Rate: 3mg PE/kg/minute (Maximum 150mg PE/minute)."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Refractory Status & PICU (30-60 Minutes)",
        shortLabel: "PICU",
        color: "red",
        cards: [
          {
            title: "Refractory Management Directive [DR]",
            threshold: "SEIZURE > 30 MINUTES",
            isCritical: true,
            orders: [
              "1. Pediatric Intensive Care Unit (PICU) Transfer: Mandatory. Prepare for intubation (Rapid Sequence Induction) for airway protection.",
              "2. Continuous Electroencephalogram (EEG): Required to rule out non-convulsive status epilepticus (NCSE).",
              "3. Anesthetic Infusions: Transition to Midazolam, Propofol, or Thiopental infusions."
            ],
            prescriptions: [
              {
                drug: "Midazolam (Intravenous Infusion)",
                dose: "0.15 mg/kg Load",
                route: "Intravenous Infusion",
                frequency: "Then 1-5 mcg/kg/minute",
                calculation: (w) => `Load: ${(w * 0.15).toFixed(1)} mg`,
                notes: "Titrate to burst-suppression on Electroencephalogram."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Post-Ictal Recovery & Maintenance",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Post-Status Workup",
            orders: [
              "1. Imaging: Magnetic Resonance Imaging (MRI) of the Brain preferred after stabilization to identify structural causes.",
              "2. Cerebrospinal Fluid (CSF): Mandatory if fever is present or etiology is unknown (Meningitis/Encephalitis).",
              "3. Maintenance: Start or adjust regular Anti-Epileptic Drugs (AEDs)."
            ]
          },
          {
            title: "Long-Term Management",
            orders: [
              "1. Electroencephalogram (EEG): Outpatient sleep-deprived EEG within 2-4 weeks.",
              "2. Rescue Plan: Provide Midazolam or Diazepam rescue plan for home use.",
              "3. Clinic Referral: Referral to Pediatric Neurology."
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
