import type { DiseaseProtocol, FormData, Severity } from './types';

export const chestPainInChildrenProtocol: DiseaseProtocol = {
  id: 'chest-pain-in-children',
  name: 'Chest Pain in Children',
  system: 'Cardiovascular System',
  description: 'Evaluation of chest pain in children and adolescents, focusing on identifying rare but serious cardiac causes vs. common benign etiologies.',
  image: {
    url: "https://picsum.photos/seed/chest-pain-peds/600/400",
    hint: "child chest"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'painOnExertion', questionText: 'Does the pain occur DURING exercise (not just after)?', type: 'boolean', info: 'Pain during peak exertion is a major red flag for anomalous coronary arteries or outflow obstruction.' },
    { id: 'associatedSyncope', questionText: 'Is the pain associated with syncope or palpitations?', type: 'boolean' },
    { id: 'isSharpLocalized', questionText: 'Is the pain sharp, localized, and reproducible with palpation?', type: 'boolean', info: 'Reproducible pain is highly suggestive of costochondritis or musculoskeletal causes.' },
    { id: 'hasFever', questionText: 'Is there a fever and does the child appear ill?', type: 'boolean', info: 'Suggestive of myocarditis, pericarditis, or pneumonia.' },
    { id: 'ekgAbnormal', questionText: 'Is the EKG abnormal?', type: 'boolean', info: 'ST changes, T-wave inversion, WPW, long QTc, ventricular hypertrophy, or arrhythmia.' },
    { id: 'troponinElevated', questionText: 'Is Troponin elevated?', type: 'boolean' },
    { id: 'cardiacHistory', questionText: 'Concerning personal or family history?', type: 'boolean', info: 'Family history of sudden unexplained death <40y, cardiomyopathy, or significant arrhythmia.' },
    { id: 'isCrushing', questionText: 'Is the pain "crushing," radiating to the jaw/arm, or associated with diaphoresis?', type: 'boolean', info: 'Classic anginal symptoms are rare in children but very high risk.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    // High-Risk Cardiac Features
    if (data.painOnExertion || data.associatedSyncope || data.cardiacHistory || data.isCrushing || data.ekgAbnormal || data.troponinElevated) {
      if (data.painOnExertion) details.push("Exertional chest pain (High risk for coronary anomalies)");
      if (data.associatedSyncope) details.push("Associated syncope or palpitations");
      if (data.cardiacHistory) details.push("Concerning personal/family cardiac history");
      if (data.isCrushing) details.push("Classic anginal-type symptoms");
      if (data.ekgAbnormal) details.push("Abnormal EKG");
      if (data.troponinElevated) details.push("Elevated Troponin");
      return { level: 'severe', details: [...details, "Potential cardiac emergency. Urgent workup required."] };
    }
    
    // Inflammatory/Infectious
    if (data.hasFever) {
      details.push("Fever suggests myocarditis, pericarditis, or a pulmonary source (pneumonia/pleurisy).");
      return { level: 'moderate', details };
    }

    // Benign/Typical Peds
    if (data.isSharpLocalized) {
      details.push("Pain reproducible with palpation suggests a musculoskeletal cause (e.g., costochondritis).");
      return { level: 'mild', details };
    }
    
    details.push("Chest pain without red flags. Most pediatric chest pain is musculoskeletal, GI, or psychogenic.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch(severity.level) {
      case 'severe':
        return [
          {
            title: "Immediate Diagnostic Workup (High-Risk)",
            recommendations: [
              "12-Lead EKG: Look for ST changes, T-wave inversions, pathological Q-waves, WPW, or long QTc.",
              "Labs: High-sensitivity Troponin and inflammatory markers (CRP/ESR).",
              "Radiology: Chest X-ray to evaluate heart size and pulmonary congestion.",
              "Place on continuous cardiac monitor and maintain bed rest."
            ]
          },
          {
            title: "Management & Consultation",
            recommendations: [
              "IMMEDIATE Pediatric Cardiology consultation.",
              "Obtain an Echocardiogram to rule out anomalous coronary artery origin, HCM, or pericardial effusion.",
              "If Troponin is elevated or EKG is abnormal, admit to a monitored bed/PICU."
            ]
          }
        ];
      case 'moderate':
        return [{
          title: "Management of Febrile Chest Pain",
          recommendations: [
            "Obtain a 12-lead EKG and Chest X-ray (rule out pneumonia).",
            "Send labs: Troponin, CRP, and CBC.",
            "Consider Myocarditis/Pericarditis: If labs are elevated or EKG shows low voltages/ST changes, consult Cardiology and admit.",
            "Provide appropriate analgesia (e.g., Ibuprofen)."
          ]
        }];
      default: // mild
        return [{
          title: "Management of Low-Risk Chest Pain",
          recommendations: [
            "Musculoskeletal: If reproducible, provide reassurance and NSAIDs (Ibuprofen 10mg/kg).",
            "Precordial Catch Syndrome: Reassure family if pain is very brief, sharp, and occurs at rest.",
            "GERD: Consider a trial of antacids if pain is retrosternal and related to meals.",
            "Psychogenic: Assess for stressors or anxiety if pain is recurrent and non-specific.",
            "An EKG may be performed for parental reassurance but is often not strictly necessary if red flags are absent and the exam is classic for costochondritis.",
            "Discharge with outpatient primary care follow-up."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return [
        "Admission to a monitored bed is required for patients with red flags, elevated Troponin, or abnormal EKG.",
        "Consultation with Cardiology should occur prior to discharge for any 'moderate' risk case."
      ];
    }
    return ["Discharge home with reassurance and specific follow-up instructions is appropriate for low-risk, well-appearing children."];
  },
  getRedFlags: () => [
    "Pain occurring DURING physical activity.",
    "Associated syncope or presyncope.",
    "Pain radiating to the jaw, neck, or left arm.",
    "Personal or family history of early sudden death, HCM, or Marfan syndrome.",
    "Abnormal findings on cardiac exam (new murmur, gallop, distant heart sounds).",
    "Known history of Kawasaki Disease (risk of coronary aneurysms)."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const ibuprofen = Math.min(10 * weight, 600);
    const acetaminophen = Math.min(15 * weight, 1000);

    return [
      { drugName: "Ibuprofen", dose: weight > 0 ? `${ibuprofen.toFixed(0)} mg PO` : "10 mg/kg PO, max 600 mg", notes: "For clear musculoskeletal pain only; avoid if myocarditis/pericarditis concern until senior review." },
      { drugName: "Acetaminophen", dose: weight > 0 ? `${acetaminophen.toFixed(0)} mg PO/PR` : "15 mg/kg PO/PR, max 1000 mg", notes: "Supportive analgesia." }
    ];
  },
  getReferences: () => [
    { title: "AAP: Evaluation and Management of Children and Adolescents With Chest Pain", url: "https://publications.aap.org/pediatrics/article/148/5/e2021053428/182962/Evaluation-and-Management-of-Children-and" },
    { title: "UpToDate: Evaluation of chest pain in children", url: "https://www.uptodate.com/contents/evaluation-of-chest-pain-in-children" }
  ],
};
