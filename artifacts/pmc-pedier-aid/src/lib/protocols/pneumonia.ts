import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const pneumoniaProtocol: DiseaseProtocol = {
  id: 'pneumonia',
  name: 'Pneumonia (Community Acquired)',
  system: 'Respiratory',
  description: 'Assessment and management of CAP in children using BTS/WHO severity criteria.',
  image: {
    url: "https://picsum.photos/seed/pneumonia/600/400",
    hint: "chest xray"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ageMonths', questionText: 'Age in months', type: 'number', unit: 'months' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation (Room Air)', type: 'number', unit: '%' },
    { id: 'respiratoryRate', questionText: 'Respiratory Rate', type: 'number', unit: 'breaths/min' },
    { id: 'chestIndrawing', questionText: 'Moderate/Severe chest wall indrawing?', type: 'boolean' },
    { id: 'grunting', questionText: 'Audible grunting?', type: 'boolean' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Irritable', value: 'irritable'}, {label: 'Lethargic/Drowsy', value: 'lethargic'}] },
    { id: 'feeding', questionText: 'Feeding Intake', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Reduced (50-75%)', value: 'reduced'}, {label: 'Poor (<50%)', value: 'poor'}] },
    { id: 'complicated', questionText: 'Suspected complication?', type: 'boolean', info: 'Effusion, empyema, abscess, or failure of 48h outpatient antibiotics.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const age = Number(data.ageMonths || 0);
    const rr = Number(data.respiratoryRate || 0);
    const spo2 = Number(data.oxygenSaturation || 100);

    // BTS/WHO Severity Criteria
    let totalPoints = 0;
    if (spo2 < 92) totalPoints += 3;
    if (data.chestIndrawing === true) totalPoints += 2;
    if (data.grunting === true) totalPoints += 2;
    if (data.feeding === 'poor') totalPoints += 2;
    if (data.mentalStatus === 'lethargic') totalPoints += 3;

    // Tachypnea check
    const isTachypneic = (age < 12 && rr > 50) || (age >= 12 && age < 60 && rr > 40) || (age >= 60 && rr > 30);
    if (isTachypneic) totalPoints += 1;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Pneumonia';

    if (totalPoints >= 5 || spo2 < 90 || data.complicated === true) {
      level = 'severe';
      interpretation = 'Severe/Complicated Pneumonia';
    } else if (totalPoints >= 2) {
      level = 'moderate';
      interpretation = 'Moderate Pneumonia';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Pneumonia Severity Index (BTS/WHO)",
        totalScore: totalPoints,
        interpretation,
        referenceTable: [
          { range: "0 - 1", meaning: "Mild (Likely Outpatient)" },
          { range: "2 - 4", meaning: "Moderate (Observe/Inpatient)" },
          { range: "≥ 5", meaning: "Severe (Urgent Inpatient)" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const management = [];
    
    if (severity.level === 'severe') {
      management.push({
        title: "Severe Management (Inpatient)",
        recommendations: [
          "Urgent IV antibiotics: Ampicillin + Gentamicin OR Ceftriaxone.",
          "Oxygen to maintain SpO2 > 92%.",
          "NPO if respiratory distress is significant; start IV fluids.",
          "Obtain Chest X-ray and blood cultures."
        ]
      });
    } else if (severity.level === 'moderate') {
      management.push({
        title: "Moderate Management",
        recommendations: [
          "Consider admission for observation.",
          "High-dose oral Amoxicillin (90 mg/kg/day).",
          "Oxygen if SpO2 < 92%.",
          "Ensure adequate hydration."
        ]
      });
    } else {
      management.push({
        title: "Mild Management (Outpatient)",
        recommendations: [
          "Oral Amoxicillin (90 mg/kg/day) for 5-7 days.",
          "Antipyretics for fever.",
          "Clear return precautions to parents."
        ]
      });
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Immediate Hospital Admission."];
    if (severity.level === 'moderate') return ["Admit or observe in ED for 6-12 hours."];
    return ["Home management with 48h follow-up."];
  },
  getRedFlags: () => ["Gritting", "Nasal flaring", "Apnea", "Cyanosis", "Inability to drink"],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const amox = weight > 0 ? (90 * weight / 2).toFixed(0) : "45 mg/kg";
    return [
      { drugName: "Amoxicillin (Oral)", dose: weight > 0 ? `${amox} mg BID` : "90 mg/kg/day divided BID", notes: "First-line for CAP." },
      { drugName: "Ceftriaxone (IV)", dose: "50-100 mg/kg once daily", notes: "If complicated or severe." }
    ];
  },
  getReferences: () => [
    { title: "BTS Guidelines for the Management of CAP in Children", url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pneumonia-children/" }
  ],
};
