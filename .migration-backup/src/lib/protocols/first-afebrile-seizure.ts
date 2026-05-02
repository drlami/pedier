import type { DiseaseProtocol, FormData, Severity } from './types';

export const firstAfebrileSeizureProtocol: DiseaseProtocol = {
  id: 'first-afebrile-seizure',
  name: 'First Afebrile Seizure',
  system: 'Neurology',
  description: 'Evaluation and management of a child after a first-time, unprovoked (afebrile) seizure.',
  image: {
    url: "https://picsum.photos/seed/first-afebrile-seizure/600/400",
    hint: "brain scan"
  },
  questions: [
    { id: 'seizureDescription', questionText: 'Was the event a definite seizure?', type: 'boolean', info: 'e.g., rhythmic shaking, post-ictal state, loss of consciousness vs. syncope, breath-holding, etc.' },
    { id: 'seizureType', questionText: 'Seizure type', type: 'select', options: [{label: 'Generalized', value: 'generalized'}, {label: 'Focal', value: 'focal'}] },
    { id: 'duration', questionText: 'Duration of the event', type: 'number', unit: 'minutes' },
    { id: 'postIctalState', questionText: 'Post-ictal state', type: 'select', options: [{label: 'Returned to baseline quickly', value: 'baseline'}, {label: 'Prolonged confusion or focal deficit (Todd\'s paralysis)', value: 'prolonged'}] },
    { id: 'historyTrauma', questionText: 'Any history of recent head trauma?', type: 'boolean' },
    { id: 'historyIngestion', questionText: 'Any possibility of toxic ingestion?', type: 'boolean' },
    { id: 'neuroDeficit', questionText: 'New focal neurologic deficit on exam?', type: 'boolean' },
  ],
  calculateSeverity: (severityData: FormData): Severity => {
    // For a first afebrile seizure, 'severity' relates to the urgency of workup.
    const details: string[] = [];

    if (severityData.postIctalState !== 'baseline' || severityData.neuroDeficit) {
      if (severityData.postIctalState === 'prolonged') details.push("Prolonged post-ictal state or Todd's paralysis.");
      if (severityData.neuroDeficit) details.push("New focal neurologic deficit.");
      details.push("These findings warrant urgent neuroimaging and neurology consultation.");
      return { level: 'severe', details };
    }

    if (severityData.seizureType === 'focal') {
        details.push("Focal onset seizure increases suspicion for a structural brain lesion.");
        return { level: 'moderate', details };
    }

    details.push("Provoked causes (trauma, ingestion, metabolic) must be ruled out.");
    details.push("Patient appears to have had a first unprovoked generalized seizure and has returned to baseline.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch(severity.level) {
      case 'severe':
        return [{
          title: "Urgent Management",
          recommendations: [
            "Obtain emergent non-contrast head CT to rule out hemorrhage or other acute pathology.",
            "Obtain urgent neurology consultation.",
            "Consider labs: CBC, electrolytes, calcium, magnesium, glucose, and toxicology screen.",
            "Admit to hospital for continuous monitoring and further workup, likely including MRI and EEG."
          ]
        }];
      case 'moderate':
        return [{
          title: "Focal Seizure Management",
          recommendations: [
            "Neurology consultation is recommended.",
            "Neuroimaging (MRI preferred over CT) should be obtained.",
            "Consider labs, including glucose, electrolytes, and toxicology screen.",
            "Decision for admission vs. outpatient workup depends on clinical context, reliability of follow-up, and neurologist recommendation."
          ]
        }];
      default: // mild
        return [{
          title: "Uncomplicated Generalized Seizure Management",
          recommendations: [
            "A thorough history and physical exam are the most important tools.",
            "Labs are generally low-yield if the child has returned to baseline and has a normal neurologic exam, but consider checking glucose.",
            "Neuroimaging is NOT routinely recommended for a first unprovoked generalized seizure with a normal exam.",
            "Outpatient neurology follow-up and EEG should be arranged.",
            "Provide counseling on seizure safety/precautions (e.g., swimming, bathing)."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to the hospital for urgent workup and neurology consultation."];
    }
    if (severity.level === 'moderate') {
      return ["Admission is often appropriate for prompt neuroimaging and consultation. Outpatient management may be possible for well-appearing children with excellent follow-up."];
    }
    return ["Discharge home is often appropriate after a period of observation if the child has returned to neurologic baseline.", "Ensure outpatient neurology follow-up is arranged.", "Provide strict return precautions."];
  },
  getRedFlags: () => [
    "Failure to return to baseline mental status.",
    "New and persistent focal neurologic deficit.",
    "Signs of increased intracranial pressure (papilledema, persistent vomiting, headache).",
    "Suspicion of CNS infection (fever, nuchal rigidity).",
    "History of significant head trauma.",
    "Seizure in the context of developmental regression."
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "AAN/AES Practice Parameter: Evaluating a first nonfebrile seizure in children", url: "https://www.aan.com/Guidelines/home/GuidelineDetail/321" }],
};
