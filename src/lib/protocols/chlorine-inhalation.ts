import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const chlorineInhalationProtocol: DiseaseProtocol = {
  id: 'chlorine-inhalation',
  name: 'Chlorine Gas Inhalation',
  system: 'Toxins and Poisoning',
  description: 'Management of respiratory irritation and injury from acute chlorine gas exposure.',
  image: {
    url: "https://picsum.photos/seed/chlorine-inhalation/600/400",
    hint: "toxic gas"
  },
  questions: [
    { id: 'respDistress', questionText: 'Is there respiratory distress?', type: 'boolean', info: 'Shortness of breath, tachypnea, use of accessory muscles.' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation on Room Air', type: 'number', unit: '%' },
    { id: 'hasWheezing', questionText: 'Is wheezing present on auscultation?', type: 'boolean' },
    { id: 'hasEyeIrritation', questionText: 'Are there significant eye or upper airway symptoms (burning, tearing, sore throat)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (Number(data.oxygenSaturation) < 90 || data.respDistress) {
      return { level: 'severe', details: ["Severe respiratory distress or hypoxia. Risk of ARDS."] };
    }
    if (data.hasWheezing || (Number(data.oxygenSaturation) >= 90 && Number(data.oxygenSaturation) < 94)) {
      return { level: 'moderate', details: ["Moderate symptoms with wheezing or mild hypoxemia."] };
    }
    if (data.hasEyeIrritation && !data.hasWheezing && Number(data.oxygenSaturation) >= 94) {
      return { level: 'mild', details: ["Mild upper airway and eye irritation without significant respiratory compromise."] };
    }
    return { level: 'unknown', details: ["Assess symptoms to determine severity."] };
  },
  getManagement: (severity) => {
    const management = [{
        title: "Immediate Management",
        recommendations: [
            "Remove patient from the source of exposure immediately.",
            "Remove contaminated clothing and irrigate eyes and skin if affected.",
            "Administer high-flow, humidified oxygen."
        ]
    }];

    if (severity.level === 'severe') {
        management.push({
            title: "Severe Inhalation Injury Management",
            recommendations: [
                "Provide respiratory support. Consider non-invasive positive pressure ventilation (CPAP/BiPAP) or intubation for impending respiratory failure or ARDS.",
                "Administer nebulized bronchodilators (e.g., Albuterol) for bronchospasm.",
                "Consider inhaled corticosteroids for severe inflammation.",
                "Admit to PICU for close monitoring for delayed-onset pulmonary edema."
            ]
        });
    } else if (severity.level === 'moderate') {
        management.push({
            title: "Moderate Inhalation Injury Management",
            recommendations: [
                "Administer supplemental humidified oxygen.",
                "Provide nebulized bronchodilators (e.g., Albuterol) for wheezing.",
                "Observe in the emergency department for at least 6-8 hours to monitor for worsening symptoms or delayed-onset pulmonary edema."
            ]
        });
    } else { // mild
        management.push({
            title: "Mild Inhalation Injury Management",
            recommendations: [
                "Supportive care.",
                "After a period of observation (2-4 hours), if symptoms have resolved, the patient may be discharged.",
                "Provide strict return precautions for any worsening respiratory symptoms."
            ]
        });
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to the PICU."];
    }
    if (severity.level === 'moderate') {
      return ["Admission for observation is recommended. Discharge may be possible after a prolonged observation period (6-8 hours) if symptoms resolve completely."];
    }
    return ["Discharge after a brief observation period if symptoms resolve."];
  },
  getRedFlags: () => [
    "Hypoxia (SpO2 < 94%)",
    "Respiratory distress (tachypnea, retractions)",
    "Altered mental status",
    "Development of pulmonary edema (rales on exam, pink frothy sputum)",
    "Worsening symptoms after an initial period of improvement"
  ],
  getDrugDoses: () => [
      { drugName: "Albuterol Nebulizer", dose: "2.5 - 5 mg per dose", notes: "For bronchospasm." }
  ],
  getReferences: () => [{ title: "UpToDate: Chlorine and chloramine gas exposure", url: "https://www.uptodate.com/contents/chlorine-and-chloramine-gas-exposure" }],
};