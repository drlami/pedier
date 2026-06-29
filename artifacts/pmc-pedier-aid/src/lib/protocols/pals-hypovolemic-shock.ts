import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    {
      id: 'active_hemorrhage',
      question: 'Active or suspected internal haemorrhage (trauma, haematemesis, melaena, or abdominal distension)?',
      redFlag: true,
      ifYes: 'Haemorrhagic shock — control external bleeding immediately. Give 20 mL/kg NS × 2–3; if no response → packed red blood cells (PRBCs) 10 mL/kg. Activate massive transfusion protocol if available.',
    },
    {
      id: 'dka_suspected',
      question: 'Polyuria, polydipsia, weight loss, or known type 1 diabetes mellitus?',
      redFlag: true,
      ifYes: 'Diabetic ketoacidosis (DKA) with osmotic diuresis — MODIFIED fluid approach: 10–20 mL/kg over 1–2 h (NOT rapid bolus). Follow DKA protocol. Avoid bolus dextrose. Risk of cerebral oedema with rapid osmolality change.',
    },
    {
      id: 'burn_injury',
      question: 'Major burn injury (> 15% total body surface area)?',
      redFlag: true,
      ifYes: 'Burns cause massive third-space losses. Calculate Parkland formula needs. Use isotonic crystalloid (20 mL/kg bolus); colloid later. Arrange burns unit transfer.',
    },
    {
      id: 'fluid_sensitive',
      question: 'Known cardiac disease, renal failure, or severe malnutrition (kwashiorkor)?',
      redFlag: true,
      ifYes: 'Fluid-sensitive patient — reduce bolus to 5–10 mL/kg over 20 min and reassess carefully after each. Risk of pulmonary oedema with standard resuscitation volumes.',
    },
    {
      id: 'sepsis_features',
      question: 'Fever, non-blanching rash, or clinical signs of infection (e.g. gastroenteritis with sepsis features)?',
      redFlag: false,
      ifYes: 'Relative hypovolemia from third-space losses and vasodilation. Distributive component likely — start antibiotics within 60 min if septic shock suspected. Follow Septic Shock protocol.',
    },
    {
      id: 'trauma_mechanism',
      question: 'Mechanism of injury (fall, road traffic collision, penetrating wound, or non-accidental injury)?',
      redFlag: true,
      ifYes: 'Haemorrhagic or obstructive shock possible. Immobilise cervical spine. Assess for occult haemorrhage (chest, abdomen, pelvis). Consider non-accidental injury — safeguarding referral.',
    },
  ],

  investigations: [
    {
      test: 'Bedside glucose (point-of-care)',
      category: 'urgent',
      indication: 'Mandatory in every seriously ill child. Hypoglycaemia is common in infants with shock and rapidly fatal if missed.',
      criticalValue: '< 60 mg/dL → give 2 mL/kg of 10% dextrose IV/IO immediately and recheck in 15 min.',
    },
    {
      test: 'Continuous SpO₂ + cardiac monitor + BP every 5 min',
      category: 'urgent',
      indication: 'Baseline trending. Tachycardia is the earliest and most sensitive sign of hypovolaemia. HR falling toward normal = response to resuscitation.',
    },
    {
      test: 'IV or IO access × 2 sites',
      category: 'urgent',
      indication: 'IO (intraosseous) immediately if IV fails after 2 attempts or 90 seconds. Do NOT delay fluid resuscitation for access.',
    },
    {
      test: 'Venous blood gas (VBG) + lactate + base deficit',
      category: 'urgent',
      indication: 'Lactate ≥ 4 mmol/L = severe tissue hypoperfusion. Base deficit > −8 mEq/L = significant metabolic acidosis. Serial lactate clears with adequate resuscitation.',
      criticalValue: 'Lactate not clearing despite 40–60 mL/kg fluids → inadequate source control or wrong shock type. Reassess diagnosis.',
    },
    {
      test: 'CBC (complete blood count) + type and screen (cross-match if haemorrhage)',
      category: 'blood',
      indication: 'Haematocrit guides transfusion threshold. Cross-match before PRBCs. Leukocytosis suggests concurrent infection.',
    },
    {
      test: 'Electrolytes, urea, creatinine, glucose (BMP panel)',
      category: 'blood',
      indication: 'Assess electrolyte losses (hyponatraemia with vomiting/diarrhoea; hypernatraemia with poor intake). Creatinine for acute kidney injury (AKI). Glucose for DKA.',
    },
    {
      test: 'Urine specific gravity + urinalysis (dipstick)',
      category: 'blood',
      indication: 'Specific gravity > 1.030 confirms significant dehydration. Ketones indicate depleted glucose stores (starvation or DKA). Haematuria in trauma.',
    },
    {
      test: 'Serum albumin — protein-losing states (burns, nephrotic syndrome)',
      category: 'blood',
      indication: 'Order if major burns (> 15% TBSA [total body surface area]), nephrotic syndrome, or crystalloid-refractory shock with suspected hypoalbuminaemia. Low albumin exacerbates third-space fluid losses and tissue oedema. Guides colloid replacement timing.',
      criticalValue: 'Albumin < 15 g/L in burns or nephrotic syndrome with ongoing shock → consider albumin 4–5% infusion; consult senior before starting.',
    },
    {
      test: 'CXR (portable)',
      category: 'radiology',
      indication: 'Exclude pulmonary oedema before aggressive fluid resuscitation. Cardiomegaly suggests unrecognised cardiogenic component.',
    },
    {
      test: 'Bedside FAST scan (Focused Assessment with Sonography for Trauma)',
      category: 'radiology',
      indication: 'If trauma: assess for haemoperitoneum, haemothorax, pericardial effusion. Also assess IVC (inferior vena cava) collapsibility as a marker of volume status.',
      criticalValue: 'Haemoperitoneum or haemopericardium in haemodynamically unstable child → surgical emergency. Do not delay transfer.',
    },
  ],

  admissionCriteria: [
    'Hypotensive shock (SBP below 5th percentile for age) — PICU admission mandatory',
    'Haemorrhagic shock or suspected internal bleeding — surgical and PICU consult immediately',
    'Lactate ≥ 4 mmol/L or base deficit ≤ −8 mEq/L despite initial resuscitation',
    'Compensated shock persisting after first fluid bolus — minimum ward admission with close monitoring',
    'DKA or severe electrolyte abnormality — admit to high-dependency unit (HDU)',
    'Volume requirement > 60 mL/kg within the first hour — PICU admission',
    'Any child < 3 months presenting with shock — PICU regardless of apparent response',
  ],

  highRiskFactors: [
    'Age < 3 months — limited reserve; deterioration is rapid and often without warning',
    'Haemorrhagic shock — ongoing blood loss outpaces resuscitation',
    'DKA — cerebral oedema risk with rapid fluid administration',
    'Known malnutrition or cardiac disease — low tolerance for volume loading',
    'Failure to improve after 40–60 mL/kg isotonic crystalloid — wrong shock type or ongoing source',
  ],

  dischargeCriteria: [
    'HR, capillary refill, and BP all normal and sustained for ≥ 30 min after treatment',
    'AVPU (Alert, Voice, Pain, Unresponsive) = Alert, returning to baseline',
    'SpO₂ ≥ 95% on room air',
    'Tolerating oral fluids without vomiting',
    'Glucose ≥ 60 mg/dL without ongoing IV dextrose',
    'Underlying cause identified and definitively treated (e.g. gastroenteritis — rehydration plan in place)',
    'Reliable caregiver with clear written return-to-ER instructions',
  ],

  safetyNetting: [
    'Return immediately if child becomes limp, difficult to rouse, or unresponsive.',
    'Return immediately if breathing becomes rapid and laboured, or skin turns blue.',
    'Return if urine output drops significantly (dry nappies, no urine for > 6–8 h).',
    'Return if vomiting resumes and child cannot retain oral fluids.',
    'Reassess with primary care or outpatient clinic within 24–48 h.',
  ],
};

