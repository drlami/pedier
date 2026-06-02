import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const asthmaProtocol: DiseaseProtocol = {
  id: 'asthma',
  name: 'Asthma Exacerbation',
  system: 'Respiratory System',
  description: 'Assessment and management of acute asthma exacerbations in children using the PRAM score.',
   image: {
    url: "https://picsum.photos/seed/asthma/600/400",
    hint: "inhaler"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { 
      id: 'suprasternalRetractions', 
      questionText: 'Suprasternal Retractions', 
      type: 'select', 
      options: [
        {label: 'Absent', value: '0', score: 0}, 
        {label: 'Present', value: '2', score: 2}
      ] 
    },
    { 
      id: 'scaleneMuscleContraction', 
      questionText: 'Scalene Muscle Contraction', 
      type: 'select', 
      options: [
        {label: 'Absent', value: '0', score: 0}, 
        {label: 'Present', value: '2', score: 2}
      ] 
    },
    { 
      id: 'airEntry', 
      questionText: 'Air Entry', 
      type: 'select', 
      options: [
        {label: 'Normal', value: '0', score: 0}, 
        {label: 'Decreased at bases', value: '1', score: 1},
        {label: 'Widespread decrease', value: '2', score: 2},
        {label: 'Absent/Minimal', value: '3', score: 3}
      ] 
    },
    { 
      id: 'wheeze', 
      questionText: 'Wheezing', 
      type: 'select', 
      options: [
        {label: 'Absent', value: '0', score: 0}, 
        {label: 'Expiratory only', value: '1', score: 1},
        {label: 'Inspiratory and expiratory', value: '2', score: 2},
        {label: 'Audible without stethoscope / Silent chest', value: '3', score: 3}
      ] 
    },
    { 
      id: 'oxygenSaturation', 
      questionText: 'Oxygen Saturation (Room Air)', 
      type: 'select', 
      options: [
        {label: '≥ 95%', value: '0', score: 0}, 
        {label: '92% - 94%', value: '1', score: 1},
        {label: '< 92%', value: '2', score: 2}
      ] 
    },
    { id: 'highRiskHistory', questionText: 'High-risk asthma history?', type: 'boolean', info: 'Previous ICU/intubation, recent admission, frequent SABA use.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    const s1 = Number(data.suprasternalRetractions || 0);
    const s2 = Number(data.scaleneMuscleContraction || 0);
    const s3 = Number(data.airEntry || 0);
    const s4 = Number(data.wheeze || 0);
    const s5 = Number(data.oxygenSaturation || 0);
    
    const totalPram = s1 + s2 + s3 + s4 + s5;
    
    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Exacerbation';
    
    if (totalPram >= 8) {
      level = 'severe';
      interpretation = 'Severe Exacerbation';
      details.push("High risk of respiratory failure. Intensify therapy.");
    } else if (totalPram >= 4) {
      level = 'moderate';
      interpretation = 'Moderate Exacerbation';
    } else {
      level = 'mild';
      interpretation = 'Mild Exacerbation';
    }

    if (data.wheeze === '3' && data.airEntry === '3') {
        details.push("CRITICAL: Silent chest identified. Impending respiratory failure.");
        level = 'impending respiratory failure';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "PRAM Score",
        totalScore: totalPram,
        maxScore: 12,
        interpretation,
        referenceTable: [
          { range: "0 - 3", meaning: "Mild Exacerbation" },
          { range: "4 - 7", meaning: "Moderate Exacerbation" },
          { range: "8 - 12", meaning: "Severe Exacerbation" }
        ]
      },
      details 
    };
  },
  getManagement: (severity) => {
    switch (severity.level) {
      case 'impending respiratory failure':
      case 'severe':
        return [{
          title: "Severe Exacerbation Management (PRAM 8-12)",
          recommendations: [
            "Oxygen to maintain SpO2 ≥ 92-94%.",
            "Continuous SABA (Salbutamol) via nebulizer.",
            "Ipratropium Bromide nebulization every 20 min x 3 doses.",
            "Systemic Corticosteroids (Prednisolone 2mg/kg, max 60mg) - IV/IM if vomiting.",
            "Consider Magnesium Sulfate (IV) 40-50 mg/kg (max 2g) over 20 min.",
            "Prepare for escalation (NIV or Intubation if failing)."
          ]
        }];
      case 'moderate':
        return [{
          title: "Moderate Exacerbation Management (PRAM 4-7)",
          recommendations: [
            "Salbutamol (SABA) 6-10 puffs via spacer every 20 min x 3, or nebulized.",
            "Ipratropium Bromide 4-8 puffs via spacer every 20 min x 3.",
            "Oral Corticosteroids (Prednisolone 1-2 mg/kg, max 40-60mg).",
            "Reassess PRAM score after 1 hour of treatment."
          ]
        }];
      case 'mild':
        return [{
          title: "Mild Exacerbation Management (PRAM 0-3)",
          recommendations: [
            "Salbutamol (SABA) 2-6 puffs via spacer every 20 min as needed.",
            "Consider oral corticosteroids if symptoms persist or previous history of rapid escalation.",
            "Discharge if PRAM remains ≤ 3 after 1-2 hours with clear home plan."
          ]
        }];
      default:
        return [{ title: 'Awaiting Assessment', recommendations: ['Complete PRAM scoring to determine management.'] }];
    }
  },
  getDisposition: (severity) => {
    if(severity.level === 'impending respiratory failure' || severity.level === 'severe'){
        return ["Admit for ongoing bronchodilator therapy and monitoring. PICU/HDU is required for impending respiratory failure."];
    }
    if(severity.level === 'moderate'){
        return ["Admit to hospital if poor response to initial therapy, persistent hypoxia, or high-risk history.", "Consider discharge ONLY if significant improvement and PRAM ≤ 3."];
    }
    return ["Discharge home with clear action plan if PRAM remains ≤ 3 after treatment.", "Ensure patient has spacer technique review and understands return precautions."];
  },
  getRedFlags: () => [
    "Silent chest",
    "Drowsiness or confusion (altered mental status)",
    "PRAM Score ≥ 8",
    "Persistent O2 saturation < 92% despite therapy",
    "Poor respiratory effort or fatigue"
  ],
  getDrugDoses: (severity, data) => {
      const weight = Number(data.weight) || 0;
      const predMg = weight > 0 ? Math.min(2 * weight, 60) : 0;
      const magMin = weight > 0 ? Math.min(40 * weight, 2000).toFixed(0) : "";
      
      const doses = [
        { drugName: "Salbutamol (Nebulized)", dose: "2.5-5 mg every 20 min or continuous" },
        { drugName: "Ipratropium Bromide (Nebulized)", dose: "250-500 mcg every 20 min x 3 doses" },
        { drugName: "Prednisolone (Oral)", dose: weight > 0 ? `${predMg.toFixed(0)} mg (2 mg/kg)` : "2 mg/kg, max 60 mg" },
      ];
      if (severity.level === 'severe' || severity.level === 'impending respiratory failure') {
          doses.push({ drugName: "Magnesium Sulfate (IV)", dose: weight > 0 ? `${magMin} mg (40-50 mg/kg) over 20 min` : "40-50 mg/kg (max 2g) IV" });
      }
      return doses;
  },
  getReferences: () => [
    { title: "Pediatric Respiratory Assessment Measure (PRAM) for predicting hospitalization", url: "https://pubmed.ncbi.nlm.nih.gov/18413344/" },
    { title: "GINA 2023 Pocket Guide for Asthma Management and Prevention", url: "https://ginasthma.org/" }
  ],
};
