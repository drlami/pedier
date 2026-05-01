import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// Helper for fluid calculation based on ISPAD guidelines
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

    // Assume 7-10% dehydration for deficit calculation in DKA
    // ISPAD recommends replacing deficit over 48-72 hours
    const deficitVolume = weight * 10 * 8.5; // Average 8.5% deficit -> 85 mL/kg

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
  description: 'Evidence-based management of pediatric DKA (ISPAD 2022), focusing on the two-bag fluid system and cerebral edema prevention.',
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

    // Severity criteria per ISPAD/AAP
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
    
    details.push("Biochemical criteria for DKA not met (pH ≥ 7.3 and Bicarb ≥ 15).");
    return { level: 'no', details };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const management = [];
    
    // 1. Initial Resuscitation
    management.push({
      title: "1. Phase 1: Initial Volume Expansion",
      recommendations: [
        "Initial bolus: 10-20 mL/kg of 0.9% Normal Saline (NS) over 1-2 hours.",
        "Only repeat boluses if signs of hypovolemic shock persist.",
        "The goal is to restore perfusion, not to fully rehydrate rapidly."
      ]
    });

    // 2. Fluid Titration & Two-Bag System
    let bagDetails = [
      "Use the 'Two-Bag System' to allow rapid titration of dextrose without changing the electrolyte concentration or total fluid rate.",
      "Bag A: 0.45% or 0.9% Normal Saline + 40 mEq/L Potassium (half KCl, half KPhos).",
      "Bag B: 10% Dextrose + same Saline concentration + same Potassium concentration.",
      "Total rate (Bag A + Bag B) should remain constant at the calculated replacement rate.",
      "Initially, Bag A is at 100% of the total rate. As glucose falls, increase Bag B percentage and decrease Bag A."
    ];

    if (weight > 0) {
        const { maintenance, totalRate } = calculateDkaFluids(weight);
        bagDetails.push(`For this ${weight}kg patient: Maintenance rate is ~${maintenance} mL/hr. The recommended total replacement rate (Maintenance + Deficit over 48h) is approximately ${totalRate} mL/hr.`);
    }

    management.push({
      title: "2. Phase 2: Fluid Replacement (The Two-Bag System)",
      recommendations: bagDetails
    });

    // 3. Insulin Therapy & Glucose Thresholds
    management.push({
      title: "3. Insulin Therapy & Glucose Management",
      recommendations: [
        "DO NOT give an insulin bolus.",
        "Start Insulin infusion (0.05 - 0.1 units/kg/hr) at least 1 hour AFTER starting IV fluids.",
        "Goal glucose fall: 50 - 100 mg/dL per hour.",
        "WHEN TO ADD GLUCOSE: Start Bag B (dextrose) when Blood Glucose < 250 - 300 mg/dL, or if glucose falls > 100 mg/dL in 1 hour.",
        "Maintain Blood Glucose between 150 - 250 mg/dL once dextrose is started.",
        "Do not stop insulin if BG < 150; instead, increase dextrose concentration or total fluid rate (with Bag B) to maintain insulin therapy until ketosis resolves."
      ]
    });

    // 4. Potassium Management
    management.push({
      title: "4. Potassium Replacement",
      recommendations: [
        "If serum K+ is 3.5 - 5.5 mEq/L: Start 40 mEq/L Potassium in all IV fluids immediately.",
        "If serum K+ is > 5.5 mEq/L: Defer K+ until urine output is confirmed and K+ falls below 5.5.",
        "If serum K+ is < 3.5 mEq/L: CRITICAL. Hold insulin. Replete K+ immediately (0.5 mEq/kg IV over 1 hour) until K+ > 3.5, then start insulin."
      ]
    });

    // 5. Cerebral Edema Management
    management.push({
      title: "5. Cerebral Edema (Brain Edema) Management",
      recommendations: [
        "Early signs: Headache, bradycardia, rising BP, altered mental status, vomiting, incontinence, cranial nerve palsies.",
        "IF SUSPECTED: Act immediately before waiting for imaging.",
        "1. Elevate head of bed to 30 degrees.",
        "2. Administer Mannitol (0.5 - 1 g/kg IV) OR Hypertonic Saline (3% NaCl, 2.5 - 5 mL/kg IV) over 10-15 mins.",
        "3. Reduce IV fluid rate by 1/3.",
        "4. Contact PICU and Neurosurgery immediately. Head CT only AFTER stabilization."
      ]
    });
    
    return management;
  },
  getDisposition: (severity, data) => {
    return [
      "All patients with new-onset DKA require hospital admission.",
      "Moderate to Severe DKA, infants, and patients at high risk for cerebral edema should be managed in a PICU.",
      "Continuous cardiac and neurologic monitoring is mandatory until ketosis resolves and patient is at baseline."
    ];
  },
  getRedFlags: () => [
    "Cerebral Edema Signs: Cushing's Triad (Bradycardia, Hypertension, Irregular Breathing)",
    "Altered mental status / Decreased GCS",
    "Severe Acidosis (pH < 7.1)",
    "Hypokalemia (< 3.5 mEq/L) at presentation",
    "Rapid fall in Blood Glucose (> 100 mg/dL per hour)",
    "Age < 5 years (highest risk for cerebral edema)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        const { totalRate } = calculateDkaFluids(weight);
        const insulinRate = (0.1 * weight).toFixed(2);
        const mannitolDose = (0.5 * weight).toFixed(1);
        const salineDose = (3 * weight).toFixed(0);

        doses.push({ drugName: "Calculated Total IV Fluid Rate", dose: `${totalRate} mL/hr`, notes: "Maintenance + 10% Deficit over 48 hours." });
        doses.push({ drugName: "Insulin Infusion (Regular)", dose: `${insulinRate} units/hr`, notes: "Based on 0.1 units/kg/hr. Mix 50 units in 50 mL NS." });
        doses.push({ drugName: "Mannitol 20% (Rescue)", dose: `${mannitolDose} - ${(weight).toFixed(1)} g IV`, notes: "For cerebral edema. Dose: 0.5 - 1 g/kg over 20 mins." });
        doses.push({ drugName: "3% Hypertonic Saline (Rescue)", dose: `${salineDose} - ${(5 * weight).toFixed(0)} mL IV`, notes: "For cerebral edema. Dose: 2.5 - 5 mL/kg over 15 mins." });
    } else {
        doses.push({ drugName: "Insulin Infusion", dose: "0.05 - 0.1 units/kg/hr", notes: "Start 1h after fluids." });
        doses.push({ drugName: "Mannitol", dose: "0.5 - 1 g/kg IV", notes: "For cerebral edema signs." });
        doses.push({ drugName: "3% Hypertonic Saline", dose: "2.5 - 5 mL/kg IV", notes: "Alternative to Mannitol." });
    }

    return doses;
  },
  getReferences: () => [
      { title: "ISPAD Clinical Practice Consensus Guidelines 2022: DKA and HHS in Children", url: "https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406" },
      { title: "AAP: Management of Pediatric Diabetic Ketoacidosis", url: "https://publications.aap.org/pediatrics/article/142/5/e20182762/38556/Management-of-Pediatric-Diabetic-Ketoacidosis" }
  ],
};
