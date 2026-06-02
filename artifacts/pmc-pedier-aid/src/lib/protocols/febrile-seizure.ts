import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const febrileSeizureProtocol: DiseaseProtocol = {
  id: 'febrile-seizure',
  name: 'Febrile Seizure',
  system: 'Neurological System',
  description: 'Evaluation and management of a child presenting with a febrile seizure based on AAP guidelines.',
  image: {
    url: "https://picsum.photos/seed/febrile-seizure/600/400",
    hint: "child temperature"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
    { id: 'duration', questionText: 'Seizure duration (minutes)', type: 'number' },
    { id: 'type', questionText: 'Seizure type', type: 'select', options: [{label: 'Generalized tonic-clonic', value: 'gtc'}, {label: 'Focal (starts in one limb/side)', value: 'focal'}] },
    { id: 'recurrence', questionText: 'Recurrent seizure within the same 24-hour period?', type: 'boolean' },
    { id: 'postIctal', questionText: 'Post-ictal mental status', type: 'select', options: [{label: 'Returned to baseline', value: 'normal'}, {label: 'Prolonged drowsiness or deficit', value: 'abnormal'}] },
    { id: 'immunization', questionText: 'Are Hib and Prevnar immunizations up to date?', type: 'boolean' },
    { id: 'neckStiff', questionText: 'Signs of Meningism? (Neck stiffness, bulging fontanelle)', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const age = Number(data.ageMonths || 0);
    const duration = Number(data.duration || 0);

    // Complex Febrile Seizure Criteria:
    // 1. Focal onset or focal features
    // 2. Duration > 15 minutes
    // 3. Recurrence within 24 hours
    
    const isComplex = 
        data.type === 'focal' || 
        duration >= 15 || 
        data.recurrence === true;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Simple Febrile Seizure';

    if (data.neckStiff === true || data.postIctal === 'abnormal') {
        level = 'severe';
        interpretation = 'SUSPECTED MENINGITIS / CNS INFECTION';
        details.push("Urgent Lumbar Puncture may be indicated.");
    } else if (isComplex) {
        level = 'moderate';
        interpretation = 'Complex Febrile Seizure';
    }

    if (data.immunization === false && age < 12) {
        details.push("Incomplete immunizations: Lower threshold for Lumbar Puncture in febrile infants.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Febrile Seizure Classification",
        totalScore: isComplex ? 1 : 0,
        interpretation,
        referenceTable: [
          { range: "Simple", meaning: "Generalized, <15 min, No recurrence in 24h" },
          { range: "Complex", meaning: "Focal, ≥15 min, OR Recurrent in 24h" },
          { range: "CNS Infection", meaning: "Suspected if neck stiffness or prolonged AMS" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
        return [{
            title: "Meningitis / CNS Infection Management",
            recommendations: [
                "URGENT: Initiate sepsis/meningitis workup (CBC, Blood culture, LP).",
                "Start IV Antibiotics (Ceftriaxone + Vancomycin) immediately after cultures.",
                "Consider Acyclovir if encephalitis suspected.",
                "Admit for close neurological monitoring."
            ]
        }];
    }

    if (severity.level === 'moderate') {
        return [{
            title: "Complex Febrile Seizure Management",
            recommendations: [
                "Identify and treat source of fever.",
                "Observe in ED for at least 4-6 hours.",
                "Consider Lumbar Puncture especially if <12 months or clinical concern.",
                "Neuroimaging (CT) generally NOT needed unless focal deficit or trauma suspected.",
                "Ensure follow-up with Pediatrics/Neurology."
            ]
        }];
    }

    return [{
        title: "Simple Febrile Seizure Management",
        recommendations: [
            "Reassure parents: Benign condition, low risk of future epilepsy (~1-2%).",
            "Identify focus of fever (Full physical exam).",
            "Provide antipyretics (Paracetamol/Ibuprofen) for comfort.",
            "No routine labs, LP, or imaging required if child is at baseline.",
            "Discharge with clear education and return precautions."
        ]
    }];
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Immediate Admission for workup."];
    if (severity.level === 'moderate') return ["Admit or observe for 6h; consider Neurology consult."];
    return ["Discharge home with primary care follow-up."];
  },
  getRedFlags: () => ["Focal seizure", "Duration > 15 min", "Neck stiffness", "Bulging fontanelle", "Persistent drowsiness"],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight || 0);
    return [
      { drugName: "Paracetamol", dose: weight > 0 ? `${(15 * weight).toFixed(0)} mg PO/PR` : "15 mg/kg every 4-6h" },
      { drugName: "Ibuprofen", dose: weight > 0 ? `${(10 * weight).toFixed(0)} mg PO` : "10 mg/kg every 6-8h" }
    ];
  },
  getReferences: () => [
    { title: "AAP Clinical Practice Guideline: Febrile Seizures", url: "https://publications.aap.org/" }
  ],
};
