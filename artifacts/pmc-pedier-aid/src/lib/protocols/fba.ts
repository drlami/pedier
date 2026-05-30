import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const fbaProtocol: DiseaseProtocol = {
  id: 'fba',
  name: 'Foreign Body Aspiration (Suspected)',
  system: 'Respiratory',
  description: 'Evaluation and emergency management of suspected foreign body aspiration.',
  image: {
    url: "https://picsum.photos/seed/fba/600/400",
    hint: "child choking"
  },
  questions: [
    { id: 'activeObstruction', questionText: 'Active complete/severe airway obstruction now?', type: 'boolean', info: 'Unable to speak/cough, silent cough, cyanosis, or deteriorating consciousness.' },
    { id: 'witnessedEvent', questionText: 'Witnessed choking or gagging episode?', type: 'boolean' },
    { id: 'ageMonths', questionText: 'Age in months', type: 'number', unit: 'months' },
    { id: 'symptomOnset', questionText: 'Sudden onset of cough, wheeze, or stridor?', type: 'boolean' },
    { id: 'unilateralWheeze', questionText: 'Unilateral wheeze on exam?', type: 'boolean' },
    { id: 'unilateralAirEntry', questionText: 'Decreased air entry on one side?', type: 'boolean' },
    { id: 'cxrFindings', questionText: 'CXR findings?', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Unilateral hyperinflation', value: 'hyperinflation'}, {label: 'Atelectasis', value: 'atelectasis'}, {label: 'Radio-opaque object seen', value: 'object_seen'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let totalScore = 0;

    if (data.activeObstruction === true) {
      return { level: 'impending respiratory failure', details: ["ACTIVE COMPLETE OBSTRUCTION: Immediate choking algorithm required."] };
    }
    
    if (data.witnessedEvent === true) totalScore += 3;
    if (data.symptomOnset === true) totalScore += 1;
    if (data.unilateralWheeze === true) totalScore += 2;
    if (data.unilateralAirEntry === true) totalScore += 2;
    if (data.cxrFindings !== 'normal' && data.cxrFindings !== undefined) totalScore += 2;

    let level: SeverityLevel = 'no';
    let interpretation = 'Very Low Probability';

    if (totalScore >= 5 || data.cxrFindings === 'object_seen') {
      level = 'severe';
      interpretation = 'High Probability of FBA';
    } else if (totalScore >= 3) {
      level = 'moderate';
      interpretation = 'Moderate Probability of FBA';
    } else if (totalScore > 0) {
      level = 'mild';
      interpretation = 'Low Probability (Observe)';
    }

    if (data.cxrFindings === 'normal' && totalScore >= 3) {
        details.push("Reminder: A normal CXR does NOT rule out a foreign body aspiration.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "FBA Probability Score",
        totalScore: totalScore,
        interpretation,
        referenceTable: [
          { range: "≥ 5", meaning: "High Probability (Indication for OR)" },
          { range: "3 - 4", meaning: "Moderate Probability (Consult ENT)" },
          { range: "1 - 2", meaning: "Low Probability (Monitor/Repeat CXR)" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const isInfant = Number(data.ageMonths || 0) < 12;
    const management = [];

    if (severity.level === 'impending respiratory failure') {
      management.push({
        title: "EMERGENCY: CHOKING ALGORITHM",
        recommendations: [
          "Call resuscitation team, Anesthesia, and ENT immediately.",
          isInfant 
            ? "Infant (<1 yr): 5 Back Blows followed by 5 Chest Thrusts. Repeat until object relieved or unconscious."
            : "Child (>1 yr): Abdominal Thrusts (Heimlich Maneuver). Repeat until object relieved or unconscious.",
          "If unconscious: Start CPR. Inspect airway before breaths. REMOVE visible objects only; no blind sweeps.",
          "Prepare for rigid bronchoscopy or surgical airway."
        ]
      });
    } else if (severity.level === 'severe' || severity.level === 'moderate') {
      management.push({
        title: "High/Moderate Probability Management",
        recommendations: [
          "Consult ENT/Pulmonology immediately for rigid bronchoscopy.",
          "Keep NPO.",
          "A normal CXR does NOT rule out FBA; do not delay if clinical suspicion is high.",
          "Continuous monitoring for sudden airway obstruction."
        ]
      });
    } else {
        management.push({
            title: "Low Probability Management",
            recommendations: [
                "Consider observation and repeat imaging (inspiratory/expiratory views).",
                "Discuss with ENT if symptoms persist.",
                "Ensure clear discharge return precautions for any respiratory distress."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'impending respiratory failure') return ["Immediate Resuscitation Room."];
    if (severity.level === 'severe' || severity.level === 'moderate') return ["Admit for Bronchoscopy."];
    return ["Discharge with strict return instructions if symptoms resolve."];
  },
  getRedFlags: () => ["Sudden onset choking", "Unilateral wheeze", "Stridor", "Cyanosis", "Ineffective cough"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ATS Management of Suspected FBA in Children", url: "https://www.thoracic.org/" }
  ],
};
