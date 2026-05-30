import type { DiseaseProtocol, FormData, Severity } from './types';

export const palpitationsProtocol: DiseaseProtocol = {
  id: 'palpitations',
  name: 'Palpitations',
  system: 'Cardiology',
  description: 'Evaluation of palpitations in a child or adolescent, focusing on identifying dangerous arrhythmias and coordinating specialist care.',
  image: {
    url: "https://picsum.photos/seed/palpitations-peds/600/400",
    hint: "heart rhythm"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'currentlyTachycardic', questionText: 'Is the patient currently in tachycardia on monitor/EKG?', type: 'boolean' },
    { id: 'associatedSyncope', questionText: 'Associated with syncope or presyncope?', type: 'boolean', info: 'Loss of consciousness or feeling of "blacking out" is a major red flag.' },
    { id: 'withExercise', questionText: 'Onset during peak exercise?', type: 'boolean', info: 'Palpitations DURING exertion are high-risk for dangerous arrhythmias or coronary anomalies.' },
    { id: 'isSuddenAbrupt', questionText: 'Abrupt onset and termination (like a "light switch")?', type: 'boolean', info: 'Suggestive of re-entrant tachycardias like SVT.' },
    { id: 'hasChestPain', questionText: 'Associated chest pain or significant dyspnea?', type: 'boolean' },
    { id: 'cardiacHistory', questionText: 'Known structural heart disease or family history of early sudden death?', type: 'boolean', info: 'Includes family history of sudden death < 40y, cardiomyopathy, or Long QT.' },
    { id: 'ekgAbnormal', questionText: 'Is the 12-lead EKG abnormal?', type: 'boolean', info: 'Look for: WPW pre-excitation, prolonged QTc (>440-460ms), Brugada, or signs of hypertrophy.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    // High-Risk Features
    if (data.currentlyTachycardic || data.associatedSyncope || data.withExercise || data.cardiacHistory || data.ekgAbnormal || data.hasChestPain) {
      if (data.currentlyTachycardic) details.push("Currently tachycardic on monitor/EKG");
      if (data.associatedSyncope) details.push("Associated with syncope/presyncope");
      if (data.withExercise) details.push("Occurs DURING peak exertion");
      if (data.cardiacHistory) details.push("Concerning personal/family cardiac history");
      if (data.ekgAbnormal) details.push("Abnormal EKG findings");
      if (data.hasChestPain) details.push("Associated chest pain or dyspnea");
      return { level: 'severe', details: [...details, "High risk for life-threatening arrhythmia. Urgent Cardiology consultation required."] };
    }
    
    // Suspected Re-entrant (SVT)
    if (data.isSuddenAbrupt) {
      details.push("Abrupt onset/offset is highly suspicious for a re-entrant tachycardia (e.g., SVT).");
      return { level: 'moderate', details };
    }
    
    details.push("Palpitations without red flags. Most commonly benign (anxiety, sinus tachycardia, PACs/PVCs).");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Immediate Management & Cardiology Consultation",
          recommendations: [
            "ACT FAST: Continuous cardiac monitoring and IV access are mandatory.",
            "Obtain immediate Pediatric Cardiology consultation for all high-risk patients.",
            "Perform a repeat 12-lead EKG and compare with prior EKGs if available.",
            "Check point-of-care glucose and serum electrolytes (Potassium, Magnesium, Calcium).",
            "Maintain bed rest until the patient is cleared by Cardiology for exertion.",
            "If currently in tachycardia, follow the SVT or Tachycardia algorithm immediately."
          ]
        }];
      case 'moderate':
        return [{
          title: "Evaluation of Suspected Re-entrant Tachycardia",
          recommendations: [
            "Obtain a 12-lead EKG to look for pre-excitation (WPW) or other clues.",
            "Place on a cardiac monitor for a period of observation to catch any recurrence.",
            "Discuss with Pediatric Cardiology; even if currently in sinus rhythm, these patients often require ambulatory monitoring (Holter/Event monitor).",
            "If the child is stable and the EKG is normal, they may be suitable for outpatient Cardiology referral within 24-48 hours."
          ]
        }];
      default: // mild
        return [{
          title: "Management of Benign Palpitations",
          recommendations: [
            "Reassure the patient and family. In the absence of red flags and with a normal EKG, most palpitations are benign.",
            "Educate on potential triggers: Caffeine, stimulants (ADHD meds), stress, and poor sleep.",
            "Rule out secondary causes (e.g., anemia, hyperthyroidism) if symptoms are persistent.",
            "Discharge with outpatient primary care or cardiology follow-up for a Holter monitor to provide definitive reassurance."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    const disposition = [];

    if (severity.level === 'severe') {
        disposition.push("ADMIT to a monitored bed (Telemetry or PICU) for urgent diagnostic workup and stabilization.");
    } else {
        disposition.push("SAFE DISCHARGE CRITERIA (Must meet ALL for discharge):");
        disposition.push("1. Hemodynamically stable with no ongoing palpitations.");
        disposition.push("2. 12-lead EKG is strictly normal (No WPW, Long QT, or hypertrophy).");
        disposition.push("3. No high-risk features (no syncope, no exertional onset).");
        disposition.push("4. Normal serum electrolytes (K, Mg, Ca) and glucose.");
        disposition.push("5. Pediatric Cardiology has been consulted (for moderate risk) or non-urgent referral is arranged.");
        disposition.push("6. Guaranteed reliable outpatient follow-up within 24-72 hours for ambulatory monitoring.");
    }

    return disposition;
  },
  getRedFlags: () => [
    "Palpitations associated with syncope or presyncope.",
    "Onset DURING physical activity (major red flag).",
    "Abrupt, sudden onset and termination ('light switch' effect).",
    "Family history of sudden unexplained death < 40 years old.",
    "Abnormal EKG findings (Pre-excitation, prolonged QTc).",
    "Presence of a significant heart murmur or known structural heart disease."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const adeno1 = Math.min(0.1 * weight, 6);
    const adeno2 = Math.min(0.2 * weight, 12);

    return [
      { drugName: "Adenosine 1st dose", dose: weight > 0 ? `${adeno1.toFixed(2)} mg rapid IV/IO push` : "0.1 mg/kg rapid IV/IO, max 6 mg", notes: "Only if SVT is present." },
      { drugName: "Adenosine 2nd dose", dose: weight > 0 ? `${adeno2.toFixed(2)} mg rapid IV/IO push` : "0.2 mg/kg rapid IV/IO, max 12 mg", notes: "Only if first dose fails and SVT persists." }
    ];
  },
  getReferences: () => [
      { title: "UpToDate: Palpitations in children", url: "https://www.uptodate.com/contents/palpitations-in-children" },
      { title: "AAP: Evaluation and Management of the Child with Palpitations", url: "https://publications.aap.org/pediatrics" }
  ],
};
