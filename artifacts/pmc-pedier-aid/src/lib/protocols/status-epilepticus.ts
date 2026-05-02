import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const statusEpilepticusProtocol: DiseaseProtocol = {
  id: 'acute-seizure',
  name: 'Acute Seizure (Status Epilepticus)',
  system: 'Neurology',
  description: 'A time-based, tiered approach to the emergency management of a seizure lasting > 5 minutes (Status Epilepticus), based on recent guidelines from the AES, AAP, and NICE.',
  image: {
    url: "https://picsum.photos/seed/status-epilepticus/600/400",
    hint: "paramedics ambulance"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'seizureDuration', questionText: 'Current seizure duration', type: 'number', unit: 'minutes' },
    { id: 'ivAccess', questionText: 'Is IV/IO access available?', type: 'boolean' },
    { id: 'benzosGiven', questionText: 'How many doses of benzodiazepines given?', type: 'select', options: [{label: '0', value: 0}, {label: '1', value: 1}, {label: '2 or more', value: 2}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Severity here relates to the stage of Status Epilepticus (SE)
    const duration = Number(data.seizureDuration);
    
    if (duration >= 40) {
      return { level: 'severe', details: ["Refractory Status Epilepticus (>40 min): Persists after 2nd-line agent. Requires PICU-level care and anesthetic infusions."] };
    }
    if (duration >= 20) {
      return { level: 'moderate', details: ["Established Status Epilepticus (20-40 min): Seizure has failed first-line therapy. Requires urgent second-line anticonvulsant."] };
    }
    if (duration >= 5) {
      return { level: 'mild', details: ["Early Status Epilepticus (5-20 min): Seizure requires urgent first-line benzodiazepine therapy."] };
    }
    return { level: 'no', details: ["Impending Status Epilepticus (<5 min): Stabilize patient and prepare for intervention if seizure continues."] };
  },
  getManagement: (severity, data) => {
    const management = [];
    
    management.push({
        title: "Step 1: Stabilization Phase (0–5 minutes)",
        recommendations: [
            "Follow ABCs: Position child in lateral decubitus, clear airway, provide O₂, and attach monitors.",
            "Check capillary glucose immediately. If <60 mg/dL, give Dextrose.",
            "Establish IV/IO access.",
            "Send labs if seizure is prolonged: electrolytes, calcium, magnesium, CBC.",
            "Treat fever if present with antipyretics."
        ]
    });

    management.push({
        title: "Step 2: First-Line Therapy (Seizure > 5 minutes)",
        recommendations: [
            "Administer a benzodiazepine. DO NOT give more than 2 doses.",
            data.ivAccess 
                ? "IV Access: LORAZEPAM 0.1 mg/kg IV (max 4 mg) OR DIAZEPAM 0.15-0.2 mg/kg IV. Repeat once after 5 mins if needed."
                : "No IV Access: MIDAZOLAM 0.2 mg/kg IM/IN/Buccal OR DIAZEPAM 0.5 mg/kg Rectal."
        ]
    });
    
    management.push({
        title: "Step 3: Second-Line Therapy (Seizure persists after 2 Benzo doses, ~20-40 minutes)",
        recommendations: [
            "Choose ONE second-line anticonvulsant:",
            "- LEVETIRACETAM 60 mg/kg IV (max 4500 mg) - increasingly preferred.",
            "- FOSPHENYTOIN 20 mg PE/kg IV (requires cardiac monitoring).",
            "- VALPROIC ACID 40 mg/kg IV.",
            "If seizure continues, consider giving another second-line agent from a different class in consultation with neurology/PICU."
        ]
    });
    
    management.push({
        title: "Step 4: Third-Line Therapy / Refractory SE (>40 minutes)",
        recommendations: [
            "This is Refractory Status Epilepticus. Transfer to PICU.",
            "Start continuous anesthetic infusion with EEG monitoring (e.g., Midazolam, Propofol, Pentobarbital)."
        ]
    });

    management.push({
        title: "Etiology-Specific Treatments",
        recommendations: [
            "Hypoglycemia: Dextrose",
            "Hypocalcemia: Calcium gluconate 10% (2 ml/kg IV)",
            "Hyponatremia: 3% saline 3–5 ml/kg",
            "INH toxicity: Pyridoxine"
        ]
    });

    return management;
  },
  getDisposition: (severity, data) => {
    return [
        "Admission is indicated for: first seizure, focal seizure, prolonged seizure >10-15 min, incomplete recovery, age <6 months, suspected CNS infection, status epilepticus, or abnormal neuro exam.",
        "For simple febrile seizures <5 min with full recovery, discharge with reassurance may be appropriate.",
        "Consider providing discharge 'rescue medication' (e.g., buccal midazolam, rectal diazepam) for patients with recurrent prolonged seizures."
    ];
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

    // Stabilization
    doses.push({ drugName: "--- Stabilization ---", dose: "" });
    doses.push({ drugName: "Dextrose 10% (D10)", dose: "5 mL/kg IV/IO", notes: weight > 0 ? `Calculated dose: ${(5 * weight).toFixed(1)} mL` : "" });
    doses.push({ drugName: "Dextrose 25% (D25)", dose: "2 mL/kg IV/IO", notes: weight > 0 ? `Calculated dose: ${(2 * weight).toFixed(1)} mL` : "" });
    
    // First Line
    doses.push({ drugName: "--- First Line Therapy (Choose ONE, max 2 doses) ---", dose: "" });
    doses.push({ drugName: "IV Lorazepam", dose: "0.1 mg/kg (max 4 mg/dose)", notes: weight > 0 ? `Calculated dose: ${Math.min(0.1 * weight, 4).toFixed(2)} mg.` : "" });
    doses.push({ drugName: "IV Diazepam", dose: "0.15-0.2 mg/kg (max 10 mg/dose)", notes: weight > 0 ? `Calculated dose: ${Math.min(0.2 * weight, 10).toFixed(2)} mg.` : ""});
    doses.push({ drugName: "IM/IN/Buccal Midazolam", dose: "0.2 mg/kg (max 10 mg/dose)", notes: weight > 0 ? `Calculated dose: ${Math.min(0.2 * weight, 10).toFixed(2)} mg.` : "" });
    doses.push({ drugName: "Rectal Diazepam", dose: "0.5 mg/kg", notes: weight > 0 ? `Calculated dose: ${(0.5 * weight).toFixed(2)} mg.` : ""});
    
    // Second Line
    doses.push({ drugName: "--- Second Line Therapy (Choose ONE) ---", dose: "" });
    doses.push({ drugName: "IV Levetiracetam (Keppra)", dose: "60 mg/kg (max 4500 mg)", notes: weight > 0 ? `Calculated dose: ${Math.min(60 * weight, 4500).toFixed(1)} mg.` : "" });
    doses.push({ drugName: "IV Fosphenytoin", dose: "20 mg PE/kg (max 1500 mg PE)", notes: weight > 0 ? `Calculated dose: ${Math.min(20 * weight, 1500).toFixed(1)} mg PE.` : "" });
    doses.push({ drugName: "IV Valproic Acid", dose: "40 mg/kg (max 3000 mg)", notes: weight > 0 ? `Calculated dose: ${Math.min(40 * weight, 3000).toFixed(1)} mg.` : "" });

    // Third Line
    doses.push({ drugName: "--- Third Line / Refractory SE ---", dose: "" });
    doses.push({ drugName: "Midazolam Infusion", dose: "Load 0.2 mg/kg, then 1-10 mcg/kg/min continuous infusion." });
    
    // Etiology-Specific
    doses.push({ drugName: "--- Etiology-Specific ---", dose: "" });
    doses.push({ drugName: "Calcium Gluconate 10%", dose: "2 mL/kg IV" });
    doses.push({ drugName: "3% Hypertonic Saline", dose: "3-5 mL/kg IV" });
    
    return doses;
  },
  getReferences: () => [{ title: "Glauser T, et al. Evidence-Based Guideline: Treatment of Convulsive Status Epilepticus in Children and Adults. Epilepsy Currents, 2016.", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4749120/" }],
};
