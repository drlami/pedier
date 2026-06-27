import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Hypertension Master Pathway
 * Source: Nelson Textbook of Pediatrics, 21st ed., Chapter 494 (Macumber & Flynn)
 * Drug doses: Table 494.9 (oral) and Table 494.10 (IV emergency)
 */
export const wardHypertensionProtocol: DiseaseProtocol = {
  id: 'ward-hypertension-master',
  name: 'Hypertension Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Pediatric hypertension management from classification to hypertensive emergency. Classify first, rule out end-organ damage, then follow the oral (urgency) or IV/ICU (emergency) pathway. Central safety rule: never reduce blood pressure by more than 25% of the planned total reduction in the first 8 hours.',
  image: {
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=400',
    hint: 'Blood pressure monitoring in a clinical setting',
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'age', questionText: 'Age (Years)', type: 'number' },
    { id: 'sbp', questionText: 'Systolic BP (mmHg)', type: 'number' },
    { id: 'dbp', questionText: 'Diastolic BP (mmHg)', type: 'number' },
    {
      id: 'symptoms',
      questionText:
        'Symptoms of end-organ damage present? (headache, vomiting, seizures, vision changes, or altered consciousness)',
      type: 'boolean',
    },
  ],

  mmpData: {
    snapshot:
      'SAFETY RULE: Never reduce BP by more than 25% of the planned total reduction in the first 8 hours — faster reduction causes cerebral hypoperfusion and stroke. Emergency (end-organ damage) → ICU + IV infusion. Urgency (no end-organ damage) → ward + oral drugs. Goal BP: <90th centile for age/sex/height OR <130/80 mmHg, whichever is lower.',
    stages: [
      {
        label: 'Stage 1: Triage — Emergency or Not?',
        shortLabel: 'Triage',
        color: 'blue',
        cards: [
          {
            title: 'Rule Out Hypertensive Emergency — Decide First',
            isCritical: true,
            threshold: 'DECISION POINT',
            orders: [
              'CRITICAL: Ask about headache, vomiting, visual disturbance, seizures, or altered consciousness — ANY of these = hypertensive EMERGENCY, not urgency.',
              'HYPERTENSIVE EMERGENCY (end-organ damage present): Severely elevated BP + neurological symptoms OR cardiac failure OR acute kidney injury → transfer to ICU immediately, start IV infusion.',
              'HYPERTENSIVE URGENCY (no end-organ damage): Severely elevated BP, child is alert, no focal signs, no visual symptoms, no seizures → manage on ward with oral agents.',
              'IF IN DOUBT: treat as emergency. The boundary between urgency and emergency is a clinical judgement — err on the side of caution.',
            ],
          },
          {
            title: 'Classify the BP Level — What Stage Is This?',
            orders: [
              'NORMAL BP: <90th centile for age/sex/height (or <120/<80 mmHg in adolescents ≥13 yr).',
              'ELEVATED BP: ≥90th and <95th centile (or 120–129/<80 in adolescents ≥13 yr) — lifestyle modification only, no drug treatment yet.',
              'STAGE 1 HYPERTENSION: >95th centile up to 95th + 11 mmHg (or 130–139/80–89 in adolescents ≥13 yr) — lifestyle first, drugs if symptomatic or persistent.',
              'STAGE 2 HYPERTENSION: ≥95th centile + 12 mmHg (or ≥140/90 in adolescents ≥13 yr) — always start drug therapy.',
              'SCREENING VALUES THAT REQUIRE FURTHER EVALUATION (Nelson Table 494.1): Age 1 yr → 98/52 mmHg; Age 5 yr → 103/63 mmHg; Age 10 yr → 108/72 mmHg; Age ≥13 yr → 120/80 mmHg.',
              'NOTE: Always use the full AAP 2017 centile tables for final classification — these values vary by age, sex, and height.',
            ],
          },
          {
            title: 'Order These on Admission',
            orders: [
              'CONFIRM BP MANUALLY: have nursing re-check with a correctly sized cuff — bladder must encircle 80–100% of upper arm; width ≥40% of mid-arm circumference. Too small a cuff gives falsely high readings.',
              'BLOODS: full blood count (FBC), urea and electrolytes (U&E), creatinine, glucose, calcium, uric acid, lipid profile, plasma renin activity, aldosterone.',
              'URINE: urinalysis + microscopy, urine protein:creatinine ratio; urine catecholamines/metanephrines if phaeochromocytoma suspected.',
              'ECG (electrocardiogram): assess for left ventricular hypertrophy (LVH).',
              'ECHOCARDIOGRAM: up to 40% of hypertensive children have LVH — essential for all new diagnoses.',
              'RENAL ULTRASOUND + DOPPLER: assess kidney size, echogenicity, and rule out renal artery stenosis.',
              'FUNDOSCOPY: assess for hypertensive retinopathy (haemorrhages, exudates, papilledema).',
              'FOUR-LIMB BP MEASUREMENT: rule out coarctation of the aorta — BP should be equal in all four limbs.',
              'BRAIN MRI if encephalopathy suspected: look for posterior reversible encephalopathy syndrome (PRES) — bilateral occipital high signal on T2/FLAIR sequences.',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Lifestyle & Chronic Oral Management',
        shortLabel: 'Oral (Chronic)',
        color: 'indigo',
        cards: [
          {
            title: 'Lifestyle — Start Here for All Patients',
            orders: [
              'WEIGHT LOSS: the primary treatment for obesity-related hypertension — the most effective single intervention.',
              'DASH DIET (Dietary Approaches to Stop Hypertension): increase fresh fruits, vegetables, fibre, and low-fat dairy; reduce sodium to ≤2,300 mg/day (stricter: ≤1,500 mg/day). More info at dashdiet.org.',
              'PHYSICAL ACTIVITY: at least 30–60 minutes of aerobic exercise on most days; reduce sedentary screen time to <2 hours/day.',
              'SODIUM RESTRICTION: reduce dietary salt — especially important in salt-sensitive hypertension.',
              'AVOID: tobacco and alcohol.',
              'LIFESTYLE ALONE is sufficient for elevated BP (≥90th and <95th centile) without risk factors — confirm on repeat visits before labelling as hypertension.',
            ],
          },
          {
            title: 'When to Start Drug Therapy',
            orders: [
              'INDICATIONS FOR DRUG THERAPY (start if any of the following apply):',
              'Symptomatic hypertension (headache, dizziness, nausea, vomiting).',
              'Stage 2 hypertension without a modifiable risk factor (e.g., not obesity-related).',
              'Hypertension with comorbidities: diabetes mellitus (type 1 or 2), or chronic kidney disease (CKD).',
              'Persistent Stage 1 or 2 hypertension despite an adequate trial of lifestyle modification.',
              'PREFERRED INITIAL AGENTS (AAP 2017): ACE inhibitors, angiotensin receptor blockers (ARBs), thiazide diuretics, or calcium channel blockers (CCBs) — no single class is proven superior.',
              'SPECIAL RULE — CKD or diabetes + proteinuria: use an ACE inhibitor or ARB as first choice.',
              'SPECIAL RULE — bilateral renovascular hypertension suspected: do NOT use ACE inhibitors or ARBs — they reduce glomerular filtration rate and can precipitate acute kidney injury.',
            ],
          },
          {
            title: 'First-Line Oral Antihypertensives — Pick One Drug Class',
            orders: [
              'STRATEGY: start one drug at low dose → increase until goal BP achieved → if maximum dose reached without control, add a second drug from a different class.',
              'CALCIUM CHANNEL BLOCKERS (CCBs) — good first choice for most children:',
              'AMLODIPINE (ages 1–5 yr): start 0.1 mg/kg/day OD; max 0.6 mg/kg/day up to 5 mg/day. Slow onset 6–12 hr — do NOT use for acute urgency.',
              'AMLODIPINE (ages ≥6 yr): start 2.5 mg/day OD; max 10 mg/day OD.',
              'ISRADIPINE: 0.05–0.15 mg/kg/dose TDS–QDS; max 0.6 mg/kg/day up to 10 mg/day. Stable suspension available.',
              'NIFEDIPINE extended-release: 0.2–0.5 mg/kg/day OD–BD; max 3 mg/kg/day up to 120 mg/day.',
              'ACE INHIBITORS — preferred in CKD or diabetes with proteinuria:',
              'ENALAPRIL: 0.08 mg/kg/day OD; max 0.6 mg/kg/day up to 40 mg/day.',
              'LISINOPRIL: 0.07 mg/kg/day up to 5 mg/day OD; max 0.6 mg/kg/day up to 40 mg/day. Stable suspension available.',
              'CAPTOPRIL: 0.5 mg/kg/dose TDS (infants: 0.05 mg/kg/dose TDS); max 6 mg/kg/day up to 450 mg/day.',
              'ANGIOTENSIN RECEPTOR BLOCKERS (ARBs) — alternative to ACE inhibitors (useful if ACE inhibitor cough occurs):',
              'LOSARTAN: 0.75 mg/kg/day up to 50 mg/day OD; max 1.4 mg/kg/day up to 100 mg/day.',
              'THIAZIDE DIURETICS — useful in volume-dependent or salt-sensitive hypertension:',
              'HYDROCHLOROTHIAZIDE (HCTZ): 0.5–1 mg/kg/day OD; max 3 mg/kg/day up to 37.5 mg/day.',
              'BP GOAL: <90th centile for age/sex/height OR <130/80 mmHg, whichever is lower.',
            ],
            prescriptions: [
              {
                drug: 'Amlodipine (1–5 yr)',
                dose: '0.1 mg/kg/day',
                route: 'PO',
                frequency: 'OD',
                calculation: (w) =>
                  `${(w * 0.1).toFixed(1)} mg OD (max 5 mg/day for age 1–5 yr)`,
                notes: 'Slow onset 6–12 hr. Titrate every 24–48 hr. Not for acute urgency.',
              },
              {
                drug: 'Enalapril',
                dose: '0.08 mg/kg/day',
                route: 'PO',
                frequency: 'OD',
                calculation: (w) =>
                  `${(w * 0.08).toFixed(2)} mg OD (max 40 mg/day)`,
                notes:
                  'Preferred in CKD or diabetes with proteinuria. Check U&E and creatinine at 1 week.',
              },
              {
                drug: 'Losartan',
                dose: '0.75 mg/kg/day',
                route: 'PO',
                frequency: 'OD',
                calculation: (w) =>
                  `${(w * 0.75).toFixed(1)} mg OD (max 100 mg/day)`,
                notes:
                  'ARB — use if ACE inhibitor not tolerated. Check U&E at 1 week.',
              },
            ],
          },
          {
            title: 'If First-Line Is Not Enough — Step Up',
            orders: [
              'STEP 1: Increase the dose of the first drug until goal BP is reached or maximum recommended dose is reached.',
              'STEP 2: Add a second drug from a DIFFERENT class (e.g., ACE inhibitor + calcium channel blocker, or ACE inhibitor + thiazide diuretic).',
              'STEP 3: Add a third drug of a different class if two drugs at maximum doses are still insufficient.',
              'STEP 4: Consult a physician experienced in paediatric hypertension if three drugs fail.',
              'BETA-BLOCKERS (second-line, or if concurrent tachycardia/migraines):',
              'ATENOLOL: 0.5–1 mg/kg/day OD–BD; max 2 mg/kg/day up to 100 mg/day.',
              'METOPROLOL: 1–2 mg/kg/day BD; max 6 mg/kg/day up to 200 mg/day.',
              'SPIRONOLACTONE (aldosterone antagonist — useful if hyperaldosteronism suspected): 1 mg/kg/day OD–BD; max 3.3 mg/kg/day up to 100 mg/day.',
              'LABETALOL PO (alpha- and beta-adrenergic blocker): 2–3 mg/kg/day BD; max 10–12 mg/kg/day up to 1.2 g/day.',
              'CLONIDINE (central alpha-2 agonist): 5–10 µg/kg/day BD–TDS; max 25 µg/kg/day up to 0.9 mg/day. Side effects: dry mouth, sedation.',
              'MINOXIDIL (direct vasodilator — most potent oral agent, reserve for resistant cases): 0.1–0.2 mg/kg/day BD–TDS; max 1 mg/kg/day up to 50 mg/day.',
              'CKD GOAL: aim for 24-hour mean arterial pressure (MAP) <50th centile on ambulatory blood pressure monitoring (ABPM).',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Hypertensive Urgency — Oral Pathway',
        shortLabel: 'Urgency (Oral)',
        color: 'amber',
        cards: [
          {
            title: 'Urgency — High BP With No End-Organ Damage',
            orders: [
              'DEFINITION: Severely elevated BP (often well above Stage 2) WITH symptoms such as headache, dizziness, or nausea/vomiting — but WITHOUT evidence of end-organ damage.',
              'END-ORGAN DAMAGE signs that upgrade this to EMERGENCY: encephalopathy, seizures, fundal haemorrhages or papilledema, cardiac failure, acute kidney injury.',
              'MANAGEMENT: oral medications are appropriate if the child is alert and able to swallow.',
              'MONITORING: BP every 1 hour for the first 4 hours, then every 4 hours if stable.',
              'WARD ADMISSION: appropriate for urgency — no immediate ICU transfer unless the clinical situation changes.',
            ],
          },
          {
            title: 'Oral Agents for Acute BP Lowering',
            orders: [
              'ISRADIPINE PO (preferred — rapid oral action, calcium channel blocker): 0.05–0.15 mg/kg/dose up to 5 mg/dose; give TDS–QDS as needed. Stable compounded suspension available.',
              'CLONIDINE PO (central alpha-2 agonist — useful if CCB not available): 0.05–0.1 mg/dose; may repeat up to a total of 0.8 mg. Side effects: dry mouth, sedation.',
              'HYDRALAZINE PO (direct vasodilator — if isradipine not available): 0.25 mg/kg/dose up to 25 mg/dose. Note: extemporaneous suspension is only stable for 1 week.',
              'SHORT-ACTING IV ALTERNATIVE (if child cannot swallow oral drugs): Hydralazine IV 0.2–0.4 mg/kg/dose IV or intramuscular (IM) every 4 hours; OR Labetalol IV bolus 0.20–1.0 mg/kg/dose up to 40 mg.',
              'DO NOT use amlodipine for acute urgency — onset is 6–12 hours and it cannot be titrated rapidly.',
            ],
            prescriptions: [
              {
                drug: 'Isradipine (Urgency, PO)',
                dose: '0.05–0.15 mg/kg/dose',
                route: 'PO',
                frequency: 'TDS–QDS PRN',
                calculation: (w) =>
                  `${(w * 0.05).toFixed(2)}–${(w * 0.15).toFixed(2)} mg per dose (max 5 mg/dose)`,
                notes:
                  'Preferred oral agent for acute BP reduction. Stable suspension can be compounded.',
              },
              {
                drug: 'Hydralazine (Urgency, IV/IM)',
                dose: '0.2–0.4 mg/kg/dose',
                route: 'IV or IM',
                frequency: 'Q4H PRN',
                calculation: (w) =>
                  `${(w * 0.2).toFixed(1)}–${(w * 0.4).toFixed(1)} mg per dose`,
                notes: 'Every 4 hr when given IV bolus. Use IM if IV access not yet established.',
              },
            ],
          },
          {
            title: 'The 25% Rule — Never Reduce BP Faster Than This',
            isCritical: true,
            orders: [
              'CRITICAL SAFETY RULE: In chronic hypertension, the brain\'s autoregulation is reset to higher pressures. Reducing BP too fast causes cerebral hypoperfusion and stroke.',
              'MAXIMUM REDUCTION: no more than 25% of the planned total BP reduction should happen in the first 8 hours.',
              'NORMALIZATION: gradual return to goal BP over the next 24–48 hours after the initial reduction.',
              'EXAMPLE: if you plan to reduce mean arterial pressure (MAP) by 40 mmHg total, the first 8 hours should see no more than 10 mmHg of that reduction.',
              'IF new headache, focal neurology, or vision changes develop during treatment: STOP further reduction immediately and reassess — this may indicate cerebral hypoperfusion.',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Hypertensive Emergency — ICU',
        shortLabel: 'Emergency (ICU)',
        color: 'red',
        cards: [
          {
            title: 'Emergency — Transfer to ICU Now',
            isCritical: true,
            threshold: 'ICU TRANSFER',
            orders: [
              'CRITERIA for ICU admission: severely elevated BP + any of: encephalopathy, seizures, papilledema, cardiac failure, pulmonary oedema, or acute kidney injury.',
              'SET UP ARTERIAL LINE: essential for continuous beat-to-beat BP monitoring during IV infusion titration. If unavailable, use oscillometric device for very frequent repeated measurements.',
              'CALL ICU TEAM NOW — do not delay. Establish IV access and prepare infusions while awaiting transfer.',
              'PLAN YOUR TARGET REDUCTION before starting any drug: MAP reduction must not exceed 25% of the total planned reduction in the first 8 hours.',
              'FIRST CHOICE: Nicardipine infusion (calcium channel blocker IV) — titratable, works in asthma and heart failure.',
              'SECOND CHOICE: Labetalol IV — contraindicated in asthma and overt heart failure.',
            ],
            nursing: [
              'Continuous arterial line BP monitoring is the standard of care — set up immediately on ICU arrival.',
              'If arterial line not yet in place, measure BP with oscillometric cuff every 5–15 minutes during drug titration.',
              'Record BP, heart rate, and urine output every 15 minutes while actively titrating IV agents.',
              'Alert medical team immediately if SBP drops >20 mmHg below target, or if new neurological signs develop.',
            ],
          },
          {
            title: 'Nicardipine IV — First Choice',
            orders: [
              'NICARDIPINE (calcium channel blocker IV): preferred agent for paediatric hypertensive emergency — titratable, no contraindications in asthma or heart failure.',
              'BOLUS DOSE: 30 µg/kg IV (maximum single dose 2 mg). Give slowly over 2–5 minutes.',
              'INFUSION: start at 0.5 µg/kg/min IV; titrate upward in 0.5 µg/kg/min increments every 15–30 minutes until target BP is reached; maximum 4 µg/kg/min.',
              'SIDE EFFECT: may cause reflex tachycardia — monitor heart rate continuously.',
              'PREPARATION: dilute in normal saline or 5% dextrose. Central line preferred for infusion; a large reliable peripheral line is acceptable short-term.',
            ],
            prescriptions: [
              {
                drug: 'Nicardipine (IV Bolus)',
                dose: '30 µg/kg',
                route: 'IV',
                frequency: 'STAT (may repeat)',
                calculation: (w) =>
                  `${(w * 30).toFixed(0)} µg = ${(w * 0.03).toFixed(2)} mg (max 2 mg per dose)`,
                notes: 'Give slowly IV over 2–5 min. Watch for reflex tachycardia.',
              },
              {
                drug: 'Nicardipine (IV Infusion)',
                dose: '0.5 µg/kg/min starting dose',
                route: 'IV Infusion',
                frequency: 'Continuous',
                calculation: (w) =>
                  `Start: ${(w * 0.5).toFixed(1)} µg/min → max ${(w * 4).toFixed(0)} µg/min`,
                notes:
                  'Titrate in 0.5 µg/kg/min increments every 15–30 min. Max 4 µg/kg/min.',
              },
            ],
          },
          {
            title: 'Labetalol IV — Second Choice',
            orders: [
              'CRITICAL: CONTRAINDICATED in asthma and overt heart failure — alpha- and beta-adrenergic blockade worsens bronchospasm and reduces cardiac output. Check before giving.',
              'LABETALOL (alpha- and beta-adrenergic blocker IV): use when nicardipine is unavailable or not tolerated.',
              'BOLUS: 0.20–1.0 mg/kg/dose IV (maximum 40 mg per dose). Give slowly over 2–3 minutes. May repeat every 10 minutes as needed.',
              'INFUSION: 0.25–3.0 mg/kg/hr IV continuous infusion — preferred over repeated boluses for smoother titration.',
              'MONITOR: heart rate (bradycardia risk), blood pressure continuously.',
            ],
            prescriptions: [
              {
                drug: 'Labetalol (IV Bolus)',
                dose: '0.20–1.0 mg/kg/dose',
                route: 'IV',
                frequency: 'May repeat Q10min',
                calculation: (w) =>
                  `${(w * 0.2).toFixed(1)}–${(w * 1.0).toFixed(1)} mg per bolus (max 40 mg)`,
                notes: 'Give over 2–3 min. AVOID in asthma or heart failure.',
              },
              {
                drug: 'Labetalol (IV Infusion)',
                dose: '0.25–3.0 mg/kg/hr',
                route: 'IV Infusion',
                frequency: 'Continuous',
                calculation: (w) =>
                  `${(w * 0.25).toFixed(1)}–${(w * 3.0).toFixed(1)} mg/hr`,
                notes: 'Preferred over repeated boluses. AVOID in asthma or heart failure.',
              },
            ],
          },
          {
            title: 'Sodium Nitroprusside & Esmolol — Last Resort',
            orders: [
              'SODIUM NITROPRUSSIDE (direct vasodilator): 0.5–10 µg/kg/min IV infusion. Very potent — requires expert ICU supervision.',
              'CYANIDE TOXICITY WARNING: monitor for cyanide toxicity with prolonged use (>72 hours) or in renal failure — co-administer sodium thiosulfate prophylactically. Signs of toxicity: metabolic acidosis, elevated lactate, haemodynamic instability despite adequate BP reduction.',
              'ESMOLOL (beta-adrenergic blocker, ultra-short-acting): 100–500 µg/kg/min IV infusion. Useful for rapid dose adjustment — very short half-life means effects wear off quickly if stopped.',
              'ESMOLOL CAUTION: constant infusion strongly preferred; may cause profound bradycardia — stop infusion immediately if heart rate drops significantly.',
              'HYDRALAZINE IV (alternative short-acting bolus): 0.2–0.4 mg/kg/dose IV or intramuscular (IM), every 4 hours. Less titratable than continuous infusion agents — use only when infusion agents are unavailable.',
            ],
          },
        ],
      },
      {
        label: 'Stage 5: Secondary Workup & Discharge',
        shortLabel: 'Workup & Discharge',
        color: 'emerald',
        cards: [
          {
            title: 'Work Up for Secondary Causes — Must Do in All Children',
            orders: [
              'SUSPECT SECONDARY HYPERTENSION in: infants and young children, severe or rapidly progressive hypertension, refractory hypertension, or any child with an abnormal physical examination.',
              'MOST COMMON CAUSES in children: kidney parenchymal disease and renovascular hypertension account for approximately 90% of secondary cases.',
              'RENAL (most common): acute or chronic glomerulonephritis, reflux nephropathy, obstructive nephropathy, haemolytic-uraemic syndrome, polycystic kidney disease, renal tumours.',
              'RENOVASCULAR: renal artery stenosis (fibromuscular dysplasia, Takayasu arteritis, neurofibromatosis type 1), renal artery thrombosis, umbilical artery catheterisation history in neonates.',
              'ENDOCRINE: phaeochromocytoma (check 24-hour urine catecholamines/metanephrines; paroxysmal hypertension + sweating + pallor), Cushing syndrome, congenital adrenal hyperplasia (11β-hydroxylase or 17α-hydroxylase deficiency), primary hyperaldosteronism (aldosterone:renin ratio), hyperthyroidism (thyroid function tests).',
              'COARCTATION OF THE AORTA: always check — palpate femoral pulses and measure four-limb BP. Echo or CT angiography to confirm if suspected.',
              'DRUGS AND TOXINS: oral contraceptives, sympathomimetic decongestants, stimulant medications (ADHD drugs), cyclosporine/tacrolimus (transplant patients), corticosteroids, cocaine.',
              'OBSTRUCTIVE SLEEP APNEA: snoring + daytime somnolence + hypertension → refer for polysomnography.',
              'PRIMARY HYPERTENSION: more likely in overweight/obese older children and adolescents with mild BP elevation, family history of hypertension, and no identifiable secondary cause.',
            ],
          },
          {
            title: 'Call Your Senior / Nephrology When...',
            orders: [
              'New focal neurological deficits (hemiparesis, aphasia, cortical blindness).',
              'Seizures or status epilepticus in the context of hypertension.',
              'Hypertensive encephalopathy (posterior reversible encephalopathy syndrome — PRES).',
              'Acute pulmonary oedema, new cardiac failure, or papilledema on fundoscopy.',
              'Acute kidney injury: rising creatinine, haematuria, or oliguria.',
              'Suspected phaeochromocytoma, primary hyperaldosteronism, or renovascular hypertension.',
              'Suspected coarctation of the aorta.',
              'Any child under 1 year of age presenting with hypertension.',
              'Blood pressure uncontrolled after three antihypertensive drugs at maximum doses.',
            ],
          },
          {
            title: 'Safe to Discharge When...',
            orders: [
              'BP consistently <90th centile for age/sex/height over at least 24 hours on stable oral medication.',
              'No evidence of end-organ damage: normal neurological examination, normal renal function (creatinine and U&E), and normal fundoscopy.',
              'If transferred from ICU: IV-to-oral medication transition completed without rebound hypertension.',
              'Secondary cause workup has been initiated — results may be pending at discharge but a plan is in place.',
              'Nephrology or cardiology outpatient follow-up arranged (within 1–2 weeks).',
              'Family educated on: correct home BP monitoring technique, importance of medication adherence, and when to return urgently (severe headache, visual changes, seizures, vomiting).',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (data) => {
    if (data.symptoms) {
      return {
        level: 'critical',
        details: [
          'Hypertensive Emergency: symptoms of end-organ damage are present.',
          'Transfer to ICU immediately. Start IV antihypertensive infusion under continuous BP monitoring.',
          'First choice: Nicardipine infusion 0.5–4 µg/kg/min. Second choice: Labetalol (avoid in asthma/HF).',
          'Apply 25% rule: no more than 25% of planned MAP reduction in the first 8 hours.',
        ],
      };
    }
    const sbp = Number(data.sbp);
    if (sbp >= 160) {
      return {
        level: 'severe',
        details: [
          'Severe Hypertension (Urgency): SBP ≥160 mmHg, no end-organ damage symptoms.',
          'Manage on ward with oral antihypertensive agents.',
          'Preferred: Isradipine 0.05–0.15 mg/kg/dose PO. Apply 25% rule — gradual reduction over 24–48 hours.',
          'Monitor BP every 1 hour for the first 4 hours.',
        ],
      };
    }
    if (sbp >= 130) {
      return {
        level: 'moderate',
        details: [
          'Stage 1–2 Hypertension: classify by centiles for age/sex/height (use AAP 2017 tables).',
          'Start lifestyle modification. Add oral antihypertensives if indicated (Stage 2, symptomatic, or CKD/diabetes).',
          'Goal BP: <90th centile for age OR <130/80 mmHg, whichever is lower.',
        ],
      };
    }
    return {
      level: 'mild',
      details: [
        'Elevated BP: ≥90th centile and <95th centile (or SBP 120–129 in adolescents ≥13 yr).',
        'No drug therapy required yet — lifestyle modification only (DASH diet, weight loss, exercise).',
        'Confirm on repeat BP measurements before labelling as hypertension.',
      ],
    };
  },

  getManagement: () => [],

  getDisposition: () => [
    'BP consistently <90th centile for age/sex/height over ≥24 hours on stable oral medication.',
    'No evidence of end-organ damage: normal neurological exam, normal renal function, and normal fundoscopy.',
    'IV-to-oral medication transition completed without rebound hypertension (if transferred from ICU).',
    'Secondary cause workup initiated — nephrology or cardiology outpatient follow-up arranged within 1–2 weeks.',
    'Family educated on home BP monitoring, medication adherence, and urgent return symptoms.',
  ],

  getRedFlags: (_severity, data) => {
    const flags: string[] = [
      'Seizures or status epilepticus',
      'New focal neurological deficits (hemiparesis, aphasia, cortical blindness)',
      'Altered or declining level of consciousness',
      'Papilledema or acute fundal haemorrhages (hypertensive retinopathy)',
      'Acute pulmonary oedema (hypoxia, pink frothy sputum, severe respiratory distress)',
      'Oliguria, haematuria, or rapidly rising creatinine (acute kidney injury)',
      'Sudden severe headache with vomiting — assess for encephalopathy',
    ];
    if (data.symptoms) {
      flags.unshift(
        'END-ORGAN DAMAGE PRESENT — this is a hypertensive emergency requiring ICU transfer now',
      );
    }
    return flags;
  },

  getDrugDoses: () => [],

  getReferences: () => [
    {
      title:
        'Nelson Textbook of Pediatrics, 21st ed. — Ch 494: Systemic Hypertension (Macumber IR, Flynn JT, 2024). Drug doses from Tables 494.9 and 494.10.',
      url: 'https://www.clinicalkey.com/#!/content/book/3-s2.0-B9780323529501004941',
    },
    {
      title:
        'AAP Clinical Practice Guideline: Screening and Management of High Blood Pressure in Children and Adolescents (Flynn JT et al., Pediatrics 2017;140:e20171904)',
      url: 'https://publications.aap.org/pediatrics/article/140/3/e20171904/38358/Clinical-Practice-Guideline-for-Screening-and',
    },
    {
      title:
        'Flynn JT, Tullus K. Severe hypertension in children and adolescents: pathophysiology and treatment. Pediatr Nephrol. 2009;24(6):1101–1112.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/18712425/',
    },
  ],
};
