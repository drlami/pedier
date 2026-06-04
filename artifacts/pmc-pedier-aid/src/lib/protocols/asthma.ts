import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'sudden_onset', question: 'Sudden onset over minutes (rather than gradual over hours/days)?', redFlag: true, ifYes: 'Reconsider the diagnosis — anaphylaxis, foreign body aspiration, or inhaled irritant. Especially if first episode.' },
    { id: 'first',       question: 'First episode ever (no prior asthma diagnosis)?', ifYes: 'Broaden differential — consider FBA, vascular ring, vocal cord dysfunction' },
    { id: 'icu',         question: 'Previous ICU admission or intubation for asthma?', redFlag: true, ifYes: 'HIGH RISK — lower threshold for admission, senior review, early PICU notification' },
    { id: 'saba',        question: 'Using reliever inhaler (SABA) > 2× per week at baseline?', redFlag: true, ifYes: 'Poorly controlled asthma — escalate controller therapy at follow-up' },
    { id: 'oral_steroid',question: 'Oral steroids taken in the last 2 weeks?', redFlag: true, ifYes: 'Steroid-dependent / brittle asthma — high risk; IV steroids may be needed' },
    { id: 'home_neb',    question: 'Using nebuliser at home before arriving?', ifYes: 'Suboptimal prior response — likely moderate-severe; escalate treatment' },
    { id: 'controller',  question: 'On inhaled corticosteroid (ICS) controller therapy?', ifYes: 'ICS non-compliance or inadequate dose — review at follow-up' },
    { id: 'trigger',     question: 'Clear trigger identified? (viral URTI, allergen, exercise, smoke)', ifYes: 'Document trigger — guides avoidance counselling at discharge' },
    { id: 'nsaid',       question: 'NSAID or aspirin use in the last 48 hours?', redFlag: true, ifYes: 'NSAID-exacerbated respiratory disease — avoid NSAIDs; use paracetamol only' },
    { id: 'food',        question: 'Onset after food ingestion? Urticaria, angioedema, or vomiting?', redFlag: true, ifYes: 'Consider anaphylaxis — administer epinephrine if criteria met' },
    { id: 'family',      question: 'Family history of asthma, eczema, or hay fever (atopy)?', ifYes: 'Atopic background supports asthma diagnosis' },
    { id: 'smoke',       question: 'Second-hand smoke exposure at home?', ifYes: 'Smoking cessation counselling for household — document for social referral' },
  ],

  investigations: [
    { test: 'Pulse oximetry — continuous SpO₂ monitoring', category: 'urgent', indication: 'Mandatory in all acute asthma. SpO₂ < 92% = severe' },
    { test: 'Peak Expiratory Flow (PEF) — if age ≥ 5 years', category: 'urgent', indication: '< 50% predicted = severe; < 33% = life-threatening', criticalValue: '< 33% predicted = immediate escalation' },
    { test: 'Blood glucose (bedside)', category: 'urgent', indication: 'If prolonged symptoms, very young, or altered consciousness' },
    { test: 'Capillary / arterial blood gas', category: 'blood', indication: 'If SpO₂ < 90%, impending respiratory failure, or not improving after 3 nebulisers', criticalValue: 'Normal or rising PaCO₂ in a tachypnoeic child = respiratory fatigue → intubation risk' },
    { test: 'Electrolytes (Na, K, Mg)', category: 'blood', indication: 'If IV salbutamol or magnesium sulfate planned. Salbutamol → hypokalaemia', criticalValue: 'K⁺ < 3.0 mmol/L → supplement before IV salbutamol' },
    { test: 'FBC', category: 'blood', indication: 'Only if fever present (exclude pneumonia / bacterial trigger). NOT routine for asthma' },
    { test: 'CXR', category: 'radiology', indication: 'NOT routine. Order only if: first episode, fever with focal signs, suspected pneumothorax (asymmetric, sudden deterioration), or not responding to treatment', criticalValue: 'Pneumothorax = emergency — needle decompression' },
  ],

  admissionCriteria: [
    'PRAM ≥ 8 (severe) after 3 nebulisers — regardless of any other factor',
    'PRAM 4–7 (moderate) not improving after 3 nebulisers (1 hour of treatment)',
    'SpO₂ < 92% in room air persisting after 3 nebulisers',
    'Life-threatening features at any point: silent chest, cyanosis, altered consciousness, exhaustion',
    'Persistent O₂ requirement (SpO₂ < 94% in room air) after full treatment course',
    'Unable to maintain oral intake or swallow oral medications',
  ],

  highRiskFactors: [
    'Previous ICU admission or intubation for asthma — lower threshold for admission even if currently well; discharge ONLY if PRAM ≤ 3, SpO₂ ≥ 95%, and urgent 24-h follow-up guaranteed',
    'Oral steroids taken in last 2 weeks (steroid-dependent asthma) — consider admission if PRAM ≥ 4 after treatment; if PRAM ≤ 3, ensure step-up of controller therapy at follow-up',
    'Reliever inhaler use > 3 times per week at home (poorly controlled) — safe to discharge if fully responded, but requires urgent review and controller step-up',
    'Age < 2 years with significant wheeze — broader differential (bronchiolitis, FBA); seek senior review before discharging a young child with first or atypical wheeze',
    'First episode of wheeze without prior asthma diagnosis — ensure full response and correct diagnosis before discharge; PRAM ≤ 3 alone is not sufficient if diagnosis unclear',
    'Social concern — unreliable follow-up, no reliable carer, inability to recognise deterioration — involve social work; lower discharge threshold',
  ],

  dischargeCriteria: [
    'PRAM ≤ 3 sustained for ≥ 60 min after last nebuliser',
    'SpO₂ ≥ 94% in room air sustained for ≥ 30 min without supplemental O₂',
    'Significantly improved air entry bilaterally — no silent areas, no severe wheeze at rest (mild residual wheeze on auscultation is acceptable)',
    'Respiratory rate significantly improved toward age-appropriate range — no significant chest wall recession at rest',
    'Able to walk or perform age-appropriate activity without undue breathlessness (for ambulatory children)',
    'Tolerating oral intake and able to swallow oral medications',
    'Spacer technique observed and confirmed adequate by nurse or physician',
    'Oral prednisolone prescribed — first dose given in ER before discharge',
    'If high-risk features present (prior ICU, steroid dependency) — senior review has confirmed safe to discharge after full response',
    'Reliable carer present with clear written asthma action plan and documented return-to-ER instructions',
    'Follow-up arranged: within 24 h if any high-risk feature present; within 48 h for standard exacerbation',
  ],

  safetyNetting: [
    'Return to ER immediately if: breathing difficulty worsening, lips or fingernails turning blue, unable to speak in sentences, not improving after 4 puffs of reliever, or RR > 40/min.',
    'Use reliever inhaler (2–4 puffs via spacer) every 4 hours for first 24 hours, then as needed.',
    'Complete the full course of oral prednisolone — do not stop early even if feeling better.',
    'Avoid known triggers: cigarette smoke, known allergens, NSAIDs/aspirin.',
    'See GP or paediatric clinic within 24–48 hours for reassessment.',
    'If using reliever more than once daily after discharge — return to ER or seek review same day.',
  ],
};

