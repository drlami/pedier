import type { DiseaseProtocol, FormData, Severity } from './types';

export const chestPainInChildrenProtocol: DiseaseProtocol = {
  id: 'chest-pain-in-children',
  name: 'Chest Pain in Children',
  system: 'Cardiology',
  description: 'Evaluation of chest pain in children, focusing on identifying rare but serious cardiac causes.',
  image: {
    url: "https://picsum.photos/seed/chest-pain-peds/600/400",
    hint: "child chest"
  },
  questions: [
    { id: 'painOnExertion', questionText: 'Does the pain occur with exertion?', type: 'boolean' },
    { id: 'associatedSyncope', questionText: 'Is the pain associated with syncope or presyncope?', type: 'boolean' },
    { id: 'isSharpLocalized', questionText: 'Is the pain sharp, localized, and reproducible with palpation?', type: 'boolean' },
    { id: 'hasFever', questionText: 'Is there a fever and does the child appear ill?', type: 'boolean' },
    { id: 'cardiacHistory', questionText: 'Any personal or family history of heart disease, arrhythmia, or sudden death?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    if (data.painOnExertion || data.associatedSyncope || data.cardiacHistory) {
      if (data.painOnExertion) details.push("Exertional chest pain");
      if (data.associatedSyncope) details.push("Associated syncope");
      if (data.cardiacHistory) details.push("Concerning personal/family history");
      details.push("These are red flags for a potential cardiac cause.");
      return { level: 'severe', details };
    }
    
    if (data.hasFever) {
      details.push("Fever suggests an inflammatory or infectious cause like myocarditis or pericarditis.");
      return { level: 'moderate', details };
    }

    if (data.isSharpLocalized) {
      details.push("Pain reproducible with palpation is highly suggestive of a benign musculoskeletal cause (e.g., costochondritis).");
      return { level: 'mild', details };
    }
    
    details.push("Chest pain is most often non-cardiac. Assess for red flags.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch(severity.level) {
      case 'severe':
        return [{
          title: "Management of High-Risk Chest Pain",
          recommendations: [
            "Obtain an immediate 12-lead EKG.",
            "Obtain IV access and send labs including cardiac enzymes (Troponin) and inflammatory markers (CRP).",
            "Obtain a chest X-ray.",
            "Place patient on a cardiac monitor.",
            "Obtain an urgent Pediatric Cardiology consultation.",
            "A bedside echocardiogram should be strongly considered."
          ]
        }];
      case 'moderate':
        return [{
          title: "Management of Febrile Chest Pain",
          recommendations: [
            "Obtain an EKG, chest X-ray, and labs including Troponin and CRP.",
            "Admit for observation and further evaluation for myocarditis/pericarditis.",
            "Consult Pediatric Cardiology."
          ]
        }];
      default: // mild
        return [{
          title: "Management of Low-Risk Chest Pain",
          recommendations: [
            "Most pediatric chest pain is benign (musculoskeletal, GI, psychogenic).",
            "For costochondritis, provide reassurance and analgesics (e.g., Ibuprofen).",
            "Consider a trial of antacids for suspected reflux.",
            "An EKG may be performed for reassurance, but is often not necessary if history and exam are clearly benign.",
            "Discharge with outpatient follow-up."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admission to a monitored bed is required for urgent workup and cardiology consultation."];
    }
    return ["Discharge is appropriate for patients with a clear benign cause of chest pain and no red flags."];
  },
  getRedFlags: () => [
    "Pain occurring during or after exercise.",
    "Associated syncope or presyncope.",
    "A sensation of racing or irregular heartbeat (palpitations).",
    "Family history of sudden death, cardiomyopathy, or significant arrhythmias.",
    "Abnormal findings on cardiac exam (murmur, gallop, click).",
    "Signs of heart failure (edema, hepatomegaly, rales)."
  ],
  getDrugDoses: () => [
    { drugName: "Ibuprofen", dose: "10 mg/kg per dose", notes: "For musculoskeletal pain." },
  ],
  getReferences: () => [{ title: "American Academy of Pediatrics: Evaluation and Management of Children and Adolescents With Chest Pain", url: "https://publications.aap.org/pediatrics/article/148/5/e2021053428/182962/Evaluation-and-Management-of-Children-and" }],
};
