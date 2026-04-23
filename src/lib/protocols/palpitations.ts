import type { DiseaseProtocol, FormData, Severity } from './types';

export const palpitationsProtocol: DiseaseProtocol = {
  id: 'palpitations',
  name: 'Palpitations',
  system: 'Cardiology',
  description: 'Evaluation of palpitations in a child or adolescent.',
  image: {
    url: "https://picsum.photos/seed/palpitations-peds/600/400",
    hint: "heart rhythm"
  },
  questions: [
    { id: 'associatedSyncope', questionText: 'Are the palpitations associated with syncope or presyncope?', type: 'boolean' },
    { id: 'withExercise', questionText: 'Do they occur with exercise?', type: 'boolean' },
    { id: 'hasChestPain', questionText: 'Is there associated chest pain?', type: 'boolean' },
    { id: 'isSudden', questionText: 'Are the onset and termination abrupt and sudden?', type: 'boolean' },
    { id: 'cardiacHistory', questionText: 'Personal or family history of arrhythmia, structural heart disease, or sudden death?', type: 'boolean' },
    { id: 'ekgAbnormal', questionText: 'Is the EKG abnormal (e.g., arrhythmia, long QT, WPW pattern)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    if (data.associatedSyncope || data.withExercise || data.cardiacHistory || data.ekgAbnormal) {
      if (data.associatedSyncope) details.push("Associated with syncope");
      if (data.withExercise) details.push("Occurs with exercise");
      if (data.cardiacHistory) details.push("Concerning personal/family history");
      if (data.ekgAbnormal) details.push("Abnormal EKG");
      details.push("Red flags present, suggesting a high risk for a serious arrhythmia.");
      return { level: 'severe', details };
    }
    
    if (data.isSudden) {
      details.push("Abrupt onset/offset is suspicious for a re-entrant tachycardia like SVT.");
      return { level: 'moderate', details };
    }
    
    details.push("Palpitations without red flags are often benign (e.g., anxiety, premature contractions).");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Management of High-Risk Palpitations",
          recommendations: [
            "Admit the patient to a monitored bed.",
            "Obtain urgent Pediatric Cardiology consultation.",
            "Perform a 12-lead EKG if not already done.",
            "Check labs, including electrolytes (K, Mg, Ca) and thyroid function tests.",
            "An echocardiogram and prolonged rhythm monitoring (e.g., Holter) will be necessary."
          ]
        }];
      case 'moderate':
        return [{
          title: "Management of Suspected SVT",
          recommendations: [
            "If patient is currently tachycardic, follow the SVT protocol.",
            "If patient is in sinus rhythm, obtain an EKG to look for pre-excitation (WPW).",
            "Arrange for prompt outpatient cardiology follow-up for likely electrophysiology study and/or ambulatory monitoring."
          ]
        }];
      default: // mild
        return [{
          title: "Management of Low-Risk Palpitations",
          recommendations: [
            "A 12-lead EKG is reasonable to rule out underlying abnormalities.",
            "Reassure patient and family about the likely benign nature.",
            "Discuss potential triggers like caffeine, stress, and poor sleep.",
            "Arrange non-urgent outpatient follow-up with primary care or cardiology for consideration of an ambulatory monitor (Holter)."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Admission to a monitored bed is required for urgent evaluation."];
    }
    return ["Discharge is appropriate for stable patients without red flags, with a clear plan for outpatient follow-up."];
  },
  getRedFlags: () => [
    "Palpitations associated with syncope, presyncope, or seizure.",
    "Palpitations that occur during exercise.",
    "Family history of sudden unexplained death, arrhythmia, or cardiomyopathy.",
    "An abnormal EKG (e.g., long QT syndrome, Wolff-Parkinson-White pre-excitation).",
    "Patient with known structural heart disease."
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "UpToDate: Palpitations in children", url: "https://www.uptodate.com/contents/palpitations-in-children" }],
};
