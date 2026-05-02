import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const chronicRenalFailureProtocol: DiseaseProtocol = {
  id: 'chronic-renal-failure',
  name: 'Chronic Kidney Disease',
  system: 'Nephrology',
  description: 'Emergency management of acute complications in children with known Chronic Kidney Disease (CKD).',
  image: {
    url: "https://picsum.photos/seed/ckd/600/400",
    hint: "dialysis"
  },
  questions: [
    { id: 'knownCKD', questionText: 'Is there a known history of CKD or end-stage renal disease (ESRD)?', type: 'boolean' },
    { id: 'presentingComplaint', questionText: 'What is the primary acute complaint?', type: 'select', options: [
        { label: 'Fluid overload / Respiratory distress', value: 'fluid' },
        { label: 'Severe hypertension', value: 'htn' },
        { label: 'Suspected severe hyperkalemia', value: 'hyperk' },
        { label: 'Fever / Sepsis', value: 'sepsis' },
    ]},
    { id: 'hasEdemaHTN', questionText: 'Are there signs of severe fluid overload (pulmonary edema) or hypertensive emergency (headache, seizure, AMS)?', type: 'boolean' },
    { id: 'ekgChanges', questionText: 'Are there EKG changes suggestive of hyperkalemia (peaked T waves)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // In the context of CKD, any acute complication presenting to the ER is serious.
    if (data.hasEdemaHTN || data.ekgChanges) {
      return { level: 'severe', details: ["Life-threatening complication of CKD present (e.g., hypertensive emergency, pulmonary edema, severe hyperkalemia)."] };
    }
    if (data.presentingComplaint) {
      return { level: 'moderate', details: ["Significant acute complication of CKD requiring urgent management."] };
    }
    return { level: 'unknown', details: ["Assess for acute complications of CKD."] };
  },
  getManagement: (severity, data) => {
    switch (data.presentingComplaint) {
      case 'fluid':
        return [{
          title: "Management of Fluid Overload / Pulmonary Edema",
          recommendations: [
            "Provide respiratory support: High-flow oxygen, non-invasive positive pressure ventilation (BiPAP), or intubation.",
            "Administer high-dose IV loop diuretics (e.g., Furosemide), if the patient is not anuric.",
            "Urgent consultation with Pediatric Nephrology for emergent dialysis is required if diuretics are ineffective or patient is anuric."
          ]
        }];
      case 'htn':
        return [{
          title: "Management of Hypertensive Emergency",
          recommendations: [
            "Goal is to lower blood pressure in a controlled manner (reduce by ~25% in the first 8 hours).",
            "Administer IV antihypertensives such as Labetalol or Nicardipine infusion.",
            "Admit to PICU for continuous BP monitoring.",
            "Consult Nephrology urgently."
          ]
        }];
      case 'hyperk':
        return [{
          title: "Management of Severe Hyperkalemia",
          recommendations: [
            "This is a medical emergency. Please refer to the specific 'Hyperkalemia' protocol for detailed step-by-step management.",
            "Key steps: Stabilize myocardium with IV Calcium Gluconate, shift potassium with insulin/dextrose and albuterol, and prepare for emergent dialysis to remove potassium."
          ]
        }];
      case 'sepsis':
        return [{
            title: "Management of Sepsis in CKD",
            recommendations: [
                "Patients with CKD/ESRD are immunocompromised. Have a low threshold to suspect sepsis.",
                "Obtain blood cultures (including from dialysis catheters).",
                "Administer broad-spectrum antibiotics promptly. Doses must be adjusted for renal function. Consult pharmacy/nephrology.",
                "Provide fluid resuscitation judiciously, monitoring closely for signs of fluid overload."
            ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    return ["Any child with an acute, serious complication of CKD requires hospital admission.", "Patients with respiratory failure, hypertensive emergency, or requiring dialysis need PICU level care."];
  },
  getRedFlags: () => [
    "Pulmonary edema",
    "Hypertensive encephalopathy (headache, confusion, seizures)",
    "EKG changes of hyperkalemia",
    "Fever in a patient on dialysis (high risk for line infection)"
  ],
  getDrugDoses: () => [
    { drugName: "Furosemide (IV)", dose: "1-2 mg/kg per dose. Higher doses may be needed in CKD.", notes: "For fluid overload." },
    { drugName: "Labetalol (IV)", dose: "0.2-1 mg/kg bolus (max 20mg), or 0.25-3 mg/kg/hr infusion.", notes: "For hypertensive emergency." },
    { drugName: "Nicardipine (IV)", dose: "Start 0.5-1 mcg/kg/min infusion, titrate up.", notes: "For hypertensive emergency." },
  ],
  getReferences: () => [{ title: "KDOQI Clinical Practice Guidelines for CKD", url: "https://www.kidney.org/professionals/guidelines/guidelines_commentaries" }],
};
