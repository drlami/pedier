import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// Helper for infusion calculations
const calculateInfusion = (drugName: string, weight: number): { dose: string, notes: string } => {
    if (weight <= 0 || isNaN(weight)) {
        return {
            dose: "Enter weight to calculate.",
            notes: ""
        };
    }
    switch (drugName) {
        case "Adrenaline": {
            const mgIn100ml = (0.6 * weight).toFixed(2);
            return {
                dose: "Standard Infusion: 0.6 x weight (kg) in 100mL fluid. At this concentration, 1 mL/hr = 0.1 mcg/kg/min.",
                notes: `Preparation: Add ${mgIn100ml} mL of your 1 mg/mL (1:1,000) stock Adrenaline to a 100mL bag of D5W or NS.`
            };
        }
        case "Noradrenaline": {
             const mgIn100ml = (0.6 * weight).toFixed(2);
            return {
                dose: "Standard Infusion: 0.6 x weight (kg) in 100mL fluid. At this concentration, 1 mL/hr = 0.1 mcg/kg/min.",
                notes: `Preparation: Add ${mgIn100ml} mL of your 1 mg/mL (1:1,000) stock Noradrenaline to a 100mL bag of D5W or NS.`
            };
        }
        case "Dopamine": {
             const mgIn100ml = (60 * weight).toFixed(2);
            return {
                dose: "Standard Infusion: 60 x weight (kg) in 100mL fluid. At this concentration, 1 mL/hr = 10 mcg/kg/min.",
                notes: `Preparation: Add ${mgIn100ml} mg of Dopamine to a 100mL bag of D5W or NS.`
            };
        }
        case "Dobutamine": {
             const mgIn100ml = (60 * weight).toFixed(2);
            return {
                dose: "Standard Infusion: 60 x weight (kg) in 100mL fluid. At this concentration, 1 mL/hr = 10 mcg/kg/min.",
                notes: `Preparation: Add ${mgIn100ml} mg of Dobutamine to a 100mL bag of D5W or NS.`
            };
        }
        default:
            return { dose: "", notes: "" };
    }
};

