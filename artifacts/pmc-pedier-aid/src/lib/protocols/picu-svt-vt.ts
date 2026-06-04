import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Arrhythmia (SVT / VT) (Master Management Pathway). */
export const picuSvtVtProtocol: DiseaseProtocol = {
  id: 'picu-svt-vt',
  name: 'Arrhythmia (SVT / VT)',
  system: 'Shock & Cardiovascular',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Recognition and management of tachyarrhythmias in children — stable vs unstable, narrow-complex SVT and wide-complex VT, per PALS.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Two questions decide everything: is the child STABLE or UNSTABLE (shock, hypotension, altered mental status), and is the QRS NARROW (SVT) or WIDE (VT)? Unstable tachyarrhythmia → synchronised cardioversion now. Stable SVT → vagal manoeuvres then adenosine. Stable wide-complex (VT with a pulse) → expert help, amiodarone/procainamide, or cardioversion. No pulse → the cardiac-arrest pathway.',
    stages: [
      {
        label: 'Stage 1: Assess & Classify',
        shortLabel: 'Classify',
        color: 'red',
        cards: [
          {
            title: 'Stable vs unstable · narrow vs wide',
            isCritical: true,
            orders: [
              'Check for a pulse — if none, go to the cardiac-arrest pathway immediately.',
              'Assess stability: signs of shock (poor perfusion, hypotension, altered consciousness, heart failure) = UNSTABLE.',
              'Get a 12-lead ECG and rhythm strip if time allows. Narrow QRS (< 0.09 s) = SVT (rate often > 220 infants / > 180 children, minimal beat-to-beat variability, no visible P waves). Wide QRS (> 0.09 s) = VT until proven otherwise.',
              'Distinguish SVT from sinus tachycardia (history, variability, P waves, rate that varies with stimulation).',
            ],
            nursing: ['Continuous ECG + defibrillator/pads at bedside', 'IV/IO access', 'Apply monitoring & record rhythm'],
            triggers: ['Unstable → synchronised cardioversion', 'Pulseless → arrest pathway', 'Wide-complex → treat as VT'],
          },
        ],
      },
      {
        label: 'Stage 2: SVT (Narrow Complex)',
        shortLabel: 'SVT',
        color: 'amber',
        cards: [
          {
            title: 'Stable & unstable SVT',
            orders: [
              'Stable: vagal manoeuvres first (ice to face in infants; Valsalva/blowing in older children).',
              'If vagal fails and IV access: adenosine by RAPID push with a saline flush (largest/most proximal vein); may repeat at higher dose.',
              'Unstable SVT: synchronised cardioversion 0.5–1 J/kg (do not delay for adenosine unless immediately available); escalate to 2 J/kg if needed.',
              'Record a rhythm strip during adenosine; involve cardiology; consider amiodarone/procainamide for refractory SVT.',
            ],
            nursing: ['Print continuous strip during adenosine', 'Sedation/analgesia for cardioversion if stable enough', 'Reassess perfusion post-conversion'],
            prescriptions: [
              { drug: 'Adenosine (1st dose)', dose: '0.1 mg/kg (max 6 mg)', route: 'IV/IO rapid push', frequency: 'Then 0.2 mg/kg', calculation: (w: number) => `${Math.min(0.1 * w, 6).toFixed(1)} mg`, notes: 'Rapid push + immediate saline flush; record strip.' },
              { drug: 'Adenosine (2nd dose)', dose: '0.2 mg/kg (max 12 mg)', route: 'IV/IO rapid push', frequency: 'If no conversion', calculation: (w: number) => `${Math.min(0.2 * w, 12).toFixed(1)} mg`, notes: 'May repeat once.' },
              { drug: 'Synchronised cardioversion', dose: '0.5–1 J/kg → 2 J/kg', route: 'Electrical', frequency: 'If unstable', calculation: (w: number) => `${(0.5 * w).toFixed(0)}–${(1 * w).toFixed(0)} J, then ${(2 * w).toFixed(0)} J`, notes: 'Sedate if possible; synchronised mode.' },
            ],
            triggers: ['Refractory SVT → cardiology, amiodarone/procainamide', 'Becomes unstable → cardiovert'],
          },
        ],
      },
      {
        label: 'Stage 3: VT (Wide Complex)',
        shortLabel: 'VT',
        color: 'red',
        cards: [
          {
            title: 'VT with a pulse',
            isCritical: true,
            orders: [
              'Unstable VT with a pulse: synchronised cardioversion 0.5–1 J/kg (→ 2 J/kg). Pulseless VT → defibrillation + arrest pathway.',
              'Stable VT: seek expert help; antiarrhythmic — amiodarone OR procainamide (do NOT routinely give both — additive hypotension/QT).',
              'Identify and treat reversible causes: electrolytes (K, Mg, Ca), toxins (TCA → sodium bicarbonate), long QT, ischemia, channelopathy.',
              'Torsades de pointes → IV magnesium sulfate.',
            ],
            nursing: ['Continuous ECG/BP during infusion', 'Defibrillator ready', 'Send electrolytes + toxicology'],
            prescriptions: [
              { drug: 'Amiodarone', dose: '5 mg/kg (max 300 mg)', route: 'IV', frequency: 'Over 20–60 min (perfusing)', calculation: (w: number) => `${Math.min(5 * w, 300)} mg`, notes: 'Slow if perfusing rhythm; watch hypotension. May repeat to max 15 mg/kg/day.' },
              { drug: 'Procainamide', dose: '15 mg/kg', route: 'IV', frequency: 'Over 30–60 min', calculation: (w: number) => `${(15 * w).toFixed(0)} mg`, notes: 'Alternative to amiodarone; monitor QRS/QT/BP; do not combine.' },
              { drug: 'Magnesium sulfate', dose: '25–50 mg/kg (max 2 g)', route: 'IV', frequency: 'Torsades', calculation: (w: number) => `${Math.min(25 * w, 2000)}–${Math.min(50 * w, 2000)} mg`, notes: 'For torsades / hypomagnesemia.' },
            ],
            triggers: ['Unstable → synchronised cardioversion', 'Pulseless → defibrillate + arrest pathway'],
          },
        ],
      },
      {
        label: 'Stage 4: Post-Conversion & Cause',
        shortLabel: 'Post / Cause',
        color: 'emerald',
        cards: [
          {
            title: 'After conversion',
            orders: [
              '12-lead ECG post-conversion (look for pre-excitation/WPW, long QT, ischemia).',
              'Correct and monitor electrolytes; review medications/toxins.',
              'Cardiology review for ongoing management and recurrence prevention.',
              'Admit to PICU/cardiac monitoring; document the rhythm and response for future episodes.',
            ],
            nursing: ['Continuous monitoring for recurrence', 'Serial ECGs', 'Cardiology liaison'],
            triggers: ['Recurrence → expert-guided antiarrhythmic', 'WPW/long QT identified'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Arrhythmia essentials', recommendations: ['Decide stable vs unstable and narrow vs wide.', 'Unstable → synchronised cardioversion 0.5–1 → 2 J/kg.', 'Stable SVT → vagal then adenosine 0.1 → 0.2 mg/kg.', 'Stable VT → amiodarone or procainamide (not both); torsades → magnesium.'] }],
  getDisposition: () => ['PICU / continuous cardiac monitoring; cardiology involvement.'],
  getRedFlags: () => ['Shock / hypotension with tachyarrhythmia', 'Wide-complex tachycardia', 'Pulseless rhythm', 'WPW / pre-excitation', 'Prolonged QT / torsades'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Adenosine', dose: w ? `${Math.min(0.1 * w, 6).toFixed(1)} → ${Math.min(0.2 * w, 12).toFixed(1)} mg` : '0.1 → 0.2 mg/kg', notes: 'Rapid push + flush.' },
      { drugName: 'Synchronised cardioversion', dose: w ? `${(0.5 * w).toFixed(0)}–${(1 * w).toFixed(0)} → ${(2 * w).toFixed(0)} J` : '0.5–1 → 2 J/kg', notes: 'Unstable rhythm.' },
      { drugName: 'Amiodarone', dose: w ? `${Math.min(5 * w, 300)} mg` : '5 mg/kg (max 300 mg)', notes: 'Stable VT (perfusing — slow).' },
    ];
  },
  getReferences: () => [
    { title: 'AHA PALS — Tachycardia with a Pulse algorithm', url: 'https://cpr.heart.org/en/resuscitation-science/pediatric-advanced-life-support' },
    { title: 'AHA Pediatric Advanced Life Support Guidelines', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901' },
  ],
};
