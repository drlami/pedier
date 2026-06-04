import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Critical envenomation (snake / scorpion) (Master Management Pathway). */
export const picuEnvenomationProtocol: DiseaseProtocol = {
  id: 'picu-envenomation',
  name: 'Critical envenomation (snake / scorpion)',
  system: 'Toxicology & Environmental',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Systemic snake and scorpion envenomation — recognising systemic envenoming, timely antivenom, and the organ-specific supportive care that saves lives.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Antivenom treats the venom; supportive care keeps the child alive while it works. For SNAKEBITE, look for systemic envenoming — coagulopathy (a positive 20-minute whole-blood clotting test), neurotoxic paralysis (ptosis → respiratory failure), or local progression — and give antivenom for any of these. For SCORPION sting, the danger is an autonomic storm and myocardial dysfunction/pulmonary edema; prazosin and antivenom (region-dependent) plus supportive care are key. Antivenom doses are the SAME for children and adults — it neutralises a fixed venom load.',
    stages: [
      {
        label: 'Stage 1: Assess Envenomation',
        shortLabel: 'Assess',
        color: 'red',
        cards: [
          {
            title: 'Local vs systemic envenoming',
            isCritical: true,
            orders: [
              'ABC, IV access, continuous monitoring; immobilise the limb, remove constrictions; do NOT cut/suck/apply tourniquet.',
              'Snakebite — assess for systemic envenoming: COAGULOPATHY (20-minute whole-blood clotting test, bleeding gums/sites), NEUROTOXICITY (ptosis, ophthalmoplegia, bulbar/respiratory weakness), local swelling progression, AKI/rhabdomyolysis.',
              'Scorpion sting — assess autonomic storm: sweating, hypertension/tachycardia then hypotension, vomiting, priapism, and pulmonary edema / myocardial dysfunction.',
              'Bloods: coagulation/INR/fibrinogen, FBC, U&E/CK, group & save; ECG/echo for scorpion cardiac involvement.',
            ],
            nursing: ['20-min WBCT for snakebite; repeat 6-hourly', 'Mark and monitor limb swelling/time', 'Continuous ECG/SpO2/BP'],
            triggers: ['Any systemic envenoming → antivenom', 'Respiratory weakness (neurotoxic)', 'Pulmonary edema (scorpion)'],
          },
        ],
      },
      {
        label: 'Stage 2: Antivenom',
        shortLabel: 'Antivenom',
        color: 'red',
        cards: [
          {
            title: 'Indications & administration',
            isCritical: true,
            orders: [
              'Give antivenom for systemic envenoming: snakebite with coagulopathy, neurotoxicity, cardiovascular instability, significant/progressive local swelling, or AKI; scorpion antivenom per local protocol for systemic toxicity.',
              'Antivenom dose is the SAME for children and adults (neutralises venom, not body weight) — follow the local product\'s dosing.',
              'Give IV; be PREPARED FOR ANAPHYLAXIS — have adrenaline drawn up and monitor closely during infusion.',
              'Reassess after antivenom (repeat WBCT/coagulation at ~6 h for snakebite); repeat doses for persistent/recurrent envenoming.',
            ],
            nursing: ['Adrenaline at bedside before antivenom', 'Monitor closely during infusion for reaction', 'Repeat coagulation post-antivenom'],
            prescriptions: [
              { drug: 'Antivenom', dose: 'Per local product (SAME for children & adults)', route: 'IV', frequency: 'Repeat for persistent envenoming', calculation: (w: number) => `weight-independent — follow local antivenom protocol`, notes: 'Indicated for systemic envenoming. Watch for anaphylaxis.' },
              { drug: 'Adrenaline (anaphylaxis)', dose: '0.01 mg/kg of 1:1000 (max 0.5 mg)', route: 'IM', frequency: 'If reaction', calculation: (w: number) => `${Math.min(0.01 * w, 0.5).toFixed(2)} mg IM`, notes: 'Standby during antivenom infusion.' },
            ],
            triggers: ['Anaphylaxis to antivenom → adrenaline + supportive', 'Persistent coagulopathy/neurotoxicity → repeat antivenom'],
          },
        ],
      },
      {
        label: 'Stage 3: Organ-Specific Support',
        shortLabel: 'Support',
        color: 'amber',
        cards: [
          {
            title: 'Targeted supportive care',
            orders: [
              'Neurotoxic snakebite: support airway/ventilation for bulbar/respiratory weakness; a trial of neostigmine + atropine may help in some elapid envenoming.',
              'Hematotoxic snakebite: antivenom is the primary treatment for coagulopathy; give blood products only for active bleeding (factors are consumed — antivenom first).',
              'Scorpion autonomic storm / myocardial dysfunction: prazosin (alpha-blockade) where used, manage pulmonary edema (oxygen/NIV, careful fluids, inotropes/dobutamine for cardiac dysfunction).',
              'Manage AKI/rhabdomyolysis (fluids, monitor K⁺, CRRT if needed); analgesia; tetanus prophylaxis and wound care.',
            ],
            nursing: ['Respiratory monitoring for neuroparalysis', 'Strict fluid balance (cardiac/renal)', 'Wound care + tetanus status'],
            prescriptions: [
              { drug: 'Prazosin (scorpion)', dose: '30 mcg/kg', route: 'PO', frequency: 'q3–6h per protocol', calculation: (w: number) => `${(30 * w).toFixed(0)} mcg`, notes: 'Alpha-blocker for scorpion autonomic storm (region-dependent); monitor BP.' },
              { drug: 'Neostigmine (+ atropine)', dose: 'Neostigmine 0.04 mg/kg + atropine 0.02 mg/kg', route: 'IV', frequency: 'Neurotoxic trial', calculation: (w: number) => `neostigmine ${(0.04 * w).toFixed(2)} mg + atropine ${(0.02 * w).toFixed(2)} mg`, notes: 'Trial in some elapid neurotoxic envenoming.' },
            ],
            triggers: ['Respiratory failure → intubate/ventilate', 'Refractory pulmonary edema / cardiac dysfunction'],
          },
        ],
      },
      {
        label: 'Stage 4: Monitor & Ongoing',
        shortLabel: 'Monitor',
        color: 'emerald',
        cards: [
          {
            title: 'Observation & follow-up',
            orders: [
              'Observe for delayed/recurrent envenoming — repeat coagulation and clinical assessment; some venoms have delayed effects.',
              'Continue organ support and monitor renal/cardiac/neurological recovery.',
              'Wound care, antibiotics only if secondary infection, ensure tetanus prophylaxis.',
              'Serum-sickness counselling after antivenom; safety-net and follow-up advice.',
            ],
            nursing: ['Repeat WBCT/coagulation per protocol', 'Monitor for recurrence', 'Discharge advice + follow-up'],
            triggers: ['Recurrence of coagulopathy/neurotoxicity', 'Late complications (AKI, infection, serum sickness)'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Envenomation essentials', recommendations: ['Identify systemic envenoming (snake: coagulopathy/neurotoxicity/local; scorpion: autonomic storm/pulmonary edema).', 'Antivenom for systemic envenoming — same dose for children & adults; ready for anaphylaxis.', 'Snake: airway support for neurotoxicity; blood products only for active bleeding (antivenom first).', 'Scorpion: prazosin + manage pulmonary edema/cardiac dysfunction.'] }],
  getDisposition: () => ['PICU for systemic envenoming; supportive organ-specific care.'],
  getRedFlags: () => ['Positive 20-min whole-blood clotting test / bleeding', 'Ptosis / bulbar or respiratory weakness', 'Pulmonary edema / cardiac dysfunction (scorpion)', 'Anaphylaxis to antivenom', 'AKI / rhabdomyolysis'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Antivenom', dose: 'Per local protocol (same for children & adults)', notes: 'Systemic envenoming; watch for anaphylaxis.' },
      { drugName: 'Adrenaline (anaphylaxis)', dose: w ? `${Math.min(0.01 * w, 0.5).toFixed(2)} mg IM` : '0.01 mg/kg IM (max 0.5 mg)', notes: 'Standby during antivenom.' },
      { drugName: 'Prazosin (scorpion)', dose: w ? `${(30 * w).toFixed(0)} mcg` : '30 mcg/kg', notes: 'Autonomic storm (region-dependent).' },
    ];
  },
  getReferences: () => [
    { title: 'WHO — Guidelines for the management of snakebite', url: 'https://www.who.int/publications/i/item/9789290225300' },
    { title: 'Indian/National guidelines — Scorpion sting management (prazosin)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3339220/' },
  ],
};
