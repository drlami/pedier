import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hypomagnesemiaProtocol: DiseaseProtocol = {
  id: 'hypomagnesemia',
  name: 'Hypomagnesemia',
  system: 'Electrolyte Disturbances',
  description: 'Management of low serum magnesium levels, a common but often overlooked electrolyte abnormality.',
  image: {
    url: "https://picsum.photos/seed/hypomagnesemia/600/400",
    hint: "torsades ecg"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'magnesiumLevel', questionText: 'Serum Magnesium', type: 'number', unit: 'mg/dL' },
    { id: 'hasSevereSymptoms', questionText: 'Are there severe symptoms?', type: 'boolean', info: 'e.g., seizures, tetany, arrhythmia (Torsades de pointes).'},
    { id: 'hasConcurrentHypokalemiaHypocalcemia', questionText: 'Is there refractory hypokalemia or hypocalcemia?', type: 'boolean', info: 'Hypomagnesemia prevents correction of these other electrolytes.'},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const magnesium = Number(data.magnesiumLevel);
    if (data.hasSevereSymptoms || magnesium < 1.0) {
      return { level: 'severe', details: ["Severe or symptomatic hypomagnesemia. Requires IV repletion."] };
    }
    if (magnesium < 1.5) {
      return { level: 'mild', details: ["Mild, asymptomatic hypomagnesemia."] }; // Using 'mild' for all non-severe
    }
    return { level: 'unknown', details: ['Assess serum magnesium and for symptoms.'] };
  },
  getManagement: (severity) => {
    if (severity.level === 'severe') {
        return [{
            title: "Management of Severe/Symptomatic Hypomagnesemia",
            recommendations: [
                "Place patient on a cardiac monitor.",
                "Administer IV Magnesium Sulfate. In an emergency (Torsades, seizure), can be given as a rapid bolus. For non-emergent repletion, infuse slowly over several hours to prevent hypotension and improve renal retention.",
                "Check and replete other electrolytes, especially potassium and calcium.",
                "Monitor for signs of hypermagnesemia during infusion (loss of deep tendon reflexes, respiratory depression, hypotension).",
                "Investigate and treat the underlying cause (e.g., GI losses, renal losses, malnutrition)."
            ]
        }];
    }
    // Mild/Asymptomatic
    return [{
        title: "Management of Mild/Asymptomatic Hypomagnesemia",
        recommendations: [
            "Oral magnesium supplementation is preferred.",
            "Magnesium Oxide is a common formulation, but can cause diarrhea.",
            "Address underlying cause and encourage dietary intake of magnesium-rich foods.",
        ]
    }];
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Admission to a monitored setting is required for IV magnesium repletion."];
    }
    return ["Outpatient management with oral supplements is appropriate for mild, asymptomatic cases."];
  },
  getRedFlags: () => [
    "Seizures or tetany",
    "Torsades de pointes or other ventricular arrhythmias",
    "Concurrent refractory hypokalemia or hypocalcemia",
    "Serum Mg < 1.0 mg/dL"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        doses.push({ drugName: "IV Magnesium Sulfate", dose: `25-50 mg/kg (max 2g)`, notes: `Calculated dose: ${Math.min(25*weight, 2000)}-${Math.min(50*weight, 2000)} mg. Give over 30-60 mins for urgent repletion, or faster (5-10 min) for Torsades.` });
    } else {
        doses.push({ drugName: "IV Magnesium Sulfate", dose: "25-50 mg/kg (max 2g)", notes: "Enter weight to calculate dose." });
    }
    doses.push({ drugName: "Oral Magnesium Oxide", dose: "Dose varies by formulation. Target 10-20 mg/kg/day of elemental magnesium.", notes: "Limited by GI side effects (diarrhea)." });

    return doses;
  },
  getReferences: () => [
      { title: "UpToDate: Evaluation and treatment of hypomagnesemia", url: "https://www.uptodate.com/contents/evaluation-and-treatment-of-hypomagnesemia" }
  ],
};

    