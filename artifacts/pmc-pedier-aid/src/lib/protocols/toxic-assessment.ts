import type { DiseaseProtocol, FormData, Severity } from './types';

const calculateYOS = (data: FormData): { score: number; details: string[] } => {
    let score = 0;
    const details: string[] = [];

    const qualityOfCry = Number(data.qualityOfCry) || 1;
    if (qualityOfCry === 3) { score += 2; details.push("Cry: Whimpering"); }
    if (qualityOfCry === 5) { score += 4; details.push("Cry: Weak/Moaning/High-pitched"); }

    const reactionToParent = Number(data.reactionToParent) || 1;
    if (reactionToParent === 3) { score += 2; details.push("Reaction: Cries on/off"); }
    if (reactionToParent === 5) { score += 4; details.push("Reaction: Cries continuously/No response"); }
    
    const stateVariation = Number(data.stateVariation) || 1;
    if (stateVariation === 3) { score += 2; details.push("State: Eyes close briefly"); }
    if (stateVariation === 5) { score += 4; details.push("State: Falls asleep/Won't rouse"); }

    const color = Number(data.color) || 1;
    if (color === 3) { score += 2; details.push("Color: Pale extremities"); }
    if (color === 5) { score += 4; details.push("Color: Pale/Cyanotic/Mottled"); }

    const hydration = Number(data.hydration) || 1;
    if (hydration === 3) { score += 2; details.push("Hydration: Tacky membranes"); }
    if (hydration === 5) { score += 4; details.push("Hydration: Doughy skin/Dry membranes"); }

    const responseToSocial = Number(data.responseToSocial) || 1;
    if (responseToSocial === 3) { score += 2; details.push("Social: Brief smile/alert"); }
    if (responseToSocial === 5) { score += 4; details.push("Social: No smile/Anxious/Dull"); }

    // The YOS score is the sum of the individual scores (1, 3, or 5).
    // Our question values are 1,3,5. The score is just the sum of the selections.
    const totalScore = qualityOfCry + reactionToParent + stateVariation + color + hydration + responseToSocial;

    return { score: totalScore, details };
};


export const toxicAssessmentProtocol: DiseaseProtocol = {
  id: 'toxic-assessment',
  name: 'Toxic vs Non-toxic Child Assessment',
  system: 'Infectious Diseases',
  description: 'Utilizes the Yale Observation Scale (YOS) to objectively quantify a febrile child\'s appearance and risk for serious bacterial infection (SBI).',
  image: {
    url: "https://picsum.photos/seed/toxic-assessment/600/400",
    hint: "worried parent"
  },
  questions: [
    { id: 'qualityOfCry', questionText: 'Quality of Cry', type: 'radio', options: [
        {label: 'Strong / Normal tone', value: 1}, {label: 'Whimpering', value: 3}, {label: 'Weak, moaning, or high-pitched', value: 5}
    ]},
    { id: 'reactionToParent', questionText: 'Reaction to Parent Stimulation', type: 'radio', options: [
        {label: 'Cries briefly then stops', value: 1}, {label: 'Cries on and off', value: 3}, {label: 'Continuous cry or no response', value: 5}
    ]},
    { id: 'stateVariation', questionText: 'State Variation (Wakefulness)', type: 'radio', options: [
        {label: 'Stays awake or wakes quickly', value: 1}, {label: 'Briefly awakens or needs prolonged stimulation', value: 3}, {label: 'Falls asleep or will not rouse', value: 5}
    ]},
    { id: 'color', questionText: 'Skin Color', type: 'radio', options: [
        {label: 'Pink', value: 1}, {label: 'Pale extremities', value: 3}, {label: 'Pale, cyanotic, or mottled', value: 5}
    ]},
    { id: 'hydration', questionText: 'Hydration Status', type: 'radio', options: [
        {label: 'Moist mucous membranes', value: 1}, {label: 'Tacky mucous membranes', value: 3}, {label: 'Dry membranes, doughy skin', value: 5}
    ]},
    { id: 'responseToSocial', questionText: 'Response to Social Overtures', type: 'radio', options: [
        {label: 'Smiles or alerts (<2mo)', value: 1}, {label: 'Brief smile/alert (<2mo)', value: 3}, {label: 'No smile, anxious face, dull', value: 5}
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { score, details } = calculateYOS(data);
    
    if (score > 16) {
      details.push("Score > 16 indicates high risk for Serious Bacterial Infection (SBI).");
      return { level: 'severe', score, details }; // High Risk (Toxic)
    }
    if (score >= 11) {
      details.push("Score 11-15 indicates moderate risk for SBI.");
      return { level: 'moderate', score, details }; // Moderate Risk
    }
    details.push("Score ≤ 10 indicates low risk for SBI.");
    return { level: 'mild', score, details }; // Low Risk (Non-Toxic)
  },
  getManagement: (severity) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "High Risk / Toxic (YOS > 16)",
          recommendations: [
            "Treat as sepsis until proven otherwise. This is a medical emergency.",
            "Initiate immediate resuscitation (ABCs), obtain IV/IO access.",
            "Perform a full sepsis evaluation (blood, urine, and CSF cultures).",
            "Administer broad-spectrum parenteral antibiotics immediately after cultures are obtained.",
            "Admit to the hospital, likely to a PICU setting."
          ]
        }];
      case 'moderate':
        return [{
          title: "Moderate Risk (YOS 11-15)",
          recommendations: [
            "Patient is at intermediate risk for SBI. A thorough evaluation is required.",
            "Consider a full or partial sepsis evaluation (blood and urine cultures at a minimum; LP based on age and clinical picture).",
            "Decision for admission and empiric antibiotics should be based on the complete clinical context, age, and immunization status.",
            "A period of observation in the ED may be warranted."
          ]
        }];
      case 'mild':
        return [{
          title: "Low Risk / Non-Toxic (YOS ≤ 10)",
          recommendations: [
            "Patient is at low risk for SBI. The general appearance is reassuring.",
            "Management should be guided by specific age-based fever protocols (e.g., fever in 3-36 months).",
            "Invasive workups (like LP) are generally not required unless specific indications exist.",
            "Focus on identifying a source of fever and providing supportive care."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Immediate hospital admission to a high-acuity unit (PICU)."];
    }
    if (severity.level === 'moderate') {
      return ["Admission is often warranted for observation and possible treatment. Outpatient management only for select cases with definite follow-up."];
    }
    return ["Discharge home is usually appropriate, with management guided by age-specific fever protocols and strict return precautions."];
  },
  getRedFlags: () => [
    "A YOS score > 16 is a major red flag for sepsis.",
    "A YOS score of 11-15 requires careful consideration and a high index of suspicion.",
    "Any single observation item with a score of 5 (e.g., 'falls asleep/will not rouse', 'no response to parent') is a significant red flag on its own."
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV)", dose: "80-100 mg/kg/day for sepsis/meningitis.", notes: "Common empiric antibiotic for toxic-appearing children." },
    { drugName: "Vancomycin (IV)", dose: "60 mg/kg/day", notes: "Add for MRSA coverage or if patient is critically ill." }
  ],
  getReferences: () => [
    { title: "McCarthy PL, et al. Observation scales to identify serious illness in febrile children. Pediatrics. 1982.", url: "https://pubmed.ncbi.nlm.nih.gov/7070798/" }
  ],
};
