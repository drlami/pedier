import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'hypoxia_event',    question: 'Preceding hypoxia, apnoea, or respiratory distress?', redFlag: true,  ifYes: 'Hypoxia is the most common cause of bradycardia in children — treat the airway FIRST. Epinephrine will not fix hypoxic bradycardia until oxygenation is restored.' },
    { id: 'cardiac_surgery',  question: 'History of cardiac surgery or known congenital heart disease?', redFlag: true, ifYes: 'Post-op bradycardia may indicate pacemaker failure, AV block, or surgical injury. Immediate cardiology contact. ECG + pacing equipment at bedside.' },
    { id: 'medications',      question: 'Medications that slow heart rate (beta-blockers, CCBs, digoxin, clonidine, opioids)?', redFlag: true, ifYes: 'Toxin-mediated bradycardia: specific antidotes may apply. Digoxin → digoxin-specific antibody fragments. Beta-blocker → glucagon IV. CCB → calcium chloride + glucagon. Contact Toxicology.' },
    { id: 'hypothyroid',      question: 'Known hypothyroidism or history of thyroid surgery?', ifYes: 'Severe hypothyroidism (myxoedema) can cause profound bradycardia. Check TSH/T4 if suspected.' },
    { id: 'hypothermia',      question: 'Cold exposure, drowning, or body temperature < 35°C?', redFlag: true, ifYes: 'Hypothermia causes progressive bradycardia. DO NOT pronounce death until "warm and dead." Rewarm actively — defibrillation threshold increases with hypothermia.' },
    { id: 'sports',           question: 'Competitive athlete or highly trained sportsperson?', ifYes: 'Sinus bradycardia at rest is physiologically normal in athletes (HR 40–50 bpm). Confirm asymptomatic + no other abnormal features before reassuring.' },
    { id: 'syncope',          question: 'Preceding syncope or loss of consciousness?', redFlag: true, ifYes: 'Syncope + bradycardia = significant haemodynamic compromise. Check for complete heart block on ECG.' },
    { id: 'near_drowning',    question: 'Near-drowning or submersion injury?', redFlag: true, ifYes: 'Hypoxia + cold water submersion. Treat hypoxia first. Follow hypothermic resuscitation guidelines.' },
  ],

  investigations: [
    { test: '12-lead ECG — mandatory for all', category: 'urgent', indication: 'Identify rhythm: sinus bradycardia vs AV block (1st/2nd/3rd degree) vs junctional vs sick sinus. Compare with prior if available.', criticalValue: 'Complete (3rd degree) AV block: P waves and QRS are independent → immediate pacing. WPW in child with bradycardia → cardiology urgently.' },
    { test: 'Continuous cardiac monitoring + SpO₂', category: 'urgent', indication: 'Mandatory. Identify rhythm, monitor for progression.' },
    { test: 'Point-of-care glucose', category: 'urgent', indication: 'Hypoglycaemia can cause or worsen bradycardia, especially in neonates and infants.' },
    { test: 'Blood gas (VBG/ABG)', category: 'blood', indication: 'Assess oxygenation, pH, K⁺ (hyperkalaemia = very common cause), and lactate.', criticalValue: 'K⁺ > 6.5 mmol/L + ECG changes = cardiac emergency. Treat immediately.' },
    { test: 'Electrolytes (K⁺, Ca²⁺, Mg²⁺, Na⁺)', category: 'blood', indication: 'Hyperkalaemia, hypocalcaemia, hypomagnesaemia all cause bradycardia.' },
    { test: 'Digoxin level', category: 'blood', indication: 'Only if child is on digoxin or ingestion suspected.' },
    { test: 'Thyroid function (TSH, free T4)', category: 'blood', indication: 'Only if hypothyroidism clinically suspected (weight gain, cold intolerance, constipation, goitre).' },
    { test: 'CXR', category: 'radiology', indication: 'If cardiac surgery history or suspected CHD. Assess heart size, pulmonary vascular markings.' },
  ],

  admissionCriteria: [
    'Any bradycardia with haemodynamic compromise (hypotension, altered consciousness, poor perfusion)',
    'Heart rate < 60 bpm requiring intervention (CPR, epinephrine, or pacing)',
    'Complete (3rd degree) AV block — regardless of symptoms',
    'Symptomatic 2nd degree AV block (Mobitz Type II)',
    'Bradycardia associated with syncope',
    'Toxin-mediated bradycardia — all require monitoring until toxin cleared',
    'Any structural heart disease or post-surgical patient with new bradycardia',
  ],

  highRiskFactors: [
    'Known CHD or prior cardiac surgery',
    'Complete heart block on ECG',
    'Active toxin ingestion (beta-blocker, CCB, digoxin)',
    'Hypothermia',
    'Hyperkalaemia',
    'Prior pacemaker — battery or lead failure possible',
  ],

  dischargeCriteria: [
    'Sinus bradycardia, asymptomatic, HR appropriate for age and activity (athlete physiological bradycardia)',
    'Reversible cause identified and treated (e.g., hypoglycaemia corrected, hypothyroidism started on treatment)',
    '12-lead ECG normal sinus rhythm with no conduction abnormality',
    'Cardiologist has reviewed and cleared discharge',
    'Outpatient Holter and cardiology follow-up arranged',
  ],

  safetyNetting: [
    'Return immediately if: child faints or loses consciousness, feels racing heart, has chest pain, becomes breathless at rest, or breathing becomes very fast or slow.',
    'If a medication dose was missed or an overdose is suspected, return to ER immediately even if the child feels well now — drug effects are delayed.',
    'Cardiac follow-up appointment: attend as scheduled. Do not miss.',
    'Until cleared by cardiology: no competitive sport, no swimming alone, restrict strenuous exercise.',
    'Athletes: the cardiologist will confirm when return to training is safe.',
  ],
};

