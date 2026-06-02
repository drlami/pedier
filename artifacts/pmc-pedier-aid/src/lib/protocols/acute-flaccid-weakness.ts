import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const acuteFlaccidWeaknessProtocol: DiseaseProtocol = {
  id: 'acute-flaccid-weakness',
  name: 'Acute Flaccid Weakness',
  system: 'Neurological System',
  description: 'Emergency evaluation of rapidly progressive weakness (GBS vs. AFM).',
  image: {
    url: "https://picsum.photos/seed/weakness/600/400",
    hint: "child wheelchair"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'pattern', questionText: 'Pattern of weakness?', type: 'select', options: [
        {label: 'Ascending/Symmetric (Legs then Arms)', value: 'gbs'}, 
        {label: 'Asymmetric (One limb or spotty)', value: 'afm'}
    ]},
    { id: 'respiratoryEffort', questionText: 'Decreased respiratory effort or weak cough?', type: 'boolean' },
    { id: 'bulbarSigns', questionText: 'Bulbar signs? (Difficulty swallowing, facial droop)', type: 'boolean' },
    { id: 'reflexes', questionText: 'Deep Tendon Reflexes?', type: 'select', options: [
        {label: 'Absent/Markedly Reduced', value: 'absent'}, 
        {label: 'Normal', value: 'normal'}
    ]},
    { id: 'autonomic', questionText: 'Autonomic instability? (Labile BP, Heart Rate swings)', type: 'boolean' },
    { id: 'recentFever', questionText: 'Preceding fever or respiratory illness?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    let level: SeverityLevel = 'moderate';
    let interpretation = 'Likely GBS or Acute Flaccid Myelitis';

    if (data.respiratoryEffort === true || data.bulbarSigns === true || data.autonomic === true) {
      level = 'severe';
      interpretation = 'CRITICAL: IMPENDING RESPIRATORY FAILURE';
      details.push("High risk for rapid deterioration. Secure airway early.");
    }

    if (data.pattern === 'gbs' && data.reflexes === 'absent') {
        details.push("Classic features of Guillain-Barré Syndrome (GBS).");
    } else if (data.pattern === 'afm' && data.recentFever === true) {
        details.push("High suspicion for Acute Flaccid Myelitis (AFM).");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Neuro-Muscular Risk Stratification",
        totalScore: level === 'severe' ? 3 : 1,
        interpretation,
        referenceTable: [
          { range: "Symmetric", meaning: "Suspect GBS" },
          { range: "Asymmetric", meaning: "Suspect AFM (Gray matter)" },
          { range: "Bulbar/Resp", meaning: "CRITICAL - ICU Admission" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    return [{
      title: "Immediate Monitoring & Care",
      recommendations: [
        "Admit to ICU for hourly NIF (Negative Inspiratory Force) or VC (Vital Capacity).",
        "Place on cardiac monitor for autonomic instability.",
        "Perform Lumbar Puncture: Look for albuminocytologic dissociation (GBS).",
        "Perform Spine and Brain MRI with contrast.",
        "For GBS: Start IVIG (2 g/kg total) or Plasmapheresis.",
        "For AFM: Supportive care; consult CDC guidelines for reporting."
      ]
    }];
  },
  getDisposition: (severity) => ["Mandatory ICU Admission for any progressive weakness."],
  getRedFlags: () => ["Weak cough", "Difficulty swallowing", "Ascending paralysis", "Labile blood pressure"],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    return weight > 0 ? [
        { drugName: "IVIG (GBS)", dose: `${(2 * weight).toFixed(1)} g total`, notes: "Divide over 2-5 days." }
    ] : [];
  },
  getReferences: () => [
    { title: "CDC: Acute Flaccid Myelitis Information", url: "https://www.cdc.gov/afm/" }
  ],
};
