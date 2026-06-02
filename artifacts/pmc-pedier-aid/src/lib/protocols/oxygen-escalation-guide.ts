import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const oxygenEscalationProtocol: DiseaseProtocol = {
  id: 'oxygen-escalation-guide',
  name: 'Oxygen Escalation Guide',
  system: 'Respiratory System',
  description: 'Clinical decision tool for escalating respiratory support from low-flow to HFNC/CPAP.',
  image: {
    url: "https://picsum.photos/seed/oxygen/600/400",
    hint: "oxygen mask"
  },
  questions: [
    { 
      id: 'currentSupport', 
      questionText: 'Current Respiratory Support', 
      type: 'select', 
      options: [
        {label: 'Room Air', value: '0', score: 0}, 
        {label: 'Low-Flow Nasal Cannula (1-4 L/min)', value: '1', score: 1},
        {label: 'Simple Face Mask (5-10 L/min)', value: '2', score: 2},
        {label: 'Non-Rebreather Mask (10-15 L/min)', value: '3', score: 3}
      ] 
    },
    { id: 'spo2', questionText: 'Current SpO2', type: 'number', unit: '%' },
    { 
      id: 'wob', 
      questionText: 'Work of Breathing', 
      type: 'select', 
      options: [
        {label: 'Mild (Intercostal retractions)', value: '1', score: 1}, 
        {label: 'Moderate (Subcostal/Nasal flaring)', value: '2', score: 2},
        {label: 'Severe (Suprasternal/Grunting)', value: '3', score: 3}
      ] 
    },
    { id: 'mentalStatus', questionText: 'Mentation', type: 'select', options: [{label: 'Alert', value: 'normal'}, {label: 'Agitated', value: 'agitated'}, {label: 'Drowsy', value: 'drowsy'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const spo2 = Number(data.spo2 || 100);
    const wob = Number(data.wob || 0);
    const current = Number(data.currentSupport || 0);

    let level: SeverityLevel = 'mild';
    let interpretation = 'Maintain Current Support';

    if (data.mentalStatus === 'drowsy' || (spo2 < 90 && current === 3)) {
      level = 'impending respiratory failure';
      interpretation = 'URGENT: CPAP / INTUBATION REQUIRED';
    } else if (spo2 < 92 || wob >= 2) {
      level = 'severe';
      interpretation = 'ESCALATE to HFNC / NIV';
    } else if (spo2 < 94 && current === 0) {
      level = 'moderate';
      interpretation = 'START Low-Flow Oxygen';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Respiratory Escalation Pathway",
        totalScore: wob + current,
        interpretation,
        referenceTable: [
          { range: "Failing NRB/Drowsy", meaning: "Intubation / CPAP" },
          { range: "Persistent WOB / Hypoxia", meaning: "HFNC (High Flow)" },
          { range: "Mild Hypoxia", meaning: "Low Flow Cannula" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'impending respiratory failure':
        return [{
          title: "Critical Escalation",
          recommendations: [
            "Call PICU and Anesthesia immediately.",
            "Start CPAP or Bilevel NIV if tolerated.",
            "Prepare for Rapid Sequence Induction (RSI).",
            "Maintain 100% O2 via NRB until secured."
          ]
        }];
      case 'severe':
        return [{
          title: "Escalate to HFNC (High Flow)",
          recommendations: [
            "Start HFNC at 1.5 - 2.0 L/kg/min.",
            "Initial FiO2 40-50%, titrate to SpO2 > 92%.",
            "Continuous monitoring in a high-acuity area.",
            "Notify senior clinician of escalation."
          ]
        }];
      case 'moderate':
        return [{
          title: "Start Low-Flow Oxygen",
          recommendations: [
            "Start Nasal Cannula at 0.5 - 2 L/min.",
            "Aim for SpO2 92-94%.",
            "Suction secretions; optimize positioning.",
            "Re-evaluate in 30-60 minutes."
          ]
        }];
      default:
        return [{ title: "Monitor", recommendations: ["Continue current support.", "Frequent reassessment of work of breathing."] }];
    }
  },
  getDisposition: (severity) => ["High-acuity area or PICU if escalating beyond low-flow."],
  getRedFlags: () => ["Drowsiness", "Silent chest", "Rising FiO2 needs", "Inability to maintain SpO2 > 90%"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "PALS: Management of Respiratory Failure", url: "https://cpr.heart.org/" }
  ],
};
