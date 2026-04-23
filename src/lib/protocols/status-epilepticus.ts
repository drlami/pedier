import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const statusEpilepticusProtocol: DiseaseProtocol = {
  id: 'status-epilepticus',
  name: 'Status Epilepticus',
  system: 'Neurology',
  description: 'A time-based, tiered approach to the emergency management of status epilepticus in children.',
  image: {
    url: "https://picsum.photos/seed/status-epilepticus/600/400",
    hint: "paramedics ambulance"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'seizureDuration', questionText: 'Current seizure duration', type: 'number', unit: 'minutes' },
    { id: 'firstLineGiven', questionText: 'First-line therapy (Benzodiazepine) given?', type: 'boolean' },
    { id: 'secondLineGiven', questionText: 'Second-line therapy (e.g., Fosphenytoin, Keppra, Valproate) given?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Status epilepticus is always a medical emergency. Severity relates to the stage of treatment.
    const duration = Number(data.seizureDuration);
    if (duration >= 30) {
      return { level: 'severe', details: ["Refractory Status Epilepticus (seizure persists after 2nd-line agent). High risk of morbidity."] };
    }
    if (duration >= 5) {
      return { level: 'moderate', details: ["Established Status Epilepticus (seizure > 5 min). Needs urgent intervention."] };
    }
    return { level: 'mild', details: ["Impending Status Epilepticus (seizure 0-5 min)."] };
  },
  getManagement: (severity, data) => {
    const management = [{
        title: "Initial Stabilization (0-5 minutes)",
        recommendations: [
            "Position patient to protect airway (lateral decubitus), provide oxygen.",
            "Check vital signs, including temperature.",
            "Check blood glucose. If < 60 mg/dL, give Dextrose.",
            "Establish IV or IO access. Draw labs (anticonvulsant levels, electrolytes, tox screen)."
        ]
    }];

    if (Number(data.seizureDuration) >= 5) {
        management.push({
            title: "First Line Therapy (5-10 minutes)",
            recommendations: [
                "Administer a benzodiazepine.",
                "IV Lorazepam is preferred if access is available.",
                "IM Midazolam is an excellent alternative if no IV access.",
                "Rectal Diazepam can also be used."
            ]
        });
    }

    if (Number(data.seizureDuration) >= 10 && data.firstLineGiven) {
        management.push({
            title: "Second Line Therapy (10-30 minutes)",
            recommendations: [
                "If seizure continues after 2 doses of benzodiazepines, start a second-line agent.",
                "Choose ONE of the following: IV Fosphenytoin, IV Levetiracetam (Keppra), or IV Valproic Acid.",
                "Fosphenytoin requires cardiac monitoring. Levetiracetam has a favorable side effect profile."
            ]
        });
    }
    
    if (Number(data.seizureDuration) >= 30 && data.secondLineGiven) {
        management.push({
            title: "Third Line Therapy / Refractory SE (30+ minutes)",
            recommendations: [
                "This is Refractory Status Epilepticus. Involve PICU and Neurology immediately.",
                "Prepare for intubation and continuous EEG monitoring.",
                "Consider continuous infusions of Midazolam or Pentobarbital.",
                "Other options include high-dose Levetiracetam, Lacosamide, or Ketamine."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    return ["All patients with status epilepticus require hospital admission.", "Patients progressing to second or third-line therapies require PICU admission for close monitoring and further management."];
  },
  getRedFlags: () => [
    "Seizure lasting longer than 5 minutes.",
    "Airway compromise or hypoventilation.",
    "Hemodynamic instability.",
    "Failure to respond to first-line benzodiazepine therapy.",
    "New focal neurologic deficit after seizure cessation."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    // First Line
    doses.push({ drugName: "IV Lorazepam", dose: "0.1 mg/kg (max 4 mg/dose)", notes: `Calculated dose: ${(0.1 * weight).toFixed(2)} mg` });
    doses.push({ drugName: "IM Midazolam", dose: "0.2 mg/kg (max 10 mg/dose)", notes: `Calculated dose: ${(0.2 * weight).toFixed(2)} mg` });
    doses.push({ drugName: "Rectal Diazepam", dose: "0.5 mg/kg (max 10-20 mg depending on age)", notes: "Use Diastat AcuDial" });

    // Second Line
    doses.push({ drugName: "IV Fosphenytoin", dose: "20 mg PE/kg (max 1500 mg PE)", notes: `Calculated dose: ${(20 * weight).toFixed(1)} mg PE. Infuse at 2-3 mg PE/kg/min.` });
    doses.push({ drugName: "IV Levetiracetam (Keppra)", dose: "60 mg/kg (max 4500 mg)", notes: `Calculated dose: ${(60 * weight).toFixed(1)} mg. Infuse over 15 minutes.` });
    doses.push({ drugName: "IV Valproic Acid", dose: "40 mg/kg (max 3000 mg)", notes: `Calculated dose: ${(40 * weight).toFixed(1)} mg. Infuse over 15-30 minutes.` });

    // Third Line
    doses.push({ drugName: "Midazolam Infusion", dose: "0.2 mg/kg load, then 1-10 mcg/kg/min infusion." });
    doses.push({ drugName: "Pentobarbital Infusion", dose: "5-15 mg/kg load, then 0.5-5 mg/kg/hr infusion." });
    
    return doses;
  },
  getReferences: () => [{ title: "Neurocritical Care Society: Guideline for the Evaluation and Management of Status Epilepticus (2012)", url: "https://www.neurocriticalcare.org/store/viewproduct.aspx?id=14986423" }],
};
