import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'prev_anaphylaxis', question: 'Previous anaphylaxis episode?', redFlag: true, ifYes: 'Prior anaphylaxis predicts severity of future reactions. Ask for auto-injector and action plan. High biphasic risk.' },
    { id: 'asthma',          question: 'Known asthma or reactive airway disease?', redFlag: true, ifYes: 'Asthma is the strongest risk factor for fatal anaphylaxis. Treat bronchospasm aggressively. Do NOT rely on inhaled salbutamol alone.' },
    { id: 'beta_blocker',    question: 'On beta-blockers (propranolol, atenolol, metoprolol)?', redFlag: true, ifYes: 'Beta-blockers blunt the response to epinephrine and can worsen bradycardia. May need IV glucagon in addition to epinephrine.' },
    { id: 'ace_inhibitor',   question: 'On ACE inhibitor?', redFlag: false, ifYes: 'ACE inhibitors impair bradykinin degradation — increase risk of severe angioedema particularly of the airway.' },
    { id: 'auto_injector',   question: 'Auto-injector (EpiPen) used before arrival?', ifYes: 'Auto-injector used: document time of use and dose. Patient may still need IM epinephrine if symptoms persist or recurring. The auto-injector is 0.15 mg (child) or 0.3 mg (adult) — may be insufficient for severe reaction.' },
    { id: 'known_allergen',  question: 'Exposure to a known personal allergen (documented allergy)?', redFlag: true, ifYes: 'Known allergen exposure in a sensitised patient: treat as confirmed anaphylaxis at first sign. Do NOT wait for full criteria to be met.' },
    { id: 'still_exposed',   question: 'Is the allergen still present / ongoing exposure (e.g., stinging insect still attached)?', redFlag: true, ifYes: 'Remove the allergen immediately. Stinging insect: remove stinger by scraping (do not squeeze). IV contrast: stop infusion. Drug infusion: stop immediately.' },
    { id: 'ingested',        question: 'Route of exposure: ingested food or oral medication?', ifYes: 'Ingested allergens have delayed onset (30–120 min) but prolonged absorption — biphasic reaction more likely. Higher risk of recurrence.' },
  ],

  investigations: [
    { test: 'Continuous SpO₂ + cardiac monitoring', category: 'urgent', indication: 'Mandatory for all patients. Pulse oximetry may underestimate oxygenation in shock (poor peripheral perfusion).', criticalValue: 'SpO₂ < 94% = respiratory compromise — escalate airway management.' },
    { test: 'ECG (12-lead)', category: 'urgent', indication: 'If chest pain, tachyarrhythmia, or haemodynamic instability. Epinephrine can cause transient ST changes and arrhythmias.', criticalValue: 'AF, VT, or ST elevation → cardiology input.' },
    { test: 'Point-of-care glucose', category: 'urgent', indication: 'Any altered mental status or shock. Hypoglycaemia can mimic or complicate anaphylaxis.' },
    { test: 'Serum tryptase', category: 'blood', indication: 'NOT urgent for management. Draw at 1–2 h after onset if diagnosis uncertain (baseline + acute). Elevated tryptase confirms mast cell activation. Normal tryptase does NOT exclude anaphylaxis.', criticalValue: 'Peak at 1 h, returns to baseline by 6–8 h — sample timing is critical.' },
    { test: 'CXR', category: 'radiology', indication: 'Only if: suspected aspiration, pneumothorax, foreign body. NOT routine for straightforward anaphylaxis.' },
  ],

  admissionCriteria: [
    'Any patient who received IM epinephrine — minimum 4–8 hour observation',
    'Anaphylactic shock (hypotension, end-organ dysfunction) — minimum 24h + PICU',
    'Biphasic risk factors: prior biphasic reaction, delayed epinephrine (>30 min), asthma, large allergen dose, age < 5 years',
    'Upper airway angioedema (tongue/uvular swelling, stridor) — admit regardless of response',
    'Required >1 dose IM epinephrine or required IV epinephrine',
    'Ingested allergen in known allergic patient — higher biphasic risk (24h observation)',
  ],

  highRiskFactors: [
    'Known asthma (highest risk for fatal outcome)',
    'Beta-blocker use (impairs response to epinephrine)',
    'Prior anaphylaxis requiring hospitalisation',
    'Idiopathic anaphylaxis — no identifiable trigger',
    'Remote location or delayed access to medical care',
  ],

  dischargeCriteria: [
    'Completely asymptomatic for ≥ 4 hours (≥ 8 hours if initially severe or shock)',
    'SpO₂ ≥ 95% on room air, HR and BP normal for age',
    'No stridor, no wheeze, no angioedema',
    'Tolerating oral fluids',
    'Epinephrine auto-injector prescribed (two devices) — technique demonstrated to carer',
    'Written anaphylaxis action plan given',
    'Allergy/immunology referral arranged',
    'Reliable caregiver confirmed — understands biphasic risk and 72-hour watch',
  ],

  safetyNetting: [
    'RETURN TO ER IMMEDIATELY if: breathing difficulty returns, skin swelling spreads, lips/tongue swell, child collapses or is difficult to rouse, symptoms return within 72 hours.',
    'Biphasic reaction: symptoms can return 1–72 hours after complete initial recovery (occurs in 5–20% of cases). This is NOT a second allergy attack — it is the SAME reaction returning.',
    'USE YOUR EPINEPHRINE AUTO-INJECTOR IMMEDIATELY if symptoms return — do not wait to see if they get better on their own. Call emergency services after using.',
    'Antihistamines (cetirizine, diphenhydramine) treat hives and itch ONLY. They do NOT treat airway swelling or shock. Do NOT rely on antihistamines as a substitute for epinephrine.',
    'Avoid the identified trigger completely. Read food labels carefully — cross-contamination can cause a reaction.',
    'Always carry TWO epinephrine auto-injectors. Wear a MedicAlert identification.',
    'Allergy referral in 4–6 weeks for skin/specific IgE testing and advice on desensitisation if applicable.',
  ],
};

