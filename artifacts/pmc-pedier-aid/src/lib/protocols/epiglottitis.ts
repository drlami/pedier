import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const epiglottitisProtocol: DiseaseProtocol = {
  id: 'epiglottitis',
  name: 'Epiglottitis (Supraglottitis)',
  system: 'Respiratory System',
  description: 'Emergency assessment and stabilization of acute epiglottitis.',
  image: {
    url: "https://picsum.photos/seed/epiglottitis/600/400",
    hint: "airway xray"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'fever', questionText: 'High fever and sore throat?', type: 'boolean' },
    { id: 'drooling', questionText: 'Drooling or unable to swallow?', type: 'boolean' },
    { id: 'dysphonia', questionText: 'Muffled "hot potato" voice?', type: 'boolean' },
    { id: 'distress', questionText: 'Respiratory distress or stridor?', type: 'boolean' },
    { id: 'tripod', questionText: 'Tripod or sniffing position?', type: 'boolean' },
    { id: 'toxic', questionText: 'Toxic/anxious appearance?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let highRiskCount = 0;

    if (data.drooling) { highRiskCount++; details.push("Drooling"); }
    if (data.tripod) { highRiskCount++; details.push("Tripod positioning"); }
    if (data.toxic) { highRiskCount++; details.push("Toxic appearance"); }
    if (data.distress) { highRiskCount++; details.push("Active stridor/distress"); }

    let level: SeverityLevel = 'severe';
    let interpretation = 'High Suspicion of Epiglottitis';

    if (data.distress === true || data.tripod === true || highRiskCount >= 2) {
      level = 'impending respiratory failure';
      interpretation = 'CRITICAL AIRWAY EMERGENCY';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Epiglottitis Clinical Risk",
        totalScore: highRiskCount,
        maxScore: 4,
        interpretation,
        referenceTable: [
          { range: "CRITICAL", meaning: "Impending complete obstruction" },
          { range: "HIGH RISK", meaning: "Secure airway in controlled setting" }
        ]
      },
      details 
    };
  },
  getManagement: (severity) => {
    return [{
      title: "CRITICAL: DO NOT AGITATE",
      recommendations: [
        "DO NOT examine the throat or use a tongue depressor.",
        "Allow child to sit in position of comfort (parent's lap).",
        "Minimize interventions (No IV, No Bloods, No X-ray) until airway team is present.",
        "Urgently call: Anesthesia, ENT, and PICU senior.",
        "Prepare for controlled intubation in OR or ICU.",
        "Secure difficult airway equipment and surgical airway backup.",
        "Once airway is secure: IV Ceftriaxone 100 mg/kg/day."
      ]
    }];
  },
  getDisposition: (severity) => ["Immediate Transfer to OR/ICU for airway management."],
  getRedFlags: () => ["Drooling", "Tripod position", "Muffled voice", "Stridor", "Anxious/toxic"],
  getDrugDoses: (severity, data) => [
    { drugName: "Ceftriaxone (IV)", dose: "100 mg/kg once daily", notes: "Start ONLY AFTER airway is secured." }
  ],
  getReferences: () => [
    { title: "UpToDate: Epiglottitis in Children", url: "https://www.uptodate.com/" }
  ],
};
