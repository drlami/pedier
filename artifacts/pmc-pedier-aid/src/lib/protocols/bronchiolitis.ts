import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const bronchiolitisProtocol: DiseaseProtocol = {
  id: 'bronchiolitis',
  name: 'Bronchiolitis',
  system: 'Respiratory',
  description: 'Assessment and management of viral bronchiolitis using the Modified Tal Score.',
  image: {
    url: "https://picsum.photos/seed/bronchiolitis/600/400",
    hint: "lungs xray"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ageMonths', questionText: 'Age in months', type: 'number', unit: 'months' },
    { id: 'isPremature', questionText: 'Was the infant premature?', type: 'boolean', info: 'Higher risk for apnea if post-conceptual age < 48-60 weeks.' },
    { 
      id: 'respiratoryRate', 
      questionText: 'Respiratory Rate', 
      type: 'select', 
      options: [
        {label: '≤ 30', value: '0', score: 0}, 
        {label: '31 - 45', value: '1', score: 1},
        {label: '46 - 60', value: '2', score: 2},
        {label: '> 60', value: '3', score: 3}
      ] 
    },
    { 
      id: 'wheezing', 
      questionText: 'Wheezing', 
      type: 'select', 
      options: [
        {label: 'None', value: '0', score: 0}, 
        {label: 'Terminal expiratory (with stethoscope)', value: '1', score: 1},
        {label: 'Entire expiration (with stethoscope)', value: '2', score: 2},
        {label: 'Inspiratory and expiratory (without stethoscope)', value: '3', score: 3}
      ] 
    },
    { 
      id: 'cyanosis', 
      questionText: 'Cyanosis', 
      type: 'select', 
      options: [
        {label: 'None', value: '0', score: 0}, 
        {label: 'Perioral when crying', value: '1', score: 1},
        {label: 'Perioral at rest', value: '2', score: 2},
        {label: 'Generalized at rest', value: '3', score: 3}
      ] 
    },
    { 
      id: 'retractions', 
      questionText: 'Retractions (Use of accessory muscles)', 
      type: 'select', 
      options: [
        {label: 'None', value: '0', score: 0}, 
        {label: 'Intercostal only (mild)', value: '1', score: 1},
        {label: 'Intercostal + Subcostal (moderate)', value: '2', score: 2},
        {label: 'Generalized + Nasal flaring (severe)', value: '3', score: 3}
      ] 
    },
    { id: 'apnea', questionText: 'History of Apnea?', type: 'boolean' },
    { id: 'feedingAdequacy', questionText: 'Feeding Intake', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Reduced (50-75%)', value: 'reduced'}, {label: 'Poor (<50%)', value: 'poor'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    const s1 = Number(data.respiratoryRate || 0);
    const s2 = Number(data.wheezing || 0);
    const s3 = Number(data.cyanosis || 0);
    const s4 = Number(data.retractions || 0);
    
    const totalScore = s1 + s2 + s3 + s4;
    
    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Bronchiolitis';
    
    if (totalScore >= 11) {
      level = 'severe';
      interpretation = 'Severe Bronchiolitis';
    } else if (totalScore >= 6) {
      level = 'moderate';
      interpretation = 'Moderate Bronchiolitis';
    }

    if (data.apnea === true || s1 === 3) {
      details.push("HIGH RISK: Monitor closely for apnea and exhaustion.");
    }
    
    if (s1 === 3) {
      details.push("Aspiration Risk: Keep NPO / IV fluids due to tachypnea (RR > 60).");
    }

    if (data.isPremature === true && Number(data.ageMonths || 0) < 6) {
        details.push("Vulnerable Infant: Lower threshold for admission due to prematurity.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Modified Tal Score",
        totalScore: totalScore,
        maxScore: 12,
        interpretation,
        referenceTable: [
          { range: "≤ 5", meaning: "Mild Bronchiolitis" },
          { range: "6 - 10", meaning: "Moderate Bronchiolitis" },
          { range: "11 - 12", meaning: "Severe Bronchiolitis" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const management = [
      {
        title: "Standard Supportive Care",
        recommendations: [
          "Nasal suctioning before feeds and sleep.",
          "Maintain hydration; consider NG or IV if intake < 50% or RR > 60.",
          "Oxygen support only if persistent SpO2 < 90-92%."
        ]
      }
    ];

    if (severity.level === 'severe') {
      management.push({
        title: "Severe Management",
        recommendations: [
          "Urgent senior/PICU review.",
          "Continuous monitoring.",
          "Consider High-Flow Nasal Cannula (HFNC) or CPAP.",
          "Keep NPO; start IV fluids."
        ]
      });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || data.apnea === true) return ["Admit to PICU/HDU."];
    if (severity.level === 'moderate') return ["Admit to pediatric ward for observation and hydration support."];
    return ["Home management if feeding is adequate and SpO2 is stable."];
  },
  getRedFlags: () => ["Apnea", "Cyanosis", "Poor feeding", "Exhaustion", "Grunting"],
  getDrugDoses: () => [
    { drugName: "Salbutamol Trial", dose: "Not routine; consider only if family history of asthma or atopy.", notes: "Stop if no objective response." },
    { drugName: "Hypertonic Saline (3%)", dose: "4 mL via nebulizer", notes: "Consider in hospitalized patients to reduce length of stay." }
  ],
  getReferences: () => [
    { title: "AAP Clinical Practice Guideline: Bronchiolitis", url: "https://publications.aap.org/pediatrics/article/134/2/e547/32906/Clinical-Practice-Guideline-The-Diagnosis-and" }
  ],
};
