import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// Helper for infusion calculations
const calculateEpinephrineInfusion = (weight: number): { dose: string, notes: string } => {
    if (weight <= 0 || isNaN(weight)) {
        return {
            dose: "Enter weight to calculate.",
            notes: ""
        };
    }
    const mgIn100ml = (0.6 * weight).toFixed(2);
    return {
        dose: "Standard Infusion: 0.6 x weight (kg) in 100mL fluid. At this concentration, 1 mL/hr = 0.1 mcg/kg/min.",
        notes: `Preparation: Add ${mgIn100ml} mg of Adrenaline (Epinephrine) to a 100mL bag of D5W or NS.`
    };
};


export const anaphylacticShockProtocol: DiseaseProtocol = {
  id: 'anaphylactic-shock',
  name: 'Anaphylaxis and Anaphylactic Shock',
  system: 'Shock and Resuscitation',
  description: 'Emergency recognition and management of anaphylaxis, a life-threatening allergic reaction.',
  image: {
    url: "https://picsum.photos/seed/anaphylactic-shock/600/400",
    hint: "allergy injection"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'onset', questionText: 'Acute onset of illness (minutes to several hours)?', type: 'boolean' },
    { id: 'skinMucosal', questionText: 'Involvement of the skin or mucosal tissue?', type: 'boolean', info: 'e.g., generalized hives, itching or flushing, swollen lips/tongue/uvula' },
    { id: 'respiratory', questionText: 'Respiratory compromise?', type: 'boolean', info: 'e.g., dyspnea, wheeze-bronchospasm, stridor, hypoxemia' },
    { id: 'hypotension', questionText: 'Reduced blood pressure or end-organ dysfunction?', type: 'boolean', info: 'e.g., syncope, incontinence, hypotonia' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Diagnosis is based on NIAID criteria. Severity is always high.
    const details = [];
    const { onset, skinMucosal, respiratory, hypotension } = data;

    const isAnaphylaxis = 
      // Criterion 1
      (onset && skinMucosal && (respiratory || hypotension)) ||
      // Criterion 2 (simplified - assumes exposure)
      (onset && (skinMucosal || respiratory || hypotension) && (skinMucosal && respiratory || skinMucosal && hypotension || respiratory && hypotension)) ||
      // Criterion 3 (simplified - assumes known allergen)
      (onset && hypotension);

    if (isAnaphylaxis) {
      if (hypotension) {
        details.push("Hypotension present, consistent with Anaphylactic Shock.");
        return { level: 'severe', details };
      }
      if (respiratory) {
        details.push("Respiratory compromise present.");
        return { level: 'severe', details };
      }
      details.push("Anaphylaxis criteria met without shock.");
      // Anaphylaxis is never mild. 'moderate' is used here to differentiate from frank shock.
      return { level: 'moderate', details }; 
    }

    return { level: 'unknown', details: ['Criteria for anaphylaxis not met based on input. Maintain high index of suspicion.'] };
  },
  getManagement: (severity, data) => {
      if (severity.level === 'severe' || severity.level === 'moderate') {
          return [
              {
                  title: "IMMEDIATE ACTION: Epinephrine First and Fast",
                  recommendations: [
                      "Administer EPINEPHRINE (ADRENALINE) 1:1000 (1 mg/mL) INTRAMUSCULARLY into the mid-outer thigh.",
                      "Repeat every 5-15 minutes if symptoms persist or progress."
                  ]
              },
              {
                  title: "Supportive Care / ABCs",
                  recommendations: [
                      "Place patient in supine position (or position of comfort if in respiratory distress) and elevate lower extremities.",
                      "Administer high-flow oxygen.",
                      "Establish IV/IO access. Obtain labs if time permits (CBC, chemistry, tryptase).",
                      "For hypotension, administer isotonic crystalloid (NS or LR) boluses.",
                      "For refractory bronchospasm, provide nebulized albuterol."
                  ]
              },
              {
                  title: "Second-Line Therapies (Adjunctive)",
                  recommendations: [
                      "These DO NOT replace epinephrine.",
                      "H1 Antagonist: Diphenhydramine IV/IM/PO.",
                      "H2 Antagonist: Famotidine or Ranitidine IV.",
                      "Corticosteroids: Methylprednisolone or Prednisone to potentially prevent biphasic reaction."
                  ]
              },
              {
                  title: "For Refractory Shock",
                  recommendations: [
                      "If hypotension persists despite fluids and repeated IM epinephrine, start an EPINEPHRINE INFUSION.",
                      "Admit to PICU for continuous monitoring."
                  ]
              }
          ];
      }
      return [{ title: "No Anaphylaxis Detected", recommendations: ["Manage symptoms based on alternative diagnosis."] }];
  },
  getDisposition: (severity, data) => {
    return [
        "ALL patients diagnosed with anaphylaxis require a period of observation (minimum 4-8 hours) after their last dose of epinephrine due to the risk of a biphasic reaction.",
        "Admit to hospital if patient required multiple epinephrine doses, had hypotension or severe respiratory compromise, has a history of severe reactions, or lives far from medical care."
    ];
  },
  getRedFlags: () => [
    "Any respiratory compromise (stridor, wheeze, shortness of breath)",
    "Any sign of cardiovascular collapse (hypotension, syncope, dizziness)",
    "Failure to respond to initial dose of IM epinephrine",
    "Known history of severe anaphylaxis",
    "Biphasic reaction: recurrence of symptoms hours after initial resolution"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        doses.push({
            drugName: "Epinephrine IM (1:1000, 1mg/mL)",
            dose: `0.01 mg/kg (max 0.5 mg/dose) = ${(0.01 * weight).toFixed(2)} mg or ${(0.01 * weight).toFixed(2)} mL`,
            notes: `Use auto-injector if available: 0.15 mg for child <25kg, 0.3 mg for >25kg. May repeat every 5-15 min.`
        });
        doses.push({
            drugName: "IV Fluid Bolus (NS or LR)",
            dose: `20 mL/kg = ${(20 * weight).toFixed(1)} mL`,
            notes: "Repeat as needed for hypotension."
        });
        doses.push({
            drugName: "Diphenhydramine (Benadryl)",
            dose: `1-2 mg/kg (max 50 mg) = ${weight.toFixed(1)} to ${(2 * weight).toFixed(1)} mg`,
            notes: "IV/IM/PO"
        });
        doses.push({
            drugName: "Methylprednisolone (Solu-Medrol)",
            dose: `1-2 mg/kg (max 125 mg) = ${weight.toFixed(1)} to ${(2 * weight).toFixed(1)} mg`,
            notes: "IV"
        });
    } else {
        doses.push({ drugName: "Epinephrine IM (1:1000, 1mg/mL)", dose: "0.01 mg/kg (max 0.5 mg/dose)", notes: "Enter weight for calculation."});
        doses.push({ drugName: "IV Fluid Bolus (NS or LR)", dose: "20 mL/kg", notes: "Enter weight for calculation."});
        doses.push({ drugName: "Diphenhydramine (Benadryl)", dose: "1-2 mg/kg (max 50 mg)", notes: "Enter weight for calculation."});
        doses.push({ drugName: "Methylprednisolone (Solu-Medrol)", dose: "1-2 mg/kg (max 125 mg)", notes: "Enter weight for calculation."});
    }

    const epiInfusion = calculateEpinephrineInfusion(weight);
    doses.push({
        drugName: "Epinephrine IV Infusion (for refractory shock)",
        dose: "Start: 0.1 mcg/kg/min. Titrate to effect.",
        notes: `${epiInfusion.notes} ${epiInfusion.dose}`
    });

    return doses;
  },
  getReferences: () => [
      { title: "NIAID Guidelines for the Diagnosis and Management of Food Allergy", url: "https://www.niaid.nih.gov/diseases-conditions/guidelines-clinical-management-food-allergy"},
      { title: "UpToDate: Anaphylaxis: Emergency treatment", url: "https://www.uptodate.com/contents/anaphylaxis-emergency-treatment"}
  ],
};
