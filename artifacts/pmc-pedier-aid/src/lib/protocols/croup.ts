import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'drooling',       question: 'Drooling, dysphagia, or unable to swallow secretions?', redFlag: true,  ifYes: 'DO NOT examine the throat. Suspect epiglottitis. Call anaesthesia + ENT immediately. Keep child calm on parent\'s lap.' },
    { id: 'toxic',          question: 'Toxic/septic appearance — high fever, poor perfusion, extreme distress?', redFlag: true, ifYes: 'Consider bacterial tracheitis (croup prodrome then rapid deterioration + purulent secretions). Needs urgent airway team and IV antibiotics once airway secured.' },
    { id: 'muffled_voice',  question: 'Muffled "hot potato" voice or change in cry quality?', redFlag: true,  ifYes: 'Deep space neck infection or supraglottitis. Urgent ENT assessment, no throat examination.' },
    { id: 'young_infant',   question: 'Age under 6 months?', redFlag: true,  ifYes: 'Croup is rare below 6 months. Consider subglottic stenosis, vascular ring, or laryngomalacia as alternative diagnoses.' },
    { id: 'prior_intub',    question: 'Previously intubated for croup or known subglottic stenosis?', ifYes: 'Higher risk of severe episode. Consult ENT early. Anatomically narrowed airway tolerates oedema poorly.' },
    { id: 'allergic',       question: 'History of angioedema, urticaria, or known allergen exposure in last 2 hours?', ifYes: 'Consider anaphylaxis as cause of stridor — IM adrenaline rather than croup management.' },
    { id: 'rebound_home',   question: 'Stridor recurred after improving (rebound) — given epinephrine elsewhere?', ifYes: 'Rebound stridor after nebulised epinephrine: observe for minimum 4 hours after LAST dose.' },
  ],

  investigations: [
    { test: 'Continuous SpO₂', category: 'urgent', indication: 'For all moderate–severe cases. Mild croup with no distress at rest does not require continuous monitoring.', criticalValue: 'SpO₂ < 92% in croup is very unusual — suggests severe obstruction or alternative diagnosis. Escalate immediately.' },
    { test: 'Neck X-ray (AP + lateral soft tissue)', category: 'radiology', indication: 'NOT routine for classic croup. Order only if: atypical features, no improvement with treatment, concern for foreign body or RPA. Classic finding: "steeple sign" (subglottic narrowing on AP view) — diagnostic but does NOT change ER management.', criticalValue: '"Thumb sign" (enlarged epiglottis on lateral) = epiglottitis. Stop all interventions, call airway team.' },
    { test: 'FBC + CRP + blood culture', category: 'blood', indication: 'NOT routine. Order only if suspected bacterial tracheitis or septic appearance (high fever, toxic, not responding to treatment).', criticalValue: 'Very high WBC (> 20,000) + purulent tracheal secretions = bacterial tracheitis. IV antibiotics + PICU.' },
  ],

  admissionCriteria: [
    'Stridor at rest (not just with agitation) persisting after 2 doses of nebulised epinephrine',
    'Westley Score ≥ 8 (severe) at any point',
    'SpO₂ < 92% or cyanosis',
    'Altered mental status or exhaustion',
    'Age < 6 months with any stridor',
    'Rebound stridor after epinephrine (observe minimum 4 h after last dose)',
    'Any atypical feature suggesting alternative diagnosis (drooling, toxic, muffled voice)',
  ],

  highRiskFactors: [
    'Age < 6 months',
    'Previously intubated for croup or known subglottic stenosis',
    'Immunocompromised child',
    'Prior ICU admission for croup',
    'Lives far from hospital or unreliable follow-up',
  ],

  dischargeCriteria: [
    'Westley Score ≤ 2 (mild) sustained for ≥ 4 hours',
    'No stridor at rest',
    'SpO₂ ≥ 94% on room air',
    'Tolerating oral fluids',
    'Dexamethasone (single oral dose) administered in ER before discharge',
    'Caregiver understands return criteria clearly',
    'No atypical features (no drooling, no toxic appearance)',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: child develops drooling or cannot swallow, stridor gets much worse or occurs completely at rest, child turns blue or very pale, breathing becomes very difficult with every breath, child becomes very drowsy or difficult to rouse.',
    'Stridor that comes and goes with activity is expected in mild croup — this alone is NOT a reason to panic.',
    'The steroid (dexamethasone) given today takes 2–4 hours to fully work and lasts about 48 hours. You do not need to give another dose at home.',
    'Humidified air (sitting in a steamy bathroom for 10–15 minutes) may give temporary comfort, though evidence is limited — it will not replace the steroid.',
    'Most croup episodes peak over 1–2 days then slowly improve over 3–5 days. A barky cough may persist for 1 week.',
    'Follow up with your GP in 24–48 hours, or return here sooner if you are worried.',
  ],
};

