import type { DiseaseProtocol, FormData, Severity } from './types';

export const alteredMentalStatusProtocol: DiseaseProtocol = {
  id: 'altered-mental-status',
  name: 'Altered Mental Status',
  system: 'Neurology',
  description: 'A systematic approach to the child with altered mental status, using the "AEIOU-TIPS" mnemonic.',
  image: {
    url: "https://picsum.photos/seed/altered-mental-status/600/400",
    hint: "confused child"
  },
  questions: [
    { id: 'gcs', questionText: 'Glasgow Coma Scale (GCS) Score', type: 'number' },
    { id: 'fever', questionText: 'Is there a fever?', type: 'boolean' },
    { id: 'trauma', questionText: 'Any history or signs of trauma?', type: 'boolean' },
    { id: 'seizure', questionText: 'Is the patient actively seizing or in a post-ictal state?', type: 'boolean' },
    { id: 'ingestion', questionText: 'Could there be a toxic ingestion?', type: 'boolean' },
    { id: 'glucose', questionText: 'Point-of-care glucose level', type: 'number', unit: 'mg/dL' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const gcs = Number(data.gcs);
    if (gcs <= 8) {
      return { level: 'severe', details: ["GCS ≤ 8 indicates coma and requires immediate airway protection."] };
    }
    if (gcs <= 12) {
      return { level: 'moderate', details: ["Significant alteration in mental status (GCS 9-12). Urgent evaluation required."] };
    }
    return { level: 'mild', details: ["Mild alteration in mental status (GCS 13-14)."] };
  },
  getManagement: (severity, data) => {
    const management = [{
        title: "Immediate Stabilization (ABCs)",
        recommendations: [
            "Assess Airway, Breathing, Circulation. If GCS ≤ 8, prepare for intubation.",
            "Administer 100% oxygen.",
            "Establish IV/IO access.",
            "Check a rapid blood glucose. If hypoglycemic, administer dextrose.",
            "Consider Naloxone if opioid overdose is suspected."
        ]
    }];

    management.push({
        title: "Differential Diagnosis & Workup (AEIOU-TIPS)",
        recommendations: [
            "A (Alcohol, Abuse): Consider ingestion and non-accidental trauma.",
            "E (Epilepsy, Encephalopathy, Electrolytes): Check for post-ictal state, signs of CNS infection, and check labs.",
            "I (Insulin): Check for hypoglycemia or DKA.",
            "O (Overdose, Oxygen): Consider toxicology and check for hypoxia.",
            "U (Uremia): Consider renal failure.",
            "T (Trauma, Temperature): Full trauma evaluation and check for fever/hypothermia.",
            "I (Infection): Sepsis, meningitis, encephalitis are key considerations. Perform workup as indicated.",
            "P (Psychiatric, Poison): Consider psychiatric causes and various poisons.",
            "S (Stroke, Shock, Space-occupying lesion): Evaluate for signs of stroke, shock, or increased ICP."
        ]
    });
    
    management.push({
        title: "Initial Diagnostic Workup",
        recommendations: [
            "Labs: CBC, comprehensive metabolic panel, ammonia, lactate, blood gas, coagulation studies, toxicology screen, blood culture.",
            "Imaging: Head CT for trauma, suspected bleed, or signs of increased ICP.",
            "Lumbar Puncture: For suspected CNS infection, after ruling out increased ICP.",
            "EEG: For suspected non-convulsive status epilepticus."
        ]
    });

    return management;
  },
  getDisposition: (severity, data) => {
    return ["All children with a persistent, unexplained change in mental status require hospital admission for diagnosis and management.", "Patients with a GCS ≤ 8 require PICU admission."];
  },
  getRedFlags: () => [
    "GCS ≤ 8",
    "Signs of impending herniation (Cushing's triad: hypertension, bradycardia, irregular respirations; pupillary changes).",
    "Non-convulsive seizure activity on EEG.",
    "Rapidly deteriorating mental status.",
    "Signs of non-accidental trauma."
  ],
  getDrugDoses: () => [
    { drugName: "Dextrose (D10W for <1yr)", dose: "5 mL/kg", notes: "For hypoglycemia." },
    { drugName: "Dextrose (D25W for >1yr)", dose: "2 mL/kg", notes: "For hypoglycemia." },
    { drugName: "Naloxone (Narcan)", dose: "0.1 mg/kg (max 2 mg)", notes: "For suspected opioid overdose. Can be repeated." },
  ],
  getReferences: () => [{ title: "UpToDate: Evaluation of stupor and coma in children", url: "https://www.uptodate.com/contents/evaluation-of-stupor-and-coma-in-children" }],
};
