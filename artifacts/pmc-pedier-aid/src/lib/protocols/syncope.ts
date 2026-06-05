import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'exertional_syn',  question: 'Syncope occurred DURING physical exertion (not just after)?', redFlag: true,  ifYes: 'Exertional syncope is the highest-risk flag. Suggests HCM outflow obstruction, anomalous coronary, or catecholaminergic VT. Strict bed rest + immediate ECG + cardiology.' },
    { id: 'no_prodrome',     question: 'Sudden collapse WITHOUT warning — no prodrome?', redFlag: true,  ifYes: 'Absence of prodrome (nausea, warmth, tunnel vision) suggests arrhythmic cause, not vasovagal. Needs urgent cardiac workup.' },
    { id: 'supine_syn',      question: 'Syncope while supine or sitting (not standing)?', redFlag: true,  ifYes: 'Vasovagal syncope requires postural trigger. Syncope while lying down = cardiac cause until proved otherwise.' },
    { id: 'family_scd_syn',  question: 'Family history of sudden unexplained death < 40 years, SADS, Long QT, or HCM?', redFlag: true, ifYes: 'Inherited arrhythmia syndromes (Long QT, Brugada, CPVT). ECG mandatory. Even if current ECG is normal, refer to genetics/cardiology for family evaluation.' },
    { id: 'prodrome',        question: 'Classic prodrome: nausea, warmth, pallor, tunnel vision, lightheadedness?', ifYes: 'Typical vasovagal prodrome — strongly supports neurocardiogenic syncope. Low cardiac risk when present with an identifiable trigger.' },
    { id: 'trigger',         question: 'Identifiable trigger: prolonged standing, pain, blood/needle, emotional distress?', ifYes: 'Clear situational trigger — supports vasovagal (neurocardiogenic) syncope. Lowest-risk pattern.' },
    { id: 'prolonged_loc',   question: 'Loss of consciousness > 1–2 minutes?', ifYes: 'Prolonged LOC: consider seizure (tonic-clonic activity, post-ictal confusion) vs cardiac arrhythmia. Convulsive syncope can occur in vasovagal (brief < 15 s jerks at onset — benign) vs true epilepsy (rhythmic shaking > 30 s, post-ictal phase).' },
    { id: 'drug_history_syn',question: 'Medications that prolong QT (macrolides, antipsychotics, antihistamines, ADHD stimulants)?', ifYes: 'QT-prolonging drugs: check QTc on ECG. Drug-drug interactions can make QTc dangerously long.' },
  ],

  investigations: [
    { test: '12-lead ECG — mandatory for ALL syncope', category: 'urgent', indication: 'Look for: QTc prolongation (> 440 ms males, > 460 ms females), WPW pre-excitation (delta wave), Brugada pattern (RBBB + ST elevation V1–V2), ARVC (epsilon wave, T-inversion V1–V4), deep Q waves + LVH (HCM), AV block, short QT (< 330 ms).', criticalValue: 'QTc > 500 ms or WPW + syncope → PICU + cardiology immediately. Do NOT discharge.' },
    { test: 'Continuous cardiac monitoring', category: 'urgent', indication: 'All patients until ECG reviewed. Detect arrhythmia recurrence in ER.' },
    { test: 'Point-of-care glucose', category: 'urgent', indication: 'Hypoglycaemia is a common mimic of syncope, especially in diabetics and young infants.' },
    { test: 'Orthostatic vital signs', category: 'urgent', indication: 'Lying BP/HR → standing 1 min and 3 min. Orthostatic hypotension: drop ≥ 20 mmHg systolic or ≥ 10 mmHg diastolic OR symptomatic. Confirms autonomic/volume component.' },
    { test: 'Electrolytes (Na⁺, K⁺, Ca²⁺, Mg²⁺)', category: 'blood', indication: 'Electrolyte abnormalities cause arrhythmias. Check if prolonged symptoms, vomiting, diarrhoea, or diuretics.' },
    { test: 'Troponin', category: 'blood', indication: 'Only if chest pain preceded syncope, prolonged unconsciousness, or ECG changes suggestive of ischaemia.' },
    { test: 'Blood glucose (formal)', category: 'blood', indication: 'If diabetic, prolonged LOC, or delayed recovery.' },
    { test: 'EEG / CT brain', category: 'radiology', indication: 'NOT routine for syncope. Only if: prolonged confusion > 15 min after event (true post-ictal), focal neurological signs, or recurrent "syncope" not responding to cardiac workup. Syncope itself causes brief clonic jerks — do NOT order EEG for this.' },
  ],

  admissionCriteria: [
    'ECG abnormality: QTc > 500 ms, WPW with symptoms, complete AV block, LBBB, Brugada pattern',
    'Exertional syncope — any cause',
    'Syncope during exercise in a known CHD patient',
    'Syncope + chest pain or palpitations without clear vasovagal explanation',
    'No prodrome, supine position, or no identifiable trigger',
    'Structural heart disease + syncope',
    'Family history of SADS/SCD + first unexplained syncopal episode',
    'Recurrent unexplained syncope (> 3 episodes) for ambulatory monitoring',
  ],

  highRiskFactors: [
    'Known CHD or arrhythmia syndrome',
    'Family history of SCD < 40 years',
    'QTc 460–500 ms on resting ECG (prolonged, not yet critical threshold)',
    'Syncope requiring CPR or prolonged LOC',
    'Incomplete recovery (prolonged post-event confusion)',
    'Medications that prolong QT',
  ],

  dischargeCriteria: [
    'Classic vasovagal: identifiable trigger + prodrome + ECG strictly normal + fully recovered',
    'Breath-holding spell (age < 6, provoked, brief, age-appropriate)',
    'Orthostatic syncope: cause identified (dehydration) and treated + orthostatic vitals normalised',
    '12-lead ECG confirmed normal by a doctor',
    'Haemodynamically stable, fully alert at baseline for ≥ 30 min',
    'No high-risk features, no family history of SCD',
    'Reliable caregiver + clear return instructions + GP follow-up in 48h',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: event recurs, child faints while exercising, collapses without warning, has chest pain or palpitations before fainting, or takes longer than 1–2 minutes to fully recover.',
    'DO NOT exercise strenuously until cardiology has cleared the child — this applies especially if the trigger was exertion.',
    'Vasovagal syncope: teach counter-pressure manoeuvres (cross legs + tense muscles, sit/crouch at first prodrome symptom). These abort many episodes.',
    'Increase salt and fluid intake (unless hypertension or heart disease). Aim for 2–3 L/day in adolescents.',
    'Avoid prolonged standing, hot showers, skipping meals, and alcohol (adolescents).',
    'Do not swim alone if episodes are unexplained or recurrent until cardiology clearance.',
    'Outpatient Holter monitor may be arranged — wear it during normal activity and record the diary.',
  ],
};

