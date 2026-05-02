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
    { id: 'isNewDiagnosis', questionText: 'Is this a first presentation or a relapse?', type: 'select', options: [{label: 'New Diagnosis', value: 'new'}, {label: 'Relapse', value: 'relapse'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.urineDipstick !== 'high') {
      return { level: 'unknown', details: ["Massive proteinuria (3+ to 4+) is required for diagnosis."] };
    }
    
    if (data.hasRespDistress) {
      details.push("Respiratory distress from anasarca.");
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
                "Admit to the hospital for diagnosis and initiation of therapy.",
                "Consult Pediatric Nephrology.",
                "Initiate high-dose daily corticosteroids (Prednisone).",
                "Provide education to the family about the disease, diet (low salt), and monitoring (daily urine protein).",
            ]
        });
    } else {
         management.push({
            title: "Management of Relapse",
            recommendations: [
                "Restart or increase dose of daily corticosteroids as per the patient's specific regimen.",
                "Mild relapses can often be managed as an outpatient in consultation with the patient's nephrologist."
            ]
        });
    }

    management.push({
        title: "Management of Complications",
        recommendations: [
            "Severe Edema/Anasarca: For intravascularly deplete patients (tachycardia, poor perfusion), consider IV Albumin 25% followed by IV Furosemide.",
            "Spontaneous Bacterial Peritonitis (SBP): If fever/abdominal pain, perform a diagnostic paracentesis and start broad-spectrum IV antibiotics (e.g., a third-generation cephalosporin).",
            "Thrombosis: Patients are hypercoagulable. Maintain a high index of suspicion for DVT/PE."
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
  getDrugDoses: () => [
    { drugName: "Prednisone (for new diagnosis/relapse)", dose: "2 mg/kg/day (max 60 mg/day)", notes: "Consult nephrology for duration and taper schedule." },
    { drugName: "Albumin 25%", dose: "0.5 - 1 g/kg IV over 2-4 hours", notes: "For intravascularly deplete patients with severe edema. Must be followed by a diuretic." },
    { drugName: "Furosemide", dose: "1-2 mg/kg IV", notes: "Give after albumin infusion to promote diuresis." },
  ],
  getReferences: () => [{ title: "KDIGO Clinical Practice Guideline for Glomerular Diseases", url: "https://kdigo.org/guidelines/glomerular-diseases/" }],
};
