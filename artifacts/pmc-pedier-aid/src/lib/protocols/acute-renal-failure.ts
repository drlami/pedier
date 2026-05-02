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
    if (data.anuria) details.push("Anuria");

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
            "Manage ABCs. Secure IV access and place a Foley catheter to accurately monitor urine output.",
            "Obtain labs: CBC, comprehensive metabolic panel (incl. K+, Ca++, Phos), blood gas, and urinalysis.",
            "Identify and treat life-threatening complications immediately (see below).",
            "Stop all nephrotoxic medications (e.g., NSAIDs, ACE inhibitors, aminoglycosides).",
            "Consult Pediatric Nephrology urgently."
        ]
    }];

    switch(data.volumeStatus) {
        case 'hypovolemic':
            management.push({title: 'Fluid Management for Pre-renal AKI', recommendations: ["Provide a judicious isotonic fluid bolus (10-20 mL/kg) and reassess. The goal is to restore renal perfusion without causing fluid overload."]});
            break;
        case 'hypervolemic':
            management.push({title: 'Fluid Management for Hypervolemic AKI', recommendations: ["Strict fluid restriction and administration of loop diuretics (Furosemide)."]});
            break;
        default:
            management.push({title: 'Fluid Management for Euvolemic AKI', recommendations: ["Restrict fluids to match insensible losses plus urine output."]});
            break;
    }
    
     management.push({
        title: "Management of Complications",
        recommendations: [
            "Hyperkalemia: See specific protocol. Requires emergent treatment with calcium gluconate, insulin/glucose, and albuterol.",
            "Metabolic Acidosis: Consider sodium bicarbonate if severe (pH < 7.15).",
            "Hypertension: Treat with vasodilators (e.g., Nicardipine).",
            "Pulmonary Edema: Treat with diuretics and respiratory support (NIPPV or intubation)."
        ]
    });

    return management;
  },
  getDisposition: (severity, data) => {
    return ["All patients with AKI require hospital admission for management and monitoring.", "Severe AKI with anuria, life-threatening electrolyte abnormalities, or severe fluid overload requires PICU admission and potential for dialysis."];
  },
  getRedFlags: () => [
    "Anuria (no urine output)",
    "Hyperkalemia with EKG changes",
    "Uremic encephalopathy or seizures",
    "Pulmonary edema / severe fluid overload",
    "Severe hypertension"
  ],
  getDrugDoses: () => [
    { drugName: "Furosemide", dose: "1-2 mg/kg IV", notes: "For fluid overload. Ineffective in anuric patients." },
    { drugName: "Calcium Gluconate 10%", dose: "0.5-1 mL/kg IV over 5-10 min", notes: "For cardiac membrane stabilization in hyperkalemia." },
    { drugName: "Sodium Bicarbonate", dose: "1-2 mEq/kg IV", notes: "For severe metabolic acidosis." },
  ],
  getReferences: () => [{ title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury", url: "https://kdigo.org/guidelines/acute-kidney-injury/" }],
};
