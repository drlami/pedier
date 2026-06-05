import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'bilious_vomit',  question: 'Vomiting that is bilious (green / yellow)?', redFlag: true,  ifYes: 'SURGICAL EMERGENCY until proven otherwise. Make NPO, IV access, NG tube, call Surgery. Bilious vomiting in any age = obstruction until excluded.' },
    { id: 'obstipation',    question: 'No passage of stool OR flatus for > 24 h (obstipation)?', redFlag: true, ifYes: 'True obstipation (not just constipation) strongly suggests mechanical obstruction. Differentiate from functional constipation by exam and AXR.' },
    { id: 'prior_surgery',  question: 'Previous abdominal surgery?', redFlag: true, ifYes: 'Adhesional obstruction is the most common cause of SBO post-surgery. Consult Surgery early.' },
    { id: 'chronic_constip',question: 'Known history of chronic constipation or encopresis (stool accidents)?', ifYes: 'Functional constipation likely. Look for: loaded rectum on exam, stool burden on AXR. Treat with disimpaction + maintenance PEG.' },
    { id: 'neonate_mec',    question: 'Neonate — failure to pass meconium within 48 h of birth?', redFlag: true, ifYes: 'Hirschsprung disease until excluded. Do NOT give enema until Hirschsprung ruled out — risk of enterocolitis.' },
    { id: 'bloody_stool',   question: 'Blood in stool or blood per rectum?', redFlag: true, ifYes: 'Intussusception (currant-jelly stools), volvulus, NEC (in neonate), or inflammatory bowel disease. Urgent investigation.' },
    { id: 'fever_abdomen',  question: 'Fever with abdominal distention?', redFlag: false, ifYes: 'Peritonitis, appendicitis, NEC (neonate), or toxic megacolon. Assess for peritoneal signs.' },
    { id: 'ascites_history',question: 'Known liver disease, nephrotic syndrome, or malignancy?', ifYes: 'Ascites as cause of distention — arrange abdominal USS for confirmation.' },
    { id: 'dietary_history',question: 'Recent dietary change, low fibre, or reduced fluid intake?', ifYes: 'Functional constipation precipitant. Dietary counselling alongside treatment.' },
  ],

  investigations: [
    { test: 'Abdominal X-ray (KUB + erect or left lateral decubitus)', category: 'urgent', indication: 'First-line for all significant distention or suspected obstruction. Look for: dilated loops, air-fluid levels, absence of rectal gas, free air under diaphragm, stool burden.', criticalValue: 'Free air (perforation) or massively dilated bowel loops → emergency surgery. Call Surgery before ordering more imaging.' },
    { test: 'Blood glucose (bedside)', category: 'urgent', indication: 'Metabolic causes of ileus (DKA, hypokalaemia) and poor perfusion.' },

    { test: 'CBC + CRP', category: 'blood', indication: 'Elevated WBC + CRP = infection / peritonitis. Anaemia = chronic disease or haemorrhage.' },
    { test: 'Electrolytes (K⁺, Na⁺, Cl⁻)', category: 'blood', indication: 'Hypokalaemia causes ileus. Hyponatraemia in suspected Hirschsprung enterocolitis.', criticalValue: 'K⁺ < 2.5 mmol/L → paralytic ileus — correct electrolytes before further laxatives.' },
    { test: 'Lipase / amylase', category: 'blood', indication: 'If upper abdominal distention — exclude pancreatitis as cause of ileus.' },
    { test: 'LFTs + albumin + INR', category: 'blood', indication: 'If ascites suspected — assess liver function and portal hypertension.' },

    { test: 'Abdominal Ultrasound', category: 'radiology', indication: 'First-line for: intussusception (target sign), ascites (free fluid), pyloric stenosis (infant), ovarian pathology (adolescent female). Avoids radiation.', criticalValue: 'Intussusception confirmed on USS → pneumatic / hydrostatic reduction if no peritonitis. Surgery consult.' },
    { test: 'CT abdomen (with contrast)', category: 'radiology', indication: 'When AXR and USS are inconclusive and obstruction is suspected. Higher sensitivity for adhesions, mass lesions, volvulus.', criticalValue: 'CT evidence of ischaemia, strangulation, or volvulus → emergency laparotomy.' },
    { test: 'Contrast enema (paediatric surgery/radiology decision)', category: 'radiology', indication: 'For Hirschsprung disease (transition zone), intussusception reduction, or mecconium ileus. NOT done blindly in ER — requires Surgery or Radiology supervision.', criticalValue: 'Do NOT perform enema in neonate if Hirschsprung enterocolitis suspected — risk of perforation.' },
  ],

  admissionCriteria: [
    'Bilious vomiting at any age — surgical emergency',
    'True obstipation (no flatus) with radiological obstruction',
    'Peritoneal signs (guarding, rigidity, rebound) — surgical abdomen',
    'Free air on AXR (perforation)',
    'Haemodynamic instability, severe pain, or toxic appearance',
    'Neonate with distention + failure to pass meconium — Hirschsprung workup',
    'Distention with significant electrolyte abnormalities (K⁺ < 2.5)',
    'Severe constipation requiring IV hydration or inpatient disimpaction',
  ],

  highRiskFactors: [
    'Prior abdominal surgery — adhesions',
    'Neonate or infant < 1 year — higher risk for Hirschsprung, intussusception, malrotation',
    'Progressive distention over hours despite conservative management',
    'Unable to tolerate oral fluids or poor pain control',
    'Chronic constipation with failed outpatient treatment — inpatient cleanout',
  ],

  dischargeCriteria: [
    'Surgical cause excluded (AXR negative for obstruction, passing flatus)',
    'Diagnosis confirmed as functional constipation',
    'Successful disimpaction documented (stool passed or rectal exam confirms resolution)',
    'Tolerating oral fluids',
    'Pain controlled',
    'Reliable carer understands maintenance plan and red-flag return criteria',
    'Follow-up arranged within 1 week with GP or gastroenterology',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: vomiting turns green/yellow (bilious), abdomen becomes much more swollen or hard, severe pain worsens, child stops passing any gas at all, develops fever, or becomes pale and unwell.',
    'Functional constipation: give the laxative every day — not just when constipated. It takes weeks to "retrain" the bowel.',
    'PEG (polyethylene glycol / Movicol): mix the powder into a drink and give with meals. It is safe for long-term use in children.',
    'Diet: increase fluid intake and fibre (fruit, vegetables, whole grain). Reduce cow\'s milk if intake is very high.',
    'Toileting routine: encourage sitting on the toilet for 5–10 minutes after every meal. Use a footstool if legs do not reach the floor.',
    'Return for review in 1 week — constipation needs follow-up, not just a single treatment.',
  ],
};

