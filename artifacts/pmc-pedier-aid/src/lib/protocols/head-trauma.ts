import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const headTraumaProtocol: DiseaseProtocol = {
  id: 'head-trauma',
  name: 'Head Trauma (PECARN)',
  system: 'Neurology',
  description: 'Clinical decision rule for Neuroimaging in children with minor blunt head trauma.',
   image: {
    url: "https://picsum.photos/seed/headtrauma/600/400",
    hint: "head injury"
  },
  questions: [
    { 
      id: 'ageRange', 
      questionText: 'Patient Age', 
      type: 'select', 
      options: [
        {label: '< 2 Years Old', value: 'under2'}, 
        {label: '≥ 2 Years Old', value: 'over2'}
      ] 
    },
    // Questions for ALL ages
    { id: 'gcs', questionText: 'GCS Score', type: 'number', placeholder: '15' },
    { id: 'ams', questionText: 'Altered Mental Status?', type: 'boolean', info: 'Agitation, somnolence, repetitive questioning, or slow response' },
    
    // Age-specific High Risk
    { id: 'palpableFracture', questionText: 'Palpable Skull Fracture?', type: 'boolean', info: 'Only for < 2 years' },
    { id: 'basilarSigns', questionText: 'Signs of Basilar Skull Fracture?', type: 'boolean', info: 'Raccoon eyes, Battle sign, CSF rhinorrhea/otorrhea, hemotympanum. Only for ≥ 2 years' },
    
    // Age-specific Intermediate Risk
    { id: 'loc', questionText: 'Loss of Consciousness?', type: 'boolean' },
    { id: 'locDuration', questionText: 'LOC Duration > 5 seconds?', type: 'boolean', info: 'Only for < 2 years' },
    { id: 'severeMechanism', questionText: 'Severe Mechanism of Injury?', type: 'boolean', info: 'MVC with ejection, death of passenger, or rollover; Pedestrian or unhelmeted cyclist struck by motorized vehicle; Fall >3 ft (<2yr) or >5 ft (≥2yr); or Head struck by high-mass object.' },
    { id: 'scalpHematoma', questionText: 'Non-frontal Scalp Hematoma?', type: 'boolean', info: 'Occipital, parietal, or temporal. Only for < 2 years' },
    { id: 'actingNormally', questionText: 'Acting normally per parent?', type: 'boolean', info: 'Only for < 2 years (Select NO if not acting normally)' },
    { id: 'vomiting', questionText: 'History of Vomiting?', type: 'boolean', info: 'Only for ≥ 2 years' },
    { id: 'severeHeadache', questionText: 'Severe Headache?', type: 'boolean', info: 'Only for ≥ 2 years' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const isUnder2 = data.ageRange === 'under2';
    const gcs = Number(data.gcs || 15);
    
    // 1. High Risk (CiBHI risk ~4%)
    const highRisk = (gcs <= 14) || (data.ams === true) || 
                     (isUnder2 && data.palpableFracture === true) ||
                     (!isUnder2 && data.basilarSigns === true);
                     
    if (highRisk) {
      return {
        level: 'severe',
        scoreDetails: {
          systemName: "PECARN Rule",
          totalScore: 1,
          interpretation: "High Risk for ciBHI",
          referenceTable: [
            { range: "High Risk", meaning: "CT Recommended (risk of ciBHI ~4%)" },
            { range: "Intermediate Risk", meaning: "Observation vs CT (risk of ciBHI ~0.9%)" },
            { range: "Low Risk", meaning: "CT Not Recommended (risk of ciBHI <0.02%)" }
          ]
        },
        details: ["CT Scan of the head is strongly recommended."]
      };
    }

    // 2. Intermediate Risk (CiBHI risk ~0.9%)
    let intermediateRisk = false;
    if (isUnder2) {
      intermediateRisk = (data.loc === true && data.locDuration === true) || 
                         (data.severeMechanism === true) || 
                         (data.scalpHematoma === true) || 
                         (data.actingNormally === false);
    } else {
      intermediateRisk = (data.loc === true) || 
                         (data.vomiting === true) || 
                         (data.severeMechanism === true) || 
                         (data.severeHeadache === true);
    }

    if (intermediateRisk) {
      return {
        level: 'moderate',
        scoreDetails: {
          systemName: "PECARN Rule",
          totalScore: 2,
          interpretation: "Intermediate Risk for ciBHI",
          referenceTable: [
            { range: "High Risk", meaning: "CT Recommended (risk of ciBHI ~4%)" },
            { range: "Intermediate Risk", meaning: "Observation vs CT (risk of ciBHI ~0.9%)" },
            { range: "Low Risk", meaning: "CT Not Recommended (risk of ciBHI <0.02%)" }
          ]
        },
        details: ["Observation vs. CT based on clinician experience, multiple findings, or parental preference."]
      };
    }

    // 3. Low Risk (CiBHI risk <0.02%)
    return {
      level: 'no',
      scoreDetails: {
        systemName: "PECARN Rule",
        totalScore: 3,
        interpretation: "Low Risk for ciBHI",
        referenceTable: [
          { range: "High Risk", meaning: "CT Recommended (risk of ciBHI ~4%)" },
          { range: "Intermediate Risk", meaning: "Observation vs CT (risk of ciBHI ~0.9%)" },
          { range: "Low Risk", meaning: "CT Not Recommended (risk of ciBHI <0.02%)" }
        ]
      },
      details: ["CT Scan of the head is NOT recommended."]
    };
  },
  getManagement: (severity) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "High Risk Management",
          recommendations: [
            "Obtain immediate CT head without contrast.",
            "Consider Neurosurgical consultation if CT is positive.",
            "Monitor GCS and neurological status frequently."
          ]
        }];
      case 'moderate':
        return [{
          title: "Intermediate Risk Management",
          recommendations: [
            "Clinical observation (4-6 hours) may be appropriate if there is only a single isolated finding.",
            "If multiple intermediate findings are present, the risk increases; consider CT.",
            "Discuss risks/benefits of CT vs. observation with caregivers (shared decision making)."
          ]
        }];
      case 'no':
        return [{
          title: "Low Risk Management",
          recommendations: [
            "Neuroimaging is not indicated.",
            "Provide written head injury discharge instructions.",
            "Advise parents on return precautions (worsening headache, persistent vomiting, etc.)."
          ]
        }];
      default:
        return [{ title: 'Awaiting Assessment', recommendations: ['Complete PECARN criteria to determine risk.'] }];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Hospital admission likely required for monitoring or intervention."];
    if (severity.level === 'moderate') return ["Observe in ED for 4-6 hours. Discharge if neurologically stable and caregivers are reliable."];
    return ["Discharge home with clear head injury instructions."];
  },
  getRedFlags: () => [
    "GCS score < 15",
    "Signs of basilar skull fracture",
    "Persistent or worsening altered mental status",
    "Seizure following trauma",
    "Focal neurological deficits"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "PECARN: Identification of children at very low risk of clinically-important brain injuries after head trauma", url: "https://pubmed.ncbi.nlm.nih.gov/19758525/" }
  ],
};
