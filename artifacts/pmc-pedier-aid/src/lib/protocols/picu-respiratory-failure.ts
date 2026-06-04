import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Acute respiratory failure (Master Management Pathway).
 *
 * Authored as structured `mmpData` so it renders as the staged consultant
 * pathway (orders [DR] / nursing [NS] / escalation triggers [!] /
 * weight-based prescriptions) and stays fully admin-editable as data.
 * The getX() functions are retained as a fallback / data layer.
 */
export const picuRespiratoryFailureProtocol: DiseaseProtocol = {
  id: 'picu-respiratory-failure',
  name: 'Respiratory failure approach',
  system: 'Respiratory & Airway',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Recognition and graded escalation of acute respiratory failure: Type I (hypoxemic) vs Type II (hypercapnic), and the support ladder from oxygen to invasive ventilation.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'Respiratory failure is a clinical diagnosis — treat the child, not the gas. First decide the TYPE: Type I (hypoxemic — oxygenation problem → recruit: HFNC/CPAP, raise FiO2/PEEP) vs Type II (hypercapnic — ventilation problem → support ventilation: BiPAP or intubate). Escalate stepwise but do NOT delay intubation for apnea, exhaustion, a rising CO2 with falling pH, or an unprotected airway. Always hunt the reversible cause in parallel.',
    stages: [
      {
        label: 'Stage 1: Recognise & Resuscitate',
        shortLabel: 'Recognise',
        color: 'blue',
        cards: [
          {
            title: 'Rapid recognition & failure type',
            orders: [
              'Classify: Type I (hypoxemic) — SpO2 < 90% despite O2, normal/low PaCO2. Type II (hypercapnic) — PaCO2 > 50 mmHg with pH < 7.35. Mixed if both.',
              'Assess work of breathing: retractions, nasal flaring, grunting, head-bobbing, see-saw breathing.',
              'Obtain an immediate blood gas (capillary or arterial) — pH, PaCO2, PaO2, lactate.',
              'Identify the pattern: upper airway, lower airway, parenchymal, or central/neuromuscular cause.',
            ],
            nursing: [
              'Continuous SpO2 + cardiorespiratory monitoring',
              'Full set of vitals incl. RR, HR, BP, temperature',
              'Position airway; suction secretions',
              'Glucose check',
            ],
            triggers: [
              'Inadequate / feeble respiratory effort or gasping',
              'SpO2 not maintained on current support',
              'Drowsiness or falling GCS',
            ],
          },
          {
            title: 'Immediate oxygenation & airway',
            isCritical: true,
            orders: [
              'Apply oxygen to target SpO2 ≥ 94% (88–92% if chronic CO2 retention or cyanotic CHD).',
              'Open and support the airway: positioning, suction, airway adjunct if obstructed.',
              'If apnea, bradycardia, or exhaustion → start bag-mask ventilation immediately and call for help.',
              'Establish IV/IO access; send bloods (CBC, CRP, culture, electrolytes, gas).',
            ],
            nursing: [
              'Prepare bag-mask + appropriately sized mask',
              'Have suction and oxygen at the bedside',
              'Call senior / PICU early',
            ],
            triggers: [
              'Apnea or bradycardia (peri-arrest) — start BMV now',
              'No improvement after initial oxygen',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Escalation Ladder',
        shortLabel: 'Escalate',
        color: 'amber',
        cards: [
          {
            title: 'Stepwise respiratory support',
            orders: [
              'Step 1 — Low-flow O2 (nasal cannula / face mask) for isolated mild hypoxemia.',
              'Step 2 — High-flow nasal cannula (HFNC) at 2 L/kg/min for increased work of breathing or persistent hypoxemia.',
              'Step 3 — CPAP for hypoxemic (Type I) failure; BiPAP/NIV for hypercapnic (Type II) failure — only if airway-protective and cooperative.',
              'Step 4 — Invasive ventilation if NIV fails, airway is unsafe, or failure is impending (see Mechanical ventilation protocol).',
              'Reassess work of breathing and repeat gas within 1 hour of each escalation step.',
            ],
            nursing: [
              'Titrate FiO2 to SpO2 target',
              'Monitor for gastric distension on NIV (consider NG tube)',
              'Document response to each step',
            ],
            triggers: [
              'No improvement / deterioration 1 hour after starting NIV',
              'Rising PaCO2 with falling pH on NIV',
              'Patient unable to protect airway',
            ],
          },
          {
            title: 'Intubation / RSI preparation',
            isCritical: true,
            threshold: 'IF NIV FAILS OR IMPENDING FAILURE',
            orders: [
              'Call senior + PICU + anaesthesia/airway team.',
              'Pre-oxygenate (100% O2 via NRB or BMV) for 3–5 minutes.',
              'Prepare suction, correctly sized ETT (uncuffed = age/4 + 4; cuffed = age/4 + 3.5), laryngoscope, and end-tidal CO2.',
              'Draw up RSI drugs (see prescriptions) and a fluid bolus / vasopressor for peri-intubation hypotension.',
            ],
            nursing: [
              'Apply continuous EtCO2 / monitoring',
              'Confirm IV/IO patency × 2 if possible',
              'Prepare post-intubation sedation infusion',
            ],
            prescriptions: [
              {
                drug: 'Ketamine',
                dose: '1–2 mg/kg',
                route: 'IV',
                frequency: 'Induction',
                calculation: (w: number) => `${(1.5 * w).toFixed(1)} mg`,
                notes: 'Induction agent of choice in shock/asthma — preserves BP and bronchodilates.',
              },
              {
                drug: 'Rocuronium',
                dose: '1 mg/kg',
                route: 'IV',
                frequency: 'Paralysis',
                calculation: (w: number) => `${(1 * w).toFixed(1)} mg`,
                notes: 'Onset ~60 s. Alternative: suxamethonium 1–2 mg/kg (avoid in hyperkalemia).',
              },
              {
                drug: 'Atropine',
                dose: '0.02 mg/kg (min 0.1 mg)',
                route: 'IV',
                frequency: 'Premed (optional)',
                calculation: (w: number) => `${Math.min(Math.max(0.02 * w, 0.1), 0.5).toFixed(2)} mg`,
                notes: 'Consider in infants/young children to blunt vagal bradycardia.',
              },
            ],
            triggers: [
              'SpO2 < 90% despite high-flow O2 or NIV',
              'Exhaustion / inadequate respiratory effort',
              'PaCO2 rising with pH < 7.25',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Post-Intubation & Refractory',
        shortLabel: 'Refractory',
        color: 'red',
        cards: [
          {
            title: 'Lung-protective ventilation & refractory hypoxemia',
            calculator: { id: 'oi-calc', title: 'Oxygenation Index (OI) Calculator' },
            orders: [
              'Confirm ETT position: EtCO2 + bilateral air entry + CXR. Secure tube; note depth.',
              'Lung-protective settings: tidal volume 5–6 mL/kg, plateau pressure < 28–30 cmH2O, titrate PEEP/FiO2 to oxygenation.',
              'Permissive hypercapnia acceptable if pH ≥ 7.25 (avoid in raised ICP / pulmonary hypertension).',
              'Calculate Oxygenation Index (OI) — see Calculators. Persistent OI ≥ 16 or refractory hypoxemia → discuss HFOV and PICU consultant.',
            ],
            nursing: [
              'Head of bed 30°; oral care; cuff-pressure checks',
              'Start sedation ± analgesia infusion',
              'Hourly ventilator observations',
            ],
            triggers: [
              'Acute desaturation — work through DOPES (Displacement, Obstruction, Pneumothorax, Equipment, Stacking)',
              'Plateau pressure > 30 cmH2O',
              'OI ≥ 16 despite optimisation',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Identify & Treat the Cause',
        shortLabel: 'Cause',
        color: 'emerald',
        cards: [
          {
            title: 'Treat reversible causes in parallel',
            orders: [
              'Lower airway (asthma/bronchiolitis) — bronchodilators, steroids, consider magnesium.',
              'Parenchymal (pneumonia/ARDS) — antibiotics, fluid balance, lung-protective ventilation.',
              'Upper airway (croup/FB/anaphylaxis) — adrenaline (nebulised/IM), specific therapy, ENT/airway.',
              'Central/neuromuscular — reverse opioids (naloxone), treat seizures, support ventilation.',
              'CXR for every child: consolidation, effusion, pneumothorax, hyperinflation, ETT position.',
            ],
            nursing: [
              'Strict fluid balance charting',
              'Send respiratory viral PCR / cultures as ordered',
              'Reassess after each targeted therapy',
            ],
          },
        ],
      },
    ],
  },

  // --- Data layer / fallback (not rendered in the MMP pathway view) ---
  calculateSeverity: (data: FormData): Severity => {
    const level: SeverityLevel = 'unknown';
    return { level, details: ['See Master Management Pathway above.'] };
  },
  getManagement: () => [
    {
      title: 'Escalation ladder',
      recommendations: [
        'O2 → HFNC (2 L/kg/min) → CPAP (Type I) / BiPAP (Type II) → invasive ventilation.',
        'Do not delay intubation for apnea, exhaustion, rising CO2 with acidosis, or unprotected airway.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU/HDU; intubate and admit to PICU if impending failure.'],
  getRedFlags: () => [
    'Apnea or bradycardia (peri-arrest)',
    'SpO2 < 90% despite high-flow oxygen',
    'Rising PaCO2 with falling pH',
    'Silent chest / inadequate respiratory effort',
    'Drowsiness or unresponsiveness',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    const mg = (perKg: number) => (w ? `${(perKg * w).toFixed(1)} mg` : `${perKg} mg/kg`);
    return [
      { drugName: 'Ketamine (induction)', dose: mg(1.5), notes: '1–2 mg/kg IV — preserves airway reflexes & BP.' },
      { drugName: 'Rocuronium (paralysis)', dose: mg(1), notes: '1 mg/kg IV, onset ~60 s.' },
    ];
  },
  getReferences: () => [
    { title: 'PALS — Recognition of Respiratory Distress and Failure (AHA)', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
    { title: 'PALICC-2 — Pediatric ARDS / oxygenation consensus', url: 'https://journals.lww.com/pccmjournal/fulltext/2023/02000/second_pediatric_acute_lung_injury_consensus.10.aspx' },
  ],
};
