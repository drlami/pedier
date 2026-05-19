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

    if (hypotension && (criteria1 || criteria2 || criteria3)) {
      details.push("DIAGNOSIS: ANAPHYLACTIC SHOCK. Hypotension/End-organ dysfunction present.");
      return { level: 'severe', details };
    }

    if (criteria1 || criteria2 || criteria3) {
      details.push("DIAGNOSIS: CONFIRMED ANAPHYLAXIS. Meets formal NIAID/FAAN diagnostic criteria.");
      return { level: 'severe', details };
    }

    // Pending/Likely Anaphylaxis Logic (captures early/progressing cases)
    if (count >= 1 && (exposure === 'likely' || exposure === 'known')) {
        details.push("DIAGNOSIS: PENDING / LIKELY ANAPHYLAXIS. Significant symptoms after exposure. High risk for rapid progression.");
        return { level: 'moderate', details };
    }

    if (onset && (respiratory || skinMucosal)) {
         details.push("DIAGNOSIS: SUSPECTED ANAPHYLAXIS. Acute onset of systemic symptoms. Monitor extremely closely.");
         return { level: 'moderate', details };
    }

    details.push("Does not currently meet anaphylaxis criteria. Observe closely for rapid progression.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
      const management = [];

      management.push({
          title: "CRITICAL: Epinephrine First",
          recommendations: [
              "EPINEPHRINE (ADRENALINE) IS THE ONLY FIRST-LINE TREATMENT.",
              "Do NOT delay Epinephrine for second-line drugs (antihistamines, steroids).",
              "Delayed administration of Epinephrine is the primary risk factor for fatal anaphylaxis."
          ]
      });

      if (severity.level === 'severe') {
          const isShock = data.hypotension;

          management.push({
              title: isShock ? "Management of ANAPHYLACTIC SHOCK" : "Management of ANAPHYLAXIS",
              recommendations: [
                  "Administer EPINEPHRINE 1:1,000 (1 mg/mL) UNDILUTED via INTRAMUSCULAR (IM) injection in the mid-outer thigh immediately.",
                  "Repeat IM Epinephrine every 5-15 minutes if symptoms persist or worsen.",
                  isShock ? "For SHOCK: Give rapid 20 mL/kg IV fluid boluses (NS or LR). Repeat as needed." : "Position patient supine with legs elevated.",
                  "Administer 100% high-flow oxygen via non-rebreather mask.",
                  isShock ? "Refractory Shock: If shock persists after 2-3 IM doses and fluid boluses, start an Epinephrine IV Infusion (diluted 1:10,000)." : ""
              ].filter(r => r !== "")
          });

          management.push({
              title: "Secondary (Adjunctive) Therapies",
              recommendations: [
                  "Antihistamines (H1 blocker e.g., Diphenhydramine): For skin symptoms (hives/itching) only. DOES NOT treat airway edema or shock.",
                  "Corticosteroids (e.g., Hydrocortisone): For prevention of biphasic (recurrent) reactions. Onset is slow (4-6 hours).",
                  "Nebulized Albuterol: For persistent wheezing/bronchospasm after epinephrine."
              ]
          });
      } else if (severity.level === 'moderate') {
          management.push({
              title: "Management of PENDING Anaphylaxis",
              recommendations: [
                  "INDICATIONS FOR EPINEPHRINE: Administer IM Epinephrine IMMEDIATELY if there is any sign of respiratory distress, hemodynamic change, OR if symptoms are rapidly progressing.",
                  "Place IV access and prepare fluids.",
                  "Frequent vital sign and airway assessment (every 5-10 minutes).",
                  "Have Epinephrine drawn up at the bedside ready to give."
              ]
          });
      } else {
          management.push({ 
            title: "Observation", 
            recommendations: [
                "Monitor vitals and respiratory status every 15 minutes.", 
                "Have Epinephrine drawn up at the bedside and ready to give.",
                "If any systemic symptom develops (cough, vomiting, hives), treat as Pending Anaphylaxis."
            ] 
          });
      }
      
      return management;
  },
  getDisposition: (severity, data) => {
    return [
        "ADMIT/OBSERVE: All patients receiving Epinephrine require a minimum 4-8 hour observation period due to biphasic reaction risk.",
        "ADMIT TO PICU: For patients with hypotension (shock), respiratory failure, or those requiring multiple doses of epinephrine.",
        "DISCHARGE CRITERIA: Completely asymptomatic for at least 4-8 hours, reliable caregivers, and patient MUST be provided with an Epinephrine Auto-Injector (if available) and an Anaphylaxis Action Plan."
    ];
  },
  getRedFlags: () => [
    "Stridor or muffled voice (indicates critical upper airway edema)",
    "Severe wheezing refractory to epinephrine",
    "Hypotension or signs of shock (lethargy, cool extremities)",
    "Biphasic reaction (symptoms returning 1-72 hours after initial improvement)",
    "History of asthma (increases risk of fatal anaphylaxis)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        const imEpinephrineMg = Math.min(0.01 * weight, 0.5);
        // First Line
        doses.push({
            drugName: "Epinephrine IM (1:1,000 Stock)",
            dose: `0.01 mg/kg (max 0.5 mg) = ${imEpinephrineMg.toFixed(2)} mg = ${imEpinephrineMg.toFixed(2)} mL IM`,
            notes: "INDICATION: First-line for all systemic signs. Give UNDILUTED IM into mid-outer thigh. May repeat q5-15 min."
        });

        // Shock specific
        if (data.hypotension || severity.level === 'severe') {
            doses.push({
                drugName: "Isotonic Fluid Bolus (NS/LR)",
                dose: `20 mL/kg = ${(20 * weight).toFixed(0)} mL`,
                notes: "INDICATION: Anaphylactic Shock. Repeat as needed."
            });
            doses.push({
                drugName: "Epinephrine IV/IO (1:10,000 DILUTED)",
                dose: `0.1 mL/kg = ${(0.1 * weight).toFixed(2)} mL`,
                notes: "RESCUE DOSE FOR SHOCK ONLY. Must dilute 1:1,000 stock to 1:10,000 first (1mL drug + 9mL Saline)."
            });
            const epiInfusion = calculateEpinephrineInfusion(weight);
            doses.push({
                drugName: "Epinephrine IV Infusion (Refractory Shock)",
                dose: "Start at 0.1 mcg/kg/min. Titrate to effect.",
                notes: `${epiInfusion.notes} ${epiInfusion.dose}`
            });
        }

        // Adjuvants
        doses.push({
            drugName: "Hydrocortisone IV",
            dose: `2-4 mg/kg (max 100-200 mg) = ${(2 * weight).toFixed(0)} to ${(4 * weight).toFixed(0)} mg`,
            notes: "INDICATION: Prevention of biphasic reactions. Second-line therapy."
        });
        doses.push({
            drugName: "Diphenhydramine (Benadryl) IV/IM/PO",
            dose: `1 mg/kg (max 50 mg) = ${weight.toFixed(0)} mg`,
            notes: "INDICATION: Skin symptoms (hives/itching) only. Second-line therapy."
        });

    } else {
        doses.push({ drugName: "Epinephrine IM (1:1,000)", dose: "0.01 mg/kg (max 0.5 mg)", notes: "UNDILUTED IM into thigh." });
        doses.push({ drugName: "IV Fluid Bolus", dose: "20 mL/kg", notes: "For shock." });
        doses.push({ drugName: "Epinephrine IV/IO (1:10,000)", dose: "0.1 mL/kg (0.01 mg/kg)", notes: "RESCUE ONLY. Dilute 1:10 first." });
        doses.push({ drugName: "Hydrocortisone IV", dose: "2-4 mg/kg", notes: "Biphasic prevention." });
    }

    return doses;
  },
  getReferences: () => [
      { title: "NIAID/FAAN: Guidelines for the Diagnosis and Management of Food Allergy", url: "https://www.niaid.nih.gov/" },
      { title: "AAP: Epinephrine for the Treatment of Anaphylaxis", url: "https://publications.aap.org/pediatrics" },
      { title: "PALS 2020: Management of Anaphylactic Shock", url: "https://cpr.heart.org/" }
  ],
};
