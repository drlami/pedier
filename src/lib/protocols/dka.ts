import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// Helper for fluid calculation
const calculateDkaFluids = (weight: number): { maintenance: number, deficit: number, totalRate: number } => {
    if (!weight || weight <= 0) return { maintenance: 0, deficit: 0, totalRate: 0 };
    
    // Holiday-Segar for daily maintenance
    let dailyMaintenance = 0;
    if (weight <= 10) {
        dailyMaintenance = 100 * weight;
    } else if (weight <= 20) {
        dailyMaintenance = 1000 + 50 * (weight - 10);
    } else {
        dailyMaintenance = 1500 + 20 * (weight - 20);
    }
    const maintenanceRate = dailyMaintenance / 24;

    // Assume 10% dehydration for deficit calculation
    const deficitVolume = weight * 10 * 10; // 10% deficit -> 100 mL/kg

    // Correct deficit over 48 hours
    const totalFluidOver48h = deficitVolume + (maintenanceRate * 48);
    const totalRate = totalFluidOver48h / 48;
    
    return {
        maintenance: Math.round(maintenanceRate),
        deficit: Math.round(deficitVolume),
        totalRate: Math.round(totalRate)
    };
};


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
    
    if (isNaN(ph) || isNaN(hco3)) {
        return { level: 'unknown', details: ["Enter pH and Bicarbonate to determine DKA severity."] };
    }

    if (data.mentalStatus === 'stupor' || ph < 7.1 || hco3 < 5) {
      details.push(`pH: ${ph}, Bicarb: ${hco3}. Severe DKA criteria met.`);
      return { level: 'severe', details };
    }
    if (ph < 7.2 || hco3 < 10) {
      details.push(`pH: ${ph}, Bicarb: ${hco3}. Moderate DKA criteria met.`);
      return { level: 'moderate', details };
    }
    if (ph < 7.3 || hco3 < 15) {
      details.push(`pH: ${ph}, Bicarb: ${hco3}. Mild DKA criteria met.`);
      return { level: 'mild', details };
    }
    
    details.push("Biochemical criteria for DKA not met.");
    return { level: 'no', details };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const management = [];
    
    let fluidRecs = [
      "If in shock (rare), give 10-20 mL/kg Normal Saline bolus. Otherwise, AVOID boluses.",
      "Begin rehydration to correct deficit over 48 hours. This involves calculating maintenance fluids and deficit.",
      "Use a 'Two-Bag System': Bag 1 = NS + Potassium. Bag 2 = D10 NS + Potassium. Titrate bags to keep glucose between 150-250 mg/dL.",
    ];

    if (weight > 0) {
        const { maintenance, deficit, totalRate } = calculateDkaFluids(weight);
        fluidRecs.splice(2, 0, `Fluid Calculation for ${weight} kg: Maintenance rate is ~${maintenance} mL/hr. Deficit (10%) is ${deficit} mL. Total IV rate to correct over 48 hours is approximately ${totalRate} mL/hr.`);
    } else {
        fluidRecs.splice(2, 0, "Enter weight to calculate specific fluid rates.");
    }

    management.push({
      title: "Initial Fluid Management",
      recommendations: fluidRecs
    });
    
    management.push({
      title: "Insulin and Electrolyte Therapy",
      recommendations: [
        "DO NOT give an insulin bolus.",
        `After initial fluid resuscitation (at least 1 hour), start an insulin infusion at 0.05 - 0.1 units/kg/hr.`,
        "Aim for a gradual glucose fall of 50-100 mg/dL per hour.",
        "Add potassium to IV fluids once patient has voided and serum K+ is < 5.5 mEq/L."
      ]
    });
    
    management.push({
      title: "Monitoring Frequency",
      recommendations: [
        "**Hourly:** Bedside blood glucose. Neurological checks (GCS, pupils) for signs of cerebral edema.",
        "**Every 2-4 Hours:** Serum electrolytes (especially K+) and a blood gas (VBG preferred) to monitor acidosis.",
        "**Continuous:** Cardiac monitoring for T-wave changes (indicating K+ shifts) and arrhythmias.",
        "**Strict I/Os:** Monitor fluid input and urine output closely."
      ]
    });
    
    management.push({
      title: "Cerebral Edema Watch",
      recommendations: [
        "This is the most dangerous complication.",
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
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        const insulinRate = (0.1 * weight).toFixed(2);
        const bolus = (20 * weight).toFixed(0);
        const mannitolDose = (0.5 * weight).toFixed(2);
        const salineDose = (3 * weight).toFixed(0);

        doses.push({ drugName: "Insulin Infusion", dose: `Start at ${insulinRate} units/hr`, notes: "Based on 0.1 units/kg/hr. Mix 50 units of regular insulin in 50 mL NS (1 unit/mL)." });
        doses.push({ drugName: "IV Fluid Bolus (for shock only)", dose: `${bolus} mL`, notes: "Based on 20 mL/kg Normal Saline." });
        doses.push({ drugName: "Potassium Replacement", dose: "Typically 20-40 mEq/L of combined KCl and KPhos in IV fluids.", notes: "Requires careful monitoring of K+ and Phos levels." });
        doses.push({ drugName: "Mannitol (for cerebral edema)", dose: `${mannitolDose} g IV`, notes: "Based on 0.5 g/kg IV over 20 minutes." });
        doses.push({ drugName: "3% Hypertonic Saline (for cerebral edema)", dose: `${salineDose} mL IV`, notes: "Based on 3 mL/kg IV over 20-30 minutes." });
    } else {
        doses.push({ drugName: "Insulin Infusion", dose: "Start at 0.1 units/kg/hr.", notes: "Enter weight to calculate dose." });
        doses.push({ drugName: "IV Fluid Bolus (for shock only)", dose: "20 mL/kg Normal Saline." });
        doses.push({ drugName: "Potassium Replacement", dose: "Typically 20-40 mEq/L" });
        doses.push({ drugName: "Mannitol (for cerebral edema)", dose: "0.5 g/kg IV" });
        doses.push({ drugName: "3% Hypertonic Saline (for cerebral edema)", dose: "3 mL/kg IV" });
    }

    return doses;
  },
  getReferences: () => [
      { title: "ISPAD Clinical Practice Consensus Guidelines 2022: Diabetic ketoacidosis and the hyperglycemic hyperosmolar state", url: "https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406" }
  ],
};
