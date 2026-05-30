import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const vpShuntMalfunctionProtocol: DiseaseProtocol = {
  id: 'vp-shunt-malfunction',
  name: 'VP Shunt Malfunction',
  system: 'Neurology',
  description: 'Emergency assessment of suspected shunt failure or infection in patients with hydrocephalus.',
  image: {
    url: "https://picsum.photos/seed/shunt/600/400",
    hint: "neurosurgery shunt"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'vomiting', questionText: 'Vomiting or headache?', type: 'boolean' },
    { id: 'lethargy', questionText: 'Increased lethargy or irritability?', type: 'boolean' },
    { id: 'bulgingFontanelle', questionText: 'Bulging fontanelle or split sutures?', type: 'boolean', info: 'In infants with open sutures.' },
    { id: 'shuntTrackRedness', questionText: 'Redness/swelling over shunt tract?', type: 'boolean', info: 'Highly suggestive of shunt infection.' },
    { id: 'seizure', questionText: 'New onset seizure?', type: 'boolean' },
    { id: 'downSunGaze', questionText: 'Down-gaze (Sunsetting) eyes?', type: 'boolean' },
    { id: 'fever', questionText: 'Fever?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let dangerCount = 0;

    if (data.vomiting) dangerCount++;
    if (data.lethargy) dangerCount++;
    if (data.downSunGaze) dangerCount++;
    
    let level: SeverityLevel = 'moderate';
    let interpretation = 'Suspected Shunt Malfunction';

    if (data.downSunGaze === true || data.lethargy === true || data.bulgingFontanelle === true) {
      level = 'severe';
      interpretation = 'CRITICAL: INCREASED ICP / SHUNT FAILURE';
      details.push("High risk for brain herniation. Immediate neurosurgical consult required.");
    } else if (data.shuntTrackRedness === true || data.fever === true) {
      level = 'severe';
      interpretation = 'SUSPECTED SHUNT INFECTION';
      details.push("High risk for meningitis/ventriculitis.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Shunt Failure Risk",
        totalScore: dangerCount,
        maxScore: 3,
        interpretation,
        referenceTable: [
          { range: "Sunsetting/Lethargy", meaning: "CRITICAL Shunt Failure" },
          { range: "Redness/Fever", meaning: "Suspected Shunt Infection" },
          { range: "Vomiting Only", meaning: "Potential Malfunction - Needs Shunt Series" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    return [{
      title: "Emergency Shunt Management",
      recommendations: [
        "IMMEDIATELY contact Neurosurgery.",
        "Keep patient NPO in case of emergency surgery.",
        "Obtain a 'Shunt Series' (X-rays of Head, Neck, Chest, Abdomen).",
        "Obtain Head CT without contrast to compare ventricle size with previous scans.",
        "If Shunt Infection suspected: Obtain blood cultures and prepare for shunt tap (by Neurosurgery).",
        "Monitor neurological status (GCS and Pupils) every 15-30 minutes."
      ]
    }];
  },
  getDisposition: (severity) => ["All suspected shunt malfunctions require neurosurgical consultation and likely admission."],
  getRedFlags: () => ["Sunsetting eyes", "Vomiting", "Lethargy", "Bulging fontanelle", "Redness over tract"],
  getDrugDoses: (severity, data) => [],
  getReferences: () => [
    { title: "Hydrocephalus Association: ER Physician Shunt Guide", url: "https://www.hydroassoc.org/" }
  ],
};
