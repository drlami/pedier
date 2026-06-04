import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/** PICU — DIC & acute bleeding (Master Management Pathway). */
export const picuDicBleedingProtocol: DiseaseProtocol = {
  id: 'picu-dic-bleeding',
  name: 'DIC & acute bleeding',
  system: 'Sepsis, Infection & Hematology',
  unit: 'picu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Disseminated intravascular coagulation and acute coagulopathic bleeding — treat the trigger, and replace blood products guided by bleeding and laboratory results.',
  image: { url: '', hint: '' },
  questions: [],
  mmpData: {
    snapshot:
      'DIC is always SECONDARY — it is a marker of a serious underlying problem (sepsis, trauma, asphyxia, malignancy, severe haemolysis). The cure is treating the TRIGGER; blood products are supportive. Replace products only when there is bleeding (or before an invasive procedure), guided by the platelet count, fibrinogen, and PT/aPTT — not to "correct numbers" in a non-bleeding child. Reassess with serial labs.',
    stages: [
      {
        label: 'Stage 1: Recognise',
        shortLabel: 'Recognise',
        color: 'red',
        cards: [
          {
            title: 'Recognise DIC / coagulopathy',
            isCritical: true,
            orders: [
              'Clinical: oozing from puncture/line sites, petechiae/purpura, GI/pulmonary bleeding, and/or microvascular thrombosis with organ dysfunction.',
              'Laboratory: thrombocytopenia, prolonged PT and aPTT, LOW fibrinogen, raised D-dimer/FDPs; falling trends are more informative than single values.',
              'Identify the trigger: sepsis (commonest), trauma/burns, asphyxia, malignancy (esp. APML), severe haemolysis, snake envenomation, obstetric/neonatal causes.',
              'Send a full coagulation screen including fibrinogen and D-dimer, FBC/film, group & crossmatch, and repeat serially.',
            ],
            nursing: ['Monitor all sites for bleeding', 'Serial coagulation + platelets/fibrinogen', 'Minimise invasive procedures'],
            triggers: ['Active major bleeding', 'Rapidly falling platelets/fibrinogen', 'Organ dysfunction from microthrombi'],
          },
        ],
      },
      {
        label: 'Stage 2: Treat the Trigger',
        shortLabel: 'Trigger',
        color: 'amber',
        cards: [
          {
            title: 'Treat the underlying cause',
            isCritical: true,
            orders: [
              'The most important step: aggressively treat the underlying cause (e.g. sepsis bundle + source control, resuscitate shock, treat malignancy/haemolysis).',
              'Restore perfusion, oxygenation, and correct acidosis, hypothermia, and hypocalcemia — all worsen coagulopathy.',
              'Supportive care and close monitoring in PICU; involve haematology.',
              'Avoid unnecessary invasive procedures until coagulopathy is supported.',
            ],
            nursing: ['Support perfusion/oxygenation', 'Active warming; monitor iCa', 'Haematology liaison'],
            triggers: ['Trigger not controlled → escalate cause-directed therapy'],
          },
        ],
      },
      {
        label: 'Stage 3: Blood Product Support',
        shortLabel: 'Products',
        color: 'red',
        cards: [
          {
            title: 'Lab-guided product replacement (if bleeding)',
            isCritical: true,
            orders: [
              'Replace products for active bleeding or before invasive procedures — guided by results, not to normalise numbers in a stable, non-bleeding child.',
              'Platelets for significant thrombocytopenia with bleeding (or higher threshold pre-procedure).',
              'Fresh frozen plasma for prolonged PT/aPTT with bleeding; cryoprecipitate or fibrinogen concentrate for low fibrinogen.',
              'Packed red cells to maintain adequate oxygen-carrying capacity during bleeding; give vitamin K if deficiency/liver involvement.',
              'Reassess with repeat coagulation after replacement; involve haematology for refractory cases.',
            ],
            nursing: ['Repeat coag/fibrinogen/platelets after products', 'Document product volumes', 'Watch for transfusion reactions/overload'],
            prescriptions: [
              { drug: 'Fresh frozen plasma', dose: '10–20 mL/kg', route: 'IV', frequency: 'If bleeding + ↑PT/aPTT', calculation: (w: number) => `${10 * w}–${20 * w} mL`, notes: 'Replaces coagulation factors.' },
              { drug: 'Cryoprecipitate', dose: '5–10 mL/kg', route: 'IV', frequency: 'If fibrinogen low', calculation: (w: number) => `${5 * w}–${10 * w} mL`, notes: 'Or fibrinogen concentrate per local policy.' },
              { drug: 'Platelets', dose: '10–15 mL/kg', route: 'IV', frequency: 'If low + bleeding', calculation: (w: number) => `${10 * w}–${15 * w} mL`, notes: 'Higher threshold before invasive procedures.' },
              { drug: 'Vitamin K', dose: '0.3 mg/kg (max 10 mg)', route: 'IV', frequency: 'If deficiency/liver', calculation: (w: number) => `${Math.min(0.3 * w, 10).toFixed(1)} mg`, notes: 'Slow IV.' },
            ],
            triggers: ['Refractory bleeding → senior haematology, consider factor concentrates', 'Massive bleeding → massive transfusion protocol'],
          },
        ],
      },
      {
        label: 'Stage 4: Monitor & Reassess',
        shortLabel: 'Monitor',
        color: 'emerald',
        cards: [
          {
            title: 'Serial monitoring',
            orders: [
              'Trend platelets, fibrinogen, and PT/aPTT to gauge response and guide further product use.',
              'Continue treating the cause; de-escalate product support as coagulopathy resolves.',
              'Watch for both bleeding and thrombotic complications; manage organ dysfunction.',
              'Haematology guidance for specific scenarios (e.g. APML → ATRA, anticoagulation in thrombotic-predominant DIC).',
            ],
            nursing: ['Scheduled serial coagulation', 'Monitor for bleeding & thrombosis', 'Reassess after each intervention'],
            triggers: ['Worsening trend despite support', 'Thrombotic complications'],
          },
        ],
      },
    ],
  },
  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['See Master Management Pathway above.'] }),
  getManagement: () => [{ title: 'DIC essentials', recommendations: ['Treat the trigger — it is the cure; products are supportive.', 'Replace products only for bleeding/procedures, guided by platelets, fibrinogen, PT/aPTT.', 'Correct hypothermia, acidosis, hypocalcemia.', 'Serial labs; haematology input.'] }],
  getDisposition: () => ['PICU with serial coagulation monitoring; haematology involvement.'],
  getRedFlags: () => ['Active major bleeding / multiple-site oozing', 'Rapidly falling platelets or fibrinogen', 'Microvascular thrombosis with organ dysfunction', 'Underlying sepsis/malignancy', 'Lethal triad: hypothermia, acidosis, hypocalcemia'],
  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Fresh frozen plasma', dose: w ? `${10 * w}–${20 * w} mL` : '10–20 mL/kg', notes: 'Bleeding + ↑PT/aPTT.' },
      { drugName: 'Cryoprecipitate', dose: w ? `${5 * w}–${10 * w} mL` : '5–10 mL/kg', notes: 'Low fibrinogen.' },
      { drugName: 'Platelets', dose: w ? `${10 * w}–${15 * w} mL` : '10–15 mL/kg', notes: 'Low platelets + bleeding.' },
      { drugName: 'Vitamin K', dose: w ? `${Math.min(0.3 * w, 10).toFixed(1)} mg` : '0.3 mg/kg', notes: 'Deficiency / liver.' },
    ];
  },
  getReferences: () => [
    { title: 'ISTH — Diagnosis and management of DIC (guidance)', url: 'https://www.isth.org/' },
    { title: 'BSH Guideline — Diagnosis and management of DIC', url: 'https://b-s-h.org.uk/guidelines/' },
  ],
};
