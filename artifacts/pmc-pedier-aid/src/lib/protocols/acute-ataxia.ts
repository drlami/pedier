import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const acuteAtaxiaProtocol: DiseaseProtocol = {
  id: 'acute-ataxia',
  name: 'Acute Ataxia (Unsteady Gait)',
  system: 'Neurology',
  description: 'Assessment of acute imbalance or gait abnormality in children.',
  image: {
    url: "https://picsum.photos/seed/ataxia/600/400",
    hint: "child stumbling"
  },
  questions: [
    { id: 'age', questionText: 'Patient Age', type: 'number', unit: 'years' },
    { id: 'onset', questionText: 'Sudden onset?', type: 'boolean' },
    { id: 'focalDeficit', questionText: 'Focal deficit? (e.g. cranial nerve palsy, weakness)', type: 'boolean' },
    { id: 'increasedIcp', questionText: 'Signs of increased ICP? (e.g. morning vomiting, headache)', type: 'boolean' },
    { id: 'toxicPossible', questionText: 'Possibility of toxic ingestion? (Ethanol, Anticonvulsants)', type: 'boolean' },
    { id: 'opsoclonus', questionText: 'Opsoclonus-Myoclonus? (Chaotic eye movements)', type: 'boolean', info: 'Highly suggestive of Neuroblastoma.' },
    { id: 'recentInfection', questionText: 'Recent viral infection or varicella?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let riskCount = 0;

    if (data.focalDeficit) riskCount += 2;
    if (data.increasedIcp) riskCount += 2;
    if (data.opsoclonus) riskCount += 3;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Likely Post-Infectious Cerebellitis';

    if (riskCount >= 2 || data.opsoclonus === true) {
      level = 'severe';
      interpretation = 'URGENT STRUCTURAL/NEOPLASTIC CONCERN';
      if (data.opsoclonus) details.push("Opsoclonus-Myoclonus identified: URGENT screening for Neuroblastoma required.");
    } else if (data.toxicPossible === true) {
      level = 'moderate';
      interpretation = 'SUSPECTED TOXIC INGESTION';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Ataxia Differential Risk",
        totalScore: riskCount,
        maxScore: 7,
        interpretation,
        referenceTable: [
          { range: "Opsoclonus", meaning: "Suspect Neuroblastoma" },
          { range: "Focal/ICP signs", meaning: "Suspect Tumor or Hemorrhage" },
          { range: "Toxic", meaning: "Ethanol, Benzos, or Anticonvulsants" },
          { range: "Isolated", meaning: "Post-Infectious (Most common)" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Urgent Neuro-Oncology Workup",
          recommendations: [
            "Urgently obtain Brain MRI (Post-fossa focus).",
            "Consult Neurology and Oncology.",
            "If Opsoclonus: Search for Neuroblastoma (Chest/Abd CT, Urine catecholamines).",
            "Monitor for neurological deterioration."
          ]
        }];
      case 'moderate':
        return [{
          title: "Toxicology Management",
          recommendations: [
            "Check serum Ethanol, Anticonvulsant levels.",
            "Comprehensive Toxicology Screen (Urine/Serum).",
            "Maintain safety; monitor for respiratory depression.",
            "Consult Poison Control Center."
          ]
        }];
      default:
        return [{
          title: "Post-Infectious Management",
          recommendations: [
            "Clinical observation is key.",
            "Most cases resolve in 2-4 weeks without treatment.",
            "Ensure child is at baseline except for the ataxia.",
            "Follow-up with Pediatrics in 48-72h."
          ]
        }];
    }
  },
  getDisposition: (severity) => ["All new-onset ataxia cases require expert review. Moderate/Severe cases require admission."],
  getRedFlags: () => ["Morning vomiting", "Opsoclonus (chaotic eyes)", "Cranial nerve palsies", "History of trauma"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "UpToDate: Acute ataxia in children", url: "https://www.uptodate.com/" }
  ],
};
