import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const statusEpilepticusProtocol: DiseaseProtocol = {
  id: 'acute-seizure',
  name: 'Acute Seizure (Status Epilepticus)',
  system: 'Neurology',
  description: 'A time-based emergency algorithm for seizures lasting > 5 minutes.',
  image: {
    url: "https://picsum.photos/seed/status-epilepticus/600/400",
    hint: "emergency rescue"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'duration', questionText: 'Current Seizure Duration (Minutes)', type: 'number', unit: 'min' },
    { id: 'ivAccess', questionText: 'IV or IO access available?', type: 'boolean' },
    { 
      id: 'benzosGiven', 
      questionText: 'Benzodiazepine doses already given?', 
      type: 'select', 
      options: [
        {label: '0', value: '0', score: 0}, 
        {label: '1', value: '1', score: 1},
        {label: '2 or more', value: '2', score: 2}
      ] 
    },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const duration = Number(data.duration || 0);
    const benzos = Number(data.benzosGiven || 0);

    let level: SeverityLevel = 'mild';
    let interpretation = 'Impending Status Epilepticus';

    if (duration >= 40 || benzos >= 2) {
      level = 'severe';
      interpretation = 'REFRACTORY STATUS EPILEPTICUS';
    } else if (duration >= 20 || benzos >= 1) {
      level = 'moderate';
      interpretation = 'ESTABLISHED STATUS EPILEPTICUS';
    } else if (duration >= 5) {
      level = 'mild';
      interpretation = 'EARLY STATUS EPILEPTICUS';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "AES Status Epilepticus Phases",
        totalScore: duration,
        interpretation,
        referenceTable: [
          { range: "0 - 5 min", meaning: "Stabilization Phase" },
          { range: "5 - 20 min", meaning: "Initial Therapy (Benzos)" },
          { range: "20 - 40 min", meaning: "Second-Line Therapy (Keppra/PHT)" },
          { range: "> 40 min", meaning: "Third-Line (PICU / Anesthesia)" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const management = [];
    const duration = Number(data.duration || 0);

    management.push({
        title: "Phase 1: Stabilization (0-5 min)",
        recommendations: [
            "ABCs: Position in lateral decubitus, suction, O2 10-15L NRB.",
            "Check Capillary Glucose immediately.",
            "Establish IV/IO access.",
            "Monitor HR, RR, SpO2, BP."
        ]
    });

    if (duration >= 5) {
        management.push({
            title: "Phase 2: Initial Therapy (5-20 min)",
            recommendations: [
                data.ivAccess 
                    ? "Give IV Lorazepam (Ativan) 0.1 mg/kg (max 4mg)." 
                    : "Give IM/IN Midazolam (Versed) 0.2 mg/kg (max 10mg).",
                "May repeat benzo dose once after 5 minutes if seizure continues.",
                "DO NOT give more than 2 total doses of benzodiazepines."
            ]
        });
    }

    if (duration >= 20 || Number(data.benzosGiven) >= 1) {
        management.push({
            title: "Phase 3: Second-Line Therapy (20-40 min)",
            recommendations: [
                "Give IV Levetiracetam (Keppra) 60 mg/kg (max 4.5g).",
                "Alternative: IV Fosphenytoin 20 mg PE/kg (requires cardiac monitor).",
                "Notify PICU and Anesthesia immediately."
            ]
        });
    }

    if (duration >= 40 || Number(data.benzosGiven) >= 2) {
        management.push({
            title: "Phase 4: Third-Line / Refractory (>40 min)",
            recommendations: [
                "Transfer to PICU for continuous EEG.",
                "Prepare for intubation and anesthetic infusion (Midazolam or Propofol)."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity) => ["All patients with Status Epilepticus require admission; refractory cases require PICU."],
  getRedFlags: () => ["Seizure > 5 min", "Respiratory depression", "Hypoglycemia", "Cyanosis"],
  getDrugDoses: (severity, data) => {
      const weight = Number(data.weight) || 0;
      if (weight <= 0) return [];

      const lorazepamMg = Math.min(0.1 * weight, 4);
      const midazolamMg = Math.min(0.2 * weight, 10);
      const keppraMg = Math.min(60 * weight, 4500);

      return [
        { drugName: "IV Lorazepam (Ativan)", dose: `${lorazepamMg.toFixed(1)} mg`, notes: "Concentration: 2mg/mL. Volume: " + (lorazepamMg/2).toFixed(2) + " mL." },
        { drugName: "IM/IN Midazolam (Versed)", dose: `${midazolamMg.toFixed(1)} mg`, notes: "Concentration: 5mg/mL. Volume: " + (midazolamMg/5).toFixed(2) + " mL." },
        { drugName: "IV Levetiracetam (Keppra)", dose: `${keppraMg.toFixed(0)} mg`, notes: "Dilute in NS/D5W. Infuse over 15 min." }
      ];
  },
  getReferences: () => [
    { title: "AES Evidence-Based Guideline: Status Epilepticus", url: "https://www.aesnet.org/" }
  ],
};
