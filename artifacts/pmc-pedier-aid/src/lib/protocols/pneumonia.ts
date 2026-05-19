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
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'age', questionText: 'Age', type: 'number', unit: 'months' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation', type: 'number', unit: '%' },
    { id: 'respiratoryRate', questionText: 'Respiratory Rate', type: 'number', unit: 'breaths/min' },
    { id: 'chestIndrawing', questionText: 'Lower chest wall indrawing?', type: 'boolean' },
    { id: 'grunting', questionText: 'Grunting?', type: 'boolean' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Irritable', value: 'irritable'}, {label: 'Lethargic/unconscious', value: 'lethargic'}] },
    { id: 'feeding', questionText: 'Able to feed/drink?', type: 'boolean' },
    { id: 'comorbidity', questionText: 'Significant comorbidity or incomplete immunization?', type: 'boolean', info: 'Chronic heart/lung disease, immunocompromise, neuromuscular disease, sickle cell disease, or incomplete Hib/pneumococcal immunization.' },
    { id: 'complicated', questionText: 'Concern for complicated pneumonia?', type: 'boolean', info: 'Pleural effusion/empyema, necrotizing pneumonia, severe chest pain, persistent fever, sepsis, or failure of outpatient antibiotics.' },
    { id: 'atypicalFeatures', questionText: 'Atypical pneumonia features in school-aged child/adolescent?', type: 'boolean', info: 'Gradual onset, persistent dry cough, headache/myalgia, outbreak exposure, or extrapulmonary symptoms.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const ageMonths = Number(data.age);
    const rr = Number(data.respiratoryRate);
    
    const tachypnea = 
      (ageMonths < 2 && rr > 60) ||
      (ageMonths >= 2 && ageMonths < 12 && rr > 50) ||
      (ageMonths >= 12 && rr > 40);

    if (tachypnea) details.push("Tachypnea present for age");

    // WHO criteria for severe pneumonia & danger signs
    if (data.mentalStatus === 'lethargic' || !data.feeding || data.grunting || Number(data.oxygenSaturation) < 90) {
        details.push("Danger signs present (lethargy, inability to feed, grunting, or SpO2 < 90%)");
        return { level: 'severe', details };
    }
    if (data.complicated) {
        details.push("Concern for complicated pneumonia or failed outpatient therapy");
        return { level: 'severe', details };
    }
    if (data.chestIndrawing) {
        details.push("Lower chest wall indrawing");
        return { level: 'moderate', details };
    }
    if (Number(data.oxygenSaturation) >= 90 && Number(data.oxygenSaturation) < 92) {
        details.push("Borderline hypoxemia");
        return { level: 'moderate', details };
    }
    if (data.comorbidity) {
        details.push("Comorbidity/incomplete immunization increases risk");
        return { level: 'moderate', details };
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
            "Start IV antibiotics. Use Ampicillin if fully immunized and uncomplicated; use Ceftriaxone/Cefotaxime if severe, complicated, not fully immunized, or local resistance concern.",
            "Add Azithromycin if atypical pneumonia is clinically suspected, especially in school-aged children/adolescents.",
            "Provide IV fluids for hydration if oral intake is poor.",
            "Obtain chest X-ray and consider CBC, blood culture, blood gas, and inflammatory markers if severe, hypoxic, septic, or complicated.",
            "Monitor for complications (pleural effusion, empyema, necrotizing pneumonia) and involve senior/PICU if shock, respiratory failure, or escalating oxygen support."
          ]
        }];
      case 'moderate':
        return [{
          title: "Moderate Pneumonia Management",
          recommendations: [
            "Consider admission or prolonged ED observation depending on oxygen saturation, work of breathing, hydration, age, comorbidity, and caregiver reliability.",
            "Give oxygen if needed to maintain SpO2 > 92% or per local policy.",
            "Use oral high-dose Amoxicillin if able to tolerate oral therapy and clinically stable; use IV antibiotics if vomiting, hypoxic, significant distress, or high-risk.",
            "Chest X-ray is recommended if hypoxemia, significant distress, failed outpatient therapy, or concern for complication."
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
    if (severity.level === 'moderate') {
      return ["Admit or observe closely if hypoxemia, lower chest indrawing, comorbidity, poor oral intake, social concern, or unreliable follow-up.", "Discharge only if work of breathing is mild, oxygenation is stable on room air, oral intake is adequate, and follow-up/return precautions are reliable."];
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
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const amoxMin = weight > 0 ? (80 * weight).toFixed(0) : "";
    const amoxMax = weight > 0 ? (90 * weight).toFixed(0) : "";
    const ampMin = weight > 0 ? (150 * weight).toFixed(0) : "";
    const ampMax = weight > 0 ? (200 * weight).toFixed(0) : "";
    const cefMin = weight > 0 ? (50 * weight).toFixed(0) : "";
    const cefMax = weight > 0 ? (100 * weight).toFixed(0) : "";
    const azithDay1 = weight > 0 ? Math.min(10 * weight, 500).toFixed(0) : "";
    const azithNext = weight > 0 ? Math.min(5 * weight, 250).toFixed(0) : "";

    return [
      { drugName: "Amoxicillin (oral)", dose: weight > 0 ? `80-90 mg/kg/day = ${amoxMin}-${amoxMax} mg/day divided BID-TID` : "80-90 mg/kg/day divided BID-TID", notes: "First-line for outpatient uncomplicated bacterial CAP when oral therapy is appropriate." },
      { drugName: "Ampicillin (IV)", dose: weight > 0 ? `150-200 mg/kg/day = ${ampMin}-${ampMax} mg/day divided q6h` : "150-200 mg/kg/day divided q6h", notes: "For inpatient uncomplicated CAP if fully immunized and local resistance supports use." },
      { drugName: "Ceftriaxone (IV/IM)", dose: weight > 0 ? `50-100 mg/kg/day = ${cefMin}-${cefMax} mg/day QD-BID` : "50-100 mg/kg/day divided QD-BID", notes: "For inpatient treatment, especially if not fully immunized, severe illness, complicated pneumonia, or local resistance concern." },
      { drugName: "Azithromycin (PO/IV)", dose: weight > 0 ? `10 mg/kg day 1 = ${azithDay1} mg, then 5 mg/kg daily = ${azithNext} mg/day` : "10 mg/kg on day 1, then 5 mg/kg daily", notes: "Add for atypical coverage in school-aged children/adolescents when clinically suspected." },
    ];
  },
  getReferences: () => [{ title: "PIDS/IDSA Clinical Practice Guideline for Community-Acquired Pneumonia", url: "https://www.idsociety.org/practice-guideline/cap-in-children/" }],
};
