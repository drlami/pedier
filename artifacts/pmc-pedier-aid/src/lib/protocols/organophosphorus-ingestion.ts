import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const organophosphorusIngestionProtocol: DiseaseProtocol = {
  id: 'organophosphorus-ingestion',
  name: 'Organophosphate / Carbamate Poisoning',
  system: 'Toxins and Poisoning',
  description:
    'Calculator-oriented protocol for pediatric organophosphate/carbamate poisoning. Classifies patients into mild, moderate muscarinic, moderate nicotinic, moderate mixed, or severe toxicity, then shows only the relevant management and final decision cards.',
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
      info: 'Carbamates are usually shorter acting. Atropine is the main antidote; pralidoxime is less clearly beneficial unless severe or uncertain exposure.'
    },
    {
      id: 'skinOrClothingContaminated',
      questionText: 'Skin/clothing contamination present?',
      type: 'boolean'
    },

    {
      id: 'muscarinicSigns',
      questionText: 'Muscarinic / wet cholinergic signs present?',
      type: 'boolean',
      info: 'Salivation, lacrimation, bronchorrhea, bronchospasm, bradycardia, vomiting, diarrhea, sweating, miosis.'
    },
    {
      id: 'nicotinicSigns',
      questionText: 'Nicotinic weakness signs present?',
      type: 'boolean',
      info: 'Fasciculations, muscle weakness, paralysis, tachycardia, hypertension. Atropine does not reverse isolated nicotinic weakness.'
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
    const isMuscarinic =
      !!data.muscarinicSigns ||
      !!data.copiousSecretions ||
      !!data.bronchospasm ||
      !!data.shockOrHypotension;

    const isNicotinic = !!data.nicotinicSigns;

    const severeFeatures: string[] = [];

    if (data.respFailure) severeFeatures.push("Respiratory failure or ventilatory support needed.");
    if (data.seizures) severeFeatures.push("Seizures present.");
    if (data.copiousSecretions) severeFeatures.push("Copious bronchial/oral secretions.");
    if (data.alteredMentalStatus) severeFeatures.push("Altered mental status or coma.");
    if (data.shockOrHypotension) severeFeatures.push("Shock, hypotension, or severe bradycardia.");

    if (severeFeatures.length > 0) {
      return {
        level: 'severe',
        details: [
          "SEVERE TOXICITY — Life-threatening cholinesterase-inhibitor poisoning.",
          ...severeFeatures,
          "Main management: ABC stabilization, oxygen, suction if wet, early airway support if needed, atropine for wet/muscarinic features, pralidoxime for organophosphate/unknown exposure or nicotinic weakness, benzodiazepines for seizures, and PICU admission."
        ]
      };
    }

    if (isMuscarinic && isNicotinic) {
      return {
        level: 'moderate',
        details: [
          "MODERATE MIXED TOXICITY — Wet + weak patient.",
          "Muscarinic signs plus nicotinic weakness/fasciculations are present.",
          "Main management: atropine for wet/muscarinic toxicity PLUS pralidoxime for nicotinic weakness."
        ]
      };
    }

    if (isMuscarinic && !isNicotinic) {
      return {
        level: 'moderate',
        details: [
          "MODERATE MUSCARINIC TOXICITY — Wet patient.",
          "Main danger: bronchorrhea, bronchospasm, bradycardia, secretions, vomiting/diarrhea.",
          "Main management: atropine titration until chest is dry and oxygenation improves."
        ]
      };
    }

    if (isNicotinic && !isMuscarinic) {
      return {
        level: 'moderate',
        details: [
          "MODERATE NICOTINIC TOXICITY — Dry weak patient.",
          "Main danger: respiratory muscle weakness or paralysis.",
          "Main management: close airway/respiratory monitoring and pralidoxime if organophosphate or unknown exposure.",
          "Atropine is not primary therapy unless wet/muscarinic signs develop."
        ]
      };
    }

    return {
      level: 'mild',
      details: [
        "MILD / POSSIBLE EARLY EXPOSURE.",
        "No systemic muscarinic, nicotinic, CNS, shock, or respiratory failure features selected.",
        "Main management: observation and repeated reassessment."
      ]
    };
  },

  getManagement: (severity, data) => {
    const isMuscarinic =
      !!data.muscarinicSigns ||
      !!data.copiousSecretions ||
      !!data.bronchospasm ||
      !!data.shockOrHypotension;

    const isNicotinic = !!data.nicotinicSigns;
    const isolatedNicotinic = isNicotinic && !isMuscarinic;
    const mixedToxicity = isNicotinic && isMuscarinic;
    const isolatedMuscarinic = isMuscarinic && !isNicotinic;

    const initialCard = {
      title: "Initial Safety, ABCs & Decontamination",
      recommendations: [
        "Use PPE: gloves, gown, eye protection, and mask if contamination/aerosol risk.",
        "Move patient away from exposure source.",
        "Assess ABCs immediately.",
        "Give oxygen if respiratory symptoms, weakness, altered mental status, seizure, or shock.",
        "Attach cardiac monitor, pulse oximetry, and frequent blood pressure monitoring.",
        "Establish IV/IO access.",
        "Check bedside glucose if altered mental status or seizure.",
        data.skinOrClothingContaminated
          ? "Decontaminate immediately: remove all clothing, double-bag contaminated clothes, wash skin/hair thoroughly with soap and water, and irrigate exposed eyes."
          : "Inspect for skin/clothing contamination and decontaminate if suspected."
      ]
    };

    const cards = [initialCard];

    if (severity.level === 'mild') {
      cards.push({
        title: "MILD / Possible Early Exposure",
        recommendations: [
          "No systemic toxicity currently selected.",
          "Observe in ED with repeated assessment of secretions, chest, heart rate, blood pressure, mental status, and muscle strength.",
          "No atropine if completely asymptomatic and no wet/muscarinic signs.",
          "If wet/muscarinic signs develop → reclassify as muscarinic toxicity and start atropine.",
          "If weakness/fasciculations develop → reclassify as nicotinic toxicity and consider pralidoxime if organophosphate/unknown exposure.",
          "Consider admission/extended observation if significant ingestion, intentional poisoning, unknown agent, unreliable history, or poor follow-up."
        ]
      });

      cards.push({
        title: "Final Decision",
        recommendations: [
          "Usually ED observation if asymptomatic or minimally symptomatic.",
          "Discharge only if clinically well after adequate observation, no evolving symptoms, normal respiratory status, reliable caregivers, and senior/toxicology agreement.",
          "Admit if exposure was significant, intentional, unknown, unreliable history, poor follow-up, or symptoms evolve."
        ]
      });

      return cards;
    }

    if (severity.level === 'severe') {
      cards.push({
        title: "SEVERE TOXICITY — Emergency Management",
        recommendations: [
          "Call senior pediatrician/intensivist/anesthetist and toxicology/poison center immediately.",
          "Prepare for early intubation if respiratory failure, coma, seizures, severe secretions, bulbar weakness, or progressive muscle weakness.",
          "Give high-flow oxygen and suction airway aggressively if secretions are present.",
          "If wet/muscarinic signs are present: give atropine immediately and titrate rapidly.",
          "If nicotinic weakness/fasciculations are present or organophosphate/unknown exposure: give pralidoxime early.",
          "Treat seizures with benzodiazepines.",
          "Avoid succinylcholine for RSI; prefer rocuronium if paralytic is required."
        ]
      });

      if (isMuscarinic) {
        cards.push({
          title: "Severe Wet / Muscarinic Component — Atropine Target",
          recommendations: [
            "Initial atropine: 0.05 mg/kg IV.",
            "Repeat every 3–5 minutes and double each dose until bronchial secretions dry and oxygenation improves.",
            "Endpoint: dry chest, improved air entry, improved oxygen saturation, reduced bronchospasm, and improved perfusion.",
            "Do not titrate to pupil size.",
            "Tachycardia alone is not a contraindication if secretions/bronchospasm persist.",
            "After adequate atropinization, consider atropine infusion if repeated boluses are required."
          ]
        });
      }

      if (isNicotinic || data.knownOrganophosphate || !data.suspectedCarbamate) {
        cards.push({
          title: "Severe Nicotinic / Organophosphate Component — Pralidoxime",
          recommendations: [
            "Pralidoxime is recommended for organophosphate or unknown severe exposure, especially with weakness, fasciculations, paralysis, or respiratory muscle weakness.",
            "Do not delay airway support while waiting for pralidoxime effect.",
            "If carbamate is confidently known, pralidoxime benefit is less certain; discuss with toxicology, but use if severe/unknown/mixed exposure."
          ]
        });
      }

      cards.push({
        title: "Final Decision",
        recommendations: [
          "PICU admission required.",
          "Continue airway monitoring and antidotal therapy.",
          "Continuous cardiorespiratory monitoring and pulse oximetry.",
          "Repeat assessment of secretions, air entry, respiratory effort, mental status, and muscle strength.",
          "Consider blood gas if respiratory distress, weakness, hypoventilation, shock, or altered mental status.",
          "Monitor for intermediate syndrome 24–96 hours later: neck flexor weakness, proximal weakness, cranial nerve weakness, or respiratory muscle weakness.",
          "Toxicology/poison center consultation recommended."
        ]
      });

      return cards;
    }

    if (isolatedNicotinic) {
      cards.push({
        title: "MODERATE NICOTINIC TOXICITY — Dry Weak Patient",
        recommendations: [
          "This patient has nicotinic toxicity without wet/muscarinic signs.",
          "Main danger: respiratory muscle weakness or paralysis.",
          "Main management: respiratory monitoring, early airway assessment, and pralidoxime if organophosphate/unknown exposure.",
          "Atropine is not primary therapy for isolated fasciculations, weakness, or paralysis.",
          "Start atropine only if wet/muscarinic signs develop: bronchorrhea, salivation, bronchospasm, bradycardia, sweating, vomiting, or diarrhea.",
          "Reassess frequently because muscarinic toxicity may appear later."
        ]
      });

      cards.push({
        title: "Nicotinic Treatment Priority — Pralidoxime + Airway",
        recommendations: [
          "Give pralidoxime early if organophosphate exposure is known/suspected or the agent is unknown.",
          data.suspectedCarbamate && !data.knownOrganophosphate
            ? "If pure carbamate exposure is confidently known, pralidoxime is less clearly beneficial; discuss with toxicology. If uncertain, treat as organophosphate/unknown."
            : "Pralidoxime is important because atropine does not reverse nicotinic weakness.",
          "Monitor respiratory effort, oxygen saturation, cough strength, bulbar weakness, and progression of weakness.",
          "Prepare for airway support if weakness progresses or ventilation becomes inadequate."
        ]
      });

      cards.push({
        title: "Final Decision",
        recommendations: [
          "Admit for monitored care.",
          "Consider PICU if weakness is progressive, bulbar signs appear, gas exchange worsens, abnormal blood gas, or airway support may be needed.",
          "Toxicology/poison center consultation recommended."
        ]
      });

      return cards;
    }

    if (isolatedMuscarinic) {
      cards.push({
        title: "MODERATE MUSCARINIC TOXICITY — Wet Patient",
        recommendations: [
          "This patient has muscarinic/wet toxicity.",
          "Main danger: bronchorrhea, bronchospasm, bradycardia, vomiting/diarrhea, and secretions.",
          "Main management: atropine titration until the chest is dry and oxygenation improves.",
          "Pralidoxime is added if organophosphate/unknown exposure is suspected, or if weakness/fasciculations develop."
        ]
      });

      cards.push({
        title: "Atropine Treatment Card",
        recommendations: [
          "Initial atropine: 0.02 mg/kg IV.",
          "Repeat every 3–5 minutes and double each dose if secretions or bronchospasm persist.",
          "Endpoint: dry bronchial secretions, improved air entry, improved oxygen saturation, reduced bronchospasm, and improved perfusion.",
          "Do not titrate to pupil size.",
          "Miosis may persist despite adequate atropinization.",
          "Tachycardia alone is not a contraindication if wet chest persists."
        ]
      });

      cards.push({
        title: "Final Decision",
        recommendations: [
          "Admit for monitored care.",
          "Consider PICU if repeated atropine boluses/infusion required, worsening secretions, bronchospasm, weakness, abnormal blood gas, or unstable vitals.",
          "Toxicology/poison center consultation recommended."
        ]
      });

      return cards;
    }

    if (mixedToxicity) {
      cards.push({
        title: "MODERATE MIXED TOXICITY — Wet + Weak Patient",
        recommendations: [
          "This patient has both muscarinic/wet toxicity and nicotinic weakness.",
          "Main dangers: airway secretions/bronchospasm plus respiratory muscle weakness.",
          "Main management: atropine for wet symptoms PLUS pralidoxime for nicotinic weakness.",
          "Monitor closely because mixed toxicity can deteriorate rapidly."
        ]
      });

      cards.push({
        title: "Atropine + Pralidoxime Treatment Card",
        recommendations: [
          "Give atropine 0.02 mg/kg IV for wet/muscarinic symptoms.",
          "Repeat atropine every 3–5 minutes and double each dose until bronchial secretions dry and oxygenation improves.",
          "Give pralidoxime early if organophosphate or unknown exposure is suspected.",
          "Atropine treats secretions/bronchospasm/bradycardia but does not reverse muscle weakness.",
          "Pralidoxime is used to improve nicotinic weakness/fasciculations, especially in organophosphate poisoning."
        ]
      });

      cards.push({
        title: "Final Decision",
        recommendations: [
          "Admit for monitored care.",
          "Consider PICU if increasing weakness, respiratory distress, abnormal blood gas, repeated atropine need, unstable vitals, or concern for airway compromise.",
          "Toxicology/poison center consultation recommended."
        ]
      });

      return cards;
    }

    return cards;
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

    const isMuscarinic =
      !!data.muscarinicSigns ||
      !!data.copiousSecretions ||
      !!data.bronchospasm ||
      !!data.shockOrHypotension;

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
          ? "Not primary unless wet/muscarinic signs develop"
          : `${roundDose(atropineStartMg)} mg initial dose`,
        notes: isolatedNicotinic
          ? "Isolated nicotinic toxicity: atropine does not reverse fasciculations, weakness, paralysis, or respiratory muscle weakness. Use atropine only if bronchorrhea, salivation, bronchospasm, bradycardia, sweating, vomiting, or diarrhea develop."
          : `Repeat every 3–5 min and double if secretions/bronchospasm persist: ${roundDose(atropineStartMg)} mg → ${roundDose(atropineDose2)} mg → ${roundDose(atropineDose3)} mg → ${roundDose(atropineDose4)} mg. Endpoint: dry chest and improved oxygenation.`
      });

      doses.push({
        drugName: "Atropine infusion IV",
        dose: isolatedNicotinic
          ? "Usually not needed unless wet/muscarinic signs develop"
          : "Consider after adequate atropinization if repeated boluses are required",
        notes: isolatedNicotinic
          ? "Do not use atropine infusion for isolated dry weakness alone."
          : "Common approach: start around 10–20% of the total atropine dose required for initial atropinization per hour, then titrate to keep chest dry and oxygenation stable. Use senior/toxicology guidance."
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
            ? `Carbamate suspected: benefit is less certain. Use if severe, unknown/mixed exposure, or toxicology recommends. If used, continue infusion 10–20 mg/kg/hr = ${roundDose(pamInfLow)}–${roundDose(pamInfHigh)} mg/hr.`
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
        drugName: "RSI Paralytic Warning",
        dose: "Avoid succinylcholine",
        notes: "Prefer rocuronium if paralysis is required because organophosphate poisoning may prolong succinylcholine paralysis."
      });
    } else {
      doses.push({
        drugName: "Atropine IV",
        dose: isolatedNicotinic
          ? "Not primary unless wet/muscarinic signs develop"
          : "Moderate: 0.02 mg/kg IV; Severe: 0.05 mg/kg IV",
        notes: isolatedNicotinic
          ? "Atropine does not reverse isolated nicotinic weakness/fasciculations. Use only if wet/muscarinic signs appear."
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
        drugName: "RSI Paralytic Warning",
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
