import type { DiseaseProtocol, FormData, Severity } from './types';

export const acuteFlaccidWeaknessProtocol: DiseaseProtocol = {
  id: 'acute-flaccid-weakness',
  name: 'Acute Flaccid Weakness',
  system: 'Neurology',
  description: 'Emergency evaluation of a child with acute flaccid weakness, with a focus on Guillain-Barré Syndrome (GBS) and Acute Flaccid Myelitis (AFM).',
  image: {
    url: "https://picsum.photos/seed/acute-flaccid-weakness/600/400",
    hint: "child wheelchair"
  },
  questions: [
    { id: 'respDistress', questionText: 'Any signs of respiratory distress?', type: 'boolean', info: 'e.g., increased work of breathing, paradoxical breathing, weak cough.' },
    { id: 'bulbarWeakness', questionText: 'Any signs of bulbar weakness?', type: 'boolean', info: 'e.g., difficulty swallowing, facial droop, dysarthria.' },
    { id: 'autonomicInstability', questionText: 'Any signs of autonomic instability?', type: 'boolean', info: 'e.g., labile blood pressure, heart rate fluctuations.' },
    { id: 'progression', questionText: 'Is the weakness progressing rapidly?', type: 'boolean' },
    { id: 'pattern', questionText: 'Pattern of weakness?', type: 'select', options: [{label: 'Ascending and symmetric (classic for GBS)', value: 'ascending'}, {label: 'Asymmetric (more common in AFM)', value: 'asymmetric'}] },
    { id: 'reflexes', questionText: 'Deep tendon reflexes?', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Decreased', value: 'decreased'}, {label: 'Absent (areflexia)', value: 'absent'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.respDistress || data.bulbarWeakness || data.autonomicInstability) {
      if(data.respDistress) details.push("Respiratory distress indicates impending respiratory failure.");
      if(data.bulbarWeakness) details.push("Bulbar weakness indicates risk of aspiration and airway compromise.");
      if(data.autonomicInstability) details.push("Autonomic instability indicates severe disease.");
      return { level: 'severe', details };
    }
    if (data.progression) {
      details.push("Rapidly progressing weakness requires urgent admission and monitoring.");
      return { level: 'moderate', details };
    }
    
    details.push("Acute weakness present without immediate life-threats, but requires urgent investigation.");
    return { level: 'mild', details }; // 'Mild' here is relative; any acute flaccid weakness is serious.
  },
  getManagement: (severity, data) => {
    return [{
      title: "Emergency Management of Acute Flaccid Weakness",
      recommendations: [
        "This is a neurologic emergency requiring immediate hospital admission.",
        "Closely monitor respiratory status with serial vital capacity (VC) or negative inspiratory force (NIF) measurements. Prepare for elective intubation for impending respiratory failure.",
        "Place on a cardiac monitor to watch for arrhythmias from autonomic dysfunction.",
        "Obtain urgent Neurology consultation.",
        "Lumbar Puncture: CSF analysis is crucial. In GBS, expect albuminocytologic dissociation (high protein, normal cell count). In AFM, expect pleocytosis (elevated white blood cells).",
        "MRI of the spine and brain with contrast to evaluate for spinal cord inflammation (characteristic gray matter involvement in AFM) or other causes.",
        "For suspected GBS: Treatment is supportive care plus either IVIG or plasmapheresis.",
        "For suspected AFM: Treatment is largely supportive. IVIG may be used. Report suspected cases to public health authorities.",
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with acute flaccid weakness require admission to the hospital for urgent diagnostic evaluation and monitoring.", "Patients with respiratory, bulbar, or autonomic involvement require PICU admission."];
  },
  getRedFlags: () => [
    "Respiratory distress or weak cough",
    "Difficulty handling secretions or dysphagia",
    "Facial weakness",
    "Rapidly ascending paralysis",
    "Labile blood pressure or heart rate",
    "Bowel or bladder dysfunction"
  ],
  getDrugDoses: () => [
      { drugName: "Intravenous Immunoglobulin (IVIG)", dose: "2 g/kg total dose, given over 2-5 days", notes: "First-line treatment for Guillain-Barré Syndrome." }
  ],
  getReferences: () => [
    { title: "CDC: Acute Flaccid Myelitis (AFM)", url: "https://www.cdc.gov/acute-flaccid-myelitis/index.html" },
    { title: "AAN: Practice guideline update summary: Guillain-Barré syndrome", url: "https://www.aan.com/Guidelines/home/GuidelineDetail/63" }
  ],
};
