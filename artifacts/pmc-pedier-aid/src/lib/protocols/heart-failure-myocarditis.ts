import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'viral_prodrome',  question: 'Recent viral illness in last 2–4 weeks? (fever, URI, GI symptoms)', redFlag: false, ifYes: 'Viral myocarditis most likely. Enterovirus / Parvovirus B19 commonest. Troponin + echo mandatory.' },
    { id: 'chd_known',       question: 'Known congenital heart disease?', redFlag: true, ifYes: 'Surgical/structural cause for HF must be excluded. Cardiology + echo before any intervention.' },
    { id: 'poor_feeding',    question: 'Poor feeding, sweating with feeds, or failure to thrive? (infant)', redFlag: false, ifYes: 'Classic signs of heart failure in infants — often missed. Urgent echo needed.' },
    { id: 'exercise_intol',  question: 'Exercise intolerance, easy fatigue, or orthopnoea? (older child)', ifYes: 'Suggests significant cardiac dysfunction — obtain BNP and echo.' },
    { id: 'syncope_exertion',question: 'Syncope or palpitations on exertion?', redFlag: true, ifYes: 'High risk for malignant arrhythmia in myocarditis. Activity restriction mandatory. Telemetry monitoring.' },
    { id: 'drugs_toxins',    question: 'Exposure to cardiotoxic agents? (chemotherapy, anthracyclines, cocaine, alcohol)', redFlag: true, ifYes: 'Drug-induced cardiomyopathy. Document agent and cumulative dose if oncology patient.' },
    { id: 'family_hx_cm',    question: 'Family history of cardiomyopathy or sudden cardiac death?', redFlag: true, ifYes: 'Genetic cardiomyopathy risk. Consider dilated cardiomyopathy workup. Genetics referral.' },
    { id: 'prior_hf_admit',  question: 'Previous hospital admission for heart failure?', ifYes: 'Chronic HF — assess for new decompensation vs stable baseline. Compare to prior echo.' },
    { id: 'nsaids_ibuprofen', question: 'Is the child taking NSAIDs or ibuprofen?', redFlag: false, ifYes: 'NSAIDs worsen myocarditis and HF. Stop immediately. Use paracetamol only for pain/fever.' },
  ],

  investigations: [
    { test: '12-lead EKG — STAT', category: 'urgent', indication: 'Look for: sinus tachycardia, low QRS voltages (< 5 mm all limb leads = pericardial effusion or diffuse myocardial oedema), ST changes, arrhythmias, heart block.', criticalValue: 'New arrhythmia + viral prodrome = fulminant myocarditis until proven otherwise.' },
    { test: 'SpO₂ + continuous cardiac monitoring', category: 'urgent', indication: 'SpO₂ < 94% = significant pulmonary oedema. Any new arrhythmia on monitor = escalate immediately.' },
    { test: 'Blood glucose (bedside)', category: 'urgent', indication: 'Hypoglycaemia common in decompensated HF in infants. Correct immediately if < 3.3 mmol/L.' },

    { test: 'Troponin I or T (high-sensitivity)', category: 'blood', indication: 'Elevated in myocarditis and ischaemic HF. Serial troponin (0 h and 3–6 h) to detect rise. Normal troponin does NOT rule out myocarditis.', criticalValue: 'Rising troponin trend = active myocardial necrosis. Escalate immediately.' },
    { test: 'BNP or NT-proBNP', category: 'blood', indication: 'Best biomarker of ventricular wall stress. Elevated in decompensated HF. Guides severity and monitors response to diuresis.', criticalValue: 'NT-proBNP > 10,000 pg/mL = severe cardiac dysfunction. PICU level care.' },
    { test: 'CRP, ESR, CK-MB', category: 'blood', indication: 'Inflammation markers for myocarditis. CK-MB more cardiac-specific than total CK. Elevated in active myocarditis.' },
    { test: 'U&E, creatinine, LFTs', category: 'blood', indication: 'Hepatic congestion (raised AST/ALT) and renal impairment are markers of systemic venous congestion. Monitor electrolytes closely during diuresis.' },
    { test: 'CBC', category: 'blood', indication: 'Anaemia can precipitate or worsen HF. Leucocytosis suggests active infection/myocarditis.' },
    { test: 'Viral serology / PCR (if acute myocarditis)', category: 'blood', indication: 'Enterovirus PCR, Parvovirus B19 IgM/IgG, CMV, EBV, Adenovirus. Not urgent for ER management, but important for diagnosis. Send NP swab + serology.' },

    { test: 'Chest X-ray', category: 'radiology', indication: 'Assess: cardiomegaly (CTR > 55% in child), pulmonary venous congestion (perihilar haziness), pleural effusions. Portable CXR if too ill to move.', criticalValue: 'Significant cardiomegaly + pulmonary oedema pattern = decompensated HF — aggressive management.' },
    { test: 'Echocardiogram — urgent bedside', category: 'radiology', indication: 'THE definitive investigation. Assess: ventricular function (EF), wall motion, pericardial effusion, structural abnormality. Should be done within 30–60 min of presentation for all suspected cases.', criticalValue: 'EF < 30% or pericardial effusion with tamponade physiology → immediate PICU + Cardiology.' },
  ],

  admissionCriteria: [
    'ALL new-onset heart failure or myocarditis — admit without exception',
    'Respiratory distress, SpO₂ < 94%, pulmonary oedema',
    'Haemodynamic instability (hypotension, poor perfusion, altered consciousness) → PICU',
    'Elevated troponin with clinical symptoms of myocarditis',
    'New arrhythmia on EKG or monitor in the setting of suspected myocarditis',
    'EF < 40% on echo, or any structural abnormality found',
    'Known CHD with clinical decompensation',
    'Infant with new-onset HF signs (poor feeding, hepatomegaly, tachycardia)',
  ],

  highRiskFactors: [
    'Fulminant presentation — rapid onset within days of viral illness with severe dysfunction',
    'Syncope on exertion — high arrhythmia risk',
    'Family history of dilated cardiomyopathy or sudden cardiac death',
    'Oncology patient with anthracycline exposure — cardiotoxicity threshold',
    'Prior episode of myocarditis — higher recurrence and chronic cardiomyopathy risk',
  ],

  dischargeCriteria: [
    'KNOWN CHRONIC HF PATIENTS ONLY — new HF/myocarditis is never discharged from ER',
    'Returned to clinical baseline (normal RR, normal HR for age, no rales, no hepatomegaly)',
    'Stable or improving BNP trend (not required to be normal, just improving)',
    'Stable weight — no evidence of acute fluid gain over last 24 h',
    'Tolerating all oral medications and adequate oral intake',
    'Electrolytes stable — no significant hypo/hyperkalaemia from diuretics',
    'Echo reviewed by Cardiology — function stable vs prior',
    'Cardiology team explicitly cleared discharge',
    'Follow-up within 48–72 h with Cardiology confirmed in writing',
    'Carer instructed: weight daily, return if weight gain > 1 kg/day, worsening breathing, or child more tired',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: your child becomes more breathless, develops a fast or irregular heartbeat, becomes pale or limp, stops feeding, or has significant weight gain (> 1 kg in a day).',
    'Weigh your child every morning before breakfast. Write it down. If weight goes up by more than 1 kg in one day, come to ER — do not wait.',
    'Do NOT give ibuprofen or any NSAID pain relievers while your child has myocarditis or heart failure. Use paracetamol only.',
    'Activity restriction: no sports, PE, or strenuous play until Cardiology review confirms it is safe. This is important — even mild myocarditis can cause sudden cardiac arrest with exertion.',
    'Give all heart medications at the same time every day. Do not stop them without Cardiology advice, even if your child feels better.',
    'Your follow-up appointment is important even if your child seems back to normal — heart function must be checked with an echo.',
  ],
};

