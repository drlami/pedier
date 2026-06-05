import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'croup_then_toxic',  question: 'Initial croup-like illness now turning toxic — high fever, ill appearance?', redFlag: true,  ifYes: 'Classic progression: barky cough + stridor → apparent improvement → returns WORSE + toxic. This pattern is pathognomonic for bacterial tracheitis. PICU + airway team now.' },
    { id: 'rapid_progress',    question: 'Symptoms worsening over hours despite standard croup treatment?', redFlag: true,  ifYes: 'Failure to respond to nebulised epinephrine or steroids strongly favours tracheitis over viral croup.' },
    { id: 'purulent_cough',    question: 'Cough changed from barky to productive / purulent?', redFlag: true,  ifYes: 'Purulent tracheal secretions (pseudomembranes from Staph aureus) — pathognomonic if present. Confirms bacterial aetiology.' },
    { id: 'biphasic_stridor',  question: 'Stridor changed from inspiratory only to biphasic (in AND out)?', redFlag: true,  ifYes: 'Inspiratory stridor = supraglottic or glottic disease. Biphasic stridor = subglottic/tracheal involvement — confirms tracheitis pattern.' },
    { id: 'no_epi_response',   question: 'No or minimal improvement after nebulised epinephrine?', redFlag: true,  ifYes: 'Croup reliably responds to epinephrine; tracheitis does NOT. Failure of epinephrine = tracheitis until proven otherwise.' },
    { id: 'skin_infection',    question: 'Recent or concurrent skin / soft tissue infection?', ifYes: 'Staphylococcus aureus source. MRSA possible — adjust antibiotic choice to include Vancomycin.' },
    { id: 'influenza',         question: 'Preceding influenza illness (confirmed or suspected)?', ifYes: 'Post-influenza bacterial tracheitis is well-described. Staph aureus (including PVL-producing strains) is most common pathogen after influenza.' },
  ],

  investigations: [
    { test: 'AP + lateral neck X-ray', category: 'radiology', indication: 'If child is stable and can tolerate without agitation. Look for: subglottic narrowing ("steeple sign" — also seen in croup), irregular tracheal wall ("rat-tail" appearance), intraluminal membranes / debris.', criticalValue: '"Rat-tail" / irregular tracheal mucosa = confirms tracheitis. Thumb sign (enlarged epiglottis) = epiglottitis — change management pathway.' },
    { test: 'SpO₂ continuous monitoring', category: 'urgent', indication: 'All cases from initial assessment.', criticalValue: 'SpO₂ < 92% or rapid desaturation → immediate intubation regardless of clinical stability.' },
    { test: 'Blood culture × 2', category: 'blood', indication: 'IV access placement — take blood cultures BEFORE antibiotics. Bacteraemia in ~30% of cases.', criticalValue: 'Positive culture guides antibiotic narrowing. S. aureus (incl. MRSA) is the most common organism.' },
    { test: 'FBC + CRP + procalcitonin + U&E', category: 'blood', indication: 'After airway secured / stable. High WBC (> 20,000) + high CRP typical. Procalcitonin > 2 ng/mL confirms bacterial sepsis.', criticalValue: 'WBC > 30,000 = severe sepsis pattern. Blood culture + CRP guide step-down timing.' },
    { test: 'Tracheal culture (via bronchoscopy)', category: 'blood', indication: 'Definitive microbiological diagnosis. Obtain tracheal aspirate during bronchoscopy under GA — highest sensitivity.', criticalValue: 'Culture results guide antibiotic narrowing at 48 h. S. aureus MRSA → Vancomycin. Susceptible S. aureus → Flucloxacillin or Cefazolin.' },
  ],

  admissionCriteria: [
    'ALL suspected cases of bacterial tracheitis require PICU admission — NO EXCEPTIONS',
    'Most require intubation and mechanical ventilation (60–80%)',
    'All require IV antibiotics and bronchoscopy for tracheal toilet',
  ],

  highRiskFactors: [
    'All cases are high risk by definition',
    'Post-influenza onset (PVL Staph aureus risk)',
    'Concurrent skin/soft tissue infection (MRSA source)',
    'Immunocompromised',
    'Underlying subglottic stenosis (makes intubation harder)',
  ],

  dischargeCriteria: [
    'Bacterial tracheitis is NEVER discharged from ER — all go directly to PICU',
    'Discharge from PICU (not ER) when: extubated, afebrile 24 h, tolerating oral antibiotics, tracheal secretions resolved',
  ],

  safetyNetting: [
    'Bacterial tracheitis requires full PICU treatment — no home management instructions apply until discharge from PICU.',
    'After PICU discharge: complete full course of oral antibiotics (typically 10–14 days total).',
    'ENT follow-up 4–6 weeks post-discharge: assess trachea for subglottic stenosis (rare complication).',
    'If child develops recurrent stridor after recovery — needs ENT assessment for acquired subglottic stenosis.',
  ],
};

