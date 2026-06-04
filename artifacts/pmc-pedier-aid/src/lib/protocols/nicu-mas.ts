import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Meconium Aspiration Syndrome (MAS)
 * Based on: Wiswell TE. Pediatrics 2001; Vain NE et al. Lancet 2004;
 * NRP 8th edition 2021; AAP/AHA Neonatal Resuscitation 2021.
 */
export const nicuMasProtocol: DiseaseProtocol = {
  id: 'nicu-mas',
  name: 'Meconium Aspiration Syndrome (MAS)',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Aspiration of meconium-stained amniotic fluid causing mechanical obstruction, chemical pneumonitis, surfactant inactivation, and PPHN — occurs in 5–10% of infants born through meconium-stained liquor.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'MAS results from the aspiration of meconium-stained amniotic fluid (MSAF) and causes three simultaneous insults: (1) mechanical ball-valve obstruction → gas trapping and atelectasis; (2) chemical pneumonitis from bile acids and proteolytic enzymes; (3) surfactant inactivation → secondary RDS. PPHN develops in 30–40% due to pulmonary vasoconstriction from hypoxia and meconium. The modern delivery room approach has ABANDONED routine intrapartum oropharyngeal suctioning (no benefit, per Vain 2004) and routine ETT suction in vigorous infants (NRP 2015/2021 — provide standard care). For the non-vigorous infant born through MSAF, follow standard NRP resuscitation — intubation and suction only if ETT obstruction suspected. Key management pillars: optimise oxygenation, surfactant for moderate-severe, HFOV for air trapping + OI escalation, iNO for PPHN.',

    stages: [
      {
        label: 'Stage 1: Delivery Room Assessment & Resuscitation',
        shortLabel: 'Delivery Room',
        color: 'red',
        cards: [
          {
            title: 'Delivery Room — Meconium-Stained Infant',
            isCritical: true,
            calculator: { id: 'silverman-score', title: 'Silverman-Andersen Retraction Score' },
            orders: [
              'ASSESS VIGOUR AT BIRTH: (1) Breathing/crying? (2) Muscle tone good? (3) HR > 100 bpm? — ALL three present = VIGOROUS.',
              'VIGOROUS INFANT BORN THROUGH MSAF: do NOT perform routine ETT suction. Follow STANDARD NRP algorithm — clear secretions from mouth/nose with bulb suction or towel if needed, dry and stimulate. DO NOT delay resuscitation for suctioning.',
              'NON-VIGOROUS INFANT BORN THROUGH MSAF (apnoeic, limp, or HR < 100): follow NRP algorithm — PPV is the priority. If ETT intubation required for PPV and meconium visible below cords → suction via ETT once; do NOT delay PPV for repeated suction attempts.',
              'APGAR and CORD BLOOD GAS: document 1- and 5-minute Apgar scores. Paired cord blood gas to assess degree of perinatal asphyxia (an important co-morbidity in MAS).',
              'CLINICAL FEATURES at admission: meconium staining of skin, nails, umbilical cord; barrel chest (air trapping); tachypnoea + grunting + retractions; coarse breath sounds bilaterally. Score Silverman-Andersen (calculator below).',
              'CXR FINDINGS: coarse patchy bilateral infiltrates (heterogeneous — unlike the diffuse ground-glass of RDS), hyperinflation (flattened diaphragms), pneumothorax in 20–30% (check both sides carefully).',
              'SEVERITY CLASSIFICATION: Mild = FiO₂ < 0.40, no ventilation needed, resolves in 48 h. Moderate = FiO₂ 0.40–0.60, may need CPAP/HFNC. Severe = FiO₂ > 0.60 or MV needed, OI ≥ 20, PPHN.',
            ],
            nursing: [
              'Meconium colour and thickness documented (thin/watery vs. thick/tenacious)',
              'Continuous pre-ductal SpO₂ (right hand) + post-ductal (right foot) simultaneously',
              'Temperature: wrap in warm towel (NOT polyethylene bag if meconium-stained — reduces handling)',
              'Airway suction equipment (DeLee or bulb) at bedside; laryngoscope ready',
            ],
            triggers: [
              'HR < 100 at birth → PPV immediately — do not suction first',
              'Asymmetric chest on CXR → pneumothorax → transilluminate → needle aspiration / drain',
              'Cord pH < 7.00 or base deficit > 12 → significant perinatal asphyxia → HIE protocol consideration',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: NICU Admission & Respiratory Support',
        shortLabel: 'Respiratory Support',
        color: 'amber',
        cards: [
          {
            title: 'O₂, CPAP & Intubation Decision',
            isCritical: true,
            orders: [
              'MILD MAS (FiO₂ < 0.40): supplemental O₂ via low-flow cannula or headbox. Trial of CPAP 5–6 cmH₂O if FiO₂ > 0.30. SpO₂ target 91–95%.',
              'CAUTION WITH CPAP in MAS: air trapping from ball-valve obstruction means CPAP can worsen hyperinflation. Use cautiously — if FiO₂ falls but chest hyperexpands further → reduce CPAP or consider direct intubation.',
              'MODERATE-SEVERE MAS: intubate early — MAS is NOT a CPAP-first disease like RDS. Indications: FiO₂ > 0.50; OI > 10; significant respiratory distress; haemodynamic compromise; PPHN developing.',
              'VENTILATOR SETTINGS for MAS: SIMV+VG mode | VT 5–6 mL/kg (higher than RDS — overcome obstruction) | PEEP 4–5 cmH₂O (LOWER than RDS — avoid worsening air trapping) | RR 40–60/min | IT 0.4–0.5 s (longer for better distribution) | FiO₂ titrate to SpO₂ 91–95%.',
              'GAS TARGETS: SpO₂ 91–95% | PaO₂ 60–80 mmHg | PaCO₂ 45–55 mmHg | pH ≥ 7.25. Obtain blood gas at 30 min post-intubation then 4-hourly.',
              'PRONE POSITIONING: if haemodynamically stable and ventilated → prone improves oxygenation in MAS by promoting drainage of meconium-filled segments. Standard prone ventilation precautions.',
            ],
            nursing: [
              'Bilateral breath sounds confirmed after intubation; EtCO₂ confirmation',
              'ETT suction: gentle — meconium plugs may require larger suction catheter (12–14 Fr); document suction material character',
              'Bilateral chest expansion check every 2 h — asymmetry → pneumothorax',
            ],
            triggers: [
              'PIP rising on volume-targeted ventilation → airway obstruction → suction ETT',
              'Sudden deterioration → DOPES (Displaced ETT / Obstruction / Pneumothorax / Equipment / Stomach)',
              'OI > 13 → HFOV consideration (Stage 4)',
            ],
          },
          {
            title: 'Surfactant & Antibiotic Cover',
            orders: [
              'SURFACTANT INDICATION in MAS: meconium inactivates surfactant. Give Calfactant (Infasurf) if: FiO₂ > 0.40 on CPAP or MV, OI > 8, or moderate-severe MAS requiring ventilation.',
              'SURFACTANT LAVAGE (surfactant as lavage): some centres perform dilute surfactant lavage (Infasurf 1.5 mL/kg × 4 aliquots) to physically wash meconium from airways — discuss with senior before performing this technique.',
              'STANDARD INFASURF DOSE: 3 mL/kg intratracheal (not LISA/MIST — these infants are intubated). Give in 2 aliquots (1.5 mL/kg each), reposition between aliquots. Up to 3 doses total, ≥ 12 h apart.',
              'ANTIBIOTICS: MAS in post-dates infants carries low EOS risk. However, MSAF + clinical deterioration or maternal risk factors → empiric ampicillin + gentamicin until cultures available at 36–48 h.',
            ],
            prescriptions: [
              {
                drug: 'Calfactant (Infasurf)',
                dose: '3 mL/kg per dose (= 105 mg phospholipids/kg)',
                route: 'Intratracheal via ETT (2 aliquots)',
                frequency: 'Up to 3 doses total, each ≥ 12 h apart',
                calculation: (w: number) => `${(3 * w).toFixed(1)} mL per dose; up to ${(9 * w).toFixed(1)} mL total`,
                notes: 'Swirl, do not shake. Give via ETT in 2 aliquots, reposition between aliquots.',
              },
              {
                drug: 'Ampicillin (if EOS risk)',
                dose: '50 mg/kg/dose (PMA-based interval)',
                route: 'IV over 15–30 min',
                frequency: 'See NeoDose',
                calculation: (w: number) => `${(50 * w).toFixed(0)} mg/dose`,
                notes: 'Only if EOS risk factors — not routinely needed for isolated MAS.',
              },
            ],
            nursing: [
              'Post-surfactant: wean FiO₂ actively — compliance improves rapidly',
              'Avoid suction for 1 h post-surfactant (unless ETT blocked)',
            ],
            triggers: [
              'No FiO₂ improvement 2 h post-surfactant → repeat dose',
              'Pre/post-ductal SpO₂ difference > 5–10% → PPHN developing → Stage 3',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: PPHN Detection & iNO',
        shortLabel: 'PPHN / iNO',
        color: 'indigo',
        cards: [
          {
            title: 'PPHN Screen & Inhaled Nitric Oxide',
            isCritical: true,
            calculator: { id: 'oi-calc', title: 'Oxygenation Index (OI) Calculator' },
            orders: [
              'PPHN SCREEN: measure pre-ductal SpO₂ (right hand) AND post-ductal SpO₂ (right foot or either foot) simultaneously every 4 h in all MAS infants requiring > 0.40 FiO₂.',
              'PPHN CRITERIA: pre-post-ductal SpO₂ difference ≥ 5–10% (right-to-left ductal shunt); OR PaO₂ < 100 mmHg on FiO₂ 1.0 (hyperoxia test); OR echo showing elevated RVSP / right-to-left shunting at PDA.',
              'CALCULATE OI (use calculator above): OI = (MAP × FiO₂ × 100) / PaO₂. OI ≥ 20 on TWO consecutive blood gases ≥ 1 h apart = indication for iNO.',
              'iNO INITIATION: inhaled NO at 20 ppm via ventilator circuit. RESPONSE: PaO₂ increases ≥ 20 mmHg or SpO₂ increases ≥ 10% within 30–60 min = responder (good prognosis). Non-response at 20 ppm → increase to 40 ppm for 30 min trial → if still no response → ECMO criteria.',
              'HFOV + iNO: most effective combination for severe PPHN — HFOV achieves lung recruitment (higher MAP), iNO reduces PVR. Initiate HFOV if OI > 20 on conventional ventilation.',
              'SILDENAFIL: add if partial iNO response or unavailability. PO 0.5–1 mg/kg q6–8h (start 0.5 mg/kg). Potentiates iNO and aids iNO weaning.',
              'MILRINONE: consider if echo shows RV dysfunction (dilated, hypokinetic RV). 0.33 mcg/kg/min continuous infusion (see NeoDose). May drop systemic BP — ensure adequate volume and add dopamine if needed.',
            ],
            nursing: [
              'Pre/post-ductal SpO₂ simultaneously every 4 h — document both values',
              'iNO circuit connections checked every shift (leak = loss of efficacy)',
              'Methaemoglobin level 2 h after iNO start, then daily (target < 5%)',
              'NO₂ level monitor — alarm at > 3 ppm',
            ],
            triggers: [
              'MetHb > 5% → reduce iNO dose → if persists → stop iNO → methylene blue if critically high',
              'OI > 25 despite iNO + HFOV → ECMO criteria (Stage 4)',
              'Systemic hypotension on milrinone → volume 10 mL/kg + dopamine 5–10 mcg/kg/min',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: HFOV & ECMO Criteria',
        shortLabel: 'Escalation',
        color: 'red',
        cards: [
          {
            title: 'HFOV & ECMO Escalation',
            orders: [
              'HFOV INDICATIONS in MAS: (1) OI > 13 on conventional MV; (2) Air trapping / PIE on CXR; (3) Pneumothorax with ongoing PPHN; (4) PIP > 28 cmH₂O needed for VT 5 mL/kg.',
              'HFOV SETTINGS for MAS (air trapping): MAP same as conventional or 1–2 cmH₂O lower (LOWER MAP strategy to reduce air trapping — different from RDS which uses HIGHER MAP). Frequency: 10–12 Hz. Amplitude: visible chest wiggle clavicle to mid-abdomen. FiO₂ carry over.',
              'ECMO CRITERIA (discuss with regional ECMO centre proactively at OI > 25): (1) OI > 40 on two blood gases 1 h apart despite maximal therapy (HFOV + iNO + sildenafil ± milrinone); (2) PaO₂ consistently < 40–50 mmHg; (3) Acute clinical deterioration not responsive to maximal ventilatory support; (4) GA ≥ 34 weeks (minimum); (5) Weight ≥ 2 kg; (6) No lethal congenital anomaly; (7) No major IVH (> Grade II).',
              'CONTACT ECMO CENTRE EARLY (OI > 25) — do not wait until infant maximal. Transfer logistics take time. Stabilise for transfer with sedation + muscle relaxation (vecuronium 0.1 mg/kg) if needed.',
            ],
            nursing: [
              'If ECMO discussion ongoing: verify IV/arterial access × 2 (ECMO needs reliable access)',
              'Sedation assessment — ventilated MAS infants are uncomfortable; morphine 0.01–0.02 mg/kg/h infusion',
              'ECMO pre-transfer checklist if indicated',
            ],
            triggers: [
              'OI > 25 → contact ECMO centre NOW — do not wait for further deterioration',
              'OI > 40 on 2 readings 1 h apart → ECMO criteria met → transfer',
            ],
          },
        ],
      },

      {
        label: 'Stage 5: Supportive Care & Complications',
        shortLabel: 'Support & Recovery',
        color: 'emerald',
        cards: [
          {
            title: 'Supportive Care, Weaning & Complication Watch',
            orders: [
              'iNO WEANING: once FiO₂ ≤ 0.60 and stable for 4 h → reduce iNO from 20 → 10 → 5 → 2 → 1 ppm (no faster than 4 h per step). Check for rebound PPHN (SpO₂ drop, pre/post-ductal difference) after each step. Do NOT wean below FiO₂ 0.60 before commencing iNO wean.',
              'FLUID MANAGEMENT: 60–80 mL/kg/day initially. MAS infants often have perinatal compromise and may have renal dysfunction. Daily creatinine and electrolytes while ventilated.',
              'SEIZURES: perinatal asphyxia complicates severe MAS. Continuous aEEG monitoring if HIE suspected (cord pH < 7.00 or Apgar ≤ 5 at 5 min). Phenobarbital 20 mg/kg loading dose for confirmed seizures.',
              'HIE ASSESSMENT: if significant perinatal asphyxia (cord pH < 7.00, base deficit > 12, Apgar ≤ 5 at 10 min, or neurological signs) → perform Thompson HIE scoring → consider therapeutic hypothermia if ≥ 36 weeks GA and within 6 h of birth (see HIE protocol).',
              'PNEUMOTHORAX SURVEILLANCE: occurs in 20–30% of MAS due to air trapping. Daily CXR. Transilluminate if sudden acute deterioration.',
              'FEEDING: once extubated and RR < 60/min, start trophic NG feeds. Full oral feeding typically delayed 24–48 h post-extubation.',
              'NEURODEVELOPMENTAL: MAS with PPHN carries risk of sensorineural hearing loss, developmental delay. Arrange audiology and neurodevelopmental follow-up at 6, 12, 24 months.',
            ],
            nursing: [
              'Stool passage documentation — meconium passage confirms GI patency',
              'iNO step-down: SpO₂ and pre/post-ductal difference monitored for 1 h after each reduction',
              'Cranial US in preterm or asphyxiated infants — day 1–3, day 7',
            ],
            triggers: [
              'SpO₂ drop during iNO wean → hold wean → re-escalate iNO dose → consider sildenafil',
              'Seizure activity → aEEG + blood glucose + phenobarbital → LP if meningitis risk',
              'Oliguria (UO < 0.5 mL/kg/h × 4 h) → AKI evaluation → see Neonatal AKI protocol',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Calculate OI (Stage 3 calculator) to guide PPHN and HFOV escalation. Silverman-Andersen for respiratory distress severity.'] }),
  getManagement: () => [
    {
      title: 'MAS essentials',
      recommendations: [
        'No routine intrapartum/ETT suctioning in vigorous infants — standard NRP resuscitation.',
        'Surfactant (Infasurf 3 mL/kg) for moderate-severe MAS (FiO₂ > 0.40 or OI > 8).',
        'Low PEEP 4–5 cmH₂O (unlike RDS) — reduce air trapping.',
        'iNO 20 ppm for OI ≥ 20. Add HFOV for best combined effect.',
        'Contact ECMO centre at OI > 25 — do not wait for OI > 40.',
        'Assess for HIE if cord pH < 7.00 — see HIE protocol.',
      ],
    },
  ],
  getDisposition: () => [
    'All moderate-severe MAS → Level III NICU.',
    'Mild MAS (FiO₂ < 0.40, no MV) → Level II NICU or high-dependency acceptable.',
    'OI > 25 or iNO not available → contact tertiary ECMO centre for advice/transfer.',
  ],
  getRedFlags: () => [
    'Pre/post-ductal SpO₂ difference > 10% → PPHN → iNO urgently',
    'OI > 20 → iNO indication. OI > 40 → ECMO',
    'Pneumothorax — sudden desaturation, asymmetric chest → emergency needle aspiration',
    'Seizures → suspect HIE → aEEG + phenobarbital',
    'OI not improving with iNO → contact ECMO centre NOW',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Calfactant (Infasurf)', dose: w ? `${(3 * w).toFixed(1)} mL/dose` : '3 mL/kg/dose', notes: 'Via ETT, 2 aliquots. Up to 3 doses q≥12h.' },
      { drugName: 'Sildenafil (PPHN)', dose: w ? `${(0.5 * w).toFixed(2)}–${(1 * w).toFixed(1)} mg/dose` : '0.5–1 mg/kg/dose', notes: 'PO q6–8h. Start 0.5 mg/kg.' },
      { drugName: 'Milrinone (RV dysfunction)', dose: w ? `Start 0.33 mcg/kg/min = ${((0.33 * w * 60) / 200).toFixed(3)} mL/h at 200 mcg/mL` : '0.25–0.75 mcg/kg/min', notes: 'Continuous infusion. Monitor BP.' },
    ];
  },
  getReferences: () => [
    { title: 'NRP 8th Edition — AAP/AHA Neonatal Resuscitation 2021', url: 'https://www.aap.org/en/patient-care/newborn-and-infant-nutrition/newborn-care-and-safety/neonatal-resuscitation-program/' },
    { title: 'Vain NE et al. Oropharyngeal and nasopharyngeal suctioning in neonates. Lancet 2004', url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(04)17073-9/fulltext' },
    { title: 'Cleary GM, Wiswell TE. Meconium-stained amniotic fluid and MAS. Pediatr Clin North Am 1998', url: 'https://pubmed.ncbi.nlm.nih.gov/9884683/' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
