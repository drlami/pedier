import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const organophosphorusIngestionProtocol: DiseaseProtocol = {
  id: 'organophosphorus-ingestion',
  name: 'Organophosphate / Carbamate Poisoning',
  system: 'Toxins and Poisoning',
  description:
    'Severity-oriented management of cholinergic crisis due to organophosphate or carbamate insecticide poisoning. Focuses on ABC stabilization, atropinization endpoints, pralidoxime use, seizure control, and safe disposition.',
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
      info: 'Examples: pesticide/insecticide ingestion, inhalation, or skin exposure. Organophosphates usually require atropine + pralidoxime.'
    },
    {
      id: 'suspectedCarbamate',
      questionText: 'Known/suspected carbamate exposure?',
      type: 'boolean',
      info: 'Carbamates usually cause shorter reversible cholinesterase inhibition. Atropine is primary treatment; pralidoxime is usually reserved for severe/uncertain cases after toxicology advice.'
    },
    {
      id: 'skinOrClothingContaminated',
      questionText: 'Skin/clothing contamination present?',
      type: 'boolean',
      info: 'Contaminated clothing and skin may continue exposing the patient and staff.'
    },

    {
      id: 'muscarinicSigns',
      questionText: 'Muscarinic cholinergic signs present?',
      type: 'boolean',
      info: 'DUMBELS/SLUDGE: diarrhea, urination, miosis, bronchorrhea/bronchospasm/bradycardia, emesis, lacrimation, salivation.'
    },
    {
      id: 'nicotinicSigns',
      questionText: 'Nicotinic signs present?',
      type: 'boolean',
      info: 'Muscle fasciculations, weakness, paralysis, tachycardia, hypertension.'
    },
    {
      id: 'copiousSecretions',
      questionText: 'Copious oral/bronchial secretions or severe bronchorrhea?',
      type: 'boolean',
      info: 'This is a major severity marker. The main atropine endpoint is drying of bronchial secretions and improved oxygenation.'
    },
    {
      id: 'bronchospasm',
      questionText: 'Bronchospasm/wheeze with respiratory symptoms?',
      type: 'boolean',
      info: 'Bronchospasm with bronchorrhea may rapidly progress to respiratory failure.'
    },
    {
      id: 'respFailure',
      questionText: 'Respiratory failure or need for ventilatory support?',
      type: 'boolean',
      info: 'May be due to bronchorrhea, bronchospasm, CNS depression, or neuromuscular weakness.'
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

    if (data.respFailure) severeFeatures.push("Respiratory failure or need for ventilatory support.");
    if (data.seizures) severeFeatures.push("Seizures present.");
    if (data.copiousSecretions) severeFeatures.push("Copious bronchial/oral secretions.");
    if (data.alteredMentalStatus) severeFeatures.push("Altered mental status or coma.");
    if (data.shockOrHypotension) severeFeatures.push("Shock, hypotension, or severe bradycardia.");

    if (severeFeatures.length > 0) {
      return {
        level: 'severe',
        details: [
          "SEVERE cholinergic toxicity.",
          ...severeFeatures,
          "Treat as life-threatening poisoning: airway support, aggressive atropinization, pralidoxime if organophosphate/unknown severe exposure, seizure control, and PICU care."
        ]
      };
    }

    if (data.muscarinicSigns) moderateFeatures.push("Muscarinic signs present.");
    if (data.nicotinicSigns) moderateFeatures.push("Nicotinic signs present.");
    if (data.bronchospasm) moderateFeatures.push("Bronchospasm/wheeze present.");

    if (moderateFeatures.length > 0) {
      return {
        level: 'moderate',
        details: [
          "MODERATE systemic cholinergic toxicity.",
          ...moderateFeatures,
          "Requires antidotal therapy and close monitored admission."
        ]
      };
    }

    return {
      level: 'mild',
      details: [
        "MILD or possible early exposure.",
        "No systemic cholinergic toxicity selected.",
        "Observe carefully because symptoms may evolve, especially after significant ingestion or unknown exposure."
      ]
    };
  },

  getManagement: (severity, data) => {
    const management = [
      {
        title: "Immediate Safety, ABCs & Decontamination",
        recommendations: [
          "This is a potential medical emergency. Staff must use PPE: gloves, gown, eye protection, and mask if aerosol/chemical risk.",
          "Move patient away from the exposure source.",
          "Assess ABCs immediately: airway, breathing, circulation.",
          "Give high-flow oxygen if respiratory symptoms, bronchorrhea, bronchospasm, altered mental status, or shock.",
          "Attach cardiorespiratory monitoring, pulse oximetry, and frequent blood pressure monitoring.",
          "Establish IV/IO access.",
          "Check bedside glucose in any altered mental status or seizure.",
          data.skinOrClothingContaminated
            ? "Decontaminate now: remove all clothing, double-bag contaminated clothes, and wash skin/hair thoroughly with soap and water. Irrigate exposed eyes with saline/water."
            : "If exposure route is unclear, still inspect for contaminated clothes/skin and decontaminate if suspected."
        ]
      },
      {
        title: "Severity Result & Main Treatment Target",
        recommendations: [
          `Calculated severity: ${severity.level.toUpperCase()}.`,
          "The key treatment target is NOT pupil size and NOT tachycardia.",
          "Adequate atropinization means: drying of bronchial secretions, improved air entry, improved oxygen saturation, reduced bronchospasm/wheeze, and improved perfusion.",
          "Tachycardia alone is NOT a contraindication to atropine if bronchorrhea/bronchospasm persists.",
          "Miosis may persist despite adequate atropinization."
        ]
      }
    ];

    if (severity.level === 'mild') {
      management.push({
        title: "Mild / Possible Early Exposure Management",
        recommendations: [
          "Observe in ED with repeated respiratory and neurologic assessment.",
          "No routine atropine if completely asymptomatic and no muscarinic respiratory signs.",
          "If muscarinic symptoms develop, reclassify as MODERATE and start atropine.",
          "If significant ingestion, intentional poisoning, unreliable history, or high-risk pesticide exposure: consult toxicology/poison center and consider admission/extended observation.",
          "Avoid sending home early after a significant exposure because deterioration may be delayed."
        ]
      });
    }

    if (severity.level === 'moderate') {
      management.push({
        title: "Moderate Toxicity Management",
        recommendations: [
          "Start atropine IV immediately if muscarinic signs are present, especially salivation, bronchorrhea, bronchospasm, bradycardia, vomiting, or diarrhea.",
          "Initial atropine dose: 0.02 mg/kg IV. Repeat every 3–5 minutes and double the dose if secretions/bronchospasm persist.",
          "Give pralidoxime if organophosphate exposure is known/suspected, if the agent is unknown with systemic toxicity, or if nicotinic signs are present.",
          data.suspectedCarbamate && !data.knownOrganophosphate
            ? "Because carbamate exposure is suspected: atropine is the main antidote. Pralidoxime is usually optional; use if severe toxicity, uncertain agent, mixed exposure, or after toxicology advice."
            : "Pralidoxime is recommended when organophosphate exposure is suspected, especially with weakness/fasciculations or moderate-to-severe systemic toxicity.",
          "Monitor for progression to respiratory failure, recurrent secretions, weakness, seizures, or shock."
        ]
      });
    }

    if (severity.level === 'severe') {
      management.push({
        title: "Severe / Life-Threatening Toxicity Management",
        recommendations: [
          "Call senior pediatrician/intensivist/anesthetist and toxicology/poison center immediately.",
          "Prepare for early airway control if respiratory failure, copious secretions, coma, seizures, or inability to protect airway.",
          "Suction aggressively. Treat bronchorrhea and bronchospasm with atropine titration.",
          "Initial atropine dose: 0.05 mg/kg IV. Repeat every 3–5 minutes and double each dose until bronchial secretions dry and oxygenation improves.",
          "There is no small fixed maximum atropine dose in severe poisoning; titrate to clinical atropinization endpoint under senior/toxicology guidance.",
          "After adequate atropinization, consider atropine infusion if repeated boluses are required.",
          "Give pralidoxime early if organophosphate or unknown severe cholinesterase-inhibitor poisoning is suspected.",
          "Treat seizures with benzodiazepines.",
          "Avoid succinylcholine for RSI because organophosphate poisoning may prolong paralysis. Prefer rocuronium if paralytic is required."
        ]
      });
    }

    management.push({
      title: "Monitoring & Complications",
      recommendations: [
        "Continuous pulse oximetry and cardiorespiratory monitoring.",
        "Repeat assessment of secretions, air entry, oxygen saturation, respiratory effort, heart rate, blood pressure, mental status, and muscle strength.",
        "Consider blood gas if respiratory distress, hypoventilation, shock, or altered mental status.",
        "Consider electrolytes, glucose, renal/liver function, CK if prolonged weakness/seizure/rhabdomyolysis risk.",
        "Cholinesterase levels may support diagnosis but should NOT delay treatment.",
        "Monitor for recurrent cholinergic symptoms after atropine wears off.",
        "Monitor for intermediate syndrome 24–96 hours after exposure: neck flexor weakness, proximal weakness, cranial nerve weakness, or respiratory muscle weakness.",
        "Delayed neuropathy may occur days to weeks later after some organophosphate exposures."
      ]
    });

    return management;
  },

  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return [
        "PICU admission is required.",
        "Indications: respiratory failure, copious secretions needing repeated atropine, seizures, coma/altered mental status, shock/hypotension, severe bradycardia, or significant nicotinic weakness.",
        "Continue atropine/pralidoxime therapy and close respiratory monitoring."
      ];
    }

    if (severity.level === 'moderate') {
      return [
        "Admit for monitored care.",
        "Consider PICU if repeated atropine boluses/infusion required, worsening secretions, bronchospasm, weakness, abnormal gas, or unstable vitals.",
        "Toxicology/poison center consultation recommended."
      ];
    }

    return [
      "Observe in ED if asymptomatic or minimally symptomatic.",
      "Discharge only if clinically well after adequate observation, no evolving muscarinic/nicotinic symptoms, normal respiratory status, reliable caregivers, and poison center/senior clinician agrees.",
      "Admit/observe longer if ingestion was intentional, significant, unknown agent, unreliable history, or poor follow-up."
    ];
  },

  getRedFlags: () => [
    "Respiratory distress or respiratory failure",
    "Copious bronchorrhea/oral secretions",
    "Bronchospasm/wheeze with hypoxia",
    "Generalized muscle weakness, fasciculations, or paralysis",
    "Seizures",
    "Altered mental status or coma",
    "Bradycardia with hypotension/shock",
    "Need for repeated atropine boluses",
    "Recurrent symptoms after initial atropinization",
    "Intermediate syndrome signs 24–96 hours later: neck/proximal/respiratory muscle weakness"
  ],

  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    const roundDose = (value: number) => {
      if (value < 1) return value.toFixed(2);
      if (value < 10) return value.toFixed(1);
      return value.toFixed(0);
    };

    if (weight > 0) {
      const atropineStartMg =
        severity.level === 'severe'
          ? Math.max(0.05 * weight, 0.1)
          : Math.max(0.02 * weight, 0.1);

      const atropineDose2 = atropineStartMg * 2;
      const atropineDose3 = atropineStartMg * 4;
      const atropineDose4 = atropineStartMg * 8;

      doses.push({
        drugName: "Atropine IV",
        dose:
          severity.level === 'severe'
            ? `${roundDose(atropineStartMg)} mg initial dose`
            : `${roundDose(atropineStartMg)} mg initial dose`,
        notes:
          severity.level === 'mild'
            ? "Use only if muscarinic symptoms develop. Pediatric dose 0.02 mg/kg IV, minimum 0.1 mg."
            : severity.level === 'moderate'
              ? `Moderate toxicity: start 0.02 mg/kg IV. If secretions/bronchospasm persist, repeat every 3–5 min and double: ${roundDose(atropineStartMg)} mg → ${roundDose(atropineDose2)} mg → ${roundDose(atropineDose3)} mg → ${roundDose(atropineDose4)} mg. Endpoint: dry chest/improved oxygenation, not pupil size.`
              : `Severe toxicity: start 0.05 mg/kg IV. Repeat every 3–5 min and double until adequate atropinization: ${roundDose(atropineStartMg)} mg → ${roundDose(atropineDose2)} mg → ${roundDose(atropineDose3)} mg → ${roundDose(atropineDose4)} mg. Endpoint: drying bronchial secretions and improved oxygenation.`
      });

      doses.push({
        drugName: "Atropine infusion IV",
        dose: "Consider after atropinization if repeated boluses are required",
        notes:
          "Common approach: start infusion at about 10–20% of the total atropine dose required for initial atropinization per hour, then titrate to keep chest dry and oxygenation stable. Use senior/toxicology guidance."
      });

      const pamLow = 25 * weight;
      const pamHigh = 50 * weight;
      const pamMaxLow = Math.min(pamLow, 2000);
      const pamMaxHigh = Math.min(pamHigh, 2000);
      const pamInfLow = 10 * weight;
      const pamInfHigh = 20 * weight;

      doses.push({
        drugName: "Pralidoxime / 2-PAM IV",
        dose: `Loading: ${roundDose(pamMaxLow)}–${roundDose(pamMaxHigh)} mg IV over 30 min`,
        notes:
          data.suspectedCarbamate && !data.knownOrganophosphate
            ? `Carbamate suspected: pralidoxime is usually not routinely needed unless severe toxicity, unknown/mixed exposure, or toxicology recommends it. If used: 25–50 mg/kg IV loading, max 2 g, then ${roundDose(pamInfLow)}–${roundDose(pamInfHigh)} mg/hr infusion.`
            : `Use early for organophosphate or unknown significant poisoning, especially with weakness/fasciculations. Dose 25–50 mg/kg IV loading, max 2 g, then continuous infusion 10–20 mg/kg/hr = ${roundDose(pamInfLow)}–${roundDose(pamInfHigh)} mg/hr. Most effective before enzyme aging.`
      });

      const diazepamLow = 0.1 * weight;
      const diazepamHigh = 0.3 * weight;

      doses.push({
        drugName: "Diazepam IV",
        dose: `${roundDose(diazepamLow)}–${roundDose(diazepamHigh)} mg IV`,
        notes: "For seizures. Pediatric dose 0.1–0.3 mg/kg IV. Repeat as clinically required with airway support."
      });

      const midazLow = 0.1 * weight;
      doses.push({
        drugName: "Midazolam",
        dose: `${roundDose(midazLow)} mg IV/IM/IN`,
        notes: "Alternative benzodiazepine for active seizure when diazepam is unavailable or IV access is delayed. Dose commonly 0.1 mg/kg; follow local seizure protocol."
      });

      doses.push({
        drugName: "RSI paralytic warning",
        dose: "Avoid succinylcholine",
        notes: "Use rocuronium if paralysis is required, because organophosphate poisoning may inhibit cholinesterase and prolong succinylcholine paralysis."
      });
    } else {
      doses.push({
        drugName: "Atropine IV",
        dose: "Moderate: 0.02 mg/kg IV; Severe: 0.05 mg/kg IV",
        notes:
          "Minimum 0.1 mg. Repeat every 3–5 min and double each dose until bronchial secretions dry and oxygenation improves. Do not titrate to pupil size."
      });

      doses.push({
        drugName: "Atropine infusion IV",
        dose: "After atropinization if repeated boluses are required",
        notes:
          "Start around 10–20% of the total atropinizing dose per hour and titrate to clinical endpoint with senior/toxicology guidance."
      });

      doses.push({
        drugName: "Pralidoxime / 2-PAM IV",
        dose: "25–50 mg/kg IV over 30 min, max 2 g; then 10–20 mg/kg/hr infusion",
        notes:
          "Use for organophosphate or unknown moderate/severe poisoning, especially nicotinic weakness/fasciculations. Carbamate: usually optional unless severe/uncertain exposure."
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
      title: "MSD Manual Professional: Organophosphate and Carbamate Poisoning",
      url: "https://www.msdmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning"
    },
    {
      title: "Sydney Children's Hospitals Network: Organophosphate/Carbamate Exposure - Management",
      url: "https://resources.schn.health.nsw.gov.au/policies/policies/pdf/2012-9045.pdf"
    },
    {
      title: "Royal Children's Hospital Melbourne: Acute Poisoning Initial Management",
      url: "https://www.rch.org.au/clinicalguide/guideline_index/Poisoning_-_Acute_Guidelines_For_Initial_Management/"
    },
    {
      title: "EMA Guidance: Treatment in Chemical Agent Exposure",
      url: "https://www.ema.europa.eu/en/documents/regulatory-procedural-guideline/ema-guidance-use-medicinal-products-treatment-case-exposure-chemical-agents-used-weapons-terrorism-crime-or-warfare_en.pdf"
    }
  ],
};
