import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Apnea of Prematurity (AOP)
 * Based on: Abu-Shaweesh JM & Martin RJ Semin Perinatol 2008;
 * CAP trial Schmidt et al. NEJM 2006; NNF 9th ed. (2024)
 */
export const nicuApneaProtocol: DiseaseProtocol = {
  id: 'nicu-apnea',
  name: 'Apnea of Prematurity',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Cessation of breathing ≥ 20 seconds, or shorter with bradycardia < 100 bpm or SpO₂ < 80%, due to immaturity of central respiratory control — occurs in nearly all infants < 28 weeks and in > 50% at 30–32 weeks GA.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'Apnoea of prematurity (AOP) results from immaturity of the brainstem respiratory control centre, blunted chemoreceptor responses, and upper airway instability. It is classified as: central (no effort — brainstem immaturity), obstructive (effort without airflow — upper airway collapse), or mixed (most common — 50–75% of episodes). The cornerstone of treatment is caffeine citrate (earliest and most evidence-based intervention in NICU medicine). CPAP and HFNC reduce obstructive and mixed events by providing airway stenting. KEY RULE: any new or worsening apnoea in a stable infant (especially after day 7) is NOT AOP until a secondary cause is excluded — DOPES screen first.',

    stages: [
      {
        label: 'Stage 1: Diagnosis, Classification & DOPES Screen',
        shortLabel: 'Diagnosis',
        color: 'red',
        cards: [
          {
            title: 'Define Apnoea, Classify & Exclude Secondary Causes',
            isCritical: true,
            orders: [
              'DEFINITION: (1) Apnoea — cessation of breathing ≥ 20 seconds; OR (2) Shorter pause WITH bradycardia HR < 100 bpm; OR (3) Shorter pause WITH SpO₂ < 80% (significant desaturation). Bradycardia alone (without apnoea) is not AOP but may be a sign of the same immaturity.',
              'CLASSIFICATION: Central — no respiratory effort (chest wall movement absent). Obstructive — chest wall movement present but no airflow (upper airway obstruction). Mixed — initially obstructive then central (most common).',
              'EXPECTED INCIDENCE BY GESTATION: < 28 weeks = nearly 100%; 28–32 weeks = > 50%; 32–34 weeks = ~ 15%; > 34 weeks = uncommon — investigate secondary cause.',
              'DOPES SCREEN — PERFORM BEFORE LABELLING AS PRIMARY AOP (especially if new/worsening apnoea after a stable period):',
              '  D — Drugs: opioids, sedatives, anticonvulsants, prostaglandins? Review medication chart.',
              '  O — Oxygen drop: hypoxia itself triggers apnoea → check FiO₂ trend and blood gas.',
              '  P — Position: neck flexion blocks airway → ensure midline/sniffing position.',
              '  E — Environment / Temperature: cold stress or hyperthermia triggers central apnoea → check temp.',
              '  S — Sepsis: late-onset sepsis presents with new apnoea in previously stable infants → blood culture + FBC + CRP.',
              'ADDITIONAL SECONDARY CAUSES: anaemia (Hct < 25% → impaired O₂ delivery), hypoglycaemia, hypocalcaemia, hypo/hypernatraemia, seizures (atypical motor activity), GORD (acid-triggered laryngospasm), IVH, intraventricular haemorrhage.',
              'INVESTIGATIONS for new apnoea: FBC, CRP, blood gas, electrolytes, blood glucose. Blood culture if clinical concern for sepsis. EEG if seizure activity suspected.',
            ],
            nursing: [
              'Apnoea documentation: time, duration, type (stimulation needed / PPV needed), HR nadir, SpO₂ nadir',
              'Stimulation response: gentle tactile (rub back, flick sole). If no response within 10–15 s → PPV',
              'Position check every nursing assessment: neutral/sniffing head position, no neck flexion',
              'Temperature: target 36.5–37.5°C; recheck if new apnoea onset',
            ],
            triggers: [
              'New/worsening apnoea after day 7 → DOPES screen → blood culture → escalate if cause found',
              'Apnoea requiring repeated PPV or intubation → CPAP or escalation (Stage 3)',
              'Bradycardia < 60 bpm unresponsive to stimulation → chest compressions → resuscitation',
            ],
          },
        ],
      },

      {
        label: 'Stage 2: Caffeine — First-Line Treatment',
        shortLabel: 'Caffeine',
        color: 'amber',
        cards: [
          {
            title: 'Caffeine Citrate — Initiation, Dosing & Monitoring',
            isCritical: true,
            orders: [
              'START CAFFEINE ON DAY 1 in all infants < 32 weeks GA — do not wait for first apnoea event. Prophylactic caffeine reduces apnoea frequency, facilitates extubation, and reduces BPD (CAP trial, NNT = 6).',
              'CAFFEINE CITRATE DOSE: Loading dose 20 mg/kg IV over 30 min (or PO — equivalent bioavailability). Maintenance: 5–10 mg/kg/day PO/IV q24h, starting 24 h after loading dose.',
              'DOSE ESCALATION: if ≥ 4 apnoea events per 8-hour nursing period despite 5 mg/kg/day → increase maintenance to 10 mg/kg/day. Further escalation to 15 mg/kg/day may be trialled in refractory AOP in consultation with senior — check level first.',
              'CITRATE SALT: 20 mg caffeine citrate = 10 mg caffeine base. Do NOT confuse with aminophylline dosing.',
              'THERAPEUTIC LEVEL: 8–20 mg/L (caffeine base). Check level if no improvement after 3 days or if toxicity suspected. Level 6 h after dose (rough guide for steady state).',
              'TOXICITY: HR consistently > 180 bpm → reduce dose or hold one dose → recheck level. Jitteriness, vomiting, hyperglycaemia, seizures at toxic levels (> 40 mg/L).',
              'DURATION: continue until 34–36 weeks PMA AND apnoea-free for ≥ 5–7 consecutive days. In practice: many infants < 28 weeks need caffeine until 36+ weeks PMA.',
            ],
            prescriptions: [
              {
                drug: 'Caffeine citrate',
                dose: 'Load 20 mg/kg → Maintenance 5–10 mg/kg/day',
                route: 'IV over 30 min / PO (bioequivalent)',
                frequency: 'Load once; maintenance q24h from 24 h after load',
                calculation: (w: number) => `Load: ${(20 * w).toFixed(0)} mg | Maintenance: ${(5 * w).toFixed(0)}–${(10 * w).toFixed(0)} mg/day`,
                notes: 'Citrate salt (base = half). Start day 1 in all < 32 weeks. Continue to 34–36 wks PMA.',
              },
            ],
            nursing: [
              'Caffeine: record HR q4h for first 48 h after loading — alert if HR > 180 bpm sustained',
              'Apnoea frequency chart: record all events per shift (mild = stim only, moderate = PPV, severe = intubation)',
              'Apnoea rate at 24 and 48 h after caffeine load — expect ≥ 50% reduction',
            ],
            triggers: [
              'No improvement at 48 h on caffeine 5 mg/kg/day → increase to 10 mg/kg/day',
              'HR > 180 bpm sustained → caffeine toxicity → hold dose → level',
              'Still > 4 events/8h on caffeine 10 mg/kg/day → CPAP (Stage 3) + level',
            ],
          },
        ],
      },

      {
        label: 'Stage 3: CPAP, HFNC & Escalation',
        shortLabel: 'CPAP / Escalation',
        color: 'indigo',
        cards: [
          {
            title: 'Respiratory Support for Persistent Apnoea',
            orders: [
              'CPAP: start 5–6 cmH₂O if apnoea persists on caffeine — CPAP provides pneumatic airway stenting, eliminating obstructive and mixed events. Most effective for obstructive component. FiO₂: 0.21–0.25 typically sufficient.',
              'HFNC (HIGH-FLOW NASAL CANNULA): alternative to CPAP for stable infants — 2–6 L/min. Effective for obstruction component but provides less consistent end-expiratory pressure than CPAP. Preferred by some units for ease of use and comfort.',
              'NIPPV (NON-INVASIVE PPV): CPAP + backup rate (10–20 bpm) for central apnoea unresponsive to CPAP alone. Settings: PIP 14–18 cmH₂O / PEEP 5–6 cmH₂O / RR 10–20/min backup.',
              'POSITIONING INTERVENTIONS: prone positioning reduces AOP frequency in monitored stable infants (improves respiratory mechanics and reduces arousal threshold). Supine positioning for discharge safety.',
              'INTUBATION CRITERIA for AOP: (1) Frequent severe events requiring PPV (> 1 per 8-hour shift) despite caffeine + CPAP; (2) Any event requiring chest compressions; (3) Haemodynamic instability associated with apnoea.',
              'DO NOT sedate with opioids for AOP in non-intubated infants — opioids themselves cause central apnoea and will worsen AOP. Reserve for ventilated infants.',
            ],
            nursing: [
              'Prone: only if continuous monitoring — document position, reassess every 4 h',
              'SpO₂ alarm limits: lower 80%, upper 95%',
              'CPAP/HFNC interface: skin check around nares every 4 h — pressure injury prevention',
            ],
            triggers: [
              'Apnoea event requiring PPV on CPAP → increase CPAP pressure by 1 cmH₂O (up to 8 cmH₂O)',
              'Repeated events requiring PPV despite CPAP 8 cmH₂O + caffeine → intubation criteria met',
            ],
          },
        ],
      },

      {
        label: 'Stage 4: Discharge Criteria & Home Monitoring',
        shortLabel: 'Discharge',
        color: 'emerald',
        cards: [
          {
            title: 'Discharge Readiness & Post-Discharge Apnoea',
            orders: [
              'DISCHARGE CRITERIA for AOP: (1) Apnoea-free for ≥ 5–7 consecutive days without stimulation; (2) On room air or stable low-flow O₂; (3) Tolerating full oral feeds; (4) Caffeine stopped (or continuing if meeting home criteria); (5) Corrected age ≥ 34–36 weeks (apnoea risk decreases markedly).',
              'HOME APNOEA MONITOR: NOT routinely recommended for AOP alone — evidence shows no mortality benefit and high false alarm rates → parental anxiety. Indicated ONLY for: infants with documented apnoea of undetermined origin unresponsive to caffeine; ALTE (apparent life-threatening event) with no identified cause.',
              'HOME CAFFEINE: some centres discharge infants home on caffeine (continued for apnoea or BPD). Requires parent education on signs of caffeine toxicity (HR > 180, jitteriness, poor feeding) and dose instructions.',
              'CARDIORESPIRATORY MONITORING: all infants with significant AOP history should have pulse oximetry at home if on supplemental O₂. Ensure parents are trained in infant CPR before discharge.',
              'APPARENT LIFE-THREATENING EVENT (ALTE) / BRIEF RESOLVED UNEXPLAINED EVENT (BRUE): events requiring vigorous stimulation or rescue breaths in a term or near-term infant — full inpatient evaluation required (sepsis, seizures, cardiac arrhythmia, metabolic, structural airway, NAI). This is distinct from AOP.',
            ],
            nursing: [
              'Parent CPR training: documented and confirmed before discharge',
              'Home caffeine education: dose, frequency, signs of toxicity, when to seek help',
              'Discharge summary: include apnoea history, peak caffeine dose, home monitoring plan',
            ],
            triggers: [
              'Apnoea event on discharge readiness → reset 5–7 day apnoea-free clock',
              'BRUE/ALTE in near-term infant → full inpatient evaluation before discharge',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Severity assessed by frequency and response to stimulation — mild (stim only), moderate (PPV), severe (chest compressions). DOPES screen for secondary causes.'] }),
  getManagement: () => [
    {
      title: 'AOP essentials',
      recommendations: [
        'Start caffeine day 1 in all infants < 32 weeks — do not wait for first event.',
        'New apnoea after day 7 → DOPES screen first — exclude sepsis, drugs, metabolic.',
        'Caffeine 20 mg/kg load → 5–10 mg/kg/day maintenance. Level if no response.',
        'CPAP 5–6 cmH₂O for obstructive/mixed apnoea unresponsive to caffeine.',
        'Discharge: ≥ 5–7 consecutive apnoea-free days. No routine home monitor.',
        'DO NOT give opioids for AOP in non-intubated infants.',
      ],
    },
  ],
  getDisposition: () => [
    'All significant AOP (requiring PPV or intubation) → Level II or III NICU.',
    'Discharge home when apnoea-free ≥ 5–7 days, on room air, full feeds.',
    'BRUE/ALTE → full inpatient evaluation before any discharge consideration.',
  ],
  getRedFlags: () => [
    'New apnoea after day 7 → NOT primary AOP until DOPES screen negative → blood culture',
    'Apnoea requiring CPR → neonatal resuscitation → post-event investigation',
    'Apnoea unresponsive to caffeine 10 mg/kg/day + CPAP → intubation criteria',
    'HR > 180 sustained → caffeine toxicity → hold dose → check level',
    'Apnoea in term infant → NOT AOP → full BRUE evaluation',
  ],
  getDrugDoses: (_severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      { drugName: 'Caffeine citrate', dose: w ? `Load ${(20 * w).toFixed(0)} mg → Maintenance ${(5 * w).toFixed(0)}–${(10 * w).toFixed(0)} mg/day` : 'Load 20 mg/kg → 5–10 mg/kg/day', notes: 'Citrate salt — base = half. Start day 1. Continue to 34–36 wks PMA.' },
    ];
  },
  getReferences: () => [
    { title: 'CAP Trial — Caffeine for Apnea of Prematurity. Schmidt B et al. NEJM 2006', url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa054065' },
    { title: 'Abu-Shaweesh JM, Martin RJ. Neonatal Apnea. Semin Perinatol 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/18482615/' },
    { title: 'NNF 9th ed. (2024)', url: 'https://www.medicinescomplete.com/' },
  ],
};
