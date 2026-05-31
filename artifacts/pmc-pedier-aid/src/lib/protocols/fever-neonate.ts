import type { DiseaseProtocol, FormData, Severity } from './types';

export const feverNeonateProtocol: DiseaseProtocol = {
  id: 'fever-neonate',
  name: 'Fever in Neonate (≤28 days)',
  system: 'Infectious Diseases',
  description: 'Management of fever in a neonate (age 28 days or less), which is considered a medical emergency.',
  image: {
    url: "https://picsum.photos/seed/fever-neonate/600/400",
    hint: "newborn checkup"
  },
  questions: [
    { id: 'ageDays', questionText: 'Age in days', type: 'number' },
    { id: 'hasFeverOrHypothermia', questionText: 'Fever (≥38°C / 100.4°F) or Hypothermia (<36.5°C / 97.7°F)?', type: 'boolean' },
    { id: 'isWellAppearing', questionText: 'Is the infant well-appearing (active, good tone, normal color)?', type: 'boolean' },
    { id: 'hasPoorFeeding', questionText: 'Poor feeding or vomiting?', type: 'boolean' },
    { id: 'hasRespDistress', questionText: 'Any respiratory distress (tachypnea, grunting, apnea)?', type: 'boolean' },
    { id: 'hasHSVRisk', questionText: 'Any risk factors for Herpes Simplex Virus (HSV)?', type: 'boolean', info: 'Maternal history of genital HSV, active lesions in mother/contacts, or infant has vesicular rash.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Any neonate with a confirmed fever is high-risk and must be treated as having a serious bacterial infection until proven otherwise.
    const details: string[] = [];
    if (Number(data.ageDays) > 28) {
      details.push("Patient is older than 28 days. This protocol is for neonates.");
      return { level: 'unknown', details };
    }
    if (data.hasFeverOrHypothermia) {
        details.push("Neonate with fever or hypothermia is a medical emergency.");
        if(!data.isWellAppearing) {
            details.push("Infant is ill-appearing.");
        }
        return { level: 'severe', details };
    }
    return { level: 'no', details: ['No fever or hypothermia reported.'] };
  },
  getManagement: (severity) => {
    if (severity.level === 'severe') {
      return [{
        title: "EMERGENCY: Neonatal Sepsis Workup",
        recommendations: [
          "This is a medical emergency. Admit to the hospital immediately.",
          "Perform a full sepsis evaluation: Blood culture, Urinalysis & Culture (via catheterization), and Lumbar Puncture for CSF analysis and culture.",
          "Obtain IV/IO access.",
          "Administer empiric IV antibiotics IMMEDIATELY after cultures are obtained. Do not delay antibiotics.",
          "If HSV risk factors are present (vesicles, maternal history, seizure), add IV Acyclovir.",
          "Monitor glucose, electrolytes, and for apnea/bradycardia.",
        ]
      }];
    }
    return [{ title: 'No Fever', recommendations: ['If afebrile and well-appearing, manage based on other clinical signs.']}]
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to the hospital (NICU or pediatric inpatient unit) for full sepsis evaluation and empiric antibiotics."];
    }
    return ["If infant is afebrile and well, discharge may be appropriate with close follow-up. Any concern warrants a lower threshold for admission."];
  },
  getRedFlags: () => [
    "Fever ≥38°C (100.4°F) in any infant ≤28 days old is a red flag itself.",
    "Hypothermia <36.5°C (97.7°F)",
    "Ill-appearance: Lethargy, hypotonia, poor perfusion, inconsolable irritability.",
    "Bulging fontanelle.",
    "Apnea or respiratory distress.",
    "Vesicular rash (concern for HSV)."
  ],
  getDrugDoses: () => [
    { drugName: "Ampicillin (IV)", dose: "100 mg/kg/dose (Age 0-7 days: q12h; Age >7 days: q8h)", notes: "Covers Listeria monocytogenes and Group B Strep." },
    { drugName: "Gentamicin (IV)", dose: "Dose based on weight and gestational age (consult pharmacy/neonatology).", notes: "Covers E. coli and other gram-negatives." },
    { drugName: "OR Cefotaxime (IV)", dose: "50 mg/kg/dose (Age 0-7 days: q12h; Age >7 days: q8h)", notes: "Alternative to Gentamicin. Preferred if meningitis is strongly suspected." },
    { drugName: "Acyclovir (IV)", dose: "20 mg/kg/dose every 8 hours", notes: "Add if there is any concern for HSV infection." }
  ],
  getReferences: () => [
    { title: "AAP: Management of Infants at Increased Risk for Early-Onset Sepsis", url: "https://publications.aap.org/pediatrics/article/144/2/e20191882/76801/Management-of-Infants-at-Increased-Risk-for" }
  ],
};
