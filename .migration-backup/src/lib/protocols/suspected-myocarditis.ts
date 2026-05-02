import type { DiseaseProtocol, FormData, Severity } from './types';

export const suspectedMyocarditisProtocol: DiseaseProtocol = {
  id: 'suspected-myocarditis',
  name: 'Suspected Myocarditis',
  system: 'Cardiology',
  description: 'Evaluation for myocarditis, an inflammation of the heart muscle, often following a viral illness.',
  image: {
    url: "https://picsum.photos/seed/myocarditis-peds/600/400",
    hint: "inflamed heart"
  },
  questions: [
    { id: 'hasViralProdrome', questionText: 'Recent history of a viral illness (fever, URI, or GI symptoms)?', type: 'boolean' },
    { id: 'hasChestPain', questionText: 'Is there chest pain, especially if sharp and pleuritic?', type: 'boolean' },
    { id: 'hasRespDistress', questionText: 'Signs of respiratory distress or heart failure (tachypnea, rales)?', type: 'boolean' },
    { id: 'hasShock', questionText: 'Are there signs of shock (poor perfusion, hypotension, altered mental status)?', type: 'boolean' },
    { id: 'ekgAbnormal', questionText: 'Is the EKG abnormal?', type: 'boolean', info: 'Look for sinus tachycardia, low QRS voltages, ST segment changes, or arrhythmias.' },
    { id: 'isTroponinElevated', questionText: 'Is the troponin level elevated?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    if (data.hasShock || data.hasRespDistress) {
      details.push("Patient has signs of decompensated heart failure or cardiogenic shock. This is a life-threatening emergency.");
      return { level: 'severe', details };
    }
    
    if (data.hasChestPain && (data.ekgAbnormal || data.isTroponinElevated)) {
      details.push("Chest pain with abnormal EKG or elevated troponin is highly suspicious for myocarditis.");
      return { level: 'moderate', details };
    }
    
    if (data.hasViralProdrome) {
      details.push("History of viral prodrome is common. Maintain high index of suspicion.");
    }

    return { level: 'unknown', details: ["Assess for key signs to determine risk."] };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "Management of Myocarditis with Shock (Fulminant Myocarditis)",
        recommendations: [
          "This is a PICU and Cardiology emergency. Treat as Cardiogenic Shock.",
          "Provide aggressive respiratory and hemodynamic support.",
          "Early initiation of inotropic support (e.g., Milrinone) is critical.",
          "Consider mechanical circulatory support (ECMO) early in refractory cases.",
          "Avoid NSAIDs, as they may worsen myocardial injury."
        ]
      }];
    }
    
    return [{
      title: "Evaluation of Suspected Myocarditis",
      recommendations: [
        "Admit patient to a monitored bed.",
        "Obtain urgent Pediatric Cardiology consultation.",
        "Obtain 12-lead EKG and labs including Troponin and BNP.",
        "Obtain a Chest X-ray to assess for cardiomegaly and pulmonary edema.",
        "An echocardiogram is essential to evaluate cardiac function and rule out other causes.",
        "Provide supportive care, including oxygen and treatment of arrhythmias.",
        "Treatment may include IVIG, steroids, or other immunomodulatory therapies as directed by cardiology."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected myocarditis require hospital admission for monitoring and evaluation.", "Patients with hemodynamic instability or significant heart failure require PICU admission."];
  },
  getRedFlags: () => [
    "Signs of heart failure or cardiogenic shock.",
    "New-onset arrhythmia in the setting of a viral illness.",
    "Elevated troponin.",
    "Globally reduced function on echocardiogram.",
    "Chest pain that is out of proportion to other symptoms."
  ],
  getDrugDoses: () => [
    { drugName: "Milrinone Infusion", dose: "Load 50 mcg/kg over 10 min, then 0.25-0.75 mcg/kg/min infusion.", notes: "Inotrope and afterload reducer." },
    { drugName: "IV Immunoglobulin (IVIG)", dose: "2 g/kg over 24 hours", notes: "Often used, though evidence is debated. Administer on advice of Cardiology." },
  ],
  getReferences: () => [{ title: "UpToDate: Clinical manifestations and diagnosis of myocarditis in children", url: "https://www.uptodate.com/contents/clinical-manifestations-and-diagnosis-of-myocarditis-in-children" }],
};
