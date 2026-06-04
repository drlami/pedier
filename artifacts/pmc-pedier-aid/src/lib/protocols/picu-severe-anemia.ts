import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — Severe anemia / massive transfusion (Master Management Pathway). */
export const picuSevereAnemiaProtocol: DiseaseProtocol = {
  id: 'picu-severe-anemia',
  name: 'Severe anemia / massive transfusion',
  system: 'Sepsis, Infection & Hematology',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Two scenarios from one symptom — acute haemorrhage requiring massive transfusion, and severe chronic anaemia requiring slow, careful correction.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'Treat the patient, not the number. The decision hinges on TEMPO: acute haemorrhage with shock needs rapid, BALANCED resuscitation (activate massive transfusion, give RBC:plasma:platelets together, tranexamic acid early, watch calcium). Severe CHRONIC anaemia (often Hb very low but compensated) is the opposite — transfuse SLOWLY in small aliquots to avoid tipping a dilated heart into failure. Always send a group & crossmatch and find the cause.',
    stages: [
      {
        label: 'Stage 1: Assess',
        shortLabel: 'Assess',
        color: 'red',
        cards: [
          {
            title: 'Acute vs chronic & decompensation',
            isCritical: true,
            orders: [
              'Assess for decompensation: shock, altered mental status, high-output failure (gallop, hepatomegaly), severe tachycardia, lactate.',
              'Determine tempo: acute blood loss/haemolysis vs chronic anaemia (often profound but compensated — e.g. nutritional, thalassemia, marrow failure).',
              'Send: FBC + film, reticulocytes, group & crossmatch, coagulation/fibrinogen, U&E, LFTs, haemolysis screen, lactate.',
              'Identify and control bleeding source; identify haemolysis or marrow cause.',
            ],
            nursing: ['Continuous monitoring + perfusion', 'Large-bore access; crossmatch sample', 'Quantify ongoing losses'],
            triggers: ['Active haemorrhage with shock → massive transfusion', 'High-output failure with chronic anaemia'],
          },
        ],
      },
      {
        label: 'Stage 2: Acute Haemorrhage / Massive Transfusion',
        shortLabel: 'MTP',
        color: 'red',
        cards: [
          {
            title: 'Activate massive transfusion protocol',
            isCritical: true,
            threshold: 'ACTIVE HAEMORRHAGE + SHOCK',
            orders: [
              'Activate the local massive transfusion protocol; call blood bank and senior help.',
              'Transfuse in a BALANCED ratio (RBC:FFP:platelets ≈ 1:1:1) — avoid crystalloid-only resuscitation which worsens dilutional coagulopathy.',
              'Give tranexamic acid early in traumatic/surgical haemorrhage.',
              'Monitor and replace calcium (citrate chelation), watch potassium, prevent hypothermia (warm fluids/patient) and acidosis — the "lethal triad".',
              'Definitive source control: surgery, endoscopy, interventional radiology as indicated.',
            ],
            nursing: ['Blood warmer + rapid infuser', 'Active warming; monitor temperature', 'Repeat gas/iCa/coag during resuscitation'],
            prescriptions: [
              { drug: 'Packed red cells', dose: '10–15 mL/kg (acute)', route: 'IV', frequency: 'Per MTP ratio', calculation: (w: number) => `${10 * w}–${15 * w} mL`, notes: 'Use group-specific/O-neg if emergent; give with FFP/platelets in balanced ratio.' },
              { drug: 'Tranexamic acid', dose: '15 mg/kg (max 1 g) then infusion', route: 'IV', frequency: 'Early', calculation: (w: number) => `${Math.min(15 * w, 1000).toFixed(0)} mg`, notes: 'Within 3 h of traumatic haemorrhage.' },
              { drug: 'Calcium gluconate 10%', dose: '0.5 mL/kg (max 20 mL)', route: 'IV', frequency: 'During massive transfusion', calculation: (w: number) => `${Math.min(0.5 * w, 20).toFixed(1)} mL`, notes: 'Treat citrate-induced ionised hypocalcemia.' },
            ],
            triggers: ['Ongoing coagulopathy → guided product replacement (fibrinogen/cryo)', 'Refractory bleeding → definitive control'],
          },
        ],
      },
      {
        label: 'Stage 3: Severe Chronic Anaemia',
        shortLabel: 'Chronic',
        color: 'amber',
        cards: [
          {
            title: 'Slow, careful correction',
            orders: [
              'In severe chronic anaemia that is compensated, transfuse SLOWLY in small aliquots to avoid circulatory overload / heart failure.',
              'Give ~5 mL/kg aliquots over 3–4 hours; reassess between aliquots; consider a diuretic (e.g. furosemide) with transfusion if overload risk.',
              'Target a safe Hb rather than full normalisation acutely; avoid rapid large-volume transfusion.',
              'Treat the underlying cause (iron/B12/folate, haemolysis, marrow failure, hypersplenism) and involve haematology.',
            ],
            nursing: ['Slow rate; watch for TACO (overload) and reactions', 'Monitor for new crackles/tachypnea', 'Diuretic with transfusion if indicated'],
            prescriptions: [
              { drug: 'Packed red cells (chronic)', dose: '5 mL/kg over 3–4 h', route: 'IV', frequency: 'Small aliquots', calculation: (w: number) => `${5 * w} mL per aliquot`, notes: 'Avoid overload; reassess between aliquots.' },
              { drug: 'Furosemide', dose: '0.5–1 mg/kg', route: 'IV', frequency: 'With transfusion if overload risk', calculation: (w: number) => `${(0.5 * w).toFixed(1)}–${(1 * w).toFixed(1)} mg`, notes: 'For circulatory-overload risk during transfusion.' },
            ],
            triggers: ['Signs of overload (TACO) → slow/stop, diuretic', 'Transfusion reaction'],
          },
        ],
      },
      {
        label: 'Stage 4: Ongoing & Cause',
        shortLabel: 'Cause',
        color: 'emerald',
        cards: [
          {
            title: 'Find and treat the cause',
            orders: [
              'Complete the anaemia workup and direct treatment to the cause.',
              'Monitor post-transfusion Hb and for delayed reactions; haematology follow-up.',
              'For recurrent transfusion needs, plan iron-overload monitoring/chelation.',
              'Document group, antibodies, and any reactions for future transfusions.',
            ],
            nursing: ['Post-transfusion Hb check', 'Watch for delayed reactions', 'Haematology liaison'],
            triggers: ['Recurrent severe anaemia', 'Iron overload (chronic transfusion)'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'Severe anaemia essentials', recommendations: ['Acute haemorrhage: activate MTP, balanced RBC:FFP:platelets, TXA early, calcium, avoid the lethal triad.', 'Chronic compensated anaemia: transfuse slowly in ~5 mL/kg aliquots; consider diuretic.', 'Treat the cause; involve haematology.'] }],
  getDisposition: () => ['PICU for massive transfusion / decompensation; haematology involvement.'],
  getRedFlags: () => ['Haemorrhagic shock', 'High-output cardiac failure', 'Dilutional coagulopathy / hypocalcemia in massive transfusion', 'TACO (transfusion-associated circulatory overload)', 'Transfusion reaction'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'PRBC (acute)', dose: w ? `${10 * w}–${15 * w} mL` : '10–15 mL/kg', notes: 'Balanced ratio in MTP.' },
      { drugName: 'PRBC (chronic)', dose: w ? `${5 * w} mL/aliquot` : '5 mL/kg over 3–4 h', notes: 'Avoid overload.' },
      { drugName: 'Tranexamic acid', dose: w ? `${Math.min(15 * w, 1000).toFixed(0)} mg` : '15 mg/kg', notes: 'Early in haemorrhage.' },
      { drugName: 'Calcium gluconate 10%', dose: w ? `${Math.min(0.5 * w, 20).toFixed(1)} mL` : '0.5 mL/kg', notes: 'Massive transfusion.' },
    ];
  },
  getReferences: () => [
    { title: 'Pediatric massive transfusion — review', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7102510/' },
    { title: 'TACO — transfusion-associated circulatory overload (guidance)', url: 'https://www.transfusionguidelines.org/' },
  ],
};
