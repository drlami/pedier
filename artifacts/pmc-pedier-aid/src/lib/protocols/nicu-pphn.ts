import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Persistent Pulmonary Hypertension of the Newborn (PPHN)
 * Based on: Abman SH et al. Am Heart J 2015; Steinhorn RH Neonatology 2010;
 * AAP/AHA iNO Clinical Practice 2016; NNF 9th ed. (2024)
 */
export const nicuPphnProtocol: DiseaseProtocol = {
  id: 'nicu-pphn',
  name: 'Persistent Pulmonary Hypertension of the Newborn (PPHN)',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Failure of normal postnatal pulmonary vascular transition — elevated pulmonary vascular resistance causes right-to-left shunting at PDA and PFO, resulting in severe hypoxaemia refractory to O₂.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'PPHN occurs when pulmonary vascular resistance (PVR) fails to fall after birth, causing right-to-left shunting of deoxygenated blood across the PDA and PFO → severe cyanosis and hypoxaemia disproportionate to the lung disease. PPHN can be primary (idiopathic, 10%) or secondary (MAS 30%, asphyxia 15%, sepsis 15%, RDS 10%, CDH 10%). The hallmark is a pre/post-ductal SpO₂ difference ≥ 5–10%, worsening with agitation, and failure to respond to O₂ (OI rising despite high FiO₂). Avoid hyperventilation (old approach of alkalosis — now abandoned). Key treatments in order: optimise lung recruitment (CPAP/HFOV), iNO 20 ppm, sildenafil, milrinone for RV dysfunction, and ECMO if OI > 40.',

    stages: [
      {
        label: 'Stage 1: Diagnosis & Severity Assessment',
        shortLabel: 'Diagnosis',
        color: 'red',
        cards: [
          {
            title: 'Diagnose PPHN & Calculate OI',
            isCritical: true,
            calculator: { id: 'oi-calc', title: 'Oxygenation Index (OI) Calculator' },
            orders: [
              'PRE/POST-DUCTAL SpO₂ DIFFERENCE: measure simultaneously — right hand (pre-ductal) and either foot (post-ductal). Difference ≥ 5–10% = right-to-left shunting at PDA → PPHN confirmed. Absence of pre/post-ductal difference does NOT exclude PPHN (may have PFO shunting only).',
              'HYPEROXIA TEST: place infant in 100% FiO₂ for 10 min. PaO₂ > 150 mmHg (20 kPa) → cyanotic CHD very unlikely. PaO₂ < 100 mmHg (13 kPa) despite 100% O₂ = cardiac cause or severe PPHN.',
              'CALCULATE OI (use calculator above): OI = (MAP × FiO₂ × 100) / PaO₂. OI < 10 = mild | OI 10–20 = moderate | OI 20–40 = severe | OI > 40 = critical (ECMO range).',
              'ECHOCARDIOGRAPHY: perform within 2 h of PPHN diagnosis. Assess: (1) Direction of shunting at PDA and PFO (right-to-left = PPHN); (2) Estimate RVSP via tricuspid regurgitation jet (RVSP ≥ 2/3 systemic BP = significant PH); (3) Assess RV size and function (dilated, hypokinetic RV = poor prognosis); (4) EXCLUDE structural CHD — critical before iNO.',
              'IDENTIFY UNDERLYING CAUSE: MAS, sepsis, asphyxia, RDS, CDH, idiopathic. Treat the underlying cause simultaneously.',
              'MINIMISE STIMULATION: PPHN worsens acutely with stimulation → cluster cares, keep room quiet, sedation if agitated. Avoid unnecessary procedures.',
            ],
            nursing: [
              'Pre/post-ductal SpO₂ (right hand + right foot) simultaneously every 4 h — document BOTH values',
              'Avoid suctioning, heel pricks, and stimulation unless essential — SpO₂ may drop catastrophically',
              'Arterial line: UAC or radial — continuous BP and arterial blood gas access',
              'Two SpO₂ probes in situ simultaneously at all times',
            ],
            triggers: [
              'Pre/post-ductal difference > 10% → PPHN confirmed → escalate to iNO (Stage 3)',
              'OI > 20 on two consecutive blood gases → iNO indication',
              'Structural CHD on echo → cardiology referral → may need PGE1 (see CHD protocol)',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Initial Stabilisation',
        shortLabel: 'Stabilisation',
        color: 'amber',
        cards: [
          {
            title: 'Optimise Lung Recruitment & Systemic Circulation',
            isCritical: true,
            orders: [
              'OXYGENATION TARGET: SpO₂ 91–95% (pre-ductal). Target PaO₂ 60–80 mmHg. AVOID hypoxia (worsens PVR) AND hyperoxia (oxidative injury). FiO₂ ≥ 0.60 initially acceptable if needed for oxygenation.',
              'VENTILATION STRATEGY: PPHN needs ADEQUATE LUNG VOLUME to reduce hypoxic vasoconstriction from atelectasis. CPAP 6–8 cmH₂O for mild PPHN on spontaneous breathing. Intubation if OI > 15, haemodynamic instability, or FiO₂ > 0.60 on CPAP.',
              'VENTILATOR SETTINGS for PPHN: Mode SIMV+VG or A/C+VG | VT 5–6 mL/kg | PEEP 5–7 cmH₂O | RR 40–60/min | FiO₂ to SpO₂ target.',
              'GAS TARGETS: SpO₂ 91–95% pre-ductal | PaO₂ 60–80 mmHg | PaCO₂ 40–50 mmHg (mild permissive hypercapnia acceptable; pH ≥ 7.30) | pH 7.30–7.45. DO NOT hyperventilate — hypocapnia causes cerebral vasoconstriction and is no longer used for PPHN.',
              'SYSTEMIC BP SUPPORT: maintain systemic BP above RVSP (RV pressure) to reduce right-to-left shunting. Target MAP ≥ 45–50 mmHg in term infants (> RVSP). Vasopressors if needed: Norepinephrine (0.05–0.5 mcg/kg/min) is preferred over dopamine for maintaining systemic vascular resistance without increasing PVR.',
              'VOLUME: cautious volume bolus (10 mL/kg 0.9% NaCl over 30 min) only if hypovolaemia evident. Excessive volume worsens RV dilatation.',
              'SEDATION & ANALGESIA: morphine 0.01–0.02 mg/kg/h infusion to reduce agitation-induced PVR crises. Avoid paralysis routinely — retain respiratory effort.',
            ],
            prescriptions: [
              {
                drug: 'Morphine (sedation)',
                dose: '0.01–0.02 mg/kg/h continuous infusion',
                route: 'IV continuous',
                frequency: 'Continuous — titrate to comfort',
                calculation: (w: number) => `${(0.01 * w).toFixed(4)}–${(0.02 * w).toFixed(4)} mg/h`,
                notes: 'Reduces agitation-induced PVR crises. Monitor respiratory drive.',
              },
              {
                drug: 'Norepinephrine (systemic BP support)',
                dose: '0.05–0.5 mcg/kg/min',
                route: 'Central IV continuous',
                frequency: 'Continuous — titrate to MAP target',
                calculation: (w: number) => `Start ${((0.05 * w * 60) / 40).toFixed(3)} mL/h at 40 mcg/mL`,
                notes: 'Target MAP > RVSP. Central line mandatory. Arterial line for BP monitoring.',
              },
            ],
            nursing: [
              'Cluster cares: group all interventions together to minimise SpO₂ dip episodes',
              'Record and report ANY agitation episode — likely to cause PVR spike and SpO₂ drop',
              'UAC/radial arterial line: blood gas every 2–4 h while on FiO₂ > 0.50',
            ],
            triggers: [
              'SpO₂ crisis (< 70%) with agitation → deep sedation + volume → iNO if not started',
              'MAP falling below RVSP estimate → vasopressor escalation',
              'OI > 20 → proceed to iNO (Stage 3)',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: Inhaled Nitric Oxide (iNO) Therapy',
        shortLabel: 'iNO',
        color: 'indigo',
        cards: [
          {
            title: 'iNO Initiation, Monitoring & Sildenafil',
            isCritical: true,
            orders: [
              'iNO INDICATION: OI ≥ 20 on two consecutive blood gases ≥ 1 h apart in a mechanically ventilated infant ≥ 34 weeks GA. CONFIRM: (1) structural CHD excluded on echo; (2) adequate lung recruitment (HFOV if not — poor lung volume reduces iNO efficacy); (3) no methemoglobinemia.',
              'iNO DOSE: start at 20 ppm via ventilator circuit. Do NOT start at < 20 ppm — lower starting doses have lower response rate. Do NOT exceed 40 ppm routinely (toxicity, methemoglobin).',
              'RESPONSE ASSESSMENT: blood gas at 30 and 60 min after starting iNO. RESPONDER: PaO₂ increases ≥ 20 mmHg OR OI decreases ≥ 20% within 30–60 min. NON-RESPONDER at 20 ppm for 60 min → increase to 40 ppm for 30 min. Still no response → maximal medical therapy failed → ECMO criteria (Stage 4).',
              'HFOV + iNO COMBINATION: most effective. Switch to HFOV (MAP = conventional MAP + 2 cmH₂O — HIGH MAP strategy for lung recruitment) if not already on HFOV. iNO delivery via HFOV circuit — check circuit compatibility.',
              'SILDENAFIL: add if (1) partial iNO response; (2) iNO not available; (3) iNO weaning — sildenafil prevents rebound PPHN on iNO withdrawal. Dose: 0.5 mg/kg PO/NG q6h (start) → titrate to 1–2 mg/kg q6h. IV: 0.4 mg/kg over 3 h loading then 1.6 mg/kg/day infusion.',
              'METHAEMOGLOBIN: check at 2 h after iNO start, then daily. MetHb target < 5%. If > 5% → reduce iNO dose by 50%. If > 10% → stop iNO, consider methylene blue 1 mg/kg IV.',
              'NO₂ MONITORING: automated NO₂ alarm at > 3 ppm — toxic byproduct.',
            ],
            prescriptions: [
              {
                drug: 'Sildenafil (PPHN / iNO adjunct)',
                dose: '0.5 mg/kg/dose start → titrate to 1–2 mg/kg/dose',
                route: 'PO/NG q6h',
                frequency: 'q6–8h',
                calculation: (w: number) => `Starting: ${(0.5 * w).toFixed(2)} mg/dose | Max: ${(2 * w).toFixed(1)} mg/dose`,
                notes: 'Monitor BP (systemic hypotension). IV dose: 0.4 mg/kg over 3 h load.',
              },
              {
                drug: 'Milrinone (RV dysfunction)',
                dose: '0.25–0.75 mcg/kg/min',
                route: 'Central IV continuous',
                frequency: 'Continuous',
                calculation: (w: number) => `Start 0.33 mcg/kg/min = ${((0.33 * w * 60) / 200).toFixed(3)} mL/h at 200 mcg/mL`,
                notes: 'For echo-confirmed RV dysfunction. Watch for systemic hypotension.',
              },
            ],
            nursing: [
              'MetHb level: 2 h after iNO start, then q12h. Alert if > 5%',
              'NO₂ level: continuous monitoring; alarm at 3 ppm',
              'iNO circuit connections: leak check at start and each shift change',
              'iNO never abruptly stopped — rebound PPHN can be fatal',
            ],
            triggers: [
              'OI not improving after 60 min at 40 ppm → ECMO criteria met (Stage 4)',
              'MetHb > 5% → halve iNO dose immediately',
              'Systemic hypotension on sildenafil → norepinephrine or reduce sildenafil',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: ECMO Criteria & Referral',
        shortLabel: 'ECMO',
        color: 'red',
        cards: [
          {
            title: 'ECMO Eligibility & Transfer Criteria',
            isCritical: true,
            orders: [
              'CONTACT ECMO CENTRE PROACTIVELY when OI > 25 — do not wait for OI > 40. Transfer logistics and ECMO cannulation take hours.',
              'ECMO CRITERIA (all must be met): (1) OI > 40 on TWO blood gases ≥ 1 h apart despite maximal therapy (HFOV + iNO 20–40 ppm + sildenafil ± milrinone); OR acute deterioration with OI > 40 and imminent cardiac arrest; (2) GA ≥ 34 weeks (ECMO circuit volumes require minimum size); (3) Weight ≥ 2 kg (cannulation feasibility); (4) No lethal congenital anomaly incompatible with life; (5) No uncontrolled haemorrhage or coagulopathy; (6) IVH ≤ Grade II (higher grades: haemorrhagic conversion on anticoagulation).',
              'PRE-ECMO STABILISATION: ensure two large-bore IV lines (or femoral lines for cannulation); crossmatch blood; correct coagulopathy (platelets > 80,000; PT/APTT < 1.5× normal; fibrinogen > 1.5 g/L); arterial line for continuous monitoring.',
              'VENOVENOUS (VV) vs. VENOARTERIAL (VA) ECMO: VV-ECMO for respiratory failure only (PPHN without cardiac failure). VA-ECMO for refractory cardiogenic component or cardiac arrest.',
              'INFORM FAMILY: before transfer — explain ECMO risks (bleeding, stroke, infection), expected duration (days to weeks), and goal (bridge to recovery).',
            ],
            nursing: [
              'ECMO pre-transfer checklist: lines, bloods, consent, family briefing',
              'Paralysis for transfer if agitated (vecuronium 0.1 mg/kg IV)',
              'Continuous transport monitoring: SpO₂, ECG, BP, ETCO₂',
            ],
            triggers: [
              'OI > 25 → call ECMO centre NOW for consultation and transfer planning',
              'Cardiac arrest + PPHN → VA-ECMO → call senior + ECMO team simultaneously',
            ],
          },
        ],
      },

      {
        label: 'Stage 5: iNO Weaning & Recovery',
        shortLabel: 'Weaning',
        color: 'emerald',
        cards: [
          {
            title: 'iNO Weaning, Sildenafil Transition & Follow-up',
            orders: [
              'iNO WEANING CRITERIA: FiO₂ ≤ 0.60 and stable for ≥ 4–6 h; OI < 10; pre/post-ductal SpO₂ difference < 5%.',
              'iNO WEANING STEPS: 20 ppm → 10 ppm → 5 ppm → 2 ppm → 1 ppm → 0 ppm. Minimum 4 h at each step. Check SpO₂ and blood gas 30 min after each reduction. If SpO₂ drops > 5% → hold wean → back-titrate.',
              'DO NOT wean iNO below FiO₂ 0.60 before commencing — wean FiO₂ first, then iNO.',
              'SILDENAFIL as BRIDGE: start sildenafil 0.5 mg/kg q6–8h PO 24 h before planned iNO discontinuation. Continue sildenafil for 2–4 weeks after iNO weaned — prevents rebound PPHN.',
              'REBOUND PPHN ON iNO WITHDRAWAL: SpO₂ drops ≥ 10% within 30 min of dose reduction → restart previous iNO dose immediately → re-attempt wean more slowly after 24 h on sildenafil.',
              'ECHOCARDIOGRAPHY FOLLOW-UP: echo at 48 h after iNO weaned to confirm pulmonary pressure normalisation. Echo at discharge if any persistent concern.',
              'NEURODEVELOPMENTAL FOLLOW-UP: PPHN is associated with increased risk of sensorineural hearing loss (30%), cognitive delay, and motor disability. Arrange AABR hearing screen, developmental paediatrics at 12 and 24 months corrected age.',
            ],
            nursing: [
              'iNO reduction: monitor SpO₂ (pre and post-ductal) continuously for 1 h after each step',
              'Sildenafil oral doses: verify nasogastric tube position before each dose',
              'Hearing screen AABR before discharge — document iNO exposure duration',
            ],
            triggers: [
              'SpO₂ drop > 5% after iNO step-down → reinstate previous dose → slower wean',
              'Persistent PH on echo at discharge → outpatient pulmonary hypertension clinic',
              'Sensorineural hearing loss on AABR → audiology referral → consider amplification',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Calculate OI (calculator in Stage 1) to grade severity. OI < 10 = mild; 10–20 = moderate; 20–40 = severe; > 40 = critical (ECMO range).'] }),
  getManagement: () => [
    {
      title: 'PPHN essentials',
      recommendations: [
        'Pre/post-ductal SpO₂ simultaneously — confirm right-to-left ductal shunt.',
        'OI ≥ 20 → iNO 20 ppm. Best with HFOV for lung recruitment.',
        'DO NOT hyperventilate — target PaCO₂ 40–50 mmHg, pH 7.30–7.45.',
        'Contact ECMO centre at OI > 25 — early transfer planning saves lives.',
        'Sildenafil: add for partial iNO response or as bridge to iNO weaning.',
        'Never abruptly stop iNO — always wean stepwise with sildenafil overlap.',
      ],
    },
  ],
  getDisposition: () => [
    'All PPHN with OI > 10 → Level III NICU with iNO availability.',
    'OI > 25 or iNO non-response → contact ECMO centre for advice and transfer.',
    'iNO not available locally → transfer to tertiary centre immediately at OI > 20.',
  ],
  getRedFlags: () => [
    'OI > 20 → iNO indication — start immediately',
    'OI > 25 → contact ECMO centre NOW',
    'OI > 40 on 2 readings despite maximal therapy → ECMO criteria met → transfer',
    'MetHb > 5% on iNO → halve dose immediately',
    'Abrupt iNO withdrawal → rebound PPHN → restore dose',
    'Structural CHD on echo → do NOT assume PPHN → cardiology urgently',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Sildenafil', dose: w ? `${(0.5 * w).toFixed(2)}–${(2 * w).toFixed(1)} mg/dose` : '0.5–2 mg/kg/dose', notes: 'PO q6–8h. Start low, titrate. Monitor BP.' },
      { drugName: 'Milrinone', dose: w ? `0.33 mcg/kg/min = ${((0.33 * w * 60) / 200).toFixed(3)} mL/h (200 mcg/mL)` : '0.25–0.75 mcg/kg/min', notes: 'For RV dysfunction. Central line. Monitor BP.' },
      { drugName: 'Norepinephrine', dose: w ? `0.05–0.5 mcg/kg/min = ${((0.05 * w * 60) / 40).toFixed(3)}–${((0.5 * w * 60) / 40).toFixed(3)} mL/h (40 mcg/mL)` : '0.05–0.5 mcg/kg/min', notes: 'Central line only. Target MAP > RVSP.' },
    ];
  },
  getReferences: () => [
    { title: 'Abman SH et al. Pediatric Pulmonary Hypertension. Am Heart J 2015', url: 'https://pubmed.ncbi.nlm.nih.gov/26303292/' },
    { title: 'AAP iNO Clinical Practice Guidelines 2016', url: 'https://publications.aap.org/pediatrics/article/137/2/e20153904/52467' },
    { title: 'Steinhorn RH. Neonatal Pulmonary Hypertension. Pediatr Crit Care Med 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/20446987/' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
