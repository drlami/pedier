import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const smokeInhalationProtocol: DiseaseProtocol = {
  id: 'smoke-inhalation-burns',
  name: 'Smoke Inhalation & Airway Burns',
  system: 'Respiratory',
  description: 'Emergency assessment of thermal airway injury and smoke inhalation.',
  image: {
    url: "https://picsum.photos/seed/fire/600/400",
    hint: "fire emergency"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'facialBurns', questionText: 'Deep facial burns?', type: 'boolean' },
    { id: 'singedHairs', questionText: 'Singed nasal hairs or eyebrows?', type: 'boolean' },
    { id: 'carbonSputum', questionText: 'Carbonaceous (sooty) sputum?', type: 'boolean' },
    { id: 'voiceChange', questionText: 'Hoarseness or change in voice?', type: 'boolean' },
    { id: 'stridor', questionText: 'Stridor or "barky" cough?', type: 'boolean' },
    { id: 'enclosedSpace', questionText: 'Trapped in an enclosed space?', type: 'boolean' },
    { id: 'ams', questionText: 'Altered Mental Status / Confusion?', type: 'boolean', info: 'Consider Carbon Monoxide (CO) poisoning.' },
    { id: 'bsa', questionText: 'Estimated % BSA Burned (Total)', type: 'number', unit: '%' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let riskCount = 0;

    if (data.facialBurns) riskCount++;
    if (data.singedHairs) riskCount++;
    if (data.carbonSputum) riskCount++;
    if (data.voiceChange) riskCount++;
    if (data.stridor) riskCount++;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Low Risk for Airway Compromise';

    if (data.stridor === true || data.voiceChange === true) {
      level = 'impending respiratory failure';
      interpretation = 'CRITICAL: PROBABLE AIRWAY EDEMA';
      details.push("Immediate expert airway assessment required.");
    } else if (riskCount >= 2 || data.enclosedSpace === true) {
      level = 'severe';
      interpretation = 'High Risk for Inhalation Injury';
      details.push("Early intubation should be considered before edema worsens.");
    }

    if (data.ams === true) {
        details.push("SUSPECT CARBON MONOXIDE (CO) POISONING. Start 100% O2.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Inhalation Injury Risk",
        totalScore: riskCount,
        maxScore: 5,
        interpretation,
        referenceTable: [
          { range: "Stridor/Voice Change", meaning: "CRITICAL - Secure Airway Now" },
          { range: "2+ Signs", meaning: "HIGH RISK - Probable Intubation" },
          { range: "0-1 Sign", meaning: "MODERATE RISK - Observe closely" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight || 0);
    const bsa = Number(data.bsa || 0);
    const management = [
      {
        title: "Immediate Actions",
        recommendations: [
          "Start 100% humidified oxygen via non-rebreather mask (treats CO poisoning).",
          "Continuous pulse oximetry and CO-oximetry (if available).",
          "Remove all burned clothing and jewelry."
        ]
      }
    ];

    if (severity.level === 'impending respiratory failure' || severity.level === 'severe') {
      management.push({
        title: "Airway Management",
        recommendations: [
          "Call Anesthesia, ENT, and PICU immediately.",
          "Prepare for early intubation with a CUFFED tube (expect airway swelling).",
          "Secure airway BEFORE transferring to a burn center."
        ]
      });
    }

    if (bsa > 10 && weight > 0) {
        const parkland = (4 * weight * bsa).toFixed(0);
        management.push({
            title: "Fluid Resuscitation (Parkland)",
            recommendations: [
                `Total LR Fluids for 24h: ${parkland} mL.`,
                `Give 50% (${(Number(parkland)/2).toFixed(0)} mL) over the first 8 hours.`,
                `Give remaining 50% over the next 16 hours.`,
                "Add maintenance fluids (D5NS) for children < 20kg."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity) => ["Admit to Burn Center or PICU."],
  getRedFlags: () => ["Stridor", "Voice change", "Confusion (CO poisoning)", "Sooty sputum", "Explosion history"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ABLS: Inhalation Injury Management", url: "https://ameriburn.org/" }
  ],
};