export const anaphylacticShockProtocol: DiseaseProtocol = {
  id: 'anaphylactic-shock',
  name: 'Anaphylaxis and Anaphylactic Shock',
  system: 'Shock and Resuscitation',
  description: 'Emergency recognition and management of anaphylaxis and anaphylactic shock in children. Epinephrine IM is the only first-line treatment — antihistamines and steroids are adjuncts and must never replace or delay epinephrine.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/anaphylactic-shock/600/400', hint: 'allergy injection' },
  erData,

  questions: [
    { id: 'weight',       questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'onset',        questionText: 'Acute onset within minutes to 2 hours?', type: 'boolean' },
    { id: 'skinMucosal',  questionText: 'Skin / mucosal involvement?', type: 'boolean', info: 'Hives, generalised itch, flushing, swollen lips / tongue / uvula.' },
    { id: 'respiratory',  questionText: 'Respiratory compromise?', type: 'boolean', info: 'Stridor, wheeze, dyspnoea, hypoxaemia, hoarse voice.' },
    { id: 'hypotension',  questionText: 'Hypotension, syncope, or shock?', type: 'boolean', info: 'Reduced BP for age, collapse, floppiness, altered consciousness, extreme pallor.' },
    { id: 'giSymptoms',   questionText: 'Persistent GI symptoms?', type: 'boolean', info: 'Severe crampy abdominal pain, repetitive vomiting or diarrhoea.' },
    { id: 'exposure',     questionText: 'Allergen exposure', type: 'select', options: [
      { label: 'None suspected',                   value: 'none' },
      { label: 'Likely allergen (history suggests)', value: 'likely' },
      { label: 'Known personal allergen confirmed', value: 'known' },
    ]},
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    // NIAID/FAAN Criteria 1: Acute onset skin + (resp or hypotension)
    const criteria1 = data.onset && data.skinMucosal && (data.respiratory || data.hypotension);
    // Criteria 2: ≥2 of (skin, resp, hypotension, GI) after likely/known allergen
    let count = 0;
    if (data.skinMucosal)  count++;
    if (data.respiratory)  count++;
    if (data.hypotension)  count++;
    if (data.giSymptoms)   count++;
    const criteria2 = (data.exposure === 'likely' || data.exposure === 'known') && count >= 2;
    // Criteria 3: Hypotension after known allergen
    const criteria3 = data.exposure === 'known' && data.hypotension;

    const confirmed = criteria1 || criteria2 || criteria3;

    if (confirmed && data.hypotension) {
      details.push('ANAPHYLACTIC SHOCK — criteria met + haemodynamic compromise. PICU + epinephrine infusion may be needed.');
      return { level: 'critical', details };
    }
    if (confirmed) {
      details.push('CONFIRMED ANAPHYLAXIS — meets NIAID/FAAN diagnostic criteria. Epinephrine IM immediately.');
      return { level: 'severe', details };
    }
    if (count >= 1 && (data.exposure === 'likely' || data.exposure === 'known')) {
      details.push('LIKELY ANAPHYLAXIS — significant symptoms after allergen exposure, not all criteria met. High risk of rapid progression.');
      return { level: 'moderate', details };
    }
    if (data.onset && (data.respiratory || data.skinMucosal)) {
      details.push('SUSPECTED ANAPHYLAXIS — acute onset with systemic symptoms. Monitor closely; draw up epinephrine at bedside.');
      return { level: 'mild', details };
    }
    details.push('Does not meet anaphylaxis criteria. Observe for progression. Answer all questions above.');
    return { level: 'mild', details };
  },

  getManagement: (severity, data) => {
    const STEP3 = {
      title: 'STEP 3 — ESCALATION: Inadequate response to 2 IM epinephrine doses',
      recommendations: [
        '1. Call PICU and senior immediately.',
        '2. IV/IO access — give isotonic fluid bolus 20 mL/kg rapidly. Repeat as needed for shock.',
        '3. Epinephrine IV infusion: start 0.1 mcg/kg/min, titrate up to 1 mcg/kg/min. See drug doses for preparation.',
        '4. IV Hydrocortisone 4 mg/kg (max 200 mg) IV — prevention of prolonged/biphasic reaction (onset takes 4–6 h).',
        '5. IV Diphenhydramine 1 mg/kg (max 50 mg) — for urticaria/pruritus; does NOT treat airway or shock.',
        '6. Persistent bronchospasm after epi: nebulised salbutamol 0.15 mg/kg.',
        '7. Beta-blocker patient not responding to epi: IV Glucagon 20–30 mcg/kg (max 1 mg) over 5 min, then 5–15 mcg/kg/min infusion.',
        '8. Supine position with legs elevated (or sitting up if severe respiratory component).',
      ],
    };

    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Refractory shock or complete airway obstruction',
      recommendations: [
        'Refractory anaphylactic shock despite epinephrine infusion + fluid resuscitation:',
        '• Noradrenaline infusion 0.1–1 mcg/kg/min as additional vasopressor.',
        '• Vasopressin 0.0003–0.002 units/kg/min if noradrenaline insufficient.',
        '• Methylene blue 1–2 mg/kg IV over 20 min for vasodilatory shock refractory to all vasopressors.',
        '• ECMO if available as bridge therapy.',
        'Upper airway obstruction (angioedema, stridor, muffled voice):',
        '• RSI with ketamine 1–2 mg/kg + suxamethonium 1–2 mg/kg or rocuronium 1.2 mg/kg. Video laryngoscope. ENT standby.',
        '• Needle cricothyroidotomy + jet ventilation if intubation fails.',
        '• Surgical airway as definitive rescue.',
        'CALL RESUSCITATION TEAM + ANAESTHESIA + ENT simultaneously.',
      ],
    };

    if (severity.level === 'critical') {
      return [
        {
          title: 'STEP 1 — ANAPHYLACTIC SHOCK: Epinephrine + resuscitation NOW',
          recommendations: [
            'EPINEPHRINE IM (1:1,000) 0.01 mg/kg (max 0.5 mg) into mid-outer thigh NOW — undiluted IM.',
            'Call resuscitation team + PICU. Place in resuscitation area.',
            'POSITION: supine, legs elevated if shock predominates; sit up if upper airway obstruction.',
            'O₂ 100% via non-rebreather mask.',
            'Remove allergen if still present.',
            'IV/IO access + 20 mL/kg NS bolus immediately for shock.',
            'Continuous ECG + SpO₂ + BP monitoring.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 5–15 minutes',
          recommendations: [
            'Responding (BP improving, reduced stridor/wheeze, alerting) → second IM epinephrine if any residual symptoms. Start monitoring for biphasic.',
            'Partial response → repeat IM epinephrine 0.01 mg/kg + fluid bolus → STEP 3.',
            'No response after 2 IM doses → STEP 3 immediately (IV epi infusion).',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — CONFIRMED ANAPHYLAXIS: Epinephrine IM immediately',
          recommendations: [
            'EPINEPHRINE IM (1:1,000) 0.01 mg/kg (max 0.5 mg) into mid-outer thigh NOW — undiluted IM.',
            'Do NOT delay for IV access, antihistamines, or steroids.',
            'O₂ via mask or nasal cannula.',
            'Lie supine (or position of comfort for respiratory distress).',
            'Remove allergen if ongoing. Place on SpO₂ + cardiac monitor.',
            'IV access — but do NOT delay epinephrine.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 5–15 minutes: Responding?',
          recommendations: [
            'Good response (skin improving, breathing easier, alert) → observe for biphasic. Second IM epi only if residual symptoms.',
            'Partial / no response → second IM epinephrine 0.01 mg/kg IM + escalate to STEP 3.',
            'New or worsening hypotension → IV fluids 20 mL/kg + STEP 3.',
            'Adjuncts AFTER epi: Hydrocortisone IV (biphasic prevention). Diphenhydramine IV (itch/hives only).',
            'Do NOT give antihistamines or steroids INSTEAD of epinephrine.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — LIKELY ANAPHYLAXIS: Draw up epinephrine + IV access',
          recommendations: [
            'Draw up IM Epinephrine 0.01 mg/kg at bedside NOW — ready to give at any moment.',
            'IV/IO access. Place on cardiac monitor + SpO₂.',
            'O₂ via nasal cannula.',
            'Remove allergen if still present.',
            'GIVE EPINEPHRINE IM IMMEDIATELY if: any respiratory distress, wheeze, stridor, swallowing difficulty, haemodynamic change, or rapid symptom progression.',
            'Do NOT wait for full NIAID criteria if allergen exposure is confirmed and symptoms are progressing.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS every 5–10 minutes: Progressing?',
          recommendations: [
            'Any systemic progression → give IM epinephrine immediately and move to confirmed anaphylaxis pathway.',
            'Stable, symptoms not progressing → continue to observe. Admit for minimum 4h observation.',
            'First dose of epinephrine given → admission criteria apply (see Dispose tab).',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    return [
      {
        title: 'STEP 1 — SUSPECTED: Monitor + epinephrine ready',
        recommendations: [
          'Draw up epinephrine at bedside. Monitor vitals every 5 minutes.',
          'SpO₂ continuously. Cardiac monitor.',
          'Remove allergen if identifiable.',
          'Treat any developing systemic symptom (new wheeze, urticaria, GI) as anaphylaxis and give epinephrine immediately.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS: New systemic symptoms?',
        recommendations: [
          'Any new systemic symptom → treat as confirmed anaphylaxis. Give epinephrine IM.',
          'Symptoms stable/resolving → observe 4h from last symptom. Discharge with safety plan.',
        ],
      },
      STEP3,
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'critical') return ['PICU admission. Minimum 24h monitoring. Senior + PICU on scene now.'];
    if (severity.level === 'severe') return ['Observe minimum 4–8 hours. Biphasic risk assessment (see high-risk factors). PICU if upper airway involvement or prior biphasic.'];
    if (severity.level === 'moderate') return ['Observe minimum 4h from symptom onset or epinephrine use. Discharge only if completely asymptomatic with action plan.'];
    return ['Observe 2–4h. Discharge if asymptomatic with safety netting. Allergy follow-up.'];
  },

  getRedFlags: () => [
    'Stridor or muffled voice — critical upper airway angioedema',
    'SpO₂ falling despite O₂ — bronchospasm or airway swelling',
    'Hypotension or collapse (anaphylactic shock)',
    'No response after 2 IM epinephrine doses',
    'Patient on beta-blocker — impaired epinephrine response',
    'Biphasic reaction — symptom return 1–72h after complete initial recovery',
    'Asthma + anaphylaxis — highest risk for fatal outcome',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const epiIM     = Math.min(0.01 * wt, 0.5).toFixed(2);
    const epiIV     = Math.min(0.01 * wt, 0.5).toFixed(2);
    const nsbolus   = (20 * wt).toFixed(0);
    const hydrocort = Math.min(4 * wt, 200).toFixed(0);
    const diphenhyd = Math.min(wt, 50).toFixed(0);
    const salb      = Math.min(0.15 * wt, 5).toFixed(2);
    const glucagon  = Math.min(0.02 * wt, 1).toFixed(2);
    const epiInfPrep = (0.3 * wt).toFixed(2);

    doses.push({ drugName: 'Epinephrine IM (1:1,000 — undiluted)', dose: `${epiIM} mg = ${epiIM} mL IM into mid-outer thigh`, notes: '0.01 mg/kg, max 0.5 mg. Repeat q5–15 min. First-line — do NOT delay for IV access.' });
    doses.push({ drugName: 'NS / LR fluid bolus (for shock)', dose: `${nsbolus} mL IV/IO rapid push`, notes: '20 mL/kg. Repeat as needed for haemodynamic response.' });
    doses.push({ drugName: 'Epinephrine IV push (rescue for shock only)', dose: `${epiIV} mg IV = ${(Number(epiIV) * 10).toFixed(1)} mL of 1:10,000 solution`, notes: 'Only if IM route failed and shock persists. Dilute 1:1,000 stock 1:10 (1 mL + 9 mL NS) to make 1:10,000. Give slowly over 5–10 min.' });
    doses.push({ drugName: 'Epinephrine IV infusion (refractory shock)', dose: `Start 0.1 mcg/kg/min, titrate to 1 mcg/kg/min`, notes: `Preparation: add ${epiInfPrep} mg (1:1,000 stock) to 50 mL NS → 1 mL/hr = 0.1 mcg/kg/min.` });
    doses.push({ drugName: 'Hydrocortisone IV (adjunct)', dose: `${hydrocort} mg IV (4 mg/kg, max 200 mg)`, notes: 'Second-line only. Biphasic reaction prevention — onset 4–6h. Does NOT treat acute anaphylaxis.' });
    doses.push({ drugName: 'Diphenhydramine IV/IM (adjunct)', dose: `${diphenhyd} mg (1 mg/kg, max 50 mg)`, notes: 'Treats skin symptoms (urticaria/pruritus) only. Does NOT treat airway swelling or shock.' });
    doses.push({ drugName: 'Salbutamol neb (bronchospasm)', dose: `${salb} mg (0.15 mg/kg, max 5 mg) via nebuliser`, notes: 'For persistent wheeze AFTER epinephrine. Not a substitute for epinephrine.' });
    doses.push({ drugName: 'Glucagon IV (beta-blocker patient only)', dose: `${glucagon} mg (0.02 mg/kg, max 1 mg) IV over 5 min`, notes: 'Only if on beta-blockers and inadequate response to epinephrine. Follow with infusion 5–15 mcg/kg/min.' });

    return doses;
  },

  getReferences: () => [
    { title: 'WAO Anaphylaxis Guidance 2020 — World Allergy Organization', url: 'https://doi.org/10.1016/j.waojou.2020.100091' },
    { title: 'NIAID/FAAN Diagnostic Criteria for Anaphylaxis — Sampson HA et al. JACI 2006', url: 'https://doi.org/10.1016/j.jaci.2005.12.1303' },
    { title: 'PALS 2020 Provider Manual — American Heart Association', url: 'https://cpr.heart.org/pals-provider-manual' },
    { title: 'RCPCH/BSACI UK Anaphylaxis Guidelines 2021', url: 'https://www.bsaci.org/guidelines' },
  ],
};