export const bradycardiaProtocol: DiseaseProtocol = {
  id: 'bradycardia',
  name: 'Bradycardia with a Pulse — PALS Algorithm',
  system: 'Shock and Resuscitation',
  description: 'Paediatric bradycardia assessment and management following the PALS algorithm. The key question: is there haemodynamic compromise? The most common cause in children is hypoxia — support the airway FIRST.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/bradycardia/600/400', hint: 'slow heartbeat ECG' },
  erData,

  questions: [
    { id: 'weight',       questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'heartRate',    questionText: 'Heart Rate', type: 'number', unit: 'bpm' },
    { id: 'isCompromised',questionText: 'Haemodynamic compromise present?', type: 'boolean', info: 'Any of: hypotension for age, acutely altered mental status (lethargy, poor responsiveness), signs of shock (poor perfusion, cool mottled skin), or significant respiratory distress.' },
    { id: 'rhythm',       questionText: 'ECG Rhythm', type: 'select', options: [
      { label: 'Sinus bradycardia',       value: 'sinus',    score: 0 },
      { label: '1st degree AV block',     value: 'avb1',     score: 1 },
      { label: '2nd degree AV block',     value: 'avb2',     score: 2 },
      { label: 'Complete (3rd degree) AV block', value: 'avb3', score: 3 },
      { label: 'Junctional / other',      value: 'other',    score: 1 },
      { label: 'Not yet done',            value: 'pending',  score: 0 },
    ]},
    { id: 'cause',        questionText: 'Likely underlying cause', type: 'select', options: [
      { label: 'Hypoxia / respiratory',           value: 'hypoxia' },
      { label: 'Medications / toxin',             value: 'toxin' },
      { label: 'Electrolyte (K⁺ or Ca²⁺)',        value: 'electrolyte' },
      { label: 'Hypothermia',                     value: 'hypothermia' },
      { label: 'Congenital / structural heart',   value: 'structural' },
      { label: 'Unknown / not yet assessed',      value: 'unknown' },
    ]},
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const hr = Number(data.heartRate || 0);

    if (data.isCompromised) {
      if (hr < 60) details.push(`HR ${hr} bpm with poor perfusion — CPR threshold reached if no improvement with O₂.`);
      details.push('Haemodynamic compromise: immediate intervention required per PALS algorithm.');
      if (data.rhythm === 'avb3') details.push('Complete AV block — prepare for transcutaneous pacing.');
      if (data.cause === 'hypoxia') details.push('Likely hypoxic cause — airway support first, before medications.');
      if (data.cause === 'toxin') details.push('Toxin-mediated bradycardia — contact Toxicology. Specific antidotes may apply.');
      return {
        level: 'severe',
        scoreDetails: {
          systemName: 'PALS Bradycardia Assessment',
          totalScore: hr,
          maxScore: 0,
          interpretation: `HR ${hr} bpm WITH compromise — treat immediately`,
        },
        details,
      };
    }

    if (data.rhythm === 'avb3') {
      details.push('Complete (3rd degree) AV block: always admit regardless of symptoms. Cardiology urgently.');
      return { level: 'moderate', details };
    }
    if (data.rhythm === 'avb2') {
      details.push('2nd degree AV block: cardiology review required.');
    }
    if (hr > 0 && hr < 60) {
      details.push(`HR ${hr} bpm — below threshold but NO current compromise. Monitor, investigate cause.`);
    }
    details.push('Bradycardia without haemodynamic compromise. Identify and treat the underlying cause.');

    return {
      level: 'moderate',
      scoreDetails: {
        systemName: 'PALS Bradycardia Assessment',
        totalScore: hr,
        maxScore: 0,
        interpretation: hr < 60 ? `HR ${hr} bpm — no compromise currently` : `HR ${hr} bpm — relatively bradycardic for context`,
      },
      details,
    };
  },

  getManagement: (severity, data) => {
    const STEP4 = {
      title: 'STEP 4 — LIFE-THREATENING: Persistent pulseless / refractory arrest',
      recommendations: [
        'If no pulse develops → transition to full PALS cardiac arrest algorithm.',
        'Intubate if not already done. IV/IO access mandatory.',
        'Epinephrine 0.01 mg/kg (0.1 mL/kg of 1:10,000) IV/IO q3–5 min.',
        'Continue CPR throughout — quality compressions are the priority.',
        'Search for reversible causes — H\'s and T\'s (see below).',
        'H\'s: Hypoxia (most common!), Hypovolaemia, Hypothermia, Hypoglycaemia, H⁺ (acidosis), Hyperkalaemia.',
        'T\'s: Tension pneumothorax (decompress), Tamponade (pericardiocentesis), Toxins (specific antidotes), Thrombosis (rare).',
        'Transcutaneous pacing: 2× threshold rate; 0.1 mA/kg up to 40–50 mA. Sedate if conscious.',
      ],
    };

    if (severity.level === 'severe') {
      const hr = Number(data.heartRate || 0);
      return [
        {
          title: 'STEP 1 — Immediate: Support airway + oxygenation',
          recommendations: [
            'AIRWAY FIRST: open airway, give 100% O₂ via mask or bag-mask ventilation.',
            'Position: sniffing position in infants, neutral in older children.',
            'Attach cardiac monitor + SpO₂.',
            'IV/IO access — do NOT delay O₂ support for IV access.',
            hr < 60 ? `HR ${hr} bpm < 60 with poor perfusion → begin CPR if no improvement with O₂ within 30–60 s.` : 'Monitor HR continuously.',
            'Call PICU + senior immediately. Transcutaneous pacemaker to bedside.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: HR improving with O₂?',
          recommendations: [
            'HR improving + perfusion improving with ventilation/O₂ → hypoxic cause confirmed. Continue support, treat underlying respiratory problem.',
            `HR ${hr < 60 ? '< 60' : ''} + NOT improving with O₂ → proceed to STEP 3 (medications + pacing).`,
            'ECG result available: AV block degree? → guides pacing decision.',
            'Glucose result: if hypoglycaemic → dextrose bolus immediately (0.5 g/kg).',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Persisting compromise despite O₂',
          recommendations: [
            '1. Epinephrine IV/IO: 0.01 mg/kg (0.1 mL/kg of 1:10,000) q3–5 min — for bradycardia with poor perfusion.',
            '2. Atropine IV/IO: 0.02 mg/kg (min 0.1 mg, max 0.5 mg) — for primary AV block or increased vagal tone. May repeat once.',
            '3. Transcutaneous pacing: for AV block with compromise. Rate = 20 above patient\'s spontaneous rate initially.',
            '4. PICU — do not manage severe bradycardia alone.',
            data.cause === 'toxin' ? '5. TOXIN: Beta-blocker → glucagon IV; CCB → calcium chloride; digoxin → digoxin-specific Fab fragments. Contact Toxicology.' :
            data.cause === 'electrolyte' ? '5. ELECTROLYTE: Hyperkalaemia → calcium chloride 10 mg/kg IV + sodium bicarbonate + insulin/dextrose. Call Nephrology.' : '',
          ].filter(Boolean),
        },
        STEP4,
      ];
    }

    return [
      {
        title: 'STEP 1 — Bradycardia without compromise: Identify cause',
        recommendations: [
          'Continuous cardiac monitoring + SpO₂.',
          'IV access and point-of-care glucose.',
          '12-lead ECG: identify rhythm precisely (sinus vs AV block degree).',
          'Bloods: electrolytes, blood gas, glucose, drug levels if indicated.',
          'Hypoxia present: treat airway first.',
          'Medications/toxin: review drug list, consider overdose.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS after initial workup',
        recommendations: [
          'Reversible cause found and treated → reassess HR and rhythm.',
          'Complete AV block (3rd degree) on ECG → admit + urgent cardiology even if asymptomatic now.',
          'No cause found + HR borderline → athlete physiology? Hypothyroidism workup.',
          'Worsening HR or new compromise → STEP 3.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Cause identified requiring specific treatment',
        recommendations: [
          'Toxin-mediated: Digoxin → Fab fragments; Beta-blocker → glucagon; CCB → calcium + glucagon; Opioid → naloxone.',
          'Hyperkalaemia: calcium chloride 10 mg/kg IV + sodium bicarbonate + salbutamol neb + insulin/dextrose.',
          'Hypothermia: active rewarming — warmed IV fluids, warmed humidified O₂, warmed blankets. Target T° > 32°C before further resuscitation decisions.',
          'Structural/surgical: admit, cardiology input.',
          'Any deterioration with haemodynamic compromise → STEP 4.',
        ],
      },
      STEP4,
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['PICU admission. Haemodynamic compromise — not safe to leave resuscitation area until stable.'];
    return ['Admit to monitored ward. Cardiology review before discharge. No discharge with unexplained complete AV block.'];
  },

  getRedFlags: () => [
    'HR < 60 bpm with haemodynamic compromise — CPR threshold',
    'Complete (3rd degree) AV block on ECG',
    'Bradycardia following drowning, trauma, or hypoxic event',
    'Toxin or drug overdose with bradycardia',
    'Hyperkalaemia (K⁺ > 6 mmol/L) — ECG changes',
    'Known CHD + new bradycardia',
    'Syncope preceding or during bradycardia',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required.' });
      return doses;
    }

    const epi   = (0.1 * wt).toFixed(2);
    const atrp  = Math.min(Math.max(0.02 * wt, 0.1), 0.5).toFixed(2);
    const dex   = (0.5 * wt).toFixed(1);
    const cacl  = Math.min(10 * wt, 500).toFixed(0);
    const glucag = Math.min(0.03 * wt, 1).toFixed(2);

    doses.push({ drugName: 'Epinephrine IV/IO (1:10,000 diluted)', dose: `${epi} mL (0.1 mL/kg) IV/IO`, notes: 'Dilute 1:1,000 stock 1:10 first (1 mL + 9 mL NS). Repeat q3–5 min. For bradycardia with poor perfusion.' });
    doses.push({ drugName: 'Atropine IV/IO', dose: `${atrp} mg IV/IO (0.02 mg/kg, min 0.1 mg, max 0.5 mg)`, notes: 'For vagal-mediated bradycardia or 1st/2nd degree AV block. May repeat once. Minimum dose 0.1 mg to avoid paradoxical bradycardia.' });
    doses.push({ drugName: 'Dextrose IV/IO (hypoglycaemia)', dose: `${dex} mL of 10% dextrose (0.5 g/kg)`, notes: 'Give slowly over 5–10 min. Recheck glucose 15 min later.' });
    doses.push({ drugName: 'Calcium chloride 10% IV (hyperkalaemia/CCB)', dose: `${cacl} mg (10 mg/kg, max 500 mg) IV slowly`, notes: 'Give over 5–10 min. Flush line well. Extravasation causes severe tissue necrosis. Central access preferred.' });
    doses.push({ drugName: 'Glucagon IV (beta-blocker toxicity)', dose: `${glucag} mg IV (0.02–0.03 mg/kg, max 1 mg) over 5 min`, notes: 'Only for beta-blocker-mediated bradycardia. Follow with infusion 5–15 mcg/kg/min if response.' });

    return doses;
  },

  getReferences: () => [
    { title: 'PALS Provider Manual — AHA 2020', url: 'https://cpr.heart.org/pals-provider-manual' },
    { title: 'de Caen AR et al. — PALS Part 12: Pediatric Advanced Life Support. Circulation 2015', url: 'https://doi.org/10.1161/CIR.0000000000000266' },
    { title: 'Gregoratos G — Permanent pacemakers in children. Card Electrophysiol Rev 2003', url: 'https://doi.org/10.1023/B:CEPR.0000010027.65813.72' },
  ],
};
