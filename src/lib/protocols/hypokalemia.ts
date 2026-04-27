
import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hypokalemiaProtocol: DiseaseProtocol = {
  id: 'hypokalemia',
  name: 'Hypokalemia',
  system: 'Electrolyte Disturbances',
  description: 'Management of low serum potassium levels.',
  image: {
    url: "https://picsum.photos/seed/hypokalemia/600/400",
    hint: "flat ecg"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'potassiumLevel', questionText: 'Serum Potassium (K+)', type: 'number', unit: 'mEq/L' },
    { id: 'hasEkgChanges', questionText: 'Are there EKG changes?', type: 'boolean', info: 'T-wave flattening, U-waves, ST depression, arrhythmias.' },
    { id: 'hasMuscleWeakness', questionText: 'Is there significant muscle weakness, ileus, or paralysis?', type: 'boolean' },
    { id: 'canTakePO', questionText: 'Is the patient able to take oral medications?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const potassium = Number(data.potassiumLevel);
    if (data.hasEkgChanges || data.hasMuscleWeakness || potassium < 2.5) {
      return { level: 'severe', details: ["Severe hypokalemia with signs of toxicity. Requires IV repletion."] };
    }
    if (potassium < 3.0) {
      return { level: 'moderate', details: ["Moderate hypokalemia. Repletion is necessary."] };
    }
    if (potassium < 3.5) {
      return { level: 'mild', details: ["Mild hypokalemia."] };
    }
    return { level: 'unknown', details: ['Assess serum potassium and check for signs of toxicity.'] };
  },
  getManagement: (severity, data) => {
    const management = [];
    management.push({
        title: "Key Principles",
        recommendations: [
            "1. Check Magnesium: Hypomagnesemia often accompanies hypokalemia and prevents its correction. Replete magnesium first or concurrently.",
            "2. Replete cautiously: Rapid IV potassium infusion is dangerous and can cause fatal arrhythmias."
        ]
    });

    if (severity.level === 'severe' || !data.canTakePO) {
        management.push({
            title: "Management of Severe Hypokalemia (or PO intolerant)",
            recommendations: [
                "Place patient on a continuous cardiac monitor.",
                "Begin IV potassium repletion. This must be done slowly.",
                "Peripheral line infusion rate should generally not exceed 0.3-0.5 mEq/kg/hr.",
                "Concentration in peripheral lines should generally not exceed 40 mEq/L.",
                "Central line infusion allows for higher rates and concentrations, but requires PICU monitoring.",
                "Frequent monitoring of serum K+ is required during IV repletion (e.g., every 2-4 hours)."
            ]
        });
    } else { // Mild/Moderate and can take PO
         management.push({
            title: "Management of Mild/Moderate Hypokalemia",
            recommendations: [
                "Oral potassium repletion is preferred as it is safer.",
                "Administer oral Potassium Chloride (liquid or tablet).",
                "Encourage diet rich in potassium.",
                "Address the underlying cause of potassium loss (e.g., diarrhea, diuretics)."
            ]
        });
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Admission to a monitored bed (telemetry or PICU) is mandatory for IV potassium repletion."];
    }
    return ["Outpatient management with oral supplementation is appropriate for mild, asymptomatic cases."];
  },
  getRedFlags: () => [
    "EKG changes (arrhythmias, U-waves)",
    "Severe muscle weakness or paralysis",
    "Ileus or respiratory muscle weakness",
    "Serum K+ < 2.5 mEq/L",
    "Concomitant digoxin therapy (hypokalemia potentiates digoxin toxicity)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (weight > 0) {
        doses.push({ drugName: "Oral Potassium Chloride", dose: `1-2 mEq/kg/day = ${(1*weight).toFixed(1)}-${(2*weight).toFixed(1)} mEq/day`, notes: `Divided in 2-4 doses.` });
        doses.push({ drugName: "IV Potassium Chloride (Peripheral)", dose: `Max rate: 0.3-0.5 mEq/kg/hr.`, notes: `Example rate for ${weight}kg: ${(0.3*weight).toFixed(1)} mEq/hr. Max concentration: 40 mEq/L.`});
        doses.push({ drugName: "IV Magnesium Sulfate", dose: `25-50 mg/kg = ${Math.min(25*weight, 2000).toFixed(0)} - ${Math.min(50*weight, 2000).toFixed(0)} mg`, notes: "If hypomagnesemia is also present. Max 2g. Give IV over 30-60 min."});
    } else {
        doses.push({ drugName: "Oral Potassium Chloride", dose: "1-2 mEq/kg/day divided in 2-4 doses." });
        doses.push({ drugName: "IV Potassium Chloride (Peripheral)", dose: "Max rate: 0.3-0.5 mEq/kg/hr. Max concentration: 40 mEq/L." });
        doses.push({ drugName: "IV Magnesium Sulfate", dose: "25-50 mg/kg (max 2g) IV over 30-60 min", notes: "If hypomagnesemia is also present."});
    }
    
    return doses;
  },
  getReferences: () => [
      { title: "UpToDate: Clinical manifestations and treatment of hypokalemia in adults", url: "https://www.uptodate.com/contents/clinical-manifestations-and-treatment-of-hypokalemia-in-adults" }
  ],
};