export const abdominalDistentionConstipationProtocol: DiseaseProtocol = {
  id: 'abdominal-distention-constipation',
  name: 'Abdominal Distention & Constipation',
  system: 'Gastrointestinal & Hepatology',
  description: 'ER evaluation of a child with abdominal distention — differentiating surgical emergency (obstruction, perforation, peritonitis) from non-surgical causes (functional constipation, ascites, ileus).',
  lastUpdated: '2024',
  image: {
    url: 'https://picsum.photos/seed/abdom-distention/600/400',
    hint: 'abdominal xray',
  },
  erData,

  questions: [
    { id: 'weight',    questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'vomiting',  questionText: 'Vomiting character', type: 'select', options: [
      { label: 'None',                              value: 'none',    score: 0 },
      { label: 'Non-bilious (clear / white / milk)', value: 'nonbil', score: 1 },
      { label: 'Bilious — green or yellow',         value: 'bilious', score: 5 },
    ]},
    { id: 'flatus',    questionText: 'Passing flatus and/or stool?', type: 'select', options: [
      { label: 'Yes — passing gas and some stool', value: 'yes',   score: 0 },
      { label: 'Constipated — no stool but some gas', value: 'constip', score: 1 },
      { label: 'No flatus or stool (obstipation)', value: 'none',  score: 4 },
    ]},
    { id: 'tenderness',questionText: 'Abdominal tenderness', type: 'select', options: [
      { label: 'None / mild',                              value: 'none',     score: 0 },
      { label: 'Moderate — diffuse or localised',          value: 'moderate', score: 2 },
      { label: 'Peritonitic — guarding, rigidity, rebound', value: 'periton', score: 5 },
    ]},
    { id: 'bowel_sounds', questionText: 'Bowel sounds', type: 'select', options: [
      { label: 'Normal',                         value: 'normal', score: 0 },
      { label: 'Hyperactive / high-pitched (tinkling)', value: 'hyper', score: 2 },
      { label: 'Absent / hypoactive',            value: 'absent', score: 3 },
    ]},
    { id: 'onset',     questionText: 'Onset', type: 'select', options: [
      { label: 'Chronic (> 2 weeks)',   value: 'chronic', score: 0 },
      { label: 'Subacute (2–7 days)',   value: 'subacute', score: 1 },
      { label: 'Acute (< 48 hours)',    value: 'acute',   score: 2 },
    ]},
    { id: 'rectal_exam', questionText: 'Rectal exam (if done) — stool in vault?', type: 'select', options: [
      { label: 'Not done',               value: 'nd',   score: 0 },
      { label: 'Loaded with stool',      value: 'loaded', score: 0 },
      { label: 'Empty / ballooned vault', value: 'empty', score: 2 },
    ], info: 'Empty rectum + no flatus = mechanical obstruction above rectum. Loaded = functional constipation.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const vomiting    = data.vomiting as string;
    const flatus      = data.flatus as string;
    const tenderness  = data.tenderness as string;
    const bowel       = data.bowel_sounds as string;
    const rectal      = data.rectal_exam as string;
    const details: string[] = [];

    if (vomiting === 'bilious' || tenderness === 'periton' || (flatus === 'none' && rectal === 'empty')) {
      if (vomiting === 'bilious')   details.push('BILIOUS VOMITING — surgical emergency until excluded.');
      if (tenderness === 'periton') details.push('PERITONITIC SIGNS — possible perforation or surgical abdomen.');
      if (flatus === 'none' && rectal === 'empty') details.push('Obstipation with empty rectum — mechanical obstruction above rectum.');
      details.unshift('SURGICAL EMERGENCY — NPO, IV access, Surgery consult, AXR urgently.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Obstruction Risk', totalScore: 9, maxScore: 10, interpretation: 'Surgical Emergency — call Surgery' },
        details,
      };
    }

    const score =
      (vomiting === 'nonbil' ? 1 : 0) +
      (flatus === 'none' ? 4 : flatus === 'constip' ? 1 : 0) +
      (tenderness === 'moderate' ? 2 : 0) +
      (bowel === 'hyper' ? 2 : bowel === 'absent' ? 3 : 0) +
      (data.onset === 'acute' ? 2 : data.onset === 'subacute' ? 1 : 0) +
      (rectal === 'empty' ? 2 : 0);

    if (score >= 4) {
      details.unshift('POSSIBLE OBSTRUCTION — AXR and surgical review needed before discharge.');
      return {
        level: 'moderate',
        scoreDetails: { systemName: 'Obstruction Risk', totalScore: score, maxScore: 10, interpretation: 'Possible obstruction — investigate' },
        details,
      };
    }

    details.unshift('LIKELY FUNCTIONAL CONSTIPATION — disimpaction + maintenance plan.');
    return {
      level: 'mild',
      scoreDetails: { systemName: 'Obstruction Risk', totalScore: score, maxScore: 10, interpretation: 'Low risk — functional constipation' },
      details,
    };
  },

  getManagement: (severity, data) => {
    const rectal = data.rectal_exam as string;

    const STEP3 = {
      title: 'STEP 3 — ESCALATION: Obstruction confirmed or clinical deterioration',
      recommendations: [
        '1. SURGERY CONSULT — mandatory for mechanical obstruction, free air, or peritonitis.',
        '2. NPO + nasogastric tube for decompression (bilious vomiting / bowel obstruction).',
        '3. IV access + aggressive hydration (isotonic crystalloid) — correct dehydration.',
        '4. Analgesia: morphine 0.1 mg/kg IV — do NOT withhold. Does not mask surgical signs.',
        '5. CT abdomen (with contrast) if USS and AXR inconclusive — for adhesions, volvulus, mass.',
        '6. Intussusception confirmed → pneumatic or hydrostatic reduction (radiology + surgery).',
        '7. Hirschsprung (neonate, empty rectum, no meconium) → rectal suction biopsy — NOT enema.',
      ],
    };

    const STEP4 = {
      title: 'STEP 4 — Life-threatening: Perforation / Volvulus / Peritonitis',
      recommendations: [
        'FREE AIR on AXR → emergency laparotomy. Call operating theatre and anaesthesia now.',
        'VOLVULUS (whirlpool sign on USS, coffee-bean sign on AXR) → emergency surgery.',
        'PERITONITIS: IV broad-spectrum antibiotics now (Pip-Tazo or Cefotaxime + Metronidazole).',
        'HAEMODYNAMIC INSTABILITY with distention → IV fluid resuscitation + surgery simultaneously.',
        'SEPSIS + DISTENTION in neonate → NEC until proven otherwise. PICU + Surgery + neonatology.',
      ],
    };

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — Immediate: Surgical emergency workup',
          recommendations: [
            'NPO immediately.',
            'IV access + blood: CBC, electrolytes, lipase, CRP, blood culture if febrile.',
            'AXR (KUB + erect) STAT — free air, dilated loops, air-fluid levels.',
            'Abdominal USS if intussusception / appendicitis / ascites suspected.',
            'Surgery consult immediately — do not wait for imaging to call.',
            'NG tube if bilious vomiting or significant distention.',
            'IV analgesia: morphine 0.1 mg/kg IV — safe, does not obscure surgical diagnosis.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS with AXR result + surgical review',
          recommendations: [
            'FREE AIR → perforation → OR now.',
            'DILATED LOOPS + AIR-FLUID LEVELS → obstruction → Surgery managing.',
            'NO OBSTRUCTION on AXR → USS for intussusception, appendicitis, ovarian cyst.',
            'IMPROVING on conservative management → continue monitoring, reassess in 2–4 h.',
            'WORSENING → escalate to STEP 3.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — Possible obstruction: Investigate before treating',
          recommendations: [
            'AXR first — confirm stool burden vs obstruction pattern.',
            'IV access + electrolytes — correct K⁺ if < 3.0 mmol/L before laxatives.',
            'NPO until obstruction excluded.',
            'Do NOT give enemas or laxatives until obstruction is ruled out.',
            'USS if intussusception, appendicitis, or ascites possible.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS after AXR result',
          recommendations: [
            'AXR: obstruction pattern (dilated bowel, absent rectal gas) → Surgery consult.',
            'AXR: stool burden, gas throughout including rectum → functional constipation → treat.',
            'AXR: gasless abdomen + no stool → possible ascites → USS.',
            'Clinical worsening at any point → escalate to STEP 3.',
          ],
        },
        STEP3,
        STEP4,
      ];
    }

    // Mild — functional constipation
    return [
      {
        title: 'STEP 1 — Functional Constipation: Disimpaction',
        recommendations: [
          rectal === 'loaded'
            ? 'Loaded rectum confirmed — disimpaction required before maintenance therapy.'
            : 'Functional constipation likely — confirm with AXR if uncertain before treating.',
          'ORAL DISIMPACTION (preferred): PEG 3350 high-dose cleanout 1–1.5 g/kg/day × 3–6 days.',
          'RECTAL ROUTE (if oral not tolerated): Glycerine suppository (infants) or Sodium phosphate enema (children > 2 yr, NOT in Hirschsprung / neonate).',
          'Adequate oral hydration throughout.',
          'Advise return if no result within 24–48 h of starting.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS at 1–2 h or follow-up',
        recommendations: [
          'Stool passed, abdomen soft, comfortable → discharge with maintenance plan.',
          'No result after disimpaction attempt → AXR to confirm stool burden, consider admission for supervised cleanout.',
          'ANY new red flags (bilious vomit, peritonism, fever) → reassess and escalate.',
        ],
      },
      STEP3,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe')   return ['ADMIT — surgical emergency. Surgery and PICU as indicated.'];
    if (severity.level === 'moderate') return ['Admit if obstruction not excluded or unable to tolerate orals. Discharge only after AXR clears obstruction.'];
    return ['Discharge with maintenance PEG prescription, dietary advice, and 1-week follow-up.'];
  },

  getRedFlags: () => [
    'Bilious (green) vomiting — obstruction until excluded',
    'Peritoneal signs — guarding, rigidity, rebound tenderness',
    'Free air under diaphragm on AXR — perforation',
    'Absent bowel sounds with distention',
    'True obstipation — no flatus at all',
    'Neonate: failure to pass meconium in 48 h — Hirschsprung',
    'Blood in stool with distention — intussusception / NEC / volvulus',
    'Progressive distention over hours despite conservative management',
  ],

  getDrugDoses: (severity, data) => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required for dose calculations.' });
      return doses;
    }

    const morphine    = (0.1 * wt).toFixed(2);
    const pegDisimpact = (1.25 * wt).toFixed(1);
    const pegMaint    = (0.6 * wt).toFixed(1);
    const piptazo     = Math.min(100 * wt, 4000).toFixed(0);
    const metro       = Math.min(15 * wt, 500).toFixed(0);

    if (severity.level !== 'mild') {
      doses.push({ drugName: 'Morphine IV — analgesia', dose: `${morphine} mg IV (0.1 mg/kg)`, notes: 'Safe in surgical abdomen — does not obscure diagnosis. Titrate to comfort.' });
      doses.push({ drugName: 'Piperacillin-Tazobactam IV (peritonitis)', dose: `${piptazo} mg IV (100 mg/kg piperacillin component, max 4 g) q6–8h`, notes: 'For peritonitis or perforation. Add coverage for aerobic and anaerobic GI flora.' });
      doses.push({ drugName: 'Metronidazole IV (peritonitis — anaerobic cover)', dose: `${metro} mg IV (15 mg/kg, max 500 mg) q8h`, notes: 'Add if Pip-Tazo not available or for additional anaerobic coverage.' });
    }

    doses.push({ drugName: 'PEG 3350 (Movicol / Miralax) — disimpaction', dose: `${pegDisimpact} g/day (1–1.5 g/kg/day) orally × 3–6 days`, notes: 'Mix in water or juice. Give in divided doses. Increase if no result in 24 h.' });
    doses.push({ drugName: 'PEG 3350 — maintenance', dose: `${pegMaint} g/day (0.4–0.8 g/kg/day)`, notes: 'Once disimpacted. Continue for months until bowel habits normalise.' });
    doses.push({ drugName: 'Glycerine suppository (infants)', dose: 'One suppository per rectum as needed', notes: 'Safe in infants > 1 month. Insert and retain for 10–15 min.' });

    return doses;
  },

  getReferences: () => [
    { title: 'Tabbers MM et al. — ESPGHAN/NASPGHAN Guideline: Evaluation and Treatment of Functional Constipation in Infants and Children 2014', url: 'https://doi.org/10.1097/MPG.0000000000000266' },
    { title: 'Stringer MD — Bowel obstruction in children. Surgery (Oxford) 2015', url: 'https://doi.org/10.1016/j.mpsur.2015.09.007' },
    { title: 'Columbani PM et al. — Hirschsprung Disease. Clin Perinatol 2021', url: 'https://doi.org/10.1016/j.clp.2021.05.009' },
  ],
};
