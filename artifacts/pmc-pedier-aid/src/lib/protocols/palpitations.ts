import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'currently_tachy',  question: 'Is the patient currently in tachycardia on monitor?', redFlag: true, ifYes: 'Active tachycardia: identify rhythm immediately on 12-lead ECG. Follow tachycardia algorithm. Narrow complex + haemodynamically stable → vagal manoeuvres first. Wide complex or unstable → synchronised cardioversion.' },
    { id: 'syncopal_palp',    question: 'Syncope or LOC during palpitations episode?', redFlag: true, ifYes: 'Palpitations + syncope = high risk for dangerous arrhythmia (VT, VF, complete AV block). ECG + continuous monitoring + cardiology immediately. Do not leave unsupervised.' },
    { id: 'exertional_palp',  question: 'Palpitations occur DURING peak exercise?', redFlag: true, ifYes: 'Exertional onset: catecholaminergic VT, HCM, anomalous coronary. Rest is mandatory until cardiology clears.' },
    { id: 'light_switch',     question: 'Abrupt onset AND termination (like a "light switch")?', ifYes: 'Highly suggestive of re-entrant tachycardia (SVT). Regular fast rhythm, abrupt start/stop, typical age: infant < 4 months or school-age. Check 12-lead ECG for WPW (delta wave).' },
    { id: 'irregular_palp',   question: 'Irregular palpitations (beat-skipping, "flip-flopping")?', ifYes: 'Irregular: suggests ectopic beats (PACs, PVCs) or AF. PACs/PVCs in structurally normal heart: benign. AF in a child: urgent cardiology — congenital cause likely (WPW, CHD).' },
    { id: 'chest_pain_palp',  question: 'Chest pain during palpitations?', ifYes: 'Possible myocarditis-related arrhythmia, or ischaemia. Troponin + CRP + ECG. See Chest Pain protocol if dominant symptom.' },
    { id: 'family_palp',      question: 'Family history of SCD < 40 years, Long QT, or cardiomyopathy?', ifYes: 'Inherited arrhythmia syndrome. ECG QTc measurement. Genetics referral. Cascade screening for family.' },
    { id: 'medications_palp', question: 'Stimulants (ADHD medications, caffeine, energy drinks), QT-prolonging drugs, or illicit substances?', ifYes: 'Stimulants: sinus tachycardia or ectopics. QT-prolonging drugs: check QTc. Cocaine/amphetamines: VT risk. Detailed drug history essential.' },
  ],

  investigations: [
    { test: '12-lead ECG — mandatory for ALL palpitations', category: 'urgent', indication: 'Rhythm identification. Look for: WPW delta wave (PR short + delta wave + wide QRS), QTc > 460 ms (Long QT), Brugada (RBBB + ST elevation V1–V2), ARVC (T inversion V1–V4), LVH (HCM), AV block.', criticalValue: 'WPW + rapid irregular wide complex tachycardia → DO NOT give adenosine, digoxin, or verapamil (risk of VF). Cardiovert.' },
    { test: 'Continuous cardiac monitoring', category: 'urgent', indication: 'Mandatory. Capture rhythm during any recurrence of symptoms.' },
    { test: 'Point-of-care glucose + electrolytes', category: 'urgent', indication: 'Electrolyte abnormalities (K⁺, Mg²⁺, Ca²⁺) precipitate arrhythmias. Hypoglycaemia causes sinus tachycardia.' },
    { test: 'Troponin', category: 'blood', indication: 'If chest pain or haemodynamic compromise accompanies palpitations. Elevated troponin → myocarditis-related arrhythmia.' },
    { test: 'Thyroid function (TSH, T4)', category: 'blood', indication: 'Recurrent palpitations, weight loss, heat intolerance, tremor. Hyperthyroidism causes sinus tachycardia and AF.' },
    { test: 'Full blood count + haemoglobin', category: 'blood', indication: 'Anaemia is a common reversible cause of palpitations. Check in any child with pallor or fatigue.' },
    { test: 'Holter monitor (24–72h)', category: 'other', indication: 'Outpatient. For palpitations not captured in ER. Correlate diary symptoms with recorded rhythm. Event recorder for infrequent episodes.' },
  ],

  admissionCriteria: [
    'Currently in a symptomatic arrhythmia (SVT, VT, AF)',
    'Syncope or haemodynamic compromise accompanying palpitations',
    'Abnormal ECG: WPW, QTc > 500 ms, Brugada, complete AV block',
    'Exertional palpitations — especially without clear benign explanation',
    'Palpitations in known structural heart disease',
    'Elevated troponin or ECG changes suggesting myocarditis',
    'Unable to exclude dangerous arrhythmia without ambulatory monitoring',
  ],

  highRiskFactors: [
    'Family history of SCD < 40 years or heritable arrhythmia syndrome',
    'Known CHD or prior cardiac surgery',
    'QTc 460–500 ms on resting ECG',
    'WPW on ECG (even if asymptomatic currently)',
    'Stimulant or QT-prolonging drug use',
  ],

  dischargeCriteria: [
    'Currently in sinus rhythm, haemodynamically stable',
    '12-lead ECG strictly normal (QTc normal, no pre-excitation, no arrhythmia)',
    'Electrolytes normal',
    'No syncope, no haemodynamic compromise during episode',
    'No high-risk features in history',
    'Holter/event monitor arranged as outpatient',
    'Cardiology review confirmed or arranged (even by phone for moderate risk)',
    'Return precautions given',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: palpitations return with dizziness or fainting, breathing becomes difficult during the episode, chest pain occurs, or the palpitations last > 15 minutes without stopping.',
    'Wear the Holter monitor for the full duration and keep the symptom diary carefully — correlating symptoms with rhythm is essential for diagnosis.',
    'Avoid caffeine, energy drinks, and stimulants until reviewed by cardiology.',
    'If on a new medication that was prescribed recently: ask your doctor if it can cause heart rhythm changes.',
    'Vagal manoeuvres for SVT: Modified Valsalva (lie flat, blow into syringe for 15 s, then legs elevated) — discuss with your cardiologist.',
    'Do not drive (if old enough) until arrhythmia is evaluated and cleared by cardiology.',
  ],
};

