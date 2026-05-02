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
    // BRUE Risk Stratification Questions
    { id: 'age', questionText: 'Age > 60 days?', type: 'boolean' },
    { id: 'gestationalAge', questionText: 'Gestational age at birth ≥ 32 weeks and postconceptional age ≥ 45 weeks?', type: 'boolean' },
    { id: 'isFirstEvent', questionText: 'Is this the first event?', type: 'boolean' },
    { id: 'duration', questionText: 'Duration of event < 1 minute?', type: 'boolean' },
    { id: 'cprRequired', questionText: 'Did the event require CPR by a trained medical provider?', type: 'boolean', info: "CPR by parent/caregiver does not automatically make it high risk." },
    { id: 'concerningHistory', questionText: 'Any concerning historical features?', type: 'boolean', info: 'Family hx of sudden death, prior events, etc.'},
    { id: 'abnormalPE', questionText: 'Any abnormal findings on physical exam?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // AAP criteria for Low-Risk vs High-Risk BRUE
    const details: string[] = [];
    
    const isLowRisk = 
      data.age && 
      data.gestationalAge && 
      data.isFirstEvent && 
      data.duration && 
      !data.cprRequired &&
      !data.concerningHistory &&
      !data.abnormalPE;

    if (isLowRisk) {
      details.push("Patient meets all criteria for a Lower-Risk BRUE.");
      return { level: 'mild', details };
    }
    
    if (!data.age) details.push("Age ≤ 60 days");
    if (!data.gestationalAge) details.push("Prematurity history");
    if (!data.isFirstEvent) details.push("Recurrent events");
    if (!data.duration) details.push("Event duration ≥ 1 minute");
    if (data.cprRequired) details.push("Required CPR by trained provider");
    if (data.concerningHistory) details.push("Concerning historical features found");
    if (data.abnormalPE) details.push("Abnormal physical exam");

    return { level: 'moderate', details: [...details, "Patient meets criteria for a Higher-Risk BRUE."] };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'mild') { // Low-Risk BRUE
      return [{
        title: "Lower-Risk BRUE Management",
        recommendations: [
          "Perform a thorough history and physical exam.",
          "Provide parent education about BRUE.",
          "Shared decision-making regarding next steps. Brief observation with continuous pulse oximetry and serial exams may be reasonable.",
          "Offer resources for caregiver CPR training.",
          "Routine lab testing, imaging, and EEG are NOT recommended for low-risk BRUE.",
          "Consider a 12-lead EKG."
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
    if (severity.level === 'mild') {
      return ["Discharge from the ED may be reasonable after a brief period of observation and shared decision-making with the family.", "Ensure prompt outpatient follow-up."];
    }
    return ["Infants with a higher-risk BRUE should be admitted to the hospital for monitoring and further evaluation."];
  },
  getRedFlags: () => [
    "Active apnea or respiratory distress on arrival.",
    "Any event that required CPR by a trained medical professional.",
    "Multiple events.",
    "Family history of sudden unexplained death in a young person.",
    "Physical exam findings concerning for infection, trauma, or a specific medical condition."
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "AAP Clinical Practice Guideline: Brief Resolved Unexplained Events", url: "https://publications.aap.org/pediatrics/article/137/5/e20160590/52458/Clinical-Practice-Guideline-Brief-Resolved" }],
};
