import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'prematurity',    question: 'Premature birth (< 35 weeks gestation)?', redFlag: true,  ifYes: 'Higher risk for apnea, respiratory failure, and prolonged illness. Lower admission threshold. Corrected age < 12 weeks = very high risk.' },
    { id: 'chd',            question: 'Known congenital heart disease (CHD) or haemodynamically significant murmur?', redFlag: true, ifYes: 'CHD + bronchiolitis = high risk for rapid deterioration. Cardiology input, early PICU discussion.' },
    { id: 'cld',            question: 'Chronic lung disease (BPD, recurrent wheeze, home O₂)?', redFlag: true, ifYes: 'Reserve respiratory capacity is reduced. O₂ threshold and admission criteria apply earlier.' },
    { id: 'immunocomp',     question: 'Immunocompromised (chemotherapy, steroids, primary immunodeficiency)?', redFlag: true, ifYes: 'Consider viral + atypical + bacterial coinfection. Discuss with infectious diseases.' },
    { id: 'apnea_home',     question: 'Witnessed apnea or prolonged pauses in breathing at home?', redFlag: true, ifYes: 'Apnea = absolute admission criterion regardless of clinical score.' },
    { id: 'poor_feed',      question: 'Feeding below 50% of normal intake?', ifYes: 'Unable to maintain hydration orally. Consider NG or IV fluids. Document wet nappies (fewer than 4 in 24 h = dehydrated).' },
    { id: 'first_episode',  question: 'First episode of wheeze in this child?', ifYes: 'Bronchiolitis is the likely diagnosis in infants < 12 months. In older children, consider viral-induced asthma — trial bronchodilator and document response.' },
    { id: 'smoker_home',    question: 'Household smoker or significant smoke / allergen exposure?', ifYes: 'Environmental risk factor; advise smoking cessation and air quality improvement.' },
    { id: 'prior_icu',      question: 'Previous PICU admission for bronchiolitis or respiratory illness?', ifYes: 'High-risk feature — lower threshold for PICU review and early escalation this episode.' },
    { id: 'age_young',      question: 'Corrected age under 6 weeks?', redFlag: true, ifYes: 'Neonates and very young infants tolerate respiratory work poorly and decompensate rapidly with minimal warning.' },
  ],

  investigations: [
    { test: 'Continuous SpO₂ monitoring', category: 'urgent', indication: 'Mandatory for all admitted patients. Spot checks only for mild ER assessment.', criticalValue: 'Persistent SpO₂ < 92% on room air at rest or feeding = admission criterion.' },
    { test: 'Bedside blood glucose', category: 'urgent', indication: 'If infant is not feeding, lethargic, or looks unwell. Hypoglycaemia complicates prolonged poor intake.' },

    { test: 'Nasopharyngeal aspirate (NPA) — viral PCR panel', category: 'blood', indication: 'Admitted patients only — for infection control cohorting (RSV vs influenza vs SARS-CoV-2). Does NOT change ER management.', criticalValue: 'Influenza positive → add oseltamivir in high-risk infants (CHD, CLD, immunocompromised).' },
    { test: 'Blood gas (VBG)', category: 'blood', indication: 'Only if severe (Tal ≥ 11) or clinical deterioration. Elevated PaCO₂ (> 50 mmHg) or pH < 7.30 = respiratory failure.', criticalValue: 'Rising CO₂ with tiring infant = impending failure → escalate to HFNC/CPAP/intubation.' },
    { test: 'FBC + CRP + blood culture', category: 'blood', indication: 'Not routine. Consider only if suspected bacterial coinfection (fever > 39°C persisting > 3 days, lobar consolidation on CXR, septic appearance).' },

    { test: 'Chest X-ray (CXR)', category: 'radiology', indication: 'NOT routine for straightforward bronchiolitis — CXR frequently shows hyperinflation and patchy atelectasis that can mislead into unnecessary antibiotics. Order ONLY if: first episode unclear diagnosis, suspected complication (pneumothorax, effusion), or failure to improve at 48–72 h.' },
  ],

  admissionCriteria: [
    'SpO₂ < 92% on room air (at rest or feeding) — persisting after nasal suctioning',
    'Witnessed apnea or significant bradycardia episode',
    'Modified Tal Score ≥ 11 (severe)',
    'Feeding < 50% of normal intake with signs of dehydration',
    'Respiratory rate consistently > 70 breaths/min — aspiration risk, unable to feed',
    'Significant chest wall retractions with exhaustion or grunting',
    'Corrected age < 6 weeks regardless of score',
    'Any high-risk comorbidity with Tal ≥ 6 (moderate)',
  ],

  highRiskFactors: [
    'Prematurity (< 35 weeks) or corrected age < 12 weeks',
    'Congenital heart disease (haemodynamically significant)',
    'Chronic lung disease / BPD / home oxygen',
    'Immunocompromised state',
    'Previous PICU admission for respiratory illness',
    'Unreliable carer or home too far from hospital',
  ],

  dischargeCriteria: [
    'SpO₂ ≥ 92% in room air — sustained at rest AND feeding for ≥ 4 hours',
    'No witnessed apnea during observation period',
    'Feeding at least 50–75% of normal intake',
    'Modified Tal Score ≤ 5 (mild) and improving trend',
    'Respiratory rate < 60 breaths/min',
    'Caregiver confident with nasal suction technique and return plan',
    'No high-risk factors, OR high-risk factor present but senior sign-off obtained',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: child turns blue around the lips, stops breathing or has a long pause in breathing, breathing becomes much harder or faster, child is very difficult to wake up.',
    'Return within 4–8 hours if: child is not feeding (fewer than 3 wet nappies in 24 h), breathing seems more laboured, O₂ monitor reading falls below 92%.',
    'Nasal suctioning before every feed and before sleep — clears secretions, reduces work of breathing.',
    'DO NOT use saline nose drops in infants — use a soft suction bulb only.',
    'There is no medication to shorten bronchiolitis. Antibiotics, bronchodilators, and steroids do NOT help for most infants with bronchiolitis.',
    'Bronchiolitis usually peaks at days 3–5 and then gradually improves over 2–3 weeks. A residual cough for 4 weeks is normal.',
    'Follow up with your GP in 48 hours. If any high-risk features were identified, a hospital follow-up will be arranged before discharge.',
  ],
};