export const septicShockProtocol: DiseaseProtocol = {
  id: 'septic-shock',
  name: 'Septic Shock',
  system: 'Shock and Resuscitation',
  description: 'Emergency management of pediatric septic shock, including fluid resuscitation, antibiotics, and vasoactive infusions.',
  image: {
    url: "https://picsum.photos/seed/septic-shock/600/400",
    hint: "intensive care"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'shockType', questionText: 'Predominant Shock Physiology', type: 'select', options: [
        { label: 'Cold Shock (common)', value: 'cold' },
        { label: 'Warm Shock (less common)', value: 'warm' }
    ], info: 'Cold Shock: Cold extremities, delayed cap refill, weak pulses. Warm Shock: Warm extremities, flash cap refill, bounding pulses.'}
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Septic shock is always severe. The details will specify warm vs cold.
    const details: string[] = ["Septic shock is a life-threatening emergency."];
    if (data.shockType === 'cold') {
      details.push("Patient exhibits signs of cold shock (high SVR, low cardiac output).");
    } else if (data.shockType === 'warm') {
      details.push("Patient exhibits signs of warm shock (low SVR, high cardiac output).");
    }
    return { level: 'severe', details };
  },
  getManagement: (severity, data) => {
    const management = [{
        title: "Initial Hour (Golden Hour) Management",
        recommendations: [
            "Recognize shock and establish vascular access (IV/IO) immediately.",
            "Administer fluid boluses: 20 mL/kg of isotonic crystalloid (NS or LR) over 5-20 minutes. Repeat up to 40-60 mL/kg in the first hour, assessing for fluid overload (rales, hepatomegaly).",
            "Obtain blood cultures BEFORE antibiotics, but do not delay antibiotics.",
            "Administer empiric broad-spectrum IV antibiotics within the first hour (e.g., Ceftriaxone + Vancomycin).",
            "Check and correct hypoglycemia and hypocalcemia."
        ]
    }];

    if (data.shockType === 'cold') {
        management.push({
            title: "Vasoactive Support for Cold Shock (Adrenaline-Responsive)",
            recommendations: [
                "If shock persists after 40-60 mL/kg of fluid, start a peripheral or central Adrenaline (Epinephrine) infusion.",
                "Adrenaline Preparation: Using your 1 mg/mL stock, add (0.6 x weight) mL to 100 mL NS to make a concentration where 1 mL/hr = 0.1 mcg/kg/min.",
                "Titrate Adrenaline to improve perfusion, heart rate, and blood pressure.",
                "Goal is normal blood pressure and perfusion (warm extremities, cap refill <2s, normal pulses, normal mental status, urine output >1 mL/kg/hr)."
            ]
        });
    } else if (data.shockType === 'warm') {
         management.push({
            title: "Vasoactive Support for Warm Shock (Noradrenaline-Responsive)",
            recommendations: [
                "If shock persists after 40-60 mL/kg of fluid, start a peripheral or central Noradrenaline (Norepinephrine) infusion.",
                "Titrate Noradrenaline to improve blood pressure (vasoconstriction).",
                "If cardiac dysfunction is also suspected, consider adding Adrenaline or Dopamine.",
                 "Goal is normal blood pressure and perfusion."
            ]
        });
    }

    return management;
  },
  getDisposition: () => {
    return ["Immediate admission to the Pediatric Intensive Care Unit (PICU) is mandatory for all children in septic shock."];
  },
  getRedFlags: () => [
    "Hypotension for age",
    "Altered mental status (lethargy, irritability, confusion)",
    "Poor perfusion: Delayed capillary refill (>2s), cool or mottled skin, weak pulses",
    "Tachycardia or (ominously) bradycardia",
    "Fluid-refractory shock (persistent hypotension despite 40-60 mL/kg of fluid)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight);
    const doses: DrugDose[] = [];

    // Fluid Bolus
    if (weight > 0) {
        doses.push({
            drugName: "Isotonic Crystalloid Fluid Bolus",
            dose: `20 mL/kg = ${(20 * weight).toFixed(1)} mL`,
            notes: 'Administer over 5-20 minutes. Re-assess and repeat as needed up to 60 mL/kg.'
        });
    } else {
        doses.push({
            drugName: "Isotonic Crystalloid Fluid Bolus",
            dose: '20 mL/kg',
            notes: 'Enter weight to calculate volume.'
        });
    }

    // Push Dose Adrenaline (Rescue)
    if (weight > 0) {
        doses.push({
            drugName: "Adrenaline 1:10,000 Diluted (Rescue Dose)",
            dose: `0.1 mL/kg. Calculated dose: ${(0.1 * weight).toFixed(2)} mL`,
            notes: 'Dilute 1 mL of 1 mg/mL stock with 9 mL NS to make 0.1 mg/mL concentration first.'
        });
    } else {
         doses.push({
            drugName: "Adrenaline 1:10,000 Diluted (Rescue Dose)",
            dose: '0.1 mL/kg',
            notes: 'Dilute 1:1,000 stock 1:10 with NS first.'
        });
    }

    // Infusions
    const adrenalineInfusion = calculateInfusion("Adrenaline", weight);
    doses.push({
        drugName: "Adrenaline (Epinephrine) Infusion",
        dose: "Start: 0.05-0.1 mcg/kg/min. Titrate to effect.",
        notes: `${adrenalineInfusion.notes} ${adrenalineInfusion.dose}`
    });

    const noradrenalineInfusion = calculateInfusion("Noradrenaline", weight);
    doses.push({
        drugName: "Noradrenaline (Norepinephrine) Infusion",
        dose: "Start: 0.05-0.1 mcg/kg/min. Titrate to effect.",
        notes: `${noradrenalineInfusion.notes} ${noradrenalineInfusion.dose}`
    });

    const dopamineInfusion = calculateInfusion("Dopamine", weight);
    doses.push({
        drugName: "Dopamine Infusion",
        dose: "Start: 5-10 mcg/kg/min. Titrate to effect.",
        notes: `${dopamineInfusion.notes} ${dopamineInfusion.dose}`
    });
    
    // Antibiotics
    doses.push({ drugName: "Ceftriaxone (IV)", dose: "100 mg/kg (max 2g) as a single dose, then 100mg/kg/day divided q12h." });
    doses.push({ drugName: "Vancomycin (IV)", dose: "20 mg/kg loading dose, then 60 mg/kg/day divided q6-8h." });


    return doses;
  },
  getReferences: () => [
    { title: "Surviving Sepsis Campaign International Guidelines for Management of Septic Shock and Sepsis-Associated Organ Dysfunction in Children (2020)", url: "https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international.1.aspx" }
  ],
};
