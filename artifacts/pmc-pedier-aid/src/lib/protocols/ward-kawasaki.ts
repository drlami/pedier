import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Kawasaki Disease
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Source: Nelson Textbook of Pediatrics, 21st ed., Chapter 208
 * Reference: McCrindle BW et al. AHA Scientific Statement. Circulation 2017;135(17):e927–e999
 */
export const wardKawasakiProtocol: DiseaseProtocol = {
  id: 'ward-kawasaki-disease',
  name: 'Kawasaki Disease Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Kawasaki disease (KD) is an acute, self-limited febrile vasculitis of medium-sized arteries with predilection for the coronary arteries. Without treatment, 25% of children develop coronary artery aneurysms (CAA). Intravenous immunoglobulin (IVIG) given within 10 days reduces CAA risk to <5%. This pathway covers classic and incomplete diagnosis, high-risk adjunctive therapy, IVIG resistance management, and coronary artery risk stratification.',
  image: {
    url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400',
    hint: 'Clinical assessment of Kawasaki signs',
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'feverDays', questionText: 'Days of fever so far', type: 'number' },
    { id: 'signsCount', questionText: 'Number of classic signs present (0–5)', type: 'number' },
  ],

  mmpData: {
    snapshot: 'The core treatment is IVIG 2 g/kg within 10 days of fever onset — this reduces coronary artery aneurysm (CAA) risk from 25% to <5%. High-risk patients (age <6 months or baseline coronary z-score ≥2.5) also receive methylprednisolone alongside IVIG. IVIG-resistant KD (persistent fever ≥36 hours post-infusion, ~15% of cases) requires a second IVIG dose, glucocorticoids, or infliximab. Coronary artery z-scores drive long-term antiplatelet/anticoagulation decisions and echocardiogram surveillance intervals.',
    stages: [
      {
        label: 'Stage 1: Diagnosis — Classic or Incomplete KD',
        shortLabel: 'Diagnosis',
        color: 'blue',
        cards: [
          {
            title: 'Classic Diagnostic Criteria',
            threshold: 'FEVER ≥5 DAYS + ANY 4 OF THESE 5 SIGNS',
            orders: [
              'Bilateral non-exudative conjunctival injection with limbal sparing',
              'Mucosal changes: cracked/red lips, strawberry tongue, or diffuse oropharyngeal erythema',
              'Extremity changes: acute erythema/oedema of palms/soles, OR periungual desquamation (weeks 2–3)',
              'Rash: polymorphous — maculopapular, urticarial, or erythema multiforme-like; never vesicular',
              'Cervical lymphadenopathy: unilateral, node >1.5 cm diameter',
              'EARLY DIAGNOSIS RULE: with ≥4 signs (especially hand/foot swelling), diagnosis can be made on day 4',
              'EXCLUDE KD if: exudative conjunctivitis, exudative pharyngitis, oral ulcers, bullous or vesicular rash, generalised lymphadenopathy, or splenomegaly',
            ],
          },
          {
            title: 'Incomplete KD — When to Suspect and Treat',
            threshold: 'FEVER ≥5 DAYS WITH ONLY 2–3 SIGNS',
            orders: [
              'Step 1: Measure C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR)',
              'IF CRP <3.0 mg/dL AND ESR <40 mm/hr: observe; treat if typical periungual peeling develops or echo is positive',
              'IF CRP ≥3.0 mg/dL OR ESR ≥40 mm/hr: check 6 supplemental laboratory criteria',
              'Supplemental lab criteria — count how many are positive: (1) anaemia for age, (2) platelet ≥450,000 after day 7, (3) albumin ≤3.0 g/dL, (4) elevated alanine transaminase (ALT), (5) WBC ≥15,000/mm³, (6) urine ≥10 WBC/high-power field',
              'IF ≥3 supplemental criteria positive: treat as Kawasaki disease',
              'IF <3 supplemental criteria but echo positive (LAD or RCA z-score ≥2.5, coronary aneurysm, or ≥3 minor echo features): treat as KD',
              'SPECIAL RULE: any infant ≤6 months with fever ≥7 days and no other explanation → echocardiogram regardless of signs count',
            ],
          },
          {
            title: 'Admission Investigations [DR]',
            orders: [
              'ECHOCARDIOGRAM (MANDATORY ON ADMISSION): establish baseline coronary z-scores, left ventricular (LV) function, and rule out pericardial effusion',
              'Full blood count (FBC): look for neutrophilia, thrombocytopenia (early) or thrombocytosis (weeks 2–3)',
              'CRP and ESR (both universally elevated in acute KD)',
              'N-terminal pro-B-type natriuretic peptide (NT-proBNP): elevated in high-risk patients',
              'Liver function tests (LFTs) and albumin (transaminitis and hypoalbuminaemia common)',
              'Serum sodium (hyponatraemia = risk factor for coronary aneurysm)',
              'Urea and electrolytes (U&E)',
              '12-lead ECG: check PR prolongation, ST-segment changes, QRS voltages, arrhythmias',
              'Urinalysis: sterile pyuria (collect via mid-stream urine or catheter)',
              'Throat and nasopharyngeal swabs to exclude Adenovirus, Streptococcal scarlet fever, and Measles',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Acute Treatment — IVIG + Aspirin',
        shortLabel: 'Treatment',
        color: 'red',
        cards: [
          {
            title: 'IVIG — Give Within 10 Days of Fever Onset',
            threshold: 'START AS SOON AS DIAGNOSIS IS CONFIRMED',
            isCritical: true,
            orders: [
              'IVIG 2 g/kg IV as a single infusion over 10–12 hours — reduces CAA risk from 25% to <5%',
              'IF diagnosed after day 10: still give IVIG if persistent fever, abnormal coronary arteries, or ongoing systemic inflammation',
              'Pre-medication: paracetamol 15 mg/kg PO and diphenhydramine 1 mg/kg PO, 30 minutes before starting infusion',
              'DELAY live vaccines (MMR and varicella) for 11 months after IVIG — IVIG interferes with antiviral antibody response',
            ],
            nursing: [
              'Vital signs every 15 minutes for the first hour of IVIG infusion',
              'Then every 1 hour until infusion is complete',
              'Watch for infusion reactions: fever, chills, hypotension, rash — slow rate if mild; stop and call doctor if severe',
            ],
            prescriptions: [
              {
                drug: 'Intravenous Immunoglobulin (IVIG)',
                dose: '2 g/kg',
                route: 'IV infusion',
                frequency: 'Single dose',
                calculation: (w: number) => `${(w * 2).toFixed(1)} g`,
                notes: 'Infuse over 10–12 hours. Pre-medicate with paracetamol and diphenhydramine.',
              },
            ],
          },
          {
            title: 'Aspirin — Febrile Phase (Anti-inflammatory)',
            threshold: 'START WITH IVIG; CONTINUE UNTIL AFEBRILE ≥48 HOURS',
            orders: [
              'HIGH-DOSE aspirin 30–50 mg/kg/day PO divided every 6 hours for anti-inflammatory effect during the febrile phase',
              'Continue until patient is afebrile for at least 48 hours, then switch to low-dose',
              'DO NOT give other NSAIDs concurrently — they block aspirin\'s antiplatelet effect',
              'MANDATORY: suspend aspirin if child is exposed to varicella or influenza infection (risk of Reye syndrome) — use an alternative antiplatelet agent during that period',
            ],
            prescriptions: [
              {
                drug: 'Aspirin (high-dose, febrile phase)',
                dose: '30–50 mg/kg/day',
                route: 'Oral',
                frequency: 'Divided every 6 hours',
                calculation: (w: number) => `${(w * 7.5).toFixed(0)}–${(w * 12.5).toFixed(0)} mg per dose (q6h)`,
                notes: 'Switch to low-dose aspirin 3–5 mg/kg/day OD once afebrile ≥48h.',
              },
            ],
          },
          {
            title: 'High-Risk Patients — Add Methylprednisolone',
            threshold: 'HIGH RISK = AGE <6 MONTHS OR BASELINE LAD/RCA Z-SCORE ≥2.5',
            orders: [
              'Add methylprednisolone to standard IVIG + aspirin — evidence shows improved coronary outcomes in high-risk patients',
              'METHYLPREDNISOLONE 2 mg/kg/day IV divided every 12 hours, continue until afebrile',
              'Then convert to ORAL prednisolone 2 mg/kg/day divided twice daily (BD)',
              'Continue prednisolone until CRP normalises, then taper over 2–3 weeks',
              'DO NOT use single pulse-dose methylprednisolone 30 mg/kg as primary therapy — this does not improve coronary outcomes',
            ],
            prescriptions: [
              {
                drug: 'Methylprednisolone (febrile phase)',
                dose: '2 mg/kg/day ÷ q12h',
                route: 'IV',
                frequency: 'Every 12 hours until afebrile',
                calculation: (w: number) => `${(w * 1).toFixed(0)} mg every 12 hours`,
                notes: 'Switch to prednisolone PO 2 mg/kg/day ÷ BD until CRP normal, then taper over 2–3 weeks.',
              },
            ],
          },
        ],
      },
      {
        label: 'Stage 3: IVIG Resistance — Persistent Fever ≥36h Post-Infusion',
        shortLabel: 'Resistance',
        color: 'amber',
        cards: [
          {
            title: 'Identify IVIG Resistance — Call Cardiology & Rheumatology',
            threshold: 'FEVER PERSISTING OR RECURRING ≥36H AFTER 1ST IVIG ENDS',
            isCritical: true,
            orders: [
              'IVIG resistance occurs in approximately 15% of patients and carries higher coronary artery aneurysm (CAA) risk',
              'Defined as: persistent or recrudescent fever ≥36 hours (and <7 days) after completing the first IVIG infusion',
              'Call Paediatric Cardiology and Rheumatology immediately — do not wait',
              'Repeat echocardiogram now: reassess coronary z-scores before choosing next therapy',
              'Repeat CRP and ESR',
            ],
          },
          {
            title: 'Escalation Ladder for IVIG-Resistant KD',
            orders: [
              'FIRST LINE: 2nd IVIG dose 2 g/kg IV over 10–12 hours',
              'SECOND LINE: IVIG 2 g/kg + methylprednisolone 2 mg/kg/day IV ÷ q12h until afebrile, then prednisolone PO 2 mg/kg/day ÷ BD until CRP normalises, taper over 2–3 weeks',
              'THIRD LINE: Infliximab (monoclonal antibody against tumour necrosis factor-α) 5–10 mg/kg IV as a single infusion — specialist prescription required',
              'FOURTH LINE (specialist only): Anakinra (interleukin-1 receptor antagonist) 2–8 mg/kg/day SC or IV — for the most severe or refractory cases',
              'FIFTH LINE (specialist only): Cyclosporine or cyclophosphamide for patients with enlarging coronary aneurysms — Rheumatology/Cardiology to manage',
              'Single pulse-dose methylprednisolone 30 mg/kg is NOT recommended as a resistance treatment',
            ],
            prescriptions: [
              {
                drug: 'Infliximab (3rd-line, IVIG-resistant)',
                dose: '5–10 mg/kg',
                route: 'IV infusion',
                frequency: 'Single dose',
                calculation: (w: number) => `${(w * 5).toFixed(0)}–${(w * 10).toFixed(0)} mg`,
                notes: 'Only after failure of 2nd IVIG dose. Specialist/Rheumatology prescription required.',
              },
            ],
          },
          {
            title: 'Macrophage Activation Syndrome (MAS) Watch',
            threshold: 'OCCURS IN 1–2% OF KD — LIFE-THREATENING',
            orders: [
              'Macrophage activation syndrome (MAS) is a life-threatening hyperinflammatory syndrome on the spectrum of haemophagocytic lymphohistiocytosis (HLH)',
              'SUSPECT MAS if ALL of these occur together: hyperferritinemia, coagulopathy (low fibrinogen, prolonged PT/PTT), cytopenia (falling platelets/WBC/Hb), and shock',
              'Distinguish from natural KD pattern: in KD, platelets typically RISE in weeks 2–3; in MAS, platelets FALL with coagulopathy',
              'Precipitous fall in ESR despite persistently high CRP is a characteristic MAS laboratory feature',
              'MAS requires aggressive immunosuppression — call Rheumatology immediately; do not delay',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Coronary Risk Stratification & Anticoagulation',
        shortLabel: 'Coronary Risk',
        color: 'indigo',
        cards: [
          {
            title: 'Coronary Artery Z-Score Risk Classification (AHA 2017)',
            orders: [
              'Z-score = body surface area-adjusted coronary artery dimension — must be measured on every echocardiogram',
              'RISK 1: z-score <2 at all time points — no coronary involvement',
              'RISK 2: z-score 2–2.5 — dilation only; expected to resolve within 1 year',
              'RISK 3: z-score 2.5–5 — small coronary artery aneurysm (CAA)',
              'RISK 4: z-score 5–10 — medium coronary artery aneurysm (CAA)',
              'RISK 5: z-score ≥10 OR absolute diameter ≥8 mm — giant coronary artery aneurysm (CAA); highest risk of thrombosis, stenosis, and myocardial infarction',
              'Giant aneurysms: rarely regress to normal diameter; rupture can occur in the first month (presents as haemopericardium and tamponade)',
              'Risk factors for CAA: age <6 months, male sex, prolonged fever, poor IVIG response, neutrophilia, thrombocytopenia, transaminitis, hyponatraemia, hypoalbuminaemia, elevated NT-proBNP, elevated CRP',
            ],
          },
          {
            title: 'Antiplatelet & Anticoagulation by Risk Level',
            orders: [
              'RISK 1 or 2: low-dose aspirin 3–5 mg/kg OD until 6–8 weeks after illness onset; discontinue if echo normal throughout',
              'RISK 3 (small aneurysm): aspirin 3–5 mg/kg OD — long-term, indefinite',
              'RISK 4 (medium aneurysm): aspirin 3–5 mg/kg OD + consider clopidogrel 1 mg/kg/day PO (max 75 mg/day)',
              'RISK 5 (giant aneurysm): aspirin 3–5 mg/kg OD + anticoagulation with warfarin OR low-molecular-weight heparin (LMWH) OR direct oral anticoagulant (DOAC, e.g., apixaban) — Cardiology to choose agent',
              'ACUTE CORONARY THROMBOSIS: immediate fibrinolytic therapy with tissue plasminogen activator (tPA) or other thrombolytic — emergency Cardiology call; do not delay',
            ],
            prescriptions: [
              {
                drug: 'Aspirin (low-dose, convalescent phase)',
                dose: '3–5 mg/kg/day',
                route: 'Oral',
                frequency: 'Once daily (OD)',
                calculation: (w: number) => `${(w * 4).toFixed(0)} mg once daily`,
                notes: 'Minimum 6–8 weeks if Risk 1–2; indefinite for Risk 3–5. Suspend if varicella or influenza exposure.',
              },
              {
                drug: 'Clopidogrel (Risk 4 — medium aneurysm)',
                dose: '1 mg/kg/day',
                route: 'Oral',
                frequency: 'Once daily (OD)',
                calculation: (w: number) => `${Math.min(w * 1, 75).toFixed(0)} mg once daily`,
                notes: 'Max 75 mg/day. Add to aspirin for medium aneurysm (Risk 4). Cardiology to prescribe.',
              },
            ],
          },
        ],
      },
      {
        label: 'Stage 5: Echo Schedule, Vaccine Timing & Discharge',
        shortLabel: 'Follow-up',
        color: 'emerald',
        cards: [
          {
            title: 'Echocardiogram Monitoring Schedule',
            orders: [
              'Echo 1: at diagnosis (baseline coronary z-scores)',
              'Echo 2: at 1–2 weeks after illness onset',
              'Echo 3: at 6–8 weeks after illness onset',
              'RISK 1 (no involvement): if Echos 1–3 all normal, may discharge from Cardiology at 12 months; annual general health review recommended',
              'RISK 2 (dilation only): same 3-echo schedule; discharge at 12 months if normal throughout',
              'RISK 3 (small aneurysm): annual echo + coronary CT angiography at 12 months as baseline; stress imaging for inducible ischaemia every 2 years; Cardiology follow-up indefinitely',
              'RISK 4 (medium aneurysm): echo at 2 weeks, 6 weeks, 6 months, then annually; annual coronary CT angiography and annual stress imaging; echo/CT for thrombus surveillance every 6 months',
              'RISK 5 (giant aneurysm): echo every 2 weeks initially, then every 3 months, then 6-monthly; coronary CT angiography at 6–12 months; thrombus surveillance every 6 months',
            ],
          },
          {
            title: 'Vaccine Timing & Aspirin Safety Rules',
            orders: [
              'DELAY live vaccines (MMR + varicella) for 11 months after IVIG: IVIG interferes with the antiviral antibody response',
              'Non-live routine immunisations: do NOT delay — give on schedule',
              'ANNUAL influenza vaccination is MANDATORY for all KD patients on aspirin — reduces risk of Reye syndrome',
              'Varicella exposure during aspirin therapy: switch to an alternative antiplatelet agent for 6 weeks after varicella vaccination; then resume aspirin',
            ],
          },
          {
            title: 'Discharge Criteria & Long-Term Counselling',
            orders: [
              'Afebrile for ≥48–72 hours on low-dose aspirin 3–5 mg/kg OD',
              'Echocardiogram reviewed by Cardiology and follow-up echo arranged',
              'Parents counselled on: recurrence risk (1–3%), signs requiring return (fever recurrence, chest pain, syncope, palpitations)',
              'All KD patients: advise heart-healthy diet, regular exercise, tobacco avoidance, and intermittent lipid monitoring',
              'Risk 4–5 patients: lower thresholds for treating atherosclerotic risk factors than the general paediatric population — Cardiology to advise',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (data) => {
    const days = Number(data.feverDays);
    const signs = Number(data.signsCount);
    if (days > 10) return { level: 'critical', details: ['Fever beyond day 10 — higher coronary aneurysm risk. IVIG still indicated if active inflammation or abnormal coronary arteries.'] };
    if (signs >= 4 || (signs >= 2 && days >= 5)) return { level: 'severe', details: ['Meets diagnostic threshold for Kawasaki disease. Begin IVIG + aspirin within 24 hours.'] };
    return { level: 'moderate', details: ['Suspected incomplete KD. Check CRP/ESR and supplemental laboratory criteria before deciding on IVIG.'] };
  },
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [
    'Fever persisting or recurring ≥36 hours after first IVIG infusion (IVIG resistance)',
    'New chest pain, syncope, or ECG changes after treatment (possible coronary thrombosis)',
    'Haemodynamic instability, hypotension, or cardiogenic shock (KD shock syndrome)',
    'Sudden haemopericardium or tamponade (giant aneurysm rupture — rare, first month)',
    'Falling platelet count with coagulopathy and hyperferritinemia (macrophage activation syndrome)',
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: 'Nelson Ch. 208: Kawasaki Disease (21st ed.)', url: '#' },
    { title: 'AHA: Diagnosis, Treatment & Long-Term Management of KD (Circulation 2017)', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000484' },
  ],
};
