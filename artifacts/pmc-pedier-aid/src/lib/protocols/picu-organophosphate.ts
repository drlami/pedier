import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Organophosphate poisoning (Master Management Pathway). */
export const picuOrganophosphateProtocol: DiseaseProtocol = {
  id: 'picu-organophosphate',
  name: 'Organophosphate poisoning',
  system: 'Toxicology & Environmental',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Cholinergic crisis from organophosphate/carbamate poisoning — staff protection and decontamination, aggressive atropinisation, oximes, and intensive support.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Organophosphates kill through the airway and breathing — bronchorrhea, bronchospasm, and respiratory muscle weakness from a cholinergic crisis (think SLUDGE/DUMBELS). ATROPINE is the priority and there is no fixed maximum: give it in rapidly DOUBLING doses until the chest is clear and secretions dry (the endpoint is the lungs, not the heart rate or pupils). Add an oxime (pralidoxime) for the nicotinic/muscle effects, control seizures with benzodiazepines, and protect yourself — wear PPE and decontaminate.',
    stages: [
      {
        label: 'Stage 1: Protect, Decontaminate & Recognise',
        shortLabel: 'Protect',
        color: 'red',
        cards: [
          {
            title: 'Staff PPE, decontamination & toxidrome',
            isCritical: true,
            orders: [
              'Staff PPE (gloves/gown/eye protection); remove the child\'s clothing and decontaminate skin (avoid secondary contamination of staff).',
              'Recognise the cholinergic toxidrome — DUMBELS: Defecation, Urination, Miosis, Bronchorrhea/Bronchospasm, Emesis, Lacrimation, Salivation; plus sweating, bradycardia, fasciculations, weakness, seizures.',
              'ABC with aggressive airway suctioning; high-flow O2; anticipate respiratory failure.',
              'Send bloods (including, where available, red-cell/plasma cholinesterase) — but treat clinically; do not wait for levels.',
            ],
            nursing: ['PPE before patient contact', 'Continuous suction for secretions', 'Continuous ECG, SpO2, BP'],
            triggers: ['Respiratory failure / copious secretions', 'Bradycardia + bronchorrhea', 'Seizures'],
          },
        ],
      },
      {
        label: 'Stage 2: Atropinisation',
        shortLabel: 'Atropine',
        color: 'red',
        cards: [
          {
            title: 'Aggressive doubling-dose atropine',
            isCritical: true,
            threshold: 'TITRATE TO CLEAR CHEST',
            orders: [
              'Give IV atropine and DOUBLE the dose every ~5 minutes until the endpoint is reached — there is no fixed maximum.',
              'Endpoint of atropinisation: clear chest on auscultation (dry secretions, no bronchospasm), SpO2 > 92%, heart rate adequate, systolic BP adequate. (Pupils are NOT a reliable endpoint.)',
              'Once atropinised, start an atropine infusion at ~10–20% of the total loading dose per hour and titrate.',
              'Beware re-secretion — monitor closely and re-bolus as needed.',
            ],
            nursing: ['Auscultate chest frequently as the titration endpoint', 'Track cumulative atropine dose', 'Continuous suction + monitoring'],
            prescriptions: [
              { drug: 'Atropine', dose: '0.02–0.05 mg/kg, DOUBLE q5min until chest clear', route: 'IV', frequency: 'Then infusion', calculation: (w: number) => `start ${(0.02 * w).toFixed(2)}–${(0.05 * w).toFixed(2)} mg, double q5min`, notes: 'No fixed max; endpoint = dry chest. Infusion ~10–20% of total load per hour.' },
            ],
            triggers: ['Recurrence of secretions → re-bolus / increase infusion', 'Atropine toxicity (hyperthermia, ileus, agitation) → pause/reduce'],
          },
        ],
      },
      {
        label: 'Stage 3: Oxime & Seizure Control',
        shortLabel: 'Pralidoxime',
        color: 'amber',
        cards: [
          {
            title: 'Pralidoxime & benzodiazepines',
            orders: [
              'Give pralidoxime (an oxime) early for nicotinic effects (muscle weakness/fasciculations) and to reactivate cholinesterase — most useful before ageing of the enzyme. Use alongside (not instead of) atropine.',
              'Control seizures and fasciculation-related agitation with benzodiazepines (diazepam/midazolam/lorazepam).',
              'Continue an oxime infusion or repeated dosing per toxicology guidance.',
              'Carbamate poisoning: atropine is the mainstay; oximes are generally not required (spontaneously reversible).',
            ],
            nursing: ['Give oxime via separate infusion', 'Monitor for weakness / respiratory effort', 'Document seizure control'],
            prescriptions: [
              { drug: 'Pralidoxime', dose: '25–50 mg/kg (max 2 g) then infusion', route: 'IV', frequency: 'Over 15–30 min', calculation: (w: number) => `${Math.min(25 * w, 2000)}–${Math.min(50 * w, 2000)} mg`, notes: 'Then infusion ~10–20 mg/kg/h per toxicology; give early.' },
              { drug: 'Diazepam', dose: '0.2–0.3 mg/kg (max 10 mg)', route: 'IV', frequency: 'Seizures/agitation', calculation: (w: number) => `${Math.min(0.3 * w, 10).toFixed(1)} mg`, notes: 'Midazolam/lorazepam are alternatives.' },
            ],
            triggers: ['Worsening weakness → anticipate respiratory failure / intubation', 'Ongoing seizures'],
          },
        ],
      },
      {
        label: 'Stage 4: ICU Support & Complications',
        shortLabel: 'ICU Support',
        color: 'emerald',
        cards: [
          {
            title: 'Ventilation & delayed syndromes',
            orders: [
              'Intubate and ventilate for respiratory failure/muscle weakness; AVOID suxamethonium (prolonged paralysis — metabolised by cholinesterase).',
              'Watch for the intermediate syndrome (proximal/respiratory muscle weakness 24–96 h after the crisis) — may need prolonged ventilation.',
              'Continue atropine/oxime titration; monitor for rebound as fat-stored lipophilic agents redistribute.',
              'Supportive PICU care; psychiatric/safeguarding assessment once recovered.',
            ],
            nursing: ['Monitor respiratory effort for intermediate syndrome', 'Avoid suxamethonium', 'Ongoing titration documentation'],
            triggers: ['Intermediate syndrome → continued ventilation', 'Rebound cholinergic features'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Organophosphate essentials', recommendations: ['Staff PPE + decontaminate; aggressive airway suctioning.', 'Atropine in doubling doses until the chest is clear (no fixed max), then infusion.', 'Pralidoxime early for nicotinic effects; benzodiazepines for seizures.', 'Ventilate for failure; avoid suxamethonium; watch for intermediate syndrome.'] }],
  getDisposition: () => ['PICU; prolonged monitoring for intermediate syndrome and rebound.'],
  getRedFlags: () => ['Bronchorrhea / bronchospasm / respiratory failure', 'Bradycardia + hypotension', 'Seizures', 'Muscle weakness / fasciculations', 'Intermediate syndrome (delayed weakness)'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Atropine', dose: w ? `start ${(0.02 * w).toFixed(2)}–${(0.05 * w).toFixed(2)} mg, double q5min` : '0.02–0.05 mg/kg doubling', notes: 'Endpoint = clear chest; no fixed max.' },
      { drugName: 'Pralidoxime', dose: w ? `${Math.min(25 * w, 2000)}–${Math.min(50 * w, 2000)} mg` : '25–50 mg/kg', notes: 'Give early; then infusion.' },
      { drugName: 'Diazepam', dose: w ? `${Math.min(0.3 * w, 10).toFixed(1)} mg` : '0.2–0.3 mg/kg', notes: 'Seizures.' },
    ];
  },
  getReferences: () => [
    { title: 'Position paper: management of acute organophosphorus pesticide poisoning (Lancet)', url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(07)61202-1/fulltext' },
    { title: 'WHO/IPCS — Organophosphate poisoning management', url: 'https://www.who.int/teams/environment-climate-change-and-health/chemical-safety-and-health' },
  ],
};
