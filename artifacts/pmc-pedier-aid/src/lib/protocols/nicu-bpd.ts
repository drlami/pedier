import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Bronchopulmonary Dysplasia (BPD / Chronic Lung Disease)
 * Based on: Jensen EA et al. Am J Respir Crit Care Med 2019 (NICHD definition);
 * McGrath-Morrow SA et al. Am J Respir Crit Care Med 2020; NNF 9th ed. (2024)
 */
export const nicuBpdProtocol: DiseaseProtocol = {
  id: 'nicu-bpd',
  name: 'Bronchopulmonary Dysplasia (BPD / CLD)',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Chronic lung disease of prematurity — impaired alveolar and vascular development compounded by O₂ toxicity, volutrauma, and inflammation. Defined by O₂ or respiratory support requirement at 36 weeks PMA.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'BPD (new BPD) is primarily a disease of arrested alveolar and pulmonary vascular development in the very preterm infant, compounded by oxygen toxicity, volutrauma, infection, and inflammation. The modern paradigm is PREVENTION above all else: surfactant, caffeine from day 1, target SpO₂ 91–95% (not higher), volume-targeted ventilation, early extubation to CPAP/NIPPV, and optimal nutrition. Once established, management is stepwise: gentle ventilation, diuretics for the wet/oedematous lung, inhaled bronchodilators for airway hyperreactivity, DART dexamethasone for ventilator-dependent infants, and pulmonary hypertension surveillance. The NICHD 2019 definition grades BPD by O₂/support requirement at 36 weeks PMA.',

    stages: [
      {
        label: 'Stage 1: Diagnosis & Classification (36 Weeks PMA)',
        shortLabel: 'Diagnosis',
        color: 'red',
        cards: [
          {
            title: 'NICHD 2019 BPD Classification at 36 Weeks PMA',
            isCritical: true,
            orders: [
              'ASSESS AT 36 WEEKS PMA (or at discharge if < 36 weeks PMA): determine O₂/support requirement to maintain SpO₂ ≥ 90%.',
              'NICHD 2019 CLASSIFICATION: Grade 1 (Mild) — room air; Grade 2 (Moderate) — nasal cannula ≤ 2 L/min; Grade 3A (Severe) — nasal cannula > 2 L/min or non-invasive ventilation (CPAP/HFNC/BiPAP); Grade 3B (Very Severe) — invasive mechanical ventilation at 36 weeks PMA.',
              'ORIGINAL JOBE-BANCALARI (2001) classification (still used in literature): Mild = in room air by 36 weeks PMA; Moderate = FiO₂ < 0.30; Severe = FiO₂ ≥ 0.30 or PPV/CPAP.',
              'RISK FACTORS for BPD: GA < 28 weeks (highest risk), BW < 1000 g, male sex, RDS requiring surfactant and MV, PDA, sepsis, poor nutrition, excessive O₂ exposure.',
              'EARLY MARKERS of evolving BPD (before 36 weeks): persistent O₂ requirement at 28 days postnatal age (= "physiological BPD" or intermediate definition); CXR — hyperinflation, atelectasis, cyst-like changes; failure to wean from CPAP despite multiple attempts.',
              'PULMONARY HYPERTENSION SCREEN: echo at 36 weeks PMA in all BPD infants. PH occurs in 25–30% of severe BPD and significantly worsens prognosis.',
            ],
            nursing: [
              'SpO₂ at 36 weeks PMA: document on what support (room air, L/min O₂, CPAP) SpO₂ is ≥ 90%',
              'SpO₂ target: alarm limits 90–95% throughout — no upper limit removal',
              'Oxygen saturation histogram review weekly if available — identify hyperoxia episodes',
            ],
            triggers: [
              'O₂ still required at 36 weeks PMA → BPD confirmed → grade and initiate BPD management plan',
              'Echo at 36 weeks: RVSP ≥ 2/3 systemic BP → pulmonary hypertension → Stage 4',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Prevention in At-Risk Infants',
        shortLabel: 'Prevention',
        color: 'amber',
        cards: [
          {
            title: 'BPD Prevention — All Preterm Infants < 32 Weeks',
            orders: [
              'SpO₂ TARGET 91–95%: the single most modifiable risk factor. Set alarm limits 90% (lower) and 95% (upper). Never remove the upper alarm. Hyperoxia causes oxidative injury and vascular growth arrest — more damaging than brief episodes of hypoxia.',
              'CAFFEINE CITRATE from day 1: 20 mg/kg loading dose → 5–10 mg/kg/day maintenance. Reduces BPD NNT = 6 (CAP trial). Continue until 34–36 weeks PMA. Check HR — tachycardia > 180 bpm sustained → check level.',
              'VOLUME-TARGETED VENTILATION: SIMV+VG or A/C+VG — reduces VT variability → reduces volutrauma. Transition from pressure-limited to volume-targeted as soon as feasible.',
              'EARLY EXTUBATION: extubate as early as possible to CPAP or NIPPV. Every additional day of MV increases BPD risk. Extubation criteria: FiO₂ ≤ 0.30, MAP ≤ 10 cmH₂O, adequate spontaneous effort, caffeine on board.',
              'POSTNATAL STEROIDS: AVOID in first 7 days — increased risk of intestinal perforation and neurodevelopmental harm. After day 7 in ventilator-dependent infants: consider DART protocol dexamethasone (see Stage 3).',
              'VITAMIN A: 5000 IU IM three times weekly × 4 weeks (from day 1) in infants < 1000 g — reduces BPD (NNT = 11). Not widely available — check local formulary.',
              'NUTRITION: aggressive protein intake 3–4 g/kg/day from day 1 (TPN). Early enteral feeds. Human milk (own or donor) reduces BPD risk compared to formula. Target weight gain 15–20 g/kg/day.',
            ],
            prescriptions: [
              {
                drug: 'Caffeine citrate (BPD prevention)',
                dose: 'Load 20 mg/kg → Maintenance 5–10 mg/kg/day',
                route: 'IV over 30 min / PO',
                frequency: 'q24h maintenance',
                calculation: (w: number) => `Load: ${(20 * w).toFixed(0)} mg | Maintenance: ${(5 * w).toFixed(0)}–${(10 * w).toFixed(0)} mg/day`,
                notes: 'Start day 1. Continue to 34–36 wks PMA. Citrate salt — base = half.',
              },
              {
                drug: 'Vitamin A (if available)',
                dose: '5000 IU IM',
                route: 'IM',
                frequency: '3 × weekly × 4 weeks (starting day 1)',
                calculation: (_w: number) => '5000 IU fixed dose (infants < 1000 g)',
                notes: 'Only in BW < 1000 g. Reduces BPD NNT = 11. Check local formulary availability.',
              },
            ],
            nursing: [
              'SpO₂ histograms reviewed weekly — target > 80% of time in 91–95% range',
              'Caffeine HR monitoring — document HR q4h',
              'Vitamin A IM injection site rotation if used',
            ],
            triggers: [
              'Failure to extubate after 2 attempts within 72 h → reassess readiness → consider DART',
              'O₂ requirement increasing rather than decreasing after day 14 → BPD evolving → BPD management plan',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Established BPD Management',
        shortLabel: 'Treatment',
        color: 'indigo',
        cards: [
          {
            title: 'Diuretics, Bronchodilators & DART Steroids',
            isCritical: true,
            orders: [
              'FLUID RESTRICTION: 120–150 mL/kg/day total (feeds + IV). Fluid overload worsens interstitial oedema → ↑ O₂ requirement. Daily weight — target weight gain 15–20 g/kg/day (not faster).',
              'DIURETICS — for wet BPD (interstitial oedema, worsening O₂ requirement, CXR fluid overload): Furosemide 1 mg/kg IV/PO q12–24h (PMA-based interval — see NeoDose). Add spironolactone 1–2 mg/kg/day PO (potassium-sparing, reduces furosemide-induced hypokalaemia). Monitor electrolytes every 48 h — hypokalaemia, hypochloraemic alkalosis, nephrocalcinosis with prolonged furosemide.',
              'BRONCHODILATORS — for wheeze or bronchospasm: inhaled salbutamol (albuterol) 100–200 mcg via MDI + spacer q4–6h PRN (assess response — discontinue if no benefit after 48 h trial). Ipratropium bromide 20–40 mcg q6–8h can be added for bronchospasm component.',
              'DEXAMETHASONE (DART PROTOCOL) — for VENTILATOR-DEPENDENT BPD at > 7 days in infants where extubation has failed: 0.15 mg/kg/day × 3d → 0.10 mg/kg/day × 3d → 0.05 mg/kg/day × 2d → 0.02 mg/kg/day × 2d (10-day total course). Evidence: DART trial — accelerates extubation with acceptable short-term neurodevelopmental risk at these low doses. DO NOT use higher doses or longer courses.',
              'INHALED CORTICOSTEROIDS (budesonide): limited evidence; some centres use budesonide 200 mcg/day via MDI for established BPD with bronchospasm. Not routinely recommended outside specialist centres.',
            ],
            prescriptions: [
              {
                drug: 'Furosemide (diuretic)',
                dose: '1 mg/kg/dose IV or 1–2 mg/kg/dose PO',
                route: 'IV over 5–10 min / PO',
                frequency: 'q12–24h (PMA-based — preterm: q24h initially)',
                calculation: (w: number) => `IV: ${(1 * w).toFixed(1)} mg/dose | PO: ${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mg/dose`,
                notes: 'Monitor K⁺ (hypokalaemia common). Nephrocalcinosis with prolonged use — renal US at 4 weeks.',
              },
              {
                drug: 'Spironolactone',
                dose: '1–2 mg/kg/day PO',
                route: 'PO divided q12h',
                frequency: 'q12h',
                calculation: (w: number) => `${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mg/day (${(0.5 * w).toFixed(1)}–${(1 * w).toFixed(1)} mg q12h)`,
                notes: 'Potassium-sparing. Use with furosemide. Monitor K⁺.',
              },
              {
                drug: 'Dexamethasone — DART protocol',
                dose: '0.15 → 0.10 → 0.05 → 0.02 mg/kg/day (stepdown)',
                route: 'IV over 15 min or PO',
                frequency: 'q24h × 10 days total',
                calculation: (w: number) => `Day 1–3: ${(0.15 * w).toFixed(3)} mg/day | Day 4–6: ${(0.10 * w).toFixed(3)} mg/day | Day 7–8: ${(0.05 * w).toFixed(3)} mg/day | Day 9–10: ${(0.02 * w).toFixed(3)} mg/day`,
                notes: 'DART dosing ONLY — never exceed. Only for ventilator-dependent BPD after day 7. Monitor BG, BP, infection.',
              },
            ],
            nursing: [
              'Daily weight: same time, same scale. Document on Fenton growth chart',
              'Strict fluid balance: every 4 h — input (IV + feeds) and output (urine, stool)',
              'Electrolytes q48h while on diuretics',
              'DART: BG q6h, BP q4h. Infection surveillance — increased risk during steroid course',
            ],
            triggers: [
              'K⁺ < 3.0 mmol/L → oral or IV KCl supplement, increase spironolactone',
              'No extubation 48 h into DART → reassess readiness — ensure caffeine on board, consider NIPPV',
              'BG > 10 mmol/L sustained on DART → consider insulin infusion (see NeoDose)',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: Pulmonary Hypertension in BPD',
        shortLabel: 'Pulmonary HTN',
        color: 'red',
        cards: [
          {
            title: 'BPD-Associated Pulmonary Hypertension',
            isCritical: true,
            orders: [
              'SCREEN: echo at 36 weeks PMA in all grade 2–3 BPD. Repeat every 3–6 months in established BPD with PH. RVSP ≥ 2/3 systemic BP = significant PH.',
              'EXCLUDE CORRECTABLE CAUSES: (1) Hypoxia → optimise oxygenation (SpO₂ 93–97% in BPD-PH — higher than standard); (2) Obstructive sleep apnoea → polysomnography; (3) Anatomical pulmonary venous obstruction → CT/MRI chest; (4) Aspiration/reflux → pH probe, thickened feeds.',
              'OPTIMISE OXYGENATION FIRST: BPD-associated PH is driven by hypoxic vasoconstriction. Ensure SpO₂ ≥ 93% (increase target slightly above standard BPD target). Home O₂ if needed — PH will not improve with hypoxia.',
              'SILDENAFIL: first-line pulmonary vasodilator for BPD-PH. Start 0.5 mg/kg PO q8h → titrate to 1–2 mg/kg q8h. Monitor BP. Duration: months to years — wean when echo confirms PH resolution.',
              'BOSENTAN: oral endothelin receptor antagonist — consider in severe BPD-PH unresponsive to sildenafil alone. Specialist initiation only (paediatric PH centre). Monthly LFTs mandatory.',
              'MILRINONE: for acute RV failure complicating BPD-PH — inpatient use. 0.25–0.75 mcg/kg/min continuous IV.',
              'iNO: for acute decompensation of BPD-PH (inpatient). Not suitable for long-term outpatient use.',
            ],
            nursing: [
              'Pre/post-ductal SpO₂ paired measurement: document weekly in BPD-PH',
              'Sildenafil BP monitoring: 30 min after each new dose, then each shift',
            ],
            triggers: [
              'Echo RVSP ≥ 2/3 systemic → PH confirmed → refer paediatric pulmonary hypertension specialist',
              'Acute RV failure (hepatomegaly, peripheral oedema, haemodynamic compromise) → inpatient stabilisation + milrinone + iNO',
            ],
          },
        ],
      },

      {
        label: 'Stage 5: Home Oxygen, Discharge & Follow-up',
        shortLabel: 'Discharge',
        color: 'emerald',
        cards: [
          {
            title: 'Home Oxygen Criteria, Discharge Planning & Follow-up',
            orders: [
              'HOME OXYGEN CRITERIA: infant may be discharged on supplemental O₂ if: (1) SpO₂ ≥ 92% on ≤ 0.5 L/min nasal cannula; (2) Gaining weight appropriately; (3) No frequent desaturation events; (4) Parents trained in O₂ use, SpO₂ monitor, and emergency response.',
              'WEAN HOME O₂ in outpatient clinic: reduce flow by 0.1 L/min per visit (every 2–4 weeks) while monitoring SpO₂ and weight gain. Stop O₂ when SpO₂ ≥ 92% in room air throughout the day (including sleep).',
              'IMMUNISATIONS: RSV prophylaxis with palivizumab (15 mg/kg IM monthly × 5 doses, beginning before RSV season) for all grade 2–3 BPD infants in first year of life. Annual influenza vaccination.',
              'GROWTH: target weight, head circumference, and length within −1 SD of corrected age on Fenton chart by discharge. If growth faltering → caloric density increase (24 kcal/oz or fortifier).',
              'NEURODEVELOPMENTAL: BPD is independently associated with cognitive impairment, motor delay, language delay, and school-age learning difficulties. Arrange: (1) Developmental paediatrics at 3, 6, 12, 24 months corrected age; (2) Physiotherapy and occupational therapy as needed; (3) Early intervention programme.',
              'FOLLOW-UP SCHEDULE: (1) Outpatient neonatology/pulmonology: 1–2 weeks post-discharge, then monthly until O₂ weaned; (2) Echo every 3–6 months if BPD-PH; (3) Ophthalmology for ROP screen; (4) Audiology (AABR before discharge + formal at 6 months corrected).',
            ],
            nursing: [
              'Parent training (before discharge): O₂ equipment, SpO₂ monitor alarm response, RSV prevention, when to seek emergency care',
              'Discharge summary: include BPD grade, peak O₂ requirement, medications, follow-up plan',
              'Ensure RSV prophylaxis first dose given before discharge if RSV season',
            ],
            triggers: [
              'SpO₂ < 90% at home despite O₂ → increase flow or re-admit for assessment',
              'Weight loss or failure to gain > 2 weeks → re-admit for nutritional assessment',
              'Wheeze or respiratory exacerbation (RSV, parainfluenza) → low threshold for re-admission in BPD',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['BPD graded by NICHD 2019 criteria at 36 weeks PMA — based on O₂/support requirement, not a bedside score.'] }),
  getManagement: () => [
    {
      title: 'BPD essentials',
      recommendations: [
        'SpO₂ 91–95% alarm limits strictly enforced — hyperoxia is the primary preventable cause.',
        'Caffeine from day 1. Volume-targeted ventilation. Early extubation.',
        'DART dexamethasone only for ventilator-dependent BPD after day 7 — 10-day low-dose course.',
        'Diuretics (furosemide + spironolactone) for fluid overload component.',
        'Echo at 36 weeks PMA — screen for pulmonary hypertension in all grade 2–3 BPD.',
        'Sildenafil for BPD-associated PH. Home O₂ for grade ≥ 2 not weaned by 36 weeks.',
      ],
    },
  ],
  getDisposition: () => [
    'Remain in NICU until: SpO₂ stable on ≤ 0.5 L/min O₂, gaining weight, no apnoea.',
    'Home oxygen if grade 2–3 BPD not resolved at 36 weeks PMA — outpatient O₂ wean.',
    'Grade 3B (ventilator-dependent) → tertiary NICU; consider tracheostomy if long-term MV anticipated.',
  ],
  getRedFlags: () => [
    'Failure to wean from invasive MV by 36 weeks PMA → consider tracheostomy discussion',
    'Echo RVSP ≥ 2/3 systemic BP → BPD-PH → start sildenafil → PH specialist referral',
    'O₂ requirement increasing rather than decreasing → exclude PH, infection, aspiration',
    'Apnoea at 36 weeks PMA → caffeine inadequate level → check level → increase dose',
    'Weight loss or growth faltering → increase caloric density → dietitian review',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Caffeine citrate', dose: w ? `Maintenance ${(5 * w).toFixed(0)}–${(10 * w).toFixed(0)} mg/day` : '5–10 mg/kg/day', notes: 'q24h. Continue to 34–36 wks PMA.' },
      { drugName: 'Furosemide', dose: w ? `${(1 * w).toFixed(1)} mg/dose` : '1 mg/kg/dose', notes: 'q12–24h. Monitor electrolytes. Nephrocalcinosis risk.' },
      { drugName: 'Dexamethasone (DART)', dose: w ? `Day 1–3: ${(0.15 * w).toFixed(3)} mg/day (stepdown)` : '0.15→0.10→0.05→0.02 mg/kg/day', notes: '10-day course only. Ventilator-dependent BPD after day 7.' },
      { drugName: 'Sildenafil (BPD-PH)', dose: w ? `${(0.5 * w).toFixed(2)}–${(2 * w).toFixed(1)} mg/dose` : '0.5–2 mg/kg/dose', notes: 'q8h PO. Titrate up. Monitor BP.' },
    ];
  },
  getReferences: () => [
    { title: 'Jensen EA et al. NICHD BPD Definition 2019. Am J Respir Crit Care Med 2019', url: 'https://pubmed.ncbi.nlm.nih.gov/31449401/' },
    { title: 'DART Trial — Doyle LW et al. Lancet 2006', url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(06)68351-7/fulltext' },
    { title: 'CAP Trial — Schmidt B et al. NEJM 2006', url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa054065' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
