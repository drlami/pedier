import type { DiseaseProtocol, FormData, Severity } from './types';

export const acuteAtaxiaProtocol: DiseaseProtocol = {
  id: 'acute-ataxia',
  name: 'Acute Ataxia',
  system: 'Neurology',
  description: 'Evaluation of a child presenting with acute ataxia (unsteady gait), with a focus on differentiating benign from life-threatening causes.',
  image: {
    url: "https://picsum.photos/seed/acute-ataxia/600/400",
    hint: "child stumbling"
  },
  questions: [
    { id: 'mentalStatus', questionText: 'Is there altered mental status, confusion, or lethargy?', type: 'boolean' },
    { id: 'fever', questionText: 'Is there a fever?', type: 'boolean' },
    { id: 'headacheVomiting', questionText: 'Is there headache or vomiting, especially if worse in the morning?', type: 'boolean' },
    { id: 'focalDeficit', questionText: 'Are there any other focal neurologic signs (e.g., cranial nerve palsies, weakness)?', type: 'boolean' },
    { id: 'trauma', questionText: 'Any history of recent head or neck trauma?', type: 'boolean' },
    { id: 'ingestion', questionText: 'Any possibility of toxic ingestion (e.g., alcohol, benzodiazepines, anticonvulsants)?', type: 'boolean' },
    { id: 'opsoclonusMyoclonus', questionText: 'Are there opsoclonus (chaotic eye movements) or myoclonus (jerking)?', type: 'boolean', info: "Suggests neuroblastoma" },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.mentalStatus || data.headacheVomiting || data.focalDeficit || data.trauma) {
      if(data.mentalStatus) details.push("Altered mental status");
      if(data.headacheVomiting) details.push("Headache/vomiting (concern for increased ICP)");
      if(data.focalDeficit) details.push("Focal neurologic deficits");
      if(data.trauma) details.push("History of trauma");
      details.push("Red flags present, indicating a potentially life-threatening cause. Urgent workup needed.");
      return { level: 'severe', details };
    }

    if (data.ingestion) {
      details.push("Suspicion for toxic ingestion. Requires specific management.");
      return { level: 'moderate', details };
    }

    if(data.fever) {
      details.push("Fever is present. Consider post-infectious cerebellitis.");
    }
    
    details.push("Isolated ataxia in a well-appearing child. Post-infectious cerebellitis is the most common cause, which is a diagnosis of exclusion.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch(severity.level) {
      case 'severe':
        return [{
          title: "Urgent Management of Ataxia with Red Flags",
          recommendations: [
            "This is a neurologic emergency. Stabilize ABCs.",
            "Obtain emergent neuroimaging (Head CT for trauma, MRI for posterior fossa tumor suspicion).",
            "Obtain urgent Neurology consultation.",
            "If trauma, maintain C-spine precautions.",
            "If increased ICP suspected, initiate measures to lower ICP (head elevation, hyperosmolar therapy)."
          ]
        }];
      case 'moderate':
        return [{
          title: "Management of Suspected Toxic Ingestion",
          recommendations: [
            "Obtain toxicology screen (urine and serum). Check specific levels if a known ingestion is suspected (e.g., ethanol, phenytoin).",
            "Provide supportive care.",
            "Consult toxicology or poison control center.",
            "Admission for observation is required."
          ]
        }];
      default: // mild
        return [{
          title: "Management of Suspected Post-Infectious Cerebellitis",
          recommendations: [
            "This is a diagnosis of exclusion. Life-threatening causes must be ruled out.",
            "A period of observation is warranted.",
            "Neurology consultation is recommended.",
            "Neuroimaging (MRI) is often performed to rule out structural lesions, even in well-appearing children.",
            "Lumbar puncture may be considered to rule out infectious/inflammatory causes.",
            "If symptoms are classic and workup is negative, supportive care is the mainstay of treatment. Most children recover fully."
          ]
        }];
    }
  },
  getDisposition: (severity, data) => {
    return ["All children with a new onset of acute ataxia require hospital admission for observation and diagnostic evaluation to rule out life-threatening conditions."];
  },
  getRedFlags: () => [
    "Altered mental status or lethargy",
    "Signs of increased intracranial pressure (persistent vomiting, headache, papilledema)",
    "Focal neurologic deficits (e.g., cranial nerve palsies)",
    "History of head trauma",
    "Opsoclonus-myoclonus (concern for neuroblastoma)",
    "Acute onset of ataxia following a streptococcal infection (Sydenham chorea)"
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "UpToDate: Acute ataxia in children", url: "https://www.uptodate.com/contents/acute-ataxia-in-children-approach-to-the-patient" }],
};
