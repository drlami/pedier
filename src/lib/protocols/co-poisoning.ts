import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const coPoisoningProtocol: DiseaseProtocol = {
  id: 'co-poisoning',
  name: 'Carbon Monoxide (CO) Poisoning',
  system: 'Toxins and Poisoning',
  description: 'Diagnosis and management of carbon monoxide poisoning, including indications for hyperbaric oxygen (HBO) therapy.',
  image: {
    url: "https://picsum.photos/seed/co-poisoning/600/400",
    hint: "carbon monoxide"
  },
  questions: [
    { id: 'coHbLevel', questionText: 'Carboxyhemoglobin (COHb) Level', type: 'number', unit: '%' },
    { id: 'hasSevereSymptoms', questionText: 'Are there severe neurologic symptoms or signs of end-organ damage?', type: 'boolean', info: 'Syncope, coma, seizures, altered mental status, chest pain, EKG changes.' },
    { id: 'isPregnant', questionText: 'Is the patient pregnant?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const coHb = Number(data.coHbLevel);

    if (data.hasSevereSymptoms || coHb > 25 || (data.isPregnant && coHb > 15)) {
      const details = ["Severe poisoning. Hyperbaric oxygen (HBO) therapy should be strongly considered."];
      if(data.hasSevereSymptoms) details.push("Severe neurologic symptoms or end-organ damage.");
      if(coHb > 25) details.push(`COHb level > 25%.`);
      if(data.isPregnant) details.push(`Pregnancy with COHb > 15%.`);
      return { level: 'severe', details };
    }
    if (coHb >= 10 && coHb <= 25) {
      return { level: 'moderate', details: [`Moderate poisoning (COHb ${coHb}%). Requires 100% oxygen.`] };
    }
    if (coHb < 10) {
      return { level: 'mild', details: [`Mild or resolved poisoning (COHb ${coHb}%).`] };
    }
    return { level: 'unknown', details: ["Assess COHb level and symptoms to determine severity."] };
  },
  getManagement: (severity) => {
    const management = [{
        title: "Immediate Management",
        recommendations: [
            "Remove patient from source of exposure immediately.",
            "Administer 100% high-flow oxygen via a non-rebreather mask to all suspected patients. This is the primary treatment.",
            "Establish IV access, place on a cardiac monitor, and obtain a 12-lead EKG.",
            "Obtain labs: COHb level (on a blood gas), CBC, electrolytes, troponin."
        ]
    }];
    
    if (severity.level === 'severe') {
      management.push({
        title: "Severe Poisoning - Consider HBO",
        recommendations: [
            "Consult toxicology, a poison control center, or a hyperbaric medicine specialist immediately to discuss indications for hyperbaric oxygen (HBO) therapy.",
            "Indications for HBO generally include: syncope, coma, seizures, altered mental status, evidence of cardiac ischemia, severe metabolic acidosis, or COHb > 25% (lower thresholds for children and pregnant patients).",
            "Continue 100% oxygen until HBO can be initiated or symptoms resolve."
        ]
      });
    } else {
        management.push({
        title: "Mild to Moderate Poisoning Management",
        recommendations: [
            "Continue 100% high-flow oxygen until the patient is asymptomatic and the COHb level is less than 5%.",
            "Provide supportive care for symptoms like headache and nausea."
        ]
      });
    }

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Admission to hospital is required, potentially with transfer to a facility with hyperbaric oxygen capabilities."];
    }
    return ["Patients with mild to moderate poisoning can often be discharged from the ED after a period of oxygen therapy and complete resolution of symptoms."];
  },
  getRedFlags: () => [
    "Loss of consciousness (syncope, coma)",
    "Seizures",
    "Chest pain or EKG changes suggesting ischemia",
    "COHb level > 25%",
    "Pregnancy with COHb > 15%",
    "Persistent neurologic symptoms despite oxygen therapy"
  ],
  getDrugDoses: () => [
    { drugName: "100% Oxygen", dose: "Administer via non-rebreather mask.", notes: "The primary treatment for all CO exposures." }
  ],
  getReferences: () => [{ title: "UpToDate: Carbon monoxide poisoning", url: "https://www.uptodate.com/contents/carbon-monoxide-poisoning" }],
};