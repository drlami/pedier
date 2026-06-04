import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Critical electrolytes (severe K⁺ / Na⁺) (Master Management Pathway). */
export const picuCriticalElectrolytesProtocol: DiseaseProtocol = {
  id: 'picu-critical-electrolytes',
  name: 'Critical electrolytes (severe K⁺ / Na⁺)',
  system: 'Renal, Fluids & Electrolytes',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Emergency management of life-threatening potassium and sodium disturbances — stabilise the heart, shift and remove potassium, and correct sodium at a safe rate.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Two electrolytes kill quickly if mishandled. POTASSIUM: with ECG changes or K⁺ > 6.5, give calcium to protect the myocardium FIRST, then shift (insulin/dextrose, salbutamol, ± bicarbonate) and remove. SODIUM: the danger is correcting too fast — keep the change ≤ 8–10 mmol/L per 24 h in either direction; the only exception is severe symptomatic hyponatremia with seizures, where a small 3% saline bolus is given just to stop the seizure.',
    stages: [
      {
        label: 'Stage 1: Severe Hyperkalemia',
        shortLabel: 'Hyper-K',
        color: 'red',
        cards: [
          {
            title: 'Life-threatening hyperkalemia',
            isCritical: true,
            threshold: 'ECG CHANGES OR K⁺ > 6.5',
            orders: [
              'Get an ECG immediately (peaked T waves, wide QRS, loss of P waves, sine wave) and continuous monitoring; stop all potassium intake.',
              'STABILISE: IV calcium (gluconate or chloride) if ECG changes or K⁺ > 6.5 — protects the myocardium (does not lower K⁺).',
              'SHIFT: insulin + dextrose; nebulised salbutamol; sodium bicarbonate if significant acidosis.',
              'REMOVE: diuretic if making urine, cation binders; refractory/oliguric hyperkalemia → dialysis/CRRT (see AKI pathway).',
              'Recheck K⁺ and glucose after treatment; rebound is common.',
            ],
            nursing: ['Continuous ECG during treatment', 'Glucose monitoring after insulin', 'Separate lines for calcium and bicarbonate'],
            prescriptions: [
              { drug: 'Calcium gluconate 10%', dose: '0.5 mL/kg (max 20 mL)', route: 'IV slow', frequency: 'First if ECG changes', calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mL`, notes: 'Cardioprotection; repeat if ECG persists. (Calcium chloride if central access/peri-arrest.)' },
              { drug: 'Insulin + dextrose', dose: '0.1 units/kg + 2 mL/kg D25', route: 'IV', frequency: 'Shift', calculation: (w: number) => `${(0.1 * w).toFixed(1)} units + ${(2 * w).toFixed(0)} mL D25`, notes: 'Monitor glucose for hypoglycemia.' },
              { drug: 'Salbutamol (nebulised)', dose: '2.5 mg (<25 kg) / 5 mg (≥25 kg)', route: 'NEB', frequency: 'Shift', calculation: (w: number) => (w < 25 ? '2.5 mg' : '5 mg'), notes: 'Adjunct to insulin/dextrose.' },
              { drug: 'Sodium bicarbonate 8.4%', dose: '1 mmol/kg', route: 'IV', frequency: 'If acidotic', calculation: (w: number) => `${(1 * w).toFixed(0)} mmol`, notes: 'Only with significant acidosis; not in same line as calcium.' },
            ],
            triggers: ['Refractory / oliguric → CRRT or dialysis', 'Persisting ECG changes'],
          },
        ],
      },
      {
        label: 'Stage 2: Severe Hypokalemia',
        shortLabel: 'Hypo-K',
        color: 'amber',
        cards: [
          {
            title: 'Symptomatic / severe hypokalemia',
            orders: [
              'ECG: flat T waves, U waves, ST depression, arrhythmia risk (esp. with digoxin).',
              'Replace IV potassium cautiously with continuous cardiac monitoring — never give a rapid IV bolus of potassium.',
              'Always check and replace magnesium — hypomagnesemia causes refractory hypokalemia.',
              'Identify losses (GI, renal, diuretics, refeeding) and treat the cause.',
            ],
            nursing: ['Continuous ECG during replacement', 'Dilute K⁺ properly; max rate per local policy', 'Recheck K⁺ + Mg after replacement'],
            prescriptions: [
              { drug: 'Potassium chloride', dose: '0.25–0.5 mmol/kg over ≥ 1–2 h', route: 'IV', frequency: 'With ECG', calculation: (w: number) => `${(0.25 * w).toFixed(1)}–${(0.5 * w).toFixed(1)} mmol`, notes: 'Never bolus; central line for higher concentrations.' },
              { drug: 'Magnesium sulfate', dose: '25–50 mg/kg (max 2 g)', route: 'IV', frequency: 'Over 20 min', calculation: (w: number) => `${Math.min(25 * w, 2000)}–${Math.min(50 * w, 2000)} mg`, notes: 'Correct magnesium to fix refractory hypokalemia.' },
            ],
            triggers: ['Arrhythmia during replacement', 'Refractory despite K⁺ → check magnesium'],
          },
        ],
      },
      {
        label: 'Stage 3: Dysnatremias',
        shortLabel: 'Sodium',
        color: 'red',
        cards: [
          {
            title: 'Hypo- and hypernatremia — correct slowly',
            isCritical: true,
            orders: [
              'Golden rule: change serum Na by ≤ 8–10 mmol/L per 24 h in either direction (faster risks osmotic demyelination in hypoNa, cerebral edema in hyperNa).',
              'Symptomatic hyponatremia with seizures/coma: 3% saline 2–5 mL/kg to raise Na by ~4–6 mmol/L and STOP the seizure — then slow, controlled correction.',
              'Asymptomatic hyponatremia: treat cause (SIADH → fluid restriction; depletional → isotonic fluid); recheck frequently.',
              'Hypernatremia: rehydrate slowly with isotonic/appropriate fluid; lower Na gradually (≤ 0.5 mmol/L/h); calculate free-water deficit.',
            ],
            nursing: ['Serial sodium during correction (e.g. 2–4 hourly)', 'Neuro obs', 'Avoid hypotonic fluids in at-risk children'],
            prescriptions: [
              { drug: 'Hypertonic saline 3% (symptomatic hypoNa)', dose: '2–5 mL/kg', route: 'IV', frequency: 'To stop seizures', calculation: (w: number) => `${2 * w}–${5 * w} mL`, notes: 'Aim to raise Na ~4–6 mmol/L only, then reassess.' },
            ],
            triggers: ['Na correcting > 8–10 mmol/L/24 h → slow/adjust (consider re-lowering)', 'Ongoing seizures despite hypertonic saline'],
          },
        ],
      },
      {
        label: 'Stage 4: Calcium, Magnesium & Monitoring',
        shortLabel: 'Ca / Mg',
        color: 'emerald',
        cards: [
          {
            title: 'Other electrolytes & ongoing care',
            orders: [
              'Symptomatic hypocalcemia (tetany, seizures, arrhythmia): IV calcium gluconate 10% with cardiac monitoring.',
              'Replace magnesium and phosphate as indicated; correct magnesium to support potassium and calcium correction.',
              'Continue serial electrolyte monitoring; adjust maintenance fluids to prevent recurrence.',
              'Treat the underlying disorder driving the derangement.',
            ],
            nursing: ['ECG for Ca correction', 'Trend electrolytes', 'Review maintenance fluid composition'],
            prescriptions: [
              { drug: 'Calcium gluconate 10%', dose: '0.5 mL/kg (max 20 mL)', route: 'IV slow', frequency: 'Symptomatic hypoCa', calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mL`, notes: 'Cardiac monitoring; correct magnesium too.' },
            ],
            triggers: ['Recurrent derangement', 'Symptomatic hypocalcemia'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Critical electrolytes essentials', recommendations: ['Hyperkalemia: calcium first (ECG), then shift (insulin/dextrose, salbutamol, ±bicarb), then remove.', 'Hypokalemia: replace slowly with ECG; always check magnesium.', 'Sodium: correct ≤ 8–10 mmol/L/24 h; symptomatic hypoNa seizures → 3% saline 2–5 mL/kg.', 'Treat the cause; serial monitoring.'] }],
  getDisposition: () => ['PICU with continuous ECG and serial electrolytes; CRRT for refractory hyperkalemia.'],
  getRedFlags: () => ['ECG changes of hyperkalemia', 'Arrhythmia with hypokalemia', 'Seizures from acute hyponatremia', 'Rapid sodium correction', 'Tetany / symptomatic hypocalcemia'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Calcium gluconate 10%', dose: w ? `${Math.min(0.5 * w, 20).toFixed(1)} mL` : '0.5 mL/kg', notes: 'Hyperkalemia (ECG) / hypocalcemia.' },
      { drugName: 'Insulin + dextrose', dose: w ? `${(0.1 * w).toFixed(1)} units + ${2 * w} mL D25` : '0.1 units/kg + dextrose', notes: 'Shift K⁺.' },
      { drugName: 'Hypertonic saline 3%', dose: w ? `${2 * w}–${5 * w} mL` : '2–5 mL/kg', notes: 'Symptomatic hyponatremia seizures.' },
      { drugName: 'Potassium chloride', dose: w ? `${(0.25 * w).toFixed(1)}–${(0.5 * w).toFixed(1)} mmol` : '0.25–0.5 mmol/kg', notes: 'Slow, ECG; never bolus.' },
    ];
  },
  getReferences: () => [
    { title: 'UK Renal Association — Treatment of Acute Hyperkalaemia', url: 'https://ukkidney.org/health-professionals/guidelines/treatment-acute-hyperkalaemia-adults' },
    { title: 'Pediatric dysnatremia management — review', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7102510/' },
  ],
};
