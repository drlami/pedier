import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'chd',          question: 'Known congenital heart disease or prior cardiac surgery?', redFlag: true,  ifYes: 'Higher risk for re-entrant and structural arrhythmias. Cardiology must be informed immediately. Do NOT give Adenosine without cardiology guidance in complex CHD.' },
    { id: 'wpw_known',    question: 'Known Wolff-Parkinson-White (WPW) syndrome?', redFlag: true,  ifYes: 'Avoid Adenosine in pre-excited AF (irregular wide complex). Risk of ventricular fibrillation. Cardioversion is safest for unstable WPW.' },
    { id: 'syncope',      question: 'Did the episode start with syncope or preceded by chest pain?', redFlag: true,  ifYes: 'Sudden cardiac arrest risk. Treat as unstable regardless of current haemodynamics.' },
    { id: 'prior_svt',    question: 'Previous documented SVT episodes? If yes, how were they terminated?', ifYes: 'Useful to know: vagal manoeuvres vs adenosine vs spontaneous. Helps set expectations.' },
    { id: 'sudden_onset', question: 'Sudden onset / sudden offset pattern?', ifYes: 'Strongly supports SVT over sinus tachycardia. Variable or gradual onset = sinus tachycardia until proven otherwise.' },
    { id: 'medications',  question: 'Current medications that affect heart rate? (beta-blockers, digoxin, stimulants, decongestants)', ifYes: 'Drug-induced tachycardia — identify agent. Amphetamine / cold medications can cause sinus tachycardia or VT.' },
    { id: 'fever_dehy',   question: 'Fever, dehydration, pain, or anaemia present?', ifYes: 'Likely sinus tachycardia as a compensatory response. Treat the cause, NOT the rate.' },
    { id: 'family_hx',    question: 'Family history of sudden cardiac death or arrhythmia?', redFlag: true, ifYes: 'Channelopathy risk (Long QT, Brugada, CPVT). 12-lead EKG mandatory, Cardiology consult.' },
  ],

  investigations: [
    { test: '12-lead EKG — STAT, before any treatment', category: 'urgent', indication: 'Mandatory. Measure QRS width (narrow ≤ 0.09 s vs wide > 0.09 s), identify P-waves, rate. Snap-shot before vagal manoeuvres if possible.', criticalValue: 'Wide QRS (> 0.09 s) = treat as VT until proven otherwise. Irregular wide complex = suspect AF with WPW — do NOT give Adenosine.' },
    { test: 'Continuous cardiac monitoring + SpO₂', category: 'urgent', indication: 'Leave monitor running throughout. Print rhythm strip at time of conversion.' },
    { test: 'IV/IO access', category: 'urgent', indication: 'Establish immediately — required for Adenosine administration. Use right antecubital fossa for fastest drug transit to heart.' },
    { test: 'Blood glucose (bedside)', category: 'urgent', indication: 'Hypoglycaemia can cause tachycardia and arrhythmia, especially in infants.' },

    { test: 'Troponin I or T', category: 'blood', indication: 'Order if: wide complex, chest pain, known CHD, or suspected myocarditis/cardiomyopathy.', criticalValue: 'Elevated troponin = myocardial injury, broadens diagnosis. Add BNP.' },
    { test: 'BNP or NT-proBNP', category: 'blood', indication: 'Elevated in SVT (due to stretch) but normalises on conversion. Very high persistent BNP = underlying cardiac dysfunction.' },
    { test: 'Electrolytes (K⁺, Mg²⁺, Ca²⁺)', category: 'blood', indication: 'Hypokalaemia and hypomagnesaemia predispose to VT and reduce Adenosine efficacy. Correct before repeat doses.' },
    { test: 'Blood culture + CRP if febrile', category: 'blood', indication: 'Fever → sinus tachycardia pathway, but sepsis can also precipitate arrhythmia.' },

    { test: 'CXR', category: 'radiology', indication: 'Order if: suspected heart failure, respiratory distress, first episode of SVT, or wide complex tachycardia. Assess for cardiomegaly, pulmonary oedema.' },
    { test: 'Echocardiogram (urgent bedside)', category: 'radiology', indication: 'Order after conversion for all new first-episode SVT: assess for CHD, function, WPW substrate. Not needed before treatment unless haemodynamically stable with time.', criticalValue: 'Any structural abnormality → immediate Cardiology management before discharge.' },
  ],

  admissionCriteria: [
    'ALL first-episode SVT — admit for cardiology workup, echo, and EKG pattern analysis',
    'Haemodynamically unstable at any point (hypotension, altered consciousness, shock)',
    'Cardioversion required — mandatory PICU admission post-procedure',
    'Wide complex tachycardia (VT pattern) — regardless of clinical stability',
    'Known WPW or other accessory pathway with symptomatic episode',
    'Known or suspected congenital heart disease',
    'Troponin elevation or structural abnormality on echo',
    'Failure of 2 doses of Adenosine to convert rhythm',
    'Arrhythmia during febrile illness in infant < 1 year (myocarditis risk)',
  ],

  highRiskFactors: [
    'Family history of sudden cardiac death or channelopathy',
    'Recurrent SVT despite oral antiarrhythmic therapy — cardiology review',
    'SVT precipitated by exercise (CPVT, AVRT risk)',
    'Infant < 1 year — narrow therapeutic window and limited vagal manoeuvre options',
  ],

  dischargeCriteria: [
    'KNOWN chronic SVT patients only (not first episode)',
    'Spontaneous or pharmacological conversion confirmed on rhythm strip',
    'Post-conversion EKG normal — no delta waves, no ST changes, QTc normal',
    'Haemodynamically stable throughout ER stay — no repeat episodes in 4–6 h observation',
    'Echo done (or scheduled within 48 h) and no new structural finding',
    'Cardiology team reviewed case and cleared discharge',
    'Oral maintenance therapy prescribed and dosed correctly',
    'Reliable carer with written instructions: "If palpitations recur, go to ER immediately"',
    'Follow-up with Cardiology within 1 week confirmed',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: palpitations return, child becomes pale or limp, develops difficulty breathing, loses consciousness, or you are worried.',
    'A normal heart rate now does NOT mean the arrhythmia is permanently resolved — it can recur without warning.',
    'Teach vagal manoeuvres before discharge if age-appropriate: older children: Valsalva (blow hard into a straw). Do NOT teach if WPW or structural heart disease is suspected.',
    'Avoid triggers until Cardiology review: caffeine-containing drinks, energy drinks, excessive exercise.',
    'If a medication was prescribed (e.g. propranolol, flecainide), give it at the same time each day. Do not stop without Cardiology advice.',
    'Keep your Cardiology follow-up appointment even if your child feels completely normal.',
  ],
};