export const bronchiolitisProtocol: DiseaseProtocol = {
  id: 'bronchiolitis',
  name: 'Bronchiolitis',
  system: 'Respiratory System',
  description: 'Assessment and management of viral bronchiolitis in infants using the Modified Tal Score, with evidence-based supportive care escalation.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/bronchiolitis/600/400', hint: 'lungs xray' },
  erData,

  questions: [
    { id: 'weight',          questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'respiratoryRate', questionText: 'Respiratory Rate', type: 'select', options: [
      { label: '≤ 30',    value: '0', score: 0 },
      { label: '31 – 45', value: '1', score: 1 },
      { label: '46 – 60', value: '2', score: 2 },
      { label: '> 60',    value: '3', score: 3 },
    ]},
    { id: 'wheezing',        questionText: 'Wheezing', type: 'select', options: [
      { label: 'None',                                          value: '0', score: 0 },
      { label: 'Terminal expiratory (stethoscope only)',        value: '1', score: 1 },
      { label: 'Entire expiration (stethoscope only)',          value: '2', score: 2 },
      { label: 'Inspiratory + expiratory (audible without stethoscope)', value: '3', score: 3 },
    ]},
    { id: 'cyanosis',        questionText: 'Cyanosis', type: 'select', options: [
      { label: 'None',                    value: '0', score: 0 },
      { label: 'Perioral when crying',    value: '1', score: 1 },
      { label: 'Perioral at rest',        value: '2', score: 2 },
      { label: 'Generalised at rest',     value: '3', score: 3 },
    ]},
    { id: 'retractions',     questionText: 'Retractions (accessory muscles)', type: 'select', options: [
      { label: 'None',                                  value: '0', score: 0 },
      { label: 'Intercostal only (mild)',               value: '1', score: 1 },
      { label: 'Intercostal + subcostal (moderate)',    value: '2', score: 2 },
      { label: 'Generalised + nasal flaring (severe)',  value: '3', score: 3 },
    ]},
    { id: 'apnea',           questionText: 'History of apnea?', type: 'boolean' },
    { id: 'feedingAdequacy', questionText: 'Feeding intake', type: 'select', options: [
      { label: 'Normal (> 75%)',       value: 'normal',  score: 0 },
      { label: 'Reduced (50 – 75%)',   value: 'reduced', score: 1 },
      { label: 'Poor (< 50%)',         value: 'poor',    score: 2 },
    ]},
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    const s1 = Number(data.respiratoryRate || 0);
    const s2 = Number(data.wheezing || 0);
    const s3 = Number(data.cyanosis || 0);
    const s4 = Number(data.retractions || 0);
    const totalScore = s1 + s2 + s3 + s4;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild Bronchiolitis';

    if (data.apnea === true) {
      details.push('APNEA PRESENT — absolute admission criterion regardless of score.');
      level = 'severe';
      interpretation = 'Apnea — Admit Immediately';
    } else if (totalScore >= 11) {
      level = 'severe';
      interpretation = 'Severe Bronchiolitis';
    } else if (totalScore >= 6) {
      level = 'moderate';
      interpretation = 'Moderate Bronchiolitis';
    }

    if (s1 === 3) details.push('RR > 60 — NPO, IV fluids required (aspiration risk).');
    if (s3 >= 2) details.push('Cyanosis at rest — oxygen immediately, prepare for escalation.');
    if (data.feedingAdequacy === 'poor') details.push('Poor feeding — assess hydration, consider NG or IV fluids.');

    return {
      level,
      scoreDetails: {
        systemName: 'Modified Tal Score',
        totalScore,
        maxScore: 12,
        interpretation,
        referenceTable: [
          { range: '0 – 5',   meaning: 'Mild Bronchiolitis' },
          { range: '6 – 10',  meaning: 'Moderate Bronchiolitis' },
          { range: '11 – 12', meaning: 'Severe Bronchiolitis' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const isHighRisk = data.prematurity || data.chd || data.cld || data.immunocomp || data.prior_icu;

    const STEP3 = {
      title: 'STEP 3 — ESCALATION: Not improving on standard supportive care',
      recommendations: [
        '1. PICU / senior review NOW.',
        '2. HIGH-FLOW NASAL CANNULA (HFNC): start at 1 L/kg/min, O₂ titrated to SpO₂ ≥ 94%. Maximum 2 L/kg/min (max 25 L/min). If no improvement in 1–2 h → escalate.',
        '3. Nebulised 3% hypertonic saline 4 mL q4–6h — INPATIENT ONLY after ward/PICU admission. Evidence does NOT support use in the ER/ED (SALINE trial NEJM 2018; Cochrane 2023 — no reduction in admission rates). Stop if bronchospasm occurs.',
        '4. IV or NG fluid maintenance if RR > 60 (NPO) or oral intake < 50%.',
        '5. VBG if tiring, CO₂ rising, or SpO₂ not responding — PaCO₂ > 50 mmHg = respiratory failure.',
        '6. Do NOT use: adrenaline (epinephrine) nebulisation, oral/IV steroids, antibiotics, or chest physiotherapy routinely.',
      ],
    };

    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Respiratory failure / Exhaustion',
      recommendations: [
        'Recognition: rising CO₂ on VBG, increasing retractions, grunting, poor colour despite HFNC, apnea recurrences, altered mental status.',
        'CALL PICU + ANAESTHESIA NOW.',
        'CPAP 6–8 cmH₂O as bridge (if available and tolerated).',
        'INTUBATION: RSI with ketamine (1–2 mg/kg IV) + rocuronium (1 mg/kg IV). Use smallest ETT with acceptable leak — airway oedema is present.',
        'Ventilator settings: rate 30–40 (infant), PEEP 5–6, tidal volume 5–7 mL/kg. Expiratory time adequate to avoid breath stacking.',
        'Post-intubation: frequent suction for secretions (thick + profuse).',
      ],
    };

    if (severity.level === 'severe' || data.apnea === true) {
      return [
        {
          title: 'STEP 1 — Immediate: Severe Bronchiolitis',
          recommendations: [
            'Nasal suction (bulb or soft catheter) to clear upper airway — do BEFORE every assessment and feed.',
            'Oxygen via nasal cannula or mask — titrate to SpO₂ ≥ 92%.',
            'Keep NPO (RR > 60 = aspiration risk). IV access + maintenance fluids.',
            'Continuous SpO₂ + cardiorespiratory monitoring.',
            'Nurse in semi-upright position (30°).',
            'PICU referral for all severe / apnea cases.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 1–2 hours',
          recommendations: [
            'Reassess Modified Tal Score. SpO₂ trending up and Tal improving → maintain current therapy.',
            'No improvement or worsening → proceed to STEP 3.',
            'Apnea or SpO₂ < 88% despite 2 L/kg HFNC → STEP 4 immediately.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — Moderate Bronchiolitis: Supportive care',
          recommendations: [
            'Nasal suction before assessment and feeds.',
            'Oxygen if SpO₂ < 92% — low-flow nasal cannula 0.5–1 L/min.',
            'Trial oral feeding; if RR > 60 or intake < 50% → NG feeds or IV fluids.',
            'Continuous SpO₂ monitoring throughout ER stay.',
            'SALBUTAMOL TRIAL (selected patients only): offer ONE dose (0.15 mg/kg neb) if age ≥ 6 months AND family history of asthma/atopy, OR prior documented wheeze episode. Reassess Tal score + RR objectively at 30–60 min. If no measurable improvement → STOP, do not repeat. Document response clearly.',
            isHighRisk ? 'HIGH-RISK PATIENT: contact PICU early even at this severity level.' : '',
          ].filter(Boolean),
        },
        {
          title: 'STEP 2 — REASSESS Modified Tal Score at 2–4 hours',
          recommendations: [
            'Tal ≤ 5 + SpO₂ ≥ 92% + feeding ≥ 50% → eligible for discharge (see Dispose tab).',
            'Salbutamol responder (documented Tal/RR improvement) → may continue q4–6h as bronchodilator therapy.',
            'Tal unchanged or worsening → admit to ward + STEP 3.',
            'Any apnea episode during observation → immediate PICU referral.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    // Mild
    return [
      {
        title: 'STEP 1 — Mild Bronchiolitis: Supportive care + education',
        recommendations: [
          'Nasal suction and position — teach the family technique before discharge.',
          'Oxygen NOT indicated if SpO₂ ≥ 92% at rest and feeding.',
          'Encourage frequent small feeds. No medication needed.',
          'Observe in ER for 1–2 hours if any concern about trajectory.',
          'Discharge if SpO₂ stable, feeding adequate, family confident.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'SpO₂ ≥ 92% room air sustained during and after feeding.',
          'Feeding acceptable (≥ 75%).',
          'No worsening of respiratory signs during observation.',
          'Any concern → admit for extended observation.',
        ],
      },
      STEP3,
      STEP4,
    ];
  },

  getDisposition: (severity, data) => {
    if (data.apnea === true) return ['ADMIT — PICU/HDU. Apnea is an absolute admission criterion.'];
    if (severity.level === 'severe') return ['ADMIT — PICU/HDU. Severe Modified Tal Score.'];
    if (severity.level === 'moderate') return ['Admit to paediatric ward. Reassess at 2–4 h before considering discharge.'];
    return ['Discharge home with safety netting. GP follow-up in 48 hours.'];
  },

  getRedFlags: () => [
    'Apnea or prolonged pause in breathing',
    'Cyanosis at rest',
    'Generalised retractions + nasal flaring (Tal 3)',
    'SpO₂ < 90% despite nasal suctioning',
    'Exhaustion — reduced respiratory effort, quiet chest',
    'Grunting',
    'RR > 70 breaths/min',
    'Feeding < 50% with dehydration signs',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const salb = (0.15 * wt).toFixed(2);
    const hfncFlow = Math.min((1 * wt), 25).toFixed(0);
    const hfncMax  = Math.min((2 * wt), 25).toFixed(0);

    doses.push({ drugName: 'Nasal saline 0.9% (isotonic)', dose: '2–3 drops each nostril before suction and feeds', notes: 'Safe in all ages. DO NOT use hypertonic saline drops — nebulised only.' });
    doses.push({ drugName: 'Nebulised 3% hypertonic saline', dose: '4 mL via nebuliser q4–6h', notes: 'INPATIENT ONLY — start after ward/PICU admission. Evidence does NOT support ER use (SALINE trial, NEJM 2018; Cochrane 2023 — no reduction in ED admission rates). Inpatient benefit: modest reduction in length of stay. Stop if bronchospasm occurs.' });
    doses.push({ drugName: 'High-Flow Nasal Cannula (HFNC)', dose: `Start ${hfncFlow} L/min (1 L/kg/min), max ${hfncMax} L/min (2 L/kg/min)`, notes: 'Titrate FiO₂ to SpO₂ 92–95%. Escalate to CPAP if no improvement after 1–2 h.' });
    doses.push({ drugName: 'Salbutamol neb — TRIAL (selected patients only)', dose: `${salb} mg (0.15 mg/kg) via nebuliser`, notes: 'Only if age ≥ 6 months AND (family history of asthma/atopy OR prior wheeze). Give ONE dose, reassess Tal score + RR at 30–60 min. Continue only if objective improvement documented. STOP if no measurable benefit — do not repeat.' });
    doses.push({ drugName: 'Maintenance IV fluids (if NPO or poor intake)', dose: `${(wt <= 10 ? 100 * wt : wt <= 20 ? 1000 + 50 * (wt - 10) : 1500 + 20 * (wt - 20)).toFixed(0)} mL/day (Holliday-Segar)`, notes: '0.9% NaCl + 5% dextrose. Restrict to 80% maintenance if SIADH risk (viral illness).' });

    return doses;
  },

  getReferences: () => [
    { title: 'AAP Clinical Practice Guideline: Bronchiolitis (2014, affirmed 2021)', url: 'https://publications.aap.org/pediatrics/article/134/2/e547/32906/' },
    { title: 'NICE NG9 — Bronchiolitis in children: diagnosis and management 2021', url: 'https://www.nice.org.uk/guidance/ng9' },
    { title: 'Tal A et al. — Modified Tal Score validation. Pediatr Pulmonol 1983', url: 'https://doi.org/10.1002/ppul.1950030208' },
    { title: 'Florin TA et al. — Nebulised hypertonic saline for bronchiolitis (SALINE trial). NEJM 2018', url: 'https://doi.org/10.1056/NEJMoa1807070' },
    { title: 'Cochrane Review — Hypertonic saline for acute bronchiolitis (2023 update)', url: 'https://doi.org/10.1002/14651858.CD006458.pub4' },
  ],
};
