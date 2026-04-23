import type { DiseaseProtocol, FormData, Severity } from './types';

export const suspectedHeartFailureProtocol: DiseaseProtocol = {
  id: 'suspected-heart-failure',
  name: 'Suspected Heart Failure',
  system: 'Cardiology',
  description: 'Evaluation of a child with signs and symptoms concerning for heart failure (pump dysfunction).',
  image: {
    url: "https://picsum.photos/seed/heart-failure/600/400",
    hint: "congested lungs"
  },
  questions: [
    { id: 'respDistress', questionText: 'Is there respiratory distress?', type: 'boolean', info: 'Tachypnea, retractions, grunting.' },
    { id: 'feedingHistory', questionText: 'Is there a history of poor feeding, sweating with feeds, or poor weight gain (in an infant)?', type: 'boolean' },
    { id: 'exerciseIntolerance', questionText: 'Is there exercise intolerance or easy fatigability (in an older child)?', type: 'boolean' },
    { id: 'edema', questionText: 'Is there peripheral or periorbital edema?', type: 'boolean' },
    { id: 'examRales', questionText: 'Are rales (crackles) heard on lung auscultation?', type: 'boolean' },
    { id: 'examGallop', questionText: 'Is there a gallop rhythm (S3 or S4)?', type: 'boolean' },
    { id: 'examHepatomegaly', questionText: 'Is hepatomegaly present on exam?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    // Decompensated HF (Cardiogenic Shock)
    if (data.respDistress) {
      details.push("Respiratory distress is a sign of decompensated heart failure.");
      return { level: 'severe', details };
    }

    const signsOfCongestion = data.edema || data.examRales || data.examHepatomegaly;
    const signsOfLowOutput = data.feedingHistory || data.exerciseIntolerance;

    if (signsOfCongestion || signsOfLowOutput) {
      if (signsOfCongestion) details.push("Signs of systemic/pulmonary congestion present.");
      if (signsOfLowOutput) details.push("Signs of poor cardiac output present.");
      details.push("Findings consistent with compensated heart failure.");
      return { level: 'moderate', details };
    }

    return { level: 'unknown', details: ["Assess for key signs and symptoms to determine likelihood of heart failure."] };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Management of Decompensated Heart Failure / Cardiogenic Shock",
          recommendations: [
            "This is a medical emergency. Treat as Cardiogenic Shock.",
            "Provide respiratory support (oxygen, non-invasive or invasive ventilation).",
            "Be cautious with IV fluids. Small boluses (5-10 mL/kg) only if clear evidence of hypovolemia.",
            "Start inotropic support (e.g., Milrinone, Dobutamine, or Epinephrine) early.",
            "Administer diuretics (e.g., Furosemide) to relieve congestion.",
            "Obtain urgent Cardiology and PICU consultation.",
            "See 'Cardiogenic Shock' protocol for more detail."
          ]
        }];
      default: // moderate or unknown
        return [{
          title: "Evaluation of Suspected Heart Failure",
          recommendations: [
            "Obtain a 12-lead EKG and Chest X-ray (to look for cardiomegaly and pulmonary edema).",
            "Obtain IV access and send labs, including BNP or pro-BNP, Troponin, CBC, and CMP.",
            "An echocardiogram is the key diagnostic test and should be obtained.",
            "Consult Pediatric Cardiology.",
            "Initial management may include gentle diuresis if congested."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    return ["All children with a new diagnosis of heart failure or a decompensated chronic condition require hospital admission.", "Patients with severe respiratory distress or requiring inotropic support must be admitted to the PICU."];
  },
  getRedFlags: () => [
    "Respiratory distress, especially with rales.",
    "Signs of shock (poor perfusion, weak pulses, hypotension).",
    "Hepatomegaly.",
    "A gallop rhythm (S3).",
    "Failure to thrive in an infant with a murmur or tachypnea."
  ],
  getDrugDoses: () => [
    { drugName: "Furosemide (IV)", dose: "1-2 mg/kg per dose", notes: "For diuresis." },
    { drugName: "Milrinone Infusion", dose: "Load 50 mcg/kg over 10 min, then 0.25-0.75 mcg/kg/min infusion.", notes: "Inotrope and afterload reducer. Can cause hypotension." },
    { drugName: "Dobutamine Infusion", dose: "Start 2-5 mcg/kg/min, titrate to effect.", notes: "Inotrope." }
  ],
  getReferences: () => [{ title: "UpToDate: Heart failure in children: Etiology, clinical manifestations, and diagnosis", url: "https://www.uptodate.com/contents/heart-failure-in-children-etiology-clinical-manifestations-and-diagnosis" }],
};
