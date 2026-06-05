import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'petechiae',        question: 'Petechiae or purpura present (non-blanching spots)?', redFlag: true,  ifYes: 'MENINGOCOCCEMIA until proven otherwise — give IV Ceftriaxone IMMEDIATELY (within 15 min), regardless of other pending investigations. Call PICU.' },
    { id: 'immunocompromised',question: 'Known immunocompromised state? (malignancy, chemotherapy, transplant, congenital immunodeficiency, prolonged steroids > 2 weeks)', redFlag: true, ifYes: 'Broaden empiric coverage: add anti-Pseudomonal agent (Pip-Tazo or Cefepime) + Vancomycin + consider antifungal. Do NOT delay antibiotics for LP.' },
    { id: 'central_line',     question: 'Indwelling central venous line or implanted port?', redFlag: true,  ifYes: 'CRBSI likely — add Vancomycin for MRSA/coagulase-negative Staph. Draw cultures from line AND peripheral vein simultaneously.' },
    { id: 'prior_abx',        question: 'Antibiotics taken in the last 2 weeks?', redFlag: true,  ifYes: 'Higher risk of resistant organisms — review local antibiogram and consider broader empiric coverage (Pip-Tazo + Vancomycin).' },
    { id: 'young_infant',     question: 'Age < 3 months?', redFlag: true,  ifYes: 'Add Ampicillin to cover Group B Streptococcus and Listeria. LP only if haemodynamically stable. Do NOT delay antibiotics.' },
    { id: 'asplenia',         question: 'Asplenia (surgical or functional) or sickle cell disease?', redFlag: true,  ifYes: 'Overwhelming post-splenectomy infection (OPSI) — risk of encapsulated organisms (S. pneumoniae, H. influenzae, N. meningitidis). Ceftriaxone covers; also check vaccination status.' },
    { id: 'source',           question: 'Identifiable source of infection? (respiratory, urinary, skin/soft tissue, abdomen, line, CNS)', ifYes: 'Tailor antibiotic choice to likely source organism. Arrange source control (drain abscess, remove infected line, surgical consult) — antibiotics alone are not sufficient if source persists.' },
    { id: 'chronic',          question: 'Known chronic condition? (CHD, metabolic disease, renal disease, chronic lung)', ifYes: 'Metabolic disease — check glucose and lactate urgently. CHD — echocardiogram to assess cardiac function as component of shock. Chronic renal disease — adjust antibiotic doses.' },
    { id: 'prior_icu',        question: 'Previous PICU admission for sepsis or known drug-resistant organism?', ifYes: 'Review prior microbiology records if available — prior organism and sensitivities should guide empiric antibiotic escalation.' },
    { id: 'fever_duration',   question: 'Fever present for > 5 days before this presentation?', ifYes: 'Prolonged fever with shock — consider Kawasaki disease (< 5 years + 4/5 criteria) or occult bacterial source requiring imaging (e.g. deep abscess).' },
    { id: 'home_abx',         question: 'On oral antibiotics at home (outpatient treatment failure)?', ifYes: 'Treatment failure — assume resistant organism; escalate to IV broad-spectrum (Pip-Tazo or Cefepime + Vancomycin).' },
  ],

  investigations: [
    { test: 'Continuous SpO₂ monitoring', category: 'urgent', indication: 'Mandatory in all sepsis/shock. SpO₂ < 94% = respiratory organ dysfunction (PELOD domain).' },
    { test: 'Bedside blood glucose (BGL)', category: 'urgent', indication: 'Immediately. Hypoglycaemia (< 3.3 mmol/L) is life-threatening and instantly correctable. Repeat hourly during active resuscitation.' },
    { test: 'Venous or arterial lactate', category: 'urgent', indication: 'Mandatory. Lactate ≥ 2 mmol/L = tissue hypoperfusion (even with normal BP). Lactate ≥ 4 mmol/L = severe shock. Repeat every 2 h — target > 10% clearance per hour.', criticalValue: 'Lactate ≥ 4 mmol/L → immediate PICU notification + start vasopressors regardless of BP' },
    { test: '12-lead ECG', category: 'urgent', indication: 'Before starting vasopressors — detect arrhythmia, myocarditis (global ST changes), or prolonged QTc.' },

    { test: 'Blood cultures × 2 (peripheral; plus from each lumen if central line)', category: 'blood', indication: 'Obtain BEFORE antibiotics if feasible — but do NOT delay antibiotics > 10 min for cultures. Two sets maximise sensitivity.', criticalValue: 'Never delay antibiotics > 10 min for blood culture collection' },
    { test: 'CBC with differential', category: 'blood', indication: 'WBC < 4 or > 12 × 10⁹/L, neutrophil bands > 10% supports sepsis. ANC < 500 = febrile neutropenia → consult oncology.', criticalValue: 'ANC < 500 = febrile neutropenia — anti-Pseudomonal cover mandatory; contact oncology' },
    { test: 'CRP + Procalcitonin (PCT)', category: 'blood', indication: 'PCT > 2 ng/mL supports bacterial infection. Not diagnostic alone — use for trend (serial) and antibiotic de-escalation guidance.' },
    { test: 'Blood gas (venous or arterial) — serial', category: 'blood', indication: 'pH, PaCO₂, HCO₃⁻, base excess, lactate. Metabolic acidosis (pH < 7.3, BE < −5) + high lactate = severity marker for organ dysfunction.', criticalValue: 'pH < 7.25 + lactate > 4 mmol/L = critical — PICU immediately' },
    { test: 'Electrolytes (Na, K, Cl, HCO₃, Ca, Mg)', category: 'blood', indication: 'Electrolyte disturbances worsen haemodynamics. Ionised Ca²⁺ < 1.1 mmol/L → correct before or during resuscitation. Mg for vasopressor-refractory shock.', criticalValue: 'Ionised Ca²⁺ < 0.9 mmol/L or K⁺ > 6.0 mmol/L = urgent correction required' },
    { test: 'Urea + Creatinine (Renal function)', category: 'blood', indication: 'Baseline renal function. AKI (rising creatinine) = PELOD organ dysfunction. Adjust antibiotic doses (vancomycin, aminoglycosides) for renal impairment.' },
    { test: 'LFTs (ALT, AST, bilirubin, GGT)', category: 'blood', indication: 'Hepatic dysfunction (transaminitis, elevated bilirubin) = PELOD organ failure. Also relevant for medication clearance.' },
    { test: 'Coagulation screen (PT, APTT, fibrinogen, D-dimer, platelets)', category: 'blood', indication: 'Screen for DIC — a major cause of sepsis mortality. Coagulopathy = PELOD domain.', criticalValue: 'PT/APTT > 2× normal + platelets < 50 × 10⁹/L + fibrinogen < 1.5 g/L = DIC — give FFP + cryoprecipitate' },
    { test: 'Group & Save (or crossmatch if expected to bleed)', category: 'blood', indication: 'In anticipation of blood product resuscitation. Hb < 70 g/L during active shock resuscitation → transfuse.' },
    { test: 'Urine M/C/S (catheter specimen in nappied children)', category: 'blood', indication: 'UTI is the most common identifiable bacterial source in infants. Catheter specimen mandatory for reliable culture result in pre-continent children.' },
    { test: 'LP (lumbar puncture) — if meningitis suspected', category: 'blood', indication: 'Only if clinically stable, no raised ICP signs, normal coagulation, platelets > 50. ALWAYS give antibiotics FIRST if patient is unstable — LP can be performed later.', criticalValue: 'NEVER delay antibiotics for LP. Give Ceftriaxone first if bacterial meningitis is possible' },

    { test: 'CXR (portable AP)', category: 'radiology', indication: 'Pulmonary source (pneumonia, pleural effusion, pulmonary oedema). NOT routine if no respiratory symptoms — only if source unclear or significant respiratory component.' },
    { test: 'Bedside USS — FAST + cardiac views (POCUS)', category: 'radiology', indication: 'Rapid: identify pericardial effusion/tamponade, pleural effusion, assess cardiac function (myocarditis), evaluate IVC collapsibility for volume status. No radiation, does not delay treatment.' },
    { test: 'CT abdomen/pelvis with contrast — if abdominal source suspected', category: 'radiology', indication: 'Appendicitis, intra-abdominal abscess, bowel perforation. Perform ONLY after haemodynamic stabilisation. Check renal function before contrast.' },
  ],

  admissionCriteria: [
    'ALL patients with confirmed septic shock — immediate PICU admission mandatory, no exceptions',
    'Sepsis with any organ dysfunction: altered mental status, lactate ≥ 2 mmol/L, AKI (creatinine > 2× baseline), coagulopathy, or SpO₂ < 94% — minimum HDU',
    'Requiring vasopressor support at any dose',
    'Persistent haemodynamic instability (tachycardia + abnormal perfusion) after initial 20–40 mL/kg fluid + antibiotics',
    'Any life-threatening feature: hypotension, purpuric rash, altered consciousness, seizure, apnoea',
    'Age < 3 months with suspected bacterial sepsis — admit ALL for IV antibiotics regardless of apparent stability',
    'Immunocompromised child with fever and possible infection — admit ALL for IV broad-spectrum antibiotics',
    'Purpuric rash / suspected meningococcemia — PICU immediately',
  ],

  highRiskFactors: [
    'Lactate 2–4 mmol/L without frank hypotension — high risk of decompensation; extended observation (≥ 4–6 h), lower threshold for PICU referral',
    'Compensated shock (abnormal perfusion + normal BP) — BP is a late, ominous sign in children; normal BP does NOT exclude significant shock',
    'Temperature < 36°C (hypothermia) — associated with worse outcome than hyperthermia; do not be falsely reassured by absence of fever',
    'Age < 6 months — limited physiological reserve, rapid decompensation; admit all infants with sepsis signs',
    'Immunocompromised state — lower threshold for PICU regardless of current severity',
    'Tachycardia persisting after antipyretic — if HR remains elevated once fever treated, suspect haemodynamic compromise not fever alone',
    'Delayed presentation (> 48 h without improvement) — source may not be controlled or organism may be resistant',
  ],

  dischargeCriteria: [
    'SEPTIC SHOCK is NEVER discharged from the ER — PICU admission is mandatory for all shock states.',
    '── The following applies ONLY to SEPSIS WITHOUT SHOCK (normal perfusion, lactate < 2 mmol/L, no hypotension) ──',
    'Low-risk identifiable source (simple UTI, community-acquired pneumonia), age > 3 months, fully immunocompetent',
    'Significant clinical improvement after IV fluid bolus and first dose of IV antibiotics (minimum 2–4 h ER observation)',
    'Normal mental status, HR improving toward age-appropriate range, normal CRT, normal skin perfusion',
    'SpO₂ ≥ 94% in room air without supplemental oxygen',
    'Lactate < 2 mmol/L with downward trend',
    'Able to tolerate oral intake and oral antibiotics at home',
    'Reliable carer present with clear written return-to-ER criteria documented',
    'Follow-up arranged within 24 h (GP or paediatric outpatient)',
    'Senior clinician has reviewed and confirmed safe for discharge',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: becomes drowsy or confused, develops a rash (especially any spots that do not fade when pressed with a glass), breathing becomes laboured, skin turns mottled or pale and cold, or no urine produced for > 8 hours.',
    'Complete the full antibiotic course exactly as prescribed — do not stop early even if feeling completely better.',
    'Fever may persist for 48–72 h after starting antibiotics — this is expected, but any worsening (not just continuing fever) warrants urgent reassessment.',
    'Do NOT give ibuprofen or aspirin during this illness — use paracetamol only for fever or pain.',
    'Keep the 24-hour follow-up appointment — blood results and clinical reassessment are required to confirm improvement.',
    'If a non-blanching rash (spots that do not fade under pressure) develops at any time — call an ambulance immediately, do not drive.',
  ],
};

