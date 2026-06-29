import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    {
      id: 'known_chd',
      question: 'Known or suspected congenital heart disease (CHD) or prior cardiac surgery?',
      redFlag: true,
      ifYes: 'CHD dramatically alters physiology. Unrepaired left-sided obstructive lesions (coarctation of the aorta, hypoplastic left ventricle) in a neonate → start prostaglandin E₁ (PGE₁) immediately and call cardiology. Do NOT give aggressive fluid boluses.',
    },
    {
      id: 'recent_viral_illness',
      question: 'Recent viral illness, chest pain, palpitations, or syncope in the past 2–4 weeks?',
      redFlag: true,
      ifYes: 'Myocarditis likely — viral myocarditis can present suddenly with cardiogenic shock even in a previously healthy child. Troponin and BNP/NT-proBNP urgently. Echocardiogram mandatory.',
    },
    {
      id: 'fluid_bolus_worsened',
      question: 'Did a previous fluid bolus worsen breathing or drop SpO₂?',
      redFlag: true,
      ifYes: 'Strongly suggests cardiogenic aetiology — additional fluid has worsened pulmonary oedema. STOP fluid boluses. Start diuretics (furosemide) and vasoactive support immediately.',
    },
    {
      id: 'toxic_ingestion',
      question: 'Possible ingestion of cardiac medications (beta-blockers, calcium channel blockers, digoxin, or antidepressants)?',
      redFlag: true,
      ifYes: 'Toxicological cardiogenic shock — specific antidotes may apply. Beta-blocker overdose: high-dose insulin (insulin euglycaemia therapy), calcium, glucagon. CCB overdose: IV calcium, high-dose insulin. Digoxin toxicity: digoxin-specific antibody fragments (DigiFab). Call Poison Control.',
    },
    {
      id: 'infant_failure_to_thrive',
      question: 'Poor feeding, diaphoresis with feeds, failure to thrive, or tachypnoea at rest (infant)?',
      redFlag: false,
      ifYes: 'Congestive heart failure (CHF) in infancy — consider undiagnosed CHD, cardiomyopathy, or inborn error of metabolism with cardiac involvement. Echocardiogram and metabolic screen.',
    },
    {
      id: 'arrhythmia_history',
      question: 'Witnessed palpitations, irregular pulse, or documented arrhythmia on ECG?',
      redFlag: true,
      ifYes: 'Arrhythmia-induced cardiogenic shock — 12-lead ECG urgently. SVT (supraventricular tachycardia), VT (ventricular tachycardia), or complete heart block all cause cardiogenic shock. Manage arrhythmia as primary intervention.',
    },
  ],

  investigations: [
    {
      test: 'Bedside glucose + ionised calcium',
      category: 'urgent',
      indication: 'Hypoglycaemia and hypocalcaemia both directly impair myocardial contractility. Correct before or simultaneously with vasoactive therapy.',
      criticalValue: 'Glucose < 60 mg/dL → 2 mL/kg of 10% dextrose IV. Ionised Ca²⁺ < 1.1 mmol/L → calcium gluconate 100 mg/kg IV over 10 min.',
    },
    {
      test: 'Continuous SpO₂ + cardiac monitor + BP every 5 min',
      category: 'urgent',
      indication: 'Falling SpO₂ in a shocked child = pulmonary oedema (cardiogenic) until proven otherwise. Arrythmia detection on monitor is critical.',
    },
    {
      test: '12-lead ECG',
      category: 'urgent',
      indication: 'First-line test. Identifies arrhythmia as cause (SVT, VT, complete heart block), myocarditis (ST changes, low voltage, LBBB [left bundle branch block]), or drug toxicity pattern (wide QRS, long QTc).',
      criticalValue: 'HR > 220/min in infant or > 180/min in child with narrow complex = SVT → adenosine. Wide complex tachycardia with shock = VT → synchronised cardioversion.',
    },
    {
      test: 'IV or IO access × 2 sites',
      category: 'urgent',
      indication: 'Peripheral IV acceptable initially. Central venous access facilitates continuous monitoring of CVP (central venous pressure) and ScvO₂ (central venous O₂ saturation) — insert when resuscitation underway.',
    },
    {
      test: 'Venous blood gas (VBG) + lactate + base deficit',
      category: 'urgent',
      indication: 'Lactate reflects cardiac output adequacy. ScvO₂ < 70% indicates excessive O₂ extraction from low CO (cardiac output). Persistent lactic acidosis despite treatment = inadequate cardiac output.',
      criticalValue: 'Lactate > 4 mmol/L = severe end-organ hypoperfusion. ScvO₂ < 50% = near-maximal extraction — inotropic support required urgently.',
    },
    {
      test: 'Troponin I + BNP or NT-proBNP',
      category: 'blood',
      indication: 'Elevated troponin = myocardial injury (myocarditis, ischaemia). Elevated BNP (brain natriuretic peptide) = ventricular dysfunction. Together they strongly confirm cardiogenic aetiology.',
      criticalValue: 'Very high troponin in a shocked child = fulminant myocarditis → PICU and cardiology urgently; ECMO may be needed.',
    },
    {
      test: 'CBC (complete blood count), electrolytes, creatinine, LFTs (liver function tests), TSH (thyroid-stimulating hormone), CRP (C-reactive protein)',
      category: 'blood',
      indication: 'Thyroid-stimulating hormone (TSH) for thyroid-induced cardiomyopathy. Electrolytes for potassium (arrhythmia risk with hypokalaemia and hyperkalaemia). LFTs for hepatic congestion from right heart failure.',
    },
    {
      test: 'Blood/urine toxicology screen',
      category: 'blood',
      indication: 'Order if poisoning is possible in any child with unexplained cardiogenic shock. Beta-blockers, CCBs, digoxin, and tricyclic antidepressants all cause myocardial depression.',
    },
    {
      test: 'CXR (chest x-ray) — portable',
      category: 'radiology',
      indication: 'Cardiomegaly (CTR [cardiothoracic ratio] > 0.55) is the hallmark of cardiogenic shock with adequate intravascular volume. Pulmonary vascular congestion = heart failure. Absent unilateral breath sounds = tension pneumothorax or obstructive cause.',
      criticalValue: 'Massive cardiomegaly on CXR in a shocked child = cardiogenic cause confirmed → small cautious fluid boluses only.',
    },
    {
      test: 'Bedside echocardiogram',
      category: 'radiology',
      indication: 'The single most important diagnostic test in suspected cardiogenic shock. Reveals: LV (left ventricular) function and EF (ejection fraction), pericardial effusion, CHD anatomy, IVC plethora vs collapse (volume status), right heart failure.',
      criticalValue: 'Poor LV function on echo = cardiogenic confirmed → start milrinone or dobutamine, call PICU/cardiology. Tamponade → pericardiocentesis.',
    },
  ],

  admissionCriteria: [
    'All children with cardiogenic shock require PICU admission — no exceptions',
    'New or worsening echocardiographic LV dysfunction — PICU with paediatric cardiology co-management',
    'Arrhythmia-induced cardiogenic shock — PICU after cardioversion or rate control',
    'Suspected myocarditis or cardiomyopathy — PICU; risk of sudden deterioration and cardiac arrest',
    'Toxic cardiogenic shock — PICU with toxicology guidance',
    'Ductal-dependent CHD in neonates — PGE₁ infusion and urgent transfer to cardiac centre',
  ],

  highRiskFactors: [
    'Troponin rapidly rising or BNP > 5000 pg/mL — fulminant myocarditis; ECMO risk',
    'LV ejection fraction < 20% on echocardiogram — severe dysfunction; mechanical support may be needed',
    'Lactate not clearing despite adequate vasoactive therapy — multi-organ failure risk',
    'Arrhythmia refractory to initial pharmacological or electrical therapy',
    'Neonatal age — CHD or inborn error of metabolism frequently masquerades as sepsis',
  ],

  dischargeCriteria: [
    'Discharge from cardiogenic shock is NOT appropriate from the ER — all patients must be admitted to PICU',
    'Discharge from PICU only after LV function stabilised on echocardiogram',
    'Off vasoactive medications with stable haemodynamics for ≥ 24 h',
    'Oral cardiac medications (diuretics, ACE inhibitors) commenced and tolerated',
    'Cardiology outpatient follow-up booked before discharge',
  ],

  safetyNetting: [
    'Return immediately if breathing becomes laboured, fast, or grunting.',
    'Return immediately if child becomes drowsy, confused, or cannot be roused.',
    'Return if child develops swollen legs, ankle oedema, or increasingly distended abdomen.',
    'Return if child cannot tolerate feeds, oral medications, or gains > 500 g/week unexpectedly (fluid retention).',
    'Any new syncope, palpitations, or fainting requires immediate ER assessment.',
  ],
};

