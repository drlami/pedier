import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Pulmonary Hemorrhage
 * Based on: Raju TNK et al. J Pediatr 1981; Papworth & Cartlidge Arch Dis Child 1992;
 * NNF 9th ed. (2024); European Consensus Guidelines RDS 2022.
 */
export const nicuPulmonaryHemorrhageProtocol: DiseaseProtocol = {
  id: 'nicu-pulmonary-hemorrhage',
  name: 'Pulmonary Hemorrhage',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Acute hemorrhagic pulmonary oedema — blood-tinged or frank bloody fluid from the airway, usually haemorrhagic pulmonary oedema rather than pure haemorrhage. Medical emergency requiring immediate PEEP escalation and airway control.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'Pulmonary haemorrhage (PH) is actually haemorrhagic pulmonary oedema — a sudden massive capillary leak driven by a surge in pulmonary blood flow, most commonly caused by a haemodynamically significant PDA in a VLBW infant, particularly after surfactant administration (surfactant reduces pulmonary resistance → increases left-to-right ductal shunt → acute pulmonary oedema). Other causes: coagulopathy, severe sepsis, heart failure, MAS, CDH. Management priority: IMMEDIATE HIGH PEEP VENTILATION (6–8 cmH₂O) to tamponade haemorrhage and re-expand oedematous lungs, then correct the underlying cause (PDA closure, coagulopathy correction). Surfactant can be given AFTER haemostasis is achieved — blood inactivates surfactant.',

    stages: [
      {
        label: 'Stage 1: Recognition & Emergency Airway Control',
        shortLabel: 'Emergency',
        color: 'red',
        cards: [
          {
            title: 'Recognise Pulmonary Haemorrhage & Secure Airway',
            isCritical: true,
            orders: [
              'CLINICAL PRESENTATION: sudden acute deterioration in any NICU infant — blood-tinged or frank bloody/pink frothy secretions from nose/mouth or ETT, falling SpO₂, bradycardia, pallor/poor perfusion. Most common in VLBW infants in first 72 h after surfactant or on day 3–5 (PDA surge).',
              'RISK FACTORS: VLBW < 1500 g with hsPDA; recent surfactant administration (within 12 h); coagulopathy (DIC, liver disease, Vit K deficiency); severe sepsis; MAS; IUGR.',
              'INTUBATE IMMEDIATELY if not already intubated. No time for CPAP trial. Secure airway as first priority.',
              'PEEP ESCALATION — THE MOST CRITICAL INTERVENTION: increase PEEP to 6–8 cmH₂O immediately (or higher if needed — up to 10 cmH₂O). High PEEP = pneumatic tamponade of haemorrhage + re-expansion of flooded alveoli. This is the SINGLE MOST IMPORTANT initial manoeuvre.',
              'FiO₂ 1.0 INITIALLY — do not titrate O₂ during acute haemorrhage. Correct hypoxia first.',
              'SUCTION ETT GENTLY ONCE — remove obstructing blood. Do NOT repeatedly suction — risks dislodging clot and worsening haemorrhage. If ETT obstructed with thick blood/clot → change ETT.',
              'ASSESS BLOOD LOSS: is this haemorrhagic pulmonary oedema (dilute, pink-tinged) or massive haemorrhage (frank blood)? Former is more common; latter may require blood transfusion.',
            ],
            nursing: [
              'Call for help immediately — this is a NICU emergency requiring senior + extra staff',
              'Note colour and character of pulmonary secretions (pink/frothy vs. frank red blood)',
              'Place additional IV access if only one line in situ',
              'Prepare blood products: PRBC, FFP, platelets — contact blood bank immediately',
            ],
            triggers: [
              'HR < 60 or cardiac arrest → CPR + epinephrine 0.01–0.03 mg/kg IV → continue resuscitation',
              'Massive blood loss (estimated > 10% blood volume) → emergency PRBC transfusion (10 mL/kg O-negative or crossmatched)',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Ventilation Strategy',
        shortLabel: 'Ventilation',
        color: 'indigo',
        cards: [
          {
            title: 'Ventilator Management & OI Assessment',
            isCritical: true,
            calculator: { id: 'oi-calc', title: 'Oxygenation Index (OI) Calculator' },
            orders: [
              'VENTILATOR MODE: SIMV+VG or A/C+VG. Volume-targeted preferred to limit volutrauma once haemostasis achieved.',
              'PEEP: maintain 6–8 cmH₂O (higher than standard RDS). Reduces capillary leak by increasing transpulmonary pressure. Reassess at 1 h — if bleeding controlled, reduce gradually (no faster than 1 cmH₂O per 4 h) to 5–6 cmH₂O.',
              'TIDAL VOLUME: 4–5 mL/kg. PIP will be high initially (flooded lungs → low compliance). Volume-targeting limits volutrauma automatically.',
              'RESPIRATORY RATE: 50–60/min — short expiratory time helps maintain PEEP effect and reduces air trapping.',
              'FiO₂: start at 1.0. Wean to SpO₂ 91–95% once haemorrhage controlled.',
              'GAS TARGETS: SpO₂ 91–95% | PaO₂ 50–80 mmHg | PaCO₂ 45–60 mmHg | pH ≥ 7.22. Blood gas at 30 min post-intubation then 2-hourly until stable. Calculate OI (above) to track improvement.',
              'HFOV: escalate if OI > 13 or PIP > 25 cmH₂O required. HFOV MAP strategy: MAP 12–16 cmH₂O (high MAP for recruitment of flooded alveoli). Frequency: 10–12 Hz.',
              'SEDATION + PARALYSIS: morphine 0.01–0.02 mg/kg/h + consider vecuronium 0.1 mg/kg IV for initial 4–6 h in severe cases — reduces patient-ventilator dyssynchrony and O₂ consumption during acute phase.',
            ],
            prescriptions: [
              {
                drug: 'Morphine (sedation/analgesia)',
                dose: '0.01–0.02 mg/kg/h',
                route: 'IV continuous',
                frequency: 'Continuous infusion',
                calculation: (w: number) => `${(0.01 * w).toFixed(4)}–${(0.02 * w).toFixed(4)} mg/h`,
                notes: 'Essential sedation during acute phase. Reduce once stable.',
              },
              {
                drug: 'Vecuronium (if needed)',
                dose: '0.1 mg/kg IV',
                route: 'IV bolus',
                frequency: 'q1–2h PRN or short infusion 0.1 mg/kg/h',
                calculation: (w: number) => `${(0.1 * w).toFixed(3)} mg per bolus`,
                notes: 'Short-acting paralysis for acute dyssynchrony. Ensure adequate sedation first.',
              },
            ],
            nursing: [
              'Ventilator PEEP: verify set vs. delivered PEEP every 30 min during acute phase',
              'Blood gas timing: 30 min post-intubation, then 2-hourly until stable',
              'ETT: if blood visible in ETT → gentle single suction only. If ETT blocked → change ETT immediately',
            ],
            triggers: [
              'OI > 20 → HFOV immediately',
              'Haemorrhage not controlled at 1 h → reassess cause (PDA? DIC?) → escalate treatment',
              'PaO₂ < 40 mmHg despite FiO₂ 1.0 + PEEP 8 + HFOV → consider PPHN component → iNO',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Haemostasis & Cause Management',
        shortLabel: 'Haemostasis',
        color: 'amber',
        cards: [
          {
            title: 'Correct Coagulopathy & Treat Underlying Cause',
            isCritical: true,
            orders: [
              'COAGULATION SCREEN: FBC, PT, APTT, fibrinogen, D-dimer — urgently. Correct any coagulopathy simultaneously with ventilation management.',
              'FFP: 10–15 mL/kg IV if PT/APTT prolonged (> 1.5× normal). Give over 30–60 min.',
              'PLATELETS: transfuse if < 50,000/mm³ in the context of active bleeding. Target platelets > 100,000 during active pulmonary haemorrhage.',
              'CRYOPRECIPITATE: 5–10 mL/kg IV if fibrinogen < 1.5 g/L.',
              'VITAMIN K₁: 0.3 mg/kg IV (max 10 mg) if deficiency suspected (prolonged PT, unwell infant not given Vit K at birth).',
              'PRBC TRANSFUSION: 10–20 mL/kg PRBC (10 mL/kg if haemodynamically unstable) if Hct < 35% or estimated blood loss significant. Group O-negative immediately if no crossmatch available.',
              'PDA MANAGEMENT — PRIMARY CAUSE IN MOST CASES: echo to confirm hsPDA. AFTER haemostasis is achieved → indomethacin or ibuprofen for PDA closure. DO NOT give NSAIDs during active haemorrhage — platelet dysfunction. Use paracetamol IV (15 mg/kg q6h × 3–7 days) if NSAIDs contraindicated or before haemostasis.',
              'EPINEPHRINE INTRATRACHEAL (some centres): 0.1 mL/kg of 1:10,000 (= 0.01 mg/kg) instilled via ETT for immediate local vasoconstriction. Evidence limited — use only in severe uncontrolled haemorrhage as a bridge.',
            ],
            prescriptions: [
              {
                drug: 'FFP',
                dose: '10–15 mL/kg',
                route: 'IV over 30–60 min',
                frequency: 'Repeat if coagulopathy persists at 4 h',
                calculation: (w: number) => `${(10 * w).toFixed(0)}–${(15 * w).toFixed(0)} mL`,
                notes: 'For PT/APTT > 1.5× normal. Recheck coagulation 30 min post-infusion.',
              },
              {
                drug: 'Vitamin K₁',
                dose: '0.3 mg/kg IV (max 10 mg)',
                route: 'IV over 10–20 min',
                frequency: 'Single dose (repeat if no response at 6 h)',
                calculation: (w: number) => `${(0.3 * w).toFixed(2)} mg (max 10 mg)`,
                notes: 'For haemorrhagic disease of newborn or Vit K deficiency. Give slowly — anaphylaxis risk.',
              },
              {
                drug: 'Paracetamol IV (PDA closure post-haemostasis)',
                dose: '15 mg/kg/dose q6h × 3–7 days',
                route: 'IV over 15 min',
                frequency: 'q6h — start only after haemostasis achieved',
                calculation: (w: number) => `${(15 * w).toFixed(0)} mg per dose`,
                notes: 'Renal/platelet-sparing alternative to NSAIDs. Monitor LFTs. Echo to confirm PDA closure.',
              },
            ],
            nursing: [
              'FFP and platelets: verify ABO compatibility before infusion; infuse via blood filter',
              'Transfusion: monitor for reactions (fever, rash, hypotension) — stop transfusion if suspected',
              'Document blood product volumes in fluid balance (count toward daily fluid total)',
            ],
            triggers: [
              'Haemorrhage continues after coagulopathy corrected + PDA treated → DIC → haematology consult',
              'Hct < 25% → PRBC 10 mL/kg urgently',
              'Fibrinogen < 1.0 g/L despite FFP → cryoprecipitate 10 mL/kg',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: Surfactant & Recovery',
        shortLabel: 'Recovery',
        color: 'emerald',
        cards: [
          {
            title: 'Post-Haemostasis Surfactant & Weaning',
            orders: [
              'SURFACTANT AFTER HAEMOSTASIS: blood inactivates surfactant → secondary RDS after pulmonary haemorrhage. Give Calfactant (Infasurf) 3 mL/kg via ETT AFTER haemorrhage is controlled (no new bloody secretions for ≥ 1–2 h). Do NOT give surfactant during active haemorrhage.',
              'SURFACTANT MONITORING: after PH, surfactant compliance improvement may be rapid but less dramatic than in primary RDS. Wean FiO₂ actively but monitor for rebleeding (sudden compliance change may indicate new haemorrhage).',
              'PDA SURVEILLANCE: echo at 24 h post-haemorrhage. Repeat PDA closure treatment (2nd course NSAIDs/paracetamol) if PDA re-opened or hsPDA persists.',
              'WEANING PEEP: once stable and bleeding controlled for ≥ 12 h → reduce PEEP from 8 → 7 → 6 → 5 cmH₂O (1 cmH₂O per 4–8 h). Blood gas after each reduction.',
              'FEEDING: hold oral/NG feeds for minimum 24 h post-haemorrhage. IV TPN while nil by mouth. Resume trophic feeds when stable on PEEP ≤ 6 cmH₂O and FiO₂ ≤ 0.40.',
              'BPD RISK: pulmonary haemorrhage significantly increases BPD risk. Ensure all prevention measures: caffeine, gentle ventilation, O₂ targeting 91–95%.',
              'INVESTIGATIONS AT 48 H: CXR (clearing vs. consolidation), coagulation screen (normalising), echo (PDA status), cranial ultrasound (IVH — associated with systemic haemorrhage).',
            ],
            prescriptions: [
              {
                drug: 'Calfactant (Infasurf) — after haemostasis',
                dose: '3 mL/kg per dose',
                route: 'Intratracheal via ETT (2 aliquots)',
                frequency: 'After haemostasis. Up to 3 doses total q≥12h',
                calculation: (w: number) => `${(3 * w).toFixed(1)} mL per dose; up to ${(9 * w).toFixed(1)} mL total`,
                notes: 'ONLY after haemorrhage controlled. Swirl — do not shake.',
              },
            ],
            nursing: [
              'ETT secretion character every 2 h: note any return of blood-tinged secretions',
              'PEEP wean: document PEEP setting and corresponding blood gas',
              'CXR: ensure performed at 24 h and 48 h post-haemorrhage',
            ],
            triggers: [
              'Return of blood-tinged ETT secretions during recovery → STOP PEEP wean → reassess PDA + coagulation',
              'IVH on cranial US → IVH prevention measures (see IVH protocol)',
              'Persistent O₂ requirement at 28 days → BPD criteria → BPD protocol',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Calculate OI (Stage 2 calculator). PEEP 6–8 cmH₂O is the single most important initial intervention.'] }),
  getManagement: () => [
    {
      title: 'Pulmonary haemorrhage essentials',
      recommendations: [
        'Intubate immediately. PEEP 6–8 cmH₂O = pneumatic tamponade — do this FIRST.',
        'FiO₂ 1.0 initially. Suction ETT once gently — do NOT repeatedly suction.',
        'Correct coagulopathy: FFP, platelets, cryoprecipitate, Vit K as needed.',
        'PDA is the most common cause — echo → close with paracetamol/NSAIDs AFTER haemostasis.',
        'Surfactant (Infasurf) only AFTER haemorrhage controlled (≥ 1–2 h no bloody secretions).',
        'HFOV if OI > 13 or PIP > 25 cmH₂O.',
      ],
    },
  ],
  getDisposition: () => [
    'All pulmonary haemorrhage → Level III NICU immediately.',
    'Transfer to tertiary centre if OI > 25 and HFOV unavailable locally.',
  ],
  getRedFlags: () => [
    'Bloody ETT secretions in any NICU infant → assume pulmonary haemorrhage → escalate PEEP immediately',
    'HR < 100 + bloody secretions → imminent cardiac arrest → CPR protocol',
    'OI > 20 → HFOV',
    'Fibrinogen < 1.0 g/L → severe DIC → FFP + cryoprecipitate + haematology',
    'Return of haemorrhage after initial control → PDA re-opened or DIC → reassess',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'FFP', dose: w ? `${(10 * w).toFixed(0)}–${(15 * w).toFixed(0)} mL` : '10–15 mL/kg', notes: 'For PT/APTT > 1.5× normal.' },
      { drugName: 'Vitamin K₁', dose: w ? `${(0.3 * w).toFixed(2)} mg (max 10 mg)` : '0.3 mg/kg (max 10 mg)', notes: 'IV slowly. Anaphylaxis risk.' },
      { drugName: 'Calfactant (Infasurf)', dose: w ? `${(3 * w).toFixed(1)} mL/dose` : '3 mL/kg/dose', notes: 'ONLY after haemostasis confirmed. Up to 3 doses q≥12h.' },
      { drugName: 'Paracetamol IV (PDA)', dose: w ? `${(15 * w).toFixed(0)} mg/dose q6h` : '15 mg/kg q6h × 3–7 days', notes: 'After haemostasis. Platelet-sparing PDA closure.' },
    ];
  },
  getReferences: () => [
    { title: 'Papworth S, Cartlidge PHT. Pulmonary haemorrhage in neonates. Arch Dis Child 1992', url: 'https://pubmed.ncbi.nlm.nih.gov/1586152/' },
    { title: 'European Consensus Guidelines on RDS (2022)', url: 'https://www.karger.com/Article/FullText/528914' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
