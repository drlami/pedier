// NeoDose — Neonatal IV Drug Reference
// Dosing sourced from: NNF 9th ed. (2024), BNFc, Neofax 2023, ASHP/IDSA guidelines.
// ALL doses must be verified against local pharmacy / neonatologist policy before clinical use.

export type DrugCategory =
  | 'Antibiotic'
  | 'Antifungal'
  | 'Antiviral'
  | 'Anticonvulsant'
  | 'Cardiovascular'
  | 'Respiratory'
  | 'Analgesic & Sedation'
  | 'Electrolyte & Metabolic'
  | 'Vitamin & Supplement';

export const DRUG_CATEGORIES: DrugCategory[] = [
  'Antibiotic',
  'Antifungal',
  'Antiviral',
  'Anticonvulsant',
  'Cardiovascular',
  'Respiratory',
  'Analgesic & Sedation',
  'Electrolyte & Metabolic',
  'Vitamin & Supplement',
];

export interface DoseResult {
  dosePerKg: string;
  totalDose: string;
  interval: string;
  route: string;
  concentration: string;
  volumePerDose: string;
  basisNote: string;
  infusionNote?: string;
  maxDose?: string;
  warningNote?: string;
}

export interface LevelTable {
  title: string;
  columns: [string, string];
  rows: [string, string][];
}

export interface DoseAdjustmentRow {
  range: string;
  /** One action regardless of the current dosing frequency. */
  action?: string;
  /** Action if the current dosing frequency is q12h — use instead of `action` when the response genuinely depends on current frequency. */
  ifQ12h?: string;
  /** Action if the current dosing frequency is q8h. */
  ifQ8h?: string;
}

export interface DoseAdjustmentTable {
  title: string;
  targetRange: string;
  rows: DoseAdjustmentRow[];
}

export interface LevelGuidance {
  /** Rendered above the "Level Interpretation & Dose Adjustment" heading — e.g. a target/goal reference table. */
  targetTable?: LevelTable;
  formula?: string;
  formulaNote?: string;
  tables: LevelTable[];
  doseAdjustmentTables?: DoseAdjustmentTable[];
}

export interface NeonateDrug {
  id: string;
  name: string;
  brandName?: string;
  category: DrugCategory;
  indications: string[];
  administration: string;
  monitoring: string[];
  cautions: string[];
  references: string[];
  levelGuidance?: LevelGuidance;
  calculate: (weightKg: number, pmaWeeks: number, pnaDays: number) => DoseResult;
}

// ─── helpers ────────────────────────────────────────────────────────────────

const mL = (totalMg: number, mgPerMl: number) =>
  `${(totalMg / mgPerMl).toFixed(2)} mL`;

const infusionRate = (
  doseMin: number,
  doseMid: number,
  doseMax: number,
  weightKg: number,
  concMcgPerMl: number,
  unit = 'mcg/kg/min',
) => {
  const rate = (d: number) => ((d * weightKg * 60) / concMcgPerMl).toFixed(2);
  return `At ${doseMin} ${unit}: ${rate(doseMin)} mL/h | At ${doseMid} ${unit}: ${rate(doseMid)} mL/h | At ${doseMax} ${unit}: ${rate(doseMax)} mL/h`;
};

// ─── drug database ───────────────────────────────────────────────────────────

