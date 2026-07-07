import type { DiseaseProtocol, ErData, ErInvestigation, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'petechiae',       question: 'Non-blanching rash confirmed? (press a glass firmly against lesion — if spots remain visible through the glass, it is non-blanching)', redFlag: true,  ifYes: 'MENINGOCOCCAEMIA until proven otherwise. IV Ceftriaxone 100 mg/kg NOW — do not wait for LP, blood culture, or any result.' },
    { id: 'toxic_appear',    question: 'Toxic/ill appearance, haemodynamic instability, or septic shock? (altered consciousness, mottled/cold skin, capillary refill > 3 sec, hypotension)', redFlag: true,  ifYes: 'Full sepsis workup and empiric antibiotics immediately. Life-threatening bacterial infection regardless of rash type.' },
    { id: 'skin_sloughing',  question: 'Skin sloughing in sheets, widespread blistering, or Nikolsky sign positive (epidermis detaches with gentle lateral pressure)?', redFlag: true,  ifYes: 'SJS/TEN or SSSS. Stop all non-essential medications immediately. Urgent dermatology consult; consider burns unit transfer.' },
    { id: 'pain_proportion', question: 'Pain out of proportion to skin findings? Woody induration or crepitus on palpation of the affected area?', redFlag: true,  ifYes: 'NECROTISING FASCIITIS until excluded. Immediate surgical consult. CT soft tissue if stable — do not delay surgery for imaging if suspicion is high.' },
    { id: 'tick_exposure',   question: 'Tick bite or exposure to tick-endemic area in the past 3 weeks?', redFlag: true,  ifYes: 'ROCKY MOUNTAIN SPOTTED FEVER or other rickettsial disease. Start Doxycycline empirically now — serology is frequently negative in week 1; treatment delay is the leading preventable cause of death.' },
    { id: 'fever_5d',        question: 'Fever for ≥ 5 cumulative days total?', redFlag: false, ifYes: 'Kawasaki disease must be excluded in children < 5 years. Document all 5 criteria: bilateral conjunctival injection, lip/oral changes, rash, hand/foot changes, cervical lymphadenopathy. Also consider DRESS or prolonged infection.' },
    { id: 'mucosal_hx',      question: 'Mucosal involvement: lip cracking/fissuring, strawberry tongue, conjunctival injection, oral ulcers, or genital ulceration?', redFlag: false, ifYes: 'Widens differential to Kawasaki (lip/conjunctiva), SJS/TEN (ulcers), hand-foot-mouth, secondary syphilis (mucous patches), or disseminated HSV.' },
    { id: 'medications',     question: 'New medication started in the past 4 weeks? (especially antibiotics, anticonvulsants, allopurinol, NSAIDs, sulfonamides)', redFlag: false, ifYes: 'Drug-induced rash or DRESS/DIHS must be excluded. DRESS onset is typically 2–8 weeks after starting the culprit drug. Stop the most likely agent and arrange dermatology review.' },
    { id: 'immunocompromised', question: 'Immunocompromised host? (oncology, HIV, primary immunodeficiency, prolonged systemic steroids, post-transplant)', redFlag: false, ifYes: 'Differential expands to atypical and opportunistic organisms. Do not discharge without senior and infectious disease review.' },
    { id: 'travel',          question: 'Travel to tropics, tick-endemic regions, or endemic fungal zones in the past 6 weeks?', redFlag: false, ifYes: 'Consider dengue, chikungunya, malaria, typhoid (rose spots), rickettsiae, or endemic mycoses based on destination. Send destination-guided serology.' },
    { id: 'sexual_hx',       question: 'Sexually active adolescent? New or multiple sexual partners?', redFlag: false, ifYes: 'Secondary syphilis (palmar/plantar maculopapular rash), disseminated gonococcal infection (vesiculopustular distal rash), or acute HIV seroconversion must be excluded. Order RPR/VDRL and GC/Chlamydia PCR.' },
    { id: 'ill_contact',     question: 'Known contact with a person with a similar rash or febrile exanthem?', redFlag: false, ifYes: 'Viral exanthem (varicella, measles, rubella, parvovirus B19, enterovirus) or bacterial cluster (meningococcal, scarlet fever) is more likely. Public health notification required for measles and confirmed meningococcal disease.' },
    { id: 'vaccination',     question: 'Vaccination history incomplete or unknown? (especially MMR, varicella, meningococcal)', redFlag: false, ifYes: 'Unvaccinated status raises risk of measles, rubella, varicella, and meningococcal disease substantially. Document immunisation record.' },
  ],

  investigations: [
    { test: 'Vital signs + continuous SpO₂, HR, BP monitoring', category: 'urgent', indication: 'Haemodynamic instability is the primary red flag — tachycardia, hypotension, or falling SpO₂ mandate immediate escalation regardless of rash appearance.' },
    { test: 'Blood culture × 1–2 (BEFORE antibiotics)', category: 'blood', indication: 'Mandatory for: any non-blanching rash, toxic appearance, suspected endocarditis, RMSF, or necrotising fasciitis. Draw before first antibiotic — never delay antibiotics > 15 min waiting for cultures.', criticalValue: 'Do NOT delay first antibiotic dose > 15 min for culture collection' },
    { test: 'CBC with differential + platelet count', category: 'blood', indication: 'Thrombocytopaenia → DIC or ITP (purpura). Neutrophilia → bacterial infection. Atypical lymphocytes → EBV mononucleosis. Leukopenia → viral, RMSF, or overwhelming sepsis. Eosinophilia → DRESS or parasitic infection.', criticalValue: 'Platelets < 20,000/mm³ → urgent haematology; < 10,000 + purpura → intracranial haemorrhage risk' },
    { test: 'CRP + ESR', category: 'blood', indication: 'CRP ≥ 80 mg/L with petechial rash is strongly associated with serious bacterial infection. ESR > 40 mm/h contributes to Kawasaki risk stratification. Both elevated + leukopenia → consider rickettsial disease.' },
    { test: 'Coagulation screen — PT, APTT, fibrinogen, D-dimer', category: 'blood', indication: 'MANDATORY with any purpura or petechiae. DIC must be excluded in meningococcaemia, RMSF, and necrotising fasciitis. Prolonged PT/APTT + low fibrinogen = DIC emergency.', criticalValue: 'DIC criteria met → FFP 15 mL/kg + Cryoprecipitate + immediate PICU notification' },
    { test: 'Venous blood gas + lactate', category: 'blood', indication: 'For any toxic appearance, purpura fulminans, shock, or suspected NF. Lactate ≥ 2 mmol/L = early organ dysfunction; ≥ 4 mmol/L = septic shock.', criticalValue: 'Lactate ≥ 4 mmol/L → septic shock protocol + PICU' },
    { test: 'Urinalysis — dipstick + microscopy', category: 'blood', indication: 'HSP/IgA vasculitis: microscopic haematuria and proteinuria signal renal involvement. Infective endocarditis: microscopic haematuria common. Obtain in any child with purpura or petechiae.' },
    { test: 'LFTs + albumin', category: 'blood', indication: 'Kawasaki: low albumin is a risk factor for coronary artery aneurysm. EBV mononucleosis: elevated transaminases. DRESS: hepatic involvement is a defining feature (AST/ALT often > 3× ULN). Leptospirosis: elevated bilirubin + transaminases.' },
    { test: 'Vesicle unroofing — swab base for HSV/VZV PCR', category: 'blood', indication: 'Vesicular rash — unroof the vesicle and swab the base (not the roof fluid). PCR preferred over DFA for HSV and VZV. Critical in any infant < 3 months with vesicular or pustular lesions.', criticalValue: 'Neonatal vesicular rash — manage as disseminated HSV until PCR returns' },
    { test: 'Wound/lesion aspirate — Gram stain + culture (bullae, pustules, ulcers)', category: 'blood', indication: 'Bullous lesions or pustules — aspirate for Gram stain and aerobic culture. Group A Streptococcus in a wound + systemic signs → risk of necrotising fasciitis or streptococcal TSS.' },
    { test: 'Peripheral blood smear', category: 'blood', indication: 'If suspecting ehrlichiosis/anaplasmosis (morulae in granulocytes on smear), malaria in a traveller, or disseminated histoplasmosis. Request haematologist review.' },
    { test: 'Selective serology — order based on clinical context, not routinely', category: 'blood', indication: 'RMSF: IFA Rickettsia rickettsii IgG (often negative in week 1 — treat empirically without waiting). EBV: Monospot + EBV IgM. Parvovirus B19: IgM. Syphilis: RPR/VDRL → confirm positive with TPHA/TPPA. Lyme: ELISA → Western blot. HIV: 4th-generation Ag/Ab in sexually active adolescents.' },
    { test: 'Skin biopsy (nodular, undiagnosed petechial-purpuric, or ulcerative rash)', category: 'blood', indication: 'Send to microbiology (culture) AND pathology (histology). RMSF: direct immunofluorescence of skin biopsy is diagnostic. Vasculitis, SJS, and cutaneous lymphoma also diagnosed histologically.' },
    { test: 'ECG + urgent Echocardiogram', category: 'radiology', indication: 'Kawasaki: ECG baseline + echo for coronary artery diameter within 24 h of diagnosis. Infective endocarditis: echo confirms vegetations, valve dysfunction, and perivalvar abscess. Not indicated for viral exanthems.' },
    { test: 'CT soft tissue ± IV contrast (necrotising fasciitis suspected)', category: 'radiology', indication: 'Look for gas in fascial planes, fascial thickening, or fluid tracking along fascia. CT sensitivity ~80% — a normal scan does NOT exclude NF. Proceed directly to surgical exploration when clinical suspicion is high regardless of CT result.', criticalValue: 'Gas in fascial planes → emergency surgical debridement; do not delay' },
  ],

  admissionCriteria: [
    'ANY non-blanching rash (petechiae or purpura) — admit for urgent workup and empiric antibiotics; well appearance alone is NOT sufficient for discharge',
    'Toxic/ill appearance or haemodynamic instability with any rash',
    'Suspected necrotising fasciitis — immediate surgical admission; no diagnostic delay',
    'Skin sloughing or Nikolsky sign (SJS/TEN or SSSS) — admit all; burns or dermatology unit',
    'Fever ≥ 5 days — Kawasaki evaluation requires admission for echocardiogram and cardiology review',
    'Suspected RMSF (tick exposure + fever + rash) — admit for IV or oral Doxycycline and monitoring',
    'Vesicular rash in an infant < 3 months — risk of disseminated neonatal HSV',
    'DRESS/DIHS — multi-organ involvement; admit all cases',
    'Immunocompromised child with any fever and rash — admit; no outpatient discharge without senior approval',
    'HSP with abdominal pain, joint pain, or haematuria on urinalysis — inpatient observation required',
    'No reliable caregiver or no guaranteed 24 h follow-up for any moderate-risk presentation',
  ],

  highRiskFactors: [
    'Petechiae confined ONLY to face and neck with clear mechanical trigger (vigorous coughing, vomiting, Valsalva) — lower-risk but still requires platelet count and CRP before discharge; ANY petechiae below the nipple line → admit',
    'Palpable purpura in classic HSP distribution (lower limbs/buttocks) with no abdominal pain, joint pain, or haematuria — outpatient acceptable with strict 24 h UA and BP follow-up',
    'Vesicular rash consistent with varicella in well-appearing child > 3 months — outpatient with clear isolation instructions and return precautions',
    'Scarlatiniform rash + pharyngitis — GAS test; if positive, Amoxicillin 10 days; no admission if tolerating oral and well-appearing',
    'Blanching maculopapular rash in well-appearing fully immunised child — viral exanthem most likely; observe 1–2 h, discharge if stable with safety netting',
    'Target lesions (erythema multiforme) WITHOUT mucosal involvement — typically post-HSV or post-Mycoplasma; oral acyclovir or azithromycin if causative agent confirmed; outpatient acceptable',
  ],

  dischargeCriteria: [
    'Rash is PURELY BLANCHING — glass-press test confirms no petechiae or purpura at any body site',
    'Well-appearing throughout the entire ER stay — no deterioration in HR, BP, RR, SpO₂, or mental status',
    'Platelets ≥ 100,000/mm³ and CRP < 40 mg/L if checked (required for any petechial or purpuric rash)',
    'No skin sloughing, blistering sheets, or Nikolsky sign',
    'No mucosal ulceration or severe ocular involvement',
    'Pain fully explained by the rash — no pain out of proportion to examination findings',
    'Blood culture drawn if indicated — caregiver informed of return-if-positive protocol with contact number',
    'Tolerating oral fluids; not dehydrated',
    'Written return-precaution instructions given (glass test explained, petechiae recognition, lethargy, skin peeling)',
    'Confirmed follow-up within 24 h; senior clinician review before discharge for any infant < 3 months',
  ],

  safetyNetting: [
    'GLASS TEST — press a clear glass firmly against the rash. If spots FADE completely under pressure: blanching rash (lower risk). If spots STAY visible through the glass: return to ER IMMEDIATELY — these are petechiae and may indicate a serious blood infection.',
    'Return to ER IMMEDIATELY if: spots that do not fade under glass appear anywhere; child becomes very difficult to wake; skin starts peeling in sheets or blistering widely; a limb becomes extremely painful, numb, or discoloured; breathing difficulty or very reduced urine output develops.',
    'Chickenpox (varicella): keep child away from newborns, pregnant women, and immunocompromised individuals until ALL spots are fully crusted. Use Paracetamol only — do NOT give Ibuprofen (increases risk of invasive group A streptococcal skin infection).',
    'Scarlet fever: complete the full 10-day antibiotic course even when the rash fades and the child looks well. Stopping early risks rheumatic fever (heart valve damage) or kidney disease.',
    'Kawasaki disease: if your child has had fever for 5 or more days total — return for reassessment regardless of how well they look. Untreated Kawasaki causes permanent heart artery damage.',
    'Drug rash: if a new medication was started in the last 4 weeks, do not stop it without medical advice — but return immediately if the rash worsens, blistering begins, or the mouth/eyes become involved.',
    'Paracetamol 15 mg/kg every 4–6 hours as needed for fever or discomfort. Do NOT give Ibuprofen if chickenpox is suspected. Maximum 5 doses per 24 hours.',
    'Return for review within 24 hours even if improving — some rash illnesses change rapidly and need reassessment.',
  ],
};

