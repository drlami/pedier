import type { DiseaseProtocol, FormData, Severity } from './types';

export const fever1To2MonthsProtocol: DiseaseProtocol = {
  id: 'fever-1-2-months',
  name: 'Fever Without Source (29-60 days)',
  system: 'Fever & Infectious Diseases',
  description: 'Evaluation and management of well-appearing febrile infants aged 29 to 60 days, based on the AAP 2021 guidelines.',
  image: {
    url: "https://picsum.photos/seed/fever-1-2-months/600/400",
    hint: "infant temperature"
  },
  questions: [
    { id: 'isWellAppearing', questionText: 'Is the infant well-appearing and previously healthy?', type: 'boolean', info: 'Well-appearing means active, alert, good tone, normal color.' },
    { id: 'urinalysis', questionText: 'Urinalysis result?', type: 'select', options: [{label: 'Negative', value: 'negative'}, {label: 'Positive (LE, Nitrite, or Pyuria)', value: 'positive'}] },
    { id: 'crp', questionText: 'C-Reactive Protein (CRP)', type: 'number', unit: 'mg/L', info: 'Value in mg/L. 1 mg/dL = 10 mg/L.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // This logic is a simplified interpretation of the AAP 2021 guidelines for risk stratification.
    const details: string[] = [];

    if (!data.isWellAppearing) {
      details.push("Infant is ill-appearing.");
      return { level: 'severe', details }; // Using 'severe' for ill-appearing
    }

    if (data.urinalysis === 'positive') {
        details.push("Positive urinalysis strongly suggests a Urinary Tract Infection (UTI).");
        return { level: 'moderate', details };
    }

    const crp = Number(data.crp);

    if (isNaN(crp)) {
        details.push("Awaiting inflammatory marker results.");
        return { level: 'unknown', details };
    }

    const crpIsHigh = crp >= 20;

    if (crpIsHigh) {
      details.push(`CRP ≥ 20 mg/L`);
      details.push("Elevated inflammatory markers increase risk for Invasive Bacterial Infection (IBI).");
      return { level: 'moderate', details };
    }

    details.push("Well-appearing with normal urinalysis and low inflammatory markers.");
    return { level: 'mild', details }; // Low risk
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Ill-Appearing Infant Management",
          recommendations: [
            "This is a medical emergency. Initiate resuscitation (ABCs) as needed.",
            "Perform a full sepsis evaluation: Blood culture, Urinalysis & Culture, and Lumbar Puncture for CSF studies.",
            "Administer parenteral antibiotics immediately after cultures are obtained.",
            "Admit to hospital, likely to a higher level of care (PICU/NICU)."
          ]
        }];
      case 'moderate': // High-risk, well-appearing
        return [{
          title: "High-Risk Febrile Infant Management",
          recommendations: [
            "Obtain blood culture and perform a lumbar puncture for CSF analysis and culture.",
            "Admit to the hospital for parenteral antibiotics and observation pending culture results.",
            "If urinalysis was positive, treat for UTI."
          ]
        }];
      case 'mild': // Low-risk, well-appearing
        return [{
          title: "Low-Risk Febrile Infant Management",
          recommendations: [
            "Ensure urinalysis and blood culture have been obtained.",
            "Engage in shared decision-making with the family regarding disposition.",
            "Option A: Admit for observation without antibiotics pending initial culture results (e.g., for 24-36 hours).",
            "Option B: Discharge home with close follow-up within 12-24 hours. This is only appropriate for highly reliable families with ready access to care."
          ]
        }];
      default:
        return [{ title: 'Awaiting Assessment', recommendations: ['Complete all assessment questions to determine risk and management.'] }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admission to hospital is required for parenteral antibiotics and further monitoring."];
    }
    if (severity.level === 'mild') {
      return ["Disposition requires shared decision-making with the family.", "Admission for observation or discharge with follow-up in 12-24 hours are both valid options depending on the clinical and social situation."];
    }
    return ["Complete assessment to determine disposition."];
  },
  getRedFlags: () => [
    "Ill-appearance: lethargy, poor perfusion, inconsolable crying, hypotonia.",
    "Bulging fontanelle, focal neurologic signs, or seizures.",
    "Petechial or purpuric rash.",
    "Hypothermia (<36°C / 96.8°F).",
    "Significant parental concern or inability to provide close follow-up."
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV)", dose: "50 mg/kg/dose every 24 hours.", notes: "Common choice for well-appearing infants 29-60 days old." },
    { drugName: "Cefotaxime (IV)", dose: "50 mg/kg/dose every 6-8 hours.", notes: "Alternative to ceftriaxone." },
    { drugName: "Ampicillin (IV)", dose: "50-100 mg/kg/dose every 6 hours.", notes: "Consider adding for Listeria coverage, especially in younger infants in this range or if meningitis is suspected." },
    { drugName: "Vancomycin (IV)", dose: "15 mg/kg/dose every 6-8 hours.", notes: "Consider adding if MRSA is a concern or if infant is critically ill." }
  ],
  getReferences: () => [
      { title: "AAP Clinical Practice Guideline: Evaluation and Management of Well-Appearing Febrile Infants 8-60 Days Old (2021)", url: "https://publications.aap.org/pediatrics/article/148/2/e2021052228/180785/Evaluation-and-Management-of-Well-Appearing" }
  ],
};
