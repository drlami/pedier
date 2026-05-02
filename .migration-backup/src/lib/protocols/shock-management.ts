import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// Helper for infusion calculations
const calculateInfusion = (drugName: string, weight: number): { dose: string, notes: string } => {
    if (weight <= 0 || isNaN(weight)) {
        return {
            dose: "Enter weight to calculate.",
            notes: ""
        };
    }
    const mgIn100ml = (0.6 * weight).toFixed(2);
    return {
        dose: `Standard Infusion: 0.6 x weight (kg) in 100mL fluid. At this concentration, 1 mL/hr = 0.1 mcg/kg/min.`,
        notes: `Preparation: Add ${mgIn100ml} mL of your 1 mg/mL (1:1,000) stock ${drugName} to a 100mL bag of D5W or NS.`
    };
};

export const shockManagementProtocol: DiseaseProtocol = {
  id: 'shock-management',
  name: 'Integrated Shock Management',
  system: 'Shock and Resuscitation',
  description: 'A unified protocol for the classification and initial management of pediatric shock (Septic, Hypovolemic, and Cardiogenic).',
  image: {
    url: "https://picsum.photos/seed/shock-mgmt/600/400",
    hint: "intensive care"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'history', questionText: 'Primary Clinical Context', type: 'select', options: [
        { label: 'Fever or Suspected Infection', value: 'infection' },
        { label: 'Vomiting, Diarrhea, or Poor Intake', value: 'dehydration' },
        { label: 'Trauma or Active Bleeding', value: 'hemorrhage' },
        { label: 'Known Heart Disease / Rales / Hepatomegaly', value: 'cardiac' },
        { label: 'Sudden Respiratory Distress / Tracheal Deviation', value: 'obstructive' }
    ]},
    { id: 'perfusion', questionText: 'Skin Perfusion / Capillary Refill', type: 'select', options: [
        { label: 'Cold / Delayed Refill (>2s) - [COLD SHOCK]', value: 'cold' },
        { label: 'Warm / Flash Refill (<1s) - [WARM SHOCK]', value: 'warm' },
    ]},
    { id: 'bpStatus', questionText: 'Blood Pressure Status', type: 'select', options: [
        { label: 'Normal for Age (Compensated)', value: 'normal' },
        { label: 'Hypotensive for Age (Decompensated)', value: 'low' },
    ]},
    { id: 'mentalStatus', questionText: 'Altered Mental Status?', type: 'boolean', info: 'Irritability, lethargy, or confusion.' },
    { id: 'fluidOverload', questionText: 'Signs of Fluid Overload?', type: 'boolean', info: 'Rales (crackles) on lung exam or new hepatomegaly.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { history, bpStatus, mentalStatus } = data;
    const details: string[] = [];

    if (!history) return { level: 'unknown', details: ['Select clinical context to classify shock.'] };

    // Stability Logic
    if (bpStatus === 'low' || mentalStatus) {
        details.push("DECOMPENSATED SHOCK: Immediate intervention required.");
    } else {
        details.push("COMPENSATED SHOCK: High risk for rapid deterioration.");
    }

    // Classification Logic
    switch(history) {
        case 'infection':
            details.push("Physiology: SEPTIC SHOCK (Distributive).");
            break;
        case 'dehydration':
        case 'hemorrhage':
            details.push("Physiology: HYPOVOLEMIC SHOCK.");
            break;
        case 'cardiac':
            details.push("Physiology: CARDIOGENIC SHOCK (Pump Failure).");
            break;
        case 'obstructive':
            details.push("Physiology: OBSTRUCTIVE SHOCK (e.g., Tension PTX, Tamponade).");
            break;
    }

    return { level: 'severe', details };
  },
  getManagement: (severity, data) => {
      const { history, perfusion, fluidOverload } = data;
      const weight = Number(data.weight) || 0;
      const management = [];

      // 1. Initial Universal Steps
      management.push({
          title: "Immediate Universal Actions",
          recommendations: [
              "Secure Airway/Breathing: Provide 100% high-flow oxygen.",
              "Establish Access: 2 large-bore IVs or IO access immediately. Do not delay for central access.",
              "Continuous Monitoring: Cardiac monitor, pulse oximetry, and BP cycling every 5 mins.",
              "Check Glucose: Correct hypoglycemia immediately."
          ]
      });

      // 2. Type-Specific Fluid/Vasoactive Strategy
      if (history === 'infection') {
          management.push({
              title: "Septic Shock: The Golden Hour",
              recommendations: [
                  "FLUIDS: Give 20 mL/kg isotonic crystalloid (NS/LR) over 5-10 mins. Repeat up to 40-60 mL/kg total unless fluid overload (rales/hepatomegaly) develops.",
                  "ANTIBIOTICS: Administer broad-spectrum IV antibiotics WITHIN 60 MINUTES.",
                  "VASOACTIVES: If shock persists after 40-60 mL/kg, start infusions.",
                  perfusion === 'warm' 
                    ? "WARM SHOCK: Start NORADRENALINE infusion (0.05-0.1 mcg/kg/min)." 
                    : "COLD SHOCK: Start ADRENALINE infusion (0.05-0.1 mcg/kg/min)."
              ]
          });
      } else if (history === 'dehydration' || history === 'hemorrhage') {
          management.push({
              title: history === 'hemorrhage' ? "Hemorrhagic Shock Management" : "Hypovolemic Shock Management",
              recommendations: [
                  history === 'hemorrhage' ? "SOURCE CONTROL: Immediate pressure or surgical intervention to stop bleeding." : "Restore volume rapidly.",
                  "FLUIDS: Give 20 mL/kg crystalloid boluses. Repeat as needed up to 60 mL/kg.",
                  history === 'hemorrhage' ? "BLOOD PRODUCTS: Switch to PRBCs early (10-15 mL/kg). Activate Massive Transfusion Protocol if needed." : "",
                  "VASOACTIVES: Only after volume is fully restored and shock persists (Adrenaline)."
              ].filter(r => r !== "")
          });
      } else if (history === 'cardiac') {
          management.push({
              title: "Cardiogenic Shock Management",
              recommendations: [
                  "CAUTIOUS FLUIDS: Give 5-10 mL/kg boluses only. Monitor lung sounds after every 50-100 mL.",
                  "STOP FLUIDS if rales or hepatomegaly worsen.",
                  "EARLY INOTROPES: Start Adrenaline or Milrinone infusion early to improve contractility.",
                  "CONSULT: Urgent Pediatric Cardiology and PICU consultation is mandatory."
              ]
          });
      } else if (history === 'obstructive') {
          management.push({
              title: "Obstructive Shock Management",
              recommendations: [
                  "PROCEDURE REQUIRED: Shock will not resolve until obstruction is relieved.",
                  "Tension Pneumothorax: Immediate needle decompression / chest tube.",
                  "Cardiac Tamponade: Emergent pericardiocentesis.",
                  "Ductal-Dependent Heart Disease (Neonates): Start PGE1 infusion immediately."
              ]
          });
      }

      if (fluidOverload) {
          management.push({
              title: "WARNING: Fluid Overload Detected",
              recommendations: [
                  "Cease fluid boluses immediately.",
                  "Consider starting vasoactive support (inotropes) earlier.",
                  "Consider Furosemide ONLY if blood pressure is stable and primary problem is pump failure."
              ]
          });
      }

      return management;
  },
  getDisposition: () => [
      "ADMIT TO PICU: All patients in shock require immediate admission to a Pediatric Intensive Care Unit.",
      "TRANSFER: Arrange emergent transport if your facility lacks PICU/Pediatric Cardiology/Pediatric Surgery capabilities."
  ],
  getRedFlags: () => [
    "Hypotension (Late, ominous sign)",
    "Altered Mental Status (Brain hypoperfusion)",
    "Rales or hepatomegaly during fluid resuscitation",
    "Failure to improve after 40-60 mL/kg of crystalloid"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        // Standard Bolus
        doses.push({
            drugName: "Isotonic Fluid Bolus (Standard)",
            dose: `20 mL/kg = ${(20 * weight).toFixed(0)} mL`,
            notes: "Give over 5-10 min for Sepsis/Hypovolemia. Repeat as needed."
        });

        // Cardiac Bolus
        doses.push({
            drugName: "Isotonic Fluid Bolus (Cardiac/Cautious)",
            dose: `5-10 mL/kg = ${(5 * weight).toFixed(0)} - ${(10 * weight).toFixed(0)} mL`,
            notes: "INDICATIONS: Cardiogenic shock or DKA. Give over 15-30 min."
        });

        // Vasoactives
        const epiInfusion = calculateInfusion("Adrenaline", weight);
        doses.push({
            drugName: "Adrenaline Infusion (Cold Shock / Inotropy)",
            dose: "Start at 0.05-0.1 mcg/kg/min.",
            notes: `${epiInfusion.notes} ${epiInfusion.dose}`
        });

        const norEpiInfusion = calculateInfusion("Noradrenaline", weight);
        doses.push({
            drugName: "Noradrenaline Infusion (Warm Shock / Vasoconstriction)",
            dose: "Start at 0.05-0.1 mcg/kg/min.",
            notes: `${norEpiInfusion.notes} ${norEpiInfusion.dose}`
        });

        // Antibiotics
        doses.push({
            drugName: "Ceftriaxone (IV)",
            dose: `100 mg/kg (max 2g) = ${Math.min(100 * weight, 2000).toFixed(0)} mg`,
            notes: "Give within 60 min for suspected sepsis."
        });

    } else {
        doses.push({ drugName: "Fluid Bolus", dose: "20 mL/kg (Standard) or 5-10 mL/kg (Cardiac)" });
        doses.push({ drugName: "Adrenaline Infusion", dose: "0.05-0.1 mcg/kg/min", notes: "For Cold Shock." });
        doses.push({ drugName: "Noradrenaline Infusion", dose: "0.05-0.1 mcg/kg/min", notes: "For Warm Shock." });
    }

    return doses;
  },
  getReferences: () => [
    { title: "Surviving Sepsis Campaign International Guidelines (2020)", url: "https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international.1.aspx" },
    { title: "PALS Provider Manual (2020)", url: "https://cpr.heart.org/" }
  ],
};
