import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const urinaryTractInfectionProtocol: DiseaseProtocol = {
  id: 'urinary-tract-infection',
  name: 'Urinary Tract Infection (UTI)',
  system: 'Nephrology',
  description: 'Diagnosis and management of urinary tract infections in children, distinguishing between cystitis (lower tract) and pyelonephritis (upper tract).',
  image: {
    url: "https://picsum.photos/seed/uti/600/400",
    hint: "urine sample"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
    { id: 'hasFever', questionText: 'Is there a fever?', type: 'boolean' },
    { id: 'isToxic', questionText: 'Is the child ill-appearing, vomiting, or dehydrated?', type: 'boolean' },
    { id: 'localizingSymptoms', questionText: 'Are there localizing urinary symptoms?', type: 'boolean', info: 'Dysuria, frequency, urgency, new incontinence in a toilet-trained child.' },
    { id: 'urinalysis', questionText: 'Urinalysis result?', type: 'select', options: [
        { label: 'Negative', value: 'negative'},
        { label: 'Positive for Leukocyte Esterase or Nitrites', value: 'positive'},
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (data.isToxic) {
      details.push("Ill-appearing, vomiting, or dehydrated. Likely urosepsis. Requires admission and IV antibiotics.");
      return { level: 'severe', details };
    }
    
    if (data.hasFever && data.urinalysis === 'positive') {
      details.push("Fever with a positive UA is presumed to be pyelonephritis (upper tract infection).");
      if (Number(data.ageMonths) < 2) {
        details.push("Age < 2 months is high-risk and requires admission.");
        return { level: 'severe', details };
      }
      return { level: 'moderate', details };
    }
    
    if (!data.hasFever && data.localizingSymptoms && data.urinalysis === 'positive') {
      details.push("Symptoms and UA suggest cystitis (lower tract infection).");
      return { level: 'mild', details };
    }

    return { level: 'unknown', details: ["Assess symptoms and urinalysis to determine infection type."] };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Management of Complicated UTI / Urosepsis",
          recommendations: [
            "Admit to hospital immediately. Consider PICU if in shock.",
            "Obtain IV access, provide fluid resuscitation if needed.",
            "Obtain urine culture (catheterized sample preferred in non-toilet-trained children) and blood culture.",
            "Start broad-spectrum IV antibiotics immediately (e.g., Ceftriaxone or Gentamicin).",
            "Obtain a renal and bladder ultrasound."
          ]
        }];
      case 'moderate':
        return [{
          title: "Management of Pyelonephritis (Well-Appearing Child > 2 mo)",
          recommendations: [
            "Obtain urine culture.",
            "Decision for admission vs. outpatient management depends on ability to tolerate oral medication.",
            "Outpatient Option: Administer a first dose of parenteral antibiotics (e.g., IM/IV Ceftriaxone), then start oral antibiotics (e.g., a third-generation cephalosporin like Cefixime).",
            "Inpatient Option: Admit for IV antibiotics (e.g., Ceftriaxone) if unable to tolerate oral medication.",
            "Ensure close follow-up within 24-48 hours."
          ]
        }];
      case 'mild':
        return [{
          title: "Management of Cystitis",
          recommendations: [
            "Obtain urine culture.",
            "Start oral antibiotics. A first or third-generation cephalosporin (e.g., Cephalexin, Cefixime) is a good empiric choice.",
            "Follow up on urine culture and adjust antibiotics based on sensitivities.",
            "Encourage fluid intake."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || (severity.level === 'moderate' && Number(data.ageMonths) < 2)) {
      return ["Admission to hospital for IV antibiotics is required."];
    }
    if (severity.level === 'moderate') {
      return ["Consider admission if patient is dehydrated, vomiting, or unable to reliably take oral antibiotics. Otherwise, outpatient management with an initial parenteral dose and close follow-up is an option."];
    }
    return ["Outpatient management with oral antibiotics is appropriate."];
  },
  getRedFlags: () => [
    "Age < 2 months with fever and UTI",
    "Toxic or septic appearance",
    "Inability to tolerate oral fluids or medications",
    "Known underlying urologic abnormality",
    "Failure to improve within 48 hours of starting antibiotics"
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV/IM)", dose: "50-75 mg/kg once daily (max 2g)", notes: "For pyelonephritis or sepsis." },
    { drugName: "Cefixime (oral)", dose: "8 mg/kg once daily", notes: "Good oral option for pyelonephritis step-down." },
    { drugName: "Cephalexin (oral)", dose: "25-50 mg/kg/day divided BID-QID", notes: "Good option for cystitis." },
    { drugName: "Gentamicin (IV)", dose: "Dose based on renal function. Consult pharmacy.", notes: "Often used in combination with Ampicillin for infants <2 months." }
  ],
  getReferences: () => [{ title: "AAP: Clinical Practice Guideline for the Diagnosis and Management of the Initial UTI in Febrile Infants and Children Aged 2 to 24 Months", url: "https://publications.aap.org/pediatrics/article/128/3/595/77017/Clinical-Practice-Guideline-for-the-Diagnosis-and" }],
};
