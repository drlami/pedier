import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const croupProtocol: DiseaseProtocol = {
  id: 'croup',
  name: 'Croup (Laryngotracheitis)',
  system: 'Respiratory System',
  description: 'Assessment and management of viral croup using the Westley Croup Score.',
   image: {
    url: "https://picsum.photos/seed/croup/600/400",
    hint: "child coughing"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { 
      id: 'stridor', 
      questionText: 'Stridor', 
      type: 'select', 
      options: [
        {label: 'None', value: '0', score: 0}, 
        {label: 'With agitation', value: '1', score: 1},
        {label: 'At rest', value: '2', score: 2}
      ] 
    },
    { 
      id: 'retractions', 
      questionText: 'Chest Wall Retractions', 
      type: 'select', 
      options: [
        {label: 'None', value: '0', score: 0}, 
        {label: 'Mild', value: '1', score: 1},
        {label: 'Moderate', value: '2', score: 2},
        {label: 'Severe', value: '3', score: 3}
      ] 
    },
    { 
      id: 'airEntry', 
      questionText: 'Air Entry', 
      type: 'select', 
      options: [
        {label: 'Normal', value: '0', score: 0}, 
        {label: 'Decreased', value: '1', score: 1},
        {label: 'Markedly decreased', value: '2', score: 2}
      ] 
    },
    { 
      id: 'cyanosis', 
      questionText: 'Cyanosis', 
      type: 'select', 
      options: [
        {label: 'None', value: '0', score: 0}, 
        {label: 'With agitation', value: '4', score: 4},
        {label: 'At rest', value: '5', score: 5}
      ] 
    },
    { 
      id: 'mentalStatus', 
      questionText: 'Level of Consciousness', 
      type: 'select', 
      options: [
        {label: 'Normal (Alert)', value: '0', score: 0}, 
        {label: 'Disoriented / Altered', value: '5', score: 5}
      ] 
    },
    { id: 'drooling', questionText: 'Drooling or dysphagia?', type: 'boolean', info: 'WARNING: Consider Epiglottitis or deep neck infection.' },
    { id: 'toxic', questionText: 'Toxic appearance?', type: 'boolean', info: 'WARNING: Consider Bacterial Tracheitis.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    const s1 = Number(data.stridor || 0);
    const s2 = Number(data.retractions || 0);
    const s3 = Number(data.airEntry || 0);
    const s4 = Number(data.cyanosis || 0);
    const s5 = Number(data.mentalStatus || 0);
    
    const totalScore = s1 + s2 + s3 + s4 + s5;
    
    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Croup';
    
    if (totalScore >= 12) {
      level = 'impending respiratory failure';
      interpretation = 'Impending Respiratory Failure';
    } else if (totalScore >= 8) {
      level = 'severe';
      interpretation = 'Severe Croup';
    } else if (totalScore >= 3) {
      level = 'moderate';
      interpretation = 'Moderate Croup';
    }

    if (data.drooling === true || data.toxic === true) {
      details.push("CRITICAL ALERT: Clinical features atypical for croup. Urgently rule out Epiglottitis or Bacterial Tracheitis.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Westley Croup Score",
        totalScore: totalScore,
        maxScore: 17,
        interpretation,
        referenceTable: [
          { range: "0 - 2", meaning: "Mild Croup" },
          { range: "3 - 7", meaning: "Moderate Croup" },
          { range: "8 - 11", meaning: "Severe Croup" },
          { range: "≥ 12", meaning: "Impending Respiratory Failure" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight || 0);
    const management = [];

    if (data.drooling || data.toxic) {
        management.push({
            title: "EMERGENCY: Atypical Airway Obstruction",
            recommendations: [
                "Minimize agitation (keep child on parent's lap).",
                "DO NOT examine the throat.",
                "Involve Anesthesia and ENT immediately.",
                "Prepare for controlled airway management in OR."
            ]
        });
    }

    switch (severity.level) {
      case 'mild':
        management.push({
          title: "Mild Croup Management",
          recommendations: [
            "Dexamethasone 0.15 mg/kg - 0.6 mg/kg (max 16mg) single dose PO.",
            "Education on humidified air and hydration.",
            "Discharge with return precautions."
          ]
        });
        break;
      case 'moderate':
        management.push({
          title: "Moderate Croup Management",
          recommendations: [
            "Dexamethasone 0.6 mg/kg PO/IM.",
            "Nebulized Epinephrine (L-Epi 1:1000) 0.5 mL/kg (max 5mL).",
            "Observe for 4 hours for rebound symptoms."
          ]
        });
        break;
      case 'severe':
      case 'impending respiratory failure':
        management.push({
          title: "Severe Management",
          recommendations: [
            "Nebulized Epinephrine immediately; repeat as needed.",
            "Dexamethasone IM/IV.",
            "Oxygen support (keep child calm).",
            "Early PICU consultation."
          ]
        });
        break;
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'mild') return ["Discharge home after steroid dose."];
    if (severity.level === 'moderate') return ["Observe for 4 hours. Admit if stridor at rest persists or recurs."];
    return ["Admit to PICU/HDU."];
  },
  getRedFlags: () => ["Drooling", "Toxic appearance", "Stridor at rest", "Cyanosis", "Altered mental status"],
  getDrugDoses: (severity, data) => {
      const weight = Number(data.weight) || 0;
      const dexDose = weight > 0 ? Math.min(0.6 * weight, 16).toFixed(1) : "0.6 mg/kg";
      const epiDose = weight > 0 ? Math.min(0.5 * weight, 5).toFixed(1) : "0.5 mL/kg";

      return [
        { drugName: "Dexamethasone (PO/IM/IV)", dose: `${dexDose} mg (0.6 mg/kg)`, notes: "Single dose." },
        { drugName: "Nebulized Epinephrine (1:1000)", dose: `${epiDose} mL (0.5 mL/kg)`, notes: "Max 5 mL. Observe for 4 hours." }
      ];
  },
  getReferences: () => [
    { title: "Westley Croup Score and Management", url: "https://www.mdcalc.com/westley-croup-score" },
    { title: "CPS Position Statement: Management of Croup", url: "https://cps.ca/en/documents/position/management-of-croup" }
  ],
};
