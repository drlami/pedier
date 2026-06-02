import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Status Epilepticus (Post-Acute Management)
 * MASTER MANAGEMENT PATHWAY (MMP)
 */
export const wardStatusEpilepticusProtocol: DiseaseProtocol = {
  id: 'ward-status-epilepticus',
  name: 'Status Epilepticus Master Pathway',
  system: 'Neurological System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Post-acute management of Status Epilepticus centers on maintaining seizure freedom, loading maintenance antiepileptic drugs (AEDs), and investigating the underlying etiology. This pathway picks up after the ER has stabilized the acute event.',
  image: {
    url: "https://images.unsplash.com/photo-1559757114-190bb6969b47?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "EEG and seizure monitoring"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'history', questionText: 'Known Epilepsy?', type: 'boolean' },
    { id: 'fever', questionText: 'Fever or Signs of Meningismus?', type: 'boolean' },
    { id: 'gcs', questionText: 'Current GCS (Post-ictal)', type: 'number' },
  ], 

  mmpData: {
    snapshot: "Ward management focuses on preventing breakthrough seizures by loading maintenance AEDs (Levetiracetam, Phenytoin, or Valproate) and optimizing the previous home regimen. Investigating the cause (Metabolic, Infectious, Structural) is paramount. Continuous or serial EEG is the gold standard for detecting non-convulsive status epilepticus in patients who do not fully recover their baseline mental status.",
    stages: [
      {
        label: "Stage 1: Step 0 - Maintenance Loading",
        shortLabel: "AED Loading",
        color: "blue",
        cards: [
          {
            title: "Maintenance Drug Loading [DR]",
            threshold: "IMMEDIATE POST-ACUTE",
            calculator: {
              id: "aed-loading-calc",
              title: "Maintenance AED Loading Calculator"
            },
            orders: [
              "Levetiracetam (Keppra): 20 to 40 mg/kg IV loading dose; maintenance 10-30 mg/kg twice daily.",
              "Phenytoin/Fosphenytoin: 20 mg PE/kg IV (requires ECG and BP monitoring). Max 1000mg.",
              "Sodium Valproate: 20 to 40 mg/kg IV loading dose; maintenance 10-15 mg/kg twice to three times daily.",
              "Selection: Base selection on patient's previous response, potential side effects, and epilepsy syndrome."
            ],
            prescriptions: [
              {
                drug: "Levetiracetam (Keppra) Load",
                dose: "40 mg/kg",
                route: "IV",
                frequency: "STAT (Once)",
                calculation: (w) => `${(w * 40).toFixed(0)} mg`,
                notes: "Infuse over 15 minutes. Good for all ages."
              },
              {
                drug: "Sodium Valproate Load",
                dose: "40 mg/kg",
                route: "IV",
                frequency: "STAT (Once)",
                calculation: (w) => `${(w * 40).toFixed(0)} mg`,
                notes: "Avoid in patients with suspected mitochondrial or metabolic disease."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Etiology & Diagnostic Workup",
        shortLabel: "Etiology",
        color: "amber",
        cards: [
          {
            title: "Diagnostic Directives [DR]",
            orders: [
              "EEG (Electroencephalogram): Perform within 24 hours. Mandatory if GCS remains low to rule out Non-Convulsive Status Epilepticus (NCSE).",
              "MRI Brain: Indicated for new-onset status, focal seizures, or focal neurological deficits.",
              "Lumbar Puncture: Mandatory if febrile OR if etiology remains unknown after initial labs.",
              "Metabolic Screening: Ammonia, Lactate, Plasma Amino Acids, and Urine Organic Acids if no clear trigger found."
            ]
          },
          {
            title: "Nursing: Seizure Precautions [NS]",
            isCritical: true,
            nursing: [
              "Establish seizure precautions: Padded side rails, suction available, oxygen at bedside.",
              "Monitor GCS and orientation every 2-4 hours.",
              "Keep emergency rescue drug (e.g., Midazolam) at bedside with calculated dose."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Transition & Triggers",
        shortLabel: "Stabilization",
        color: "red",
        cards: [
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF Breakthrough seizures occur despite loading of a maintenance AED.",
              "IF GCS remains < 12 after 4 hours of post-ictal recovery.",
              "IF EEG shows ongoing subclinical seizure activity.",
              "IF New focal neurological deficits or signs of raised ICP develop."
            ]
          },
          {
            title: "Transition to Oral Therapy",
            orders: [
              "Criteria: 24 hours seizure-free on IV maintenance drugs and patient is alert and swallowing safely.",
              "Conversion: Use 1:1 dose ratio for Levetiracetam and Valproate transition from IV to Oral.",
              "Education: Ensure family understands the importance of dose timing and has a rescue plan."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const gcs = Number(data.gcs);
    if (gcs < 10 || data.fever) return { level: 'critical', details: ["High-risk Post-Acute SE: Risk of CNS infection or non-convulsive status. ICU/Neurology required."] };
    if (!data.history) return { level: 'severe', details: ["New-onset SE: Requires exhaustive structural/metabolic workup."] };
    return { level: 'moderate', details: ["Stabilized SE: Proceed with maintenance optimization."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Seizure-free for > 24 hours on oral maintenance therapy.",
    "Mental status returned to baseline (or stable plateau).",
    "MRI Brain and EEG reviewed by Neurology.",
    "Home rescue plan (e.g. Buccal Midazolam) provided and family trained.",
    "Follow-up scheduled with Pediatric Neurology in 2-4 weeks."
  ],
  getRedFlags: [
    "Brief repetitive jerking (Myoclonus)",
    "Focal weakness (Todd's Paralysis)",
    "Persistent confusion or strange behavior",
    "Fever and neck stiffness",
    "Asymmetric pupils"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AES: Clinical Guidance: Status Epilepticus", url: "https://www.aesnet.org/clinical-care/clinical-guidance" },
    { title: "RCH Melbourne: Seizures and Status Epilepticus", url: "https://www.rch.org.au/clinicalguide/guideline_index/Seizures/" }
  ],
};
