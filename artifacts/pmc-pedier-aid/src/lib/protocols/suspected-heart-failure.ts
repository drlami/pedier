import type { DiseaseProtocol, FormData, Severity } from './types';

export const suspectedHeartFailureProtocol: DiseaseProtocol = {
  id: 'suspected-heart-failure',
  name: 'Suspected Heart Failure',
  system: 'Cardiovascular System',
  description: 'Evaluation of a child with signs and symptoms concerning for heart failure (pump dysfunction).',
  image: {
    url: "https://picsum.photos/seed/heart-failure/600/400",
    hint: "congested lungs"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'poorPerfusion', questionText: 'Poor perfusion, hypotension, or altered mental status?', type: 'boolean' },
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
    if (data.respDistress || data.poorPerfusion) {
      if (data.respDistress) details.push("Respiratory distress is a sign of decompensated heart failure.");
      if (data.poorPerfusion) details.push("Poor perfusion, hypotension, or altered mental status suggests cardiogenic shock.");
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
            "Move to monitored/resuscitation area. Treat as cardiogenic shock.",
            "Provide immediate respiratory support (oxygen, non-invasive ventilation or intubation).",
            "BE JUDICIOUS WITH IV FLUIDS. Avoid large boluses; give 5-10 mL/kg only if clear hypovolemia exists.",
            "Establish multi-disciplinary care: Page Pediatric Cardiology and PICU immediately.",
            "Prioritize early vasoactive/inotropic support if poor perfusion persists.",
            "Administer IV Furosemide only if pulmonary/systemic congestion is present and BP is adequate.",
            "Continuous invasive/non-invasive blood pressure monitoring."
          ]
        }];
      default: // moderate or unknown
        return [{
          title: "Evaluation of Suspected Heart Failure",
          recommendations: [
            "IMMEDIATE Cardiology Consultation: All new-onset cases require urgent specialist review.",
            "12-Lead EKG: Evaluate for hypertrophy, ST changes, or arrhythmias.",
            "Chest X-ray: Assess for cardiomegaly (CTR > 50-60%) and pulmonary venous congestion.",
            "Laboratory Workup: Troponin, CMP (liver/renal function), and CBC.",
            "Echocardiogram: The definitive diagnostic tool. Obtain an urgent bedside echo to assess ventricular function and rule out structural defects.",
            "Maintain Bed Rest: Minimize myocardial oxygen demand.",
            "Gentle Diuresis: Initiate IV Furosemide if systemic/pulmonary congestion is noted."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    return [
      "Absolute Admission (New Onset): All children with a new diagnosis of heart failure MUST be admitted for stabilization and workup.",
      "PICU Admission: Required for patients with respiratory distress, poor perfusion, or those requiring vasoactive infusions.",
      "Safe Discharge Criteria (PROTECTED): Discharge is only considered for KNOWN chronic patients if ALL the following are met:",
      "1. Return to baseline clinical status (normal RR, no rales, normal feeding).",
      "2. Stable weight (no evidence of acute fluid gain).",
      "3. Tolerating all oral medications and feedings.",
      "4. Normal electrolytes and stable renal function.",
      "5. DIRECT clearance from the Pediatric Cardiology team.",
      "6. Guaranteed reliable follow-up with Cardiology within 24-48 hours."
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
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const furosemide = Math.min(weight, 40);
    const spironolactone = weight;

    return [
      { drugName: "Furosemide IV", dose: weight > 0 ? `${furosemide.toFixed(0)} mg IV` : "1 mg/kg IV, max 40 mg initially", notes: "For congestion if BP is adequate." },
      { drugName: "Milrinone Infusion", dose: "0.25-0.75 mcg/kg/min", notes: "Avoid loading dose in ED if hypotensive." },
      { drugName: "Dobutamine Infusion", dose: "2-10 mcg/kg/min", notes: "Titrate with PICU/Cardiology." },
      { drugName: "Spironolactone PO", dose: weight > 0 ? `${spironolactone.toFixed(0)} mg/day PO` : "1 mg/kg/day PO", notes: "Long-term/add-on therapy by Cardiology." }
    ];
  },
  getReferences: () => [
    { title: "ISHLT: Guidelines for the management of pediatric heart failure", url: "https://ishlt.org/" },
    { title: "UpToDate: Heart failure in children: Management", url: "https://www.uptodate.com/contents/heart-failure-in-children-management" }
  ],
};
