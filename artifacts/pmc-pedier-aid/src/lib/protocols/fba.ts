import type { DiseaseProtocol, FormData, Severity } from './types';

export const fbaProtocol: DiseaseProtocol = {
  id: 'fba',
  name: 'Foreign Body Aspiration (Suspected)',
  system: 'Respiratory',
  description: 'Evaluation of suspected foreign body aspiration in a stable child.',
  image: {
    url: "https://picsum.photos/seed/fba/600/400",
    hint: "child choking"
  },
  questions: [
    { id: 'activeObstruction', questionText: 'Active complete/severe airway obstruction now?', type: 'boolean', info: 'Unable to cry/speak/cough effectively, cyanosis, severe distress, silent cough, or deteriorating consciousness.' },
    { id: 'witnessedEvent', questionText: 'Witnessed choking or gagging episode?', type: 'boolean' },
    { id: 'age', questionText: 'Age (6mo - 4yr is highest risk)?', type: 'number', unit: 'years' },
    { id: 'symptomOnset', questionText: 'Sudden onset of cough, wheeze, or stridor?', type: 'boolean' },
    { id: 'unilateralWheeze', questionText: 'Unilateral wheeze on exam?', type: 'boolean' },
    { id: 'unilateralAirEntry', questionText: 'Decreased air entry on one side?', type: 'boolean' },
    { id: 'cxrFindings', questionText: 'CXR findings?', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Unilateral hyperinflation', value: 'hyperinflation'}, {label: 'Atelectasis', value: 'atelectasis'}, {label: 'Radio-opaque object seen', value: 'object_seen'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Severity here relates to the likelihood of FBA requiring bronchoscopy
    const details: string[] = [];
    let score = 0;

    if (data.activeObstruction) {
      return { level: 'impending respiratory failure', details: ["Active complete/severe airway obstruction. Immediate choking/resuscitation pathway required."] };
    }
    
    if (data.witnessedEvent) { score += 3; details.push("Witnessed choking event"); }
    if (data.symptomOnset) { score += 1; details.push("Sudden onset of symptoms"); }
    if (data.unilateralWheeze) { score += 2; details.push("Unilateral wheeze"); }
    if (data.unilateralAirEntry) { score += 2; details.push("Unilateral decreased air entry"); }
    if (data.cxrFindings === 'hyperinflation' || data.cxrFindings === 'atelectasis' || data.cxrFindings === 'object_seen') { score += 2; details.push("Positive CXR findings"); }

    if (data.cxrFindings === 'object_seen' || (data.witnessedEvent && (data.unilateralWheeze || data.unilateralAirEntry))) {
      return { level: 'severe', score, details: [...details, "High probability of FBA"] };
    }
    if (score >= 3) {
      return { level: 'moderate', score, details: [...details, "Moderate probability of FBA"] };
    }
    if (score > 0) {
      return { level: 'mild', score, details: [...details, "Low probability of FBA"] };
    }
    return { level: 'no', details };
  },
  getManagement: (severity, data) => {
    const management = [];
    if(severity.level === 'impending respiratory failure'){
      management.push({
        title: "EMERGENCY: Active Airway Obstruction",
        recommendations: [
          "Call resuscitation team, anesthesia/ENT, and prepare for immediate airway intervention.",
          "If ineffective cough or complete obstruction: follow pediatric choking algorithm immediately (back blows/chest thrusts for infants; abdominal thrusts for children when appropriate).",
          "If unconscious: start CPR and inspect mouth only when opening airway; remove visible object only.",
          "Do NOT perform blind finger sweeps.",
          "Prepare for rigid bronchoscopy or surgical airway if obstruction cannot be relieved."
        ]
      });
      return management;
    }
    if(severity.level === 'severe' || severity.level === 'moderate'){
      management.push({
        title: "High/Moderate Suspicion of FBA",
        recommendations: [
          "Consult ENT or Pulmonology immediately.",
          "Prepare patient for rigid bronchoscopy in the operating room. This is both diagnostic and therapeutic.",
          "Keep patient NPO.",
          "A normal CXR does NOT exclude FBA; do not delay bronchoscopy when clinical suspicion is high.",
          "Monitor closely for worsening respiratory distress and escalate immediately if obstruction becomes unstable."
        ]
      })
    }
    if(severity.level === 'mild') {
       management.push({
        title: "Low Suspicion of FBA",
        recommendations: [
          "Consider Chest X-ray (inspiratory/expiratory views or bilateral decubitus). A normal CXR does NOT rule out FBA.",
          "Period of observation in the ED.",
          "Discuss with ENT/Pulmonology; decision for bronchoscopy is based on combined clinical picture.",
          "If discharging, provide strict return precautions for any respiratory distress."
        ]
      })
    }
    if(severity.level === 'no'){
       management.push({
        title: "Very Low Suspicion of FBA",
        recommendations: [
          "If history and exam are not suggestive, consider alternative diagnoses.",
          "Discharge with clear return precautions."
        ]
      })
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'impending respiratory failure') {
      return ["Immediate resuscitation area management with airway/ENT/anesthesia involvement. Do not transfer away from monitored emergency care until airway is secure."];
    }
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admit to hospital for rigid bronchoscopy."];
    }
    return ["Discharge may be considered for low-suspicion cases after a period of observation and discussion with consultants, with strict return precautions."];
  },
  getRedFlags: () => [
    "History of choking/gagging followed by respiratory symptoms (cough, wheeze, stridor) is the biggest red flag.",
    "Unable to cry/speak/cough effectively, cyanosis, or deteriorating consciousness indicates complete obstruction.",
    "New-onset unilateral wheezing in a toddler.",
    "Cyanosis or severe distress (indicates high-grade obstruction - an emergency).",
    "Symptoms refractory to standard asthma/croup treatment."
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "American Thoracic Society: Management of Suspected Foreign Body Aspiration in Children", url: "https://www.thoracic.org/statements/resources/pediatric-critical-care/management-of-suspected-foreign-body-aspiration-in-children.pdf" }],
};
