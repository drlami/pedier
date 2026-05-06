import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const coPoisoningProtocol: DiseaseProtocol = {
  id: 'co-poisoning',
  name: 'Carbon Monoxide (CO) Poisoning',
  system: 'Toxins and Poisoning',
  description: 'Pediatric diagnosis and management of carbon monoxide poisoning. CO causes tissue hypoxia by binding hemoglobin and impairing oxygen delivery. Severity in children should be based mainly on symptoms, neurologic/cardiac involvement, acidosis/lactate, exposure history, and COHb level. Normal pulse oximetry does not exclude CO poisoning.',
  image: {
    url: "https://picsum.photos/seed/co-poisoning/600/400",
    hint: "carbon monoxide"
  },

  questions: [
    {
      id: 'coHbLevel',
      questionText: 'Carboxyhemoglobin (COHb) level, if available',
      type: 'number',
      unit: '%',
      info: 'COHb helps support diagnosis but does not alone define severity. Level may fall after oxygen therapy.'
    },
    {
      id: 'hasNeuroSymptoms',
      questionText: 'Any pediatric neurologic symptoms?',
      type: 'boolean',
      info: 'Lethargy, irritability, confusion, abnormal behavior, altered mental status, syncope, seizure, or coma.'
    },
    {
      id: 'hasCardiacSigns',
      questionText: 'Any cardiac or end-organ involvement?',
      type: 'boolean',
      info: 'Chest pain, tachyarrhythmia, hypotension, shock, abnormal ECG, or elevated troponin.'
    },
    {
      id: 'hasAcidosisOrHighLactate',
      questionText: 'Severe metabolic acidosis or elevated lactate?',
      type: 'boolean',
      info: 'Suggests significant tissue hypoxia and severe poisoning.'
    },
    {
      id: 'hasPersistentSymptoms',
      questionText: 'Symptoms persist despite high-flow oxygen?',
      type: 'boolean',
      info: 'Persistent headache, vomiting, dizziness, lethargy, confusion, or abnormal behavior after oxygen therapy.'
    },
    {
      id: 'fireSmokeExposure',
      questionText: 'Was exposure from fire or smoke inhalation?',
      type: 'boolean',
      info: 'Consider airway injury and cyanide co-toxicity.'
    },
    {
      id: 'multipleExposed',
      questionText: 'Are other family members or children exposed/symptomatic?',
      type: 'boolean',
      info: 'Supports environmental CO exposure and need for public safety action.'
    }
  ],

  calculateSeverity: (data: FormData): Severity => {
    const coHb = Number(data.coHbLevel);

    const hasCOHb = !isNaN(coHb) && coHb > 0;

    if (
      data.hasNeuroSymptoms ||
      data.hasCardiacSigns ||
      data.hasAcidosisOrHighLactate ||
      data.hasPersistentSymptoms ||
      (hasCOHb && coHb >= 20)
    ) {
      const details = [
        "Severe pediatric CO poisoning. Continue 100% oxygen and urgently consult toxicology/poison control or hyperbaric medicine."
      ];

      if (data.hasNeuroSymptoms) {
        details.push("Neurologic symptoms/signs present: lethargy, confusion, syncope, seizure, altered mental status, or coma.");
      }

      if (data.hasCardiacSigns) {
        details.push("Cardiac or end-organ involvement present.");
      }

      if (data.hasAcidosisOrHighLactate) {
        details.push("Severe metabolic acidosis or elevated lactate suggests significant tissue hypoxia.");
      }

      if (data.hasPersistentSymptoms) {
        details.push("Symptoms are persistent despite high-flow oxygen.");
      }

      if (hasCOHb && coHb >= 20) {
        details.push(`COHb level ${coHb}%: high level for pediatric patient; HBO therapy should be considered.`);
      }

      return { level: 'severe', details };
    }

    if (
      (hasCOHb && coHb >= 10 && coHb < 20) ||
      data.fireSmokeExposure ||
      data.multipleExposed
    ) {
      const details = [
        "Moderate pediatric CO poisoning or significant exposure risk. Requires 100% oxygen, monitoring, and reassessment."
      ];

      if (hasCOHb && coHb >= 10 && coHb < 20) {
        details.push(`COHb level ${coHb}%.`);
      }

      if (data.fireSmokeExposure) {
        details.push("Fire/smoke exposure: assess airway injury and consider cyanide co-toxicity.");
      }

      if (data.multipleExposed) {
        details.push("Multiple exposed/symptomatic persons suggest environmental CO source.");
      }

      return { level: 'moderate', details };
    }

    if (hasCOHb && coHb < 10) {
      return {
        level: 'mild',
        details: [
          `Mild or resolving CO poisoning with COHb ${coHb}%. Clinical symptoms still matter because COHb may decrease after oxygen therapy.`
        ]
      };
    }

    return {
      level: 'unknown',
      details: [
        "Severity cannot be fully determined. Assess exposure history, symptoms, neurologic status, ECG, blood gas, lactate, and COHb level if available."
      ]
    };
  },

  getManagement: (severity) => {
    const management = [
      {
        title: "Immediate Pediatric Management",
        recommendations: [
          "Remove the child from the CO exposure source immediately.",
          "Administer 100% high-flow oxygen via non-rebreather mask to all suspected patients.",
          "If respiratory failure, coma, or inability to protect airway: prepare for airway support and intubation with 100% oxygen.",
          "Place on cardiac monitor and obtain 12-lead ECG.",
          "Obtain COHb level using blood gas co-oximetry if available.",
          "Obtain blood gas, lactate, glucose, electrolytes, CBC, and troponin if moderate/severe poisoning suspected.",
          "Pulse oximetry may be falsely normal and should NOT reassure against CO poisoning.",
          "Look for trauma, burns, inhalation injury, or associated poisoning depending on exposure setting."
        ]
      }
    ];

    if (severity.level === 'severe') {
      management.push({
        title: "Severe Pediatric CO Poisoning - Urgent HBO Consultation",
        recommendations: [
          "Continue 100% oxygen continuously.",
          "Urgently consult toxicology, poison control, PICU, or hyperbaric medicine specialist.",
          "Consider hyperbaric oxygen therapy especially if syncope, seizure, coma, altered mental status, persistent neurologic symptoms, cardiac ischemia, arrhythmia, shock, severe metabolic acidosis, elevated lactate, or COHb ≥20% in a child.",
          "Do not delay oxygen therapy while arranging HBO consultation.",
          "Admit to hospital/PICU depending on clinical condition.",
          "If fire or smoke inhalation exposure: assess for airway injury and consider cyanide toxicity, especially with severe lactic acidosis or cardiovascular collapse."
        ]
      });
    } else if (severity.level === 'moderate') {
      management.push({
        title: "Moderate Pediatric CO Poisoning Management",
        recommendations: [
          "Continue 100% high-flow oxygen until symptoms resolve and COHb is falling, ideally <5% if repeat level is available.",
          "Observe in the ED with repeated neurologic assessment.",
          "Repeat COHb level if symptoms persist or initial level was elevated.",
          "Treat headache, nausea, vomiting, dehydration, or hypoglycemia supportively.",
          "If symptoms worsen or persist despite oxygen, reclassify as severe and consult toxicology/HBO service.",
          "If multiple family members are affected, notify caregivers to avoid returning home until the source is identified and corrected."
        ]
      });
    } else if (severity.level === 'mild') {
      management.push({
        title: "Mild Pediatric CO Poisoning Management",
        recommendations: [
          "Continue 100% oxygen and observe until the child is clinically well and asymptomatic.",
          "Reassess neurologic status before discharge.",
          "Do not rely on normal pulse oximetry to exclude toxicity.",
          "Ensure safe discharge environment: the child must not return to the exposure site until it has been checked and cleared."
        ]
      });
    } else {
      management.push({
        title: "Unknown Severity - Complete Assessment",
        recommendations: [
          "Treat as suspected CO poisoning and give 100% oxygen while completing assessment.",
          "Check COHb level using blood gas co-oximetry if available.",
          "Assess neurologic status, ECG, lactate, blood gas, and exposure history.",
          "If any neurologic, cardiac, persistent symptoms, acidosis, or high COHb are present, manage as severe poisoning."
        ]
      });
    }

    return management;
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return [
        "Admit to hospital, preferably PICU if neurologic, respiratory, cardiovascular, or metabolic instability is present.",
        "Transfer to a center with hyperbaric oxygen capability if recommended by toxicology/hyperbaric specialist.",
        "Do not discharge if symptoms persist, ECG/troponin abnormal, acidosis/lactate elevated, or neurologic status is abnormal."
      ];
    }

    if (severity.level === 'moderate') {
      return [
        "Observe in ED until symptoms fully resolve and the child remains clinically stable.",
        "Consider admission if young child, persistent symptoms, unreliable follow-up, unsafe home environment, abnormal labs/ECG, or significant exposure.",
        "Discharge only if asymptomatic, normal examination, stable vitals, and safe environment confirmed."
      ];
    }

    if (severity.level === 'mild') {
      return [
        "May discharge after observation if asymptomatic, neurologically normal, vitals stable, and safe home environment is confirmed.",
        "Provide strict return precautions and caregiver education about delayed neurologic symptoms."
      ];
    }

    return [
      "Disposition depends on completed assessment. Continue oxygen and observe until severity is clarified."
    ];
  },

  getRedFlags: () => [
    "Altered mental status, confusion, abnormal behavior, lethargy, or irritability",
    "Syncope, seizure, coma, or focal neurologic abnormality",
    "Persistent symptoms despite 100% oxygen",
    "Chest pain, arrhythmia, hypotension, shock, abnormal ECG, or elevated troponin",
    "Severe metabolic acidosis or elevated lactate",
    "COHb ≥20% in a child",
    "Smoke inhalation or fire exposure",
    "Multiple family members or children symptomatic",
    "Unsafe home environment or unclear exposure source"
  ],

  getDrugDoses: () => [
    {
      drugName: "100% Oxygen",
      dose: "Give immediately via high-flow non-rebreather mask.",
      notes: "Primary treatment for all suspected pediatric CO exposures. Use airway support/intubation with 100% oxygen if respiratory failure, coma, or inability to protect airway."
    }
  ],

  getReferences: () => [
    {
      title: "CDC: Clinical Guidance for Carbon Monoxide Poisoning",
      url: "https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html"
    },
    {
      title: "UpToDate: Carbon monoxide poisoning",
      url: "https://www.uptodate.com/contents/carbon-monoxide-poisoning"
    }
  ],
};
