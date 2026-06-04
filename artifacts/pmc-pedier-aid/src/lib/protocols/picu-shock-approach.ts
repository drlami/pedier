import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Approach to undifferentiated shock & the vasoactive ladder
 * (Master Management Pathway). Complements the septic-shock bundle with a
 * type-based framework (hypovolemic / distributive / cardiogenic / obstructive)
 * and an embedded vasoactive infusion calculator (id: 'picu-vasoactive-calc').
 */
export const picuShockApproachProtocol: DiseaseProtocol = {
  id: 'picu-shock-approach',
  name: 'Shock approach & vasoactive ladder',
  system: 'Shock & Cardiovascular',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'A structured approach to undifferentiated shock in children — recognition, classification by type and phenotype, fluid resuscitation, and the vasoactive/inotrope selection ladder.',
  image: { url: '', hint: '' },

  questions: [],

  mmpData: {
    snapshot:
      'Shock = inadequate oxygen delivery to tissues, and in children it is compensated long before the blood pressure falls — hypotension is a pre-arrest sign. Recognise it on perfusion (mentation, capillary refill, pulses, urine output, lactate), then CLASSIFY to treat: hypovolemic and distributive respond to fluids; cardiogenic and obstructive do NOT — fluids can harm. Resuscitate with titrated boluses reassessed each time, and move to vasoactives early for fluid-refractory shock. Match the agent to the phenotype: cold shock → epinephrine, warm/vasodilated → norepinephrine, poor pump → dobutamine/milrinone.',
    stages: [
      {
        label: 'Stage 1: Recognise & Classify',
        shortLabel: 'Classify',
        color: 'blue',
        cards: [
          {
            title: 'Recognise shock & identify the type',
            isCritical: true,
            orders: [
              'Recognise by perfusion, not BP: altered mentation, capillary refill (prolonged = cold / flash = warm), pulse volume, cool/mottled skin, urine output < 1 mL/kg/h, rising lactate.',
              'Compensated shock = poor perfusion with normal BP. Decompensated = hypotension (LATE, pre-arrest).',
              'Classify the type: Hypovolemic (losses), Distributive (sepsis, anaphylaxis, neurogenic), Cardiogenic (myocarditis, arrhythmia, CHD), Obstructive (tension pneumothorax, tamponade, PE, ductal-dependent lesion).',
              'Phenotype: COLD shock (low output, vasoconstricted) vs WARM shock (high output, vasodilated) — guides agent choice.',
            ],
            nursing: [
              'Continuous SpO2, HR, BP, perfusion; large-bore IV/IO ×2',
              'Bloods: gas + lactate, glucose, electrolytes, culture, group & save',
              'Hourly urine output (catheter if decompensated)',
            ],
            triggers: [
              'Hypotension for age (decompensated)',
              'Lactate > 2 mmol/L or rising',
              'Signs pointing to cardiogenic/obstructive cause',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: First-line Resuscitation',
        shortLabel: 'Resuscitate',
        color: 'amber',
        cards: [
          {
            title: 'Oxygen, access & fluid resuscitation',
            isCritical: true,
            orders: [
              'High-flow oxygen; support airway/breathing; obtain IV/IO access ×2.',
              'Fluid-responsive shock (hypovolemic/distributive): isotonic crystalloid 10–20 mL/kg over 5–10 min; REASSESS after each bolus; titrate up to 40–60 mL/kg in the first hour as needed.',
              'Cardiogenic shock: give SMALL cautious boluses (5–10 mL/kg) and reassess — large fluids worsen pump failure; start inotropes early.',
              'Obstructive shock: treat the obstruction — needle/finger decompression for tension pneumothorax, pericardiocentesis for tamponade, prostaglandin for ductal-dependent lesions.',
              'After every bolus check for fluid overload: hepatomegaly, new crackles, gallop, increased work of breathing — STOP fluids and start vasoactives.',
            ],
            nursing: [
              'Push–pull boluses for speed in small children',
              'Reassess perfusion + liver edge + chest after every bolus',
              'Correct hypoglycemia and hypocalcemia',
            ],
            prescriptions: [
              {
                drug: 'Isotonic crystalloid bolus',
                dose: '10–20 mL/kg (5–10 if cardiogenic)',
                route: 'IV/IO',
                frequency: 'Repeat & reassess',
                calculation: (w: number) => `${10 * w}–${20 * w} mL (cardiogenic ${5 * w}–${10 * w} mL)`,
                notes: 'Reassess after EACH bolus. Stop and switch to vasoactives if overload appears.',
              },
            ],
            triggers: [
              'Shock persists after 40–60 mL/kg → fluid-refractory: start vasoactives',
              'Any sign of fluid overload',
              'Suspected cardiogenic/obstructive cause → specific therapy + early inotropes',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Fluid-Refractory → Vasoactives',
        shortLabel: 'Vasoactives',
        color: 'red',
        cards: [
          {
            title: 'Vasoactive / inotrope ladder',
            isCritical: true,
            calculator: { id: 'picu-vasoactive-calc', title: 'Vasoactive Infusion Calculator' },
            orders: [
              'Start vasoactives for fluid-refractory shock — do not keep giving fluid into a fluid-refractory child.',
              'COLD shock (low output): epinephrine first-line. WARM shock (vasodilated): norepinephrine first-line.',
              'Poor cardiac contractility with adequate BP: add dobutamine or milrinone (inodilator — watch for hypotension).',
              'Begin peripheral/IO infusion (appropriately diluted) early rather than delaying for central access; secure central + arterial access when feasible.',
              'Titrate to perfusion, mental status, urine output, age-appropriate MAP, and lactate clearance — use the calculator for weight-based doses and prep.',
            ],
            nursing: [
              'Dedicated line for vasoactive infusion; double-check concentrations',
              'Hourly urine output (target ≥ 1 mL/kg/h)',
              'Continuous BP — arterial line preferred',
            ],
            triggers: [
              'Escalating vasoactive requirement → catecholamine-resistant shock',
              'Rising lactate / falling urine output despite support',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Refractory & Advanced',
        shortLabel: 'Refractory',
        color: 'indigo',
        cards: [
          {
            title: 'Catecholamine-resistant / refractory shock',
            orders: [
              'Give stress-dose hydrocortisone for catecholamine-resistant shock or suspected adrenal insufficiency.',
              'Add a second agent (e.g. norepinephrine + epinephrine, or vasopressin); use targeted echocardiography to guide fluids vs inotropes.',
              'Re-evaluate for missed obstructive/cardiogenic causes, ongoing hemorrhage, tamponade, pneumothorax, and adequacy of source control/antibiotics.',
              'Discuss advanced support (ECMO) early in refractory cases; transfer to a center with capability if needed.',
            ],
            nursing: [
              'Strict fluid balance + serial lactate',
              'Glucose monitoring (steroids)',
              'Prepare for advanced monitoring / transfer',
            ],
            prescriptions: [
              {
                drug: 'Hydrocortisone',
                dose: '1–2 mg/kg (max 100 mg)',
                route: 'IV',
                frequency: 'Then q6h',
                calculation: (w: number) => `${Math.min(2 * w, 100).toFixed(0)} mg`,
                notes: 'For catecholamine-resistant shock / suspected adrenal insufficiency.',
              },
            ],
            triggers: ['No response to second agent + steroid → ECMO / consultant discussion'],
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
      title: 'Shock approach essentials',
      recommendations: [
        'Recognise on perfusion, not BP; classify the type before treating.',
        'Hypovolemic/distributive → titrated boluses; cardiogenic/obstructive → cautious fluids + specific therapy.',
        'Fluid-refractory → vasoactives: epinephrine (cold), norepinephrine (warm), dobutamine/milrinone (poor pump).',
        'Refractory → hydrocortisone, second agent, echo guidance, consider ECMO.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU; early vasoactive support and cause-specific therapy.'],
  getRedFlags: () => [
    'Hypotension for age (decompensated / pre-arrest)',
    'Rising lactate despite resuscitation',
    'Fluid overload: hepatomegaly, crackles, gallop',
    'Obstructive signs: distended neck veins, muffled heart sounds, tracheal shift',
    'Escalating vasoactive requirement',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Crystalloid bolus', dose: w ? `${10 * w}–${20 * w} mL` : '10–20 mL/kg', notes: 'Cautious (5–10 mL/kg) if cardiogenic.' },
      { drugName: 'Epinephrine infusion', dose: '0.05–1 mcg/kg/min', notes: 'First-line cold shock.' },
      { drugName: 'Norepinephrine infusion', dose: '0.05–1 mcg/kg/min', notes: 'First-line warm shock.' },
      { drugName: 'Hydrocortisone', dose: w ? `${Math.min(2 * w, 100)} mg` : '1–2 mg/kg (max 100 mg)', notes: 'Catecholamine-resistant shock.' },
    ];
  },
  getReferences: () => [
    { title: 'PALS — Recognition and Management of Shock (AHA)', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
    { title: 'Surviving Sepsis Campaign: Pediatric (2020)', url: 'https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international_guidelines.1.aspx' },
  ],
};
