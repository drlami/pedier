import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const organophosphorusIngestionProtocol: DiseaseProtocol = {
  id: 'organophosphorus-ingestion',
  name: 'Organophosphate / Carbamate Poisoning',
  system: 'Toxins and Poisoning',
  description:
    'Severity- and phenotype-oriented management of cholinergic crisis due to organophosphate or carbamate poisoning. Separates muscarinic, nicotinic, CNS, and respiratory toxicity to guide atropine, pralidoxime, airway support, and disposition.',
  image: {
    url: "https://picsum.photos/seed/organophosphorus-ingestion/600/400",
    hint: "pesticide warning"
  },

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },

    {
      id: 'knownOrganophosphate',
      questionText: 'Known/suspected organophosphate exposure?',
      type: 'boolean',
      info: 'Organophosphates usually require atropine for muscarinic toxicity and pralidoxime for nicotinic weakness.'
    },
    {
      id: 'suspectedCarbamate',
      questionText: 'Known/suspected carbamate exposure?',
      type: 'boolean',
      info: 'Carbamates are usually shorter acting. Atropine remains the main antidote; pralidoxime is usually reserved for severe or uncertain cases.'
    },
    {
      id: 'skinOrClothingContaminated',
      questionText: 'Skin/clothing contamination present?',
      type: 'boolean'
    },

    {
      id: 'muscarinicSigns',
      questionText: 'Muscarinic/wet cholinergic signs present?',
      type: 'boolean',
      info: 'Salivation, lacrimation, bronchorrhea, bronchospasm, bradycardia, vomiting, diarrhea, sweating, miosis.'
    },
    {
      id: 'nicotinicSigns',
      questionText: 'Nicotinic/dry weakness signs present?',
      type: 'boolean',
      info: 'Fasciculations, muscle weakness, paralysis, tachycardia, hypertension. Atropine does NOT treat isolated nicotinic weakness.'
    },
    {
      id: 'copiousSecretions',
      questionText: 'Copious oral/bronchial secretions?',
      type: 'boolean'
    },
    {
      id: 'bronchospasm',
      questionText: 'Bronchospasm/wheeze with respiratory symptoms?',
      type: 'boolean'
    },
    {
      id: 'respFailure',
      questionText: 'Respiratory failure or need for ventilatory support?',
      type: 'boolean'
    },
    {
      id: 'alteredMentalStatus',
      questionText: 'Altered mental status/coma?',
      type: 'boolean'
    },
    {
      id: 'seizures',
      questionText: 'Seizures present?',
      type: 'boolean'
    },
    {
      id: 'shockOrHypotension',
      questionText: 'Shock, hypotension, or severe bradycardia?',
      type: 'boolean'
    }
  ],

  calculateSeverity: (data: FormData): Severity => {
    const severeFeatures: string[] = [];
    const moderateFeatures: string[] = [];

    if (data.respFailure) severeFeatures.push("Respiratory failure or ventilatory support needed.");
    if (data.seizures) severeFeatures.push("Seizures present.");
    if (data.copiousSecretions) severeFeatures.push("Copious bronchial/oral secretions.");
    if (data.alteredMentalStatus) severeFeatures.push("Altered mental status or coma.");
    if (data.shockOrHypotension) severeFeatures.push("Shock, hypotension, or severe bradycardia.");

    if (severeFeatures.length > 0) {
      return {
        level: 'severe',
        details: [
          "SEVERE cholinesterase-inhibitor toxicity.",
          ...severeFeatures,
          "Treat immediately with airway support, targeted atropine for muscarinic features, pralidoxime for organophosphate/unknown exposure or nicotinic weakness, benzodiazepines for seizures, and PICU care."
        ]
      };
    }

    if (data.muscarinicSigns) moderateFeatures.push("Muscarinic/wet cholinergic signs present.");
    if (data.nicotinicSigns) moderateFeatures.push("Nicotinic weakness/fasciculations present.");
    if (data.bronchospasm) moderateFeatures.push("Bronchospasm/wheeze present.");

    if (moderateFeatures.length > 0) {
      return {
        level: 'moderate',
        details: [
          "MODERATE systemic toxicity.",
          ...moderateFeatures,
          "Management depends on phenotype: wet patient needs atropine; dry weak patient needs airway monitoring and pralidoxime."
        ]
      };
    }

    return {
      level: 'mild',
      details: [
        "MILD or possible early exposure.",
        "No systemic muscarinic, nicotinic, CNS, or respiratory toxicity selected.",
        "Observe carefully because symptoms may evolve after significant exposure."
      ]
    };
  },

  getManagement: (severity, data) => {
    const isMuscarinic = !!data.muscarinicSigns || !!data.copiousSecretions || !!data.bronchospasm || !!data.shockOrHypotension;
    const isNicotinic = !!data.nicotinicSigns;
    const isolatedNicotinic = isNicotinic && !isMuscarinic;
    const mixedToxicity = isNicotinic && isMuscarinic;
    const likelyOP = !!data.knownOrganophosphate || (!data.suspectedCarbamate && (severity.level === 'moderate' || severity.level === 'severe'));

    const management = [
      {
        title: "Immediate Safety, ABCs & Decontamination",
        recommendations: [
          "Use staff protection: gloves, gown, eye protection, and mask if contamination/aerosol risk.",
          "Move patient away from exposure source.",
          "Assess ABCs immediately.",
          "Give oxygen if respiratory symptoms, secretions, weakness, altered mental status, seizure, or shock.",
          "Attach cardiac monitor, pulse oximetry, and frequent blood pressure monitoring.",
          "Establish IV/IO access.",
          "Check bedside glucose in altered mental status or seizure.",
          data.skinOrClothingContaminated
            ? "Decontaminate immediately: remove all clothing, double-bag contaminated clothes, wash skin/hair thoroughly with soap and water, and irrigate exposed eyes."
            : "Inspect for skin/clothing contamination and decontaminate if suspected."
        ]
      },
      {
        title: "Calculator Interpretation",
        recommendations: [
          `Calculated severity: ${severity.level.toUpperCase()}.`,
          isolatedNicotinic
            ? "Phenotype: PREDOMINANTLY NICOTINIC / DRY WEAK PATIENT."
            : mixedToxicity
              ? "Phenotype: MIXED MUSCARINIC + NICOTINIC TOXICITY."
              : isMuscarinic
                ? "Phenotype: PREDOMINANTLY MUSCARINIC / WET PATIENT."
                : "Phenotype: NO CLEAR SYSTEMIC TOXICITY YET.",
          "Wet patient = secretions, bronchospasm, bradycardia, vomiting/diarrhea → atropine is the key antidote.",
          "Dry weak patient = fasciculations, weakness, paralysis without secretions → atropine has limited benefit; airway monitoring and pralidoxime are the priority.",
          "Reassess frequently because the phenotype may evolve."
        ]
      }
    ];

    if (severity.level === 'mild') {
      management.push({
        title: "Mild / Possible Early Exposure",
        recommendations: [
          "Observe in ED with repeated respiratory, neurologic, and cholinergic assessment.",
          "No routine atropine if completely asymptomatic and no muscarinic/wet signs.",
          "If muscarinic signs develop, start atropine and reclassify as moderate/severe.",
          "If nicotinic weakness develops, monitor airway closely and consider pralidoxime if organophosphate/unknown exposure.",
          "Consider admission or extended observation for significant ingestion, intentional poisoning, unknown agent, unreliable history, or poor follow-up."
        ]
      });
    }

    if (severity.level === 'moderate' || severity.level === 'severe') {
      if (isolatedNicotinic) {
        management.push({
          title: "Predominantly Nicotinic Toxicity: Dry Weak Patient",
          recommendations: [
            "Main danger is respiratory muscle weakness/paralysis, not secretions.",
            "Monitor respiratory effort, oxygen saturation, mental status, cough strength, bulbar weakness, and progression of weakness.",
            "Prepare for early airway support if weakness progresses or ventilation becomes inadequate.",
            "Pralidoxime is strongly recommended if organophosphate exposure is known/suspected or the agent is unknown.",
            data.suspectedCarbamate && !data.knownOrganophosphate
              ? "If pure carbamate exposure is confidently known, pralidoxime is less clearly beneficial; discuss with toxicology. If uncertain, severe, or mixed exposure, treat as organophosphate/unknown."
              : "Give pralidoxime early because atropine does not reverse nicotinic weakness.",
            "Atropine is NOT primary therapy for isolated weakness/fasciculations.",
            "Start atropine immediately if muscarinic signs appear later: bronchorrhea, salivation, bronchospasm, bradycardia, vomiting, diarrhea, or wet chest."
          ]
        });
      }

      if (isMuscarinic && !isolatedNicotinic) {
        management.push({
          title: mixedToxicity ? "Mixed Toxicity: Wet + Weak Patient" : "Predominantly Muscarinic Toxicity: Wet Patient",
          recommendations: [
            "Atropine is the priority treatment for muscarinic/wet toxicity.",
            severity.level === 'severe'
              ? "Initial atropine dose: 0.05 mg/kg IV."
              : "Initial atropine dose: 0.02 mg/kg IV.",
            "Repeat atropine every 3–5 minutes and double each dose until bronchial secretions dry, bronchospasm improves, and oxygenation improves.",
            "Do NOT titrate atropine to pupil size.",
            "Tachycardia alone is NOT a contraindication to atropine if secretions or bronchospasm persist.",
            mixedToxicity
              ? "Because nicotinic weakness is also present, give pralidoxime early in addition to atropine."
              : "Give pralidoxime if organophosphate/unknown exposure, moderate-to-severe toxicity, or any weakness/fasciculations."
          ]
        });
      }

      management.push({
        title: "Pralidoxime / 2-PAM Decision",
        recommendations: [
          likelyOP
            ? "Organophosphate or unknown significant exposure: pralidoxime is recommended, especially with nicotinic weakness/fasciculations or moderate-to-severe toxicity."
            : "Known carbamate exposure: atropine is usually the main treatment; pralidoxime is optional and should be discussed with toxicology unless severe/uncertain exposure.",
          "Pralidoxime is most useful for nicotinic manifestations such as fasciculations, weakness, paralysis, and respiratory muscle weakness.",
          "Do not delay airway support while waiting for pralidoxime effect."
        ]
      });
    }

    if (severity.level === 'severe') {
      management.push({
        title: "Severe / Life-Threatening Toxicity",
        recommendations: [
          "Call senior pediatrician/intensivist/anesthetist and toxicology/poison center immediately.",
          "Prepare for early intubation if respiratory failure, coma, seizures, severe bronchorrhea, bulbar weakness, or progressive muscle weakness.",
          "Suction airway aggressively if wet secretions are present.",
          "Treat seizures with benzodiazepines.",
          "Avoid succinylcholine for RSI because organophosphate poisoning may prolong paralysis; prefer rocuronium if paralytic is required.",
          "PICU admission is required."
        ]
      });
    }

    management.push({
      title: "Atropinization Endpoint",
      recommendations: [
        "Adequate atropinization = dry bronchial secretions, improved air entry, improved oxygen saturation, reduced bronchospasm, and improved perfusion.",
        "Do NOT aim for normal pupils.",
        "Miosis may persist despite adequate treatment.",
        "If recurrent secretions, wheeze, sweating, bradycardia, or wet chest return, repeat atropine boluses and consider infusion."
      ]
    });

    management.push({
      title: "Monitoring & Delayed Complications",
      recommendations: [
        "Continuous pulse oximetry and cardiorespiratory monitoring.",
        "Repeat assessment of secretions, air entry, oxygenation, respiratory effort, heart rate, blood pressure, mental status, and muscle strength.",
        "Consider blood gas if respiratory distress, weakness, hypoventilation, shock, or altered mental status.",
        "Cholinesterase levels may support diagnosis but must not delay treatment.",
        "Monitor for intermediate syndrome 24–96 hours after exposure: neck flexor weakness, proximal weakness, cranial nerve weakness, or respiratory muscle weakness.",
        "Delayed neuropathy may occur days to weeks later after some organophosphate exposures."
      ]
    });

    return management;
  },

  getDisposition: (severity, data) => {
    const isMuscarinic = !!data.muscarinicSigns || !!data.copiousSecretions || !!data.bronchospasm || !!data.shockOrHypotension;
    const isolatedNicotinic = !!data.nicotinicSigns && !isMuscarinic;

    if (severity.level === 'severe') {
      return [
        "PICU admission required.",
        "Indications: respiratory failure, copious secretions needing repeated atropine, seizures, coma/altered mental status, shock/hypotension, severe bradycardia, or significant/progressive nicotinic weakness.",
        "Continue close respiratory monitoring and antidotal therapy."
      ];
    }

    if (severity.level === 'moderate') {
      if (isolatedNicotinic) {
        return [
          "Admit for monitored care because isolated nicotinic weakness can progress to respiratory muscle paralysis.",
          "Consider PICU if weakness is progressive, bulbar signs appear, gas exchange worsens, or airway support may be needed.",
          "Toxicology/poison center consultation recommended."
        ];
      }

      return [
        "Admit for monitored care.",
        "Consider PICU if repeated atropine boluses/infusion required, worsening secretions, bronchospasm, weakness, abnormal blood gas, or unstable vitals.",
        "Toxicology/poison center consultation recommended."
      ];
    }

    return [
      "Observe in ED if asymptomatic or minimally symptomatic.",
      "Discharge only if clinically well after adequate observation, no evolving muscarinic/nicotinic symptoms, normal respiratory status, reliable caregivers, and senior/toxicology agreement.",
      "Admit or observe longer if ingestion was intentional, significant, unknown agent, unreliable history, or poor follow-up."
    ];
  },

  getRedFlags: () => [
    "Respiratory distress or respiratory failure",
    "Copious bronchorrhea/oral secretions",
    "Bronchospasm/wheeze with hypoxia",
    "Generalized muscle weakness, fasciculations, or paralysis",
    "Bulbar weakness, weak cough, or poor airway protection",
    "Seizures",
    "Altered mental status or coma",
    "Bradycardia with hypotension/shock",
    "Need for repeated atropine boluses",
    "Recurrent wet chest after initial atropinization",
    "Intermediate syndrome 24–96 hours later: neck/proximal/respiratory muscle weakness"
  ],

  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    const isMuscarinic = !!data.muscarinicSigns || !!data.copiousSecretions || !!data.bronchospasm || !!data.shockOrHypotension;
    const isNicotinic = !!data.nicotinicSigns;
    const isolatedNicotinic = isNicotinic && !isMuscarinic;

    const roundDose = (value: number) => {
      if (value < 1) return value.toFixed(2);
      if (value < 10) return value.toFixed(1);
      return value.toFixed(0);
    };

    if (weight > 0) {
      const atropineMgPerKg = severity.level === 'severe' ? 0.05 : 0.02;
      const atropineStartMg = Math.max(atropineMgPerKg * weight, 0.1);
      const atropineDose2 = atropineStartMg * 2;
      const atropineDose3 = atropineStartMg * 4;
      const atropineDose4 = atropineStartMg * 8;

      doses.push({
        drugName: "Atropine IV",
        dose: isolatedNicotinic
          ? "Not primary therapy unless muscarinic signs develop"
          : `${roundDose(atropineStartMg)} mg initial dose`,
        notes: isolatedNicotinic
          ? "Isolated nicotinic toxicity detected: atropine does not treat fasciculations, weakness, paralysis, or respiratory muscle weakness. Start atropine only if wet/muscarinic signs appear: bronchorrhea, salivation, bronchospasm, bradycardia, vomiting, diarrhea, or sweating."
          : severity.level === 'mild'
            ? "Use only if muscarinic symptoms develop. Pediatric dose 0.02 mg/kg IV, minimum 0.1 mg."
            : `Repeat every 3–5 min and double if secretions/bronchospasm persist: ${roundDose(atropineStartMg)} mg → ${roundDose(atropineDose2)} mg → ${roundDose(atropineDose3)} mg → ${roundDose(atropineDose4)} mg. Endpoint: dry chest and improved oxygenation, not pupil size.`
      });

      doses.push({
        drugName: "Atropine infusion IV",
        dose: isolatedNicotinic
          ? "Usually not needed unless muscarinic signs develop"
          : "Consider after adequate atropinization if repeated boluses are required",
        notes: isolatedNicotinic
          ? "Do not use atropine infusion for isolated dry weakness alone. Use if recurrent wet chest/bronchorrhea after atropinization."
          : "Common approach: start infusion at about 10–20% of the total atropine dose required for initial atropinization per hour, then titrate to keep chest dry and oxygenation stable. Use senior/toxicology guidance."
      });

      const pamLow = Math.min(25 * weight, 2000);
      const pamHigh = Math.min(50 * weight, 2000);
      const pamInfLow = 10 * weight;
      const pamInfHigh = 20 * weight;

      doses.push({
        drugName: "Pralidoxime / 2-PAM IV",
        dose: `Loading: ${roundDose(pamLow)}–${roundDose(pamHigh)} mg IV over 30 min`,
        notes:
          data.suspectedCarbamate && !data.knownOrganophosphate
            ? `Carbamate suspected: pralidoxime benefit is less certain. Use if severe, mixed/unknown exposure, or toxicology recommends. If used: loading 25–50 mg/kg IV max 2 g, then ${roundDose(pamInfLow)}–${roundDose(pamInfHigh)} mg/hr infusion.`
            : `Recommended for organophosphate or unknown significant exposure, especially nicotinic weakness/fasciculations. Maintenance infusion: 10–20 mg/kg/hr = ${roundDose(pamInfLow)}–${roundDose(pamInfHigh)} mg/hr.`
      });

      doses.push({
        drugName: "Diazepam IV",
        dose: `${roundDose(0.1 * weight)}–${roundDose(0.3 * weight)} mg IV`,
        notes: "For seizures. Repeat as clinically required with airway support."
      });

      doses.push({
        drugName: "Midazolam",
        dose: `${roundDose(0.1 * weight)} mg IV/IM/IN`,
        notes: "Alternative benzodiazepine for active seizure when IV access is delayed. Follow local seizure protocol."
      });

      doses.push({
        drugName: "RSI paralytic warning",
        dose: "Avoid succinylcholine",
        notes: "Prefer rocuronium if paralysis is required because organophosphate poisoning may prolong succinylcholine paralysis."
      });
    } else {
      doses.push({
        drugName: "Atropine IV",
        dose: isolatedNicotinic
          ? "Not primary therapy unless muscarinic signs develop"
          : "Moderate: 0.02 mg/kg IV; Severe: 0.05 mg/kg IV",
        notes: isolatedNicotinic
          ? "Atropine does not reverse isolated nicotinic weakness/fasciculations. Use if bronchorrhea, bronchospasm, salivation, vomiting/diarrhea, sweating, bradycardia, or wet chest appear."
          : "Minimum 0.1 mg. Repeat every 3–5 min and double until bronchial secretions dry and oxygenation improves."
      });

      doses.push({
        drugName: "Pralidoxime / 2-PAM IV",
        dose: "25–50 mg/kg IV over 30 min, max 2 g; then 10–20 mg/kg/hr infusion",
        notes: "Most important when nicotinic weakness/fasciculations are present in organophosphate or unknown exposure."
      });

      doses.push({
        drugName: "Diazepam IV",
        dose: "0.1–0.3 mg/kg IV",
        notes: "For seizure control."
      });

      doses.push({
        drugName: "RSI paralytic warning",
        dose: "Avoid succinylcholine",
        notes: "Prefer rocuronium if RSI is required."
      });
    }

    return doses;
  },

  getReferences: () => [
    {
      title: "Merck Manual Professional: Organophosphate and Carbamate Poisoning",
      url: "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning"
    },
    {
      title: "StatPearls: Organophosphate Toxicity",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK470430/"
    },
    {
      title: "SCHN Guideline: Organophosphate/Carbamate Exposure - Management",
      url: "https://resources.schn.health.nsw.gov.au/policies/policies/pdf/2012-9045.pdf"
    },
    {
      title: "CHEMM: Pralidoxime",
      url: "https://chemm.hhs.gov/countermeasure_pralidoxime.htm"
    }
  ],
};