export const tracheitisProtocol: DiseaseProtocol = {
  id: 'tracheitis',
  name: 'Bacterial Tracheitis',
  system: 'Respiratory System',
  description: 'Bacterial tracheitis (pseudomembranous croup) is a rare but life-threatening airway infection. Presentation: croup-like prodrome then rapid deterioration with toxic appearance, purulent secretions, and failure to respond to epinephrine. All cases require PICU.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/tracheitis/600/400', hint: 'trachea xray' },
  erData,

  questions: [
    { id: 'weight',          questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    // ── Suspicion group: discriminating features of tracheitis vs viral croup ──
    { id: 'croupHistory',    questionText: 'Preceded by croup-like illness that is now worsening + turning toxic?', type: 'boolean', questionGroup: 'suspicion', info: 'Classic: barky cough + stridor → apparent brief improvement → rapid deterioration + high fever + ill appearance.' },
    { id: 'responseToEpi',   questionText: 'Response to nebulised epinephrine', type: 'select', questionGroup: 'suspicion', options: [
      { label: 'Not given',                value: 'none',          score: 0 },
      { label: 'Improved (croup pattern)', value: 'improved',      score: 0 },
      { label: 'No / minimal improvement', value: 'no_improvement',score: 3 },
    ]},
    { id: 'stridorType',     questionText: 'Stridor character', type: 'select', questionGroup: 'suspicion', options: [
      { label: 'Inspiratory only',                   value: 'inspiratory', score: 1 },
      { label: 'Biphasic (inspiratory + expiratory)', value: 'biphasic',   score: 3 },
    ]},
    { id: 'coughCharacter',  questionText: 'Cough character', type: 'select', questionGroup: 'suspicion', options: [
      { label: 'Barky / croup-like',    value: 'barky',      score: 1 },
      { label: 'Productive / purulent', value: 'productive', score: 3 },
    ]},
    { id: 'toxicAppearance', questionText: 'Toxic / septic appearance?', type: 'boolean', questionGroup: 'suspicion', info: 'High fever, poor perfusion, lethargy, extreme distress.' },
    // ── Severity group: how compromised is the airway right now ──
    { id: 'rapidProgression',questionText: 'Rapid progression — worsening over hours?', type: 'boolean', questionGroup: 'severity' },
    { id: 'airwayCompromise',questionText: 'Severe airway compromise — cyanosis, exhaustion, altered mental status?', type: 'boolean', questionGroup: 'severity' },
    { id: 'oxygenSaturation',questionText: 'SpO₂', type: 'number', unit: '%', questionGroup: 'severity' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const spo2 = Number(data.oxygenSaturation || 100);

    // ── Suspicion score (discriminates from viral croup) ──
    let suspicionScore = 0;
    if (data.croupHistory === true)               suspicionScore++;
    if (data.responseToEpi === 'no_improvement')  suspicionScore += 2;
    if (data.stridorType === 'biphasic')          suspicionScore += 2;
    if (data.coughCharacter === 'productive')     suspicionScore += 2;
    if (data.toxicAppearance === true)            suspicionScore++;

    const suspicionAnswered =
      [data.croupHistory, data.responseToEpi, data.stridorType, data.coughCharacter, data.toxicAppearance]
        .filter(v => v !== undefined).length;

    const diagnosticConfidence =
      suspicionAnswered === 0 ? undefined
      : suspicionScore >= 4   ? 'high'
      : suspicionScore >= 2   ? 'moderate'
      : 'low' as const;

    // ── Airway severity (how compromised right now) ──
    if (data.airwayCompromise === true || spo2 < 90) {
      details.push('SEVERE AIRWAY COMPROMISE — immediate intubation / airway team.');
      if (spo2 < 90) details.push(`SpO₂ ${spo2}% — critical hypoxaemia.`);
      return {
        level: 'impending respiratory failure',
        details,
        diagnosticConfidence,
        alternativeProtocol: diagnosticConfidence === 'low' ? { id: 'croup', name: 'Croup (Laryngotracheitis)' } : undefined,
      };
    }

    let severityScore = 0;
    if (data.toxicAppearance === true)            { severityScore += 2; details.push('Toxic appearance.'); }
    if (data.croupHistory === true)               { severityScore += 1; details.push('Croup prodrome → rapid deterioration.'); }
    if (data.stridorType === 'biphasic')          { severityScore += 3; details.push('Biphasic stridor — subglottic/tracheal involvement.'); }
    if (data.coughCharacter === 'productive')     { severityScore += 3; details.push('Purulent cough — pseudomembranes.'); }
    if (data.rapidProgression === true)           { severityScore += 2; details.push('Rapid progression.'); }
    if (data.responseToEpi === 'no_improvement')  { severityScore += 3; details.push('No response to epinephrine — NOT viral croup.'); }
    if (spo2 < 92)                                { severityScore += 2; details.push(`SpO₂ ${spo2}% — hypoxaemia.`); }

    if (suspicionScore >= 2) {
      details.unshift('BACTERIAL TRACHEITIS — call PICU + anaesthesia + ENT now.');
    }

    const level: SeverityLevel = severityScore >= 5 ? 'severe' : 'moderate';

    return {
      level,
      scoreDetails: {
        systemName: 'Tracheitis Severity Score',
        totalScore: severityScore,
        maxScore: 16,
        interpretation:
          diagnosticConfidence === 'low'   ? 'Low suspicion — consider viral croup'
          : level === 'severe'             ? 'High probability — immediate PICU'
          : 'Suspected tracheitis — urgent airway team',
      },
      details,
      diagnosticConfidence,
      alternativeProtocol: diagnosticConfidence === 'low' ? { id: 'croup', name: 'Croup (Laryngotracheitis)' } : undefined,
    };
  },

  getManagement: () => [
    {
      title: 'STEP 1 — Immediate: Airway team + position of comfort',
      recommendations: [
        'Keep child in position of comfort. Parent present. Minimise agitation.',
        'Blow-by O₂ only if tolerated — do not force mask.',
        'Call SIMULTANEOUSLY: PICU senior + Anaesthesia + ENT.',
        'Do NOT attempt IV access or monitoring leads while child is severely distressed — wait for airway team or go to OR.',
        'If child is stable enough: cautious IV access in a calm environment.',
        'Alert operating theatre — bronchoscopy + tracheal toilet will be needed.',
      ],
    },
    {
      title: 'STEP 2 — REASSESS: Can child tolerate IV access?',
      recommendations: [
        'Stable + team assembled → controlled transfer to OR for gas induction + bronchoscopy.',
        'Tolerating minimal interventions → IV access → blood culture × 2 → start IV antibiotics.',
        'Deteriorating (SpO₂ dropping, exhaustion, cyanosis) → STEP 3 immediately.',
        'Neck X-ray only if diagnostic uncertainty + child stable + airway team present.',
      ],
    },
    {
      title: 'STEP 3 — ESCALATION: Controlled intubation + bronchoscopy',
      recommendations: [
        'OR setting: gas induction by senior anaesthetist (maintain spontaneous ventilation until intubation).',
        'Intubate with ETT 0.5 mm smaller than calculated — subglottic oedema and pseudomembranes narrow airway.',
        'ENT / Pulmonology: rigid bronchoscopy + tracheal toilet (removal of pseudomembranes and thick secretions).',
        'Tracheal aspirate for culture DURING bronchoscopy — most reliable specimen.',
        'IV antibiotics: Ceftriaxone + Vancomycin (MRSA cover) within 30 min of intubation.',
        'Post-intubation: PICU, frequent tracheal suction (secretions can block ETT), daily extubation trials.',
        'Typical PICU duration: 3–7 days. Most extubate within 72 h.',
      ],
    },
    {
      title: 'STEP 4 — LIFE-THREATENING: Acute decompensation',
      recommendations: [
        'Complete obstruction before OR: jaw thrust + bag-mask ventilation attempt.',
        'Direct laryngoscopy + attempt intubation by most senior clinician.',
        'If intubation fails: needle cricothyroidotomy (14G cannula, jet ventilation).',
        'Surgical airway by ENT as last resort.',
        'Post-resuscitation: full PICU stabilisation, bronchoscopy once haemodynamically stable.',
      ],
    },
  ],

  getDisposition: () => [
    'ALL suspected or confirmed bacterial tracheitis cases go directly to PICU.',
    'Do not admit to general ward — these patients can obstruct suddenly.',
  ],

  getRedFlags: () => [
    'Croup that turns toxic — classic progression pattern',
    'Failure to respond to nebulised epinephrine',
    'Biphasic stridor (inspiratory + expiratory)',
    'Productive / purulent cough',
    'SpO₂ < 92% or rapidly falling',
    'Altered mental status or exhaustion',
    'Cyanosis',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const ceftriaxone = Math.min(100 * wt, 4000).toFixed(0);
    const vancoMin    = Math.min(40  * wt, 4000).toFixed(0);
    const vancoMax    = Math.min(60  * wt, 4000).toFixed(0);
    const fluclox     = Math.min(50  * wt, 2000).toFixed(0);
    const clinda      = Math.min(40  * wt, 2700).toFixed(0);
    const dex         = Math.min(0.15 * wt, 8).toFixed(1);

    doses.push({ drugName: 'Ceftriaxone IV (1st line)', dose: `${ceftriaxone} mg OD (100 mg/kg/day, max 4 g)`, notes: 'Covers Streptococcal and H. influenzae components. Combine with Vancomycin for MRSA cover.' });
    doses.push({ drugName: 'Vancomycin IV (MRSA cover)', dose: `${vancoMin}–${vancoMax} mg/day (40–60 mg/kg/day in 4 divided doses)`, notes: 'ESSENTIAL — S. aureus (including MRSA) is the dominant pathogen. Monitor trough levels. Adjust for renal function.' });
    doses.push({ drugName: 'Flucloxacillin IV (if MSSA confirmed)', dose: `${fluclox} mg q6h (50 mg/kg/dose, max 2 g q6h)`, notes: 'Step-down from Vancomycin once culture confirms MSSA (susceptible Staph aureus). More bactericidal against MSSA than Vancomycin.' });
    doses.push({ drugName: 'Clindamycin IV (toxin suppressor)', dose: `${clinda} mg/day (40 mg/kg/day divided q6–8h, max 2700 mg)`, notes: 'Consider adding if PVL-producing S. aureus or post-influenza presentation. Suppresses exotoxin production.' });
    doses.push({ drugName: 'Dexamethasone IV (adjunct for subglottic oedema)', dose: `${dex} mg q6h (0.15 mg/kg)`, notes: 'Not proven for tracheitis specifically but commonly used to reduce post-intubation oedema. Discuss with PICU team.' });

    return doses;
  },

  getReferences: () => [
    { title: 'Tebruegge M et al. — Bacterial tracheitis: a multi-centre perspective. Arch Dis Child 2009', url: 'https://doi.org/10.1136/adc.2008.151043' },
    { title: 'Hopkins A et al. — Presentations of group A Streptococcal and Staphylococcal tracheitis. Pediatrics 2006', url: 'https://doi.org/10.1542/peds.2005-2043' },
    { title: 'Casazza G, Graham ME — Bacterial Tracheitis. Ear Nose Throat J 2019', url: 'https://doi.org/10.1177/0145561319875711' },
  ],
};
