import type { DiseaseProtocol, FormData, Severity } from './types';

export const syncopeProtocol: DiseaseProtocol = {
  id: 'syncope',
  name: 'Syncope',
  system: 'Cardiology',
  description: 'Evaluation of syncope (fainting) in children to differentiate benign vasovagal syncope from dangerous cardiac causes.',
  image: {
    url: "https://picsum.photos/seed/syncope-peds/600/400",
    hint: "fainting person"
  },
  questions: [
    { id: 'withExercise', questionText: 'Did the syncope occur during exercise?', type: 'boolean' },
    { id: 'hasProdrome', questionText: 'Was there a prodrome (lightheadedness, blurry vision, nausea, warmth) before the event?', type: 'boolean' },
    { id: 'isPostural', questionText: 'Did it occur with a change in posture (e.g., standing up quickly)?', type: 'boolean' },
    { id: 'cardiacHistory', questionText: 'Any personal or family history of heart disease, arrhythmia, or sudden unexplained death?', type: 'boolean' },
    { id: 'ekgAbnormal', questionText: 'Is the EKG abnormal (e.g., arrhythmia, long QT, WPW, signs of HCM)?', type: 'boolean' },
    { id: 'wasProlonged', questionText: 'Was the loss of consciousness prolonged (>1-2 minutes)?', type: 'boolean' },
    { id: 'hadSeizureActivity', questionText: 'Was there seizure-like activity?', type: 'boolean', info: 'A brief period of tonic-clonic jerking can occur with benign syncope (convulsive syncope).'},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    if (data.withExercise || data.cardiacHistory || data.ekgAbnormal) {
      if(data.withExercise) details.push("Exertional syncope");
      if(data.cardiacHistory) details.push("Concerning personal/family history");
      if(data.ekgAbnormal) details.push("Abnormal EKG");
      details.push("High risk for a cardiac cause of syncope.");
      return { level: 'severe', details };
    }
    
    if (data.hasProdrome && data.isPostural) {
      details.push("Classic prodrome and postural trigger strongly suggest benign vasovagal syncope.");
      return { level: 'mild', details };
    }

    if (data.wasProlonged || data.hadSeizureActivity) {
        details.push("Prolonged LOC or seizure activity warrants further neurologic evaluation.");
        return { level: 'moderate', details };
    }
    
    details.push("Syncope without clear high-risk or low-risk features. Requires careful evaluation.");
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Management of High-Risk (Cardiac) Syncope",
          recommendations: [
            "Admit the patient to a monitored bed.",
            "Obtain urgent Pediatric Cardiology consultation.",
            "A 12-lead EKG is mandatory.",
            "Check labs including CBC and electrolytes.",
            "An echocardiogram and prolonged rhythm monitoring will be required."
          ]
        }];
      case 'moderate':
        return [{
          title: "Management of Unclear Syncope",
          recommendations: [
            "A 12-lead EKG should be performed on all patients with syncope.",
            "Check orthostatic vital signs.",
            "Check labs (glucose, CBC).",
            "Consider admission for observation or cardiology consultation, especially if events are recurrent or have atypical features."
          ]
        }];
      default: // mild
        return [{
          title: "Management of Vasovagal Syncope",
          recommendations: [
            "Provide reassurance.",
            "Educate the patient and family on recognizing the prodrome and performing counter-pressure maneuvers (e.g., crossing legs, squeezing fists).",
            "Advise increasing fluid and salt intake.",
            "No further workup is typically needed if the history is classic and EKG is normal."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Admission to a monitored bed is mandatory for urgent cardiac evaluation."];
    }
    if (severity.level === 'moderate') {
        return ["Admission should be strongly considered for observation and further workup. Discharge may be an option for reliable patients with planned outpatient follow-up."];
    }
    return ["Discharge is appropriate for clear vasovagal syncope with a normal EKG and no red flags."];
  },
  getRedFlags: () => [
    "Syncope during exercise or exertion.",
    "Syncope with no prodrome (sudden drop).",
    "Syncope associated with chest pain or palpitations.",
    "Family history of sudden death, cardiomyopathy, or channelopathies (e.g., Long QT).",
    "Abnormal EKG.",
    "Recurrent, frequent episodes."
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "American College of Cardiology: Guideline for the Evaluation and Management of Syncope", url: "https://www.jacc.org/doi/10.1016/j.jacc.2017.03.584" }],
};
