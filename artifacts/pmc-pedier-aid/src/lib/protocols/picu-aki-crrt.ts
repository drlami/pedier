import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * PICU — Acute kidney injury & CRRT indications (Master Management Pathway).
 * KDIGO-based staging, supportive management, emergency complications,
 * and renal replacement therapy indications (AEIOU).
 */
export const picuAkiCrrtProtocol: DiseaseProtocol = {
  id: 'picu-aki-crrt',
  name: 'AKI & CRRT indications',
  system: 'Renal, Fluids & Electrolytes',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Recognition and staging of acute kidney injury, supportive management, emergency complications, and the indications and options for renal replacement therapy in the critically ill child.',
  image: { url: '', hint: '' },

  questions: [],

  mmpData: {
    snapshot:
      'AKI in the PICU is usually multifactorial — hypoperfusion, sepsis, and nephrotoxins on top of the primary illness. The wins are unglamorous: optimise perfusion and stop the insult (treat shock/sepsis, remove nephrotoxins, dose-adjust drugs), then defend against the killers — hyperkalemia, fluid overload, and severe acidosis. Diuretics treat overload, not AKI itself. Escalate to CRRT early for the AEIOU indications rather than waiting for a crisis — fluid overload at initiation predicts worse outcomes.',
    stages: [
      {
        label: 'Stage 1: Recognise & Stage AKI',
        shortLabel: 'Stage AKI',
        color: 'blue',
        cards: [
          {
            title: 'Recognise & stage (KDIGO)',
            orders: [
              'AKI = rise in creatinine ≥ 1.5× baseline (or ≥ 26.5 µmol/L in 48 h) OR urine output < 0.5 mL/kg/h for ≥ 6–12 h.',
              'KDIGO stage 1: Cr 1.5–1.9× or UO < 0.5 mL/kg/h ×6–12 h. Stage 2: Cr 2–2.9× or UO < 0.5 ×≥12 h. Stage 3: Cr ≥ 3× / dialysis / UO < 0.3 ×≥24 h or anuria ≥ 12 h.',
              'Classify cause: pre-renal (hypovolemia, shock, sepsis), intrinsic (ATN, nephritis, HUS, rhabdo), post-renal (obstruction).',
              'Workup: U&E, creatinine, gas, calcium/phosphate, urinalysis ± microscopy, urine electrolytes, renal ultrasound; CK if rhabdo suspected.',
            ],
            nursing: [
              'Strict hourly fluid balance + daily weights',
              'Urinary catheter for accurate output',
              'ECG monitoring (potassium)',
            ],
            triggers: [
              'Anuria / oliguria not responding to perfusion',
              'Rising potassium or ECG changes',
              'Obstruction on ultrasound (urology)',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Supportive Management',
        shortLabel: 'Support',
        color: 'amber',
        cards: [
          {
            title: 'Optimise & protect the kidney',
            orders: [
              'Restore and maintain perfusion: treat hypovolemia/shock; if euvolemic and overloaded, restrict fluids to insensible losses + urine output.',
              'Stop nephrotoxins (NSAIDs, aminoglycosides, contrast where possible, ACE inhibitors); dose-adjust renally-cleared drugs.',
              'Treat the underlying cause (sepsis, HUS, obstruction, glomerulonephritis).',
              'Manage acidosis and electrolytes (potassium, phosphate, calcium); ensure adequate nutrition/calories.',
              'A trial of furosemide is reasonable for fluid overload in a volume-replete child — it does not reverse AKI; stop if no response.',
            ],
            nursing: [
              'Fluid balance to target (insensible + UO if overloaded)',
              'Daily weight; monitor for overload (edema, crackles, hypertension)',
              'Review drug chart for nephrotoxins daily',
            ],
            prescriptions: [
              {
                drug: 'Furosemide',
                dose: '1–2 mg/kg (max 40 mg/dose)',
                route: 'IV',
                frequency: 'Trial for overload',
                calculation: (w: number) => `${Math.min(1 * w, 40)}–${Math.min(2 * w, 40)} mg`,
                notes: 'For fluid overload in a volume-replete child. Stop if no diuretic response — does not treat AKI.',
              },
            ],
            triggers: [
              'Fluid overload despite restriction/diuretics',
              'Refractory acidosis or hyperkalemia',
              'Rising urea with uremic symptoms',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Emergency Complications',
        shortLabel: 'Emergencies',
        color: 'red',
        cards: [
          {
            title: 'Life-threatening hyperkalemia',
            isCritical: true,
            threshold: 'K⁺ > 6.0 OR ECG CHANGES',
            orders: [
              'ECG changes (peaked T, wide QRS) or K⁺ > 6.5: give IV calcium to stabilise the myocardium FIRST.',
              'Shift potassium intracellularly: insulin + dextrose, salbutamol nebuliser, ± sodium bicarbonate if acidotic.',
              'Remove potassium: stop all K⁺ intake, consider binders; refractory hyperkalemia is a CRRT/dialysis indication.',
              'Recheck K⁺ and glucose after shifting therapy.',
            ],
            nursing: [
              'Continuous ECG during treatment',
              'Glucose monitoring after insulin',
              'Stop all potassium-containing fluids',
            ],
            prescriptions: [
              {
                drug: 'Calcium gluconate 10%',
                dose: '0.5 mL/kg (max 20 mL)',
                route: 'IV slow',
                frequency: 'Cardioprotection (first)',
                calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mL`,
                notes: 'Give first if ECG changes / K⁺ > 6.5. Does not lower K⁺ — stabilises myocardium.',
              },
              {
                drug: 'Insulin (with dextrose)',
                dose: '0.1 units/kg + 2 mL/kg D25 (or D10 5 mL/kg)',
                route: 'IV',
                frequency: 'Shift K⁺',
                calculation: (w: number) => `${(0.1 * w).toFixed(1)} units + ${(2 * w).toFixed(0)} mL D25`,
                notes: 'Monitor glucose closely afterwards.',
              },
              {
                drug: 'Salbutamol (nebulised)',
                dose: '2.5 mg (<25 kg) / 5 mg (≥25 kg)',
                route: 'NEB',
                frequency: 'Shift K⁺',
                calculation: (w: number) => (w < 25 ? '2.5 mg neb' : '5 mg neb'),
                notes: 'Adjunct to insulin/dextrose.',
              },
              {
                drug: 'Sodium bicarbonate 8.4%',
                dose: '1 mmol/kg',
                route: 'IV',
                frequency: 'If acidotic',
                calculation: (w: number) => `${(1 * w).toFixed(0)} mmol`,
                notes: 'Only if significant metabolic acidosis; not with calcium in the same line.',
              },
            ],
            triggers: ['Refractory hyperkalemia → urgent CRRT / dialysis'],
          },
          {
            title: 'Fluid overload, acidosis & uremia',
            orders: [
              'Fluid overload / pulmonary edema: oxygen/NIV, fluid restriction, diuretic trial; refractory overload → RRT.',
              'Severe metabolic acidosis unresponsive to medical therapy → RRT.',
              'Uremic complications (encephalopathy, pericarditis, bleeding) → RRT.',
              'Quantify % fluid overload — high overload at RRT initiation predicts worse outcome; escalate early.',
            ],
            nursing: [
              'Respiratory monitoring for overload',
              'Daily weights and cumulative balance',
              'Neuro obs for uremic encephalopathy',
            ],
            triggers: [
              'Pulmonary edema refractory to diuretics',
              'pH refractory to medical management',
              'Uremic encephalopathy / pericarditis',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Renal Replacement Therapy',
        shortLabel: 'RRT / CRRT',
        color: 'indigo',
        cards: [
          {
            title: 'RRT indications (AEIOU) & modality',
            orders: [
              'AEIOU indications: Acidosis (refractory), Electrolyte (refractory hyperkalemia), Intoxication (dialysable toxin), Overload (refractory fluid overload), Uremia (encephalopathy/pericarditis).',
              'CRRT (CVVH/CVVHDF) is preferred in the hemodynamically unstable child; intermittent HD for rapid solute/toxin clearance if stable; PD where CRRT/HD unavailable.',
              'Secure appropriately sized double-lumen vascular access; involve PICU + pediatric nephrology early.',
              'Plan anticoagulation (citrate vs heparin), prescription (dose, fluid removal goal), and drug re-dosing for clearance.',
            ],
            nursing: [
              'Catheter care and circuit monitoring',
              'Hourly fluid removal vs target',
              'Monitor ionised calcium (citrate)',
            ],
            triggers: [
              'Any AEIOU indication present → initiate RRT (do not delay for higher fluid overload)',
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
      title: 'AKI essentials',
      recommendations: [
        'Optimise perfusion, stop nephrotoxins, treat the cause, dose-adjust drugs.',
        'Defend against hyperkalemia, fluid overload, and acidosis.',
        'Diuretics treat overload, not AKI — stop if no response.',
        'Escalate to CRRT early for AEIOU indications.',
      ],
    },
  ],
  getDisposition: () => ['Admit to PICU; involve pediatric nephrology; CRRT for refractory complications.'],
  getRedFlags: () => [
    'Potassium > 6.0 or ECG changes',
    'Anuria / severe oliguria',
    'Fluid overload with pulmonary edema',
    'Refractory metabolic acidosis',
    'Uremic encephalopathy or pericarditis',
  ],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Calcium gluconate 10%', dose: w ? `${Math.min(0.5 * w, 20).toFixed(1)} mL` : '0.5 mL/kg', notes: 'Hyperkalemia with ECG changes — give first.' },
      { drugName: 'Insulin + dextrose', dose: w ? `${(0.1 * w).toFixed(1)} units + ${2 * w} mL D25` : '0.1 units/kg + dextrose', notes: 'Shift K⁺; monitor glucose.' },
      { drugName: 'Furosemide', dose: w ? `${Math.min(1 * w, 40)}–${Math.min(2 * w, 40)} mg` : '1–2 mg/kg', notes: 'Overload trial only.' },
    ];
  },
  getReferences: () => [
    { title: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', url: 'https://kdigo.org/guidelines/acute-kidney-injury/' },
    { title: 'Pediatric Continuous Renal Replacement Therapy (review)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7395211/' },
  ],
};
