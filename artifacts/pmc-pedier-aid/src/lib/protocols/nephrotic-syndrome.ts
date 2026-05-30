import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const nephroticSyndromeProtocol: DiseaseProtocol = {
  id: 'nephrotic-syndrome',
  name: 'Nephrotic Syndrome',
  system: 'Nephrology',
  description: 'Evaluation and management of nephrotic syndrome, characterized by massive proteinuria, hypoalbuminemia, and edema.',
  image: {
    url: "https://picsum.photos/seed/nephrotic/600/400",
    hint: "swollen child"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hasMarkedEdema', questionText: 'Significant edema (periorbital, genital, peripheral)?', type: 'boolean' },
    { id: 'urineDipstick', questionText: 'Urine dipstick protein level?', type: 'select', options: [
        {label: 'Negative/Trace', value: 'neg'},
        {label: '1+ or 2+', value: 'low'},
        {label: '3+ or 4+', value: 'high'},
    ]},
    { id: 'hasRespDistress', questionText: 'Respiratory distress from ascites or pleural effusions?', type: 'boolean' },
    { id: 'hasAbdominalPain', questionText: 'Fever and/or severe abdominal pain?', type: 'boolean', info: 'Concern for Spontaneous Bacterial Peritonitis (SBP).'},
    { id: 'hasPoorPerfusion', questionText: 'Poor perfusion, shock, or suspected intravascular depletion?', type: 'boolean' },
    { id: 'hasThrombosisConcern', questionText: 'Concern for thrombosis?', type: 'boolean', info: 'Unilateral limb swelling, sudden chest pain, dyspnea, neurologic deficit.' },
    { id: 'isNewDiagnosis', questionText: 'Is this a first presentation or a relapse?', type: 'select', options: [{label: 'New Diagnosis', value: 'new'}, {label: 'Relapse', value: 'relapse'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.urineDipstick !== 'high') {
      return { level: 'unknown', details: ["Massive proteinuria (3+ to 4+) is required for diagnosis."] };
    }
    
    if (data.hasRespDistress || data.hasPoorPerfusion || data.hasThrombosisConcern) {
      if (data.hasRespDistress) details.push("Respiratory distress from anasarca/effusion.");
      if (data.hasPoorPerfusion) details.push("Poor perfusion or suspected intravascular depletion.");
      if (data.hasThrombosisConcern) details.push("Possible thrombosis.");
      return { level: 'severe', details };
    }
    if (data.hasAbdominalPain) {
      details.push("Abdominal pain/fever, concerning for SBP.");
      return { level: 'severe', details };
    }

    if (data.hasMarkedEdema) {
      details.push("Significant edema present.");
      return { level: 'moderate', details };
    }
    
    return { level: 'mild', details: ["Mild relapse in a known patient."] };
  },
  getManagement: (severity, data) => {
    const management = [];
    
    if (data.isNewDiagnosis === 'new') {
         management.push({
            title: "Management of New Onset Nephrotic Syndrome",
            recommendations: [
                "Admit for diagnostic confirmation, complications screen, and treatment plan.",
                "Consult Pediatric Nephrology.",
                "Do not start steroids until infection/secondary causes are considered and nephrology plan is clear.",
                "Send urinalysis/urine protein:creatinine, serum albumin, creatinine/electrolytes, cholesterol, CBC, and consider complements if atypical features.",
                "Provide education to the family about the disease, diet (low salt), and monitoring (daily urine protein).",
            ]
        });
    } else {
         management.push({
            title: "Management of Relapse",
            recommendations: [
                "Confirm relapse with urine protein and assess for edema, infection, thrombosis, AKI, and hypertension.",
                "Restart or increase daily corticosteroids only according to known nephrology plan or after nephrology discussion.",
                "Mild relapses can often be managed as an outpatient in consultation with the patient's nephrologist."
            ]
        });
    }

    management.push({
        title: "Management of Complications",
        recommendations: [
            "Severe edema/anasarca: restrict sodium, carefully assess intravascular volume, and discuss albumin + furosemide with nephrology.",
            "Poor perfusion/shock: move to resuscitation area; avoid routine large fluid boluses; consider albumin if intravascular depletion suspected with nephrology/senior input.",
            "SBP concern: if fever/abdominal pain, obtain cultures and start IV third-generation cephalosporin promptly.",
            "Thrombosis concern: urgent imaging/specialist input; do not miss DVT/PE/cerebral venous thrombosis."
        ]
    });
    
    return management;
  },
  getDisposition: (severity, data) => {
    if (data.isNewDiagnosis === 'new' || severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admission to hospital is required for all new diagnoses and for management of complications."];
    }
    return ["Known patients with a mild, uncomplicated relapse may be managed as outpatients in close coordination with their nephrologist."];
  },
  getRedFlags: () => [
    "Anasarca with respiratory distress",
    "Fever and abdominal pain (concern for SBP)",
    "Signs of thrombosis (sudden onset chest pain, unilateral leg swelling)",
    "Severe hypertension or gross hematuria (may suggest an alternative diagnosis to minimal change disease)"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    return [
      { drugName: "Prednisone/Prednisolone", dose: weight > 0 ? `${Math.min(2 * weight, 60).toFixed(0)} mg/day PO` : "2 mg/kg/day PO, max 60 mg/day", notes: "Start only per nephrology/local steroid plan; avoid if infection not assessed." },
      { drugName: "Albumin 25%", dose: weight > 0 ? `${(0.5 * weight).toFixed(1)}-${(1 * weight).toFixed(1)} g IV over 2-4 hr` : "0.5-1 g/kg IV over 2-4 hr", notes: "For severe edema with intravascular depletion; nephrology/senior input." },
      { drugName: "Furosemide IV", dose: weight > 0 ? `${(1 * weight).toFixed(0)}-${(2 * weight).toFixed(0)} mg IV` : "1-2 mg/kg IV", notes: "Usually after albumin or for overload; monitor BP/renal function." },
      { drugName: "Ceftriaxone IV/IM", dose: weight > 0 ? `${Math.min(50 * weight, 2000).toFixed(0)} mg q24h` : "50 mg/kg q24h, max 2 g", notes: "If SBP/sepsis concern after cultures when possible." },
    ];
  },
  getReferences: () => [{ title: "KDIGO Clinical Practice Guideline for Glomerular Diseases", url: "https://kdigo.org/guidelines/glomerular-diseases/" }],
};
