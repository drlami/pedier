import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'exertional',    question: 'Pain occurs DURING peak exercise (not just after)?', redFlag: true,  ifYes: 'Exertional chest pain is the highest-risk feature. Suggests anomalous coronary, HCM outflow obstruction, arrhythmia, or severe aortic stenosis. Immediate ECG + lying supine + cardiology call.' },
    { id: 'syncope_cp',   question: 'Associated syncope, presyncope, or near-collapse?', redFlag: true,  ifYes: 'Chest pain + syncope = possible arrhythmia or structural outflow obstruction. High-risk combination — treat as cardiac emergency until proved otherwise.' },
    { id: 'kawasaki',     question: 'History of Kawasaki disease (especially within 2 years, or untreated)?', redFlag: true, ifYes: 'Kawasaki + chest pain = possible coronary artery aneurysm / thrombosis / myocardial ischaemia. Treat as ischaemia — aspirin, ECG, troponin, echo. Cardiology immediately.' },
    { id: 'family_scd',   question: 'Family history of sudden unexplained death < 40 years, HCM, long QT, or Marfan?', redFlag: true, ifYes: 'Familial cardiac disorders. 12-lead ECG mandatory. Cardiology referral even if current episode is low-risk.' },
    { id: 'known_chd',    question: 'Known congenital heart disease or prior cardiac surgery?', redFlag: true, ifYes: 'Any chest pain in a child with CHD is cardiac until proved otherwise. ECG, echo, cardiology.' },
    { id: 'palpitations_cp', question: 'Associated palpitations at the time of chest pain?', redFlag: false, ifYes: 'Possible arrhythmia-related chest pain. ECG mandatory. Holter if ECG is normal now.' },
    { id: 'reproducible', question: 'Pain reproducible with palpation of chest wall?', ifYes: 'Reproducible tenderness strongly suggests musculoskeletal (costochondritis, Tietze). Lowest cardiac risk when isolated.' },
    { id: 'fever_cp',     question: 'Associated fever and general unwellness?', ifYes: 'Myocarditis, pericarditis, or pneumonia. ECG, troponin, CXR. Listen for friction rub (pericarditis) or gallop rhythm (myocarditis).' },
  ],

  investigations: [
    { test: '12-lead ECG — mandatory for ALL children with chest pain', category: 'urgent', indication: 'Identify: ST elevation/depression, T-wave inversion, WPW pre-excitation, prolonged QTc (>440 ms in males, >460 ms in females), LVH with deep Q waves (HCM), low voltages (pericardial effusion), AV block.', criticalValue: 'ST elevation: treat as ACS/myocarditis — cardiac catheterisation or echo urgently. WPW + wide complex: do NOT give adenosine.' },
    { test: 'Continuous SpO₂ + cardiac monitor', category: 'urgent', indication: 'For all high-risk or moderate-risk presentations.' },
    { test: 'High-sensitivity Troponin I/T', category: 'blood', indication: 'Elevated troponin → myocardial injury (myocarditis, ischaemia). Draw at 0h and repeat at 3h if ECG is normal and initial troponin is borderline.', criticalValue: 'Any elevation above laboratory normal → admit + cardiology + echo.' },
    { test: 'CRP + ESR + FBC', category: 'blood', indication: 'If fever or myocarditis/pericarditis suspected. CRP > 10 mg/L with fever + chest pain → inflammatory cardiac cause until excluded.' },
    { test: 'CXR', category: 'radiology', indication: 'For: fever + chest pain (exclude pneumonia/pleuritis), abnormal cardiac exam, dyspnoea, suspected cardiac enlargement.', criticalValue: 'Cardiomegaly (CTR > 0.55) = possible myocarditis/dilated cardiomyopathy — echo urgently.' },
    { test: 'Echocardiogram', category: 'radiology', indication: 'Urgent: elevated troponin, abnormal ECG, structural disease suspected, Kawasaki history. Routine: pathological murmur, family history HCM.' },
  ],

  admissionCriteria: [
    'Elevated troponin (any level above upper limit of normal)',
    'Abnormal ECG (ST changes, T-wave inversion, WPW, complete AV block, QTc > 500 ms)',
    'Exertional syncope + chest pain',
    'Known CHD or Kawasaki history with any chest pain episode',
    'Suspected myocarditis (fever + troponin + ECG change)',
    'Haemodynamic instability or significant arrhythmia',
  ],

  highRiskFactors: [
    'Family history of SCD or heritable cardiac condition < 40 years',
    'Known structural heart disease',
    'Exertional onset (highest cardiac risk — even if current episode resolved)',
    'Palpitations accompanying chest pain',
    'Prior Kawasaki disease (coronary aneurysm risk)',
  ],

  dischargeCriteria: [
    'Normal 12-lead ECG (cardiologist review if any uncertainty)',
    'Troponin negative at 0h and 3h (for moderate risk)',
    'Haemodynamically stable, SpO₂ ≥ 95% on room air',
    'Likely benign cause identified (MSK reproducible, or classic GERD, or psychogenic)',
    'No high-risk features: no exertional pain, no syncope, no abnormal exam, no family risk',
    'Reliable caregiver + return precautions given + outpatient follow-up arranged',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: pain occurs during physical activity, child faints or nearly faints, breathing becomes fast or difficult, lips or fingernails turn blue.',
    'A normal X-ray and normal ECG today do NOT rule out all cardiac conditions. If pain is recurrent or symptoms change — return.',
    'Musculoskeletal chest pain (costochondritis): usually lasts days to weeks, improves with rest and anti-inflammatories. Worsens with twisting, bending, pressing the chest. Not dangerous.',
    'Avoid strenuous exercise until seen by a cardiologist if: pain is exertional, ECG was borderline, or you have a family history of heart disease.',
    'Follow-up appointment: attend as scheduled even if feeling better — some cardiac conditions need monitoring.',
  ],
};

