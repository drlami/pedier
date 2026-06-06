import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'petechiae',      question: 'Petechiae or non-blanching rash present?', redFlag: true,  ifYes: 'MENINGOCOCCEMIA — give IV Ceftriaxone IMMEDIATELY. Do not wait for LP.' },
    { id: 'hsv_risk',       question: 'Any HSV risk? (maternal genital herpes, active lesions in contacts, vesicular rash on infant)', redFlag: true, ifYes: 'ADD IV Acyclovir 20 mg/kg/dose q8h. HSV encephalitis in neonates can present without skin lesions.' },
    { id: 'immunocompromised', question: 'Known immunocompromised state? (oncology, immunodeficiency, prolonged steroids)', redFlag: true, ifYes: 'Broaden workup: blood + urine + LP; use anti-Pseudomonal cover (Pip-Tazo or Cefepime). Do NOT discharge.' },
    { id: 'no_vaccines',    question: 'Incompletely or unvaccinated for Hib and pneumococcal series?', redFlag: true, ifYes: 'Occult bacteremia risk is significantly higher — obtain blood culture and treat empirically if any concern.' },
    { id: 'prior_uti',      question: 'Previous UTI or urinary tract abnormality?', redFlag: false, ifYes: 'Higher UTI recurrence risk — urine culture mandatory even if UA appears borderline' },
    { id: 'premature',      question: 'Premature birth (< 37 weeks gestation)? (if still within corrected age ≤ 3 months)', redFlag: false, ifYes: 'Premature infants have immature immune systems — treat as younger chronological age for risk stratification' },
    { id: 'recent_abx',     question: 'Antibiotics given in the last 2 weeks?', redFlag: false, ifYes: 'Prior antibiotics may mask signs and culture results — lower threshold to treat and admit' },
    { id: 'source_found',   question: 'Clear source of fever found on history or exam? (ear, throat, skin, UTI symptoms)', ifYes: 'Manage according to identified source — this is no longer a "fever without source" pathway once a source is confirmed' },
    { id: 'urine_symptoms', question: 'Urinary symptoms? (dysuria, frequency, foul-smelling urine, crying with urination)', ifYes: 'UTI likely — obtain catheterised urine culture even if UA is equivocal. Never use bag urine for culture.' },
    { id: 'kawasaki_risk',  question: 'Fever for ≥ 5 days (total duration, not just today)?', ifYes: 'Consider Kawasaki disease if age 6 months – 5 years + ≥ 4 of 5 criteria (rash, conjunctivitis, lip/mouth changes, hand/foot changes, lymphadenopathy). Do NOT miss — untreated causes coronary artery aneurysms.' },
    { id: 'reliable_fu',    question: 'Reliable caregiver + confirmed follow-up within 24 h arranged?', ifYes: 'Documents that safe outpatient discharge conditions are met for borderline cases' },
    { id: 'sick_contacts',  question: 'Sick contacts at home or recent viral illness in household?', ifYes: 'Increases likelihood of viral aetiology — reassures regarding low SBI risk in well-appearing older children' },
  ],

  investigations: [
    { test: 'Temperature — confirm method (rectal preferred in < 3 months)', category: 'urgent', indication: 'Axillary and tympanic underestimate in infants. Rectal ≥ 38.0°C = fever in neonate; ≥ 38.0°C = fever in infant.' },
    { test: 'Continuous SpO₂ + HR monitoring', category: 'urgent', indication: 'Tachycardia out of proportion to fever = possible sepsis (HR > 180 in infant, > 160 in toddler). SpO₂ < 94% = respiratory source or sepsis.' },
    { test: 'Blood glucose (bedside)', category: 'urgent', indication: 'Neonates and young infants are hypoglycaemia-prone during fever and fasting. Correct immediately if < 60 mg/dL.' },

    { test: 'Blood culture × 1 (before antibiotics)', category: 'blood', indication: 'Mandatory for: ALL neonates, ALL ill-appearing children, all 29-60d infants, well-appearing infants with elevated CRP/PCT, or incomplete vaccination. Not routine for well-appearing low-risk toddlers.', criticalValue: 'Never delay antibiotics > 15 min for blood culture collection' },
    { test: 'CBC with differential', category: 'blood', indication: 'WBC > 15,000 or < 5,000 + ANC > 10,000 = higher SBI risk. Neutropenia (ANC < 500) = febrile neutropenia emergency.' },
    { test: 'CRP (C-reactive protein)', category: 'blood', indication: 'CRP ≥ 20 mg/L = elevated IBI risk in young infants (29-90d). Less reliable in first 6-12 h of fever onset — serial testing adds value.', criticalValue: 'CRP ≥ 40 mg/L + well-appearing 29-60d infant → parenteral antibiotics + admit' },
    { test: 'Procalcitonin (PCT)', category: 'blood', indication: 'PCT ≥ 0.5 ng/mL = raised SBI risk; PCT ≥ 2 ng/mL = high risk. More sensitive than CRP in first 6-12 h. Use alongside CRP.', criticalValue: 'PCT ≥ 2 ng/mL → treat as high-risk regardless of appearance' },
    { test: 'Blood gas (venous) ± lactate', category: 'blood', indication: 'For ill-appearing infants, suspected sepsis, or respiratory distress. Metabolic acidosis + high lactate = organ dysfunction.', criticalValue: 'Lactate ≥ 4 mmol/L → sepsis protocol + PICU notification' },

    { test: 'Urinalysis (UA) + urine culture — catheter specimen', category: 'blood', indication: 'Mandatory for: ALL females < 24 months; ALL uncircumcised males < 12 months; ALL neonates; urinary symptoms at any age. ALWAYS use catheter (never bag urine for culture — unacceptably high false positive rate).', criticalValue: 'Positive UA (LE or nitrite) → start antibiotics immediately, culture pending' },
    { test: 'LP (lumbar puncture) + CSF analysis', category: 'blood', indication: 'Mandatory: ALL neonates ≤ 28 days with fever; well-appearing 29-60d infants with elevated markers or positive UA; ILL-APPEARING infant of any age if stable for LP. Skip LP only if haemodynamically unstable — give antibiotics first, LP later.', criticalValue: 'NEVER delay antibiotics to perform LP if infant is unstable or deteriorating' },

    { test: 'CXR (if respiratory symptoms present)', category: 'radiology', indication: 'Not routine for fever without respiratory signs. Order if: RR elevated for age, SpO₂ < 94%, cough, grunting, tachypnoea, or focal chest signs. Occult pneumonia rare without respiratory signs in vaccinated children.' },
    { test: 'Renal USS (if UTI confirmed or recurrent UTI)', category: 'radiology', indication: 'Not acute ER investigation. Arrange outpatient USS for first UTI in < 2 years, all males, or recurrent UTI.' },
  ],

  admissionCriteria: [
    'ALL neonates ≤ 28 days with any fever ≥ 38.0°C — no exceptions, admit for full sepsis workup and empiric antibiotics',
    'Ill-appearing child of any age: toxic, lethargic, poor perfusion, inconsolable — full sepsis workup + PICU consideration',
    'Fever + petechiae or purpuric rash — meningococcemia; immediate antibiotics + PICU',
    'Infant 29–60 days: well-appearing with CRP ≥ 20 mg/L OR PCT ≥ 0.5 OR positive UA — parenteral antibiotics + admit',
    'Any child with confirmed bacteraemia on blood culture',
    'Immunocompromised child with any fever — admit all for IV broad-spectrum antibiotics',
    'Fever ≥ 38°C in an incompletely vaccinated infant < 6 months',
    'Suspected meningitis: bulging fontanelle, neck stiffness, photophobia, seizure, petechiae',
    'Unable to tolerate oral fluids or signs of dehydration requiring IV',
    'No reliable caregiver or no guaranteed 24-hour follow-up for any intermediate-risk presentation',
  ],

  highRiskFactors: [
    'Young infant 29–60d well-appearing with CRP 10–20 mg/L (borderline): high observation admission or ceftriaxone IM + guaranteed 12-hour follow-up minimum',
    'Infant 61–90d well-appearing: positive UA = treat UTI; elevated CRP/PCT = blood culture + consider admit vs careful outpatient with 24 h follow-up',
    'Fever > 48 h without source in child < 12 months — higher SBI probability; blood culture + review',
    'Incomplete vaccination (especially Hib, PCV) in child < 5 years — occult bacteraemia risk remains; check inflammatory markers',
    'Prior serious bacterial infection (bacteraemia, meningitis, UTI) — lower threshold for repeat workup',
    'Fever ≥ 40°C in child < 36 months — higher SBI risk even if well-appearing; CRP mandatory',
    'Premature infant (< 37 weeks) within corrected age ≤ 3 months — treat as chronologically younger',
  ],

  dischargeCriteria: [
    'NOTE: Neonates ≤ 28 days with fever are NEVER discharged from the ER — admit is mandatory',
    'Child remains well-appearing throughout the entire ER stay (no deterioration in appearance)',
    'UA negative by dipstick (if obtained) — if positive, UTI treated and improvement confirmed',
    'CRP < 20 mg/L and PCT < 0.5 ng/mL (if checked; not required for low-risk toddlers)',
    'Blood culture drawn (if indicated) — do not wait for result before discharging if low-risk; ensure method of notification in place if culture grows',
    'Tolerating oral fluids adequately; no dehydration',
    'Clear identifiable viral source found (e.g. URTI, roseola pattern) OR reliable low-risk profile confirmed',
    'Reliable caregiver who understands return-to-ER criteria and has written them',
    'Follow-up confirmed: within 12–24 h (intermediate risk) or 24–48 h (low risk)',
    'Senior clinician review for all infants < 3 months before discharge',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: becomes less responsive or difficult to wake, refuses all fluids for > 4 hours, develops a rash (especially any spots that do not fade under glass pressure), develops difficulty breathing, temperature is rising despite paracetamol, or parents are worried about any change.',
    'Fever alone without the above features does not require return — but your child should improve over 48–72 hours. If fever is still present and no source has been identified after 48 h, return for review.',
    'Paracetamol (acetaminophen): 15 mg/kg/dose every 4–6 hours as needed. Do not exceed 5 doses in 24 hours. Do not give to infants < 2 months without medical advice.',
    'Ibuprofen (only if age ≥ 6 months and child is drinking well): 10 mg/kg/dose every 6–8 hours as needed. Do NOT give if child is dehydrated, has kidney problems, or has a bleeding condition.',
    'Encourage frequent small fluids — breast milk, formula, water, or oral rehydration solution. Do not force large volumes.',
    'Keep the follow-up appointment even if your child seems better — some infections are not obvious at first visit.',
    'If antibiotics were prescribed, complete the full course. Do not stop early even if fever resolves.',
  ],
};