export const palsCardiogenicShockProtocol: DiseaseProtocol = {
  id: 'pals-cardiogenic-shock',
  name: 'Cardiogenic Shock',
  unit: 'er',
  system: 'PALS',
  description: 'Reduced cardiac output from impaired myocardial contractility — the key distinction from other shock types is increased respiratory effort (retractions, grunting) from pulmonary oedema, and signs of venous congestion (hepatomegaly, gallop rhythm). CRITICAL rule: fluid boluses are small (5–10 mL/kg) and given slowly (over 10–20 min) — aggressive volume loading worsens pulmonary oedema. AHA PALS 2020 — Parts 9 & 10.',
  lastUpdated: 'June 2026',
  image: {
    url: 'https://picsum.photos/seed/pals-cardiogenic/600/400',
    hint: 'child cardiac echocardiogram heart failure',
  },
  erData,

  questions: [
    {
      id: 'weight',
      questionText: 'Patient Weight',
      type: 'number',
      unit: 'kg',
      placeholder: 'e.g. 10',
    },
    {
      id: 'resp_effort',
      questionText: 'Respiratory effort and pattern',
      type: 'select',
      info: 'KEY DISCRIMINATOR: Hypovolemic shock causes "quiet tachypnea" (fast breathing without effort). Cardiogenic shock causes tachypnea WITH increased effort from pulmonary oedema.',
      options: [
        { label: 'No distress — no tachypnoea, no increased effort', value: 'no_distress', score: 0 },
        { label: 'Quiet tachypnoea only — fast rate, no retractions (less typical for cardiogenic)', value: 'quiet_tachypnea', score: 1 },
        { label: 'Increased effort — retractions, nasal flaring, or grunting (typical of pulmonary oedema)', value: 'increased_effort', score: 3 },
      ],
    },
    {
      id: 'lung_sounds',
      questionText: 'Lung auscultation findings',
      type: 'select',
      options: [
        { label: 'Clear — normal breath sounds bilaterally', value: 'clear', score: 0 },
        { label: 'Crackles — bibasal crackles (pulmonary oedema)', value: 'crackles', score: 2 },
        { label: 'Grunting — grunting with every expiration (severe oedema)', value: 'grunting', score: 4 },
      ],
    },
    {
      id: 'cardiac_signs',
      questionText: 'Signs of congestive heart failure (CHF)',
      type: 'select',
      info: 'Hepatomegaly = liver edge > 2 cm below right costal margin. Gallop = S3 heard best at apex. JVD (jugular venous distension) may be difficult to assess in infants.',
      options: [
        { label: 'None — no cardiac signs', value: 'none', score: 0 },
        { label: 'Some — hepatomegaly, gallop, or murmur (1 sign)', value: 'some', score: 2 },
        { label: 'Multiple — ≥ 2 signs of heart failure (hepatomegaly + gallop, oedema)', value: 'multiple', score: 4 },
      ],
    },
    {
      id: 'bp_status',
      questionText: 'Blood pressure for age',
      type: 'select',
      info: 'Hypotension formula (1–10 years): SBP < 70 + (2 × age in years) mmHg. In cardiogenic shock, BP may be normal initially (compensated) — do not be reassured.',
      options: [
        { label: 'Normal BP — compensated (shock signs present but SBP normal)', value: 'compensated', score: 3 },
        { label: 'Hypotensive — SBP below 5th percentile for age', value: 'hypotensive', score: 5 },
        { label: 'BP unknown or not yet measured', value: 'unknown', score: 2 },
      ],
    },
    {
      id: 'fluid_response',
      questionText: 'Response to any prior fluid bolus given',
      type: 'select',
      options: [
        { label: 'No fluid given yet', value: 'not_given', score: 0 },
        { label: 'Improved with fluid bolus', value: 'improved', score: 0 },
        { label: 'Deteriorated after fluid — SpO₂ dropped or breathing worsened', value: 'deteriorated', score: 4 },
      ],
    },
    {
      id: 'avpu',
      questionText: 'Level of consciousness — AVPU scale',
      type: 'select',
      info: 'A = Alert. V = Responds to Voice only. P = Responds to Pain only. U = Unresponsive. In cardiogenic shock, altered consciousness from low cardiac output is an ominous late sign.',
      options: [
        { label: 'A — Alert, age-appropriate', value: 'A', score: 0 },
        { label: 'V — Responds to Voice only', value: 'V', score: 1 },
        { label: 'P — Responds to Pain only', value: 'P', score: 3 },
        { label: 'U — Unresponsive to all stimuli', value: 'U', score: 5 },
      ],
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const respEffort   = data.resp_effort as string;
    const lungSounds   = data.lung_sounds as string;
    const cardiacSigns = data.cardiac_signs as string;
    const bpStatus     = data.bp_status as string;
    const fluidResp    = data.fluid_response as string;
    const avpu         = data.avpu as string;
    const details: string[] = [];

    const respScore    = respEffort === 'increased_effort' ? 3 : respEffort === 'quiet_tachypnea' ? 1 : 0;
    const lungScore    = lungSounds === 'grunting' ? 4 : lungSounds === 'crackles' ? 2 : 0;
    const cardiacScore = cardiacSigns === 'multiple' ? 4 : cardiacSigns === 'some' ? 2 : 0;
    const bpScore      = bpStatus === 'hypotensive' ? 5 : bpStatus === 'compensated' ? 3 : bpStatus === 'unknown' ? 2 : 0;
    const fluidScore   = fluidResp === 'deteriorated' ? 4 : 0;
    const avpuScore    = avpu === 'U' ? 5 : avpu === 'P' ? 3 : avpu === 'V' ? 1 : 0;
    const totalScore   = respScore + lungScore + cardiacScore + bpScore + fluidScore + avpuScore;

    if (respEffort === 'increased_effort') {
      details.push('Respiratory effort INCREASED — retractions, nasal flaring, or grunting. This pattern distinguishes cardiogenic from hypovolaemic shock ("quiet tachypnoea").');
    } else if (respEffort === 'quiet_tachypnea') {
      details.push('Quiet tachypnoea present — less typical for cardiogenic shock but does not exclude it if other signs present.');
    }
    if (lungSounds === 'grunting') {
      details.push('GRUNTING on auscultation — severe pulmonary oedema. Stop any further fluid boluses immediately. Prepare NIV (non-invasive ventilation) or intubation.');
    } else if (lungSounds === 'crackles') {
      details.push('Bibasal crackles — pulmonary oedema from elevated left atrial pressure. Do NOT give further fluid boluses without echocardiography guidance.');
    }
    if (cardiacSigns === 'multiple') {
      details.push('Multiple heart failure signs — hepatomegaly + gallop or oedema. Advanced cardiogenic state.');
    } else if (cardiacSigns === 'some') {
      details.push('Heart failure sign(s) present — hepatomegaly, gallop, or murmur. Strongly supports cardiogenic aetiology.');
    }
    if (bpStatus === 'hypotensive') {
      details.push('Hypotensive — SBP below 5th percentile for age. Severe cardiogenic shock; inotropic support required urgently.');
    } else if (bpStatus === 'compensated') {
      details.push('BP normal with shock signs (compensated). High SVR (systemic vascular resistance) maintaining BP despite low CO (cardiac output). Vasodilators/inodilators preferred over fluids.');
    }
    if (fluidResp === 'deteriorated') {
      details.push('DETERIORATED with fluid bolus — breathing worsened or SpO₂ dropped. This is the most specific sign of cardiogenic shock. No further fluid boluses without expert guidance.');
    }
    if (avpu === 'U') details.push('AVPU = UNRESPONSIVE — severely impaired consciousness; brain hypoperfusion from critically low CO. Airway at immediate risk.');
    else if (avpu === 'P') details.push('AVPU = Responds to Pain only — markedly reduced consciousness; cerebral hypoperfusion.');
    else if (avpu === 'V') details.push('AVPU = Responds to Voice only — reduced alertness; early cerebral hypoperfusion.');

    let level: SeverityLevel;
    let interpretation: string;

    if (totalScore >= 13 || avpu === 'U' || (bpStatus === 'hypotensive' && lungSounds === 'grunting') || (fluidResp === 'deteriorated' && avpu === 'P')) {
      level = 'critical';
      interpretation = 'CRITICAL cardiogenic shock — impending cardiopulmonary failure';
      details.unshift('CRITICAL — Severe cardiac dysfunction with respiratory failure and/or impaired consciousness. PICU and cardiology consult NOW. Inotropic support immediately.');
    } else if (totalScore >= 8 || bpStatus === 'hypotensive') {
      level = 'severe';
      interpretation = 'SEVERE cardiogenic shock — hypotensive, inotropic support required';
      details.unshift('SEVERE — Hypotensive cardiogenic shock. Start milrinone or dobutamine after cautious fluid optimisation. Echocardiogram urgently. PICU admission.');
    } else if (totalScore >= 4 || bpStatus === 'compensated') {
      level = 'moderate';
      interpretation = 'COMPENSATED cardiogenic shock — normal BP with heart failure signs';
      details.unshift('COMPENSATED — Normal BP maintained by high SVR but CO is reduced. Vasodilators and/or inodilators preferred. Cautious fluid assessment. PICU admission required.');
    } else {
      level = 'unknown';
      interpretation = 'Complete the assessment above to classify cardiogenic shock severity';
    }

    return {
      level,
      details,
      scoreDetails: {
        systemName: 'Cardiogenic Shock Score (Resp + Lungs + Cardiac Signs + BP + Fluid Response + AVPU)',
        totalScore,
        maxScore: 25,
        interpretation,
        referenceTable: [
          { range: '0–3', meaning: 'Possible early or compensated — reassess, echocardiogram' },
          { range: '4–7', meaning: 'Compensated cardiogenic shock — vasodilators/inodilators, PICU' },
          { range: '8–12', meaning: 'Severe — hypotensive; inotropic support now, PICU' },
          { range: '≥ 13', meaning: 'Critical — impending cardiopulmonary failure; ECMO may be needed' },
        ],
      },
    };
  },

  getManagement: (severity, data) => {
    const bpStatus     = data.bp_status as string;
    const lungSounds   = data.lung_sounds as string;
    const isHypotensive = bpStatus === 'hypotensive';
    const hasPulmonaryEdema = lungSounds === 'crackles' || lungSounds === 'grunting';
    const fluidWorsened = (data.fluid_response as string) === 'deteriorated';
    const viralSuspect = data.recent_viral_illness === true;
    const knownChd     = data.known_chd === true;
    const wt           = Number(data.weight) || 0;
    const bolus5       = wt > 0 ? `${(5 * wt).toFixed(0)} mL` : '5 mL/kg';
    const bolus10      = wt > 0 ? `${(10 * wt).toFixed(0)} mL` : '10 mL/kg';

    const step1 = {
      title: 'STEP 1 — IMMEDIATE: O₂, monitoring, access + expert consultation NOW',
      recommendations: [
        'High-flow O₂ 15 L/min via non-rebreather mask (NRM). Cardiogenic shock frequently causes pulmonary oedema and hypoxaemia — O₂ supplementation is always first-line.',
        'Continuous SpO₂, cardiac monitor (ECG rhythm), and BP every 5 min.',
        'SIT UPRIGHT if conscious and haemodynamically stable — upright positioning reduces venous return and eases the work of breathing.',
        'IV or IO access. Central venous access preferred as soon as feasible — allows CVP monitoring and vasoactive infusions.',
        'Bedside glucose STAT — hypoglycaemia directly worsens myocardial contractility. Correct if < 60 mg/dL with 2 mL/kg of 10% dextrose IV.',
        'Call for SENIOR HELP and PICU (paediatric intensive care unit) immediately — cardiogenic shock can deteriorate within minutes and may require ECMO (extracorporeal membrane oxygenation). Do not delay this call.',
        'Differentiation from septic shock: hepatomegaly, gallop rhythm (S3 or S4), elevated JVP (jugular venous pressure), pulmonary crackles, and absence of fever all favour cardiogenic aetiology. History of fluid bolus worsening SpO₂ or breathing is the strongest clinical clue.',
        knownChd
          ? 'Known or suspected CHD in neonate: start PGE₁ (prostaglandin E₁) 0.05–0.1 mcg/kg/min IV immediately. Keep airway equipment at bedside — PGE₁ causes apnoea.'
          : viralSuspect
          ? '⚠ SUSPECTED MYOCARDITIS (recent viral illness): contact ECMO (extracorporeal membrane oxygenation) centre NOW — do not wait for clinical deterioration. Fulminant myocarditis can arrest without warning within minutes of ER presentation. Order 12-lead ECG, troponin I, and BNP/NT-proBNP (B-type natriuretic peptide) urgently. Keep resuscitation equipment and crash trolley immediately available.'
          : 'Order 12-lead ECG now — arrhythmia is both a cause and complication of cardiogenic shock.',
      ],
    };

    const step2 = {
      title: 'STEP 2 — CAUTIOUS FLUID + DIAGNOSTICS: Small bolus, reassess, echocardiogram',
      recommendations: [
        fluidWorsened
          ? `⚠ PRIOR FLUID BOLUS WORSENED breathing/SpO₂ — this is the most specific sign of cardiogenic aetiology. DO NOT give any further fluid bolus. Skip the fluid trial entirely. Proceed directly to diuresis with furosemide ${wt > 0 ? `${(1 * wt).toFixed(0)}–${(2 * wt).toFixed(0)} mg` : '1–2 mg/kg'} IV (only if not hypotensive) and vasoactive support in STEP 3.`
          : hasPulmonaryEdema
          ? `Pulmonary oedema present — DO NOT give fluid bolus. Diuresis with furosemide ${wt > 0 ? `${(1 * wt).toFixed(0)}–${(2 * wt).toFixed(0)} mg` : '1–2 mg/kg'} IV is appropriate if BP allows. Prepare for NIV (non-invasive ventilation) or intubation.`
          : `Cautious fluid trial ONLY if volume depletion is suspected (history of vomiting, poor intake): ${isHypotensive ? bolus5 : bolus10} of isotonic crystalloid over 10–20 minutes. NOT the standard 20 mL/kg rapid bolus used for hypovolaemic shock.`,
        'STOP FLUID immediately if: SpO₂ drops, crackles appear or worsen, hepatomegaly increases, or child deteriorates.',
        'Bedside echocardiogram URGENTLY — this is the most important diagnostic test. Assess LV (left ventricular) ejection fraction, pericardial effusion, IVC collapse vs plethora (volume status), and CHD anatomy.',
        'Order simultaneously: troponin I, BNP or NT-proBNP, 12-lead ECG, portable CXR, CBC, CMP, blood cultures.',
        '12-lead ECG: treat arrhythmia before starting vasoactive agents. SVT (supraventricular tachycardia) with shock → synchronised cardioversion 0.5–1 J/kg. VT (ventricular tachycardia) with shock → synchronised cardioversion 1–2 J/kg.',
      ],
    };

    const step3 = {
      title: 'STEP 3 — VASOACTIVE SUPPORT: Improve cardiac output + reduce O₂ demand',
      recommendations: [
        isHypotensive
          ? 'Hypotensive: start adrenaline (epinephrine) infusion 0.05–0.3 mcg/kg/min IV/IO immediately — increases contractility and maintains BP. Titrate to target SBP at or above 5th percentile for age.'
          : 'Normotensive: milrinone 0.25–0.75 mcg/kg/min IV infusion — preferred inodilator in most centres. Reduces SVR (systemic vascular resistance), improves LV ejection, and facilitates diastolic filling without increasing myocardial O₂ demand as much as catecholamines.',
        'Dobutamine 5–20 mcg/kg/min IV is an alternative inotrope if milrinone is unavailable or BP is inadequate for vasodilation.',
        'If normotensive and pulmonary oedema present: vasodilator (nitroglycerin 0.5–5 mcg/kg/min or nitroprusside 0.5–8 mcg/kg/min) reduces preload and afterload — only use if BP adequate and under senior supervision.',
        'Furosemide (frusemide) 1–2 mg/kg IV for pulmonary oedema — do NOT use if patient is hypotensive.',
        'Reduce O₂ demand: control fever with paracetamol 15 mg/kg IV/oral, pain with small titrated doses of morphine 0.05–0.1 mg/kg IV. CAUTION (PALS 2020): sedatives and analgesics reduce O₂ demand but ALSO reduce the compensatory stress response — use the smallest effective dose; monitor for vasodilation and respiratory depression.',
        'Correct ionised calcium < 1.1 mmol/L — calcium is critical for cardiac contractility. Give calcium gluconate 100 mg/kg IV over 10 min.',
        'Treat underlying cause: antiarrhythmic for arrhythmia, antidote for drug toxicity, steroids for adrenal insufficiency, specific therapy for metabolic disorder.',
      ],
    };

    const step4 = {
      title: 'STEP 4 — FAILURE: Mechanical ventilation + mechanical circulatory support (ECMO/VAD)',
      recommendations: [
        'RESPIRATORY FAILURE: if SpO₂ < 90% despite high-flow O₂, or grunting with severe distress — try NIV (CPAP 5–8 cmH₂O or BiPAP) first to avoid intubation if haemodynamically stable.',
        'Intubation: prepare for endotracheal intubation if NIV fails or AVPU ≤ V. CAUTION: induction agents (ketamine, propofol, midazolam) all cause vasodilation and can precipitate cardiovascular collapse. Run epinephrine infusion BEFORE induction. Use lowest effective dose. Ketamine is generally preferred in haemodynamically compromised children.',
        'With advanced airway: ventilate at 10–12 breaths/min, FiO₂ to keep SpO₂ 94–99%, PEEP (positive end-expiratory pressure) 4–6 cmH₂O. High PEEP reduces preload and afterload — beneficial in cardiogenic pulmonary oedema.',
        'REFRACTORY CARDIOGENIC SHOCK: if vasopressors and inotropes fail to restore haemodynamics or lactate continues to rise — consider ECMO (extracorporeal membrane oxygenation) or VAD (ventricular assist device). This requires immediate transfer to a tertiary cardiac centre.',
        'ECMO is specifically indicated for acute fulminant myocarditis, post-cardiac surgery failure, and high-risk arrhythmia-induced shock. Initiate ECMO discussion with cardiac centre EARLY — do not wait until the patient is peri-arrest.',
        'Post-resuscitation: target ScvO₂ (central venous oxygen saturation) > 70%, lactate clearance, MAP (mean arterial pressure) at or above 5th percentile for age, and urine output ≥ 1 mL/kg/h.',
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
        'PICU admission IMMEDIATELY — do not wait for echocardiogram results before calling PICU.',
        'Tertiary cardiac centre transfer if ECMO expertise unavailable locally — organise retrieval team now.',
      ];
    }
    if (severity.level === 'severe') {
      return [
        'PICU admission — vasoactive infusion required; continuous haemodynamic monitoring mandatory.',
        'Paediatric cardiology consultation on arrival to PICU.',
        'Do NOT discharge from ER — any patient with hypotensive cardiogenic shock requires PICU.',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'PICU or cardiac HDU (High-Dependency Unit) — even compensated cardiogenic shock carries high risk of sudden decompensation.',
        'Formal echocardiogram and cardiology review within hours of admission.',
        'No patient with cardiogenic shock should be discharged from the ER.',
      ];
    }
    return [
      'If cardiogenic shock is suspected but severity is unclear — admit for monitoring and echocardiogram.',
      'Do not discharge without formal cardiology review and normal echocardiogram.',
    ];
  },

  getRedFlags: (_severity: Severity, _data: FormData) => [
    'Deterioration after fluid bolus — SpO₂ drops or breathing worsens: stop fluids, start diuresis',
    'Grunting with every breath — severe pulmonary oedema; prepare for NIV or intubation',
    'HR > 220/min in infant or > 180/min in child — SVT until proven otherwise; cardiovert if shocked',
    'Hepatomegaly + gallop rhythm + respiratory distress — diagnostic triad of cardiogenic shock',
    'Very high troponin in a previously well child — fulminant myocarditis; ECMO may be needed',
    'Neonate presenting with shock and no response to fluids — ductal-dependent CHD; start PGE₁',
    'Wide complex tachycardia with shock — VT; synchronised cardioversion 1–2 J/kg immediately',
    'AVPU P or U in a child with shock — impending cardiac arrest; call PICU and activate arrest team',
  ],

  getDrugDoses: (_severity: Severity, data: FormData): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for all dose calculations.' });
      return doses;
    }

    const bolus5      = (5 * wt).toFixed(0);
    const bolus10     = (10 * wt).toFixed(0);
    const dextrose10  = (2 * wt).toFixed(0);
    const furo1       = (1 * wt).toFixed(0);
    const furo2       = (2 * wt).toFixed(0);
    const calcGluc    = (100 * wt).toFixed(0);
    const paracetamol = Math.min(15 * wt, 1000).toFixed(0);
    const epiR6       = (0.6 * wt).toFixed(1);

    doses.push({
      drugName: 'Isotonic crystalloid — CAUTIOUS bolus only',
      dose: `${bolus5}–${bolus10} mL (5–10 mL/kg) over 10–20 minutes`,
      notes: 'DO NOT give 20 mL/kg rapid bolus as in hypovolaemic shock — this worsens pulmonary oedema. Stop immediately if SpO₂ drops or crackles appear.',
    });
    doses.push({
      drugName: 'Milrinone (phosphodiesterase inhibitor — inodilator)',
      dose: '0.25–0.75 mcg/kg/min IV continuous infusion',
      notes: 'Preferred first-line agent for normotensive cardiogenic shock in most centres. Reduces SVR, improves contractility, and facilitates diastolic relaxation. Central line strongly preferred.',
    });
    doses.push({
      drugName: 'Dobutamine (inotrope)',
      dose: '5–20 mcg/kg/min IV continuous infusion',
      notes: 'Alternative to milrinone. Rule of 6: prepare (6 × weight) mg in 100 mL → 1 mL/h = 1 mcg/kg/min. Increases contractility; causes mild vasodilation.',
    });
    doses.push({
      drugName: 'Adrenaline (epinephrine) infusion — hypotensive cardiogenic shock',
      dose: '0.05–0.3 mcg/kg/min IV/IO continuous infusion',
      notes: `Rule of 6: ${epiR6} mg in 100 mL 0.9% NaCl → 1 mL/h = 0.1 mcg/kg/min. First choice when hypotensive — maintains BP while increasing contractility.`,
    });
    doses.push({
      drugName: 'Furosemide (frusemide) — pulmonary oedema',
      dose: `${furo1}–${furo2} mg (1–2 mg/kg) IV over 10 minutes`,
      notes: 'Only if BP is adequate (not hypotensive). Rapid diuresis reduces preload and pulmonary venous congestion. Monitor potassium — hypokalaemia increases arrhythmia risk.',
    });
    doses.push({
      drugName: 'Calcium gluconate 10% — hypocalcaemia',
      dose: `${calcGluc} mg (100 mg/kg; max 3 g) IV over 10 minutes`,
      notes: 'Ionised calcium is essential for cardiac contractility. Check ionised Ca²⁺ and correct if < 1.1 mmol/L. Also give empirically during rapid PRBC transfusion.',
    });
    doses.push({
      drugName: 'Dextrose 10% IV — hypoglycaemia',
      dose: `${dextrose10} mL (2 mL/kg) IV over 5 minutes`,
      notes: 'Glucose < 60 mg/dL impairs myocardial function. Recheck 15 min after correction. Start maintenance glucose infusion.',
    });
    doses.push({
      drugName: 'PGE₁ (prostaglandin E₁) — ductal-dependent CHD',
      dose: '0.05–0.1 mcg/kg/min IV, titrate to response',
      notes: 'Life-saving in neonatal ductal-dependent lesions (coarctation, hypoplastic left ventricle). Major side effect: apnoea — have airway equipment at bedside. Arrange urgent cardiac centre transfer.',
    });
    doses.push({
      drugName: 'Paracetamol (paediatric) — fever reduction (reduces O₂ demand)',
      dose: `${paracetamol} mg IV/oral (15 mg/kg; max 1 g) every 6 h`,
      notes: 'Fever substantially increases myocardial O₂ demand in cardiogenic shock. Antipyresis is a critical adjunct to vasoactive therapy.',
    });
    doses.push({
      drugName: 'Cardioversion — SVT or VT with shock',
      dose: 'SVT: synchronised 0.5–1 J/kg → 1–2 J/kg. VT: synchronised 1–2 J/kg → 2 J/kg',
      notes: 'Sedate with ketamine 1–2 mg/kg IV before elective cardioversion if haemodynamically stable. Pulseless VF/VT = defibrillation (unsynchronised) at 2–4 J/kg.',
    });

    return doses;
  },

  getReferences: () => [
    {
      title: 'AHA PALS Provider Manual 2020 — Part 9: Recognizing Shock; Part 10: Managing Shock (Cardiogenic)',
      url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support',
    },
    {
      title: 'Topjian AA et al. — 2020 AHA Guidelines for CPR and ECC: Paediatric BLS and ALS, Circulation 2020',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901',
    },
    {
      title: 'Kirk R et al. — ISHLT consensus statement on paediatric heart failure, J Heart Lung Transplant 2014',
      url: 'https://doi.org/10.1016/j.healun.2014.06.002',
    },
  ],
};