export const tachycardiaSvtProtocol: DiseaseProtocol = {
  id: 'tachycardia-svt',
  name: 'Tachycardia & SVT',
  system: 'Cardiovascular System',
  description: 'Integrated assessment and management of paediatric tachycardia — from sinus tachycardia to SVT and ventricular tachycardia. PALS 2020 aligned.',
  lastUpdated: '2024',
  image: {
    url: 'https://picsum.photos/seed/tachycardia-svt/600/400',
    hint: 'ecg arrhythmia',
  },
  erData,

  questions: [
    { id: 'weight',       questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'compromise',   questionText: 'Haemodynamic compromise?', type: 'select', options: [
      { label: 'Stable — alert, normal BP, good perfusion', value: 'stable',   score: 0 },
      { label: 'Unstable — hypotension, altered consciousness, shock signs', value: 'unstable', score: 6 },
    ], info: 'This is the most critical first decision. When in doubt → unstable.' },
    { id: 'qrs',          questionText: 'QRS width on EKG', type: 'select', options: [
      { label: 'Narrow — ≤ 0.09 s', value: 'narrow', score: 0 },
      { label: 'Wide — > 0.09 s',   value: 'wide',   score: 3 },
    ], info: 'Narrow = likely SVT. Wide = treat as VT until proven otherwise.' },
    { id: 'rhythm',       questionText: 'Rhythm character', type: 'select', options: [
      { label: 'Regular with P-waves, variable rate — Sinus tachycardia', value: 'sinus',    score: 0 },
      { label: 'Regular, no P-waves, sudden onset — SVT',                 value: 'svt',      score: 2 },
      { label: 'Regular, wide, monomorphic — Ventricular tachycardia',   value: 'vt',       score: 4 },
      { label: 'Irregular — AF / AF with WPW / polymorphic VT',          value: 'irregular', score: 4 },
    ]},
    { id: 'rate',         questionText: 'Heart Rate', type: 'select', options: [
      { label: 'Normal for age', value: 'normal', score: 0 },
      { label: '> 180 bpm (child > 1 yr) or > 220 bpm (infant)', value: 'svt_range', score: 2 },
    ], info: 'Rate > 220 bpm in infant or > 180 in child with fixed non-variable rate = SVT until proven otherwise.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const compromise = data.compromise as string;
    const qrs        = data.qrs as string;
    const rhythm     = data.rhythm as string;

    if (compromise === 'unstable') {
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Tachycardia Risk', totalScore: 9, maxScore: 9, interpretation: 'Unstable — Emergency cardioversion' },
        details: ['HAEMODYNAMIC COMPROMISE — Cardioversion required. Do NOT delay for Adenosine unless IV is already in place.'],
      };
    }
    if (rhythm === 'sinus') {
      return {
        level: 'mild',
        scoreDetails: { systemName: 'Tachycardia Risk', totalScore: 0, maxScore: 9, interpretation: 'Sinus tachycardia — treat the cause' },
        details: ['SINUS TACHYCARDIA — compensatory response. Do NOT treat the rate. Find and treat the cause (fever, pain, dehydration, anaemia).'],
      };
    }
    if (qrs === 'wide' || rhythm === 'vt' || rhythm === 'irregular') {
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Tachycardia Risk', totalScore: 7, maxScore: 9, interpretation: 'Wide complex / VT pattern — urgent' },
        details: ['WIDE COMPLEX TACHYCARDIA — treat as VT. Cardiology + PICU now. Do NOT give Adenosine for irregular wide complex.'],
      };
    }
    return {
      level: 'moderate',
      scoreDetails: { systemName: 'Tachycardia Risk', totalScore: 2, maxScore: 9, interpretation: 'Stable SVT — stepwise conversion' },
      details: ['STABLE SVT — stepwise: vagal manoeuvres → Adenosine → cardioversion if refractory.'],
    };
  },

  getManagement: (severity, data) => {
    const compromise = data.compromise as string;
    const qrs        = data.qrs as string;
    const rhythm     = data.rhythm as string;
    const isUnstable = compromise === 'unstable';
    const isWide     = qrs === 'wide' || rhythm === 'vt' || rhythm === 'irregular';
    const isSinus    = rhythm === 'sinus';

    if (isSinus) {
      return [
        {
          title: 'STEP 1 — Sinus Tachycardia: Treat the underlying cause',
          recommendations: [
            'DO NOT give antiarrhythmics or cardiovert — this is a compensatory response, not a primary arrhythmia.',
            'Identify cause: fever → antipyretics; pain → analgesia; dehydration → IV fluids; anaemia → Hb; sepsis → antibiotics.',
            '12-lead EKG: confirm P-waves present, rate variable with activity, gradual onset/offset.',
            'If cause unclear or rate unusually high for the clinical picture → reassess and consider SVT mimicking sinus rhythm.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS after treating the cause',
          recommendations: [
            'Rate normalising with treatment → sinus tachycardia confirmed. No further rhythm intervention.',
            'Rate NOT improving despite treating cause → repeat 12-lead EKG, escalate to Cardiology.',
          ],
        },
      ];
    }

    if (isUnstable || isWide) {
      return [
        {
          title: `STEP 1 — Immediate: ${isUnstable ? 'Unstable Tachycardia' : 'Wide Complex / VT'} — Cardioversion`,
          recommendations: [
            'CALL RESUSCITATION TEAM + CARDIOLOGY + PICU now.',
            isWide && !isUnstable
              ? 'WIDE COMPLEX IN STABLE PATIENT: DO NOT give Adenosine for irregular wide complex (AF+WPW risk). Consult Cardiology before any drug.'
              : 'SYNCHRONISED CARDIOVERSION: 0.5 J/kg initial. If ineffective → 1 J/kg → 2 J/kg.',
            'CONFIRM "SYNC" mode selected on defibrillator before every shock.',
            'Adenosine may be attempted in narrow-complex unstable ONLY if IV already in place — do NOT delay shock to insert IV.',
            'Sedation/analgesia before cardioversion if patient is conscious and time permits.',
            'Continuous cardiac monitoring — print rhythm strip before and after each intervention.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS rhythm after cardioversion',
          recommendations: [
            'CONVERTED to sinus → post-conversion 12-lead EKG immediately (check for delta waves/WPW, QTc).',
            'NOT CONVERTED → repeat cardioversion at higher energy, ensure SYNC mode.',
            'REVERTED to VT/unstable → Amiodarone now (see Drugs tab). Do NOT combine Amiodarone + Procainamide.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Refractory or recurrent after cardioversion',
          recommendations: [
            '1. PICU admission — continuous invasive monitoring.',
            '2. IV Amiodarone infusion (see Drugs tab) — for sustained VT refractory to cardioversion.',
            '3. Repeat electrolytes — correct K⁺ ≥ 4.0 mmol/L and Mg²⁺ ≥ 0.8 mmol/L to optimise anti-arrhythmic effect.',
            '4. Troponin + echo — rule out myocarditis or structural cause.',
            '5. Cardiology to lead further management.',
          ],
        },
        {
          title: 'STEP 4 — Life-threatening: Pulseless VT / VF',
          recommendations: [
            'PULSELESS → switch to DEFIBRILLATION (2 J/kg → 4 J/kg), UNSYNCHRONISED mode.',
            'CPR between all shocks as per PALS algorithm.',
            'Adrenaline (epinephrine) 0.01 mg/kg IV/IO every 3–5 min.',
            'Amiodarone 5 mg/kg IV/IO bolus for shock-refractory VF/VT.',
            'Identify reversible causes: hypoxia, hypovolaemia, hyperkalaemia, hypothermia, tension pneumothorax, tamponade, toxins.',
          ],
        },
      ];
    }

    // Stable SVT (narrow complex)
    return [
      {
        title: 'STEP 1 — Stable SVT: Vagal manoeuvres + Adenosine',
        recommendations: [
          '12-lead EKG FIRST — confirm narrow complex, document rate and P-wave absence.',
          'Establish IV access in right antecubital fossa (fastest route to heart).',
          'VAGAL MANOEUVRES while IV is being set up:',
          '• Infants: ice-cold wet cloth to upper face for 15–20 s (modified dive reflex).',
          '• Children ≥ 5 yr: Valsalva — blow into a 5 mL syringe hard enough to move the plunger.',
          'If vagal fails → ADENOSINE: rapid IV push + immediate 10–20 mL saline flush (2-syringe technique). Must reach heart fast.',
          'CALL CARDIOLOGY: all SVT cases require Cardiology notification.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS at 2 min after each Adenosine dose',
        recommendations: [
          'CONVERTED → sinus rhythm on monitor. Print rhythm strip. Post-conversion 12-lead EKG immediately.',
          'NOT CONVERTED after 1st dose → give 2nd dose (0.2 mg/kg, max 12 mg). Same rapid push technique.',
          'NOT CONVERTED after 2nd dose → DO NOT give a 3rd Adenosine. Escalate to STEP 3.',
          '⚠ If rhythm is now irregular or wide complex after Adenosine → STOP. Suspect AF+WPW. Cardioversion only.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Adenosine-refractory SVT',
        recommendations: [
          '1. RE-CONSULT CARDIOLOGY — mandatory before any further antiarrhythmic.',
          '2. SYNCHRONISED CARDIOVERSION: 0.5 J/kg initial. Sedation if conscious.',
          '3. IV AMIODARONE only if cardioversion not available or fails — 5 mg/kg over 20–60 min. Do NOT bolus.',
          '4. Confirm SYNC mode before every cardioversion attempt.',
          '5. Recheck IV position — failed Adenosine is often due to slow push or distal IV site.',
        ],
      },
      {
        title: 'STEP 4 — Life-threatening: Haemodynamic deterioration during SVT',
        recommendations: [
          'DETERIORATING while on stepwise protocol → treat as UNSTABLE immediately.',
          'CARDIOVERSION NOW: 1 J/kg synchronised.',
          'PICU + Cardiology at bedside.',
          'Post-conversion: echo to exclude structural cause, troponin, electrolytes.',
        ],
      },
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['PICU admission — all unstable, wide complex, or cardioverted patients.'];
    if (severity.level === 'moderate') return ['Admit all first-episode SVT. Discharge only known chronic SVT patients after Cardiology clearance and 4–6 h observation.'];
    return ['Treat underlying cause of sinus tachycardia. Admission based on the primary diagnosis.'];
  },

  getRedFlags: () => [
    'Haemodynamic compromise at any point — hypotension, altered mental status, shock',
    'Wide QRS complex > 0.09 s — treat as VT',
    'Irregular wide complex rhythm — suspect AF with WPW, do NOT give Adenosine',
    'Syncope or chest pain immediately before tachycardia onset',
    'Family history of sudden cardiac death or channelopathy',
    'Known congenital heart disease or prior cardiac surgery',
    'Tachycardia during febrile illness in infant < 1 year (myocarditis)',
    'QTc prolongation on post-conversion EKG',
  ],

  getDrugDoses: (severity, data) => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const adeno1 = Math.min(0.1 * wt, 6).toFixed(2);
    const adeno2 = Math.min(0.2 * wt, 12).toFixed(2);
    const cardio1 = (0.5 * wt).toFixed(0);
    const cardio2 = wt.toFixed(0);
    const cardio3 = (2 * wt).toFixed(0);
    const amio    = Math.min(5 * wt, 300).toFixed(0);
    const epi     = (0.01 * wt).toFixed(2);
    const amioVF  = Math.min(5 * wt, 300).toFixed(0);

    doses.push({
      drugName: 'Adenosine — 1st dose (stable SVT)',
      dose: `${adeno1} mg RAPID IV push (0.1 mg/kg, max 6 mg)`,
      notes: 'Two-syringe technique: drug then immediate 10–20 mL saline flush. Right antecubital IV preferred.',
    });
    doses.push({
      drugName: 'Adenosine — 2nd dose (if 1st fails, wait 2 min)',
      dose: `${adeno2} mg RAPID IV push (0.2 mg/kg, max 12 mg)`,
      notes: 'Same technique. Do NOT give 3rd dose — escalate to cardioversion.',
    });
    doses.push({
      drugName: 'Synchronised Cardioversion (SVT / stable VT)',
      dose: `${cardio1} J (0.5 J/kg) → ${cardio2} J (1 J/kg) → ${cardio3} J (2 J/kg) if needed`,
      notes: 'CONFIRM "SYNC" mode before each shock. Sedate if conscious.',
    });
    doses.push({
      drugName: 'Amiodarone IV (refractory VT / refractory SVT)',
      dose: `${amio} mg IV over 20–60 min (5 mg/kg, max 300 mg)`,
      notes: 'Do NOT bolus — infuse over 20–60 min. Monitor for hypotension. Cardiology consultation mandatory.',
    });
    doses.push({
      drugName: 'Adrenaline (Epinephrine) IV/IO — pulseless VT/VF only',
      dose: `${epi} mg IV/IO (0.01 mg/kg, max 1 mg) every 3–5 min`,
      notes: 'Pulseless arrest only. Switch defibrillator to UNSYNCHRONISED (2–4 J/kg) for VF.',
    });
    doses.push({
      drugName: 'Amiodarone IV/IO bolus — VF / pulseless VT',
      dose: `${amioVF} mg IV/IO bolus (5 mg/kg, max 300 mg)`,
      notes: 'For shock-refractory VF/pulseless VT during CPR.',
    });

    return doses;
  },

  getReferences: () => [
    { title: 'AHA PALS Guidelines 2020 — Paediatric Tachycardia with a Pulse Algorithm', url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support' },
    { title: 'Brugada J et al. — 2019 ESC Guidelines on supraventricular tachycardia', url: 'https://doi.org/10.1093/eurheartj/ehz467' },
    { title: 'AHA Scientific Statement — Paediatric Arrhythmias (Circulation 2014)', url: 'https://doi.org/10.1161/CIR.0000000000000040' },
  ],
};
