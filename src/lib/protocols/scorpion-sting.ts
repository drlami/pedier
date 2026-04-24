import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const scorpionStingProtocol: DiseaseProtocol = {
  id: 'scorpion-sting',
  name: 'Scorpion Sting Management',
  system: 'Toxins and Poisoning',
  description: 'Management of pediatric scorpion stings, based on guidelines for species like Leiurus quinquestriatus.',
  image: {
    url: "https://picsum.photos/seed/scorpion-sting/600/400",
    hint: "scorpion"
  },
  questions: [
    { id: 'grade', questionText: 'Clinical Severity Grade', type: 'radio', options: [
        {label: 'Grade I: Local signs only (pain, erythema)', value: '1'},
        {label: 'Grade II: Systemic autonomic signs (salivation, vomiting, tachycardia)', value: '2'},
        {label: 'Grade III: Cardiotoxicity (pulmonary edema, hypotension)', value: '3'},
        {label: 'Grade IV: Life-threatening systemic failure (shock, coma, seizures)', value: '4'},
    ]},
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const grade = Number(data.grade);
    switch (grade) {
      case 1:
        return { level: 'mild', details: ["Grade I: Local envenomation only. No systemic involvement."] };
      case 2:
        return { level: 'moderate', details: ["Grade II: Autonomic storm present. Requires ACS and Prazosin."] };
      case 3:
      case 4:
        return { level: 'severe', details: [`Grade ${grade}: Life-threatening cardiotoxicity or multiorgan failure.`] };
      default:
        return { level: 'unknown', details: ["Assess clinical grade based on systemic signs."] };
    }
  },
  getManagement: (severity, data) => {
    const management = [
        {
            title: "Initial ER Management (First 10 mins)",
            recommendations: [
                "Follow ABCs: Stabilize airway, provide oxygen, and establish IV access.",
                "Intubate for excessive secretions, respiratory failure, seizures, or coma.",
                "Monitor BP, HR, perfusion, and urine output continuously."
            ]
        },
        {
            title: "Antiscorpion Serum (ACS) Indications",
            recommendations: [
                "Give ACS immediately if ANY systemic symptoms are present (Grade II, III, or IV).",
                "Examples: Hypersalivation, vomiting, agitation, tachycardia, hypertension, arrhythmia, pulmonary edema, seizures."
            ]
        },
         {
            title: "Prazosin Therapy (Cornerstone)",
            recommendations: [
                "First-line drug for autonomic storm (Grade II and above).",
                "Mechanism: Reverses catecholamine-mediated myocardial injury and dramatically reduces mortality.",
                "Dose: 30 mcg/kg/dose every 6 hours. Continue until hemodynamically stable."
            ]
        },
    ];

    if (severity.level === 'severe' || severity.level === 'moderate') {
        management.push({
            title: "Cardiotoxicity & Pulmonary Edema Management",
            recommendations: [
                "For myocardial dysfunction or pulmonary edema, start a Milrinone infusion.",
                "Provide respiratory support with non-invasive ventilation or intubation.",
                "Avoid aggressive fluid boluses."
            ]
        });
        management.push({
            title: "Seizure & Secretion Management",
            recommendations: [
                "Seizures: Treat with Midazolam or Diazepam.",
                "Excessive Secretions/Bradycardia: Use Atropine cautiously only if symptoms are severe."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Immediate admission to PICU is indicated for any systemic symptoms."];
    }
    return ["For local reactions only (Grade I), observation in the ER is sufficient. If stable, may be discharged."];
  },
  getRedFlags: () => [
    "Age <5 years",
    "Excessive salivation or persistent vomiting",
    "Hypertension or tachycardia",
    "Pulmonary edema or LV dysfunction",
    "Seizures",
    "Elevated troponin"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    doses.push({
        drugName: "Antiscorpion Serum (ACS)",
        dose: "Initial Dose: 3-5 vials IV.",
        notes: "Repeat if symptoms persist after 1-2 hours. Total of 4-10 vials may be needed."
    });
    
    if (weight > 0) {
        doses.push({
            drugName: "Prazosin",
            dose: `30 mcg/kg/dose = ${(30 * weight).toFixed(2)} mcg every 6 hours`,
            notes: "First-line for autonomic storm."
        });
        doses.push({
            drugName: "Atropine",
            dose: `0.02 mg/kg/dose = ${(0.02 * weight).toFixed(2)} mg IV`,
            notes: "Use only for severe cholinergic signs (bradycardia, excessive secretions)."
        });
    } else {
        doses.push({ drugName: "Prazosin", dose: "30 mcg/kg/dose every 6 hours" });
        doses.push({ drugName: "Atropine", dose: "0.02 mg/kg/dose IV" });
    }

    doses.push({ drugName: "Milrinone Infusion", dose: "0.25-0.5 mcg/kg/min", notes: "For cardiotoxicity/pulmonary edema." });
    doses.push({ drugName: "Midazolam", dose: "0.1-0.2 mg/kg IV/IM/IN", notes: "For seizures." });
    
    return doses;
  },
  getReferences: () => [{ title: "Pediatric Scorpion Sting Management Protocol (Palestine ER Guideline)", url: "" }],
};
