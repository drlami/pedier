import type { DiseaseProtocol, FormData, Severity } from './types';

export const febrileSeizureProtocol: DiseaseProtocol = {
  id: 'febrile-seizure',
  name: 'Febrile Seizure',
  system: 'Neurology',
  description: 'Evaluation and management of a child presenting with a febrile seizure.',
  image: {
    url: "https://picsum.photos/seed/febrile-seizure/600/400",
    hint: "child temperature"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
    { id: 'seizureDuration', questionText: 'Seizure duration in minutes', type: 'number' },
    { id: 'seizureType', questionText: 'Seizure type', type: 'select', options: [{label: 'Generalized tonic-clonic', value: 'gtc'}, {label: 'Focal', value: 'focal'}] },
    { id: 'multipleSeizures', questionText: 'More than one seizure in 24 hours?', type: 'boolean' },
    { id: 'postIctalState', questionText: 'Post-ictal state', type: 'select', options: [{label: 'Returned to baseline', value: 'baseline'}, {label: 'Prolonged drowsiness or focal deficit', value: 'prolonged'}] },
    { id: 'neuroHistory', questionText: 'Any history of neurologic problems or developmental delay?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const isSimple = 
      Number(data.ageMonths) >= 6 &&
      Number(data.ageMonths) <= 60 &&
      data.seizureType === 'gtc' &&
      Number(data.seizureDuration) < 15 &&
      !data.multipleSeizures &&
      data.postIctalState === 'baseline' &&
      !data.neuroHistory;

    if (isSimple) {
      details.push("Patient meets all criteria for a simple febrile seizure.");
      return { level: 'mild', details };
    }

    if (Number(data.seizureDuration) >= 15) details.push("Duration ≥ 15 minutes");
    if (data.seizureType === 'focal') details.push("Focal features");
    if (data.multipleSeizures) details.push("Multiple seizures in 24h");
    if (Number(data.ageMonths) < 6 || Number(data.ageMonths) > 60) details.push("Age outside typical range (6-60 months)");
    if (data.postIctalState === 'prolonged') details.push("Prolonged post-ictal period or focal deficit (Todd's paralysis)");
    
    details.push("Features suggest a complex febrile seizure.");
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'mild') {
      return [{
        title: "Simple Febrile Seizure Management",
        recommendations: [
          "Focus on identifying the source of the fever. A full physical exam is essential.",
          "Provide antipyretics (e.g., Acetaminophen, Ibuprofen) for comfort.",
          "Reassure caregivers: Simple febrile seizures are common, benign, and do not cause brain damage. The risk of developing epilepsy is very low (~1-2%).",
          "No routine lab work (CBC, electrolytes, glucose), imaging, or EEG is recommended for a first simple febrile seizure.",
          "Lumbar puncture should be considered in infants < 12 months with uncertain immunization status or if signs of meningitis are present."
        ]
      }];
    }
    return [{
      title: "Complex Febrile Seizure Management",
      recommendations: [
        "Focus on identifying the source of the fever and evaluating for more serious underlying causes.",
        "Consider a broader workup, including labs (glucose, electrolytes) and potentially neuroimaging (CT/MRI) if there are focal features or prolonged altered mental status.",
        "Lumbar puncture should be strongly considered, especially in younger infants or those with concerning exams.",
        "Admission for observation is often warranted for complex febrile seizures to monitor for recurrence or other neurologic changes."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'mild') {
      return ["Discharge home is appropriate for a first simple febrile seizure in a well-appearing child once the source of fever is identified and caregivers are educated and reassured.", "Ensure follow-up with primary care."];
    }
    return ["Admission should be strongly considered for all complex febrile seizures to allow for further observation, investigation, and consultation with neurology if needed."];
  },
  getRedFlags: () => [
    "Seizure duration > 15 minutes (febrile status epilepticus).",
    "Focal seizure features.",
    "Multiple seizures in the same febrile illness.",
    "Signs of meningitis or CNS infection (bulging fontanelle, nuchal rigidity, persistent altered mental status).",
    "Failure to return to baseline mental status after a brief post-ictal period."
  ],
  getDrugDoses: () => [
    { drugName: "Acetaminophen", dose: "15 mg/kg per dose every 4-6 hours" },
    { drugName: "Ibuprofen (>6 months)", dose: "10 mg/kg per dose every 6-8 hours" }
  ],
  getReferences: () => [{ title: "AAP Clinical Practice Guideline: Febrile Seizures", url: "https://publications.aap.org/pediatrics/article/127/2/389/64837/Febrile-Seizures-Guideline-for-the-Neurodiagnostic" }],
};
