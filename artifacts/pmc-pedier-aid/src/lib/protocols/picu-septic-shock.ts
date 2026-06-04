import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Septic shock bundle (Master Management Pathway).
 * Structured per the Surviving Sepsis Campaign International Guidelines
 * for the management of septic shock in children (2020).
 */
export const picuSepticShockProtocol: DiseaseProtocol = {
  id: 'picu-septic-shock',
  name: 'Septic shock bundle',
  system: 'Shock & Cardiovascular',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Time-critical recognition and the first-hour resuscitation bundle for pediatric septic shock, through fluid-refractory and catecholamine-resistant shock.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'Septic shock is a clinical diagnosis — abnormal perfusion (cold or warm shock) ± hypotension. The first hour saves lives: oxygen, IV/IO access ×2, early antibiotics (within 1 hour), and titrated fluid boluses reassessed after EACH bolus for overload. Move early to epinephrine/norepinephrine — do NOT keep giving fluid into a fluid-refractory child. Catecholamine-resistant shock → add hydrocortisone and correct glucose/calcium. Find and control the source.',
    stages: [
      {
        label: 'Stage 1: Recognise & First-Hour Bundle',
        shortLabel: 'First Hour',
        color: 'red',
        cards: [
          {
            title: 'Recognise shock',
            isCritical: true,
            orders: [
              'Suspect septic shock: infection + altered perfusion — prolonged (cold) or flash (warm) capillary refill, mottling, weak/bounding pulses, altered mental status, ± hypotension.',
              'Hypotension is a LATE sign in children — do not wait for it. Use age-based thresholds (SBP < 70 + 2×age in years).',
              'Send lactate, glucose, ionised calcium, blood gas, CBC, CRP, cultures, renal/liver function, coagulation.',
            ],
            nursing: [
              'Continuous SpO2, HR, BP, perfusion monitoring',
              'Two IV/IO lines as early as possible',
              'Check glucose and temperature immediately',
            ],
            triggers: [
              'Mental status change / lethargy',
              'Capillary refill > 3 s or flash refill with wide pulse pressure',
              'Lactate > 2 mmol/L',
            ],
          },
          {
            title: 'First-hour resuscitation bundle',
            isCritical: true,
            threshold: 'COMPLETE WITHIN 1 HOUR',
            orders: [
              'High-flow oxygen; support airway/breathing as needed.',
              'Obtain IV/IO access ×2 and draw cultures (do NOT delay antibiotics for cultures).',
              'Give broad-spectrum antibiotics within 1 hour (see prescriptions).',
              'Fluid bolus 10–20 mL/kg isotonic crystalloid over 5–10 min; REASSESS after each bolus; titrate to 40–60 mL/kg in the first hour where intensive care is available.',
              'After each bolus check for fluid overload: new hepatomegaly, crackles, increased work of breathing, gallop — STOP fluids and start vasoactives if present.',
              'Correct hypoglycemia and hypocalcemia.',
            ],
            nursing: [
              'Push-pull fluid boluses for speed in small children',
              'Reassess perfusion + liver edge + chest after every bolus',
              'Prepare vasoactive infusion early',
            ],
            prescriptions: [
              {
                drug: 'Isotonic crystalloid bolus',
                dose: '10–20 mL/kg',
                route: 'IV/IO',
                frequency: 'Repeat & reassess',
                calculation: (w: number) => `${10 * w}–${20 * w} mL`,
                notes: 'Reassess after EACH bolus. Use 10 mL/kg aliquots if cardiac dysfunction or fluid-overload risk.',
              },
              {
                drug: 'Ceftriaxone',
                dose: '50–100 mg/kg (max 2 g)',
                route: 'IV',
                frequency: 'Within 1 hour',
                calculation: (w: number) => `${Math.min(80 * w, 2000)} mg`,
                notes: 'Add vancomycin and/or broaden per local policy & suspected source. Acyclovir if neonatal HSV suspected.',
              },
              {
                drug: 'Dextrose 10%',
                dose: '2–5 mL/kg',
                route: 'IV',
                frequency: 'If glucose low',
                calculation: (w: number) => `${2.5 * w}–${5 * w} mL`,
                notes: 'For documented hypoglycemia (2.5 mL/kg of D10 ≈ 0.25 g/kg).',
              },
              {
                drug: 'Calcium gluconate 10%',
                dose: '0.5 mL/kg (max 20 mL)',
                route: 'IV (slow)',
                frequency: 'If iCa low',
                calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mL`,
                notes: 'Treat ionised hypocalcemia — contributes to myocardial dysfunction.',
              },
            ],
            triggers: [
              'Shock persists after 40–60 mL/kg → fluid-refractory: start vasoactives',
              'Signs of fluid overload at any point',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Fluid-Refractory → Vasoactives',
        shortLabel: 'Vasoactives',
        color: 'amber',
        cards: [
          {
            title: 'Start vasoactive support',
            isCritical: true,
            orders: [
              'Fluid-refractory shock → start epinephrine (cold shock, first-line) or norepinephrine (warm shock / vasodilated).',
              'Start peripheral/IO infusion early (diluted) rather than delaying for central access; secure central access when feasible.',
              'Titrate to perfusion, mental status, urine output, and age-appropriate MAP/lactate clearance.',
              'Consider arterial line and central venous access; transfer to PICU.',
            ],
            nursing: [
              'Dedicated line for vasoactive infusion',
              'Hourly urine output (target ≥ 1 mL/kg/h)',
              'Continuous BP — arterial line preferred',
            ],
            prescriptions: [
              {
                drug: 'Epinephrine (infusion)',
                dose: '0.05–0.3 mcg/kg/min',
                route: 'IV/IO',
                frequency: 'Titrate',
                calculation: (w: number) => `start ${(0.05 * w).toFixed(2)} mcg/min (→ ${(0.3 * w).toFixed(2)} mcg/min)`,
                notes: 'First-line for cold shock. Titrate to perfusion.',
              },
              {
                drug: 'Norepinephrine (infusion)',
                dose: '0.05–0.3 mcg/kg/min',
                route: 'IV/IO',
                frequency: 'Titrate',
                calculation: (w: number) => `start ${(0.05 * w).toFixed(2)} mcg/min (→ ${(0.3 * w).toFixed(2)} mcg/min)`,
                notes: 'First-line for warm/vasodilated shock.',
              },
            ],
            triggers: [
              'Shock persists despite escalating vasoactives → catecholamine-resistant',
              'Rising lactate / falling urine output',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Catecholamine-Resistant Shock',
        shortLabel: 'Refractory',
        color: 'indigo',
        cards: [
          {
            title: 'Refractory shock measures',
            orders: [
              'Give stress-dose hydrocortisone for catecholamine-resistant shock or suspected adrenal insufficiency.',
              'Re-evaluate: adequate antibiotic coverage, undrained source, pneumothorax, tamponade, ongoing hypovolemia, raised intra-abdominal pressure.',
              'Consider second agent (add norepinephrine/epinephrine or vasopressin); consider milrinone/dobutamine if poor cardiac output with adequate BP.',
              'Targeted echocardiography to guide fluids/inotropes; consider ECMO referral in refractory cases.',
            ],
            nursing: [
              'Strict fluid balance + serial lactate',
              'Monitor glucose (steroids)',
              'Prepare for advanced monitoring / transfer',
            ],
            prescriptions: [
              {
                drug: 'Hydrocortisone',
                dose: '1–2 mg/kg (max 100 mg)',
                route: 'IV',
                frequency: 'Then q6h',
                calculation: (w: number) => `${Math.min(2 * w, 100).toFixed(0)} mg`,
                notes: 'For catecholamine-resistant shock / suspected adrenal insufficiency. Draw cortisol first if feasible (do not delay).',
              },
            ],
            triggers: [
              'No response to hydrocortisone + 2 vasoactives → ECMO / consultant discussion',
              'Reconsider undrained source',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Stabilisation & Source Control',
        shortLabel: 'Source Control',
        color: 'emerald',
        cards: [
          {
            title: 'Ongoing care & de-escalation',
            orders: [
              'Achieve source control: drain collections, remove infected lines/devices, surgical review as needed.',
              'De-escalate / narrow antibiotics once cultures and sensitivities return.',
              'Targets: normalising lactate, urine output ≥ 1 mL/kg/h, improving mental status & perfusion.',
              'Manage complications: AKI (consider CRRT), DIC, ARDS, glucose control; avoid fluid overload — consider de-resuscitation.',
            ],
            nursing: [
              'Daily line review and removal when not needed',
              'Nutrition assessment when stable',
              'Continue strict fluid balance',
            ],
          },
        ],
      },
    ],
  },

  // --- Data layer / fallback ---
  calculateSeverity: (data: FormData): Severity => {
    const level: SeverityLevel = 'unknown';
    return { level, details: ['See Master Management Pathway above.'] };
  },
  getManagement: () => [
    {
      title: 'First-hour bundle',
      recommendations: [
        'Oxygen, IV/IO ×2, cultures, antibiotics within 1 hour.',
        'Titrate fluid boluses 10–20 mL/kg and reassess for overload after each.',
        'Start epinephrine/norepinephrine for fluid-refractory shock; hydrocortisone for catecholamine resistance.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU; early vasoactive support and source control.'],
  getRedFlags: () => [
    'Hypotension (late sign) for age',
    'Lactate rising despite resuscitation',
    'Fluid overload: hepatomegaly, crackles, gallop',
    'Catecholamine-resistant shock',
    'Petechiae/purpura (meningococcemia)',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Crystalloid bolus', dose: w ? `${10 * w}–${20 * w} mL` : '10–20 mL/kg', notes: 'Reassess after each bolus.' },
      { drugName: 'Ceftriaxone', dose: w ? `${Math.min(80 * w, 2000)} mg` : '50–100 mg/kg (max 2 g)', notes: 'Within 1 hour.' },
      { drugName: 'Epinephrine infusion', dose: '0.05–0.3 mcg/kg/min', notes: 'First-line for cold shock.' },
      { drugName: 'Hydrocortisone', dose: w ? `${Math.min(2 * w, 100)} mg` : '1–2 mg/kg (max 100 mg)', notes: 'Catecholamine-resistant shock.' },
    ];
  },
  getReferences: () => [
    { title: 'Surviving Sepsis Campaign: Pediatric Septic Shock (2020)', url: 'https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international_guidelines.1.aspx' },
    { title: 'PALS — Shock recognition and management (AHA)', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
  ],
};
