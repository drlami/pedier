import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const paracetamolToxicityProtocol: DiseaseProtocol = {
  id: 'paracetamol-toxicity',
  name: 'Paracetamol (Acetaminophen) Toxicity',
  system: 'Toxins and Poisoning',
  description:
    'Pediatric-oriented assessment and management of paracetamol/acetaminophen toxicity. Designed for ED use when serum level may be pending or delayed. Includes acute single ingestion, repeated/staggered ingestion, unknown timing, Rumack-Matthew nomogram use, and empiric NAC indications.',

  image: {
    url: "https://picsum.photos/seed/paracetamol-toxicity/600/400",
    hint: "liver pills"
  },

  questions: [
    {
      id: 'weight',
      questionText: 'Patient Weight',
      type: 'number',
      unit: 'kg',
      info: 'Used for pediatric dose estimation and NAC/charcoal dosing.'
    },

    {
      id: 'ingestedDose',
      questionText: 'Estimated dose ingested',
      type: 'number',
      unit: 'mg/kg',
      info: 'Single acute ingestion ≥150 mg/kg is potentially toxic in children. ≥300 mg/kg is high risk / massive ingestion.'
    },

    {
      id: 'ingestionTime',
      questionText: 'Time since ingestion',
      type: 'number',
      unit: 'hours',
      info: 'If unknown or unreliable, mark High-risk history below.'
    },

    {
      id: 'isSingleAcute',
      questionText: 'Single acute ingestion?',
      type: 'boolean',
      info: 'YES = one known ingestion time. NO = repeated dosing error, staggered ingestion, or unclear multiple doses. Nomogram is not reliable if NO.'
    },

    {
      id: 'levelAvailable',
      questionText: 'Is serum paracetamol/acetaminophen level available?',
      type: 'boolean',
      info: 'If NO and toxic ingestion is possible, NAC may be needed before the result returns.'
    },

    {
      id: 'paracetamolLevel',
      questionText: 'Serum paracetamol/acetaminophen level',
      type: 'number',
      unit: 'mcg/mL',
      info: 'Use for nomogram only if drawn ≥4 hours after a single acute ingestion with known timing.'
    },

    {
      id: 'hasSignificantSymptoms',
      questionText: 'Any significant toxicity signs?',
      type: 'boolean',
      info: 'Persistent vomiting, RUQ abdominal pain, jaundice, altered mental status, severe lethargy, hypoglycemia, bleeding, or shock.'
    },

    {
      id: 'highRiskHistory',
      questionText: 'High-risk history?',
      type: 'boolean',
      info: 'Unknown timing, unreliable history, repeated/staggered ingestion, extended-release product, massive dose >300 mg/kg, prolonged fasting, malnutrition, chronic liver disease, or delayed lab result.'
    }
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    const weight = Number(data.weight);
    const dose = Number(data.ingestedDose);
    const time = Number(data.ingestionTime);
    const level = Number(data.paracetamolLevel);

    const isSingleAcute = data.isSingleAcute === true;
    const levelAvailable = data.levelAvailable === true;
    const hasSignificantSymptoms = data.hasSignificantSymptoms === true;
    const highRiskHistory = data.highRiskHistory === true;

    const hasValidDose = !isNaN(dose) && dose > 0;
    const hasValidTime = !isNaN(time) && time >= 0;
    const hasValidLevel = levelAvailable && !isNaN(level) && level >= 0;

    if (!weight || weight <= 0) {
      details.push("Enter a valid weight for pediatric dosing.");
    }

    if (hasSignificantSymptoms) {
      details.push(
        "Significant symptoms/signs of toxicity are present. Start NAC immediately and consult toxicology/poison control."
      );
      details.push(
        "Check AST/ALT, PT/INR, bilirubin, glucose, electrolytes/CO2, urea/creatinine, and acetaminophen level."
      );
      return { level: 'severe', details };
    }

    if (!isSingleAcute) {
      details.push(
        "This is not a clear single acute ingestion. This may represent repeated supratherapeutic dosing or staggered ingestion."
      );
      details.push(
        "Rumack-Matthew nomogram is NOT reliable for repeated or staggered ingestion."
      );

      if (hasValidLevel && level > 10) {
        details.push(
          `Detectable acetaminophen level (${level} mcg/mL) with repeated/staggered ingestion. Start/consider NAC and discuss with toxicology.`
        );
        return { level: 'severe', details };
      }

      details.push(
        "Obtain acetaminophen level and liver/metabolic labs. Start NAC if level is detectable, AST/ALT abnormal, INR elevated, or the child is symptomatic."
      );

      return { level: 'moderate', details };
    }

    if (highRiskHistory) {
      details.push(
        "High-risk history is present: unknown/unreliable time, massive ingestion, extended-release product, delayed lab result, or vulnerable child."
      );

      if (hasValidDose && dose >= 150 && (!hasValidLevel || (hasValidTime && time >= 8))) {
        details.push(
          "Possible toxic ingestion with high-risk history and level unavailable or delayed. Start NAC empirically."
        );
        return { level: 'severe', details };
      }

      if (hasValidLevel && level > 10 && (!hasValidTime || time > 24)) {
        details.push(
          "Level is detectable with unreliable/late timing. Nomogram is not reliable. Start/consider NAC and consult toxicology."
        );
        return { level: 'severe', details };
      }

      details.push(
        "Use lower threshold for observation, labs, toxicology discussion, and empiric NAC if risk cannot be clarified quickly."
      );
      return { level: 'moderate', details };
    }

    if (hasValidDose && dose >= 300) {
      details.push(
        `Massive/high-risk pediatric ingestion estimated at ${dose} mg/kg. Start NAC immediately while awaiting level.`
      );
      return { level: 'severe', details };
    }

    if (hasValidDose && dose >= 150) {
      details.push(
        `Potentially toxic ingestion estimated at ${dose} mg/kg. A timed serum level is required.`
      );

      if (hasValidTime && time >= 8 && !hasValidLevel) {
        details.push(
          "Patient is ≥8 hours from ingestion and level is not available. Start NAC immediately; do not wait for the result."
        );
        return { level: 'severe', details };
      }

      if (!hasValidLevel) {
        details.push(
          "Serum level is pending/unavailable. If it will not return before 8 hours post-ingestion, start NAC empirically."
        );
        return { level: 'moderate', details };
      }
    }

    if (hasValidLevel) {
      if (!hasValidTime) {
        details.push(
          "Level is available but ingestion time is missing. Nomogram cannot be applied safely."
        );
        details.push(
          "If level is detectable or history is unreliable, discuss with toxicology and consider NAC."
        );
        return { level: 'moderate', details };
      }

      if (time < 4) {
        details.push(
          "Level was drawn before 4 hours, so it is not reliable for nomogram interpretation."
        );
        details.push(
          "Repeat acetaminophen level at ≥4 hours after ingestion."
        );

        if (hasValidDose && dose >= 150) {
          details.push(
            "Because the dose is potentially toxic, ensure the repeat level will be available before 8 hours; otherwise start NAC."
          );
        }

        return { level: 'moderate', details };
      }

      if (time >= 4 && time <= 24) {
        const treatmentThreshold = 150 * Math.exp(-0.068 * (time - 4));

        if (level >= treatmentThreshold) {
          details.push(
            `Level ${level} mcg/mL at ${time} hours is on/above the Rumack-Matthew treatment line. NAC indicated.`
          );
          return { level: 'severe', details };
        }

        details.push(
          `Level ${level} mcg/mL at ${time} hours is below the Rumack-Matthew treatment line.`
        );
        details.push(
          "If history is reliable, single acute immediate-release ingestion, and child is asymptomatic, NAC is usually not required."
        );
        return { level: 'mild', details };
      }

      if (time > 24) {
        details.push(
          "Presentation is >24 hours after ingestion. Rumack-Matthew nomogram is not reliable."
        );

        if (level > 10) {
          details.push(
            `Acetaminophen level is detectable (${level} mcg/mL). Start/consider NAC and check liver/metabolic labs.`
          );
          return { level: 'severe', details };
        }

        details.push(
          "Check AST/ALT, INR, bilirubin, glucose, electrolytes/CO2, urea/creatinine. Start NAC if labs are abnormal or child is symptomatic."
        );
        return { level: 'moderate', details };
      }
    }

    if (hasValidDose && dose < 150) {
      details.push(
        `Estimated dose ${dose} mg/kg is below the usual pediatric toxic threshold.`
      );
      details.push(
        "If history is reliable, child is asymptomatic, and no high-risk features are present, NAC is usually not required."
      );
      return { level: 'mild', details };
    }

    details.push(
      "Risk cannot be fully assessed. Enter dose, timing, ingestion pattern, level availability, and symptom/high-risk status."
    );
    details.push(
      "If toxic ingestion is possible and level will be delayed beyond 8 hours, start NAC empirically."
    );
    return { level: 'unknown', details };
  },

  getManagement: (severity) => {
    const management = [
      {
        title: "Initial Pediatric ED Assessment",
        recommendations: [
          "Assess ABCs, vital signs, mental status, hydration, glucose, and co-ingestion risk.",
          "Confirm formulation: immediate-release vs extended-release if possible.",
          "Clarify whether this was a single acute ingestion or repeated/staggered dosing.",
          "Calculate estimated dose in mg/kg.",
          "Do not delay urgent management while waiting for serum level if the child is high risk."
        ]
      },
      {
        title: "Labs / Monitoring",
        recommendations: [
          "Draw serum acetaminophen/paracetamol level at 4 hours after ingestion, or immediately if presentation is after 4 hours.",
          "Baseline labs: AST/ALT, PT/INR, bilirubin, glucose, electrolytes/CO2, urea/creatinine.",
          "If NAC is started, repeat acetaminophen level, AST/ALT, INR, renal function, glucose, and acid-base status according to local toxicology protocol.",
          "For repeated or staggered ingestion, do not use the nomogram; use acetaminophen level plus liver/metabolic labs."
        ]
      },
      {
        title: "Activated Charcoal",
        recommendations: [
          "Consider activated charcoal 1 g/kg PO/NG, maximum 50 g, if significant ingestion and presentation is usually within 1–4 hours.",
          "Only give if airway is protected and aspiration risk is low.",
          "Discuss with toxicology for massive ingestion, extended-release ingestion, or delayed gastric emptying."
        ]
      }
    ];

    if (severity.level === 'severe') {
      management.push({
        title: "Final Decision: Start NAC Now",
        recommendations: [
          "Start IV N-acetylcysteine immediately.",
          "Do not wait for acetaminophen level if the child is ≥8 hours from a potentially toxic ingestion and level is unavailable.",
          "NAC is indicated if level is on/above treatment line, timing is unknown with possible toxic ingestion, repeated/staggered ingestion with detectable level or abnormal labs, symptoms are present, or liver/metabolic labs are abnormal.",
          "Consult toxicology/poison control early.",
          "Admit for NAC infusion and serial monitoring.",
          "PICU if encephalopathy, hypoglycemia, severe acidosis, shock, significant INR elevation, bleeding, renal impairment, or acute liver failure concern."
        ]
      });
    } else if (severity.level === 'moderate') {
      management.push({
        title: "Final Decision: Observe / Await Level, But Do Not Delay NAC",
        recommendations: [
          "If level will return before 8 hours post-ingestion and child is stable, wait for timed level.",
          "If level will not return before 8 hours after potentially toxic ingestion, start NAC empirically.",
          "If level was drawn before 4 hours, repeat at ≥4 hours.",
          "If ingestion was repeated/staggered, use acetaminophen level plus AST/ALT and INR; nomogram is not reliable.",
          "Discuss with toxicology if timing is unclear, history unreliable, extended-release product possible, or follow-up is unsafe."
        ]
      });
    } else if (severity.level === 'mild') {
      management.push({
        title: "Final Decision: Low Risk / NAC Usually Not Required",
        recommendations: [
          "NAC is usually not required if reliable single acute ingestion, child asymptomatic, dose <150 mg/kg OR timed level below treatment line.",
          "Observe clinically as appropriate.",
          "Provide return precautions: vomiting, RUQ pain, lethargy, jaundice, confusion, bleeding, or worsening condition.",
          "Counsel caregivers about correct paracetamol dosing, avoiding duplicate paracetamol-containing products, and safe medication storage."
        ]
      });
    } else {
      management.push({
        title: "Final Decision: Incomplete Data",
        recommendations: [
          "Cannot safely classify risk without dose, timing, ingestion pattern, level availability, and symptom/high-risk status.",
          "If ingestion may be toxic and level will be delayed beyond 8 hours, start NAC empirically.",
          "Discuss with toxicology/poison control."
        ]
      });
    }

    return management;
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return [
        "Admit for IV NAC infusion and serial monitoring.",
        "PICU if encephalopathy, hypoglycemia, metabolic acidosis, shock, significant INR elevation, bleeding, renal impairment, or acute liver failure concern.",
        "Consider transfer to pediatric toxicology/PICU/liver transplant-capable center if severe hepatotoxicity or liver failure develops."
      ];
    }

    if (severity.level === 'moderate') {
      return [
        "Observe in ED or admit until acetaminophen level and liver/metabolic labs allow safe risk stratification.",
        "Start NAC if results are delayed beyond 8 hours after potentially toxic ingestion.",
        "Do not discharge if timing is unreliable, ingestion is repeated/staggered, extended-release ingestion is possible, symptoms are present, or follow-up is unsafe."
      ];
    }

    if (severity.level === 'mild') {
      return [
        "May discharge if child is asymptomatic, history is reliable, ingestion is below toxic threshold OR timed level is below treatment line, and no concerning labs.",
        "Provide caregiver medication safety counseling and clear return precautions."
      ];
    }

    return [
      "Disposition cannot be determined. Complete assessment and discuss with toxicology if risk remains unclear."
    ];
  },

  getRedFlags: () => [
    "Acetaminophen/paracetamol level on or above Rumack-Matthew treatment line.",
    "Estimated acute ingestion ≥150 mg/kg.",
    "Massive/high-risk ingestion ≥300 mg/kg.",
    "Unknown timing or unreliable history.",
    "Repeated supratherapeutic dosing or staggered ingestion.",
    "Serum level unavailable by 8 hours after potentially toxic ingestion.",
    "Persistent vomiting, RUQ pain, jaundice, altered mental status, severe lethargy.",
    "Elevated AST/ALT, elevated INR, hypoglycemia, metabolic acidosis, renal impairment.",
    "Possible extended-release product or significant co-ingestion.",
    "Any intentional overdose in an adolescent."
  ],

  getDrugDoses: (): DrugDose[] => [
    {
      drugName: "Activated Charcoal",
      dose: "1 g/kg PO/NG once; maximum 50 g.",
      notes:
        "Consider within 1–4 hours of significant ingestion if airway protected. Avoid if altered mental status, seizure risk, repeated vomiting, or aspiration risk."
    },
    {
      drugName: "N-acetylcysteine (NAC) IV",
      dose:
        "Common IV protocol: 150 mg/kg loading dose over 1 hour, then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours.",
      notes:
        "Use institution-specific pediatric fluid-adjusted dilution volumes. Avoid default adult fluid volumes in small children. Consult pharmacy/toxicology for infants, low-weight children, fluid restriction, renal/cardiac disease, or severe toxicity."
    },
    {
      drugName: "NAC continuation",
      dose:
        "Continue beyond the standard protocol if acetaminophen level remains detectable, AST/ALT rising, INR abnormal, acidosis/renal impairment present, or patient clinically unwell.",
      notes:
        "Stopping NAC should be based on clinical status, acetaminophen level, AST/ALT trend, INR, renal function, and toxicology advice."
    }
  ],

  getReferences: () => [
    {
      title: "Royal Children's Hospital Melbourne: Paracetamol poisoning guideline",
      url: "https://www.rch.org.au/clinicalguide/guideline_index/paracetamol_poisoning/"
    },
    {
      title: "FDA Acetadote label: NAC if acetaminophen concentration unavailable within 8 hours",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/021539s019lbl.pdf"
    },
    {
      title: "Nationwide Children's Hospital: Acetaminophen acute ingestion/overdose pathway",
      url: "https://www.nationwidechildrens.org/-/media/nch/for-medical-professionals/clinical-pathways/ip_acetaminophen-apap-acute-ingestion-overdose.pdf"
    },
    {
      title: "Chiew et al. Updated guidelines for paracetamol poisoning",
      url: "https://pubmed.ncbi.nlm.nih.gov/31786822/"
    }
  ],
};
