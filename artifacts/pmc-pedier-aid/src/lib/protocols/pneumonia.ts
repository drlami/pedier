import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'immunocomp',     question: 'Immunocompromised (oncology, steroids, transplant, HIV)?', redFlag: true,  ifYes: 'Atypical organisms likely (PCP, fungal, viral). Broad cover, ID consult. Do NOT delay treatment.' },
    { id: 'tb_contact',     question: 'Known TB contact, travel to endemic area, or BCG never given?', redFlag: true,  ifYes: 'Consider TB pneumonia. Sputum AFB, CXR, and paediatric ID / TB clinic referral before empirical antibiotics if stable.' },
    { id: 'failed_abx',     question: 'Failed 48 hours of appropriate outpatient antibiotics?', redFlag: true,  ifYes: 'Resistant organism, complication (empyema, abscess), or incorrect initial diagnosis. Admit for IV antibiotics + CXR.' },
    { id: 'neonate_young',  question: 'Age < 3 months?', redFlag: true,  ifYes: 'Cover Streptococcus agalactiae, Listeria, and Gram-negatives. Ampicillin + Gentamicin or Cefotaxime. Consider viruses (RSV, CMV). Admit all.' },
    { id: 'aspiration',     question: 'Risk factor for aspiration (neurological impairment, swallowing disorder, GORD)?', ifYes: 'Aspiration pneumonia — cover anaerobic organisms (Amoxicillin-Clavulanate or Pip-Tazo). Post-treatment swallow assessment.' },
    { id: 'underlying_lung',question: 'Underlying lung disease (CF, bronchiectasis, recurrent pneumonia)?', ifYes: 'Discuss with respiratory specialist. Sputum cultures essential. Broader antibiotic cover.' },
    { id: 'complication',   question: 'Clinical concern for complication (pleural pain, dullness, no improvement at 48 h)?', ifYes: 'Parapneumonic effusion or empyema — USS chest first. Surgical/respiratory consult.' },
    { id: 'prior_hosp',     question: 'Hospitalisation or healthcare exposure in last 3 months?', ifYes: 'Higher risk of resistant organisms. Consider Staph aureus (MRSA) cover if no response to standard therapy.' },
    { id: 'viral_prodrome', question: 'Recent influenza or varicella — current or in last 2 weeks?', ifYes: 'Secondary bacterial pneumonia (post-viral). Staphylococcus aureus including PVL-producing strains — high mortality. Add Clindamycin if suspected.' },
    { id: 'chd_chestwall',  question: 'Known CHD or significant chest wall deformity?', ifYes: 'Reduced respiratory reserve. Lower threshold for admission and O₂ supplementation.' },
  ],

  investigations: [
    { test: 'Pulse oximetry (continuous or spot)', category: 'urgent', indication: 'Every child with respiratory symptoms. Spot check in mild cases; continuous monitoring for admitted patients.', criticalValue: 'SpO₂ < 92% = absolute admission criterion.' },
    { test: 'Bedside blood glucose', category: 'urgent', indication: 'If infant < 3 months, lethargic, or not feeding.' },

    { test: 'Chest X-ray (CXR)', category: 'radiology', indication: 'NOT routine for mild uncomplicated CAP. Indicated for: first episode, moderate or severe disease, diagnostic uncertainty, failure to improve on antibiotics, suspected complication.', criticalValue: 'Lobar / segmental consolidation → bacterial CAP. Round pneumonia in young child → Streptococcus pneumoniae. Large effusion → empyema. Pneumatocele → Staphylococcus aureus / PVL strains.' },
    { test: 'Chest USS', category: 'radiology', indication: 'Preferred over CT for parapneumonic effusion assessment — quantifies fluid, guides drainage decision. No radiation.', criticalValue: 'Complex (septated / echogenic) effusion → empyema — consult respiratory/surgery for drainage.' },

    { test: 'Blood culture (2 sets)', category: 'blood', indication: 'Moderate–severe CAP requiring admission. Must be taken BEFORE first dose of antibiotics.', criticalValue: 'Positive blood culture changes duration, route, and sometimes agent of antibiotic therapy.' },
    { test: 'FBC + CRP + procalcitonin', category: 'blood', indication: 'Admitted patients. WBC and CRP do not reliably distinguish bacterial from viral. Procalcitonin > 0.5 ng/mL supports bacterial aetiology.', criticalValue: 'WBC > 20,000 or < 4,000 = severe sepsis → urgent treatment.' },
    { test: 'NPA / throat swab — viral PCR', category: 'blood', indication: 'Consider for admitted patients (RSV, influenza, SARS-CoV-2, Mycoplasma) — informs antibiotic duration and infection control.', criticalValue: 'Influenza positive in high-risk child → oseltamivir within 48 h of symptoms.' },
    { test: 'Urine pneumococcal antigen', category: 'blood', indication: 'Consider in severe or complicated CAP — fast result, does not replace blood culture.' },
  ],

  admissionCriteria: [
    'SpO₂ < 92% on room air',
    'RR > 70/min (infant) or > 50/min (child) persisting after assessment',
    'Toxic appearance, altered mental status, or poor perfusion',
    'Moderate–severe chest wall indrawing or grunting',
    'Inability to maintain oral intake or tolerate oral antibiotics',
    'Failed 48 hours of appropriate outpatient antibiotics',
    'Suspected complication (empyema, abscess, pneumatocele)',
    'Age < 3 months',
    'Significant comorbidity (immunocompromised, CHD, CLD, neurological impairment)',
  ],

  highRiskFactors: [
    'Immunocompromised state',
    'Age < 3 months',
    'Known CHD or chronic lung disease',
    'Prior hospitalisation for pneumonia',
    'Aspiration risk (neurological impairment)',
    'No oral intake or dehydrated',
    'Unreliable follow-up or remote location',
  ],

  dischargeCriteria: [
    'SpO₂ ≥ 94% on room air, sustained',
    'Temperature < 38.5°C or clearly trending down',
    'RR within normal range for age at rest',
    'Tolerating oral fluids and antibiotics',
    'Reliable caregiver — written instructions given',
    'Clear 24–48 h follow-up plan (GP or paediatric clinic)',
    'First dose of antibiotics given in ER',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: child\'s breathing becomes very fast or very hard, lips or fingertips turn blue, child becomes very drowsy or very difficult to wake up.',
    'Return within 24 hours if: fever is not improving, child stops drinking, breathing is not getting better despite 24 hours of antibiotics.',
    'COMPLETE THE FULL ANTIBIOTIC COURSE — stopping early allows the infection to come back, often worse. Standard course is 5 days for uncomplicated CAP.',
    'Fever can take 2–3 days to improve on correct antibiotics. Improving appetite and energy usually comes before the fever fully settles.',
    'Paracetamol or ibuprofen for fever/discomfort — follow dosing instructions. Do NOT use both simultaneously.',
    'Follow-up appointment booked for 48 hours — if improving well, this may be by phone.',
    'Residual cough after pneumonia can last 3–4 weeks — this is normal. Return if cough is getting WORSE after 2 weeks on antibiotics.',
  ],
};

