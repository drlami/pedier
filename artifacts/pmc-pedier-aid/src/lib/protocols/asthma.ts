import type { DiseaseProtocol, FormData, Severity } from './types';

export const asthmaProtocol: DiseaseProtocol = {
  id: 'asthma',
  name: 'Asthma Exacerbation',
  system: 'Respiratory',
  description: 'Assessment and management of acute asthma exacerbations in children.',
   image: {
    url: "https://picsum.photos/seed/asthma/600/400",
    hint: "inhaler"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'age', questionText: 'Age', type: 'number', unit: 'years' },
    { id: 'speech', questionText: 'Speech', type: 'select', options: [{label: 'Normal sentences', value: 'normal'}, {label: 'Short phrases', value: 'phrases'}, {label: 'Single words', value: 'words'}] },
    { id: 'respiratoryRate', questionText: 'Respiratory Rate', type: 'number', unit: 'breaths/min' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation', type: 'number', unit: '%' },
    { id: 'wheeze', questionText: 'Wheeze', type: 'select', options: [{label: 'None/Mild end-expiratory', value: 'mild'}, {label: 'Moderate', value: 'moderate'}, {label: 'Severe, inspiratory and expiratory', value: 'severe'}, {label: 'Silent Chest', value: 'silent'}] },
    { id: 'accessoryMuscleUse', questionText: 'Accessory Muscle Use', type: 'select', options: [{label: 'None', value: 'none'}, {label: 'Mild', value: 'mild'}, {label: 'Marked', value: 'marked'}] },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Agitated/Anxious', value: 'agitated'}, {label: 'Drowsy/Confused', value: 'drowsy'}] },
    { id: 'pef', questionText: 'PEF (% predicted/personal best)', type: 'number', unit: '%', info: 'If available and child is >5 years old' },
    { id: 'highRiskHistory', questionText: 'High-risk asthma history?', type: 'boolean', info: 'Previous ICU/intubation, recent admission, frequent SABA use, poor access to care, or poor response to initial treatment.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    if (data.mentalStatus === 'drowsy' || data.wheeze === 'silent') {
        details.push("Drowsiness or silent chest indicates impending respiratory failure.");
        return { level: 'impending respiratory failure', details };
    }
    
    let severeCount = 0;
    let moderateCount = 0;

    if (data.speech === 'words') { severeCount++; details.push("Speaks in single words"); }
    if (data.accessoryMuscleUse === 'marked') { severeCount++; details.push("Marked accessory muscle use"); }
    if (data.mentalStatus === 'agitated') { severeCount++; details.push("Agitated"); }
    if (Number(data.oxygenSaturation) < 92) { severeCount++; details.push("O2 Sat < 92%"); }
    if (data.wheeze === 'severe') { severeCount++; details.push("Severe wheezing"); }
    if (Number(data.pef) < 50) { severeCount++; details.push("PEF < 50%"); }
    if (data.highRiskHistory) { severeCount++; details.push("High-risk asthma history"); }

    if (severeCount > 0) return { level: 'severe', details };
    
    if (data.speech === 'phrases') { moderateCount++; details.push("Speaks in phrases"); }
    if (data.accessoryMuscleUse === 'mild') { moderateCount++; details.push("Mild accessory muscle use"); }
    if (Number(data.oxygenSaturation) >= 92 && Number(data.oxygenSaturation) <= 95) { moderateCount++; details.push("O2 Sat 92-95%"); }
    if (data.wheeze === 'moderate') { moderateCount++; details.push("Moderate wheezing"); }
    if (Number(data.pef) >= 50 && Number(data.pef) <= 70) { moderateCount++; details.push("PEF 50-70%"); }

    if (moderateCount > 0) return { level: 'moderate', details };
    
    details.push("Mild symptoms");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [];
    
    if(severity.level === 'impending respiratory failure' || severity.level === 'severe'){
         management.push({
            title: "Initial Treatment (Severe / Impending RF)",
            recommendations: [
                "Call senior clinician/PICU early. Place on continuous monitoring and give oxygen to maintain SpO2 ≥ 94%.",
                "Continuous or back-to-back Albuterol + Ipratropium nebulization for the first hour.",
                "Systemic Corticosteroids: Administer immediately.",
                "IV Magnesium Sulfate over 20-30 minutes.",
                "Reassess work of breathing, air entry, mental status, SpO2, and need for bronchodilator every 15-20 minutes.",
                "Consider IV fluid bolus only if dehydrated or poor perfusion; avoid overhydration.",
                "If fatigue, rising CO2, altered mental status, persistent hypoxemia, or poor response: prepare for non-invasive or invasive ventilation with PICU/anesthesia."
            ]
        });
    }
    if(severity.level === 'moderate'){
         management.push({
            title: "Initial Treatment (Moderate)",
            recommendations: [
                "Albuterol + Ipratropium MDI with spacer (or nebulizer) x 3 doses every 20 minutes.",
                "Systemic Corticosteroids: Administer immediately.",
                "Give oxygen if needed to maintain SpO2 ≥ 94%.",
                "Re-assess after 1 hour. If improving, continue albuterol every 1-4 hours as needed."
            ]
        });
    }
    if(severity.level === 'mild'){
         management.push({
            title: "Initial Treatment (Mild)",
            recommendations: [
                "Albuterol MDI with spacer, 2-6 puffs every 4-6 hours as needed.",
                "Consider a short course of oral corticosteroids, especially if no immediate response to albuterol or recent exacerbation."
            ]
        });
    }
    
    return management;
  },
  getDisposition: (severity, data) => {
    if(severity.level === 'impending respiratory failure' || severity.level === 'severe'){
        return ["Admit for ongoing bronchodilator therapy and monitoring. PICU/HDU is required for impending respiratory failure, persistent hypoxemia, exhaustion, altered mental status, need for continuous albuterol, magnesium/IV therapy, or poor response after the first hour."];
    }
    if(severity.level === 'moderate'){
        return ["Admit to hospital if poor response to initial therapy, persistent hypoxia, or inability to tolerate q4h albuterol.", "Consider discharge if significant improvement, tolerating q4h albuterol, and SpO2 >94% on room air."];
    }
    return ["Discharge home with clear action plan if good response to treatment, minimal work of breathing, stable SpO2 on room air, and bronchodilator need spaced to at least every 3-4 hours.", "Ensure patient has controller/rescue medications, spacer technique review, and understands return precautions.", "Follow up with primary care/asthma clinic within 2-5 days."];
  },
  getRedFlags: () => [
    "Silent chest",
    "Drowsiness or confusion (altered mental status)",
    "Inability to speak in full sentences (or single words in severe cases)",
    "Cyanosis",
    "Poor respiratory effort or fatigue"
  ],
  getDrugDoses: (severity, data) => {
      const weight = Number(data.weight) || 0;
      const predMin = weight > 0 ? Math.min(1 * weight, 60).toFixed(0) : "";
      const predMax = weight > 0 ? Math.min(2 * weight, 60).toFixed(0) : "";
      const dexDose = weight > 0 ? Math.min(0.6 * weight, 16).toFixed(1) : "";
      const magMin = weight > 0 ? Math.min(25 * weight, 2000).toFixed(0) : "";
      const magMax = weight > 0 ? Math.min(75 * weight, 2000).toFixed(0) : "";
      const continuousAlbuterol = weight > 0 ? Math.min(0.5 * weight, 20).toFixed(1) : "";
      const doses = [
        { drugName: "Albuterol (MDI 90mcg/puff)", dose: "4-8 puffs q20min x3 doses, then as needed" },
        { drugName: "Ipratropium Bromide (MDI)", dose: "4-8 puffs q20min x3 doses (with albuterol)" },
        { drugName: "Prednisone/Prednisolone", dose: weight > 0 ? `1-2 mg/kg (max 60mg) = ${predMin}-${predMax} mg PO` : "1-2 mg/kg (max 60mg), oral" },
        { drugName: "Dexamethasone", dose: weight > 0 ? `0.6 mg/kg (max 16mg) = ${dexDose} mg PO/IM/IV` : "0.6 mg/kg (max 16mg), oral/IM/IV" },
      ];
      if (severity.level === 'severe' || severity.level === 'impending respiratory failure') {
          doses.push({ drugName: "Magnesium Sulfate", dose: weight > 0 ? `25-75 mg/kg (max 2g) = ${magMin}-${magMax} mg IV over 20-30 min` : "25-75 mg/kg (max 2g) IV over 20-30 min" });
          doses.push({ drugName: "Continuous Albuterol", dose: weight > 0 ? `0.5 mg/kg/hr (max 15-20 mg/hr) = ${continuousAlbuterol} mg/hr` : "0.5 mg/kg/hr (max 15-20 mg/hr)"});
      }
      return doses;
  },
  getReferences: () => [{ title: "Global Initiative for Asthma (GINA) Reports", url: "https://ginasthma.org/gina-reports/" }],
};
