import type { DiseaseProtocol, FormData, Severity } from './types';

export const pneumoniaProtocol: DiseaseProtocol = {
  id: 'pneumonia',
  name: 'Pneumonia',
  system: 'Respiratory',
  description: 'Assessment and management of community-acquired pneumonia in children.',
  image: {
    url: "https://picsum.photos/seed/pneumonia/600/400",
    hint: "chest xray"
  },
  questions: [
    { id: 'age', questionText: 'Age', type: 'number', unit: 'months' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation', type: 'number', unit: '%' },
    { id: 'respiratoryRate', questionText: 'Respiratory Rate', type: 'number', unit: 'breaths/min' },
    { id: 'chestIndrawing', questionText: 'Lower chest wall indrawing?', type: 'boolean' },
    { id: 'grunting', questionText: 'Grunting?', type: 'boolean' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Irritable', value: 'irritable'}, {label: 'Lethargic/unconscious', value: 'lethargic'}] },
    { id: 'feeding', questionText: 'Able to feed/drink?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const ageMonths = Number(data.age);
    const rr = Number(data.respiratoryRate);
    
    const tachypnea = 
      (ageMonths < 2 && rr > 60) ||
      (ageMonths >= 2 && ageMonths <= 12 && rr > 50) ||
      (ageMonths > 12 && rr > 40);

    if (tachypnea) details.push("Tachypnea present for age");

    // WHO criteria for severe pneumonia & danger signs
    if (data.mentalStatus === 'lethargic' || !data.feeding || data.grunting || Number(data.oxygenSaturation) < 90) {
        details.push("Danger signs present (lethargy, inability to feed, grunting, or SpO2 < 90%)");
        return { level: 'severe', details };
    }
    if (data.chestIndrawing) {
        details.push("Lower chest wall indrawing");
        return { level: 'severe', details };
    }
    if (tachypnea) {
        details.push("Tachypnea is the only major sign");
        return { level: 'mild', details }; // Corresponds to WHO "Pneumonia"
    }
    
    details.push("No WHO criteria for pneumonia met.");
    return { level: 'no', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Severe Pneumonia Management",
          recommendations: [
            "Admit to hospital immediately.",
            "Administer supplemental oxygen to maintain SpO2 > 92%.",
            "Start IV antibiotics (e.g., Ampicillin or Ceftriaxone). Consider adding Azithromycin for atypical coverage.",
            "Provide IV fluids for hydration if oral intake is poor.",
            "Monitor for complications (pleural effusion, empyema)."
          ]
        }];
      case 'mild':
        return [{
          title: "Mild Pneumonia (Non-severe) Management",
          recommendations: [
            "Treat with oral Amoxicillin (high dose: 80-90 mg/kg/day).",
            "Supportive care: hydration, antipyretics.",
            "Educate parents on signs of worsening and when to return.",
            "Follow up in 24-48 hours.",
          ]
        }];
      default: // 'no'
        return [{
          title: "No Pneumonia",
          recommendations: [
            "Symptoms likely due to another cause (e.g., viral URI, bronchiolitis).",
            "Provide supportive care and return precautions."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to hospital required. Consider PICU for severe distress or hypoxia."];
    }
    return ["Consider discharge home for mild pneumonia if reliable caregivers, good follow-up, and no other risk factors.", "Admit if there is social concern, significant comorbidities, or failure of outpatient therapy."];
  },
  getRedFlags: () => [
    "Inability to feed or drink",
    "Lethargy, decreased consciousness",
    "Hypoxemia (SpO2 < 90%)",
    "Severe respiratory distress (grunting, severe retractions)",
    "Cyanosis",
    "Failure to improve on oral antibiotics"
  ],
  getDrugDoses: () => [
    { drugName: "Amoxicillin (oral)", dose: "80-90 mg/kg/day divided BID-TID", notes: "First-line for outpatient treatment." },
    { drugName: "Ampicillin (IV)", dose: "150-200 mg/kg/day divided q6h", notes: "For inpatient treatment." },
    { drugName: "Ceftriaxone (IV/IM)", dose: "50-100 mg/kg/day divided QD-BID", notes: "For inpatient treatment, especially if not fully immunized or more severe illness." },
    { drugName: "Azithromycin (PO/IV)", dose: "10 mg/kg on day 1, then 5 mg/kg daily", notes: "Added for atypical coverage in older children." },
  ],
  getReferences: () => [{ title: "PIDS/IDSA Clinical Practice Guideline for Community-Acquired Pneumonia", url: "https://www.idsociety.org/practice-guideline/cap-in-children/" }],
};
