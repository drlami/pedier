import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'drooling',     question: 'Drooling or unable to swallow secretions?', redFlag: true,  ifYes: 'Classic sign of epiglottitis. DO NOT examine the throat. Call anaesthesia + ENT immediately.' },
    { id: 'tripod',       question: 'Tripod or sniffing position (leaning forward, neck extended)?', redFlag: true, ifYes: 'Child instinctively maximises airway diameter. Moving from this position can precipitate obstruction. Do not reposition.' },
    { id: 'muffled_voice',question: 'Muffled or "hot potato" voice / high-pitched cry?', redFlag: true,  ifYes: 'Swollen supraglottic structures. Confirms supraglottitis. No throat examination.' },
    { id: 'toxic',        question: 'Toxic/septic appearance — very high fever, grey pallor, extreme distress?', redFlag: true, ifYes: 'Bacteraemic epiglottitis — systemic sepsis. Blood cultures and IV antibiotics after airway secured.' },
    { id: 'rapid_onset',  question: 'Rapid onset over hours (not days) with high fever and sore throat?', redFlag: true, ifYes: 'Epiglottitis is characteristically abrupt. Slow onset suggests croup, retropharyngeal abscess, or peritonsillar abscess.' },
    { id: 'no_croup_prod',question: 'No preceding barky cough or croup-like prodrome?', redFlag: false, ifYes: 'Absence of barky cough supports epiglottitis over croup.' },
    { id: 'unvaccinated', question: 'Incomplete Hib vaccination or unknown immunisation status?', ifYes: 'Epiglottitis in vaccinated children is rare. Unvaccinated or immunocompromised children remain at risk. Other organisms (Strep, Staph) also cause epiglottitis regardless of vaccine.' },
  ],

  investigations: [
    { test: 'ALL INVESTIGATIONS ARE DEFERRED until airway is secured', category: 'urgent', indication: 'Any investigation that agitates the child (blood draw, throat exam, lying supine for X-ray) risks precipitating complete obstruction. Call airway team FIRST.', criticalValue: 'If child deteriorates or obstructs → jaw thrust + bag-mask ventilation + emergency surgical airway.' },
    { test: 'Lateral neck X-ray', category: 'radiology', indication: 'Only if diagnosis uncertain AND child is stable with airway team present. NOT performed alone or before calling for help. Classic finding: "thumb sign" — swollen epiglottis on lateral view.', criticalValue: '"Thumb sign" = confirmed epiglottitis. OR immediately.' },
    { test: 'Blood culture × 2', category: 'blood', indication: 'After airway secured — before starting antibiotics. Bacteraemia occurs in ~25% of cases (Hib most common if unvaccinated; Strep / Staph in vaccinated).', criticalValue: 'Positive culture guides antibiotic narrowing and duration.' },
    { test: 'FBC + CRP + U&E', category: 'blood', indication: 'After intubation — baseline inflammatory markers, electrolytes for fluid management.' },
  ],

  admissionCriteria: [
    'ALL cases of suspected epiglottitis are admitted — PICU / ICU mandatory',
    'No exceptions: even a "mild" presentation can obstruct within minutes',
  ],

  highRiskFactors: [
    'Unvaccinated or incompletely vaccinated (Hib)',
    'Immunocompromised',
    'Severe toxic appearance',
    'Any stridor at rest',
  ],

  dischargeCriteria: [
    'Epiglottitis is NEVER discharged from the ER — all cases go to PICU',
  ],

  safetyNetting: [
    'This is a life-threatening emergency — there are no home instructions until the child is discharged from PICU after full recovery.',
    'Families should be informed: this is a bacterial infection; with early airway management and antibiotics, full recovery is expected.',
    'After discharge from PICU: complete antibiotic course, Hib vaccination catch-up if not fully immunised, ENT follow-up in 4–6 weeks.',
  ],
};

