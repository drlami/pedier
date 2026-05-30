import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const alteredMentalStatusProtocol: DiseaseProtocol = {
  id: 'altered-mental-status',
  name: 'Altered Mental Status (AMS)',
  system: 'Neurology',
  description: 'Systematic approach to the unconscious or confused child using AEIOU-TIPS and GCS.',
  image: {
    url: "https://picsum.photos/seed/ams/600/400",
    hint: "confused child"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'gcs', questionText: 'Glasgow Coma Scale (GCS)', type: 'number', placeholder: '3-15' },
    { id: 'glucose', questionText: 'Blood Glucose', type: 'number', unit: 'mg/dL' },
    { id: 'hypertension', questionText: 'Hypertension for age?', type: 'boolean' },
    { id: 'bradycardia', questionText: 'Bradycardia for age?', type: 'boolean' },
    { id: 'irregularBreathing', questionText: 'Irregular/Cheyne-Stokes breathing?', type: 'boolean' },
    { id: 'pupilReactive', questionText: 'Pupils reactive and equal?', type: 'boolean' },
    { id: 'traumaSign', questionText: 'Signs of Head Trauma?', type: 'boolean' },
    { id: 'ingestionPossible', questionText: 'Possible toxic ingestion?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const gcs = Number(data.gcs || 15);
    const glucose = Number(data.glucose || 100);

    // Cushing's Triad Check
    const cushingCount = [data.hypertension, data.bradycardia, data.irregularBreathing].filter(Boolean).length;
    
    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Alteration';

    if (gcs <= 8 || cushingCount >= 2 || data.pupilReactive === false) {
      level = 'severe';
      interpretation = 'CRITICAL: COMA / IMPENDING HERNIATION';
      if (cushingCount >= 2) details.push("SUSPECT CUSHING'S TRIAD: High risk of brain herniation.");
      if (gcs <= 8) details.push("GCS ≤ 8: Airway protection required.");
    } else if (gcs <= 12 || glucose < 60 || data.traumaSign === true) {
      level = 'moderate';
      interpretation = 'Moderate AMS / High Risk';
    }

    if (glucose < 60) details.push("HYPOGLYCEMIA detected. Treat immediately.");

    return { 
      level, 
      scoreDetails: {
        systemName: "Glasgow Coma Scale (GCS)",
        totalScore: gcs,
        maxScore: 15,
        interpretation,
        referenceTable: [
          { range: "13 - 15", meaning: "Mild / Concussion level" },
          { range: "9 - 12", meaning: "Moderate / Significant Impairment" },
          { range: "3 - 8", meaning: "Severe / Coma (Secure Airway)" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const management = [
      {
        title: "Immediate Stabilization (ABCDE)",
        recommendations: [
          "Airway: If GCS ≤ 8, prepare for intubation.",
          "Breathing: 100% O2 via NRB.",
          "Circulation: Establish 2 large-bore IVs or IO.",
          "Disability: Rapid glucose check; Pupils; GCS.",
          "Exposure: Fully undress to look for trauma or rashes."
        ]
      }
    ];

    if (severity.level === 'severe') {
      management.push({
        title: "Emergency ICP Management",
        recommendations: [
          "Elevate head of bed to 30 degrees.",
          "Maintain midline neck position.",
          "Hyperosmolar therapy: 3% Saline (3-5 mL/kg) or Mannitol (0.5-1 g/kg).",
          "Urgently obtain Head CT and Neurosurgery consult."
        ]
      });
    }

    management.push({
      title: "Diagnostic Search (AEIOU TIPS)",
      recommendations: [
        "A: Alcohol / Acidosis",
        "E: Epilepsy (Post-ictal or Non-convulsive SE) / Electrolytes",
        "I: Insulin (Hypoglycemia / DKA)",
        "O: Overdose / Oxygen (Hypoxia)",
        "U: Uremia",
        "T: Trauma (NAT/Accidental) / Tumor",
        "I: Infection (Meningitis/Sepsis)",
        "P: Poisoning / Psychiatric",
        "S: Stroke / Shock / Shunt Malfunction"
      ]
    });

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Immediate PICU Admission."];
    return ["Admit for observation and workup."];
  },
  getRedFlags: () => ["Cushing's Triad", "GCS ≤ 8", "Fixed/Dilated pupil", "Hypoglycemia", "Bulging fontanelle"],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses = [];
    if (weight > 0) {
        doses.push({ drugName: "Dextrose 10% (D10)", dose: `${(5 * weight).toFixed(0)} mL IV`, notes: "For hypoglycemia." });
        doses.push({ drugName: "3% Hypertonic Saline", dose: `${(3 * weight).toFixed(0)} mL IV`, notes: "For suspected increased ICP." });
        doses.push({ drugName: "Naloxone (Narcan)", dose: `${(0.1 * weight).toFixed(1)} mg (max 2mg)`, notes: "If opioid overdose suspected." });
    }
    return doses;
  },
  getReferences: () => [{ title: "PALS: Management of the Unconscious Child", url: "https://cpr.heart.org/" }],
};
