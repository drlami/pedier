import type { DiseaseProtocol, FormData, Severity } from './types';

export const murmurWithSymptomsProtocol: DiseaseProtocol = {
  id: 'murmur-with-symptoms',
  name: 'Murmur with Symptoms',
  system: 'Cardiovascular System',
  description: 'Evaluation of a heart murmur in a child, distinguishing between benign (innocent) and pathologic murmurs.',
  image: {
    url: "https://picsum.photos/seed/murmur-peds/600/400",
    hint: "stethoscope heart"
  },
  questions: [
    { id: 'unstable', questionText: 'Cyanosis, respiratory distress, poor perfusion, or shock?', type: 'boolean' },
    { id: 'isSymptomatic', questionText: 'Are there any concerning symptoms?', type: 'boolean', info: 'e.g., Failure to thrive, sweating with feeds (infants), exercise intolerance, syncope, chest pain (older children).'},
    { id: 'murmurTiming', questionText: 'Murmur Timing', type: 'select', options: [{label: 'Systolic', value: 'systolic'}, {label: 'Diastolic', value: 'diastolic'}, {label: 'Continuous', value: 'continuous'}]},
    { id: 'murmurGrade', questionText: 'Murmur Grade (loudness)', type: 'select', options: [{label: 'Grade 1-2/6 (soft)', value: 'soft'}, {label: 'Grade ≥ 3/6 (loud)', value: 'loud'}]},
    { id: 'hasThrill', questionText: 'Is a thrill palpable?', type: 'boolean'},
    { id: 'hasClick', questionText: 'Is there an ejection click?', type: 'boolean'},
    { id: 's2', questionText: 'Second Heart Sound (S2)', type: 'select', options: [{label: 'Normally split', value: 'normal'}, {label: 'Fixed split or single S2', value: 'abnormal'}]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (data.unstable) {
      return { level: 'severe', details: ["Murmur with cyanosis, respiratory distress, poor perfusion, or shock suggests critical structural heart disease."] };
    }
    
    // Pathologic features
    if (data.isSymptomatic) details.push("Symptomatic");
    if (data.murmurTiming === 'diastolic' || data.murmurTiming === 'continuous') details.push("Diastolic or continuous murmur");
    if (data.murmurGrade === 'loud') details.push("Loud murmur (Grade ≥3)");
    if (data.hasThrill) details.push("Thrill present");
    if (data.hasClick) details.push("Ejection click present");
    if (data.s2 === 'abnormal') details.push("Abnormal S2");

    if (details.length > 0) {
      details.push("Pathologic features present. Requires cardiology evaluation.");
      return { level: 'moderate', details };
    }

    details.push("Features are consistent with a benign/innocent murmur (systolic, soft, no other abnormal sounds, asymptomatic).");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "Unstable Child with Murmur",
        recommendations: [
          "Move to resuscitation area. Call PICU and Pediatric Cardiology immediately.",
          "Give oxygen/ventilatory support as needed and establish IV/IO access.",
          "Obtain 12-lead EKG, chest X-ray, blood gas/lactate, glucose, and urgent bedside echocardiogram.",
          "If neonate/young infant with suspected duct-dependent lesion, start prostaglandin E1 urgently with specialist guidance."
        ]
      }];
    }
    if (severity.level === 'moderate') {
      return [{
        title: "Management of Pathologic Murmur",
        recommendations: [
          "Urgent consultation with Pediatric Cardiology is indicated if the patient is symptomatic or in distress.",
          "Obtain an EKG and Chest X-ray.",
          "An echocardiogram is required for diagnosis.",
          "Further management will be directed by the cardiologist based on the underlying structural heart disease."
        ]
      }];
    }
    return [{
      title: "Management of Innocent Murmur",
      recommendations: [
        "Reassure the family that the murmur is benign and does not represent heart disease.",
        "No activity restrictions are needed.",
        "No further workup (EKG, echo) is typically required if the murmur has classic innocent features.",
        "Outpatient follow-up with primary care is sufficient."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate PICU admission/transfer with urgent Pediatric Cardiology evaluation is required."];
    }
    if (severity.level === 'moderate' && data.isSymptomatic) {
      return ["Admission for urgent cardiology evaluation is required for symptomatic patients."];
    }
    if (severity.level === 'moderate' && !data.isSymptomatic) {
      return ["Discharge with prompt outpatient cardiology referral is appropriate for asymptomatic patients with a suspected pathologic murmur."];
    }
    return ["Discharge home with reassurance and routine follow-up."];
  },
  getRedFlags: () => [
    "ANY diastolic murmur",
    "ANY murmur associated with a thrill or click",
    "A loud murmur (Grade 3/6 or higher)",
    "A murmur that does not change with position",
    "Associated symptoms: cyanosis, failure to thrive, syncope, exercise intolerance"
  ],
  getDrugDoses: () => [
    { drugName: "No routine drug therapy", dose: "Treat underlying cause", notes: "If duct-dependent lesion suspected in neonate/young infant, start PGE1 only with senior/Cardiology guidance." }
  ],
  getReferences: () => [{ title: "UpToDate: Approach to the infant or child with a heart murmur", url: "https://www.uptodate.com/contents/approach-to-the-infant-or-child-with-a-heart-murmur" }],
};
