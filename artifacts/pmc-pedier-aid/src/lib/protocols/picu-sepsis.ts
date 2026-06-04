import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Severe sepsis recognition & bundle (Master Management Pathway). */
export const picuSepsisProtocol: DiseaseProtocol = {
  id: 'picu-sepsis',
  name: 'Severe sepsis recognition & bundle',
  system: 'Sepsis, Infection & Hematology',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Early recognition of sepsis and the first-hour resuscitation bundle, with escalation to the septic-shock pathway when shock develops.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Sepsis is life-threatening organ dysfunction from a dysregulated response to infection — and outcomes hinge on RECOGNITION and the first hour. Screen actively (the unwell child with suspected infection + abnormal physiology/perfusion), then deliver the bundle: oxygen, cultures, antibiotics within 1 hour, lactate, and titrated fluids. If shock is present or develops, escalate immediately to the septic-shock pathway (vasoactives). Source control is the cure.',
    stages: [
      {
        label: 'Stage 1: Recognise',
        shortLabel: 'Recognise',
        color: 'red',
        cards: [
          {
            title: 'Screen & recognise sepsis',
            isCritical: true,
            orders: [
              'Suspect sepsis in any child with suspected/proven infection plus abnormal physiology: fever or hypothermia, tachycardia/tachypnea for age, altered mental status, poor perfusion (cap refill, mottling), reduced urine output.',
              'Look for organ dysfunction: altered mentation, hypoxemia, oliguria, ileus, coagulopathy, hyperlactatemia.',
              'Identify high-risk groups: neonates/young infants, immunocompromised/neutropenic, indwelling devices, recent surgery, chronic conditions.',
              'Send lactate, glucose, blood gas, CBC, CRP, cultures, renal/liver function, coagulation.',
            ],
            nursing: ['Sepsis screening tool / PEWS', 'Continuous monitoring + perfusion checks', 'Escalate to senior on positive screen'],
            triggers: ['Poor perfusion / hypotension → septic-shock pathway', 'Lactate > 2 mmol/L', 'Altered mental status'],
          },
        ],
      },
      {
        label: 'Stage 2: First-Hour Bundle',
        shortLabel: 'First Hour',
        color: 'amber',
        cards: [
          {
            title: 'Sepsis bundle within 1 hour',
            isCritical: true,
            threshold: 'COMPLETE WITHIN 1 HOUR',
            orders: [
              'Give high-flow oxygen; support airway/breathing as needed.',
              'Obtain IV/IO access and take blood cultures (do not delay antibiotics for cultures).',
              'Give broad-spectrum antibiotics within 1 hour, guided by age and suspected source.',
              'Measure lactate; give fluid resuscitation 10–20 mL/kg isotonic, reassessing after each bolus for response and overload.',
              'Measure urine output; correct hypoglycemia and hypocalcemia.',
            ],
            nursing: ['Reassess perfusion + liver edge + chest after each bolus', 'Hourly urine output', 'Repeat lactate to assess clearance'],
            prescriptions: [
              { drug: 'Ceftriaxone', dose: '50–100 mg/kg (max 2 g)', route: 'IV', frequency: 'Within 1 hour', calculation: (w: number) => `${Math.min(80 * w, 2000)} mg`, notes: 'Broaden per source/local policy; cefotaxime + ampicillin in neonates; add aciclovir if HSV suspected.' },
              { drug: 'Isotonic crystalloid bolus', dose: '10–20 mL/kg', route: 'IV/IO', frequency: 'Reassess after each', calculation: (w: number) => `${10 * w}–${20 * w} mL`, notes: 'Stop and start vasoactives if overload or fluid-refractory.' },
            ],
            triggers: ['Shock persists after 40–60 mL/kg → septic-shock pathway (vasoactives)', 'Signs of fluid overload'],
          },
        ],
      },
      {
        label: 'Stage 3: Reassess & Escalate',
        shortLabel: 'Escalate',
        color: 'red',
        cards: [
          {
            title: 'Reassess response & escalate',
            orders: [
              'Reassess perfusion, mental status, urine output, and lactate clearance after the bundle.',
              'If shock is present or develops → switch to the septic-shock pathway: start epinephrine/norepinephrine for fluid-refractory shock.',
              'Pursue source control: imaging, drain collections, remove infected lines/devices, surgical review.',
              'Consider hydrocortisone for catecholamine-resistant shock; transfer to PICU.',
            ],
            nursing: ['Serial lactate + perfusion', 'Prepare vasoactive infusion if escalating', 'Arrange source-control investigations'],
            triggers: ['Fluid-refractory shock → vasoactives (septic-shock pathway)', 'Undrained source'],
          },
        ],
      },
      {
        label: 'Stage 4: Ongoing Care & De-escalation',
        shortLabel: 'Ongoing',
        color: 'emerald',
        cards: [
          {
            title: 'Stabilisation & stewardship',
            orders: [
              'Achieve and confirm source control; remove unnecessary lines/devices.',
              'Narrow/de-escalate antibiotics once cultures and sensitivities return; set a treatment duration.',
              'Support organs (lung-protective ventilation, AKI/CRRT, glucose control); avoid fluid overload — consider de-resuscitation.',
              'Monitor for complications (DIC, secondary infection); nutrition when stable.',
            ],
            nursing: ['Daily line review', 'Antibiotic stewardship review', 'Strict fluid balance'],
            triggers: ['Deterioration / new organ dysfunction', 'Persistent fever — reassess source/coverage'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Sepsis essentials', recommendations: ['Recognise early; screen the unwell child with suspected infection.', 'First-hour bundle: O2, cultures, antibiotics within 1 h, lactate, titrated fluids, urine output.', 'Escalate to septic-shock pathway (vasoactives) for fluid-refractory shock.', 'Source control + antibiotic de-escalation.'] }],
  getDisposition: () => ['Admit to PICU/HDU; escalate to septic-shock pathway if shock develops.'],
  getRedFlags: () => ['Altered mental status', 'Poor perfusion / hypotension (late)', 'Rising lactate', 'Petechiae/purpura', 'Immunocompromised / neonate'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Ceftriaxone', dose: w ? `${Math.min(80 * w, 2000)} mg` : '50–100 mg/kg (max 2 g)', notes: 'Within 1 hour.' },
      { drugName: 'Crystalloid bolus', dose: w ? `${10 * w}–${20 * w} mL` : '10–20 mL/kg', notes: 'Reassess after each.' },
    ];
  },
  getReferences: () => [
    { title: 'Surviving Sepsis Campaign: Pediatric (2020)', url: 'https://journals.lww.com/pccmjournal/fulltext/2020/02000/surviving_sepsis_campaign_international_guidelines.1.aspx' },
    { title: 'Sepsis Six / NICE NG51 — Sepsis recognition and early management', url: 'https://www.nice.org.uk/guidance/ng51' },
  ],
};
