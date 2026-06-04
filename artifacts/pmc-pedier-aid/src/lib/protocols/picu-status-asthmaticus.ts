import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Status asthmaticus / severe acute asthma escalation (Master Management Pathway). */
export const picuStatusAsthmaticusProtocol: DiseaseProtocol = {
  id: 'picu-status-asthmaticus',
  name: 'Status asthmaticus (PICU escalation)',
  system: 'Respiratory & Airway',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Escalation of severe and life-threatening acute asthma in the PICU — intensive inhaled therapy, IV bronchodilators, and the high-risk decision to ventilate.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Severe asthma is about ventilation failing from airflow obstruction — a SILENT chest, exhaustion, or drowsiness is peri-arrest, not improvement. Maximise inhaled therapy (continuous salbutamol + ipratropium), give steroids early, and add IV magnesium, then escalate to IV bronchodilators. Avoid intubation if you possibly can — it is high-risk in asthma (dynamic hyperinflation, hypotension, pneumothorax). If you must ventilate: slow rate, long expiratory time, permissive hypercapnia.',
    stages: [
      {
        label: 'Stage 1: Recognise Severity',
        shortLabel: 'Severity',
        color: 'red',
        cards: [
          {
            title: 'Grade severity & life-threatening features',
            isCritical: true,
            orders: [
              'Severe: too breathless to talk/feed, RR/HR high for age, SpO2 < 92%, accessory muscle use, PEF 33–50% predicted.',
              'Life-threatening: silent chest, poor respiratory effort, cyanosis, exhaustion, hypotension, agitation/altered consciousness, SpO2 < 92% with a normalising/rising PaCO2.',
              'A normal or rising PaCO2 in a tiring asthmatic is an ominous sign — escalate, do not reassure.',
              'Continuous monitoring; blood gas in severe/life-threatening cases; CXR only if pneumothorax/complication suspected.',
            ],
            nursing: ['Continuous SpO2 + cardiorespiratory monitoring', 'Sit upright; minimise distress', 'Call senior/PICU early'],
            triggers: ['Silent chest / poor effort', 'Rising PaCO2 or exhaustion', 'Altered consciousness'],
          },
        ],
      },
      {
        label: 'Stage 2: First-line Intensive Therapy',
        shortLabel: 'Inhaled + Steroid',
        color: 'amber',
        cards: [
          {
            title: 'Oxygen, bronchodilators, steroids & magnesium',
            isCritical: true,
            orders: [
              'High-flow oxygen to SpO2 94–98%.',
              'Continuous (back-to-back) nebulised salbutamol + ipratropium bromide.',
              'Systemic corticosteroid early (oral prednisolone or IV hydrocortisone/methylprednisolone).',
              'IV magnesium sulfate for severe/life-threatening asthma not responding to initial therapy.',
            ],
            nursing: ['Continuous nebulisation setup', 'Reassess air entry/effort after each cycle', 'IV access + bloods/gas'],
            prescriptions: [
              { drug: 'Salbutamol (nebulised)', dose: '2.5 mg (<5 yr) / 5 mg (≥5 yr), continuous', route: 'NEB', frequency: 'Back-to-back', calculation: (w: number) => (w < 20 ? '2.5–5 mg continuous' : '5 mg continuous'), notes: 'Driven by oxygen; monitor for tachycardia/K+.' },
              { drug: 'Ipratropium bromide (nebulised)', dose: '250 mcg (<12 yr) / 500 mcg (≥12 yr)', route: 'NEB', frequency: 'q20min ×3 then q4–6h', calculation: (w: number) => (w < 40 ? '250 mcg' : '500 mcg'), notes: 'Add to salbutamol in severe exacerbations.' },
              { drug: 'Hydrocortisone', dose: '4 mg/kg (max 100 mg)', route: 'IV', frequency: 'q6h', calculation: (w: number) => `${Math.min(4 * w, 100).toFixed(0)} mg`, notes: 'Or prednisolone 1–2 mg/kg PO (max 40–60 mg).' },
              { drug: 'Magnesium sulfate', dose: '40–50 mg/kg (max 2 g)', route: 'IV', frequency: 'Over 20 min', calculation: (w: number) => `${Math.min(40 * w, 2000)}–${Math.min(50 * w, 2000)} mg`, notes: 'Monitor BP; single dose for severe asthma.' },
            ],
            triggers: ['No response to maximal inhaled therapy → IV bronchodilators', 'Deterioration / exhaustion'],
          },
        ],
      },
      {
        label: 'Stage 3: IV Bronchodilator Escalation',
        shortLabel: 'IV Escalation',
        color: 'red',
        cards: [
          {
            title: 'IV salbutamol / aminophylline / ketamine',
            isCritical: true,
            orders: [
              'IV salbutamol: bolus then continuous infusion with cardiac monitoring; watch for tachycardia, lactic acidosis, hypokalemia.',
              'Aminophylline: loading dose (omit load if on theophylline) then infusion with levels and ECG monitoring.',
              'Consider IV ketamine for its bronchodilator and sedative effect in the deteriorating child (and as an induction agent if intubation needed).',
              'Correct potassium; ensure hydration; admit to PICU/HDU with continuous monitoring.',
            ],
            nursing: ['Continuous ECG; hourly K+ as indicated', 'Strict fluid balance', 'Prepare for possible intubation'],
            prescriptions: [
              { drug: 'Salbutamol IV', dose: 'Bolus 15 mcg/kg then 1–5 mcg/kg/min', route: 'IV', frequency: 'Infusion', calculation: (w: number) => `bolus ${(15 * w).toFixed(0)} mcg over 10 min; infuse ${(1 * w).toFixed(0)}–${(5 * w).toFixed(0)} mcg/min`, notes: 'Cardiac monitoring; monitor lactate & K+.' },
              { drug: 'Aminophylline', dose: 'Load 5 mg/kg then 0.5–1 mg/kg/h', route: 'IV', frequency: 'Infusion', calculation: (w: number) => `load ${(5 * w).toFixed(0)} mg over 20 min`, notes: 'Omit load if already on theophylline; check levels.' },
              { drug: 'Ketamine', dose: '1–2 mg/kg (induction) / 0.5–1 mg/kg/h', route: 'IV', frequency: 'Bolus / infusion', calculation: (w: number) => `${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mg bolus`, notes: 'Bronchodilator; induction agent of choice if intubating.' },
            ],
            triggers: ['Persisting life-threatening features → prepare to ventilate', 'Hemodynamic instability'],
          },
        ],
      },
      {
        label: 'Stage 4: Ventilation (High-Risk)',
        shortLabel: 'Ventilation',
        color: 'indigo',
        cards: [
          {
            title: 'If intubation is unavoidable',
            orders: [
              'Avoid intubation if at all possible — it is high-risk in asthma. Optimise medical therapy and consider NIV in selected cases.',
              'If intubating: ketamine induction, most experienced operator, anticipate hypotension (give fluid bolus, have vasopressor).',
              'Ventilator strategy: low rate, low tidal volume, LONG expiratory time, permissive hypercapnia (tolerate high PaCO2 if pH acceptable); minimal PEEP.',
              'Watch for dynamic hyperinflation/auto-PEEP and pneumothorax — if sudden deterioration, disconnect to allow exhalation (see vent troubleshooting).',
            ],
            nursing: ['Watch for breath-stacking / hypotension', 'Have chest-drain kit available', 'Deep sedation ± paralysis as directed'],
            triggers: ['Sudden desaturation/hypotension post-intubation → DOPES, exclude pneumothorax', 'Refractory → discuss ECMO'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Status asthmaticus essentials', recommendations: ['Continuous salbutamol + ipratropium, early steroids, IV magnesium.', 'Escalate to IV salbutamol/aminophylline ± ketamine.', 'Avoid intubation; if ventilating — low rate, long expiratory time, permissive hypercapnia.', 'Watch for hyperinflation and pneumothorax.'] }],
  getDisposition: () => ['Admit to PICU/HDU with continuous monitoring.'],
  getRedFlags: () => ['Silent chest', 'Poor respiratory effort / exhaustion', 'Rising or normalising PaCO2', 'Altered consciousness', 'Hypotension after intubation (hyperinflation/pneumothorax)'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Hydrocortisone', dose: w ? `${Math.min(4 * w, 100).toFixed(0)} mg` : '4 mg/kg (max 100 mg)', notes: 'Or prednisolone 1–2 mg/kg PO.' },
      { drugName: 'Magnesium sulfate', dose: w ? `${Math.min(40 * w, 2000)}–${Math.min(50 * w, 2000)} mg` : '40–50 mg/kg (max 2 g)', notes: 'Over 20 min.' },
      { drugName: 'Salbutamol IV', dose: w ? `bolus ${(15 * w).toFixed(0)} mcg` : '15 mcg/kg bolus then 1–5 mcg/kg/min', notes: 'Cardiac monitoring.' },
      { drugName: 'Ketamine', dose: w ? `${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mg` : '1–2 mg/kg', notes: 'Bronchodilator/induction.' },
    ];
  },
  getReferences: () => [
    { title: 'BTS/SIGN British Guideline on the Management of Asthma', url: 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/asthma/' },
    { title: 'GINA — Global Strategy for Asthma Management', url: 'https://ginasthma.org/' },
  ],
};
