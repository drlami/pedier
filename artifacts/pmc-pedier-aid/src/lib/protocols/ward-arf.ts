import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Rheumatic Fever / Rheumatic Heart Disease
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Source: Nelson Textbook of Pediatrics, 21st Edition
 *   - Ch 229.1: Rheumatic Fever (pp. 1711–1714) — Shulman & Patel
 *   - Ch 487: Rheumatic Heart Disease (pp. 2872–2875) — Carr & Shulman
 * Jones Criteria: AHA 2015 Revision (Gewitz MH et al. Circulation. 2015)
 */
export const wardArfProtocol: DiseaseProtocol = {
  id: 'ward-arf-master',
  name: 'Acute Rheumatic Fever / RHD Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Acute Rheumatic Fever (ARF) is a multisystem inflammatory disease triggered by Group A Streptococcal pharyngitis via molecular mimicry. Diagnosed by 2015 AHA Jones Criteria. The cardinal danger is rheumatic carditis leading to permanent valvular disease (RHD). Management: eradicate GAS, anti-inflammatory therapy for arthritis/carditis, treat chorea, and institute lifelong secondary prophylaxis.',
  image: {
    url: "https://images.unsplash.com/photo-1576089238240-dfafa94348f9?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Inflammatory multisystem cardiac management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'carditis', questionText: 'Carditis (murmur of valvulitis or echo evidence)', type: 'boolean' },
    { id: 'hf', questionText: 'Cardiomegaly or Heart Failure signs', type: 'boolean' },
    { id: 'joints', questionText: 'Polyarthritis (major criterion)', type: 'boolean' },
    { id: 'chorea', questionText: 'Sydenham Chorea present', type: 'boolean' },
    { id: 'fever', questionText: 'Fever ≥ 38.5°C', type: 'boolean' },
    { id: 'esr', questionText: 'ESR (mm/hr)', type: 'number' },
  ],

  mmpData: {
    snapshot: "ARF peaks at age 5–15 yr. Core principle: do NOT start anti-inflammatory drugs (aspirin/steroids) until the diagnosis of ARF is confirmed — premature treatment masks the migratory polyarthritis and obscures the diagnosis. Use paracetamol while observing. Once diagnosis is secure: (1) eradicate GAS with Benzathine Pen G IM, (2) treat carditis severity-dependently, (3) manage chorea if present, (4) initiate lifelong secondary prophylaxis on discharge. Echo is mandatory in all suspected ARF — subclinical carditis fulfills the major criterion of carditis.",

    stages: [
      {
        label: "Stage 1: Diagnosis — Jones Criteria 2015",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Population Risk — Read This First [DR]",
            threshold: "CRITERIA ARE RELAXED IN HIGH-RISK POPULATIONS",
            orders: [
              "LOW-RISK: ARF incidence < 2/100,000 school-age children/yr OR RHD prevalence < 1/1,000. Applies to USA, Canada, Western Europe.",
              "HIGH-RISK: ARF incidence > 2/100,000 OR RHD prevalence > 1/1,000. Applies to most developing countries, Pacific Islanders, Aboriginal Australians, Maoris.",
              "Why it matters: In high-risk populations, the arthritis major criterion and three of the four minor criteria have different (lower) thresholds to improve diagnostic sensitivity."
            ]
          },
          {
            title: "Major Criteria (5) [DR]",
            threshold: "ANY 1 OF THESE = 1 MAJOR CRITERION",
            orders: [
              "① CARDITIS — Clinical: new murmur of valvulitis (mitral or aortic). Subclinical: echo Doppler evidence of valvulitis with no murmur. Both count equally in all populations.",
              "② ARTHRITIS — Low-risk: polyarthritis only (≥ 2 large joints hot, red, swollen, migratory). High-risk: polyarthritis OR monoarthritis OR polyarthralgia all qualify as major.",
              "③ SYDENHAM CHOREA — All populations. Purposeless involuntary movements, emotional lability, milkmaid grip. Latent period is longer than other features — may occur months after GAS infection as the only active finding.",
              "④ ERYTHEMA MARGINATUM — All populations. Rare (approx. 1%). Serpiginous non-pruritic pink rings on trunk and limbs, never on the face. Accentuated by warmth.",
              "⑤ SUBCUTANEOUS NODULES — All populations. Rare (≤ 1%). Firm, painless 0.5–1 cm nodules on extensor tendons near bony prominences. When present, strongly suggests severe carditis."
            ]
          },
          {
            title: "Minor Criteria (4) [DR]",
            threshold: "ARTHRALGIA CANNOT BE COUNTED IF ARTHRITIS ALREADY USED AS MAJOR",
            orders: [
              "① ARTHRALGIA — Low-risk: polyarthralgia (≥ 2 joints painful without objective swelling). High-risk: monoarthralgia (single joint painful) is sufficient.",
              "② FEVER — Low-risk: ≥ 38.5°C. High-risk: ≥ 38.0°C.",
              "③ ELEVATED INFLAMMATORY MARKERS — ESR: Low-risk ≥ 60 mm/hr | High-risk ≥ 30 mm/hr. AND/OR CRP ≥ 3.0 mg/dL (same threshold for both groups).",
              "④ PROLONGED PR INTERVAL on ECG (age-adjusted) — Same threshold for all populations. Important: a prolonged PR interval alone does NOT diagnose carditis and does NOT predict long-term cardiac sequelae."
            ]
          },
          {
            title: "Diagnostic Threshold — How to Confirm ARF [DR]",
            threshold: "GAS EVIDENCE IS MANDATORY IN EVERY SCENARIO",
            orders: [
              "INITIAL ATTACK (all populations): 2 Major  OR  1 Major + 2 Minor  —  plus GAS evidence.",
              "RECURRENT ATTACK (all populations): Same rules apply — 2 Major  OR  1 Major + 2 Minor  —  plus GAS evidence.",
              "RECURRENT ATTACK extra pathway (high-risk populations only): 3 Minor alone — plus GAS evidence is sufficient. This does NOT apply to initial attacks and does NOT apply to low-risk populations.",
              "EXCEPTION 1 — Isolated Chorea: Chorea as the only finding is sufficient to diagnose ARF once other causes (Huntington disease, Wilson disease, SLE, viral encephalitis, tic disorders) are excluded.",
              "EXCEPTION 2 — Indolent Carditis: Patient presents months after acute illness with isolated carditis only — ARF may be diagnosed without meeting the full criteria.",
              "EXCEPTION 3 — High-risk recurrence: In highly endemic settings, some recurrent ARF cases may not strictly fulfil criteria — clinical judgement applies."
            ]
          },
          {
            title: "GAS Evidence — Order All Three Tests [DR]",
            threshold: "ASOT ALONE MISSES 15–20% OF CASES",
            orders: [
              "Throat Swab for Culture + Rapid Streptococcal Antigen Test (RSAT): Only 10–20% of patients still harbour GAS in the throat at the time of ARF presentation — a negative swab does not exclude the diagnosis.",
              "ASOT (Anti-Streptolysin O Titre): Detects approximately 80–85% of cases when used alone.",
              "Anti-DNase B: Order alongside ASOT — together they detect 95–100% of cases.",
              "Anti-Hyaluronidase: Add as a third antibody if ASOT and Anti-DNase B are both negative but clinical suspicion remains high.",
              "Chorea caveat: Because of the long latent period, GAS antibody titres may have declined to within normal range by the time chorea presents — a normal titre does not exclude ARF in this context."
            ]
          },
          {
            title: "Echo — Subclinical Carditis (SCC) Criteria [DR]",
            threshold: "ALL 4 DOPPLER CRITERIA MUST BE MET PER VALVE",
            orders: [
              "Perform echo with Doppler in ALL cases of confirmed or suspected ARF — subclinical carditis fulfils the major carditis criterion even in the complete absence of a murmur.",
              "Pathologic MITRAL Regurgitation (all 4 required): Seen in ≥ 2 views. Jet length ≥ 2 cm in at least 1 view. Peak velocity > 3 m/sec. Pan-systolic jet in at least 1 envelope.",
              "Pathologic AORTIC Regurgitation (all 4 required): Seen in ≥ 2 views. Jet length ≥ 1 cm in at least 1 view. Peak velocity > 3 m/sec. Pan-diastolic jet in at least 1 envelope.",
              "Acute mitral valve morphology to look for: annular dilation, chordal elongation, anterior leaflet tip prolapse, beading or nodularity of leaflet tips.",
              "Serial echo: Repeat even if the initial study is negative — recommend follow-up echo if clinical suspicion persists or new murmur develops."
            ]
          }
        ]
      },
      {
        label: "Stage 2: GAS Eradication",
        shortLabel: "Eradication",
        color: "indigo",
        cards: [
          {
            title: "Eradicate GAS — Give Regardless of Throat Swab Result [DR]",
            threshold: "FIRST-LINE: BENZATHINE PENICILLIN G IM — SINGLE DOSE",
            orders: [
              "Benzathine Penicillin G IM (single dose): < 27 kg → 600,000 Units IM. ≥ 27 kg → 1,200,000 Units IM.",
              "Oral alternative if IM is refused: Amoxicillin OR Penicillin V for 10 days.",
              "Penicillin allergy: Erythromycin × 10 days  OR  Azithromycin × 5 days  OR  Clindamycin × 10 days.",
              "After completing the eradication course, do NOT stop antibiotics — transition immediately to the secondary prophylaxis schedule."
            ],
            prescriptions: [
              {
                drug: "Benzathine Penicillin G",
                dose: "Single Dose IM",
                route: "IM",
                frequency: "STAT",
                calculation: (w) => w < 27 ? "600,000 Units IM (weight < 27 kg)" : "1,200,000 Units IM (weight ≥ 27 kg)",
                notes: "Confirm IM route. This also serves as the first dose of the secondary prophylaxis schedule."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Anti-Inflammatory Therapy",
        shortLabel: "Anti-inflammatory",
        color: "amber",
        cards: [
          {
            title: "Hold Anti-inflammatory Drugs Until Diagnosis Is Confirmed [DR]",
            threshold: "PREMATURE ASPIRIN MASKS THE MIGRATORY ARTHRITIS",
            orders: [
              "Withhold aspirin, NSAIDs, and corticosteroids if the diagnosis of ARF has not yet been confirmed.",
              "Premature anti-inflammatory therapy aborts the migratory progression of polyarthritis and destroys diagnostic certainty.",
              "Use Paracetamol 15 mg/kg/dose every 4–6 hours PO for pain and fever control while observation continues.",
              "Diagnostic clue to watch for: a severely inflamed joint becoming completely normal within 1–3 days as a new joint becomes involved is the hallmark migratory pattern."
            ]
          },
          {
            title: "Arthritis Without Carditis — Aspirin [DR]",
            threshold: "START ONLY AFTER ARF IS CONFIRMED",
            orders: [
              "Phase 1 — Induction: Aspirin 50–70 mg/kg/day divided QID (4 doses) × 3–5 days.",
              "Phase 2 — Maintenance: Aspirin 50 mg/kg/day divided QID × 2–3 weeks.",
              "Phase 3 — Taper: Aspirin 25 mg/kg/day divided QID × 2–4 weeks.",
              "Salicylate monitoring: Not routinely required. Check only if arthritis does not respond or signs of toxicity appear (tinnitus, hyperventilation, GI bleeding).",
              "Alternative if aspirin not tolerated: Naproxen 10–20 mg/kg/day. Note: NSAIDs are not proven more effective than aspirin for ARF."
            ],
            prescriptions: [
              {
                drug: "Aspirin",
                dose: "50–70 mg/kg/day ÷ QID",
                route: "PO",
                frequency: "4 times daily",
                calculation: (w) => `Total: ${(w * 50).toFixed(0)}–${(w * 70).toFixed(0)} mg/day  |  Per dose: ${(w * 12.5).toFixed(0)}–${(w * 17.5).toFixed(0)} mg`,
                notes: "Give with food. Step down through phases 1→2→3 as inflammation resolves."
              }
            ]
          },
          {
            title: "Mild Carditis — No Cardiomegaly, No Heart Failure [DR]",
            threshold: "ASPIRIN AS PER ARTHRITIS REGIMEN",
            orders: [
              "Start Aspirin 50–70 mg/kg/day QID after ARF is confirmed — same regimen as for arthritis.",
              "Strict bed rest: mandatory during active carditis; restrict ambulation until inflammatory markers show a clear downward trend.",
              "Serial echocardiography: monitor for worsening valve regurgitation or new cardiomegaly.",
              "Escalate to corticosteroids if cardiomegaly or heart failure develops."
            ]
          },
          {
            title: "Moderate–Severe Carditis — Cardiomegaly or Heart Failure [DR]",
            threshold: "CORTICOSTEROIDS REQUIRED — NOT ASPIRIN ALONE",
            orders: [
              "Prednisolone Phase 1: 2 mg/kg/day (max 60 mg/day) divided QID × 2–3 weeks.",
              "Prednisolone Phase 2: 1 mg/kg/day divided QID × 2–3 weeks.",
              "Prednisolone Taper: Reduce by 5 mg per day every 2–3 days.",
              "Rebound prevention: When starting the prednisolone taper, add Aspirin 50 mg/kg/day QID × 6 weeks to prevent rebound inflammation after steroids are withdrawn.",
              "Supportive care for heart failure: Furosemide 1–2 mg/kg/dose IV or PO every 6–12 hours. Fluid and sodium restriction. Supplemental oxygen (target SpO₂ > 94%).",
              "Digoxin: may be used with caution — myocarditis enhances digoxin toxicity; use the lowest effective dose and monitor closely.",
              "Strict bed rest until carditis resolves both clinically and on echocardiography."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "2 mg/kg/day (max 60 mg) ÷ QID",
                route: "PO",
                frequency: "4 times daily",
                calculation: (w) => {
                  const total = Math.min(w * 2, 60);
                  return `Total: ${total.toFixed(0)} mg/day  |  Per dose: ${(total / 4).toFixed(1)} mg QID`;
                },
                notes: "Taper after 2–3 weeks. Add aspirin 50 mg/kg/day when tapering to prevent rebound."
              },
              {
                drug: "Furosemide",
                dose: "1–2 mg/kg/dose",
                route: "IV/PO",
                frequency: "Every 6–12 hours",
                calculation: (w) => `${(w * 1).toFixed(0)}–${(w * 2).toFixed(0)} mg per dose`,
                notes: "Monitor electrolytes closely. Use alongside fluid and salt restriction."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Sydenham Chorea",
        shortLabel: "Chorea",
        color: "emerald",
        cards: [
          {
            title: "Recognising Sydenham Chorea [DR]",
            threshold: "LATENT PERIOD IS MONTHS — MAY BE THE ONLY ACTIVE FINDING",
            orders: [
              "Chorea has a substantially longer latent period than arthritis or carditis — it can appear months after the GAS infection, often when all other features have resolved.",
              "Bedside tests: Milkmaid grip (irregular contractions when patient squeezes examiner's fingers). Spooning and pronation of hands with arms extended. Wormian darting tongue movements on protrusion. Ask to write — deteriorating handwriting reflects fine motor involvement.",
              "Anti-inflammatory drugs are usually NOT indicated — chorea is typically an isolated manifestation occurring after the acute inflammatory phase has ended.",
              "GAS antibody titres may be normal by the time chorea presents — this does not exclude ARF. Diagnosis is based on clinical findings plus any available GAS evidence.",
              "Prognosis: Chorea resolves completely without any permanent neurological sequelae."
            ]
          },
          {
            title: "Chorea Treatment — Step-Up Approach [DR]",
            threshold: "PHENOBARBITAL FIRST → HALOPERIDOL → CHLORPROMAZINE",
            orders: [
              "First-line: Phenobarbital 16–32 mg PO every 6–8 hours. Titrate within this range for symptom control.",
              "Second-line (if phenobarbital ineffective): Haloperidol 0.01–0.03 mg/kg/day in 2 divided doses PO. Monitor for extrapyramidal side effects.",
              "Third-line: Chlorpromazine 0.5 mg/kg PO every 4–6 hours.",
              "Corticosteroids: A short course may benefit some patients with severe or refractory chorea."
            ],
            prescriptions: [
              {
                drug: "Phenobarbital",
                dose: "16–32 mg per dose",
                route: "PO",
                frequency: "Every 6–8 hours",
                calculation: (_w) => "16–32 mg per dose (fixed dose range — not weight-based)",
                notes: "First-line for Sydenham chorea. Titrate within range."
              },
              {
                drug: "Haloperidol",
                dose: "0.01–0.03 mg/kg/day ÷ BD",
                route: "PO",
                frequency: "Twice daily",
                calculation: (w) => `Total: ${(w * 0.01).toFixed(2)}–${(w * 0.03).toFixed(2)} mg/day  |  Per dose: ${(w * 0.005).toFixed(2)}–${(w * 0.015).toFixed(2)} mg BD`,
                notes: "Second-line only. Monitor for extrapyramidal effects."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 5: Secondary Prophylaxis",
        shortLabel: "Prophylaxis",
        color: "red",
        cards: [
          {
            title: "Secondary Prophylaxis — Do Not Discharge Without This [DR]",
            threshold: "BENZATHINE PENICILLIN G IM EVERY 3–4 WEEKS IS PREFERRED",
            orders: [
              "Benzathine Penicillin G IM every 3–4 weeks: < 27 kg → 600,000 Units. ≥ 27 kg → 1,200,000 Units. IM route is preferred over oral — ensures compliance.",
              "Oral alternative (only if IM is not feasible): Penicillin V 250 mg BD PO  OR  Amoxicillin 250 mg BD PO.",
              "Penicillin allergy: Erythromycin 250 mg BD PO.",
              "SBE prophylaxis note: Routine infective endocarditis prophylaxis for dental procedures is NOT recommended for RHD patients (AHA 2007). Exception: patients with a prosthetic valve or valve repair with prosthetic material should receive endocarditis prophylaxis using a non-penicillin agent, as oral streptococci may have become penicillin-resistant from ongoing prophylaxis.",
              "Schedule the next IM injection date before discharge. Enrol in an ARF/RHD register where available."
            ],
            prescriptions: [
              {
                drug: "Benzathine Penicillin G (Prophylaxis)",
                dose: "Every 3–4 weeks IM",
                route: "IM",
                frequency: "Every 3–4 weeks",
                calculation: (w) => w < 27 ? "600,000 Units IM every 3–4 weeks" : "1,200,000 Units IM every 3–4 weeks",
                notes: "Book next injection date before patient leaves. Lifelong in high-risk or residual RHD."
              }
            ]
          },
          {
            title: "Prophylaxis Duration — AHA Guidelines [DR]",
            threshold: "DURATION DEPENDS ON WHETHER CARDITIS WAS PRESENT AND WHETHER VALVE DAMAGE REMAINS",
            orders: [
              "ARF with carditis AND residual valve disease: Until age 40  OR  10 years after the last ARF episode — whichever is longer. Lifelong prophylaxis may ultimately be required.",
              "ARF with carditis but NO residual valve disease: Until age 21  OR  10 years after the last ARF episode — whichever is longer.",
              "ARF without carditis: Until age 21  OR  5 years after the last ARF episode — whichever is longer.",
              "Key principle: Patients who had carditis in the initial attack are at HIGH risk for carditis in every recurrence — permanent valve damage accumulates with each episode. Prophylaxis compliance is not optional.",
              "Key principle: Even patients without carditis in the initial attack face a stepwise increase in cardiac risk with each subsequent episode."
            ]
          },
          {
            title: "Chronic RHD — Ongoing Valve Management [DR]",
            threshold: "ARRANGE CARDIOLOGY FOLLOW-UP BEFORE DISCHARGE",
            orders: [
              "Mitral insufficiency: ACE inhibitors or ARBs for afterload reduction. Serial echo monitoring. Surgical repair or replacement if heart failure, progressive cardiomegaly, or pulmonary hypertension persists despite maximum medical therapy.",
              "Mitral stenosis: Takes ≥ 10 years to develop. Diuretics and beta-blockers for symptom control. Balloon mitral valvuloplasty for symptomatic, pliable, non-calcified valves in patients without significant AF or left atrial thrombus.",
              "Aortic insufficiency: ACE inhibitors or ARBs. Surgical valve repair or replacement indicated BEFORE the onset of heart failure — intervene when LV is dilating, EF is falling, or ST-T changes appear on ECG.",
              "Atrial fibrillation: A major late complication of rheumatic mitral disease — requires formal anticoagulation management.",
              "Echo follow-up: At minimum annually if stable. More frequently with progressive valve disease or new symptoms."
            ]
          },
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF new holosystolic murmur at the apex radiating to the axilla (mitral regurgitation) OR high-pitched decrescendo diastolic murmur at the left sternal border (aortic insufficiency) develops.",
              "IF signs of heart failure appear: hepatomegaly, respiratory distress, orthopnea, gallop rhythm (S3), or worsening tachycardia — Cardiology review STAT.",
              "IF Sydenham chorea develops: involuntary movements, emotional lability, deteriorating handwriting — confirm ARF, start phenobarbital.",
              "IF echo shows new or worsening valve regurgitation, pericardial effusion, or declining LV systolic function.",
              "IF ESR or CRP rises after stopping anti-inflammatory therapy (rebound) — do not abruptly stop; add aspirin overlap as per the prednisolone taper protocol."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const esr = Number(data.esr) || 0;
    if (data.hf) return {
      level: 'critical',
      details: [
        "Severe rheumatic carditis with cardiomegaly / heart failure.",
        "Requires corticosteroids (Prednisolone 2 mg/kg/day), IV diuretics, strict bed rest.",
        "Cardiology consultation and urgent echocardiogram mandatory.",
        "Digoxin risk: Myocarditis enhances digoxin toxicity — use with caution."
      ]
    };
    if (data.carditis) return {
      level: 'severe',
      details: [
        "Rheumatic carditis confirmed (clinical or echocardiographic).",
        "Start Aspirin after ARF confirmed. Escalate to Prednisolone if cardiomegaly/CHF develops.",
        "Serial echo required. Strict bed rest until markers normalise."
      ]
    };
    if (data.joints && esr >= 60) return {
      level: 'moderate',
      details: [
        "Definite ARF: Migratory polyarthritis + elevated ESR.",
        "HOLD aspirin until migratory pattern confirmed — use paracetamol meanwhile.",
        "Start aspirin 50–70 mg/kg/day QID once ARF confirmed. Eradicate GAS."
      ]
    };
    if (data.chorea) return {
      level: 'moderate',
      details: [
        "Sydenham Chorea: Sufficient alone for ARF diagnosis if other causes excluded.",
        "Start phenobarbital. Anti-inflammatory agents usually not needed.",
        "Antibody titers may be normal — do not exclude ARF on this basis."
      ]
    };
    return {
      level: 'mild',
      details: [
        "Suspected ARF: Obtain full GAS antibody panel (ASOT + Anti-DNase B).",
        "Observe for migratory arthritis — withhold anti-inflammatory therapy.",
        "Echo to exclude subclinical carditis."
      ]
    };
  },

  getManagement: () => [],

  getDisposition: (severity) => {
    if (severity.level === 'critical') return [
      "Normalisation of inflammatory markers (ESR, CRP) with clear downward trend.",
      "Echocardiogram showing no progressive valve disease or cardiomegaly.",
      "Tolerating oral prednisolone taper without rebound (ESR/CRP stable).",
      "First dose of Benzathine Penicillin G prophylaxis administered IM.",
      "Cardiology outpatient follow-up within 2 weeks with repeat echo scheduled.",
      "Dental review arranged — essential for long-term prevention of infective endocarditis."
    ];
    return [
      "Inflammatory markers (ESR/CRP) showing significant downward trend.",
      "No evidence of new or worsening carditis on echocardiogram.",
      "Secondary prophylaxis plan established — next IM date scheduled.",
      "Patient and family educated on importance of lifelong prophylaxis.",
      "Throat swab negative and GAS eradication confirmed.",
      "Dental review arranged."
    ];
  },

  getRedFlags: () => [
    "New cardiac murmur (holosystolic at apex or decrescendo diastolic at LSB)",
    "Hepatomegaly or peripheral oedema (signs of congestive heart failure)",
    "Shortness of breath, orthopnea or worsening tachycardia",
    "Gallop rhythm (S3) on auscultation",
    "Uncontrolled involuntary movements or emotional lability (Sydenham chorea)",
    "Chest pain or palpitations",
    "Sudden deterioration in handwriting or fine motor skills",
    "ESR/CRP rising after stopping anti-inflammatory therapy (rebound)"
  ],

  getDrugDoses: () => [],

  getReferences: () => [
    { title: "Nelson Textbook of Pediatrics 21e — Ch 229.1: Rheumatic Fever (Shulman & Patel)", url: "https://www.clinicalkey.com" },
    { title: "Nelson Textbook of Pediatrics 21e — Ch 487: Rheumatic Heart Disease (Carr & Shulman)", url: "https://www.clinicalkey.com" },
    { title: "AHA 2015 Jones Criteria Revision (Gewitz MH et al. Circulation. 2015;131:1806–1818)", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000205" },
    { title: "AHA 2020 RHD Statement (Kumar RK et al. Circulation. 2020;142:e337–e357)", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000921" },
    { title: "RHD Australia: National ARF/RHD Management Guidelines", url: "https://www.rhdaustralia.org.au/rhda-guidelines" }
  ],
};
