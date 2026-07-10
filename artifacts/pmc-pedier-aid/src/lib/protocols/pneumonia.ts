import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose, AdmitOverride } from './types';

const erData: ErData = {
  // Informational flags that change MANAGEMENT (not the admit decision — those
  // are in severityClassification.admitOverrides, so no duplicate toggles here).
  historyChecklist: [
    { id: 'tb_contact',     question: 'Known TB contact, travel to endemic area, or BCG never given?', redFlag: true,  ifYes: 'Consider TB pneumonia. Sputum AFB, CXR, and paediatric ID / TB clinic referral before empirical antibiotics if stable.' },
    { id: 'viral_prodrome', question: 'Recent influenza or varicella — current or in last 2 weeks?', redFlag: true, ifYes: 'Secondary bacterial pneumonia (post-viral). Staphylococcus aureus including PVL-producing strains — high mortality. Add Clindamycin if suspected.' },
    { id: 'aspiration',     question: 'Risk factor for aspiration (neurological impairment, swallowing disorder, GORD)?', ifYes: 'Aspiration pneumonia — cover anaerobic organisms (Amoxicillin-Clavulanate or Pip-Tazo). Post-treatment swallow assessment.' },
    { id: 'underlying_lung',question: 'Underlying lung disease (CF, bronchiectasis, recurrent pneumonia)?', ifYes: 'Discuss with respiratory specialist. Sputum cultures essential. Broader antibiotic cover.' },
    { id: 'prior_hosp',     question: 'Hospitalisation or healthcare exposure in last 3 months?', ifYes: 'Higher risk of resistant organisms. Consider Staph aureus (MRSA) cover if no response to standard therapy.' },
    { id: 'chd_chestwall',  question: 'Known CHD or significant chest wall deformity?', ifYes: 'Reduced respiratory reserve. Lower threshold for admission and O₂ supplementation.' },
  ],

  investigations: [
    { test: 'Pulse oximetry (continuous or spot)', category: 'urgent', indication: 'Every child with respiratory symptoms. Spot check in mild cases; continuous monitoring for admitted patients.', criticalValue: 'SpO₂ < 90% on room air (sea level) = admission criterion (Nelson).' },
    { test: 'Bedside blood glucose', category: 'urgent', indication: 'If infant < 6 months, lethargic, or not feeding.' },

    { test: 'Chest X-ray (CXR)', category: 'radiology', indication: 'NOT routine for mild uncomplicated CAP. Indicated for: first episode, moderate or severe disease, diagnostic uncertainty, failure to improve on antibiotics, suspected complication.', criticalValue: 'Lobar / segmental consolidation → bacterial CAP, classically S. pneumoniae. Bronchopneumonia pattern (patchy, often bilateral) → consider S. aureus, cavitation risk. Round pneumonia in young child → Streptococcus pneumoniae. Large effusion → empyema. Pneumatocele → Staphylococcus aureus / PVL strains. More than one lobe involved (multilobar/multifocal) → sign of severity, consider admission.' },
    { test: 'Chest USS', category: 'radiology', indication: 'Preferred over CT for parapneumonic effusion assessment — quantifies fluid, guides drainage decision. No radiation.', criticalValue: 'Complex (septated / echogenic) effusion → empyema — consult respiratory/surgery for drainage.' },

    { test: 'Blood culture (2 sets)', category: 'blood', indication: 'Moderate–severe CAP requiring admission. Must be taken BEFORE first dose of antibiotics.', criticalValue: 'Positive blood culture changes duration, route, and sometimes agent of antibiotic therapy.' },
    { test: 'CBC (complete blood count) + CRP + procalcitonin', category: 'blood', indication: 'Admitted patients. WBC and CRP do not reliably distinguish bacterial from viral. Procalcitonin > 0.5 ng/mL supports bacterial aetiology.', criticalValue: 'WBC > 20,000 or < 4,000 = severe sepsis → urgent treatment.' },
    { test: 'NPA / throat swab — viral PCR', category: 'blood', indication: 'Consider for admitted patients (RSV, influenza, SARS-CoV-2, Mycoplasma) — informs antibiotic duration and infection control.', criticalValue: 'Influenza positive in high-risk child → oseltamivir within 48 h of symptoms.' },
    { test: 'Urine pneumococcal antigen', category: 'blood', indication: 'Consider in severe or complicated CAP — fast result, does not replace blood culture.' },
  ],

  admissionCriteria: [
    'Age < 6 months (Nelson Table 449.5)',
    'SpO₂ < 90% on room air (sea level) / cyanosis',
    'Toxic appearance',
    'Moderate–severe respiratory distress (retractions, nasal flaring, grunting)',
    'Shock (tachycardia, hypotension, prolonged capillary refill)',
    'Immunocompromised state',
    'Sickle cell anaemia with acute chest syndrome',
    'Vomiting or inability to tolerate oral fluids / medications',
    'Severe dehydration',
    'Complicated pneumonia (effusion, empyema, abscess, necrotising pneumonia)',
    'CXR: more than one lobe involved (multilobar/multifocal) — sign of severity',
    'No response to oral antibiotics by the 48 h home review (still febrile AND not improving)',
    'High-risk pathogen suspected',
    'Social factors — caregivers unable to give medications or follow up reliably',
  ],

  highRiskFactors: [
    'Age 6–12 months',
    'Known CHD or chronic lung disease',
    'Prior hospitalisation for pneumonia',
    'Aspiration risk (neurological impairment)',
    'Borderline oral intake or mild dehydration',
    'Unreliable follow-up or remote location',
  ],

  dischargeCriteria: [
    'SpO₂ ≥ 93% on room air, sustained',
    'No severe-tier feature (grunting, moderate–severe recession, cyanosis, shock, lethargy)',
    'No mandatory-admission factor (age < 6 mo, immunocompromise, sickle acute chest, complication, failed abx)',
    'Temperature < 38.5°C or clearly trending down',
    'RR within normal range for age at rest',
    'Tolerating oral fluids and antibiotics',
    'Reliable caregiver — written instructions given',
    'Clear 24–48 h follow-up plan (GP or paediatric clinic)',
    'First dose of antibiotics given in ER',
    'Mild bronchopneumonia, age 3–6 months: do NOT discharge without a senior resident doctor confirming the decision.',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: child\'s breathing becomes very fast or very hard, lips or fingertips turn blue, child becomes very drowsy or very difficult to wake up.',
    'Return sooner than the booked follow-up if: child stops drinking, breathing looks worse, or there is no sign at all of improvement (activity, appetite) after a full 24 hours of antibiotics — you do not need to wait until the 48 h appointment if you are worried.',
    'COMPLETE THE FULL ANTIBIOTIC COURSE — stopping early allows the infection to come back, often worse. Standard course is 5 days for uncomplicated CAP.',
    'Fever itself can take 2–3 days to fully settle on the correct antibiotic — this alone is not a reason to worry. Improving appetite and energy usually comes before the fever fully settles.',
    'Paracetamol or ibuprofen for fever/discomfort — follow dosing instructions. Do NOT use both simultaneously.',
    'Formal follow-up appointment booked for 48 hours — if clearly improving by then, this check-in may be done by phone.',
    'Residual cough after pneumonia can last 3–4 weeks — this is normal. Return if cough is getting WORSE after 2 weeks on antibiotics.',
  ],

  // Reference-mode severity: the clinician reads this table, matches the child,
  // and taps the band. Nelson Ch.449 severe features (SpO₂<90%, grunting,
  // moderate–severe recession, marked tachypnoea, lethargy, shock, not feeding);
  // WHO fast-breathing = moderate; BTS marked tachypnoea = severe.
  // admitOverrides includes one item not found in Nelson (checked 2026-07-10,
  // absent from Ch.449 and Table 449.5): multilobar/multifocal CXR involvement
  // as an admit-triggering severity sign — added at user request as a
  // local-practice addition. Not flagged as such in the doctor-facing text
  // (user preference) — this comment is the only record of that provenance.
  severityClassification: {
    rows: [
      { feature: 'Work of breathing', mild: 'None / minimal',        moderate: 'Mild recession',              severe: 'Mod–severe recession, nasal flaring, or grunting' },
      { feature: 'SpO₂ (room air)',    mild: '≥ 93%',                 moderate: '90–92%',                      severe: '< 90% or central cyanosis' },
      { feature: 'Respiratory rate',   mild: 'Normal for age',        moderate: 'Fast for age (WHO)',          severe: 'Marked: > 70 infant / > 50 child' },
      { feature: 'Feeding / intake',   mild: 'Normal',                moderate: 'Reduced (50–75%)',            severe: 'Poor (< 50%) or not feeding' },
      { feature: 'Mental state',       mild: 'Alert',                 moderate: 'Irritable',                   severe: 'Lethargic / toxic' },
      { feature: 'Perfusion',          mild: 'Normal',                moderate: 'Normal',                      severe: 'Shock — CRT > 2s, tachycardia, ↓BP' },
    ],
    // No bandAction here on purpose: the "what happens now" text is ALWAYS
    // computed live by getDisposition(severity, data), which is the one place
    // that knows about admit-overrides. A second, static per-band text field
    // is exactly what caused a real contradiction bug (see er-protocol-view.tsx).
    admitOverrides: [
      { id: 'ovr_age',        label: 'Age < 6 months',                                    autoAgeMonthsBelow: 6 },
      { id: 'ovr_immuno',     label: 'Immunocompromised' },
      { id: 'ovr_sickle',     label: 'Sickle cell disease with acute chest syndrome' },
      { id: 'ovr_complicated',label: 'Complicated pneumonia (effusion / empyema / abscess)' },
      { id: 'ovr_multilobar', label: 'CXR: more than one lobe involved (multilobar/multifocal) — sign of severity' },
      { id: 'ovr_failed',     label: 'Failed 48 h of outpatient antibiotics' },
      { id: 'ovr_noorals',    label: 'Cannot tolerate oral fluids / medication' },
      { id: 'ovr_social',     label: 'Unreliable follow-up / social concern' },
    ],
  },
};

