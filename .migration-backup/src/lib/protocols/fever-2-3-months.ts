import type { DiseaseProtocol, FormData, Severity } from './types';

export const fever2To3MonthsProtocol: DiseaseProtocol = {
  id: 'fever-2-3-months',
  name: 'Fever Without Source (61-90 days)',
  system: 'Fever & Infectious Diseases',
  description: 'Evaluation and management of well-appearing febrile infants aged 61 to 90 days.',
  image: {
    url: "https://picsum.photos/seed/fever-2-3-months/600/400",
    imageHint: "baby temperature"
  },
  questions: [
    { id: 'isWellAppearing', questionText: 'Is the infant well-appearing and previously healthy?', type: 'boolean', info: 'Well-appearing means active, alert, good tone, normal color.' },
    { id: 'urinalysis', questionText: 'Urinalysis result?', type: 'select', options: [{label: 'Negative', value: 'negative'}, {label: 'Positive (LE, Nitrite, or Pyuria)', value: 'positive'}] },
    { id: 'crp', questionText: 'C-Reactive Protein (CRP)', type: 'number', unit: 'mg/L', info: 'Value in mg/L. 1 mg/dL = 10 mg/L.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (!data.isWellAppearing) {
      details.push("Infant is ill-appearing.");
      return { level: 'severe', details };
    }

    if (data.urinalysis === 'positive') {
        details.push("Positive urinalysis suggests a Urinary Tract Infection (UTI).");
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
          title: "Febrile Infant with Risk Factors Management",
          recommendations: [
            "If UA is positive, treat for UTI. Admission vs. outpatient management with a dose of parenteral antibiotics and close follow-up can be considered.",
            "If inflammatory markers are elevated, consider obtaining blood culture and performing a lumbar puncture.",
            "Admission for parenteral antibiotics and observation is the safest approach.",
            "Engage in shared decision-making with family about risks/benefits of admission vs. close outpatient management."
          ]
        }];
      case 'mild': // Low-risk, well-appearing
        return [{
          title: "Low-Risk Febrile Infant Management",
          recommendations: [
            "Ensure urinalysis has been obtained and is negative.",
            "Blood culture and inflammatory markers are recommended but may be deferred after shared decision making.",
            "No routine lumbar puncture or antibiotics are needed.",
            "Discharge home with close follow-up arranged within 24 hours.",
            "Provide strict return precautions."
          ]
        }];
      default:
        return [{ title: 'Awaiting Assessment', recommendations: ['Complete all assessment questions to determine risk and management.'] }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Admission to hospital is required for parenteral antibiotics and further monitoring."];
    }
    if (severity.level === 'moderate') {
      return ["Admission is the safest option. Well-appearing infants with isolated positive UA may be candidates for outpatient management with parenteral antibiotics and 24-hr follow up."];
    }
    if (severity.level === 'mild') {
      return ["Discharge home is appropriate with follow-up arranged in 24 hours and clear return precautions."];
    }
    return ["Complete assessment to determine disposition."];
  },
  getRedFlags: () => [
    "Ill-appearance: lethargy, poor perfusion, inconsolable crying, hypotonia.",
    "Bulging fontanelle, focal neurologic signs, or seizures.",
    "Petechial or purpuric rash.",
    "Inability to tolerate oral fluids.",
    "Significant parental concern or inability to provide close follow-up."
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV/IM)", dose: "50 mg/kg/dose every 24 hours.", notes: "Common choice for both inpatient and outpatient parenteral therapy." },
    { drugName: "Cefotaxime (IV)", dose: "50 mg/kg/dose every 8 hours.", notes: "Alternative to ceftriaxone." },
    { drugName: "Cephalexin (oral)", dose: "25-50 mg/kg/day divided TID-QID", notes: "For step-down oral therapy for UTI." }
  ],
  getReferences: () => [
      { title: "UpToDate: The febrile infant (29 to 90 days of age): Outpatient evaluation", url: "https://www.uptodate.com/contents/the-febrile-infant-29-to-90-days-of-age-outpatient-evaluation" }
  ],
};
