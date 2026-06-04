import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Congenital Pneumonia
 * Based on: AAP EOS guidelines 2018; NICE NG195 2021; NNF 9th ed.
 * Clinically indistinguishable from RDS — always treat both in parallel.
 */
export const nicuCongenitalPneumoniaProtocol: DiseaseProtocol = {
  id: 'nicu-congenital-pneumonia',
  name: 'Congenital Pneumonia',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Pneumonia acquired in utero or at birth — GBS, E. coli, Listeria, and other EOS pathogens. Clinically and radiologically indistinguishable from RDS. Always treat respiratory distress AND initiate antibiotics simultaneously.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'Congenital pneumonia is the neonatal equivalent of community-acquired pneumonia acquired before or during delivery — predominantly caused by GBS, E. coli, Klebsiella, Listeria monocytogenes, and occasionally viral agents (HSV, CMV). It is INDISTINGUISHABLE from RDS clinically and on CXR. The cardinal rule: NEVER delay antibiotics while awaiting diagnostic certainty. Start ampicillin + gentamicin within 1 hour of clinical concern, provide the same respiratory support as for RDS (including surfactant if criteria met — infection inactivates surfactant), and reassess at 36–48 h. A positive blood culture confirms the diagnosis; negative cultures do not exclude it if the clinical trajectory is consistent.',

    stages: [
      {
        label: 'Stage 1: Recognition & Sepsis Workup',
        shortLabel: 'Recognition',
        color: 'red',
        cards: [
          {
            title: 'Diagnose Congenital Pneumonia & Initiate Workup',
            isCritical: true,
            calculator: { id: 'silverman-score', title: 'Silverman-Andersen Retraction Score' },
            orders: [
              'CLINICAL FEATURES: respiratory distress (tachypnoea, grunting, retractions, cyanosis) from birth or within 4 h — identical to RDS. Score severity with Silverman-Andersen (calculator below).',
              'RISK FACTORS for congenital pneumonia (any one raises probability): prolonged rupture of membranes (PROM) > 18 h; maternal fever ≥ 38°C in labour; maternal group B Streptococcus (GBS) colonisation without adequate intrapartum prophylaxis; clinical chorioamnionitis (maternal fever + uterine tenderness + maternal tachycardia); infant born through meconium or foul-smelling liquor; preterm labour without clear obstetric cause.',
              'CXR FINDINGS: may be identical to RDS (bilateral haziness), or patchy/lobar consolidation, pleural effusion, or even a normal CXR in early congenital pneumonia. CXR cannot reliably distinguish from RDS.',
              'INVESTIGATIONS — obtain before first antibiotic dose: (1) Blood culture × 2 (aerobic); (2) FBC + differential (neutropaenia < 1.5×10⁹/L or neutrophilia > 30×10⁹/L significant); (3) CRP (may be normal in first 6–12 h); (4) Nasopharyngeal aspirate (NPA) or ET aspirate for Gram stain + culture; (5) LP only if clinical meningitis suspected or blood culture positive — do NOT delay antibiotics for LP if infant is unstable.',
              'DIFFERENTIALS MANAGED IN PARALLEL: RDS (give surfactant if criteria met — they are not mutually exclusive); TTN (lower risk, classic history); MAS (post-dates, meconium); pneumothorax; cyanotic CHD.',
            ],
            nursing: [
              'Continuous SpO₂ (pre-ductal), HR, RR monitoring from admission',
              'Blood cultures before first antibiotic — label site and time',
              'Temperature monitoring (hypothermia in GBS sepsis is as significant as fever)',
              'Document maternal history: ROM duration, GBS status, maternal antibiotics',
            ],
            triggers: [
              'Haemodynamic instability (poor perfusion, hypotension) → septic shock → see Neonatal Shock protocol',
              'Blood culture positive → notify senior → adjust antibiotics per sensitivities',
              'NPA Gram stain positive for organisms → report to team immediately',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Respiratory Support',
        shortLabel: 'Respiratory Support',
        color: 'amber',
        cards: [
          {
            title: 'Respiratory Support — Same as RDS Protocol',
            isCritical: true,
            orders: [
              'CPAP FIRST-LINE: start 6 cmH₂O via binasal prongs. Titrate to 8–10 cmH₂O if needed. FiO₂ to maintain SpO₂ 91–95%.',
              'SURFACTANT (Calfactant/Infasurf): give if FiO₂ > 0.30 on CPAP ≥ 5 cmH₂O — bacterial pneumonia inactivates surfactant and criteria overlap with RDS. Do NOT withhold surfactant because of suspected infection.',
              'BLOOD GAS TARGETS: SpO₂ 91–95% | PaO₂ 50–80 mmHg | PaCO₂ 45–60 mmHg | pH ≥ 7.22. Capillary gas at 1 h, 4 h, then 6-hourly until stable.',
              'CPAP FAILURE CRITERIA (intubate if ANY): FiO₂ > 0.50 on CPAP ≥ 8 cmH₂O; pH < 7.20; PaCO₂ > 65 mmHg; apnoea requiring PPV; haemodynamic instability.',
              'VENTILATOR SETTINGS if intubated: Mode SIMV+VG or A/C+VG | VT 4–5 mL/kg | PEEP 5–7 cmH₂O | RR 40–60/min | IT 0.3–0.4 s | FiO₂ to SpO₂ target. Permissive hypercapnia acceptable.',
            ],
            prescriptions: [
              {
                drug: 'Calfactant (Infasurf)',
                dose: '3 mL/kg per dose (= 105 mg phospholipids/kg)',
                route: 'Intratracheal via LISA/MIST or ETT',
                frequency: 'Up to 3 doses total, each ≥ 12 h apart',
                calculation: (w: number) => `${(3 * w).toFixed(1)} mL per dose; up to ${(9 * w).toFixed(1)} mL total`,
                notes: 'Infection inactivates surfactant — give if FiO₂ > 0.30 on CPAP. Swirl, do not shake.',
              },
            ],
            nursing: [
              'CPAP prong size and fit check every 2 h in first 12 h',
              'OGT free drainage on CPAP',
              'Post-surfactant: FiO₂ and SpO₂ every 5 min for 30 min — anticipate rapid FiO₂ reduction',
            ],
            triggers: [
              'FiO₂ not improving after surfactant → consolidation > atelectasis → antibiotics remain key',
              'OI > 13 → HFOV escalation criteria (as per RDS ventilation protocol)',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Antibiotic Management',
        shortLabel: 'Antibiotics',
        color: 'indigo',
        cards: [
          {
            title: 'Empiric Antibiotics — Start Within 1 Hour',
            isCritical: true,
            orders: [
              'EMPIRIC REGIMEN: Ampicillin + Gentamicin — covers GBS, E. coli, Listeria (the three most important EOS pathogens). Start within 1 h of clinical concern — do NOT wait for culture results.',
              'AMPICILLIN dose: 50 mg/kg/dose IV (interval by PMA — see NeoDose). For suspected meningitis: 100 mg/kg/dose.',
              'GENTAMICIN dose: 4–5 mg/kg/dose IV over 30 min (extended interval by PMA — see NeoDose). Mandatory TDM: trough < 1 mg/L before 3rd dose.',
              'IF MRSA RISK (nosocomial, skin/soft tissue signs, or known MRSA colonisation): add Vancomycin 20 mg/kg (PMA-based interval, see NeoDose) until cultures available.',
              'IF PNEUMOCYSTIS (jirovecii) RISK (HIV-exposed, severe combined immunodeficiency): add Co-trimoxazole — discuss with ID/immunology.',
              'LP INDICATIONS: perform lumbar puncture IF (1) positive blood culture; (2) clinical meningitis signs (bulging fontanelle, seizures, neck stiffness); (3) clinical deterioration despite 48 h of antibiotics with negative cultures. Do NOT perform LP in haemodynamically unstable infants — defer and start meningitis-dose ampicillin.',
            ],
            prescriptions: [
              {
                drug: 'Ampicillin',
                dose: '50 mg/kg/dose (100 mg/kg if meningitis suspected)',
                route: 'IV over 15–30 min',
                frequency: 'PMA-based — see NeoDose',
                calculation: (w: number) => `${(50 * w).toFixed(0)} mg/dose (meningitis: ${(100 * w).toFixed(0)} mg/dose)`,
                notes: 'Cover GBS + Listeria. If meningitis: 100 mg/kg q6h minimum.',
              },
              {
                drug: 'Gentamicin',
                dose: '4–5 mg/kg/dose extended interval',
                route: 'IV over 30 min',
                frequency: 'PMA-based extended interval — see NeoDose',
                calculation: (w: number) => `${(4.5 * w).toFixed(2)} mg/dose`,
                notes: 'Extended interval. Mandatory TDM — trough before 3rd dose, target < 1 mg/L.',
              },
            ],
            nursing: [
              'Antibiotic time-to-first-dose documentation — target < 60 min from decision',
              'Blood cultures: site, time, volume (minimum 1 mL per bottle)',
              'Antibiotic allergy cross-check before administration',
            ],
            triggers: [
              'Deterioration despite 48 h antibiotics + negative cultures → LP + broaden cover + ID consult',
              'Positive blood culture with Gram-negative organism → review gentamicin susceptibility; consider cefotaxime for meningitis cover',
              'HSV risk (vesicles, maternal HSV, CSF pleocytosis) → add aciclovir 20 mg/kg q8h',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: Culture Results & De-escalation',
        shortLabel: 'De-escalation',
        color: 'amber',
        cards: [
          {
            title: 'Antibiotic Review at 36–48 Hours',
            orders: [
              'REVIEW AT 36–48 H: if blood cultures NEGATIVE + CRP < 10 mg/L (or not rising) + infant clinically improving + presentation now consistent with RDS/TTN rather than sepsis → STOP antibiotics.',
              'DO NOT complete arbitrary 5–7 day courses without microbiological or clinical evidence of infection — antibiotic stewardship is critical in the NICU.',
              'IF GBS CONFIRMED: switch to Penicillin G as definitive agent (50,000 units/kg/dose q12h for sepsis; 100,000 units/kg/dose q6h for meningitis). Continue gentamicin for first 5–7 days for synergy.',
              'IF GRAM-NEGATIVE ORGANISM CONFIRMED (E. coli, Klebsiella): cefotaxime 50 mg/kg q6–12h (PMA-based) for CNS penetration; adjust per sensitivities.',
              'DURATION: bacteraemia without meningitis = 10–14 days. GBS/Gram-negative meningitis = 14–21 days (GBS meningitis minimum 14 days; Gram-negative minimum 21 days or 14 days after CSF sterilisation).',
              'REPEAT CULTURES: blood culture 24–48 h after starting antibiotics to confirm clearance of bacteraemia.',
            ],
            nursing: [
              'Document each antibiotic dose time accurately for duration tracking',
              'Culture results communicated immediately to medical team when received',
            ],
            triggers: [
              'Bacteraemia persistent at 48 h → source control (remove lines), consider antifungal (if Candida), ID consult',
              'Seizures at any point → LP + meningitis cover + EEG + phenobarbital (see Seizures protocol)',
            ],
          },
        ],
      },

      {
        label: 'Stage 5: Complications & Recovery',
        shortLabel: 'Complications',
        color: 'emerald',
        cards: [
          {
            title: 'Complication Surveillance & Recovery',
            orders: [
              'PPHN: up to 30% of severe congenital pneumonia develops PPHN (GBS toxin → pulmonary vasoconstriction). Screen: pre/post-ductal SpO₂ difference > 5–10%; echo for RA/RV pressure. Manage: see PPHN protocol (iNO, sildenafil, HFOV).',
              'BPD RISK: congenital pneumonia in very preterm infants carries significant BPD risk. Ensure O₂ targeting 91–95% throughout; early extubation; caffeine (if premature); optimise nutrition.',
              'IVH: standard prevention — minimal handling, avoid rapid infusions, maintain MAP ≥ GA in weeks, avoid hypocapnia. Cranial US day 1–3, day 7–10 in preterm.',
              'HEARING: aminoglycoside exposure combined with infection increases sensorineural hearing loss risk. Document cumulative gentamicin dose and duration. AABR hearing screen before discharge.',
              'FEEDING: resume oral feeds when RR < 60/min, haemodynamically stable, and not requiring high respiratory support. NG feeds initially; transition to breast/bottle when feeding-safe.',
              'NEURODEVELOPMENTAL FOLLOW-UP: GBS meningitis carries significant risk of sensorineural hearing loss (30%), cognitive impairment, and cerebral palsy. Arrange neurodevelopmental follow-up at 12, 24 months corrected age.',
            ],
            nursing: [
              'Pre/post-ductal SpO₂ paired measurement daily in first week (right hand and right foot)',
              'OFC weekly — head circumference plotted on Fenton chart',
              'Abdominal girth and stool inspection while on antibiotics (NEC risk in preterm)',
            ],
            triggers: [
              'Pre/post-ductal SpO₂ difference > 10% → PPHN developing → see PPHN protocol',
              'Seizures → phenobarbital + LP + EEG (meningitis until proved otherwise)',
              'Abdominal distension + bloody stool while on antibiotics → NEC → NPO + XR',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Use Silverman-Andersen Score for respiratory severity. Antibiotic treatment is not delayed by severity assessment.'] }),
  getManagement: () => [
    {
      title: 'Congenital pneumonia essentials',
      recommendations: [
        'Antibiotics within 1 h — do not wait for culture results.',
        'Empiric: Ampicillin + Gentamicin. Stop at 36–48 h if cultures negative and clinical picture improving.',
        'Surfactant (Infasurf) if FiO₂ > 0.30 on CPAP — infection inactivates surfactant.',
        'Stop at 36–48 h if cultures negative — avoid arbitrary 5–7 day courses.',
        'GBS confirmed → Penicillin G definitive. Gram-negative → cefotaxime.',
        'Screen for PPHN in severe cases. GBS meningitis → 14 days minimum.',
      ],
    },
  ],
  getDisposition: () => [
    'Admit to NICU level III for all with significant respiratory distress or positive cultures.',
    'Level II acceptable for term infant with mild TTN-like picture if improving on low O₂ and cultures are negative at 48 h.',
  ],
  getRedFlags: () => [
    'Haemodynamic instability → neonatal septic shock → escalate vasopressors',
    'Positive blood culture → definitive antibiotics, LP',
    'Pre/post-ductal SpO₂ difference > 10% → PPHN',
    'Seizures → meningitis until proved otherwise → LP + meningitis-dose ampicillin',
    'Not improving at 48 h on ampicillin + gentamicin → broaden cover → ID consult',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Ampicillin', dose: w ? `${(50 * w).toFixed(0)} mg/dose` : '50 mg/kg/dose', notes: 'PMA-based interval. Meningitis: 100 mg/kg/dose.' },
      { drugName: 'Gentamicin', dose: w ? `${(4.5 * w).toFixed(2)} mg/dose` : '4–5 mg/kg/dose', notes: 'Extended interval. TDM mandatory.' },
      { drugName: 'Calfactant (Infasurf)', dose: w ? `${(3 * w).toFixed(1)} mL/dose` : '3 mL/kg/dose', notes: 'If FiO₂ > 0.30 on CPAP. Up to 3 doses q≥12h.' },
      { drugName: 'Penicillin G (if GBS confirmed)', dose: w ? `${(50000 * w).toLocaleString()} units/dose` : '50,000 units/kg/dose', notes: 'Definitive for GBS. Meningitis: 100,000 units/kg/dose q6h × 14 days.' },
    ];
  },
  getReferences: () => [
    { title: 'AAP Committee on Fetus and Newborn. EOS Guidelines 2018', url: 'https://publications.aap.org/pediatrics/article/142/1/e20174029/37843' },
    { title: 'NICE NG195 — Neonatal Infection (2021)', url: 'https://www.nice.org.uk/guidance/ng195' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