export const pneumoniaProtocol: DiseaseProtocol = {
  id: 'pneumonia',
  name: 'Pneumonia (Community Acquired)',
  system: 'Respiratory System',
  description: 'Assessment and management of CAP in children using Nelson (Ch. 449) hospitalization criteria and age-based antibiotic selection, with immunisation-gated narrow-spectrum first-line therapy and 4-step escalation from oral treatment to PICU.',
  lastUpdated: '2025',
  image: { url: 'https://picsum.photos/seed/pneumonia/600/400', hint: 'chest xray' },
  erData,

  // Reference mode: severity is judged from the classification table (erData),
  // not from scored inputs. Only weight (drug doses) and immunisation status
  // (inpatient antibiotic choice) remain as inputs; the reference-mode Assess
  // view renders these plus the admit-override checklist.
  questions: [
    { id: 'weight',    questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'immunized', questionText: 'Fully immunized (Hib + pneumococcal conjugate)?', type: 'boolean', info: 'Inpatient antibiotic choice: fully immunized + not severely ill → ampicillin/penicillin G; otherwise ceftriaxone/cefotaxime.' },
  ],

  // Reference mode — severity is NOT computed. The clinician reads the
  // classification table (erData.severityClassification) and taps the band,
  // stored in formData.manualSeverity. This function only surfaces that choice
  // and computes the FACTUAL admit-overrides (facts, not judgment) so the
  // renderer can flag mandatory admission independent of the severity judgment.
  calculateSeverity: (data: FormData): Severity => {
    const ageMonths = Number(data.ageMonths || 0);
    const manual = data.manualSeverity as SeverityLevel | undefined;
    const level: SeverityLevel = (manual === 'mild' || manual === 'moderate' || manual === 'severe')
      ? manual
      : 'unknown';

    // Admit-overrides — mandatory-admission FACTS, independent of severity.
    // Age auto-computed from the vitals bar; the rest are ticked in the
    // reference-mode admit-override checklist (formData keys from erData).
    const admitOverrides: AdmitOverride[] = [
      { id: 'ovr_age',         label: 'Age < 6 months',                                      met: ageMonths > 0 && ageMonths < 6 },
      { id: 'ovr_immuno',      label: 'Immunocompromised',                                   met: data.ovr_immuno === true },
      { id: 'ovr_sickle',      label: 'Sickle cell disease with acute chest syndrome',       met: data.ovr_sickle === true },
      { id: 'ovr_complicated', label: 'Complicated pneumonia (effusion / empyema / abscess)', met: data.ovr_complicated === true },
      { id: 'ovr_multilobar',  label: 'CXR: more than one lobe involved (multilobar/multifocal) — sign of severity', met: data.ovr_multilobar === true },
      { id: 'ovr_failed',      label: 'Failed 48 h of outpatient antibiotics',               met: data.ovr_failed === true },
      { id: 'ovr_noorals',     label: 'Cannot tolerate oral fluids / medication',            met: data.ovr_noorals === true },
      { id: 'ovr_social',      label: 'Unreliable follow-up / social concern',               met: data.ovr_social === true },
    ];

    const details = admitOverrides.filter(o => o.met).map(o => `Admit-override: ${o.label}`);

    return { level, admitOverrides, details };
  },

  getManagement: (severity, data) => {
    const ageMonths = Number(data.ageMonths || 0);
    const isNeonate = ageMonths > 0 && ageMonths < 3;
    const isInfant  = ageMonths >= 3 && ageMonths < 60;
    const fullyImmunized = data.immunized === true;
    const overrideMet = (severity.admitOverrides ?? []).filter(o => o.met);
    const hasOverride = overrideMet.length > 0;
    const overrideList = overrideMet.map(o => o.label).join(', ');

    // Narrow- vs broad-spectrum inpatient first-line (Nelson): fully immunized
    // + not severely ill → ampicillin / penicillin G; otherwise ceftriaxone.
    const inpatientAbx = fullyImmunized
      ? 'IV Ampicillin or Penicillin G first-line (fully immunized, not severely ill — narrow spectrum).'
      : 'IV Ceftriaxone or Cefotaxime (not fully immunized, or immunisation status unknown).';

    // Scope boundary: this is an ER protocol. Its job ends at the admit/
    // discharge decision and the FIRST dose given in the department. Ongoing
    // inpatient reassessment (48–72h response window), antibiotic escalation,
    // and empyema/complication workup are WARD-team decisions and already live
    // in the Pneumonia (CAP) Ward Protocol — do not re-derive them here, or the
    // two protocols will silently drift apart on the same clinical question.
    const HANDOVER = {
      title: 'HANDOVER — Admitted: ongoing care is WARD management from here',
      recommendations: [
        'The ED role ends here once oxygen/fluids are started as needed, the first antibiotic dose is given, and admission is arranged.',
        'The reassessment schedule, antibiotic escalation if not responding, and empyema/complication workup (CXR, chest USS) are decided by the WARD team, not in the ED — see the Pneumonia (CAP) Ward Protocol for that pathway.',
        'Hand over clearly: severity band assessed, antibiotic + dose + time given, and the reason for admission (severity, or which admit-override factor).',
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

    if (severity.level !== 'severe' && severity.level !== 'moderate' && severity.level !== 'mild') {
      return [{
        title: 'Select a severity band',
        recommendations: ['Read the classification table in the Assess tab and tap Mild, Moderate, or Severe to see the matching management pathway.'],
      }];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — Severe CAP: Immediate management',
          recommendations: [
            'Oxygen — titrate to SpO₂ ≥ 94%. Where ventilator-derived CPAP is unavailable, bubble CPAP improves mortality in hypoxaemic pneumonia (Nelson).',
            'IV access. Blood culture × 2 BEFORE antibiotics.',
            isNeonate
              ? 'Neonatal antibiotics: Cefotaxime 50 mg/kg q8–12h + Ampicillin 50 mg/kg q6h (cover GBS / Listeria).'
              : 'Severely ill → IV Ceftriaxone or Cefotaxime first-line (broader cover regardless of immunisation status).'
                + (isInfant ? '' : ' Add a macrolide (Azithromycin) if Mycoplasma / Chlamydophila possible in school-age child.'),
            'If staphylococcal features (pneumatoceles, empyema, rapid deterioration, post-influenza) → add Vancomycin or Clindamycin.',
            'CXR (chest X-ray) — PA + lateral. Blood: CBC (complete blood count), CRP, U&E (urea & electrolytes), LFTs (liver function tests).',
            'IV / NG (nasogastric) fluids if unable to maintain oral intake.',
            'In low/middle-income settings: oral zinc reduces mortality in severe pneumonia (10 mg/day if < 12 mo, 20 mg/day if ≥ 12 mo, for 7 days).',
            'Admit to ward or PICU based on response to oxygen/fluids/first antibiotic dose.',
          ],
        },
        HANDOVER,
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: hasOverride
            ? 'STEP 1 — Moderate CAP + admit-override: admit and treat'
            : 'STEP 1 — Moderate CAP: Treat and observe',
          recommendations: [
            'Oxygen if SpO₂ < 94%.',
            hasOverride
              ? `ADMIT — mandatory-admission factor present (${overrideList}), so this child is admitted despite moderate severity.`
              : 'Trial of high-dose oral Amoxicillin 90 mg/kg/day divided BID × 5 days if no admit-override and tolerating orals (Nelson: twice-daily dosing).',
            isNeonate
              ? 'Neonatal (< 3 mo): admit for Cefotaxime + Ampicillin.'
              : `If admitting: ${inpatientAbx}`,
            'Observe in ER for 4–6 hours on treatment. Recheck SpO₂, RR, work of breathing and feeding at the end of observation.',
            'IV fluids if inadequate oral intake.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS at 4–6 h (this is the decision point)',
          recommendations: [
            hasOverride
              ? 'Admitted for the override factor regardless of this reassessment — see HANDOVER below.'
              : 'RESPONSE at 4–6 h (all of): SpO₂ ≥ 93% on room air, RR settling, work of breathing improving, feeding acceptable, no new severe feature → discharge on oral antibiotics + 48 h follow-up.',
            'NO RESPONSE at 4–6 h (static: unchanged distress, SpO₂ still 90–92%, or not feeding) → ADMIT for IV antibiotics — see HANDOVER below. Do NOT send home, and do NOT simply keep observing longer.',
            'DETERIORATION at any point during observation (SpO₂ dropping, new grunting, lethargy) → the child is now SEVERE → oxygen + IV now, go to STEP 4.',
          ],
        },
        HANDOVER,
        STEP4,
      ];
    }

    // Mild — STEP 1's title AND content are both gated on hasOverride, as one
    // coherent step (never two contradictory steps stacked: "ADMIT" followed
    // unconditionally by "...discharge").
    return [
      {
        title: hasOverride
          ? 'STEP 1 — Mild severity, but ADMIT for override factor'
          : 'STEP 1 — Mild CAP: Oral antibiotics, discharge',
        recommendations: hasOverride ? [
          `Pneumonia is clinically MILD, but a mandatory-admission factor is present (${overrideList}) — admit regardless, do NOT discharge.`,
          'Give first antibiotic dose in ED; oral route acceptable if tolerating. Observe/admit rather than discharge.',
          isNeonate ? 'Neonatal (< 3 mo): admit for IV Cefotaxime + Ampicillin.' : `Inpatient antibiotic: ${inpatientAbx}`,
        ] : [
          'High-dose oral Amoxicillin 90 mg/kg/day divided BID × 5 days — first-line for typical CAP (Nelson: twice-daily dosing).',
          'Alternatives if penicillin-intolerant or β-lactam concern: Cefuroxime or Amoxicillin-Clavulanate.',
          'School-age child or suspected atypical (Mycoplasma / Chlamydophila): a macrolide (Azithromycin) is first-line instead.',
          'Antipyretics: Paracetamol 15 mg/kg q4–6h OR Ibuprofen 10 mg/kg q6–8h.',
          'Adequate oral hydration.',
          'Return precautions and GP follow-up in 48 hours.',
          'CXR NOT required for uncomplicated mild CAP (PIDS/IDSA — imaging rarely changes outpatient management).',
        ],
      },
      ...(hasOverride ? [HANDOVER] : [{
        title: 'STEP 2 — REVIEW at 48 h (telephone or in person)',
        recommendations: [
          'RESPONSE by 48 h: fever trending down, more active, eating better, breathing easier → complete the full 5-day course.',
          'NO RESPONSE by 48 h (still febrile AND not improving) → return for reassessment: re-examine and reclassify severity on this ER protocol — if that reassessment leads to admission, ongoing workup and antibiotic escalation become WARD management.',
          'RETURN SOONER — do NOT wait for the 48 h review — if breathing becomes faster/harder, the child is drowsy or not drinking, or lips/fingertips turn blue. These are deterioration and need immediate reassessment.',
        ],
      }]),
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    const overrideMet = (severity.admitOverrides ?? []).filter(o => o.met);
    const overrideList = overrideMet.map(o => o.label).join(', ');

    if (severity.level === 'severe') {
      return [
        'ADMIT — severe pneumonia. Oxygen, first IV antibiotic dose, and monitoring; PICU if failing.',
        'Ongoing inpatient care → hand over to the Pneumonia (CAP) Ward Protocol.',
      ];
    }
    if (overrideMet.length > 0 && (severity.level === 'mild' || severity.level === 'moderate')) {
      return [
        `ADMIT — pneumonia is ${severity.level.toUpperCase()}, but a mandatory-admission factor is present: ${overrideList}.`,
        'Admission is driven by the override, not by clinical severity — hand over to the Pneumonia (CAP) Ward Protocol for ongoing care.',
      ];
    }
    if (severity.level === 'moderate') {
      return ['Observe 4–6 h. Discharge only if SpO₂ ≥ 93%, feeding, and improving — otherwise admit and hand over to the Pneumonia (CAP) Ward Protocol.'];
    }
    if (severity.level === 'mild') {
      return [
        'Discharge with oral Amoxicillin. GP follow-up 48 h.',
        'If this is bronchopneumonia on CXR and age 3–6 months, do NOT discharge without a senior resident doctor confirming the decision.',
      ];
    }
    return ['Select a severity band in the Assess tab to see the disposition.'];
  },

  getRedFlags: () => [
    'SpO₂ < 90% on room air (sea level)',
    'Grunting — moderate–severe respiratory distress',
    'Cyanosis',
    'Apnea or very slow respiratory rate (exhaustion)',
    'Altered mental status, lethargy, or toxic appearance',
    'Shock — prolonged capillary refill, tachycardia, hypotension',
    'No response at the ER review point (4–6 h observed, or 48 h if sent home) — still febrile and no better in breathing, feeding, or activity',
    'Pleural chest pain (effusion or empyema)',
    'CXR: more than one lobe involved (multilobar/multifocal)',
    'Age < 6 months',
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
    const amoxPerDose  = (90 * wt / 2).toFixed(0);
    const amoxClav     = (45 * wt).toFixed(0);
    const ceftriaxone  = Math.min(100 * wt, 4000).toFixed(0);
    const azithro      = Math.min(10 * wt, 500).toFixed(0);
    const vancomycin   = Math.min(60 * wt, 4000).toFixed(0);
    const clinda       = Math.min(40 * wt, 2700).toFixed(0);
    const cefotaxime   = Math.min(50 * wt, 2000).toFixed(0);
    const ampicillin   = Math.min(50 * wt, 2000).toFixed(0);
    const para         = Math.min(15 * wt, 1000).toFixed(0);
    const ibu          = Math.min(10 * wt, 400).toFixed(0);

    doses.push({ drugName: 'Amoxicillin PO (1st line — mild/moderate)', dose: `${amoxPerDose} mg BID (90 mg/kg/day total ${amoxTotal} mg/day, divided twice daily)`, notes: 'Nelson: high-dose twice-daily dosing. 5-day course for uncomplicated CAP; continue until afebrile 72 h if slower response.' });
    doses.push({ drugName: 'Amoxicillin-Clavulanate PO (outpatient alternative)', dose: `${amoxClav} mg (amox component) BID (based on 90 mg/kg/day amoxicillin)`, notes: 'Alternative to amoxicillin; also covers aspiration risk. Cefuroxime is another option.' });
    const ageEntered = ageMonths > 0;
    if (!ageEntered) {
      doses.push({
        drugName: '⚠ Enter age above',
        dose: 'Age is required to pick the correct IV antibiotic — neonates (< 3 months) need a different regimen (Cefotaxime + Ampicillin), and Ceftriaxone carries a bilirubin-displacement risk in young infants. Both options are shown below until age is entered — confirm which applies before prescribing.',
      });
    }

    if (ageEntered && ageMonths < 3) {
      doses.push({ drugName: 'Cefotaxime IV (neonates / infants < 3 months)', dose: `${cefotaxime} mg q8–12h (50 mg/kg/dose)`, notes: 'Give with Ampicillin to cover Listeria and GBS.' });
      doses.push({ drugName: 'Ampicillin IV (neonates)', dose: `${ampicillin} mg q6h (50 mg/kg/dose)`, notes: 'In combination with Cefotaxime for neonatal CAP.' });
    } else if (ageEntered) {
      doses.push({ drugName: 'Ampicillin / Penicillin G IV (inpatient — fully immunized, not severely ill)', dose: `Ampicillin ${ampicillin} mg q6h (50 mg/kg/dose)`, notes: 'Nelson narrow-spectrum first-line when fully immunized (Hib + PCV) and not severely ill.' });
      doses.push({ drugName: 'Ceftriaxone IV (severe, or not fully immunized)', dose: `${ceftriaxone} mg OD (50–100 mg/kg/day, max 4 g)`, notes: 'For severely ill or under-immunized children. Switch to oral when afebrile + tolerating orals (usually 48–72 h).' });
    } else {
      // Age unknown — show BOTH regimens explicitly rather than silently
      // defaulting to "not neonate", so a missed age entry can't produce a
      // wrong antibiotic suggestion for an actual young infant.
      doses.push({ drugName: 'IF < 3 months: Cefotaxime IV + Ampicillin IV', dose: `Cefotaxime ${cefotaxime} mg q8–12h + Ampicillin ${ampicillin} mg q6h (50 mg/kg/dose each)`, notes: 'Neonatal regimen — covers Listeria/GBS. Use only if the child is truly < 3 months.' });
      doses.push({ drugName: 'IF ≥ 3 months: Ampicillin/Penicillin G or Ceftriaxone IV', dose: `Ampicillin ${ampicillin} mg q6h, OR Ceftriaxone ${ceftriaxone} mg OD (50–100 mg/kg/day, max 4 g)`, notes: 'Ampicillin/Penicillin G if fully immunized and not severely ill; Ceftriaxone if severe or under-immunized.' });
    }
    doses.push({ drugName: 'Azithromycin PO/IV (atypical cover — school age)', dose: `${azithro} mg OD (10 mg/kg/day, max 500 mg) × 5 days`, notes: 'Add if Mycoplasma or Chlamydophila suspected (age > 5 years, gradual onset, bilateral infiltrates).' });
    doses.push({ drugName: 'Vancomycin IV (Staph / MRSA)', dose: `${vancomycin} mg/day (60 mg/kg/day in 4 divided doses)`, notes: 'Post-viral cavitary pneumonia or PVL-producing Staph aureus suspected. Monitor levels.' });
    doses.push({ drugName: 'Clindamycin IV (PVL-Staph add-on)', dose: `${clinda} mg/day (40 mg/kg/day divided q6–8h, max 2700 mg)`, notes: 'Toxin suppressor — add to Vancomycin for PVL-Staph aureus pneumonia.' });
    doses.push({ drugName: 'Paracetamol (antipyretic)', dose: `${para} mg q4–6h (15 mg/kg/dose, max 1 g)`, notes: 'Max 4 doses/day. Use for fever and discomfort.' });
    doses.push({ drugName: 'Ibuprofen (antipyretic — age > 3 months)', dose: `${ibu} mg q6–8h (10 mg/kg/dose, max 400 mg)`, notes: 'Alternate with paracetamol if needed. Avoid if dehydrated or renal impairment.' });

    return doses;
  },

  getReferences: () => [
    { title: 'Nelson Textbook of Pediatrics, 22nd ed. — Ch. 449, Community-Acquired Pneumonia (Kelly & Sandora) [primary source]', url: 'https://www.elsevier.com/books/nelson-textbook-of-pediatrics/kliegman/978-0-323-88305-4' },
    { title: 'IDSA/PIDS CAP Guidelines 2011 (referenced within Nelson)', url: 'https://doi.org/10.1093/cid/cir191' },
    { title: 'BTS Guidelines for the Management of CAP in Children (2011, updated 2021)', url: 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pneumonia-children/' },
    { title: 'WHO Pocket Book of Hospital Care for Children — Pneumonia chapter', url: 'https://www.who.int/publications/i/item/978924154837-3' },
  ],
};
