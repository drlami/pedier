import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const apneaProtocol: DiseaseProtocol = {
  id: 'apnea',
  name: 'BRUE (Brief Resolved Unexplained Event)',
  system: 'Respiratory System',
  description: 'Risk stratification and management of BRUE in infants based on AAP 2016 Guidelines.',
  image: {
    url: "https://picsum.photos/seed/apnea/600/400",
    hint: "sleeping infant"
  },
  questions: [
    { id: 'ageDays', questionText: 'Age (Days)', type: 'number', unit: 'days' },
    { id: 'gestationalAge', questionText: 'Gestational Age at Birth', type: 'number', unit: 'weeks' },
    { id: 'eventDuration', questionText: 'Duration of Event (Seconds)', type: 'number', unit: 'sec' },
    { id: 'isFirstEvent', questionText: 'Is this the first event?', type: 'boolean' },
    { id: 'cprRequired', questionText: 'Was CPR performed by a trained provider?', type: 'boolean' },
    { id: 'concerningHistory', questionText: 'Family history of sudden unexplained death?', type: 'boolean' },
    { id: 'abnormalExam', questionText: 'Any abnormal physical exam findings?', type: 'boolean' },
    { id: 'explainedCause', questionText: 'Is there an obvious cause (e.g. choking, seizure, infection)?', type: 'boolean', info: 'If YES, it is not a BRUE. Manage the specific cause.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const age = Number(data.ageDays || 0);
    const gestAge = Number(data.gestationalAge || 40);
    const duration = Number(data.eventDuration || 0);

    if (data.explainedCause === true) {
        return { level: 'moderate', details: ["Not a BRUE: An apparent explanation was found. Manage accordingly."] };
    }

    // AAP Lower-Risk Criteria:
    // 1. Age > 60 days
    // 2. Gestational age >= 32 weeks AND Post-conceptual age >= 45 weeks
    // 3. First event (not recurrent)
    // 4. Duration < 60 seconds
    // 5. No CPR by trained provider
    // 6. No concerning history or physical exam findings
    
    const postConceptualAge = gestAge + (age / 7);
    
    const isLowerRisk = 
        age > 60 && 
        gestAge >= 32 && 
        postConceptualAge >= 45 &&
        data.isFirstEvent === true &&
        duration < 60 &&
        data.cprRequired === false &&
        data.concerningHistory === false &&
        data.abnormalExam === false;

    let level: SeverityLevel = 'moderate';
    let interpretation = 'Higher-Risk BRUE';

    if (isLowerRisk) {
        level = 'mild';
        interpretation = 'Lower-Risk BRUE';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "AAP BRUE Risk Criteria",
        totalScore: isLowerRisk ? 0 : 1,
        interpretation,
        referenceTable: [
          { range: "Lower-Risk", meaning: "Meets ALL AAP safety criteria" },
          { range: "Higher-Risk", meaning: "Fails 1 or more criteria; Admission recommended" }
        ]
      },
      details 
    };
  },
  getManagement: (severity) => {
    if (severity.level === 'mild') {
        return [{
            title: "Lower-Risk Management",
            recommendations: [
                "Brief observation with pulse oximetry (1-4 hours).",
                "Educate parents on BRUE and provide reassurance.",
                "Offer resources for CPR training to caregivers.",
                "NO routine labs, CXR, or neuroimaging required.",
                "Consider 12-lead EKG (optional)."
            ]
        }];
    } else {
        return [{
            title: "Higher-Risk Management",
            recommendations: [
                "Admission for continuous cardiorespiratory monitoring.",
                "Evaluate for specific causes: Sepsis workup, Neuroimaging, or Metabolic screen as indicated by history.",
                "12-lead EKG is recommended.",
                "Consider social work or specialist consultation."
            ]
        }];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'mild') return ["Discharge from ED after observation and shared decision making."];
    return ["Admit for inpatient monitoring."];
  },
  getRedFlags: () => ["Recurrent events", "Age < 60 days", "Prematurity", "CPR required", "Abnormal exam"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAP BRUE Clinical Practice Guideline (2016)", url: "https://publications.aap.org/pediatrics/article/137/5/e20160590/52458/Clinical-Practice-Guideline-Brief-Resolved" }
  ],
};
