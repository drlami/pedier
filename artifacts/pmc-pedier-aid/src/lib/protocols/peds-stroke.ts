import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const pedsStrokeProtocol: DiseaseProtocol = {
  id: 'peds-stroke',
  name: 'Pediatric Stroke (ACT FAST)',
  system: 'Neurological System',
  description: 'Emergency identification and initial management of acute pediatric stroke.',
  image: {
    url: "https://picsum.photos/seed/peds-stroke/600/400",
    hint: "child brain"
  },
  questions: [
    { id: 'onsetHours', questionText: 'Time since Last Known Well (Hours)', type: 'number' },
    { id: 'facialDroop', questionText: 'New facial droop?', type: 'boolean' },
    { id: 'armWeakness', questionText: 'New unilateral arm/leg weakness?', type: 'boolean' },
    { id: 'speechDiff', questionText: 'New speech difficulty (slurred or aphasia)?', type: 'boolean' },
    { id: 'visionLoss', questionText: 'Sudden vision loss or double vision?', type: 'boolean' },
    { id: 'headacheWorst', questionText: 'Sudden "Worst Headache of Life"?', type: 'boolean' },
    { id: 'mimicCheck', questionText: 'Possible mimic? (e.g. Post-ictal, Hemiplegic Migraine, Hypoglycemia)', type: 'boolean' },
    { id: 'riskFactors', questionText: 'Risk factors? (Sickle Cell, Heart Disease, Recent Neck Trauma)', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const isActFastPositive = data.facialDroop || data.armWeakness || data.speechDiff;
    
    let level: SeverityLevel = 'mild';
    let interpretation = 'Low Clinical Suspicion';

    if (isActFastPositive || data.headacheWorst === true) {
      level = 'severe';
      interpretation = 'CODE STROKE / URGENT NEUROIMAGING';
      if (Number(data.onsetHours || 0) < 6) details.push("WITHIN MECHANICAL THROMBECTOMY WINDOW (< 6-24h).");
    } else if (data.riskFactors === true) {
      level = 'moderate';
      interpretation = 'High-Risk for Stroke (Monitor)';
    }

    if (data.mimicCheck === true) {
        details.push("Mimic suspected: Check glucose and review seizure history.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Pediatric Stroke Screen (ACT FAST)",
        totalScore: isActFastPositive ? 1 : 0,
        interpretation,
        referenceTable: [
          { range: "FAST Positive", meaning: "Activate Stroke Team / Urgent MRI/CT" },
          { range: "Time Window", meaning: "Critical for tPA/Thrombectomy" },
          { range: "Mimics", meaning: "Rule out Hypoglycemia/Seizure" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    return [{
      title: "Pediatric Code Stroke Protocol",
      recommendations: [
        "ACT FAST: Notify Neurology, Neurosurgery, and Interventional Radiology.",
        "Check Bedside Glucose immediately (Rule out hypoglycemia).",
        "Obtain URGENT Brain MRI (DWI/MRA/MRV) - Gold standard for peds stroke.",
        "If MRI unavailable, obtain Non-Contrast Head CT to rule out hemorrhage.",
        "Maintain normal blood pressure; DO NOT lower BP unless instructed by Neurology.",
        "Maintain Normothermia (treat fever) and Normoglycemia.",
        "Draw labs: CBC, Coags (PT/PTT), Type and Screen, Inflammatory markers."
      ]
    }];
  },
  getDisposition: (severity) => ["Immediate admission to PICU under Stroke Team management."],
  getRedFlags: () => ["Sudden hemiparesis", "Aphasia", "Thunderclap headache", "Ataxia", "Vision loss"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AHA/ASA Management of Stroke in Infants and Children", url: "https://www.ahajournals.org/" }
  ],
};
