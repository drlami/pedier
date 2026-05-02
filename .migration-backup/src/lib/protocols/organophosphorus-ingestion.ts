import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const organophosphorusIngestionProtocol: DiseaseProtocol = {
  id: 'organophosphorus-ingestion',
  name: 'Organophosphate Poisoning',
  system: 'Toxins and Poisoning',
  description: 'Management of cholinergic crisis due to organophosphate or carbamate insecticide poisoning. These agents inhibit acetylcholinesterase, leading to a life-threatening excess of acetylcholine.',
  image: {
    url: "https://picsum.photos/seed/organophosphorus-ingestion/600/400",
    hint: "pesticide warning"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'muscarinicSigns', questionText: 'Muscarinic (DUMBELS) signs present?', type: 'boolean', info: 'Diarrhea, Urination, Miosis, Bronchorrhea/Bradycardia, Emesis, Lacrimation, Salivation.' },
    { id: 'nicotinicSigns', questionText: 'Nicotinic signs present?', type: 'boolean', info: 'Muscle weakness, fasciculations, paralysis, tachycardia, hypertension.' },
    { id: 'respFailure', questionText: 'Is there respiratory failure?', type: 'boolean', info: 'Due to bronchorrhea, bronchospasm, or neuromuscular weakness.' },
    { id: 'seizures', questionText: 'Are seizures present?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.respFailure || data.seizures) {
      return { level: 'severe', details: ["Life-threatening respiratory failure or seizures present."] };
    }
    if (data.muscarinicSigns || data.nicotinicSigns) {
      return { level: 'moderate', details: ["Systemic cholinergic toxicity present. Requires antidotal therapy."] };
    }
    return { level: 'mild', details: ["Minimal symptoms, may be early presentation or minor exposure."] };
  },
  getManagement: (severity) => {
    const management = [{
        title: "Initial Stabilization & Decontamination",
        recommendations: [
            "This is a medical emergency. Wear personal protective equipment (PPE).",
            "Stabilize ABCs. Intubate early for respiratory failure or inability to clear secretions.",
            "Decontaminate the patient: Remove all clothing and wash skin thoroughly with soap and water.",
            "Establish IV access."
        ]
    }];

    if (severity.level === 'severe' || severity.level === 'moderate') {
        management.push({
            title: "Antidotal Therapy",
            recommendations: [
                "1. Atropine: For muscarinic (DUMBELS) symptoms. Give large, escalating doses until bronchial secretions are dry and bradycardia resolves. Tachycardia is NOT a contraindication if severe bronchorrhea is present.",
                "2. Pralidoxime (2-PAM): To treat nicotinic symptoms (muscle weakness). It regenerates acetylcholinesterase. Administer as soon as possible.",
                "3. Benzodiazepines (e.g., Diazepam): For seizure control."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity) => {
    return ["All patients with systemic signs of organophosphate poisoning require admission to a PICU for continuous monitoring and antidotal therapy."];
  },
  getRedFlags: () => [
    "Respiratory distress or failure",
    "Copious bronchial secretions ('killer Bs': bronchorrhea, bronchospasm)",
    "Generalized muscle weakness and fasciculations",
    "Seizures",
    "Bradycardia with hypotension"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        // Atropine
        if (weight <= 50) { // Pediatric dose
            doses.push({
                drugName: "Atropine (IV)",
                dose: `${(0.02 * weight).toFixed(2)} - ${(0.05 * weight).toFixed(2)} mg`,
                notes: "Dose based on 0.02-0.05 mg/kg. Double the dose every 5 minutes until secretions are dry."
            });
        } else { // Adolescent/Adult dose
            doses.push({
                drugName: "Atropine (IV)",
                dose: "1 - 2 mg per dose",
                notes: "Double the dose every 5 minutes until secretions are dry."
            });
        }

        // Pralidoxime
        doses.push({
            drugName: "Pralidoxime (2-PAM) (IV)",
            dose: `Loading dose: ${(25 * weight).toFixed(1)} - ${(50 * weight).toFixed(1)} mg`,
            notes: "Dose based on 25-50 mg/kg. Infuse over 30 min, followed by a continuous infusion of 10-20 mg/kg/hr."
        });

        // Diazepam
        if (weight <= 50) { // Pediatric dose
            doses.push({
                drugName: "Diazepam (IV)",
                dose: `${(0.1 * weight).toFixed(2)} - ${(0.3 * weight).toFixed(2)} mg`,
                notes: "For seizure control. Based on 0.1-0.3 mg/kg."
            });
        } else { // Adolescent/Adult dose
            doses.push({
                drugName: "Diazepam (IV)",
                dose: "5 - 10 mg per dose",
                notes: "For seizure control."
            });
        }

    } else { // No weight entered
        doses.push({ drugName: "Atropine (IV)", dose: "0.02-0.05 mg/kg (peds) or 1-2 mg (adolescent)", notes: "Double the dose every 5 minutes until secretions dry." });
        doses.push({ drugName: "Pralidoxime (2-PAM) (IV)", dose: "25-50 mg/kg loading dose, then 10-20 mg/kg/hr infusion.", notes: "Most effective when given early." });
        doses.push({ drugName: "Diazepam (IV)", dose: "0.1-0.3 mg/kg (peds) or 5-10 mg (adolescent)", notes: "For seizure control." });
    }
    
    return doses;
  },
  getReferences: () => [{ title: "UpToDate: Organophosphate and carbamate poisoning", url: "https://www.uptodate.com/contents/organophosphate-and-carbamate-poisoning" }],
};
