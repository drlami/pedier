import type { DiseaseProtocol, FormData, Severity } from './types';

export const viralVsBacterialProtocol: DiseaseProtocol = {
  id: 'viral-vs-bacterial',
  name: 'Viral vs. Bacterial Infection Clues',
  system: 'Fever & Infectious Diseases',
  description: 'A cognitive aid summarizing clinical and laboratory findings to help differentiate between likely viral and bacterial etiologies of fever.',
  image: {
    url: "https://picsum.photos/seed/viral-vs-bacterial/600/400",
    hint: "microscope virus"
  },
  questions: [
    { id: 'isToxic', questionText: 'Is the child ill- or toxic-appearing (YOS > 10)?', type: 'boolean' },
    { id: 'hasViralSymptoms', questionText: 'Prominent viral symptoms present (cough, coryza, conjunctivitis)?', type: 'boolean' },
    { id: 'feverHeight', questionText: 'Peak temperature > 39°C (102.2°F)?', type: 'boolean' },
    { id: 'crp', questionText: 'C-Reactive Protein (CRP) in mg/L', type: 'number', info: 'e.g., <20, 20-60, >60' },
    { id: 'procalcitonin', questionText: 'Procalcitonin (PCT) in ng/mL', type: 'number', info: 'e.g., <0.5, 0.5-2, >2' },
    { id: 'anc', questionText: 'Absolute Neutrophil Count (ANC) in cells/μL', type: 'number', info: 'e.g., <10,000, >10,000' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // This protocol uses 'severity' to indicate likelihood of bacterial infection
    const details: string[] = [];
    let score = 0;

    // Clinical Clues
    if (data.isToxic) { score += 3; details.push("Ill/toxic appearance strongly suggests bacterial infection."); }
    if (data.feverHeight) { score += 1; details.push("High fever (>39°C) is more common in bacterial infections, but not specific."); }
    if (!data.hasViralSymptoms) { score += 1; details.push("Absence of viral symptoms increases bacterial likelihood."); }

    // Lab Clues
    const crp = Number(data.crp);
    if (crp > 80) { score += 3; details.push(`Very high CRP (>80)`); }
    else if (crp > 40) { score += 2; details.push(`High CRP (40-80)`); }
    else if (crp > 20) { score += 1; details.push(`Elevated CRP (20-40)`); }

    const pct = Number(data.procalcitonin);
    if (pct > 2) { score += 3; details.push(`High Procalcitonin (>2) is strongly suggestive of bacterial infection.`); }
    else if (pct > 0.5) { score += 2; details.push(`Elevated Procalcitonin (>0.5)`); }
    
    const anc = Number(data.anc);
    if (anc > 10000) { score += 1; details.push(`Neutrophilia (ANC > 10,000)`); }

    if (score >= 4 || pct > 2) {
      return { level: 'severe', score, details: [...details, "High probability of bacterial infection."] };
    }
    if (score >= 2) {
      return { level: 'moderate', score, details: [...details, "Intermediate probability of bacterial infection."] };
    }
    return { level: 'mild', score, details: [...details, "Low probability of bacterial infection; likely viral."] };
  },
  getManagement: (severity) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Guidance for High Bacterial Likelihood",
          recommendations: [
            "These findings are highly suggestive of a Serious Bacterial Infection (SBI).",
            "A full sepsis workup (blood, urine, +/- CSF cultures) is strongly recommended.",
            "Empiric parenteral antibiotics should be started promptly.",
            "Hospital admission for treatment and monitoring is required."
          ]
        }];
      case 'moderate':
        return [{
          title: "Guidance for Intermediate Bacterial Likelihood",
          recommendations: [
            "The clinical picture is indeterminate. SBI is possible.",
            "The decision to perform a full workup and start antibiotics must be individualized based on age, immunization status, and the complete clinical context.",
            "Consider obtaining blood and urine cultures and observing the patient.",
            "If discharging, ensure very close and reliable follow-up within 12-24 hours."
          ]
        }];
      case 'mild':
        return [{
          title: "Guidance for Low Bacterial Likelihood (Likely Viral)",
          recommendations: [
            "The findings strongly suggest a self-limited viral illness.",
            "Antibiotics are not indicated and should be avoided.",
            "Focus on symptomatic care (hydration, antipyretics).",
            "Provide strict return precautions to caregivers.",
            "No routine lab work or imaging is necessary."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Hospital admission is required."];
    }
    if (severity.level === 'moderate') {
      return ["Admission vs. discharge with close follow-up must be decided based on the full clinical context and social situation."];
    }
    return ["Discharge home with supportive care instructions is appropriate."];
  },
  getRedFlags: () => [
    "Procalcitonin > 2.0 ng/mL",
    "Toxic or ill appearance (e.g., Yale Observation Score > 10)",
    "Petechial or purpuric rash",
    "Fever in an unimmunized or immunocompromised child"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "UpToDate: Fever of unknown origin in children: Evaluation", url: "https://www.uptodate.com/contents/fever-of-unknown-origin-in-children-evaluation" },
    { title: "NICE Guideline: Fever in under 5s: assessment and initial management", url: "https://www.nice.org.uk/guidance/ng143" }
  ],
};