export const palpitationsProtocol: DiseaseProtocol = {
  id: 'palpitations',
  name: 'Palpitations',
  system: 'Cardiovascular System',
  description: 'Evaluation of palpitations in children and adolescents. Most are benign (sinus tachycardia, PACs, anxiety). The priority is identification of serious arrhythmias — WPW, Long QT, catecholaminergic VT, or structural causes.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/palpitations-peds/600/400', hint: 'heart rhythm monitor' },
  erData,

  questions: [
    { id: 'weight',              questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'currentlyTachycardic',questionText: 'Currently in tachycardia on monitor / ECG?', type: 'boolean' },
    { id: 'associatedSyncope',   questionText: 'Associated with syncope or presyncope?', type: 'boolean' },
    { id: 'withExercise',        questionText: 'Palpitations during peak exercise?', type: 'boolean' },
    { id: 'isSuddenAbrupt',      questionText: 'Abrupt "light-switch" onset and termination?', type: 'boolean', info: 'Highly suggestive of SVT.' },
    { id: 'irregular',           questionText: 'Irregular rhythm or beat-skipping feeling?', type: 'boolean', info: 'PACs, PVCs, or AF.' },
    { id: 'hasChestPain',        questionText: 'Chest pain accompanying palpitations?', type: 'boolean' },
    { id: 'cardiacHistory',      questionText: 'Personal or family cardiac history?', type: 'boolean', info: 'SCD < 40y, cardiomyopathy, Long QT, known CHD.' },
    { id: 'ekgAbnormal',         questionText: 'ECG abnormal?', type: 'boolean', info: 'WPW, QTc > 460 ms, Brugada, LVH, AV block.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let score = 0;

    if (data.currentlyTachycardic){ score += 4; details.push('Currently tachycardic — identify and treat rhythm now.'); }
    if (data.associatedSyncope)   { score += 4; details.push('Syncope with palpitations — high-risk arrhythmia pattern.'); }
    if (data.withExercise)        { score += 3; details.push('Exertional onset — catecholaminergic VT or structural.'); }
    if (data.ekgAbnormal)         { score += 3; details.push('Abnormal ECG — arrhythmia substrate present.'); }
    if (data.cardiacHistory)      { score += 2; details.push('Personal/family cardiac history.'); }
    if (data.hasChestPain)        { score += 2; details.push('Chest pain — possible myocarditis or ischaemia.'); }
    if (data.isSuddenAbrupt)      { score += 1; details.push('Abrupt onset/offset — re-entrant (SVT) pattern.'); }
    if (data.irregular)           { score += 1; details.push('Irregular rhythm — ectopics or AF.'); }

    let level: SeverityLevel;
    let interpretation: string;

    if (score >= 4 || data.currentlyTachycardic || (data.associatedSyncope && !data.isSuddenAbrupt)) {
      level = 'severe';
      interpretation = 'HIGH RISK — Urgent arrhythmia workup + cardiology';
    } else if (score >= 2 || data.isSuddenAbrupt || data.ekgAbnormal) {
      level = 'moderate';
      interpretation = 'MODERATE — Possible SVT or ectopic. ECG + Holter.';
    } else {
      level = 'mild';
      interpretation = 'LOW RISK — Likely benign. ECG + electrolytes + reassure.';
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Palpitation Risk Score',
        totalScore: score,
        maxScore: 20,
        interpretation,
        referenceTable: [
          { range: '≥ 4 or active tachycardia', meaning: 'HIGH — urgent arrhythmia management' },
          { range: '2 – 3 or SVT pattern',      meaning: 'MODERATE — ECG + Holter + cardiology' },
          { range: '0 – 1',                     meaning: 'LOW — benign, ECG + reassure' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Haemodynamically unstable arrhythmia',
      recommendations: [
        'Haemodynamically UNSTABLE tachycardia (hypotension, altered consciousness, shock) → synchronised cardioversion immediately.',
        'Narrow complex: 0.5–1 J/kg (initial), increase to 2 J/kg if ineffective.',
        'Wide complex: 1–2 J/kg synchronised (treat as VT).',
        'VF / pulseless VT → unsynchronised defibrillation 2 J/kg → 4 J/kg → PALS arrest algorithm.',
        'Torsades de Pointes → IV magnesium 50 mg/kg over 15 min + stop QT-prolonging drugs.',
        'WPW + AF + wide complex: synchronised cardioversion ONLY — NO adenosine, digoxin, verapamil.',
        'CALL PICU + PALS team.',
      ],
    };

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — HIGH RISK: Identify rhythm + stabilise',
          recommendations: [
            '12-lead ECG immediately.',
            'Continuous cardiac monitoring + SpO₂.',
            'IV access.',
            'Electrolytes + glucose (K⁺, Mg²⁺, Ca²⁺, glucose).',
            'Paediatric Cardiology consultation — now.',
            data.currentlyTachycardic
              ? 'CURRENTLY IN TACHYCARDIA: identify type — narrow complex regular (likely SVT) vs wide complex (VT) vs irregular (AF/flutter). Proceed per tachycardia algorithm.'
              : 'Not currently in tachycardia — ECG captures baseline rhythm and substrate (WPW, QTc, Brugada).',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: Rhythm identified — specific treatment',
          recommendations: [
            'SVT (narrow complex, regular, rate 180–300): vagal manoeuvres (ice bag to face in infants, modified Valsalva in children) → adenosine if no response.',
            'VT (wide complex, rate 150–250): amiodarone IV if stable. Cardioversion if unstable.',
            'WPW + regular narrow SVT: adenosine is safe in sinus rhythm. WPW + AF/flutter with wide complex: cardioversion only.',
            'AF in child: urgent echo — look for CHD, WPW.',
            'ECG shows WPW in sinus rhythm: no adenosine acutely; refer for electrophysiology study.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: SVT unresponsive to adenosine, or VT',
          recommendations: [
            'SVT resistant to adenosine ×2: amiodarone IV 5 mg/kg over 20–60 min OR verapamil (only if > 1 year, NO WPW) OR synchronised cardioversion.',
            'VT stable: amiodarone 5 mg/kg IV over 20–60 min.',
            'CPVT (catecholaminergic VT): beta-blocker IV (propranolol or esmolol) + rest + PICU.',
            'Long QT + torsades: magnesium + correct K⁺ + stop culprit drug.',
          ],
        },
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — MODERATE RISK: ECG + monitoring + evaluate',
          recommendations: [
            '12-lead ECG.',
            'Cardiac monitoring.',
            'Electrolytes + glucose.',
            data.isSuddenAbrupt ? 'Suspect SVT: look for short PR + delta wave (WPW) or normal ECG (concealed pathway).' : 'Characterise: regular vs irregular. Ectopics (PACs/PVCs) are usually irregular and benign in structurally normal heart.',
            'Check medications: ADHD stimulants, antihistamines, antipsychotics — QTc risk.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: ECG result',
          recommendations: [
            'WPW found on ECG → admit for electrophysiology referral (ablation discussion), even if currently in sinus rhythm.',
            'QTc > 500 ms → admit, stop QT-prolonging drugs, correct electrolytes.',
            'PACs or PVCs on Holter (frequent, > 10,000/24h) → echo + cardiology review.',
            'ECG normal + symptoms resolved → consider discharge with Holter.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Underlying cause identified',
          recommendations: [
            'Anaemia → treat underlying cause + haemoglobin correction.',
            'Hyperthyroidism → endocrinology referral + beta-blocker if highly symptomatic.',
            'WPW: refer for catheter ablation discussion (curative in > 95% of SVT).',
            'Long QT: avoid triggers (exercise, QT drugs, sudden noise). Beta-blocker. ICD if high-risk (multiple syncope, family VF).',
          ],
        },
        STEP4,
      ];
    }

    return [
      {
        title: 'STEP 1 — LOW RISK: Confirm benign + ECG',
        recommendations: [
          '12-lead ECG — required before discharge.',
          'Electrolytes + glucose.',
          'Ask about caffeine, energy drinks, stimulant medications.',
          'Sinus tachycardia: find cause (anaemia, anxiety, fever, dehydration, pain).',
          'If PACs/PVCs: reassure if ECG structurally normal and symptoms non-severe.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'ECG strictly normal.',
          'Electrolytes normal.',
          'Haemodynamically stable, symptoms resolved.',
          'Holter monitor arranged as outpatient.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Frequent or recurrent',
        recommendations: [
          'Recurrent palpitations affecting quality of life → Holter + cardiology referral.',
          'Symptomatic PVCs > 10,000/24h or R-on-T pattern → cardiology.',
          'Suspected anxiety + somatisation: CAMHS referral.',
        ],
      },
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['Admit to monitored bed (telemetry). Cardiology review mandatory. No discharge with active arrhythmia or WPW on ECG without cardiology sign-off.'];
    if (severity.level === 'moderate') return ['Observe 4–6h. Holter as outpatient. Cardiology follow-up within 24–48h arranged before discharge. Discharge if haemodynamically stable and ECG normal.'];
    return ['Discharge with Holter monitor arranged. GP follow-up. Return precautions clearly given. No competitive sport until cleared if any doubt.'];
  },

  getRedFlags: () => [
    'Palpitations with syncope or presyncope',
    'Palpitations during physical activity',
    'WPW (pre-excitation) on ECG',
    'QTc > 460 ms on ECG',
    'Family history of SCD < 40 years',
    'Active tachycardia > 220 bpm',
    'Wide complex tachycardia (treat as VT until proved otherwise)',
    'AF in a child (unusual — look for CHD or WPW)',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required.' });
      return doses;
    }

    const adeno1  = Math.min(0.1 * wt, 6).toFixed(1);
    const adeno2  = Math.min(0.2 * wt, 12).toFixed(1);
    const amiod   = Math.min(5 * wt, 300).toFixed(0);
    const mgSulph = Math.min(50 * wt, 2000).toFixed(0);
    const cardio1 = (0.5 * wt).toFixed(1);
    const cardio2 = (1 * wt).toFixed(1);
    const defibn  = (2 * wt).toFixed(0);

    doses.push({ drugName: 'Adenosine IV — 1st dose (SVT only)', dose: `${adeno1} mg (0.1 mg/kg, max 6 mg) rapid IV push + 5 mL NS flush`, notes: 'Central line preferred. Rapid bolus essential — half-life 10 s. ECG running during administration.' });
    doses.push({ drugName: 'Adenosine IV — 2nd dose (SVT)', dose: `${adeno2} mg (0.2 mg/kg, max 12 mg) rapid IV push`, notes: 'If 1st dose fails. Third dose not recommended. DO NOT use for wide complex tachycardia or known WPW with AF/flutter.' });
    doses.push({ drugName: 'Amiodarone IV (VT or SVT resistant to adenosine)', dose: `${amiod} mg (5 mg/kg, max 300 mg) IV over 20–60 min`, notes: 'Slow infusion prevents hypotension. Monitor ECG continuously. Not for Torsades de Pointes (avoid in Long QT).' });
    doses.push({ drugName: 'Magnesium sulphate IV (Torsades)', dose: `${mgSulph} mg (50 mg/kg, max 2 g) IV over 15 min`, notes: 'For Torsades de Pointes (polymorphic VT + Long QT). Also for electrolyte repletion.' });
    doses.push({ drugName: 'Synchronised cardioversion — initial dose', dose: `${cardio1}–${cardio2} J/kg synchronised`, notes: 'Haemodynamically unstable tachycardia. Sedate if conscious (ketamine + midazolam). Synchronised — ensure ECG leads connected.' });
    doses.push({ drugName: 'Defibrillation (VF / pulseless VT)', dose: `${defibn} J (2 J/kg) unsynchronised`, notes: 'Increase to 4 J/kg if first shock fails. Start CPR immediately after shock. PALS arrest algorithm.' });

    return doses;
  },

  getReferences: () => [
    { title: 'PALS Provider Manual — AHA 2020', url: 'https://cpr.heart.org/pals-provider-manual' },
    { title: 'Brugada J et al. — 2019 ESC Guidelines on SVT. Eur Heart J 2020', url: 'https://doi.org/10.1093/eurheartj/ehz467' },
    { title: 'Wren C — Cardiac arrhythmias in the young. Eur Heart J 2013', url: 'https://doi.org/10.1093/eurheartj/eht171' },
  ],
};
