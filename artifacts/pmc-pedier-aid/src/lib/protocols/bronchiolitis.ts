import type { DiseaseProtocol, FormData, Severity } from './types';

export const bronchiolitisProtocol: DiseaseProtocol = {
  id: 'bronchiolitis',
  name: 'Bronchiolitis',
  system: 'Respiratory',
  description: 'Assessment and management of viral bronchiolitis in infants and young children.',
  image: {
    url: "https://picsum.photos/seed/bronchiolitis/600/400",
    hint: "lungs xray"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number', unit: 'months' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation', type: 'number', unit: '%' },
    { id: 'respiratoryRate', questionText: 'Respiratory Rate', type: 'number', unit: 'breaths/min' },
    { id: 'apnea', questionText: 'Apnea present?', type: 'boolean' },
    { id: 'cyanosis', questionText: 'Cyanosis present?', type: 'boolean' },
    { id: 'feedingAdequacy', questionText: 'Feeding Adequacy', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Reduced (<50%)', value: 'reduced'}, {label: 'Poor/None', value: 'poor'}] },
    { id: 'dehydration', questionText: 'Dehydration', type: 'select', options: [{label: 'None', value: 'none'}, {label: 'Mild', value: 'mild'}, {label: 'Moderate', value: 'moderate'}, {label: 'Severe / poor perfusion', value: 'severe'}] },
    { id: 'chestRetractions', questionText: 'Chest Retractions', type: 'select', options: [{label: 'None', value: 'none'}, {label: 'Mild', value: 'mild'}, {label: 'Moderate', value: 'moderate'}, {label: 'Severe', value: 'severe'}] },
    { id: 'nasalFlaring', questionText: 'Nasal Flaring?', type: 'boolean' },
    { id: 'grunting', questionText: 'Grunting?', type: 'boolean' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Irritable', value: 'irritable'}, {label: 'Lethargic', value: 'lethargic'}] },
    { id: 'highRisk', questionText: 'High-risk conditions?', type: 'boolean', info: 'Prematurity, congenital heart disease, chronic lung disease, immunodeficiency' },
    { id: 'oxygenNeed', questionText: 'Persistent oxygen requirement or escalating oxygen need?', type: 'boolean', info: 'Persistent desaturation despite positioning/suctioning or need for supplemental oxygen/HFNC.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    let score = 0;
    const details: string[] = [];

    if (Number(data.respiratoryRate) > 70) { score += 2; details.push("RR > 70"); }
    else if (Number(data.respiratoryRate) > 60) { score += 1; details.push("RR > 60"); }

    if (data.grunting) { score += 3; details.push("Grunting"); }
    if (data.chestRetractions === 'severe') { score += 3; details.push("Severe retractions"); }
    else if (data.chestRetractions === 'moderate') { score += 2; details.push("Moderate retractions"); }
    else if (data.chestRetractions === 'mild') { score += 1; details.push("Mild retractions"); }
    
    if (data.nasalFlaring) { score += 1; details.push("Nasal flaring"); }
    if (data.apnea) { score += 4; details.push("Apnea reported"); }
    if (data.cyanosis) { score += 4; details.push("Cyanosis"); }

    if (Number(data.oxygenSaturation) < 90) { score += 4; details.push("O2 Sat < 90%"); }
    else if (Number(data.oxygenSaturation) < 92) { score += 3; details.push("O2 Sat < 92%"); }
    else if (Number(data.oxygenSaturation) < 95) { score += 2; details.push("O2 Sat < 95%"); }

    if (data.feedingAdequacy === 'poor') { score += 2; details.push("Poor feeding"); }
    else if (data.feedingAdequacy === 'reduced') { score += 1; details.push("Reduced feeding"); }
    if (data.dehydration === 'severe') { score += 4; details.push("Severe dehydration/poor perfusion"); }
    else if (data.dehydration === 'moderate') { score += 2; details.push("Moderate dehydration"); }

    if (data.mentalStatus === 'lethargic') { score += 3; details.push("Lethargic"); }
    else if (data.mentalStatus === 'irritable') { score += 1; details.push("Irritable"); }

    if (data.highRisk) { score += 1; details.push("High-risk condition"); }
    if (data.oxygenNeed) { score += 2; details.push("Persistent/escalating oxygen requirement"); }
    if (Number(data.ageMonths) < 3) { score += 1; details.push("Age < 3 months"); }

    if (score >= 9 || data.mentalStatus === 'lethargic' || data.apnea || data.cyanosis || data.dehydration === 'severe' || Number(data.oxygenSaturation) < 90) {
      return { level: 'severe', score, details };
    }
    if (score >= 4) {
      return { level: 'moderate', score, details };
    }
    return { level: 'mild', score, details };
  },
  getManagement: (severity, data) => {
    const management = [
      {
        title: "Supportive Care",
        recommendations: [
          "Nasal suctioning as needed, especially before feeds and sleep.",
          "Maintain hydration. Encourage oral fluids if safe. Consider NG or IV fluids if oral intake is inadequate, respiratory distress is significant, or dehydration is present."
        ]
      },
      {
        title: "Oxygen Therapy",
        recommendations: [
          "Administer supplemental oxygen for persistent hypoxemia after positioning and suctioning. Target SpO2 per local policy, commonly ≥ 90% or ≥ 92% in high-risk infants.",
          "Consider HFNC for moderate to severe distress, recurrent apnea, persistent hypoxemia despite low-flow oxygen, or escalating oxygen needs.",
          "Escalate to PICU/CPAP/intubation pathway if HFNC fails, apnea persists, exhaustion develops, or mental status worsens."
        ]
      },
      {
        title: "Investigations to Avoid Routinely",
        recommendations: [
          "Routine chest X-ray is not recommended unless severe disease, atypical features, focal findings, or concern for complication/alternate diagnosis.",
          "Routine viral testing, blood tests, and antibiotics are not needed in typical bronchiolitis.",
          "Do not use bronchodilators or corticosteroids routinely; consider alternate diagnosis if there is repeated clear bronchodilator response."
        ]
      },
      {
        title: "Medications to Avoid (Routinely)",
        recommendations: [
          "Bronchodilators (e.g., albuterol) are not routinely recommended.",
          "Corticosteroids (systemic or inhaled) are not routinely recommended.",
          "Antibiotics should not be used unless a concurrent bacterial infection is suspected."
        ]
      }
    ];

    if (severity.level === 'severe') {
      management.push({
        title: "Severe Management",
        recommendations: [
          "Admit to hospital, potentially to a higher level of care (PICU).",
          "Continuous cardiorespiratory and pulse oximetry monitoring.",
          "Prepare for escalation to HFNC, CPAP, or mechanical ventilation if respiratory failure is impending."
        ]
      });
    } else if (severity.level === 'moderate') {
      management.push({
        title: "Moderate Management",
        recommendations: [
          "Consider admission for observation, hydration support, and oxygen therapy.",
          "Monitor for worsening respiratory distress."
        ]
      });
    } else {
      management.push({
        title: "Mild Management",
        recommendations: [
          "Discharge home is often appropriate if feeding well and no high-risk factors.",
          "Provide strict return precautions and parent education on signs of worsening."
        ]
      });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    const criteria: string[] = [];
    if (severity.level === 'severe') {
      criteria.push("Admission to PICU/HDU should be strongly considered for any of the following:", "Impending respiratory failure or exhaustion", "Persistent/recurrent apnea", "Persistent SpO2 < 90% despite supplemental oxygen", "Need for HFNC/CPAP or rapidly escalating oxygen support", "Lethargy or poor perfusion.");
    }
    if (severity.level === 'moderate' || severity.level === 'severe') {
      criteria.push("Consider Admission for:", "Persistent oxygen requirement after suctioning/positioning", "Moderate to severe dehydration or inadequate oral intake", "Marked respiratory distress (RR > 70, severe retractions, grunting)", "Apnea episodes", "Age < 3 months, prematurity, cardiopulmonary disease, immunodeficiency, or concern for safe monitoring at home.");
    }
    if (severity.level === 'mild') {
      criteria.push("Consider Discharge if:", "Clinically stable with mild work of breathing", "Maintaining acceptable SpO2 on room air according to local policy, including during sleep/feeding observation when appropriate", "Adequate oral hydration", "No apnea/cyanosis and no high-risk features requiring observation", "Family can manage at home and has clear return instructions.");
    }
    return criteria;
  },
  getRedFlags: () => [
    "Apnea (observed or reported)",
    "Cyanosis",
    "Lethargy or severe irritability",
    "Persistent oxygen saturation < 90%",
    "Severe respiratory distress (grunting, severe retractions, RR > 70)",
    "Inability to maintain hydration orally"
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "AAP Clinical Practice Guideline: The Diagnosis and Management of Bronchiolitis", url: "https://publications.aap.org/pediatrics/article/134/2/e547/32906/Clinical-Practice-Guideline-The-Diagnosis-and" }],
};
