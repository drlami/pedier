import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const headacheRedFlagsProtocol: DiseaseProtocol = {
  id: 'headache-red-flags',
  name: 'Headache Red Flags (SNOOPP)',
  system: 'Neurological System',
  description: 'Screening for secondary causes of pediatric headache using formal red flag criteria.',
  image: {
    url: "https://picsum.photos/seed/headache/600/400",
    hint: "headache pain"
  },
  questions: [
    { id: 'systemic', questionText: 'Systemic symptoms? (Fever, weight loss, cancer hx)', type: 'boolean' },
    { id: 'neurologic', questionText: 'Neurologic signs? (Focal deficit, ataxia, papilledema)', type: 'boolean' },
    { id: 'onset', questionText: 'Onset sudden? (Thunderclap/Peak in <1 min)', type: 'boolean' },
    { id: 'ageYoung', questionText: 'Age < 5 years?', type: 'boolean' },
    { id: 'progressive', questionText: 'Progressive pattern? (Increasing frequency/severity)', type: 'boolean' },
    { id: 'positional', questionText: 'Positional? (Worse when lying down or in morning)', type: 'boolean' },
    { id: 'precipitated', questionText: 'Precipitated by cough, valsalva, or exercise?', type: 'boolean' },
    { id: 'wakesFromSleep', questionText: 'Headache awakens child from sleep?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let redFlagCount = 0;

    const flags = [
        data.systemic, data.neurologic, data.onset, data.ageYoung,
        data.progressive, data.positional, data.precipitated, data.wakesFromSleep
    ];
    redFlagCount = flags.filter(Boolean).length;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Likely Primary Headache (Migraine/Tension)';

    if (data.onset === true || data.neurologic === true || data.positional === true) {
      level = 'severe';
      interpretation = 'URGENT SECONDARY CONCERN';
      details.push("High risk for structural lesion, hemorrhage, or increased ICP.");
    } else if (redFlagCount >= 1) {
      level = 'moderate';
      interpretation = 'Requires Further Investigation';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Headache Red Flags (SNOOPP)",
        totalScore: redFlagCount,
        maxScore: 8,
        interpretation,
        referenceTable: [
          { range: "Onset/Positional", meaning: "URGENT CT/MRI indicated" },
          { range: "1+ Flags", meaning: "Consider semi-urgent MRI" },
          { range: "0 Flags", meaning: "Treat as primary headache" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "Secondary Headache Management",
        recommendations: [
          "Obtain emergent Neuroimaging: CT for sudden onset (bleed); MRI for positional/progressive (tumor).",
          "Perform fundoscopy to rule out papilledema.",
          "Consult Neurology.",
          "If fever present, evaluate for Meningitis (LP after imaging)."
        ]
      }];
    }
    return [{
      title: "Primary Headache Management",
      recommendations: [
        "Symptomatic relief: Ibuprofen 10mg/kg or Paracetamol 15mg/kg.",
        "Provide quiet, dark environment.",
        "Identify triggers (sleep, hydration, screen time).",
        "Maintain a headache diary."
      ]
    }];
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Admit for workup and monitoring."];
    return ["Discharge home with primary care follow-up."];
  },
  getRedFlags: () => ["Morning vomiting", "Thunderclap onset", "Papilledema", "Wakes from sleep", "Personality change"],
  getDrugDoses: (severity, data) => [
      { drugName: "Ibuprofen (Oral)", dose: "10 mg/kg per dose" },
      { drugName: "Paracetamol (Oral)", dose: "15 mg/kg per dose" }
  ],
  getReferences: () => [
    { title: "AAN: Evaluation of recurrent headaches in children", url: "https://www.aan.com/" }
  ],
};