export const syncopeProtocol: DiseaseProtocol = {
  id: 'syncope',
  name: 'Syncope',
  system: 'Cardiovascular System',
  description: 'Risk stratification of syncope in children. The key clinical question: is this vasovagal (benign, 75% of cases) or cardiac (rare, potentially fatal)? Exertional syncope without prodrome is a red flag until proved otherwise.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/syncope-peds/600/400', hint: 'fainting person' },
  erData,

  questions: [
    { id: 'weight',          questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'withExercise',    questionText: 'Syncope DURING exercise (not just after)?', type: 'boolean', info: 'Exertional onset = highest cardiac risk flag.' },
    { id: 'noProdrome',      questionText: 'Sudden collapse WITHOUT warning prodrome?', type: 'boolean', info: 'No nausea/pallor/tunnel vision before collapse.' },
    { id: 'supine',          questionText: 'Occurred while lying down or seated (not standing)?', type: 'boolean' },
    { id: 'hasProdrome',     questionText: 'Classic prodrome: nausea, warmth, pallor, greying of vision?', type: 'boolean' },
    { id: 'isTriggered',     questionText: 'Clear trigger identified?', type: 'select', options: [
      { label: 'None',                                  value: 'none' },
      { label: 'Prolonged standing',                    value: 'postural' },
      { label: 'Emotional / pain / blood / sight',      value: 'emotional' },
      { label: 'Breath-holding (infant)',                value: 'breath_holding' },
    ]},
    { id: 'cardiacHistory',  questionText: 'Personal or family cardiac history?', type: 'boolean', info: 'SCD < 40y, HCM, Long QT, Brugada, Marfan, CHD.' },
    { id: 'ekgAbnormal',     questionText: 'ECG abnormal?', type: 'boolean', info: 'WPW, QTc > 460 ms, Brugada, LVH + deep Q, complete AV block.' },
    { id: 'prolongedLOC',    questionText: 'Loss of consciousness > 1–2 minutes?', type: 'boolean' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let score = 0;

    // High-risk features
    if (data.withExercise)    { score += 4; details.push('Exertional syncope — highest cardiac risk.'); }
    if (data.ekgAbnormal)     { score += 4; details.push('Abnormal ECG — cardiac arrhythmia or structural.'); }
    if (data.cardiacHistory)  { score += 3; details.push('Personal/family cardiac history.'); }
    if (data.noProdrome)      { score += 2; details.push('No prodrome — arrhythmia pattern.'); }
    if (data.supine)          { score += 3; details.push('Syncope while supine/seated — not postural.'); }
    if (data.prolongedLOC)    { score += 1; details.push('Prolonged LOC — possible seizure or cardiac.'); }

    // Low-risk features (subtract)
    if (data.hasProdrome)     { score -= 2; details.push('Prodrome present — supports vasovagal.'); }
    if (data.isTriggered === 'postural' || data.isTriggered === 'emotional') {
      score -= 2; details.push('Classic trigger — supports vasovagal.');
    }
    if (data.isTriggered === 'breath_holding') {
      details.push('Breath-holding spell — benign paediatric condition.');
    }

    score = Math.max(score, 0);

    let level: SeverityLevel;
    let interpretation: string;

    if (score >= 4 || data.ekgAbnormal || data.withExercise) {
      level = 'severe';
      interpretation = 'HIGH RISK — Cardiac cause likely. Admit + cardiology.';
    } else if (score >= 1 || data.prolongedLOC || !data.hasProdrome) {
      level = 'moderate';
      interpretation = 'INDETERMINATE — Workup required. Observe.';
    } else {
      level = 'mild';
      interpretation = 'LOW RISK — Likely vasovagal or breath-holding. Normal ECG required.';
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Syncope Risk Score',
        totalScore: score,
        maxScore: 14,
        interpretation,
        referenceTable: [
          { range: '≥ 4 or exertional/ECG', meaning: 'HIGH — admit + cardiac workup' },
          { range: '1 – 3',                 meaning: 'INDETERMINATE — ECG + observe' },
          { range: '0 (with prodrome+trigger)', meaning: 'LOW — vasovagal, ECG required' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Arrhythmia caught in ER or haemodynamic compromise',
      recommendations: [
        'Active arrhythmia (VT/VF) → defibrillation / synchronised cardioversion.',
        'Complete AV block with instability → transcutaneous pacing + PICU.',
        'Torsades de Pointes (polymorphic VT with long QT) → IV magnesium 50 mg/kg over 15 min.',
        'WPW + rapid AF → synchronised cardioversion. DO NOT give adenosine, digoxin, or verapamil.',
        'HCM with obstruction + syncope → fluid bolus, beta-blocker, supine position. No inotropes. Urgent cardiology.',
        'PICU + PALS algorithm if haemodynamically unstable.',
      ],
    };

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — HIGH RISK: Strict bed rest + cardiac workup',
          recommendations: [
            'Strict bed rest — NO exertion until cardiology clears.',
            'Continuous cardiac monitoring + SpO₂.',
            '12-lead ECG immediately.',
            'IV access + orthostatic vitals.',
            'Point-of-care glucose + electrolytes.',
            'Pediatric Cardiology consultation — same day, in-ER if possible.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS ECG and clinical status',
          recommendations: [
            'ECG: QTc > 500 ms → stop all QT-prolonging drugs immediately + PICU consult.',
            'ECG: WPW → no vagal manoeuvres, no adenosine until Cardiology reviews.',
            'ECG: Brugada pattern → admit + ICD discussion with family.',
            'ECG: Normal → echo still needed if exertional or family history.',
            'Any recurrence in ER → STEP 4.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Confirmed cardiac cause',
          recommendations: [
            'Echo urgently: HCM, anomalous coronary, dilated cardiomyopathy.',
            'Electrophysiology study / Holter: arrhythmia substrate.',
            'CPVT (exertional, polymorphic VT): admit + beta-blocker IV + no stimulation + PICU.',
            'Long QT confirmed: avoid triggers, correct electrolytes, consider beta-blocker.',
            'All decisions with Cardiology team.',
          ],
        },
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — INDETERMINATE: ECG + orthostatics + observe',
          recommendations: [
            '12-lead ECG — mandatory.',
            'Orthostatic vital signs (lying → standing 1 min and 3 min).',
            'Point-of-care glucose.',
            'Cardiac monitoring during ER stay.',
            'Detailed history: prodrome, duration of LOC, recovery, triggers, medications.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS after workup',
          recommendations: [
            'ECG normal + orthostatic hypotension found → treat with fluids, reassess, discharge if corrected.',
            'ECG normal + classic vasovagal features emerging → reassign to low-risk pathway.',
            'ECG abnormal or unexplained → escalate to high-risk pathway (STEP 3).',
            'LOC > 2 min + no prodrome + prolonged recovery → consider seizure workup (EEG + neurology).',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Unexplained or recurring',
          recommendations: [
            'Admit for 24h Holter + echocardiogram if cause remains unexplained.',
            'Neurology referral if seizure remains a differential.',
            'Tilt-table test: for recurrent unexplained syncope with normal cardiac workup — scheduled as outpatient.',
            'Review all medications for QT-prolonging drugs.',
          ],
        },
        STEP4,
      ];
    }

    return [
      {
        title: 'STEP 1 — LOW RISK (Vasovagal / Breath-holding): Confirm + educate',
        recommendations: [
          '12-lead ECG — required even for classic vasovagal before discharge.',
          'Point-of-care glucose.',
          'Confirm: prodrome present, identifiable trigger, position was upright, brief LOC, fast full recovery.',
          'Breath-holding spells: confirm < 6 years, provoked, cyanotic or pallid type, brief, no post-ictal phase.',
          'Counter-pressure manoeuvres: cross legs + tense muscles + sit/crouch at FIRST prodrome sign.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'ECG strictly normal — no WPW, QTc normal, normal intervals.',
          'Fully alert, haemodynamically stable ≥ 30 min.',
          'Caregiver understands return precautions.',
          'Any doubt → keep longer or admit.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Atypical features or ECG borderline',
        recommendations: [
          'Borderline QTc (440–500 ms): cardiology review before discharge.',
          'Seizure-like activity > 30 s or prolonged post-ictal: neurology referral.',
          'Recurrent unexplained vasovagal: refer to cardiology for tilt-table test and/or midodrine trial.',
        ],
      },
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['Admit to monitored bed (telemetry). Cardiology review mandatory before discharge. No competitive sport until cleared.'];
    if (severity.level === 'moderate') return ['Consider admission for 24h Holter if unexplained. Discharge with urgent outpatient cardiology referral if workup is normal but cause is uncertain.'];
    return ['Discharge with ECG confirmed normal. GP follow-up 48h. Clear return instructions. Vasovagal education given.'];
  },

  getRedFlags: () => [
    'Syncope DURING physical activity',
    'Sudden collapse without any warning prodrome',
    'Syncope while lying down or seated',
    'Family history of sudden unexplained death < 40 years',
    'Abnormal ECG — especially QTc > 460 ms or WPW',
    'Prolonged LOC > 2 minutes or slow recovery',
    'Chest pain or palpitations immediately before collapse',
    'Known structural heart disease',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const ns = wt > 0 ? `${(10 * wt).toFixed(0)}–${(20 * wt).toFixed(0)} mL IV` : '10–20 mL/kg IV';
    const mg = wt > 0 ? `${Math.min(50 * wt, 2000).toFixed(0)} mg (50 mg/kg, max 2 g) IV over 15 min` : '50 mg/kg IV over 15 min, max 2 g';

    return [
      { drugName: 'Normal saline bolus (orthostatic hypotension)', dose: ns, notes: 'Only if significant orthostatic symptoms and fluid depletion confirmed. 10 mL/kg initially, reassess.' },
      { drugName: 'Magnesium sulphate IV (Torsades de Pointes)', dose: mg, notes: 'ONLY for torsades de pointes (polymorphic VT with long QT). Not for other syncope types.' },
    ];
  },

  getReferences: () => [
    { title: 'AAP Clinical Practice Guideline — Evaluation of Syncope in Children. Pediatrics 2022', url: 'https://doi.org/10.1542/peds.2021-054061' },
    { title: '2017 ACC/AHA/HRS Syncope Guideline. JACC 2017', url: 'https://doi.org/10.1016/j.jacc.2017.03.584' },
    { title: 'Driscoll DJ et al. — Syncope in children and adolescents. JACC 1997', url: 'https://doi.org/10.1016/S0735-1097(97)00020-1' },
  ],
};
