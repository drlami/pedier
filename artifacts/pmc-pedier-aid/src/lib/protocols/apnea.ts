/**
 * BRUE (Brief Resolved Unexplained Event) Protocol
 * Source: Nelson Textbook of Pediatrics, 22nd Ed., Chapter 424 — "Brief Resolved
 * Unexplained Events and Other Acute Events in Infants" (DeLaroche & Tieder), pp. 2541–2544.
 * Underlying evidence base: Tieder JS, Bonkowsky JL, Etzel RA, et al. AAP Clinical
 * Practice Guideline. Pediatrics. 2016;137(5):e20160590.
 */
import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'age_young',        question: 'Age ≤ 60 days at time of event?', redFlag: true, ifYes: 'Fails the lower-risk age criterion — treat as higher-risk BRUE regardless of other findings.' },
    { id: 'prematurity',      question: 'Born < 32 weeks gestation, OR postconceptional age < 45 weeks?', redFlag: true, ifYes: 'Preterm infants tolerate apnea/hypoxia poorly and are at higher risk for apnea of prematurity as an underlying cause.' },
    { id: 'recurrent_cluster',question: 'Any prior BRUE ever, or is this event part of a cluster (multiple similar episodes close together)?', redFlag: true, ifYes: 'Recurrent or clustered events are a higher-risk feature — broaden the differential (seizures, cardiac arrhythmia, airway anomaly, abuse).' },
    { id: 'long_duration',    question: 'Event duration ≥ 1 minute?', redFlag: true, ifYes: 'Prolonged events fail the lower-risk duration criterion.' },
    { id: 'cpr_given',        question: 'CPR performed by a trained medical provider?', redFlag: true, ifYes: 'Automatic higher-risk feature — evaluate urgently for a serious underlying cause.' },
    { id: 'ill_feverish',     question: 'Preceding fever, URI symptoms, or ill appearance?', redFlag: true, ifYes: 'Consider infectious causes: pertussis, RSV/viral illness, bacteremia, meningitis, UTI (see Nelson Table 424.1).' },
    { id: 'feeding_history',  question: 'Choking, gagging, or coughing temporally related to feeding, or event occurred during/after a feed?', ifYes: 'Suggests GER, oropharyngeal dysphagia, or laryngospasm rather than a true BRUE — consider feeding/swallow evaluation.' },
    { id: 'trauma_concern',   question: 'Bruising (especially in a nonmobile infant), frenulum tear, discrepant/vague history, or single unwitnessed observer?', redFlag: true, ifYes: 'Concerning for nonaccidental trauma / abusive head trauma — obtain skeletal survey, head CT/MRI, dilated fundoscopic exam, and social work evaluation. Abusive head trauma is a leading serious cause identified after BRUE evaluation.' },
    { id: 'family_history',   question: 'Family history of unexplained/sudden death, cardiac arrhythmia, BRUE, or SIDS?', redFlag: true, ifYes: 'Raises concern for inherited arrhythmia (e.g., prolonged QT) or metabolic/genetic disease — consider ECG and genetics/cardiology input.' },
    { id: 'abnormal_exam',    question: 'Any abnormal physical exam finding (abnormal vitals, murmur, decreased femoral pulses, dysmorphic features, neuro abnormality)?', redFlag: true, ifYes: 'Fails the lower-risk exam criterion — findings should directly guide targeted workup (e.g., echocardiogram for a murmur, neuroimaging for neuro findings).' },
    { id: 'explained_cause',  question: 'Is there an obvious explanation for the event (e.g., simple choking/reflux, breath-holding spell, seizure, CHD, epilepsy, metabolic disease)?', redFlag: true, ifYes: 'This is NOT a BRUE by definition — do not apply the BRUE risk pathway. Manage the specific identified/suspected cause directly.' },
  ],

  investigations: [
    { test: 'Continuous pulse oximetry (brief ED observation, 1–4 h)', category: 'urgent', indication: 'The one intervention supported for essentially all BRUE presentations — used to detect recurrent hypoxemia/apnea and characterize repeat events.' },
    { test: '12-lead ECG', category: 'other', indication: 'Not routine. Consider if there is a concerning family history (sudden death, arrhythmia) — may reveal prolonged QTc.' },
    { test: 'Pertussis NP PCR', category: 'blood', indication: 'Consider only if the infant is underimmunized or has a known pertussis exposure. Pertussis/RSV can present with apnea before typical URI symptoms.' },
    { test: 'Rapid respiratory viral PCR', category: 'blood', indication: 'Can identify a subclinical viral cause, but a positive result may reflect a recent past infection rather than the cause of the event — interpret with caution.' },
    { test: 'CBC, blood culture, urinalysis/culture, CSF analysis', category: 'blood', indication: 'NOT routine in lower-risk infants — low yield, high false-positive rate. Reserve for higher-risk infants with fever, ill appearance, or other infectious concern.' },
    { test: 'Serum glucose, electrolytes, calcium, magnesium, lactate, ammonia', category: 'blood', indication: 'Indication-based only — order if there are metabolic/genetic concerns (severe or recurrent events, growth failure, dysmorphic features, consanguinity, family history).' },
    { test: 'Chest X-ray', category: 'radiology', indication: 'NOT routine. Order only if there are respiratory signs (wheeze, stridor, crackles) or suspicion of aspiration/infection.' },
    { test: 'Head CT/MRI ± skeletal survey', category: 'radiology', indication: 'Indicated when there is suspicion of nonaccidental trauma (bruising in a nonmobile infant, discrepant history, unexplained sibling death) — NOT routine otherwise.' },
    { test: 'EEG / neurology consult', category: 'other', indication: 'Indication-based for suspected seizure. Reasonable to arrange as an outpatient in a well-appearing infant rather than in the ED.' },
    { test: 'Echocardiogram', category: 'other', indication: 'Indicated for a murmur, decreased femoral pulses, or other exam findings suggesting congenital heart disease — not routine.' },
  ],

  admissionCriteria: [
    'Recurrent event, or ongoing hypoxemia/apnea, during the ED observation period',
    'CPR was required by a trained provider',
    'Higher-risk features with a specific concern requiring inpatient workup (e.g., suspected trauma, cardiac, or metabolic disease)',
    'Unreliable follow-up, caregiver unable to perform CPR/monitor the infant, or significant social/safety concern',
  ],

  highRiskFactors: [
    'Age ≤ 60 days',
    'Born < 32 weeks gestation or postconceptional age < 45 weeks',
    'Recurrent BRUE (ever) or events occurring in a cluster',
    'Event duration ≥ 1 minute',
    'CPR performed by a trained medical provider',
    'Concerning historical features (fever/illness, discrepant history, family history of sudden death)',
    'Abnormal physical examination findings',
  ],

  dischargeCriteria: [
    'Meets ALL lower-risk criteria (age > 60 days, born ≥ 32 weeks with PCA ≥ 45 weeks, single event not in a cluster, duration < 1 min, no CPR, no concerning history, normal exam)',
    'Stable, reassuring brief observation period on continuous pulse oximetry',
    'No recurrent event during observation',
    'Caregivers educated about BRUE, reassured, and offered CPR training resources',
    'Reliable close outpatient follow-up with a primary care physician arranged',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: another event occurs, the infant turns blue/pale, breathing stops or becomes irregular, tone changes markedly, or responsiveness is altered.',
    'DO NOT use a home apnea/cardiorespiratory monitor — there is no evidence it reduces risk, and BRUEs are not precursors to SIDS.',
    'CPR training is recommended for all caregivers of an infant with a BRUE, regardless of risk category.',
    'Close follow-up with the primary care physician is essential — almost half of serious underlying diagnoses are NOT identified at the first visit for a BRUE.',
    'The overall risk of death after a BRUE is very low and approximates the baseline risk of death in the first year of life; BRUEs are not associated with SIDS.',
  ],
};

