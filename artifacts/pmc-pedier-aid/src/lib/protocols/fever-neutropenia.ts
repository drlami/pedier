import type { DiseaseProtocol, FormData, Severity } from './types';

export const feverNeutropeniaProtocol: DiseaseProtocol = {
  id: 'fever-neutropenia',
  name: 'Fever with Neutropenia',
  system: 'Infectious Diseases',
  description: 'Management of fever in an immunocompromised child with neutropenia, which is a medical emergency.',
  image: {
    url: "https://picsum.photos/seed/fever-neutropenia/600/400",
    hint: "blood cells"
  },
  questions: [
    { id: 'hasFever', questionText: 'Confirmed temperature ≥ 38.3°C once, or ≥ 38.0°C for over an hour?', type: 'boolean' },
    { id: 'anc', questionText: 'Absolute Neutrophil Count (ANC)', type: 'number', unit: 'cells/μL', info: 'Neutropenia is defined as ANC < 500, or < 1000 and predicted to fall below 500.' },
    { id: 'isHemodynamicallyUnstable', questionText: 'Is the patient hemodynamically unstable?', type: 'boolean', info: 'e.g., hypotension for age, requires pressors, poor perfusion.' },
    { id: 'hasSeverePain', questionText: 'New severe abdominal pain or concern for necrotizing enterocolitis?', type: 'boolean' },
    { id: 'hasNeuroChanges', questionText: 'New neurologic changes or altered mental status?', type: 'boolean' },
    { id: 'hasPulmonaryInfiltrate', questionText: 'New pulmonary infiltrate or hypoxemia?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const anc = Number(data.anc);
    
    if (isNaN(anc) || !data.hasFever) {
        return { level: 'unknown', details: ["Confirm fever and obtain ANC to assess risk."] };
    }
    
    const isNeutropenic = anc < 500;
    if (!isNeutropenic) {
        return { level: 'no', details: ["Patient is not neutropenic by definition (ANC >= 500)."] };
    }

    const isHighRisk = data.isHemodynamicallyUnstable || data.hasSeverePain || data.hasNeuroChanges || data.hasPulmonaryInfiltrate;
    
    if (isHighRisk) {
      if (data.isHemodynamicallyUnstable) details.push("Hemodynamic instability");
      if (data.hasSeverePain) details.push("Severe abdominal pain");
      if (data.hasNeuroChanges) details.push("Neurologic changes");
      if (data.hasPulmonaryInfiltrate) details.push("Pulmonary infiltrate/hypoxia");
      details.push("Patient meets high-risk criteria.");
      return { level: 'severe', details };
    }

    details.push("Patient is considered low-risk. Local institutional guidelines may vary.");
    return { level: 'moderate', details }; // Using 'moderate' for low-risk febrile neutropenia
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "EMERGENCY: High-Risk Febrile Neutropenia",
        recommendations: [
          "Initiate resuscitation (ABCs) and treat shock aggressively with fluids.",
          "Obtain blood cultures from all lumen of central lines (if present) AND a peripheral site.",
          "Obtain Urinalysis/Culture, and CXR. Consider other cultures based on symptoms.",
          "Administer empiric broad-spectrum IV antibiotics WITHIN 60 MINUTES of presentation.",
          "Initial monotherapy with an anti-pseudomonal beta-lactam (Cefepime, Meropenem, or Piperacillin-tazobactam) is recommended.",
          "Add Vancomycin for hemodynamic instability, pneumonia, skin/soft tissue infection, or suspected catheter-related infection.",
          "Admit to hospital, likely to PICU."
        ]
      }];
    }
    if (severity.level === 'moderate') {
      return [{
        title: "Low-Risk Febrile Neutropenia Management",
        recommendations: [
          "Obtain blood cultures (peripheral and/or central line).",
          "Administer first dose of empiric IV antibiotics promptly.",
          "Low-risk patients may be candidates for oral antibiotics or outpatient management AFTER the first IV dose and a period of observation, but this should be done ONLY in centers with established programs and in consultation with Pediatric Hematology/Oncology.",
          "Standard of care in most centers is admission for IV antibiotics until afebrile and counts begin to recover."
        ]
      }];
    }
    return [];
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to the hospital, typically requiring PICU level of care."];
    }
    if (severity.level === 'moderate') {
      return ["Hospital admission for IV antibiotics is the standard of care.", "Outpatient management may be considered in select low-risk patients at experienced centers with close follow-up protocols."];
    }
    return ["Assessment is incomplete."];
  },
  getRedFlags: () => [
    "Hypotension or signs of shock (this is septic shock until proven otherwise)",
    "Altered mental status",
    "Respiratory distress or new oxygen requirement",
    "Severe mucositis or abdominal pain (concern for enterocolitis)",
    "Fever in a neutropenic patient is itself a red flag."
  ],
  getDrugDoses: () => [
    { drugName: "Cefepime (IV)", dose: "50 mg/kg/dose every 8 hours (max 2g/dose)" },
    { drugName: "Piperacillin-tazobactam (IV)", dose: "100 mg/kg/dose of piperacillin component every 8 hours (max 4g/dose)" },
    { drugName: "Meropenem (IV)", dose: "20 mg/kg/dose every 8 hours (max 1g/dose)", notes: "Broader spectrum, often reserved." },
    { drugName: "Vancomycin (IV)", dose: "15 mg/kg/dose every 6 hours", notes: "Added for specific indications, not as routine monotherapy." }
  ],
  getReferences: () => [
      { title: "IDSA Clinical Practice Guideline for the Use of Antimicrobial Agents in Neutropenic Patients with Cancer (2010)", url: "https://academic.oup.com/cid/article/52/4/e56/299092" }
  ],
};
