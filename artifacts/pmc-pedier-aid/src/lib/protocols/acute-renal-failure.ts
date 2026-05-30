import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const acuteRenalFailureProtocol: DiseaseProtocol = {
  id: 'acute-renal-failure',
  name: 'Acute Kidney Injury',
  system: 'Nephrology',
  description: 'Evaluation and initial management of Acute Kidney Injury (AKI) in children, defined by a rise in creatinine or a decrease in urine output.',
  image: {
    url: "https://picsum.photos/seed/aki/600/400",
    hint: "kidney"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'urineOutput', questionText: 'Urine Output', type: 'select', options: [
        { label: 'Normal (>1 mL/kg/hr)', value: 'normal' },
        { label: 'Oliguria (<1 mL/kg/hr)', value: 'oliguria' },
        { label: 'Anuria (no urine)', value: 'anuria' },
    ]},
    { id: 'creatinineRise', questionText: 'Rise in serum creatinine from baseline?', type: 'boolean', info: 'e.g., >0.3 mg/dL increase or >50% increase.' },
    { id: 'dangerComplication', questionText: 'Any dangerous complication?', type: 'boolean', info: 'Hyperkalemia/ECG change, pulmonary edema, severe acidosis, uremic encephalopathy/seizure, or severe hypertension.' },
    { id: 'volumeStatus', questionText: 'Patient\'s volume status on exam?', type: 'select', options: [
        { label: 'Hypovolemic (dehydrated)', value: 'hypovolemic' },
        { label: 'Euvolemic', value: 'euvolemic' },
        { label: 'Hypervolemic (edema, rales)', value: 'hypervolemic' },
    ]},
     { id: 'history', questionText: 'History suggestive of cause?', type: 'select', options: [
        { label: 'Dehydration/Sepsis (pre-renal)', value: 'prerenal' },
        { label: 'Nephrotoxic drug exposure', value: 'drug' },
        { label: 'Recent strep infection/hematuria (intrinsic/glomerular)', value: 'glomerular' },
        { label: 'Urinary obstruction (post-renal)', value: 'postrenal' }
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.dangerComplication) {
      details.push("Life-threatening AKI complication is present.");
      return { level: 'severe', details };
    }
    if (data.urineOutput === 'anuria') {
      details.push("Anuria is a sign of severe AKI.");
      return { level: 'severe', details };
    }
    if (data.volumeStatus === 'hypervolemic' && data.urineOutput === 'oliguria') {
      details.push("Oliguria with fluid overload requires urgent management.");
      return { level: 'severe', details };
    }
    if (data.urineOutput === 'oliguria' || data.creatinineRise) {
      details.push("Oliguria or creatinine rise indicates significant kidney injury.");
      return { level: 'moderate', details };
    }
    return { level: 'mild', details: ["Non-oliguric AKI, but still requires careful management."] };
  },
  getManagement: (severity, data) => {
    const management = [{
        title: "Initial Stabilization and Workup",
        recommendations: [
            "Move unstable patients to monitored/resuscitation area.",
            "Secure IV access and place urinary catheter if accurate urine output is needed.",
            "Obtain labs: CBC, urea/creatinine, Na/K/Cl/HCO3, Ca/Mg/Phos, glucose, venous/arterial blood gas, urinalysis and microscopy.",
            "Obtain ECG immediately if hyperkalemia is possible.",
            "Identify and treat life-threatening complications immediately.",
            "Stop all nephrotoxic medications (e.g., NSAIDs, ACE inhibitors, aminoglycosides).",
            "Consult Pediatric Nephrology urgently."
        ]
    }];

    switch(data.volumeStatus) {
        case 'hypovolemic':
            management.push({title: 'Fluid Management for Pre-renal AKI', recommendations: ["Give isotonic crystalloid 10-20 mL/kg, then reassess perfusion, lung exam, and urine output. Avoid repeated blind boluses."]});
            break;
        case 'hypervolemic':
            management.push({title: 'Fluid Management for Hypervolemic AKI', recommendations: ["Restrict fluids/sodium, provide respiratory support if pulmonary edema, give loop diuretic if not anuric, and prepare for dialysis if refractory."]});
            break;
        default:
            management.push({title: 'Fluid Management for Euvolemic AKI', recommendations: ["Restrict fluids to match insensible losses plus urine output."]});
            break;
    }
    
     management.push({
        title: "Management of Complications",
        recommendations: [
            "Hyperkalemia/ECG changes: Give calcium gluconate immediately and follow the Hyperkalemia protocol.",
            "Metabolic Acidosis: Consider sodium bicarbonate if severe (pH < 7.15).",
            "Hypertension: Treat with vasodilators (e.g., Nicardipine).",
            "Pulmonary Edema: Treat with diuretics and respiratory support (NIPPV or intubation)."
        ]
    });

    return management;
  },
  getDisposition: (severity, data) => {
    return ["Admit all children with confirmed AKI for serial creatinine/electrolytes, urine output monitoring, and cause-directed management.", "PICU/nephrology urgent pathway if anuria, pulmonary edema, hyperkalemia/ECG changes, severe acidosis, encephalopathy/seizures, severe hypertension, or possible dialysis need."];
  },
  getRedFlags: () => [
    "Anuria (no urine output)",
    "Hyperkalemia with EKG changes",
    "Uremic encephalopathy or seizures",
    "Pulmonary edema / severe fluid overload",
    "Severe hypertension"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    return [
      { drugName: "Isotonic Fluid Bolus", dose: weight > 0 ? `${(10 * weight).toFixed(0)}-${(20 * weight).toFixed(0)} mL IV` : "10-20 mL/kg IV", notes: "Only if hypovolemic; reassess after each bolus." },
      { drugName: "Furosemide IV", dose: weight > 0 ? `${(1 * weight).toFixed(0)}-${(2 * weight).toFixed(0)} mg IV` : "1-2 mg/kg IV", notes: "For fluid overload if not anuric." },
      { drugName: "Calcium Gluconate 10%", dose: weight > 0 ? `${(0.5 * weight).toFixed(1)}-${Math.min(1 * weight, 20).toFixed(1)} mL IV over 5-10 min` : "0.5-1 mL/kg IV over 5-10 min, max 20 mL", notes: "For hyperkalemia with ECG changes; cardiac monitoring." },
      { drugName: "Sodium Bicarbonate", dose: weight > 0 ? `${(1 * weight).toFixed(0)}-${(2 * weight).toFixed(0)} mEq IV` : "1-2 mEq/kg IV", notes: "For severe metabolic acidosis with senior/nephrology guidance." },
    ];
  },
  getReferences: () => [{ title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury", url: "https://kdigo.org/guidelines/acute-kidney-injury/" }],
};
