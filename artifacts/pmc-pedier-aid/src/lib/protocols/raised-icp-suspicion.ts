import type { DiseaseProtocol, FormData, Severity } from './types';

export const raisedIcpSuspicionProtocol: DiseaseProtocol = {
  id: 'raised-icp-suspicion',
  name: 'Raised ICP Suspicion',
  system: 'Neurology',
  description: 'Recognition and emergency management of suspected increased intracranial pressure (ICP), a neurologic emergency.',
  image: {
    url: "https://picsum.photos/seed/raised-icp-suspicion/600/400",
    hint: "brain pressure"
  },
  questions: [
    { id: 'hasCushingsTriad', questionText: 'Cushing\'s Triad present?', type: 'boolean', info: 'Hypertension, bradycardia, and irregular respirations. A late and ominous sign.' },
    { id: 'pupilChanges', questionText: 'Pupillary changes?', type: 'boolean', info: 'e.g., unilateral dilated pupil, sluggish reaction.' },
    { id: 'posturing', questionText: 'Posturing present?', type: 'select', options: [{label: 'None', value: 'none'}, {label: 'Decorticate (flexor)', value: 'decorticate'}, {label: 'Decerebrate (extensor)', value: 'decerebrate'}] },
    { id: 'gcs', questionText: 'Glasgow Coma Scale (GCS) Score', type: 'number' },
    { id: 'headacheVomiting', questionText: 'Headache, especially if worse in the morning or with Valsalva?', type: 'boolean' },
    { id: 'bulgingFontanelle', questionText: 'Bulging, tense fontanelle (in infants)?', type: 'boolean' },
    { id: 'papilledema', questionText: 'Papilledema on fundoscopic exam?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.hasCushingsTriad || data.pupilChanges || data.posturing !== 'none' || Number(data.gcs) <= 8) {
      if (data.hasCushingsTriad) details.push("Cushing's Triad present.");
      if (data.pupilChanges) details.push("Abnormal pupillary exam.");
      if (data.posturing !== 'none') details.push("Posturing present.");
      if (Number(data.gcs) <= 8) details.push("GCS <= 8.");
      details.push("Signs of impending or active brain herniation. This is a critical emergency.");
      return { level: 'severe', details };
    }

    if (data.headacheVomiting || data.bulgingFontanelle || data.papilledema) {
        details.push("Signs of increased ICP present, but no signs of active herniation.");
        return { level: 'moderate', details };
    }
    
    return { level: 'unknown', details: ["Assess for signs and symptoms to determine risk."] };
  },
  getManagement: (severity, data) => {
    return [{
      title: "EMERGENCY Management of Increased ICP",
      recommendations: [
        "This is a neurologic emergency. Activate emergency response and consult PICU/Neurosurgery immediately.",
        "Stabilize ABCs. Provide 100% oxygen. Intubate to secure airway if GCS <= 8 or signs of herniation, avoiding ketamine and using agents that don't raise ICP (e.g., etomidate, rocuronium).",
        "Elevate head of bed to 30 degrees with head in midline position.",
        "Maintain normothermia, normoglycemia, and normal blood pressure.",
        "Treat agitation and pain, as they can raise ICP. Ensure adequate sedation in intubated patients.",
        "Initiate hyperosmolar therapy: Administer either 3% Hypertonic Saline or Mannitol.",
        "Obtain emergent non-contrast Head CT as soon as patient is stabilized to identify cause (e.g., bleed, hydrocephalus, mass).",
        "Avoid lumbar puncture until a space-occupying lesion has been ruled out by imaging.",
        "Consider hyperventilation to a target pCO2 of 30-35 mmHg as a temporary bridge to definitive treatment in cases of active herniation."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["Immediate admission to the Pediatric Intensive Care Unit (PICU) is mandatory for all patients with suspected or confirmed increased ICP."];
  },
  getRedFlags: () => [
    "Cushing's Triad: Hypertension, Bradycardia, Irregular Respirations",
    "Unilateral or bilaterally fixed and dilated pupils",
    "Decorticate or decerebrate posturing",
    "A drop in GCS of 2 or more points",
    "Papilledema"
  ],
  getDrugDoses: () => [
    { drugName: "3% Hypertonic Saline", dose: "3-5 mL/kg bolus over 10-20 minutes", notes: "Can be given via peripheral IV. Check sodium levels." },
    { drugName: "Mannitol 20%", dose: "0.25-1 g/kg IV bolus over 10-20 minutes", notes: "Requires a central line for administration. May cause hypotension and electrolyte shifts." }
  ],
  getReferences: () => [{ title: "Brain Trauma Foundation: Guidelines for the Management of Severe TBI", url: "https://braintrauma.org/guidelines/guidelines-for-the-management-of-severe-tbi-4th-ed" }],
};
