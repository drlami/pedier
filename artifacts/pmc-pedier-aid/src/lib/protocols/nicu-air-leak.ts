import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Air Leak Syndrome / Pneumothorax
 * Based on: Duong HH et al. J Perinatol 2014; NNF 9th ed. (2024)
 * Covers: Pneumothorax, PIE, Pneumomediastinum, Pneumopericardium.
 */
export const nicuAirLeakProtocol: DiseaseProtocol = {
  id: 'nicu-air-leak',
  name: 'Air Leak Syndrome / Neonatal Pneumothorax',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Pulmonary air leak in the neonate — pneumothorax (most common), pulmonary interstitial emphysema (PIE), pneumomediastinum, and pneumopericardium. Diagnosis, emergency management, and drainage technique.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'Neonatal air leak occurs when overdistended alveoli rupture, dissecting air along perivascular sheaths. Types in order of frequency: pneumothorax (most common; 1–2% of all births, 4–10% in MAS/RDS), PIE (air trapped in interstitium — ventilated preterm), pneumomediastinum (usually benign), pneumopericardium (rare, potentially fatal — cardiac tamponade). TENSION pneumothorax is a cardiac emergency — DO NOT wait for CXR if clinical deterioration is acute. Transilluminate, needle-aspirate, then drain. PIE requires a completely different strategy — HFOV with LOWER MAP, or selective lobar intubation for severe unilateral PIE.',

    stages: [
      {
        label: 'Stage 1: Recognition & Diagnosis',
        shortLabel: 'Recognition',
        color: 'red',
        cards: [
          {
            title: 'Recognise Air Leak — Clinical & Radiological',
            isCritical: true,
            calculator: { id: 'silverman-score', title: 'Silverman-Andersen Retraction Score' },
            orders: [
              'SPONTANEOUS PNEUMOTHORAX (term, no ventilation): sudden respiratory distress at birth or shortly after. Consider in any term newborn with unexpected respiratory distress or in newborns with vigorous cry and subsequent deterioration.',
              'VENTILATOR-ASSOCIATED PNEUMOTHORAX (preterm on CPAP/MV): ACUTE DETERIORATION — sudden ↓ SpO₂, ↑ FiO₂ requirement, ↑ PIP on volume-targeted ventilation, tracheal deviation (away from affected side), asymmetric chest, shifted cardiac impulse, bradycardia, hypotension.',
              'TRANSILLUMINATION: bedside emergency test — bright fibreoptic light applied to chest wall. Affected hemithorax glows diffusely = pneumothorax. Sensitivity ~85% in preterm. Use in acute deterioration while waiting for CXR. Negative transillumination does NOT exclude pneumothorax in term infants.',
              'CXR FINDINGS: (1) Pneumothorax — hyperlucent hemithorax, absent lung markings, visible visceral pleural line, mediastinal shift (tension). (2) PIE — linear/cystic lucencies radiating from hila (bubbly appearance, does not follow anatomical borders). (3) Pneumomediastinum — sail sign (elevated thymic lobes), lucency around cardiac silhouette. (4) Pneumopericardium — lucent halo surrounding heart on all views — cardiac tamponade.',
              'SCORE respiratory severity with Silverman-Andersen (calculator below).',
              'BLOOD GAS: acute respiratory and metabolic acidosis in tension pneumothorax. PaO₂ dropping, PaCO₂ rising.',
            ],
            nursing: [
              'Transillumination kit (fibreoptic light) readily accessible in each NICU bay',
              'Bilateral breath sounds auscultation every 2 h in ventilated infants',
              'If sudden deterioration: call team immediately AND begin transillumination',
              'Ventilator: note any acute ↑ in PIP on volume-targeted mode or ↓ in VT delivered',
            ],
            triggers: [
              'ACUTE LIFE-THREATENING DETERIORATION in any ventilated infant → assume tension pneumothorax → transilluminate → needle NOW — do not wait for CXR',
              'Pneumopericardium on CXR + haemodynamic compromise → pericardiocentesis (rare neonatal emergency → senior + cardiology immediately)',
              'Unilateral PIE worsening → selective intubation of contralateral lung (Stage 4)',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Emergency Tension Pneumothorax Management',
        shortLabel: 'Emergency Drainage',
        color: 'red',
        cards: [
          {
            title: 'Needle Thoracocentesis — Immediate Emergency',
            isCritical: true,
            orders: [
              'INDICATIONS FOR IMMEDIATE NEEDLE ASPIRATION (do not wait for CXR): acute cardiovascular collapse + suspected tension pneumothorax (transillumination positive or high clinical suspicion in deteriorating infant on MV).',
              'NEEDLE THORACOCENTESIS TECHNIQUE: (1) Position: supine, arm abducted. (2) Site: 2nd intercostal space, midclavicular line (anterior approach) OR 4th–5th ICS, anterior axillary line (lateral approach). (3) Clean with chlorhexidine. (4) Insert 21–23G butterfly needle or 22G IV cannula connected to 10 mL syringe (with three-way tap if available) OVER THE UPPER BORDER OF THE RIB (avoids neurovascular bundle on lower border). (5) Aspirate while advancing — immediate air flash = pneumothorax confirmed. (6) Aspirate until resistance returns.',
              'BILATERAL PNEUMOTHORAX: uncommon but occurs. If improvement from one side then re-deterioration → check contralateral side.',
              'AFTER NEEDLE ASPIRATION: obtain CXR to confirm resolution. Definitive intercostal drain (ICD) required for reaccumulation or persistent large pneumothorax.',
              'SPONTANEOUS PNEUMOTHORAX IN TERM INFANT (asymptomatic, < 20% lung collapse, SpO₂ > 92% in room air): conservative management acceptable — 100% O₂ (nitrogen washout hastens reabsorption if no contraindication), close monitoring. Most resolve within 24–48 h without drainage.',
            ],
            nursing: [
              'Needle thoracocentesis kit at each NICU bedside: 23G butterfly or 22G cannula, 10 mL syringe, three-way tap, chlorhexidine swabs',
              'SpO₂ continuous — document response to aspiration (should rise within 60 seconds)',
              'Post-procedure BP and HR documentation every 5 min for 30 min',
            ],
            triggers: [
              'HR < 60 during tension pneumothorax → chest compressions if not responding to aspiration',
              'Air reaccumulates rapidly after aspiration → formal ICD insertion (Stage 3)',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Intercostal Drain Insertion',
        shortLabel: 'Chest Drain',
        color: 'indigo',
        cards: [
          {
            title: 'Intercostal Drain (ICD) — Technique',
            orders: [
              'INDICATIONS FOR ICD: (1) Large or symptomatic pneumothorax not fully aspirated by needle; (2) Rapidly reaccumulating pneumothorax after needle aspiration; (3) Pneumothorax on MV (tension risk — continuous drainage essential); (4) Bilateral pneumothorax.',
              'SIZE: 10–14 Fr drain (Seldinger technique or blunt dissection). Neonates < 1 kg: 10 Fr. 1–3 kg: 12 Fr. > 3 kg: 12–14 Fr.',
              'ANALGESIA: morphine 0.05–0.1 mg/kg IV slow push + sucrose 24% 0.5 mL PO 2 min before. Local anaesthetic: lidocaine 1% 0.5 mL subcutaneous at insertion site.',
              'SITE: 4th or 5th ICS, anterior axillary line (avoids long thoracic nerve and breast tissue). Aim drain anteriorly/superiorly toward apex for pneumothorax (air rises).',
              'SELDINGER TECHNIQUE (preferred in NICU): (1) Incise skin 2–3 mm. (2) Insert needle/trocar — feel pop as pleura entered. (3) Insert guidewire. (4) Dilate tract. (5) Insert drain over guidewire. (6) Confirm position and remove guidewire. (7) Connect to underwater seal drainage (water level at −10 to −20 cmH₂O from drain exit).',
              'CONFIRMATION: CXR within 30 min of insertion. Drain tip should be in apex (AP view) and anterior (lateral view). Continuous bubbling in water seal = air ongoing. Swinging with respiration = patent drain in pleural space.',
              'POST-INSERTION: drain to water seal — apply −10 to −15 cmH₂O suction if lung not re-expanding. Remove when no bubbling for 12–24 h and CXR shows re-expansion.',
            ],
            prescriptions: [
              {
                drug: 'Morphine (procedural)',
                dose: '0.05–0.1 mg/kg IV slow push',
                route: 'IV over 5 min',
                frequency: 'Single pre-procedural dose',
                calculation: (w: number) => `${(0.05 * w).toFixed(3)}–${(0.1 * w).toFixed(3)} mg`,
                notes: 'Give 5–10 min before procedure. Have naloxone 0.01 mg/kg available.',
              },
              {
                drug: 'Lidocaine 1% (local)',
                dose: 'Max 3 mg/kg',
                route: 'Subcutaneous at insertion site',
                frequency: 'Single dose',
                calculation: (w: number) => `Max ${(3 * w).toFixed(1)} mg (= ${(0.3 * w).toFixed(2)} mL of 1%)`,
                notes: 'Infiltrate subcutaneous tissue and intercostal muscle. Do not exceed max dose.',
              },
            ],
            nursing: [
              'Water seal: verify water level before insertion and each shift',
              'Drainage documentation: character (serous, bloody, purulent), volume, swinging, bubbling — every 4 h',
              'Drain site: clean dressing, secure with transparent film dressing',
              'Clamp drain only momentarily during dressing change — never for prolonged periods',
            ],
            triggers: [
              'Drain falls out → cover site with Vaseline gauze → reassess → reinsert if pneumothorax reaccumulates',
              'Drain stops swinging + SpO₂ drops → drain blocked (kinked/clotted) → flush with 1 mL saline + milk drain gently',
              'Increasing drainage or haemorrhagic output → vascular injury or haemothorax → senior immediately',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: PIE Management',
        shortLabel: 'PIE',
        color: 'amber',
        cards: [
          {
            title: 'Pulmonary Interstitial Emphysema (PIE)',
            orders: [
              'PIE DIAGNOSIS: bubbly/linear lucencies on CXR that do NOT follow anatomical boundaries, radiate from hila — seen exclusively in mechanically ventilated infants. Usually bilateral but may be unilateral.',
              'PIE PATHOPHYSIOLOGY: air dissects along perivascular sheaths → interstitium → mediastinum. Causes: high PIP, high PEEP, large VT, air trapping. Worsens lung mechanics and oxygenation.',
              'PIE MANAGEMENT — SWITCH TO HFOV IMMEDIATELY: HFOV + LOW MAP strategy (reduce MAP 1–2 cmH₂O below conventional) — aim to reduce peak pressures while maintaining mean. High frequency (12–15 Hz) → smaller pressure swings → less interstitial dissection.',
              'CONVENTIONAL VENTILATION MODIFICATIONS if HFOV not immediately available: (1) ↓ PIP to lowest possible; (2) ↓ PEEP to 3–4 cmH₂O; (3) ↑ RR (↓ VT); (4) Permit higher PaCO₂ (pH ≥ 7.20 acceptable).',
              'LATERAL DECUBITUS POSITIONING: place affected side DOWN — selectively reduces ventilation to the PIE side (gravity). Can improve unilateral PIE.',
              'SELECTIVE MAIN BRONCHUS INTUBATION: for severe refractory unilateral PIE — advance ETT into contralateral (unaffected) main bronchus under fluoroscopy/bronchoscopy. Ventilate unaffected lung only. PIE lung: allow to collapse (deflate) and reabsorb air. Reposition ETT back to trachea after 24–48 h.',
              'PROGNOSIS: PIE is associated with significantly increased BPD risk. Bilateral severe PIE carries poor prognosis — discuss with family and neonatology senior.',
            ],
            nursing: [
              'Position: affected side down for unilateral PIE — document and maintain',
              'Chest wall compliance: more compliant = PIE improving',
              'CXR every 8–12 h while PIE active',
            ],
            triggers: [
              'PIE progressing to tension pneumothorax → needle then drain (Stage 2–3)',
              'Selective intubation required → call radiology / senior registrar for fluoroscopy guidance',
            ],
          },
        ],
      },

      {
        label: 'Stage 5: Recovery & Prevention',
        shortLabel: 'Recovery',
        color: 'emerald',
        cards: [
          {
            title: 'Drain Removal, Recovery & Prevention',
            orders: [
              'ICD REMOVAL CRITERIA: (1) No bubbling in water seal for ≥ 12–24 h; (2) CXR shows full lung re-expansion; (3) Infant clinically stable.',
              'REMOVAL TECHNIQUE: clamp drain for 4 h → CXR to confirm no reaccumulation → remove drain during expiration (infant crying or positive-pressure breath) → close wound with single suture or steri-strips → CXR 2–4 h post-removal.',
              'PREVENTION OF RECURRENCE: (1) Volume-targeted ventilation (reduces VT variability) — if not already used; (2) Lowest effective PEEP (5–6 cmH₂O — do not use excessive PEEP for lung recruitment in setting of PIE risk); (3) Avoid Valsalva manoeuvres — gentle handling, avoid prolonged crying; (4) Adequate sedation in agitated ventilated infants.',
              'CAFFEINE: ensure on board — reduces apnea episodes and associated SpO₂ dips that lead to FiO₂ escalation and higher PIP requirements.',
              'BPD FOLLOW-UP: air leak significantly increases BPD risk. Arrange pulmonology and neurodevelopmental follow-up.',
            ],
            nursing: [
              'Post-drain removal: SpO₂ and RR monitoring every 30 min for 4 h',
              'Wound site inspection at 1, 4, 12, 24 h post-removal',
              'Document total duration of ICD drainage in notes',
            ],
            triggers: [
              'Reaccumulation of pneumothorax after drain removal → re-insert ICD',
              'Persistent O₂ requirement at 28 days postnatal age → BPD criteria met → BPD protocol',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Severity assessed clinically. Tension pneumothorax is a cardiac emergency — act before CXR.'] }),
  getManagement: () => [
    {
      title: 'Air leak essentials',
      recommendations: [
        'TENSION pneumothorax = cardiac emergency — transilluminate → needle → THEN CXR.',
        'Needle: 2nd ICS midclavicular OR 4th ICS anterior axillary — over upper border of rib.',
        'ICD for large, symptomatic, or reaccumulating pneumothorax in ventilated infants.',
        'PIE → HFOV with lower MAP strategy immediately. Lateral decubitus affected side down.',
        'PIE prevention: volume-targeted ventilation, lowest effective PEEP, adequate sedation.',
      ],
    },
  ],
  getDisposition: () => [
    'All pneumothorax in ventilated infants → Level III NICU.',
    'Small spontaneous term pneumothorax (asymptomatic, < 20%) → Level II with close monitoring.',
    'PIE → Level III NICU with HFOV capability.',
  ],
  getRedFlags: () => [
    'Acute cardiovascular collapse in any ventilated infant → assume tension pneumothorax',
    'Asymmetric breath sounds → mediastinal shift → tension → EMERGENCY needle NOW',
    'Pneumopericardium → cardiac tamponade → senior + cardiology immediate',
    'PIE worsening on conventional ventilation → HFOV immediately',
    'Drain stops swinging + clinical deterioration → blocked drain → flush/replace',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Morphine (procedural)', dose: w ? `${(0.1 * w).toFixed(3)} mg` : '0.05–0.1 mg/kg', notes: 'IV over 5 min before drain insertion.' },
      { drugName: 'Lidocaine 1% (local)', dose: w ? `Max ${(0.3 * w).toFixed(2)} mL` : 'Max 3 mg/kg', notes: 'Subcutaneous at ICD site. Never exceed max dose.' },
    ];
  },
  getReferences: () => [
    { title: 'Duong HH et al. Pneumothorax in neonates: trends and outcomes. J Perinatol 2014', url: 'https://www.nature.com/articles/jp201432' },
    { title: 'Bhatia R et al. Pulmonary Interstitial Emphysema. Semin Fetal Neonatal Med 2017', url: 'https://www.sciencedirect.com/science/article/pii/S1744165X17300744' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