// ageMonths comes from the sticky bar (parseAgeToMonths) synced into formData
function deriveAgeGroup(data: FormData): string {
  const m = Number(data.ageMonths) || 0; // total months (may be fractional for days input)
  if (m < 1)    return 'neonate'; // ≤ ~30 days
  if (m < 2)    return 'inf1';    // ~29–60 days
  if (m < 3)    return 'inf2';    // ~61–90 days
  if (m <= 36)  return 'tod';     // 3–36 months
  return 'older';
}

function ageLabel(data: FormData): string {
  const m = Number(data.ageMonths);
  if (!m) return '';
  if (m < 1) return `${Math.round(m * 30.4)} days`;
  if (m < 12) return `${Math.round(m)} month${Math.round(m) !== 1 ? 's' : ''}`;
  const y = Math.floor(m / 12);
  const rem = Math.round(m % 12);
  return rem === 0 ? `${y} year${y !== 1 ? 's' : ''}` : `${y}y ${rem}m`;
}

export const feverWithoutSourceProtocol: DiseaseProtocol = {
  id: 'fever-without-source',
  name: 'Fever Without Source',
  system: 'Infectious Diseases',
  description: 'Age-stratified evaluation of fever without an identified source — from neonates to 36 months. Integrates AAP 2021 guidelines with risk-score-based management decisions.',
  lastUpdated: '2024',
  image: {
    url: 'https://picsum.photos/seed/fever-without-source/600/400',
    hint: 'infant temperature',
  },
  erData,

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'temp',         questionText: 'Temperature', type: 'select', options: [
      { label: '< 38.0°C — No fever',     value: 'none',   score: 0 },
      { label: '38.0–38.9°C',              value: 'low',    score: 1 },
      { label: '39.0–39.9°C',              value: 'high',   score: 2 },
      { label: '≥ 40.0°C',                 value: 'vhigh',  score: 3 },
    ], info: 'Use rectal temperature in all infants < 3 months.' },
    { id: 'appearance',   questionText: 'Child\'s Appearance', type: 'select', options: [
      { label: 'Well-appearing — alert, active, normal colour, good tone',   value: 'well',   score: 0 },
      { label: 'Ill-appearing — toxic, lethargic, poor perfusion, irritable', value: 'ill',  score: 6 },
    ], info: 'Appearance is the MOST important single factor. When in doubt, treat as ill-appearing.' },
    { id: 'ua',           questionText: 'Urinalysis Result', type: 'select', options: [
      { label: 'Not yet done',                             value: 'nd',   score: 0 },
      { label: 'Negative (no LE, no nitrite)',             value: 'neg',  score: 0 },
      { label: 'Positive (LE and/or nitrite/pyuria)',      value: 'pos',  score: 3 },
    ]},
    { id: 'crp',          questionText: 'CRP (C-Reactive Protein)', type: 'select', options: [
      { label: 'Not checked / < 10 mg/L',   value: 'low',  score: 0 },
      { label: '10–19 mg/L — borderline',   value: 'bord', score: 1 },
      { label: '20–39 mg/L — elevated',     value: 'high', score: 2 },
      { label: '≥ 40 mg/L — markedly high', value: 'vhigh',score: 3 },
    ]},
    { id: 'vaccines',     questionText: 'Hib + Pneumococcal Vaccination Status', type: 'select', options: [
      { label: 'Complete / up-to-date',      value: 'complete',   score: 0 },
      { label: 'Incomplete or unknown',      value: 'incomplete', score: 1 },
    ]},
    { id: 'sex',          questionText: 'Sex (for UTI risk)', type: 'select', options: [
      { label: 'Female',               value: 'female',  score: 0 },
      { label: 'Male — circumcised',   value: 'mcirc',   score: 0 },
      { label: 'Male — uncircumcised', value: 'munC',    score: 0 },
    ]},
    { id: 'reliableFollowup', questionText: 'Reliable follow-up within 24 h confirmed?', type: 'boolean',
      info: 'Required for any outpatient management of intermediate-risk presentations.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const ag = deriveAgeGroup(data);
    const appearance = data.appearance as string;
    const temp = data.temp as string;
    const ua   = data.ua as string;
    const crp  = data.crp as string;
    const vax  = data.vaccines as string;
    const sex  = data.sex as string;

    const details: string[] = [];

    // Auto-derived age group label
    const agGroupLabel: Record<string, string> = {
      neonate: 'Neonate (≤ 1 month)',
      inf1: 'Young infant (1–2 months / ~29–60 days)',
      inf2: 'Young infant (2–3 months / ~61–90 days)',
      tod:  'Infant/toddler (3–36 months)',
      older:'Child > 36 months',
    };
    if (data.ageMonths) {
      details.push(`Age: ${ageLabel(data)} → ${agGroupLabel[ag] ?? ag}`);
    }

    // Neonates with fever — always severe, no scoring needed
    if (ag === 'neonate' && temp !== 'none' && temp !== undefined) {
      details.unshift('NEONATAL FEVER — medical emergency. Full sepsis workup and empiric antibiotics mandatory. Admit.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'FWS Risk', totalScore: 10, maxScore: 10, interpretation: 'Neonatal Fever — Always High Risk' },
        details,
      };
    }

    // Ill-appearing — always severe
    if (appearance === 'ill') {
      details.unshift('ILL-APPEARING CHILD — treat as serious bacterial infection until proven otherwise. Full sepsis workup.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'FWS Risk', totalScore: 9, maxScore: 10, interpretation: 'Toxic Appearance — High Risk' },
        details,
      };
    }

    // Score calculation for well-appearing children
    let score = 0;
    if (temp === 'high')  score += 2;
    if (temp === 'vhigh') score += 3;
    if (ua   === 'pos')   score += 3;
    if (crp  === 'bord')  score += 1;
    if (crp  === 'high')  score += 2;
    if (crp  === 'vhigh') score += 3;
    if (vax  === 'incomplete') score += 1;

    // Age-specific UTI risk (female <24m, uncircumcised male <12m) adds implicit moderate flag
    const utiRiskAge = (sex === 'female' && (ag === 'inf1' || ag === 'inf2' || ag === 'tod')) ||
                       (sex === 'munC' && (ag === 'inf1' || ag === 'inf2'));

    if (utiRiskAge && ua !== 'pos') details.push('UTI risk: UA mandatory — female ≤ 24 m or uncircumcised male ≤ 12 m.');
    if (ua === 'pos') details.push('Positive UA — UTI likely. Start antibiotics after urine culture collected.');
    if (crp === 'high' || crp === 'vhigh') details.push('Elevated CRP — increased IBI risk. Blood culture if not already sent.');
    if (vax === 'incomplete') details.push('Incomplete vaccination — occult bacteraemia risk higher than expected for age.');

    let level: SeverityLevel;
    let interpretation: string;

    if (score >= 5 || (ag === 'inf1' && (crp === 'high' || crp === 'vhigh' || ua === 'pos'))) {
      level = 'severe';
      interpretation = 'High Risk — Full workup + empiric antibiotics';
      details.unshift('HIGH RISK — well-appearing but markers or UA positive. Parenteral antibiotics + admission.');
    } else if (score >= 2 || utiRiskAge || (ag === 'inf1') || (ag === 'inf2' && (crp === 'bord' || ua !== 'neg'))) {
      level = 'moderate';
      interpretation = 'Intermediate Risk — targeted workup needed';
      details.unshift('INTERMEDIATE RISK — targeted investigations needed before safe discharge decision.');
    } else {
      level = 'mild';
      interpretation = 'Low Risk — supportive care';
      details.unshift('LOW RISK — well-appearing, no concerning markers. Supportive care + safety netting.');
    }

    return {
      level,
      scoreDetails: {
        systemName: 'FWS Risk Score',
        totalScore: score,
        maxScore: 10,
        interpretation,
        referenceTable: [
          { range: '0–1',  meaning: 'Low Risk' },
          { range: '2–4',  meaning: 'Intermediate' },
          { range: '5–10', meaning: 'High Risk' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const ag = deriveAgeGroup(data);
    const isNeonate    = ag === 'neonate';
    const isInf1       = ag === 'inf1';
    const isInf2       = ag === 'inf2';
    const isToddler    = ag === 'tod';
    const isYoungInf   = isInf1 || isInf2;
    const ua           = data.ua as string;
    const crp          = data.crp as string;
    const sex          = data.sex as string;
    const hasHsv       = data.hsv_risk === true;

    // ── Age-specific Step 1 text ────────────────────────────────────────────
    const step1Recs = isNeonate ? [
      'FULL SEPSIS WORKUP — mandatory for ALL neonates with fever ≥ 38.0°C, regardless of appearance.',
      'Obtain: Blood culture (before antibiotics) + CBC + CRP + Blood gas.',
      'Catheterised urine: UA + urine culture.',
      'LP (CSF analysis + culture) — do immediately if haemodynamically stable. Do NOT delay antibiotics for LP if unstable.',
      'IV access (peripheral, do not delay for umbilical line).',
      'Bedside glucose now.',
      hasHsv ? '⚠ HSV RISK PRESENT — add IV Acyclovir 20 mg/kg/dose q8h immediately.' : 'Ask specifically about HSV risk (maternal herpes, vesicles on infant) — if any concern, add Acyclovir.',
      'Start empiric antibiotics within 30 min — see Drugs tab.',
    ] : isInf1 ? [
      'Well-appearing 29–60 day infant with fever requires a structured workup regardless of appearance.',
      'Obtain: Blood culture + CBC + CRP + Procalcitonin.',
      'Catheterised urine: UA + urine culture (mandatory in this age group).',
      'LP: perform if CRP ≥ 20, PCT ≥ 0.5, positive UA, or any change in appearance. If LP not done, reassess decision at 4–6 h.',
      'Bedside glucose.',
    ] : isInf2 ? [
      'Well-appearing 61–90 day infant with fever: risk is lower than 29–60d but workup still recommended.',
      'Obtain: UA + urine culture (catheterised) — mandatory.',
      'CRP + blood culture if: fever ≥ 39°C, CRP not yet done, incomplete vaccines, or any concern.',
      'LP only if: appears unwell, CRP ≥ 20, fever ≥ 40°C, or parents are unable to describe appearance change.',
      'Bedside glucose.',
    ] : [
      'Well-appearing child 3–36 months: UA is the most important immediate investigation.',
      sex === 'female' ? 'FEMALE ≤ 24 months — catheterised UA + urine culture is MANDATORY (UTI risk regardless of symptoms).' :
      sex === 'munC'   ? 'UNCIRCUMCISED MALE ≤ 12 months — catheterised UA + urine culture is MANDATORY.' :
      'UA if any urinary symptoms, prolonged fever (> 48 h), or temp ≥ 39°C without source.',
      'Blood culture only if: toxic-looking, temp ≥ 39°C + incomplete vaccines, or CRP significantly elevated.',
      'No routine LP in well-appearing toddlers unless meningism, petechiae, or altered consciousness.',
    ];

    const STEP2_REASSESS = {
      title: 'STEP 2 — REASSESS at 1–2 h with results in hand',
      recommendations: [
        'IMPROVED APPEARANCE + LOW MARKERS + NEG UA: → proceed to discharge pathway (Dispose tab). Give safety-netting advice.',
        'UA POSITIVE: → start oral antibiotics (UTI). If 29–60d or ill-appearing → parenteral antibiotics + admit.',
        'CRP ≥ 20 mg/L (any infant < 90d) OR PCT ≥ 0.5: → obtain blood culture if not yet done. Consider parenteral antibiotics + admit.',
        'APPEARANCE WORSENING at any point: → escalate immediately to STEP 3.',
        '⚠ Do NOT discharge a young infant (< 90d) on the basis of appearance alone — a well-appearing infant can deteriorate rapidly.',
      ],
    };

    const STEP3_ESCALATION = {
      title: 'STEP 3 — ESCALATION: Worsening appearance or concerning results after initial workup',
      recommendations: [
        '1. CALL SENIOR — escalating fever + worsening appearance in a young infant must be reviewed by a consultant.',
        '2. START / ESCALATE ANTIBIOTICS: if not yet started → start empiric antibiotics NOW. If already on antibiotics and worsening → broaden (add Vancomycin + anti-Pseudomonal).',
        '3. REPEAT BLOOD GAS + LACTATE — metabolic acidosis or lactate > 2 mmol/L = sepsis → SEPTIC SHOCK PROTOCOL.',
        '4. IV FLUID: if any signs of dehydration or poor perfusion → 10 mL/kg isotonic crystalloid bolus.',
        '5. If LP not yet performed and meningitis now suspected → CSF now (if stable) or give antibiotics and LP later.',
        '6. PICU NOTIFICATION if: altered consciousness, apnoea, haemodynamic instability, or persistent fever with worsening markers despite antibiotics.',
      ],
    };

    const STEP4_FAILURE = {
      title: 'STEP 4 — Life-threatening: Meningitis / Sepsis / Septic Shock',
      recommendations: [
        'RECOGNISE: altered consciousness, apnoea, petechiae/purpura, haemodynamic instability, seizure, bulging fontanelle.',
        'SENIOR + PICU at bedside NOW.',
        'If Meningococcemia suspected (petechiae + fever) → Ceftriaxone IV push without any delay — do NOT wait.',
        'Bacterial meningitis → Dexamethasone 0.15 mg/kg IV before or with first antibiotic dose (reduces neurological sequelae in H. influenzae and pneumococcal meningitis). Use with caution in neonates.',
        'Haemodynamic compromise → follow SEPTIC SHOCK PROTOCOL: fluid bolus 10–20 mL/kg + vasopressors (see Septic Shock protocol).',
        'Neonatal HSV encephalitis (seizure + vesicles + fever) → IV Acyclovir 20 mg/kg q8h; CSF HSV PCR; MRI brain.',
        'Seizure management: benzodiazepine first-line (see Status Epilepticus protocol if prolonged).',
      ],
    };

    switch (severity.level) {
      case 'severe':
        return [
          {
            title: `STEP 1 — Immediate: Full Workup + Empiric Antibiotics${isNeonate ? ' (NEONATE)' : isYoungInf ? ' (Young Infant)' : ''}`,
            recommendations: step1Recs,
          },
          STEP2_REASSESS,
          STEP3_ESCALATION,
          STEP4_FAILURE,
        ];

      case 'moderate':
        return [
          {
            title: `STEP 1 — Targeted Workup: Intermediate Risk${isInf2 ? ' (61–90 days)' : isToddler ? ' (3–36 months)' : ''}`,
            recommendations: step1Recs,
          },
          STEP2_REASSESS,
          STEP3_ESCALATION,
          STEP4_FAILURE,
        ];

      case 'mild':
        return [
          {
            title: 'STEP 1 — Low Risk: Supportive Care',
            recommendations: [
              'Antipyretics — paracetamol 15 mg/kg now if distressed by fever. Ibuprofen if ≥ 6 months and drinking well.',
              ua !== 'neg' && sex === 'female' ? 'Obtain catheterised UA + culture — UTI risk age even in low-risk group.' : 'UA may be deferred if very low-risk, but low threshold to send given age.',
              'Observe in ER for 1–2 h before discharge decision.',
              'No routine blood tests or antibiotics for low-risk well-appearing children.',
            ],
          },
          {
            title: 'STEP 2 — REASSESS at 1 h: Still well-appearing and comfortable?',
            recommendations: [
              'STILL WELL → discharge with safety netting (Dispose tab). Confirm follow-up within 24–48 h.',
              'UA POSITIVE → start oral antibiotics (UTI). Reassess for admission need based on age.',
              'APPEARANCE CHANGED → escalate: send full workup, escalate to STEP 3.',
              '⚠ Never discharge without documenting that caregiver understands return precautions.',
            ],
          },
          STEP3_ESCALATION,
        ];

      default:
        return [
          { title: 'Select age group in Assess tab', recommendations: ['Choose the patient\'s age group and complete the assessment to display management steps.'] },
        ];
    }
  },

  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return [
        deriveAgeGroup(data) === 'neonate'
          ? 'ADMIT — all neonates with fever require inpatient management regardless of appearance.'
          : 'ADMIT — ill-appearing or high-risk young infant. PICU if haemodynamically unstable.',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'Admission or extended observation for intermediate-risk presentations. Outpatient only if UA negative, markers reassuring, and 12–24 h follow-up is confirmed.',
      ];
    }
    return ['Discharge home with safety-netting advice and documented 24–48 h follow-up.'];
  },

  getRedFlags: () => [
    'Fever ≥ 38.0°C in ANY neonate ≤ 28 days',
    'Ill / toxic appearance — regardless of age or temperature',
    'Petechiae or non-blanching rash',
    'Bulging fontanelle, neck stiffness, photophobia',
    'Apnoea or irregular breathing pattern',
    'Vesicular rash (HSV concern in neonate)',
    'Fever ≥ 40°C in child < 36 months with no source',
    'Fever > 5 days total duration (Kawasaki disease)',
  ],

  getDrugDoses: (severity, data) => {
    const wt  = Number(data.weight) || 0;
    const ag  = deriveAgeGroup(data);
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required to calculate doses.' });
      return doses;
    }

    // ── Antipyretics ─────────────────────────────────────────────────────────
    const paracetamolMg = (15 * wt).toFixed(0);
    const ibuprofenMg   = (10 * wt).toFixed(0);
    doses.push({
      drugName: 'Paracetamol (Acetaminophen) — PO / PR',
      dose: `${paracetamolMg} mg (15 mg/kg) every 4–6 h as needed`,
      notes: 'Max 5 doses / 24 h. Safe from birth. Rectal dose same as oral.',
    });
    if (ag === 'inf2' || ag === 'tod') {
      doses.push({
        drugName: 'Ibuprofen — PO (≥ 6 months only, not dehydrated)',
        dose: `${ibuprofenMg} mg (10 mg/kg) every 6–8 h as needed`,
        notes: 'Max 40 mg/kg/day. Do NOT use if dehydrated, < 6 months, or renal impairment.',
      });
    }

    // ── Antibiotics — age-specific ───────────────────────────────────────────
    if (ag === 'neonate') {
      const ampMg  = Math.min(100 * wt, 2000).toFixed(0);
      const gentMg = (4 * wt).toFixed(1);
      const cefotMg= Math.min(50 * wt, 2000).toFixed(0);
      const acycMg = (20 * wt).toFixed(0);
      doses.push({
        drugName: 'Ampicillin (IV) — Neonatal first-line',
        dose: `${ampMg} mg IV (100 mg/kg) every 12 h (0–7 days) or every 8 h (> 7 days)`,
        notes: 'Covers Group B Strep + Listeria. Mandatory component of neonatal empiric regimen.',
      });
      doses.push({
        drugName: 'Gentamicin (IV) — Neonatal partner',
        dose: `${gentMg} mg IV (4 mg/kg) every 24–36 h (dosing interval by gestational age + postnatal age — check pharmacy)`,
        notes: 'Covers E. coli and Gram-negatives. Use Cefotaxime if meningitis strongly suspected (better CSF penetration).',
      });
      doses.push({
        drugName: 'Cefotaxime (IV) — Alternative to Gentamicin (preferred if meningitis)',
        dose: `${cefotMg} mg IV (50 mg/kg) every 12 h (0–7 days) or every 8 h (> 7 days)`,
        notes: 'Better CNS penetration than gentamicin. Do NOT use Ceftriaxone in neonates — displaces bilirubin → kernicterus risk.',
      });
      doses.push({
        drugName: 'Acyclovir (IV) — Add if ANY HSV concern',
        dose: `${acycMg} mg IV (20 mg/kg) every 8 h`,
        notes: 'Give if: vesicular rash, maternal HSV history, seizures, CSF pleocytosis, or unexplained deterioration. Continue until HSV PCR returns negative.',
      });
    } else if (ag === 'inf1' || ag === 'inf2') {
      const ceftriMg  = Math.min(50 * wt, 2000).toFixed(0);
      const ampicilMg = Math.min(50 * wt, 2000).toFixed(0);
      doses.push({
        drugName: 'Ceftriaxone (IV / IM) — 29–90 day infant',
        dose: `${ceftriMg} mg (50 mg/kg, max 2 g) once daily`,
        notes: 'First-line for well-appearing 29–90d infant requiring parenteral antibiotics. Safe to give IM if IV access is difficult. Double dose (100 mg/kg) if meningitis suspected.',
      });
      doses.push({
        drugName: 'Ampicillin (IV) — Add if Listeria concern (29–60d)',
        dose: `${ampicilMg} mg IV (50 mg/kg) every 6 h`,
        notes: 'Consider adding for infants 29–60d with meningitis or critical illness — Listeria still possible and not covered by ceftriaxone.',
      });
    } else {
      // Toddler 3–36m
      const ceftriMg   = Math.min(50 * wt, 2000).toFixed(0);
      const cephalexinMgDay = (50 * wt).toFixed(0);
      const amoxclavMg = (25 * wt).toFixed(0);
      doses.push({
        drugName: 'Ceftriaxone (IV / IM) — if parenteral antibiotics needed',
        dose: `${ceftriMg} mg (50 mg/kg, max 2 g) IV/IM once daily`,
        notes: 'For bacteraemia, positive UA requiring parenteral treatment, or ill-appearing. 100 mg/kg for meningitis.',
      });
      doses.push({
        drugName: 'Cephalexin (PO) — confirmed UTI, well-appearing',
        dose: `${cephalexinMgDay} mg/day (50 mg/kg/day) divided every 6–8 h × 7–10 days`,
        notes: 'First-line oral for uncomplicated UTI if local E. coli susceptibility > 80%. Check local antibiogram.',
      });
      doses.push({
        drugName: 'Amoxicillin-Clavulanate (PO) — UTI alternative',
        dose: `${amoxclavMg} mg amoxicillin component (25 mg/kg) twice daily × 7–10 days`,
        notes: 'Alternative if Cephalexin resistance likely locally. Avoid if recent amoxicillin exposure.',
      });
    }

    return doses;
  },

  getReferences: () => [
    { title: 'Pantell RH et al. AAP Clinical Practice Guideline: Febrile Infants 8–60 Days Old. Pediatrics 2021', url: 'https://publications.aap.org/pediatrics/article/148/2/e2021052228/180785' },
    { title: 'Gomez B et al. PECARN/MVCRC/PRIS — Validation of the Step-by-Step Approach for febrile infants. Pediatrics 2016', url: 'https://pubmed.ncbi.nlm.nih.gov/27244862/' },
    { title: 'NICE Guideline NG143 — Fever in under 5s: assessment and initial management (2021)', url: 'https://www.nice.org.uk/guidance/ng143' },
    { title: 'Roberts KB. AAP Subcommittee — Urinary Tract Infection: Clinical Practice Guideline. Pediatrics 2011 (reaffirmed 2016)', url: 'https://publications.aap.org/pediatrics/article/128/3/595/30724' },
    { title: 'Nigrovic LE et al. — Risk factors for bacterial meningitis in children with CSF pleocytosis. Pediatrics 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/18381510/' },
  ],
};
