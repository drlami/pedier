import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'neonate',          question: 'Age < 6 weeks? (Neonatal period)', redFlag: true,  ifYes: 'Any murmur + symptom in a neonate is critical CHD until proved otherwise. Duct-dependent lesions (aortic coarctation, HLHS, critical AS, PA/IVS) present as the ductus closes (day 2–14). Start prostaglandin E1 if suspected — do NOT wait for echo to confirm.' },
    { id: 'duct_dependent',   question: 'Signs suggesting duct-dependent lesion: shock/collapse after day 2 of life, differential cyanosis (lower body blue + upper body pink or vice versa), absent or reduced femoral pulses?', redFlag: true, ifYes: 'DUCT-DEPENDENT LESION: start PGE1 (alprostadil) immediately. Call PICU + cardiology + cardiac surgery. Upper limb SpO₂ and lower limb SpO₂ — differential cyanosis = coarctation or TAPVD.' },
    { id: 'poor_feeding',     question: 'Poor feeding, sweating with feeds, or failure to thrive in infant?', redFlag: true, ifYes: 'Increased metabolic demand due to cardiac work — signs of heart failure. Left-to-right shunt (VSD, AVSD) or obstructive left heart. Echo + diuretics + cardiology.' },
    { id: 'exercise_intol',   question: 'Exercise intolerance or dyspnoea on exertion in older child?', ifYes: 'Suggests significant haemodynamic burden: moderate-severe stenosis, significant shunt, cardiomyopathy. Classify by symptom onset — activities of daily living vs strenuous exercise.' },
    { id: 'syncope_murmur',   question: 'Syncope or presyncope associated with the murmur?', redFlag: true, ifYes: 'HCM outflow obstruction, severe aortic stenosis, or anomalous coronary — immediate cardiology. Strict rest until echo.' },
    { id: 'cyanosis_murmur',  question: 'Cyanosis: persistent blue discolouration of lips, tongue, or nail beds?', redFlag: true, ifYes: 'Central cyanosis with murmur = structural cyanotic CHD (TOF, TGA, TA, etc.). SpO₂ both upper and lower limbs. Hyperoxia test if diagnosis uncertain. Cardiology now.' },
    { id: 'family_marfan',    question: 'Family history of Marfan syndrome, bicuspid aortic valve, or aortic dissection?', ifYes: 'Aortic root dilation or bicuspid valve. Echo + regular surveillance. Avoid contact sports and isometric exercise.' },
    { id: 'fever_murmur',     question: 'Fever + new or changing murmur?', redFlag: true, ifYes: 'Endocarditis until proved otherwise. New murmur in a febrile child with any structural heart disease or recent dental/invasive procedure. Blood cultures × 3 before antibiotics. Echo (may be normal early — TOE if transthoracic non-diagnostic).' },
  ],

  investigations: [
    { test: '12-lead ECG', category: 'urgent', indication: 'LVH (deep S + tall R waves), RVH (dominant R in V1), biatrial enlargement, AV block (AV canal defect), WPW (Ebstein\'s anomaly association). Normal ECG does NOT exclude structural CHD.', criticalValue: 'LVH + deep narrow Q in V5/V6 = HCM pattern. Peaked P waves = right atrial enlargement.' },
    { test: 'SpO₂ — BOTH upper and lower limb simultaneously', category: 'urgent', indication: 'Differential cyanosis: lower limb SpO₂ < upper limb by > 3% = coarctation of aorta (post-ductal R→L). Both low = cyanotic CHD (TGA, TOF, TA).', criticalValue: 'SpO₂ < 92% = significant desaturation. Differential > 5% = duct-dependent systemic circulation.' },
    { test: 'Blood glucose + blood gas', category: 'urgent', indication: 'Shocked infant with murmur. Metabolic acidosis = severe haemodynamic compromise. Lactate elevation = poor cardiac output.' },
    { test: 'CXR', category: 'radiology', indication: 'Heart size (cardiomegaly CTR > 0.55), pulmonary vascular markings (plethora = L→R shunt; oligaemia = R→L), boot-shaped heart (TOF), egg on a string (TGA), snowman sign (TAPVD).', criticalValue: 'Cardiomegaly + pulmonary oedema = decompensated heart failure — diuretics and PICU.' },
    { test: 'Echocardiogram (transthoracic)', category: 'radiology', indication: 'DEFINITIVE investigation. Identifies anatomy, quantifies shunt and valve gradients. For ANY suspected structural CHD, pathological murmur features, or symptomatic child.', criticalValue: 'Critical AS gradient > 70 mmHg or mean > 50 mmHg, or severe MR/AR → urgent intervention discussion.' },
    { test: 'Blood culture × 3 (endocarditis)', category: 'blood', indication: 'Fever + new murmur + structural CHD or dental procedure within 6 weeks. Draw before starting antibiotics.' },
    { test: 'FBC + CRP + ESR (endocarditis/rheumatic)', category: 'blood', indication: 'Elevated inflammatory markers + murmur: acute rheumatic fever (pharyngitis + migratory arthritis + carditis) or endocarditis.' },
  ],

  admissionCriteria: [
    'Any cyanosis (SpO₂ < 94% in room air) with murmur',
    'Suspected duct-dependent lesion in neonate — PICU + PGE1',
    'Haemodynamic compromise: shock, hypotension, or significant tachycardia',
    'Heart failure symptoms: hepatomegaly, pulmonary oedema, poor perfusion in infant',
    'Syncope + murmur',
    'Fever + new murmur (endocarditis pathway)',
    'New murmur with any ECG or CXR abnormality',
    'Unstable or symptomatic murmur in a known CHD patient',
  ],

  highRiskFactors: [
    'Neonate (< 6 weeks) regardless of severity',
    'Known CHD — any new symptom lowers threshold',
    'Marfan syndrome or family aortopathy',
    'Immunosuppressed + murmur (endocarditis risk)',
    'Recent dental/invasive procedure + fever',
    'Diastolic or continuous murmur',
    'Loud grade ≥ 3 murmur',
  ],

  dischargeCriteria: [
    'Haemodynamically stable: HR, BP, SpO₂, RR all normal for age',
    'Innocent murmur features confirmed (soft systolic, no thrill, no click, normal S2, asymptomatic, no radiation)',
    'CXR and ECG reviewed and normal (or read by cardiologist if borderline)',
    'Echo arranged within 4–6 weeks (or done in ER if any doubt)',
    'No fever, cyanosis, tachypnoea, or feeding difficulty',
    'Cardiology or paediatric review before discharge if any pathological feature present',
    'Family clearly understands: which symptoms warrant immediate ER return',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: child develops blue lips or nails, breathing becomes fast or laboured, the child becomes sweaty during feeds, stops feeding well, or faints.',
    'A murmur alone (without symptoms and with a normal assessment) is usually benign — most children\'s heart murmurs are innocent and disappear with age.',
    'Echocardiogram appointment: do not miss — it is the definitive test to confirm the heart is normal.',
    'Until cleared by cardiology: do not restrict exercise in innocent murmur. DO restrict strenuous sport in any child with a suspected pathological murmur until echo result.',
    'Dental hygiene: inform dentist of any heart condition — antibiotic prophylaxis may be needed for dental procedures (cardiology will advise).',
  ],
};

