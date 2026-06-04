import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Cardiogenic shock (Master Management Pathway). Embeds the vasoactive calculator. */
export const picuCardiogenicShockProtocol: DiseaseProtocol = {
  id: 'picu-cardiogenic-shock',
  name: 'Cardiogenic shock',
  system: 'Shock & Cardiovascular',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Recognition and management of pump-failure shock in children — cautious fluids, inotropic support, afterload reduction, and advanced mechanical support.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Cardiogenic shock is a pump problem, not a tank problem — the usual fluid-bolus reflex can drown these children. Give small, cautious boluses (5–10 mL/kg) and reassess for worsening; start inotropes EARLY and reduce afterload. Treat the specific cause: arrhythmia, myocarditis, cardiomyopathy, or a ductal-dependent congenital lesion (prostaglandin). Escalate to mechanical support (ECMO/VAD) before multi-organ failure sets in.',
    stages: [
      {
        label: 'Stage 1: Recognise',
        shortLabel: 'Recognise',
        color: 'red',
        cards: [
          {
            title: 'Recognise pump failure',
            isCritical: true,
            orders: [
              'Signs: tachycardia, gallop, hepatomegaly, raised JVP, crackles, cool peripheries with poor pulses, increased work of breathing, cardiomegaly on CXR.',
              'Identify cause: arrhythmia (SVT/VT/heart block), myocarditis, cardiomyopathy, congenital heart disease, post-cardiac surgery, sepsis-related myocardial dysfunction.',
              'Investigations: ECG, echocardiography (key), troponin, BNP, gas/lactate, CXR; in neonates consider ductal-dependent lesion.',
            ],
            nursing: ['Continuous ECG, SpO2, BP', 'Strict fluid balance + daily weight', 'Urgent echo and senior/cardiology input'],
            triggers: ['Arrhythmia → PALS arrhythmia pathway', 'Neonate with shock → consider prostaglandin', 'Hypotension / rising lactate'],
          },
        ],
      },
      {
        label: 'Stage 2: Cautious Resuscitation',
        shortLabel: 'Cautious',
        color: 'amber',
        cards: [
          {
            title: 'Careful initial management',
            orders: [
              'Oxygen and respiratory support; NIV/intubation reduces work of breathing and preload/afterload demands — but watch for hypotension on induction.',
              'Cautious fluid: 5–10 mL/kg over 15–30 min and REASSESS — stop if hepatomegaly, crackles, or desaturation worsen.',
              'Treat arrhythmia per PALS (adenosine/cardioversion for SVT, synchronised cardioversion/amiodarone for VT with a pulse).',
              'Correct hypoglycemia, hypocalcemia, acidosis; for ductal-dependent neonatal lesions start prostaglandin E1.',
            ],
            nursing: ['Reassess liver edge + chest after every bolus', 'Prepare inotrope infusion early', 'Monitor for induction hypotension'],
            prescriptions: [
              { drug: 'Cautious crystalloid bolus', dose: '5–10 mL/kg', route: 'IV', frequency: 'Reassess', calculation: (w: number) => `${5 * w}–${10 * w} mL`, notes: 'Small aliquots; stop if overload worsens.' },
              { drug: 'Prostaglandin E1 (alprostadil)', dose: '0.01–0.05 mcg/kg/min', route: 'IV', frequency: 'Neonatal duct-dependent', calculation: (w: number) => `start ${(0.01 * w).toFixed(3)} mcg/min`, notes: 'Watch for apnea — be ready to intubate.' },
            ],
            triggers: ['Worsening overload with fluids', 'Persisting low output → inotropes now'],
          },
        ],
      },
      {
        label: 'Stage 3: Inotropic & Afterload Support',
        shortLabel: 'Inotropes',
        color: 'red',
        cards: [
          {
            title: 'Inotropes & afterload reduction',
            isCritical: true,
            calculator: { id: 'picu-vasoactive-calc', title: 'Vasoactive Infusion Calculator' },
            orders: [
              'Inodilator milrinone improves contractility and reduces afterload (watch for hypotension — may need a vasoconstrictor alongside).',
              'Dobutamine or low-dose epinephrine for inotropy; avoid pure high-dose vasoconstrictors that raise afterload on a failing ventricle.',
              'Diurese once perfusion supported to offload a congested circulation.',
              'Use the calculator for weight-based infusion doses and preparation; titrate to perfusion, lactate clearance, and echo.',
            ],
            nursing: ['Continuous arterial BP', 'Hourly urine output', 'Double-check infusion concentrations'],
            triggers: ['No improvement on optimised inotropes → mechanical support discussion', 'Hypotension on milrinone → add vasoconstrictor'],
          },
        ],
      },
      {
        label: 'Stage 4: Refractory / Advanced',
        shortLabel: 'Advanced',
        color: 'indigo',
        cards: [
          {
            title: 'Refractory cardiogenic shock',
            orders: [
              'Escalate to mechanical circulatory support (ECMO / VAD) early — before irreversible multi-organ failure.',
              'Definitive cause-directed therapy: immunomodulation for myocarditis per specialist, surgery/intervention for structural disease, EP management for arrhythmia.',
              'Optimise oxygen delivery vs consumption: sedation, ventilation, temperature control, transfusion threshold.',
              'Early transfer to a cardiac/ECMO centre if not available locally.',
            ],
            nursing: ['Prepare for cannulation/transfer', 'Serial lactate and end-organ markers', 'Family support'],
            triggers: ['Multi-organ dysfunction', 'Refractory to two inotropes → ECMO'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Cardiogenic shock essentials', recommendations: ['Cautious small boluses (5–10 mL/kg), reassess for overload.', 'Early inotropes/inodilator + afterload reduction.', 'Treat the cause (arrhythmia, myocarditis, duct-dependent lesion).', 'Escalate to ECMO/VAD before multi-organ failure.'] }],
  getDisposition: () => ['Admit to PICU with cardiology; consider transfer to a cardiac/ECMO centre.'],
  getRedFlags: () => ['Worsening hepatomegaly/crackles with fluids', 'Hypotension on induction or milrinone', 'Arrhythmia causing shock', 'Rising lactate despite inotropes', 'Neonatal collapse (duct-dependent lesion)'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Cautious crystalloid bolus', dose: w ? `${5 * w}–${10 * w} mL` : '5–10 mL/kg', notes: 'Small aliquots, reassess.' },
      { drugName: 'Milrinone', dose: '0.25–0.75 mcg/kg/min', notes: 'Inodilator; watch BP.' },
      { drugName: 'Dobutamine', dose: '5–20 mcg/kg/min', notes: 'Inotrope with adequate BP.' },
      { drugName: 'Prostaglandin E1', dose: '0.01–0.05 mcg/kg/min', notes: 'Neonatal duct-dependent lesion.' },
    ];
  },
  getReferences: () => [
    { title: 'AHA PALS — Recognition and Management of Shock', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
    { title: 'AHA Scientific Statement: Pediatric Cardiogenic Shock', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001162' },
  ],
};
