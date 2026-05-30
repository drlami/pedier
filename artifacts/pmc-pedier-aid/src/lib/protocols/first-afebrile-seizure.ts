import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

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
    { id: 'definiteSeizure', questionText: 'Was the event a definite seizure?', type: 'boolean', info: 'Rhythmic shaking, loss of consciousness, post-ictal state.' },
    { id: 'type', questionText: 'Seizure type', type: 'select', options: [{label: 'Generalized', value: 'generalized'}, {label: 'Focal (one limb/side)', value: 'focal'}] },
    { id: 'returnedToBaseline', questionText: 'Returned to baseline mental status?', type: 'boolean' },
    { id: 'newDeficit', questionText: 'New focal neurologic deficit on exam?', type: 'boolean', info: "Todd's paralysis or persistent weakness." },
    { id: 'provokedCause', questionText: 'Suspected provoked cause?', type: 'select', options: [
        {label: 'None', value: 'none'},
        {label: 'Head Trauma', value: 'trauma'},
        {label: 'Toxic Ingestion', value: 'ingestion'},
        {label: 'Hypoglycemia / Electrolyte', value: 'metabolic'}
    ]},
    { id: 'icpSigns', questionText: 'Signs of increased ICP?', type: 'boolean', info: 'Vomiting, headache, papilledema.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    const isUrgent = 
        data.returnedToBaseline === false || 
        data.newDeficit === true || 
        data.icpSigns === true ||
        data.provokedCause === 'trauma';

    let level: SeverityLevel = 'mild';
    let interpretation = 'Uncomplicated First Seizure';

    if (isUrgent) {
        level = 'severe';
        interpretation = 'URGENT EVALUATION REQUIRED';
    } else if (data.type === 'focal' || data.provokedCause !== 'none') {
        level = 'moderate';
        interpretation = 'High Probability of Structural/Metabolic Cause';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "First Seizure Risk Stratification",
        totalScore: isUrgent ? 2 : (data.type === 'focal' ? 1 : 0),
        interpretation,
        referenceTable: [
          { range: "Urgent", meaning: "Needs immediate CT and Neurosurgery/Neurology consult" },
          { range: "Moderate", meaning: "Needs MRI and Neurology follow-up" },
          { range: "Mild", meaning: "Likely unprovoked; outpatient EEG and follow-up" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
        return [{
            title: "Urgent Stabilization & Workup",
            recommendations: [
                "Obtain emergent non-contrast Head CT.",
                "Urgently consult Neurology and/or Neurosurgery.",
                "Check Glucose, Electrolytes, Calcium, and Tox Screen.",
                "Stabilize airway and maintain NPO status."
            ]
        }];
    }

    if (severity.level === 'moderate') {
        return [{
            title: "Focused Workup",
            recommendations: [
                "Neuroimaging is recommended (MRI preferred over CT for non-emergencies).",
                "Consult Neurology for further assessment.",
                "Evaluate for specific provoked causes (Labs, Toxicology)."
            ]
        }];
    }

    return [{
        title: "Standard Management (Uncomplicated)",
        recommendations: [
            "Perform thorough history and physical exam.",
            "Labs are generally low-yield if at baseline (consider Glucose).",
            "Neuroimaging NOT routinely recommended for first generalized seizure with normal exam.",
            "Arrange outpatient EEG and Neurology follow-up.",
            "Provide seizure safety counseling (bathing, swimming, heights)."
        ]
    }];
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Immediate Admission."];
    if (severity.level === 'moderate') return ["Admission or prompt outpatient MRI/Consult."];
    return ["Discharge home with follow-up instructions."];
  },
  getRedFlags: () => ["Persistent AMS", "Focal deficit", "Signs of ICP", "History of trauma"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAN Practice Parameter: Evaluation of First Nonfebrile Seizure", url: "https://www.aan.com/" }
  ],
};
