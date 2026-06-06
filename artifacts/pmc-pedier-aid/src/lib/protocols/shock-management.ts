import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'fever_infx',    question: 'Fever or known/suspected infection?', redFlag: false, ifYes: 'DISTRIBUTIVE / SEPTIC — follow Septic Shock protocol for antibiotic timing and vasopressor selection.' },
    { id: 'allergen',      question: 'Known allergen exposure or sudden-onset urticaria / angioedema / wheeze?', redFlag: true, ifYes: 'ANAPHYLAXIS — Adrenaline IM 0.01 mg/kg into outer thigh IMMEDIATELY. Do not wait for IV access.' },
    { id: 'bleeding',      question: 'Active haemorrhage, trauma, or major fluid losses (vomiting/diarrhoea)?', redFlag: false, ifYes: 'HYPOVOLEMIC — aggressive isotonic fluid resuscitation. Blood products early if haemorrhage.' },
    { id: 'cardiac_hx',    question: 'Known congenital heart disease, cardiomyopathy, or suspected myocarditis?', redFlag: true, ifYes: 'CARDIOGENIC — CAUTIOUS fluids only (5–10 mL/kg). Do NOT give standard 20 mL/kg bolus. Follow Heart Failure / Myocarditis protocol.' },
    { id: 'obstructive',   question: 'Trauma, sudden respiratory collapse, tracheal deviation, or muffled heart sounds?', redFlag: true, ifYes: 'OBSTRUCTIVE — suspect Tension Pneumothorax or Tamponade. Procedure required — drugs will NOT reverse shock.' },
    { id: 'neonate_duct',  question: 'Neonate < 2 weeks old with sudden cardiovascular collapse?', redFlag: true, ifYes: 'DUCTAL-DEPENDENT LESION — start PGE1 immediately. Do not wait for echo confirmation.' },
    { id: 'prior_fluids',  question: 'Has the child already received fluid boluses? If yes, how much?', ifYes: 'Document total volume given. If > 40 mL/kg without improvement → reassess type of shock, consider vasopressors.' },
    { id: 'rales_hepato',  question: 'Rales on lung auscultation or new hepatomegaly on exam?', redFlag: true, ifYes: 'FLUID OVERLOAD — stop fluid boluses. Cardiogenic shock more likely. Early vasoactive support.' },
  ],

  investigations: [
    { test: 'Glucose (bedside POC)', category: 'urgent', indication: 'Mandatory in ALL shock. Hypoglycaemia is common, easily corrected, and life-threatening if missed.', criticalValue: '< 60 mg/dL → give 2 mL/kg of 10% dextrose IV immediately.' },
    { test: 'Venous blood gas + lactate', category: 'urgent', indication: 'Lactate reflects global tissue perfusion. Serial lactate guides adequacy of resuscitation.', criticalValue: 'Lactate ≥ 4 mmol/L = severe tissue hypoperfusion. Metabolic acidosis = decompensated shock.' },
    { test: 'Continuous SpO₂ + cardiac monitoring + BP q5 min', category: 'urgent', indication: 'Baseline vitals every 5 min during resuscitation. Trend is more important than single values.' },
    { test: 'IV / IO access — 2 large-bore sites', category: 'urgent', indication: 'IO immediately if IV fails after 2 attempts or > 90 seconds. Do NOT delay resuscitation for IV access.' },
    { test: 'Blood culture × 2 (before antibiotics)', category: 'blood', indication: 'Mandatory if septic shock possible. Never delay antibiotics > 15 min to collect cultures.', criticalValue: 'Send before antibiotics — but do NOT let collection delay treatment.' },
    { test: 'CBC + differential', category: 'blood', indication: 'WBC and differential help confirm infection. Haematocrit guides blood product need in haemorrhagic shock.' },
    { test: 'Electrolytes, creatinine, BUN', category: 'blood', indication: 'Baseline organ function. Monitor for AKI (oliguria, rising creatinine) as a marker of organ perfusion failure.' },
    { test: 'Troponin + BNP', category: 'blood', indication: 'Order if: cardiogenic shock suspected, viral prodrome, known CHD, or failure to respond to fluids.', criticalValue: 'Elevated troponin + shock = myocarditis / cardiogenic cause. Change fluid strategy.' },
    { test: 'Coagulation (PT/INR/APTT + fibrinogen)', category: 'blood', indication: 'Septic shock → DIC risk. Haemorrhagic shock → coagulopathy. Guides blood product selection.' },
    { test: 'CXR (portable)', category: 'radiology', indication: 'Cardiomegaly = cardiogenic; pulmonary oedema = HF; pneumothorax = obstructive.', criticalValue: 'Absent lung markings unilaterally = tension pneumothorax → needle decompression NOW before CXR if haemodynamically unstable.' },
    { test: 'Bedside echo (FAST / cardiac views)', category: 'radiology', indication: 'Most valuable in undifferentiated shock. Assess: IVC (volume status), LV function, pericardial effusion, pneumothorax.', criticalValue: 'Empty ventricles = hypovolemic. Poor LV function = cardiogenic. Pericardial effusion = tamponade.' },
  ],

  admissionCriteria: [
    'ALL patients in shock require admission — all types, all severities',
    'PICU if: haemodynamic instability requiring vasoactive infusion, altered mental status, organ dysfunction',
    'PICU if: failed initial fluid resuscitation (> 40 mL/kg without improvement)',
    'Surgical or cardiac consultation if: obstructive or cardiogenic shock',
    'PICU transfer if facility lacks paediatric resuscitation capability',
  ],

  highRiskFactors: [
    'Age < 3 months — limited physiological reserve, shock can be rapidly fatal',
    'Known immunocompromised state — broader infection risk, faster deterioration',
    'Known congenital heart disease — cardiogenic and obstructive causes likely',
    'Prior anaphylaxis — biphasic reaction risk up to 72 h after first episode',
  ],

  dischargeCriteria: [
    'Shock is NEVER discharged from the ER — all patients are admitted',
  ],

  safetyNetting: [
    'Shock is a medical emergency. All patients with confirmed shock are admitted.',
    'After discharge from hospital (not ER): return immediately if child becomes pale, cold, less responsive, stops passing urine, or develops new symptoms.',
    'Anaphylaxis patients: prescribe Adrenaline auto-injector (e.g. EpiPen) before discharge from hospital. Teach technique.',
  ],
};

