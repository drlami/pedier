import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    {
      id: 'known_chd',
      question: 'Known congenital or acquired heart disease?',
      redFlag: true,
      ifYes: 'Cardiogenic or obstructive shock more likely. Use cautious fluid boluses (5–10 mL/kg only). Avoid aggressive volume loading.',
    },
    {
      id: 'known_metabolic',
      question: 'Known metabolic disorder, epilepsy, or neuromuscular disease?',
      redFlag: false,
      ifYes: 'Metabolic crisis, hypoglycaemia, or seizure may be the primary cause. Check glucose immediately.',
    },
    {
      id: 'immunocompromised',
      question: 'Immunocompromised, on chemotherapy, or post-transplant?',
      redFlag: true,
      ifYes: 'High infection risk with atypical pathogens. Low threshold for broad-spectrum IV antibiotics and PICU consultation.',
    },
    {
      id: 'trauma',
      question: 'History of trauma, near-drowning, smoke inhalation, or foreign body?',
      redFlag: true,
      ifYes: 'Obstructive or hypovolaemic causes possible. Immobilise cervical spine if trauma. Assess for occult haemorrhage.',
    },
    {
      id: 'toxic_ingestion',
      question: 'Known or suspected toxic ingestion or envenomation?',
      redFlag: true,
      ifYes: 'Toxicology emergency. Identify agent — some have specific antidotes. Do NOT induce vomiting. Call Poison Control.',
    },
    {
      id: 'cpr_started',
      question: 'CPR already in progress on arrival?',
      redFlag: true,
      ifYes: 'Cardiac arrest confirmed. Continue CPR immediately — do not pause for history. Assess rhythm at first opportunity.',
    },
    {
      id: 'fever_illness',
      question: 'Fever, recent infection, or non-blanching rash?',
      redFlag: false,
      ifYes: 'Distributive (septic) shock likely. Take blood cultures before antibiotics; start broad-spectrum IV antibiotics within 60 min of recognition.',
    },
    {
      id: 'allergy_anaphylaxis',
      question: 'Known allergy, recent allergen exposure, urticaria, or angioedema?',
      redFlag: true,
      ifYes: 'ANAPHYLAXIS — adrenaline (epinephrine) IM 0.01 mg/kg outer thigh IMMEDIATELY. Do not delay for IV access.',
    },
  ],

  investigations: [
    {
      test: 'Bedside glucose (point-of-care)',
      category: 'urgent',
      indication: 'Mandatory in ALL seriously ill children. Hypoglycaemia is common, correctable, and life-threatening if missed.',
      criticalValue: '< 60 mg/dL → give 2 mL/kg of 10% dextrose IV/IO immediately.',
    },
    {
      test: 'Continuous SpO₂ + cardiac monitoring + BP every 5 min',
      category: 'urgent',
      indication: 'Baseline physiological trending. A single value is less meaningful than the trend during resuscitation.',
    },
    {
      test: 'Venous blood gas (VBG) + lactate',
      category: 'urgent',
      indication: 'Lactate ≥ 4 mmol/L = severe tissue hypoperfusion. Serial lactate guides adequacy of resuscitation.',
      criticalValue: 'Rising lactate despite treatment = inadequate resuscitation or incorrect shock type identified.',
    },
    {
      test: 'ECG (12-lead or rhythm strip)',
      category: 'urgent',
      indication: 'Arrhythmia as primary cause (VF/pVT, SVT, complete heart block). Required before cardioversion.',
    },
    {
      test: 'Blood culture × 2 (before antibiotics)',
      category: 'blood',
      indication: 'If sepsis suspected. Do NOT delay antibiotics > 15 min to collect cultures.',
      criticalValue: 'Start broad-spectrum IV antibiotics within 60 min of recognition of septic shock.',
    },
    {
      test: 'CBC + differential, electrolytes, creatinine, BUN',
      category: 'blood',
      indication: 'Baseline organ function. Haematocrit guides transfusion in haemorrhagic shock. Electrolytes for metabolic derangement.',
    },
    {
      test: 'Troponin + BNP',
      category: 'blood',
      indication: 'Order if cardiogenic shock suspected, myocarditis possible, known CHD, or failure to respond to fluids.',
      criticalValue: 'Elevated troponin in shock = cardiogenic or myocarditis — change fluid strategy urgently.',
    },
    {
      test: 'CXR (portable; erect if stable)',
      category: 'radiology',
      indication: 'Cardiomegaly = cardiogenic; pulmonary oedema = heart failure; unilateral absent sounds = pneumothorax or haemothorax.',
      criticalValue: 'Absent lung markings unilaterally → needle decompression NOW if haemodynamically unstable. Do not wait for CXR confirmation.',
    },
    {
      test: 'Bedside echo (FAST/cardiac views)',
      category: 'radiology',
      indication: 'Most valuable in undifferentiated shock. Assess IVC (inferior vena cava) collapse (volume status), LV function, pericardial effusion.',
      criticalValue: 'Empty collapsing ventricles = hypovolaemic. Poor LV function = cardiogenic. Pericardial effusion = tamponade → pericardiocentesis.',
    },
  ],

  admissionCriteria: [
    'Any cardiac arrest (return of spontaneous circulation achieved) — PICU mandatory',
    'Any PAT component abnormal that does not fully normalise with initial treatment',
    'Identified life-threatening cause: septic shock, cardiogenic shock, respiratory failure, metabolic crisis',
    'PICU if: ongoing haemodynamic instability, need for vasoactive infusion, altered consciousness, organ dysfunction',
    'Observation ward minimum 4–6 h if single PAT component abnormal, improved with treatment, and cause identified',
  ],

  highRiskFactors: [
    'Age < 3 months — limited physiological reserve, rapid deterioration',
    'Known immunocompromised state (chemotherapy, HIV, congenital immunodeficiency)',
    'Known congenital heart disease — atypical presentation, narrow therapeutic window',
    'Suspected non-accidental injury — safeguarding referral + trauma assessment',
    'No identifiable cause after initial assessment — broadened workup required before discharge',
  ],

  dischargeCriteria: [
    'All 3 PAT components normal on repeat assessment after treatment',
    'AVPU (Alert, Voice, Pain, Unresponsive) = Alert and returning to baseline per caregiver',
    'SpO₂ ≥ 95% on room air, sustained ≥ 30 min without supplemental oxygen',
    'Glucose ≥ 60 mg/dL without ongoing dextrose infusion',
    'Cause identified, treated, and unlikely to recur without further intervention',
    'First-dose definitive treatment given in ER if applicable (antibiotics, steroids, epinephrine)',
    'Reliable caregiver present with clear written return-to-ER instructions',
  ],

  safetyNetting: [
    'Return immediately if child becomes harder to rouse or does not recognise caregiver.',
    'Return immediately if breathing becomes fast, laboured, or stops.',
    'Return immediately if skin becomes pale, mottled, grey, or blue around the lips.',
    'Return if child cannot drink, has persistent vomiting, or urine output decreases significantly.',
    'Follow-up with primary care within 24–48 h after discharge.',
  ],
};

