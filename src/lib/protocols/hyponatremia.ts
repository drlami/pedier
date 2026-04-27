import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hyponatremiaProtocol: DiseaseProtocol = {
  id: 'hyponatremia',
  name: 'Hyponatremia',
  system: 'Electrolyte Disturbances',
  description: 'Management of low serum sodium, focusing on symptom severity and patient volume status.',
  image: {
    url: "https://picsum.photos/seed/hyponatremia/600/400",
    hint: "brain swell"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'sodiumLevel', questionText: 'Serum Sodium (Na+)', type: 'number', unit: 'mEq/L' },
    { id: 'hasSevereSymptoms', questionText: 'Are there severe neurologic symptoms?', type: 'boolean', info: 'e.g., seizures, coma, respiratory arrest.'},
    { id: 'volumeStatus', questionText: 'Estimated Volume Status', type: 'select', options: [
        {label: 'Hypovolemic (dehydrated, tachycardic)', value: 'hypovolemic'},
        {label: 'Euvolemic (no edema, no dehydration)', value: 'euvolemic'},
        {label: 'Hypervolemic (edema, JVD, rales)', value: 'hypervolemic'},
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.hasSevereSymptoms) {
      return { level: 'severe', details: ["Severe symptomatic hyponatremia. This is a neurologic emergency requiring hypertonic saline."] };
    }
    const sodium = Number(data.sodiumLevel);
    if (sodium < 125) {
      return { level: 'moderate', details: [`Profound hyponatremia (Na < 125 mEq/L) without severe symptoms. Requires cautious management.`] };
    }
    if (sodium < 135) {
      return { level: 'mild', details: ["Mild hyponatremia."] };
    }
    return { level: 'unknown', details: ['Assess serum sodium and symptoms.'] };
  },
  getManagement: (severity, data) => {
    const management = [];

    if (severity.level === 'severe') {
        management.push({
            title: "EMERGENCY: Severe Symptomatic Hyponatremia",
            recommendations: [
                "The goal is to rapidly increase serum sodium by 4-6 mEq/L to stop seizures/reverse herniation.",
                "Administer 3% Hypertonic Saline bolus: 2 mL/kg (max 100 mL) IV over 10-15 minutes.",
                "May repeat bolus 1-2 times if symptoms persist.",
                "Once symptoms resolve, stop boluses and transition to cautious correction. The overall correction goal is still ≤ 8-10 mEq/L in 24 hours to prevent Osmotic Demyelination Syndrome (ODS).",
                "Admit to PICU for frequent neurologic and electrolyte monitoring."
            ]
        });
    } else { // Mild/Moderate
        management.push({
            title: "Key Principle: Avoid Rapid Correction",
            recommendations: [
                "Rapid correction of chronic hyponatremia (>48h) can cause Osmotic Demyelination Syndrome (ODS), a devastating neurologic injury.",
                "The maximum correction rate should be 8-10 mEq/L in any 24-hour period."
            ]
        });
        
        switch (data.volumeStatus) {
            case 'hypovolemic':
                management.push({ title: "Management of Hypovolemic Hyponatremia", recommendations: ["Treat with isotonic fluids (0.9% Normal Saline) to restore volume. This will turn off the ADH stimulus and allow the kidneys to excrete free water, auto-correcting the sodium."]});
                break;
            case 'euvolemic':
                management.push({ title: "Management of Euvolemic Hyponatremia (likely SIADH)", recommendations: ["Fluid restriction is the primary treatment.", "Identify and treat the underlying cause of SIADH (e.g., CNS disorders, pulmonary disease, medications)."]});
                break;
            case 'hypervolemic':
                management.push({ title: "Management of Hypervolemic Hyponatremia (e.g., heart failure, cirrhosis)", recommendations: ["Treat with fluid restriction and diuretics (e.g., Furosemide).", "Treat the underlying condition."]});
                break;
        }
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to PICU is mandatory."];
    }
    return ["All patients with moderate to severe hyponatremia require admission for controlled correction and monitoring.", "Mild cases may be managed outpatient if the cause is clear and can be corrected."];
  },
  getRedFlags: () => [
    "Seizures, coma, or other severe neurologic signs.",
    "Rapid drop in serum sodium.",
    "Very low serum sodium (<120 mEq/L) even if asymptomatic.",
    "Correction of sodium faster than 10-12 mEq/L in 24 hours."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        doses.push({ drugName: "3% Hypertonic Saline Bolus", dose: `2 mL/kg (max 100 mL) = ${(2*weight).toFixed(1)} mL`, notes: "For severe neurologic symptoms ONLY. Give over 10-15 min." });
    } else {
        doses.push({ drugName: "3% Hypertonic Saline Bolus", dose: "2 mL/kg (max 100 mL)", notes: "For severe neurologic symptoms ONLY. Enter weight." });
    }
    doses.push({ drugName: "Correction Rate Limit", dose: "≤ 8-10 mEq/L per 24 hours", notes: "To prevent Osmotic Demyelination Syndrome (ODS)." });

    return doses;
  },
  getReferences: () => [
    { title: "UpToDate: Treatment of hyponatremia: Syndrome of inappropriate antidiuretic hormone secretion (SIADH) and reset osmostat", url: "https://www.uptodate.com/contents/treatment-of-hyponatremia-syndrome-of-inappropriate-antidiuretic-hormone-secretion-siadh-and-reset-osmostat" }
  ],
};

    