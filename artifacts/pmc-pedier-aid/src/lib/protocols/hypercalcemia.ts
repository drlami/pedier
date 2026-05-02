
import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hypercalcemiaProtocol: DiseaseProtocol = {
  id: 'hypercalcemia',
  name: 'Hypercalcemia',
  system: 'Electrolyte Disturbances',
  description: 'Management of elevated serum calcium levels.',
  image: {
    url: "https://picsum.photos/seed/hypercalcemia/600/400",
    hint: "kidney stones"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'calciumLevel', questionText: 'Total Serum Calcium', type: 'number', unit: 'mg/dL' },
    { id: 'hasSevereSymptoms', questionText: 'Are there severe symptoms?', type: 'boolean', info: 'e.g., severe dehydration, altered mental status, arrhythmias, coma.'},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const calcium = Number(data.calciumLevel);
    if (data.hasSevereSymptoms || calcium >= 14) {
      return { level: 'severe', details: [`Severe hypercalcemia (Ca > 14 mg/dL) or symptomatic. This is a medical emergency.`] };
    }
    if (calcium >= 12) {
      return { level: 'moderate', details: [`Moderate hypercalcemia (Ca 12-14 mg/dL).`] };
    }
    if (calcium > 10.5) {
      return { level: 'mild', details: [`Mild hypercalcemia (Ca 10.5-11.9 mg/dL).`] };
    }
    return { level: 'unknown', details: ['Assess serum calcium and symptoms.'] };
  },
  getManagement: (severity, data) => {
    const management = [];
    if (severity.level === 'severe' || severity.level === 'moderate') {
        management.push({
            title: "Management of Moderate to Severe Hypercalcemia",
            recommendations: [
                "1. AGGRESSIVE IV HYDRATION: The cornerstone of treatment. Start Normal Saline at 1.5 to 2 times maintenance rate to promote calcium excretion.",
                "2. FUROSEMIDE: After volume status is restored, give Furosemide to enhance calciuresis. Avoid in dehydrated patients.",
                "3. CALCITONIN: For rapid reduction of calcium. Effect is short-lived.",
                "4. BISPHOSPHONATES (e.g., Pamidronate): For long-term control, especially in malignancy-related hypercalcemia. Slow onset of action (2-4 days).",
                "Identify and treat the underlying cause (e.g., hyperparathyroidism, malignancy, vitamin D toxicity).",
                "Continuous cardiac monitoring is required for severe hypercalcemia due to risk of arrhythmias (short QT interval)."
            ]
        });
    } else { // Mild
         management.push({
            title: "Management of Mild Hypercalcemia",
            recommendations: [
                "Encourage oral hydration.",
                "Avoid thiazide diuretics, lithium, and large doses of Vitamin D and A.",
                "Further management depends on the underlying cause and should be guided by an endocrinologist.",
            ]
        });
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admission to hospital is required for IV hydration, diuresis, and monitoring. Severe cases may require PICU."];
    }
    return ["Outpatient management with endocrinology follow-up may be appropriate for asymptomatic mild hypercalcemia."];
  },
  getRedFlags: () => [
    "Serum calcium > 14 mg/dL",
    "Altered mental status, seizures, or coma",
    "EKG changes (shortened QT interval) or arrhythmias",
    "Acute renal failure",
    "Severe dehydration"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        doses.push({ drugName: "IV Hydration (Normal Saline)", dose: `Start at 1.5-2x maintenance rate.`, notes: `Initial bolus of 10-20 mL/kg (${(10*weight).toFixed(0)}-${(20*weight).toFixed(0)} mL) if dehydrated.` });
        doses.push({ drugName: "Furosemide", dose: `1-2 mg/kg IV = ${(1*weight).toFixed(1)} - ${(2*weight).toFixed(1)} mg`, notes: "Only give after patient is euvolemic. Give every 4-6 hours." });
        doses.push({ drugName: "Calcitonin", dose: `4 units/kg IM/SQ = ${(4*weight).toFixed(1)} units`, notes: "Rapid but transient effect. Give every 12 hours." });
        doses.push({ drugName: "Pamidronate", dose: `0.5-1 mg/kg IV infusion = ${(0.5*weight).toFixed(1)} - ${(1*weight).toFixed(1)} mg`, notes: "Infuse over 4-6 hours. Consult endocrinology." });
    } else {
        doses.push({ drugName: "IV Hydration (Normal Saline)", dose: "Start at 1.5-2x maintenance rate.", notes: "Initial bolus of 10-20 mL/kg if dehydrated." });
        doses.push({ drugName: "Furosemide", dose: "1-2 mg/kg IV every 4-6 hours.", notes: "Only give after patient is euvolemic." });
        doses.push({ drugName: "Calcitonin", dose: "4 units/kg IM/SQ every 12 hours.", notes: "Rapid but transient effect." });
        doses.push({ drugName: "Pamidronate", dose: "0.5-1 mg/kg IV infusion over 4-6 hours.", notes: "For long-term control. Consult endocrinology." });
    }

    return doses;
  },
  getReferences: () => [
      { title: "UpToDate: Treatment of hypercalcemia", url: "https://www.uptodate.com/contents/treatment-of-hypercalcemia" }
  ],
};
