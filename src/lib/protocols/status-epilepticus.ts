import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const statusEpilepticusProtocol: DiseaseProtocol = {
  id: 'acute-seizure',
  name: 'Acute Seizure (Status Epilepticus)',
  system: 'Neurology',
  description: 'A time-based, tiered approach to the emergency management of a seizure lasting > 5 minutes (Status Epilepticus), based on the 2016 American Epilepsy Society (AES) Guideline.',
  image: {
    url: "https://picsum.photos/seed/status-epilepticus/600/400",
    hint: "paramedics ambulance"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'seizureDuration', questionText: 'Current seizure duration', type: 'number', unit: 'minutes' },
    { id: 'firstLineGiven', questionText: 'How many doses of benzodiazepines given?', type: 'select', options: [{label: '0', value: 0}, {label: '1', value: 1}, {label: '2 or more', value: 2}] },
    { id: 'secondLineGiven', questionText: 'Second-line anticonvulsant given?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Severity here relates to the stage of Status Epilepticus (SE)
    const duration = Number(data.seizureDuration);
    
    if (duration >= 40) {
      return { level: 'severe', details: ["Refractory Status Epilepticus (seizure > 40 min): Persists after 2nd-line agent. High risk of morbidity."] };
    }
    if (duration >= 20) {
      return { level: 'moderate', details: ["Established Status Epilepticus (20-40 min): Has failed first-line therapy. Requires urgent second-line agent."] };
    }
    if (duration >= 5) {
      return { level: 'mild', details: ["Early Status Epilepticus (5-20 min): Needs urgent first-line intervention."] };
    }
    return { level: 'no', details: ["Impending Status Epilepticus (0-5 min): Monitor closely and prepare for intervention."] };
  },
  getManagement: (severity, data) => {
    const management = [];
    
    management.push({
        title: "Phase 1: Stabilization Phase (0–5 minutes)",
        recommendations: [
            "Position patient to protect airway (lateral decubitus), provide oxygen.",
            "Check vital signs, including temperature.",
            "Check blood glucose. If < 60 mg/dL, give Dextrose.",
            "Establish IV or IO access. Draw labs (electrolytes, glucose, toxicology screen, anticonvulsant levels if applicable)."
        ]
    });

    if (Number(data.seizureDuration) >= 5) {
        management.push({
            title: "Phase 2: Initial Therapy Phase (5–20 minutes)",
            recommendations: [
                "Administer a benzodiazepine (First-Line Therapy).",
                "Options: IM Midazolam, IV Lorazepam, or IV Diazepam.",
                "A second dose of a benzodiazepine may be given if seizure does not terminate within 5 minutes."
            ]
        });
    }

    if (Number(data.seizureDuration) >= 20) {
        management.push({
            title: "Phase 3: Second Therapy Phase (20–40 minutes)",
            recommendations: [
                "If seizure continues after 2 doses of benzodiazepines, this is established status epilepticus.",
                "Choose ONE of the following second-line agents: IV Levetiracetam (Keppra), IV Fosphenytoin, or IV Valproic Acid.",
                "Fosphenytoin requires cardiac monitoring. Levetiracetam has a favorable side effect profile and is often used.",
                "Prepare for continuous EEG monitoring and PICU admission."
            ]
        });
    }
    
    if (Number(data.seizureDuration) >= 40) {
        management.push({
            title: "Phase 4: Third Therapy Phase (40+ minutes)",
            recommendations: [
                "This is Refractory Status Epilepticus. Involve PICU and Neurology immediately.",
                "There is no clear evidence to guide choice of therapy in this phase. Repeat second-line therapy or use anesthetic doses of drugs such as thiopental, midazolam, or propofol.",
                "This stage requires management in a PICU with continuous EEG monitoring and hemodynamic support."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    return ["All patients with status epilepticus (seizure > 5 minutes) require hospital admission.", "Patients progressing to second or third-line therapies require PICU admission for close monitoring and further management."];
  },
  getRedFlags: () => [
    "Seizure lasting longer than 5 minutes.",
    "Airway compromise or hypoventilation.",
    "Hemodynamic instability.",
    "Failure to respond to adequate first-line benzodiazepine therapy.",
    "Failure to return to baseline mental status after seizure cessation (prolonged post-ictal state)."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    doses.push({ drugName: "--- First Line Therapy ---", dose: "" });
    doses.push({ drugName: "IM Midazolam", dose: "0.2 mg/kg (max 10 mg/dose)", notes: weight > 0 ? `Calculated dose: ${(0.2 * weight).toFixed(2)} mg. May repeat once.` : "May repeat once." });
    doses.push({ drugName: "IV Lorazepam", dose: "0.1 mg/kg (max 4 mg/dose)", notes: weight > 0 ? `Calculated dose: ${(0.1 * weight).toFixed(2)} mg. May repeat once.` : "May repeat once." });
    doses.push({ drugName: "IV Diazepam", dose: "0.15-0.2 mg/kg (max 10 mg/dose)", notes: "May repeat once."});
    
    doses.push({ drugName: "--- Second Line Therapy (Choose ONE) ---", dose: "" });
    doses.push({ drugName: "IV Levetiracetam (Keppra)", dose: "60 mg/kg (max 4500 mg)", notes: weight > 0 ? `Calculated dose: ${(60 * weight).toFixed(1)} mg. Infuse over 15 minutes.` : "Infuse over 15 minutes." });
    doses.push({ drugName: "IV Fosphenytoin", dose: "20 mg PE/kg (max 1500 mg PE)", notes: weight > 0 ? `Calculated dose: ${(20 * weight).toFixed(1)} mg PE. Infuse at 2-3 mg PE/kg/min.` : "Infuse at 2-3 mg PE/kg/min." });
    doses.push({ drugName: "IV Valproic Acid", dose: "40 mg/kg (max 3000 mg)", notes: weight > 0 ? `Calculated dose: ${(40 * weight).toFixed(1)} mg. Infuse over 15-30 minutes.` : "Infuse over 15-30 minutes." });

    doses.push({ drugName: "--- Third Line Therapy ---", dose: "" });
    doses.push({ drugName: "Midazolam Infusion", dose: "0.2 mg/kg load, then 1-10 mcg/kg/min continuous infusion." });
    doses.push({ drugName: "Pentobarbital Infusion", dose: "5-15 mg/kg load, then 0.5-5 mg/kg/hr continuous infusion." });
    
    return doses;
  },
  getReferences: () => [{ title: "Glauser T, et al. Evidence-Based Guideline: Treatment of Convulsive Status Epilepticus in Children and Adults (2016)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4749120/" }],
};
