import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const paracetamolToxicityProtocol: DiseaseProtocol = {
  id: 'paracetamol-toxicity',
  name: 'Paracetamol (Acetaminophen) Toxicity',
  system: 'Toxins and Poisoning',
  description:
    'Pediatric-oriented assessment and management of paracetamol/acetaminophen overdose. Includes acute single ingestion, delayed/unknown presentation, pending serum level, repeated supratherapeutic ingestion, Rumack-Matthew nomogram guidance, and empiric NAC indications.',

  image: {
    url: "https://picsum.photos/seed/paracetamol-toxicity/600/400",
    hint: "liver pills"
  },

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },

    {
      id: 'ingestedDose',
      questionText: 'Estimated dose ingested',
      type: 'number',
      unit: 'mg/kg',
      info: 'For single acute ingestion. In children, ≥150 mg/kg is potentially toxic; ≥300 mg/kg suggests high-risk/massive ingestion.'
    },

    {
      id: 'ingestionTime',
      questionText: 'Time since ingestion',
      type: 'number',
      unit: 'hours',
      info: 'Rumack-Matthew nomogram is valid only for single acute immediate-release ingestion with known time, using level drawn ≥4 hours.'
    },

    {
      id: 'isAcuteIngestion',
      questionText: 'Was this a single acute ingestion?',
      type: 'boolean',
      info: 'If NO, consider repeated supratherapeutic ingestion or staggered ingestion; nomogram is not reliable.'
    },

    {
      id: 'isUnknownTime',
      questionText: 'Is timing unknown, unreliable, or staggered?',
      type: 'boolean',
      info: 'Unknown or staggered ingestion cannot be interpreted safely using the Rumack-Matthew nomogram.'
    },

    {
      id: 'isExtendedRelease',
      questionText: 'Was extended-release paracetamol/acetaminophen possibly ingested?',
      type: 'boolean',
      info: 'Extended-release ingestion may require repeat levels and toxicology consultation.'
    },

    {
      id: 'levelAvailable',
      questionText: 'Is serum acetaminophen/paracetamol level available now?',
      type: 'boolean',
      info: 'If level is delayed and patient is high risk, NAC should not be delayed beyond 8 hours after ingestion.'
    },

    {
      id: 'paracetamolLevel',
      questionText: 'Serum acetaminophen/paracetamol level',
      type: 'number',
      unit: 'mcg/mL',
      info: 'Use only if drawn ≥4 hours after a single acute ingestion with known timing.'
    },

    {
      id: 'levelWillBeDelayed',
      questionText: 'Will serum level result be unavailable before 8 hours post-ingestion?',
      type: 'boolean',
      info: 'If toxic ingestion is suspected and level will not return before 8 hours, start NAC empirically.'
    },

    {
      id: 'hasSymptoms',
      questionText: 'Any symptoms/signs of toxicity?',
      type: 'boolean',
      info: 'Vomiting, RUQ pain, lethargy, jaundice, altered mental status, hypoglycemia, acidosis, bleeding tendency.'
    },

    {
      id: 'hasAbnormalLiverTests',
      questionText: 'Any abnormal AST/ALT, INR, bilirubin, glucose, creatinine, or acidosis?',
      type: 'boolean',
      info: 'Abnormal liver tests or metabolic abnormalities suggest significant toxicity or delayed presentation.'
    },

    {
      id: 'isRepeatedSupratherapeutic',
      questionText: 'Repeated supratherapeutic ingestion / dosing error?',
      type: 'boolean',
      info: 'Repeated excessive dosing over >24 hours, accidental dosing error, multiple paracetamol-containing products, or staggered ingestion.'
    },

    {
      id: 'hasHighRiskFactors',
      questionText: 'Any high-risk factors?',
      type: 'boolean',
      info: 'Prolonged fasting, malnutrition, chronic liver disease, dehydration, chronic illness, enzyme-inducing drugs, or uncertain history.'
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    const weight = Number(data.weight);
    const time = Number(data.ingestionTime);
    const level = Number(data.paracetamolLevel);
    const ingestedDose = Number(data.ingestedDose);

    const acute = data.isAcuteIngestion === true;
    const unknownTime = data.isUnknownTime === true;
    const extendedRelease = data.isExtendedRelease === true;
    const levelAvailable = data.levelAvailable === true;
    const levelDelayed = data.levelWillBeDelayed === true;
    const symptomatic = data.hasSymptoms === true;
    const abnormalLabs = data.hasAbnormalLiverTests === true;
    const rsti = data.isRepeatedSupratherapeutic === true;
    const highRisk = data.hasHighRiskFactors === true;

    if (!weight || weight <= 0) {
      details.push("Enter a valid weight to support pediatric dosing and risk assessment.");
    }

    if (symptomatic || abnormalLabs) {
      details.push(
        "Symptoms or abnormal liver/metabolic tests are present. Treat as high-risk toxicity and start NAC while urgently consulting toxicology/poison center."
      );
      return { level: 'severe', details };
    }

    if (rsti) {
      details.push(
        "Repeated supratherapeutic ingestion or dosing error: Rumack-Matthew nomogram is NOT applicable."
      );
      details.push(
        "Obtain acetaminophen level, AST/ALT, PT/INR, bilirubin, glucose, electrolytes/CO2, urea/creatinine."
      );

      if (levelAvailable && !isNaN(level) && level > 10) {
        details.push(
          `Detectable acetaminophen level (${level} mcg/mL) in repeated supratherapeutic ingestion. Consider/start NAC and discuss with toxicology.`
        );
        return { level: 'severe', details };
      }

      details.push(
        "If acetaminophen level is detectable, AST/ALT abnormal, INR elevated, or patient symptomatic → NAC indicated."
      );
      return { level: 'moderate', details };
    }

    if (!acute || unknownTime) {
      details.push(
        "Not a clear single acute ingestion or timing is unknown/unreliable. Rumack-Matthew nomogram is NOT applicable."
      );
      details.push(
        "Start NAC if ingestion may be toxic, level is detectable, labs are abnormal, or reliable risk assessment cannot be completed promptly."
      );
      return { level: 'severe', details };
    }

    if (!isNaN(ingestedDose) && ingestedDose >= 300) {
      details.push(
        `High-risk/massive pediatric ingestion estimated at ${ingestedDose} mg/kg. Start NAC empirically while awaiting level and consult toxicology.`
      );
      return { level: 'severe', details };
    }

    if (!isNaN(ingestedDose) && ingestedDose >= 150) {
      details.push(
        `Potentially toxic pediatric ingestion estimated at ${ingestedDose} mg/kg. Timed serum level is required.`
      );

      if (!isNaN(time) && time >= 8 && (!levelAvailable || isNaN(level))) {
        details.push(
          "More than 8 hours since ingestion and level is unavailable. Start NAC immediately; do not wait for the result."
        );
        return { level: 'severe', details };
      }

      if (levelDelayed) {
        details.push(
          "Serum level will not be available before 8 hours post-ingestion. Start NAC empirically."
        );
        return { level: 'severe', details };
      }

      if (!levelAvailable || isNaN(level)) {
        details.push(
          "Level is pending/unavailable. If result will be available before 8 hours and patient is stable, wait for timed level; otherwise start NAC."
        );
        return { level: 'moderate', details };
      }
    }

    if (extendedRelease) {
      details.push(
        "Possible extended-release ingestion. Consider repeat acetaminophen levels and toxicology consultation even if initial level is below treatment line."
      );
    }

    if (levelAvailable && !isNaN(level)) {
      if (!isNaN(time) && time < 4) {
        details.push(
          "Level drawn before 4 hours is not reliable for nomogram risk assessment. Repeat level at ≥4 hours after ingestion."
        );
        if (!isNaN(ingestedDose) && ingestedDose >= 150) {
          details.push(
            "Because the dose is potentially toxic, ensure result will be available before 8 hours; otherwise start NAC."
          );
        }
        return { level: 'moderate', details };
      }

      if (!isNaN(time) && time >= 4 && time <= 24) {
        const treatmentThreshold = 150 * Math.exp(-0.068 * (time - 4));

        if (level >= treatmentThreshold) {
          details.push(
            `Level ${level} mcg/mL at ${time} hours is ON/ABOVE the treatment line. NAC indicated.`
          );
          return { level: 'severe', details };
        }

        details.push(
          `Level ${level} mcg/mL at ${time} hours is below the treatment line. NAC not indicated if history is reliable, single acute immediate-release ingestion, and patient remains well.`
        );

        if (extendedRelease) {
          details.push(
            "Because extended-release ingestion is possible, repeat level may be required before clearance."
          );
          return { level: 'moderate', details };
        }

        return { level: 'mild', details };
      }

      if (!isNaN(time) && time > 24) {
        details.push(
          "Presentation is >24 hours after ingestion. Nomogram is not reliable; assess clinically and with liver/metabolic labs."
        );
        details.push(
          "If acetaminophen level is detectable, AST/ALT abnormal, INR elevated, or symptoms present → start NAC."
        );
        return { level: 'moderate', details };
      }
    }

    if (!isNaN(ingestedDose) && ingestedDose < 150 && !highRisk) {
      details.push(
        `Estimated ingestion ${ingestedDose} mg/kg is below usual pediatric toxic threshold, with no high-risk factors.`
      );
      details.push(
        "Observe clinically; consider level/labs if history unreliable, symptomatic, very young child, or co-ingestion concern."
      );
      return { level: 'mild', details };
    }

    if (highRisk) {
      details.push(
        "High-risk factors are present. Use lower threshold for labs, observation, toxicology discussion, and empiric NAC if risk assessment is delayed."
      );
      return { level: 'moderate', details };
    }

    details.push(
      "Risk cannot be fully assessed. Enter dose, timing, ingestion type, level availability, and symptoms/labs."
    );
    return { level: 'unknown', details };
  },

  getManagement: (severity) => {
    const management = [
      {
        title: "Initial Pediatric Assessment",
        recommendations: [
          "Assess ABCs, vital signs, mental status, glucose, hydration, and co-ingestion risk.",
          "Clarify formulation: immediate-release vs extended-release; single acute vs staggered/repeated dosing.",
          "Check exact time of ingestion, estimated total dose in mg/kg, and reliability of caregiver history.",
          "Do NOT use Rumack-Matthew nomogram for unknown time, staggered ingestion, repeated supratherapeutic ingestion, or delayed presentation with liver injury."
        ]
      },
      {
        title: "Labs / Monitoring",
        recommendations: [
          "Serum acetaminophen/paracetamol level: draw at 4 hours post-ingestion or immediately if presentation is after 4 hours.",
          "Baseline labs: AST/ALT, PT/INR, bilirubin, glucose, electrolytes/CO2, urea/creatinine.",
          "If delayed presentation, abnormal labs, symptoms, or NAC is started: repeat AST/ALT, INR, creatinine, glucose, and acetaminophen level according to local toxicology protocol.",
          "For repeated supratherapeutic ingestion: obtain acetaminophen level and liver/metabolic labs; nomogram is not applicable."
        ]
      },
      {
        title: "Activated Charcoal",
        recommendations: [
          "Consider activated charcoal 1 g/kg PO/NG, max 50 g, if significant ingestion and presentation is usually within 1–4 hours.",
          "Use only if airway is protected and aspiration risk is low.",
          "Discuss with toxicology for massive ingestion, extended-release product, or delayed gastric emptying."
        ]
      }
    ];

    if (severity.level === 'severe') {
      management.push({
        title: "Final Decision: NAC Indicated / Start Now",
        recommendations: [
          "Start IV N-acetylcysteine immediately.",
          "Do not delay NAC if level is unavailable and patient is >8 hours from potentially toxic ingestion.",
          "Start NAC for level on/above treatment line, unknown/unreliable timing with possible toxic ingestion, symptoms, abnormal AST/ALT or INR, or repeated supratherapeutic ingestion with detectable level/abnormal labs.",
          "Consult toxicology/poison control early.",
          "Admit for NAC infusion and serial monitoring.",
          "PICU if encephalopathy, hypoglycemia, severe acidosis, shock, INR significantly elevated, active bleeding, or acute liver failure concern."
        ]
      });
    } else if (severity.level === 'moderate') {
      management.push({
        title: "Final Decision: Awaiting Risk Stratification / Possible Empiric NAC",
        recommendations: [
          "If ingestion is potentially toxic and acetaminophen level will not be available before 8 hours post-ingestion → start NAC empirically.",
          "If level was drawn before 4 hours → repeat at ≥4 hours.",
          "If extended-release ingestion possible → consider repeat level even if first level is below treatment line.",
          "If repeated supratherapeutic ingestion → use labs and detectable level to decide NAC; do not use nomogram.",
          "Observe in ED or admit depending on timing, reliability, symptoms, lab turnaround, and toxicology advice."
        ]
      });
    } else if (severity.level === 'mild') {
      management.push({
        title: "Final Decision: Low Risk / NAC Usually Not Required",
        recommendations: [
          "NAC is not indicated if reliable single acute immediate-release ingestion, timed level is below treatment line, and child is asymptomatic.",
          "If dose <150 mg/kg, child is well, and history is reliable, observation and discharge advice may be appropriate.",
          "Give clear return precautions: vomiting, abdominal pain, lethargy, jaundice, bleeding, confusion, or worsening condition.",
          "Ensure safe medication counseling: correct dose, avoid duplicate paracetamol-containing products, and safe storage."
        ]
      });
    } else {
      management.push({
        title: "Final Decision: Incomplete Data",
        recommendations: [
          "Cannot safely classify risk without dose, timing, ingestion pattern, symptoms, and level/lab availability.",
          "If history is unreliable or lab result is delayed beyond 8 hours after possible toxic ingestion, treat as high-risk and start NAC.",
          "Discuss with toxicology/poison control."
        ]
      });
    }

    return management;
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return [
        "Admit for NAC infusion and serial monitoring.",
        "PICU if encephalopathy, hypoglycemia, metabolic acidosis, shock, INR significantly elevated, active bleeding, renal impairment, or acute liver failure concern.",
        "Consider transfer to a center with pediatric toxicology/PICU/liver transplant capability if severe hepatotoxicity or liver failure develops."
      ];
    }

    if (severity.level === 'moderate') {
      return [
        "Observe in ED or admit until acetaminophen level and liver/metabolic labs allow safe risk stratification.",
        "Start NAC if results are delayed beyond 8 hours after potentially toxic ingestion.",
        "Do not discharge if timing is unreliable, ingestion is staggered/repeated, extended-release ingestion possible, or follow-up is unsafe."
      ];
    }

    if (severity.level === 'mild') {
      return [
        "May discharge if child is asymptomatic, history is reliable, ingestion is below toxic threshold OR timed level is below treatment line, and no concerning labs.",
        "Provide medication safety counseling and return precautions."
      ];
    }

    return [
      "Disposition cannot be determined. Complete assessment and discuss with toxicology if risk remains unclear."
    ];
  },

  getRedFlags: () => [
    "Acetaminophen/paracetamol level on or above Rumack-Matthew treatment line.",
    "Estimated acute ingestion ≥150 mg/kg in a child.",
    "High-risk/massive ingestion ≥300 mg/kg.",
    "Unknown time, unreliable history, staggered ingestion, or repeated supratherapeutic dosing.",
    "Serum level unavailable before 8 hours after potentially toxic ingestion.",
    "Vomiting, RUQ pain, lethargy, jaundice, altered mental status.",
    "Elevated AST/ALT, elevated INR, hypoglycemia, metabolic acidosis, renal impairment.",
    "Possible extended-release product or significant co-ingestion.",
    "Any intentional overdose in adolescent."
  ],

  getDrugDoses: (): DrugDose[] => [
    {
      drugName: "Activated Charcoal",
      dose: "1 g/kg PO/NG once; maximum 50 g.",
      notes:
        "Consider within 1–4 hours of significant ingestion if airway protected. Discuss with toxicology for massive ingestion, extended-release product, or delayed gastric emptying."
    },
    {
      drugName: "N-acetylcysteine (NAC) IV",
      dose:
        "Common 21-hour IV protocol: 150 mg/kg loading dose over 1 hour, then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours.",
      notes:
        "Use institution-specific pediatric fluid-adjusted dilution/infusion volumes. Avoid adult default fluid volumes in small children. Consult pharmacy/toxicology for infants, low-weight children, fluid restriction, renal/cardiac disease, or severe toxicity."
    },
    {
      drugName: "N-acetylcysteine continuation",
      dose:
        "Continue beyond standard protocol if acetaminophen level remains detectable, AST/ALT rising, INR abnormal, acidosis/renal impairment present, or patient clinically unwell.",
      notes:
        "Stopping NAC should be based on clinical status, acetaminophen level, liver enzymes, INR, renal function, and toxicology advice."
    }
  ],

  getReferences: () => [
    {
      title: "Royal Children's Hospital Melbourne: Paracetamol poisoning guideline",
      url: "https://www.rch.org.au/clinicalguide/guideline_index/paracetamol_poisoning/"
    },
    {
      title: "FDA Acetadote label: start NAC if acetaminophen concentration unavailable within 8 hours",
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/021539s019lbl.pdf"
    },
    {
      title: "NSW Agency for Clinical Innovation: Management of paracetamol overdose",
      url: "https://aci.health.nsw.gov.au/networks/eci/clinical/tools/paracetamol"
    },
    {
      title: "Medical Journal of Australia: Updated guidelines for paracetamol poisoning",
      url: "https://pubmed.ncbi.nlm.nih.gov/31786822/"
    }
  ],
};