export const septicShockProtocol: DiseaseProtocol = {
  id: 'septic-shock',
  name: 'Septic Shock',
  system: 'Shock and Resuscitation',
  description: 'Paediatric septic shock assessment and management using the 4-step escalation ladder. Based on Surviving Sepsis Campaign 2020 Paediatric Guidelines and Phoenix Sepsis Criteria 2024.',
  lastUpdated: '2024',
  image: {
    url: 'https://picsum.photos/seed/septic-shock/600/400',
    hint: 'intensive care'
  },
  erData,
  questions: [
    { id: 'weight',         questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'infection',      questionText: 'Suspected or confirmed source of infection?', type: 'boolean', info: 'Clinical suspicion is sufficient — confirmed cultures not required to act.' },
    { id: 'hr',             questionText: 'Heart Rate (for age)', type: 'select', options: [
      { label: 'Normal for age',                       value: 'normal',    score: 0 },
      { label: 'Mildly elevated (10–30 above ULN)',    value: 'mild',      score: 1 },
      { label: 'Markedly elevated (> 30 above ULN)',   value: 'high',      score: 2 },
      { label: 'Bradycardia (ominous, pre-arrest)',     value: 'brady',     score: 3 },
    ]},
    { id: 'crt',            questionText: 'Capillary Refill Time (CRT)', type: 'select', options: [
      { label: '≤ 2 s — Normal',                       value: 'normal',    score: 0 },
      { label: '2–3 s — Borderline',                   value: 'borderline',score: 1 },
      { label: '> 3 s — Delayed (Cold Shock)',         value: 'delayed',   score: 2 },
      { label: '< 1 s — Flash (Warm Shock)',           value: 'flash',     score: 2 },
    ]},
    { id: 'skin',           questionText: 'Skin / Peripheral Perfusion', type: 'select', options: [
      { label: 'Warm, pink, well-perfused',            value: 'normal',    score: 0 },
      { label: 'Mottled, cool or cold extremities',    value: 'cold',      score: 2 },
      { label: 'Warm, flushed, bounding pulses',       value: 'warm',      score: 1 },
    ]},
    { id: 'mental',         questionText: 'Altered Mental Status?', type: 'boolean', info: 'Irritability (inconsolable), lethargy, confusion, or reduced response to parents.' },
    { id: 'sbp',            questionText: 'Systolic Blood Pressure (SBP)', type: 'select', options: [
      { label: 'Normal for age',                       value: 'normal',    score: 0 },
      { label: 'Borderline low (5–10th percentile)',   value: 'borderline',score: 2 },
      { label: 'Hypotension (< 5th percentile)',       value: 'hypo',      score: 4 },
    ], info: 'Age-based SBP thresholds: < 1 yr: < 70 mmHg; 1–10 yr: < 70 + (2 × age); > 10 yr: < 90 mmHg.' },
    { id: 'spo2',           questionText: 'SpO₂ (Room Air)', type: 'select', options: [
      { label: '≥ 94% — Normal',                       value: 'normal',    score: 0 },
      { label: '90–93%',                               value: 'low',       score: 1 },
      { label: '< 90%',                                value: 'critical',  score: 2 },
    ]},
  ],

  calculateSeverity: (data: FormData): Severity => {
    // If the user explicitly says NO infection, flag as unknown (other diagnoses)
    if (data.infection === false) {
      return {
        level: 'unknown',
        details: ['No infection suspected. Consider other causes of shock: hypovolaemia, anaphylaxis, cardiogenic, obstructive (tamponade, tension pneumothorax).'],
      };
    }

    let points = 0;
    points += Number(data.hr    === 'mild'       ? 1 : data.hr   === 'high'  ? 2 : data.hr  === 'brady' ? 3 : 0);
    points += Number(data.crt   === 'borderline' ? 1 : data.crt  === 'delayed' ? 2 : data.crt === 'flash' ? 2 : 0);
    points += Number(data.skin  === 'cold'       ? 2 : data.skin === 'warm'  ? 1 : 0);
    points += Number(data.mental ? 3 : 0);
    points += Number(data.sbp   === 'borderline' ? 2 : data.sbp  === 'hypo' ? 4 : 0);
    points += Number(data.spo2  === 'low'        ? 1 : data.spo2 === 'critical' ? 2 : 0);

    const details: string[] = [];
    const isCold = data.crt === 'delayed' || data.skin === 'cold';
    const isWarm = data.crt === 'flash'   || data.skin === 'warm';

    if (isCold) details.push('Physiology: COLD SHOCK — Low cardiac output, high SVR. Mottled/cold extremities, delayed CRT. First-line: Adrenaline.');
    if (isWarm) details.push('Physiology: WARM SHOCK — High cardiac output, low SVR. Vasodilated, bounding pulses, flash CRT. First-line: Noradrenaline.');
    if (data.mental) details.push('⚠ Altered mental status = cerebral hypoperfusion — escalate immediately.');
    if (data.sbp === 'hypo') details.push('⚠ HYPOTENSION — late, ominous sign in children. BP is maintained by compensation until decompensation; act before this point.');
    if (data.sbp === 'borderline') details.push('⚠ Borderline BP — compensated shock may decompensate rapidly. Reassess every 15 min.');
    if (data.hr === 'brady') details.push('⚠ BRADYCARDIA in shock = pre-arrest — call cardiac arrest team immediately.');
    if (data.spo2 === 'critical') details.push('⚠ SpO₂ < 90% = respiratory organ dysfunction. Consider early intubation.');

    let level: SeverityLevel;
    let interpretation: string;

    if (data.sbp === 'hypo' || (data.mental && points >= 5) || data.hr === 'brady' || points >= 7) {
      level = 'severe';
      interpretation = 'Decompensated Septic Shock';
      details.unshift('DECOMPENSATED SEPTIC SHOCK — hypotension and/or multi-organ dysfunction. PICU now.');
    } else if (points >= 3 || isCold || isWarm || data.mental) {
      level = 'moderate';
      interpretation = 'Compensated Septic Shock';
      details.unshift('COMPENSATED SEPTIC SHOCK — perfusion abnormal, BP maintained. Do NOT be falsely reassured — escalate urgently before decompensation.');
    } else {
      level = 'mild';
      interpretation = 'Sepsis — No Shock';
      // Only add the infection-confirmation note if the user hasn't explicitly confirmed it
      if (data.infection === true) {
        details.unshift('SEPSIS WITHOUT SHOCK — infection present with early systemic response. Monitor closely; shock can develop rapidly.');
      } else {
        details.unshift('Answer Assess questions to score severity. Management ladder shown below for reference.');
      }
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Septic Shock Severity',
        totalScore: points,
        maxScore: 14,
        interpretation,
        referenceTable: [
          { range: '0–2', meaning: 'Sepsis — No Shock' },
          { range: '3–6', meaning: 'Compensated Shock' },
          { range: '7+',  meaning: 'Decompensated Shock' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const isCold = data.crt === 'delayed' || data.skin === 'cold';
    const isWarm = data.crt === 'flash'   || data.skin === 'warm';

    const STEP2_REASSESS = {
      title: 'STEP 2 — REASSESS after each fluid bolus (every 15–20 min)',
      recommendations: [
        'Check after EVERY bolus: HR, CRT, mental status, BP, lung auscultation (rales?), liver edge (hepatomegaly?).',
        'IMPROVED → HR falling toward normal, CRT ≤ 2 s, mental status improving, BP stable: give another 10–20 mL/kg bolus if still > 40 mL/kg remaining budget. Continue antibiotics.',
        'NO IMPROVEMENT after 20–40 mL/kg total → STOP GIVING MORE FLUID. Move to STEP 3A vasopressors NOW. Repeating boluses without starting vasopressors is the most common management error.',
        'OVERLOAD DEVELOPING (new rales, hepatomegaly, SpO₂ dropping) → STOP fluids immediately regardless of total volume given → STEP 3A vasopressors.',
        '⚠ REMEMBER: Normal BP does NOT mean no shock. A child in compensated shock can have a normal BP right up until sudden decompensation.',
      ],
    };

    // ── STEP 3A: First-line vasopressor — cold vs warm decision ──────────────
    const firstLineVasopressor = isCold
      ? [
          'PHYSIOLOGY: COLD SHOCK (low cardiac output, high SVR). Needs an inotrope that also raises BP.',
          'FIRST-LINE: ADRENALINE (Epinephrine)',
          '   • Start: 0.05–0.1 mcg/kg/min via peripheral IV or IO. Central line is NOT required to start.',
          '   • Titrate: increase by 0.05 mcg/kg/min every 5–10 min.',
          '   • Usual effective range: 0.1–0.3 mcg/kg/min.',
          '   • Maximum before escalating to second agent: 0.3–0.5 mcg/kg/min.',
          '   • Effect to expect: CRT shortening, HR appropriate for BP response, warming of extremities, improved mental status.',
        ]
      : isWarm
        ? [
            'PHYSIOLOGY: WARM SHOCK (low SVR / vasodilated, cardiac output may be preserved or elevated).',
            'FIRST-LINE: NORADRENALINE (Norepinephrine)',
            '   • Start: 0.05–0.1 mcg/kg/min via peripheral IV or IO. Central line is NOT required to start.',
            '   • Titrate: increase by 0.05 mcg/kg/min every 5–10 min.',
            '   • Usual effective range: 0.1–0.3 mcg/kg/min.',
            '   • Maximum before escalating to second agent: 0.5–1.0 mcg/kg/min.',
            '   • Effect to expect: MAP rising, flash CRT normalising, bounding pulses settling.',
          ]
        : [
            'PHYSIOLOGY UNCLEAR — determine cold vs warm on exam before choosing:',
            '   • COLD (delayed CRT > 3 s, mottled/cold skin, thready pulses) → ADRENALINE',
            '   • WARM (flash CRT < 1 s, bounding pulses, flushed warm skin) → NORADRENALINE',
            '   • UNCERTAIN → start ADRENALINE (covers both low CO and low SVR); reassess in 10 min.',
            '   • Start: 0.05–0.1 mcg/kg/min. Titrate by 0.05 mcg/kg/min every 5–10 min.',
          ];

    const GOALS_CHECK = 'RESPONSE TARGETS (check every 10–15 min): MAP ≥ 50th percentile for age + CRT ≤ 2 s + HR trending toward normal + improving mental status + urine output ≥ 1 mL/kg/h.';

    const STEP3A = {
      title: 'STEP 3A — ESCALATION: Start First-Line Vasopressor',
      recommendations: [
        'TRIGGER: Start NOW if ≥ 20–40 mL/kg fluid given without improvement OR any sign of fluid overload. PICU team must be at bedside.',
        ...firstLineVasopressor,
        GOALS_CHECK,
      ],
    };

    // ── STEP 3B: Refractory — second agent + hydrocortisone ──────────────────
    const secondLineLines = isCold
      ? [
          'COLD SHOCK REFRACTORY TO ADRENALINE (at 0.2–0.3 mcg/kg/min for 15–20 min without hitting targets):',
          '   Option A — MILRINONE: 0.25–0.75 mcg/kg/min infusion. NO loading dose (causes hypotension). Use when myocarditis or primary cardiac dysfunction is suspected (echo: poor LV function, high filling pressures). Milrinone reduces afterload + improves contractility — ideal when high SVR is the limiting factor.',
          '   Option B — Add NORADRENALINE: if hypotension dominates and cardiac function looks adequate on echo. 0.05 mcg/kg/min, titrate alongside adrenaline.',
          '   ⚠ Do NOT use milrinone in warm shock (vasodilated) — it will worsen hypotension.',
        ]
      : isWarm
        ? [
            'WARM SHOCK REFRACTORY TO NORADRENALINE (at ≥ 0.3 mcg/kg/min for 15–20 min without hitting targets):',
            '   Add VASOPRESSIN: 0.0003–0.002 units/kg/min infusion. Start at 0.0003 units/kg/min, titrate slowly.',
            '   Why vasopressin: acts on V1 receptors (direct vasoconstriction, independent of adrenergic receptors). Spares catecholamines. Does NOT increase heart rate — advantage in already tachycardic children.',
            '   Maximum: 0.002 units/kg/min. Beyond this, risk of mesenteric and coronary ischaemia.',
          ]
        : [
            'REFRACTORY SHOCK — if first-line vasopressor at 0.2–0.3 mcg/kg/min for 15–20 min without targets met:',
            '   COLD: add Milrinone (suspected cardiac dysfunction) OR add Noradrenaline.',
            '   WARM: add Vasopressin 0.0003–0.002 units/kg/min.',
          ];

    const STEP3B = {
      title: 'STEP 3B — ESCALATION: Refractory Shock (first-line at 0.2–0.3 mcg/kg/min × 15–20 min, goals not met)',
      recommendations: [
        ...secondLineLines,
        'HYDROCORTISONE — give when: (A) any vasopressor ≥ 0.3 mcg/kg/min for > 15 min without satisfactory MAP response, OR (B) purpura fulminans (adrenal haemorrhage possible), OR (C) known adrenal insufficiency / chronic steroid user.',
        '   • Dose: 2 mg/kg IV bolus (max 100 mg), then 1–2 mg/kg/day divided every 6 h.',
        '   • Do NOT use for fluid-refractory shock alone before starting vasopressors — steroids are adjunctive, not primary.',
        '   • Do NOT stop abruptly — taper once vasopressor dose is decreasing.',
        'CORRECT METABOLIC BARRIERS (these blunt vasopressor response): BGL < 4 mmol/L → 2 mL/kg 10% dextrose. Ionised Ca²⁺ < 1.1 mmol/L → 0.5 mL/kg 10% calcium gluconate slowly. Hb < 70 g/L → pRBC 10 mL/kg.',
        'SERIAL LACTATE every 2 h — target > 10% clearance per hour. Lactate not clearing = source not controlled or inadequate perfusion pressure.',
      ],
    };

    const STEP4_FAILURE = {
      title: 'STEP 4 — Life-threatening: Airway Failure / Vasopressor-Refractory Shock',
      recommendations: [
        'RECOGNISE: GCS ≤ 8 or apnoea, SpO₂ < 90% on high-flow O₂, unresponsive to fluids + vasopressors + second-line agents, pH < 7.15 with rising lactate.',
        'SENIOR + PICU + ANAESTHETICS at bedside NOW.',
        'AIRWAY / RSI if: unable to protect airway, apnoea, respiratory failure, or GCS ≤ 8. Induction: KETAMINE 1–2 mg/kg IV. AVOID ETOMIDATE — causes adrenal suppression in sepsis.',
        'Post-intubation: lung-protective ventilation — 6 mL/kg tidal volume, plateau < 28 cmH₂O, PEEP 5–8 cmH₂O. Avoid hypocapnia (worsens cerebral and coronary perfusion).',
        'ECMO: contact ECMO centre EARLY if vasopressor-refractory despite maximum therapy. Call before the child is too sick to qualify.',
        'DIC: FFP 10–15 mL/kg (PT/APTT > 2× normal + bleeding). Cryoprecipitate 5 mL/kg (fibrinogen < 1.5 g/L). Platelets if < 50 × 10⁹/L with active haemorrhage.',
        'SOURCE CONTROL: urgent surgical/IR/ID review regardless of haemodynamic instability — antibiotics cannot sterilise an undrained abscess or infected device.',
      ],
    };

    switch (severity.level) {
      case 'severe':
        return [
          {
            title: 'STEP 1 — Immediate (0–15 min): Simultaneous Actions',
            recommendations: [
              'CALL FOR HELP + PICU NOTIFICATION immediately — do not manage decompensated septic shock alone.',
              'AIRWAY + OXYGEN: 100% O₂ via non-rebreather mask. Prepare for RSI if mental status declining.',
              'ACCESS: IV or IO within 5 min. Two large-bore IVs. Do NOT delay fluid or antibiotics waiting for central access.',
              'BEDSIDE GLUCOSE now.',
              'FIRST FLUID BOLUS: 10–20 mL/kg isotonic crystalloid (0.9% NaCl or Lactated Ringer\'s) over 5–10 min.',
              'BLOOD CULTURES × 2 — only if obtainable within 5 min. Never delay antibiotics for cultures.',
              'ANTIBIOTICS within 15 min — see Drugs tab. Every additional hour of delay significantly worsens outcome.',
              '12-lead ECG.',
            ],
          },
          STEP2_REASSESS,
          STEP3A,
          STEP3B,
          STEP4_FAILURE,
        ];

      case 'moderate':
        return [
          {
            title: 'STEP 1 — Immediate (0–15 min): Fluid + Antibiotics',
            recommendations: [
              'CALL SENIOR + PICU NOTIFICATION — compensated shock can decompensate within minutes.',
              'OXYGEN: low-flow initially; increase to non-rebreather if SpO₂ < 94%.',
              'IV ACCESS: two large-bore IVs or IO if IV fails after 2 attempts.',
              'BEDSIDE GLUCOSE immediately.',
              'FIRST FLUID BOLUS: 10–20 mL/kg isotonic crystalloid over 5–10 min.',
              'BLOOD CULTURES (do not delay antibiotics > 10 min).',
              'ANTIBIOTICS within 60 min (within 15 min if rapidly deteriorating or purpuric rash).',
              'Continuous cardiac/SpO₂ monitoring; BP every 5–10 min.',
            ],
          },
          STEP2_REASSESS,
          STEP3A,
          STEP3B,
          STEP4_FAILURE,
        ];

      case 'mild':
        return [
          {
            title: 'STEP 1 — Sepsis Without Shock: Cultures + Antibiotics + Fluid Challenge',
            recommendations: [
              'BLOOD CULTURES before antibiotics (if < 5 min delay).',
              'IV ANTIBIOTICS within 60 min of recognition.',
              'FLUID CHALLENGE: 10 mL/kg isotonic crystalloid. Reassess perfusion and HR after each bolus.',
              'CLOSE MONITORING: continuous SpO₂, HR; BP every 15 min. Repeat lactate in 2 h.',
              'Establish IV/IO access even if clinical appearance is currently reassuring.',
            ],
          },
          {
            title: 'STEP 2 — REASSESS at 1 h: Improvement vs Progression?',
            recommendations: [
              'IMPROVED → HR normalising, lactate falling, good perfusion: continue antibiotics, observe ≥ 4 h before considering disposition.',
              'NOT IMPROVED → any of: persistent tachycardia, rising lactate, worsening perfusion, declining mental status: escalate to STEP 3A + PICU now.',
              '⚠ Sepsis can progress to shock within 1–2 h — never leave a child with sepsis unmonitored.',
            ],
          },
          STEP3A,
          STEP3B,
          STEP4_FAILURE,
        ];

      default:
        return [
          { title: 'Infection not confirmed — consider alternative shock diagnoses', recommendations: [
            'Hypovolaemic shock: fluid bolus 20 mL/kg × 3, identify source of loss.',
            'Anaphylactic shock: Adrenaline IM 0.01 mg/kg (max 0.5 mg) immediately.',
            'Cardiogenic shock: avoid aggressive fluids; echo urgently; call PICU.',
            'Obstructive shock (tamponade, tension pneumothorax): treat cause urgently.',
            'If infection cannot be excluded, treat empirically as septic shock.',
          ]},
        ];
    }
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return [
        'PICU ADMISSION — immediately. All decompensated septic shock requires intensive care; no exceptions.',
        'If PICU is not available on-site, begin resuscitation and arrange urgent transfer. Continue vasopressors and antibiotics during transport. Senior clinician should accompany.',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'PICU or HDU ADMISSION — compensated shock with ongoing organ dysfunction requires close monitoring.',
        'Escalate to full PICU if fluid-refractory or vasopressor-dependent at any point.',
      ];
    }
    if (severity.level === 'mild') {
      return [
        'ADMISSION to ward or HDU for IV antibiotics, serial monitoring, and reassessment at 4–6 h.',
        'Discharge from ER is only appropriate for sepsis without shock, low-risk source, age > 3 months, immunocompetent, and after significant improvement — see Dispose tab criteria.',
      ];
    }
    return ['Disposition depends on clinical severity, source identification, response to initial treatment, and senior assessment.'];
  },

  getRedFlags: () => [
    'Purpuric / non-blanching rash — meningococcemia until proven otherwise',
    'Hypotension (late sign — decompensation has occurred)',
    'Bradycardia in a sick child — pre-arrest',
    'Altered or declining mental status',
    'CRT > 3 s or flash CRT < 1 s',
    'Lactate ≥ 4 mmol/L despite initial resuscitation',
    'Hypothermia (< 36°C) — worse prognosis than hyperthermia in sepsis',
    'Coagulopathy — thrombocytopenia + prolonged PT + elevated D-dimer = DIC',
  ],

  getDrugDoses: (severity, data) => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight', dose: 'Weight required to calculate doses', notes: 'Enter patient weight in the Assess tab.' });
      return doses;
    }

    // ── Fluids ──────────────────────────────────────────────────────────────────
    const bolus1Vol  = (10 * wt).toFixed(0);
    const bolus2Vol  = (20 * wt).toFixed(0);
    const maxFluidVol= (60 * wt).toFixed(0);
    doses.push({
      drugName: 'Isotonic Crystalloid Bolus (0.9% NaCl or Lactated Ringer\'s)',
      dose:  `10–20 mL/kg = ${bolus1Vol}–${bolus2Vol} mL over 5–10 min. Reassess after each bolus.`,
      notes: `Max 40–60 mL/kg (= ${maxFluidVol} mL) in first hour. Stop if signs of fluid overload (rales, hepatomegaly, worsening SpO₂). Do NOT use hypotonic fluids.`,
    });

    // ── Antibiotics ─────────────────────────────────────────────────────────────
    const ceftriaxoneMg  = Math.min(100 * wt, 2000).toFixed(0);
    const vancoMgDose    = Math.min(15  * wt, 750 ).toFixed(0);
    const ampicillinMg   = Math.min(50  * wt, 2000).toFixed(0);
    const pipTazoMg      = Math.min(100 * wt, 4000).toFixed(0);
    doses.push({
      drugName: 'Ceftriaxone (IV) — First-line empiric',
      dose:  `${ceftriaxoneMg} mg IV (100 mg/kg, max 2 g) — single dose`,
      notes: 'Give within 15 min (immediately for purpuric rash). Double dose (200 mg/kg, max 4 g) if meningitis suspected. Give over 30 min if haemodynamically stable, push over 5 min in extremis.',
    });
    doses.push({
      drugName: 'Vancomycin (IV) — Add for central line infection, MRSA risk, immunocompromised',
      dose:  `${vancoMgDose} mg IV (15 mg/kg, max 750 mg/dose) every 6 h`,
      notes: 'Target AUC/MIC 400–600. Infuse over 60 min (rapid infusion → red man syndrome). Adjust dose for renal impairment. Consider pharmacy-guided dosing for prolonged courses.',
    });
    doses.push({
      drugName: 'Ampicillin (IV) — Add for age < 3 months (GBS, Listeria)',
      dose:  `${ampicillinMg} mg IV (50 mg/kg, max 2 g) every 6 h`,
      notes: 'For meningitis, increase to 100 mg/kg/dose. Always combine with Ceftriaxone in neonates; ampicillin alone insufficient for Gram-negatives.',
    });
    doses.push({
      drugName: 'Piperacillin-Tazobactam (IV) — Replace Ceftriaxone if anti-Pseudomonal cover needed',
      dose:  `${pipTazoMg} mg IV (100 mg/kg of piperacillin component, max 4 g) every 6 h`,
      notes: 'Use for immunocompromised, prior hospitalisation, or nosocomial sepsis. Combine with Vancomycin for suspected MRSA.',
    });

    // ── Vasopressors + second-line agents (moderate and severe) ─────────────
    if (severity.level === 'moderate' || severity.level === 'severe') {

      // Rule of 6: 0.3 × wt mg in 50 mL → 1 mL/hr = 0.1 mcg/kg/min
      const epiPrep   = (0.3 * wt).toFixed(2);
      const norPrep   = (0.3 * wt).toFixed(2);

      doses.push({
        drugName: 'Adrenaline (Epinephrine) — COLD SHOCK first-line',
        dose:  'Start: 0.05–0.1 mcg/kg/min. Titrate: +0.05 every 5–10 min. Max before 2nd agent: 0.3–0.5 mcg/kg/min.',
        notes: `Prep (Rule of 6): add ${epiPrep} mg of 1 mg/mL stock to 50 mL NS/D5W → 1 mL/hr = 0.1 mcg/kg/min. Can start peripherally (IV or IO). Inotrope + vasopressor — corrects low cardiac output AND low BP.`,
      });

      doses.push({
        drugName: 'Noradrenaline (Norepinephrine) — WARM SHOCK first-line',
        dose:  'Start: 0.05–0.1 mcg/kg/min. Titrate: +0.05 every 5–10 min. Max before 2nd agent: 0.5–1.0 mcg/kg/min.',
        notes: `Prep (Rule of 6): add ${norPrep} mg of 1 mg/mL stock to 50 mL NS/D5W → 1 mL/hr = 0.1 mcg/kg/min. Can start peripherally ≤ 6 h. Pure vasopressor — corrects low SVR/vasodilation.`,
      });

      // Milrinone — cold shock second-line (myocarditis / high afterload)
      const milrinoneRateMin = (0.25 / 0.1).toFixed(1);  // mL/hr for 0.25 mcg/kg/min using rule of 6
      const milrinoneRateMax = (0.75 / 0.1).toFixed(1);
      const milrinonePrep    = (0.3 * wt).toFixed(2);
      doses.push({
        drugName: 'Milrinone — COLD SHOCK second-line (adrenaline-refractory, suspected myocarditis / cardiac dysfunction)',
        dose:  `0.25–0.75 mcg/kg/min infusion. NO loading dose. Start at 0.25 mcg/kg/min; titrate every 15–30 min.`,
        notes: `Prep (Rule of 6): add ${milrinonePrep} mg to 50 mL NS → 1 mL/hr = 0.1 mcg/kg/min (run at ${milrinoneRateMin}–${milrinoneRateMax} mL/hr). Trigger: cold shock not responding to adrenaline ≥ 0.2 mcg/kg/min × 15 min. Mechanism: PDE3 inhibitor → ↑ inotropy + ↓ afterload. Do NOT use in warm/vasodilated shock — worsens hypotension. Central line preferred (causes peripheral vasodilation).`,
      });

      // Vasopressin — warm shock second-line
      const vasopressinRateStart = (0.0003 * wt * 60 / 0.2).toFixed(1); // mL/hr at 0.0003 u/kg/min using 0.2 u/mL prep
      const vasopressinRateMax   = (0.002  * wt * 60 / 0.2).toFixed(1);
      const vasopressinUnitsPer100ml = (0.2 * 100).toFixed(0); // = 20 units in 100 mL
      doses.push({
        drugName: 'Vasopressin — WARM SHOCK second-line (noradrenaline-refractory)',
        dose:  `0.0003–0.002 units/kg/min. Start at 0.0003 units/kg/min; titrate slowly every 15–30 min. Max: 0.002 units/kg/min.`,
        notes: `Prep: dilute ${vasopressinUnitsPer100ml} units in 100 mL NS (0.2 units/mL). Rate (mL/hr) = dose (units/kg/min) × weight × 60 ÷ 0.2. For this patient: start ~${vasopressinRateStart} mL/hr, max ~${vasopressinRateMax} mL/hr. Trigger: warm shock with noradrenaline ≥ 0.3 mcg/kg/min × 15 min. Mechanism: V1 receptor vasoconstriction, catecholamine-independent. Advantage: does NOT raise HR. Do NOT use in cold shock.`,
      });
    }

    // ── Hydrocortisone + metabolic corrections (severe) ─────────────────────
    if (severity.level === 'severe') {
      const hydrocoMg = Math.min(2 * wt, 100).toFixed(0);
      doses.push({
        drugName: 'Hydrocortisone (IV) — TRIGGER: vasopressor ≥ 0.3 mcg/kg/min × 15 min, goals not met',
        dose:  `${hydrocoMg} mg IV bolus (2 mg/kg, max 100 mg), then 1–2 mg/kg/day divided every 6 h`,
        notes: 'Also give immediately for: purpura fulminans, known adrenal insufficiency, chronic steroid user. Do NOT give for fluid-refractory shock alone — steroids do not replace vasopressors. Taper gradually once vasopressor weaning begins; do not stop abruptly.',
      });

      const cagluMl = (0.5 * wt).toFixed(1);
      doses.push({
        drugName: 'Calcium Gluconate 10% (IV) — ionised Ca²⁺ < 1.1 mmol/L',
        dose:  `${cagluMl} mL (0.5 mL/kg, max 20 mL) IV over 5–10 min`,
        notes: 'Monitor ECG during infusion — rapid administration causes bradycardia. Flush line before and after; calcium is incompatible with bicarbonate and phosphate.',
      });

      // Dextrose bolus
      const dex10Vol = (2 * wt).toFixed(0);
      doses.push({
        drugName: '10% Dextrose (IV) — Hypoglycaemia (BGL < 4 mmol/L)',
        dose:  `${dex10Vol} mL (2 mL/kg) IV bolus over 5 min`,
        notes: 'Recheck BGL 15 min after bolus. Start maintenance dextrose infusion to prevent recurrence (GIR 4–6 mg/kg/min).',
      });
    }

    return doses;
  },

  getReferences: () => [
    { title: 'Schlapbach LJ et al. International Consensus Criteria for Pediatric Sepsis and Septic Shock (Phoenix Criteria). JAMA 2024', url: 'https://jamanetwork.com/journals/jama/fullarticle/2814297' },
    { title: 'Weiss SL et al. Surviving Sepsis Campaign International Guidelines for Pediatric Septic Shock and Sepsis-Associated Organ Dysfunction. Pediatr Crit Care Med 2020', url: 'https://pubmed.ncbi.nlm.nih.gov/32032273/' },
    { title: 'Davis AL et al. American College of Critical Care Medicine Clinical Practice Parameters for Hemodynamic Support of Pediatric and Neonatal Septic Shock. Crit Care Med 2017', url: 'https://pubmed.ncbi.nlm.nih.gov/28509730/' },
    { title: 'PALS 2020 — AHA/AAP Pediatric Advanced Life Support', url: 'https://www.heart.org/en/cpr/resuscitation-science/pals-pediatric-advanced-life-support' },
    { title: 'Surviving Sepsis Campaign — Pediatric Pocket Guide 2020', url: 'https://www.sccm.org/SurvivingSepsisCampaign/Guidelines/Pediatric-Patients' },
  ],
};