export const apneaProtocol: DiseaseProtocol = {
  id: 'apnea',
  name: 'BRUE (Brief Resolved Unexplained Event)',
  system: 'Respiratory System',
  description: 'Risk stratification and management of BRUE in infants < 1 year, based on the AAP 2016 Clinical Practice Guideline as presented in Nelson Textbook of Pediatrics, 22nd ed., Ch. 424.',
  lastUpdated: '2024',
  image: {
    url: "https://picsum.photos/seed/apnea/600/400",
    hint: "sleeping infant"
  },
  erData,
  questions: [
    { id: 'ageDays', questionText: 'Age (Days)', type: 'number', unit: 'days' },
    { id: 'gestationalAge', questionText: 'Gestational Age at Birth', type: 'number', unit: 'weeks' },
    { id: 'eventDuration', questionText: 'Duration of Event (Seconds)', type: 'number', unit: 'sec' },
    { id: 'recurrentOrCluster', questionText: 'Prior BRUE ever, or is this event part of a cluster of episodes?', type: 'boolean', info: 'Lower-risk requires this to be a single, isolated event — no prior BRUE ever AND not occurring in a cluster.' },
    { id: 'cprRequired', questionText: 'Was CPR performed by a trained provider?', type: 'boolean' },
    { id: 'concerningHistory', questionText: 'Any concerning historical features?', type: 'boolean', info: 'E.g., fever/URI symptoms, ill appearance, feeding difficulty during the event, recent trauma, discrepant/vague history, family history of sudden unexplained death, arrhythmia, or BRUE.' },
    { id: 'abnormalExam', questionText: 'Any abnormal physical exam findings?', type: 'boolean', info: 'E.g., abnormal vital signs, murmur, decreased femoral pulses, dysmorphic features, bruising, or neurologic abnormality.' },
    { id: 'explainedCause', questionText: 'Is there an obvious cause (e.g. choking, reflux, seizure, infection, CHD)?', type: 'boolean', info: 'If YES, this is NOT a BRUE by definition — manage the specific identified/suspected cause instead of applying the BRUE risk pathway.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const age = Number(data.ageDays || 0);
    const gestAge = Number(data.gestationalAge || 40);
    const duration = Number(data.eventDuration || 0);

    if (data.explainedCause === true) {
      return {
        level: 'moderate',
        scoreDetails: {
          systemName: "AAP BRUE Risk Criteria",
          totalScore: 0,
          interpretation: "Not a BRUE — Explained Cause Identified",
          referenceTable: [
            { range: "Not a BRUE", meaning: "An explanation was identified on history/exam — manage that specific cause, not the BRUE pathway" },
          ]
        },
        details: ["Not a BRUE: an apparent explanation was found on history or exam. Manage the underlying cause directly rather than risk-stratifying as a BRUE."],
      };
    }

    // AAP Lower-Risk Criteria (Nelson Ch. 424 / Tieder et al. Pediatrics 2016):
    // 1. Age > 60 days
    // 2. Gestational age >= 32 weeks AND postconceptional age >= 45 weeks
    // 3. Only 1 BRUE — no prior BRUE ever and not occurring in a cluster
    // 4. Duration of event < 1 minute
    // 5. No CPR by a trained provider
    // 6. No concerning historical features
    // 7. No concerning physical exam findings

    const postConceptualAge = gestAge + (age / 7);

    if (age <= 60) details.push('Age ≤ 60 days — fails lower-risk age criterion.');
    if (gestAge < 32 || postConceptualAge < 45) details.push('Born < 32 weeks or postconceptional age < 45 weeks — higher-risk for apnea of prematurity.');
    if (data.recurrentOrCluster === true) details.push('Prior BRUE or clustered events — higher-risk, broaden differential.');
    if (duration >= 60) details.push('Event duration ≥ 1 minute — fails lower-risk duration criterion.');
    if (data.cprRequired === true) details.push('CPR by a trained provider was required — automatic higher-risk, evaluate urgently.');
    if (data.concerningHistory === true) details.push('Concerning historical features present — higher-risk.');
    if (data.abnormalExam === true) details.push('Abnormal exam findings present — higher-risk, let findings guide targeted workup.');

    const isLowerRisk =
        age > 60 &&
        gestAge >= 32 &&
        postConceptualAge >= 45 &&
        data.recurrentOrCluster !== true &&
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
          { range: "Higher-Risk", meaning: "Fails 1 or more criteria; individualize workup/disposition" }
        ]
      },
      details
    };
  },
  getManagement: (severity, data) => {
    if (data?.explainedCause === true) {
      return [{
        title: "Not a BRUE — Manage the Underlying Cause",
        recommendations: [
          "Do not apply the BRUE risk-stratification pathway — an explanation was already identified on history or exam.",
          "Manage per the specific identified/suspected diagnosis (e.g., GER, breath-holding spell, seizure, infection, congenital heart disease) using the relevant disease-specific protocol.",
          "Further testing and disposition should be guided entirely by that diagnosis, not by BRUE higher-risk criteria."
        ]
      }];
    }

    if (severity.level === 'mild') {
        return [{
            title: "Lower-Risk Management",
            recommendations: [
                "Brief observation with continuous pulse oximetry (typically 1–4 hours) in the ED.",
                "Educate parents about BRUE and provide reassurance — BRUEs are not precursors to SIDS.",
                "Offer CPR training resources to caregivers.",
                "Routine labs, CXR, and neuroimaging are NOT recommended.",
                "Consider ECG only if there is a concerning family history.",
                "Consider pertussis testing only if underimmunized or exposed.",
                "Do NOT prescribe a home apnea/cardiorespiratory monitor.",
                "Arrange close outpatient follow-up with the primary care physician."
            ]
        }];
    } else {
        return [{
            title: "Higher-Risk Management (Individualized)",
            recommendations: [
                "Management is individualized — there is no fixed test battery. Let the specific concerning history/exam findings guide workup.",
                "Consider targeted testing as indicated: sepsis workup, metabolic/electrolyte panel, ECG ± echocardiogram (cardiac concern), neuroimaging/EEG (neuro or trauma concern), skeletal survey (suspected abuse), swallow evaluation (dysphagia concern).",
                "A period of continuous pulse oximetry/cardiorespiratory monitoring can help characterize repeat events.",
                "The value of hospital admission is debatable — it uncommonly leads to a diagnosis on its own. Incorporate family needs/preferences and reliability of follow-up into the decision.",
                "Do NOT discharge with a home apnea monitor.",
                "Offer CPR training resources to caregivers.",
                "Arrange close outpatient follow-up — almost half of serious underlying diagnoses are not identified at the first visit."
            ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    if (data?.explainedCause === true) return ["Disposition follows the identified/suspected diagnosis — not the BRUE pathway."];
    if (severity.level === 'mild') return ["Discharge from ED after brief observation and shared decision-making. Arrange close PCP follow-up within 24–48 hours."];
    return ["Individualized: admission vs. discharge with close follow-up, based on shared decision-making, specific concerns identified, and reliability of caregiver follow-up. Admission does not guarantee a diagnosis will be found."];
  },
  getRedFlags: () => [
    "Recurrent BRUE or events occurring in a cluster",
    "Age ≤ 60 days",
    "Born < 32 weeks gestation or postconceptional age < 45 weeks",
    "CPR required by a trained provider",
    "Abnormal physical exam findings",
    "Bruising (especially nonmobile infant), frenulum tear, or discrepant history — consider nonaccidental trauma",
    "Family history of unexplained/sudden death, arrhythmia, or BRUE",
    "Do NOT use home apnea monitors — not supported by evidence"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "Nelson Textbook of Pediatrics, 22nd Ed. — Ch. 424: Brief Resolved Unexplained Events and Other Acute Events in Infants (DeLaroche & Tieder, 2024), pp. 2541–2544", url: "https://www.clinicalkey.com" },
    { title: "AAP BRUE Clinical Practice Guideline (2016)", url: "https://publications.aap.org/pediatrics/article/137/5/e20160590/52458/Clinical-Practice-Guideline-Brief-Resolved" }
  ],
};