export const croupProtocol: DiseaseProtocol = {
  id: 'croup',
  name: 'Croup (Laryngotracheitis)',
  system: 'Respiratory System',
  description: 'Assessment and management of viral croup using the Westley Croup Score, with dexamethasone + epinephrine escalation ladder and differentiation from epiglottitis / bacterial tracheitis.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/croup/600/400', hint: 'child coughing' },
  erData,

  questions: [
    { id: 'weight',       questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'stridor',      questionText: 'Stridor', type: 'select', options: [
      { label: 'None',            value: '0', score: 0 },
      { label: 'With agitation',  value: '1', score: 1 },
      { label: 'At rest',         value: '2', score: 2 },
    ]},
    { id: 'retractions',  questionText: 'Chest wall retractions', type: 'select', options: [
      { label: 'None',     value: '0', score: 0 },
      { label: 'Mild',     value: '1', score: 1 },
      { label: 'Moderate', value: '2', score: 2 },
      { label: 'Severe',   value: '3', score: 3 },
    ]},
    { id: 'airEntry',     questionText: 'Air entry', type: 'select', options: [
      { label: 'Normal',            value: '0', score: 0 },
      { label: 'Decreased',         value: '1', score: 1 },
      { label: 'Markedly decreased',value: '2', score: 2 },
    ]},
    { id: 'cyanosis',     questionText: 'Cyanosis', type: 'select', options: [
      { label: 'None',           value: '0', score: 0 },
      { label: 'With agitation', value: '4', score: 4 },
      { label: 'At rest',        value: '5', score: 5 },
    ]},
    { id: 'mentalStatus', questionText: 'Level of consciousness', type: 'select', options: [
      { label: 'Normal (alert)',      value: '0', score: 0 },
      { label: 'Disoriented / altered', value: '5', score: 5 },
    ]},
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    const s1 = Number(data.stridor      || 0);
    const s2 = Number(data.retractions  || 0);
    const s3 = Number(data.airEntry     || 0);
    const s4 = Number(data.cyanosis     || 0);
    const s5 = Number(data.mentalStatus || 0);
    const totalScore = s1 + s2 + s3 + s4 + s5;

    if (data.drooling || data.toxic || data.muffled_voice) {
      details.push('CRITICAL: Atypical features present. DO NOT examine throat. Suspect epiglottitis or bacterial tracheitis. Call airway team now.');
      return {
        level: 'impending respiratory failure',
        scoreDetails: { systemName: 'Westley Croup Score', totalScore, maxScore: 17, interpretation: 'CRITICAL — Atypical Airway Emergency' },
        details,
      };
    }

    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Croup';

    if (totalScore >= 12) {
      level = 'impending respiratory failure';
      interpretation = 'Impending Respiratory Failure';
    } else if (totalScore >= 8) {
      level = 'severe';
      interpretation = 'Severe Croup';
    } else if (totalScore >= 3) {
      level = 'moderate';
      interpretation = 'Moderate Croup';
    }

    if (s1 === 2) details.push('Stridor at rest — requires epinephrine + minimum 4h observation.');
    if (s4 >= 4) details.push('Cyanosis present — oxygen immediately.');
    if (s5 === 5) details.push('Altered mental status — exhaustion or hypoxia. PICU now.');

    return {
      level,
      scoreDetails: {
        systemName: 'Westley Croup Score',
        totalScore,
        maxScore: 17,
        interpretation,
        referenceTable: [
          { range: '0 – 2',   meaning: 'Mild Croup' },
          { range: '3 – 7',   meaning: 'Moderate Croup' },
          { range: '8 – 11',  meaning: 'Severe Croup' },
          { range: '≥ 12',    meaning: 'Impending Respiratory Failure' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const STEP4_ATYPICAL = {
      title: 'STEP 4 — LIFE-THREATENING: Atypical airway emergency (Epiglottitis / Tracheitis)',
      recommendations: [
        'DO NOT examine throat. DO NOT lie child down. DO NOT attempt IV until airway team present.',
        'Keep child on parent\'s lap in position of comfort. Minimal stimulation.',
        'Blow-by O₂ only — DO NOT force mask if child resists.',
        'Call simultaneously: Anaesthesia + ENT + PICU senior.',
        'Prepare difficult airway trolley and surgical airway equipment.',
        'Controlled intubation in OR under gas induction — safest approach.',
        'If complete obstruction before team arrives: jaw thrust, bag-mask ventilation, and emergency surgical airway.',
      ],
    };

    const STEP4_CROUP = {
      title: 'STEP 4 — LIFE-THREATENING: Impending respiratory failure from croup',
      recommendations: [
        'Recognition: exhaustion, reduced air entry bilaterally, cyanosis, altered mental status.',
        'CALL ANAESTHESIA + PICU + ENT immediately.',
        'Oxygen — high flow. Minimise agitation. IV dexamethasone if not given.',
        'Controlled intubation: RSI with ketamine + rocuronium. Use ETT 0.5–1 mm smaller than calculated (subglottic oedema). Be ready for difficult airway.',
        'Post-intubation: keep child sedated, ICU ventilation, ENT review.',
      ],
    };

    if ((data.drooling || data.toxic || data.muffled_voice) || severity.level === 'impending respiratory failure') {
      return [
        { title: 'STEP 1 — Immediate: Possible epiglottitis / tracheitis', recommendations: ['Position of comfort — keep on parent\'s lap.', 'DO NOT examine throat or place IV while child is unsettled.', 'Blow-by O₂ only if tolerated.', 'Call anaesthesia + ENT + PICU now.'] },
        { title: 'STEP 2 — REASSESS: Is child maintaining airway?', recommendations: ['Child alert + maintaining position → controlled transfer to OR for intubation.', 'Deteriorating → STEP 4 immediately.'] },
        { title: 'STEP 3 — ESCALATION: Controlled airway management', recommendations: ['OR setting: gas induction by anaesthesia.', 'ENT standby for surgical airway.', 'Post-intubation: IV antibiotics (Ceftriaxone 100 mg/kg/day) once airway secured.'] },
        STEP4_ATYPICAL,
      ];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — Severe Croup: Immediate treatment',
          recommendations: [
            'Keep child calm — agitation worsens obstruction. Parent should hold child.',
            'Nebulised L-adrenaline 1:1000 — 0.5 mL/kg (max 5 mL) via nebuliser.',
            'Dexamethasone 0.6 mg/kg IM or IV (max 16 mg) — if not already given.',
            'Supplemental O₂ — blow-by if child resists mask.',
            'Continuous SpO₂ + HR monitoring.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS Westley Score at 30 minutes',
          recommendations: [
            'Improving (stridor reduced, less retractions, no distress at rest) → continue observation 4 h from last epinephrine.',
            'No improvement or worsening → STEP 3.',
            'Cyanosis, exhaustion, or altered mental status at any point → STEP 4 immediately.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Persisting severe croup after first epinephrine',
          recommendations: [
            'Repeat nebulised L-adrenaline — can give up to 3 doses in first hour.',
            'IV dexamethasone if not yet given.',
            'PICU consult now — prepare for possible intubation.',
            'Continuous monitoring. Do not leave child unattended.',
            'If > 2 doses of epinephrine required → admit regardless of response.',
          ],
        },
        STEP4_CROUP,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — Moderate Croup: Treatment',
          recommendations: [
            'Dexamethasone 0.6 mg/kg PO (max 16 mg) — single dose, onset 2–4 h, lasts 48 h.',
            'Nebulised L-adrenaline 0.5 mL/kg (max 5 mL) if stridor at rest OR marked retractions.',
            'Oral dexamethasone works as well as IM — use oral unless vomiting.',
            'Observe for minimum 4 hours after epinephrine for rebound.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS Westley Score at 30–60 minutes',
          recommendations: [
            'Westley ≤ 2, no stridor at rest, tolerating fluids → discharge eligible after 4 h observation.',
            'Westley ≥ 3 still at rest → re-dose epinephrine + admission.',
            'Any atypical features emerging (drooling, toxic) → escalate to atypical pathway.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Not improving after initial treatment',
          recommendations: [
            'Repeat epinephrine — maximum 3 doses/hour.',
            'PICU review if ≥ 2 doses needed or worsening.',
            'Consider IV/IM dexamethasone if oral not absorbed.',
            'SpO₂ < 92% → oxygen + senior review.',
          ],
        },
        STEP4_CROUP,
      ];
    }

    // Mild
    return [
      {
        title: 'STEP 1 — Mild Croup: Single steroid dose',
        recommendations: [
          'Dexamethasone 0.15 mg/kg PO (min dose; OR 0.6 mg/kg for fastest effect) — both effective for mild croup.',
          'No epinephrine needed for mild (no stridor at rest).',
          'No blood tests, no CXR, no admission required for uncomplicated mild croup.',
          'Observe 30–60 minutes post-treatment before discharge.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'Westley ≤ 2, no stridor at rest, tolerating oral fluids → safe to discharge.',
          'Stridor at rest develops → re-classify as moderate → STEP 1 for moderate.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION if mild becomes moderate',
        recommendations: [
          'Nebulised epinephrine 0.5 mL/kg (max 5 mL) — observe 4 h.',
          'Increase dexamethasone to 0.6 mg/kg if only 0.15 mg/kg given.',
          'Admission if no improvement.',
        ],
      },
      STEP4_CROUP,
    ];
  },

  getDisposition: (severity, data) => {
    if (data.drooling || data.toxic || data.muffled_voice) return ['DO NOT DISCHARGE. Airway emergency — PICU/OR immediately.'];
    if (severity.level === 'impending respiratory failure' || severity.level === 'severe') return ['ADMIT — PICU/HDU.'];
    if (severity.level === 'moderate') return ['Observe ≥ 4 h after last epinephrine. Admit if stridor at rest persists.'];
    return ['Discharge home after single steroid dose and 30–60 min observation.'];
  },

  getRedFlags: () => [
    'Drooling or dysphagia — epiglottitis until excluded',
    'Toxic/septic appearance — bacterial tracheitis until excluded',
    'Muffled voice — deep space infection',
    'Stridor at rest',
    'Cyanosis',
    'Altered mental status or exhaustion',
    'Failure to respond to 2 doses of nebulised epinephrine',
    'Age < 6 months with stridor',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const dexLow  = Math.min(0.15 * wt, 16).toFixed(1);
    const dexHigh = Math.min(0.6  * wt, 16).toFixed(1);
    const epi     = Math.min(0.5  * wt, 5).toFixed(1);

    doses.push({ drugName: 'Dexamethasone PO / IM / IV', dose: `${dexHigh} mg (0.6 mg/kg, max 16 mg) — single dose`, notes: `Mild croup: ${dexLow} mg (0.15 mg/kg) acceptable. Oral = IM = IV in efficacy. Onset 2–4 h, duration 48 h.` });
    doses.push({ drugName: 'Nebulised L-adrenaline (1:1000)', dose: `${epi} mL (0.5 mL/kg, max 5 mL) undiluted via nebuliser`, notes: 'Onset 5–10 min, duration 1–2 h. Observe 4 h after LAST dose for rebound. Can repeat up to 3×/hour in severe.' });

    return doses;
  },

  getReferences: () => [
    { title: 'Westley CR et al. — Nebulized racemic epinephrine by IPPB for the treatment of croup. AJDC 1978', url: 'https://doi.org/10.1001/archpedi.1978.02120270044008' },
    { title: 'Russell KF et al. — Glucocorticoids for croup. Cochrane Database 2011', url: 'https://doi.org/10.1002/14651858.CD001955.pub3' },
    { title: 'CPS Position Statement: Management of croup 2021', url: 'https://cps.ca/en/documents/position/management-of-croup' },
    { title: 'NICE — Croup: assessment and management (2021)', url: 'https://cks.nice.org.uk/topics/croup/' },
  ],
};
