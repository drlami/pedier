import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Approach to the unknown poisoning (Master Management Pathway). */
export const picuUnknownPoisoningProtocol: DiseaseProtocol = {
  id: 'picu-unknown-poisoning',
  name: 'Unknown poisoning approach',
  system: 'Toxicology & Environmental',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'A structured approach to the poisoned child of unknown cause — resuscitate, recognise the toxidrome, decontaminate, give antidotes, and enhance elimination.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Treat the patient, not the poison. Resuscitate first (ABC + glucose), then let the TOXIDROME and a few key tests narrow the field. Don\'t Ever Forget Glucose; check a paracetamol and salicylate level in every significant unknown ingestion, and an ECG (QRS/QTc). Decontaminate selectively (activated charcoal only with a protected airway, recent ingestion, suitable toxin), give specific antidotes, and consider enhanced elimination. Call your poisons centre early.',
    stages: [
      {
        label: 'Stage 1: Resuscitate',
        shortLabel: 'Resuscitate',
        color: 'red',
        cards: [
          {
            title: 'ABC, glucose & supportive care',
            isCritical: true,
            orders: [
              'Airway/breathing/circulation; high-flow O2; secure the airway if obtunded (GCS ≤ 8) or losing protective reflexes.',
              'Check glucose immediately and treat hypoglycemia; treat seizures with benzodiazepines.',
              'Treat hypotension with fluids ± vasopressors; obtain IV/IO access and continuous monitoring.',
              'Identify life-threats early: arrhythmia, profound bradycardia/hypotension, hyperthermia, respiratory failure.',
            ],
            nursing: ['Continuous ECG, SpO2, BP, temperature', 'Glucose + bloods', 'Collect history: agent, amount, time, co-ingestants'],
            triggers: ['Coma / loss of airway reflexes → intubate', 'Seizures, arrhythmia, hyperthermia'],
          },
        ],
      },
      {
        label: 'Stage 2: Identify the Toxidrome & Investigate',
        shortLabel: 'Toxidrome',
        color: 'amber',
        cards: [
          {
            title: 'Pattern recognition & key tests',
            orders: [
              'Recognise the toxidrome: cholinergic (SLUDGE/bronchorrhea), anticholinergic (hot/dry/dilated/delirious), sympathomimetic, opioid (pinpoint pupils, ↓RR), sedative-hypnotic, serotonin syndrome.',
              'Vital tests in every significant unknown: paracetamol level (4 h post-ingestion), salicylate level, glucose, blood gas, electrolytes, renal/liver function, ECG (QRS & QTc).',
              'Calculate the anion gap and (if relevant) osmolar gap; consider co-oximetry (carboxy/methaemoglobin).',
              'Contact the poisons information service / toxicology for agent-specific advice.',
            ],
            nursing: ['Serial ECGs (QRS/QTc)', 'Timed paracetamol level', 'Save samples for analysis'],
            triggers: ['Wide QRS → sodium bicarbonate (e.g. TCA)', 'Raised anion/osmolar gap → toxic alcohol workup', 'Specific toxidrome identified'],
          },
        ],
      },
      {
        label: 'Stage 3: Decontamination & Antidotes',
        shortLabel: 'Antidotes',
        color: 'red',
        cards: [
          {
            title: 'Decontaminate selectively; give antidotes',
            orders: [
              'Activated charcoal ONLY if airway protected, presentation within ~1 hour, and the toxin binds charcoal (not for iron, lithium, alcohols, hydrocarbons, caustics).',
              'Whole-bowel irrigation for selected agents (iron, sustained-release, body packers) per toxicology.',
              'Give specific antidotes: naloxone (opioids), N-acetylcysteine (paracetamol), sodium bicarbonate (TCA / wide QRS), high-dose insulin/glucagon (beta-blocker/calcium-channel blocker), atropine + pralidoxime (organophosphate), fomepizole (toxic alcohols), digoxin-specific antibodies, hydroxocobalamin (cyanide), lipid emulsion (local-anaesthetic / lipophilic toxicity).',
              'Treat agent-specific complications under toxicology guidance.',
            ],
            nursing: ['Airway protection before charcoal', 'Prepare antidote(s)', 'Reassess response'],
            prescriptions: [
              { drug: 'Activated charcoal', dose: '1 g/kg (max 50 g)', route: 'PO/NG', frequency: 'If indicated', calculation: (w: number) => `${Math.min(1 * w, 50).toFixed(0)} g`, notes: 'Only with protected airway, suitable toxin, recent ingestion.' },
              { drug: 'Naloxone', dose: '0.01–0.1 mg/kg (max 2 mg)', route: 'IV/IM/IN', frequency: 'Opioid; repeat/infuse', calculation: (w: number) => `${Math.min(0.1 * w, 2).toFixed(2)} mg`, notes: 'Repeat / infusion for long-acting opioids.' },
              { drug: 'Sodium bicarbonate 8.4%', dose: '1–2 mmol/kg', route: 'IV', frequency: 'Wide QRS (e.g. TCA)', calculation: (w: number) => `${(1 * w).toFixed(0)}–${(2 * w).toFixed(0)} mmol`, notes: 'Bolus for QRS widening / serum alkalinisation.' },
              { drug: 'N-acetylcysteine', dose: 'Per paracetamol protocol', route: 'IV', frequency: 'Paracetamol', calculation: (w: number) => `weight-based per nomogram/protocol`, notes: 'Start if toxic level/timing or staggered/unknown-time ingestion.' },
            ],
            triggers: ['Agent-specific toxicity → targeted antidote', 'No response → reassess diagnosis / enhanced elimination'],
          },
        ],
      },
      {
        label: 'Stage 4: Enhanced Elimination & Monitoring',
        shortLabel: 'Elimination',
        color: 'indigo',
        cards: [
          {
            title: 'Enhanced elimination & ongoing care',
            orders: [
              'Urinary alkalinisation (salicylates, some others) per toxicology.',
              'Haemodialysis/CRRT for dialysable toxins: toxic alcohols, salicylate (severe), lithium, metformin-associated acidosis, theophylline, valproate (severe).',
              'Multiple-dose activated charcoal for selected agents (e.g. theophylline, carbamazepine, phenobarbital) with a protected airway.',
              'Continue monitoring for delayed toxicity (e.g. paracetamol hepatotoxicity, sustained-release agents); psychiatric/safeguarding assessment.',
            ],
            nursing: ['Urinary pH monitoring if alkalinising', 'Prepare for dialysis if indicated', 'Observe for delayed toxicity'],
            triggers: ['Severe poisoning with a dialysable toxin → CRRT/HD', 'Delayed organ toxicity'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Unknown poisoning essentials', recommendations: ['Resuscitate: ABC + glucose; treat seizures/arrhythmia/hypotension.', 'Recognise the toxidrome; check paracetamol + salicylate levels and ECG.', 'Charcoal only if airway protected + recent + suitable toxin; give specific antidotes.', 'Enhanced elimination (alkalinisation, dialysis) for selected toxins; call poisons centre.'] }],
  getDisposition: () => ['PICU for significant poisoning; toxicology/poisons-centre guidance.'],
  getRedFlags: () => ['Coma / loss of airway reflexes', 'Wide QRS or prolonged QTc', 'Refractory hypotension or bradycardia', 'Hyperthermia / seizures', 'Raised anion/osmolar gap'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Activated charcoal', dose: w ? `${Math.min(1 * w, 50).toFixed(0)} g` : '1 g/kg (max 50 g)', notes: 'Protected airway; suitable toxin.' },
      { drugName: 'Naloxone', dose: w ? `${Math.min(0.1 * w, 2).toFixed(2)} mg` : '0.01–0.1 mg/kg', notes: 'Opioid.' },
      { drugName: 'Sodium bicarbonate 8.4%', dose: w ? `${(1 * w).toFixed(0)}–${(2 * w).toFixed(0)} mmol` : '1–2 mmol/kg', notes: 'Wide QRS (TCA).' },
    ];
  },
  getReferences: () => [
    { title: 'RCEM/TOXBASE — Poisoned patient guidance', url: 'https://www.toxbase.org/' },
    { title: 'AACT/EAPCCT Position Statements (decontamination/elimination)', url: 'https://www.clintox.org/position-statements' },
  ],
};
