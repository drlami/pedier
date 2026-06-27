import type { DiseaseProtocol } from './types';

export const wardHeartFailureProtocol: DiseaseProtocol = {
  id: 'ward-heart-failure',
  name: 'Heart Failure Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Pediatric heart failure (HF) is a clinical syndrome in which cardiac dysfunction fails to meet the metabolic demands of the body. Common causes: congenital heart disease, cardiomyopathy, myocarditis, arrhythmias. Management targets adequate cardiac output, decongestion, and prevention of adverse myocardial remodeling. [Nelson Ch. 491 — Burstein & Rossano]',
  image: {
    url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=600&h=400',
    hint: 'Cardiac clinical management',
  },

  questions: [
    {
      id: 'weight',
      questionText: 'Body Weight',
      type: 'number',
      unit: 'kg',
    },
    {
      id: 'age_group',
      questionText: 'Age Group',
      type: 'radio',
      options: [
        { label: 'Neonate (≤ 1 mo)', value: 'neonate' },
        { label: 'Infant (1 mo – 2 yr)', value: 'infant' },
        { label: 'Child (2–12 yr)', value: 'child' },
        { label: 'Adolescent (> 12 yr)', value: 'adolescent' },
      ],
    },
    {
      id: 'lvef',
      questionText: 'Left Ventricular Ejection Fraction (Echo)',
      type: 'number',
      unit: '%',
      placeholder: 'e.g. 35',
    },
    {
      id: 'clinical_state',
      questionText: 'Hemodynamic Profile (Perfusion × Congestion)',
      type: 'radio',
      info: 'Warm = adequate perfusion | Cold = impaired perfusion | Wet = congested | Dry = no congestion',
      options: [
        { label: 'Warm & Dry — Compensated', value: 'warm_dry' },
        { label: 'Warm & Wet — Congested, adequate perfusion (most common)', value: 'warm_wet' },
        { label: 'Cold & Dry — Low output, no congestion', value: 'cold_dry' },
        { label: 'Cold & Wet — Cardiogenic Shock', value: 'cold_wet' },
      ],
    },
    {
      id: 'nyha',
      questionText: 'NYHA (New York Heart Association) Functional Class',
      type: 'radio',
      options: [
        { label: 'Class I — No symptoms with ordinary activity', value: 'I' },
        { label: 'Class II — Symptoms with moderate exertion', value: 'II' },
        { label: 'Class III — Symptoms with minimal activity', value: 'III' },
        { label: 'Class IV — Symptoms at rest', value: 'IV' },
      ],
    },
  ],

  mmpData: {
    snapshot:
      'Most admitted children are Warm & Wet — give IV furosemide immediately. The four chronic pillars in sequence: (1) ACE inhibitor, (2) spironolactone, (3) beta-blocker — only when dry, (4) digoxin if specialists decide. CRITICAL RULE: NEVER start a beta-blocker during acute decompensation. Cold & Wet = cardiogenic shock → call PICU now.',

    stages: [
      {
        label: 'Stage 1: Triage & Assessment',
        shortLabel: 'Triage',
        color: 'blue',
        cards: [
          {
            title: 'Ward or PICU? — Decide First',
            orders: [
              'COLD & WET (impaired perfusion + congested): Cardiogenic shock → Call PICU immediately',
              'COLD & DRY (impaired perfusion, not congested): Low cardiac output → Likely needs PICU; try a careful fluid bolus first',
              'WARM & WET (adequate perfusion + congested): Most common presentation → Ward; start IV furosemide now',
              'WARM & DRY (adequate perfusion, no congestion): Compensated → Ward; optimise oral medications only',
              'How to assess PERFUSION — check: capillary refill time (CRT), peripheral temperature, pulse quality, mental status, urine output per hour',
              'How to assess CONGESTION — check: respiratory rate, liver size below costal margin, peripheral oedema, lung crepitations, raised jugular venous pressure (JVP) in older children',
            ],
          },
          {
            title: 'Classify the Heart Failure Type',
            orders: [
              'HFrEF (Heart Failure with Reduced Ejection Fraction): left ventricular ejection fraction (LVEF) ≤ 40% — systolic dysfunction; most treatment evidence targets this group',
              'HFmrEF (Mildly Reduced EF): LVEF 41–49% — focus on finding and treating the underlying cause',
              'HFpEF (Preserved EF): LVEF ≥ 50% — diastolic dysfunction; manage with rate control and diuresis',
              'BNP (B-type natriuretic peptide) ≥ 35 pg/mL or NT-proBNP (N-terminal pro-BNP) > 125 pg/mL — supports the heart failure diagnosis; use serially to track treatment response',
              'NYHA Class I: no symptoms with ordinary daily activity',
              'NYHA Class II: symptoms with moderate exertion only',
              'NYHA Class III: symptoms with minimal activity',
              'NYHA Class IV: symptoms present at rest',
            ],
          },
          {
            title: 'Order These on Admission',
            orders: [
              'Echocardiogram (transthoracic): LVEF, fractional shortening (normal 28–42%), valve function, pericardial effusion — request urgently',
              'Chest X-Ray (CXR): cardiomegaly (cardiothoracic ratio > 0.55), pulmonary oedema, pleural effusions',
              'Electrocardiogram (ECG): arrhythmia, left ventricular hypertrophy (LVH), myocarditis ST/T changes, left bundle branch block (LBBB)',
              'BNP or NT-proBNP: baseline level for monitoring ongoing response',
              'Bloods: full blood count (FBC), urea and electrolytes (U&E), creatinine, liver function tests (LFTs), lactate, calcium, magnesium, blood glucose (mg/dL)',
              'Thyroid function: in older children, exclude thyrotoxicosis as a high-output cause',
              'IF cardiomyopathy suspected: metabolic screen — plasma amino acids, urine organic acids, acylcarnitine profile',
              'IF myocarditis or endocarditis possible: two blood cultures before starting antibiotics',
              'Iron studies: treat iron deficiency even without anaemia — improves outcomes in heart failure',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Diuresis — Relieve Congestion',
        shortLabel: 'Diuretics',
        color: 'indigo',
        cards: [
          {
            title: 'Give Furosemide — First Action in All Warm & Wet Patients',
            threshold: 'Give IV furosemide as soon as Warm & Wet profile is identified',
            orders: [
              'Give: Furosemide 1–2 mg/kg/dose IV — expect urine output within 30–60 minutes',
              'Repeat every 6–12 hours; titrate dose and frequency to response (weight loss, improved breathing, softer liver)',
              'Target: weight loss of 0.5–1% body weight per day until the child is at dry weight',
              'Switching to oral: Furosemide PO 1–4 mg/kg/day divided 1–4 times daily once clinically stable',
              'Monitor daily: weight at the same time each morning, urine output, potassium, sodium, creatinine',
              'CAUTION: Hypokalaemia is common — supplement potassium unless spironolactone is already prescribed',
              'CAUTION: Hyponatraemia can develop in severe heart failure — watch sodium levels closely',
            ],
            prescriptions: [
              {
                drug: 'Furosemide',
                dose: '1–2 mg/kg/dose IV (acute)',
                route: 'IV',
                frequency: 'Q6–12h — titrate',
                calculation: (w) => `${(w * 1).toFixed(1)}–${(w * 2).toFixed(1)} mg per dose`,
                notes: 'Nelson Table 491.6. IV range: 0.5–2 mg/kg/dose. PO chronic: 1–4 mg/kg/day.',
              },
            ],
          },
          {
            title: 'Add Spironolactone Routinely',
            orders: [
              'Start spironolactone alongside furosemide in most patients from the beginning',
              'Dose: 1–3 mg/kg/day PO in 2 divided doses (usual: 2 mg/kg/day in 2 doses)',
              'Why: saves potassium, so no separate potassium supplements needed when used with furosemide',
              'Bonus: reduces cardiac fibrosis and adverse myocardial remodeling — an aldosterone antagonist benefit',
              'CAUTION: If the patient is also starting an ACE inhibitor, monitor potassium closely — two potassium-sparing drugs together can cause hyperkalaemia',
              'Gynecomastia in males: switch to eplerenone if this develops',
            ],
            prescriptions: [
              {
                drug: 'Spironolactone',
                dose: '1–3 mg/kg/day',
                route: 'PO',
                frequency: 'BD',
                calculation: (w) => `${(w * 1).toFixed(1)}–${(w * 3).toFixed(1)} mg/day`,
                notes: 'Nelson Table 491.6. Start at 2 mg/kg/day in 2 doses. Monitor K⁺.',
              },
            ],
          },
          {
            title: 'If Furosemide is Not Enough — Add a Second Diuretic',
            threshold: 'Use when furosemide + spironolactone alone is not achieving adequate decongestion',
            orders: [
              'CHLOROTHIAZIDE (add-on thiazide diuretic): 20–40 mg/kg/day PO divided 2–3 times daily',
              'Acts on a different part of the nephron than furosemide — combining both gives better diuresis (sequential nephron blockade)',
              'Monitor potassium; usually given alongside spironolactone for potassium protection',
              'BUMETANIDE (alternative loop diuretic): 0.01–0.1 mg/kg/dose IV or PO every 24–48 hours',
              'Use when expected response to IV furosemide has not occurred',
              'Approximately 40× more potent than furosemide by weight — always start at the lower end of the dose range',
            ],
            prescriptions: [
              {
                drug: 'Chlorothiazide',
                dose: '20–40 mg/kg/day',
                route: 'PO',
                frequency: 'BD–TDS',
                calculation: (w) => `${(w * 20).toFixed(0)}–${(w * 40).toFixed(0)} mg/day`,
                notes: 'Nelson Table 491.6. Divide into 2–3 doses. Monitor electrolytes.',
              },
              {
                drug: 'Bumetanide',
                dose: '0.01–0.1 mg/kg/dose',
                route: 'IV / PO',
                frequency: 'Q24–48h',
                calculation: (w) => `${(w * 0.01).toFixed(3)}–${(w * 0.1).toFixed(2)} mg/dose`,
                notes: 'Nelson Table 491.6. Monitor electrolytes closely.',
              },
            ],
          },
          {
            title: 'Infant Feeding Plan',
            orders: [
              'Target: 120–150 kcal/kg/day — infants with heart failure burn more energy and tire before finishing feeds',
              'Increase formula caloric density up to 24 kcal/oz (standard formula is 20 kcal/oz)',
              'Do NOT go beyond 24 kcal/oz: risk of diarrhoea and excess renal solute load in a child with reduced cardiac output',
              'IF the infant is too tired to suckle: insert a nasogastric (NG) tube and use continuous overnight feeds — this also reduces gastro-oesophageal reflux (GOR)',
              'Breast milk: the best low-sodium feed available — use as first choice',
              'Avoid low-sodium formula: poorly tolerated and worsens diuretic-induced hyponatraemia',
              'OLDER CHILDREN: heart-healthy diet (low fat, low sugar) with caloric supplements if malnourished',
              'Fluid restriction: guide by daily weight and clinical picture — there is no fixed rule',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Long-Term Optimisation (Once the Patient is Stable)',
        shortLabel: 'Optimisation',
        color: 'amber',
        cards: [
          {
            title: 'Step 1 — Start an ACE Inhibitor',
            threshold: 'Start when haemodynamically stable: HFrEF, cardiomyopathy, valve regurgitation, left-to-right shunts',
            orders: [
              'What it does: reduces the resistance the heart pumps against (afterload), reduces filling pressure (preload), and slows adverse cardiac remodeling',
              'CAPTOPRIL PO — starting dose by age group:',
              'Premature neonate: start 0.01 mg/kg/dose; target range 0.1–0.4 mg/kg/day divided every 6–24 hours',
              'Infant: start 0.15–0.3 mg/kg/dose; target range 1.5–6 mg/kg/day divided every 6–12 hours',
              'Child: start 0.3–0.5 mg/kg/dose; target range 2.5–6 mg/kg/day divided every 6–12 hours',
              'ENALAPRIL PO: 0.08–0.5 mg/kg/day divided every 12–24 hours (preferred in older children — twice daily is easier)',
              'Always start at the low end of the dose range and titrate up slowly',
              'Check blood pressure after each increase; check potassium and creatinine 48 hours after any dose change',
              'Side effects to watch for: hypotension, hyperkalaemia, persistent dry cough, angioedema (rare)',
              'Not tolerated? Switch to an angiotensin receptor blocker (ARB) — losartan or valsartan',
            ],
            prescriptions: [
              {
                drug: 'Captopril (Infant)',
                dose: 'Start 0.15–0.3 mg/kg/dose',
                route: 'PO',
                frequency: 'Q8h',
                calculation: (w) =>
                  `Start: ${(w * 0.15).toFixed(2)}–${(w * 0.3).toFixed(2)} mg/dose | Target daily: ${(w * 1.5).toFixed(1)}–${(w * 6).toFixed(1)} mg`,
                notes: 'Nelson Table 491.6. Titrate slowly. Target 1.5–6 mg/kg/day divided Q6–12h.',
              },
              {
                drug: 'Captopril (Child)',
                dose: 'Start 0.3–0.5 mg/kg/dose',
                route: 'PO',
                frequency: 'Q8h',
                calculation: (w) =>
                  `Start: ${(w * 0.3).toFixed(1)}–${(w * 0.5).toFixed(1)} mg/dose | Target daily: ${(w * 2.5).toFixed(1)}–${(w * 6).toFixed(1)} mg`,
                notes: 'Nelson Table 491.6. Target 2.5–6 mg/kg/day divided Q6–12h.',
              },
              {
                drug: 'Enalapril',
                dose: '0.08–0.5 mg/kg/day',
                route: 'PO',
                frequency: 'OD–BD',
                calculation: (w) => `${(w * 0.08).toFixed(2)}–${(w * 0.5).toFixed(1)} mg/day`,
                notes: 'Nelson Table 491.6. Divide every 12–24 hours.',
              },
            ],
          },
          {
            title: 'Step 2 — Add a Beta-Blocker (Euvolemic Only)',
            threshold: 'CRITICAL RULE: Start ONLY when Warm & Dry. NEVER during acute decompensation or on IV inotropes.',
            orders: [
              'RULE: The patient must be clinically euvolemic (Warm & Dry, off IV diuretics, not on IV inotropes) before you start',
              'Starting too early makes acute heart failure worse — they improve cardiac function slowly over weeks to months',
              'CARVEDILOL (alpha + beta blocker — preferred): start 0.1 mg/kg/day divided twice daily; maximum starting dose 6.25 mg/day',
              'Titrate carvedilol every 2 weeks — double the dose each time, targeting 0.5–1 mg/kg/day over 8–12 weeks (adult maximum 50–100 mg/day)',
              'METOPROLOL (beta-1 selective): start 0.2 mg/kg/day twice daily; target 1–2 mg/kg/day over weeks',
              'If the patient decompensates after starting: reduce or stop the beta-blocker and restart IV diuretics',
            ],
            prescriptions: [
              {
                drug: 'Carvedilol',
                dose: 'Start 0.1 mg/kg/day (max 6.25 mg/day)',
                route: 'PO',
                frequency: 'BD',
                calculation: (w) =>
                  `Start: ${Math.min(w * 0.1, 6.25).toFixed(2)} mg/day → Target: ${Math.min(w * 0.5, 50).toFixed(1)}–${Math.min(w * 1.0, 100).toFixed(1)} mg/day`,
                notes: 'START ONLY when euvolemic (Warm & Dry). Titrate over 8–12 weeks.',
              },
            ],
          },
          {
            title: 'Digoxin — Adjunct (Specialist Decision)',
            orders: [
              'Not first-line — used as an adjunct alongside an ACE inhibitor and diuretics in symptomatic heart failure',
              'LOADING DOSE (digitalization): give as three portions — half now, one quarter at 12 hours, one quarter at 24 hours',
              'Loading doses by age (all PO; IV dose = 75% of PO):',
              'Premature neonate: total loading dose = 20 micrograms/kg',
              'Full-term neonate (up to 1 month): total loading dose = 20–30 micrograms/kg',
              'Infant or Child: total loading dose = 25–40 micrograms/kg',
              'Adolescent or Adult: total loading dose = 0.5–1 mg in divided doses',
              'MAINTENANCE DOSE: 5–10 micrograms/kg/day divided every 12 hours PO — start 12 hours after the last loading dose',
              'Children over 5 years: do not exceed adult maintenance dose of 0.125–0.5 mg per day',
              'BEFORE EACH LOADING DOSE: record an ECG — stop if a new arrhythmia develops',
              'MYOCARDITIS: Start at HALF the maintenance dose only — NO loading dose (greatly increases arrhythmia risk)',
              'Check potassium with every diuretic change — hypokalaemia amplifies digoxin toxicity',
            ],
          },
          {
            title: 'ARNI: Sacubitril/Valsartan — Specialist Decision',
            threshold: 'Eligibility: age 1–18 years, NYHA Class II–IV, and LVEF ≤ 40%',
            orders: [
              'ARNI (angiotensin receptor-neprilysin inhibitor): combines an angiotensin receptor blocker (ARB) + neprilysin inhibitor in one tablet — replaces the ACE inhibitor entirely',
              'RULE: Never combine ARNI with an ACE inhibitor — serious risk of angioedema',
              'Switching from ACE inhibitor: wait at least 36 hours after the last ACE inhibitor dose before starting ARNI',
              'Dosing — titrate every 2 weeks toward target:',
              'Under 40 kg: start 1.6 mg/kg/dose → increase to 2.3 → then 3.1 mg/kg per dose, given twice daily',
              '40 to 49 kg: start 24/26 mg → 49/51 mg → target 72/78 mg twice daily',
              '50 kg or more: start 49/51 mg → 72/78 mg → target 97/103 mg twice daily',
              'Tablet numbers: first = sacubitril dose, second = valsartan dose (e.g. a 24/26 mg tablet = 24 mg sacubitril + 26 mg valsartan)',
              'Oral suspension available for children who cannot swallow tablets',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: Advanced HF — Inotropes (ICU)',
        shortLabel: 'Inotropes',
        color: 'emerald',
        cards: [
          {
            title: 'Which Inotrope to Use and When',
            threshold: 'For Cold & Dry or Cold & Wet — impaired cardiac output requiring ICU monitoring',
            orders: [
              'DOBUTAMINE IV (preferred first inotrope): 2–20 micrograms/kg/min',
              'Increases contractility and causes moderate peripheral vasodilation — improves output while reducing afterload',
              'Less likely to cause arrhythmias than dopamine at similar doses — use first unless blood pressure is critically low',
              'DOPAMINE IV: 2–10 micrograms/kg/min',
              'Increases contractility with minimal vasoconstriction at this dose range',
              'Above 15 micrograms/kg/min: significant alpha-adrenergic vasoconstriction occurs, increasing systemic vascular resistance (SVR) and afterload — avoid this range in heart failure',
              'Combining dopamine + dobutamine: useful when blood pressure is low and you need both vasopressor and inotropic support',
              'EPINEPHRINE IV (reserve for cardiogenic shock with critically low blood pressure): 0.01–1.0 micrograms/kg/min',
              'Raises blood pressure but also increases systemic vascular resistance (SVR) — adds to afterload on the failing ventricle',
              'Proarrhythmic and can cause myocardial injury at high doses — use for the shortest time necessary',
              'ALL INOTROPES: require continuous arterial blood pressure monitoring and ECG on the monitor',
            ],
          },
          {
            title: 'Milrinone & IV Vasodilators',
            orders: [
              'MILRINONE IV: 0.25–1.0 micrograms/kg/min (phosphodiesterase inhibitor)',
              'Improves contractility AND dilates peripheral vessels at the same time — uniquely beneficial in heart failure',
              'Most effective for low-output syndrome after cardiac surgery',
              'Side effect: hypotension from vasodilation — give a 5–10 mL/kg fluid bolus and reduce the infusion rate; caution in renal impairment',
              'NITROPRUSSIDE IV: 0.5–8 micrograms/kg/min',
              'Very potent vasodilator; short IV half-life makes it easy to titrate in an ICU',
              'Contraindicated if the patient is already hypotensive',
              'Metabolised to thiocyanate — monitor for thiocyanate toxicity (fatigue, nausea, acidosis) if used at high doses beyond 24–48 hours',
              'NITROGLYCERIN IV: start 0.25–0.5 micrograms/kg/min; maximum 20 micrograms/kg/min',
              'Mainly reduces preload (venodilation) — most useful for acute pulmonary oedema with preserved blood pressure',
              'HYDRALAZINE: IV 0.1–0.5 mg/kg/dose (maximum 20 mg) or PO 0.75–5 mg/kg/day divided every 6–12 hours',
            ],
          },
        ],
      },

      {
        label: 'Stage 5: Escalation & Discharge',
        shortLabel: 'Escalation',
        color: 'red',
        cards: [
          {
            title: 'Call Your Senior / Cardiology When...',
            isCritical: true,
            triggers: [
              'IF Cold & Wet (cardiogenic shock) at any time — call PICU and Cardiology immediately',
              'IF Cold & Dry not improving after a careful fluid bolus — needs inotropes and ICU monitoring',
              'IF Hepatomegaly is increasing or not responding to adequate IV furosemide — escalate diuresis plan',
              'IF Creatinine rises more than 30% from baseline — ACE inhibitor dose may need reducing or holding',
              'IF Hyperkalaemia develops — especially if on ACE inhibitor + spironolactone combination',
              'IF New arrhythmia appears on the ECG or monitor — supraventricular tachycardia (SVT), ventricular tachycardia (VT), or progressive heart block',
              'IF SpO2 drops below 90% despite supplemental oxygen — discuss positive pressure ventilation (PPV: CPAP or BiPAP first, then intubation)',
              'IF Digoxin toxicity suspected: nausea + new arrhythmia in a patient on digoxin — hold the drug and call senior immediately',
              'IF Infant is failing to thrive despite maximum oral therapy — earlier surgical or catheter-based intervention may be needed',
              'IF Patient is deteriorating on maximum medical therapy — begin transplant listing discussion',
            ],
          },
          {
            title: 'Advanced Support — Know This, Not Your Decision',
            orders: [
              'POSITIVE PRESSURE VENTILATION: reduces work of breathing and oxygen consumption — CPAP (continuous positive airway pressure) or BiPAP (bilevel positive airway pressure) before intubation if possible',
              'ECMO (Extracorporeal Membrane Oxygenation): provides full heart and lung support; best for reversible disease (e.g., myocarditis) expected to recover within days to weeks',
              'VAD (Ventricular Assist Device): for longer-term support when transplant is planned',
              'Small children: paracorporeal pulsatile-flow device (e.g., Berlin Heart EXCOR)',
              'Older children and adolescents: intracorporeal device (e.g., HeartMate 3) — some patients go home on these devices',
              'HEART TRANSPLANTATION: definitive treatment for refractory heart failure not responding to maximum therapy',
              'Cardiac resynchronisation therapy (CRT): for dilated cardiomyopathy with left bundle branch block (LBBB) pattern on ECG',
              'Implantable cardioverter-defibrillator (ICD): for patients at high risk of sudden cardiac death from ventricular arrhythmia',
            ],
          },
          {
            title: 'Safe to Discharge When...',
            orders: [
              'Dry weight achieved: no peripheral oedema, hepatomegaly resolved or clearly reducing',
              'No respiratory distress at rest; SpO2 stable on room air',
              'Tolerating full oral regimen (ACE inhibitor + furosemide + spironolactone ± beta-blocker) without symptomatic low blood pressure',
              'Potassium, sodium, and creatinine stable on the discharge medication regimen',
              'Echocardiogram done to document post-treatment left ventricular ejection fraction',
              'All medication doses written out clearly for family: drug name, dose, frequency, and what each drug is for',
              'Cardiology outpatient appointment booked within 1–2 weeks of discharge',
              'Family education completed: how to weigh the child at home daily, feeding plan, and which warning signs require emergency return',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (data) => {
    const state = data.clinical_state as string;
    const lvef = Number(data.lvef);
    const nyha = data.nyha as string;

    if (state === 'cold_wet') {
      return {
        level: 'critical',
        details: [
          'Cold & Wet — Cardiogenic Shock: impaired perfusion + active congestion',
          'Call PICU immediately. Initiate IV dobutamine or dopamine while waiting for ICU transfer.',
          'Do not delay — this child needs inotropic support now.',
        ],
      };
    }
    if (state === 'cold_dry') {
      return {
        level: 'severe',
        details: [
          'Cold & Dry — Low cardiac output without obvious congestion',
          'Try a careful IV fluid bolus (5–10 mL/kg) to optimise preload first.',
          'If no improvement in perfusion: inotropic support required — call senior for ICU transfer.',
        ],
      };
    }
    if (state === 'warm_wet') {
      if (lvef > 0 && lvef <= 40) {
        return {
          level: 'severe',
          details: [
            `Warm & Wet with HFrEF — LVEF ${lvef}%: systolic dysfunction plus active congestion`,
            'Start IV furosemide now. Begin or optimise ACE inhibitor once haemodynamically stable.',
            'Beta-blocker only when the patient is euvolemic — not yet.',
          ],
        };
      }
      return {
        level: 'moderate',
        details: [
          'Warm & Wet — congested but adequate perfusion (the most common HF presentation)',
          'Goal: diurese to Warm & Dry. Start IV furosemide now.',
          'Add ACE inhibitor and spironolactone once stable; transition to oral furosemide when decongested.',
        ],
      };
    }
    if (nyha === 'III' || nyha === 'IV') {
      return {
        level: 'moderate',
        details: [
          `NYHA Class ${nyha} — significant functional limitation despite a compensated haemodynamic profile`,
          'Review and optimise the chronic HF regimen. Consider ARNI (sacubitril/valsartan) if LVEF ≤ 40% and age 1–18 years.',
          'Cardiology review recommended — assess for disease progression.',
        ],
      };
    }
    return {
      level: 'mild',
      details: [
        'Warm & Dry — compensated heart failure',
        'Focus on optimising the oral regimen and preventing decompensation.',
        'Avoid triggers: infection, anaemia, arrhythmia, medication non-compliance.',
      ],
    };
  },

  getManagement: () => [],

  getDisposition: () => [
    'Dry weight achieved — no peripheral oedema; hepatomegaly resolved or reducing',
    'No respiratory distress at rest; SpO2 stable on room air',
    'Full oral regimen tolerated without symptomatic hypotension',
    'Electrolytes and renal function stable on discharge medications',
    'Cardiology outpatient appointment within 1–2 weeks; repeat echocardiogram booked',
    'Family education completed: daily weighing, feeding plan, emergency warning signs',
  ],

  getRedFlags: () => [
    'Gallop rhythm (S3 or S4 on auscultation)',
    'Hepatomegaly increasing despite IV furosemide',
    'Tachypnea with subcostal recession, grunting, or refusal to lie flat',
    'Cold peripheries with capillary refill time (CRT) > 3 seconds',
    'SpO2 below 90% despite supplemental oxygen',
    'New arrhythmia on cardiac monitor or ECG',
    'Falling urine output despite IV diuresis',
    'Rising lactate or metabolic acidosis — signs of impaired perfusion',
    'Nausea + bradycardia + new arrhythmia in a patient taking digoxin — suspect toxicity',
  ],

  getDrugDoses: () => [],

  getReferences: () => [
    {
      title: 'Nelson Textbook of Pediatrics, 22nd Ed. Ch. 491: Heart Failure (Burstein & Rossano, 2024)',
      url: 'https://www.elsevier.com/books/nelson-textbook-of-pediatrics/kliegman/978-0-323-88276-7',
    },
    {
      title: 'ISHLT Consensus Statement: Heart Failure in Pediatric and Congenital Heart Disease (2014)',
      url: 'https://www.jhlt.org/article/S1053-2498(14)01392-9/fulltext',
    },
    {
      title: 'AHA/ACC/HFSA 2022 Guideline for the Management of Heart Failure',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063',
    },
  ],
};
