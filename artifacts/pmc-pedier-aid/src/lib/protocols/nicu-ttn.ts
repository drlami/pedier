import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Transient Tachypnea of the Newborn (TTN)
 * Based on: Reuter et al. Pediatr Rev 2014; Hermansen & Lorah Am Fam Physician 2007
 * Self-limiting condition — management is entirely supportive.
 */
export const nicuTtnProtocol: DiseaseProtocol = {
  id: 'nicu-ttn',
  name: 'Transient Tachypnea of the Newborn (TTN)',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Self-limiting delayed fetal lung fluid clearance in near-term and term neonates — supportive O₂, feeding management, and watchful waiting for spontaneous resolution within 24–72 h.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'TTN is caused by delayed clearance of fetal lung fluid — normally absorbed by catecholamine surge, thoracic squeeze, and lymphatic drainage. It is most common after elective caesarean section without labour (no catecholamine surge), late-preterm infants, and maternal diabetes. The key clinical task is to distinguish TTN from RDS (similar presentation, different prognosis and treatment) and congenital pneumonia. Management is entirely supportive: supplemental O₂, CPAP if FiO₂ > 0.40, and withhold oral feeds while tachypnoeic. TTN resolves within 24–72 h — if it does not, reconsider the diagnosis urgently.',

    stages: [
      {
        label: 'Stage 1: Recognition & Differentiation from RDS',
        shortLabel: 'Recognition',
        color: 'red',
        cards: [
          {
            title: 'Diagnose TTN & Exclude Dangerous Mimics',
            isCritical: true,
            calculator: { id: 'silverman-score', title: 'Silverman-Andersen Retraction Score' },
            orders: [
              'CLINICAL FEATURES: tachypnoea (RR > 60, often 80–120/min) from birth or within 2 h; mild intercostal retractions; grunting (less prominent than RDS); barrel chest (hyperinflation); resolves by 24–72 h.',
              'Score with Silverman-Andersen Retraction Score (calculator below). TTN typically scores 1–4. Score ≥ 6 → reconsider RDS or more severe diagnosis.',
              'CXR PATTERN: hyperinflation (flattened diaphragms), perihilar streaking (retained fluid in lymphatics), fluid in horizontal fissure, mild pleural effusions, wet/hazy appearance. NOT the diffuse ground-glass of RDS.',
              'BLOOD GAS: mild hypoxaemia (PaO₂ 50–70 mmHg on low FiO₂), mild hypercapnia (PaCO₂ 45–55 mmHg) — always less severe than expected from work of breathing. Obtain capillary gas within 1 h of admission.',
              'RISK FACTORS supporting TTN: elective CS at 37–39 weeks, no labour, male sex, macrosomia, maternal diabetes/asthma, maternal sedation.',
              'DIFFERENTIALS — manage in parallel, do NOT delay supportive treatment: (1) RDS — more preterm, worse CXR ground-glass, higher FiO₂ need, → surfactant criteria; (2) Congenital pneumonia / EOS — identical presentation → cultures + ampicillin + gentamicin unless very low risk; (3) MAS — meconium-stained, different CXR; (4) Pneumothorax — asymmetric, sudden; (5) Cyanotic CHD — unresponsive to O₂.',
              'HYPEROXIA TEST if CHD suspected: 10 min of 100% O₂ → PaO₂ > 150 mmHg = cardiac cause unlikely; < 100 mmHg = cyanotic CHD or severe PPHN → urgent echo.',
            ],
            nursing: [
              'Continuous pre-ductal SpO₂ from birth (right hand)',
              'Cardiorespiratory monitoring: HR, RR, SpO₂ every 15 min initially',
              'Measure RR over a full 60 seconds — document exact rate',
              'Record SpO₂ in room air before starting supplemental O₂',
            ],
            triggers: [
              'FiO₂ requirement > 0.50 → reconsider TTN — likely RDS or pneumonia → escalate',
              'No improvement by 6 h → blood gas + senior review → reconsider diagnosis',
              'Silverman score ≥ 6 → severity inconsistent with TTN → consider surfactant',
              'SpO₂ non-responsive to O₂ → hyperoxia test → echo urgently',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Oxygen Support & CPAP',
        shortLabel: 'O₂ / CPAP',
        color: 'amber',
        cards: [
          {
            title: 'Respiratory Support — Stepwise Escalation',
            isCritical: true,
            orders: [
              'STEP 1 — SUPPLEMENTAL O₂: start with low-flow nasal cannula (0.5–2 L/min) or headbox O₂ if FiO₂ ≤ 0.40 needed. Titrate to SpO₂ 91–95%.',
              'STEP 2 — HFNC or CPAP: if FiO₂ > 0.30–0.40 or significant work of breathing despite low-flow O₂ → start HFNC (2–4 L/min) or CPAP 5–6 cmH₂O via nasal prongs.',
              'STEP 3 — CPAP TITRATION: if HFNC insufficient → CPAP, start 5–6 cmH₂O. Max 8 cmH₂O. Exceeding 8 cmH₂O without improvement → reconsider diagnosis (TTN does not usually need high CPAP).',
              'BLOOD GAS TARGETS: SpO₂ 91–95% | PaO₂ 50–80 mmHg | PaCO₂ 45–60 mmHg | pH ≥ 7.25. Obtain blood gas at 1 h and 4 h post-stabilisation or if deteriorating.',
              'DO NOT INTUBATE for TTN alone — TTN is self-limiting. Intubation need → strongly reconsider diagnosis (RDS, pneumonia, or respiratory failure from another cause).',
              'AVOID UNNECESSARY INTERVENTIONS: no surfactant for TTN (retained fluid, not surfactant deficiency). Furosemide has not been shown to accelerate resolution and is NOT recommended.',
            ],
            nursing: [
              'Nasal prong/mask/CPAP interface sizing check every shift',
              'OGT on free drainage while on CPAP to prevent aerophagia',
              'SpO₂ alarm limits: lower 90%, upper 95%',
              'Document FiO₂ at each nursing assessment — aim for downtrend by 6 h',
            ],
            triggers: [
              'FiO₂ > 0.40 on CPAP 6 cmH₂O at 4 h → reconsider RDS → surfactant criteria',
              'pH < 7.22 or PaCO₂ > 65 mmHg → respiratory acidosis inconsistent with TTN → escalate',
              'Apnoea → NOT TTN → urgent evaluation (sepsis, seizure, metabolic)',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Feeding, Fluids & Infection Workup',
        shortLabel: 'Feeding & Infection',
        color: 'indigo',
        cards: [
          {
            title: 'Feeding Hold & IV Fluids',
            orders: [
              'WITHHOLD ORAL FEEDS while RR > 60/min — risk of aspiration into fluid-filled airways.',
              'IV FLUIDS: 10% dextrose at 60–80 mL/kg/day. Check blood glucose within 1 h of admission and 2-hourly until feeds established. Target BG 2.6–5.5 mmol/L.',
              'RESUME FEEDS when RR < 60/min sustained for ≥ 2 h. Start with small volume nasogastric (NG) feeds — 1–2 mL/kg 3-hourly — before offering breast/bottle.',
              'ELECTROLYTES: not routinely needed if resolving within 24 h. Add NaCl to IV fluids from day 2 if not feeding (2–3 mmol/kg/day).',
            ],
            nursing: [
              'Measure and record RR before every feed attempt — do not feed if RR > 60',
              'NG feed tolerance: measure gastric residuals before each feed; discard if bile-stained',
              'Blood glucose q2h until feeds established and stable',
            ],
            triggers: [
              'Bilious aspirate → stop feeds → abdominal XR → surgical review',
              'BG < 2.6 mmol/L → dextrose 10% 2 mL/kg IV bolus → increase GIR',
            ],
          },
          {
            title: 'Infection Cover — Risk-Based Decision',
            orders: [
              'SEPSIS RISK ASSESSMENT: use EOS clinical calculator (birth risk factors: prolonged ROM > 18 h, maternal fever, GBS status, gestational age). Low-risk term infants with classic TTN picture and normal CRP: observe without antibiotics if risk score low.',
              'START ANTIBIOTICS if ANY of: (1) risk score elevated on EOS calculator; (2) maternal fever or chorioamnionitis; (3) prolonged rupture of membranes > 18 h; (4) infant appears unwell or haemodynamically unstable; (5) CXR or blood gas inconsistent with pure TTN.',
              'EMPIRIC: Ampicillin 50 mg/kg/dose (PMA-based interval, see NeoDose) + Gentamicin 4–5 mg/kg (PMA-based, see NeoDose). Blood culture before first dose.',
              'REVIEW AT 36–48 H: if blood cultures negative, CRP normal (< 10 mg/L), and CRP not rising, and clinical picture clearly resolving TTN → STOP antibiotics.',
            ],
            prescriptions: [
              {
                drug: 'Ampicillin',
                dose: '50 mg/kg/dose (PMA-based interval)',
                route: 'IV over 15–30 min',
                frequency: 'See NeoDose for PMA-based interval',
                calculation: (w: number) => `${(50 * w).toFixed(0)} mg per dose`,
                notes: 'If infection risk low and classic TTN — may observe without antibiotics. Stop at 36–48 h if cultures negative.',
              },
              {
                drug: 'Gentamicin',
                dose: '4–5 mg/kg/dose (PMA-based extended interval)',
                route: 'IV over 30 min',
                frequency: 'See NeoDose for PMA-based interval',
                calculation: (w: number) => `${(4.5 * w).toFixed(2)} mg per dose`,
                notes: 'Extended interval. Mandatory TDM — trough < 1 mg/L before 3rd dose.',
              },
            ],
            nursing: [
              'Blood culture before first antibiotic dose — two sets if possible (aerobic)',
              'CRP at admission and at 24 h',
            ],
            triggers: [
              'CRP rising at 24 h → continue antibiotics → repeat culture → senior review',
              'Positive blood culture → targeted antibiotic therapy per sensitivities',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: Resolution, Monitoring & Discharge',
        shortLabel: 'Resolution',
        color: 'emerald',
        cards: [
          {
            title: 'Expected Resolution & Discharge Criteria',
            orders: [
              'EXPECTED TIMELINE: most TTN resolves by 24–48 h. RR normalises (< 60/min), FiO₂ returns to room air, and grunting disappears. Complete resolution by 72 h in virtually all cases.',
              'WEAN O₂ as FiO₂ requirements decrease: CPAP → HFNC → low-flow O₂ → room air. Do not rush O₂ weaning faster than infant tolerates.',
              'IF NOT RESOLVING BY 48 H: MANDATORY reassessment — reconsider RDS (late presentation, partial steroid effect), congenital pneumonia (cultures may still be negative), PPHN, or structural lung anomaly. Consider echo, bronchoscopy, or CT chest in refractory cases.',
              'DISCHARGE CRITERIA: (1) sustained RR < 60/min for ≥ 12 h; (2) SpO₂ stable in room air; (3) tolerating full oral feeds; (4) blood cultures negative (or antibiotics completed); (5) family counselling done.',
            ],
            nursing: [
              'RR documented every nursing assessment — flag upward trend to medical team',
              'Trial of oral feed (breast / bottle) when RR < 60/min — supervised by nurse',
              'Record duration of O₂ support for discharge summary',
            ],
            triggers: [
              'Worsening RR after initial improvement (> 72 h) → re-evaluate → exclude pneumonia, cardiac cause',
              'Unable to wean to room air by 72 h → consult neonatologist → further investigation',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Use Silverman-Andersen Retraction Score to assess severity. TTN typically scores 1–4.'] }),
  getManagement: () => [
    {
      title: 'TTN essentials',
      recommendations: [
        'Supportive O₂ only — no surfactant, no furosemide.',
        'CPAP if FiO₂ > 0.30–0.40. If FiO₂ > 0.50 → reconsider diagnosis.',
        'Withhold oral feeds while RR > 60/min.',
        'Empiric antibiotics if EOS risk factors present. Stop at 36–48 h if cultures negative.',
        'If not resolved by 48 h → mandatory reassessment of diagnosis.',
      ],
    },
  ],
  getDisposition: () => [
    'Admit to NICU or transitional care depending on severity and gestational age.',
    'Term infant with mild TTN (FiO₂ < 0.30, improving) may be managed in a level II nursery.',
    'Discharge home when RR < 60, SpO₂ normal in room air, feeding fully established.',
  ],
  getRedFlags: () => [
    'FiO₂ > 0.50 on CPAP — not consistent with TTN → reconsider RDS',
    'No improvement by 6–8 h on CPAP',
    'Apnoea — never a feature of TTN',
    'SpO₂ non-responsive to supplemental O₂ → hyperoxia test → echo',
    'Not resolved by 48 h → mandatory diagnostic reassessment',
    'Haemodynamic instability — not TTN',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Ampicillin (if infection risk)', dose: w ? `${(50 * w).toFixed(0)} mg/dose` : '50 mg/kg/dose', notes: 'PMA-based interval. Stop at 36–48 h if cultures negative.' },
      { drugName: 'Gentamicin (if infection risk)', dose: w ? `${(4.5 * w).toFixed(2)} mg/dose` : '4–5 mg/kg/dose extended interval', notes: 'Mandatory TDM.' },
    ];
  },
  getReferences: () => [
    { title: 'Reuter S et al. Respiratory Distress in the Newborn. Pediatr Rev 2014', url: 'https://pedsinreview.aappublications.org/content/35/10/417' },
    { title: 'Hermansen CL, Lorah KN. Respiratory Distress in the Newborn. Am Fam Physician 2007', url: 'https://www.aafp.org/pubs/afp/issues/2007/1001/p987.html' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
