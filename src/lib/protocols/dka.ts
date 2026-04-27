import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const dkaProtocol: DiseaseProtocol = {
  id: 'dka',
  name: 'Diabetic Ketoacidosis (DKA)',
  system: 'Endocrinology',
  description: 'Management of pediatric DKA, focusing on a cautious two-bag fluid system, insulin therapy, and electrolyte correction while monitoring for cerebral edema.',
  image: {
    url: "https://picsum.photos/seed/dka/600/400",
    hint: "blood glucose"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'bloodGlucose', questionText: 'Initial Blood Glucose', type: 'number', unit: 'mg/dL' },
    { id: 'ph', questionText: 'Initial pH (from VBG/ABG)', type: 'number' },
    { id: 'bicarbonate', questionText: 'Initial Serum Bicarbonate (HCO3)', type: 'number', unit: 'mEq/L' },
    { id: 'mentalStatus', questionText: 'Mental Status / GCS', type: 'select', options: [
        { label: 'Alert, GCS 15', value: 'normal' },
        { label: 'Drowsy/Confused, GCS 13-14', value: 'drowsy' },
        { label: 'Stuporous/Comatose, GCS < 13', value: 'stupor' },
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const ph = Number(data.ph);
    const hco3 = Number(data.bicarbonate);
    const details: string[] = [];

    if (data.mentalStatus === 'stupor' || ph < 7.1 || hco3 < 5) {
      details.push("Severe DKA criteria met (pH < 7.1 or Bicarb < 5 or altered mental status).");
      return { level: 'severe', details };
    }
    if (ph < 7.2 || hco3 < 10) {
      details.push("Moderate DKA criteria met (pH 7.1-7.2 or Bicarb 5-10).");
      return { level: 'moderate', details };
    }
    if (ph < 7.3 || hco3 < 15) {
      details.push("Mild DKA criteria met (pH 7.2-7.3 or Bicarb 10-15).");
      return { level: 'mild', details };
    }
    return { level: 'unknown', details: ["Enter pH and Bicarbonate to determine severity."] };
  },
  getManagement: (severity, data) => {
    const management = [];

    management.push({
      title: "Initial Fluid Management (Hour 1)",
      recommendations: [
        "If in shock (rare), give 10-20 mL/kg Normal Saline bolus. Otherwise, AVOID boluses.",
        "Begin rehydration to correct deficit over 48 hours. Calculate maintenance fluids and add deficit.",
        "Example Fluid Calculation: Maintenance + Deficit (assume 10%). For a 30kg child: Maintenance ~70ml/hr. Deficit ~3L. Total rate over 48h ~ (3000 + (70*48))/48 = ~132 mL/hr.",
        "Use a 'Two-Bag System': Bag 1 = NS + Potassium. Bag 2 = D10 NS + Potassium. Titrate bags to keep glucose between 150-250 mg/dL.",
      ]
    });
    
    management.push({
      title: "Insulin and Electrolyte Therapy",
      recommendations: [
        "DO NOT give an insulin bolus.",
        "After initial fluid resuscitation (at least 1 hour), start an insulin infusion at 0.05 - 0.1 units/kg/hr.",
        "Check blood glucose hourly. Adjust insulin and dextrose bags to prevent hypoglycemia.",
        "Monitor electrolytes closely (q2-4h). Add potassium to fluids once patient has voided and K+ is <5.5 mEq/L."
      ]
    });
    
    management.push({
      title: "Cerebral Edema Watch",
      recommendations: [
        "This is the most dangerous complication. Monitor neurology status closely.",
        "Signs: Headache, slowing heart rate, rising blood pressure, altered mental status, new focal deficits.",
        "If suspected: Elevate head of bed, administer Mannitol or 3% Hypertonic Saline, and obtain emergent head CT."
      ]
    });
    
    return management;
  },
  getDisposition: (severity, data) => {
    return [
      "All patients with new-onset or established DKA require hospital admission.",
      "Moderate and Severe DKA should be managed in a Pediatric Intensive Care Unit (PICU) with frequent neurologic and laboratory monitoring."
    ];
  },
  getRedFlags: () => [
    "Altered mental status / GCS < 15",
    "Signs of cerebral edema: headache, inappropriate slowing of heart rate, hypertension, cranial nerve palsies",
    "Severe acidosis (pH < 7.1)",
    "Hypokalemia on presentation (requires very cautious management)",
    "Age < 5 years"
  ],
  getDrugDoses: () => [
    { drugName: "Insulin Infusion", dose: "Start at 0.05 - 0.1 units/kg/hr.", notes: "Mix 50 units of regular insulin in 50 mL NS (1 unit/mL)." },
    { drugName: "IV Fluid Bolus (for shock only)", dose: "10-20 mL/kg Normal Saline." },
    { drugName: "Potassium Replacement", dose: "Typically 20-40 mEq/L of combined KCl and KPhos in IV fluids.", notes: "Requires careful monitoring of K+ and Phos levels." },
    { drugName: "Mannitol (for cerebral edema)", dose: "0.25 - 1 g/kg IV over 20 minutes." },
    { drugName: "3% Hypertonic Saline (for cerebral edema)", dose: "3-5 mL/kg IV over 20-30 minutes." }
  ],
  getReferences: () => [
      { title: "ISPAD Clinical Practice Consensus Guidelines 2022: Diabetic ketoacidosis and the hyperglycemic hyperosmolar state", url: "https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406" }
  ],
};
