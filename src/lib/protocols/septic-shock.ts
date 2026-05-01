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
        default:
            return { dose: "", notes: "" };
    }
};

export const septicShockProtocol: DiseaseProtocol = {
  id: 'septic-shock',
  name: 'Septic Shock Management',
  system: 'Shock and Resuscitation',
  description: '2020 Surviving Sepsis Guidelines for pediatric septic shock. Focuses on the "Golden Hour" of fluid resuscitation, early antibiotics, and vasoactive infusions.',
  image: {
    url: "https://picsum.photos/seed/septic-shock/600/400",
    hint: "intensive care"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'suspectedInfection', questionText: 'Is there a suspected or confirmed infection?', type: 'boolean' },
    { id: 'mentalStatus', questionText: 'Altered Mental Status?', type: 'boolean', info: 'Irritability, lethargy, or confusion.' },
    { id: 'capRefill', questionText: 'Capillary Refill Time', type: 'select', options: [
        { label: 'Normal (≤ 2s)', value: 'normal' },
        { label: 'Delayed (> 2s / Cold Shock)', value: 'delayed' },
        { label: 'Flash (< 1s / Warm Shock)', value: 'flash' }
    ]},
    { id: 'perfusion', questionText: 'Skin Perfusion', type: 'select', options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Mottled / Cold extremities', value: 'cold' },
        { label: 'Warm / Bounding pulses', value: 'warm' }
    ]},
    { id: 'hypotension', questionText: 'Hypotension for age?', type: 'boolean', info: 'SBP < 70 + (2x age) for 1-10yr. < 60 for neonates. < 70 for infants.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { suspectedInfection, mentalStatus, capRefill, perfusion, hypotension } = data;
    const details = [];

    const hasOrganDysfunction = mentalStatus || capRefill === 'delayed' || capRefill === 'flash' || perfusion === 'cold' || perfusion === 'warm' || hypotension;

    if (suspectedInfection && hasOrganDysfunction) {
      details.push("DIAGNOSIS: SEPTIC SHOCK. Meets criteria (Infection + Organ Dysfunction/Hypotension).");
      if (capRefill === 'delayed' || perfusion === 'cold') details.push("Physiology: COLD SHOCK (Low Output, High SVR).");
      if (capRefill === 'flash' || perfusion === 'warm') details.push("Physiology: WARM SHOCK (High Output, Low SVR).");
      return { level: 'severe', details };
    }

    if (suspectedInfection) {
        details.push("DIAGNOSIS: SEPSIS. Infection present with high risk of progression to shock. Monitor vitals every 15 minutes.");
        return { level: 'moderate', details };
    }

    details.push("Does not currently meet sepsis/shock criteria. Maintain high index of suspicion if febrile/ill.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
      const management = [];

      if (severity.level === 'severe') {
          management.push({
              title: "1. THE GOLDEN HOUR: Rapid Resuscitation",
              recommendations: [
                  "TIME IS TISSUE: Goal is to reverse shock within the first 60 minutes.",
                  "ACCESS: Establish IV/IO access immediately. Do not delay fluid for central access.",
                  "FLUIDS: Give 20 mL/kg bolus of isotonic crystalloid (NS or LR) over 5-10 minutes.",
                  "REASSESS: Check HR, BP, Mental Status, and Cap Refill after EACH bolus.",
                  "MONITOR OVERLOAD: Check for rales or hepatomegaly. Stop boluses if overload develops.",
                  "REPEAT: Continue boluses up to 40-60 mL/kg until perfusion improves or overload appears."
              ]
          });

          management.push({
              title: "2. URGENT ANTIBIOTICS",
              recommendations: [
                  "ADMINISTER WITHIN 60 MINUTES: Every hour of delay increases mortality risk.",
                  "CULTURES FIRST: Draw blood cultures (from Central and Peripheral if applicable) ONLY if it doesn't delay antibiotics.",
                  "EMPIRIC CHOICE: Start broad-spectrum therapy (e.g., Ceftriaxone + Vancomycin).",
                  "SOURCE CONTROL: Identify and address source (e.g., drain abscess, remove infected catheter)."
              ]
          });

          const isCold = data.capRefill === 'delayed' || data.perfusion === 'cold';
          management.push({
              title: "3. VASOACTIVE SUPPORT (Fluid-Refractory)",
              recommendations: [
                  "WHEN TO START: If shock persists after 40-60 mL/kg of fluid.",
                  isCold ? "COLD SHOCK: Start ADRENALINE (EPINEPHRINE) infusion (0.05-0.1 mcg/kg/min)." : "WARM SHOCK: Start NORADRENALINE (NOREPINEPHRINE) infusion (0.05-0.1 mcg/kg/min).",
                  "PERIPHERAL USE: Vasoactives can be started through a high-quality peripheral IV while awaiting central access.",
                  "PUSH-DOSE RESCUE: Use diluted Adrenaline (1:10,000) for immediate rescue during transition to infusion."
              ]
          });

          management.push({
              title: "4. ADJUNCTIVE STEPS",
              recommendations: [
                  "GLUCOSE: Check bedside glucose. Treat hypoglycemia (<60-70 mg/dL).",
                  "CALCIUM: Check ionized calcium. Replete if low to improve cardiac contractility.",
                  "OXYGEN: Provide high-flow oxygen. Consider early intubation for persistent respiratory distress or failure to improve."
              ]
          });
      } else if (severity.level === 'moderate') {
          management.push({
              title: "Sepsis Management",
              recommendations: [
                  "Obtain cultures and administer broad-spectrum IV antibiotics promptly.",
                  "Place on continuous cardiac monitor and cycle BP every 15 minutes.",
                  "Provide 10-20 mL/kg fluid bolus and reassess closely for progression to shock."
              ]
          });
      }

      return management;
  },
  getDisposition: () => [
      "ADMIT TO PICU: All patients in septic shock require immediate admission to the Pediatric Intensive Care Unit.",
      "TRANSFER: If PICU level care is not available, stabilize and arrange for emergent transport to a pediatric tertiary center."
  ],
  getRedFlags: () => [
    "Hypotension (Late, ominous sign in children)",
    "Altered Mental Status (Irritable/Lethargic)",
    "Persistent tachycardia or tachypnea",
    "Capillary refill > 2 seconds (Cold) or < 1 second (Warm)",
    "Mottled or cool skin",
    "Hypothermia (<36°C) or High Fever (>38.5°C)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        // Fluid
        doses.push({
            drugName: "Isotonic Fluid Bolus (NS/LR)",
            dose: `20 mL/kg = ${(20 * weight).toFixed(0)} mL`,
            notes: "Give over 5-10 min. Repeat as needed up to 60 mL/kg total."
        });

        // Vasoactives
        const epiInfusion = calculateInfusion("Adrenaline", weight);
        doses.push({
            drugName: "Adrenaline (Epinephrine) Infusion",
            dose: "Start at 0.05-0.1 mcg/kg/min. Titrate to effect.",
            notes: `FIRST-LINE FOR COLD SHOCK. ${epiInfusion.notes} ${epiInfusion.dose}`
        });

        const norEpiInfusion = calculateInfusion("Noradrenaline", weight);
        doses.push({
            drugName: "Noradrenaline (Norepinephrine) Infusion",
            dose: "Start at 0.05-0.1 mcg/kg/min. Titrate to effect.",
            notes: `FIRST-LINE FOR WARM SHOCK. ${norEpiInfusion.notes} ${norEpiInfusion.dose}`
        });

        doses.push({
            drugName: "Adrenaline 1:10,000 Diluted (Rescue Push)",
            dose: `0.1 mL/kg = ${(0.1 * weight).toFixed(2)} mL`,
            notes: "RESCUE ONLY. Dilute 1 mg (1:1,000) stock with 9 mL saline to make 10 mL of 1:10,000 concentration first."
        });

        // Antibiotics
        doses.push({
            drugName: "Ceftriaxone (IV)",
            dose: `100 mg/kg (max 2g) = ${Math.min(100 * weight, 2000).toFixed(0)} mg`,
            notes: "INDICATION: Broad-spectrum empiric coverage. Give within 60 min."
        });
        doses.push({
            drugName: "Vancomycin (IV)",
            dose: `15-20 mg/kg = ${(15 * weight).toFixed(0)}-${(20 * weight).toFixed(0)} mg`,
            notes: "INDICATION: Suspected MRSA or resistant Strep. Give within 60 min."
        });

    } else {
        doses.push({ drugName: "Fluid Bolus", dose: "20 mL/kg over 5-10 min", notes: "NS or LR." });
        doses.push({ drugName: "Adrenaline Infusion", dose: "0.05 - 0.3 mcg/kg/min", notes: "For Cold Shock." });
        doses.push({ drugName: "Noradrenaline Infusion", dose: "0.05 - 0.3 mcg/kg/min", notes: "For Warm Shock." });
        doses.push({ drugName: "Ceftriaxone IV", dose: "100 mg/kg (max 2g)", notes: "Within 60 min." });
    }

    return doses;
  },
  getReferences: () => [
    { title: "Surviving Sepsis Campaign International Guidelines for Management of Septic Shock and Sepsis-Associated Organ Dysfunction in Children (2020)", url: "https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international.1.aspx" },
    { title: "PALS 2020: Septic Shock Algorithm", url: "https://cpr.heart.org/" }
  ],
};
