import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hypoglycemiaProtocol: DiseaseProtocol = {
  id: 'hypoglycemia',
  name: 'Hypoglycemia',
  system: 'Endocrinology',
  description: 'Diagnosis and management of hypoglycemia in infants and children. Hypoglycemia is a neurologic emergency.',
  image: {
    url: "https://picsum.photos/seed/hypoglycemia/600/400",
    hint: "glucose monitor"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'bloodGlucose', questionText: 'Initial Blood Glucose', type: 'number', unit: 'mg/dL' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [
        { label: 'Normal / Asymptomatic', value: 'normal' },
        { label: 'Symptomatic (irritable, shaky, sweaty)', value: 'symptomatic' },
        { label: 'Severe (seizure, lethargy, coma)', value: 'severe' },
    ]},
    { id: 'canTakePO', questionText: 'Is the patient awake, alert, and able to safely take oral glucose?', type: 'boolean' },
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.mentalStatus === 'severe') {
      return { level: 'severe', details: ["Severe neuroglycopenia (seizure/coma). Requires immediate IV dextrose."] };
    }
    if (data.mentalStatus === 'symptomatic') {
      return { level: 'moderate', details: ["Symptomatic hypoglycemia."] };
    }
    if (Number(data.bloodGlucose) < 70) {
        return { level: 'mild', details: ["Asymptomatic or minimally symptomatic hypoglycemia."] };
    }
    return { level: 'unknown', details: ["Confirm blood glucose to assess severity."] };
  },
  getManagement: (severity, data) => {
    const management = [];
    if (severity.level === 'severe' || !data.canTakePO) {
        management.push({
            title: "Management of Severe Hypoglycemia",
            recommendations: [
                "This is a neurologic emergency. Secure airway, breathing, circulation.",
                "Establish IV/IO access IMMEDIATELY.",
                "Administer IV Dextrose bolus (see doses below). Recheck glucose in 15 minutes.",
                "If seizure is ongoing, treat with benzodiazepines concurrently.",
                "After bolus, start a continuous IV infusion of dextrose-containing fluids (e.g., D10W) at a maintenance rate or higher to maintain glucose > 80-100 mg/dL."
            ]
        });
    } else { // Mild or Moderate and can take PO
        management.push({
            title: "Management of Mild/Moderate Hypoglycemia (PO tolerant)",
            recommendations: [
                "Provide a fast-acting oral carbohydrate.",
                "Options: Glucose tablets/gel, fruit juice, or other sugary beverage.",
                "Follow with a more complex carbohydrate (e.g., crackers, milk) to prevent recurrence.",
                "Recheck blood glucose in 15-30 minutes.",
                "If hypoglycemia persists, repeat oral treatment or consider IV access."
            ]
        });
    }
    
    management.push({
        title: "Diagnostic 'Critical Sample'",
        recommendations: [
            "For new-onset, unexplained hypoglycemia, if possible, draw a 'critical sample' BEFORE giving dextrose.",
            "Labs to draw: Glucose, Insulin, C-peptide, Cortisol, Growth Hormone, Beta-hydroxybutyrate, Free Fatty Acids, and basic metabolic panel.",
            "Do not delay life-saving treatment to get these labs if the patient is severely symptomatic or unstable."
        ]
    });

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || !data.canTakePO) {
        return ["Admission to hospital (PICU for severe cases) is required for IV glucose infusion, monitoring, and diagnostic workup."];
    }
    return ["For mild, easily corrected hypoglycemia with a clear cause (e.g., missed meal), discharge may be appropriate after a period of observation and ensuring the patient can maintain normal glucose levels."];
  },
  getRedFlags: () => [
    "Seizure or coma",
    "Altered mental status that does not quickly resolve with glucose correction",
    "Recurrent or refractory hypoglycemia despite treatment",
    "Hypoglycemia in a neonate or young infant (high suspicion for underlying disorder)"
  ],
  getDrugDoses: (severity, data) => {
    const age = Number(data.ageMonths);
    const doses: DrugDose[] = [];
    
    if (age <= 1) { // Neonate
        doses.push({ drugName: "Dextrose IV Bolus (Neonate)", dose: "D10W: 2-3 mL/kg", notes: "Use D10W for neonates."});
    } else { // Infant/Child
        doses.push({ drugName: "Dextrose IV Bolus (Infant/Child)", dose: "D25W: 2-4 mL/kg. D50W: 1-2 mL/kg (use with caution in large veins).", notes: "D25W is generally preferred over D50W in children."});
    }
    
    doses.push({ drugName: "Oral Glucose", dose: "15-20 grams of fast-acting carbohydrate.", notes: "e.g., 4 oz (120 mL) of juice, glucose tablets."});
    doses.push({ drugName: "Glucagon (IM)", dose: "0.5 mg for weight <25kg, 1.0 mg for weight >25kg.", notes: "Use only if IV access cannot be obtained. Slower onset than IV dextrose."});

    return doses;
  },
  getReferences: () => [
      { title: "Pediatric Endocrine Society: Recommendations for management of hypoglycemia", url: "https://pedsendo.org/patient-resources/information-for-patients-and-families/hypoglycemia/" }
  ],
};
