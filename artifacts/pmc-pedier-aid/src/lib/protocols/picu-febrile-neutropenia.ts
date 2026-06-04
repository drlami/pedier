import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Febrile neutropenia, critical (Master Management Pathway). */
export const picuFebrileNeutropeniaProtocol: DiseaseProtocol = {
  id: 'picu-febrile-neutropenia',
  name: 'Febrile neutropenia (critical)',
  system: 'Sepsis, Infection & Hematology',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'The neutropenic child with fever — a medical emergency requiring broad-spectrum antibiotics within the hour, with escalation for sepsis/shock.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Fever in a neutropenic child is an emergency until proven otherwise — they can decompensate fast with few signs. The single most important action is broad-spectrum anti-pseudomonal antibiotics WITHIN ONE HOUR; do not wait for the blood count or cultures. Assess immediately for sepsis/shock and treat in parallel. Examine the lines, mucosa, perineum and skin, but do not delay antibiotics to find a source.',
    stages: [
      {
        label: 'Stage 1: Recognise',
        shortLabel: 'Recognise',
        color: 'red',
        cards: [
          {
            title: 'Define & assess',
            isCritical: true,
            orders: [
              'Febrile neutropenia: single temperature ≥ 38.5°C (or ≥ 38.0°C sustained/×2) with ANC < 0.5 ×10⁹/L (or < 1.0 and falling).',
              'Rapid assessment for sepsis/shock: perfusion, BP, mental status, respiratory status, lactate.',
              'Focused exam: central line/exit site, mouth/mucositis, perineum/perianal (NO PR exam), skin, chest, abdomen — but do not delay antibiotics.',
              'Cultures from EACH lumen of the central line and a peripheral set; CBC, CRP, U&E, LFTs, gas/lactate, coagulation.',
            ],
            nursing: ['Continuous monitoring + perfusion checks', 'Cultures from every line lumen + peripheral', 'Strict asepsis; isolate as per policy'],
            triggers: ['Any sign of shock → septic-shock pathway', 'Hypotension / rising lactate', 'Line-related signs'],
          },
        ],
      },
      {
        label: 'Stage 2: First-Hour Antibiotics',
        shortLabel: 'Antibiotics',
        color: 'amber',
        cards: [
          {
            title: 'Empiric broad-spectrum within 1 hour',
            isCritical: true,
            threshold: 'ANTIBIOTICS WITHIN 1 HOUR',
            orders: [
              'Give an empiric broad-spectrum anti-pseudomonal beta-lactam within 1 hour (e.g. piperacillin-tazobactam or cefepime/meropenem per local policy) — do not wait for counts.',
              'Add a glycopeptide (vancomycin) if: hemodynamic instability, line infection suspected, severe mucositis, skin/soft-tissue infection, or known MRSA/resistant colonisation.',
              'Add an aminoglycoside for shock/severe sepsis or per local policy; adjust for renal function.',
              'Consider empiric antifungal cover if fever persists > 72–96 h or high-risk; antivirals if clinically indicated.',
            ],
            nursing: ['Antibiotics STAT — document time', 'Reassess after first dose', 'Repeat cultures if persistently febrile'],
            prescriptions: [
              { drug: 'Piperacillin-tazobactam', dose: '90 mg/kg (piptazo) (max 4.5 g)', route: 'IV', frequency: 'q6–8h', calculation: (w: number) => `${Math.min(90 * w, 4500).toFixed(0)} mg`, notes: 'First-line empiric (or cefepime 50 mg/kg / meropenem 20 mg/kg per policy).' },
              { drug: 'Vancomycin', dose: '15 mg/kg (max 1 g/dose)', route: 'IV', frequency: 'q6–8h', calculation: (w: number) => `${Math.min(15 * w, 1000).toFixed(0)} mg`, notes: 'Add for instability/line/mucositis/MRSA risk; monitor levels.' },
              { drug: 'Amikacin', dose: '15 mg/kg', route: 'IV', frequency: 'Once daily', calculation: (w: number) => `${(15 * w).toFixed(0)} mg`, notes: 'For shock/severe sepsis or per policy; renal monitoring.' },
            ],
            triggers: ['Shock → add aminoglycoside + septic-shock pathway', 'Fever > 72–96 h → antifungal'],
          },
        ],
      },
      {
        label: 'Stage 3: Sepsis / Shock Escalation',
        shortLabel: 'Escalate',
        color: 'red',
        cards: [
          {
            title: 'Treat sepsis/shock in parallel',
            orders: [
              'If shock present: follow the septic-shock pathway — fluids titrated to response, early vasoactives for fluid-refractory shock.',
              'Broaden antimicrobial cover (resistant Gram-negatives, fungi, viral, atypical) per risk and local epidemiology.',
              'Consider removing/locking an infected central line in discussion with oncology.',
              'Supportive care: transfuse per thresholds, correct coagulopathy, manage tumour lysis if relevant.',
            ],
            nursing: ['Serial lactate + perfusion', 'Prepare vasoactives if escalating', 'Liaise oncology re: line'],
            triggers: ['Fluid-refractory shock → vasoactives', 'Suspected line infection → discuss removal'],
          },
        ],
      },
      {
        label: 'Stage 4: Ongoing Care',
        shortLabel: 'Ongoing',
        color: 'emerald',
        cards: [
          {
            title: 'Ongoing management & stewardship',
            orders: [
              'Daily review of fever, cultures, and clinical course; consider G-CSF in selected high-risk patients per oncology.',
              'De-escalate/narrow antibiotics once a pathogen/source is identified and the child is stable.',
              'Continue cover until afebrile and count recovery per local policy.',
              'Infection-control measures; nutrition and supportive care.',
            ],
            nursing: ['Daily culture/fever review', 'Stewardship with oncology', 'Neutropenic precautions'],
            triggers: ['Persistent fever — reassess source/coverage', 'Clinical deterioration'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Febrile neutropenia essentials', recommendations: ['Broad-spectrum anti-pseudomonal antibiotics within 1 hour — do not wait for counts.', 'Cultures from every line lumen + peripheral; add vancomycin/aminoglycoside per risk.', 'Assess and treat sepsis/shock in parallel.', 'Antifungal if fever persists > 72–96 h; de-escalate later.'] }],
  getDisposition: () => ['Admit (PICU if septic/shocked); oncology involvement.'],
  getRedFlags: () => ['Hypotension / shock', 'Rising lactate', 'Central line infection signs', 'Severe mucositis / perianal infection', 'Persistent fever despite broad-spectrum cover'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Piperacillin-tazobactam', dose: w ? `${Math.min(90 * w, 4500).toFixed(0)} mg` : '90 mg/kg (max 4.5 g)', notes: 'Within 1 hour.' },
      { drugName: 'Vancomycin', dose: w ? `${Math.min(15 * w, 1000).toFixed(0)} mg` : '15 mg/kg', notes: 'Add per risk; monitor levels.' },
      { drugName: 'Amikacin', dose: w ? `${(15 * w).toFixed(0)} mg` : '15 mg/kg', notes: 'For shock/severe sepsis.' },
    ];
  },
  getReferences: () => [
    { title: 'IDSA Guideline — Fever and Neutropenia', url: 'https://www.idsociety.org/practice-guideline/fever-and-neutropenia/' },
    { title: 'NICE NG151 — Neutropenic sepsis', url: 'https://www.nice.org.uk/guidance/ng151' },
  ],
};