export const neonateDrugs: NeonateDrug[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // ANTIBIOTICS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'ampicillin',
    name: 'Ampicillin',
    category: 'Antibiotic',
    indications: ['Early-onset sepsis (with gentamicin)', 'GBS / Listeria cover', 'Meningitis (use 100 mg/kg/dose)'],
    administration: 'IV over 15–30 min. IM acceptable for non-meningitis dosing.',
    monitoring: ['Clinical response at 48–72 h', 'Renal function (adjust if impaired)', 'LFTs if > 7 days'],
    cautions: [
      'Meningitis dose: 100 mg/kg/dose (double the standard sepsis dose)',
      'Adjust interval for significant renal impairment',
      'Do not mix in same line as aminoglycosides',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      const dose = 50;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pma <= 29) {
        interval = pna <= 28 ? 'q12h' : 'q8h';
        basisNote = `PMA ≤ 29 wks, PNA ${pna <= 28 ? '≤ 28d' : '> 28d'}`;
      } else if (pma <= 36) {
        interval = pna <= 14 ? 'q12h' : 'q8h';
        basisNote = `PMA 30–36 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else if (pma <= 44) {
        interval = pna <= 7 ? 'q12h' : 'q6h';
        basisNote = `PMA 37–44 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q6h';
        basisNote = 'PMA ≥ 45 wks';
      }
      return {
        dosePerKg: '50 mg/kg',
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV / IM',
        concentration: '50 mg/mL',
        volumePerDose: mL(total, 50),
        basisNote,
        warningNote: 'Meningitis: use 100 mg/kg/dose instead.',
      };
    },
  },

  {
    id: 'gentamicin',
    name: 'Gentamicin',
    category: 'Antibiotic',
    indications: ['Early-onset sepsis (+ ampicillin)', 'Late-onset Gram-negative sepsis', 'GBS synergy'],
    administration: 'IV over 30 min. Do NOT give as bolus.',
    monitoring: [
      'Trough (pre-dose 3): target < 1 mg/L',
      'Peak (30 min post-dose 3): target 5–10 mg/L',
      'Serum creatinine before each dose if oliguric',
      'Hearing screen before discharge',
    ],
    cautions: [
      'Extended interval — do NOT shorten the interval to increase dose frequency',
      'Avoid concurrent nephrotoxins (ibuprofen, indomethacin, vancomycin if possible)',
      'Hold if oliguria (< 1 mL/kg/h) — discuss with consultant',
      'Ototoxic; cumulative toxicity with prolonged courses',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      let dose: number;
      let interval: string;
      let basisNote: string;
      if (pma < 29) {
        if (pna <= 7) { dose = 5; interval = 'q48h'; basisNote = 'PMA < 29 wks, PNA 0–7d'; }
        else if (pna <= 28) { dose = 4; interval = 'q36h'; basisNote = 'PMA < 29 wks, PNA 8–28d'; }
        else { dose = 4; interval = 'q24h'; basisNote = 'PMA < 29 wks, PNA ≥ 29d'; }
      } else if (pma <= 34) {
        if (pna <= 7) { dose = 4.5; interval = 'q36h'; basisNote = 'PMA 30–34 wks, PNA 0–7d'; }
        else { dose = 4; interval = 'q24h'; basisNote = 'PMA 30–34 wks, PNA > 7d'; }
      } else {
        dose = 4; interval = 'q24h'; basisNote = 'PMA ≥ 35 wks';
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg`,
        totalDose: `${total.toFixed(2)} mg`,
        interval,
        route: 'IV over 30 min',
        concentration: '10 mg/mL',
        volumePerDose: mL(total, 10),
        basisNote,
        warningNote: 'Extended interval dosing. Do not alter interval. Mandatory TDM.',
      };
    },
  },

  {
    id: 'vancomycin',
    name: 'Vancomycin',
    category: 'Antibiotic',
    indications: ['Late-onset sepsis (MRSA / CoNS)', 'Gram-positive meningitis', 'NEC with Gram-positive bacteraemia'],
    administration: 'IV over 60 min (max rate 10 mg/kg/h). Slower infusion if red man syndrome.',
    monitoring: [
      'Trough: draw just before the 4th dose at steady state, then repeat as clinically indicated — trough (not peak) is the standard efficacy measure in neonates',
      'If a peak is also needed: draw 60 min after the end of infusion',
      'Serum creatinine and urine output regularly — nephrotoxicity risk in neonates correlates with trough level (see cautions)',
      'FBC if course > 3 weeks (neutropenia risk with prolonged therapy)',
      'Auditory function monitoring if on concurrent ototoxic drugs (e.g. aminoglycosides)',
    ],
    cautions: [
      'See the trough target and action tables below — targets and adjustment steps differ for EMPIRICAL therapy vs CONFIRMED (blood-culture-positive) therapy. Take extra care not to mix the two tables up.',
      'Two alternative institutional protocols use different initial intervals/doses at the extremes: UNC Children\'s (2023) uses flat q12h regardless of PNA for PMA ≤29 wks and q8h (not q6h) for PMA ≥45 wks; KEMH (WA, Australia) uses a lower 10 mg/kg/dose (not 15) for corrected GA <30 wks and flat q8h for the whole 37–44 wk band. If your unit follows either, expect a different starting regimen than the one calculated here.',
      'Real neonatal nephrotoxicity signal: one prospective study (110 neonates) found acute kidney injury in 18.18% with trough > 15 mg/L, vs 0% at 10–15 mg/L, vs 1.38% at < 10 mg/L (p=0.04) — though other paediatric studies did not replicate this association, so treat "aim higher just in case" with real caution, not as automatically safe',
      'MIC > 2 mg/L (VISA/VRSA): vancomycin will NOT work regardless of dose or trough achieved — this needs an ID consult for an alternative agent, not a higher dose',
      'AUC-guided dosing (AUC/MIC target 400–600) is now the adult standard (ASHP/IDSA/PIDS/SIDP 2020), but that guideline explicitly excludes neonates due to insufficient data — trough remains the practical bedside mainstay at this age',
      'Red man syndrome (flushing, rash) — slow infusion, not a true allergy',
      'Nephrotoxic — avoid concurrent aminoglycosides if possible',
    ],
    references: ['Neofax 2020', 'KEMH (WA) Neonatal Medication Protocol: Vancomycin', 'UNC Children\'s Hospital Vancomycin Dosing & Monitoring Guide (Sep 2023)', 'ASHP/IDSA/PIDS/SIDP Vancomycin TDM guideline 2020', 'NNF 9th ed.'],
    levelGuidance: {
      targetTable: {
        title: 'Goal trough by therapy phase',
        columns: ['Phase / indication', 'Target trough'],
        rows: [
          ['Empirical therapy (pre-culture result)', '5–15 mg/L'],
          ['Confirmed CoNS / MRSA / staphylococcal / enterococcal / bacillus infection', '15–20 mg/L'],
        ],
      },
      tables: [
        {
          title: 'Renal impairment — after a single 10 mg/kg test dose, level at 12–24h',
          columns: ['Level result', 'Action'],
          rows: [
            ['Within goal', 'Consider re-dosing; repeat level in 12–24h'],
            ['Below goal', 'Consider maintaining the current dose and checking a level sooner (e.g. 8h instead of 12h); alternatively the dose may be increased at the same interval'],
            ['Above goal', 'Continue to hold; recheck level in a further 12–24h'],
          ],
        },
      ],
      doseAdjustmentTables: [
        {
          title: 'EMPIRICAL therapy — dose/frequency adjustment',
          targetRange: 'Target 5–15 mg/L',
          rows: [
            { range: '< 5 mg/L', ifQ12h: 'Same dose, shorten interval to q8h', ifQ8h: 'Increase dose by 50% (×1.5), keep frequency at q8h' },
            { range: '5–15 mg/L', action: 'No adjustment required' },
            { range: '16–20 mg/L', action: 'Check renal function; reduce dose by 30% (×0.7), keep frequency the same; repeat level in 24h' },
            { range: '> 20 mg/L', action: 'WITHHOLD further doses; consult microbiology/paediatric ID and pharmacy; repeat level 24h after the last dose' },
          ],
        },
        {
          title: 'CONFIRMED blood-culture-positive therapy — dose/frequency adjustment',
          targetRange: 'Target 15–20 mg/L',
          rows: [
            { range: '< 7 mg/L', ifQ12h: 'Same dose, shorten interval to q8h', ifQ8h: 'Increase dose by 75% (×1.75), keep frequency at q8h' },
            { range: '7–10 mg/L', ifQ12h: 'Same dose, shorten interval to q8h', ifQ8h: 'Increase dose by 60% (×1.6), keep frequency at q8h' },
            { range: '11–12 mg/L', action: 'Keep frequency the same; increase dose by 40% (×1.4)' },
            { range: '13–14 mg/L', action: 'Keep frequency the same; increase dose by 25% (×1.25)' },
            { range: '15–20 mg/L', action: 'No adjustment required' },
            { range: '21–22 mg/L', action: 'Continue current dose; check renal function; repeat level in 24h. Do NOT withhold unless renal function is worsening.' },
            { range: '23–25 mg/L', action: 'Check renal function; do NOT withhold unless renal function is worsening; reduce dose by 20% (×0.8), keep frequency; repeat level in 24h' },
            { range: '> 25 mg/L', action: 'WITHHOLD further doses; consult microbiology/paediatric ID; repeat level 24h after the last dose' },
          ],
        },
      ],
    },
    calculate: (weight, pma, pna) => {
      const dose = 15;
      let interval: string;
      let basisNote: string;
      if (pma <= 29) {
        interval = pna <= 14 ? 'q18h' : 'q12h';
        basisNote = `PMA ≤ 29 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else if (pma <= 36) {
        interval = pna <= 14 ? 'q12h' : 'q8h';
        basisNote = `PMA 30–36 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else if (pma <= 44) {
        interval = pna <= 7 ? 'q12h' : 'q8h';
        basisNote = `PMA 37–44 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q6h'; basisNote = 'PMA ≥ 45 wks';
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg`,
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV over 60 min',
        concentration: '5 mg/mL',
        volumePerDose: mL(total, 5),
        basisNote,
        warningNote: 'Starting dose only — check a trough before the 4th dose. See the trough target and action tables below for the goal by indication and what to do if the level is off-target.',
      };
    },
  },

  {
    id: 'teicoplanin',
    name: 'Teicoplanin',
    brandName: 'Targocid',
    category: 'Antibiotic',
    indications: ['Late-onset sepsis (MRSA / CoNS)', 'Gram-positive line infection', 'Alternative to vancomycin when renal-sparing / less frequent dosing preferred'],
    administration: 'IV bolus over 3–5 min or IM (both acceptable — unlike vancomycin, does NOT require a slow infusion). Reconstitute gently, avoid shaking (foams).',
    monitoring: ['Trough level before dose 4–5 (target > 10 mg/L uncomplicated; 15–20+ mg/L for endocarditis/deep-seated infection)', 'Renal function — dose-interval adjustment needed in impairment', 'FBC (rare neutropenia/thrombocytopenia with prolonged use)', 'Clinical response at 48–72 h'],
    cautions: [
      'NOT in the NeoFax (Micromedex) reference — teicoplanin is not FDA-approved/marketed in the US. Dosing below is per Targocid (Sanofi) official prescribing information, neonatal-specific line.',
      'NEONATAL regimen (this entry): a SINGLE loading dose of 16 mg/kg, then 8 mg/kg once daily from day 2 — do NOT repeat the loading dose q12h for neonates, that repeated-loading structure belongs to a different (older-child, different mg/kg) regimen below',
      'Children > 2 months (NOT this neonatal dose): moderate infection 10 mg/kg q12h ×3 doses then 6 mg/kg daily; severe infection/neutropenia 10 mg/kg q12h ×3 doses then 10 mg/kg daily',
      'Renally cleared — in renal impairment, dose reduction is not required until day 4 of treatment; from day 4: CrCl 40–60 mL/min → halve the dose (or double the interval); CrCl < 40 mL/min or dialysis → one-third of the dose (or triple the interval)',
      'Better tolerated than vancomycin: Red Man Syndrome is NOT a contraindication to teicoplanin even if it occurred with vancomycin — but caution with hypersensitivity to vancomycin, as cross-hypersensitivity can occur',
      'Thrombocytopenia risk, especially at higher-than-recommended doses — monitor FBC',
    ],
    references: ['Targocid (teicoplanin) Sanofi Abridged Prescribing Information, CCDS v1.2 (2003), updated Jan 2014'],
    calculate: (weight) => {
      const loadDose = 16;
      const maintDose = 8;
      const loadTotal = weight * loadDose;
      const maintTotal = weight * maintDose;
      const concMgPerMl = 66.7;
      return {
        dosePerKg: `Neonatal: Load ${loadDose} mg/kg (single dose, day 1) → Maintenance ${maintDose} mg/kg once daily (from day 2)`,
        totalDose: `Load: ${loadTotal.toFixed(1)} mg (single dose) | Maintenance: ${maintTotal.toFixed(1)} mg/dose`,
        interval: 'Load: single dose on day 1 only | Maintenance: q24h from day 2 onward',
        route: 'IV bolus over 3–5 min or IM',
        concentration: `~${concMgPerMl} mg/mL (200 mg vial reconstituted with 3 mL WFI — confirm against the vial size in stock)`,
        volumePerDose: `Load: ${mL(loadTotal, concMgPerMl)} | Maintenance: ${mL(maintTotal, concMgPerMl)}`,
        basisNote: 'Official neonatal regimen: single 16 mg/kg load, then 8 mg/kg q24h maintenance. This is NOT the same regimen as the older-child (>2 months) dosing.',
        warningNote: 'Do not repeat the 16 mg/kg load q12h for neonates — that applies to a different, older-child regimen at a different dose (10 mg/kg). Not cross-verified against NeoFax (not in that reference).',
      };
    },
  },

  {
    id: 'colistin',
    name: 'Colistin (Colistimethate Sodium)',
    brandName: 'Colistin/Norma, Colomycin',
    category: 'Antibiotic',
    indications: ['Multi-drug-resistant Gram-negative sepsis (e.g. Klebsiella, Acinetobacter) — reserve/last-line agent', 'Used in combination with at least one other antibiotic, not as monotherapy for MDR organisms'],
    administration: 'IV infusion over 30–60 min, or IM. Dosed in IU (International Units) of colistimethate sodium (CMS) — do NOT convert to mg for this entry; colistin mg-conversion factors (mg CMS vs mg colistin base activity) are inconsistent across references and are a recognised source of real dosing errors.',
    monitoring: ['Renal function — nephrotoxicity is dose-limiting, monitor creatinine and urine output closely', 'Serum potassium and magnesium (both tend to run low and often need supplementation)', 'Neurotoxicity signs (rare in neonates but reported)', 'Clinical + microbiological response — used alongside at least one other agent, not alone'],
    cautions: [
      'RESERVE AGENT — for confirmed or strongly suspected multi-drug-resistant Gram-negative infection, always in combination with another antibiotic',
      'Neonatal evidence base is limited: this dose (75,000 IU/kg/day) sits at the top of the range actually used in a neonatal outcomes study (50,000–75,000 IU/kg/day ÷ 3 doses, 18 neonates, 76% favourable outcome) and at the bottom of the general paediatric label range (75,000–150,000 IU/kg/day, NOT neonate-specific, from the manufacturer SmPC)',
      'No established loading dose for critically ill neonates — start at the maintenance dose',
      'No neonatal-specific renal-impairment dosing exists — if renal function is impaired, discuss with pharmacy/nephrology rather than extrapolating adult CrCl-based tables',
      'Aerosolised/nebulised colistin is a separate, unapproved-route regimen with different dosing — do NOT use this IV/IM dose for a nebulised order',
    ],
    references: ['Neofax 2020 (neonatal MDR-organism study citation)', 'Colistin/Norma SmPC (Norma Hellas) — general paediatric label range'],
    calculate: (weight) => {
      const dailyDose = 75000;
      const doseInterval = dailyDose / 3;
      const dailyTotal = weight * dailyDose;
      const doseTotal = weight * doseInterval;
      return {
        dosePerKg: `${doseInterval.toLocaleString()} IU/kg/dose q8h (= ${dailyDose.toLocaleString()} IU/kg/day)`,
        totalDose: `${doseTotal.toLocaleString()} IU/dose (${dailyTotal.toLocaleString()} IU/day total)`,
        interval: 'q8h (3 divided doses/day)',
        route: 'IV infusion over 30–60 min, or IM',
        concentration: 'Available as 1 million IU or 2 million IU vials — confirm vial strength before reconstituting',
        volumePerDose: 'Depends on vial strength and reconstitution volume in use — verify against the actual vial/pharmacy preparation',
        basisNote: '75,000 IU/kg/day ÷ 3 doses — chosen as the point where the neonatal-study range (50,000–75,000) and the general paediatric label range (75,000–150,000) meet.',
        maxDose: 'No neonatal-specific max established beyond this working dose — do not exceed without ID/pharmacy input',
        warningNote: 'Dosed in IU only — do not convert to mg for this entry, colistin unit conversions are a known source of real errors. Reserve for confirmed/suspected MDR Gram-negative infection, given with a second agent.',
      };
    },
  },

  {
    id: 'penicillin-g',
    name: 'Penicillin G (Benzylpenicillin)',
    category: 'Antibiotic',
    indications: ['GBS sepsis / meningitis', 'Congenital syphilis', 'Streptococcal infections'],
    administration: 'IV over 15–30 min. IM acceptable for sepsis.',
    monitoring: ['Clinical response', 'Renal function for prolonged courses'],
    cautions: [
      'GBS Meningitis: 150,000 units/kg/dose q8h (PNA ≤ 7d) or 125,000 units/kg/dose q6h (PNA ≥ 8d) — NOT the flat "100,000 units/kg q6h" figure',
      'Congenital syphilis: 50,000 units/kg/dose q12h for the first 7 days of life, then q8h, for a total of 10 days — dosing is PNA-dependent only, NOT PMA-dependent',
      'High doses: monitor sodium (large sodium load)',
    ],
    references: ['Neofax 2020', 'CDC Congenital Syphilis guidelines 2021'],
    calculate: (weight, pma, pna) => {
      const dose = 50000;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pma <= 29) {
        interval = pna <= 28 ? 'q12h' : 'q8h';
        basisNote = `PMA ≤ 29 wks, PNA ${pna <= 28 ? '≤ 28d' : '> 28d'}`;
      } else if (pma <= 36) {
        interval = pna <= 14 ? 'q12h' : 'q8h';
        basisNote = `PMA 30–36 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else if (pma <= 44) {
        interval = pna <= 7 ? 'q12h' : 'q6h';
        basisNote = `PMA 37–44 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q6h';
        basisNote = 'PMA ≥ 45 wks';
      }
      const totalMg = total / 1000;
      return {
        dosePerKg: '50,000 units/kg (= 30 mg/kg) — sepsis/GBS dosing shown here',
        totalDose: `${total.toLocaleString()} units (${totalMg.toFixed(0)} mg)`,
        interval,
        route: 'IV / IM',
        concentration: '600,000 units/mL (= 360 mg/mL)',
        volumePerDose: mL(totalMg, 360),
        basisNote,
        warningNote: 'Meningitis and syphilis use DIFFERENT dosing — see cautions, do not use the sepsis interval above for those indications.',
      };
    },
  },

  {
    id: 'piptazo',
    name: 'Piperacillin-Tazobactam',
    brandName: 'Tazocin',
    category: 'Antibiotic',
    indications: ['Late-onset sepsis with Gram-negative or mixed coverage', 'NEC (± metronidazole)', 'Hospital-acquired infection'],
    administration: 'IV over 30 min (or extended 4h infusion for resistant organisms).',
    monitoring: ['Clinical response at 48–72 h', 'Renal function', 'LFTs if > 7 days'],
    cautions: [
      'Dose as piperacillin component',
      'Use with metronidazole for confirmed/suspected anaerobic coverage',
      'Reserve for resistant organisms — de-escalate when sensitivities known',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      const dose = 100;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pma <= 29) {
        interval = pna <= 28 ? 'q12h' : 'q8h';
        basisNote = `PMA ≤ 29 wks, PNA ${pna <= 28 ? '≤ 28d' : '> 28d'}`;
      } else if (pma <= 36) {
        interval = pna <= 14 ? 'q12h' : 'q8h';
        basisNote = `PMA 30–36 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else if (pma <= 44) {
        interval = pna <= 7 ? 'q12h' : 'q8h';
        basisNote = `PMA 37–44 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q8h';
        basisNote = 'PMA ≥ 45 wks';
      }
      return {
        dosePerKg: '100 mg/kg (pip component)',
        totalDose: `${total.toFixed(0)} mg pip / ${(total / 8).toFixed(0)} mg tazo`,
        interval,
        route: 'IV over 30 min',
        concentration: '200 mg/mL pip (reconstituted)',
        volumePerDose: mL(total, 200),
        basisNote,
      };
    },
  },

  {
    id: 'meropenem',
    name: 'Meropenem',
    category: 'Antibiotic',
    indications: ['Resistant Gram-negative sepsis', 'Late-onset NEC', 'Meningitis (Gram-negative)'],
    administration: 'IV over 30 min (standard) or 4h extended infusion for resistant organisms.',
    monitoring: ['Renal function', 'Seizure risk at high doses (CNS penetration)', 'Culture sensitivity to guide de-escalation'],
    cautions: [
      'Meningitis dose: 40 mg/kg/dose',
      'Reserve for resistant organisms (carbapenem stewardship)',
      'Seizure risk — avoid if CNS pathology where possible',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      let dose: number;
      let interval: string;
      let basisNote: string;
      if (pma < 32) {
        dose = 20;
        interval = pna < 14 ? 'q12h' : 'q8h';
        basisNote = `PMA < 32 wks, PNA ${pna < 14 ? '< 14d' : '≥ 14d'}`;
      } else {
        if (pna < 14) { dose = 20; interval = 'q8h'; basisNote = 'PMA ≥ 32 wks, PNA < 14d'; }
        else { dose = 30; interval = 'q8h'; basisNote = 'PMA ≥ 32 wks, PNA ≥ 14d'; }
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg`,
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV over 30 min',
        concentration: '50 mg/mL (reconstituted)',
        volumePerDose: mL(total, 50),
        basisNote,
        warningNote: 'Meningitis: 40 mg/kg/dose at the same age-specific interval shown above. Confirm carbapenem indication before use.',
      };
    },
  },

  {
    id: 'cefotaxime',
    name: 'Cefotaxime',
    category: 'Antibiotic',
    indications: ['Neonatal meningitis (with ampicillin)', 'Gram-negative sepsis', 'UTI'],
    administration: 'IV over 15–30 min. IM acceptable.',
    monitoring: ['Renal function', 'Clinical response', 'LFTs if prolonged course'],
    cautions: [
      'Preferred 3rd-gen cephalosporin for neonatal meningitis over ceftriaxone (no bilirubin displacement)',
      'Do NOT use ceftriaxone in neonates < 28 days',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      const dose = 50;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pna < 7) {
        interval = 'q12h'; basisNote = `PNA < 7d (all gestational ages), PMA ${pma} wks`;
      } else if (pma < 32) {
        interval = 'q8h'; basisNote = `PMA < 32 wks, PNA ≥ 7d`;
      } else {
        interval = 'q6h'; basisNote = `PMA ≥ 32 wks, PNA ≥ 7d`;
      }
      return {
        dosePerKg: '50 mg/kg',
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV / IM',
        concentration: '100 mg/mL (reconstituted)',
        volumePerDose: mL(total, 100),
        basisNote,
        warningNote: 'Never use ceftriaxone in neonates < 28 days (bilirubin displacement).',
      };
    },
  },

  {
    id: 'metronidazole',
    name: 'Metronidazole',
    category: 'Antibiotic',
    indications: ['NEC (anaerobic cover)', 'Clostridium infection', 'Intra-abdominal sepsis'],
    administration: 'IV over 30 min. PO / per NGT acceptable once enteral route established.',
    monitoring: ['Hepatic function if prolonged course', 'Neurological: seizures at high doses'],
    cautions: [
      'Avoid prolonged courses > 7–10 days if possible',
      'Can cause peripheral neuropathy and seizures at high doses',
    ],
    references: ['NNF 9th ed. (2024)', 'Neofax 2020'],
    calculate: (weight, pma) => {
      const loadDose = 15;
      let maintDose: number;
      let interval: string;
      let basisNote: string;
      if (pma <= 25) {
        maintDose = 7.5; interval = 'q24h'; basisNote = 'PMA 24–25 wks';
      } else if (pma <= 27) {
        maintDose = 10; interval = 'q24h'; basisNote = 'PMA 26–27 wks';
      } else if (pma <= 33) {
        maintDose = 7.5; interval = 'q12h'; basisNote = 'PMA 28–33 wks';
      } else if (pma <= 40) {
        maintDose = 7.5; interval = 'q8h'; basisNote = 'PMA 34–40 wks';
      } else {
        maintDose = 7.5; interval = 'q6h'; basisNote = 'PMA > 40 wks';
      }
      const loadTotal = weight * loadDose;
      const maintTotal = weight * maintDose;
      return {
        dosePerKg: `Load: ${loadDose} mg/kg → Maintenance: ${maintDose} mg/kg`,
        totalDose: `Load: ${loadTotal.toFixed(1)} mg → Maintenance: ${maintTotal.toFixed(1)} mg`,
        interval: `Maintenance starts one full interval after load (${interval})`,
        route: 'IV over 30 min (or PO/NGT once enteral)',
        concentration: '5 mg/mL',
        volumePerDose: `Load: ${mL(loadTotal, 5)} → Maintenance: ${mL(maintTotal, 5)}`,
        basisNote,
        warningNote: 'Always give the 15 mg/kg loading dose first — do not start at the maintenance dose.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANTIFUNGALS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'fluconazole',
    name: 'Fluconazole',
    category: 'Antifungal',
    indications: ['Invasive candidiasis (treatment)', 'Prophylaxis in VLBW < 1000 g or < 28 wks'],
    administration: 'IV over 30 min or PO once daily.',
    monitoring: ['LFTs weekly during treatment', 'Clinical response and serial cultures at 48–72 h'],
    cautions: [
      'Prophylaxis dose: 3–6 mg/kg TWICE WEEKLY for 6 weeks (NOT daily, NOT PMA-tiered)',
      'Treatment dose: 12 mg/kg loading, then 12 mg/kg maintenance — interval is PMA/PNA-dependent (see below)',
      'Drug interactions: increases levels of many drugs via CYP2C9/3A4',
      'QT prolongation risk — check concurrent drugs',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      const loadDose = 12;
      const maintDose = 12;
      const total = weight * loadDose;
      let interval: string;
      let basisNote: string;
      if (pma <= 29) {
        interval = pna <= 14 ? 'q48h' : 'q24h';
        basisNote = `PMA ≤ 29 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else {
        interval = pna <= 7 ? 'q48h' : 'q24h';
        basisNote = `PMA ≥ 30 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      }
      return {
        dosePerKg: `Treatment — Loading: ${loadDose} mg/kg → Maintenance: ${maintDose} mg/kg`,
        totalDose: `Loading: ${total.toFixed(0)} mg → Maintenance: ${(weight * maintDose).toFixed(0)} mg`,
        interval,
        route: 'IV / PO',
        concentration: '2 mg/mL (IV)',
        volumePerDose: `Loading: ${mL(total, 2)} | Maintenance: ${mL(weight * maintDose, 2)}`,
        basisNote,
        warningNote: 'This is treatment dosing. Prophylaxis is a separate, lower regimen (3–6 mg/kg twice weekly) — see cautions.',
      };
    },
  },

  {
    id: 'amphotericin-b-liposomal',
    name: 'Amphotericin B Liposomal',
    brandName: 'AmBisome',
    category: 'Antifungal',
    indications: ['Invasive candidiasis resistant to fluconazole', 'Aspergillosis', 'CNS candidiasis'],
    administration: 'IV over 2 hours. Use in-line filter (1.2 mcm). Do not mix with saline.',
    monitoring: ['Renal function (creatinine, electrolytes) every 48–72 h', 'Potassium, magnesium — supplement aggressively', 'LFTs weekly'],
    cautions: [
      'Liposomal form (AmBisome) — NOT interchangeable with conventional amphotericin B',
      'Hypokalaemia and hypomagnesaemia are common — pre-empt with supplements',
      'Infusion reactions: fever, rigors (less common with liposomal form)',
      'Reconstitute only with sterile water; flush line with D5W',
    ],
    references: ['ESCMID neonatal invasive candidiasis guidelines', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const dose = 3;
      const total = weight * dose;
      return {
        dosePerKg: '3–5 mg/kg',
        totalDose: `${total.toFixed(0)} mg (at 3 mg/kg starting dose)`,
        interval: 'q24h',
        route: 'IV over 2 hours (1.2 mcm filter)',
        concentration: '2 mg/mL (after reconstitution + dilution)',
        volumePerDose: mL(total, 2),
        basisNote: 'Standard starting dose; titrate to 5 mg/kg for CNS disease',
        warningNote: 'Liposomal only — NOT conventional AmB. Flush with D5W not saline.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANTIVIRALS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'aciclovir',
    name: 'Aciclovir',
    category: 'Antiviral',
    indications: ['Neonatal HSV (disseminated / CNS / SEM)', 'Empiric cover for encephalitis pending HSV PCR'],
    administration: 'IV over 1 hour. Ensure adequate hydration (at least 2 mL/kg/h) to prevent crystalluria.',
    monitoring: ['Renal function — creatinine and urine output daily', 'Neutrophil count (can cause neutropaenia)', 'Ensure IV line not infiltrated (highly irritant)'],
    cautions: [
      'Disseminated / CNS HSV: 20 mg/kg × 21 days',
      'SEM (skin/eye/mouth) HSV: 20 mg/kg × 14 days',
      'PMA < 30 wks: q12h (not q8h) — renal/CNS immaturity',
      'Renal failure: increase interval further (q12h or q24h) — dose unchanged',
      'Crystalluria with rapid infusion or poor hydration',
    ],
    references: ['Neofax 2020', 'AAP Red Book 2024'],
    calculate: (weight, pma) => {
      const dose = 20;
      const total = weight * dose;
      const interval = pma < 30 ? 'q12h' : 'q8h';
      const basisNote = pma < 30 ? 'PMA < 30 wks' : 'PMA ≥ 30 wks';
      return {
        dosePerKg: '20 mg/kg',
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV over 1 hour',
        concentration: '5 mg/mL (standard dilution)',
        volumePerDose: mL(total, 5),
        basisNote: `${basisNote}. Disseminated/CNS: × 21 days | SEM: × 14 days`,
        warningNote: 'Ensure hydration ≥ 2 mL/kg/h. Renally cleared — adjust interval further if AKI.',
      };
    },
  },

  {
    id: 'ganciclovir',
    name: 'Ganciclovir',
    category: 'Antiviral',
    indications: ['Symptomatic congenital CMV (CNS disease, hearing loss)'],
    administration: 'IV over 1 hour.',
    monitoring: ['FBC twice weekly (neutropenia!)', 'Renal function', 'CMV PCR at 6 weeks to assess response', 'Hearing and ophthalmology follow-up'],
    cautions: [
      'Myelosuppressive — withhold if ANC < 500/mm³ or platelets < 25,000/mm³',
      'Duration: 6 weeks (switch to oral valganciclovir 16 mg/kg/dose PO q12h for extended therapy)',
      'Teratogenic / carcinogenic — handle with care; only nursing staff with no pregnancy risk',
    ],
    references: ['Kimberlin et al. NEJM 2015', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const dose = 6;
      const total = weight * dose;
      return {
        dosePerKg: '6 mg/kg',
        totalDose: `${total.toFixed(1)} mg`,
        interval: 'q12h × 6 weeks',
        route: 'IV over 1 hour',
        concentration: '5 mg/mL (reconstituted)',
        volumePerDose: mL(total, 5),
        basisNote: 'Symptomatic congenital CMV with CNS involvement or hearing loss',
        warningNote: 'Monitor ANC twice weekly — hold if ANC < 500. Cytotoxic — handle safely.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANTICONVULSANTS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'phenobarbital',
    name: 'Phenobarbital',
    brandName: 'Phenobarbitone',
    category: 'Anticonvulsant',
    indications: ['Neonatal seizures (first-line)', 'HIE seizure prophylaxis'],
    administration: 'IV loading: over 20–30 min. Maintenance: IV or PO once daily.',
    monitoring: ['Serum level 20–40 mg/L (therapeutic)', 'Respiratory depression — have resuscitation ready', 'Sedation level'],
    cautions: [
      'Loading dose 20 mg/kg IV; can repeat 10 mg/kg × 2 (max cumulative 40 mg/kg)',
      'Maintenance: 3–5 mg/kg/day — start 12 h after loading (24 h if weight < 1500 g)',
      'Respiratory depression risk — have bag/mask ready for loading dose',
      'Half-life very long in neonates (60–100 h)',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const loadDose = 20;
      const maintDose = 4;
      const loadTotal = weight * loadDose;
      const maintTotal = weight * maintDose;
      const maintStart = weight < 1.5 ? '24 h' : '12 h';
      return {
        dosePerKg: `Load: ${loadDose} mg/kg | Maintenance: 3–5 mg/kg/day`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg | Maintenance: ${maintTotal.toFixed(1)} mg/day`,
        interval: `Load: single dose (repeat 10 mg/kg × 2 if needed) | Maintenance: q24h, starting ${maintStart} after load`,
        route: 'IV over 20–30 min',
        concentration: '15 mg/mL',
        volumePerDose: `Load: ${mL(loadTotal, 15)} | Maintenance: ${mL(maintTotal, 15)}`,
        basisNote: `Cumulative max load: 40 mg/kg. Maintenance starts ${maintStart} after load (< 1500 g uses 24 h, ≥ 1500 g uses 12 h).`,
        warningNote: 'Respiratory depression risk with loading. Resuscitation ready.',
      };
    },
  },

  {
    id: 'levetiracetam',
    name: 'Levetiracetam',
    brandName: 'Keppra',
    category: 'Anticonvulsant',
    indications: ['Neonatal seizures (second-line or adjunct to phenobarbital)', 'Seizures refractory to phenobarbital'],
    administration: 'IV over 15 min.',
    monitoring: ['Clinical seizure control + aEEG/EEG', 'Renal function (dose-adjust if impaired)'],
    cautions: [
      'Evidence is retrospective/observational, not RCT-based — reported loading doses range 20–150 mg/kg/day (divided), typical single load ~40–50 mg/kg',
      'Maintenance: typical effective range 41.7–65 mg/kg/day, upper range reports up to ~100–106 mg/kg/day — given q12h. Do NOT anchor below ~20 mg/kg/dose q12h; that is below the typical effective range.',
      'Dilute to 5–15 mg/mL for IV infusion (NOT 100 mg/mL undiluted)',
      'Better tolerability than phenobarbital (less sedation/respiratory depression)',
      'Renally excreted — increase interval if oliguria or AKI',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const loadDose = 40;
      const maintLow = 20;
      const maintHigh = 50;
      const loadTotal = weight * loadDose;
      const maintLowTotal = weight * maintLow;
      const maintHighTotal = weight * maintHigh;
      return {
        dosePerKg: `Load: ${loadDose} mg/kg (range 20–50) | Maintenance: ${maintLow}–${maintHigh} mg/kg/dose q12h`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg | Maintenance: ${maintLowTotal.toFixed(0)}–${maintHighTotal.toFixed(0)} mg/dose`,
        interval: 'Load: single dose | Maintenance: q12h',
        route: 'IV over 15 min, diluted to 5–15 mg/mL',
        concentration: 'Dilute to 5–15 mg/mL (from 100 mg/mL stock) with NaCl 0.9% or D5W',
        volumePerDose: `Load: ${mL(loadTotal, 10)} (at 10 mg/mL dilution) | Maintenance: ${mL(maintLowTotal, 10)}–${mL(maintHighTotal, 10)} (at 10 mg/mL)`,
        basisNote: `Start maintenance at ${maintLow} mg/kg/dose q12h — titrate up to ${maintHigh} mg/kg/dose q12h based on EEG response`,
      };
    },
  },

  {
    id: 'midazolam-seizure',
    name: 'Midazolam (Seizures)',
    category: 'Anticonvulsant',
    indications: ['Refractory neonatal seizures (third-line)', 'Status epilepticus'],
    administration: 'Bolus: slow IV push over 2–3 min. Infusion: continuous IV via syringe driver.',
    monitoring: ['Continuous SpO₂ and respiratory rate', 'BP (hypotension risk)', 'EEG monitoring'],
    cautions: [
      'Respiratory depression — have resuscitation ready',
      'Hypotension — have volume and dopamine available',
      'Infusion accumulates with prolonged use (fat-soluble); tolerance may develop, requiring dose increase after several days',
      'Anticonvulsant loading dose: 0.15 mg/kg IV. Maintenance infusion: 0.06–0.4 mg/kg/h (1–7 mcg/kg/min) — do not cap below 0.4 mg/kg/h for refractory seizures',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const bolusDose = 0.15;
      const infMinDose = 0.06;
      const infMaxDose = 0.4;
      const bolusTotal = weight * bolusDose;
      const infConcMgPerMl = 1;
      const infMinRate = (infMinDose * weight) / infConcMgPerMl;
      const infMaxRate = (infMaxDose * weight) / infConcMgPerMl;
      return {
        dosePerKg: `Loading: 0.15 mg/kg | Maintenance infusion: 0.06–0.4 mg/kg/h`,
        totalDose: `Loading: ${bolusTotal.toFixed(2)} mg | Infusion: ${(weight * infMinDose).toFixed(3)}–${(weight * infMaxDose).toFixed(3)} mg/h`,
        interval: 'Loading: single IV dose over 10 min | Infusion: continuous',
        route: 'IV',
        concentration: '1 mg/mL standard (dilute to 0.5 mg/mL for continuous infusion)',
        volumePerDose: `Loading: ${mL(bolusTotal, 1)} | Infusion: ${infMinRate.toFixed(2)}–${infMaxRate.toFixed(2)} mL/h`,
        basisNote: 'Third-line for refractory seizures after phenobarbital ± levetiracetam',
        warningNote: 'Respiratory depression and hypotension — close monitoring mandatory.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CARDIOVASCULAR
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'dopamine',
    name: 'Dopamine',
    category: 'Cardiovascular',
    indications: ['Neonatal hypotension / shock', 'Low cardiac output', 'Post-operative cardiovascular support'],
    administration: 'Continuous IV infusion via central or reliable peripheral line. Titrate to response.',
    monitoring: ['Continuous BP (arterial line preferred)', 'HR, SpO₂, capillary refill', 'Urine output', 'Site for extravasation (peripheral)'],
    cautions: [
      'Extravasation causes tissue necrosis — use central line if possible; if peripheral, check site frequently',
      'Tachycardia / arrhythmia at high doses — reduce dose',
      'High doses (> 10–15 mcg/kg/min) cause vasoconstriction — may worsen peripheral perfusion',
    ],
    references: ['NNF 9th ed. (2024)', 'Neofax 2023'],
    calculate: (weight) => {
      const concMcgPerMl = 800;
      return {
        dosePerKg: '2–20 mcg/kg/min (usual: 5–10 mcg/kg/min)',
        totalDose: `Start: ${(5 * weight).toFixed(0)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'Central IV preferred (peripheral acceptable short-term)',
        concentration: `${concMcgPerMl} mcg/mL (standard: 40 mg in 50 mL NaCl 0.9%)`,
        volumePerDose: '—',
        basisNote: 'Low 2–5 mcg/kg/min | Mid 5–10 mcg/kg/min | High > 10 mcg/kg/min',
        infusionNote: infusionRate(5, 10, 15, weight, concMcgPerMl),
        warningNote: 'Central line preferred — extravasation causes necrosis. Titrate to MAP target.',
      };
    },
  },

  {
    id: 'dobutamine',
    name: 'Dobutamine',
    category: 'Cardiovascular',
    indications: ['Cardiogenic shock / low cardiac output', 'Myocardial dysfunction', 'PPHN with RV failure'],
    administration: 'Continuous IV infusion via central or peripheral line.',
    monitoring: ['Continuous ECG + SpO₂', 'BP (may drop — dobutamine is a vasodilator)', 'Echo for cardiac output assessment if available'],
    cautions: [
      'Can LOWER BP due to vasodilation — use with dopamine or volume if hypotensive',
      'Tachycardia and arrhythmia at high doses',
      'Inotrope, not a vasopressor — combine with dopamine for hypotension',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const concMcgPerMl = 800;
      return {
        dosePerKg: '2–25 mcg/kg/min',
        totalDose: `Start: ${(5 * weight).toFixed(0)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'IV (central or peripheral)',
        concentration: `${concMcgPerMl} mcg/mL (40 mg in 50 mL D5W)`,
        volumePerDose: '—',
        basisNote: 'Primarily inotropic — may drop BP via vasodilation',
        infusionNote: infusionRate(2, 10, 25, weight, concMcgPerMl),
        warningNote: 'May lower BP — combine with dopamine if hypotensive. Confirm on echo.',
      };
    },
  },

  {
    id: 'epinephrine',
    name: 'Epinephrine (Adrenaline)',
    category: 'Cardiovascular',
    indications: ['Cardiac arrest (NRP)', 'Refractory shock / vasodilatory shock', 'Anaphylaxis'],
    administration: 'Arrest: rapid IV/IO. Infusion: continuous IV via central line.',
    monitoring: ['Continuous ECG', 'Arterial line for BP during infusion', 'Lactate (tissue perfusion)'],
    cautions: [
      'NRP cardiac arrest: 0.01–0.03 mg/kg IV (0.1–0.3 mL/kg of 1:10,000) q3–5 min',
      'Low-dose option for hypotension/bradycardia SHORT of arrest: 1 mcg/kg (0.001 mg/kg) — much lower than the arrest dose',
      'ET route not recommended (unreliable absorption)',
      'Peripheral infusion risk: extravasation causes severe necrosis',
      'High doses cause tachyarrhythmia and hypertension',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const arrestDose = 0.01;
      const arrestTotal = weight * arrestDose;
      const lowDoseTotal = weight * 0.001;
      const concMcgPerMl = 20;
      return {
        dosePerKg: 'Arrest: 0.01–0.03 mg/kg | Low-dose (hypotension/bradycardia): 1 mcg/kg | Infusion: 0.1–1 mcg/kg/min',
        totalDose: `Arrest: ${arrestTotal.toFixed(3)}–${(weight * 0.03).toFixed(3)} mg | Low-dose: ${lowDoseTotal.toFixed(4)} mg (1 mcg/kg) | Infusion: ${(0.1 * weight).toFixed(3)}–${(1 * weight).toFixed(2)} mcg/min`,
        interval: 'Arrest: q3–5 min | Infusion: continuous',
        route: 'IV/IO (arrest); Central IV (infusion)',
        concentration: 'Arrest: 1:10,000 (0.1 mg/mL) | Infusion: 20 mcg/mL standard',
        volumePerDose: `Arrest (1:10,000): ${mL(arrestTotal, 0.1)} per dose | Low-dose: ${mL(lowDoseTotal, 0.1)}`,
        basisNote: 'Arrest: IV preferred; ETT not recommended. A separate 1 mcg/kg low dose exists for hypotension/bradycardia short of arrest.',
        infusionNote: infusionRate(0.1, 0.5, 1, weight, concMcgPerMl),
        warningNote: 'Central line mandatory for infusion. Extravasation → severe necrosis.',
      };
    },
  },

  {
    id: 'milrinone',
    name: 'Milrinone',
    category: 'Cardiovascular',
    indications: ['Low cardiac output (post-cardiac surgery or myocarditis)', 'PPHN with RV dysfunction', 'Refractory cardiogenic shock'],
    administration: 'Continuous IV infusion. Loading dose optional — increases hypotension risk.',
    monitoring: ['Continuous BP', 'HR and rhythm (ECG)', 'Urine output and renal function', 'Echo to assess response'],
    cautions: [
      'Phosphodiesterase-3 inhibitor: positive inotropy + vasodilation (lusitropy)',
      'Hypotension is common — ensure adequate volume first',
      'Renally cleared — reduce dose in AKI',
      'Loading dose (if used): 50 mcg/kg over 15 min, or 75 mcg/kg over 60 min — risks severe hypotension, often omitted in neonates',
    ],
    references: ['Neofax 2020', 'Bassler et al. NEJM 2015'],
    calculate: (weight) => {
      const concMcgPerMl = 200;
      return {
        dosePerKg: '0.3–0.75 mcg/kg/min (usual start: 0.33 mcg/kg/min)',
        totalDose: `Start: ${(0.33 * weight).toFixed(3)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'Central IV preferred',
        concentration: `${concMcgPerMl} mcg/mL (10 mg in 50 mL D5W)`,
        volumePerDose: '—',
        basisNote: 'PDE-3 inhibitor — inotropy + vasodilation (lusitropy)',
        infusionNote: infusionRate(0.3, 0.5, 0.75, weight, concMcgPerMl),
        warningNote: 'Hypotension risk — volume-load before starting. Reduce dose in AKI.',
      };
    },
  },

  {
    id: 'pge1',
    name: 'Prostaglandin E1 (Alprostadil)',
    brandName: 'Prostin VR / Prostaglandin E1',
    category: 'Cardiovascular',
    indications: ['Duct-dependent congenital heart disease (maintain PDA)', 'Critical coarctation', 'Pulmonary atresia / critical pulmonic stenosis'],
    administration: 'Continuous IV infusion via central venous access. Mix in NaCl 0.9% or D5W.',
    monitoring: ['SpO₂ pre- and post-ductal', 'BP and perfusion', 'Respiratory rate and apnoea (major side effect)', 'Temperature (fever common)'],
    cautions: [
      'Apnoea in ~10–12% — intubation equipment at bedside before starting',
      'Fever: common, may mask sepsis — cover empirically while starting PGE1',
      'Reduce to lowest effective dose once duct confirmed open (0.01 mcg/kg/min)',
      'Seizures, hypotension, flushing — all PGE1 side effects',
    ],
    references: ['NNF 9th ed. (2024)', 'ESC/AEPC CHD guidelines 2020'],
    calculate: (weight) => {
      const concNgPerMl = 20000;
      const concMcgPerMl = 20;
      return {
        dosePerKg: 'Start 0.05–0.1 mcg/kg/min → wean to 0.01–0.025 mcg/kg/min',
        totalDose: `Start: ${(0.05 * weight).toFixed(4)}–${(0.1 * weight).toFixed(4)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'Central IV (peripheral only if no alternative)',
        concentration: '20 mcg/mL (500 mcg in 25 mL NaCl 0.9%)',
        volumePerDose: '—',
        basisNote: 'Start high → confirm duct open → wean to 0.01 mcg/kg/min',
        infusionNote: `At 0.05 mcg/kg/min: ${((0.05 * weight * 60) / concMcgPerMl).toFixed(2)} mL/h | At 0.025 mcg/kg/min: ${((0.025 * weight * 60) / concMcgPerMl).toFixed(2)} mL/h | At 0.01 mcg/kg/min: ${((0.01 * weight * 60) / concMcgPerMl).toFixed(2)} mL/h`,
        warningNote: 'APNOEA in ~12% — resuscitation equipment MUST be at bedside before first dose.',
      };
    },
  },

  {
    id: 'adenosine',
    name: 'Adenosine',
    category: 'Cardiovascular',
    indications: ['Neonatal SVT (termination)'],
    administration: 'Rapid IV/IO push over 1–2 sec via largest most proximal vein, followed immediately by 5–10 mL saline flush.',
    monitoring: ['Continuous ECG during administration', 'BP'],
    cautions: [
      'Half-life < 10 seconds — must flush immediately after dose',
      'Transient AV block and asystole expected — resolves rapidly',
      'If no response: increase by 50 mcg/kg (0.05 mg/kg) increments q2min; max 250 mcg/kg (0.25 mg/kg)',
      'Contraindicated in WPW with atrial fibrillation (may precipitate VF)',
    ],
    references: ['Neofax 2020', 'PALS 2020 guidelines'],
    calculate: (weight) => {
      const dose1 = 0.05;
      const dose2 = 0.1;
      const dose3 = 0.15;
      const total1 = weight * dose1;
      return {
        dosePerKg: '0.05 mg/kg (50 mcg/kg) start → +0.05 mg/kg increments q2min → max 0.25 mg/kg',
        totalDose: `1st dose: ${total1.toFixed(2)} mg | 2nd: ${(weight * dose2).toFixed(2)} mg | 3rd: ${(weight * dose3).toFixed(2)} mg`,
        interval: 'Repeat q2min if no conversion (0.05 mg/kg increments)',
        route: 'Rapid IV/IO push (1–2 sec) — flush immediately with 5–10 mL saline',
        concentration: '3 mg/mL (undiluted) or dilute 1 mL (3 mg) + 9 mL NS = 0.3 mg/mL for small volumes',
        volumePerDose: `1st dose: ${mL(total1, 3)} (undiluted) | or ${mL(total1, 0.3)} (diluted 0.3 mg/mL)`,
        basisNote: 'Must be proximal vein + immediate saline flush',
        maxDose: '0.25 mg/kg (250 mcg/kg) per dose',
        warningNote: 'Transient asystole is expected and brief. ECG monitoring mandatory.',
      };
    },
  },

  {
    id: 'hydrocortisone',
    name: 'Hydrocortisone',
    category: 'Cardiovascular',
    indications: ['Vasopressor-refractory hypotension', 'Adrenal insufficiency', 'Chronic lung disease (BPD) weaning'],
    administration: 'IV over 5–15 min (stress/emergency) or infusion. PO for physiologic dosing.',
    monitoring: ['BP response within 1–2 h', 'Blood glucose (hyperglycaemia)', 'Electrolytes (Na, K)', 'BP overshoot / hypertension'],
    cautions: [
      'Stress/vasopressor-refractory shock: 1 mg/kg/dose q8h — aim to wean vasopressors',
      'Physiologic adrenal insufficiency: 7–9 mg/m²/day divided q8h',
      'BPD prevention taper protocol (distinct from stress dosing): 0.5 mg/kg/dose q12h × 12 days → 0.25 mg/kg/dose q12h × 3 days, then stop',
      'Risk of spontaneous intestinal perforation with concurrent indomethacin',
    ],
    references: ['Neofax 2020', 'Subhedar et al. Cochrane 2023'],
    calculate: (weight) => {
      const stressDose = weight * 1;
      const bpdHigh = weight * 0.5;
      const bpdLow = weight * 0.25;
      return {
        dosePerKg: 'Stress/shock: 1 mg/kg/dose q8h | BPD taper: 0.5 → 0.25 mg/kg/dose q12h (see basisNote)',
        totalDose: `Stress: ${stressDose.toFixed(2)} mg/dose | BPD taper days 1–12: ${bpdHigh.toFixed(2)} mg/dose | days 13–15: ${bpdLow.toFixed(2)} mg/dose`,
        interval: 'Stress: q8h | BPD taper: q12h throughout | Physiologic: q8h',
        route: 'IV over 5–15 min',
        concentration: '50 mg/mL (reconstituted)',
        volumePerDose: `Stress: ${mL(stressDose, 50)} | BPD taper: ${mL(bpdHigh, 50)} then ${mL(bpdLow, 50)}`,
        basisNote: 'Shock: 1 mg/kg q8h | Adrenal insufficiency: 7–9 mg/m²/day q8h | BPD prevention: 0.5 mg/kg q12h ×12d → 0.25 mg/kg q12h ×3d',
        warningNote: 'Risk of intestinal perforation with concurrent NSAIDs (indomethacin). BPD taper is a distinct protocol from stress dosing — do not conflate the two.',
      };
    },
  },

  {
    id: 'ibuprofen-pda',
    name: 'Ibuprofen (PDA closure)',
    category: 'Cardiovascular',
    indications: ['Hemodynamically significant PDA in preterm infants'],
    administration: 'IV over 15 min (IV-ibuprofen lysine). PO also effective when enteral feeding tolerated.',
    monitoring: ['Urine output (oliguria is common — ensure euvolaemia)', 'Serum creatinine before each dose', 'Platelet count', 'Clinical signs of PDA (pulses, murmur, echo at 48 h)'],
    cautions: [
      '3-dose course: 10 mg/kg day 1 → 5 mg/kg day 2 → 5 mg/kg day 3',
      'Hold if: oliguria < 0.6 mL/kg/h, creatinine rising, platelets < 60,000, bleeding, NEC',
      'Do not use if pulmonary hypertension (may worsen)',
      'Avoid in renal failure, active bleeding, or thrombocytopenia',
    ],
    references: ['European Consensus Guidelines on RDS 2022', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const d1 = weight * 10;
      const d2 = weight * 5;
      return {
        dosePerKg: 'Day 1: 10 mg/kg | Days 2–3: 5 mg/kg',
        totalDose: `Day 1: ${d1.toFixed(0)} mg | Days 2–3: ${d2.toFixed(0)} mg each`,
        interval: '24-hourly × 3 doses',
        route: 'IV over 15 min (or PO if enteral tolerated)',
        concentration: '5 mg/mL (IV ibuprofen lysine)',
        volumePerDose: `Day 1: ${mL(d1, 5)} | Days 2–3: ${mL(d2, 5)} each`,
        basisNote: 'Check urine output, creatinine, and platelets before each dose',
        warningNote: 'Withhold if UO < 0.6 mL/kg/h or creatinine rising. Check for PPHN first.',
      };
    },
  },

  {
    id: 'indomethacin-pda',
    name: 'Indomethacin (PDA closure)',
    category: 'Cardiovascular',
    indications: ['Hemodynamically significant PDA in preterm infants', 'Prophylactic PDA treatment (selected ELBW infants)'],
    administration: 'IV over 20–30 min. Do not give IM. Do not give rapidly.',
    monitoring: ['Urine output (oliguria transient but common)', 'Creatinine before each dose', 'Platelet count', 'Stool for blood (GI risk)', 'Echo at 48 h post-course'],
    cautions: [
      'PNA-based dosing — see dose table below',
      'Hold if: oliguria < 0.6 mL/kg/h, creatinine rising, GI bleeding, IVH grade III-IV, NEC, thrombocytopenia',
      'Concurrent hydrocortisone → risk of spontaneous intestinal perforation',
      'Cerebrovascular: reduces cerebral blood flow transiently',
    ],
    references: ['European Consensus Guidelines on RDS 2022', 'NNF 9th ed. (2024)'],
    calculate: (weight, _pma, pna) => {
      let d1: number, d2d3: number, basisNote: string;
      if (pna < 2) {
        d1 = 0.2; d2d3 = 0.1;
        basisNote = 'PNA < 48 h: 0.2 / 0.1 / 0.1 mg/kg';
      } else if (pna <= 7) {
        d1 = 0.2; d2d3 = 0.2;
        basisNote = 'PNA 2–7 days: 0.2 / 0.2 / 0.2 mg/kg';
      } else {
        d1 = 0.2; d2d3 = 0.25;
        basisNote = 'PNA > 7 days: 0.2 / 0.25 / 0.25 mg/kg';
      }
      const t1 = weight * d1;
      const t2 = weight * d2d3;
      return {
        dosePerKg: `Dose 1: ${d1} mg/kg | Doses 2–3: ${d2d3} mg/kg`,
        totalDose: `Dose 1: ${t1.toFixed(3)} mg | Doses 2–3: ${t2.toFixed(3)} mg each`,
        interval: 'q12–24h × 3 doses',
        route: 'IV over 20–30 min (never IM, never rapid push)',
        concentration: '0.1 mg/mL (reconstituted)',
        volumePerDose: `Dose 1: ${mL(t1, 0.1)} | Doses 2–3: ${mL(t2, 0.1)}`,
        basisNote,
        warningNote: 'Never with concurrent hydrocortisone (intestinal perforation risk). Check UO before each dose.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RESPIRATORY
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'caffeine-citrate',
    name: 'Caffeine Citrate',
    category: 'Respiratory',
    indications: ['Apnea of prematurity', 'Facilitate extubation in preterm infants', 'BPD reduction'],
    administration: 'IV or PO (bioavailability ~100% PO). IV over 30 min.',
    monitoring: ['Heart rate (tachycardia > 180 bpm → reduce dose)', 'Blood glucose', 'Jitteriness / seizures at toxic levels', 'Level if toxicity suspected: therapeutic 8–20 mg/L'],
    cautions: [
      'CITRATE salt (caffeine base = half the citrate mg)',
      'Loading: 20 mg/kg citrate = 10 mg/kg base',
      'Maintenance: 5–10 mg/kg/day citrate = 2.5–5 mg/kg/day base',
      'Do not confuse with aminophylline dosing',
      'Continue until 34–36 weeks PMA and apnoea-free > 5–7 days',
    ],
    references: ['CAP trial (Schmidt et al. NEJM 2006)', 'NNF 9th ed. (2024)', 'European Consensus RDS 2022'],
    calculate: (weight) => {
      const loadDose = 20;
      const maintDose = 7.5;
      const loadTotal = weight * loadDose;
      const maintTotal = weight * maintDose;
      return {
        dosePerKg: `Load: ${loadDose} mg/kg | Maintenance: 5–10 mg/kg/day`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg | Maintenance: ${(weight * 5).toFixed(0)}–${(weight * 10).toFixed(0)} mg/day`,
        interval: 'Load: single dose | Maintenance: q24h (start 24 h after load)',
        route: 'IV over 30 min or PO (equivalent bioavailability)',
        concentration: '10 mg/mL (citrate)',
        volumePerDose: `Load: ${mL(loadTotal, 10)} | Maintenance: ${mL(maintTotal, 10)}`,
        basisNote: 'Caffeine CITRATE (base = half); continue to ~34–36 wks PMA',
        warningNote: 'Citrate salt — do not confuse mg of citrate with mg of base.',
      };
    },
  },

  {
    id: 'calfactant',
    name: 'Calfactant',
    brandName: 'Infasurf',
    category: 'Respiratory',
    indications: ['Respiratory Distress Syndrome (RDS) — treatment and prevention', 'LISA/MIST administration in spontaneously breathing infants on CPAP'],
    administration: 'Intratracheal: via ETT or thin catheter (LISA/MIST). Gently swirl vial before use — DO NOT SHAKE. Warm to room temperature (do not use warmer). Administer as 2 aliquots with repositioning between aliquots.',
    monitoring: ['SpO₂ and FiO₂ immediately post-dose (improvement expected within minutes)', 'Watch for transient bradycardia or desaturation during instillation', 'Wean ventilator FiO₂ and pressures promptly after dose — avoid hyperoxia', 'Repeat chest X-ray / blood gas at 2–4 h post-dose'],
    cautions: [
      'Dose: 3 mL/kg per dose (= 105 mg phospholipids/kg)',
      'Up to 3 doses total — each dose at least 12 h apart',
      'In LISA/MIST: infant on CPAP, awake, thin catheter via vocal cords — suspend CPAP briefly, instil, resume CPAP',
      'Wean FiO₂ and pressure settings within minutes of dose — rapid compliance change',
      'If FiO₂ still > 0.30 on CPAP ≥ 6 cmH₂O at 12 h → give repeat dose',
      'Single-use 6 mL vial (210 mg). Discard unused portion.',
    ],
    references: ['European Consensus Guidelines on RDS 2022', 'Infasurf (calfactant) prescribing information', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const mlPerKg = 3;
      const concMgPerMl = 35;
      const vol = weight * mlPerKg;
      return {
        dosePerKg: '3 mL/kg (= 105 mg phospholipids/kg)',
        totalDose: `${vol.toFixed(2)} mL (= ${(vol * concMgPerMl).toFixed(0)} mg phospholipids)`,
        interval: 'Up to 3 doses total, each ≥ 12 h apart',
        route: 'Intratracheal (ETT or LISA catheter)',
        concentration: '35 mg phospholipids/mL',
        volumePerDose: `${vol.toFixed(2)} mL per dose`,
        basisNote: 'Swirl gently — do NOT shake. Warm to room temperature (no warmer device).',
        maxDose: `${(vol * 3).toFixed(2)} mL total (3 doses)`,
        warningNote: 'Wean FiO₂ and pressures IMMEDIATELY after dose. Transient bradycardia/desaturation during instillation — resuscitation ready.',
      };
    },
  },

  {
    id: 'sildenafil',
    name: 'Sildenafil',
    category: 'Respiratory',
    indications: ['Persistent Pulmonary Hypertension of the Newborn (PPHN)', 'BPD-associated pulmonary hypertension'],
    administration: 'PO (preferred) or IV (if enteral not tolerated). IV must be given slowly over 3 hours.',
    monitoring: ['SpO₂ and pre/post-ductal difference', 'BP (systemic hypotension risk)', 'Echo response at 48–72 h', 'Oxygenation index trend'],
    cautions: [
      'Oral: 0.5–1 mg/kg/dose TID (q8h) — do NOT titrate above 1 mg/kg/dose',
      'IV dose = 0.4 mg/kg over 3 hours (then 1.6 mg/kg/day by continuous infusion)',
      'Systemic hypotension — monitor BP closely at start',
      'Do NOT use in combination with iNO without caution (rebound PPHN on withdrawal)',
      'Avoid if systemic hypotension or obstructive physiology',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const dosePerKg = 0.5;
      const maxDosePerKg = 1;
      const total = weight * dosePerKg;
      return {
        dosePerKg: '0.5 mg/kg/dose (start) → max 1 mg/kg/dose (oral)',
        totalDose: `Starting: ${total.toFixed(2)} mg/dose | Max: ${(weight * maxDosePerKg).toFixed(2)} mg/dose`,
        interval: 'q8h (TID) PO',
        route: 'PO (preferred) or IV over 3 h',
        concentration: '10 mg/mL (oral suspension) | 0.8 mg/mL (IV)',
        volumePerDose: `PO: ${mL(total, 10)} | IV: ${mL(total, 0.8)}`,
        basisNote: 'Start 0.5 mg/kg TID; titrate up based on SpO₂ / OI response — do not exceed 1 mg/kg/dose orally',
        maxDose: `${maxDosePerKg} mg/kg/dose (oral) — do not exceed`,
        warningNote: 'Monitor BP closely — systemic hypotension may worsen oxygenation.',
      };
    },
  },

  {
    id: 'dexamethasone-dart',
    name: 'Dexamethasone (DART protocol)',
    category: 'Respiratory',
    indications: ['Ventilator-dependent BPD at > 7 days', 'Facilitating extubation in ventilator-dependent preterm infant'],
    administration: 'IV over 15 min or PO.',
    monitoring: ['Blood glucose (hyperglycaemia common)', 'BP (hypertension)', 'Infection surveillance', 'Growth parameters'],
    cautions: [
      'DART protocol daily total: 0.15 mg/kg/day × 3d → 0.1 mg/kg/day × 3d → 0.05 mg/kg/day × 2d → 0.02 mg/kg/day × 2d',
      'Each daily total is given as TWO EQUAL doses q12h (0.075 → 0.05 → 0.025 → 0.01 mg/kg/DOSE) — NOT once daily',
      'Short low-dose course has acceptable neurodevelopmental safety profile (DART trial)',
      'High-dose / long courses associated with cerebral palsy risk — do not exceed DART dosing',
      'Avoid in first week of life (necrotising enterocolitis risk)',
    ],
    references: ['DART trial (Doyle et al. Lancet 2006)', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const perDose1 = weight * 0.075;
      const perDose2 = weight * 0.05;
      const perDose3 = weight * 0.025;
      const perDose4 = weight * 0.01;
      return {
        dosePerKg: 'DART (per dose, q12h): 0.075 → 0.05 → 0.025 → 0.01 mg/kg/dose',
        totalDose: `Days 1–3: ${perDose1.toFixed(3)} mg/dose | Days 4–6: ${perDose2.toFixed(3)} mg/dose | Days 7–8: ${perDose3.toFixed(3)} mg/dose | Days 9–10: ${perDose4.toFixed(3)} mg/dose`,
        interval: 'q12h (TWO doses per day, not once daily)',
        route: 'IV over 15 min or PO',
        concentration: '4 mg/mL (IV)',
        volumePerDose: `Days 1–3: ${mL(perDose1, 4)} | Days 4–6: ${mL(perDose2, 4)} | Days 7–8: ${mL(perDose3, 4)} | Days 9–10: ${mL(perDose4, 4)}`,
        basisNote: '10-day course, each dose given q12h. Use only DART dosing — higher doses carry neurodevelopmental risk.',
        warningNote: 'Hyperglycaemia, hypertension, infection risk. Do not use in first week of life. Do NOT give the daily total as a single once-daily dose.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANALGESIC & SEDATION
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'morphine',
    name: 'Morphine',
    category: 'Analgesic & Sedation',
    indications: ['Postoperative pain', 'Ventilated neonates requiring sedation/analgesia', 'NAS/NOWS pharmacological treatment'],
    administration: 'Bolus IV over 5–10 min. Infusion via syringe driver.',
    monitoring: ['Respiratory rate and depth', 'SpO₂ (apnoea/hypoventilation risk)', 'Pain/sedation score (NPASS or PIPP)', 'Urine output and bowel motility (ileus)'],
    cautions: [
      'Bolus in ventilated infants: 0.05–0.2 mg/kg q4h PRN',
      'Infusion: typically started with a 0.1 mg/kg loading bolus, then 0.01–0.02 mg/kg/h maintenance',
      'Respiratory depression — have naloxone available (0.01 mg/kg IV)',
      'Accumulates with organ immaturity — use lowest effective dose, frequent reassessment',
      'NAS/NOWS oral morphine: specialist dosing protocol',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const bolusDose = 0.2;
      const infLoadDose = 0.1;
      const infMinDose = 0.01;
      const infMaxDose = 0.02;
      const bolusTotal = weight * bolusDose;
      const infLoadTotal = weight * infLoadDose;
      const infMin = weight * infMinDose;
      const infMax = weight * infMaxDose;
      return {
        dosePerKg: 'Bolus: 0.05–0.2 mg/kg | Infusion: load 0.1 mg/kg then 0.01–0.02 mg/kg/h',
        totalDose: `Bolus: ${(weight * 0.05).toFixed(3)}–${bolusTotal.toFixed(3)} mg | Infusion load: ${infLoadTotal.toFixed(3)} mg | Maintenance: ${infMin.toFixed(4)}–${infMax.toFixed(4)} mg/h`,
        interval: 'Bolus: q4h PRN | Infusion: load once, then continuous',
        route: 'IV (bolus over 5–10 min)',
        concentration: '1 mg/mL (standard dilution)',
        volumePerDose: `Bolus (0.2 mg/kg max): ${mL(bolusTotal, 1)} | Infusion load: ${mL(infLoadTotal, 1)} | Maintenance: ${infMin.toFixed(3)}–${infMax.toFixed(3)} mL/h`,
        basisNote: 'When starting an infusion, give the 0.1 mg/kg loading bolus first, then start the 0.01–0.02 mg/kg/h maintenance rate.',
        warningNote: 'Respiratory depression. Naloxone 0.01 mg/kg available at bedside.',
      };
    },
  },

  {
    id: 'fentanyl',
    name: 'Fentanyl',
    category: 'Analgesic & Sedation',
    indications: ['Procedural analgesia (intubation, line insertion)', 'Postoperative pain in ventilated neonates', 'Adjunct sedation during HFOV'],
    administration: 'Bolus: IV over 3–5 min (slow push). Infusion: continuous IV.',
    monitoring: ['Respiratory rate and SpO₂', 'Chest wall rigidity (rapid infusion)', 'Haemodynamics', 'Pain/sedation score'],
    cautions: [
      'Chest wall rigidity ("wooden chest") with rapid bolus > 3 mcg/kg — slow the infusion',
      'Analgesia tier: bolus 0.5–3 mcg/kg | infusion 0.5–2 mcg/kg/h',
      'Sedation tier (deeper, e.g. HFOV adjunct): bolus 0.5–4 mcg/kg | infusion 1–5 mcg/kg/h — these are HIGHER than analgesia dosing',
      'Shorter duration of action than morphine (preferred for procedures)',
      'Tolerance develops rapidly with continuous infusion — wean slowly',
      'Renally cleared metabolites can accumulate in renal failure',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const concMcgPerMl = 50;
      const analgBolusLow = weight * 0.5;
      const analgBolusHigh = weight * 3;
      const analgInfLow = weight * 0.5;
      const analgInfHigh = weight * 2;
      const sedBolusLow = weight * 0.5;
      const sedBolusHigh = weight * 4;
      const sedInfLow = weight * 1;
      const sedInfHigh = weight * 5;
      return {
        dosePerKg: 'Analgesia — bolus: 0.5–3 mcg/kg, infusion: 0.5–2 mcg/kg/h | Sedation — bolus: 0.5–4 mcg/kg, infusion: 1–5 mcg/kg/h',
        totalDose: `Analgesia bolus: ${analgBolusLow.toFixed(1)}–${analgBolusHigh.toFixed(1)} mcg | Analgesia infusion: ${analgInfLow.toFixed(1)}–${analgInfHigh.toFixed(1)} mcg/h | Sedation bolus: ${sedBolusLow.toFixed(1)}–${sedBolusHigh.toFixed(1)} mcg | Sedation infusion: ${sedInfLow.toFixed(1)}–${sedInfHigh.toFixed(1)} mcg/h`,
        interval: 'Bolus PRN | Infusion: continuous',
        route: 'IV (bolus over 3–5 min minimum)',
        concentration: '50 mcg/mL (standard)',
        volumePerDose: `Analgesia infusion: ${(analgInfLow / concMcgPerMl).toFixed(3)}–${(analgInfHigh / concMcgPerMl).toFixed(3)} mL/h | Sedation infusion: ${(sedInfLow / concMcgPerMl).toFixed(3)}–${(sedInfHigh / concMcgPerMl).toFixed(3)} mL/h`,
        basisNote: 'Pick the tier matching clinical intent — sedation dosing is meaningfully higher than analgesia dosing, they are not interchangeable.',
        warningNote: 'Chest wall rigidity with rapid bolus — always give slowly over ≥ 3–5 min.',
      };
    },
  },

  {
    id: 'paracetamol-iv',
    name: 'Paracetamol (Analgesic)',
    category: 'Analgesic & Sedation',
    indications: ['Mild–moderate pain', 'Postoperative analgesia (opioid-sparing)', 'Antipyretic'],
    administration: 'IV over 15 min — NeoFax only clearly supports IV dosing for GA ≥ 32 weeks. For GA < 32 weeks, prefer PO/PR (see cautions for that PMA-graduated schedule).',
    monitoring: ['Hepatic function if prolonged course (> 7 days)', 'Pain score reassessment 30–60 min after dose'],
    cautions: [
      'IV dosing is only clearly established for GA ≥ 32 weeks: 12.5 mg/kg/dose q6h',
      'IV use below 32 weeks GA is not well-supported by NeoFax — consider PO/PR instead',
      'PO/PR fever-or-pain dosing IS PMA-graduated (different from the IV regimen): <32wk PMA 20–25 mg/kg load then 12–15 mg/kg/dose q12h (PO) or q12h (PR); ≥32wk 12–15 mg/kg/dose q8h (PO) or q8h (PR); term 12–15 mg/kg/dose q6h (PO) or q6h (PR)',
      'MAX 50 mg/kg/day from ALL routes combined (IV + PO + PR) — this is a hard ceiling, not per-route',
      'Do not use IV paracetamol for PDA closure (separate higher-dose protocol — see paracetamol-pda)',
      'Hepatotoxic in overdose — respect dosing intervals and the combined-route max',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma) => {
      const maxDailyMgKg = 50;
      if (pma < 32) {
        return {
          dosePerKg: 'IV not well-established below 32 wks GA — PO/PR preferred',
          totalDose: `See PO/PR schedule in cautions (not IV)`,
          interval: 'PO/PR: 20–25 mg/kg load, then 12–15 mg/kg/dose q12h',
          route: 'PO or PR preferred over IV at this PMA',
          concentration: '10 mg/mL (IV, if used)',
          volumePerDose: 'N/A — use PO/PR dosing',
          basisNote: `PMA ${pma} wks (< 32 wks) — IV regimen not clearly supported by NeoFax at this maturity`,
          maxDose: `${maxDailyMgKg} mg/kg/day (= ${(weight * maxDailyMgKg).toFixed(0)} mg/day) from ALL routes combined`,
          warningNote: 'Do not extrapolate the ≥32 wk IV dose downward — use PO/PR per the PMA-graduated schedule instead.',
        };
      }
      const dose = 12.5;
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg/dose (IV, GA ≥ 32 wks only)`,
        totalDose: `${total.toFixed(1)} mg`,
        interval: 'q6h',
        route: 'IV over 15 min',
        concentration: '10 mg/mL (IV)',
        volumePerDose: mL(total, 10),
        basisNote: 'GA ≥ 32 wks',
        maxDose: `${maxDailyMgKg} mg/kg/day (= ${(weight * maxDailyMgKg).toFixed(0)} mg/day) from ALL routes combined`,
      };
    },
  },

  {
    id: 'sucrose-24',
    name: 'Sucrose 24%',
    category: 'Analgesic & Sedation',
    indications: ['Procedural pain in neonates (heel prick, venepuncture, NG tube insertion, IV cannulation)'],
    administration: 'Apply 0.5–2 mL to tip of tongue or dummy (pacifier) 2 minutes before procedure. Can repeat during procedure (max 4 doses per procedure).',
    monitoring: ['Pain score (PIPP) before and during procedure', 'SpO₂ and respiratory rate during administration'],
    cautions: [
      'Effectiveness up to ~36 weeks PMA; limited evidence beyond',
      'Not a substitute for systemic analgesia for major procedures',
      'No systemic absorption risk at these doses',
      'Can be combined with non-nutritive sucking (pacifier)',
    ],
    references: ['Cochrane review Stevens et al. 2016', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const dose = Math.min(0.5 * weight, 2);
      return {
        dosePerKg: '0.5 mL/kg (max 2 mL per dose)',
        totalDose: `${dose.toFixed(2)} mL`,
        interval: '2 min before procedure; repeat PRN (max 4× per procedure)',
        route: 'PO — apply to tip of tongue or pacifier',
        concentration: '24% sucrose solution',
        volumePerDose: `${dose.toFixed(2)} mL`,
        basisNote: 'Administer 2 min prior to painful procedure',
        maxDose: '2 mL per dose',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // VITAMINS & SUPPLEMENTS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'vitamin-k',
    name: 'Vitamin K₁ (Phytomenadione)',
    category: 'Vitamin & Supplement',
    indications: ['Prophylaxis for Haemorrhagic Disease of the Newborn (HDN)', 'Treatment of vitamin K deficiency bleeding'],
    administration: 'IM preferred (most reliable). IV only in bleeding emergency (over 10–20 min, anaphylaxis risk IV).',
    monitoring: ['PT/INR 4–6 h after treatment dose (for bleeding)', 'Clinical bleeding response'],
    cautions: [
      'Prophylaxis IM: 1 mg (BW ≥ 1.5 kg) or 0.5 mg (BW < 1.5 kg) — single dose at birth',
      'PO prophylaxis: 2 mg at birth, 2 mg at 1 week, 2 mg at 1 month (for breastfed infants)',
      'Treatment of active bleeding: FIXED 1 mg IV (NOT weight-based) — repeat if needed',
      'IV route: anaphylaxis risk — have resuscitation available',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const prophDose = weight >= 1.5 ? 1 : 0.5;
      const treatDose = 1;
      return {
        dosePerKg: `Prophylaxis: ${prophDose} mg (fixed) | Treatment: 1 mg FIXED (not weight-based)`,
        totalDose: `Prophylaxis: ${prophDose} mg | Treatment: ${treatDose} mg`,
        interval: 'Prophylaxis: single dose at birth | Treatment: repeat q6–8h if no response',
        route: 'IM (prophylaxis) | IV over 10–20 min (treatment)',
        concentration: '10 mg/mL (Konakion Neonatal 1 mg/0.1 mL or 2 mg/0.2 mL)',
        volumePerDose: `Prophylaxis: ${mL(prophDose, 10)} | Treatment: ${mL(treatDose, 10)}`,
        basisNote: `Prophylaxis: ${weight >= 1.5 ? '1 mg (BW ≥ 1.5 kg)' : '0.5 mg (BW < 1.5 kg)'}. Treatment dose does NOT scale with weight.`,
        maxDose: 'Treatment: 1 mg per dose (fixed, even for the smallest preterm infants)',
        warningNote: 'IV route: anaphylaxis risk — resuscitation ready. IM preferred for prophylaxis. Do NOT calculate treatment dose as mg/kg.',
      };
    },
  },

  {
    id: 'vitamin-d',
    name: 'Vitamin D (Cholecalciferol)',
    category: 'Vitamin & Supplement',
    indications: ['Prophylaxis in preterm and term breastfed infants', 'Vitamin D deficiency / rickets of prematurity'],
    administration: 'PO once daily.',
    monitoring: ['25-OH vitamin D level (target 50–150 nmol/L)', 'Serum calcium and phosphate if on high doses', 'Bone health: alkaline phosphatase, phosphate'],
    cautions: [
      'This drug intentionally follows ESPGHAN 2021 (800 IU/day for <34wk), which recommends HIGHER doses than NeoFax Essentials 2020 (200–400 IU/day for <2000g) — a genuine, deliberate guideline disagreement, not a data-entry error',
      'Standard prophylaxis: 400–800 IU/day for term infants; 400–1000 IU/day for preterm',
      'VLBW / ELBW: 800–1000 IU/day (higher end due to poor stores + high demand)',
      'Supplementation usually started at first tolerated feeds',
      'Toxicity rare at these doses but possible with prolonged high doses',
    ],
    references: ['ESPGHAN guidelines 2021', 'NNF 9th ed. (2024)'],
    calculate: (weight, pma) => {
      const dose = pma < 34 ? 800 : 400;
      return {
        dosePerKg: `${dose} IU/day (${(dose / weight).toFixed(0)} IU/kg/day)`,
        totalDose: `${dose} IU daily`,
        interval: 'q24h (once daily)',
        route: 'PO',
        concentration: '400 IU/mL (standard drops) or 1000 IU/mL',
        volumePerDose: `${(dose / 400).toFixed(2)} mL (at 400 IU/mL)`,
        basisNote: pma < 34 ? 'Preterm < 34 wks: 800–1000 IU/day' : 'Term / near-term: 400–800 IU/day',
        maxDose: '1000 IU/day (preterm); 400 IU/day (term, prophylaxis)',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ANTIBIOTICS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'flucloxacillin',
    name: 'Flucloxacillin',
    brandName: 'Floxapen (Oxacillin in US)',
    category: 'Antibiotic',
    indications: ['MSSA sepsis / bacteraemia', 'Skin & soft tissue infection (Staph aureus)', 'Osteomyelitis / septic arthritis', 'CoNS line infection (non-MRSA)'],
    administration: 'IV over 15–30 min. PO available but poor neonatal oral absorption — use IV in NICU.',
    monitoring: ['LFTs (hepatotoxicity with prolonged courses)', 'Renal function', 'Clinical response at 48–72 h', 'Repeat cultures'],
    cautions: [
      'MSSA only — check sensitivities; if MRSA use vancomycin',
      'Cholestatic hepatitis risk with prolonged use (> 2 weeks)',
      'Higher dose (75 mg/kg) for meningitis and osteomyelitis',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma, pna) => {
      const dose = 50;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pma < 29) {
        interval = pna <= 28 ? 'q12h' : 'q8h';
        basisNote = `PMA < 29 wks, PNA ${pna <= 28 ? '≤ 28d' : '> 28d'}`;
      } else if (pma < 37) {
        interval = pna <= 7 ? 'q12h' : 'q8h';
        basisNote = `PMA 29–36 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q6h';
        basisNote = 'PMA ≥ 37 wks';
      }
      return {
        dosePerKg: '50 mg/kg (75 mg/kg for CNS / bone)',
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV over 15–30 min',
        concentration: '100 mg/mL (reconstituted)',
        volumePerDose: mL(total, 100),
        basisNote,
        warningNote: 'MSSA only — confirm sensitivity. Hepatotoxicity risk with long courses.',
      };
    },
  },

  {
    id: 'clindamycin',
    name: 'Clindamycin',
    category: 'Antibiotic',
    indications: ['Anaerobic cover (NEC, intra-abdominal sepsis)', 'MRSA skin & soft tissue', 'Bone & joint infection (MSSA/MRSA)'],
    administration: 'IV over 30–60 min. PO has excellent bioavailability (~90%) — switch when tolerated.',
    monitoring: ['LFTs', 'Clostridium difficile risk (diarrhoea — stop if suspected)', 'Clinical response'],
    cautions: [
      'C. difficile colitis risk — use shortest effective course',
      'Do not give as rapid IV bolus (cardiac toxicity)',
      'NEC: combine with ampicillin + gentamicin (not monotherapy)',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma, pna) => {
      const dose = 7.5;
      let interval: string;
      let basisNote: string;
      if (pma <= 29) {
        interval = pna <= 28 ? 'q12h' : 'q8h';
        basisNote = `PMA ≤ 29 wks, PNA ${pna <= 28 ? '≤ 28d' : '> 28d'}`;
      } else if (pma <= 36) {
        interval = pna <= 14 ? 'q12h' : 'q8h';
        basisNote = `PMA 30–36 wks, PNA ${pna <= 14 ? '≤ 14d' : '> 14d'}`;
      } else if (pma <= 44) {
        interval = pna <= 7 ? 'q12h' : 'q8h';
        basisNote = `PMA 37–44 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q6h';
        basisNote = 'PMA ≥ 45 wks';
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg (NeoFax range 5–7.5 mg/kg — not PMA-tiered)`,
        totalDose: `${total.toFixed(1)} mg`,
        interval,
        route: 'IV over 30–60 min',
        concentration: '15 mg/mL',
        volumePerDose: mL(total, 15),
        basisNote,
        warningNote: 'C. difficile risk. Never give as rapid IV push.',
      };
    },
  },

  {
    id: 'azithromycin',
    name: 'Azithromycin',
    category: 'Antibiotic',
    indications: ['Ureaplasma pneumonitis in preterm', 'Chlamydial ophthalmia neonatorum', 'Pertussis (whooping cough)', 'BPD prevention (adjunct, evidence from 3 RCTs)'],
    administration: 'IV over 60 min. PO suspension equally effective and preferred when tolerated.',
    monitoring: ['QTc before and during treatment (QT prolongation risk)', 'LFTs', 'Clinical response (Ureaplasma: repeat NPA PCR)'],
    cautions: [
      'QT prolongation — avoid with other QT-prolonging drugs (fluconazole, cisapride)',
      'Pyloric stenosis risk with PO in infants < 6 weeks (use IV if < 6 weeks PO)',
      'Pertussis / Ureaplasma: 10 mg/kg q24h × 5 days (Pertussis) or × 3 days (Ureaplasma, some centres extend to 5)',
      'Chlamydial ophthalmia neonatorum: 20 mg/kg PO q24h × 3 days (NOT 10 mg/kg × 5 days — different dose AND duration from pertussis/ureaplasma)',
      'BPD prevention (separate protocol, not in the calculator below): 10 mg/kg/day IV × 1 week, then 5 mg/kg/day × 1–5 weeks',
    ],
    references: ['Neofax 2020', 'Ballard et al. NEJM 2011 (Ureaplasma)'],
    calculate: (weight) => {
      const dose = 10;
      const total = weight * dose;
      return {
        dosePerKg: '10 mg/kg (Pertussis/Ureaplasma dosing — see cautions for Chlamydial ophthalmia and BPD-prevention regimens, which differ)',
        totalDose: `${total.toFixed(0)} mg`,
        interval: 'q24h × 3 days (Ureaplasma) or × 5 days (Pertussis)',
        route: 'IV over 60 min or PO',
        concentration: '2 mg/mL (IV) | 40 mg/mL (suspension)',
        volumePerDose: `IV: ${mL(total, 2)} | PO: ${mL(total, 40)}`,
        basisNote: 'Ureaplasma: 3 days | Pertussis: 5 days. Chlamydial ophthalmia uses a DIFFERENT dose (20 mg/kg × 3 days) — see cautions.',
        warningNote: 'Check QTc before starting. Pyloric stenosis risk with PO < 6 weeks — use IV. Do not use this 10 mg/kg figure for chlamydial ophthalmia.',
      };
    },
  },

  {
    id: 'rifampicin',
    name: 'Rifampicin',
    category: 'Antibiotic',
    indications: ['Adjunct for MRSA / CoNS bacteraemia (never monotherapy)', 'Meningococcal prophylaxis (< 1 month)', 'TB meningitis (adjunct)'],
    administration: 'PO preferred (excellent bioavailability). IV over 2–3 hours if oral route not available.',
    monitoring: ['LFTs (hepatotoxicity — weekly)', 'FBC', 'Orange discolouration of urine/secretions (warn family — harmless)', 'Drug levels / interactions'],
    cautions: [
      'NEVER use as monotherapy for MRSA/CoNS — resistance emerges rapidly',
      'Staph/MRSA adjunct dosing is DIFFERENT by route — PO: 10–20 mg/kg q24h. IV: 5–10 mg/kg q12h. Do not use one interval for both routes.',
      'Potent CYP inducer — lowers levels of many co-medications (check all concurrent drugs)',
      'Hepatotoxicity: check LFTs at baseline and weekly',
      'Meningococcal prophylaxis dose: 5 mg/kg q12h × 2 days (< 1 month) — this is a separate, shorter regimen from the Staph-adjunct dosing above',
    ],
    references: ['Neofax 2020', 'PHE Meningococcal guidelines'],
    calculate: (weight) => {
      const poDose = 15;
      const ivDose = 7.5;
      const poTotal = weight * poDose;
      const ivTotal = weight * ivDose;
      return {
        dosePerKg: 'Staph/MRSA adjunct — PO: 10–20 mg/kg q24h | IV: 5–10 mg/kg q12h',
        totalDose: `PO: ${poTotal.toFixed(1)} mg q24h | IV: ${ivTotal.toFixed(1)} mg q12h`,
        interval: 'PO: q24h | IV: q12h (routes are NOT interchangeable at the same interval)',
        route: 'PO preferred | IV over 2–3 h if oral unavailable',
        concentration: '20 mg/mL (suspension) | 60 mg/mL (IV reconstituted)',
        volumePerDose: `PO: ${mL(poTotal, 20)} q24h | IV: ${mL(ivTotal, 60)} q12h`,
        basisNote: 'Staph/MRSA adjunct dosing shown (mid-range of each route). Meningococcal prophylaxis and TB meningitis use different regimens — see cautions.',
        warningNote: 'Never monotherapy — resistance emerges in days. CYP inducer — check all drug interactions. PO and IV are dosed differently — do not substitute one interval for the other.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ANTICONVULSANTS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'fosphenytoin',
    name: 'Fosphenytoin',
    category: 'Anticonvulsant',
    indications: ['Neonatal seizures (third-line)', 'Refractory seizures after phenobarbital ± levetiracetam'],
    administration: 'IV over 10–20 min. Dose expressed in PHENYTOIN EQUIVALENTS (PE). Max rate 3 mg PE/kg/min.',
    monitoring: ['Continuous ECG during loading (arrhythmia / bradycardia risk)', 'BP (hypotension)', 'Serum phenytoin level 2 h after load: target 15–20 mg/L', 'EEG response'],
    cautions: [
      'Dose in PE (phenytoin equivalents) — 1 mg PE = 1 mg phenytoin = 1.5 mg fosphenytoin',
      'Cardiac monitoring mandatory during loading — arrhythmia and hypotension',
      'Safer than IV phenytoin (no propylene glycol vehicle)',
      'Half-life very variable in neonates — TDM essential',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const loadPE = 20;
      const maintPEPerDay = 6;
      const loadTotal = weight * loadPE;
      const maintTotalPerDay = weight * maintPEPerDay;
      const maintPerDoseQ12h = maintTotalPerDay / 2;
      return {
        dosePerKg: `Load: ${loadPE} mg PE/kg (once) | Maintenance: 4–8 mg PE/kg/DAY (total), given as split doses`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg PE (once) | Maintenance: ${maintTotalPerDay.toFixed(0)} mg PE/day TOTAL = ${maintPerDoseQ12h.toFixed(0)} mg PE PER DOSE if given q12h`,
        interval: 'Load: single dose | Maintenance: q12h (HALF the daily total per dose) or q24h (FULL daily total per dose)',
        route: 'IV over 10–20 min (max 3 mg PE/kg/min)',
        concentration: '75 mg/mL fosphenytoin = 50 mg PE/mL',
        volumePerDose: `Load: ${mL(loadTotal, 50)} (at 50 mg PE/mL) | Maintenance q12h: ${mL(maintPerDoseQ12h, 50)} PER DOSE | Maintenance q24h: ${mL(maintTotalPerDay, 50)} PER DOSE`,
        basisNote: 'Third-line seizures. Dose in PE not mg fosphenytoin. The maintenance figure above is a DAILY TOTAL — if dosing q12h, give HALF of it per administration.',
        warningNote: 'Continuous ECG mandatory during loading. Cardiac arrhythmia and hypotension risk. Do NOT give the full daily maintenance total as a single q12h dose — that is a ~2x overdose.',
      };
    },
  },

  {
    id: 'pyridoxine',
    name: 'Pyridoxine (Vitamin B6)',
    category: 'Anticonvulsant',
    indications: ['Diagnostic trial for pyridoxine-dependent epilepsy (PDE)', 'Refractory neonatal seizures — trial before third-line anticonvulsants'],
    administration: 'IV: slow push over 2–3 min while EEG monitored. PO for maintenance.',
    monitoring: ['EEG during IV trial (seizure cessation confirms diagnosis)', 'Respiratory rate and SpO₂ (apnoea risk with IV)', 'Pyridoxal-5-phosphate levels if available'],
    cautions: [
      'IV diagnostic trial: 50–100 mg FIXED dose (NOT weight-based) as a single slow IV push/IM, on continuous EEG',
      'Maintenance is also a FIXED dose, not weight-based — 50–100 mg PO q24h; higher doses may be needed during intercurrent illness',
      'Apnoea, bradycardia and hypotension may occur with IV dose — resuscitation at bedside',
      'Consider folinic acid-responsive seizures if pyridoxine trial negative (send urine pipecolic acid)',
    ],
    references: ['Neofax 2020'],
    calculate: () => {
      const trialDose = 100;
      const maintDose = 100;
      return {
        dosePerKg: 'Trial: 50–100 mg FIXED (not weight-based) | Maintenance: 50–100 mg FIXED (not weight-based)',
        totalDose: `Trial: ${trialDose} mg IV/IM | Maintenance: ${maintDose} mg PO q24h`,
        interval: 'Trial: single IV/IM dose | Maintenance: q24h PO',
        route: 'IV push or IM (trial) | PO (maintenance)',
        concentration: '50 mg/mL (IV)',
        volumePerDose: `Trial: ${mL(trialDose, 50)} IV | Maintenance: variable (oral formulation)`,
        basisNote: 'Fixed dose regardless of weight — do NOT calculate mg/kg. Give under continuous EEG monitoring.',
        maxDose: '100 mg per dose (trial or maintenance)',
        warningNote: 'Apnoea risk with IV — resuscitation MUST be at bedside before administration.',
      };
    },
  },

  {
    id: 'lidocaine-seizure',
    name: 'Lidocaine (Seizures)',
    category: 'Anticonvulsant',
    indications: ['Refractory neonatal seizures (fourth-line)', 'Seizures unresponsive to phenobarbital + levetiracetam + midazolam'],
    administration: 'Loading dose IV over 10 min, then stepdown continuous infusion.',
    monitoring: ['Continuous ECG (QRS widening, arrhythmia)', 'EEG monitoring throughout', 'Serum levels if available (target 2.5–6 mg/L)', 'BP'],
    cautions: [
      'Do NOT use if QTc prolonged or cardiac conduction defect',
      'Do NOT combine with phenytoin / fosphenytoin (additive cardiac toxicity)',
      'LIDOCAINE protocol: load 2 mg/kg → 6 mg/kg/h × 6h → 4 mg/kg/h × 12h → 2 mg/kg/h × 12h → stop',
      'This regimen is only validated for TERM, NORMOTHERMIC infants — dosing in preterm infants and infants on therapeutic hypothermia is uncertain due to accumulation risk (exactly the population most likely to need a 4th-line seizure drug — use with extra caution and lower threshold for serum level checks)',
      'Toxicity: perioral tingling, VT, cardiac arrest — have resuscitation ready',
    ],
    references: ['Neofax 2020', 'Malingré et al. Neuropediatrics 2006', 'Boylan et al. Lancet Neurol 2013'],
    calculate: (weight) => {
      const load = weight * 2;
      const concMgPerMl = 10;
      return {
        dosePerKg: 'Load: 2 mg/kg → Infusion: 6 → 4 → 2 mg/kg/h (stepdown)',
        totalDose: `Load: ${load.toFixed(1)} mg`,
        interval: 'Load then stepdown infusion (total ~30 h)',
        route: 'IV (central or peripheral)',
        concentration: '10 mg/mL (standard)',
        volumePerDose: `Load: ${mL(load, concMgPerMl)} over 10 min | Step 1 (6 mg/kg/h): ${((weight * 6) / concMgPerMl).toFixed(2)} mL/h | Step 2 (4 mg/kg/h): ${((weight * 4) / concMgPerMl).toFixed(2)} mL/h | Step 3 (2 mg/kg/h): ${((weight * 2) / concMgPerMl).toFixed(2)} mL/h`,
        basisNote: 'Fourth-line only, TERM + normothermic infants. Step 1: 6 h | Step 2: 12 h | Step 3: 12 h | Stop',
        warningNote: 'ECG mandatory throughout. Do NOT combine with fosphenytoin. QTc check before starting. Not validated in preterm/hypothermia-treated infants — use extra caution.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL CARDIOVASCULAR
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'norepinephrine',
    name: 'Norepinephrine (Noradrenaline)',
    category: 'Cardiovascular',
    indications: ['Vasodilatory / septic shock (refractory to dopamine)', 'Catecholamine-resistant hypotension', 'PPHN with systemic hypotension'],
    administration: 'Continuous IV infusion via CENTRAL line only. Never peripheral.',
    monitoring: ['Continuous arterial BP (arterial line mandatory)', 'HR and ECG', 'Peripheral perfusion (capillary refill, lactate)', 'Urine output'],
    cautions: [
      'Central line MANDATORY — peripheral extravasation causes severe necrosis',
      'High doses increase afterload — may worsen cardiac output if cardiogenic component',
      'Combination with low-dose dopamine (renal dose 2–5 mcg/kg/min) common practice',
      'Titrate by MAP target, not fixed dose',
    ],
    references: ['Neofax 2020', 'Tourneux et al. Pediatrics 2008'],
    calculate: (weight) => {
      const concMcgPerMl = 40;
      return {
        dosePerKg: '0.2–2 mcg/kg/min (initial and usual starting dose: 0.2–0.5 mcg/kg/min)',
        totalDose: `Start: ${(0.2 * weight).toFixed(3)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'CENTRAL IV only',
        concentration: `${concMcgPerMl} mcg/mL (4 mg in 100 mL NaCl 0.9%)`,
        volumePerDose: '—',
        basisNote: 'Titrate to MAP target (neonatal MAP goal typically ≥ GA in mmHg)',
        infusionNote: infusionRate(0.2, 0.35, 0.5, weight, concMcgPerMl),
        warningNote: 'CENTRAL LINE ONLY. Peripheral extravasation → severe tissue necrosis.',
      };
    },
  },

  {
    id: 'vasopressin',
    name: 'Vasopressin',
    category: 'Cardiovascular',
    indications: ['Catecholamine-refractory vasodilatory shock', 'Refractory septic shock', 'PPHN with systemic hypotension (relative vasopressin deficiency)'],
    administration: 'Continuous IV infusion via central line. Do not bolus.',
    monitoring: ['Arterial BP (arterial line)', 'Urine output (antidiuretic effect — fluid retention)', 'Sodium (hyponatraemia)', 'Peripheral ischaemia (mesenteric, digital)'],
    cautions: [
      'NOTE: NeoFax Essentials 2020 has no standalone vasopressin monograph (it only appears in passing within other drugs\' shock-algorithm tables) — this dosing is sourced from Meyer et al. below and has NOT been cross-verified against NeoFax',
      'May cause peripheral and mesenteric ischaemia at high doses',
      'SIADH-like effect — monitor sodium and fluid balance closely',
      'Does not replace volume resuscitation',
      'Titrate slowly — effects may take 30–60 min',
    ],
    references: ['Meyer et al. Pediatr Crit Care Med 2006', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const concUnitsPerMl = 0.4;
      const startRate = (0.01 * weight) / concUnitsPerMl;
      const maxRate = (0.04 * weight) / concUnitsPerMl;
      return {
        dosePerKg: '0.01–0.04 units/kg/h',
        totalDose: `Start: ${(0.01 * weight).toFixed(4)} units/h`,
        interval: 'Continuous infusion',
        route: 'Central IV',
        concentration: `${concUnitsPerMl} units/mL (20 units in 50 mL NaCl 0.9%)`,
        volumePerDose: '—',
        basisNote: 'Adjunct to catecholamines for vasodilatory shock',
        infusionNote: `At 0.01 units/kg/h: ${startRate.toFixed(2)} mL/h | At 0.02 units/kg/h: ${(startRate * 2).toFixed(2)} mL/h | At 0.04 units/kg/h: ${maxRate.toFixed(2)} mL/h`,
        warningNote: 'Monitor for hyponatraemia, oliguria, and mesenteric ischaemia.',
      };
    },
  },

  {
    id: 'furosemide',
    name: 'Furosemide',
    brandName: 'Lasix / Frusemide',
    category: 'Cardiovascular',
    indications: ['Fluid overload in BPD / chronic lung disease', 'Pulmonary oedema from PDA', 'Post-surgical fluid management', 'Hypertension'],
    administration: 'IV bolus over 5–10 min. PO once tolerated (less bioavailable than IV). Continuous infusion in fluid-restricted patients.',
    monitoring: ['Urine output (response within 1–2 h)', 'Electrolytes — Na, K, Cl (hypokalaemia, hypochloraemic alkalosis)', 'Renal function', 'Hearing (ototoxicity with prolonged/high doses)'],
    cautions: [
      'Hypokalaemia very common — supplement potassium if K < 3.5 mmol/L',
      'Ototoxicity with rapid infusion or aminoglycoside co-administration — give slowly',
      'Nephrocalcinosis with prolonged use — renal ultrasound after 4 weeks of chronic use',
      'Preterm: slower metabolism — q24h initial dosing',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma) => {
      const dose = 1;
      const total = weight * dose;
      const interval = pma < 31 ? 'q24h' : pma <= 36 ? 'q12–24h' : 'q6–12h';
      const basisNote = pma < 31 ? 'PMA < 31 wks (slow clearance — start q24h)' : pma <= 36 ? 'PMA 31–36 wks' : 'PMA ≥ 37 wks';
      return {
        dosePerKg: 'IV/IM: initial 1 mg/kg, max 2 mg/kg/dose | PO: max 6 mg/kg/dose (lower oral bioavailability needs a higher dose)',
        totalDose: `IV/IM: ${total.toFixed(1)} mg (max ${(weight * 2).toFixed(1)} mg) | PO max: ${(weight * 6).toFixed(1)} mg`,
        interval,
        route: 'IV over 5–10 min | IM | PO | Continuous infusion 0.1–0.4 mg/kg/h',
        concentration: '10 mg/mL (IV) | 10 mg/mL (oral solution)',
        volumePerDose: `IV (1 mg/kg): ${mL(total, 10)}`,
        basisNote,
        maxDose: `IV/IM: 2 mg/kg/dose | PO: 6 mg/kg/dose`,
        warningNote: 'Monitor electrolytes — hypokalaemia common. Ototoxicity risk with aminoglycosides.',
      };
    },
  },

  {
    id: 'digoxin',
    name: 'Digoxin',
    category: 'Cardiovascular',
    indications: ['SVT maintenance (rate control)', 'Heart failure with reduced ejection fraction'],
    administration: 'Digitalisation: 3 divided doses (½ → ¼ → ¼) over 24 h. IV over 10–20 min. PO for maintenance.',
    monitoring: ['Serum digoxin level: 6–8 h after last digitalising dose; target 0.8–2 ng/mL', 'ECG (PR prolongation, AV block, arrhythmia)', 'Electrolytes — hypokalaemia potentiates toxicity', 'Clinical: poor feeding, vomiting, bradycardia (toxicity signs)'],
    cautions: [
      'NARROW THERAPEUTIC INDEX — toxicity is common and dangerous',
      'Digitalising dose varies by gestation — use weight-based table below',
      'Hypokalaemia, hypercalcaemia, hypomagnesaemia → increased toxicity risk',
      'Toxicity: bradycardia, AV block, VT — stop drug, correct electrolytes, consider digoxin-specific antibody (DigiFab)',
      'Do NOT use in WPW — may increase ventricular rate in accessory pathway conduction',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma) => {
      let totalDigitalisingDose: number;
      let maintDose: number;
      let maintInterval: string;
      let basisNote: string;
      if (pma <= 29) {
        totalDigitalisingDose = 15; maintDose = 4; maintInterval = 'q24h'; basisNote = 'PMA ≤ 29 wks';
      } else if (pma <= 36) {
        totalDigitalisingDose = 20; maintDose = 5; maintInterval = 'q24h'; basisNote = 'PMA 30–36 wks';
      } else if (pma <= 48) {
        totalDigitalisingDose = 30; maintDose = 4; maintInterval = 'q12h'; basisNote = 'PMA 37–48 wks';
      } else {
        totalDigitalisingDose = 40; maintDose = 5; maintInterval = 'q12h'; basisNote = 'PMA ≥ 49 wks';
      }
      const totalMcg = weight * totalDigitalisingDose;
      const dose1 = totalMcg / 2;
      const dose2 = totalMcg / 4;
      const maintMcg = weight * maintDose;
      return {
        dosePerKg: `Digitalising total (IV): ${totalDigitalisingDose} mcg/kg | Maintenance (IV): ${maintDose} mcg/kg/dose ${maintInterval}`,
        totalDose: `Dose 1 (½): ${dose1.toFixed(1)} mcg | Dose 2 (¼): ${dose2.toFixed(1)} mcg | Dose 3 (¼): ${dose2.toFixed(1)} mcg | Maintenance: ${maintMcg.toFixed(1)} mcg/dose`,
        interval: `Doses 1–2–3 over 24h (0h, 8h, 16h) | Maintenance: ${maintInterval} (start ~12h after last digitalising dose)`,
        route: 'IV over 15–30 min | PO (maintenance — oral doses ~25% higher than IV)',
        concentration: '0.05 mg/mL = 50 mcg/mL (IV) | 0.05 mg/mL (elixir)',
        volumePerDose: `Dose 1: ${mL(dose1, 50)} | Maintenance: ${mL(maintMcg, 50)}`,
        basisNote,
        warningNote: 'NARROW THERAPEUTIC INDEX. Check level 6–8 h after digitalising. Check K⁺ — hypokalaemia → toxicity.',
      };
    },
  },

  {
    id: 'propranolol',
    name: 'Propranolol',
    category: 'Cardiovascular',
    indications: ['SVT maintenance / prophylaxis', 'Fallot spells (hypercyanotic)', 'Neonatal thyrotoxicosis', 'Infantile haemangioma'],
    administration: 'PO (preferred for maintenance). IV only in acute setting — very slowly over 5–10 min with resuscitation available.',
    monitoring: ['HR (target heart rate — not too slow)', 'BP', 'Blood glucose (hypoglycaemia risk, especially in neonates)', 'Respiratory — bronchospasm risk'],
    cautions: [
      'Contraindicated in: heart failure with reduced EF, bronchospasm/asthma, heart block',
      'Hypoglycaemia risk — especially with prolonged fasting or preterm; monitor glucose',
      'Withdrawal risk — never stop abruptly (rebound arrhythmia)',
      'Thyrotoxicosis dose: 1–2 mg/kg/day PO divided q6–8h',
      'Infantile haemangioma: SEPARATE escalating protocol — 0.6 → 1.1 → 1.7 mg/kg/dose BID, each step over ~1 week (~3 weeks total to reach maintenance)',
      'IV (acute only): start 0.01 mg/kg/dose q6h, max 0.15 mg/kg/dose q6h — much lower than oral doses',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const poStart = 0.25;
      const poMax = 3.5;
      const ivStart = 0.01;
      const ivMax = 0.15;
      const poStartTotal = weight * poStart;
      return {
        dosePerKg: `PO: ${poStart} mg/kg/dose (start) → titrate to max ${poMax} mg/kg/dose q6h | IV (acute only): ${ivStart} mg/kg/dose (start) → max ${ivMax} mg/kg/dose q6h`,
        totalDose: `PO starting: ${poStartTotal.toFixed(2)} mg | PO max: ${(weight * poMax).toFixed(2)} mg/dose | IV starting: ${(weight * ivStart).toFixed(3)} mg | IV max: ${(weight * ivMax).toFixed(2)} mg/dose`,
        interval: 'q6h (both PO and IV)',
        route: 'PO (preferred) | IV over 5–10 min with ECG monitoring (acute only — doses are much lower than oral)',
        concentration: '1 mg/mL (oral solution)',
        volumePerDose: `PO starting dose: ${mL(poStartTotal, 1)}`,
        basisNote: 'Start low (PO 0.25 mg/kg) — titrate up every 48–72 h based on response and HR. IV dosing is much lower than PO — do not confuse the two.',
        maxDose: `PO: ${poMax} mg/kg/dose q6h | IV: ${ivMax} mg/kg/dose q6h`,
        warningNote: 'Hypoglycaemia risk in neonates. Never stop abruptly. Contraindicated in heart failure / bronchospasm. Haemangioma dosing uses a different escalation protocol — see cautions.',
      };
    },
  },

  {
    id: 'paracetamol-pda',
    name: 'Paracetamol (PDA Closure)',
    brandName: 'Perfalgan / Ofirmev (IV) — PDA protocol',
    category: 'Cardiovascular',
    indications: ['Hemodynamically significant PDA in preterm infants (alternative to NSAIDs)', 'PDA closure when ibuprofen/indomethacin contraindicated (renal failure, thrombocytopenia), or when enteral feeding is not possible'],
    administration: 'ORAL is the NeoFax-recommended route. IV is a cited-study alternative for infants who cannot feed enterally (contraindication to feeding, or feeding intolerance) — NOT a separate NeoFax "boxed" dose recommendation the way the oral one is. There is no rectal (PR) regimen for PDA closure in NeoFax.',
    monitoring: ['LFTs before and after course (hepatotoxicity at these repeated doses)', 'Echo at 48 h to assess ductal response', 'Urine output (gentler on kidneys than NSAIDs)', 'Platelets (less effect than NSAIDs)'],
    cautions: [
      'ORAL (NeoFax\'s actual recommended PDA-closure dose): 15 mg/kg/dose q6h × 3 days; a second course may be required',
      'IV (from a specific cited RCT, offered when the infant cannot feed — NOT the same number as oral): 20 mg/kg loading dose, then 7.5 mg/kg/dose q6h × 4 days',
      'There is NO rectal (PR) PDA-closure regimen in NeoFax — do not use the fever/pain PR dose (30 mg/kg) for this indication',
      'Monitor LFTs — hepatotoxicity possible with repeated high-dose use',
      'Safer renal and platelet profile than ibuprofen/indomethacin',
      'Do NOT confuse with standard analgesic paracetamol dosing (see paracetamol-iv)',
    ],
    references: ['Neofax 2020', 'Oncel et al. J Pediatr 2013', 'Ohlsson & Shah Cochrane 2020'],
    calculate: (weight) => {
      const poDose = 15;
      const ivLoadDose = 20;
      const ivMaintDose = 7.5;
      const poTotal = weight * poDose;
      const ivLoadTotal = weight * ivLoadDose;
      const ivMaintTotal = weight * ivMaintDose;
      return {
        dosePerKg: 'Oral (primary route): 15 mg/kg/dose × 3 days | IV (feed-intolerant alternative, per cited RCT): 20 mg/kg load → 7.5 mg/kg/dose × 4 days',
        totalDose: `Oral: ${poTotal.toFixed(0)} mg/dose | IV load: ${ivLoadTotal.toFixed(0)} mg | IV maintenance: ${ivMaintTotal.toFixed(0)} mg/dose`,
        interval: 'q6h for both routes (Oral: 3 days | IV: load once, then q6h × 4 days)',
        route: 'Oral (NeoFax-recommended, first-line) OR IV (only if enteral route not possible) — NO rectal regimen for this indication',
        concentration: '10 mg/mL (IV)',
        volumePerDose: `Oral: ${mL(poTotal, 10)} | IV load: ${mL(ivLoadTotal, 10)} | IV maintenance: ${mL(ivMaintTotal, 10)}`,
        basisNote: 'Oral protocol (3 days) is the NeoFax-recommended route. IV protocol (load + 4 days) is a cited-study alternative for infants who cannot feed — not interchangeable at the same mg/kg.',
        maxDose: `${(weight * 60).toFixed(0)} mg/day (= 60 mg/kg/day) from all routes combined`,
        warningNote: 'PDA DOSE — not standard analgesic dose. Monitor LFTs. Check echo at 48 h. Oral and IV are NOT the same number, and there is no rectal option for this indication.',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTROLYTE & METABOLIC
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'calcium-gluconate',
    name: 'Calcium Gluconate 10%',
    category: 'Electrolyte & Metabolic',
    indications: ['Neonatal hypocalcaemia (symptomatic or total Ca < 1.75 mmol/L in preterm)', 'Cardiac arrest with confirmed hypocalcaemia', 'Hyperkalemia (cardiac membrane stabilisation)'],
    administration: 'IV over 10–20 min for treatment doses. Cardiac arrest: may give more rapidly but not as undiluted rapid push. Must be diluted in D5W or NaCl 0.9% for infusion.',
    monitoring: ['Serum calcium (ionised preferred: target iCa 1.1–1.3 mmol/L)', 'ECG during infusion (bradycardia, QT shortening)', 'IV site — extravasation causes severe tissue necrosis', 'Phosphate (balance with calcium)'],
    cautions: [
      '10% calcium gluconate = 100 mg salt/mL = 9.3 mg/mL elemental Ca = 0.46 mEq/mL',
      'Initial treatment dose (100–200 mg/kg = 1–2 mL/kg) is NOT the same as maintenance treatment dose (200–800 mg/kg/day = 2–8 mL/kg/day) — do not confuse the two',
      'Routine daily calcium requirement (2–4 mEq/kg/day preterm; 0.5–4 mEq/kg/day term) is a DIFFERENT, smaller figure — only for infants with no active hypocalcaemia to correct',
      'NEVER give undiluted rapid IV push in non-arrest setting — cardiac arrest risk',
      'Extravasation → severe tissue necrosis — central line strongly preferred',
      'Do not mix or co-infuse with ceftriaxone (fatal precipitate) or sodium bicarbonate (precipitates)',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const initLowML = 1 * weight;
      const initHighML = 2 * weight;
      const maintLowML = 2 * weight;
      const maintHighML = 8 * weight;
      return {
        dosePerKg: 'Initial treatment: 1–2 mL/kg/dose (100–200 mg/kg) | Maintenance treatment: 2–8 mL/kg/day (200–800 mg/kg/day)',
        totalDose: `Initial: ${initLowML.toFixed(1)}–${initHighML.toFixed(1)} mL/dose | Maintenance: ${maintLowML.toFixed(1)}–${maintHighML.toFixed(1)} mL/day`,
        interval: 'Initial: single dose over 10–60 min (repeat as needed) | Maintenance: continuous IV infusion ×3–5 days',
        route: 'IV over 10–60 min (diluted), or continuous infusion for maintenance. Central line preferred.',
        concentration: '10% = 100 mg salt/mL = 9.3 mg elemental Ca/mL = 0.46 mEq/mL',
        volumePerDose: `Initial: ${initLowML.toFixed(1)}–${initHighML.toFixed(1)} mL of 10% solution`,
        basisNote: 'Symptomatic hypocalcaemia: 1–2 mL/kg initial, then 2–8 mL/kg/day maintenance infusion.',
        warningNote: 'Extravasation → tissue necrosis. Never co-infuse with ceftriaxone or bicarbonate. Monitor HR — stop if bradycardic.',
      };
    },
  },

  {
    id: 'magnesium-sulfate',
    name: 'Magnesium Sulfate',
    category: 'Electrolyte & Metabolic',
    indications: ['Neonatal hypomagnesaemia (Mg < 0.6 mmol/L or symptomatic)', 'Adjunct in PPHN (bronchodilation + vasodilation)', 'Seizures secondary to hypomagnesaemia'],
    administration: 'IV/IO, diluted to 100–200 mg/mL. Infusion time depends on indication: pulseless torsades = rapid (over several minutes); torsades WITH pulses = 10–20 min; general hypomagnesaemia correction = 30–60 min. Do NOT use the slow 30–60 min rate for an unstable arrhythmia — it delays treatment.',
    monitoring: ['Serum magnesium (target 0.7–1.0 mmol/L)', 'Respiratory rate and SpO₂ (respiratory depression at high levels)', 'BP (vasodilation / hypotension)', 'Deep tendon reflexes (loss = early toxicity sign)', 'Urine output (renal excretion)'],
    cautions: [
      '50% MgSO₄ = 500 mg/mL = 2 mmol/mL — MUST dilute to 100–200 mg/mL before IV use',
      'Respiratory depression at levels > 3 mmol/L — have calcium gluconate (antidote) available',
      'Antidote for toxicity: calcium gluconate 2 mL/kg IV over 10 min',
      'Infusion time is indication-dependent — do not default to the slowest rate for pulseless torsades',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const doseLowMg = 25 * weight;
      const doseHighMg = 50 * weight;
      const vol50Low = doseLowMg / 500;
      const vol50High = doseHighMg / 500;
      return {
        dosePerKg: '25–50 mg/kg (same dose for all indications — infusion RATE differs by indication)',
        totalDose: `${doseLowMg.toFixed(0)}–${doseHighMg.toFixed(0)} mg (= ${vol50Low.toFixed(2)}–${vol50High.toFixed(2)} mL of 50% solution, diluted before use)`,
        interval: 'Pulseless torsades: rapid, over several minutes | Torsades w/ pulses: 10–20 min | Hypomagnesaemia: 30–60 min. PN maintenance requirement: 0.125–0.25 mmol/kg/day (separate, smaller figure).',
        route: 'IV/IO, diluted to 100–200 mg/mL. Rate depends on indication — see interval.',
        concentration: 'Dilute 50% (500 mg/mL) to 100–200 mg/mL before use',
        volumePerDose: `${vol50Low.toFixed(2)}–${vol50High.toFixed(2)} mL of 50% (must dilute before administering)`,
        basisNote: 'Antidote for toxicity: calcium gluconate 2 mL/kg IV',
        warningNote: 'MUST dilute before use. Match infusion time to indication — pulseless torsades needs rapid infusion, not 30–60 min.',
      };
    },
  },

  {
    id: 'sodium-bicarbonate',
    name: 'Sodium Bicarbonate',
    category: 'Electrolyte & Metabolic',
    indications: ['Metabolic acidosis (pH < 7.20 with base deficit > 10, adequate ventilation confirmed)', 'Cardiac arrest (after ventilation established)', 'Hyperkalaemia (emergency shift)', 'Sodium bicarbonate wash for UAC/UVC'],
    administration: 'IV over 30–60 min for metabolic acidosis. Cardiac arrest: may give as slow bolus over 2–5 min. Always use 4.2% (0.5 mmol/mL) in neonates — dilute 8.4% 1:1 with WFI.',
    monitoring: ['Blood gas 30–60 min after dose', 'Serum sodium (hypernatraemia)', 'Calcium (bicarb lowers ionised Ca)', 'IV site (hyperosmolar — extravasation risk)', 'Avoid in respiratory acidosis'],
    cautions: [
      'Use 4.2% (isotonic for neonates) — dilute 8.4% 1:1 with water for injection',
      'NEVER use in respiratory acidosis — worsens CO₂ retention',
      'Rapid infusion → IVH in preterm (hyperosmolarity)',
      'Metabolic acidosis dose: Base deficit × weight × 0.3 (give half over 30 min, reassess) — MAX 8 mEq/kg/day',
      'Cardiac arrest (simpler dosing, not the base-deficit formula): 1–2 mEq/kg IV/IO slowly, after ventilation established',
      'Do NOT mix with calcium in same line (precipitates)',
    ],
    references: ['Neofax 2020', 'NRP 8th edition 2021'],
    calculate: (weight) => {
      const baseDeficit = 10;
      const dose = baseDeficit * weight * 0.3;
      const halfDose = dose / 2;
      const arrestLow = weight * 1;
      const arrestHigh = weight * 2;
      const maxDaily = weight * 8;
      return {
        dosePerKg: 'Metabolic acidosis: Base Deficit × Weight × 0.3 mEq (give half first) | Cardiac arrest: 1–2 mEq/kg (simpler, separate dosing)',
        totalDose: `Example (BD = 10): ${dose.toFixed(1)} mEq total | Give ${halfDose.toFixed(1)} mEq first | Arrest dose: ${arrestLow.toFixed(1)}–${arrestHigh.toFixed(1)} mEq`,
        interval: 'Single correction then reassess blood gas',
        route: 'IV over 30–60 min (metabolic acidosis) | 2–5 min (cardiac arrest only)',
        concentration: '4.2% (0.5 mEq/mL) — dilute 8.4% 1:1 with WFI',
        volumePerDose: `Half-dose (${halfDose.toFixed(1)} mEq): ${(halfDose / 0.5).toFixed(1)} mL of 4.2% | Arrest dose: ${(arrestLow / 0.5).toFixed(1)}–${(arrestHigh / 0.5).toFixed(1)} mL of 4.2%`,
        basisNote: 'Give half → repeat blood gas → give remainder if still acidotic. Cardiac arrest uses the simpler 1–2 mEq/kg dose, not this formula.',
        maxDose: `${maxDaily.toFixed(1)} mEq/day (= 8 mEq/kg/day) — do not exceed`,
        warningNote: 'Use 4.2% ONLY. Rapid infusion → IVH. Never in respiratory acidosis. Dilutes ionised Ca.',
      };
    },
  },

  {
    id: 'dextrose-bolus',
    name: 'Dextrose 10% (Hypoglycaemia Bolus)',
    category: 'Electrolyte & Metabolic',
    indications: ['Symptomatic neonatal hypoglycaemia (BG < 47 mg/dL)', 'Asymptomatic hypoglycaemia not responding to feed', 'Hyperinsulinism — acute glucose rescue'],
    administration: 'IV over 5 min. Follow immediately with maintenance glucose infusion (GIR 6–8 mg/kg/min).',
    monitoring: ['Blood glucose at 30 min post-bolus (recheck)', 'Glucose infusion rate (GIR) and titration', 'Signs of hypoglycaemia resolution (jitteriness, lethargy, seizure)'],
    cautions: [
      'Use 10% dextrose — NEVER 50% (hyperosmolar → IVH, sclerosis)',
      'Bolus: 2 mL/kg of 10% dextrose = 200 mg/kg glucose',
      'Always follow with maintenance GIR — bolus alone is insufficient (rebound)',
      'GIR formula: GIR (mg/kg/min) = [rate (mL/h) × concentration (%)] ÷ [weight (kg) × 6]',
      'If unresponsive to 2 boluses → consider glucagon / hydrocortisone / diazoxide',
    ],
    references: ['NNF 9th ed. (2024)', 'PES Neonatal Hypoglycaemia Guidelines 2015'],
    calculate: (weight) => {
      const volML = 2 * weight;
      const gir6 = (weight * 6 * 6) / 10;
      const gir8 = (weight * 8 * 6) / 10;
      return {
        dosePerKg: '2 mL/kg of 10% dextrose (= 200 mg/kg glucose)',
        totalDose: `${volML.toFixed(1)} mL of 10% dextrose`,
        interval: 'Single bolus then start maintenance GIR',
        route: 'IV over 5 min (peripheral line acceptable)',
        concentration: '10% dextrose (100 mg/mL)',
        volumePerDose: `${volML.toFixed(1)} mL`,
        basisNote: `After bolus: start GIR 6 mg/kg/min = ${gir6.toFixed(1)} mL/h of 10% | GIR 8 = ${gir8.toFixed(1)} mL/h of 10%`,
        maxDose: '2 mL/kg per bolus dose (repeat once if needed at 30 min)',
        warningNote: '10% ONLY — never 50% dextrose in neonates. Always follow with maintenance infusion.',
      };
    },
  },

  {
    id: 'insulin-infusion',
    name: 'Insulin (Hyperglycaemia)',
    category: 'Electrolyte & Metabolic',
    indications: ['Neonatal hyperglycaemia (BG > 180–215 mg/dL) on TPN in ELBW/VLBW infants', 'Hyperglycaemia causing osmotic complications'],
    administration: 'Continuous IV infusion via syringe driver. Prime the line — insulin adsorbs to tubing.',
    monitoring: ['Blood glucose q30–60 min until stable, then q1–2h', 'Potassium (hypokalaemia with insulin)', 'Urine output', 'Signs of hypoglycaemia'],
    cautions: [
      'Insulin adsorbs to plastic tubing — fill (prime) the line with insulin solution and WAIT AT LEAST 20 MINUTES before connecting to patient (preconditioning saturates binding sites)',
      'Recommended standard neonatal concentration: 0.1 or 0.5 unit/mL (NOT 1 unit/mL)',
      'Start at low end (0.01–0.02 units/kg/h); titrate by 0.01 units/kg/h',
      'Target BG: 90–180 mg/dL (avoid tight control — hypoglycaemia risk)',
      'Hold if BG < 90 mg/dL; STOP if BG < 54 mg/dL and give dextrose bolus',
      'Do not reduce TPN glucose rate as the primary intervention — maintain adequate caloric delivery',
    ],
    references: ['Neofax 2020', 'ESPEN neonatal nutrition guidelines'],
    calculate: (weight) => {
      const startDose = 0.02;
      const startTotal = weight * startDose;
      const concUnitsPerMl = 0.5;
      return {
        dosePerKg: '0.01–0.1 units/kg/h (start: 0.01–0.02 units/kg/h)',
        totalDose: `Start: ${startTotal.toFixed(4)} units/h`,
        interval: 'Continuous infusion',
        route: 'IV via dedicated syringe driver',
        concentration: '0.5 unit/mL standard (or 0.1 unit/mL) — dilute 25 units in 50 mL NaCl 0.9% for 0.5 unit/mL',
        volumePerDose: `Start: ${(startTotal / concUnitsPerMl).toFixed(3)} mL/h | Max (0.1 units/kg/h): ${((weight * 0.1) / concUnitsPerMl).toFixed(3)} mL/h`,
        basisNote: 'Prime line and WAIT ≥ 20 minutes before connecting to patient. Target BG 90–180 mg/dL.',
        warningNote: 'Prime tubing and wait ≥ 20 min — insulin adsorbs to plastic. Check BG q30 min until stable. Hold if BG < 90 mg/dL.',
      };
    },
  },

  {
    id: 'iron',
    name: 'Iron (Supplementation)',
    category: 'Vitamin & Supplement',
    indications: ['Prevention of iron deficiency anaemia in preterm infants', 'Supplementation in VLBW infants on EPO'],
    administration: 'PO with feeds (better tolerance). Do not give IV unless PO not possible.',
    monitoring: ['Haemoglobin and reticulocyte count at 4–6 weeks', 'Ferritin if available (target > 30–50 mcg/L)', 'Gastrointestinal tolerance (constipation, stool colour change)'],
    cautions: [
      'Start at: 2–3 mg/kg/day elemental iron for preterm ≥ 1000 g (from ~2–4 weeks)',
      'VLBW (< 1000 g) or on EPO: 3–6 mg/kg/day elemental iron',
      'Continues until 12–24 months corrected age (or until iron stores adequate)',
      'Not needed while receiving blood transfusions (wait 1 week after last transfusion)',
    ],
    references: ['ESPGHAN 2021', 'NNF 9th ed. (2024)', 'AAP 2010'],
    calculate: (weight) => {
      const dose = weight < 1 ? 4 : 2.5;
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg/day elemental iron (${weight < 1 ? 'VLBW < 1 kg' : 'standard preterm'})`,
        totalDose: `${total.toFixed(1)} mg elemental iron/day`,
        interval: 'q24h (or divided q12h if GI intolerance)',
        route: 'PO with feeds',
        concentration: 'Ferrous sulfate drops: 15 mg elemental iron/1.5 mL',
        volumePerDose: `${(total / 10).toFixed(2)} mL/day (at 15 mg Fe/1.5 mL = 10 mg/mL)`,
        basisNote: weight < 1 ? 'VLBW < 1 kg or on EPO: 3–6 mg/kg/day' : 'Standard preterm: 2–3 mg/kg/day',
        maxDose: '6 mg/kg/day elemental iron',
      };
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL DRUGS (added following NeoFax 2020 accuracy audit)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'atropine',
    name: 'Atropine',
    category: 'Cardiovascular',
    indications: ['Symptomatic bradycardia (esp. drug-induced or vagal)', 'Premedication before intubation', 'Reducing muscarinic effects when reversing neuromuscular blockade with neostigmine'],
    administration: 'IV over 1 min. IM acceptable. ET route: immediately followed by 1 mL NS flush.',
    monitoring: ['Continuous ECG (arrhythmia, esp. in first 2 min post-dose)', 'HR response', 'Signs of anticholinergic excess (fever, flushing, ileus)'],
    cautions: [
      'Bradycardia: repeat q10–15min to effect, cumulative MAX 0.04 mg/kg',
      'Premedication dose (0.01–0.02 mg/kg) is LOWER than the bradycardia treatment dose (0.01–0.03 mg/kg)',
      'Paradoxical bradycardia/AV dissociation can occur in the first 2 minutes, more often with smaller doses',
      'Reduces bowel motility — may worsen ileus/abdominal distension',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const bradyLow = weight * 0.01;
      const bradyHigh = weight * 0.03;
      const premedLow = weight * 0.01;
      const premedHigh = weight * 0.02;
      const maxCumulative = weight * 0.04;
      const concMgPerMl = 0.1;
      return {
        dosePerKg: 'Bradycardia: 0.01–0.03 mg/kg | Premedication: 0.01–0.02 mg/kg',
        totalDose: `Bradycardia: ${bradyLow.toFixed(3)}–${bradyHigh.toFixed(3)} mg | Premedication: ${premedLow.toFixed(3)}–${premedHigh.toFixed(3)} mg`,
        interval: 'Bradycardia: repeat q10–15min PRN | Premedication: single dose immediately before other induction drugs',
        route: 'IV over 1 min (or IM)',
        concentration: `${concMgPerMl} mg/mL (0.05, 0.1, 0.4, 1 mg/mL formulations exist — confirm which is in hand)`,
        volumePerDose: `Bradycardia: ${mL(bradyLow, concMgPerMl)}–${mL(bradyHigh, concMgPerMl)} | Premedication: ${mL(premedLow, concMgPerMl)}–${mL(premedHigh, concMgPerMl)}`,
        basisNote: 'Confirm concentration before drawing up — multiple strengths exist (0.05/0.1/0.4/1 mg/mL).',
        maxDose: `Bradycardia cumulative max: ${maxCumulative.toFixed(3)} mg/kg`,
        warningNote: 'ECG monitoring — paradoxical bradycardia possible in first 2 min. Do not confuse premedication and bradycardia-treatment doses.',
      };
    },
  },

  {
    id: 'naloxone',
    name: 'Naloxone',
    category: 'Analgesic & Sedation',
    indications: ['Reversal of opioid-induced respiratory depression', 'Suspected opioid overdose'],
    administration: 'IV push preferred. IM/subQ acceptable if adequate perfusion. Tracheal administration NOT recommended.',
    monitoring: ['Respiratory rate and effort', 'SpO₂', 'Sedation level / return of opioid effect (naloxone is shorter-acting than most opioids — re-sedation can occur)'],
    cautions: [
      'NOT recommended as part of INITIAL delivery-room resuscitation for respiratory depression — restore heart rate and colour via ventilation FIRST',
      'Doses to reverse narcotic-induced respiratory depression may be as low as 0.01 mg/kg — start low and titrate to effect rather than always using the full 0.1 mg/kg',
      'Duration of action is SHORTER than most opioids — monitor for re-sedation/renarcotisation and redose or infuse as needed',
      'In infants with known/suspected maternal opioid exposure, abrupt full-dose reversal can precipitate acute withdrawal — consider the lower end of dosing',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const lowDose = weight * 0.01;
      const suggestedDose = weight * 0.1;
      const concMgPerMl = 0.4;
      return {
        dosePerKg: 'Suggested: 0.1 mg/kg IV push | May be as low as 0.01 mg/kg to reverse narcotic-induced depression',
        totalDose: `Low end: ${lowDose.toFixed(3)} mg | Suggested: ${suggestedDose.toFixed(2)} mg`,
        interval: 'Single dose, repeat/infuse as needed — duration is shorter than most opioids',
        route: 'IV push (preferred) | IM/subQ if adequate perfusion | NOT tracheal',
        concentration: `${concMgPerMl} mg/mL (also available as 1 mg/mL)`,
        volumePerDose: `Low end: ${mL(lowDose, concMgPerMl)} | Suggested: ${mL(suggestedDose, concMgPerMl)}`,
        basisNote: 'Consider starting at the lower end (0.01 mg/kg) and titrating, especially with known maternal opioid exposure.',
        warningNote: 'Do NOT use for initial delivery-room resuscitation — support ventilation first. Watch for re-sedation as naloxone wears off before the opioid does.',
      };
    },
  },

  {
    id: 'heparin',
    name: 'Heparin',
    category: 'Cardiovascular',
    indications: ['Maintaining patency of central or peripheral vascular catheters', 'Treatment of thrombosis'],
    administration: 'Continuous IV infusion for line patency and for treatment. Loading dose (treatment only) given over 10 min. Avoid IM (haematoma risk).',
    monitoring: ['aPTT 4h after starting treatment-dose infusion, then per protocol', 'Anti-factor Xa level if available (target 0.35–0.7 for treatment)', 'Signs of bleeding', 'Platelet count (heparin-induced thrombocytopenia, rare but serious)'],
    cautions: [
      'Line patency (central catheter): 0.5 units/kg/hour continuous infusion',
      'Line patency (peripheral): 0.5–1 unit/mL added to IV fluid — NOT the same as the central-line rate',
      'Treatment of thrombosis: 75 units/kg IV load over 10 min, then 28 units/kg/hour continuous — target aPTT 60–85 sec (anti-Xa 0.35–0.7)',
      'Treatment courses typically limited to 10–14 days; some switch to enoxaparin after 3–5 days',
      'Confirm correct concentration before drawing up — heparin concentration errors are a classic, serious neonatal medication error',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const patencyRate = weight * 0.5;
      const loadDose = weight * 75;
      const maintRate = weight * 28;
      return {
        dosePerKg: 'Line patency: 0.5 units/kg/h (central) | Treatment: 75 units/kg load → 28 units/kg/h',
        totalDose: `Patency: ${patencyRate.toFixed(2)} units/h | Treatment load: ${loadDose.toFixed(0)} units | Treatment maintenance: ${maintRate.toFixed(1)} units/h`,
        interval: 'Patency: continuous | Treatment: load once over 10 min, then continuous',
        route: 'IV (avoid IM — haematoma risk)',
        concentration: 'Loading: 100–500 units/mL | Maintenance infusion: 10–500 units/mL — confirm the exact concentration in use',
        volumePerDose: 'Depends on chosen concentration — verify against the actual infusion bag being used',
        basisNote: 'Line-patency dosing and treatment dosing are very different — confirm which indication applies before calculating.',
        warningNote: 'Heparin concentration mix-ups are a well-documented, serious neonatal medication error — independent double-check strongly recommended.',
      };
    },
  },

  {
    id: 'enoxaparin',
    name: 'Enoxaparin',
    brandName: 'Clexane / Lovenox',
    category: 'Cardiovascular',
    indications: ['Treatment of neonatal thrombosis', 'Low-risk thrombosis prophylaxis'],
    administration: 'SubQ injection only (NOT IV). Evaluate for bleeding disorder before starting unless urgently needed.',
    monitoring: ['Anti-factor Xa level (target 0.5–1.0 unit/mL treatment; 0.1–0.4 unit/mL prophylaxis) — takes several days to reach target range', 'Platelet count', 'Signs of bleeding'],
    cautions: [
      'Treatment dose is GESTATIONAL-AGE dependent: term infants 1.7 mg/kg/dose, preterm infants 2 mg/kg/dose — both subQ q12h',
      'Preterm infants often need quite variable doses (0.8–3 mg/kg q12h) to reach target anti-Xa — reassess and adjust, do not assume the starting dose is final',
      'Prophylaxis dose (0.75 mg/kg q12h) is LOWER than treatment dose — do not confuse the two',
      'Cannot be rapidly/completely reversed (unlike unfractionated heparin) — factor this into the risk assessment before starting',
    ],
    references: ['Neofax 2020'],
    calculate: (weight, pma) => {
      const isTerm = pma >= 37;
      const treatDose = isTerm ? 1.7 : 2;
      const treatTotal = weight * treatDose;
      const prophDose = 0.75;
      const prophTotal = weight * prophDose;
      return {
        dosePerKg: `Treatment: ${treatDose} mg/kg/dose (${isTerm ? 'term' : 'preterm'}) q12h | Prophylaxis: ${prophDose} mg/kg/dose q12h`,
        totalDose: `Treatment: ${treatTotal.toFixed(2)} mg/dose | Prophylaxis: ${prophTotal.toFixed(2)} mg/dose`,
        interval: 'q12h (both treatment and prophylaxis)',
        route: 'SubQ only — do NOT give IV',
        concentration: '100 mg/mL standard vial (dilute for accurate small-volume dosing)',
        volumePerDose: `Treatment: ${mL(treatTotal, 100)} | Prophylaxis: ${mL(prophTotal, 100)}`,
        basisNote: `${isTerm ? 'Term' : 'Preterm'} treatment starting dose shown — preterm infants often need dose adjustment (range 0.8–3 mg/kg q12h) to reach target anti-Xa.`,
        warningNote: 'SubQ ONLY — never IV. Reversal is incomplete/slow if bleeding occurs — weigh this before starting.',
      };
    },
  },

  {
    id: 'potassium-chloride',
    name: 'Potassium Chloride',
    category: 'Electrolyte & Metabolic',
    indications: ['Treatment of hypokalaemia', 'Routine potassium replacement/maintenance'],
    administration: 'IV infusion (never IV push/bolus) or PO with feeds. Central line required for concentrated solutions.',
    monitoring: ['Serum potassium before and during correction', 'Continuous ECG during IV correction (arrhythmia risk)', 'Renal function — contraindicated in renal failure', 'IV site (peripheral concentrated solutions cause thrombophlebitis)'],
    cautions: [
      'Contraindicated in renal failure',
      'MAXIMUM infusion rate: 1 mEq/kg/hour — never exceed',
      'Peripheral line: preferred concentration 40 mEq/L, max 60–80 mEq/L. Central line: max 200 mEq/L.',
      'Rapid/concentrated IV push can cause fatal arrhythmia/cardiac arrest — NEVER give as a bolus',
      'Use with caution alongside potassium-sparing diuretics (e.g. spironolactone)',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const acuteLow = weight * 0.5;
      const acuteHigh = weight * 1;
      const dailyLow = weight * 2;
      const dailyHigh = weight * 4;
      const maxRate = weight * 1;
      return {
        dosePerKg: 'Acute symptomatic hypokalaemia: 0.5–1 mEq/kg IV over 1h | Daily requirement: 2–4 mEq/kg/day IV | Oral replacement: 0.5–1 mEq/kg/day',
        totalDose: `Acute: ${acuteLow.toFixed(2)}–${acuteHigh.toFixed(2)} mEq over 1h | Daily requirement: ${dailyLow.toFixed(2)}–${dailyHigh.toFixed(2)} mEq/day`,
        interval: 'Acute: single infusion over 1h, then reassess | Daily requirement: continuous/divided',
        route: 'IV infusion only (never push) or PO with feeds',
        concentration: 'Peripheral: 40 mEq/L (max 60–80) | Central: max 200 mEq/L',
        volumePerDose: 'Depends on chosen infusion concentration — verify against the actual bag/pump setting',
        basisNote: `Maximum infusion rate: ${maxRate.toFixed(2)} mEq/h — never exceed regardless of urgency.`,
        maxDose: `${maxRate.toFixed(2)} mEq/kg/hour maximum infusion rate`,
        warningNote: 'NEVER give as IV push/bolus — fatal arrhythmia risk. Contraindicated in renal failure. Continuous ECG during correction.',
      };
    },
  },

  {
    id: 'rocuronium',
    name: 'Rocuronium',
    category: 'Analgesic & Sedation',
    indications: ['Neuromuscular blockade for endotracheal intubation', 'Ongoing paralysis during mechanical ventilation (adjunct to sedation)'],
    administration: 'IV push over 5–10 sec (intubation dose). Continuous infusion for maintenance paralysis. MUST be accompanied by adequate analgesia/sedation — rocuronium has no sedative or analgesic effect of its own.',
    monitoring: ['Train-of-four (TOF) monitoring if available', 'HR and BP', 'Adequacy of sedation/analgesia (paralysis can mask pain and distress)', 'Ventilation adequacy (patient cannot breathe or signal distress while paralysed)'],
    cautions: [
      'MUST give adequate sedation/analgesia first or alongside — paralysis without sedation is inhumane and can cause awareness during procedures',
      'NeoFax notes it is not recommended for rapid sequence intubation in paediatric patients generally, though it is commonly used for premedicated NICU intubation in practice — follow local protocol',
      'Onset ~60–75 seconds at intubation doses',
      'Recovery from a single dose can take 60–100 minutes — plan accordingly if a short procedure is intended',
    ],
    references: ['Neofax 2020'],
    calculate: (weight) => {
      const intubationDose = 0.6;
      const intubationLow = 0.45;
      const maintBolus = 0.15;
      const infLow = 7;
      const infHigh = 10;
      const intubationTotal = weight * intubationDose;
      const intubationLowTotal = weight * intubationLow;
      const maintBolusTotal = weight * maintBolus;
      const concMgPerMl = 10;
      return {
        dosePerKg: `Intubation: ${intubationLow}–${intubationDose} mg/kg | Maintenance bolus: ${maintBolus} mg/kg at return of T3 | Infusion: ${infLow}–${infHigh} mcg/kg/min`,
        totalDose: `Intubation: ${intubationLowTotal.toFixed(2)}–${intubationTotal.toFixed(2)} mg | Maintenance bolus: ${maintBolusTotal.toFixed(2)} mg | Infusion: ${((infLow * weight) / 1000).toFixed(3)}–${((infHigh * weight) / 1000).toFixed(3)} mg/min`,
        interval: 'Intubation: single dose | Maintenance: redose at return of neuromuscular function (T3), or continuous infusion',
        route: 'IV push over 5–10 sec (intubation) | Continuous IV (maintenance, dilute to ≤ 5 mg/mL)',
        concentration: `${concMgPerMl} mg/mL (undiluted) — dilute to ≤ 5 mg/mL for continuous infusion`,
        volumePerDose: `Intubation: ${mL(intubationLowTotal, concMgPerMl)}–${mL(intubationTotal, concMgPerMl)} | Maintenance bolus: ${mL(maintBolusTotal, concMgPerMl)}`,
        basisNote: 'Onset ~60–75 sec. Recovery from a single dose can take 60–100 min.',
        warningNote: 'NEVER give without adequate sedation/analgesia already on board. Patient cannot breathe or communicate distress while paralysed.',
      };
    },
  },

  {
    id: 'nitric-oxide',
    name: 'Inhaled Nitric Oxide (iNO)',
    category: 'Respiratory',
    indications: ['Persistent Pulmonary Hypertension of the Newborn (PPHN) with oxygenation index > 25', 'Term/near-term hypoxaemic respiratory failure to reduce need for ECMO'],
    administration: 'Inhaled via ventilator circuit, dose expressed in ppm (parts per million) — NOT a weight-based mg/kg drug.',
    monitoring: ['Pre/post-ductal SpO₂', 'Methaemoglobin level (iNO toxicity)', 'NO₂ level in circuit', 'Oxygenation index trend', 'Rebound pulmonary hypertension on withdrawal — wean slowly, do not stop abruptly'],
    cautions: [
      'Dosing is in ppm, NOT mg/kg — this is a gas concentration, not a weight-based drug',
      'Evidence does NOT support use in preterm infants < 34 weeks GA for respiratory failure/BPD prevention — reserve for term/near-term PPHN per current evidence',
      'Start 20 ppm (max 20 ppm). If PaO2 ≥ 60 torr within 4h, decrease to 5 ppm and wean FiO2 as tolerated.',
      'Wean 1 ppm increments approximately q4h once FiO2 < 0.6 and ventilatory support has been decreased. Discontinue when stable on 1 ppm for 4h.',
      'Usual treatment course < 4 days — if not weanable by day 4, investigate for other underlying disease',
      'NEVER stop abruptly — rebound pulmonary hypertension can be severe and life-threatening',
    ],
    references: ['Neofax 2020'],
    calculate: () => {
      return {
        dosePerKg: '20 ppm start (NOT weight-based — gas concentration)',
        totalDose: 'Start 20 ppm → 5 ppm once PaO2 ≥ 60 torr within 4h → wean by 1 ppm q4h once FiO2 < 0.6',
        interval: 'Continuous inhalation via ventilator circuit; wean per protocol above',
        route: 'Inhaled, via ventilator circuit',
        concentration: 'N/A — gas-phase ppm concentration, not a liquid drug concentration',
        volumePerDose: 'N/A',
        basisNote: 'Restricted to term/near-term PPHN per current evidence — not indicated for preterm <34wk GA respiratory failure.',
        maxDose: '20 ppm maximum',
        warningNote: 'Do NOT stop abruptly — rebound pulmonary hypertension risk. Monitor methaemoglobin. Not weight-based.',
      };
    },
  },
];