export const murmurWithSymptomsProtocol: DiseaseProtocol = {
  id: 'murmur-with-symptoms',
  name: 'Murmur with Symptoms',
  system: 'Cardiovascular System',
  description: 'Evaluation of a heart murmur in a child, distinguishing innocent from pathological murmurs, and immediate management when murmur presents with concerning symptoms. A neonate + murmur + symptoms = critical CHD until proved otherwise.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/murmur-peds/600/400', hint: 'stethoscope heart' },
  erData,

  questions: [
    { id: 'weight',        questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'unstable',      questionText: 'Cyanosis, respiratory distress, shock, or haemodynamic compromise?', type: 'boolean', info: 'Any of these = critical presentation. Move to resuscitation area.' },
    { id: 'isSymptomatic', questionText: 'Concerning symptoms present?', type: 'boolean', info: 'FTT, sweating with feeds, exercise intolerance, syncope, chest pain, dyspnoea.' },
    { id: 'murmurTiming',  questionText: 'Murmur timing', type: 'select', options: [
      { label: 'Systolic only',     value: 'systolic',   score: 0 },
      { label: 'Diastolic',         value: 'diastolic',  score: 3 },
      { label: 'Continuous',        value: 'continuous', score: 2 },
      { label: 'Not yet listened',  value: 'pending',    score: 0 },
    ]},
    { id: 'murmurGrade',   questionText: 'Murmur grade', type: 'select', options: [
      { label: 'Grade 1–2/6 (soft, no thrill)', value: 'soft', score: 0 },
      { label: 'Grade ≥ 3/6 (loud) or thrill',  value: 'loud', score: 2 },
    ]},
    { id: 'hasThrill',     questionText: 'Thrill palpable?', type: 'boolean' },
    { id: 'hasClick',      questionText: 'Ejection click present?', type: 'boolean', info: 'Aortic or pulmonary stenosis.' },
    { id: 's2',            questionText: 'Second heart sound (S2)', type: 'select', options: [
      { label: 'Normally split',           value: 'normal',   score: 0 },
      { label: 'Fixed split or single S2', value: 'abnormal', score: 2 },
    ]},
    { id: 'hasFever',      questionText: 'Fever + possible endocarditis or rheumatic fever?', type: 'boolean', info: 'New murmur or changing murmur with fever in any child.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (data.unstable) {
      return {
        level: 'critical',
        details: ['Haemodynamic compromise + murmur = critical CHD or structural emergency. Move to resuscitation area.'],
      };
    }

    let score = 0;
    if (data.isSymptomatic)                                  { score += 3; details.push('Symptomatic child — pathological murmur likely.'); }
    if (data.murmurTiming === 'diastolic')                   { score += 3; details.push('Diastolic murmur — always pathological.'); }
    if (data.murmurTiming === 'continuous')                  { score += 2; details.push('Continuous murmur — PDA or arteriovenous fistula.'); }
    if (data.murmurGrade === 'loud' || data.hasThrill)       { score += 2; details.push(`${data.hasThrill ? 'Thrill palpable' : 'Grade ≥ 3 murmur'} — significant turbulence.`); }
    if (data.hasClick)                                       { score += 2; details.push('Ejection click — bicuspid/stenotic valve.'); }
    if (data.s2 === 'abnormal')                              { score += 2; details.push('Fixed split or single S2 — significant haemodynamic abnormality.'); }
    if (data.hasFever)                                       { score += 2; details.push('Fever + murmur — endocarditis or rheumatic fever pathway.'); }

    let level: SeverityLevel;
    let interpretation: string;

    if (score >= 4 || data.murmurTiming === 'diastolic' || data.hasFever) {
      level = 'severe';
      interpretation = 'PATHOLOGICAL — Urgent cardiology evaluation';
    } else if (score >= 2) {
      level = 'moderate';
      interpretation = 'POSSIBLE PATHOLOGICAL — Cardiology follow-up + echo';
    } else {
      level = 'mild';
      interpretation = 'INNOCENT FEATURES — Echo to confirm if any doubt';
    }

    if (score === 0 && !data.isSymptomatic) {
      details.push('Features consistent with an innocent murmur (soft systolic, no thrill, no click, normal S2, asymptomatic).');
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Murmur Pathology Score',
        totalScore: score,
        maxScore: 14,
        interpretation,
        referenceTable: [
          { range: '≥ 4 or diastolic', meaning: 'PATHOLOGICAL — urgent cardiology' },
          { range: '2 – 3',            meaning: 'POSSIBLE PATHOLOGICAL — echo + follow-up' },
          { range: '0 – 1',            meaning: 'INNOCENT — reassure + echo if uncertain' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Critical CHD / decompensated heart failure / endocarditis sepsis',
      recommendations: [
        'Duct-dependent lesion: Prostaglandin E1 (alprostadil) 0.05–0.1 mcg/kg/min IV — call PICU + cardiac surgery immediately.',
        'Critical AS or PS: no delay — catheter intervention (balloon valvuloplasty) is definitive in neonate.',
        'TAPVD (obstructed): emergency cardiac surgery — medical stabilisation only bridges.',
        'Decompensated heart failure: diuretics + inotropes (dopamine or dobutamine IV) + PICU.',
        'Endocarditis with septic shock: blood cultures × 3 → empiric antibiotics (vancomycin + gentamicin) → cardiology + cardiac surgery for valve assessment.',
        'CALL PICU + CARDIOLOGY + CARDIAC SURGERY NOW.',
      ],
    };

    if (severity.level === 'critical') {
      return [
        {
          title: 'STEP 1 — CRITICAL: Resuscitation + duct-dependent assessment',
          recommendations: [
            'Move to resuscitation area. O₂ + cardiac monitor + SpO₂ both upper and lower limbs.',
            'IV/IO access. Glucose + blood gas immediately.',
            'Paediatric Cardiology + PICU + Neonatology STAT.',
            data.unstable ? 'Neonate with shock + murmur: start PGE1 (0.05 mcg/kg/min) BEFORE echo confirmation if duct-dependent suspected — apnoea risk: have BVM ready.' : '',
            'CXR + ECG bedside.',
            'AVOID: hyperoxia (closes duct in duct-dependent lesions), excessive positive pressure.',
          ].filter(Boolean),
        },
        {
          title: 'STEP 2 — REASSESS: Echo + differential cyanosis',
          recommendations: [
            'Bedside echo (cardiologist or echo-trained physician): identify anatomy.',
            'SpO₂ differential: right hand vs foot — > 3% suggests coarctation (foot lower).',
            'Hyperoxia test (if TGA suspected): FiO₂ 1.0 for 10 min — SpO₂ fails to improve (< 95%) = R→L mixing at heart level.',
            'If PDA dependent confirmed: continue PGE1 + urgent transfer to cardiac centre.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Haemodynamic support pending intervention',
          recommendations: [
            'Dopamine 5–10 mcg/kg/min for poor cardiac output / shock.',
            'Furosemide IV 1 mg/kg if pulmonary oedema on CXR.',
            'Restrict fluids to 80% maintenance — avoid volume overload in LV failure.',
            'Antibiotics if endocarditis cannot be excluded.',
            'Urgent cardiac surgery / catheter referral.',
          ],
        },
        STEP4,
      ];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — PATHOLOGICAL MURMUR: ECG + CXR + cardiology',
          recommendations: [
            '12-lead ECG.',
            'CXR.',
            'SpO₂ (upper + lower limb if < 6 months).',
            data.hasFever ? 'Fever + murmur: blood cultures × 3 BEFORE antibiotics. CRP + FBC + ESR. Echo (TOE may be needed if TTE non-diagnostic for vegetations).' : '',
            'Urgent Paediatric Cardiology consultation.',
            'Echocardiogram — today.',
          ].filter(Boolean),
        },
        {
          title: 'STEP 2 — REASSESS: Echo result',
          recommendations: [
            'Confirmed structural CHD: admit for monitoring + specialist management plan.',
            'Endocarditis (vegetation on echo): empiric antibiotics + ID + cardiac surgery input.',
            'Rheumatic carditis: ASO + anti-DNAse + CXR + echo + rheumatology.',
            'Significant stenosis/regurgitation: quantify gradient/severity → intervention threshold discussion.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Haemodynamic compromise or heart failure',
          recommendations: [
            'Pulmonary oedema: furosemide 1 mg/kg IV + sitting up + O₂.',
            'Significant outflow obstruction: refer for urgent catheter or surgical intervention.',
            'Endocarditis with abscess or significant regurgitation: cardiac surgery consultation.',
            'PICU if any haemodynamic compromise.',
          ],
        },
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — POSSIBLE PATHOLOGICAL: ECG + CXR + cardiology review',
          recommendations: [
            '12-lead ECG.',
            'CXR.',
            'Paediatric Cardiology consultation (in-person or telephone).',
            'Echo within 2–4 weeks (or urgently if symptomatic).',
            'Document murmur characteristics precisely: location, timing, radiation, intensity, change with position.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: Is child symptomatic?',
          recommendations: [
            'Asymptomatic + no ECG/CXR abnormality → discharge with outpatient cardiology echo in 2–4 weeks.',
            'Any symptom (exercise intolerance, FTT) → admit or urgent outpatient.',
            'Child deteriorates in ER → STEP 3.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Symptoms or abnormal investigations',
          recommendations: [
            'Admit for inpatient echo + cardiology.',
            'Heart failure features: diuretic + fluid restriction.',
            'If on no treatment: do not start digoxin or beta-blocker without cardiology.',
          ],
        },
        STEP4,
      ];
    }

    // Innocent murmur
    return [
      {
        title: 'STEP 1 — INNOCENT MURMUR: Confirm + reassure',
        recommendations: [
          'Innocent murmur characteristics: soft (grade 1–2), systolic only, localised, no thrill, no click, normal S2, changes with position, asymptomatic.',
          'Still-\'s murmur: vibratory mid-systolic at LLSB — most common innocent murmur in children 3–7y.',
          'Pulmonary flow murmur: soft ejection systolic ULSB in thin-chested or febrile child.',
          'Peripheral pulmonary stenosis murmur: normal in neonates and infants under 6 months.',
          'No investigation routinely required if all features are classic and child is asymptomatic.',
          'Echo: if any doubt, first episode, or parental anxiety — arrange outpatient.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'Haemodynamically stable, SpO₂ normal, fully asymptomatic.',
          'No ECG or CXR abnormality (if done).',
          'Caregiver reassured with explanation: innocent murmur = normal variation, not heart disease.',
          'Safety netting: which symptoms warrant urgent return.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Features change during observation',
        recommendations: [
          'Any new symptom (feeding difficulty, tachypnoea) → re-examine and escalate.',
          'Febrile child: murmur intensity may increase with fever — reassess when afebrile.',
          'New click or change in S2 → cardiology input before discharge.',
        ],
      },
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'critical') return ['PICU admission. Cardiac surgery centre transfer if duct-dependent confirmed. Do not delay PGE1 for transfer.'];
    if (severity.level === 'severe') return ['Admit. Cardiology review + echo today. Endocarditis workup if fever present.'];
    if (severity.level === 'moderate') return ['Discharge with urgent outpatient cardiology echo in 2–4 weeks if asymptomatic. Admit if any symptoms.'];
    return ['Discharge with reassurance. Echo outpatient if any doubt or first episode in young child. No activity restriction for innocent murmur.'];
  },

  getRedFlags: () => [
    'Any diastolic murmur — always pathological',
    'Murmur + cyanosis — critical CHD',
    'Murmur + shock or poor perfusion in a neonate',
    'Murmur + syncope',
    'Fever + murmur in a child with structural CHD or recent dental procedure (endocarditis)',
    'Loud murmur (grade ≥ 3) with thrill',
    'Fixed split S2 (ASD pattern)',
    'Absent femoral pulses (coarctation of aorta)',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required.' });
      return doses;
    }

    const furose  = (1 * wt).toFixed(0);
    const dopamine = '5–10 mcg/kg/min IV';

    doses.push({ drugName: 'PGE1 (Alprostadil) IV — duct-dependent lesion', dose: '0.05–0.1 mcg/kg/min IV, titrate to effect', notes: 'HAVE BVM READY — apnoea in ~10% of cases. Start at lower end and titrate. Side effects: apnoea, hypotension, hyperthermia, jitteriness. Only with PICU oversight.' });
    doses.push({ drugName: 'Furosemide IV (heart failure)', dose: `${furose} mg IV (1 mg/kg)`, notes: 'For pulmonary oedema. Monitor urine output, electrolytes. NG tube to gastric decompression if distended.' });
    doses.push({ drugName: 'Dopamine IV (cardiogenic shock)', dose: dopamine, notes: '5 mcg/kg/min: renal/diuretic effect. 5–10: inotropic. > 10: vasopressor. Titrate in PICU. Avoid in HCM outflow obstruction.' });
    doses.push({ drugName: 'Endocarditis empiric therapy', dose: 'Vancomycin 15 mg/kg IV + Gentamicin 2.5 mg/kg IV', notes: 'Only after blood cultures × 3. Adjust based on culture results. Duration 4–6 weeks. Cardiology + ID to guide.' });

    return doses;
  },

  getReferences: () => [
    { title: 'Penny DJ, Vick GW — Ventricular septal defect. Lancet 2011', url: 'https://doi.org/10.1016/S0140-6736(10)61339-6' },
    { title: 'Habib G et al. — 2015 ESC Endocarditis Guidelines. Eur Heart J 2015', url: 'https://doi.org/10.1093/eurheartj/ehv319' },
    { title: 'Silberbach M, Hannon D — Presentation of congenital heart disease in the neonate and young infant. Pediatrics Rev 2007', url: 'https://doi.org/10.1542/pir.28-4-123' },
    { title: 'Pelech AN — The physiology of cardiac auscultation. Pediatr Clin N Am 2004', url: 'https://doi.org/10.1016/j.pcl.2004.01.012' },
  ],
};
