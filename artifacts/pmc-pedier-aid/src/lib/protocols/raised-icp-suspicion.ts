import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const raisedIcpSuspicionProtocol: DiseaseProtocol = {
  id: 'raised-icp-suspicion',
  name: 'Increased ICP & Herniation Response',
  system: 'Neurological System',
  description: 'Emergency management of increased intracranial pressure and impending brain herniation.',
  image: {
    url: "https://picsum.photos/seed/raised-icp-suspicion/600/400",
    hint: "brain pressure"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'gcs', questionText: 'Current GCS Score', type: 'number', placeholder: '3-15' },
    { id: 'hypertension', questionText: 'Hypertension (Cushing Triad 1)', type: 'boolean' },
    { id: 'bradycardia', questionText: 'Bradycardia (Cushing Triad 2)', type: 'boolean' },
    { id: 'irregularBreathing', questionText: 'Irregular Breathing (Cushing Triad 3)', type: 'boolean' },
    { id: 'pupilChange', questionText: 'Unilateral fixed/dilated pupil?', type: 'boolean' },
    { id: 'posturing', questionText: 'Posturing? (Decerebrate/Decorticate)', type: 'boolean' },
    { id: 'fontanelle', questionText: 'Bulging fontanelle?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const gcs = Number(data.gcs || 15);
    
    const cushingCount = [data.hypertension, data.bradycardia, data.irregularBreathing].filter(Boolean).length;
    
    let level: SeverityLevel = 'moderate';
    let interpretation = 'Elevated ICP - High Risk';

    if (gcs <= 8 || cushingCount >= 2 || data.pupilChange === true || data.posturing === true) {
      level = 'severe';
      interpretation = 'CRITICAL: IMPENDING HERNIATION';
      details.push("Life-threatening emergency. Rapid decompression required.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "ICP Severity Status",
        totalScore: cushingCount,
        maxScore: 3,
        interpretation,
        referenceTable: [
          { range: "Herniation Signs", meaning: "Pupil change, GCS drop, Cushing's Triad" },
          { range: "Hyperosmolar Rx", meaning: "Indications for Mannitol or 3% Saline" },
          { range: "Hard Stop", meaning: "NO Lumbar Puncture" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    return [{
      title: "Immediate Herniation Response",
      recommendations: [
        "Elevate head of bed to 30° and maintain neck in midline position.",
        "Urgently assemble Neurosurgery and Anesthesia.",
        "Hyperosmolar Therapy: Start 3% Hypertonic Saline OR Mannitol immediately.",
        "Hyperventilation (Bridge only): Aim for pCO2 30-35 mmHg for 30-60 min.",
        "Secure airway (RSI) if GCS ≤ 8; maintain deep sedation/analgesia.",
        "HARD STOP: Lumbar Puncture is CONTRAINDICATED until imaging rules out mass effect.",
        "Obtain URGENT Head CT without contrast."
      ]
    }];
  },
  getDisposition: (severity) => ["Immediate PICU Admission with Neurosurgical involvement."],
  getRedFlags: () => ["Cushing's Triad", "Fixed/dilated pupil", "Decerebrate posturing", "Sudden GCS drop"],
  getDrugDoses: (severity, data) => {
      const weight = Number(data.weight) || 0;
      if (weight <= 0) return [];
      
      return [
        { drugName: "3% Hypertonic Saline", dose: `${(3 * weight).toFixed(0)} - ${(5 * weight).toFixed(0)} mL IV`, notes: "Give over 10-20 min. Monitor Na+." },
        { drugName: "Mannitol 20%", dose: `${(0.5 * weight).toFixed(1)} - ${(1 * weight).toFixed(1)} g IV`, notes: "Requires filter. Monitor BP for hypotension." }
      ];
  },
  getReferences: () => [
    { title: "PALS: Management of Elevated ICP", url: "https://cpr.heart.org/" }
  ],
};
