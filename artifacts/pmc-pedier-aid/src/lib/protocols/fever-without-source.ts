import type { DiseaseProtocol, ErData, ErInvestigation, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'petechiae',      question: 'Petechiae or non-blanching rash present?', redFlag: true,  ifYes: 'MENINGOCOCCEMIA — give IV Ceftriaxone IMMEDIATELY. Do not wait for LP.' },
    { id: 'hsv_risk',       question: 'Any HSV risk? (maternal genital herpes, active lesions in contacts, vesicular rash on infant)', redFlag: true, ifYes: 'ADD IV Acyclovir 20 mg/kg/dose q8h. HSV encephalitis in neonates can present without skin lesions.' },
    { id: 'immunocompromised', question: 'Known immunocompromised state? (oncology, immunodeficiency, prolonged steroids)', redFlag: true, ifYes: 'Broaden workup: blood + urine + LP; use anti-Pseudomonal cover (Pip-Tazo or Cefepime). Do NOT discharge.' },
    { id: 'no_vaccines',    question: 'Incompletely or unvaccinated for Hib and pneumococcal series? (< 3 doses PCV13 OR < 2 doses Hib)', redFlag: true, ifYes: 'Occult bacteraemia risk is significantly elevated. COMPLETELY IMMUNISED requires ≥ 3 doses PCV13 + ≥ 2 doses Hib (or ≥ 2 PCV13 doses for infants 4–6 months). With fewer doses: bacteraemia risk historically 3–11%; herd immunity provides partial but NOT full protection. Obtain CBC + CRP + blood culture; give empiric IM ceftriaxone 50 mg/kg if WBC ≥ 15,000/mm³, ANC ≥ 10,000/mm³, or CRP > 20 mg/L.' },
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

    { test: 'Blood culture × 1 (before antibiotics)', category: 'blood', indication: 'Mandatory for: ALL neonates, ALL ill-appearing children, all 29-60d infants, well-appearing infants with elevated CRP or ANC, or incomplete vaccination. Not routine for well-appearing low-risk toddlers.', criticalValue: 'Never delay antibiotics > 15 min for blood culture collection' },
    { test: 'CBC with differential', category: 'blood', indication: 'WBC > 15,000 or < 5,000 raises SBI risk. ANC > 4,000/mm³ is the abnormal cut-off for invasive bacterial infection (AAP 2021 / PECARN). With procalcitonin unavailable, ANC + CRP together carry the marker decision. Neutropenia (ANC < 500) = febrile neutropenia emergency.', criticalValue: 'ANC > 4,000/mm³ in a well-appearing 29–90d infant → treat as raised IBI risk' },
    { test: 'CRP (C-reactive protein)', category: 'blood', indication: 'PRIMARY inflammatory marker at this facility (procalcitonin not available). CRP ≥ 20 mg/L = elevated IBI risk in young infants (29–90d). Less reliable in first 6–12 h of fever onset — a normal early CRP does NOT exclude IBI. Repeat at 6–12 h and/or observe rather than discharge a borderline young infant on a single value.', criticalValue: 'CRP ≥ 40 mg/L + well-appearing 29-60d infant → parenteral antibiotics + admit' },
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
    'Infant 29–60 days: well-appearing with CRP ≥ 20 mg/L OR ANC > 4,000/mm³ OR positive UA — parenteral antibiotics + admit',
    'Any child with confirmed bacteraemia on blood culture',
    'Immunocompromised child with any fever — admit all for IV broad-spectrum antibiotics',
    'Fever ≥ 38°C in an incompletely vaccinated infant < 6 months',
    'Suspected meningitis: bulging fontanelle, neck stiffness, photophobia, seizure, petechiae',
    'Unable to tolerate oral fluids or signs of dehydration requiring IV',
    'No reliable caregiver or no guaranteed 24-hour follow-up for any intermediate-risk presentation',
  ],

  highRiskFactors: [
    'Young infant 29–60d well-appearing with CRP 10–20 mg/L (borderline): high observation admission or ceftriaxone IM + guaranteed 12-hour follow-up minimum',
    'Infant 61–90d well-appearing: positive UA = treat UTI; elevated CRP or ANC = blood culture + consider admit vs careful outpatient with 24 h follow-up',
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
    'CRP < 20 mg/L and ANC < 4,000/mm³ (if checked; not required for low-risk toddlers). PCT is unavailable here — do NOT discharge a young infant on a single early CRP; repeat or observe if borderline',
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
  description: 'Age-stratified pathway for fever without an identified source — neonates through 36 months — built on the AAP 2021 CPG (Pantell et al.) for young infants and the UpToDate / Baraff framework for the 3–36-month group.\n\nNeonates ≤ 28 days: mandatory full sepsis workup and admission; no exceptions.\n\nYoung infants 29–90 days: structured workup driven by CRP + ANC (AAP 2021 / PECARN thresholds: CRP ≥ 20 mg/L or ANC > 4,000/mm³ = elevated IBI risk); procalcitonin not required at this facility.\n\nChildren 3–36 months: fever of concern is ≥ 39°C rectal with no source identified on complete examination. Most have a self-limited viral illness. Occult bacterial infection is led by UTI (prevalence 8–10%); occult bacteraemia has fallen to < 1% in fully immunised children in the post-PCV13 + Hib conjugate vaccine era. Risk is stratified first by immunisation status: (1) Fully immunised — UA-led evaluation only (catheter UA + culture for females < 24 months, uncircumcised males < 12 months, prior UTI, or urinary symptoms); no CBC, no blood culture, no CRP. (2) Incompletely immunised or unknown — CBC + CRP indicated; blood culture and empiric IM ceftriaxone 50 mg/kg when WBC ≥ 15,000/mm³, ANC ≥ 10,000/mm³, or CRP > 20 mg/L; CXR if WBC ≥ 20,000/mm³.\n\nIll-appearing children of any age → immediate sepsis pathway regardless of immunisation status. Management cards and drug doses adapt to the data entered.',
  lastUpdated: '2026',
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
    ], info: 'CRP only contributes to the risk score in infants < 90 days, where it is validated. In 3–36 months it is NOT a recommended risk marker (well-appearing immunised children have <0.5% occult bacteraemia) — risk there is driven by appearance + UTI evaluation; WBC ≥ 15,000 is the adjunct if any blood test is considered.' },
    { id: 'vaccines',     questionText: 'Hib + Pneumococcal Vaccination Status', type: 'select', options: [
      { label: 'Complete / up-to-date',      value: 'complete',   score: 0 },
      { label: 'Incomplete or unknown',      value: 'incomplete', score: 1 },
    ], info: 'Complete = ≥ 3 doses PCV13 + ≥ 2 doses Hib (or ≥ 2 PCV13 for infants 4–6 months). Incomplete = anything less, including 1-dose infants and all unimmunised children — herd immunity helps but does not remove bacteraemia risk.' },
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

    // ── History-tab inputs (booleans keyed by historyChecklist id) — now scored ──
    const petechiae         = data.petechiae === true;
    const immunocompromised = data.immunocompromised === true;
    const hsvRisk           = data.hsv_risk === true;
    const noVaccines        = data.no_vaccines === true;
    const priorUti          = data.prior_uti === true;
    const premature         = data.premature === true;
    const recentAbx         = data.recent_abx === true;
    const sourceFound       = data.source_found === true;
    const urineSymptoms     = data.urine_symptoms === true;
    const kawasaki          = data.kawasaki_risk === true;

    const details: string[] = [];

    // Auto-derived age group label
    const agGroupLabel: Record<string, string> = {
      neonate: 'Neonate (< 1 month / ≤ 28 days)',
      inf1: 'Young infant (1–2 months / ~29–60 days)',
      inf2: 'Young infant (2–3 months / ~61–90 days)',
      tod:  'Infant/toddler (3–36 months)',
      older:'Child > 36 months',
    };
    if (data.ageMonths) {
      details.push(`Age: ${ageLabel(data)} → ${agGroupLabel[ag] ?? ag}`);
    }

    if (sourceFound) {
      details.push('Source identified on history/exam — strictly no longer "fever WITHOUT source". Manage that source; use this pathway only as a sepsis safety-net.');
    }

    // ── Hard red flags (History or Assess) — force SEVERE regardless of score ──
    if (petechiae) {
      details.unshift('PETECHIAE / NON-BLANCHING RASH + fever → treat as MENINGOCOCCAEMIA. Ceftriaxone IV now — do NOT wait for LP.');
      return { level: 'severe', scoreDetails: { systemName: 'FWS Risk', totalScore: 14, maxScore: 14, interpretation: 'Petechiae + fever — Critical' }, details };
    }
    if (ag === 'neonate' && temp !== 'none' && temp !== undefined) {
      details.unshift('NEONATAL FEVER — medical emergency. Full sepsis workup and empiric antibiotics mandatory. Admit.');
      if (hsvRisk) details.push('HSV risk flagged on history — add IV Acyclovir to the empiric regimen.');
      return { level: 'severe', scoreDetails: { systemName: 'FWS Risk', totalScore: 14, maxScore: 14, interpretation: 'Neonatal Fever — Always High Risk' }, details };
    }
    if (immunocompromised) {
      details.unshift('IMMUNOCOMPROMISED + fever → full workup + broad-spectrum anti-Pseudomonal cover; admit. Never discharge.');
      return { level: 'severe', scoreDetails: { systemName: 'FWS Risk', totalScore: 13, maxScore: 14, interpretation: 'Immunocompromised — High Risk' }, details };
    }
    if (appearance === 'ill') {
      details.unshift('ILL-APPEARING CHILD — treat as serious bacterial infection until proven otherwise. Full sepsis workup.');
      return { level: 'severe', scoreDetails: { systemName: 'FWS Risk', totalScore: 12, maxScore: 14, interpretation: 'Toxic Appearance — High Risk' }, details };
    }

    // CRP is a validated risk marker ONLY in young infants < 90 days (AAP 2021 / Step-by-Step).
    // In 3–36 months, well-appearing immunised children have ~0.25–0.5% occult bacteraemia and
    // CRP is explicitly NOT recommended for risk stratification — risk is driven by appearance,
    // UTI evaluation, temperature, vaccination and the history red flags (Baraff / Texas Children's / Wilkinson).
    const markersValidated = ag === 'inf1' || ag === 'inf2';
    const vaxRisk = vax === 'incomplete' || noVaccines;

    // ── Composite score (well-appearing) — Assess + History both contribute ──
    let score = 0;
    if (temp === 'high')  score += 2;
    if (temp === 'vhigh') score += 3;
    if (ua === 'pos')     score += 3;
    if (vaxRisk)          score += 1;
    if (priorUti)         score += 1;
    if (urineSymptoms)    score += 2;
    if (recentAbx)        score += 1;
    if (premature && ag !== 'older') score += 1;
    if (markersValidated) {
      if (crp === 'bord')  score += 1;
      if (crp === 'high')  score += 2;
      if (crp === 'vhigh') score += 3;
    }

    // Age-specific UTI risk (female <24m, uncircumcised male <12m)
    const utiRiskAge = (sex === 'female' && (ag === 'inf1' || ag === 'inf2' || ag === 'tod')) ||
                       (sex === 'munC' && (ag === 'inf1' || ag === 'inf2'));

    // ── Transparency: show every contributor that fired ──────────────────────
    if (utiRiskAge && ua !== 'pos') details.push('UTI risk age — catheter UA + culture mandatory (female ≤ 24 m or uncircumcised male ≤ 12 m).');
    if (ua === 'pos') details.push('Positive UA (+3) — UTI likely. Start antibiotics after urine culture collected.');
    if (urineSymptoms) details.push('Urinary symptoms (+2) — send catheter urine culture even if dipstick equivocal.');
    if (priorUti) details.push('Prior UTI / tract abnormality (+1) — higher recurrence risk.');
    if (vaxRisk) details.push('Incomplete / unknown Hib + PCV (+1) — occult bacteraemia risk higher than expected for age.');
    if (recentAbx) details.push('Antibiotics within 2 weeks (+1) — may mask signs and sterilise cultures; lower threshold to treat/admit.');
    if (premature && ag !== 'older') details.push('Premature (+1) — risk-stratify as a chronologically younger infant.');
    if (markersValidated && (crp === 'high' || crp === 'vhigh')) details.push('Elevated CRP — increased IBI risk in this < 90 day infant.');
    if (!markersValidated && (ag === 'tod' || ag === 'older') && (crp === 'high' || crp === 'vhigh')) details.push('CRP is NOT a validated marker in 3–36 months and does NOT change the score — use appearance + UTI evaluation (WBC ≥ 15,000/mm³ is the adjunct if a CBC is sent).');
    if (kawasaki) details.push('Fever ≥ 5 days — actively exclude Kawasaki disease (≥ 4 of 5 clinical criteria; echocardiogram if met).');

    let level: SeverityLevel;
    let interpretation: string;

    const isYoungInf = markersValidated;            // < 90 days
    const isOlder    = ag === 'tod' || ag === 'older'; // ≥ 90 days, well-appearing

    if (isYoungInf && (ua === 'pos' || crp === 'high' || crp === 'vhigh')) {
      // < 90 days: a UTI or raised marker mandates admission + parenteral antibiotics
      level = 'severe';
      interpretation = ua === 'pos' ? 'UTI < 90 days — ADMIT (parenteral)' : 'Raised CRP < 90 days — ADMIT';
      details.unshift(ua === 'pos'
        ? 'HIGH RISK — young infant (< 90 d) with positive UA: UTI requiring PARENTERAL antibiotics + ADMISSION. Oral / outpatient is NOT appropriate under 90 days, regardless of the numeric total.'
        : 'HIGH RISK — young infant (< 90 d) with raised CRP: blood culture ± LP, parenteral antibiotics + admission.');
    } else if (isOlder && ua === 'pos') {
      // Well-appearing child ≥ 90 days with positive UA = UTI — usually outpatient-treatable
      level = 'moderate';
      interpretation = 'UTI (well-appearing) — treat; outpatient possible';
      details.unshift('UTI LIKELY — positive UA in a well-appearing child ≥ 90 days. Treat as a UTI: ORAL antibiotics, OUTPATIENT acceptable if tolerating fluids + reliable follow-up. Admit only if not tolerating oral, dehydrated, or no follow-up.');
    } else if (isYoungInf && score >= 5) {
      level = 'severe';
      interpretation = 'High Risk (young infant) — admit';
      details.unshift('HIGH RISK — young infant with multiple risk factors: blood culture, parenteral antibiotics + admission.');
    } else if (score >= 2 || utiRiskAge || kawasaki || isYoungInf) {
      level = 'moderate';
      interpretation = 'Intermediate Risk — targeted workup';
      details.unshift('INTERMEDIATE RISK — targeted investigations before any discharge decision.');
    } else {
      level = 'mild';
      interpretation = 'Low Risk — discharge with safety-net';
      details.unshift('LOW RISK — well-appearing, no concerning features. Supportive care + safety netting.');
    }

    return {
      level,
      scoreDetails: {
        systemName: 'FWS Risk Score',
        totalScore: score,
        maxScore: 14,
        interpretation,
        referenceTable: [
          { range: '0–1', meaning: 'Low Risk' },
          { range: '2–4', meaning: 'Intermediate' },
          { range: '5+',  meaning: 'High Risk' },
        ],
      },
      details,
    };
  },

  getInvestigations: (severity, data) => {
    const ag     = deriveAgeGroup(data);
    const sex    = data.sex as string;
    const vax    = data.vaccines as string;
    const ageM   = Number(data.ageMonths) || 0;
    const noVac  = data.no_vaccines === true;
    const hsvRisk     = data.hsv_risk === true;
    const petechiae   = data.petechiae === true;
    const priorUti    = data.prior_uti === true;
    const urineSymp   = data.urine_symptoms === true;
    const vaxIncomplete = vax === 'incomplete' || noVac;

    const result: ErInvestigation[] = [];

    // Always — bedside triage
    result.push({
      test: 'Temperature — rectal thermometer',
      category: 'urgent',
      indication: ag === 'neonate' || ag === 'inf1' || ag === 'inf2'
        ? 'Rectal mandatory in all infants < 3 months. Fever = ≥ 38.0°C.'
        : 'Fever of concern in 3–36 months = ≥ 39.0°C rectal. Axillary/tympanic underestimate.',
    });
    result.push({
      test: 'SpO₂ + HR continuous monitoring',
      category: 'urgent',
      indication: 'Tachycardia disproportionate to fever = early sepsis. SpO₂ < 94% = respiratory source or sepsis.',
    });
    result.push({
      test: 'Bedside blood glucose',
      category: 'urgent',
      indication: 'Young children are hypoglycaemia-prone during fever. Correct immediately if < 60 mg/dL.',
    });

    if (petechiae) {
      result.unshift({
        test: '🔴 CEFTRIAXONE IV — GIVE NOW before any other investigation',
        category: 'urgent',
        indication: 'Petechiae + fever = meningococcaemia until proven otherwise. Do NOT wait for LP, blood culture, or lab results.',
        criticalValue: 'Call senior + PICU immediately',
      });
    }

    // ── NEONATE (≤ 28 days) ──────────────────────────────────────────────────
    if (ag === 'neonate') {
      result.push({ test: 'Blood culture × 1 (before antibiotics)', category: 'blood', indication: 'Mandatory — ALL neonates with fever ≥ 38.0°C, regardless of appearance.', criticalValue: 'Do not delay first antibiotic dose > 15 min for culture draw' });
      result.push({ test: 'CBC + differential', category: 'blood', indication: 'Baseline WBC and ANC. Neutropenia (ANC < 500) = febrile neutropenia emergency.' });
      result.push({ test: 'CRP', category: 'blood', indication: 'Inflammatory baseline. Less reliable in first 6–12 h of illness.' });
      result.push({ test: 'Venous blood gas + lactate', category: 'blood', indication: 'Mandatory in neonates. Metabolic acidosis = organ dysfunction.', criticalValue: 'Lactate ≥ 4 mmol/L → septic shock protocol + PICU notification' });
      result.push({ test: 'Catheter urine: UA dipstick + culture', category: 'blood', indication: 'Mandatory — ALL neonates. Never use bag urine for culture.', criticalValue: 'Positive UA → start antibiotics immediately; culture guides switch' });
      result.push({ test: 'LP — CSF: analysis, culture, glucose, protein', category: 'blood', indication: 'Mandatory in ALL neonates if haemodynamically stable. Give antibiotics first if unstable; LP can follow.', criticalValue: 'Never delay antibiotics for LP if infant is haemodynamically unstable' });
      if (hsvRisk) result.push({ test: 'CSF HSV PCR (add to standard CSF tube)', category: 'blood', indication: '⚠ HSV risk flagged — send simultaneously with standard CSF. Start IV Acyclovir 20 mg/kg q8h immediately; do not wait for PCR result.', criticalValue: 'HSV encephalitis can present without skin lesions — treat empirically' });
    }

    // ── YOUNG INFANT 29–60 days ──────────────────────────────────────────────
    else if (ag === 'inf1') {
      result.push({ test: 'Blood culture × 1 (before antibiotics)', category: 'blood', indication: 'Mandatory — all 29–60 day infants with fever.', criticalValue: 'Do not delay first antibiotic dose > 15 min for culture draw' });
      result.push({ test: 'CBC + differential + ANC', category: 'blood', indication: 'ANC > 4,000/mm³ = elevated IBI risk (AAP 2021 / PECARN threshold for 29–60 day infants).', criticalValue: 'ANC > 4,000/mm³ → parenteral antibiotics + admission' });
      result.push({ test: 'CRP', category: 'blood', indication: 'CRP ≥ 20 mg/L = elevated IBI risk. Repeat at 6–12 h if < 20 and infant is in a borderline range — early CRP can be falsely reassuring.', criticalValue: 'CRP ≥ 20 mg/L → parenteral antibiotics + admission' });
      result.push({ test: 'Catheter urine: UA dipstick + culture', category: 'blood', indication: 'Mandatory — ALL 29–60 day infants regardless of sex or symptoms. Never bag urine for culture.', criticalValue: 'Positive UA → parenteral antibiotics (not oral) + admit in this age group' });
      result.push({ test: 'LP — CSF: analysis + culture', category: 'blood', indication: 'Perform if: CRP ≥ 20 mg/L, ANC > 4,000/mm³, positive UA, or any concern about appearance. If deferred, reassess decision at 4–6 h; do not discharge without LP or inpatient observation.', criticalValue: 'If LP deferred, admit for observation; do not discharge' });
      if (hsvRisk) result.push({ test: 'CSF HSV PCR + IV Acyclovir 20 mg/kg q8h', category: 'blood', indication: '⚠ HSV risk flagged — add PCR to CSF tube. Start Acyclovir immediately; do not wait for result.' });
    }

    // ── YOUNG INFANT 61–90 days ──────────────────────────────────────────────
    else if (ag === 'inf2') {
      result.push({ test: 'Catheter urine: UA dipstick + culture', category: 'blood', indication: 'Mandatory — ALL 61–90 day infants. Never bag urine for culture.', criticalValue: 'Positive UA in this age → admit for parenteral antibiotics' });
      result.push({ test: 'CRP + blood culture', category: 'blood', indication: 'Indicated if: fever ≥ 39°C, incomplete vaccines, or any clinical concern. CRP ≥ 20 mg/L = elevated risk. Draw blood culture simultaneously to avoid repeat venepuncture.', criticalValue: 'CRP ≥ 20 → parenteral antibiotics + admission' });
      result.push({ test: 'CBC + ANC', category: 'blood', indication: 'ANC > 4,000/mm³ = elevated IBI risk. Draw with blood culture.' });
      result.push({ test: 'LP — CSF: analysis + culture', category: 'blood', indication: 'Indicated if: appears unwell, CRP ≥ 20 mg/L, fever ≥ 40°C, or caregivers cannot reliably report change in appearance. NOT mandatory if all markers reassuring and infant is well-appearing.' });
    }

    // ── TODDLER 3–36 months ──────────────────────────────────────────────────
    else if (ag === 'tod') {
      const femaleLt24m  = sex === 'female' && ageM < 24;
      const uncircLt12m  = sex === 'munC'   && ageM < 12;
      const utiIndicated = femaleLt24m || uncircLt12m || urineSymp || priorUti;

      if (utiIndicated) {
        result.push({
          test: 'Catheter urine: UA dipstick + culture',
          category: 'blood',
          indication: femaleLt24m
            ? 'MANDATORY — females < 24 months have ≥ 5% UTI probability at fever ≥ 39°C (UTICalc). Never bag urine for culture.'
            : uncircLt12m
              ? 'MANDATORY — uncircumcised males < 12 months have UTI risk equivalent to febrile females. Never bag urine for culture.'
              : 'Indicated: urinary symptoms or prior UTI history present. Never bag urine for culture.',
          criticalValue: 'Positive UA → oral antibiotics (Cephalexin or Amox-Clav); admit if not tolerating orally or dehydrated',
        });
      } else {
        result.push({
          test: 'Catheter urine: UA — low priority in this profile',
          category: 'blood',
          indication: 'Not mandatory (circumcised male or female ≥ 24 months, no urinary symptoms, no prior UTI). Obtain if fever persists > 48 h or urinary symptoms develop.',
        });
      }

      if (vaxIncomplete) {
        result.push({
          test: 'CBC + differential + ANC',
          category: 'blood',
          indication: 'Incompletely immunised: WBC ≥ 15,000/mm³ = bacteraemia risk > 5%. ANC ≥ 10,000/mm³ is a better predictor of occult bacteraemia than WBC alone in the post-conjugate vaccine era.',
          criticalValue: 'WBC ≥ 15,000 or ANC ≥ 10,000 → blood culture + empiric IM ceftriaxone 50 mg/kg',
        });
        result.push({
          test: 'CRP',
          category: 'blood',
          indication: 'CRP > 20 mg/L in incompletely immunised child → empiric antibiotics. Used as procalcitonin surrogate (PCT not available at this facility). Sensitivity 74%, specificity 73% at 40 mg/L threshold.',
          criticalValue: 'CRP > 20 mg/L → IM ceftriaxone 50 mg/kg + discharge with 24 h follow-up',
        });
        result.push({
          test: 'Blood culture × 1 (draw with initial bloods)',
          category: 'blood',
          indication: 'Obtain when: WBC ≥ 15,000, ANC ≥ 10,000, or CRP > 20 mg/L. Draw simultaneously with CBC to avoid repeat venepuncture.',
          criticalValue: 'Most pathogens positive within 24–36 h on modern continuous monitoring systems',
        });
        result.push({
          test: 'CXR — ONLY if WBC ≥ 20,000/mm³',
          category: 'radiology',
          indication: 'Occult pneumonia found in 20–30% of febrile children with WBC ≥ 20,000/mm³ even without respiratory signs (Bachur et al.). NOT routine — only indicated with leukocytosis.',
          criticalValue: 'Infiltrate + WBC ≥ 20,000 → treat as bacterial pneumonia: oral amoxicillin 90 mg/kg/day (high-dose)',
        });
      } else {
        result.push({
          test: 'Blood tests (CBC / CRP / blood culture) — NOT indicated',
          category: 'other',
          indication: 'Fully immunised children 3–36 months have < 1% occult bacteraemia risk in the post-PCV13/Hib conjugate vaccine era. Blood studies are not recommended and would not change management.',
        });
      }

      result.push({
        test: 'CXR — only if respiratory symptoms present',
        category: 'radiology',
        indication: 'Not routine. Order if: SpO₂ < 95%, tachypnoea for age, retractions, grunting, or focal chest signs. Vaccinated well-appearing child without respiratory signs does not need CXR.',
      });
    }

    return result;
  },

  getManagement: (severity, data) => {
    const ag = deriveAgeGroup(data);
    const isNeonate    = ag === 'neonate';
    const isInf1       = ag === 'inf1';
    const isInf2       = ag === 'inf2';
    const isToddler    = ag === 'tod';
    const isYoungInf   = isInf1 || isInf2;
    const ua           = data.ua as string;
    const sex          = data.sex as string;

    // History/Assess inputs that drive the cards
    const petechiae        = data.petechiae === true;
    const immunocompromised= data.immunocompromised === true;
    const hsvRisk          = data.hsv_risk === true;
    const priorUti         = data.prior_uti === true;
    const urineSymptoms    = data.urine_symptoms === true;
    const sourceFound      = data.source_found === true;
    const kawasaki         = data.kawasaki_risk === true;
    const recentAbx        = data.recent_abx === true;
    const premature        = data.premature === true;

    // Drop falsy conditional entries so cards only show relevant lines
    const clean = (arr: (string | false | undefined | null)[]): string[] => arr.filter(Boolean) as string[];

    // ── Data-driven PRIORITY card — surfaces exactly what was entered ─────────
    const priorityActions = clean([
      sourceFound && 'SOURCE IDENTIFIED on history/exam — this is no longer "fever without source"; treat the identified source. Use the steps below only as a sepsis safety-net.',
      petechiae && '🔴 PETECHIAE / non-blanching rash + fever → Ceftriaxone IV NOW (meningococcaemia). Do not wait for LP or results.',
      immunocompromised && '🔴 IMMUNOCOMPROMISED → blood + urine + LP and broad-spectrum anti-Pseudomonal cover (Piperacillin-Tazobactam or Cefepime). Admit; never discharge.',
      hsvRisk && '🔴 HSV RISK → add IV Acyclovir 20 mg/kg/dose q8h; send CSF HSV PCR.',
      (urineSymptoms || priorUti) && 'Urinary symptoms / prior UTI → catheter urine culture mandatory even if dipstick borderline.',
      kawasaki && 'FEVER ≥ 5 DAYS → screen for Kawasaki disease (rash, conjunctivitis, lip/oral changes, extremity changes, cervical node); ESR + CRP, echocardiogram if criteria met.',
      recentAbx && 'Recent antibiotics (≤ 2 weeks) → may mask signs / sterilise cultures; lower threshold to treat and admit.',
      premature && ag !== 'older' && 'Premature (< 37 wk, corrected age ≤ 3 m) → risk-stratify as a chronologically younger infant.',
    ]);
    const priorityCard = priorityActions.length
      ? [{ title: 'PRIORITY — flags from Assess / History', recommendations: priorityActions }]
      : [];

    // ── Age-specific Step 1 text ────────────────────────────────────────────
    const step1Recs = isNeonate ? clean([
      'FULL SEPSIS WORKUP — mandatory for ALL neonates with fever ≥ 38.0°C, regardless of appearance.',
      'Obtain: Blood culture (before antibiotics) + CBC + CRP + Blood gas.',
      'Catheterised urine: UA + urine culture.',
      'LP (CSF analysis + culture) — do immediately if haemodynamically stable. Do NOT delay antibiotics for LP if unstable.',
      'IV access (peripheral, do not delay for umbilical line).',
      'Bedside glucose now.',
      hsvRisk ? '⚠ HSV RISK PRESENT — add IV Acyclovir 20 mg/kg/dose q8h immediately.' : 'Ask specifically about HSV risk (maternal herpes, vesicles on infant) — if any concern, add Acyclovir.',
      'Start empiric antibiotics within 30 min — see Drugs tab.',
    ]) : isInf1 ? clean([
      'Well-appearing 29–60 day infant with fever requires a structured workup regardless of appearance.',
      'Obtain: Blood culture + CBC (with ANC) + CRP. (Procalcitonin not available here — rely on CRP + ANC + serial assessment.)',
      'Catheterised urine: UA + urine culture (mandatory in this age group).',
      'LP: perform if CRP ≥ 20, ANC > 4,000, positive UA, or any change in appearance. If LP not done, reassess decision at 4–6 h.',
      'Bedside glucose.',
    ]) : isInf2 ? clean([
      'Well-appearing 61–90 day infant with fever: risk is lower than 29–60d but workup still recommended.',
      'Obtain: UA + urine culture (catheterised) — mandatory.',
      'CRP + blood culture if: fever ≥ 39°C, CRP not yet done, incomplete vaccines, or any concern.',
      'LP only if: appears unwell, CRP ≥ 20, fever ≥ 40°C, or parents are unable to describe appearance change.',
      'Bedside glucose.',
    ]) : clean([
      'Well-appearing child 3–36 months: UA is the most important immediate investigation. In a fully immunised well-appearing child, occult bacteraemia is <0.5% — bloods/markers and empiric antibiotics are NOT routinely indicated.',
      sex === 'female' ? 'FEMALE ≤ 24 months — catheterised UA + urine culture is MANDATORY (UTI risk regardless of symptoms).' :
      sex === 'munC'   ? 'UNCIRCUMCISED MALE ≤ 12 months — catheterised UA + urine culture is MANDATORY.' :
      'UA if any urinary symptoms, prolonged fever (> 48 h), or temp ≥ 39°C without source.',
      'Blood culture only if: toxic-looking, OR temp ≥ 39°C + incomplete vaccines, OR WBC ≥ 15,000/mm³ (the evidence-based trigger in this age — CRP is NOT recommended for risk stratification here).',
      'No routine LP in well-appearing toddlers unless meningism, petechiae, or altered consciousness.',
    ]);

    // ── STEP 2 — age-aware (markers for < 90 d; appearance + UTI for 3–36 m) ──
    const STEP2_YOUNG = {
      title: 'STEP 2 — REASSESS at 1–2 h with results in hand (< 90 days)',
      recommendations: clean([
        'IMPROVED appearance + CRP/ANC not raised + UA negative → discharge pathway (Dispose tab) ONLY after senior review.',
        ua === 'pos' ? 'UA is POSITIVE here → UTI: parenteral antibiotics + admit (parenteral preferred < 90 days).'
                     : 'If UA POSITIVE → start antibiotics for UTI; if 29–60d treat parenterally.',
        'CRP ≥ 20 mg/L OR ANC > 4,000/mm³ → blood culture if not done + parenteral antibiotics + admit.',
        'APPEARANCE WORSENS at any point → STEP 3.',
        '⚠ Do NOT discharge a < 90 day infant on appearance alone — they can deteriorate rapidly.',
      ]),
    };
    const STEP2_TODDLER = {
      title: 'STEP 2 — REASSESS at 1–2 h (3–36 months)',
      recommendations: clean([
        'Re-examine APPEARANCE — in this age this is the decision driver, NOT blood markers (CRP is not used here).',
        ua === 'pos' ? 'UA is POSITIVE here → treat UTI: oral antibiotics if well + tolerating fluids; parenteral + admit if toxic or not tolerating oral.'
                     : 'UA result: positive → treat UTI; negative + child remains well → no antibiotics indicated.',
        'STILL WELL-APPEARING + UA negative → discharge with safety-netting (Dispose tab). Bloods/cultures NOT required in a fully immunised well child.',
        'WBC ≥ 15,000/mm³ (only if a CBC was actually sent) → consider blood culture ± empiric ceftriaxone; otherwise observe.',
        'APPEARANCE WORSENS → STEP 3.',
      ]),
    };
    const STEP2 = (isNeonate || isYoungInf) ? STEP2_YOUNG : STEP2_TODDLER;

    const STEP3_ESCALATION = {
      title: 'STEP 3 — ESCALATION: Worsening appearance or concerning results after initial workup',
      recommendations: clean([
        '1. CALL SENIOR — escalating fever + worsening appearance in a young infant must be reviewed by a consultant.',
        '2. ANTIBIOTICS: ensure the FIRST-LINE empiric antibiotic has been given without delay (see Drugs tab). Any broadening of cover is a senior / PICU decision under the local sepsis protocol — it is not initiated from this ER pathway.',
        hsvRisk && '2b. HSV risk flagged → ensure IV Acyclovir is running.',
        '3. REPEAT BLOOD GAS + LACTATE — metabolic acidosis or lactate > 2 mmol/L = sepsis → SEPTIC SHOCK PROTOCOL.',
        '4. IV FLUID: if any signs of dehydration or poor perfusion → 10 mL/kg isotonic crystalloid bolus (reassess after each).',
        '5. If LP not yet performed and meningitis now suspected → CSF now (if stable) or give antibiotics and LP later.',
        '6. PICU NOTIFICATION if: altered consciousness, apnoea, haemodynamic instability, or persistent fever with worsening markers despite antibiotics.',
      ]),
    };

    const STEP4_FAILURE = {
      title: 'STEP 4 — Life-threatening: Meningitis / Sepsis / Septic Shock',
      recommendations: clean([
        'RECOGNISE: altered consciousness, apnoea, petechiae/purpura, haemodynamic instability, seizure, bulging fontanelle.',
        'SENIOR + PICU at bedside NOW.',
        'If Meningococcemia suspected (petechiae + fever) → Ceftriaxone IV push without any delay — do NOT wait.',
        'Bacterial meningitis → Dexamethasone 0.15 mg/kg IV before or with first antibiotic dose (reduces neurological sequelae in H. influenzae and pneumococcal meningitis). NOT recommended in neonates / infants < 6 weeks.',
        'Haemodynamic compromise → follow SEPTIC SHOCK PROTOCOL: fluid bolus 10–20 mL/kg + vasopressors (see Septic Shock protocol).',
        'Neonatal HSV encephalitis (seizure + vesicles + fever) → IV Acyclovir 20 mg/kg q8h; CSF HSV PCR; MRI brain.',
        'Seizure management: benzodiazepine first-line (see Status Epilepticus protocol if prolonged).',
      ]),
    };

    switch (severity.level) {
      case 'severe':
        return [
          ...priorityCard,
          {
            title: `STEP 1 — Immediate: Full Workup + Empiric Antibiotics${isNeonate ? ' (NEONATE)' : isYoungInf ? ' (Young Infant)' : ''}`,
            recommendations: step1Recs,
          },
          STEP2,
          STEP3_ESCALATION,
          STEP4_FAILURE,
        ];

      case 'moderate':
        return [
          ...priorityCard,
          {
            title: `STEP 1 — Targeted Workup: Intermediate Risk${isInf2 ? ' (61–90 days)' : isToddler ? ' (3–36 months)' : ''}`,
            recommendations: step1Recs,
          },
          STEP2,
          STEP3_ESCALATION,
          STEP4_FAILURE,
        ];

      case 'mild':
        return [
          ...priorityCard,
          {
            title: 'STEP 1 — Low Risk: Supportive Care',
            recommendations: clean([
              'Antipyretics — paracetamol 15 mg/kg now if distressed by fever. Ibuprofen if ≥ 6 months and drinking well.',
              sex === 'female' ? 'Female ≤ 24 months — still send catheterised UA + culture (UTI risk age even in low-risk group).' : 'Low threshold to send UA given age; otherwise no routine bloods.',
              'No routine blood tests or antibiotics for a low-risk well-appearing child.',
              'Observe in ER for 1–2 h before discharge decision.',
            ]),
          },
          STEP2,
          STEP3_ESCALATION,
        ];

      default:
        return [
          { title: 'Complete the Assess tab', recommendations: ['Enter age, appearance and any available results to generate management steps.'] },
        ];
    }
  },

  getDisposition: (severity, data) => {
    const ag = deriveAgeGroup(data);
    const ua = data.ua as string;
    const isYoungInf = ag === 'inf1' || ag === 'inf2';
    const isOlder = ag === 'tod' || ag === 'older';
    const reliableFu = data.reliable_fu === true || data.reliableFollowup === true;

    if (severity.level === 'severe') {
      if (ag === 'neonate') return ['ADMIT — all neonates with fever: full sepsis workup + parenteral empiric antibiotics, regardless of appearance. Never discharge.'];
      if (isYoungInf && ua === 'pos') return ['ADMIT — young infant (< 90 days) UTI: parenteral antibiotics + inpatient care. Outpatient is NOT appropriate in this age.'];
      return ['ADMIT — high-risk / ill-appearing: parenteral antibiotics + full workup. PICU if haemodynamically unstable.'];
    }
    if (severity.level === 'moderate') {
      if (isOlder && ua === 'pos') {
        return [reliableFu
          ? 'OUTPATIENT — well-appearing UTI: start oral antibiotics, discharge with urine-culture follow-up and 24–48 h review. Admit only if unable to tolerate oral or dehydrated.'
          : 'Treat UTI (oral first-line). OUTPATIENT acceptable ONLY if tolerating fluids AND a reliable 24–48 h follow-up is arranged — otherwise admit for parenteral antibiotics.'];
      }
      if (isYoungInf) return ['Young infant: complete targeted workup. Admit or observe; outpatient only after senior review with reassuring markers AND guaranteed 12–24 h follow-up.'];
      return ['Targeted (UA-led) workup. OUTPATIENT acceptable if well-appearing, UA negative or UTI treated orally, and 24–48 h follow-up is confirmed; otherwise observe / admit.'];
    }
    return ['DISCHARGE home with safety-netting advice and a documented 24–48 h follow-up.'];
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
      const ampMg  = Math.min(50 * wt, 2000).toFixed(0);
      const ampMgMening = Math.min(100 * wt, 2000).toFixed(0);
      const gentMg = (4 * wt).toFixed(1);
      const cefotMg= Math.min(50 * wt, 2000).toFixed(0);
      const acycMg = (20 * wt).toFixed(0);
      doses.push({
        drugName: 'Ampicillin (IV) — Neonatal first-line',
        dose: `${ampMg} mg IV (50 mg/kg) every 12 h (age 0–7 days) or every 8 h (age > 7 days)`,
        notes: `Covers Group B Strep + Listeria. Mandatory component of neonatal empiric regimen. If meningitis confirmed on CSF: escalate to ${ampMgMening} mg (100 mg/kg) every 8 h (0–7 days) or every 6 h (> 7 days).`,
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
    { title: 'Baraff LJ et al. Practice guideline for the management of infants and children 0–36 months with fever without source. Ann Emerg Med 1993;22:1198', url: 'https://pubmed.ncbi.nlm.nih.gov/8517544/' },
    { title: 'Baraff LJ. Management of fever without source in infants and children. Ann Emerg Med 2000;36:602', url: 'https://pubmed.ncbi.nlm.nih.gov/11097703/' },
    { title: 'Greenhow TL et al. Bacteremia in Children 3 to 36 Months Old After Introduction of Conjugated Pneumococcal Vaccines. Pediatrics 2017;139', url: 'https://pubmed.ncbi.nlm.nih.gov/27940782/' },
    { title: 'Gomez B et al. PECARN/MVCRC/PRIS — Validation of the Step-by-Step Approach for febrile infants. Pediatrics 2016', url: 'https://pubmed.ncbi.nlm.nih.gov/27244862/' },
    { title: 'Yo CH et al. Procalcitonin vs CRP vs leukocytosis for serious bacterial infections in children with FWS: systematic review. Ann Emerg Med 2012;60:591', url: 'https://pubmed.ncbi.nlm.nih.gov/22578484/' },
    { title: 'NICE Guideline NG143 — Fever in under 5s: assessment and initial management (2021)', url: 'https://www.nice.org.uk/guidance/ng143' },
    { title: 'Roberts KB. AAP Subcommittee — Urinary Tract Infection: Clinical Practice Guideline. Pediatrics 2011 (reaffirmed 2016)', url: 'https://publications.aap.org/pediatrics/article/128/3/595/30724' },
    { title: 'Nigrovic LE et al. — Risk factors for bacterial meningitis in children with CSF pleocytosis. Pediatrics 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/18381510/' },
  ],
};
