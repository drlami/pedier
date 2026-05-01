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
        notes: `Preparation: Add ${mgIn100ml} mL of your 1 mg/mL (1:1,000) stock Adrenaline to a 100mL bag of D5W or NS.`
    };
};


export const anaphylacticShockProtocol: DiseaseProtocol = {
  id: 'anaphylactic-shock',
  name: 'Anaphylaxis and Anaphylactic Shock',
  system: 'Shock and Resuscitation',
  description: 'Emergency recognition and management of anaphylaxis and anaphylactic shock in children, based on NIAID/FAAN diagnostic criteria.',
  image: {
    url: "https://picsum.photos/seed/anaphylactic-shock/600/400",
    hint: "allergy injection"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'onset', questionText: 'Acute onset of illness (minutes to several hours)?', type: 'boolean' },
    { id: 'skinMucosal', questionText: 'Skin/Mucosal involvement?', type: 'boolean', info: 'Hives, itching, flushing, swollen lips/tongue/uvula.' },
    { id: 'respiratory', questionText: 'Respiratory signs?', type: 'boolean', info: 'Dyspnea, wheezing, stridor, hypoxemia.' },
    { id: 'hypotension', questionText: 'Reduced BP or end-organ dysfunction?', type: 'boolean', info: 'Hypotension for age, syncope, hypotonia/floppiness.' },
    { id: 'giSymptoms', questionText: 'Persistent GI symptoms?', type: 'boolean', info: 'Severe crampy abdominal pain, repetitive vomiting.' },
    { id: 'exposure', questionText: 'Exposure to potential allergen?', type: 'select', options: [
        { label: 'None suspected', value: 'none' },
        { label: 'Likely allergen for this patient', value: 'likely' },
        { label: 'Known allergen for this patient', value: 'known' }
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { onset, skinMucosal, respiratory, hypotension, giSymptoms, exposure } = data;
    const details = [];

    // NIAID/FAAN Criteria 1: Acute onset skin + (Resp or Hypotension)
    const criteria1 = onset && skinMucosal && (respiratory || hypotension);
    
    // NIAID/FAAN Criteria 2: 2 or more of (Skin, Resp, Hypotension, GI) after LIKELY allergen
    let count = 0;
    if (skinMucosal) count++;
    if (respiratory) count++;
    if (hypotension) count++;
    if (giSymptoms) count++;
    const criteria2 = (exposure === 'likely' || exposure === 'known') && count >= 2;

    // NIAID/FAAN Criteria 3: Hypotension after KNOWN allergen
    const criteria3 = exposure === 'known' && hypotension;

    if (hypotension) {
      details.push("ANAPHYLACTIC SHOCK: Hypotension or end-organ dysfunction present.");
      return { level: 'severe', details };
    }

    if (criteria1 || criteria2 || criteria3) {
      details.push("CONFIRMED ANAPHYLAXIS: Meets formal NIAID/FAAN diagnostic criteria.");
      return { level: 'severe', details };
    }

    // Pending/Likely Anaphylaxis Logic
    if (count >= 1 && (exposure === 'likely' || exposure === 'known')) {
        details.push("PENDING / LIKELY ANAPHYLAXIS: Significant symptoms after exposure. Do not wait for full criteria to develop if patient is worsening.");
        return { level: 'moderate', details };
    }

    if (onset && (respiratory || skinMucosal)) {
         details.push("SUSPECTED ANAPHYLAXIS: Acute onset of systemic symptoms. Monitor extremely closely.");
         return { level: 'moderate', details };
    }

    details.push("Does not currently meet anaphylaxis criteria. Observe closely for rapid progression.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
      const management = [];

      management.push({
          title: "Adrenaline Preparation (Dilution Required for IV ONLY)",
          recommendations: [
              "Your hospital stock is 1 mg/mL (1:1,000).",
              "FOR IM USE: Give UNDILUTED (1:1,000) into the mid-outer thigh.",
              "FOR IV/IO USE: You MUST dilute 1 mL of Adrenaline with 9 mL of Normal Saline to make 10 mL of 0.1 mg/mL (1:10,000) concentration before administration."
          ]
      });

      if (severity.level === 'severe' || severity.level === 'moderate') {
          management.push({
              title: "IMMEDIATE ACTION: Epinephrine First",
              recommendations: [
                  "Administer EPINEPHRINE (ADRENALINE) 1:1000 (1 mg/mL) UNDILUTED via INTRAMUSCULAR (IM) injection in the mid-outer thigh.",
                  "For PENDING anaphylaxis: Administer Epinephrine immediately if there is any sign of respiratory distress, hypotension, or rapid progression.",
                  "Repeat every 5-15 minutes if symptoms persist or worsen."
              ]
          });
          management.push({
              title: "Positioning & Oxygen",
              recommendations: [
                  "Place patient in supine position with legs elevated. If in respiratory distress, allow position of comfort but avoid sudden sitting/standing.",
                  "Administer 100% high-flow oxygen via non-rebreather mask.",
                  "Prepare for advanced airway management if upper airway obstruction (stridor) is progressive."
              ]
          });
          management.push({
              title: "Fluid Resuscitation (for Shock)",
              recommendations: [
                  "If hypotension or signs of shock are present, give rapid 20 mL/kg boluses of isotonic crystalloid (NS or LR).",
                  "Large volumes may be required due to massive capillary leak."
              ]
          });
          management.push({
              title: "Adjunctive (Second-Line) Therapies",
              recommendations: [
                  "These DO NOT replace Epinephrine.",
                  "H1 Antagonist: Diphenhydramine (Benadryl) for skin symptoms.",
                  "H2 Antagonist: Famotidine.",
                  "Corticosteroids: Methylprednisolone or Hydrocortisone (may reduce risk of biphasic reaction).",
                  "Nebulized Albuterol: For persistent wheezing/bronchospasm."
              ]
          });
      } else {
          management.push({ title: "Observation", recommendations: ["If anaphylaxis is not yet clear but suspected, monitor vitals and respiratory status every 15 minutes. Have Epinephrine drawn up at the bedside and ready to give."] });
      }
      
      return management;
  },
  getDisposition: (severity, data) => {
    return [
        "ADMIT/OBSERVE: All patients with confirmed or strongly suspected anaphylaxis require a minimum 4-8 hour observation period.",
        "ADMIT TO PICU: For patients with hypotension, respiratory failure, or those requiring multiple doses of epinephrine.",
        "DISCHARGE CRITERIA: Completely asymptomatic for at least 4-8 hours, reliable caregivers, and patient MUST be provided with an Epinephrine Auto-Injector (if available) and an Anaphylaxis Action Plan."
    ];
  },
  getRedFlags: () => [
    "Stridor or muffled voice (upper airway edema)",
    "Severe wheezing refractory to epinephrine",
    "Hypotension or signs of shock (lethargy, cool extremities)",
    "Biphasic reaction (symptoms returning after initial improvement)",
    "History of asthma (increases risk of fatal anaphylaxis)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        // Epinephrine IM
        doses.push({
            drugName: "Epinephrine IM (1:1,000 Stock)",
            dose: `0.01 mg/kg (max 0.5 mg) = ${(0.01 * weight).toFixed(2)} mL IM`,
            notes: "Give UNDILUTED IM into mid-outer thigh. May repeat q5-15 min."
        });

        // IV Bolus
        doses.push({
            drugName: "Isotonic Fluid Bolus (NS/LR)",
            dose: `20 mL/kg = ${(20 * weight).toFixed(0)} mL`,
            notes: "Repeat as needed for shock."
        });

        // Push Dose Epi (Rescue ONLY)
        doses.push({
            drugName: "Epinephrine IV/IO (1:10,000 DILUTED)",
            dose: `0.1 mL/kg = ${(0.1 * weight).toFixed(2)} mL`,
            notes: "RESCUE DOSE FOR SHOCK ONLY. Must dilute 1:1,000 stock to 1:10,000 first."
        });

        // Adjuvants
        doses.push({
            drugName: "Hydrocortisone IV",
            dose: `2-4 mg/kg (max 100-200 mg) = ${(2 * weight).toFixed(0)} to ${(4 * weight).toFixed(0)} mg`,
            notes: "To help prevent biphasic reactions."
        });
        doses.push({
            drugName: "Diphenhydramine IV/IM/PO",
            dose: `1 mg/kg (max 50 mg) = ${weight.toFixed(0)} mg`,
            notes: "For cutaneous symptoms only."
        });

        // Infusion
        const epiInfusion = calculateEpinephrineInfusion(weight);
        doses.push({
            drugName: "Epinephrine IV Infusion (Refractory Shock)",
            dose: "Start at 0.1 mcg/kg/min. Titrate to effect.",
            notes: `${epiInfusion.notes} ${epiInfusion.dose}`
        });

    } else {
        doses.push({ drugName: "Epinephrine IM (1:1,000)", dose: "0.01 mg/kg (max 0.5 mg)", notes: "UNDILUTED IM into thigh." });
        doses.push({ drugName: "IV Fluid Bolus", dose: "20 mL/kg", notes: "For shock." });
        doses.push({ drugName: "Epinephrine IV/IO (1:10,000)", dose: "0.1 mL/kg (0.01 mg/kg)", notes: "RESCUE ONLY. Dilute 1:10 first." });
        doses.push({ drugName: "Epinephrine Infusion", dose: "0.1 mcg/kg/min", notes: "For refractory shock." });
    }

    return doses;
  },
  getReferences: () => [
      { title: "NIAID/FAAN: Guidelines for the Diagnosis and Management of Food Allergy", url: "https://www.niaid.nih.gov/" },
      { title: "AAP: Epinephrine for the Treatment of Anaphylaxis", url: "https://publications.aap.org/" },
      { title: "UpToDate: Anaphylaxis in children: Management", url: "https://www.uptodate.com/" }
  ],
};
