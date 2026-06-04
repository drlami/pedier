import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Pneumothorax & chest drain (Master Management Pathway). */
export const picuPneumothoraxProtocol: DiseaseProtocol = {
  id: 'picu-pneumothorax',
  name: 'Pneumothorax & chest drain',
  system: 'Respiratory & Airway',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Recognition of simple vs tension pneumothorax, emergency needle decompression, chest drain insertion, and ongoing management and removal.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Tension pneumothorax is a clinical diagnosis and a kill-in-minutes emergency — decompress immediately, do NOT wait for a chest X-ray. Suspect it in any sudden deterioration in a ventilated child: rising airway pressures or desaturation, absent breath sounds, tracheal shift, distended neck veins, hypotension. Needle decompression buys time; a chest drain is the definitive treatment.',
    stages: [
      {
        label: 'Stage 1: Recognise',
        shortLabel: 'Recognise',
        color: 'red',
        cards: [
          {
            title: 'Simple vs tension pneumothorax',
            isCritical: true,
            orders: [
              'Tension signs: acute respiratory distress/hypoxia, unilateral absent breath sounds + hyperresonance, tracheal deviation away, distended neck veins, hypotension/tachycardia; in a ventilated child — sudden rise in airway pressures and desaturation.',
              'Tension is CLINICAL — treat before imaging.',
              'Stable/simple pneumothorax: confirm with CXR or point-of-care ultrasound; assess size and symptoms.',
              'Consider causes: barotrauma (ventilation), trauma, central line insertion, underlying lung disease.',
            ],
            nursing: ['Continuous SpO2, BP, airway pressures', 'Call for senior help immediately if tension', 'Prepare decompression + drain kit'],
            triggers: ['Any suspicion of tension → decompress now', 'Ventilated child with sudden desaturation + high pressures'],
          },
        ],
      },
      {
        label: 'Stage 2: Tension — Emergency Decompression',
        shortLabel: 'Decompress',
        color: 'red',
        cards: [
          {
            title: 'Immediate needle/finger decompression',
            isCritical: true,
            threshold: 'DO NOT WAIT FOR X-RAY',
            orders: [
              'High-flow oxygen; if ventilated consider briefly disconnecting/hand-ventilating to assess.',
              'Needle decompression: cannula into the 2nd intercostal space mid-clavicular line, OR 4th–5th intercostal space anterior/mid-axillary line (safe triangle) — over the rib to avoid the neurovascular bundle.',
              'In larger children, finger thoracostomy (4th/5th ICS anterior axillary) may be more reliable.',
              'Follow immediately with a definitive chest drain.',
            ],
            nursing: ['Skin prep; over-the-rib insertion', 'Listen for the hiss / improvement', 'Set up underwater seal drain'],
            triggers: ['No improvement after needle → finger thoracostomy / repeat', 'Proceed to chest drain'],
          },
        ],
      },
      {
        label: 'Stage 3: Chest Drain Insertion',
        shortLabel: 'Chest Drain',
        color: 'amber',
        cards: [
          {
            title: 'Intercostal chest drain',
            orders: [
              'Indications: tension pneumothorax (after decompression), large/symptomatic pneumothorax, ventilated patients, recurrent or hemopneumothorax.',
              'Insert in the safe triangle (4th–5th ICS, anterior to mid-axillary line); blunt dissection over the rib; aseptic technique.',
              'Size guide (approx): infant 8–12 Fr, small child 12–16 Fr, larger child 16–24 Fr (larger if fluid/blood).',
              'Connect to underwater seal ± low-pressure suction; confirm position and re-expansion on CXR; provide procedural analgesia/sedation.',
            ],
            nursing: ['Underwater seal below chest; check swing/bubbling', 'Secure drain; monitor output', 'Analgesia for the drain'],
            prescriptions: [
              { drug: 'Ketamine (procedural)', dose: '1–2 mg/kg', route: 'IV', frequency: 'For insertion', calculation: (w: number) => `${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mg`, notes: 'Plus local anaesthetic infiltration.' },
              { drug: 'Lidocaine 1% (local)', dose: 'up to 3 mg/kg', route: 'SC', frequency: 'Infiltrate site', calculation: (w: number) => `max ${(3 * w).toFixed(0)} mg (= ${(0.3 * w).toFixed(1)} mL of 1%)`, notes: 'Do not exceed max dose.' },
            ],
            triggers: ['Persistent large air leak → check drain / suction / bronchopleural fistula', 'Drain not swinging → blocked/malpositioned'],
          },
        ],
      },
      {
        label: 'Stage 4: Management & Removal',
        shortLabel: 'Manage',
        color: 'emerald',
        cards: [
          {
            title: 'Ongoing care & removal',
            orders: [
              'Monitor for re-expansion, air leak (bubbling), and drainage volume; daily CXR as indicated.',
              'Wean suction once lung re-expanded and air leak resolved; clamp/observe per local protocol before removal.',
              'Remove when no air leak and lung remains expanded; remove during expiration/Valsalva with an occlusive dressing.',
              'Treat the underlying cause; minimise barotrauma with lung-protective ventilation.',
            ],
            nursing: ['Hourly/shift drain checks (swing, bubble, volume)', 'Occlusive dressing on removal', 'Post-removal CXR'],
            triggers: ['Recurrence after removal', 'Ongoing air leak → thoracic surgery referral'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Pneumothorax essentials', recommendations: ['Tension = clinical emergency: decompress before imaging.', 'Needle/finger decompression then definitive chest drain.', 'Insert drain in the safe triangle; size by age; underwater seal.', 'Lung-protective ventilation to prevent barotrauma.'] }],
  getDisposition: () => ['PICU monitoring with chest drain; thoracic surgery if persistent air leak.'],
  getRedFlags: () => ['Tracheal deviation + hypotension (tension)', 'Sudden rise in airway pressures + desaturation (ventilated)', 'Absent unilateral breath sounds', 'Distended neck veins', 'Persistent large air leak'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Ketamine (procedural)', dose: w ? `${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mg` : '1–2 mg/kg', notes: 'For drain insertion.' },
      { drugName: 'Lidocaine 1% (local)', dose: w ? `max ${(3 * w).toFixed(0)} mg` : 'up to 3 mg/kg', notes: 'Local infiltration.' },
    ];
  },
  getReferences: () => [
    { title: 'APLS — Tension pneumothorax & thoracostomy', url: 'https://www.apls.org.au/' },
    { title: 'BTS Pleural Disease Guideline (chest drains)', url: 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pleural-disease/' },
  ],
};
