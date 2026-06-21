import type { DiseaseProtocol, FormData, Severity, ErInvestigation } from './types';

export const cervicalLymphadenitisProtocol: DiseaseProtocol = {
  id: 'cervical-lymphadenitis',
  name: 'Cervical Lymphadenitis',
  system: 'Infectious Diseases',
  unit: 'er',
  description:
    'Structured ER approach to cervical lymphadenitis in children — discriminates acute bacterial from subacute/chronic causes (NTM, Bartonella, EBV), identifies Kawasaki disease and malignancy, and guides antibiotic selection and disposition.',
  lastUpdated: 'June 2026',
  image: {
    url: 'https://picsum.photos/seed/cervical-lymphadenitis/600/400',
    hint: 'swollen neck lymph node child',
  },

  questions: [
    {
      id: 'weight',
      questionText: 'Patient weight',
      type: 'number',
      unit: 'kg',
    },
    {
      id: 'onset',
      questionText: 'Duration / onset pattern',
      type: 'select',
      options: [
        { label: 'Acute (≤ 2 weeks)', value: 'acute' },
        { label: 'Subacute or chronic (> 2 weeks)', value: 'subacute' },
      ],
      info: 'Subacute/chronic onset shifts the differential toward mycobacteria, Bartonella, EBV, toxoplasma, or malignancy.',
    },
    {
      id: 'laterality',
      questionText: 'Node distribution',
      type: 'select',
      options: [
        { label: 'Unilateral (single group)', value: 'unilateral' },
        { label: 'Bilateral (multiple groups)', value: 'bilateral' },
      ],
      info: 'Bilateral or generalised adenopathy favours viral/systemic causes; unilateral favours bacterial or regional infection.',
    },
    {
      id: 'symptoms',
      questionText: 'Clinical severity / appearance',
      type: 'select',
      options: [
        { label: 'Minimal — well-appearing, tolerating orally', value: 'minimal' },
        { label: 'Moderate — irritable, low-grade fever, some difficulty eating', value: 'moderate' },
        { label: 'Severe — ill-appearing, high fever, drooling, or difficulty swallowing', value: 'severe' },
      ],
    },
    {
      id: 'node_char',
      questionText: 'Node character on palpation',
      type: 'select',
      options: [
        { label: 'Reactive — soft, mobile, minimal erythema', value: 'reactive' },
        { label: 'Infected — warm, tender, with overlying erythema', value: 'infected' },
        { label: 'Fluctuant — palpable fluid / pointing abscess', value: 'fluctuant' },
        { label: 'Suspicious — hard, fixed, matted, or supraclavicular', value: 'suspicious' },
      ],
      info: 'Supraclavicular nodes are suspicious for malignancy until proven otherwise — refer urgently for biopsy.',
    },
    {
      id: 'kawasaki_score',
      questionText: 'Kawasaki disease features',
      type: 'select',
      options: [
        { label: 'None — fever < 5 days or no other features', value: 'none' },
        { label: 'Some — fever ≥ 5 days + 1–2 Kawasaki features', value: 'some' },
        { label: 'High — fever ≥ 5 days + ≥ 3 features (rash, conjunctivitis, lip/tongue changes, hand oedema)', value: 'high' },
      ],
      info: 'Cervical adenopathy is the least common Kawasaki criterion — actively look for the other four.',
    },
  ],

  erData: {
    historyChecklist: [
      // ── RED FLAGS ──────────────────────────────────────────────────────────
      {
        id: 'drooling_neck',
        question: 'Drooling, neck stiffness, stridor, muffled voice, or dysphagia present?',
        redFlag: true,
        ifYes: 'Possible deep neck space infection or airway compromise — immediate ENT consult + airway prep.',
      },
      {
        id: 'malignancy_node',
        question: 'Node is hard, fixed, matted, painless, or supraclavicular in location?',
        redFlag: true,
        ifYes: 'Malignancy must be excluded — avoid I&D; refer urgently for excisional biopsy.',
      },
      {
        id: 'kawasaki_flag',
        question: 'Fever ≥ 5 days + ≥ 2 Kawasaki features (rash, conjunctivitis, lip/tongue changes, hand/foot oedema)?',
        redFlag: true,
        ifYes: 'Kawasaki disease criteria met — IVIG 2 g/kg + high-dose aspirin + cardiology echo.',
      },
      {
        id: 'immunocompromised',
        question: 'Known immunodeficiency, on steroids/biologics, or HIV-positive?',
        redFlag: true,
        ifYes: 'Atypical pathogens likely — broaden empiric coverage and lower threshold to admit.',
      },
      // ── CONTEXT ───────────────────────────────────────────────────────────
      {
        id: 'cat_exposure',
        question: 'Cat scratch, bite, or close cat contact in the past 3 weeks?',
        ifYes: 'Bartonella henselae (Cat Scratch Disease) — consider Azithromycin 5-day course.',
      },
      {
        id: 'periodontal',
        question: 'Dental pain, caries, gingivitis, or peritonsillar exudate?',
        ifYes: 'Anaerobic/mixed flora likely — prefer Amoxicillin-Clavulanate or add Metronidazole.',
      },
      {
        id: 'tb_exposure',
        question: 'TB contact, travel to endemic area, or unvaccinated (BCG)?',
        ifYes: 'NTM / TB in differential — avoid empiric I&D (may cause chronic draining sinus); TST/IGRA + chest X-ray.',
      },
      {
        id: 'exudative_pharyngitis',
        question: 'Tonsillar exudate, palatal petechiae, or splenomegaly (EBV / mono features)?',
        ifYes: 'Suspect EBV mononucleosis — DO NOT prescribe amoxicillin or ampicillin (causes rash in ~90%); order monospot + EBV titres.',
      },
      {
        id: 'generalized_lymph',
        question: 'Lymphadenopathy beyond the cervical region (axillary, inguinal, or mediastinal)?',
        ifYes: 'Generalised adenopathy — broaden differential to viral (EBV, CMV), systemic infection, or malignancy.',
      },
      {
        id: 'hepatosplenomegaly',
        question: 'Hepatomegaly or splenomegaly on abdominal exam?',
        ifYes: 'Suggests systemic disease — EBV, CMV, leishmaniasis, or haematological malignancy.',
      },
      {
        id: 'recent_covid',
        question: 'Recent COVID-19 infection or exposure within the past 4 weeks?',
        ifYes: 'MIS-C must be considered — check inflammatory markers (CRP, ferritin, troponin) and cardiac status.',
      },
    ],
    investigations: [
      { test: 'CBC with differential', category: 'blood', indication: 'Leukocytosis + left shift → bacterial; atypical lymphocytes → EBV' },
      { test: 'CRP + ESR', category: 'blood', indication: 'CRP > 20 mg/L supports bacterial; ESR > 40 in Kawasaki or subacute' },
      { test: 'Blood culture ×2', category: 'blood', indication: 'Before antibiotics in all admitted children with fever' },
      { test: 'Neck ultrasound', category: 'radiology', indication: 'Confirms abscess vs cellulitis; guides drainage planning', criticalValue: 'Hypoechoic collection = abscess — needs drainage' },
    ],
    admissionCriteria: [
      'Drooling, stridor, or any sign of airway compromise',
      'Suspected deep neck space infection (parapharyngeal, retropharyngeal, Ludwig\'s angina)',
      'Kawasaki disease or MIS-C (IVIG administration required in hospital)',
      'Fluctuant abscess requiring surgical I&D',
      'Ill-appearing or toxic child with high fever',
      'Immunocompromised host',
      'Failure to improve after 48–72 h of appropriate oral antibiotics',
      'Unable to tolerate oral fluids or medications',
      'Age < 3 months or unreliable follow-up',
    ],
    highRiskFactors: [
      'Node > 3 cm with surrounding cellulitis',
      'Bilateral involvement with systemic symptoms',
      'Rapidly enlarging node over < 24 h',
      'Suspected mycobacterial or NTM infection',
    ],
    dischargeCriteria: [
      'Alert, well-appearing, tolerating oral fluids and medications',
      'No airway concern, no drooling or stridor',
      'Abscess — if present — adequately drained with no deeper extension on imaging',
      'Oral antibiotic therapy prescribed with clear 24–48 h follow-up arranged',
      'Caregivers verbally confirm understanding of return precautions',
    ],
    safetyNetting: [
      'Return immediately if: neck swelling worsens, difficulty breathing or swallowing, drooling starts, high fever not responding to antipyretics, or child becomes lethargic or toxic',
      'Expect 24–48 h before visible improvement on oral antibiotics — mandatory re-evaluation at 48 h',
      'Mark the skin border of erythema with a pen at discharge to objectively track spread',
      'Complete the full antibiotic course even after symptoms improve',
    ],
  },

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    // ── RED FLAG EARLY RETURNS ──────────────────────────────────────────────
    if (data.drooling_neck === true) {
      details.unshift('DEEP NECK SPACE / AIRWAY — Call ENT stat; prepare for airway intervention');
      return { level: 'critical', details };
    }

    if (data.malignancy_node === true || data.node_char === 'suspicious') {
      details.unshift('MALIGNANCY SUSPECTED — avoid I&D; urgent excisional biopsy + haematology/oncology referral');
      if (data.malignancy_node) details.push('Clinical flag: hard/fixed/matted or supraclavicular node');
      if (data.node_char === 'suspicious') details.push('Node character: suspicious on palpation');
      return { level: 'severe', details };
    }

    if (data.kawasaki_flag === true || data.kawasaki_score === 'high') {
      details.unshift('KAWASAKI / MIS-C — IVIG 2 g/kg single dose + high-dose Aspirin; echo within 24 h');
      if (data.kawasaki_flag) details.push('Clinical Kawasaki criteria met (flag)');
      if (data.kawasaki_score === 'high') details.push('High Kawasaki feature score (fever ≥ 5d + ≥ 3 features)');
      return { level: 'severe', details };
    }

    if (data.symptoms === 'severe') {
      details.unshift('ILL-APPEARING — admit, IV antibiotics, urgent imaging');
      details.push('Severe clinical appearance / difficulty swallowing / high fever');
      return { level: 'severe', details };
    }

    if (data.node_char === 'fluctuant') {
      if (data.onset === 'subacute') {
        details.unshift('ABSCESS (subacute onset) — NTM likely; excisional biopsy preferred over I&D; send full cultures');
        details.push('Subacute onset + fluctuant node → NTM risk (I&D causes chronic draining sinus)');
      } else {
        details.unshift('ABSCESS — I&D + IV antibiotics; send abscess cultures (aerobic, anaerobic, MRSA, mycobacteria)');
        details.push('Fluctuant node confirmed on palpation');
      }
      return { level: 'severe', details };
    }

    // ── SUBACUTE / CHRONIC ──────────────────────────────────────────────────
    if (data.onset === 'subacute') {
      details.unshift('SUBACUTE / CHRONIC — full workup (TST/IGRA, Bartonella, EBV/CMV); specialist referral; no empiric antibiotics');
      if (data.cat_exposure) details.push('Cat exposure → Bartonella (CSD) likely');
      if (data.tb_exposure) details.push('TB risk → TST/IGRA + chest X-ray mandatory');
      if (data.exudative_pharyngitis) details.push('EBV features — DO NOT prescribe amoxicillin');
      if (data.generalized_lymph || data.hepatosplenomegaly) details.push('Generalised adenopathy / organomegaly → malignancy workup');
      return { level: 'moderate', details };
    }

    // ── ACUTE: SCORE ACTIVE FINDINGS ────────────────────────────────────────
    let score = 0;

    if (data.kawasaki_score === 'some') {
      details.push('Incomplete Kawasaki features — monitor; check CRP/ESR/echo if fever persists past day 5');
      score++;
    }
    if (data.immunocompromised === true) {
      details.push('Immunocompromised — broader empiric coverage, lower admit threshold');
      score++;
    }
    if (data.node_char === 'infected') {
      details.push('Infected node — warm, tender, with overlying erythema');
      score += 2;
    }
    if (data.laterality === 'unilateral') {
      details.push('Unilateral adenopathy — favours focal bacterial source');
      score++;
    }
    if (data.symptoms === 'moderate') {
      details.push('Moderate symptoms — low-grade fever, irritable, reduced intake');
      score++;
    }
    if (data.periodontal === true) {
      details.push('Dental/periodontal source — anaerobic coverage needed (Amox-Clav preferred)');
      score++;
    }
    if (data.exudative_pharyngitis === true) {
      details.push('EBV features present — DO NOT prescribe amoxicillin/ampicillin');
    }
    if (data.recent_covid === true) {
      details.push('Recent COVID — consider MIS-C; check ferritin, troponin, CRP');
    }

    if (score >= 3) {
      details.unshift('ACUTE BACTERIAL LYMPHADENITIS — oral antibiotics + mandatory 48 h follow-up');
      return { level: 'moderate', details };
    }

    if (score >= 1) {
      details.unshift('PROBABLE VIRAL / REACTIVE — monitor; targeted oral antibiotic only if bacterial features persist at 48 h');
      return { level: 'mild', details };
    }

    details.unshift('LOW RISK REACTIVE ADENOPATHY — supportive care + return precautions');
    return { level: 'low', details };
  },

  getInvestigations: (severity, data): ErInvestigation[] => {
    const inv: ErInvestigation[] = [];
    const added = new Set<string>();
    const add = (item: ErInvestigation) => {
      if (!added.has(item.test)) { inv.push(item); added.add(item.test); }
    };

    const baseBlood = () => {
      add({ test: 'CBC with differential', category: 'blood', indication: 'Leukocytosis + left shift → bacterial; atypical lymphocytes → EBV; blast cells → malignancy' });
      add({ test: 'CRP + ESR', category: 'blood', indication: 'CRP > 20 mg/L supports bacterial; ESR > 40 in Kawasaki or subacute infection' });
    };

    // Critical — airway / deep neck space
    if (severity.level === 'critical') {
      baseBlood();
      add({ test: 'Blood culture ×2 (before antibiotics)', category: 'blood', indication: 'Required before first antibiotic dose' });
      add({ test: 'CT neck with contrast', category: 'radiology', indication: 'Map deep neck space extension; distinguish Ludwig\'s / parapharyngeal / retropharyngeal abscess', criticalValue: 'Rim-enhancing collection = operative drainage needed — ENT to OR' });
      add({ test: 'Neck ultrasound', category: 'radiology', indication: 'Bedside initial assessment; may precede CT' });
      return inv;
    }

    // Severe — malignancy suspected
    if (data.malignancy_node === true || data.node_char === 'suspicious') {
      baseBlood();
      add({ test: 'LDH + uric acid', category: 'blood', indication: 'Malignancy screen — elevated in lymphoma / leukaemia', criticalValue: 'Very high LDH + uric acid = haematology consult stat' });
      add({ test: 'Peripheral blood smear', category: 'blood', indication: 'Blast cells = leukaemia', criticalValue: 'Blasts on smear = haematology referral today' });
      add({ test: 'Chest X-ray', category: 'radiology', indication: 'Mediastinal widening → lymphoma; hilar adenopathy → sarcoid / TB' });
      add({ test: 'Neck ultrasound', category: 'radiology', indication: 'Characterise node — solid vs cystic; guide biopsy planning' });
      return inv;
    }

    // Kawasaki / MIS-C
    if (data.kawasaki_flag === true || data.kawasaki_score !== 'none' || data.recent_covid === true) {
      baseBlood();
      add({ test: 'ESR + CRP + albumin + ALT', category: 'blood', indication: 'Kawasaki labs — ESR ≥ 40 + CRP ≥ 30 + low albumin support diagnosis' });
      add({ test: 'Platelet count + LFTs + UA', category: 'blood', indication: 'Thrombocytosis (late), hepatitis, sterile pyuria all support Kawasaki' });
      add({ test: 'Ferritin + troponin', category: 'blood', indication: 'MIS-C screen — very high ferritin + troponin elevation' });
      add({ test: 'Echo (echocardiogram)', category: 'radiology', indication: 'Assess coronary arteries; repeat at 2 and 6 weeks', criticalValue: 'Coronary z-score ≥ 2.5 = aneurysm — continue aspirin indefinitely' });
    }

    // Acute severe / abscess
    if (severity.level === 'severe' && data.node_char === 'fluctuant') {
      baseBlood();
      add({ test: 'Blood culture ×2 (before antibiotics)', category: 'blood', indication: 'Required for all febrile admitted children' });
      add({ test: 'Neck ultrasound', category: 'radiology', indication: 'Confirm abscess; measure depth and size to guide I&D', criticalValue: 'Hypoechoic collection with posterior acoustic enhancement = abscess' });
      add({ test: 'Abscess cultures at time of drainage (aerobic + anaerobic + MRSA screen + mycobacterial)', category: 'other', indication: data.onset === 'subacute' ? 'Extended cultures critical — NTM grows slowly; alert lab' : 'Standard surgical cultures; request MRSA rapid screen' });
    }

    // Subacute / chronic
    if (data.onset === 'subacute') {
      baseBlood();
      add({ test: 'TST or IGRA (QuantiFERON-TB Gold)', category: 'other', indication: 'Screen for TB and NTM in subacute/chronic cervical adenopathy' });
      add({ test: 'Bartonella henselae IgM + IgG serology', category: 'blood', indication: 'Cat scratch disease — titres positive 3–4 weeks after exposure' });
      add({ test: 'EBV VCA IgM + IgG + heterophile antibody (monospot)', category: 'blood', indication: 'Infectious mononucleosis — monospot unreliable < 4 years; use titres' });
      add({ test: 'CMV IgM + IgG', category: 'blood', indication: 'EBV-negative mononucleosis-like syndrome' });
      add({ test: 'Chest X-ray', category: 'radiology', indication: 'Hilar adenopathy → TB, sarcoidosis, or lymphoma' });
      add({ test: 'Neck ultrasound', category: 'radiology', indication: 'Characterise subacute node; calcification suggests mycobacterial infection' });
      if (data.generalized_lymph || data.hepatosplenomegaly || data.malignancy_node) {
        add({ test: 'LDH + uric acid + peripheral blood smear', category: 'blood', indication: 'Malignancy screen', criticalValue: 'Blast cells or very high LDH = haematology stat' });
      }
    }

    // EBV-specific flag
    if (data.exudative_pharyngitis === true) {
      add({ test: 'EBV monospot + VCA IgM (if not already ordered)', category: 'blood', indication: 'Rule out EBV before prescribing any aminopenicillin — 90% rash risk' });
    }

    // Acute moderate baseline
    if (inv.length === 0 && (severity.level === 'moderate' || severity.level === 'mild')) {
      baseBlood();
      add({ test: 'Neck ultrasound (if node > 2.5 cm or no improvement at 48 h)', category: 'radiology', indication: 'Rules out early abscess formation before discharge' });
    }

    return inv;
  },

  getManagement: (severity, data) => {
    const steps: { title: string; recommendations: string[] }[] = [];

    // ── STEP 1: AIRWAY / DEEP NECK SPACE ────────────────────────────────────
    if (severity.level === 'critical') {
      steps.push({
        title: 'STEP 1 — AIRWAY & DEEP NECK SPACE EMERGENCY',
        recommendations: [
          'Call ENT STAT — immediate bedside airway assessment',
          'Position upright; avoid neck flexion; do not lay flat (risk of complete obstruction)',
          'Prepare suction, bag-mask, and laryngoscope; anaesthesia on standby if stridor present',
          'IV access ×2 + blood cultures before antibiotics',
          'CT neck with contrast — map extent; distinguish parapharyngeal / retropharyngeal / Ludwig\'s',
          'Ceftriaxone IV 50 mg/kg (max 2 g) + Metronidazole IV 15 mg/kg/dose (max 500 mg) q8h — cover mixed oral flora and anaerobes',
          'Add Vancomycin IV 15 mg/kg/dose q6h (max 750 mg/dose) if local MRSA > 15% or prior MRSA',
          'NPO pending ENT decision — surgical drainage often required',
        ],
      });
      return steps;
    }

    // ── STEP 2: KAWASAKI / MIS-C ─────────────────────────────────────────────
    if (data.kawasaki_flag === true || data.kawasaki_score === 'high') {
      steps.push({
        title: 'STEP 2 — KAWASAKI / MIS-C PATHWAY',
        recommendations: [
          'Admit — general paediatrics with cardiology support',
          'IVIG 2 g/kg IV single dose infused over 10–12 h (give within 10 days of fever onset)',
          'Aspirin 80–100 mg/kg/day ÷ QID (max 4 g/day) during febrile phase',
          'Cardiology consult + echo within 24 h — assess coronary arteries (z-score)',
          'Repeat echo at 2 weeks and 6 weeks regardless of initial result',
          'Step down Aspirin to 3–5 mg/kg/day (max 100 mg) once afebrile × 48 h; continue 6–8 weeks (lifelong if aneurysm)',
          'IVIG resistance (fever persists > 36 h after infusion): second IVIG 2 g/kg OR Infliximab — discuss with cardiology',
          'Incomplete Kawasaki: treat if ≥ 3 supplemental laboratory criteria met (CRP ≥ 30, ESR ≥ 40, anaemia, albumin ≤ 30, ALT elevated, WBC ≥ 15, UA ≥ 10 WBC/hpf)',
        ],
      });
      return steps;
    }

    // ── STEP 3A: SEVERE — IV / ADMITTED ──────────────────────────────────────
    if (severity.level === 'severe') {
      const drainageNote = data.node_char === 'fluctuant' && data.onset === 'subacute'
        ? 'Subacute/chronic onset + abscess → excisional biopsy preferred (not simple I&D); I&D risks chronic draining sinus with NTM'
        : data.node_char === 'fluctuant'
          ? 'I&D (incision and drainage) — aspirate or open; send abscess cultures (aerobic, anaerobic, MRSA, mycobacteria, fungal)'
          : 'Neck ultrasound to confirm abscess — ENT for drainage planning if collection confirmed';

      steps.push({
        title: 'STEP 3A — ACUTE SUPPURATIVE / SEVERE — IV THERAPY',
        recommendations: [
          'IV access + blood cultures ×2 before first antibiotic dose',
          'Neck ultrasound (STAT) to confirm abscess vs cellulitis and map extent',
          data.periodontal
            ? 'Ampicillin-Sulbactam IV (Unasyn) 200 mg/kg/day ÷ q6h (max 3 g/dose) — dental/periodontal anaerobic cover'
            : 'Ceftriaxone IV 50 mg/kg/day (max 2 g) once daily — first-line for acute bacterial',
          'Vancomycin IV 15 mg/kg/dose q6h (max 750 mg/dose) — add if local MRSA > 15% or prior MRSA history; target AUC/MIC 400–600',
          drainageNote,
          'Reassess 24–48 h; step down to oral once afebrile × 24 h and tolerating PO',
          'Total course: 10–14 days for severe; 5–7 days for moderate responding well',
        ],
      });
    }

    // ── STEP 3B: MODERATE — ORAL OUTPATIENT ──────────────────────────────────
    if (severity.level === 'moderate') {
      const firstLine = data.exudative_pharyngitis
        ? 'Avoid amoxicillin/ampicillin — 90% rash risk if EBV. Use Cephalexin 25 mg/kg/dose q6h (max 500 mg/dose) for Strep/MSSA, or await EBV monospot result before prescribing'
        : data.periodontal
          ? 'Amoxicillin-Clavulanate 40 mg/kg/day ÷ TID (max 875 mg/dose) — first-line for dental/anaerobic source'
          : 'Amoxicillin-Clavulanate 40 mg/kg/day ÷ TID (max 875 mg/dose) — first-line for acute bacterial (covers Staph, Strep, anaerobes)';

      steps.push({
        title: 'STEP 3B — ACUTE BACTERIAL — ORAL OUTPATIENT',
        recommendations: [
          firstLine,
          data.cat_exposure
            ? 'Cat scratch disease (Bartonella): Azithromycin 10 mg/kg day 1 (max 500 mg), then 5 mg/kg/day days 2–5 (max 250 mg/day)'
            : 'MRSA alternative: TMP-SMX 4 mg/kg TMP BID (max 160 mg TMP/dose) or Clindamycin 10 mg/kg/dose TID (max 300 mg) — check local resistance rates first',
          'Mark erythema border at discharge to objectively track spread',
          'Ibuprofen 10 mg/kg/dose q6–8h PRN for analgesia and fever',
          '24–48 h follow-up mandatory — admit if worsening or no response by 48 h',
          'Total course: 10 days for confirmed bacterial; 5 days for CSD',
        ],
      });
    }

    // ── STEP 4: SUBACUTE / CHRONIC ────────────────────────────────────────────
    if (data.onset === 'subacute') {
      steps.push({
        title: 'STEP 4 — SUBACUTE / CHRONIC PATHWAY',
        recommendations: [
          'Do NOT prescribe empiric antibiotics — investigation-guided therapy only',
          'Order: TST/IGRA, Bartonella IgM/IgG, EBV + CMV titres, chest X-ray',
          data.cat_exposure
            ? 'High CSD probability — Azithromycin 5-day course; most cases resolve in 2–4 months without treatment'
            : 'CSD possible without known cat contact — serology still required',
          data.tb_exposure
            ? 'NTM / TB likely — AVOID I&D (risks chronic draining sinus). Refer paediatric ID. Excisional biopsy is both diagnostic AND curative for NTM scrofulaceum/avium complex.'
            : 'NTM cannot be excluded without culture — refer if node persists > 6 weeks; excisional biopsy preferred',
          data.exudative_pharyngitis
            ? 'EBV mononucleosis: supportive care. Avoid contact sports until splenomegaly resolves. AVOID amoxicillin/ampicillin.'
            : 'EBV serology if monospot positive — no specific treatment; supportive',
          (data.malignancy_node || data.generalized_lymph || data.hepatosplenomegaly)
            ? 'Malignancy high on differential — LDH, uric acid, blood smear, urgent haematology consult'
            : 'Refer to paediatric ID or paediatric ENT if no diagnosis after initial workup',
        ],
      });
    }

    // ── STEP (MILD / LOW RISK): VIRAL / REACTIVE ─────────────────────────────
    if (steps.length === 0) {
      steps.push({
        title: 'REACTIVE / VIRAL ADENOPATHY — SUPPORTIVE CARE',
        recommendations: [
          'No antibiotics required for reactive or viral lymphadenopathy',
          'Ibuprofen 10 mg/kg/dose q6–8h PRN for pain and fever',
          'Reassure caregivers — reactive nodes typically resolve in 4–6 weeks',
          'Return precautions: node enlarging rapidly, overlying redness develops, fever persists > 1 week, child appears increasingly unwell',
          'Primary care follow-up within 2 weeks; re-evaluate sooner if not improving',
        ],
      });
    }

    return steps;
  },

  getDisposition: (severity, data) => {
    if (severity.level === 'critical') {
      return [
        'ADMIT — PICU or ENT ward per airway status; NPO',
        'Anaesthesia on standby; ENT for operative drainage',
        'IV antibiotics: Ceftriaxone + Metronidazole ± Vancomycin',
      ];
    }
    if (data.kawasaki_flag === true || data.kawasaki_score === 'high') {
      return [
        'ADMIT — general paediatrics with cardiology involvement',
        'IVIG 2 g/kg infusion + high-dose Aspirin + echo within 24 h',
      ];
    }
    if (severity.level === 'severe') {
      return [
        'ADMIT — IV antibiotics; ENT if abscess confirmed on imaging',
        'Surgical I&D if fluctuant (unless subacute onset → excisional biopsy preferred)',
        'Step down to oral antibiotics when afebrile × 24 h and tolerating PO',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'DISCHARGE on oral antibiotics with 24–48 h follow-up',
        'Admit if: age < 3 months, unable to tolerate PO, unreliable follow-up, or immunocompromised',
        'Mark erythema border + return precautions given verbally',
      ];
    }
    if (data.onset === 'subacute') {
      return [
        'DISCHARGE with specialist referral (Paediatric ID or ENT)',
        'Investigations ordered as outpatient; no empiric antibiotics',
        'Follow-up within 1–2 weeks for results review',
      ];
    }
    return [
      'DISCHARGE — supportive care + return precautions',
      'Primary care follow-up in 2 weeks if not improving',
    ];
  },

  getRedFlags: () => [
    'Drooling, stridor, or muffled voice — airway compromise imminent',
    'Neck rigidity or inability to flex neck — deep neck space infection',
    'Supraclavicular node — malignancy until proven otherwise',
    'Hard, fixed, non-tender, or matted nodes — lymphoma / malignancy',
    'Rapidly enlarging node over hours — abscess or haemorrhage into node',
    'Fever ≥ 5 days + conjunctivitis / rash / lip changes — Kawasaki disease',
    'Failure to improve after 48–72 h of appropriate oral antibiotics',
    'Systemic symptoms: weight loss, night sweats, pallor — TB or malignancy',
    'Chronic draining sinus after I&D of subacute node — NTM complication',
  ],

  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    const perDose = (mgKgDose: number, maxMg: number) =>
      w ? ` → ${Math.min(Math.round(mgKgDose * w), maxMg)} mg/dose` : '';
    const perDay = (mgKgDay: number, maxMg: number) =>
      w ? ` → ${Math.min(Math.round(mgKgDay * w), maxMg)} mg/day` : '';

    return [
      {
        drugName: 'Amoxicillin-Clavulanate (oral)',
        dose: `40 mg/kg/day ÷ TID${perDose(40 / 3, 875)}`,
        notes: 'First-line for acute bacterial; max 875 mg amoxicillin/dose. Preferred if dental/anaerobic source.',
      },
      {
        drugName: 'Cephalexin (oral)',
        dose: `25 mg/kg/dose q6h${perDose(25, 500)}`,
        notes: 'Alternative when EBV suspected (avoids amoxicillin rash). MSSA + Strep only — no MRSA coverage.',
      },
      {
        drugName: 'Clindamycin (oral)',
        dose: `10 mg/kg/dose TID${perDose(10, 300)}`,
        notes: 'MRSA alternative — check local resistance (avoid if clindamycin resistance > 15%). Max 300 mg/dose.',
      },
      {
        drugName: 'TMP-SMX (oral)',
        dose: `4 mg/kg TMP BID${perDose(4, 160)} TMP`,
        notes: 'MRSA option. Avoid in neonates and sulfa allergy. Max 160 mg TMP/dose.',
      },
      {
        drugName: 'Azithromycin (Bartonella / CSD)',
        dose: `Day 1: 10 mg/kg${w ? ` → ${Math.min(Math.round(10 * w), 500)} mg` : ''} | Days 2–5: 5 mg/kg${w ? ` → ${Math.min(Math.round(5 * w), 250)} mg` : ''}`,
        notes: '5-day course for Cat Scratch Disease. Max 500 mg day 1, 250 mg days 2–5.',
      },
      {
        drugName: 'Ceftriaxone IV',
        dose: `50 mg/kg/day once daily${perDay(50, 2000)}`,
        notes: 'First-line IV for admitted children. Step down to oral when afebrile × 24 h. Max 2 g/day.',
      },
      {
        drugName: 'Vancomycin IV',
        dose: `15 mg/kg/dose q6h${perDose(15, 750)}`,
        notes: 'MRSA coverage — AUC/MIC guided dosing (target 400–600). Max 750 mg/dose. Monitor renal function.',
      },
      {
        drugName: 'Metronidazole IV',
        dose: `15 mg/kg/dose q8h${perDose(15, 500)}`,
        notes: 'Deep neck space / anaerobic coverage. Max 500 mg/dose.',
      },
      {
        drugName: 'IVIG (Kawasaki disease)',
        dose: `2 g/kg single dose${w ? ` → ${(2 * w).toFixed(1)} g total` : ''}`,
        notes: 'Infuse over 10–12 h. Give within 10 days of fever onset. Repeat dose or Infliximab if IVIG-resistant.',
      },
      {
        drugName: 'Aspirin high-dose (Kawasaki — febrile phase)',
        dose: `80–100 mg/kg/day ÷ QID${perDose(90 / 4, 1000)}`,
        notes: 'Continue until afebrile × 48 h, then step down. Max 4 g/day (1 g/dose × 4 doses).',
      },
      {
        drugName: 'Aspirin low-dose (Kawasaki — maintenance)',
        dose: `3–5 mg/kg/day once daily${perDay(5, 100)}`,
        notes: 'After afebrile × 48 h — continue 6–8 weeks (indefinitely if coronary aneurysm). Max 100 mg/day.',
      },
    ];
  },

  getReferences: () => [
    {
      title: 'UpToDate: Cervical lymphadenitis in children — Diagnostic approach and initial management (Topic 6061 v47.0)',
      url: 'https://www.uptodate.com/contents/cervical-lymphadenitis-in-children-diagnostic-approach-and-initial-management',
    },
    {
      title: 'Swanson DS. Cervical lymphadenitis: Etiology and clinical features. UpToDate.',
      url: 'https://www.uptodate.com/contents/cervical-lymphadenitis-etiology-and-clinical-features',
    },
    {
      title: 'Newburger JW et al. Diagnosis, Treatment, and Long-Term Management of Kawasaki Disease. Circulation. 2017.',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000484',
    },
    {
      title: 'Chesney PJ. Cervical lymphadenitis. Pediatr Rev. 1994;15(7):276–284.',
      url: 'https://doi.org/10.1542/pir.15-7-276',
    },
  ],
};