export const shockManagementProtocol: DiseaseProtocol = {
  id: 'shock-management',
  name: 'Shock — Triage & Classification',
  system: 'Shock and Resuscitation',
  description: 'Rapid classification and initial management of paediatric shock. Identifies shock type (distributive, hypovolemic, cardiogenic, obstructive) and routes to specific management. PALS 2020 aligned.',
  lastUpdated: '2024',
  image: {
    url: 'https://picsum.photos/seed/shock-mgmt/600/400',
    hint: 'intensive care monitoring',
  },
  erData,

  questions: [
    { id: 'weight',    questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'shockType', questionText: 'Most likely shock type', type: 'select', options: [
      { label: 'Distributive — Septic (fever / infection)',             value: 'septic',      score: 0 },
      { label: 'Distributive — Anaphylactic (allergen / sudden onset)', value: 'anaphylaxis', score: 0 },
      { label: 'Hypovolemic — Dehydration / Haemorrhage',              value: 'hypo',        score: 0 },
      { label: 'Cardiogenic — Known CHD / Myocarditis / HF',           value: 'cardiac',     score: 0 },
      { label: 'Obstructive — Tension PTX / Tamponade',                value: 'obstructive', score: 0 },
      { label: 'Unknown / Undifferentiated',                           value: 'unknown',     score: 0 },
    ]},
    { id: 'physiology', questionText: 'Peripheral perfusion', type: 'select', options: [
      { label: 'Cold — cool extremities, cap refill > 3 s, weak pulses', value: 'cold', score: 0 },
      { label: 'Warm — flash cap refill, bounding pulses, mottled',      value: 'warm', score: 0 },
    ], info: 'Cold = low cardiac output. Warm = vasodilated. Determines vasopressor choice.' },
    { id: 'bp',        questionText: 'Blood pressure', type: 'select', options: [
      { label: 'Normal for age — Compensated shock',  value: 'normal', score: 2 },
      { label: 'Hypotensive for age — Decompensated', value: 'low',    score: 5 },
    ]},
    { id: 'mental',    questionText: 'Mental status', type: 'select', options: [
      { label: 'Alert / irritable',  value: 'alert',       score: 0 },
      { label: 'Lethargic',         value: 'altered',     score: 2 },
      { label: 'Unresponsive',      value: 'unresponsive', score: 4 },
    ]},
    { id: 'overload', questionText: 'Signs of fluid overload? (rales, hepatomegaly)', type: 'boolean',
      info: 'If YES: stop fluid boluses. Cardiogenic physiology — early vasopressor over volume.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const shockType = data.shockType as string;
    const bp        = data.bp as string;
    const mental    = data.mental as string;
    const details: string[] = [];

    const typeLabel: Record<string, string> = {
      septic:      'SEPTIC SHOCK → follow Septic Shock protocol',
      anaphylaxis: 'ANAPHYLACTIC SHOCK → Adrenaline IM first',
      hypo:        'HYPOVOLEMIC SHOCK → aggressive fluid resuscitation',
      cardiac:     'CARDIOGENIC SHOCK → cautious fluids, early inotropes',
      obstructive: 'OBSTRUCTIVE SHOCK → relieve obstruction first',
      unknown:     'UNDIFFERENTIATED → echo + lactate to classify',
    };

    if (shockType && typeLabel[shockType]) details.push(typeLabel[shockType]);
    if (bp === 'low')              details.push('HYPOTENSION — decompensated. Vasopressors needed.');
    if (mental === 'altered')      details.push('Altered mental status — brain hypoperfusion.');
    if (mental === 'unresponsive') details.push('UNRESPONSIVE — airway first.');
    if (data.overload === true)    details.push('Fluid overload — STOP BOLUSES. Early vasopressors.');

    return {
      level: 'severe',
      scoreDetails: {
        systemName: 'Shock Type',
        totalScore: 0, maxScore: 0,
        interpretation: shockType ? typeLabel[shockType].split(' →')[0] : 'Select shock type above',
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const shockType = data.shockType as string;
    const physio    = data.physiology as string;
    const overload  = data.overload === true;
    const isCardiac = shockType === 'cardiac' || overload;

    return [
      {
        title: 'STEP 1 — Immediate: Universal ABC + type-specific fluid strategy',
        recommendations: [
          'AIRWAY: High-flow O₂ 100% via non-rebreather. Assist ventilation if inadequate.',
          'CIRCULATION: 2 large-bore IVs or IO immediately.',
          'GLUCOSE: Bedside glucose NOW — correct if < 60 mg/dL (2 mL/kg 10% dextrose).',
          shockType === 'anaphylaxis'
            ? '🔴 ANAPHYLAXIS → Adrenaline IM 0.01 mg/kg outer thigh NOW — before fluids or IV.'
            : shockType === 'obstructive'
            ? '🔴 OBSTRUCTIVE → Relieve obstruction NOW. Tension PTX: needle decompress 2nd ICS MCL. Tamponade: pericardiocentesis. Drugs will NOT work.'
            : isCardiac
            ? '⚠ CARDIOGENIC / FLUID OVERLOAD → 5–10 mL/kg cautious bolus only. See Heart Failure / Myocarditis protocol.'
            : 'FLUIDS: 20 mL/kg isotonic crystalloid over 5–10 min. Repeat up to 40–60 mL/kg if no overload signs.',
          shockType === 'septic' ? 'ANTIBIOTICS within 60 min — blood culture first, then broad-spectrum IV.' : '',
        ].filter(Boolean) as string[],
      },
      {
        title: 'STEP 2 — REASSESS at 15–30 min: fluid-responsive?',
        recommendations: [
          'IMPROVING (cap refill ≤ 2 s, HR falling, BP normalising, more alert): → continue resuscitation.',
          'NOT IMPROVING after 40–60 mL/kg: → vasopressors now. Stop repeating boluses without effect.',
          'HAEMORRHAGIC: switch to PRBCs 10–15 mL/kg. Activate MTP if ongoing haemorrhage.',
          'Repeat lactate at 1 h: rising lactate = not improving. Falling = improving.',
          'If undifferentiated: bedside echo now to assess IVC, LV function, effusion.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Fluid-refractory shock',
        recommendations: [
          '1. PICU + senior clinician at bedside now.',
          physio === 'warm' || shockType === 'septic' || shockType === 'anaphylaxis'
            ? '2. VASOPRESSOR — WARM: Noradrenaline 0.05 mcg/kg/min, titrate up.'
            : '2. VASOPRESSOR — COLD: Adrenaline 0.05 mcg/kg/min. Add Milrinone 0.25 mcg/kg/min if cardiogenic.',
          '3. HYDROCORTISONE if vasopressor dose escalating without response (2 mg/kg IV).',
          '4. Correct electrolytes: K⁺, Ca²⁺, Mg²⁺.',
          '5. Arterial line + urinary catheter for continuous monitoring.',
          shockType === 'anaphylaxis' ? '6. ANAPHYLAXIS refractory: IV Adrenaline infusion 0.1–1 mcg/kg/min. Glucagon if on beta-blockers.' : '',
        ].filter(Boolean) as string[],
      },
      {
        title: 'STEP 4 — Life-threatening: Refractory shock / Arrest',
        recommendations: [
          'CARDIAC ARREST → CPR + PALS. Adrenaline 0.01 mg/kg IV/IO every 3–5 min.',
          'Defibrillate if VF/pulseless VT: 2 J/kg unsynchronised.',
          'ECMO consideration: cardiogenic or septic refractory to 3 vasopressors.',
          'Reversible causes (Hs and Ts): Hypoxia, Hypovolaemia, H⁺ (acidosis), Hypo/hyperK, Hypothermia; Tension PTX, Tamponade, Toxins, Thrombosis.',
        ],
      },
    ];
  },

  getDisposition: () => ['PICU admission — all shock patients. Never discharge from ER.'],

  getRedFlags: () => [
    'Hypotension for age — decompensated, late and ominous sign',
    'Altered or declining mental status',
    'Rales or hepatomegaly developing during fluid resuscitation — stop boluses',
    'Tracheal deviation / absent breath sounds — tension pneumothorax',
    'Muffled heart sounds + distended neck veins — cardiac tamponade',
    'No response after 40–60 mL/kg crystalloid — reassess shock type',
    'Rising lactate on serial measurements',
    'Neonate < 2 weeks with sudden collapse — ductal-dependent lesion',
  ],

  getDrugDoses: (severity, data) => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const epiR6 = (0.6 * wt).toFixed(2);

    doses.push({ drugName: 'Fluid bolus — standard', dose: `${(20*wt).toFixed(0)} mL (20 mL/kg) over 5–10 min`, notes: 'Septic / hypovolemic. Repeat to 60 mL/kg max.' });
    doses.push({ drugName: 'Fluid bolus — cautious (cardiogenic)', dose: `${(5*wt).toFixed(0)}–${(10*wt).toFixed(0)} mL (5–10 mL/kg) over 15–30 min`, notes: 'Cardiogenic shock only.' });
    doses.push({ drugName: 'Dextrose 10% IV', dose: `${(2*wt).toFixed(0)} mL (2 mL/kg)`, notes: 'For glucose < 60 mg/dL.' });
    doses.push({ drugName: 'Adrenaline IM — anaphylaxis', dose: `${Math.min(0.01*wt, 0.5).toFixed(3)} mg IM (0.01 mg/kg, max 0.5 mg)`, notes: 'Outer thigh. First-line anaphylaxis.' });
    doses.push({ drugName: 'Adrenaline infusion — cold / cardiogenic shock', dose: '0.05–0.3 mcg/kg/min', notes: `Rule of 6: ${epiR6} mg in 100 mL NS → 1 mL/h = 0.1 mcg/kg/min` });
    doses.push({ drugName: 'Noradrenaline infusion — warm / distributive shock', dose: '0.05–0.5 mcg/kg/min', notes: `Rule of 6: ${epiR6} mg in 100 mL NS → 1 mL/h = 0.1 mcg/kg/min` });
    doses.push({ drugName: 'Hydrocortisone IV', dose: `${(2*wt).toFixed(0)} mg IV (2 mg/kg, max 100 mg)`, notes: 'Vasopressor-refractory shock or suspected adrenal insufficiency.' });
    doses.push({ drugName: 'PRBCs (haemorrhagic shock)', dose: `${(10*wt).toFixed(0)} mL (10–15 mL/kg)`, notes: 'Start early in haemorrhagic shock. MTP if ongoing.' });
    doses.push({ drugName: 'Ceftriaxone IV (septic shock)', dose: `${Math.min(100*wt, 2000).toFixed(0)} mg IV (100 mg/kg, max 2 g)`, notes: 'Within 60 min. Add Vancomycin if MRSA risk.' });

    return doses;
  },

  getReferences: () => [
    { title: 'AHA PALS Guidelines 2020', url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support' },
    { title: 'Surviving Sepsis Campaign Pediatric Guidelines 2020', url: 'https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international.1.aspx' },
    { title: 'Davis AL et al. — ACCM Clinical Practice Parameters for Paediatric Septic Shock 2017', url: 'https://doi.org/10.1097/CCM.0000000000002425' },
  ],
};
