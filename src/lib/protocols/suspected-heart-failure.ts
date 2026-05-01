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
      if (signsOfCongestion) details.push("Signs of systemic/pulmonary congestion present (Hepatomegaly/Edema/Rales).");
      if (signsOfLowOutput) details.push("Signs of poor cardiac output present (Feeding issues/Fatigue).");
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
            "Provide immediate respiratory support (oxygen, non-invasive ventilation or intubation).",
            "BE JUDICIOUS WITH IV FLUIDS. Avoid large boluses; give 5-10 mL/kg only if clear hypovolemia exists.",
            "Prioritize early Inotropic support: Start Milrinone or Dobutamine infusion early to improve contractility.",
            "Administer IV Furosemide to relieve pulmonary and systemic congestion.",
            "Establish multi-disciplinary care: Page Pediatric Cardiology and PICU immediately.",
            "Continuous invasive/non-invasive blood pressure monitoring."
          ]
        }];
      default: // moderate or unknown
        return [{
          title: "Evaluation of Suspected Heart Failure",
          recommendations: [
            "12-Lead EKG: Evaluate for hypertrophy, ST changes, or arrhythmias.",
            "Chest X-ray: Assess for cardiomegaly (CTR > 50-60%) and pulmonary venous congestion.",
            "Laboratory Workup: Send NT-proBNP or BNP (high sensitivity/specificity for HF), Troponin, CMP (liver/renal function), and CBC.",
            "Echocardiogram: The gold standard. Obtain an urgent bedside echo to assess ventricular function and rule out structural defects.",
            "Maintain Bed Rest: Minimize myocardial oxygen demand.",
            "Gentle Diuresis: Initiate IV Furosemide if systemic/pulmonary congestion is noted.",
            "Consult Pediatric Cardiology for all suspected new-onset cases."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    return [
      "New Diagnosis: All children with a new diagnosis of heart failure require hospital admission for stabilization and workup.",
      "Acuity: Patients with respiratory distress, poor perfusion, or requiring vasoactive infusions (Inotropes) must be admitted to the PICU.",
      "Compensated: Stable patients with chronic HF and minor decompensation may occasionally be managed on a monitored floor in consultation with Cardiology."
    ];
  },
  getRedFlags: () => [
    "Severe respiratory distress with rales (pulmonary edema).",
    "Signs of cardiogenic shock (cool extremities, delayed cap refill, hypotension).",
    "Significant hepatomegaly (indicating right-sided congestion).",
    "A loud S3 gallop rhythm.",
    "Failure to thrive/poor weight gain in infants.",
    "Abrupt onset of symptoms following a viral illness (suspect Myocarditis)."
  ],
  getDrugDoses: () => [
    { drugName: "Furosemide (Lasix)", dose: "1 mg/kg IV (Max 40-80 mg initial dose)", notes: "First-line to reduce preload/congestion." },
    { drugName: "Milrinone Infusion", dose: "0.25 - 0.75 mcg/kg/min", notes: "Inotrope and afterload reducer. Loading dose (50mcg/kg) is often omitted in the ED to avoid hypotension." },
    { drugName: "Dobutamine Infusion", dose: "2 - 10 mcg/kg/min", notes: "Pure inotrope. Titrate to effect." },
    { drugName: "Spironolactone", dose: "1 - 2 mg/kg/day PO", notes: "Aldosterone antagonist, often added by Cardiology for long-term management." }
  ],
  getReferences: () => [
    { title: "ISHLT: Guidelines for the management of pediatric heart failure", url: "https://ishlt.org/" },
    { title: "UpToDate: Heart failure in children: Management", url: "https://www.uptodate.com/contents/heart-failure-in-children-management" }
  ],
};