export const palsSystematicApproachProtocol: DiseaseProtocol = {
  id: 'pals-systematic-approach',
  name: 'Systematic Approach to the Seriously Ill Child',
  unit: 'er',
  system: 'PALS',
  description: 'The AHA PALS Evaluate–Identify–Intervene (EII) framework for any seriously ill or injured child. Begins with the Paediatric Assessment Triangle (PAT) for an immediate visual impression, then applies the primary ABCDE assessment to identify the problem category — respiratory, circulatory (shock), metabolic/toxic, or combined cardiopulmonary failure — and directs targeted intervention. AHA PALS 2020.',
  lastUpdated: 'June 2026',
  image: {
    url: 'https://picsum.photos/seed/pals-approach/600/400',
    hint: 'paediatric resuscitation team assessment',
  },
  erData,

  questions: [
    {
      id: 'weight',
      questionText: 'Patient Weight',
      type: 'number',
      unit: 'kg',
      placeholder: 'e.g. 15',
    },
    {
      id: 'pat_appearance',
      questionText: 'PAT — Appearance (TICLS)',
      type: 'select',
      info: 'Tone, Interactiveness, Consolability, Look/Gaze, Speech/Cry. Abnormal = limp, unresponsive, inconsolable, glazed gaze, or weak/abnormal cry.',
      options: [
        { label: 'Normal — alert, interactive, strong cry, age-appropriate', value: 'normal', score: 0 },
        { label: 'Abnormal — any TICLS feature abnormal', value: 'abnormal', score: 2 },
      ],
    },
    {
      id: 'pat_breathing',
      questionText: 'PAT — Work of Breathing',
      type: 'select',
      info: 'Assess retractions (intercostal, subcostal, suprasternal), nasal flaring, head bobbing, and audible sounds (grunting, stridor, wheezing, snoring).',
      options: [
        { label: 'Normal — no increased effort, no abnormal sounds', value: 'normal', score: 0 },
        { label: 'Increased effort — retractions, flaring, grunting, stridor, or abnormal posturing', value: 'increased', score: 2 },
        { label: 'Absent or agonal — apnoea or gasping only', value: 'absent', score: 5 },
      ],
    },
    {
      id: 'pat_circulation',
      questionText: 'PAT — Circulation to Skin',
      type: 'select',
      info: 'Inspect skin colour and perfusion. Petechiae or purpura suggest meningococcaemia — treat as a septic emergency regardless of other findings.',
      options: [
        { label: 'Normal — pink, warm, well-perfused', value: 'normal', score: 0 },
        { label: 'Abnormal — pallor or mottling', value: 'abnormal', score: 2 },
        { label: 'Critical — cyanosis, petechiae, or purpura', value: 'critical_circ', score: 5 },
      ],
    },
    {
      id: 'breathing_present',
      questionText: 'Is the child breathing? (visible chest rise or air movement)',
      type: 'boolean',
    },
    {
      id: 'pulse_present',
      questionText: 'Palpable pulse present? (carotid / brachial / femoral)',
      type: 'boolean',
    },
    {
      id: 'avpu',
      questionText: 'Level of consciousness — AVPU scale',
      type: 'select',
      info: 'A = Alert (fully awake). V = Responds to Voice only. P = Responds to Pain only. U = Unresponsive to all stimuli. AVPU of P/U = Glasgow Coma Scale (GCS) ≤ 8.',
      options: [
        { label: 'A — Alert, age-appropriate behaviour', value: 'A', score: 0 },
        { label: 'V — Responds to Voice only', value: 'V', score: 1 },
        { label: 'P — Responds to Pain only', value: 'P', score: 3 },
        { label: 'U — Unresponsive to all stimuli', value: 'U', score: 5 },
      ],
    },
    {
      id: 'problem_type',
      questionText: 'Identified problem type (after ABCDE assessment)',
      type: 'select',
      info: 'Complete PAT + ABCDE assessment first. Select the primary physiological problem driving the presentation.',
      options: [
        { label: 'Not yet determined', value: 'unknown', score: 0 },
        { label: 'Respiratory — airway obstruction or breathing failure', value: 'respiratory', score: 0 },
        { label: 'Circulatory — shock (any type)', value: 'shock', score: 0 },
        { label: 'Both — cardiopulmonary failure', value: 'both', score: 0 },
        { label: 'Metabolic / toxic / neurological', value: 'metabolic', score: 0 },
        { label: 'Stable — no problem identified', value: 'stable', score: 0 },
      ],
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const breathingPresent = data.breathing_present;
    const pulsePresent     = data.pulse_present;
    const avpu             = data.avpu as string;
    const patAppearance    = data.pat_appearance as string;
    const patBreathing     = data.pat_breathing as string;
    const patCirculation   = data.pat_circulation as string;
    const details: string[] = [];

    // Cardiac arrest — overrides all other scoring
    if (breathingPresent === false || pulsePresent === false) {
      if (breathingPresent === false) details.push('No breathing detected — respiratory or cardiac arrest.');
      if (pulsePresent === false) details.push('No palpable pulse — cardiac arrest confirmed.');
      details.unshift('CARDIAC ARREST — Start CPR immediately. 30:2 (single rescuer) or 15:2 (two-rescuer). See Cardiac Arrest protocol.');
      return {
        level: 'critical',
        details,
        scoreDetails: {
          systemName: 'PAT + AVPU',
          totalScore: 10,
          maxScore: 10,
          interpretation: 'CARDIAC ARREST — CPR NOW',
        },
      };
    }

    // Absent/agonal breathing with pulse — respiratory arrest, always critical
    if (patBreathing === 'absent') {
      details.push('PAT breathing ABSENT or agonal — respiratory arrest. BVM ventilation now.');
      if (patAppearance === 'abnormal') details.push('Appearance ABNORMAL — TICLS features abnormal.');
      if (patCirculation === 'critical_circ') details.push('Circulation CRITICAL — cyanosis or petechiae/purpura.');
      if (patCirculation === 'abnormal') details.push('Circulation ABNORMAL — pallor or mottling.');
      if (avpu === 'U') details.push('Consciousness: UNRESPONSIVE (U) — airway at immediate risk.');
      if (avpu === 'P') details.push('Consciousness: Responds to Pain only (P) — severely reduced consciousness.');
      details.unshift('RESPIRATORY ARREST — BVM (bag-mask ventilation) at 20–30 breaths/min. If no improvement or HR < 60 → start CPR.');
      return {
        level: 'critical',
        details,
        scoreDetails: {
          systemName: 'PAT + AVPU',
          totalScore: 9,
          maxScore: 10,
          interpretation: 'RESPIRATORY ARREST — Ventilate now',
        },
      };
    }

    // Accumulate PAT score and count abnormal components
    let patScore = 0;
    let abnormalComponents = 0;

    if (patAppearance === 'abnormal') {
      patScore += 2;
      abnormalComponents++;
      details.push('Appearance ABNORMAL — TICLS features abnormal (tone, interactiveness, consolability, look, or cry).');
    }
    if (patBreathing === 'increased') {
      patScore += 2;
      abnormalComponents++;
      details.push('Work of Breathing INCREASED — retractions, nasal flaring, grunting, stridor, or abnormal positioning.');
    }
    if (patCirculation === 'abnormal') {
      patScore += 2;
      abnormalComponents++;
      details.push('Circulation ABNORMAL — pallor or mottling. Assess capillary refill, peripheral pulses, BP.');
    }
    if (patCirculation === 'critical_circ') {
      patScore += 5;
      abnormalComponents++;
      details.push('Circulation CRITICAL — cyanosis or petechiae/purpura. If petechiae: assume meningococcaemia. Broad-spectrum IV antibiotics immediately.');
    }

    // AVPU score
    let avpuScore = 0;
    if (avpu === 'V') { avpuScore = 1; details.push('Consciousness: Responds to Voice only (V) — reduced alertness.'); }
    if (avpu === 'P') { avpuScore = 3; details.push('Consciousness: Responds to Pain only (P) — severely reduced. Airway at risk. Consider jaw thrust/airway adjunct.'); }
    if (avpu === 'U') { avpuScore = 5; details.push('Consciousness: UNRESPONSIVE (U) — position airway immediately. BVM if breathing inadequate.'); }

    const totalScore = patScore + avpuScore;

    let level: SeverityLevel;
    let interpretation: string;

    if (totalScore >= 8 || avpu === 'U' || abnormalComponents >= 3) {
      level = 'critical';
      interpretation = 'CRITICAL — Immediate life-threatening emergency';
      details.unshift('CRITICAL — Multiple PAT components abnormal or unresponsive. Simultaneous airway and circulation support required. Call PICU now.');
    } else if (totalScore >= 4 || avpu === 'P' || abnormalComponents >= 2) {
      level = 'severe';
      interpretation = 'SEVERE DISTRESS — Life-threatening emergency';
      details.unshift('SEVERE DISTRESS — Multiple PAT abnormalities or severely reduced consciousness. Immediate ABCDE assessment and intervention required.');
    } else if (totalScore >= 1 || avpu === 'V' || abnormalComponents >= 1) {
      level = 'moderate';
      interpretation = 'COMPENSATED DISTRESS — Urgent assessment required';
      details.unshift('COMPENSATED DISTRESS — At least one PAT component abnormal. Initiate primary ABCDE assessment without delay.');
    } else if (
      patAppearance === 'normal' &&
      (patBreathing === 'normal' || !patBreathing) &&
      (patCirculation === 'normal' || !patCirculation) &&
      (avpu === 'A' || !avpu)
    ) {
      level = 'low';
      interpretation = 'STABLE — Proceed with systematic assessment';
      details.push('All PAT components normal and child fully alert. Proceed with secondary ABCDE assessment and detailed history.');
    } else {
      level = 'unknown';
      interpretation = 'Complete the PAT assessment above to generate a clinical classification';
    }

    return {
      level,
      details,
      scoreDetails: {
        systemName: 'PAT + AVPU Score',
        totalScore,
        maxScore: 10,
        interpretation,
      },
    };
  },

  getManagement: (severity, data) => {
    const problemType   = data.problem_type as string;
    const isArrest      = data.breathing_present === false || data.pulse_present === false;
    const isRespiratory = data.pat_breathing === 'increased' || data.pat_breathing === 'absent' || problemType === 'respiratory' || problemType === 'both';
    const isShock       = data.pat_circulation === 'abnormal' || data.pat_circulation === 'critical_circ' || problemType === 'shock' || problemType === 'both';
    const isCardiogenic = data.known_chd === true || data.rales_hepato === true;

    const step1 = {
      title: 'STEP 1 — IMMEDIATE: First impression (PAT) + activate emergency response',
      recommendations: [
        'Perform PAT (Paediatric Assessment Triangle) simultaneously within 30–60 s of arrival: assess Appearance, Work of Breathing, and Circulation to Skin at a glance — no equipment needed.',
        'Call for senior help and resuscitation team if ANY PAT component is abnormal.',
        'High-flow O₂ 15 L/min via non-rebreather mask (NRM) if PAT abnormal. Titrate to SpO₂ target 94–99%.',
        'Attach SpO₂ monitor, cardiac monitor, and BP cuff immediately.',
        'Bedside glucose STAT — mandatory in every seriously ill child. Correct if < 60 mg/dL with 2 mL/kg of 10% dextrose IV.',
        'Establish IV or IO (intraosseous) access. If IV fails after 2 attempts or 90 s → IO immediately. Never delay resuscitation for venous access.',
      ],
    };

    const step2 = {
      title: 'STEP 2 — REASSESS: Primary ABCDE Assessment — identify the problem type',
      recommendations: [
        'A (Airway): Patent? Snoring = tongue obstruction → jaw thrust or oropharyngeal airway. Stridor = upper airway obstruction (croup, epiglottitis, foreign body). Drooling = do not disturb.',
        'B (Breathing): Count respiratory rate. Assess effort. SpO₂. Auscultate — absent unilateral sounds → tension pneumothorax or haemothorax.',
        'C (Circulation): Heart rate (HR), capillary refill (normal ≤ 2 s), BP, peripheral and central pulse quality. Hepatomegaly + rales = cardiogenic. Poor perfusion = shock.',
        'D (Disability): AVPU (Alert/Voice/Pain/Unresponsive scale). Pupils (unequal or fixed = raised ICP [intracranial pressure]). Glucose (the critical "D" — always check). GCS (Glasgow Coma Scale) if P or U on AVPU.',
        'E (Exposure): Full exposure. Temperature (fever = infection; hypothermia = shock/metabolic). Rash (petechiae = septicaemia). Injuries (trauma). Bleeding. Clues.',
        'IDENTIFY problem type: Respiratory / Circulatory (shock) / Metabolic-toxic-neurological / Combined cardiopulmonary failure / Stable.',
      ],
    };

    const step3 = {
      title: 'STEP 3 — ESCALATION: Targeted intervention by problem type',
      recommendations: [
        isRespiratory
          ? 'RESPIRATORY: Optimise airway position (sniffing position in infant; neutral in child). Suction secretions. O₂ via NRM (non-rebreather mask). If SpO₂ < 90% despite O₂ → BVM (bag-mask ventilation) at 20–30 breaths/min. Call anaesthetics and PICU (paediatric intensive care unit) for early intubation if failing.'
          : 'Respiratory: O₂ if SpO₂ < 94%. Assess airway. Follow specific respiratory protocol if indicated.',
        isShock && isCardiogenic
          ? 'CARDIOGENIC SHOCK: Cautious fluid bolus 5–10 mL/kg isotonic crystalloid over 15–30 min only. Start vasopressor (adrenaline infusion 0.05–0.1 mcg/kg/min) early. PICU and cardiology consult urgently.'
          : isShock
          ? 'SHOCK (distributive/hypovolaemic): Fluid bolus 20 mL/kg isotonic crystalloid over 5–10 min. Reassess after each bolus. If septic: IV antibiotics within 60 min. If no response after 40–60 mL/kg → vasopressors. See Shock Framework and Septic Shock protocols.'
          : 'Circulatory: Assess perfusion trend. Fluid bolus only if evidence of shock. Do not give routine IV fluids to a haemodynamically stable child.',
        problemType === 'metabolic'
          ? 'METABOLIC/TOXIC: Glucose correction. Seizure management (midazolam 0.1 mg/kg IV/IO if seizing). Specific antidote if toxic ingestion known. Ammonia level if metabolic crisis suspected.'
          : 'Metabolic: Correct glucose and electrolytes. Treat active seizures.',
        'Serial reassessment after each intervention: has PAT improved? Has AVPU improved? Is SpO₂ and HR trending better?',
        'Escalate to PICU if: vasoactive infusion needed, ongoing respiratory failure, GCS ≤ 8, or multi-organ involvement.',
      ],
    };

    const step4 = {
      title: 'STEP 4 — LIFE-THREATENING: Cardiopulmonary Failure / Cardiac Arrest',
      recommendations: [
        isArrest
          ? 'CARDIAC ARREST confirmed. CPR (cardiopulmonary resuscitation): 30:2 compressions to breaths (single rescuer) or 15:2 (two rescuers). Rate 100–120/min. Depth ≥ 5 cm (child) or ≥ 4 cm (infant). Full chest recoil. Minimise interruptions.'
          : 'CARDIOPULMONARY FAILURE: all 3 PAT (Paediatric Assessment Triangle) components abnormal, or AVPU (Alert/Voice/Pain/Unresponsive) of P/U with any circulatory abnormality. Simultaneous airway and circulation support required — do not prioritise one over the other.',
        'Rhythm check every 2 min. Shockable (VF [ventricular fibrillation] / pulseless VT [ventricular tachycardia]): defibrillate 2 J/kg unsynchronised → CPR 2 min → repeat 4 J/kg.',
        'Non-shockable (PEA [pulseless electrical activity] / asystole): continue CPR. Adrenaline (epinephrine) 0.01 mg/kg IV/IO (intravenous/intraosseous) every 3–5 min.',
        'Advanced airway: BVM (bag-mask ventilation) first. Endotracheal intubation only by skilled provider. With advanced airway in place: 10–12 breaths/min continuous without pausing compressions.',
        'Reversible causes — 4Hs: Hypoxia, Hypovolaemia, Hydrogen ion (acidosis), Hypo/hyperKalaemia; 4Ts: Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary embolism or coronary).',
        'ROSC (return of spontaneous circulation): target SpO₂ 94–99%, PaCO₂ 35–45 mmHg, SBP ≥ 5th percentile for age. Avoid fever > 37.5°C for 24 h. Transfer to PICU immediately.',
      ],
    };

    // Surface STEP 4 first when presentation is critical/arrest
    if (severity.level === 'critical' || isArrest) {
      return [step4, step3, step1, step2];
    }

    return [step1, step2, step3, step4];
  },

  getDisposition: (severity, data) => {
    if (data.breathing_present === false || data.pulse_present === false) {
      return ['PICU admission mandatory — post-cardiac arrest care required regardless of ROSC status.'];
    }
    if (severity.level === 'critical') {
      return ['PICU admission — immediate. Do not delay for investigations not yet available at bedside.'];
    }
    if (severity.level === 'severe') {
      return [
        'Admit to PICU or HDU (High-Dependency Unit) — continuous cardiac monitoring and nursing observation.',
        'Do not discharge until cause is identified and all PAT components have normalised.',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'Admit to observation ward — minimum 4–6 h observation after initial treatment.',
        'Upgrade to PICU or HDU if PAT does not improve or AVPU deteriorates on reassessment.',
      ];
    }
    return [
      'Discharge if all PAT components normal, AVPU = Alert, SpO₂ ≥ 95% on room air, glucose normal, and cause identified.',
      'Written return-to-ER instructions mandatory. Primary care follow-up within 24–48 h.',
    ];
  },

  getRedFlags: (_severity: Severity, _data: FormData) => [
    'Absent or agonal breathing — respiratory or cardiac arrest',
    'No palpable pulse — cardiac arrest',
    'Unresponsive to all stimuli (U on AVPU scale)',
    'Central cyanosis — blue lips or tongue',
    'HR < 60/min with signs of poor perfusion — start CPR',
    'Petechiae or purpura — treat as meningococcaemia until proven otherwise',
    'Tracheal deviation or absent breath sounds unilaterally — tension pneumothorax',
    'Acute deterioration in level of consciousness — airway at immediate risk',
  ],

  getDrugDoses: (_severity: Severity, data: FormData): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for all dose calculations.' });
      return doses;
    }

    const epiArrest       = Math.min(0.01 * wt, 1).toFixed(3);
    const epiR6           = (0.6 * wt).toFixed(1);
    const dextrose10      = (2 * wt).toFixed(0);
    const fluidStd        = (20 * wt).toFixed(0);
    const fluidCautious   = (10 * wt).toFixed(0);
    const atropineCalc    = (0.02 * wt);
    const atropineDose    = Math.min(Math.max(atropineCalc, 0.1), 0.5).toFixed(3);

    doses.push({
      drugName: 'Adrenaline (epinephrine) IV/IO — cardiac arrest',
      dose: `${epiArrest} mg IV/IO (0.01 mg/kg; max 1 mg)`,
      notes: 'Every 3–5 min during CPR. Flush with 5 mL normal saline after each dose.',
    });
    doses.push({
      drugName: 'Adrenaline (epinephrine) infusion — cold shock or bradycardia with poor perfusion',
      dose: '0.05–0.3 mcg/kg/min IV/IO',
      notes: `Rule of 6: ${epiR6} mg in 100 mL normal saline → 1 mL/h = 0.1 mcg/kg/min`,
    });
    doses.push({
      drugName: 'Noradrenaline (norepinephrine) infusion — warm/distributive shock',
      dose: '0.05–0.5 mcg/kg/min IV/IO',
      notes: `Rule of 6: ${epiR6} mg in 100 mL normal saline → 1 mL/h = 0.1 mcg/kg/min. First choice for warm septic shock.`,
    });
    doses.push({
      drugName: 'Dextrose 10% IV/IO — hypoglycaemia',
      dose: `${dextrose10} mL (2 mL/kg) over 5–10 min`,
      notes: 'For glucose < 60 mg/dL. Recheck glucose 15 min after correction. Start maintenance glucose infusion.',
    });
    doses.push({
      drugName: 'Isotonic crystalloid bolus (0.9% NaCl or Ringer\'s lactate) — shock',
      dose: `${fluidStd} mL (20 mL/kg) over 5–10 min`,
      notes: `Repeat to 40–60 mL/kg if no overload signs. Cardiogenic shock: cautious bolus ${fluidCautious} mL (10 mL/kg) only.`,
    });
    doses.push({
      drugName: 'Atropine IV/IO — vagally-mediated bradycardia or cholinergic toxicity',
      dose: `${atropineDose} mg IV/IO (0.02 mg/kg; minimum 0.1 mg, maximum 0.5 mg)`,
      notes: 'Treat hypoxia FIRST — most paediatric bradycardia is hypoxic in origin. Atropine is NOT the first-line drug for hypoxic bradycardia.',
    });
    doses.push({
      drugName: 'Rescue breathing rate — bag-mask ventilation (BVM)',
      dose: 'Infant: 1 breath every 2–3 s (20–30 breaths/min). Child: 1 breath every 3–5 s (12–20 breaths/min)',
      notes: 'During CPR with advanced airway in place: 10–12 breaths/min continuous — do not pause compressions for breaths.',
    });
    doses.push({
      drugName: 'Defibrillation — VF or pulseless VT',
      dose: 'First shock: 2 J/kg. Second and subsequent shocks: 4 J/kg (max 10 J/kg or adult dose)',
      notes: 'Unsynchronised. Resume CPR immediately after each shock — do not check pulse first.',
    });

    return doses;
  },

  getReferences: () => [
    {
      title: 'AHA PALS Provider Manual 2020 — Parts 4–10: PAT, Evaluate-Identify-Intervene, Respiratory and Circulatory Emergencies',
      url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support',
    },
    {
      title: 'Topjian AA et al. — 2020 AHA Guidelines for CPR and ECC: Paediatric Basic and Advanced Life Support, Circulation 2020',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901',
    },
    {
      title: 'de Caen AR et al. — Part 12: Paediatric Advanced Life Support, Circulation 2015',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000266',
    },
  ],
};