export const asthmaProtocol: DiseaseProtocol = {
  id: 'asthma',
  name: 'Asthma Exacerbation',
  system: 'Respiratory System',
  description: 'Assessment and management of acute asthma exacerbations in children using the PRAM score.',
   image: {
    url: "https://picsum.photos/seed/asthma/600/400",
    hint: "inhaler"
  },
  erData,
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { 
      id: 'suprasternalRetractions', 
      questionText: 'Suprasternal Retractions', 
      type: 'select', 
      options: [
        {label: 'Absent', value: '0', score: 0}, 
        {label: 'Present', value: '2', score: 2}
      ] 
    },
    { 
      id: 'scaleneMuscleContraction', 
      questionText: 'Scalene Muscle Contraction', 
      type: 'select', 
      options: [
        {label: 'Absent', value: '0', score: 0}, 
        {label: 'Present', value: '2', score: 2}
      ] 
    },
    { 
      id: 'airEntry', 
      questionText: 'Air Entry', 
      type: 'select', 
      options: [
        {label: 'Normal', value: '0', score: 0}, 
        {label: 'Decreased at bases', value: '1', score: 1},
        {label: 'Widespread decrease', value: '2', score: 2},
        {label: 'Absent/Minimal', value: '3', score: 3}
      ] 
    },
    { 
      id: 'wheeze', 
      questionText: 'Wheezing', 
      type: 'select', 
      options: [
        {label: 'Absent', value: '0', score: 0}, 
        {label: 'Expiratory only', value: '1', score: 1},
        {label: 'Inspiratory and expiratory', value: '2', score: 2},
        {label: 'Audible without stethoscope / Silent chest', value: '3', score: 3}
      ] 
    },
    { 
      id: 'oxygenSaturation', 
      questionText: 'Oxygen Saturation (Room Air)', 
      type: 'select', 
      options: [
        {label: '≥ 95%', value: '0', score: 0}, 
        {label: '92% - 94%', value: '1', score: 1},
        {label: '< 92%', value: '2', score: 2}
      ] 
    },
    { id: 'highRiskHistory', questionText: 'High-risk asthma history?', type: 'boolean', info: 'Previous ICU/intubation, recent admission, frequent SABA use.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    const s1 = Number(data.suprasternalRetractions || 0);
    const s2 = Number(data.scaleneMuscleContraction || 0);
    const s3 = Number(data.airEntry || 0);
    const s4 = Number(data.wheeze || 0);
    const s5 = Number(data.oxygenSaturation || 0);
    
    const totalPram = s1 + s2 + s3 + s4 + s5;
    
    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Exacerbation';
    
    if (totalPram >= 8) {
      level = 'severe';
      interpretation = 'Severe Exacerbation';
      details.push("High risk of respiratory failure. Intensify therapy.");
    } else if (totalPram >= 4) {
      level = 'moderate';
      interpretation = 'Moderate Exacerbation';
    } else {
      level = 'mild';
      interpretation = 'Mild Exacerbation';
    }

    if (data.wheeze === '3' && data.airEntry === '3') {
        details.push("CRITICAL: Silent chest identified. Impending respiratory failure.");
        level = 'impending respiratory failure';
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "PRAM Score",
        totalScore: totalPram,
        maxScore: 12,
        interpretation,
        referenceTable: [
          { range: "0 - 3", meaning: "Mild Exacerbation" },
          { range: "4 - 7", meaning: "Moderate Exacerbation" },
          { range: "8 - 12", meaning: "Severe Exacerbation" }
        ]
      },
      details 
    };
  },
  getManagement: (severity) => {
    // ── Shared escalation ladder — the critical "what next" when first-line fails ──
    const STEP2_REASSESS = {
      title: 'STEP 2 — Reassess PRAM 15–20 min after the 3rd dose (≈ 1 hour)',
      recommendations: [
        'IMPROVED → PRAM now ≤ 3 and SpO₂ ≥ 94%: step DOWN. Space salbutamol to 1–4 hourly, observe 1–4 h, then plan discharge.',
        'PARTIAL / NO improvement → PRAM still 4–7: move to STEP 3 escalation. Do NOT just keep repeating the same nebulisers indefinitely.',
        'WORSE or any severe feature (PRAM ≥ 8, SpO₂ < 92%, silent chest, exhaustion): go straight to STEP 3 + STEP 4 and CALL FOR HELP now.',
      ],
    };

    const STEP3_ESCALATION = {
      title: 'STEP 3 — ESCALATION (PRAM still ≥ 4 after first hour, OR severe at any point)',
      recommendations: [
        '1. CALL SENIOR / PICU NOW — refractory asthma is not managed alone.',
        '2. IV MAGNESIUM SULFATE 50 mg/kg (max 2 g) over 20 min — single dose. Monitor BP (may cause hypotension).',
        '3. CONTINUOUS nebulised salbutamol (back-to-back) + ipratropium already given (max 3 doses — do not continue beyond 3).',
        '4. Ensure SYSTEMIC STEROID given. If vomiting / not tolerating oral → IV methylprednisolone 1 mg/kg q6h OR IV hydrocortisone 4 mg/kg q6h.',
        '5. Get a BLOOD GAS (venous or capillary). ⚠ A NORMAL or RISING PaCO₂ in a tired, tachypnoeic child = IMPENDING RESPIRATORY FAILURE → STEP 4.',
        '6. STILL not improving → IV BRONCHODILATOR (senior / PICU decision, continuous cardiac + K⁺ monitoring):',
        '   • IV Salbutamol: 5 mcg/kg bolus over 10 min, then 1–5 mcg/kg/min infusion, OR',
        '   • IV Aminophylline: 5 mg/kg loading over 20 min (OMIT load if already on theophylline), then 1 mg/kg/h infusion.',
      ],
    };

    const STEP4_FAILURE = {
      title: 'STEP 4 — Life-threatening / Impending respiratory failure',
      recommendations: [
        'RECOGNISE: silent chest, cyanosis, poor respiratory effort, exhaustion, drowsiness/confusion, SpO₂ < 92% on high-flow O₂, or rising PaCO₂.',
        'SENIOR + PICU + ANAESTHETICS at the bedside NOW. Do not wait.',
        'Continue maximal therapy: continuous salbutamol + IV magnesium + IV salbutamol/aminophylline + IV steroids + high-flow O₂.',
        'Consider NIV (CPAP/BiPAP) in experienced hands as a bridge to buy time.',
        'INTUBATION is HIGH RISK and a LAST RESORT — most experienced operator. KETAMINE is induction agent of choice (bronchodilator).',
        'Post-intubation: low rate, LONG expiratory time, permissive hypercapnia. If sudden deterioration → DISCONNECT circuit + compress chest (release breath-stacking / dynamic hyperinflation); exclude pneumothorax.',
      ],
    };

    switch (severity.level) {
      case 'impending respiratory failure':
        return [
          {
            title: 'STEP 1 — Immediate (Life-threatening)',
            recommendations: [
              'High-flow OXYGEN to keep SpO₂ ≥ 94%.',
              'CONTINUOUS nebulised salbutamol + ipratropium (max 3 ipratropium doses).',
              'IV/IM systemic steroid immediately (do not rely on oral).',
              'Give IV MAGNESIUM SULFATE 50 mg/kg (max 2 g) over 20 min without delay.',
              'CALL SENIOR + PICU + ANAESTHETICS now.',
            ],
          },
          STEP4_FAILURE,
          STEP3_ESCALATION,
        ];
      case 'severe':
        return [
          {
            title: 'STEP 1 — Immediate first-line (Severe, PRAM 8–12)',
            recommendations: [
              'OXYGEN to maintain SpO₂ ≥ 94%.',
              'SALBUTAMOL nebulised — back-to-back / continuous (do not wait 20 min between doses in severe).',
              'IPRATROPIUM nebulised with each of the first 3 salbutamol doses (max 3 doses total).',
              'SYSTEMIC STEROID early — oral prednisolone 2 mg/kg, or IV if vomiting / unable to swallow.',
              'Strongly consider IV MAGNESIUM SULFATE 50 mg/kg (max 2 g) over 20 min up front.',
            ],
          },
          STEP2_REASSESS,
          STEP3_ESCALATION,
          STEP4_FAILURE,
        ];
      case 'moderate':
        return [
          {
            title: 'STEP 1 — Immediate first-line (Moderate, PRAM 4–7)',
            recommendations: [
              'SALBUTAMOL — 6 puffs (<20 kg) or 10–12 puffs (≥20 kg) via spacer, OR nebulised, every 20 min × 3 doses ("burst" therapy).',
              'IPRATROPIUM with each of the 3 doses (max 3 doses total).',
              'ORAL PREDNISOLONE 1–2 mg/kg (max 60 mg) — give early, within the first hour.',
              'OXYGEN only if SpO₂ < 94%.',
            ],
          },
          STEP2_REASSESS,
          STEP3_ESCALATION,
          STEP4_FAILURE,
        ];
      case 'mild':
        return [
          {
            title: 'STEP 1 — First-line (Mild, PRAM 0–3)',
            recommendations: [
              'SALBUTAMOL 2–6 puffs via spacer, repeat every 20 min as needed up to 3 doses.',
              'Consider oral prednisolone 1–2 mg/kg if not fully responding or high-risk history.',
              'Observe and re-score PRAM after treatment.',
            ],
          },
          {
            title: 'STEP 2 — Reassess after treatment',
            recommendations: [
              'PRAM remains ≤ 3 and SpO₂ ≥ 94% → suitable for DISCHARGE with action plan (see Dispose tab).',
              'PRAM rises to ≥ 4 → treat as MODERATE: start burst therapy + steroid, and follow the escalation ladder below.',
            ],
          },
          STEP3_ESCALATION,
        ];
      default:
        return [{ title: 'Awaiting Assessment', recommendations: ['Complete PRAM scoring (Assess tab) to determine management.'] }];
    }
  },
  getDisposition: (severity) => {
    if(severity.level === 'impending respiratory failure' || severity.level === 'severe'){
        return ["Admit for ongoing bronchodilator therapy and monitoring. PICU/HDU is required for impending respiratory failure."];
    }
    if(severity.level === 'moderate'){
        return ["Admit to hospital if poor response to initial therapy, persistent hypoxia, or high-risk history.", "Consider discharge ONLY if significant improvement and PRAM ≤ 3."];
    }
    return ["Discharge home with clear action plan if PRAM remains ≤ 3 after treatment.", "Ensure patient has spacer technique review and understands return precautions."];
  },
  getRedFlags: () => [
    "Silent chest",
    "Drowsiness or confusion (altered mental status)",
    "PRAM Score ≥ 8",
    "Persistent O2 saturation < 92% despite therapy",
    "Poor respiratory effort or fatigue"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const w = weight;

    // Salbutamol: weight-based neb dose (< 20 kg: 2.5 mg; ≥ 20 kg: 5 mg) or MDI puffs
    const salbutamolNebMg = w > 0 ? (w < 20 ? 2.5 : 5) : null;
    const salbutamolMDIPuffs = w > 0 ? (w < 20 ? '6 puffs' : '10–12 puffs') : null;

    // Ipratropium: < 20 kg → 250 mcg; ≥ 20 kg → 500 mcg (max 3 doses)
    const ipraMcg = w > 0 ? (w < 20 ? 250 : 500) : null;

    // Prednisolone: 1–2 mg/kg, max 40 mg (< 5y) or 60 mg (≥ 5y). Use 2 mg/kg max 60 mg.
    const predMg = w > 0 ? Math.min(2 * w, 60) : null;

    // Magnesium sulfate: 50 mg/kg over 20 min, max 2000 mg
    const magMg = w > 0 ? Math.min(50 * w, 2000) : null;

    // IV Salbutamol (severe): 5 mcg/kg loading over 15 min, then 1–5 mcg/kg/min
    const ivSalboLoad = w > 0 ? (5 * w).toFixed(0) : null;

    const doses = [
      {
        drugName: 'Salbutamol — Nebulised',
        dose: salbutamolNebMg
          ? `${salbutamolNebMg} mg q20 min × 3 doses (${salbutamolMDIPuffs} via spacer if MDI available)`
          : '2.5 mg (< 20 kg) or 5 mg (≥ 20 kg) q20 min × 3',
        notes: 'Spacer + MDI preferred for mild-moderate. Nebuliser for severe. Continuous nebulisation for life-threatening.',
      },
      {
        drugName: 'Ipratropium Bromide — Nebulised',
        dose: ipraMcg
          ? `${ipraMcg} mcg q20 min × 3 doses only (no benefit beyond 3 doses)`
          : '250 mcg (< 20 kg) or 500 mcg (≥ 20 kg) q20 min × 3',
        notes: 'Add to salbutamol for moderate-severe. Maximum 3 doses — no additional benefit thereafter.',
      },
      {
        drugName: 'Prednisolone — Oral',
        dose: predMg
          ? `${predMg.toFixed(0)} mg PO (2 mg/kg, max 60 mg) — single dose or once daily × 3–5 days`
          : '2 mg/kg PO, max 60 mg',
        notes: 'Give IV methylprednisolone (1 mg/kg q6h, max 60 mg/day) if vomiting or severe. First dose in ER.',
      },
    ];

    if (severity.level === 'severe' || severity.level === 'impending respiratory failure') {
      doses.push({
        drugName: 'Magnesium Sulfate — IV',
        dose: magMg
          ? `${magMg.toFixed(0)} mg (50 mg/kg, max 2 g) IV over 20 min`
          : '50 mg/kg (max 2 g) IV over 20 min',
        notes: 'For severe (PRAM ≥ 8) or life-threatening. Give once. Monitor BP during infusion.',
      });
      doses.push({
        drugName: 'Salbutamol — IV (if nebulised failing)',
        dose: ivSalboLoad
          ? `Loading: ${ivSalboLoad} mcg (5 mcg/kg) IV over 15 min, then 1–5 mcg/kg/min infusion`
          : '5 mcg/kg loading IV over 15 min, then 1–5 mcg/kg/min',
        notes: 'Senior/PICU decision. Monitor HR, K⁺ (hypokalaemia), blood glucose. Continuous ECG.',
      });
    }
    return doses;
  },

  getReferences: () => [
    { title: 'Chalut DS et al. PRAM Score validation. Pediatrics 2000', url: 'https://pubmed.ncbi.nlm.nih.gov/18413344/' },
    { title: 'GINA 2024 Pocket Guide for Asthma Management and Prevention', url: 'https://ginasthma.org/' },
    { title: 'BTS/SIGN British Guideline on Management of Asthma (2023)', url: 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/asthma/' },
    { title: 'Kneyber MCJ et al. Magnesium for acute asthma in children. Cochrane 2023', url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003898.pub4/full' },
    { title: 'PALS 2020 — AHA/AAP Pediatric Advanced Life Support', url: 'https://www.heart.org/en/cpr/resuscitation-science/pals-pediatric-advanced-life-support' },
  ],
};