function deriveAgeGroup(data: FormData): string {
  const m = Number(data.ageMonths) || 0;
  if (m < 1)   return 'neonate';
  if (m < 3)   return 'infant';
  if (m <= 60) return 'child';
  return 'older';
}

export const feverRashProtocol: DiseaseProtocol = {
  id: 'fever-rash',
  name: 'Fever with Rash',
  system: 'Infectious Diseases',
  description: 'Age-stratified ER pathway for fever with rash, built on the UpToDate/Sanders approach to acute fever and rash (Weber et al., Principles and Practices of Infectious Diseases, 8th ed.). A systematic approach is essential: rash morphology, distribution, and epidemiologic context together determine whether the presentation is a viral exanthem, a dermatological urgency, or a life-threatening emergency requiring immediate parenteral therapy.\n\nEmergencies that must be recognised promptly: meningococcaemia (petechiae/purpura + fever), necrotising fasciitis (pain out of proportion + skin changes), toxic shock syndrome (diffuse erythroderma + hypotension + multi-organ involvement), Rocky Mountain spotted fever (tick exposure + fever + distal rash → centripetal spread), and SJS/TEN or SSSS (skin sloughing/Nikolsky sign).\n\nEpidemiologic clues — age, season, travel, geography, tick/insect exposure, animal contact, medications, sexual history, immune status, and vaccination — are as important as the rash morphology itself.',
  lastUpdated: '2026',
  image: {
    url: 'https://picsum.photos/seed/fever-rash/600/400',
    hint: 'child with rash',
  },
  erData,

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'rashType', questionText: 'Primary character of the rash', type: 'select', options: [
      { label: 'Maculopapular — blanching (flat or raised spots that fade under glass)', value: 'maculopapular', score: 0 },
      { label: 'Petechial / Purpuric — non-blanching (spots persist under glass)', value: 'petechial',    score: 6 },
      { label: 'Vesicular — blisters or vesicles',                                  value: 'vesicular',   score: 2 },
      { label: 'Diffuse erythema — sunburn-like or scarlatiniform',                 value: 'erythroderma', score: 1 },
      { label: 'Target / annular lesions — "bull\'s eye" pattern',                 value: 'target',      score: 1 },
      { label: 'Urticarial — hives or wheals',                                      value: 'urticarial',  score: 0 },
    ], info: 'Morphology is the most important single feature. When in doubt, do the glass-press test: non-blanching = petechiae = emergency.' },
    { id: 'appearance', questionText: 'Patient appearance', type: 'select', options: [
      { label: 'Well-appearing — alert, active, normal colour, good tone', value: 'well', score: 0 },
      { label: 'Ill-appearing — toxic, lethargic, poor perfusion, inconsolable', value: 'ill', score: 6 },
    ], info: 'A toxic-appearing child with ANY rash is a medical emergency. When in doubt, treat as ill-appearing.' },
    { id: 'rashDistribution', questionText: 'Distribution and spread of the rash', type: 'select', options: [
      { label: 'Generalised / random',                                         value: 'generalized',       score: 0 },
      { label: 'Distal first (wrists/ankles) → spreads centrally + to palms/soles', value: 'distal-to-central', score: 2 },
      { label: 'Centrifugal: starts face/head → spreads to trunk/limbs',       value: 'centrifugal',      score: 0 },
      { label: 'Lower extremities and buttocks (gravity-dependent)',            value: 'lower-extremities', score: 1 },
      { label: 'Trunk predominant',                                            value: 'trunk',             score: 0 },
      { label: 'Dermatomal / unilateral',                                      value: 'dermatomal',        score: 0 },
    ], info: 'RMSF classically starts on the wrists and ankles then spreads centrally and to the palms/soles. HSP favours gravity-dependent areas.' },
    { id: 'feverDays', questionText: 'Duration of fever (days)', type: 'number', unit: 'days', info: 'Fever ≥ 5 days triggers Kawasaki disease evaluation.' },
    { id: 'palpablePurpura', questionText: 'Is the purpura/rash palpable (can be felt as raised bumps)?', type: 'boolean', info: 'Palpable purpura = vasculitis (HSP/IgA vasculitis, or rarely other vasculitic processes). Flat petechiae = more concern for thrombocytopaenia or DIC.' },
    { id: 'mucosalSign', questionText: 'Mucosal changes on examination? (lip fissuring, strawberry tongue, conjunctival injection, oral ulcers)', type: 'boolean', info: 'Bilateral non-purulent conjunctival injection + lip changes in a febrile child = hallmark of Kawasaki disease.' },
    { id: 'skinSloughingSign', questionText: 'Skin sloughing, widespread blistering, or Nikolsky sign on examination?', type: 'boolean', info: 'Nikolsky sign: apply gentle lateral pressure to normal-appearing skin adjacent to a lesion — if the epidermis separates, the sign is positive.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const rashType   = data.rashType as string;
    const appearance = data.appearance as string;
    const ageM       = Number(data.ageMonths) || 0;
    const feverDays  = Number(data.feverDays) || 0;
    const rashDist   = data.rashDistribution as string;

    const petechiae        = data.petechiae === true;
    const toxicAppear      = data.toxic_appear === true;
    const skinSloughingHx  = data.skin_sloughing === true;
    const painProportion   = data.pain_proportion === true;
    const tickExposure     = data.tick_exposure === true;
    const fever5d          = data.fever_5d === true;
    const mucosalHx        = data.mucosal_hx === true;
    const medications      = data.medications === true;
    const immunocomp       = data.immunocompromised === true;
    const travel           = data.travel === true;
    const sexualHx         = data.sexual_hx === true;
    const illContact       = data.ill_contact === true;
    const vaccination      = data.vaccination === true;

    const isPetechial      = rashType === 'petechial';
    const isVesicular      = rashType === 'vesicular';
    const isErythroderma   = rashType === 'erythroderma';
    const isTarget         = rashType === 'target';
    const isToxic          = appearance === 'ill';
    const palpablePurpura  = data.palpablePurpura === true;
    const mucosalSign      = data.mucosalSign === true;
    const skinSloughingSign = data.skinSloughingSign === true;

    const details: string[] = [];

    // ── Absolute SEVERE — immediate life threats ──────────────────────────
    if (petechiae || isPetechial) {
      details.unshift('NON-BLANCHING RASH (Petechiae/Purpura) — MENINGOCOCCAEMIA until proven otherwise. IV Ceftriaxone 100 mg/kg NOW. Do NOT wait for LP or any investigation result.');
      if (isToxic || toxicAppear) details.push('Toxic appearance + petechiae — extremely high probability of meningococcaemia or DIC. PICU involvement immediately.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Fever + Rash Risk', totalScore: 10, maxScore: 10, interpretation: 'Non-blanching rash — Critical Emergency' },
        details,
      };
    }
    if (skinSloughingHx || skinSloughingSign) {
      details.unshift('SKIN SLOUGHING / NIKOLSKY SIGN — SJS/TEN or SSSS. Stop all non-essential medications immediately. Urgent dermatology consult; consider burns unit transfer.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Fever + Rash Risk', totalScore: 10, maxScore: 10, interpretation: 'Skin sloughing — Critical Emergency' },
        details,
      };
    }
    if (painProportion) {
      details.unshift('PAIN OUT OF PROPORTION / WOODY INDURATION / CREPITUS — NECROTISING FASCIITIS until excluded. Immediate surgical consult. CT soft tissue if stable — do not delay surgery on a normal CT if clinical suspicion is high.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Fever + Rash Risk', totalScore: 10, maxScore: 10, interpretation: 'Necrotising fasciitis concern — Surgical Emergency' },
        details,
      };
    }
    if (toxicAppear || isToxic) {
      details.unshift('ILL/TOXIC APPEARANCE — treat as serious bacterial infection until proven otherwise. Full sepsis workup + empiric broad-spectrum antibiotics immediately.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Fever + Rash Risk', totalScore: 9, maxScore: 10, interpretation: 'Toxic appearance — High Risk' },
        details,
      };
    }
    // Neonatal vesicular — disseminated HSV risk
    if (isVesicular && ageM < 3) {
      details.unshift('VESICULAR RASH IN INFANT < 3 MONTHS — disseminated neonatal HSV must be excluded urgently. Admit for full workup; antiviral therapy decision requires senior review.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Fever + Rash Risk', totalScore: 8, maxScore: 10, interpretation: 'Neonatal vesicular rash — High Risk' },
        details,
      };
    }

    // ── Composite score (well-appearing) ─────────────────────────────────
    let score = 0;
    if (tickExposure)                          { score += 3; details.push('Tick exposure (+3) — empiric Doxycycline for RMSF; do not wait for serology.'); }
    if (immunocomp)                            { score += 3; details.push('Immunocompromised host (+3) — atypical and opportunistic infections; senior review mandatory before any discharge.'); }
    if (sexualHx)                              { score += 2; details.push('Sexually active adolescent (+2) — secondary syphilis (palmar/plantar rash), disseminated gonorrhoea, or acute HIV must be excluded.'); }
    if (fever5d || feverDays >= 5)             { score += 2; details.push('Fever ≥ 5 days (+2) — Kawasaki disease must be excluded in children < 5 years.'); }
    if (mucosalHx || mucosalSign)              { score += 2; details.push('Mucosal involvement (+2) — Kawasaki, SJS/TEN, hand-foot-mouth, secondary syphilis, or disseminated HSV.'); }
    if (palpablePurpura)                       { score += 2; details.push('Palpable purpura (+2) — vasculitis: IgA vasculitis (HSP) if lower-extremity distribution; other vasculitis if generalised.'); }
    if (rashDist === 'distal-to-central')      { score += 2; details.push('Distal-first distribution (+2) — RMSF pattern (starts wrists/ankles → spreads to palms/soles → trunk). Empiric Doxycycline if tick exposure or endemic area.'); }
    if (rashDist === 'lower-extremities' && palpablePurpura) { details.push('Palpable purpura + lower-extremity distribution — IgA vasculitis (HSP) pattern: check UA for haematuria and proteinuria; check BP.'); }
    if (isVesicular)                           { score += 1; details.push('Vesicular rash (+1) — varicella, hand-foot-mouth, HZV, or HSV. Well-appearing child > 3 months may be managed as outpatient.'); }
    if (isErythroderma)                        { score += 1; details.push('Diffuse erythema (+1) — consider TSS (sunburn-like + hypotension), scarlet fever (sandpaper texture + pharyngitis), or Kawasaki.'); }
    if (isTarget)                              { score += 1; details.push('Target/annular lesions (+1) — erythema multiforme (most commonly post-HSV or Mycoplasma pneumoniae). Check for mucosal involvement to differentiate EM from SJS.'); }
    if (medications)                           { score += 1; details.push('Recent medications (+1) — drug rash or DRESS must be excluded. DRESS: onset 2–8 weeks after starting culprit drug, eosinophilia, multi-organ.'); }
    if (travel)                                { score += 1; details.push('Travel history (+1) — destination-guided serology required (dengue, typhoid rose spots, rickettsia, endemic mycoses).'); }
    if (illContact)                            { details.push('Ill contact — viral exanthem cluster (varicella, measles, enterovirus) or meningococcal contact more likely. Public health notification may be required.'); }
    if (vaccination)                           { details.push('Incomplete vaccination — measles, rubella, varicella, and meningococcal disease risk elevated.'); }

    let level: SeverityLevel;
    let interpretation: string;

    // Kawasaki: fever ≥ 5d + mucosal = high suspicion regardless of score
    const kawasakiSuspicion = (fever5d || feverDays >= 5) && (mucosalHx || mucosalSign);

    if (score >= 3 || kawasakiSuspicion || tickExposure || immunocomp || sexualHx) {
      level = 'moderate';
      interpretation = 'Intermediate–High Risk — urgent targeted workup required';
      details.unshift('MODERATE–HIGH RISK — concerning epidemiological or clinical features. Targeted urgent investigations and senior review before any discharge decision.');
    } else if (score >= 1 || isVesicular || isErythroderma || isTarget || palpablePurpura || rashDist === 'distal-to-central') {
      level = 'moderate';
      interpretation = 'Intermediate Risk — observe and investigate';
      details.unshift('MODERATE RISK — requires targeted workup and ER observation before discharge decision.');
    } else {
      level = 'mild';
      interpretation = 'Low Risk — viral exanthem likely';
      details.unshift('LOW RISK — well-appearing child with blanching maculopapular rash and no epidemiological red flags. Viral exanthem is the most likely diagnosis. Supportive care and safety netting.');
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Fever + Rash Risk Score',
        totalScore: score,
        maxScore: 10,
        interpretation,
        referenceTable: [
          { range: '0',  meaning: 'Low Risk — viral exanthem' },
          { range: '1–2', meaning: 'Intermediate — observe and investigate' },
          { range: '3+', meaning: 'High Risk — urgent workup + likely admission' },
        ],
      },
      details,
    };
  },

  getInvestigations: (severity, data) => {
    const rashType  = data.rashType as string;
    const rashDist  = data.rashDistribution as string;
    const ageM      = Number(data.ageMonths) || 0;
    const feverDays = Number(data.feverDays) || 0;

    const petechiae      = data.petechiae === true;
    const skinSloughing  = data.skin_sloughing === true || data.skinSloughingSign === true;
    const painProp       = data.pain_proportion === true;
    const tickExp        = data.tick_exposure === true;
    const fever5d        = data.fever_5d === true || feverDays >= 5;
    const mucosalHx      = data.mucosal_hx === true || data.mucosalSign === true;
    const medications    = data.medications === true;
    const immunocomp     = data.immunocompromised === true;
    const travel         = data.travel === true;
    const sexualHx       = data.sexual_hx === true;
    const palpablePurp   = data.palpablePurpura === true;
    const isVesicular    = rashType === 'vesicular';
    const isPetechial    = rashType === 'petechial';
    const isErythroderma = rashType === 'erythroderma';
    const isTarget       = rashType === 'target';

    const result: ErInvestigation[] = [];

    // Always
    result.push({ test: 'Vital signs + continuous SpO₂ and HR monitoring', category: 'urgent', indication: 'Baseline and continuous trend. Haemodynamic instability changes everything.' });
    result.push({ test: 'Bedside blood glucose', category: 'urgent', indication: 'Young infants are hypoglycaemia-prone during fever.' });

    // Non-blanching / petechial
    if (petechiae || isPetechial || severity.level === 'severe') {
      result.push({ test: '🔴 CEFTRIAXONE IV — give BEFORE investigations if petechiae present', category: 'urgent', indication: 'Petechiae + fever = meningococcaemia until proven otherwise. Antibiotic first, then investigations.', criticalValue: 'Do not delay antibiotic for any investigation' });
      result.push({ test: 'Blood culture × 2 (before antibiotics)', category: 'blood', indication: 'Mandatory — meningococcaemia, other bacteraemia. Draw immediately before first antibiotic dose.', criticalValue: 'If petechiae present, give antibiotics first, draw culture simultaneously or immediately after' });
      result.push({ test: 'CBC + differential + platelet count', category: 'blood', indication: 'Thrombocytopaenia + purpura = DIC emergency. Leukopenia in sepsis or RMSF.', criticalValue: 'Platelets < 20,000 → haematology urgently' });
      result.push({ test: 'Coagulation screen — PT, APTT, fibrinogen, D-dimer', category: 'blood', indication: 'MANDATORY with purpura. Prolonged PT/APTT + low fibrinogen = DIC.', criticalValue: 'DIC confirmed → FFP + Cryoprecipitate + PICU' });
      result.push({ test: 'CRP + ESR', category: 'blood', indication: 'CRP ≥ 80 mg/L with petechiae is strongly associated with SBI.' });
      result.push({ test: 'Venous blood gas + lactate', category: 'blood', indication: 'Organ dysfunction assessment.', criticalValue: 'Lactate ≥ 4 mmol/L → septic shock + PICU immediately' });
      result.push({ test: 'Urinalysis — microscopy for haematuria', category: 'blood', indication: 'Infective endocarditis and HSP both cause microscopic haematuria.' });
      result.push({ test: 'LP (CSF analysis + culture) — after antibiotics if unstable', category: 'blood', indication: 'For suspected meningococcal meningitis. If child is haemodynamically unstable, give antibiotics first and perform LP when stable.', criticalValue: 'Never delay antibiotics for LP in an unstable child' });
    }

    // Necrotising fasciitis
    if (painProp) {
      result.push({ test: 'CT soft tissue ± IV contrast — emergency', category: 'radiology', indication: 'Gas in fascial planes confirms NF but normal CT does NOT exclude it. Proceed to surgery if clinical suspicion is high.', criticalValue: 'Gas in fascia → immediate surgical debridement' });
      result.push({ test: 'Blood culture × 2 + wound/blister aspirate Gram stain + culture', category: 'blood', indication: 'NF is usually polymicrobial (Type I) or GAS (Type II). Culture guides definitive antibiotic therapy.' });
      result.push({ test: 'CBC + CRP + coagulation screen + blood gas + lactate', category: 'blood', indication: 'Severity assessment. Elevated WBC and CRP consistent with NF; DIC can develop rapidly.' });
    }

    // Skin sloughing / SJS-TEN / SSSS
    if (skinSloughing) {
      result.push({ test: 'Skin biopsy — send to histopathology (frozen section if available) AND microbiology', category: 'blood', indication: 'Differentiates SJS/TEN (sub-epidermal split) from SSSS (intra-epidermal split). Frozen section result can be available within 1 h and changes management.' });
      result.push({ test: 'CBC + CRP + LFTs + U&E + blood culture', category: 'blood', indication: 'Baseline organ function. DRESS has multi-organ involvement (liver, kidneys). SJS/TEN — monitor for sepsis.' });
      result.push({ test: 'Medication review — list all drugs started in the past 8 weeks', category: 'other', indication: 'Culprit identification is the most important therapeutic step. Common: sulfonamides, anticonvulsants, allopurinol, NSAIDs, penicillins.' });
    }

    // Vesicular rash
    if (isVesicular) {
      result.push({ test: 'Vesicle unroofing — swab base for HSV/VZV PCR', category: 'blood', indication: ageM < 3 ? 'URGENT in infant < 3 months — disseminated neonatal HSV must be excluded. Unroof vesicle and swab the base; PCR preferred over DFA.' : 'Unroof vesicle and swab base for PCR. Distinguishes HSV from VZV and guides antiviral choice.', criticalValue: ageM < 3 ? 'Neonatal vesicular rash — antiviral therapy decision must not be delayed' : undefined });
      if (ageM < 3) {
        result.push({ test: 'Blood culture + CBC + LFTs + LP (CSF HSV PCR)', category: 'blood', indication: 'Full workup for disseminated neonatal HSV: blood culture, liver function (HSV hepatitis), and CSF analysis with HSV PCR.', criticalValue: 'Elevated AST/ALT in a febrile neonate with vesicles = disseminated HSV until proven otherwise' });
      }
    }

    // RMSF / tick exposure
    if (tickExp || rashDist === 'distal-to-central') {
      result.push({ test: 'Blood culture × 2 + CBC + CRP + LFTs + platelet count', category: 'blood', indication: 'RMSF: relative leukopenia, thrombocytopaenia, and elevated transaminases are classic. CRP may be elevated. Start Doxycycline EMPIRICALLY — do not wait for confirmatory serology.' });
      result.push({ test: 'RMSF serology: IFA Rickettsia rickettsii IgG/IgM (acute + convalescent 2–4 weeks)', category: 'blood', indication: 'Serology is frequently negative in the first 7 days — treat empirically without waiting. Convalescent titre (≥ 4-fold rise) confirms diagnosis retrospectively.' });
      result.push({ test: 'Skin biopsy from petechial lesion — direct immunofluorescence (DIF) for Rickettsia', category: 'blood', indication: 'DIF of skin biopsy is diagnostic for RMSF if available. Sensitivity ~70% for early lesions; does not delay antibiotic therapy.' });
    }

    // Kawasaki / fever ≥ 5 days
    if (fever5d || mucosalHx) {
      result.push({ test: 'CBC + CRP + ESR + albumin + LFTs + urinalysis', category: 'blood', indication: 'Kawasaki panel: ESR > 40, CRP elevated, hypoalbuminaemia (< 30 g/L) = high-risk for coronary aneurysm. Sterile pyuria on UA is a supporting criterion.' });
      result.push({ test: 'ECG + urgent Echocardiogram', category: 'radiology', indication: 'MANDATORY if Kawasaki criteria met — echo within 24 h for coronary artery diameter. Cardiology consult required for IVIG decision.', criticalValue: 'Z-score ≥ 2.5 for any coronary artery = aneurysm; urgent cardiology' });
    }

    // Erythroderma — TSS / scarlet fever
    if (isErythroderma) {
      result.push({ test: 'Blood culture × 2 + throat swab + wound swab (GAS)', category: 'blood', indication: 'TSS: blood culture + wound swab at any potential entry site. Scarlet fever: throat swab for GAS culture + rapid antigen test.' });
      result.push({ test: 'CBC + CRP + LFTs + U&E + coagulation + blood gas', category: 'blood', indication: 'TSS diagnostic criteria require multi-organ involvement. Elevated creatinine, LFTs, thrombocytopaenia, and metabolic acidosis define severity.' });
    }

    // Target lesions — erythema multiforme
    if (isTarget) {
      result.push({ test: 'Vesicle/lesion PCR for HSV (swab lesion base if any blisters present)', category: 'blood', indication: 'HSV is the most common precipitant of erythema multiforme. PCR from active lesion or recent herpes site confirms the diagnosis.' });
      result.push({ test: 'Mycoplasma pneumoniae serology + cold agglutinins', category: 'blood', indication: 'Second most common precipitant of EM. Cold agglutinins positive in ~50% of Mycoplasma infection.' });
      if (mucosalHx) result.push({ test: 'Skin biopsy (if mucosal involvement present — to distinguish EM from SJS)', category: 'blood', indication: 'EM major (mucosal involvement without widespread epidermal necrosis) vs. SJS (> 10% BSA epidermal detachment) requires histological distinction in borderline cases.' });
    }

    // Palpable purpura / HSP
    if (palpablePurp) {
      result.push({ test: 'Urinalysis + urine microscopy + urine protein:creatinine ratio', category: 'blood', indication: 'HSP/IgA vasculitis — renal involvement determines admission. Haematuria + proteinuria = nephritis component present.', criticalValue: 'Nephritic-range proteinuria or renal impairment → nephrology consult + admission' });
      result.push({ test: 'BP measurement (all four limbs)', category: 'urgent', indication: 'Hypertension in HSP indicates renal vasculitis. Bilateral BP comparison rules out coarctation.' });
      result.push({ test: 'CBC + CRP + ESR + IgA level (non-urgent)', category: 'blood', indication: 'Normal platelets distinguish HSP (vasculitic purpura) from ITP (thrombocytopaenic purpura). Elevated CRP/ESR supports vasculitis. Elevated serum IgA supports HSP diagnosis.' });
    }

    // Sexual history / STI
    if (sexualHx) {
      result.push({ test: 'RPR/VDRL (syphilis screen) → confirm with TPHA if reactive', category: 'blood', indication: 'Secondary syphilis: maculopapular rash including palms and soles, mucous patches, condylomata lata. RPR is highly sensitive in secondary stage.' });
      result.push({ test: 'GC/Chlamydia NAAT (urine + urethral/cervical swab)', category: 'blood', indication: 'Disseminated gonococcal infection: < 30 vesiculopustular distal lesions + tenosynovitis + fever. NAAT is the most sensitive test.' });
      result.push({ test: 'HIV 4th-generation antigen/antibody assay', category: 'blood', indication: 'Acute HIV seroconversion: mononucleosis-like illness + transient truncal/facial maculopapular rash 2–6 weeks after exposure.' });
    }

    // Travel
    if (travel) {
      result.push({ test: 'Thick and thin malaria smear + malaria rapid antigen test', category: 'blood', indication: 'Any febrile traveller returning from a malaria-endemic area. Smear must be reviewed by haematologist.', criticalValue: 'Positive malaria test → urgent infectious disease consult' });
      result.push({ test: 'Dengue NS1 antigen (days 1–5) + IgM/IgG serology (days 4–5 onwards)', category: 'blood', indication: 'Dengue: high fever + retro-orbital headache + myalgia + maculopapular rash + thrombocytopaenia. Endemic in tropics.' });
      result.push({ test: 'Peripheral blood smear for ehrlichia/anaplasma morulae', category: 'blood', indication: 'If tick-endemic area travel. Morulae (inclusion bodies) in granulocytes on smear are diagnostic if visible.' });
    }

    // Immunocompromised
    if (immunocomp) {
      result.push({ test: 'Serum cryptococcal antigen + fungal blood culture', category: 'blood', indication: 'Cryptococcaemia: disseminated skin lesions + fever in immunocompromised host. Serum CrAg is highly sensitive.' });
      result.push({ test: 'Blood culture (fungal protocol) + CXR', category: 'blood', indication: 'Candidaemia: disseminated erythematous nodular rash. Aspergillus and endemic fungi cause skin lesions in severe immunocompromise.' });
    }

    // Medications / DRESS
    if (medications) {
      result.push({ test: 'CBC with differential (eosinophil count) + LFTs + U&E', category: 'blood', indication: 'DRESS: eosinophilia > 500/mm³ + elevated transaminases in the context of drug started 2–8 weeks ago. Lymphocytosis with atypical cells may also be seen.' });
    }

    // Mononucleosis pattern
    result.push({ test: 'EBV Monospot + EBV IgM (if pharyngitis + posterior cervical lymphadenopathy + rash after ampicillin)', category: 'blood', indication: 'EBV infectious mononucleosis: rash intensifies dramatically after amoxicillin or ampicillin exposure. Monospot negative in < 10 years — send EBV IgM directly.' });

    return result;
  },

  getManagement: (severity, data) => {
    const rashType   = data.rashType as string;
    const ageM       = Number(data.ageMonths) || 0;
    const feverDays  = Number(data.feverDays) || 0;
    const rashDist   = data.rashDistribution as string;
    const wt         = Number(data.weight) || 0;

    const petechiae      = data.petechiae === true || rashType === 'petechial';
    const skinSloughing  = data.skin_sloughing === true || data.skinSloughingSign === true;
    const painProp       = data.pain_proportion === true;
    const tickExp        = data.tick_exposure === true || rashDist === 'distal-to-central';
    const fever5d        = data.fever_5d === true || feverDays >= 5;
    const mucosalHx      = data.mucosal_hx === true || data.mucosalSign === true;
    const medications    = data.medications === true;
    const immunocomp     = data.immunocompromised === true;
    const sexualHx       = data.sexual_hx === true;
    const palpablePurp   = data.palpablePurpura === true;
    const isVesicular    = rashType === 'vesicular';
    const isErythroderma = rashType === 'erythroderma';
    const isTarget       = rashType === 'target';
    const isToxic        = data.appearance === 'ill' || data.toxic_appear === true;

    const clean = (arr: (string | false | undefined | null)[]): string[] => arr.filter(Boolean) as string[];

    if (severity.level === 'severe') {
      // Determine which emergency pathway
      if (petechiae) {
        return [{
          title: 'STEP 1 — EMERGENCY: Meningococcaemia / Purpura Fulminans',
          recommendations: clean([
            '🔴 IV ACCESS NOW + Ceftriaxone 100 mg/kg IV (max 4 g) — first line. Give BEFORE LP. Give BEFORE blood culture results.',
            'If penicillin/cephalosporin unavailable: Chloramphenicol 25 mg/kg IV as an emergency alternative.',
            'Blood culture × 2 (draw simultaneously with or immediately after antibiotic).',
            'Coagulation screen + CBC + blood gas + lactate URGENTLY — DIC must be identified.',
            'IV fluid bolus 10 mL/kg isotonic crystalloid if any sign of poor perfusion. Reassess after each bolus.',
            'PICU notification NOW — purpuric rash + fever carries up to 25% mortality; ICU-level care is required.',
            'LP: perform after antibiotics if child is stable; defer entirely if haemodynamically unstable.',
            'Dexamethasone 0.15 mg/kg IV with or before first antibiotic dose — reduces neurological sequelae in bacterial meningitis (NOT in neonates or infants < 6 weeks).',
          ]),
        }, {
          title: 'STEP 2 — Purpura Fulminans / DIC Management',
          recommendations: clean([
            'If DIC confirmed (prolonged PT/APTT + low fibrinogen + purpura): FFP 15 mL/kg IV + Cryoprecipitate (for fibrinogen < 1 g/L).',
            'Monitor skin lesions for progression every 15–30 min — increasing purpura size indicates DIC progression.',
            'Do NOT give anticoagulants for DIC in meningococcaemia — contraindicated.',
            'Vasopressors (Noradrenaline or Dopamine) via PICU team if BP does not respond to fluid boluses.',
            'Blood glucose every 1–2 h — meningococcaemia causes hypoglycaemia.',
          ]),
        }, {
          title: 'STEP 3 — Escalation',
          recommendations: clean([
            'Repeat blood gas + lactate at 1 h — lactate trending up = inadequate resuscitation.',
            'If Listeria concern (neonate or immunocompromised): ADD Ampicillin to the regimen.',
            'If MRSA concern (previous MRSA, severe sepsis without clear source): ADD Vancomycin 15 mg/kg IV q6h.',
            'If coagulopathy worsens: repeat FFP and Cryoprecipitate guided by serial coag screen results.',
          ]),
        }];
      }

      if (skinSloughing) {
        return [{
          title: 'STEP 1 — EMERGENCY: SJS/TEN or SSSS',
          recommendations: clean([
            'STOP all non-essential medications immediately — identify and remove the most likely culprit drug.',
            'Frozen-section skin biopsy to distinguish SJS/TEN (sub-epidermal) from SSSS (intra-epidermal) — this changes management fundamentally.',
            'SSSS (Staphylococcal Scalded Skin Syndrome) → IV antistaphylococcal antibiotic: Flucloxacillin 50 mg/kg q6h IV (or Clindamycin if MRSA suspected).',
            'SJS/TEN → supportive management; ophthalmology review for ocular involvement; wounds/burns unit referral for > 10% BSA detachment.',
            'IV access + fluid resuscitation — large surface area fluid loss (treat as for partial-thickness burns).',
            'Wound care: non-adherent dressings; avoid adhesive materials on skin; gentle handling.',
            'Analgesia: IV opioids for pain control; mucosal pain management.',
            'Ophthalmology consult for any eye involvement — corneal involvement risks permanent visual loss.',
          ]),
        }];
      }

      if (painProp) {
        return [{
          title: 'STEP 1 — EMERGENCY: Necrotising Fasciitis',
          recommendations: clean([
            'SURGICAL CONSULT NOW — emergency surgical debridement is the definitive treatment. Every hour of delay worsens mortality.',
            'IV access + broad-spectrum antibiotics immediately:',
            '  — Piperacillin-Tazobactam 100 mg/kg IV q8h (max 4.5 g/dose) PLUS',
            '  — Clindamycin 10 mg/kg IV q8h (max 900 mg/dose) — protein synthesis inhibitor, reduces GAS toxin production.',
            '  — ADD Vancomycin 15 mg/kg IV q6h if MRSA cannot be excluded.',
            'Blood culture × 2 + wound aspirate Gram stain + culture.',
            'CT soft tissue if child is stable — look for gas in fascial planes. Do NOT delay surgery for CT if surgical signs are present.',
            'IV fluid resuscitation: 20 mL/kg isotonic crystalloid bolus if signs of shock; repeat as needed.',
            'Blood gas + lactate + coagulation screen + CBC + CRP urgently.',
            'Strict nil by mouth — surgical anaesthesia likely.',
            'PICU notification — post-operative ICU admission required for all confirmed NF cases.',
          ]),
        }];
      }

      if (isVesicular && ageM < 3) {
        return [{
          title: 'STEP 1 — URGENT: Vesicular Rash in Infant < 3 Months',
          recommendations: clean([
            'Admit immediately — disseminated neonatal HSV must be excluded urgently.',
            'Full workup: blood culture + CBC + LFTs + blood gas + vesicle PCR (HSV/VZV) + LP with CSF HSV PCR.',
            'Elevated AST/ALT + thrombocytopaenia + vesicular rash in a neonate = disseminated HSV pattern — discuss antiviral therapy with senior immediately.',
            'Do NOT discharge until PCR result is available or senior decision made to observe.',
            'If haemodynamically unstable or neurologically abnormal: treat as severe neonatal HSV; do not await PCR.',
          ]),
        }];
      }

      // Generic severe (toxic appearing)
      return [{
        title: 'STEP 1 — EMERGENCY: Toxic Appearance + Rash',
        recommendations: clean([
          'Immediate IV access + 100% oxygen.',
          'Blood culture × 2 + CBC + CRP + coagulation screen + blood gas URGENTLY.',
          'Empiric antibiotics: Ceftriaxone 100 mg/kg IV (max 4 g) PLUS Vancomycin 15 mg/kg IV q6h if MRSA or TSS cannot be excluded.',
          'IV fluid bolus 10 mL/kg isotonic crystalloid if any sign of poor perfusion; reassess after each.',
          'PICU notification immediately.',
          tickExp ? 'Tick exposure flagged — ADD Doxycycline 2.2 mg/kg IV/PO q12h for RMSF coverage.' : '',
        ]),
      }];
    }

    // ── MODERATE ──────────────────────────────────────────────────────────
    const step2Moderate = {
      title: 'STEP 2 — REASSESS at 1–2 h with results in hand',
      recommendations: clean([
        'RE-EXAMINE APPEARANCE — any deterioration in appearance mandates escalation to severe pathway.',
        'Platelet count result: if < 20,000/mm³ + purpura → haematology urgently; if 20,000–100,000/mm³ → repeat in 4–6 h, monitor closely.',
        'CRP ≥ 80 mg/L + petechial rash in a well-appearing child → escalate to empiric antibiotics + admission.',
        'If any marker is unexpectedly abnormal → escalate to senior and reconsider admission.',
      ]),
    };

    if (rashType === 'petechial') {
      return [{
        title: 'STEP 1 — Urgent Workup: Well-Appearing Petechial Rash',
        recommendations: clean([
          'Petechiae require urgent workup EVEN in a well-appearing child — early meningococcaemia can look deceptively well.',
          'Blood culture × 2 + CBC + platelet count + CRP + coagulation screen IMMEDIATELY.',
          'If petechiae extend BELOW the nipple line: give empiric Ceftriaxone 50 mg/kg IV and admit regardless of results.',
          palpablePurp ? 'Palpable purpura + lower-extremity distribution: IgA vasculitis (HSP) — check UA for haematuria/proteinuria + BP. No antibiotics needed for uncomplicated HSP.' : 'Flat petechiae in an afebrile (or low-grade fever) child with antecedent viral illness + normal platelets → likely viral-associated petechiae; observe 2 h.',
          'Reassess appearance and vital signs every 30 min while in ER.',
          'Do NOT discharge any child with petechiae without complete blood count AND senior review.',
        ]),
      }, step2Moderate, {
        title: 'STEP 3 — Escalation if Worsening',
        recommendations: clean([
          'Deterioration in appearance at any point → petechiae + toxic = MENINGOCOCCAEMIA: Ceftriaxone 100 mg/kg IV immediately + PICU.',
          'Thrombocytopaenia without signs of sepsis → haematology review for ITP.',
          'Confirmed DIC features → senior + PICU + coagulation replacement.',
        ]),
      }];
    }

    if (isVesicular) {
      return [{
        title: 'STEP 1 — Vesicular Rash Management',
        recommendations: clean([
          'Vesicle unroofing: swab base of a fresh vesicle for HSV/VZV PCR.',
          'Varicella (chickenpox — most common): supportive care; Paracetamol only (avoid Ibuprofen — increased risk of invasive GAS skin infection). Oral Acyclovir if > 2 years, presenting within 72 h, and moderate-to-severe disease.',
          'Hand-foot-mouth (enterovirus): supportive care; analgesia for mouth ulcers; ensure oral hydration.',
          'Eczema herpeticum (HSV superinfection of eczematous skin): widespread vesicular lesions on eczema — admit for IV Acyclovir.',
          'Herpes zoster (dermatomal): oral Acyclovir if presenting within 72 h; analgesia.',
          'Isolation: airborne + contact precautions for suspected varicella (until all lesions crusted); contact precautions for HFM.',
        ]),
      }, step2Moderate];}

    if (fever5d && mucosalHx) {
      return [{
        title: 'STEP 1 — Kawasaki Disease Workup',
        recommendations: clean([
          'Document all 5 Kawasaki criteria: (1) fever ≥ 5 days, (2) bilateral non-purulent conjunctival injection, (3) lip/oral changes (fissured lips, strawberry tongue), (4) rash, (5) extremity changes (oedema/erythema of hands/feet or periungual desquamation).',
          'Kawasaki is diagnosed clinically with fever ≥ 5 days + ≥ 4 of 5 criteria. Incomplete Kawasaki (< 4 criteria) still requires evaluation if no other diagnosis explains the fever.',
          'Labs: CBC + CRP + ESR + albumin + LFTs + urinalysis (sterile pyuria is a supporting feature).',
          'ECG + urgent Echocardiogram within 24 h — coronary artery diameter determines aneurysm risk.',
          'Cardiology consult for IVIG decision — IVIG 2 g/kg IV over 10–12 h + Aspirin (anti-inflammatory dose until afebrile, then antiplatelet dose).',
          'Admit for IVIG infusion and monitoring. Do NOT discharge without echo and cardiology review.',
        ]),
      }, step2Moderate];}

    if (tickExp) {
      return [{
        title: 'STEP 1 — Suspected RMSF / Rickettsial Disease',
        recommendations: clean([
          'START DOXYCYCLINE EMPIRICALLY NOW — do not wait for serology. Serology is frequently negative in the first 7 days of illness and treatment delay is the main preventable cause of RMSF death.',
          'Doxycycline is SAFE and indicated in children of ALL ages for RMSF — AAP and CDC endorse use even in children < 8 years for this specific indication (brief course, < 21 days).',
          'Blood culture × 2 + CBC + CRP + LFTs + platelet count.',
          'Skin biopsy from an active petechial lesion for direct immunofluorescence (DIF) if available — most sensitive early diagnostic test.',
          'RMSF serology (IFA) — send acute sample now, convalescent sample in 2–4 weeks.',
          'Admit for observation — RMSF can deteriorate rapidly despite initially mild appearance.',
          'If tick bite site found: remove any residual tick immediately (forceps, perpendicular pull).',
        ]),
      }, step2Moderate];}

    if (isErythroderma) {
      return [{
        title: 'STEP 1 — Diffuse Erythema: TSS vs. Scarlet Fever vs. Kawasaki',
        recommendations: clean([
          'Toxic Shock Syndrome (TSS) — if associated with hypotension, fever > 38.9°C, and multi-organ signs:',
          '  Blood culture + wound culture at all potential sites (surgical wounds, tampon, nasal packing, burns).',
          '  Empiric antibiotics: Ceftriaxone 50 mg/kg IV + Clindamycin 10 mg/kg IV q8h (toxin synthesis inhibitor).',
          '  Add Vancomycin if MRSA not excluded.',
          '  IV fluid resuscitation + PICU if hypotensive.',
          'Scarlet fever — if sandpaper rash + pharyngitis + strawberry tongue:',
          '  Rapid GAS antigen test + throat swab culture.',
          '  Amoxicillin 50 mg/kg/day divided q8h × 10 days (or Penicillin V 12.5 mg/kg q6h if > 12 kg).',
          '  Outpatient if tolerating oral and well-appearing.',
          fever5d ? 'Fever ≥ 5 days — Kawasaki must also be considered: full Kawasaki workup including echo.' : '',
          medications ? 'New medication — drug-related erythroderma (DRESS or drug fever) must also be excluded.' : '',
        ]),
      }, step2Moderate];}

    if (isTarget) {
      return [{
        title: 'STEP 1 — Target/Annular Lesions: Erythema Multiforme',
        recommendations: clean([
          'Erythema multiforme (EM) — symmetrically distributed target lesions on palms, soles, and extensor surfaces.',
          'Identify the precipitant: HSV PCR from any active lesion or recent herpes site. Mycoplasma: serology + cold agglutinins.',
          'EM minor (no mucosal involvement): supportive care; topical steroids for pruritus; antivirals only if HSV is the active trigger.',
          mucosalHx ? 'Mucosal involvement present — this may be EM major or SJS. Skin biopsy to distinguish. Ophthalmology consult if any ocular involvement.' : '',
          'If Mycoplasma confirmed: Azithromycin 10 mg/kg day 1 (max 500 mg), then 5 mg/kg/day days 2–5 (max 250 mg/day).',
          'If HSV confirmed or strongly suspected: oral Acyclovir (suppressive therapy reduces recurrence of HSV-triggered EM).',
          'Admit if mucosal involvement, inability to tolerate oral fluids, or severe skin involvement.',
        ]),
      }, step2Moderate];}

    if (sexualHx) {
      return [{
        title: 'STEP 1 — STI-Related Rash Workup (Adolescent)',
        recommendations: clean([
          'Secondary syphilis: maculopapular rash including palms and soles + mucous patches + condylomata lata. RPR/VDRL is highly sensitive. Treatment: Benzathine Penicillin G 2.4 million units IM × 1 (adults/adolescents).',
          'Disseminated gonococcal infection (DGI): < 30 vesiculopustular or haemorrhagic pustules on distal extremities + tenosynovitis. GC NAAT + blood culture. Treatment: Ceftriaxone 1 g IM/IV daily.',
          'Acute HIV seroconversion: truncal/facial maculopapular rash + mononucleosis-like illness 2–6 weeks after exposure. Send 4th-generation HIV Ag/Ab test.',
          'Ensure privacy for history-taking and appropriate documentation of confidentiality.',
          'Notify public health for syphilis and gonorrhoea as required by local regulations.',
        ]),
      }, step2Moderate];}

    // General moderate
    return [{
      title: 'STEP 1 — Intermediate Risk: Targeted Workup',
      recommendations: clean([
        'Observe in ER for 1–2 h with vital sign monitoring every 30 min.',
        'Targeted investigations based on rash type and epidemiologic features (see Investigations tab).',
        medications ? 'Recent medication — review all drugs started in the past 4 weeks; consider stopping the most likely culprit.' : '',
        immunocomp ? 'Immunocompromised — do not discharge without senior and infectious disease review; low threshold to admit.' : '',
        'Antipyretics for comfort: Paracetamol 15 mg/kg now.',
        'Reassess appearance + vital signs at 1 h.',
      ]),
    }, step2Moderate, {
      title: 'STEP 3 — Escalation if Worsening',
      recommendations: clean([
        'Any deterioration in appearance → escalate to severe pathway.',
        'Non-blanching lesions appear on repeat exam → treat as meningococcaemia immediately.',
        'Senior clinician review before discharge for any infant < 3 months with any rash and fever.',
      ]),
    }];

    // Mild
    return [{
      title: 'STEP 1 — Low Risk: Viral Exanthem — Supportive Care',
      recommendations: clean([
        'Well-appearing child with purely blanching maculopapular rash — viral exanthem is the most likely diagnosis.',
        'Paracetamol 15 mg/kg for fever/discomfort. Adequate oral fluids.',
        'Observe in ER for 1 h before discharge — viral exanthems can be early presentations of more serious illness.',
        'Glass-press test on all lesions before discharge — must be fully blanching.',
        'Safety netting (see Dispose tab): explain glass test, return immediately if non-blanching spots appear.',
      ]),
    }];
  },

  getDisposition: (severity, data) => {
    const rashType  = data.rashType as string;
    const ageM      = Number(data.ageMonths) || 0;
    const feverDays = Number(data.feverDays) || 0;
    const palpPurp  = data.palpablePurpura === true;
    const tickExp   = data.tick_exposure === true;
    const fever5d   = data.fever_5d === true || feverDays >= 5;
    const mucosalHx = data.mucosal_hx === true || data.mucosalSign === true;
    const immunocomp = data.immunocompromised === true;
    const reliableFu = data.reliableFollowup === true;

    if (severity.level === 'severe') {
      if (data.petechiae === true || rashType === 'petechial') return ['ADMIT — PICU immediately. Meningococcaemia/purpura fulminans. IV antibiotics already given.'];
      if (data.skin_sloughing === true || data.skinSloughingSign === true) return ['ADMIT — burns unit or dermatology ward. SJS/TEN or SSSS. All non-essential medications stopped.'];
      if (data.pain_proportion === true) return ['ADMIT — emergency surgery. Necrotising fasciitis. Surgical debridement is the definitive treatment.'];
      if (rashType === 'vesicular' && ageM < 3) return ['ADMIT — for neonatal HSV workup. Do not discharge until PCR result available or senior decision made.'];
      return ['ADMIT — PICU. Toxic appearance with rash. Empiric antibiotics given.'];
    }

    if (severity.level === 'moderate') {
      if (rashType === 'petechial') return ['ADMIT — petechial rash requires complete workup and empiric antibiotics. Do not discharge until platelet count, CRP, and blood cultures drawn, AND senior review completed.'];
      if (fever5d && mucosalHx) return ['ADMIT — Kawasaki disease evaluation requires echocardiogram and cardiology review. IVIG infusion requires inpatient setting.'];
      if (tickExp) return ['ADMIT — RMSF requires Doxycycline and inpatient monitoring. Outpatient management is NOT appropriate if RMSF is a diagnostic possibility.'];
      if (immunocomp) return ['ADMIT — immunocompromised host with rash and fever; senior + infectious disease review required before discharge decision.'];
      if (rashType === 'vesicular' && ageM >= 3) {
        return [reliableFu
          ? 'OUTPATIENT — well-appearing varicella/vesicular rash in child ≥ 3 months: Paracetamol, isolation instructions, return precautions, and confirmed 24 h follow-up. Admit only if dehydrated, superinfected, or no reliable follow-up.'
          : 'OBSERVE OR ADMIT — vesicular rash: outpatient acceptable only if reliable caregiver AND confirmed 24 h follow-up. If neither can be guaranteed, admit for observation.'];
      }
      if (palpPurp) return ['OUTPATIENT (HSP without complications) or ADMIT (HSP with abdominal pain/haematuria/renal impairment) — senior review before discharge; confirm 24 h UA and BP follow-up if discharged.'];
      return [reliableFu
        ? 'OBSERVE 1–2 h → OUTPATIENT if well-appearing and workup reassuring. Confirmed follow-up within 24 h required.'
        : 'OBSERVE in ER pending results. Outpatient only if reliable caregiver + guaranteed 24 h follow-up; otherwise admit.'];
    }

    return ['DISCHARGE — well-appearing, purely blanching rash, reassuring workup. Glass-press test confirmed blanching. Written return precautions given. Follow-up within 24–48 h.'];
  },

  getRedFlags: () => [
    'NON-BLANCHING RASH (petechiae/purpura) — meningococcaemia until proven otherwise; IV Ceftriaxone immediately',
    'Toxic/ill appearance with any rash — full sepsis workup + empiric antibiotics',
    'Skin sloughing or positive Nikolsky sign — SJS/TEN or SSSS',
    'Pain out of proportion to skin findings + woody induration — necrotising fasciitis',
    'Tick exposure + fever + distal rash spreading centrally — RMSF',
    'Fever ≥ 5 days + mucosal changes in child < 5 years — Kawasaki disease',
    'Vesicular rash in any infant < 3 months — disseminated neonatal HSV',
    'Diffuse erythema (sunburn-like) + hypotension + multi-organ signs — toxic shock syndrome',
    'Petechiae with thrombocytopaenia < 20,000/mm³ — intracranial haemorrhage risk',
  ],

  getDrugDoses: (severity, data) => {
    const wt = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required to calculate doses.' });
      return doses;
    }

    const rashType  = data.rashType as string;
    const feverDays = Number(data.feverDays) || 0;
    const ageM      = Number(data.ageMonths) || 0;
    const petechiae = data.petechiae === true || rashType === 'petechial';
    const skinSloug = data.skin_sloughing === true || data.skinSloughingSign === true;
    const painProp  = data.pain_proportion === true;
    const tickExp   = data.tick_exposure === true || (data.rashDistribution as string) === 'distal-to-central';
    const fever5d   = data.fever_5d === true || feverDays >= 5;
    const isVesic   = rashType === 'vesicular';
    const isErythro = rashType === 'erythroderma';

    // Paracetamol — always
    const paracMg = (15 * wt).toFixed(0);
    doses.push({
      drugName: 'Paracetamol (Acetaminophen) — PO / PR',
      dose: `${paracMg} mg (15 mg/kg) every 4–6 h as needed`,
      notes: 'Max 5 doses/24 h. Safe from birth. Avoid Ibuprofen in suspected varicella.',
    });

    // Meningococcaemia / severe petechial
    if (petechiae || severity.level === 'severe') {
      const ceftriaxMening = Math.min(100 * wt, 4000).toFixed(0);
      const ceftriaxStd    = Math.min(50 * wt, 2000).toFixed(0);
      const vancMg         = Math.min(15 * wt, 750).toFixed(0);
      const dexaMg         = (0.15 * wt).toFixed(1);
      doses.push({
        drugName: 'Ceftriaxone (IV) — Meningococcaemia / Meningitis dose',
        dose: `${ceftriaxMening} mg (100 mg/kg, max 4 g) IV as single emergency dose`,
        notes: 'Give BEFORE LP if petechiae are present. Standard sepsis dose without meningitis concern: 50 mg/kg (max 2 g).',
      });
      doses.push({
        drugName: 'Vancomycin (IV) — MRSA / TSS cover (add if indicated)',
        dose: `${vancMg} mg (15 mg/kg, max 750 mg/dose) IV every 6 h`,
        notes: 'Add if MRSA bacteraemia, streptococcal TSS, or severe sepsis of unclear source. Monitor trough levels.',
      });
      doses.push({
        drugName: 'Dexamethasone (IV) — bacterial meningitis adjunct',
        dose: `${dexaMg} mg (0.15 mg/kg) IV with or before first antibiotic dose`,
        notes: 'Give for confirmed or strongly suspected bacterial meningitis. NOT recommended in neonates or infants < 6 weeks. Reduces neurological sequelae in H. influenzae and S. pneumoniae meningitis.',
      });
    }

    // Necrotising fasciitis
    if (painProp) {
      const pipTazMg  = Math.min(100 * wt, 4500).toFixed(0);
      const clindaNF  = Math.min(10 * wt, 900).toFixed(0);
      const vancNF    = Math.min(15 * wt, 750).toFixed(0);
      doses.push({
        drugName: 'Piperacillin-Tazobactam (IV) — NF broad-spectrum cover',
        dose: `${pipTazMg} mg Piperacillin component (100 mg/kg, max 4 g Pip component) IV every 8 h`,
        notes: 'Covers polymicrobial NF (Type I): Gram-negatives, enterococci, and anaerobes. Combine with Clindamycin for GAS toxin inhibition.',
      });
      doses.push({
        drugName: 'Clindamycin (IV) — GAS toxin synthesis inhibitor (NF / TSS)',
        dose: `${clindaNF} mg (10 mg/kg, max 900 mg/dose) IV every 8 h`,
        notes: 'Protein synthesis inhibitor — reduces streptococcal and staphylococcal toxin production. Essential adjunct in Type II GAS necrotising fasciitis and streptococcal TSS.',
      });
      doses.push({
        drugName: 'Vancomycin (IV) — MRSA cover (NF)',
        dose: `${vancNF} mg (15 mg/kg, max 750 mg/dose) IV every 6 h`,
        notes: 'Add when MRSA cannot be excluded as the causative organism.',
      });
    }

    // TSS / erythroderma
    if (isErythro) {
      const ceftriaxTSS = Math.min(50 * wt, 2000).toFixed(0);
      const clindaTSS   = Math.min(10 * wt, 900).toFixed(0);
      const amoxMg      = Math.min(50 * wt / 3, 500).toFixed(0);
      doses.push({
        drugName: 'Ceftriaxone (IV) — TSS / GAS cover',
        dose: `${ceftriaxTSS} mg (50 mg/kg, max 2 g) IV once daily`,
        notes: 'First-line for suspected TSS from GAS or S. aureus. Add Clindamycin to inhibit toxin production.',
      });
      doses.push({
        drugName: 'Clindamycin (IV) — TSS toxin inhibitor',
        dose: `${clindaTSS} mg (10 mg/kg, max 900 mg/dose) IV every 8 h`,
        notes: 'Add to beta-lactam for streptococcal or staphylococcal TSS. Do NOT use as monotherapy.',
      });
      doses.push({
        drugName: 'Amoxicillin (PO) — scarlet fever / GAS pharyngitis',
        dose: `${amoxMg} mg (approx 50 mg/kg/day ÷ 3, max 500 mg/dose) PO 3 times daily × 10 days`,
        notes: 'First-line for uncomplicated scarlet fever. Complete full 10-day course to prevent rheumatic fever.',
      });
    }

    // RMSF / tick exposure
    if (tickExp) {
      const doxMg = Math.min(2.2 * wt, 100).toFixed(1);
      doses.push({
        drugName: 'Doxycycline (IV or PO) — RMSF / rickettsial disease',
        dose: `${doxMg} mg (2.2 mg/kg, max 100 mg/dose) every 12 h`,
        notes: 'SAFE and indicated in children of ALL ages for RMSF (AAP Red Book 2021 + CDC). Give IV if ill or not tolerating oral. Continue for ≥ 3 days after fever resolves (typically 5–7 days total). Do NOT wait for serology to confirm before starting.',
      });
    }

    // Kawasaki
    if (fever5d) {
      const aspirinHigh = (80 * wt).toFixed(0);
      const aspirinLow  = (5 * wt).toFixed(0);
      doses.push({
        drugName: 'IVIG (IV) — Kawasaki disease',
        dose: `${(2 * wt).toFixed(0)} mg (2 g/kg) IV as a single infusion over 10–12 hours`,
        notes: 'Administer after echo confirms or echocardiographic review is complete. Give alongside high-dose aspirin. Re-dose if fever persists > 36 h after first IVIG.',
      });
      doses.push({
        drugName: 'Aspirin (PO) — Kawasaki: anti-inflammatory phase',
        dose: `${aspirinHigh} mg (80 mg/kg/day) divided every 6 h while febrile`,
        notes: `Switch to antiplatelet dose ${aspirinLow} mg (5 mg/kg/day) once daily after afebrile for 48–72 h. Continue antiplatelet dose until echo confirms normal coronary arteries at 6–8 weeks.`,
      });
    }

    // Vesicular — varicella / HSV
    if (isVesic) {
      const acycIV  = (10 * wt).toFixed(0);
      const acycNeo = (20 * wt).toFixed(0);
      const acycPO  = Math.min(20 * wt, 800).toFixed(0);
      if (ageM < 3) {
        doses.push({
          drugName: 'Acyclovir (IV) — neonatal HSV / severe disseminated infection',
          dose: `${acycNeo} mg (20 mg/kg/dose) IV every 8 h`,
          notes: 'For neonatal or disseminated HSV. Continue until PCR results return. Duration: 14 days (skin/eye/mouth HSV) or 21 days (CNS/disseminated HSV).',
        });
      } else {
        doses.push({
          drugName: 'Acyclovir (IV) — severe VZV / eczema herpeticum',
          dose: `${acycIV} mg (10 mg/kg/dose, max 800 mg/dose) IV every 8 h`,
          notes: 'For eczema herpeticum, immunocompromised child with varicella, or severe primary VZV. Continue for 7 days or until lesions crusted.',
        });
        doses.push({
          drugName: 'Acyclovir (PO) — mild varicella (> 2 years, within 72 h of rash onset)',
          dose: `${acycPO} mg (20 mg/kg/dose, max 800 mg/dose) PO 4 times daily × 5 days`,
          notes: 'Only if > 2 years old, within 72 h of rash onset, and moderate-to-severe disease (> 500 lesions or high-risk features). Not routinely required in healthy immunised children with mild varicella.',
        });
      }
    }

    // SSSS cover
    if (skinSloug) {
      const flucloxMg = Math.min(50 * wt, 2000).toFixed(0);
      doses.push({
        drugName: 'Flucloxacillin (IV) — SSSS (Staphylococcal Scalded Skin Syndrome)',
        dose: `${flucloxMg} mg (50 mg/kg, max 2 g/dose) IV every 6 h`,
        notes: 'First-line for SSSS — anti-staphylococcal coverage. If MRSA suspected: use Vancomycin 15 mg/kg q6h instead. NOT indicated for SJS/TEN (drug-mediated, no antibiotic benefit).',
      });
    }

    return doses;
  },

  getReferences: () => [
    { title: 'Weber DJ, Cohen MS, Rutala WA. The acutely ill patient with fever and rash. In: Principles and Practices of Infectious Diseases, 8th ed. Elsevier Saunders 2015', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    { title: 'Levin S, Goodman LJ. An approach to acute fever and rash (AFR) in the adult. Current Clinical Topics in Infectious Diseases 1995', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    { title: 'Newburger JW et al. Diagnosis, treatment, and long-term management of Kawasaki disease. Circulation 2004;110:2747', url: 'https://pubmed.ncbi.nlm.nih.gov/15505111/' },
    { title: 'AAP Red Book 2021: Report of the Committee on Infectious Diseases — RMSF, Varicella, Meningococcal', url: 'https://publications.aap.org/redbook' },
    { title: 'Stevens DL et al. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 IDSA update. Clin Infect Dis 2014;59:147', url: 'https://pubmed.ncbi.nlm.nih.gov/24947530/' },
    { title: 'Durack DT et al. New criteria for diagnosis of infective endocarditis (Duke Criteria). Am J Med 1994;96:200', url: 'https://pubmed.ncbi.nlm.nih.gov/8154507/' },
    { title: 'Ferguson DD et al. Characteristics of the rash associated with West Nile virus fever. Clin Infect Dis 2005;41:1204', url: 'https://pubmed.ncbi.nlm.nih.gov/16206098/' },
    { title: 'Cherry JD. Contemporary infectious exanthems. Clin Infect Dis 1993;16:199', url: 'https://pubmed.ncbi.nlm.nih.gov/8443302/' },
  ],
};
