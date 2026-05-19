import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

const calculateDkaFluids = (weight: number): { maintenance: number, deficit: number, totalRate: number } => {
    if (!weight || weight <= 0) return { maintenance: 0, deficit: 0, totalRate: 0 };
    
    let dailyMaintenance = 0;
    if (weight <= 10) {
        dailyMaintenance = 100 * weight;
    } else if (weight <= 20) {
        dailyMaintenance = 1000 + 50 * (weight - 10);
    } else {
        dailyMaintenance = 1500 + 20 * (weight - 20);
    }
    const maintenanceRate = dailyMaintenance / 24;

    const deficitVolume = weight * 10 * 8.5; 

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
  description: 'Comprehensive pediatric DKA management (ISPAD 2022). Includes specific Two-Bag system preparation using KCl and Saline.',
  image: {
    url: "https://picsum.photos/seed/dka/600/400",
    hint: "blood glucose"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ph', questionText: 'Initial pH (from VBG/ABG)', type: 'number' },
    { id: 'bicarbonate', questionText: 'Initial Serum Bicarbonate (HCO3)', type: 'number', unit: 'mEq/L' },
    { id: 'potassium', questionText: 'Initial Serum Potassium (K+)', type: 'number', unit: 'mEq/L' },
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
    
    details.push("Biochemical criteria for DKA not met (pH ≥ 7.3 and Bicarb ≥ 15).");
    return { level: 'no', details };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const initialK = Number(data.potassium) || 0;
    const management = [];
    
    management.push({
      title: "1. Phase 1: Initial Volume Expansion",
      recommendations: [
        "Initial bolus: 10-20 mL/kg of 0.9% Normal Saline (NS) over 1-2 hours.",
        "Repeat bolus ONLY if signs of hypovolemic shock persist.",
        "GOAL: Restore perfusion while avoiding rapid changes in osmolality."
      ]
    });

    management.push({
      title: "2. The Two-Bag System: Preparation",
      recommendations: [
        "Prepare two 500 mL bags with IDENTICAL electrolytes but DIFFERENT dextrose.",
        "BAG A (0% Dextrose): 500 mL of 0.9% Normal Saline + 20 mEq KCl.",
        "BAG B (10% Dextrose): 500 mL of D10% in 0.9% Normal Saline + 20 mEq KCl.",
        "Note: Adding 20 mEq KCl to 500 mL results in the standard 40 mEq/L concentration.",
        "POTASSIUM CAUTION: Do NOT add KCl if initial K+ is >5.5 mEq/L or urine output is not confirmed. Add potassium only after K+ falls and renal output is adequate.",
        "INFUSION: Run both bags on separate pumps, Y-connected into ONE IV line."
      ]
    });

    let titrationTable = [
      "Total Rate = Maintenance + Deficit over 48 hours. Keep this TOTAL constant.",
      "BG > 300 mg/dL: Bag A at 100% Total Rate, Bag B at 0%.",
      "BG 250-300 mg/dL: Bag A at 75%, Bag B at 25% (equiv. to D2.5%).",
      "BG 200-250 mg/dL: Bag A at 50%, Bag B at 50% (equiv. to D5.0%).",
      "BG 150-200 mg/dL: Bag A at 25%, Bag B at 75% (equiv. to D7.5%).",
      "BG < 150 mg/dL: Bag A at 0%, Bag B at 100% (equiv. to D10%).",
      "GOAL: Fall of BG by 50-100 mg/dL per hour. Maintain BG between 150-250 mg/dL."
    ];

    if (weight > 0) {
        const { totalRate } = calculateDkaFluids(weight);
        titrationTable.push(`For this ${weight}kg patient: Calculated Total Rate is ~${totalRate} mL/hr.`);
    }

    management.push({
      title: "3. Two-Bag Titration Logic",
      recommendations: titrationTable
    });

    management.push({
      title: "4. Insulin & Potassium Management",
      recommendations: [
        "INSULIN: Start Regular Insulin infusion at 0.05-0.1 units/kg/hr AT LEAST 1 HOUR after starting IV fluids.",
        "K+ LEVEL < 3.5: HOLD insulin, give K+ 0.5 mEq/kg/hr IV until K+ > 3.5, then start insulin.",
        "K+ LEVEL 3.5 - 5.5: Start K+ 40 mEq/L in all IV fluids immediately.",
        "K+ LEVEL > 5.5: Defer K+ until urine output confirmed and level falls below 5.5."
      ]
    });

    management.push({
      title: "5. Emergency: Cerebral Edema",
      recommendations: [
        "WARNING: Early signs include headache, falling HR, rising BP, or change in mental status.",
        "TREAT IMMEDIATELY if suspected, DO NOT wait for Head CT.",
        "1. Elevate head of bed to 30 degrees.",
        "2. Reduce IV fluid rate by 1/3.",
        "3. Administer Mannitol (0.5-1 g/kg) or 3% Hypertonic Saline (2.5-5 mL/kg).",
        "4. Notify PICU and Neurosurgery."
      ]
    });
    
    return management;
  },
  getDisposition: () => [
    "Admission to PICU is required for patients with severe DKA, infants, or those with altered mental status.",
    "Frequent monitoring (hourly neuro checks, BG, and electrolytes every 2-4 hours) is essential."
  ],
  getRedFlags: () => [
    "Signs of Cerebral Edema: Cushing's Triad (Bradycardia, HTN, irregular breathing).",
    "Hypokalemia (< 3.5) at presentation: High risk for arrhythmias when insulin starts.",
    "Mental status changes or falling GCS.",
    "Blood glucose falling > 100 mg/dL per hour."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        const { totalRate } = calculateDkaFluids(weight);
        doses.push({ drugName: "Total IV Fluid Rate", dose: `${totalRate} mL/hr`, notes: "Maintenance + 10% Deficit over 48h. Titrate bags A and B within this total." });
        doses.push({ drugName: "Insulin Infusion", dose: `${(0.05 * weight).toFixed(2)} - ${(0.1 * weight).toFixed(2)} units/hr`, notes: "Regular insulin 0.05-0.1 units/kg/hr." });
        doses.push({ drugName: "Mannitol 20%", dose: `${(0.5 * weight).toFixed(1)} - ${(weight).toFixed(1)} g IV`, notes: "For cerebral edema. Dose: 0.5-1 g/kg over 20 mins." });
        doses.push({ drugName: "3% Hypertonic Saline", dose: `${(2.5 * weight).toFixed(0)} - ${(5 * weight).toFixed(0)} mL IV`, notes: "For cerebral edema. Dose: 2.5-5 mL/kg over 15 mins." });
    } else {
        doses.push({ drugName: "Total IV Fluid Rate", dose: "Maintenance + Deficit over 48h", notes: "Enter weight for calculation." });
        doses.push({ drugName: "Regular Insulin Infusion", dose: "0.05 - 0.1 units/kg/hr", notes: "Start 1 hour after starting fluids." });
        doses.push({ drugName: "Mannitol", dose: "0.5 - 1 g/kg IV", notes: "For cerebral edema signs." });
        doses.push({ drugName: "3% Hypertonic Saline", dose: "2.5 - 5 mL/kg IV", notes: "Alternative to Mannitol." });
    }

    return doses;
  },
  getReferences: () => [
      { title: "ISPAD Clinical Practice Consensus Guidelines 2022: Diabetic Ketoacidosis", url: "https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406" }
  ],
};
