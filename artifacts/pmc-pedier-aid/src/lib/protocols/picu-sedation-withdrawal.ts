import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Sedation, analgesia & withdrawal (Master Management Pathway). */
export const picuSedationWithdrawalProtocol: DiseaseProtocol = {
  id: 'picu-sedation-withdrawal',
  name: 'Sedation, analgesia & withdrawal',
  system: 'Neurocritical Care',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Goal-directed analgesia and sedation for the ventilated child, with assessment scores, agent selection, and prevention/treatment of iatrogenic withdrawal and delirium.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Comfort, not coma, is the goal. Treat pain first, then sedate to a defined daily target using a validated score — over-sedation prolongs ventilation and breeds withdrawal and delirium. Use the lowest effective doses, review the target daily, and plan the wean from the start: prolonged opioids/benzodiazepines (≳ 5 days) cause iatrogenic withdrawal, so taper rather than stop.',
    stages: [
      {
        label: 'Stage 1: Assess & Set Targets',
        shortLabel: 'Targets',
        color: 'blue',
        cards: [
          {
            title: 'Goal-directed assessment',
            calculator: { id: 'sedation-scores', title: 'Sedation / Pain / Delirium / Withdrawal Scores' },
            orders: [
              'Set a daily sedation target with the team (e.g. calm, rousable) — avoid deep sedation unless specifically indicated.',
              'Use validated tools: COMFORT-B or State Behavioral Scale (SBS) for sedation depth; FLACC / faces for pain.',
              'Screen for delirium with the Cornell Assessment of Pediatric Delirium (CAPD).',
              'Treat reversible discomfort (full bladder, position, hunger, tube issues) before escalating drugs.',
            ],
            nursing: ['Score sedation/pain/delirium each shift', 'Document the daily target', 'Non-pharmacological comfort measures'],
            triggers: ['Over-sedation (below target)', 'Uncontrolled pain', 'Positive delirium screen'],
          },
        ],
      },
      {
        label: 'Stage 2: Analgesia & Sedation',
        shortLabel: 'Agents',
        color: 'amber',
        cards: [
          {
            title: 'Agent selection & dosing',
            calculator: { id: 'sedation-weaning-calc', title: 'Sedation Dosing & Weaning Calculator' },
            orders: [
              'Analgesia first-line: opioid infusion (morphine or fentanyl) titrated to pain score; add regular paracetamol as an opioid-sparing adjunct.',
              'Sedation: midazolam infusion and/or dexmedetomidine (good for weaning/extubation, minimal respiratory depression).',
              'Use the lowest effective doses; bolus for procedures rather than deepening continuous infusions.',
              'Reassess against the target at least each shift; wean as tolerated.',
            ],
            nursing: ['Titrate infusions to score, not reflex boluses', 'Watch for hypotension/bradycardia (dexmedetomidine)', 'Daily sedation review'],
            prescriptions: [
              { drug: 'Morphine (infusion)', dose: '10–40 mcg/kg/h', route: 'IV', frequency: 'Titrate to pain', calculation: (w: number) => `${(10 * w).toFixed(0)}–${(40 * w).toFixed(0)} mcg/h`, notes: 'Bolus 50–100 mcg/kg for breakthrough.' },
              { drug: 'Fentanyl (infusion)', dose: '1–4 mcg/kg/h', route: 'IV', frequency: 'Titrate to pain', calculation: (w: number) => `${(1 * w).toFixed(1)}–${(4 * w).toFixed(1)} mcg/h`, notes: 'Useful if hemodynamic instability.' },
              { drug: 'Midazolam (infusion)', dose: '1–4 mcg/kg/min', route: 'IV', frequency: 'Titrate to score', calculation: (w: number) => `${(0.06 * w).toFixed(2)}–${(0.24 * w).toFixed(2)} mg/h`, notes: '1–4 mcg/kg/min = 0.06–0.24 mg/kg/h.' },
              { drug: 'Dexmedetomidine (infusion)', dose: '0.2–1 mcg/kg/h', route: 'IV', frequency: 'Titrate', calculation: (w: number) => `${(0.2 * w).toFixed(1)}–${(1 * w).toFixed(1)} mcg/h`, notes: 'Watch for bradycardia/hypotension.' },
            ],
            triggers: ['Escalating requirements / tolerance', 'Hemodynamic effects of sedatives'],
          },
        ],
      },
      {
        label: 'Stage 3: Withdrawal & Delirium',
        shortLabel: 'Withdrawal',
        color: 'indigo',
        cards: [
          {
            title: 'Iatrogenic withdrawal & delirium',
            calculator: { id: 'sedation-weaning-calc', title: 'Weaning Planner (by drug & exposure)' },
            orders: [
              'Anticipate withdrawal after ≳ 5 days of opioids/benzodiazepines — monitor with WAT-1.',
              'Wean infusions gradually (e.g. ~10–20% per day; slower for longer exposures) rather than stopping abruptly.',
              'Consider enteral conversion to longer-acting agents to facilitate weaning: methadone (for opioids), lorazepam (for benzodiazepines), clonidine/dexmedetomidine as adjuncts.',
              'Treat delirium: optimise environment/sleep, minimise deliriogenic drugs (benzodiazepines), dexmedetomidine preferred; antipsychotics only if needed per local policy.',
            ],
            nursing: ['WAT-1 and CAPD scoring', 'Sleep/day–night cues, family presence', 'Follow the written wean plan'],
            prescriptions: [
              { drug: 'Clonidine', dose: '1–5 mcg/kg/dose', route: 'PO/IV', frequency: 'q6–8h', calculation: (w: number) => `${(1 * w).toFixed(0)}–${(5 * w).toFixed(0)} mcg`, notes: 'Adjunct for withdrawal; monitor BP/HR.' },
              { drug: 'Methadone', dose: '0.1 mg/kg/dose', route: 'PO/IV', frequency: 'q6–12h (wean)', calculation: (w: number) => `${(0.1 * w).toFixed(2)} mg`, notes: 'Enteral conversion for opioid weaning; monitor QTc.' },
            ],
            triggers: ['Rising WAT-1 → slow the wean / add adjunct', 'Persistent delirium'],
          },
        ],
      },
      {
        label: 'Stage 4: Weaning & Liberation',
        shortLabel: 'Liberation',
        color: 'emerald',
        cards: [
          {
            title: 'Sedation weaning & extubation readiness',
            orders: [
              'Daily assessment of readiness to lighten sedation; consider sedation interruption/minimisation protocols.',
              'Coordinate sedation weaning with ventilator weaning and spontaneous breathing trials (see Extubation readiness).',
              'Continue the structured taper; switch to enteral/PRN regimens as the child stabilises.',
            ],
            nursing: ['Pair sedation lightening with SBT', 'Document daily progress', 'Reassess withdrawal/delirium scores'],
            triggers: ['Withdrawal/delirium emerging during wean → adjust plan'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Sedation essentials', recommendations: ['Comfort not coma — daily target with validated scores.', 'Analgesia first (opioid), then sedation (midazolam/dexmedetomidine), lowest effective dose.', 'Anticipate withdrawal after ~5 days — taper, don\'t stop; monitor WAT-1.', 'Treat/prevent delirium; pair sedation wean with ventilator wean.'] }],
  getDisposition: () => ['PICU sedation/comfort plan with daily review and a written wean.'],
  getRedFlags: () => ['Over-sedation prolonging ventilation', 'Uncontrolled pain', 'Iatrogenic withdrawal (high WAT-1)', 'Delirium (positive CAPD)', 'Hemodynamic effects of sedatives'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Morphine infusion', dose: w ? `${(10 * w).toFixed(0)}–${(40 * w).toFixed(0)} mcg/h` : '10–40 mcg/kg/h', notes: 'Titrate to pain.' },
      { drugName: 'Midazolam infusion', dose: w ? `${(0.06 * w).toFixed(2)}–${(0.24 * w).toFixed(2)} mg/h` : '1–4 mcg/kg/min', notes: 'Titrate to score.' },
      { drugName: 'Dexmedetomidine', dose: w ? `${(0.2 * w).toFixed(1)}–${(1 * w).toFixed(1)} mcg/h` : '0.2–1 mcg/kg/h', notes: 'Weaning-friendly.' },
      { drugName: 'Clonidine', dose: w ? `${(1 * w).toFixed(0)}–${(5 * w).toFixed(0)} mcg` : '1–5 mcg/kg', notes: 'Withdrawal adjunct.' },
    ];
  },
  getReferences: () => [
    { title: 'Pediatric sedation/analgesia & iatrogenic withdrawal (review)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7286611/' },
    { title: 'SCCM PANDEM Guidelines (pain, agitation, delirium, withdrawal)', url: 'https://journals.lww.com/pccmjournal/fulltext/2022/02000/2022_society_of_critical_care_medicine_clinical.2.aspx' },
  ],
};
