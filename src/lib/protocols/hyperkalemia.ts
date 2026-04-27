import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hyperkalemiaProtocol: DiseaseProtocol = {
  id: 'hyperkalemia',
  name: 'Hyperkalemia',
  system: 'Electrolyte Disturbances',
  description: 'Management of elevated serum potassium (K+), a life-threatening electrolyte emergency.',
  image: {
    url: "https://picsum.photos/seed/hyperkalemia/600/400",
    hint: "heart ecg"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'potassiumLevel', questionText: 'Serum Potassium (K+)', type: 'number', unit: 'mEq/L' },
    { id: 'hasEkgChanges', questionText: 'Are there EKG changes?', type: 'boolean', info: 'Peaked T waves, wide QRS, sine wave pattern, bradycardia, AV block.' },
    { id: 'hasMuscleWeakness', questionText: 'Is there muscle weakness or paralysis?', type: 'boolean' },
    { id: 'hasRenalFailure', questionText: 'Is there known renal failure or anuria?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const potassium = Number(data.potassiumLevel);
    if (data.hasEkgChanges || data.hasMuscleWeakness || potassium >= 7.0) {
      return { level: 'severe', details: ["Severe hyperkalemia with signs of toxicity. This is a medical emergency."] };
    }
    if (potassium >= 6.0) {
      return { level: 'moderate', details: ["Moderate hyperkalemia. Requires urgent treatment to prevent toxicity."] };
    }
    if (potassium >= 5.5) {
      return { level: 'mild', details: ["Mild hyperkalemia. Requires investigation and management of the underlying cause."] };
    }
    return { level: 'unknown', details: ['Assess serum potassium and check for signs of toxicity.'] };
  },
  getManagement: (severity) => {
    const management = [];
    if (severity.level === 'severe') {
        management.push({
            title: "IMMEDIATE Management of Severe Hyperkalemia",
            recommendations: [
                "1. Stabilize Myocardium: Administer CALCIUM GLUCONATE IV immediately to protect the heart.",
                "2. Shift K+ Intracellularly: Give IV INSULIN and DEXTROSE. Give high-dose nebulized ALBUTEROL. Consider SODIUM BICARBONATE for severe acidosis.",
                "3. Remove K+ from Body: Administer FUROSEMIDE (if not anuric). Prepare for emergent dialysis, especially in renal failure.",
                "Place patient on a continuous cardiac monitor and obtain frequent EKGs.",
                "Stop all sources of exogenous potassium."
            ]
        });
    } else if (severity.level === 'moderate') {
         management.push({
            title: "Management of Moderate Hyperkalemia",
            recommendations: [
                "1. Shift K+ Intracellularly: Consider IV Insulin/Dextrose and/or nebulized Albuterol.",
                "2. Remove K+ from Body: Administer Furosemide and/or potassium-binding resins (e.g., Kayexalate, Patiromer).",
                "Place on cardiac monitor.",
                "Identify and treat the underlying cause.",
            ]
        });
    } else { // Mild
         management.push({
            title: "Management of Mild Hyperkalemia",
            recommendations: [
                "Identify and treat underlying cause (e.g., review medications, assess renal function).",
                "Consider loop diuretics (Furosemide) or potassium-binding resins.",
                "Dietary potassium restriction.",
            ]
        });
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Immediate admission to a monitored setting (PICU for severe) is required."];
    }
    return ["Outpatient management may be possible for mild, chronic hyperkalemia with close follow-up."];
  },
  getRedFlags: () => [
    "Any EKG changes (peaked T waves are the first sign)",
    "Muscle weakness or paralysis",
    "Serum K+ > 6.5 mEq/L",
    "Rapidly rising potassium level"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    doses.push({ drugName: "Calcium Gluconate 10%", dose: "0.5 - 1 mL/kg (max 20mL) IV over 5-10 min", notes: "For cardiac membrane stabilization. Does not lower serum K+." });
    doses.push({ drugName: "Insulin (Regular) + Dextrose", dose: "Insulin: 0.1 units/kg IV. Dextrose: 0.5 g/kg IV (e.g., 2 mL/kg of D25W).", notes: "Give together to shift K+ intracellularly." });
    doses.push({ drugName: "Albuterol (nebulized)", dose: "10 - 20 mg nebulized over 15 minutes.", notes: "High dose required for K+ shifting." });
    doses.push({ drugName: "Sodium Bicarbonate", dose: "1 - 2 mEq/kg IV", notes: "Most effective in patients with metabolic acidosis." });
    doses.push({ drugName: "Furosemide", dose: "1 - 2 mg/kg IV", notes: "To enhance potassium excretion. Requires adequate renal function." });

    return doses;
  },
  getReferences: () => [
      { title: "UpToDate: Treatment and prevention of hyperkalemia in adults", url: "https://www.uptodate.com/contents/treatment-and-prevention-of-hyperkalemia-in-adults" }
  ],
};

    