import type { DiseaseProtocol, FormData, Severity } from './types';

export const syncopeProtocol: DiseaseProtocol = {
  id: 'syncope',
  name: 'Syncope',
  system: 'Cardiology',
  description: 'Evaluation of syncope (fainting) in children to differentiate benign vasovagal syncope and pediatric mimics from dangerous cardiac causes.',
  image: {
    url: "https://picsum.photos/seed/syncope-peds/600/400",
    hint: "fainting person"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'withExercise', questionText: 'Did the syncope occur DURING exercise (not after)?', type: 'boolean', info: 'Syncope DURING exercise is a major cardiac red flag. Syncope after exercise is more often vasovagal.' },
    { id: 'hasProdrome', questionText: 'Was there a classic prodrome?', type: 'boolean', info: 'Lightheadedness, blurry vision, "tunnel vision", nausea, warmth, or pallor before the event.' },
    { id: 'isTriggered', questionText: 'Clear trigger identified?', type: 'select', options: [
        { label: 'None', value: 'none' },
        { label: 'Postural (standing up quickly)', value: 'postural' },
        { label: 'Emotional/Pain/Blood/Sight', value: 'emotional' },
        { label: 'Pain/Frustration/Minor Trauma (Infant)', value: 'breath_holding' },
    ]},
    { id: 'cardiacHistory', questionText: 'Concerning personal or family history?', type: 'boolean', info: 'Family history of sudden unexplained death < 40y, cardiomyopathy, or significant arrhythmia (e.g., Long QT).' },
    { id: 'ekgAbnormal', questionText: 'Is the EKG abnormal?', type: 'boolean', info: 'Look for: WPW pattern, Long QTc (>440-460ms), Brugada pattern, HCM (LVH with deep Q waves), or AV block.' },
    { id: 'wasProlonged', questionText: 'Was the loss of consciousness prolonged (>1-2 minutes)?', type: 'boolean' },
    { id: 'hadSeizureActivity', questionText: 'Was there seizure-like activity?', type: 'boolean', info: 'A few brief "jerks" can be normal (convulsive syncope). Prolonged rhythmic shaking suggests epilepsy.'},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    // High-Risk Cardiac Features
    if (data.withExercise || data.cardiacHistory || data.ekgAbnormal) {
      if (data.withExercise) details.push("Syncope DURING exercise (High risk for arrhythmia/outflow obstruction)");
      if (data.cardiacHistory) details.push("Concerning personal/family cardiac history");
      if (data.ekgAbnormal) details.push("Abnormal EKG findings");
      return { level: 'severe', details: [...details, "High risk for cardiac syncope. Requires urgent cardiology evaluation."] };
    }
    
    // Mimics (Breath-Holding)
    if (data.isTriggered === 'breath_holding') {
        details.push("Trigger and age consistent with Breath-Holding Spell (Cyanotic or Pallid type).");
        return { level: 'mild', details: [...details, "Benign pediatric condition."] };
    }

    // Classic Vasovagal
    if (data.hasProdrome && (data.isTriggered === 'postural' || data.isTriggered === 'emotional')) {
      details.push("Classic prodrome and triggers (emotional/postural) suggest Neurocardiogenic (Vasovagal) Syncope.");
      return { level: 'mild', details };
    }

    // Uncertain but non-cardiac
    if (data.wasProlonged || data.hadSeizureActivity) {
        if (data.wasProlonged) details.push("Prolonged duration of LOC (>2 min)");
        if (data.hadSeizureActivity) details.push("Seizure-like activity noted (Differentiate convulsive syncope from epilepsy)");
        return { level: 'moderate', details };
    }
    
    details.push("Syncope without clear high-risk or low-risk features. Requires 12-lead EKG and careful evaluation.");
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Management of High-Risk (Cardiac) Syncope",
          recommendations: [
            "Continuous cardiac monitoring is mandatory.",
            "Establish IV access.",
            "Obtain immediate Pediatric Cardiology consultation.",
            "Obtain a 12-lead EKG and compare with prior if available.",
            "Send labs: Electrolytes (including Mg/Ca), Glucose, and Troponin if chest pain was present.",
            "An Echocardiogram is required to rule out structural disease (HCM, anomalous coronary).",
            "Maintain strict bed rest until cleared by Cardiology."
          ]
        }];
      case 'moderate':
        return [{
          title: "Management of Uncertain Syncope",
          recommendations: [
            "Perform a thorough 12-lead EKG on ALL patients.",
            "Check orthostatic vital signs (lying and standing).",
            "Check point-of-care glucose.",
            "Review medications for QT-prolonging agents or diuretics.",
            "Differentiate from mimics: If post-ictal phase is present (>5-10 min confusion), consider epilepsy workup.",
            "If EKG is normal and exam is benign, consider observation in the ED."
          ]
        }];
      default: // mild (Vasovagal / Breath-Holding)
        return [{
          title: "Management of Benign Pediatric Syncope / Mimics",
          recommendations: [
            "Reassure the family that the event is benign and not life-threatening.",
            "Educate on triggers and early warning signs (prodrome).",
            "Counter-Pressure Maneuvers: Teach child to cross legs, squeeze buttocks, or clench fists when prodrome starts.",
            "Hydration & Salt: Increase oral fluid intake and maintain a liberal salt diet (if no hypertension).",
            "Breath-Holding Spells: Reassure that these do not cause brain damage and are usually outgrown by age 5-6.",
            "No routine labs or neuroimaging (CT/MRI) needed for classic vasovagal syncope with normal EKG."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to a monitored bed (Telemetry or PICU) is required for urgent workup."];
    }
    if (severity.level === 'moderate') {
        return [
            "Consider admission for observation if events are frequent, atypical, or follow-up is uncertain.",
            "Otherwise, discharge with prompt outpatient Cardiology follow-up for Holter/Echo."
        ];
    }
    return [
        "Discharge home is appropriate for classic vasovagal or breath-holding events with a normal EKG.",
        "Follow up with primary care physician."
    ];
  },
  getRedFlags: () => [
    "Syncope DURING exertion or while supine (high risk for arrhythmia).",
    "Syncope preceded by palpitations or chest pain.",
    "No prodrome (sudden 'drop' to the floor).",
    "Family history of sudden death < 40 years old.",
    "Known structural heart disease or cardiac surgery.",
    "Abnormal EKG findings (especially prolonged QTc or WPW)."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    return [
      { drugName: "Normal Saline Bolus", dose: weight > 0 ? `${(10 * weight).toFixed(0)}-${(20 * weight).toFixed(0)} mL IV` : "10-20 mL/kg IV", notes: "Only if hypovolemic or orthostatic symptoms are severe." }
    ];
  },
  getReferences: () => [
      { title: "2017 ACC/AHA/HRS Guideline for the Evaluation and Management of Patients With Syncope", url: "https://www.jacc.org/doi/10.1016/j.jacc.2017.03.584" },
      { title: "AAP: Syncope in Children and Adolescents", url: "https://publications.aap.org/pediatricsinreview/article/39/11/530/34758/Syncope-in-Children-and-Adolescents" }
  ],
};