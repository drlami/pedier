import type { DiseaseProtocol, FormData, Severity } from './types';

export const apneaProtocol: DiseaseProtocol = {
  id: 'apnea',
  name: 'Apnea / BRUE',
  system: 'Respiratory',
  description: 'Evaluation of an infant presenting with apnea or a Brief Resolved Unexplained Event (BRUE).',
  image: {
    url: "https://picsum.photos/seed/apnea/600/400",
    hint: "sleeping infant"
  },
  questions: [
    { id: 'activeApnea', questionText: 'Active apnea, cyanosis, respiratory distress, or unstable vitals now?', type: 'boolean' },
    { id: 'explainedEvent', questionText: 'Is there an apparent explanation after history/exam?', type: 'boolean', info: 'Examples: choking/aspiration, infection, seizure, trauma/NAT, reflux with choking, arrhythmia, metabolic problem.' },
    { id: 'ageDays', questionText: 'Age', type: 'number', unit: 'days' },
    { id: 'gestationalAgeWeeks', questionText: 'Gestational age at birth', type: 'number', unit: 'weeks' },
    { id: 'postConceptionalAgeWeeks', questionText: 'Post-conceptional age', type: 'number', unit: 'weeks' },
    { id: 'isFirstEvent', questionText: 'Is this the first event?', type: 'boolean' },
    { id: 'durationSeconds', questionText: 'Event duration', type: 'number', unit: 'seconds' },
    { id: 'cprRequired', questionText: 'Did the event require CPR by a trained medical provider?', type: 'boolean', info: "CPR by parent/caregiver does not automatically make it high risk." },
    { id: 'concerningHistory', questionText: 'Any concerning historical features?', type: 'boolean', info: 'Family hx of sudden death, prior events, etc.'},
    { id: 'abnormalPE', questionText: 'Any abnormal findings on physical exam?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // AAP criteria for Low-Risk vs High-Risk BRUE
    const details: string[] = [];
    const ageDays = Number(data.ageDays);
    const gestationalAgeWeeks = Number(data.gestationalAgeWeeks);
    const postConceptionalAgeWeeks = Number(data.postConceptionalAgeWeeks);
    const durationSeconds = Number(data.durationSeconds);

    if (data.activeApnea) {
      return { level: 'severe', details: ["Active apnea/respiratory distress/unstable vitals. Stabilize first; this is not a lower-risk BRUE assessment."] };
    }

    if (data.explainedEvent) {
      return { level: 'moderate', details: ["Event appears explained by history or exam. Manage the suspected cause rather than labeling as BRUE."] };
    }
    
    const isLowRisk = 
      ageDays > 60 &&
      gestationalAgeWeeks >= 32 &&
      postConceptionalAgeWeeks >= 45 &&
      data.isFirstEvent && 
      durationSeconds > 0 &&
      durationSeconds < 60 &&
      !data.cprRequired &&
      !data.concerningHistory &&
      !data.abnormalPE;

    if (isLowRisk) {
      details.push("Patient meets all criteria for a Lower-Risk BRUE.");
      return { level: 'mild', details };
    }
    
    if (!(ageDays > 60)) details.push("Age ≤ 60 days or age not entered");
    if (!(gestationalAgeWeeks >= 32 && postConceptionalAgeWeeks >= 45)) details.push("Prematurity or post-conceptional age below lower-risk criteria");
    if (!data.isFirstEvent) details.push("Recurrent events");
    if (!(durationSeconds > 0 && durationSeconds < 60)) details.push("Event duration ≥ 1 minute or duration not entered");
    if (data.cprRequired) details.push("Required CPR by trained provider");
    if (data.concerningHistory) details.push("Concerning historical features found");
    if (data.abnormalPE) details.push("Abnormal physical exam");

    return { level: 'moderate', details: [...details, "Patient meets criteria for a Higher-Risk BRUE."] };
  },
  getManagement: (severity, data) => {
    if (data.activeApnea) {
      return [{
        title: "Emergency Stabilization",
        recommendations: [
          "Move to resuscitation area and call senior clinician/PICU immediately.",
          "Assess airway, breathing, circulation; provide oxygen and bag-mask ventilation if needed.",
          "Check glucose immediately and treat hypoglycemia.",
          "Place on continuous cardiorespiratory and pulse oximetry monitoring.",
          "Evaluate and treat likely causes: infection/sepsis, seizure, choking/aspiration, trauma/NAT, arrhythmia, metabolic disturbance."
        ]
      }];
    }

    if (data.explainedEvent) {
      return [{
        title: "Explained Event — Not BRUE",
        recommendations: [
          "Do not label as BRUE if a likely explanation is found after history or examination.",
          "Manage according to the suspected cause, such as choking/aspiration, bronchiolitis, sepsis, seizure, arrhythmia, reflux with choking, trauma/NAT, or metabolic disease.",
          "Disposition and investigations should follow the identified diagnosis and clinical stability."
        ]
      }];
    }

    if (severity.level === 'mild') { // Low-Risk BRUE
      return [{
        title: "Lower-Risk BRUE Management",
        recommendations: [
          "Perform a thorough history and physical exam.",
          "Provide parent education about BRUE.",
          "Shared decision-making regarding next steps. Brief observation with continuous pulse oximetry and serial exams may be reasonable.",
          "Offer resources for caregiver CPR training.",
          "Routine lab testing, imaging, and EEG are NOT recommended for low-risk BRUE.",
          "Consider a 12-lead EKG.",
          "Ensure no recurrent event, abnormal vitals, abnormal exam, or concerning history emerges during observation."
        ]
      }];
    } else { // High-Risk BRUE
      return [{
        title: "Higher-Risk BRUE Management",
        recommendations: [
          "Admit the infant for continuous cardiorespiratory monitoring.",
          "Further evaluation should be guided by history and physical exam findings.",
          "Consider investigations such as:",
          "- Sepsis workup (blood culture, urinalysis/culture, +/- LP) if infection is suspected.",
          "- 12-lead EKG.",
          "- Labs for metabolic disorders (glucose, electrolytes).",
          "- Pertussis testing if cough is present.",
          "- Consider EEG if seizure activity is suspected.",
          "- Consider imaging for non-accidental trauma if indicated by history/exam."
        ]
      }];
    }
  },
  getDisposition: (severity, data) => {
    if (data.activeApnea) {
      return ["Admit to monitored setting/PICU depending on response and cause. Do not discharge an infant with active apnea, unstable vitals, persistent hypoxemia, or abnormal exam."];
    }
    if (data.explainedEvent) {
      return ["Disposition depends on the identified cause and clinical stability. Treat and disposition by diagnosis rather than BRUE risk criteria."];
    }
    if (severity.level === 'mild') {
      return ["Discharge from the ED may be reasonable after brief observation, normal vitals/exam, no recurrence, caregiver education, and shared decision-making with the family.", "Ensure prompt outpatient follow-up and provide return precautions and CPR training resources."];
    }
    return ["Infants with a higher-risk BRUE should be admitted to the hospital for monitoring and further evaluation."];
  },
  getRedFlags: () => [
    "Active apnea or respiratory distress on arrival.",
    "Event has an apparent explanation such as infection, seizure, choking/aspiration, trauma, arrhythmia, or metabolic disease.",
    "Any event that required CPR by a trained medical professional.",
    "Multiple events.",
    "Family history of sudden unexplained death in a young person.",
    "Physical exam findings concerning for infection, trauma, or a specific medical condition."
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "AAP Clinical Practice Guideline: Brief Resolved Unexplained Events", url: "https://publications.aap.org/pediatrics/article/137/5/e20160590/52458/Clinical-Practice-Guideline-Brief-Resolved" }],
};