export const epiglottitisProtocol: DiseaseProtocol = {
  id: 'epiglottitis',
  name: 'Epiglottitis (Supraglottitis)',
  system: 'Respiratory System',
  description: 'Acute epiglottitis is a life-threatening airway emergency. Diagnosis is clinical. The only correct action is to call the airway team immediately and keep the child calm.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/epiglottitis/600/400', hint: 'airway xray' },
  erData,

  questions: [
    { id: 'weight',     questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'drooling',   questionText: 'Drooling or unable to swallow secretions?',  type: 'boolean', questionGroup: 'suspicion' },
    { id: 'dysphonia',  questionText: 'Muffled / "hot potato" voice?',               type: 'boolean', questionGroup: 'suspicion' },
    { id: 'tripod',     questionText: 'Tripod or sniffing position?',                type: 'boolean', questionGroup: 'suspicion' },
    { id: 'toxic',      questionText: 'Toxic / anxious / septic appearance?',        type: 'boolean', questionGroup: 'suspicion' },
    { id: 'distress',   questionText: 'Active respiratory distress or stridor?',     type: 'boolean', questionGroup: 'suspicion' },
    { id: 'fever',      questionText: 'High fever (> 38.5°C) with sore throat?',    type: 'boolean', questionGroup: 'severity' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    // Weighted by specificity for epiglottitis
    let suspicionScore = 0;
    if (data.drooling)  { suspicionScore += 3; details.push('Drooling — unable to swallow secretions (pathognomonic).'); }
    if (data.dysphonia) { suspicionScore += 2; details.push('Muffled "hot potato" voice — supraglottic oedema.'); }
    if (data.tripod)    { suspicionScore += 2; details.push('Tripod / sniffing position — maximising airway diameter.'); }
    if (data.toxic)     { suspicionScore += 1; details.push('Toxic / septic appearance.'); }
    if (data.distress)  { suspicionScore += 1; details.push('Active stridor / respiratory distress.'); }

    const suspicionAnswered =
      [data.drooling, data.dysphonia, data.tripod, data.toxic, data.distress]
        .filter(v => v !== undefined).length;

    // high ≥3 (any 1 specific feature, or 3+ nonspecific)
    // moderate 1–2 (only nonspecific features like distress / toxic alone)
    // low 0
    const diagnosticConfidence =
      suspicionAnswered === 0 ? undefined
      : suspicionScore >= 3  ? 'high'
      : suspicionScore >= 1  ? 'moderate'
      : 'low' as const;

    if (diagnosticConfidence === 'high') {
      details.unshift('CALL AIRWAY TEAM NOW: Anaesthesia + ENT + PICU. Do not examine throat or agitate child.');
    } else if (diagnosticConfidence === 'moderate') {
      details.unshift('Alert anaesthesia + ENT. Maintain position of comfort. Do NOT examine throat until team arrives.');
    }

    return {
      level:
        diagnosticConfidence === 'high'     ? 'impending respiratory failure'
        : diagnosticConfidence === 'moderate' ? 'severe'
        : 'moderate',
      scoreDetails: {
        systemName: 'Epiglottitis Clinical Risk',
        totalScore: suspicionScore,
        maxScore: 9,
        interpretation:
          diagnosticConfidence === 'high'     ? 'CRITICAL AIRWAY EMERGENCY — OR immediately'
          : diagnosticConfidence === 'moderate' ? 'MODERATE SUSPICION — Alert airway team, close monitoring'
          : diagnosticConfidence === 'low'      ? 'Low suspicion — reconsider diagnosis'
          : 'Answer questions above to assess',
        referenceTable: [
          { range: '≥ 3 (any specific feature)', meaning: 'HIGH — Airway emergency, OR immediately' },
          { range: '1 – 2 (nonspecific only)',   meaning: 'MODERATE — Alert team, monitor closely' },
          { range: '0',                          meaning: 'Low suspicion — consider Croup / viral LTB' },
        ],
      },
      details,
      diagnosticConfidence,
      alternativeProtocol: diagnosticConfidence === 'low'
        ? { id: 'croup', name: 'Croup (Laryngotracheitis)' }
        : undefined,
    };
  },

  getManagement: () => [
    {
      title: 'STEP 1 — Immediate: Position + Call team',
      recommendations: [
        'Keep child in position of comfort — ideally on parent\'s lap, leaning forward.',
        'DO NOT examine the throat or use a tongue depressor.',
        'DO NOT attempt IV access, blood draws, or monitoring leads while child is agitated.',
        'Blow-by O₂ ONLY if child tolerates it without distress — do not force.',
        'Call SIMULTANEOUSLY: Anaesthesia + ENT + PICU senior.',
        'Prepare difficult airway trolley and surgical airway equipment (scalpel, 14G cannula).',
        'Alert operating theatre.',
      ],
    },
    {
      title: 'STEP 2 — REASSESS: Is child maintaining airway?',
      recommendations: [
        'Child alert, maintaining position, tolerable distress → controlled transfer to OR with parent.',
        'Deteriorating (increasing stridor, exhaustion, cyanosis) → STEP 3 now, do not wait for OR.',
        'If lateral neck X-ray absolutely required (diagnostic uncertainty + stable + team present): obtain in sitting position only — never lying supine.',
      ],
    },
    {
      title: 'STEP 3 — ESCALATION: Controlled intubation in OR',
      recommendations: [
        'Gas induction by senior anaesthetist — inhalational technique preferred (child breathing spontaneously until intubation).',
        'ENT surgeon scrubbed and ready for emergency tracheotomy / cricothyroidotomy.',
        'Anticipate difficult view — swollen epiglottis. Use video laryngoscope if available.',
        'Once intubated: IV access + blood culture × 2 → IV Ceftriaxone 100 mg/kg/day (max 4 g).',
        'Post-intubation: PICU for sedation, ventilation, and daily extubation assessment (typically 24–48 h).',
      ],
    },
    {
      title: 'STEP 4 — LIFE-THREATENING: Complete obstruction before OR',
      recommendations: [
        'Complete obstruction before team arrives or en route to OR.',
        'Jaw thrust + 2-person bag-mask ventilation — attempt oxygenation first.',
        'If unable to ventilate: laryngoscopy under basic intubation attempt by most senior clinician.',
        'If intubation fails: needle cricothyroidotomy (14G cannula through cricothyroid membrane) — jet ventilate at 15 L/min.',
        'Surgical airway (scalpel + bougie + tube) as last resort by ENT/surgeon.',
        'CALL A SECOND RESUSCITATION TEAM simultaneously.',
      ],
    },
  ],

  getDisposition: () => ['ALL cases: immediate PICU admission. No exceptions.'],

  getRedFlags: () => [
    'Drooling or inability to swallow',
    'Tripod / sniffing position',
    'Muffled "hot potato" voice',
    'Toxic / septic appearance',
    'Any stridor in a toxic child',
    'Rapid onset (hours) of high fever + sore throat',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      doses.push({ drugName: 'WARNING', dose: 'All drugs are given AFTER the airway is secured. No IV access before airway team present.' });
      return doses;
    }

    const ceftriaxone = Math.min(100 * wt, 4000).toFixed(0);
    const dex         = Math.min(0.15 * wt, 8).toFixed(1);
    const ketamine    = (1.5 * wt).toFixed(1);
    const rocuronium  = (1 * wt).toFixed(1);

    doses.push({ drugName: 'WARNING — airway first', dose: 'DO NOT give IV drugs before airway team has secured the airway', notes: 'Exception: blow-by O₂ and oral/nasal dexamethasone only if tolerated without agitation.' });
    doses.push({ drugName: 'Ceftriaxone IV (after intubation)', dose: `${ceftriaxone} mg OD (100 mg/kg/day, max 4 g)`, notes: '7–10 day course. Covers H. influenzae, S. pneumoniae, S. pyogenes. Adjust if cultures grow resistant organism.' });
    doses.push({ drugName: 'Dexamethasone IV (after intubation)', dose: `${dex} mg IV (0.15 mg/kg)`, notes: 'Reduces oedema post-intubation. Facilitates earlier extubation. Evidence limited but widely used.' });
    doses.push({ drugName: 'Ketamine IV (RSI induction if needed)', dose: `${ketamine} mg IV (1–2 mg/kg)`, notes: 'Maintains spontaneous respirations better than propofol. Use only in OR with surgical airway backup.' });
    doses.push({ drugName: 'Rocuronium IV (RSI paralytic)', dose: `${rocuronium} mg IV (1 mg/kg)`, notes: 'Sugammadex available for reversal. Only when intubation is expected to succeed.' });

    return doses;
  },

  getReferences: () => [
    { title: 'Sobol SE, Zapata S. — Epiglottitis and Croup. Otolaryngol Clin North Am 2008', url: 'https://doi.org/10.1016/j.otc.2007.11.010' },
    { title: 'Shah RK et al. — Epiglottitis in the Hib vaccine era. Laryngoscope 2004', url: 'https://doi.org/10.1097/00005537-200401000-00033' },
    { title: 'DAS (Difficult Airway Society) Guidelines 2015', url: 'https://www.das.uk.com/guidelines/das-intubation-guidelines' },
  ],
};