export const chestPainInChildrenProtocol: DiseaseProtocol = {
  id: 'chest-pain-in-children',
  name: 'Chest Pain in Children',
  system: 'Cardiovascular System',
  description: 'Evaluation of chest pain in children and adolescents. 95% of paediatric chest pain is non-cardiac (MSK, GI, psychogenic). The task is rapid identification of the 5% with dangerous cardiac causes.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/chest-pain-peds/600/400', hint: 'child chest' },
  erData,

  questions: [
    { id: 'weight',          questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'painOnExertion',  questionText: 'Pain occurs DURING exercise (not just after)?', type: 'boolean', info: 'Exertional pain = highest cardiac risk flag.' },
    { id: 'associatedSyncope', questionText: 'Associated syncope or presyncope?', type: 'boolean' },
    { id: 'cardiacHistory',  questionText: 'Concerning personal / family cardiac history?', type: 'boolean', info: 'SCD < 40y, HCM, Long QT, Marfan, known CHD, or Kawasaki.' },
    { id: 'ekgAbnormal',     questionText: 'ECG abnormal?', type: 'boolean', info: 'ST changes, T-inversion, WPW, prolonged QTc, LVH with deep Qs, AV block, low voltages.' },
    { id: 'troponinElevated',questionText: 'Troponin elevated?', type: 'boolean' },
    { id: 'hasFever',        questionText: 'Fever + general unwellness?', type: 'boolean', info: 'Possible myocarditis, pericarditis, or pneumonia.' },
    { id: 'isCrushing',      questionText: '"Crushing" pain radiating to jaw/arm, with diaphoresis?', type: 'boolean', info: 'Anginal symptoms are rare in children but very high risk.' },
    { id: 'isSharpLocalized',questionText: 'Sharp, localised, reproducible with chest wall palpation?', type: 'boolean', info: 'Classic for musculoskeletal / costochondritis — lowest cardiac risk.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    let score = 0;

    if (data.troponinElevated) { score += 4; details.push('Elevated troponin — myocardial injury confirmed.'); }
    if (data.ekgAbnormal)      { score += 3; details.push('Abnormal ECG — cardiac cause cannot be excluded.'); }
    if (data.painOnExertion)   { score += 3; details.push('Exertional pain — highest risk flag for structural/arrhythmic cause.'); }
    if (data.associatedSyncope){ score += 3; details.push('Syncope with chest pain — possible haemodynamic compromise.'); }
    if (data.cardiacHistory)   { score += 2; details.push('Concerning personal/family cardiac history.'); }
    if (data.isCrushing)       { score += 2; details.push('Anginal quality symptoms — ischaemia pattern.'); }
    if (data.hasFever)         { score += 1; details.push('Fever — inflammatory cardiac cause possible.'); }

    let level: SeverityLevel;
    let interpretation: string;

    if (score >= 4 || data.troponinElevated || (data.ekgAbnormal && data.painOnExertion)) {
      level = 'severe';
      interpretation = 'HIGH RISK — Urgent cardiology + echo';
    } else if (score >= 2 || data.hasFever) {
      level = 'moderate';
      interpretation = 'MODERATE RISK — ECG + troponin + observation';
    } else {
      level = 'mild';
      interpretation = 'LOW RISK — Likely musculoskeletal or benign';
      if (data.isSharpLocalized) details.push('Chest wall tenderness — costochondritis most likely.');
      else details.push('No cardiac red flags. Consider MSK, GERD, or psychogenic aetiology.');
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Paediatric Chest Pain Risk Score',
        totalScore: score,
        maxScore: 18,
        interpretation,
        referenceTable: [
          { range: '≥ 4 or troponin +', meaning: 'HIGH RISK — cardiac workup + admit' },
          { range: '2 – 3',            meaning: 'MODERATE — ECG + troponin + observe' },
          { range: '0 – 1',            meaning: 'LOW RISK — benign aetiology likely' },
        ],
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Haemodynamic instability or cardiac emergency',
      recommendations: [
        'Cardiac tamponade (muffled sounds, JVD, hypotension) → pericardiocentesis. PICU + cardiology + echo to guide.',
        'Massive PE (rare in children) → heparin + cardiology/haematology.',
        'Severe HCM outflow obstruction → NO inotropes, NO vasodilators. IV fluids if hypovolaemic. Beta-blocker IV if HR very high. Surgical/catheter intervention.',
        'Tension pneumothorax (tracheal deviation, absent breath sounds, severe distress) → immediate needle decompression 2nd ICS MCL, then chest drain.',
        'Myocarditis with cardiogenic shock → PICU, inotropes, possible ECMO bridge.',
        'CALL PICU + CARDIOLOGY + ANAESTHETICS NOW.',
      ],
    };

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — HIGH RISK: Immediate cardiac workup + monitoring',
          recommendations: [
            'Strict bed rest — no exertion until cardiology clears.',
            '12-lead ECG immediately (if not done). Cardiac monitor + SpO₂.',
            'IV access.',
            'Troponin 0h + repeat at 3h if initially normal.',
            'CXR.',
            'Pediatric Cardiology consultation NOW — do not wait for results.',
            'Prepare for possible arrhythmia or haemodynamic deterioration.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: ECG + troponin results',
          recommendations: [
            'ECG: ST elevation → immediate echo + cardiology → likely myocarditis or ischaemia.',
            'ECG: WPW + wide complex tachycardia → DO NOT give adenosine/verapamil → synchronised cardioversion.',
            'ECG: Prolonged QTc > 500 ms → admit, avoid QT-prolonging drugs.',
            'Troponin elevated → admit, echo, myocarditis/ischaemia pathway.',
            'All results normal → re-assess: is the history truly high-risk or reclassify?',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Confirmed cardiac pathology',
          recommendations: [
            'Myocarditis confirmed (troponin + ECG ± echo): admit PICU, cardiac monitoring, restrict activity, IVIG if criteria met, no NSAIDs.',
            'Pericarditis (friction rub + saddle-shaped ST elevation + CRP elevated): ibuprofen + colchicine. Admit if effusion or haemodynamic change.',
            'Kawasaki with coronary involvement: aspirin + IVIG + haematology + echo.',
            'Structural cause (HCM, anomalous coronary): activity restriction, specialist management.',
          ],
        },
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — MODERATE RISK: ECG + troponin + observation',
          recommendations: [
            '12-lead ECG + cardiac monitor.',
            'Troponin 0h + 3h.',
            'CXR if fever or respiratory symptoms.',
            'IV access.',
            'No strenuous activity during observation.',
            data.hasFever ? 'Febrile: CRP, FBC. Listen for friction rub (pericarditis) and gallop rhythm (myocarditis).' : '',
          ].filter(Boolean),
        },
        {
          title: 'STEP 2 — REASSESS after workup (2–4 hours)',
          recommendations: [
            'Both troponins normal AND ECG normal → discharge with cardiology outpatient follow-up if any residual concern.',
            'Troponin rising or ECG abnormal → upgrade to high-risk pathway (STEP 3).',
            'Pericarditis features (fever + friction rub + typical ECG) → see STEP 3.',
            'Pneumonia on CXR → antibiotics and admission/discharge by severity.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Inflammatory cardiac cause confirmed',
          recommendations: [
            'Myocarditis: admit PICU, strict rest, no NSAIDs, cardiology.',
            'Pericarditis without effusion: ibuprofen 10 mg/kg TDS + colchicine. May discharge with close follow-up if haemodynamically stable.',
            'Pleuritis / pneumonia: antibiotics, analgesia.',
          ],
        },
        STEP4,
      ];
    }

    return [
      {
        title: 'STEP 1 — LOW RISK: Identify benign cause + reassure',
        recommendations: [
          'Consider ECG for parental reassurance or if ANY uncertainty.',
          data.isSharpLocalized ? 'Costochondritis: NSAIDs (ibuprofen 10 mg/kg), local heat, reassurance.' : 'Characterise pain: musculoskeletal (positional/exertional), GI (postprandial/retrosternal), or psychogenic (recurrent, stress-linked).',
          'GERD: trial of antacid if retrosternal, meal-related.',
          'Precordial catch syndrome (sharp, very brief, at rest): benign — reassure.',
          'Psychogenic: ask about school stress, anxiety, life events.',
        ].filter(Boolean),
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'Child well-appearing, pain improving or resolved, normal exam?',
          'No new red flags during observation → discharge with safety netting.',
          'Any new feature (tachycardia, elevated BP, fever) → repeat assessment before discharge.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Symptoms persist or recur in ER',
        recommendations: [
          'Repeat ECG.',
          'Troponin if not already done.',
          'Do not discharge with unresolved unexplained chest pain — reassess and consider admission/cardiology.',
        ],
      },
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['Admit to monitored bed. Cardiology review mandatory before discharge.'];
    if (severity.level === 'moderate') return ['Observe 4–6h. Discharge with urgent outpatient cardiology review if both troponins normal and ECG normal. Admit if any abnormality.'];
    return ['Discharge home with safety netting and GP follow-up in 48–72h. Cardiology referral if exertional component or family history.'];
  },

  getRedFlags: () => [
    'Pain occurring DURING physical activity',
    'Associated syncope or presyncope',
    'Family history of SCD < 40 years or HCM / Long QT',
    'Kawasaki disease history',
    'Elevated troponin',
    'Abnormal ECG (ST change, WPW, prolonged QTc, LVH with Q waves)',
    'New cardiac murmur, distant heart sounds, or gallop rhythm',
    'Muffled heart sounds + hypotension + JVD (tamponade triad)',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const ibuprofen      = wt > 0 ? Math.min(10 * wt, 600).toFixed(0) : '10 mg/kg';
    const paracetamol    = wt > 0 ? Math.min(15 * wt, 1000).toFixed(0) : '15 mg/kg';
    const colchicine     = wt > 0 ? (wt >= 40 ? '0.5 mg BD' : '0.5 mg OD') : '0.5 mg OD (<40 kg)';

    return [
      { drugName: 'Ibuprofen PO (MSK / pericarditis)', dose: `${ibuprofen} mg (10 mg/kg, max 600 mg) TDS with food`, notes: 'MSK pain: full course 5–7 days. Pericarditis: 4–6 weeks with colchicine. AVOID in myocarditis until excluded.' },
      { drugName: 'Paracetamol PO (analgesia)', dose: `${paracetamol} mg (15 mg/kg, max 1000 mg) q4–6h`, notes: 'Safe for all causes of chest pain including myocarditis.' },
      { drugName: 'Colchicine PO (pericarditis)', dose: `${colchicine}`, notes: 'Pericarditis: 3 months. Reduces recurrence rate significantly. Avoid in renal failure.' },
    ];
  },

  getReferences: () => [
    { title: 'Friedman KG et al. — Evaluation of Pediatric Chest Pain. AAP Pediatrics 2021', url: 'https://doi.org/10.1542/peds.2021-053428' },
    { title: 'Imazio M et al. — Colchicine for pericarditis (COPE, CORE, CORP trials). NEJM 2013', url: 'https://doi.org/10.1056/NEJMoa1208536' },
    { title: 'Kantor PF et al. — Diagnosis and management of myocarditis in children. Circulation 2013', url: 'https://doi.org/10.1161/CIR.0b013e31828a3f15' },
  ],
};