export const pneumoniaProtocol: DiseaseProtocol = {
  id: 'pneumonia',
  name: 'Pneumonia (Community Acquired)',
  system: 'Respiratory System',
  description: 'Assessment and management of CAP in children using BTS/WHO severity criteria, with antibiotic selection by age group and 4-step escalation from oral treatment to PICU.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/pneumonia/600/400', hint: 'chest xray' },
  erData,

  questions: [
    { id: 'weight',           questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'oxygenSaturation', questionText: 'SpO₂ (room air)', type: 'number', unit: '%' },
    { id: 'respiratoryRate',  questionText: 'Respiratory rate', type: 'number', unit: 'breaths/min' },
    { id: 'chestIndrawing',   questionText: 'Moderate / severe chest wall indrawing?', type: 'boolean' },
    { id: 'grunting',         questionText: 'Audible grunting?', type: 'boolean' },
    { id: 'mentalStatus',     questionText: 'Mental status', type: 'select', options: [
      { label: 'Normal',              value: 'normal',    score: 0 },
      { label: 'Irritable',           value: 'irritable', score: 1 },
      { label: 'Lethargic / drowsy',  value: 'lethargic', score: 3 },
    ]},
    { id: 'feeding',          questionText: 'Feeding intake', type: 'select', options: [
      { label: 'Normal',              value: 'normal',  score: 0 },
      { label: 'Reduced (50–75%)',    value: 'reduced', score: 1 },
      { label: 'Poor (< 50%)',        value: 'poor',    score: 2 },
    ]},
    { id: 'complicated',      questionText: 'Suspected complication?', type: 'boolean', info: 'Effusion, empyema, abscess, or failure of 48 h outpatient antibiotics.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const ageMonths = Number(data.ageMonths || 0);
    const rr        = Number(data.respiratoryRate || 0);
    const spo2      = Number(data.oxygenSaturation || 100);

    let totalPoints = 0;
    if (spo2 < 92) totalPoints += 3;
    if (data.chestIndrawing === true)       totalPoints += 2;
    if (data.grunting === true)             totalPoints += 2;
    if (data.feeding === 'poor')            totalPoints += 2;
    if (data.mentalStatus === 'lethargic')  totalPoints += 3;
    if (data.mentalStatus === 'irritable')  totalPoints += 1;

    const isTachypneic =
      (ageMonths < 12  && rr > 50) ||
      (ageMonths >= 12 && ageMonths < 60 && rr > 40) ||
      (ageMonths >= 60 && rr > 30);
    if (isTachypneic) totalPoints += 1;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Mild CAP — outpatient';

    if (totalPoints >= 5 || spo2 < 90 || data.complicated === true || data.mentalStatus === 'lethargic') {
      level = 'severe';
      interpretation = 'Severe / Complicated CAP';
    } else if (totalPoints >= 2) {
      level = 'moderate';
      interpretation = 'Moderate CAP — consider admission';
    }

    if (spo2 < 92)                    details.push('SpO₂ < 92% — oxygen required, admit.');
    if (data.grunting === true)        details.push('Grunting — impaired gas exchange, significant respiratory distress.');
    if (data.complicated === true)     details.push('Suspected complication — CXR + USS chest + IV antibiotics.');
    if (data.mentalStatus === 'lethargic') details.push('Lethargy — sepsis or hypoxic encephalopathy. URGENT.');

    return {
      level,
      scoreDetails: {
        systemName: 'CAP Severity Score (BTS/WHO)',
        totalScore: totalPoints,
        interpretation,
        referenceTable: [
          { range: '0 – 1', meaning: 'Mild — outpatient oral antibiotics' },
          { range: '2 – 4', meaning: 'Moderate — admission or 6 h observation' },
          { range: '≥ 5',   meaning: 'Severe — urgent IV antibiotics + admission' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const ageMonths = Number(data.ageMonths || 0);
    const isNeonate = ageMonths < 3;
    const isInfant  = ageMonths >= 3 && ageMonths < 60;

    const STEP3 = {
      title: 'STEP 3 — ESCALATION: Not improving on first-line antibiotics or deteriorating',
      recommendations: [
        '1. Consider resistant organisms or atypical cover:',
        '   • Add Azithromycin (10 mg/kg/day) if Mycoplasma or Chlamydophila suspected (school-age child, walking pneumonia).',
        '   • Switch to Pip-Tazo or Meropenem if GNR / aspiration / failed β-lactam.',
        '   • Add Vancomycin + Clindamycin if Staph aureus (PVL) suspected (post-viral, cavitation, rapid deterioration).',
        '2. Chest USS — rule out empyema if persistent fever > 48 h on IV antibiotics.',
        '3. Empyema / large effusion → respiratory/surgical consult for drainage.',
        '4. PICU review if respiratory failure pattern emerging.',
        '5. Repeat blood culture if still febrile at 48 h on antibiotics.',
      ],
    };

    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Respiratory failure or septic shock',
      recommendations: [
        'SpO₂ < 88% despite O₂, rising CO₂, exhaustion, haemodynamic instability.',
        'CALL PICU + SENIOR NOW.',
        'HFNC → CPAP → Intubation pathway — do not delay escalation.',
        'Fluid resuscitation 10–20 mL/kg if haemodynamic compromise.',
        'Broad-spectrum IV antibiotics: Ceftriaxone + Vancomycin ± Azithromycin.',
        'Ventilator strategy: low tidal volume (6 mL/kg), PEEP 5–8, avoid excessive O₂.',
        'Urgent CXR, blood gas, and echo if haemodynamic instability.',
      ],
    };

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — Severe CAP: Immediate management',
          recommendations: [
            'Oxygen — titrate to SpO₂ ≥ 94%.',
            'IV access. Blood culture × 2 BEFORE antibiotics.',
            isNeonate
              ? 'Neonatal antibiotics: Cefotaxime 50 mg/kg q8–12h + Ampicillin 50 mg/kg q6h (cover GBS / Listeria).'
              : isInfant
              ? 'IV Ceftriaxone 50–100 mg/kg/day once daily.'
              : 'IV Ceftriaxone 50–100 mg/kg/day ± Azithromycin (if Mycoplasma possible).',
            'CXR — PA + lateral. Blood: FBC, CRP, U&E, LFTs.',
            'IV / NG fluids if unable to maintain oral intake.',
            'Admit to ward or PICU based on SpO₂ response.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 24–48 hours',
          recommendations: [
            'Temperature improving and SpO₂ ≥ 94% → continue IV, step down to oral at 48 h if tolerating.',
            'Persistent fever > 48 h on IV antibiotics → USS chest + blood culture repeat + STEP 3.',
            'Any haemodynamic deterioration → STEP 4 immediately.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — Moderate CAP: Treat and observe',
          recommendations: [
            'Oxygen if SpO₂ < 94%.',
            isNeonate
              ? 'ADMIT — all infants < 3 months require IV antibiotics and admission.'
              : 'High-dose oral Amoxicillin 90 mg/kg/day in 3 divided doses × 5 days.',
            'Observe in ER for 4–6 hours. Reassess SpO₂ and RR at end of observation.',
            'IV fluids if inadequate oral intake.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 4–6 hours',
          recommendations: [
            'SpO₂ ≥ 94% + RR improving + feeding acceptable → discharge with oral antibiotics + 48 h follow-up.',
            'Not improving or SpO₂ dipping → admit for IV antibiotics + STEP 3.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    // Mild
    return [
      {
        title: 'STEP 1 — Mild CAP: Oral antibiotics, discharge',
        recommendations: [
          'High-dose oral Amoxicillin 90 mg/kg/day divided TDS × 5 days — first-line for all typical CAP.',
          'Antipyretics: Paracetamol 15 mg/kg q4–6h OR Ibuprofen 10 mg/kg q6–8h.',
          'Adequate oral hydration.',
          'Return precautions and GP follow-up in 48 hours.',
          'CXR NOT required for uncomplicated mild CAP.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS (telephone or in-person) at 48 hours',
        recommendations: [
          'Improving fever + activity + eating → complete full 5-day course.',
          'Not improving by 48 h → attend for reassessment, escalate to IV antibiotics.',
        ],
      },
      STEP3,
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['ADMIT — urgent IV antibiotics and monitoring.'];
    if (severity.level === 'moderate') return ['Consider admission. Observe 4–6 h. Discharge only if SpO₂ ≥ 94% and tolerating oral antibiotics.'];
    return ['Discharge with oral Amoxicillin. GP follow-up 48 h.'];
  },

  getRedFlags: () => [
    'SpO₂ < 92% on room air',
    'Grunting — severe respiratory distress',
    'Cyanosis',
    'Apnea or very slow respiratory rate (exhaustion)',
    'Altered mental status or lethargy',
    'Failure to improve after 48 h of antibiotics',
    'Pleural chest pain (effusion or empyema)',
    'Age < 3 months',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const ageMonths = Number(data.ageMonths || 0);

    const amoxTotal    = (90 * wt).toFixed(0);
    const amoxPerDose  = (90 * wt / 3).toFixed(0);
    const ceftriaxone  = Math.min(100 * wt, 4000).toFixed(0);
    const azithro      = Math.min(10 * wt, 500).toFixed(0);
    const vancomycin   = Math.min(60 * wt, 4000).toFixed(0);
    const clinda       = Math.min(40 * wt, 2700).toFixed(0);
    const cefotaxime   = Math.min(50 * wt, 2000).toFixed(0);
    const ampicillin   = Math.min(50 * wt, 2000).toFixed(0);
    const para         = Math.min(15 * wt, 1000).toFixed(0);
    const ibu          = Math.min(10 * wt, 400).toFixed(0);

    doses.push({ drugName: 'Amoxicillin PO (1st line — mild/moderate)', dose: `${amoxPerDose} mg TDS (90 mg/kg/day total ${amoxTotal} mg/day)`, notes: '5-day course for uncomplicated CAP. Use 7 days if complicated or slow response.' });
    if (ageMonths < 3) {
      doses.push({ drugName: 'Cefotaxime IV (neonates / infants < 3 months)', dose: `${cefotaxime} mg q8–12h (50 mg/kg/dose)`, notes: 'Give with Ampicillin to cover Listeria and GBS.' });
      doses.push({ drugName: 'Ampicillin IV (neonates)', dose: `${ampicillin} mg q6h (50 mg/kg/dose)`, notes: 'In combination with Cefotaxime for neonatal CAP.' });
    } else {
      doses.push({ drugName: 'Ceftriaxone IV (moderate–severe)', dose: `${ceftriaxone} mg OD (50–100 mg/kg/day, max 4 g)`, notes: 'Switch to oral Amoxicillin when afebrile + tolerating orals (usually 48–72 h).' });
    }
    doses.push({ drugName: 'Azithromycin PO/IV (atypical cover — school age)', dose: `${azithro} mg OD (10 mg/kg/day, max 500 mg) × 5 days`, notes: 'Add if Mycoplasma or Chlamydophila suspected (age > 5 years, gradual onset, bilateral infiltrates).' });
    doses.push({ drugName: 'Vancomycin IV (Staph / MRSA)', dose: `${vancomycin} mg/day (60 mg/kg/day in 4 divided doses)`, notes: 'Post-viral cavitary pneumonia or PVL-producing Staph aureus suspected. Monitor levels.' });
    doses.push({ drugName: 'Clindamycin IV (PVL-Staph add-on)', dose: `${clinda} mg/day (40 mg/kg/day divided q6–8h, max 2700 mg)`, notes: 'Toxin suppressor — add to Vancomycin for PVL-Staph aureus pneumonia.' });
    doses.push({ drugName: 'Paracetamol (antipyretic)', dose: `${para} mg q4–6h (15 mg/kg/dose, max 1 g)`, notes: 'Max 4 doses/day. Use for fever and discomfort.' });
    doses.push({ drugName: 'Ibuprofen (antipyretic — age > 3 months)', dose: `${ibu} mg q6–8h (10 mg/kg/dose, max 400 mg)`, notes: 'Alternate with paracetamol if needed. Avoid if dehydrated or renal impairment.' });

    return doses;
  },

  getReferences: () => [
    { title: 'BTS Guidelines for the Management of CAP in Children (2011, updated 2021)', url: 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pneumonia-children/' },
    { title: 'WHO Pocket Book of Hospital Care for Children — Pneumonia chapter', url: 'https://www.who.int/publications/i/item/978924154837-3' },
    { title: 'IDSA/PIDS CAP Guidelines 2011', url: 'https://doi.org/10.1093/cid/cir191' },
    { title: 'NICE NG143 — Pneumonia in adults (for antibiotic duration guidance)', url: 'https://www.nice.org.uk/guidance/ng143' },
  ],
};
