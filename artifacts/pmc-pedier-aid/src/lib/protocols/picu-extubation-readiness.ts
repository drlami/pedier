import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Extubation readiness & post-extubation stridor (Master Management Pathway). */
export const picuExtubationReadinessProtocol: DiseaseProtocol = {
  id: 'picu-extubation-readiness',
  name: 'Extubation readiness & post-extubation stridor',
  system: 'Respiratory & Airway',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Assessing readiness to extubate, the spontaneous breathing trial and cuff-leak check, and the recognition and management of post-extubation stridor.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Extubation is a planned procedure, not an afterthought. Ask daily: has the cause resolved, is gas exchange adequate on minimal support, can the child protect their airway and clear secretions, and is sedation light enough? Pass a spontaneous breathing trial, check the cuff leak in those at risk, and have a plan for post-extubation stridor (steroids, nebulised adrenaline, HFNC/NIV) and for re-intubation.',
    stages: [
      {
        label: 'Stage 1: Readiness Assessment',
        shortLabel: 'Readiness',
        color: 'blue',
        cards: [
          {
            title: 'Daily readiness screen',
            orders: [
              'Underlying reason for intubation resolving/resolved; hemodynamically stable on minimal/no vasoactives.',
              'Adequate gas exchange on low support: FiO2 ≤ 0.4, PEEP ≤ 5–6, acceptable pressures, pH/PaCO2 acceptable.',
              'Adequate neuro status and airway protection: awake enough, gag/cough present, manageable secretions.',
              'Sedation light enough to allow effort; address fluid overload that can impair extubation.',
            ],
            nursing: ['Daily readiness checklist', 'Document support settings + ABG', 'Assess secretion burden'],
            triggers: ['Fails screen → continue support, address barriers', 'High secretions / weak cough'],
          },
        ],
      },
      {
        label: 'Stage 2: SBT, Cuff Leak & Extubation',
        shortLabel: 'SBT',
        color: 'amber',
        cards: [
          {
            title: 'Spontaneous breathing trial & preparation',
            orders: [
              'Spontaneous breathing trial (e.g. pressure support/CPAP or T-piece) for ~30–120 min — monitor RR, tidal volumes, work of breathing, SpO2, and gas.',
              'Cuff-leak test in those at risk of laryngeal edema (long/traumatic intubation, large tube, age); absent leak predicts stridor.',
              'For high stridor risk, give dexamethasone several hours before (ideally starting 6–12 h pre-extubation).',
              'Prepare: NPO appropriately, suction, oxygen, re-intubation equipment and drugs, post-extubation support (HFNC/NIV) ready.',
            ],
            nursing: ['Monitor SBT tolerance', 'Have re-intubation kit at bedside', 'Position upright; suction before extubation'],
            prescriptions: [
              { drug: 'Dexamethasone', dose: '0.25–0.5 mg/kg/dose (max 10 mg)', route: 'IV', frequency: 'q6h, start pre-extubation', calculation: (w: number) => `${Math.min(0.4 * w, 10).toFixed(1)} mg`, notes: 'For laryngeal-edema risk; begin 6–12 h before extubation.' },
            ],
            triggers: ['Fails SBT → return to support', 'No cuff leak → steroids, reconsider timing'],
          },
        ],
      },
      {
        label: 'Stage 3: Post-Extubation Stridor',
        shortLabel: 'Stridor',
        color: 'red',
        cards: [
          {
            title: 'Recognise & treat upper-airway obstruction',
            isCritical: true,
            orders: [
              'Recognise stridor/increased work of breathing soon after extubation (laryngeal edema).',
              'Nebulised adrenaline for stridor at rest; observe for rebound (≥ 2–4 h) after dosing.',
              'Dexamethasone (continue/give) for laryngeal edema.',
              'Escalate respiratory support: HFNC or NIV; humidified oxygen; keep the child calm.',
              'Re-intubate for fatigue, rising CO2, severe obstruction, or failure to respond — use a smaller tube; involve ENT/anaesthesia for difficult airway.',
            ],
            nursing: ['Continuous SpO2 + work-of-breathing monitoring', 'Observe ≥ 2–4 h post-adrenaline for rebound', 'Re-intubation kit ready'],
            prescriptions: [
              { drug: 'Nebulised adrenaline (1:1000)', dose: '0.5 mL/kg (max 5 mL)', route: 'NEB', frequency: 'PRN, observe for rebound', calculation: (w: number) => `${Math.min(0.5 * w, 5).toFixed(1)} mL of 1:1000`, notes: 'Monitor ≥ 2–4 h afterwards for rebound stridor.' },
              { drug: 'Dexamethasone', dose: '0.25–0.5 mg/kg (max 10 mg)', route: 'IV', frequency: 'q6h', calculation: (w: number) => `${Math.min(0.4 * w, 10).toFixed(1)} mg`, notes: 'Laryngeal edema.' },
            ],
            triggers: ['Fatigue / rising CO2 / severe obstruction → re-intubate', 'Rebound stridor after adrenaline'],
          },
        ],
      },
      {
        label: 'Stage 4: Post-Extubation Support',
        shortLabel: 'Support',
        color: 'emerald',
        cards: [
          {
            title: 'Ongoing support & monitoring',
            orders: [
              'Continue HFNC/NIV and humidified oxygen as needed; wean as tolerated.',
              'Chest physiotherapy and secretion clearance; encourage breathing/positioning.',
              'Monitor for delayed deterioration; clear re-intubation criteria documented.',
            ],
            nursing: ['Wean support to target SpO2', 'Physio + secretion clearance', 'Watch for late fatigue'],
            triggers: ['Deterioration on support → escalate / re-intubate'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Extubation essentials', recommendations: ['Daily readiness screen + SBT; cuff-leak test in at-risk children.', 'Pre-extubation dexamethasone for laryngeal-edema risk.', 'Post-extubation stridor: nebulised adrenaline + steroids + HFNC/NIV; observe for rebound.', 'Clear re-intubation criteria; smaller tube if reintubating.'] }],
  getDisposition: () => ['Extubate in PICU with monitoring and a documented escalation/re-intubation plan.'],
  getRedFlags: () => ['Absent cuff leak', 'Stridor at rest after extubation', 'Rising CO2 / fatigue', 'Rebound stridor after adrenaline', 'Weak cough / high secretion load'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Dexamethasone', dose: w ? `${Math.min(0.4 * w, 10).toFixed(1)} mg` : '0.25–0.5 mg/kg', notes: 'Pre-extubation / laryngeal edema.' },
      { drugName: 'Nebulised adrenaline 1:1000', dose: w ? `${Math.min(0.5 * w, 5).toFixed(1)} mL` : '0.5 mL/kg (max 5 mL)', notes: 'Stridor; observe for rebound.' },
    ];
  },
  getReferences: () => [
    { title: 'Pediatric ventilation liberation / extubation readiness (review)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8127538/' },
    { title: 'AHA PALS — Airway management', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
  ],
};
