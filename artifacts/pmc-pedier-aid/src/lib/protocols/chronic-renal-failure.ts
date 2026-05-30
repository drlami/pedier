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
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
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
            "Move to monitored/resuscitation area if respiratory distress is present.",
            "Provide respiratory support: oxygen, non-invasive positive pressure ventilation (BiPAP), or intubation.",
            "Administer high-dose IV loop diuretics (e.g., Furosemide), if the patient is not anuric.",
            "Urgent consultation with Pediatric Nephrology for emergent dialysis is required if diuretics are ineffective or patient is anuric."
          ]
        }];
      case 'htn':
        return [{
          title: "Management of Hypertensive Emergency",
          recommendations: [
            "Goal is controlled BP reduction; avoid rapid overcorrection. Typical target is no more than ~25% reduction in the first 8 hours.",
            "Administer IV antihypertensives such as Labetalol or Nicardipine infusion.",
            "Admit to PICU for continuous BP monitoring.",
            "Consult Nephrology urgently."
          ]
        }];
      case 'hyperk':
        return [{
          title: "Management of Severe Hyperkalemia",
          recommendations: [
            "This is a medical emergency. Place on monitor and obtain immediate ECG.",
            "Stabilize myocardium with IV Calcium Gluconate if ECG changes, shift potassium with insulin/dextrose and albuterol, and prepare for emergent dialysis to remove potassium."
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
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    return [
      { drugName: "Furosemide IV", dose: weight > 0 ? `${(1 * weight).toFixed(0)}-${(2 * weight).toFixed(0)} mg IV` : "1-2 mg/kg IV", notes: "For fluid overload if not anuric; higher doses may be needed in CKD with nephrology guidance." },
      { drugName: "Labetalol IV Bolus", dose: weight > 0 ? `${Math.min(0.2 * weight, 20).toFixed(1)}-${Math.min(1 * weight, 20).toFixed(1)} mg IV` : "0.2-1 mg/kg IV, max 20 mg", notes: "For hypertensive emergency; monitor BP/HR." },
      { drugName: "Nicardipine Infusion", dose: "Start 0.5-1 mcg/kg/min IV", notes: "Titrate in PICU/monitored setting for hypertensive emergency." },
    ];
  },
  getReferences: () => [{ title: "KDOQI Clinical Practice Guidelines for CKD", url: "https://www.kidney.org/professionals/guidelines/guidelines_commentaries" }],
};