export const heartFailureMyocarditisProtocol: DiseaseProtocol = {
  id: 'heart-failure-myocarditis',
  name: 'Heart Failure & Myocarditis',
  system: 'Cardiovascular System',
  description: 'Integrated ER evaluation of suspected paediatric heart failure and myocarditis — from compensated dysfunction to cardiogenic shock.',
  lastUpdated: '2024',
  image: {
    url: 'https://picsum.photos/seed/heart-failure-myocarditis/600/400',
    hint: 'cardiac failure',
  },
  erData,

  questions: [
    { id: 'weight',       questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'perfusion',    questionText: 'Perfusion & Haemodynamics', type: 'select', options: [
      { label: 'Normal — warm, brisk cap refill, normal BP',          value: 'normal',   score: 0 },
      { label: 'Mildly reduced — cool peripheries, cap refill 3–4 s', value: 'reduced',  score: 3 },
      { label: 'Shock — hypotension, altered consciousness, pallor',  value: 'shock',    score: 6 },
    ]},
    { id: 'resp',         questionText: 'Respiratory Status', type: 'select', options: [
      { label: 'Normal work of breathing, SpO₂ ≥ 95%',                value: 'normal',   score: 0 },
      { label: 'Mild tachypnoea, SpO₂ 91–94%',                        value: 'mild',     score: 2 },
      { label: 'Respiratory distress, rales, SpO₂ < 91%',             value: 'distress', score: 4 },
    ]},
    { id: 'viral',        questionText: 'Recent viral illness in last 2–4 weeks?', type: 'select', options: [
      { label: 'No viral prodrome',    value: 'no',  score: 0 },
      { label: 'Yes — fever / URI / GI illness', value: 'yes', score: 1 },
    ], info: 'Viral prodrome + cardiac findings = myocarditis until proven otherwise.' },
    { id: 'troponin',     questionText: 'Troponin result', type: 'select', options: [
      { label: 'Not yet sent / normal',  value: 'normal',   score: 0 },
      { label: 'Elevated',               value: 'elevated', score: 2 },
      { label: 'Markedly elevated / rising', value: 'high', score: 3 },
    ]},
    { id: 'hepatomegaly', questionText: 'Hepatomegaly on exam?', type: 'boolean',
      info: 'Liver edge > 2 cm below costal margin = systemic venous congestion = right HF.' },
    { id: 'arrhythmia',   questionText: 'New arrhythmia on EKG or monitor?', type: 'boolean',
      info: 'Any new arrhythmia in the context of suspected myocarditis = high risk. Escalate.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const perfusion   = data.perfusion as string;
    const resp        = data.resp as string;
    const troponin    = data.troponin as string;
    const arrhythmia  = data.arrhythmia === true;
    const details: string[] = [];

    if (perfusion === 'shock' || (resp === 'distress' && perfusion === 'reduced')) {
      details.push('CARDIOGENIC SHOCK / DECOMPENSATED HF — PICU + Cardiology immediately. Cautious fluids only.');
      if (arrhythmia) details.push('Arrhythmia present — high risk of arrest. Continuous telemetry mandatory.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'HF/Myocarditis Severity', totalScore: 9, maxScore: 10, interpretation: 'Decompensated — Cardiogenic Shock' },
        details,
      };
    }
    if (resp === 'distress' || perfusion === 'reduced' || troponin === 'elevated' || troponin === 'high' || arrhythmia) {
      if (troponin === 'elevated' || troponin === 'high') details.push('Elevated troponin — active myocardial injury. Echo urgently needed.');
      if (arrhythmia) details.push('New arrhythmia — activity restriction + telemetry monitoring.');
      if (resp === 'distress') details.push('Respiratory distress — pulmonary oedema possible.');
      details.unshift('MODERATE — admit for monitoring, echo, and IV therapy.');
      return {
        level: 'moderate',
        scoreDetails: { systemName: 'HF/Myocarditis Severity', totalScore: 5, maxScore: 10, interpretation: 'Compensated with signs' },
        details,
      };
    }
    return {
      level: 'mild',
      scoreDetails: { systemName: 'HF/Myocarditis Severity', totalScore: 1, maxScore: 10, interpretation: 'Stable — complete workup' },
      details: ['Haemodynamically stable. Complete investigations before disposition decision.'],
    };
  },

  getManagement: (severity, data) => {
    const viral      = data.viral as string;
    const troponin   = data.troponin as string;
    const arrhythmia = data.arrhythmia === true;
    const isMyo      = viral === 'yes' || troponin === 'elevated' || troponin === 'high';

    const STEP3 = {
      title: 'STEP 3 — ESCALATION: Worsening despite initial therapy',
      recommendations: [
        '1. PICU CALL — escalating respiratory distress, worsening perfusion, or new arrhythmia.',
        '2. VASOACTIVE SUPPORT: Milrinone 0.25–0.75 mcg/kg/min (inotropy + vasodilation, NO loading dose if hypotensive). Add Noradrenaline if systemic BP falls.',
        '3. VENTILATORY SUPPORT: High-flow nasal cannula → NIV (CPAP/BiPAP) → intubation if failing. Intubation in decompensated HF carries high risk — try NIV first.',
        '4. RESTRICT IV FLUIDS: HF is a fluid-overloaded state. Give 5 mL/kg ONLY if clear hypovolemia. No standard 20 mL/kg boluses.',
        '5. FUROSEMIDE IV: 1–2 mg/kg if pulmonary oedema and BP adequate. Monitor urine output hourly.',
        isMyo ? '6. MYOCARDITIS SPECIFIC: Stop NSAIDs immediately. Discuss IVIG with Cardiology. Steroids only with specialist direction.' : '',
        arrhythmia ? '7. ARRHYTHMIA: Do NOT give antiarrhythmics without Cardiology guidance — they can worsen function in HF.' : '',
      ].filter(Boolean) as string[],
    };

    const STEP4 = {
      title: 'STEP 4 — Life-threatening: Fulminant Myocarditis / Cardiogenic Arrest',
      recommendations: [
        'RECOGNISE: Sudden severe haemodynamic collapse, refractory shock, cardiogenic arrest.',
        'PICU + Cardiology + Anaesthesia at bedside immediately.',
        'MECHANICAL CIRCULATORY SUPPORT (ECMO/VAD): Consider early in fulminant myocarditis with refractory shock. Do not delay referral.',
        'PULSELESS ARREST: CPR + PALS algorithm. Adrenaline 0.01 mg/kg IV/IO every 3–5 min.',
        'CAUTIOUS FLUIDS EVEN IN ARREST: High filling pressures in myocarditis. Discuss with PICU before large volumes.',
        'Fulminant myocarditis can recover completely — aggressive support is justified if no contraindications.',
      ],
    };

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — Immediate: Decompensated HF / Cardiogenic Shock',
          recommendations: [
            'PICU + CARDIOLOGY notification now.',
            'Oxygen: target SpO₂ ≥ 94%. High-flow or NIV for respiratory distress — avoid intubation if possible.',
            '12-lead EKG + bedside echo within 15–30 min.',
            'IV access × 2 (or IO if no IV). Blood for troponin, BNP, electrolytes, LFTs, CBC, blood culture.',
            'FLUIDS: DO NOT give routine 20 mL/kg bolus. Give only 5–10 mL/kg cautiously if clear volume depletion AND echo shows empty ventricle.',
            'FUROSEMIDE IV 1 mg/kg if pulmonary oedema and MAP adequate.',
            'Stop any NSAIDs or ibuprofen immediately.',
            isMyo ? 'Myocarditis suspected — troponin trend + echo essential before vasoactive choice.' : '',
          ].filter(Boolean) as string[],
        },
        {
          title: 'STEP 2 — REASSESS at 30 min: perfusion, SpO₂, urine output',
          recommendations: [
            'IMPROVING: → continue current therapy, echo result guiding vasoactive choice.',
            'STATIC or WORSENING: → escalate to STEP 3.',
            'SpO₂ NOT improving on high-flow O₂: → NIV or intubation decision.',
            'No urine output after Furosemide: → renal involvement, discuss with PICU.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — Compensated HF / Myocarditis with signs',
          recommendations: [
            'Strict activity restriction and bed rest — no exertion.',
            '12-lead EKG + portable CXR + urgent echo.',
            'Blood tests: Troponin (serial), BNP, CBC, U&E, LFTs, CRP, viral serology.',
            'Cardiology consultation — all new-onset presentations.',
            arrhythmia ? 'NEW ARRHYTHMIA PRESENT — continuous telemetry. Do not give antiarrhythmics without Cardiology.' : 'Continuous cardiac monitoring.',
            isMyo ? 'Suspected MYOCARDITIS: stop NSAIDs, paracetamol only for fever/pain, activity restriction mandatory.' : 'HF workup: echo to assess function and exclude structural cause.',
            'Furosemide IV 1 mg/kg if signs of congestion (hepatomegaly, rales, oedema) and BP adequate.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 1–2 h with echo and initial results',
          recommendations: [
            'Echo EF ≥ 50%, troponin normal, no arrhythmia → carefully consider discharge only if NO new-onset (chronic known HF only).',
            'Echo EF < 40% OR elevated troponin OR any arrhythmia → ADMIT.',
            'Clinically improving on diuresis → continue IV Furosemide, monitor electrolytes.',
            'WORSENING → escalate to STEP 3.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    return [
      {
        title: 'STEP 1 — Stable: Complete workup before disposition',
        recommendations: [
          '12-lead EKG, CXR, bedside echo if available.',
          'Blood: Troponin, BNP, CBC, electrolytes, LFTs, CRP.',
          'Cardiology review of all results before any discharge decision.',
          'Strict activity restriction until diagnosis is confirmed or excluded.',
          isMyo ? 'Viral myocarditis suspected — activity restriction mandatory even if "stable".' : '',
        ].filter(Boolean) as string[],
      },
      {
        title: 'STEP 2 — REASSESS: Are investigations reassuring?',
        recommendations: [
          'ALL NORMAL (EKG, CXR, echo EF ≥ 55%, troponin normal, BNP normal) + mild/no symptoms → Cardiology may consider discharge with 48 h follow-up.',
          'ANY ABNORMAL RESULT → ADMIT.',
          '⚠ Do NOT discharge suspected myocarditis on the basis of stable vitals alone — echo is required.',
        ],
      },
      STEP3,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe')   return ['PICU admission — all decompensated HF and cardiogenic shock patients.'];
    if (severity.level === 'moderate') return ['Admit all new-onset and any with troponin elevation, arrhythmia, or reduced EF.'];
    return ['Stable known-chronic HF only may be discharged after Cardiology clearance + confirmed follow-up within 48 h.'];
  },

  getRedFlags: () => [
    'Cardiogenic shock — hypotension, cold extremities, poor perfusion',
    'SpO₂ < 91% or worsening respiratory distress',
    'New arrhythmia on EKG or monitor',
    'Rising troponin trend (serial measurements)',
    'Significant hepatomegaly in infant (right HF)',
    'Low EF (< 40%) or pericardial effusion on echo',
    'Fulminant onset after viral illness in previously well child',
    'Syncope on exertion in suspected myocarditis',
  ],

  getDrugDoses: (severity, data) => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const furosemide = Math.min(1 * wt, 40).toFixed(0);
    const milrinone  = '0.25–0.75';
    const ivig       = (2 * wt).toFixed(1);
    const epi        = (0.01 * wt).toFixed(2);
    const epiInf     = '0.05–0.3';

    doses.push({
      drugName: 'Furosemide (Frusemide) IV',
      dose: `${furosemide} mg IV (1 mg/kg, max 40 mg)`,
      notes: 'For pulmonary or systemic congestion only if BP adequate. Monitor urine output hourly.',
    });
    doses.push({
      drugName: 'Milrinone infusion — inotropy + afterload reduction',
      dose: `${milrinone} mcg/kg/min continuous infusion`,
      notes: 'No loading dose if hypotensive (risk of worsening hypotension). Preferred in low-output HF with elevated SVR (cold, clammy). Guided by PICU/Cardiology.',
    });
    doses.push({
      drugName: 'Adrenaline (Epinephrine) infusion — cardiogenic shock',
      dose: `${epiInf} mcg/kg/min continuous infusion`,
      notes: 'For fulminant myocarditis with cardiogenic shock. Start low. PICU setting only.',
    });
    doses.push({
      drugName: 'IVIG — myocarditis (Cardiology directed)',
      dose: `${ivig} g IV over 24 h (2 g/kg)`,
      notes: 'Only with Cardiology direction. Evidence for benefit in acute myocarditis — may reduce inflammation and support recovery.',
    });
    doses.push({
      drugName: 'Adrenaline (Epinephrine) IV/IO — cardiac arrest',
      dose: `${epi} mg IV/IO (0.01 mg/kg, max 1 mg) every 3–5 min`,
      notes: 'For cardiogenic arrest only. PALS algorithm.',
    });

    return doses;
  },

  getReferences: () => [
    { title: 'Kantor PF et al. — Diagnosis and management of myocarditis in children. Circulation 2022', url: 'https://doi.org/10.1161/CIRCULATIONAHA.122.059568' },
    { title: 'Kirk R et al. — ISHLT consensus statement on paediatric heart failure 2014', url: 'https://doi.org/10.1016/j.healun.2014.06.002' },
    { title: 'Loomba RS et al. — Paediatric cardiogenic shock. Pediatr Crit Care Med 2020', url: 'https://pubmed.ncbi.nlm.nih.gov/32195881/' },
  ],
};