export const palsHypovolemicShockProtocol: DiseaseProtocol = {
  id: 'pals-hypovolemic-shock',
  name: 'Hypovolemic Shock',
  unit: 'er',
  system: 'PALS',
  description: 'The most common type of paediatric shock. Results from absolute or relative reduction in intravascular volume — most often from gastroenteritis, haemorrhage, or fluid redistribution (burns, DKA). The cornerstone of treatment is rapid isotonic crystalloid boluses with careful reassessment after each. AHA PALS 2020 — Part 9 & 10.',
  lastUpdated: 'June 2026',
  image: {
    url: 'https://picsum.photos/seed/pals-hypovolemic/600/400',
    hint: 'child IV fluid resuscitation shock',
  },
  erData,

  questions: [
    {
      id: 'weight',
      questionText: 'Patient Weight',
      type: 'number',
      unit: 'kg',
      placeholder: 'e.g. 12',
    },
    {
      id: 'fluid_loss_cause',
      questionText: 'Primary cause of volume loss',
      type: 'select',
      options: [
        { label: 'Gastroenteritis — vomiting and/or diarrhoea', value: 'gastroenteritis' },
        { label: 'Haemorrhage — internal or external bleeding', value: 'hemorrhage' },
        { label: 'Burns — large surface area', value: 'burns' },
        { label: 'Diabetic ketoacidosis (DKA) — osmotic diuresis', value: 'dka' },
        { label: 'Inadequate intake — poor oral intake', value: 'poor_intake' },
        { label: 'Sepsis — third-space redistribution', value: 'sepsis_third_space' },
        { label: 'Other / unknown', value: 'other' },
      ],
    },
    {
      id: 'bp_status',
      questionText: 'Blood pressure for age',
      type: 'select',
      info: 'Hypotension definition (1–10 years): SBP < 70 + (2 × age in years) mmHg. Hypotension is a LATE finding — treat shock before waiting for hypotension.',
      options: [
        { label: 'Normal BP — signs of shock present (compensated)', value: 'compensated', score: 3 },
        { label: 'Hypotensive — SBP below 5th percentile for age', value: 'hypotensive', score: 5 },
        { label: 'Normal BP — no signs of shock (mild dehydration only)', value: 'no_signs', score: 0 },
      ],
    },
    {
      id: 'peripheral_pulses',
      questionText: 'Peripheral pulse quality (radial or dorsalis pedis)',
      type: 'select',
      options: [
        { label: 'Normal — easily palpable', value: 'normal', score: 0 },
        { label: 'Weak — faint but palpable', value: 'weak', score: 2 },
        { label: 'Absent — not palpable', value: 'absent', score: 5 },
      ],
    },
    {
      id: 'cap_refill',
      questionText: 'Capillary refill time (blanch fingertip or sternum)',
      type: 'select',
      options: [
        { label: 'Normal — ≤ 2 seconds', value: 'normal', score: 0 },
        { label: 'Delayed — 3 to 5 seconds', value: 'delayed', score: 2 },
        { label: 'Prolonged — > 5 seconds', value: 'prolonged', score: 4 },
      ],
    },
    {
      id: 'avpu',
      questionText: 'Level of consciousness — AVPU scale',
      type: 'select',
      info: 'A = Alert (fully awake). V = Responds to Voice only. P = Responds to Pain only. U = Unresponsive to all stimuli. AVPU P or U corresponds to GCS (Glasgow Coma Scale) ≤ 8.',
      options: [
        { label: 'A — Alert, age-appropriate', value: 'A', score: 0 },
        { label: 'V — Responds to Voice only', value: 'V', score: 1 },
        { label: 'P — Responds to Pain only', value: 'P', score: 3 },
        { label: 'U — Unresponsive to all stimuli', value: 'U', score: 5 },
      ],
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const bpStatus         = data.bp_status as string;
    const peripheralPulses = data.peripheral_pulses as string;
    const capRefill        = data.cap_refill as string;
    const avpu             = data.avpu as string;
    const fluidCause       = data.fluid_loss_cause as string;
    const details: string[] = [];

    // Score each domain
    const bpScore      = bpStatus === 'hypotensive' ? 5 : bpStatus === 'compensated' ? 3 : 0;
    const pulseScore   = peripheralPulses === 'absent' ? 5 : peripheralPulses === 'weak' ? 2 : 0;
    const capScore     = capRefill === 'prolonged' ? 4 : capRefill === 'delayed' ? 2 : 0;
    const avpuScore    = avpu === 'U' ? 5 : avpu === 'P' ? 3 : avpu === 'V' ? 1 : 0;
    const totalScore   = bpScore + pulseScore + capScore + avpuScore;

    // Build details
    if (bpStatus === 'hypotensive') {
      details.push('Blood pressure HYPOTENSIVE — SBP below 5th percentile for age. Hypotension is a late and ominous sign in paediatric shock.');
    } else if (bpStatus === 'compensated') {
      details.push('Blood pressure normal with signs of shock (compensated) — compensatory vasoconstriction is maintaining BP. Do not be reassured by normal BP.');
    }
    if (peripheralPulses === 'absent') details.push('Peripheral pulses ABSENT — severe vasoconstriction; hypotensive shock likely imminent or already present.');
    else if (peripheralPulses === 'weak') details.push('Peripheral pulses WEAK — reduced cardiac output and increased systemic vascular resistance (SVR).');
    if (capRefill === 'prolonged') details.push('Capillary refill PROLONGED (> 5 s) — severe peripheral hypoperfusion.');
    else if (capRefill === 'delayed') details.push('Capillary refill DELAYED (3–5 s) — impaired peripheral perfusion.');
    if (avpu === 'U') details.push('AVPU = UNRESPONSIVE — profound shock; airway at immediate risk.');
    else if (avpu === 'P') details.push('AVPU = Responds to Pain only — severely impaired consciousness from brain hypoperfusion.');
    else if (avpu === 'V') details.push('AVPU = Responds to Voice only — reduced alertness, early cerebral hypoperfusion.');

    if (fluidCause === 'dka') details.push('Cause: DKA — use modified fluid approach (10–20 mL/kg over 1–2 h, not rapid bolus). Cerebral oedema risk.');
    if (fluidCause === 'hemorrhage') details.push('Cause: Haemorrhage — control bleeding, typed and crossed blood products on standby, limit crystalloid to 40–60 mL/kg then PRBCs.');
    if (fluidCause === 'burns') details.push('Cause: Burns — calculate Parkland formula for ongoing replacement. Burns unit transfer.');

    let level: SeverityLevel;
    let interpretation: string;

    if (totalScore >= 10 || avpu === 'U' || avpu === 'P' || peripheralPulses === 'absent') {
      level = 'critical';
      interpretation = 'HYPOTENSIVE SHOCK — Impending cardiopulmonary failure';
      details.unshift('CRITICAL — Absent peripheral pulses or severely impaired consciousness. Rapid fluid resuscitation and emergency escalation required NOW.');
    } else if (totalScore >= 7 || bpStatus === 'hypotensive') {
      level = 'severe';
      interpretation = 'HYPOTENSIVE SHOCK — Decompensated, SBP below age threshold';
      details.unshift('SEVERE — Hypotensive shock. 20 mL/kg isotonic crystalloid over 5–10 min. Repeat. If haemorrhage: PRBCs urgently.');
    } else if (totalScore >= 3 || bpStatus === 'compensated') {
      level = 'moderate';
      interpretation = 'COMPENSATED SHOCK — Normal BP with signs of impaired perfusion';
      details.unshift('COMPENSATED SHOCK — BP maintained by vasoconstriction but tissue perfusion is impaired. Initiate fluid resuscitation now — do not wait for hypotension.');
    } else if (bpStatus === 'no_signs') {
      level = 'low';
      interpretation = 'MILD DEHYDRATION — Clinical signs of shock absent';
      details.push('Mild dehydration or early volume loss. Oral rehydration if tolerating; monitor closely. Reassess after 30–60 min.');
    } else {
      level = 'unknown';
      interpretation = 'Complete the assessment above to classify shock severity';
    }

    return {
      level,
      details,
      scoreDetails: {
        systemName: 'Hypovolaemic Shock Score (BP + Pulses + Cap Refill + AVPU)',
        totalScore,
        maxScore: 19,
        interpretation,
        referenceTable: [
          { range: '0', meaning: 'Mild dehydration — no shock signs; oral or IV rehydration' },
          { range: '3–6', meaning: 'Compensated shock — normal BP but impaired perfusion; IV fluids now' },
          { range: '7–9', meaning: 'Hypotensive shock — decompensated; rapid boluses required' },
          { range: '≥ 10', meaning: 'Critical — absent pulses or unconsciousness; emergency escalation' },
        ],
      },
    };
  },

  getManagement: (severity, data) => {
    const cause     = data.fluid_loss_cause as string;
    const isDka     = cause === 'dka';
    const isBleed   = cause === 'hemorrhage';
    const isBurns   = cause === 'burns';
    const isSensitive = data.fluid_sensitive === true;
    const wt        = Number(data.weight) || 0;
    const bolus20   = wt > 0 ? `${(20 * wt).toFixed(0)} mL` : '20 mL/kg';
    const bolus10   = wt > 0 ? `${(10 * wt).toFixed(0)} mL` : '10 mL/kg';

    const step1 = {
      title: 'STEP 1 — IMMEDIATE: Secure airway, O₂, monitoring, access',
      recommendations: [
        'High-flow O₂ via non-rebreather mask (NRM) 15 L/min — all shocked children regardless of initial SpO₂.',
        'Continuous SpO₂, cardiac monitor (ECG rhythm), and BP every 5 min.',
        'Establish IV or IO (intraosseous) access immediately — IO if IV not achieved within 90 seconds. Two sites if possible.',
        'Bedside glucose point-of-care test STAT — correct if < 60 mg/dL with 2 mL/kg of 10% dextrose IV/IO.',
        'Position: supine if hypotensive and no respiratory compromise. Comfort position if child is responsive and normotensive.',
        'Alert surgical team if external haemorrhage present — manual pressure or tourniquet immediately; do NOT remove impaled objects.',
      ],
    };

    const step2 = {
      title: 'STEP 2 — FLUID RESUSCITATION: First bolus and reassessment',
      recommendations: [
        isDka
          ? `DKA — MODIFIED FLUID: ${bolus10} of 0.9% NaCl or Ringer's lactate over 60–120 min. Do NOT give a rapid bolus. Follow DKA protocol to avoid cerebral oedema.`
          : isBurns
          ? `Burns — MODIFIED APPROACH: Give initial bolus ${bolus20} (20 mL/kg Ringer's lactate preferred) ONLY if haemodynamically unstable on arrival, then switch immediately to the Parkland formula. Parkland formula for first 24 h (from TIME OF BURN, not arrival): 4 mL × %TBSA (total body surface area) burned × weight (kg) = total 24-hour volume. First half in first 8 h from burn time; second half over next 16 h. Subtract any boluses already given. Target urine output: 1 mL/kg/h (infants and young children) or 0.5 mL/kg/h (older children). BURNS UNIT TRANSFER urgently for burns > 15% TBSA.`
          : isSensitive
          ? `Fluid-sensitive patient: ${bolus10} of isotonic crystalloid over 10–20 min. Monitor SpO₂ and lung sounds closely after each bolus.`
          : `Isotonic crystalloid ${bolus20} (20 mL/kg 0.9% NaCl or Ringer's lactate) over 5–10 minutes. If severe hypotensive shock: push over 5 minutes.`,
        'Reassess after EVERY bolus: HR trend, cap refill, peripheral pulses, BP, mental status, SpO₂.',
        isBleed
          ? `Haemorrhage: CONTROL THE SOURCE FIRST (direct pressure, tourniquets, wound packing). Rule of 3:1 — give 3 mL of isotonic crystalloid for each 1 mL of blood lost (hence large volumes needed before PRBC switch). After 40–60 mL/kg of crystalloid without improvement: give packed red blood cells (pRBCs) ${bolus10} (10 mL/kg) and contact blood bank urgently.`
          : 'If no improvement after initial bolus: repeat 20 mL/kg. Most children with non-haemorrhagic hypovolaemic shock respond within 40–60 mL/kg total.',
        'Stop bolus immediately if: SpO₂ drops, crackles appear, or hepatomegaly develops — consider unrecognised cardiogenic component.',
        'Place urinary catheter to monitor urine output — target 1–2 mL/kg/h (infant/young child) or ≥ 1 mL/kg/h (older child).',
      ],
    };

    const step3 = {
      title: 'STEP 3 — ESCALATION: Treat underlying cause + correct metabolic derangements',
      recommendations: [
        isDka
          ? 'DKA: Insulin infusion 0.05–0.1 units/kg/h after fluid repletion is underway. Monitor glucose, potassium, and osmolality hourly. Switch to 0.45% NaCl + KCl once glucose < 250 mg/dL.'
          : isBleed
          ? 'Haemorrhagic shock: transfuse PRBCs 10 mL/kg. Target haemoglobin (Hb) ≥ 7 g/dL (or ≥ 10 g/dL in ongoing haemorrhage or haemodynamic instability). Activate massive transfusion protocol if > 40 mL/kg blood products needed. If DIC (disseminated intravascular coagulation) develops: FFP (fresh frozen plasma) 10–15 mL/kg for PT/APTT > 2× normal; cryoprecipitate 5 mL/kg if fibrinogen < 1.5 g/L.'
          : isBurns
          ? 'Burns escalation: reassess hourly urine output — if consistently above target (> 1.5 mL/kg/h), reduce infusion rate by 20%. After first 12–24 h, if albumin < 20 g/L: add colloid (albumin 4–5%); consult senior. Contact burns unit to arrange transfer — wound management, escharotomy for circumferential burns with compartment syndrome, and early nasogastric (NG) nutritional support are burns unit responsibilities. Check ionised calcium frequently — citrate from transfusions depletes calcium.'
          : 'Source control: treat underlying cause (antibiotics for septic gastroenteritis, antiemetics for vomiting, ORS (oral rehydration solution) plan for mild-moderate dehydration).',
        'Protein-losing states (severe burns, nephrotic syndrome, severe hypoalbuminaemia): if crystalloid-refractory, consider albumin 4–5% solution or human albumin 20% — consult senior before use.',
        'Correct metabolic derangements: ionised calcium < 1.1 mmol/L → calcium gluconate 100 mg/kg IV over 10 min. Metabolic acidosis usually resolves with adequate fluid resuscitation — bicarbonate only for refractory acidosis causing haemodynamic instability.',
        'Repeat lactate measurement at 60 min — target clearance ≥ 10–15% per hour. Persistent elevation = ongoing source or wrong shock category.',
        'Obtain blood cultures × 2 if fever or clinical signs of infection. Start broad-spectrum IV antibiotics within 60 min if septic shock is suspected.',
        'Transfer to PICU (paediatric intensive care unit) if: volume given > 60 mL/kg, lactate not clearing, haemorrhage not controlled, or AVPU (Alert/Voice/Pain/Unresponsive) ≤ V after resuscitation.',
      ],
    };

    const step4 = {
      title: 'STEP 4 — FAILURE: Refractory hypovolaemic shock → vasopressors + PICU',
      recommendations: [
        'REFRACTORY SHOCK: persistent hypotension or signs of hypoperfusion after 60–80 mL/kg of appropriate fluids.',
        'Start vasopressor: noradrenaline (norepinephrine) 0.05–0.5 mcg/kg/min IV/IO via central access preferred, or adrenaline (epinephrine) 0.05–0.3 mcg/kg/min if cold shock or cardiac compromise.',
        'Respiratory support: if AVPU ≤ V, SpO₂ < 90% despite O₂, or work of breathing is excessive — prepare for endotracheal intubation. Optimise haemodynamics BEFORE induction (vasopressors running, volume given) as induction agents cause vasodilation.',
        'Urgent surgical consult if haemorrhage is not controlled — operative haemostasis or interventional radiology.',
        'Identify and reverse reversible causes: tension pneumothorax (needle decompression), cardiac tamponade (pericardiocentesis), ongoing DKA (insulin protocol).',
        'PICU consultation and direct admission — do NOT discharge a child with refractory shock or who required vasopressors from the ER.',
      ],
    };

    if (severity.level === 'critical') {
      return [step4, step3, step1, step2];
    }
    return [step1, step2, step3, step4];
  },

  getDisposition: (severity, _data) => {
    if (severity.level === 'critical') {
      return [
        'PICU admission immediately — refractory or hypotensive shock with absent pulses or impaired consciousness.',
        'Do not delay PICU transfer for investigations not immediately available at bedside.',
      ];
    }
    if (severity.level === 'severe') {
      return [
        'PICU or HDU (High-Dependency Unit) admission for close haemodynamic monitoring.',
        'Admit under paediatric surgical team if haemorrhagic cause.',
        'Do not discharge until two consecutive reassessments show normal perfusion.',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'Admit to inpatient ward or observation unit — minimum 4–6 h monitoring after initial fluid resuscitation.',
        'Upgrade to HDU or PICU if perfusion does not normalise after 40 mL/kg or AVPU worsens.',
        'Commence oral rehydration if tolerating after initial IV treatment.',
      ];
    }
    return [
      'Discharge if perfusion signs fully normal after oral or IV rehydration, tolerating feeds, and cause identified.',
      'Provide written oral rehydration therapy (ORT) instructions and return-to-ER criteria.',
      'Primary care follow-up within 24–48 h.',
    ];
  },

  getRedFlags: (_severity: Severity, _data: FormData) => [
    'Absent peripheral pulses — severe decompensated shock',
    'Hypotension for age — SBP < 70 + (2 × age in years) mmHg',
    'AVPU P or U — brain hypoperfusion; airway at immediate risk',
    'Capillary refill > 5 seconds — profound peripheral vasoconstriction',
    'No improvement after 40 mL/kg isotonic crystalloid — wrong shock type or ongoing haemorrhage',
    'Deterioration after fluid bolus — suspect cardiogenic or obstructive shock',
    'Active uncontrolled haemorrhage — surgical emergency',
    'DKA — signs of cerebral oedema: headache, altered consciousness, or Cushing triad after fluid start',
  ],

  getDrugDoses: (_severity: Severity, data: FormData): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for all dose calculations.' });
      return doses;
    }

    const bolus20    = (20 * wt).toFixed(0);
    const bolus10    = (10 * wt).toFixed(0);
    const prbc10     = (10 * wt).toFixed(0);
    const dextrose10 = (2 * wt).toFixed(0);
    const epiR6      = (0.6 * wt).toFixed(1);
    const norepiR6   = (0.6 * wt).toFixed(1);
    const calcGluc   = (100 * wt).toFixed(0);

    doses.push({
      drugName: 'Isotonic crystalloid bolus (0.9% NaCl or Ringer\'s lactate)',
      dose: `${bolus20} mL (20 mL/kg) over 5–10 minutes`,
      notes: 'First-line fluid for hypovolaemic shock. Repeat to 40–60 mL/kg total if perfusion does not improve. Use ${bolus10} mL (10 mL/kg) if fluid-sensitive (cardiac or renal disease).',
    });
    doses.push({
      drugName: 'Packed red blood cells (PRBCs) — haemorrhagic shock',
      dose: `${prbc10} mL (10 mL/kg) IV/IO`,
      notes: 'After 40–60 mL/kg crystalloid without improvement, or active haemorrhage with Hb < 7 g/dL. Type-specific preferred; O-negative if emergency.',
    });
    doses.push({
      drugName: 'Dextrose 10% IV/IO — hypoglycaemia',
      dose: `${dextrose10} mL (2 mL/kg) IV/IO over 5 minutes`,
      notes: 'For glucose < 60 mg/dL. Recheck glucose 15 min after. Start maintenance glucose-containing fluid to prevent rebound hypoglycaemia.',
    });
    doses.push({
      drugName: 'Noradrenaline (norepinephrine) infusion — refractory shock',
      dose: '0.05–0.5 mcg/kg/min IV/IO',
      notes: `Rule of 6: ${norepiR6} mg in 100 mL 0.9% NaCl → 1 mL/h = 0.1 mcg/kg/min. First-choice vasopressor for refractory hypovolaemic or distributive shock.`,
    });
    doses.push({
      drugName: 'Adrenaline (epinephrine) infusion — cold/cardiogenic or refractory',
      dose: '0.05–0.3 mcg/kg/min IV/IO',
      notes: `Rule of 6: ${epiR6} mg in 100 mL 0.9% NaCl → 1 mL/h = 0.1 mcg/kg/min. Reserve for cold shock or failure of noradrenaline.`,
    });
    doses.push({
      drugName: 'Calcium gluconate 10% IV/IO — hypocalcaemia or after multiple transfusions',
      dose: `${calcGluc} mg (100 mg/kg; max 3 g) over 10–15 min IV`,
      notes: 'Indicated for ionised calcium < 1.1 mmol/L or if child becomes hypotensive during rapid PRBC transfusion. Calcium is essential for myocardial contractility.',
    });

    return doses;
  },

  getReferences: () => [
    {
      title: 'AHA PALS Provider Manual 2020 — Part 9: Recognizing Shock; Part 10: Managing Shock',
      url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support',
    },
    {
      title: 'Davis AL et al. — American College of Critical Care Medicine Clinical Practice Parameters for Hemodynamic Support of Paediatric and Neonatal Septic Shock, Crit Care Med 2017',
      url: 'https://journals.lww.com/ccmjournal/abstract/2017/06000/american_college_of_critical_care_medicine_clinical.5.aspx',
    },
    {
      title: 'Topjian AA et al. — 2020 AHA Guidelines for CPR and ECC: Paediatric Basic and Advanced Life Support, Circulation 2020',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901',
    },
  ],
};
