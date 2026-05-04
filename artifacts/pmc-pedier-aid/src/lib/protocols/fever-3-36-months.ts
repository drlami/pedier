import type { DiseaseProtocol, FormData, Severity } from './types';

export const fever3To36MonthsProtocol: DiseaseProtocol = {
  id: 'fever-3-36-months',
  name: 'Fever Without Source (3–36 months)',
  system: 'Fever & Infectious Diseases',
  description: 'Structured evaluation of fever without an identifiable source in children aged 3 to 36 months — risk-stratified by age, temperature, immunisation status, sex, and UTI risk. Includes guidance on blood and urine sampling methods.',
  image: {
    url: "https://picsum.photos/seed/fever-3-36-months/600/400",
    hint: "toddler temperature"
  },
  questions: [
    {
      id: 'isToxic',
      questionText: 'Is the child toxic-appearing?',
      type: 'boolean',
      info: 'Lethargy, poor perfusion, marked respiratory distress, cyanosis, mottled skin, inconsolable crying, or appears critically unwell.'
    },
    {
      id: 'ageMonths',
      questionText: 'Age (months)',
      type: 'number',
      unit: 'months',
      placeholder: 'e.g. 12'
    },
    {
      id: 'temperature',
      questionText: 'Highest recorded temperature (last 24 h)',
      type: 'number',
      unit: '°C',
      placeholder: 'e.g. 39.2'
    },
    {
      id: 'sex',
      questionText: 'Sex',
      type: 'select',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' }
      ]
    },
    {
      id: 'isCircumcised',
      questionText: 'If male — is the child circumcised?',
      type: 'boolean',
      info: 'Uncircumcised males under 12 months have a significantly higher risk of UTI.'
    },
    {
      id: 'vaccineStatus',
      questionText: 'PCV13 and Hib vaccinations up to date?',
      type: 'select',
      options: [
        { label: 'Complete / Up to date', value: 'complete' },
        { label: 'Incomplete or Unknown', value: 'incomplete' }
      ]
    },
    {
      id: 'isWellAppearing',
      questionText: 'Does the child appear well?',
      type: 'boolean',
      info: 'Well-appearing: interactive, playful, good colour, consolable, drinking adequately, normal muscle tone.'
    },
    {
      id: 'hasFocalInfection',
      questionText: 'Focal source of infection identified on examination?',
      type: 'boolean',
      info: 'e.g. Otitis media, tonsillopharyngitis, cellulitis, pneumonia, septic arthritis.'
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const age = Number(data.ageMonths);
    const temp = Number(data.temperature);
    const isFemale = data.sex === 'female';
    const isMale = data.sex === 'male';
    const isCircumcised = data.isCircumcised === true;
    const isUnimmunized = data.vaccineStatus === 'incomplete';
    const highTemp = temp >= 39.0;
    const veryHighTemp = temp >= 39.5;

    // Step 1: Toxic-appearing → immediate emergency
    if (data.isToxic) {
      details.push('TOXIC: Child is toxic-appearing — this is a medical emergency.');
      details.push('BLOOD_WORKUP');
      details.push('URINE_WORKUP');
      return { level: 'severe', details };
    }

    // Step 2: Focal infection found → treat the source
    if (data.hasFocalInfection) {
      details.push('FOCAL: A focal source of infection has been identified on examination.');
      if ((isFemale && age <= 24) || (isMale && !isCircumcised && age <= 12)) {
        details.push('URINE_WORKUP');
        details.push('FOCAL_URINE_NOTE: UTI may co-exist — obtain urine sample even with focal source.');
      }
      return { level: 'moderate', details };
    }

    // Step 3: Age 3–5 months — all febrile infants need minimum workup
    if (age >= 3 && age < 6) {
      details.push('HIGH_RISK_AGE: Child aged 3–5 months — blood and urine workup recommended for all febrile infants this age regardless of appearance.');
      details.push('BLOOD_WORKUP');
      details.push('URINE_WORKUP');
      return { level: 'moderate', details };
    }

    // Step 4: Unimmunised + high fever → occult bacteremia risk
    if (isUnimmunized && highTemp) {
      details.push('HIGH_RISK_IMMUNIZATION: Unimmunised child with T ≥ 39°C — elevated risk for occult bacteremia.');
      details.push('BLOOD_WORKUP');
      if (isFemale && age <= 24) details.push('URINE_WORKUP');
      if (isMale && !isCircumcised && age <= 12) details.push('URINE_WORKUP');
      return { level: 'moderate', details };
    }

    // Step 5: UTI risk assessment (age 6–36 months)
    let utiRisk = false;

    if (isFemale && age >= 6 && age <= 24 && temp >= 38.5) {
      details.push('UTI_RISK: Female aged 6–24 months with T ≥ 38.5°C — significant UTI risk.');
      utiRisk = true;
    }
    if (isMale && !isCircumcised && age >= 6 && age <= 12 && temp >= 38.5) {
      details.push('UTI_RISK: Uncircumcised male aged 6–12 months with T ≥ 38.5°C — elevated UTI risk.');
      utiRisk = true;
    }
    if (isFemale && age > 24 && age <= 36 && veryHighTemp) {
      details.push('UTI_RISK: Female aged 24–36 months with T ≥ 39.5°C — consider UTI screen.');
      utiRisk = true;
    }
    if (isMale && isCircumcised && age <= 12 && veryHighTemp) {
      details.push('UTI_RISK: Circumcised male ≤ 12 months with T ≥ 39.5°C — low but present UTI risk.');
      utiRisk = true;
    }

    if (utiRisk) {
      details.push('URINE_WORKUP');
      return { level: 'moderate', details };
    }

    // Step 6: Low-risk — well-appearing, immunised
    if (data.isWellAppearing && !isUnimmunized) {
      if (!highTemp) {
        details.push('LOW_RISK: Well-appearing, immunised child with T < 39°C. Low probability of serious bacterial infection.');
      } else {
        details.push('LOW_RISK_WATCH: Well-appearing, immunised child but T ≥ 39°C. Close monitoring warranted. Consider urine dipstick.');
      }
      return { level: 'mild', details };
    }

    // Fallback — treat with caution
    details.push('CAUTION: Insufficient data to fully risk-stratify — treat with clinical caution.');
    details.push('URINE_WORKUP');
    return { level: 'moderate', details };
  },

  getManagement: (severity, data) => {
    const sections: { title: string; recommendations: string[] }[] = [];
    const age = Number(data.ageMonths);
    const isFemale = data.sex === 'female';
    const isMale = data.sex === 'male';
    const isCircumcised = data.isCircumcised === true;
    const d = severity.details;

    const isToxic       = d.some(x => x.startsWith('TOXIC'));
    const isFocal       = d.some(x => x.startsWith('FOCAL'));
    const isHighRiskAge = d.some(x => x.startsWith('HIGH_RISK_AGE'));
    const isHighRiskImm = d.some(x => x.startsWith('HIGH_RISK_IMMUNIZATION'));
    const isUtiRisk     = d.some(x => x.startsWith('UTI_RISK'));
    const needsUrine    = d.some(x => x === 'URINE_WORKUP');
    const isLowRisk     = d.some(x => x.startsWith('LOW_RISK'));
    const focalUrine    = d.some(x => x.startsWith('FOCAL_URINE_NOTE'));

    // ── SEVERE: Toxic-appearing ───────────────────────────────────────────────
    if (isToxic) {
      sections.push({
        title: '🚨 Immediate Actions — Toxic Child',
        recommendations: [
          'MEDICAL EMERGENCY — assess and stabilise ABCs immediately.',
          'IV access × 2. Start fluid resuscitation if poor perfusion: 10 ml/kg 0.9% NaCl bolus (repeat if needed up to 20–40 ml/kg).',
          'Continuous cardiac and SpO₂ monitoring. Supplemental oxygen if SpO₂ < 92%.',
          'Do NOT delay antibiotics if child is haemodynamically unstable — cultures can be taken simultaneously.',
        ]
      });
      sections.push({
        title: '🔬 Full Sepsis Workup (obtain before antibiotics if clinically stable)',
        recommendations: [
          '─── BLOOD SAMPLES ───',
          '● CBC with differential — WBC, bands, haemoglobin, platelets.',
          '● Blood culture × 1–2 sets (peripheral vein; before antibiotics).',
          '● CRP and Procalcitonin (PCT).',
          '● Electrolytes, glucose, urea, creatinine, LFTs, lactate.',
          '● Blood gas (venous or capillary) — assess pH and lactate.',
          '',
          '─── URINE SAMPLE ───',
          '● METHOD: Urethral catheterisation (preferred in all age groups when rapid diagnosis needed).',
          '● Send: Urinalysis (dipstick for LE + nitrites AND microscopy for WBCs/bacteria) + Urine Culture.',
          '⚠ Do NOT use bag specimen for culture — unacceptably high contamination rate.',
          '',
          '─── CSF (Lumbar Puncture) ───',
          '● Perform LP for CSF studies if meningitis suspected and no contraindications (raised ICP signs, haemodynamic instability, coagulopathy, severe thrombocytopaenia).',
          '● CSF: cell count, glucose, protein, Gram stain, culture ± PCR.',
          '● Chest X-ray if respiratory signs present.',
        ]
      });
      sections.push({
        title: '💊 Empiric IV Antibiotics (give IMMEDIATELY)',
        recommendations: [
          'Ceftriaxone 50 mg/kg IV/IM — STAT (max 2 g if meningitis suspected; max 1 g otherwise).',
          'ADD Vancomycin 15 mg/kg IV if meningitis or MRSA sepsis is suspected (check local guidelines).',
          'Consider Aciclovir 20 mg/kg IV every 8 h if HSV encephalitis possible (< 12 months, seizures, CSF pleocytosis, skin/mouth vesicles).',
        ]
      });
      sections.push({
        title: '🏥 Disposition',
        recommendations: [
          'Immediate hospital admission — PICU if haemodynamically unstable or rapid deterioration.',
          'Continue IV antibiotics and reassess based on culture results at 24–48 hours.',
        ]
      });
      return sections;
    }

    // ── FOCAL INFECTION ───────────────────────────────────────────────────────
    if (isFocal) {
      sections.push({
        title: '🎯 Focal Infection Identified — Treat the Source',
        recommendations: [
          'A source has been found. Direct management to treat the identified infection:',
          '● Acute Otitis Media: Amoxicillin 80–90 mg/kg/day orally in 2 doses (max 3 g/day) × 5–10 days.',
          '● Tonsillopharyngitis (GAS confirmed): Amoxicillin 50 mg/kg/day in 2 doses × 10 days.',
          '● Mild cellulitis: Cefalexin 25 mg/kg/dose TDS orally × 5–7 days.',
          '● Ensure pneumonia excluded (CXR if respiratory signs).',
          'Paracetamol 15 mg/kg/dose every 4–6 h for fever and comfort.',
          'Ibuprofen 10 mg/kg/dose every 6–8 h if ≥ 6 months and well-hydrated.',
        ]
      });
      if (focalUrine) {
        const urineMethod = age < 24
          ? '● METHOD: Urethral catheterisation (preferred for children < 24 months).'
          : '● METHOD: Midstream clean-catch (acceptable if ≥ 24 months and cooperative).';
        sections.push({
          title: '🔬 Urine Sample — Also Obtain (UTI may co-exist)',
          recommendations: [
            'Child has UTI risk factors even though focal infection was found.',
            urineMethod,
            '● Send: Urinalysis (dipstick + microscopy) AND Urine Culture.',
            'If UA positive → treat for UTI in addition to focal infection.',
          ]
        });
      }
      return sections;
    }

    // ── HIGH RISK: Age 3–5 months ─────────────────────────────────────────────
    if (isHighRiskAge) {
      sections.push({
        title: '🔬 Blood Samples — All Febrile Infants Aged 3–5 Months',
        recommendations: [
          'Obtain before any antibiotics are given.',
          '● CBC with differential.',
          '  → WBC > 15,000/µL or bands > 1,500/µL = high-risk for bacterial infection.',
          '  → WBC < 5,000/µL also concerning.',
          '● Blood culture × 1 (peripheral vein).',
          '● CRP (≥ 20 mg/L = high risk) and/or Procalcitonin (≥ 0.5 ng/mL = high risk).',
          '● Blood glucose and electrolytes.',
        ]
      });
      sections.push({
        title: '🔬 Urine Sample — Method for Age 3–5 Months',
        recommendations: [
          '● PREFERRED: Urethral catheterisation',
          '  → Cleanse external meatus with antiseptic → insert catheter gently → collect sample.',
          '  → Most reliable method for culture in this age group.',
          '',
          '● ALTERNATIVE: Suprapubic aspiration (SPA)',
          '  → Gold standard for sterility; use when bladder is palpable or visible.',
          '  → Ultrasound guidance strongly preferred to confirm bladder distension and guide needle.',
          '  → Appropriate especially for age < 6 months with a cooperative clinical scenario.',
          '',
          '⚠ Bag/pad specimen — NOT acceptable for culture. Too high a contamination risk.',
          '  → If used as screen: a negative bag UA reliably excludes UTI; a positive result must be confirmed by catheter or SPA.',
          '',
          '● Send: Urinalysis (LE dipstick + microscopy) AND Urine Culture.',
        ]
      });
      sections.push({
        title: '💊 Antibiotic Decision — Age 3–5 Months',
        recommendations: [
          'If CBC/CRP HIGH-RISK or UA positive:',
          '  → Ceftriaxone 50 mg/kg IM/IV STAT (max 1 g). Consider admission.',
          'If all markers NORMAL and child is well-appearing:',
          '  → May be managed as outpatient with very close 24-hour follow-up.',
          '  → Ensure blood and urine cultures sent — review results the next day.',
          'Shared decision-making with caregivers regarding risks and benefits of admission vs. outpatient with parenteral antibiotics.',
        ]
      });
      sections.push({
        title: '🌡️ Symptomatic Care',
        recommendations: [
          'Paracetamol 15 mg/kg/dose every 4–6 h for comfort.',
          'Maintain hydration — encourage breastfeeding or age-appropriate fluids.',
        ]
      });
      return sections;
    }

    // ── MODERATE: Unimmunised + high fever ────────────────────────────────────
    if (isHighRiskImm) {
      sections.push({
        title: '🔬 Blood Samples — Unimmunised Child with High Fever',
        recommendations: [
          '● CBC with differential — WBC > 15,000/µL raises occult bacteremia risk.',
          '● Blood culture × 1 (before antibiotics).',
          '● CRP and/or Procalcitonin.',
        ]
      });
      if (needsUrine) {
        const urineMethod = age < 24
          ? [
              '● PREFERRED: Urethral catheterisation (children < 24 months who cannot void on request).',
              '  → Clean meatus → catheterise → collect in sterile container.',
              '● ALTERNATIVE: Suprapubic aspiration (SPA) — ultrasound-guided; best for infants with full bladder.',
              '⚠ Bag specimen NOT suitable for culture diagnosis.',
            ]
          : [
              '● METHOD: Midstream clean-catch (child ≥ 24 months who can cooperate).',
              '  → Clean genitalia → discard initial stream → collect mid-portion in sterile container.',
              '● If unable to cooperate: Urethral catheterisation.',
            ];
        sections.push({
          title: '🔬 Urine Sample — UTI Risk Also Present',
          recommendations: [
            ...urineMethod,
            '● Send: Urinalysis (LE + nitrites + microscopy) AND Urine Culture.',
          ]
        });
      }
      sections.push({
        title: '💊 Antibiotic Decision — Unimmunised',
        recommendations: [
          'If WBC > 15,000/µL or CRP elevated → Ceftriaxone 50 mg/kg IM/IV (max 1 g) — single empiric dose.',
          'If UA positive → initiate UTI treatment (see UTI management below).',
          'Ensure reliable 24-hour follow-up. If follow-up uncertain → admit.',
          'Review blood and urine culture results in 24–48 h and adjust accordingly.',
        ]
      });
      sections.push({
        title: '🌡️ Symptomatic Care',
        recommendations: [
          'Paracetamol 15 mg/kg/dose every 4–6 h.',
          'Ibuprofen 10 mg/kg/dose every 6–8 h if ≥ 6 months and well-hydrated.',
          'Encourage oral fluids.',
        ]
      });
      return sections;
    }

    // ── MODERATE: UTI risk ────────────────────────────────────────────────────
    if (isUtiRisk) {
      const urineMethod = age < 24
        ? [
            '● PREFERRED: Urethral catheterisation',
            '  → Clean external meatus with antiseptic wipe.',
            '  → Insert catheter gently; collect sample as soon as urine flows.',
            '  → Most reliable for both diagnosis and culture in this age group.',
            '',
            '● ALTERNATIVE: Suprapubic aspiration (SPA)',
            '  → Gold standard for sterility; ultrasound-guided preferred.',
            '  → Use when bladder is distended and catheterisation is not feasible.',
            '',
            '⚠ Bag/pad specimen: NOT acceptable for culture.',
            '  → A negative bag UA reliably excludes UTI.',
            '  → A positive bag UA must always be confirmed by catheter or SPA before starting antibiotics.',
          ]
        : [
            '● METHOD: Midstream clean-catch (child ≥ 24 months who can cooperate)',
            '  → Explain procedure to caregiver: clean genitalia with water, discard first stream, collect mid-portion.',
            '  → Risk of contamination — interpret results in clinical context.',
            '● If unable to cooperate or UA equivocal: Urethral catheterisation.',
          ];

      sections.push({
        title: '🔬 Urine Sample — UTI Risk Identified',
        recommendations: [
          ...urineMethod,
          '',
          '● Send: Urinalysis (dipstick for LE + nitrites AND microscopy for WBCs/bacteria) AND Urine Culture.',
        ]
      });
      sections.push({
        title: '💊 Management Based on Urine Results',
        recommendations: [
          'If UA POSITIVE (LE ≥ 1+ OR nitrites positive OR ≥ 5 WBCs/HPF on microscopy):',
          '  → START antibiotics: Cefalexin 25 mg/kg/dose orally 3 times daily (max 500 mg/dose) × 7–10 days.',
          '  → If child unwell or not tolerating oral intake: Ceftriaxone 50 mg/kg IM/IV (max 1 g) × 1–3 doses, then step down to oral when tolerated.',
          '  → Arrange follow-up within 48 h to review urine culture sensitivity results.',
          '',
          'If UA NEGATIVE:',
          '  → No antibiotics. Reassure caregivers.',
          '  → If fever persists beyond 48 h without a source → review and consider blood workup.',
          '',
          'Urine culture results available in 24–48 h — adjust antibiotic choice to match sensitivities.',
        ]
      });
      sections.push({
        title: '🌡️ Symptomatic Care',
        recommendations: [
          'Paracetamol 15 mg/kg/dose every 4–6 h for fever and comfort.',
          'Ibuprofen 10 mg/kg/dose every 6–8 h if ≥ 6 months and well-hydrated.',
          'Encourage oral fluids to maintain hydration and urine output.',
        ]
      });
      sections.push({
        title: '📋 Safety-Netting',
        recommendations: [
          'Return immediately if: child becomes more unwell, develops a rash, has difficulty breathing, or not passing urine > 8 h.',
          'Follow-up in 24–48 h for culture results and clinical review.',
        ]
      });
      return sections;
    }

    // ── LOW RISK ──────────────────────────────────────────────────────────────
    sections.push({
      title: '✅ Low-Risk Child — Symptomatic Management',
      recommendations: [
        'No routine blood tests or antibiotics are required at this time.',
        'Paracetamol 15 mg/kg/dose every 4–6 h (max 4 doses in 24 h) — for fever and comfort.',
        'Ibuprofen 10 mg/kg/dose every 6–8 h if ≥ 6 months and well-hydrated (do not use if vomiting or dehydrated).',
        'Encourage oral fluids — breastmilk, water, or age-appropriate drinks.',
        'Monitor urine output — concern if no wet nappy > 8 h.',
      ]
    });

    if (isFemale && age <= 24) {
      sections.push({
        title: '📋 Urine Dipstick — Recommended Even in Low-Risk Girls ≤ 24 Months',
        recommendations: [
          'A urine dipstick is recommended for all girls ≤ 24 months with unexplained fever even if otherwise low-risk.',
          '● If dipstick POSITIVE (LE or nitrites) → send catheter or SPA urine for formal UA + culture.',
          '● If dipstick NEGATIVE → UTI unlikely. No further urine workup needed.',
        ]
      });
    }

    sections.push({
      title: '📋 Safety-Netting & Return Precautions',
      recommendations: [
        'Advise caregivers to return IMMEDIATELY if:',
        '  → Child becomes lethargic, difficult to rouse, or refuses fluids.',
        '  → Develops a non-blanching rash (petechiae or purpura).',
        '  → New symptoms appear: difficulty breathing, marked irritability, or seizure.',
        '  → No wet nappy for > 8 hours.',
        'Return for review if fever persists beyond 48–72 hours without improvement.',
        'Routine follow-up with GP in 48 h if fever persists.',
      ]
    });

    return sections;
  },

  getDisposition: (severity, data) => {
    const d = severity.details;
    const isToxic       = d.some(x => x.startsWith('TOXIC'));
    const isHighRiskAge = d.some(x => x.startsWith('HIGH_RISK_AGE'));
    const isHighRiskImm = d.some(x => x.startsWith('HIGH_RISK_IMMUNIZATION'));
    const isUtiRisk     = d.some(x => x.startsWith('UTI_RISK'));

    if (isToxic) {
      return [
        'ADMIT — PICU if haemodynamically unstable or rapid deterioration.',
        'Continue IV antibiotics; reassess with culture results at 24–48 h.',
        'Escalate care based on clinical response.',
      ];
    }
    if (isHighRiskAge) {
      return [
        'Admission recommended for all febrile infants aged 3–5 months, particularly if CBC/CRP is abnormal or UA is positive.',
        'Well-appearing infants 3–5 months with entirely normal workup may be considered for outpatient management with a single dose of parenteral antibiotics and guaranteed 24-hour follow-up — use shared decision-making.',
      ];
    }
    if (isHighRiskImm) {
      return [
        'Outpatient management with single dose of Ceftriaxone IM if CBC/CRP is abnormal — reliable 24-h follow-up mandatory.',
        'Admit if: follow-up is unreliable, child not tolerating fluids, or caregiver unable to monitor.',
      ];
    }
    if (isUtiRisk) {
      return [
        'Outpatient management appropriate for well-appearing children with isolated UTI risk.',
        'Admit if: child unwell, not tolerating oral fluids, UA positive with systemic signs, or follow-up unreliable.',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'Most cases can be managed as outpatients with close follow-up.',
        'Admit if clinically deteriorating, unable to maintain hydration, or follow-up is not reliable.',
      ];
    }
    return [
      'Discharge home with clear return precautions.',
      'Follow-up with GP if fever persists beyond 48–72 hours or child deteriorates.',
    ];
  },

  getRedFlags: () => [
    'Toxic or ill-appearance: lethargy, poor perfusion, mottled/pale/cyanotic skin, inconsolable.',
    'Non-blanching rash (petechiae or purpura) — consider meningococcaemia.',
    'Signs of meningitis: bulging fontanelle, nuchal rigidity, photophobia, severe headache.',
    'Seizure in a child with fever (especially first seizure or prolonged > 5 minutes).',
    'Significant respiratory distress or SpO₂ < 92% on air.',
    'No urine output for > 8 hours (sign of dehydration or renal compromise).',
    'Temperature ≥ 41°C at any age 3–36 months.',
    'Fever lasting > 5 days without a clear identifiable source.',
    'Extreme parental concern or inability to follow up reliably.',
  ],

  getDrugDoses: (severity, data) => {
    const d = severity.details;
    const isToxic   = d.some(x => x.startsWith('TOXIC'));
    const isLowRisk = d.some(x => x.startsWith('LOW_RISK'));
    const doses = [];

    if (!isLowRisk) {
      doses.push({
        drugName: 'Ceftriaxone (IV/IM)',
        dose: '50 mg/kg as a single dose (max 1 g; max 2 g if meningitis suspected)',
        notes: 'Empiric coverage for occult bacteremia or severe/parenteral UTI. Give before antibiotics in blood/urine culture.'
      });
    }
    if (isToxic) {
      doses.push({
        drugName: 'Vancomycin (IV)',
        dose: '15 mg/kg/dose every 6 hours (neonates: adjust; monitor trough levels)',
        notes: 'Add if meningitis or MRSA sepsis suspected. Consult local antibiogram and infectious disease guidelines.'
      });
      doses.push({
        drugName: 'Aciclovir (IV)',
        dose: '20 mg/kg/dose every 8 hours',
        notes: 'Consider if HSV encephalitis possible: age < 12 months, seizures, CSF pleocytosis, skin/oral vesicles.'
      });
    }
    doses.push({
      drugName: 'Cefalexin (oral)',
      dose: '25 mg/kg/dose 3 times daily (max 500 mg/dose) × 7–10 days',
      notes: 'First-line oral antibiotic for confirmed UTI. Check local sensitivities.'
    });
    doses.push({
      drugName: 'Trimethoprim (oral)',
      dose: '4 mg/kg/dose twice daily (max 200 mg/dose) × 7 days',
      notes: 'Alternative for UTI — check local resistance patterns before use. Avoid in neonates.'
    });
    doses.push({
      drugName: 'Amoxicillin (oral)',
      dose: '80–90 mg/kg/day in 2 divided doses (max 3 g/day) × 5–10 days',
      notes: 'For acute otitis media. Use amoxicillin-clavulanate if treatment failure or severe.'
    });
    doses.push({
      drugName: 'Paracetamol (oral / rectal)',
      dose: '15 mg/kg/dose every 4–6 hours (max 4 doses in 24 h)',
      notes: 'Antipyretic and analgesic. Suitable from 3 months. Preferred if < 6 months or dehydrated.'
    });
    doses.push({
      drugName: 'Ibuprofen (oral)',
      dose: '10 mg/kg/dose every 6–8 hours (max 40 mg/kg/day)',
      notes: 'Anti-inflammatory antipyretic. Only if ≥ 6 months, well-hydrated, no renal/GI concerns.'
    });

    return doses;
  },

  getReferences: () => [
    { title: 'AAP Clinical Practice Guideline: Urinary Tract Infection (2011, reaffirmed 2016)', url: 'https://publications.aap.org/pediatrics/article/128/3/595/30099' },
    { title: 'NICE NG143: Fever in under 5s — Assessment and Initial Management (2019)', url: 'https://www.nice.org.uk/guidance/ng143' },
    { title: 'UpToDate: Fever without a source in children 3 to 36 months of age', url: 'https://www.uptodate.com/contents/fever-without-a-source-in-children-3-to-36-months-of-age-evaluation-and-management' },
    { title: 'PECARN: Prediction rules and risk stratification tools for febrile children', url: 'https://pecarn.org' },
  ],
};
