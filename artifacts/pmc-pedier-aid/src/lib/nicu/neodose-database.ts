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
      } else if (pma < 45) {
        interval = 'q8h';
        basisNote = 'PMA 37–44 wks';
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
    references: ['NNF 9th ed. (2024)', 'Neofax 2023', 'BNFc 2024'],
    calculate: (weight, pma) => {
      let dose: number;
      let interval: string;
      let basisNote: string;
      if (pma < 28) {
        dose = 5; interval = 'q48h'; basisNote = 'PMA < 28 wks';
      } else if (pma <= 32) {
        dose = 4.5; interval = 'q36h'; basisNote = 'PMA 28–32 wks';
      } else if (pma <= 36) {
        dose = 4; interval = 'q24h'; basisNote = 'PMA 33–36 wks';
      } else {
        dose = 4; interval = 'q24h'; basisNote = 'PMA ≥ 37 wks';
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
      'AUC-guided dosing preferred: AUC/MIC target 400–600 (for MIC ≤ 1 mg/L)',
      'Trough (pre-dose 4 if AUC not available): target 10–15 mg/L',
      'Serum creatinine and urine output every 48–72 h',
    ],
    cautions: [
      'Red man syndrome (flushing, rash) — slow infusion, not a true allergy',
      'Nephrotoxic — avoid concurrent aminoglycosides if possible',
      'Dose based on PMA; adjust after TDM results',
    ],
    references: ['ASHP/IDSA/SIDP Vancomycin TDM guidelines 2020', 'Neofax 2023', 'NNF 9th ed.'],
    calculate: (weight, pma) => {
      let dose: number;
      let interval: string;
      let basisNote: string;
      if (pma < 27) {
        dose = 20; interval = 'q18h'; basisNote = 'PMA < 27 wks';
      } else if (pma <= 29) {
        dose = 20; interval = 'q18h'; basisNote = 'PMA 27–29 wks';
      } else if (pma <= 34) {
        dose = 20; interval = 'q12h'; basisNote = 'PMA 30–34 wks';
      } else if (pma <= 42) {
        dose = 20; interval = 'q8h'; basisNote = 'PMA 35–42 wks';
      } else {
        dose = 15; interval = 'q6h'; basisNote = 'PMA ≥ 43 wks';
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
        warningNote: 'Starting dose only — adjust after TDM (AUC-guided preferred).',
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
      'Meningitis dose: 100,000 units/kg/dose q6h (all ages)',
      'Syphilis: 50,000 units/kg/dose q12h (PMA < 29w) to q6h (term) × 10 days',
      'High doses: monitor sodium (large sodium load)',
    ],
    references: ['NNF 9th ed. (2024)', 'CDC Congenital Syphilis guidelines 2021'],
    calculate: (weight, pma, pna) => {
      const dose = 50000;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pma < 29) {
        interval = pna <= 28 ? 'q12h' : 'q8h';
        basisNote = `PMA < 29 wks, PNA ${pna <= 28 ? '≤ 28d' : '> 28d'}`;
      } else if (pma <= 36) {
        interval = pna <= 7 ? 'q12h' : 'q8h';
        basisNote = `PMA 29–36 wks, PNA ${pna <= 7 ? '≤ 7d' : '> 7d'}`;
      } else {
        interval = 'q6h';
        basisNote = 'PMA ≥ 37 wks';
      }
      const totalMg = total / 1000;
      return {
        dosePerKg: '50,000 units/kg (= 30 mg/kg)',
        totalDose: `${total.toLocaleString()} units (${totalMg.toFixed(0)} mg)`,
        interval,
        route: 'IV / IM',
        concentration: '600,000 units/mL (= 360 mg/mL)',
        volumePerDose: mL(totalMg, 360),
        basisNote,
        warningNote: 'Meningitis: 100,000 units/kg/dose q6h. Syphilis: see cautions.',
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      const dose = 100;
      const total = weight * dose;
      const interval = pma < 36 ? 'q12h' : 'q8h';
      const basisNote = pma < 36 ? 'PMA < 36 wks' : 'PMA ≥ 36 wks';
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      const dose = 20;
      const total = weight * dose;
      const interval = pma < 32 ? 'q12h' : 'q8h';
      const basisNote = pma < 32 ? 'PMA < 32 wks' : 'PMA ≥ 32 wks';
      return {
        dosePerKg: '20 mg/kg',
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV over 30 min',
        concentration: '50 mg/mL (reconstituted)',
        volumePerDose: mL(total, 50),
        basisNote,
        warningNote: 'Meningitis: 40 mg/kg/dose. Confirm carbapenem indication before use.',
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      const dose = 50;
      const total = weight * dose;
      let interval: string;
      let basisNote: string;
      if (pma < 29) {
        interval = 'q12h'; basisNote = 'PMA < 29 wks';
      } else if (pma <= 35) {
        interval = 'q8h'; basisNote = 'PMA 29–35 wks';
      } else {
        interval = 'q6h'; basisNote = 'PMA ≥ 36 wks';
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma, pna) => {
      let dose: number;
      let interval: string;
      let basisNote: string;
      if (pma < 26) {
        dose = 7.5; interval = 'q48h'; basisNote = 'PMA < 26 wks';
      } else if (pma <= 29) {
        if (pna < 7) { dose = 7.5; interval = 'q24h'; basisNote = 'PMA 26–29 wks, PNA < 7d'; }
        else { dose = 7.5; interval = 'q12h'; basisNote = 'PMA 26–29 wks, PNA ≥ 7d'; }
      } else {
        dose = 7.5; interval = 'q12h'; basisNote = 'PMA ≥ 30 wks';
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg`,
        totalDose: `${total.toFixed(1)} mg`,
        interval,
        route: 'IV over 30 min',
        concentration: '5 mg/mL',
        volumePerDose: mL(total, 5),
        basisNote,
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
      'Prophylaxis dose: 3–6 mg/kg q72h (PMA < 29w) or q48h (PMA 29–36w)',
      'Treatment dose: 12 mg/kg loading, then 12 mg/kg q24h',
      'Drug interactions: increases levels of many drugs via CYP2C9/3A4',
      'QT prolongation risk — check concurrent drugs',
    ],
    references: ['ESPID neonatal candidiasis guidelines 2021', 'NNF 9th ed. (2024)'],
    calculate: (weight, pma) => {
      const loadDose = 12;
      const maintDose = 12;
      const total = weight * loadDose;
      const interval = pma < 29 ? 'q72h (prophylaxis) / q24h (treatment)' : pma <= 36 ? 'q48h (prophylaxis) / q24h (treatment)' : 'q24h';
      const basisNote = pma < 29 ? 'PMA < 29 wks (treatment: q24h)' : pma <= 36 ? 'PMA 29–36 wks' : 'PMA > 36 wks';
      return {
        dosePerKg: `Loading: ${loadDose} mg/kg → Maintenance: ${maintDose} mg/kg`,
        totalDose: `Loading: ${total.toFixed(0)} mg → Maintenance: ${(weight * maintDose).toFixed(0)} mg`,
        interval,
        route: 'IV / PO',
        concentration: '2 mg/mL (IV)',
        volumePerDose: `Loading: ${mL(total, 2)} | Maintenance: ${mL(weight * maintDose, 2)}`,
        basisNote,
        warningNote: 'Prophylaxis dose lower (3–6 mg/kg). Treatment requires loading dose.',
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
      'Disseminated / CNS HSV: 20 mg/kg q8h × 21 days',
      'SEM (skin/eye/mouth) HSV: 20 mg/kg q8h × 14 days',
      'Renal failure: increase interval (q12h or q24h) — dose unchanged',
      'Crystalluria with rapid infusion or poor hydration',
    ],
    references: ['AAP Red Book 2024', 'NNF 9th ed.'],
    calculate: (weight) => {
      const dose = 20;
      const total = weight * dose;
      return {
        dosePerKg: '20 mg/kg',
        totalDose: `${total.toFixed(0)} mg`,
        interval: 'q8h',
        route: 'IV over 1 hour',
        concentration: '5 mg/mL (standard dilution)',
        volumePerDose: mL(total, 5),
        basisNote: 'Disseminated/CNS: × 21 days | SEM: × 14 days',
        warningNote: 'Ensure hydration ≥ 2 mL/kg/h. Renally cleared — adjust interval if AKI.',
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
      'Maintenance: 3–4 mg/kg/day — start 24 h after loading',
      'Respiratory depression risk — have bag/mask ready for loading dose',
      'Half-life very long in neonates (60–100 h)',
    ],
    references: ['NNF 9th ed. (2024)', 'ILAE neonatal seizure guidelines 2021'],
    calculate: (weight) => {
      const loadDose = 20;
      const maintDose = 3.5;
      const loadTotal = weight * loadDose;
      const maintTotal = weight * maintDose;
      return {
        dosePerKg: `Load: ${loadDose} mg/kg | Maintenance: 3–4 mg/kg/day`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg | Maintenance: ${maintTotal.toFixed(1)} mg/day`,
        interval: 'Load: single dose (repeat 10 mg/kg × 2 if needed) | Maintenance: q24h',
        route: 'IV over 20–30 min',
        concentration: '15 mg/mL',
        volumePerDose: `Load: ${mL(loadTotal, 15)} | Maintenance: ${mL(maintTotal, 15)}`,
        basisNote: 'Cumulative max load: 40 mg/kg. Maintenance starts 24 h after load.',
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
      'Loading dose 20–40 mg/kg; evidence base for neonates growing',
      'Maintenance: 10 mg/kg q12h, titrating to 30 mg/kg q12h if needed',
      'Better tolerability than phenobarbital (less sedation/respiratory depression)',
      'Renally excreted — increase interval if oliguria or AKI',
    ],
    references: ['NNF 9th ed. (2024)', 'NEOLEV2 trial (Sharpe et al. JAMA 2020)'],
    calculate: (weight) => {
      const loadDose = 30;
      const maintDose = 10;
      const loadTotal = weight * loadDose;
      const maintTotal = weight * maintDose;
      return {
        dosePerKg: `Load: ${loadDose} mg/kg | Maintenance: 10–30 mg/kg/dose`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg | Maintenance: ${maintTotal.toFixed(0)}–${(weight * 30).toFixed(0)} mg`,
        interval: 'Load: single dose | Maintenance: q12h',
        route: 'IV over 15 min',
        concentration: '100 mg/mL (undiluted; dilute 1:1 with NaCl 0.9% for small doses)',
        volumePerDose: `Load: ${mL(loadTotal, 100)} | Maintenance: ${mL(maintTotal, 100)}`,
        basisNote: 'Starting maintenance 10 mg/kg q12h — titrate up based on EEG response',
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
      'Infusion accumulates with prolonged use (fat-soluble)',
      'Infusion dose: 0.01–0.06 mg/kg/h; titrate to seizure control',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight) => {
      const bolusDose = 0.1;
      const infMinDose = 0.01;
      const infMaxDose = 0.06;
      const bolusTotal = weight * bolusDose;
      const infConcMgPerMl = 1;
      const infMinRate = (infMinDose * weight) / infConcMgPerMl;
      const infMaxRate = (infMaxDose * weight) / infConcMgPerMl;
      return {
        dosePerKg: `Bolus: 0.1 mg/kg | Infusion: 0.01–0.06 mg/kg/h`,
        totalDose: `Bolus: ${bolusTotal.toFixed(2)} mg | Infusion: ${(weight * infMinDose).toFixed(3)}–${(weight * infMaxDose).toFixed(3)} mg/h`,
        interval: 'Bolus PRN | Infusion continuous',
        route: 'IV',
        concentration: '1 mg/mL (diluted)',
        volumePerDose: `Bolus: ${mL(bolusTotal, 1)} | Infusion: ${infMinRate.toFixed(2)}–${infMaxRate.toFixed(2)} mL/h`,
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
    references: ['NNF 9th ed. (2024)', 'Neofax 2023'],
    calculate: (weight) => {
      const concMcgPerMl = 800;
      return {
        dosePerKg: '5–20 mcg/kg/min',
        totalDose: `Start: ${(5 * weight).toFixed(0)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'IV (central or peripheral)',
        concentration: `${concMcgPerMl} mcg/mL (40 mg in 50 mL D5W)`,
        volumePerDose: '—',
        basisNote: 'Primarily inotropic — may drop BP via vasodilation',
        infusionNote: infusionRate(5, 10, 20, weight, concMcgPerMl),
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
      'ET route not recommended (unreliable absorption)',
      'Peripheral infusion risk: extravasation causes severe necrosis',
      'High doses cause tachyarrhythmia and hypertension',
    ],
    references: ['NRP 8th edition 2021', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const arrestDose = 0.01;
      const arrestTotal = weight * arrestDose;
      const concMcgPerMl = 20;
      return {
        dosePerKg: 'Arrest: 0.01–0.03 mg/kg | Infusion: 0.05–1 mcg/kg/min',
        totalDose: `Arrest: ${arrestTotal.toFixed(3)}–${(weight * 0.03).toFixed(3)} mg | Infusion: ${(0.05 * weight).toFixed(3)}–${(1 * weight).toFixed(2)} mcg/min`,
        interval: 'Arrest: q3–5 min | Infusion: continuous',
        route: 'IV/IO (arrest); Central IV (infusion)',
        concentration: 'Arrest: 1:10,000 (0.1 mg/mL) | Infusion: 20 mcg/mL standard',
        volumePerDose: `Arrest (1:10,000): ${mL(arrestTotal, 0.1)} per dose`,
        basisNote: 'Arrest: IV preferred; ETT not recommended',
        infusionNote: infusionRate(0.1, 0.3, 1, weight, concMcgPerMl),
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
      'Loading dose (50 mcg/kg over 30–60 min) risks severe hypotension — often omitted in neonates',
    ],
    references: ['NNF 9th ed. (2024)', 'Bassler et al. NEJM 2015'],
    calculate: (weight) => {
      const concMcgPerMl = 200;
      return {
        dosePerKg: '0.25–0.75 mcg/kg/min (usual start: 0.33 mcg/kg/min)',
        totalDose: `Start: ${(0.33 * weight).toFixed(3)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'Central IV preferred',
        concentration: `${concMcgPerMl} mcg/mL (10 mg in 50 mL D5W)`,
        volumePerDose: '—',
        basisNote: 'PDE-3 inhibitor — inotropy + vasodilation (lusitropy)',
        infusionNote: infusionRate(0.25, 0.5, 0.75, weight, concMcgPerMl),
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
    administration: 'Rapid IV push via largest most proximal vein, followed immediately by 2–5 mL saline flush. Nearest port to cannula.',
    monitoring: ['Continuous ECG during administration', 'BP'],
    cautions: [
      'Half-life < 10 seconds — must flush immediately after dose',
      'Transient AV block and asystole expected — resolves rapidly',
      'If no response: double dose and repeat; max single dose 0.5 mg/kg',
      'Contraindicated in WPW with atrial fibrillation (may precipitate VF)',
    ],
    references: ['NNF 9th ed. (2024)', 'PALS 2020 guidelines'],
    calculate: (weight) => {
      const dose1 = 0.1;
      const dose2 = 0.2;
      const dose3 = 0.3;
      const total1 = weight * dose1;
      return {
        dosePerKg: '0.1 mg/kg → double each time → max 0.5 mg/kg',
        totalDose: `1st dose: ${total1.toFixed(2)} mg | 2nd: ${(weight * dose2).toFixed(2)} mg | 3rd: ${(weight * dose3).toFixed(2)} mg`,
        interval: 'Repeat q1–2 min if no conversion (doubling dose)',
        route: 'Rapid IV push — flush immediately with 2–5 mL saline',
        concentration: '3 mg/mL (undiluted) or dilute to 0.3 mg/mL for small volumes',
        volumePerDose: `1st dose: ${mL(total1, 3)} (undiluted) | or ${mL(total1, 0.3)} (diluted 0.3 mg/mL)`,
        basisNote: 'Must be proximal vein + immediate saline flush',
        maxDose: '0.5 mg/kg per dose (or 12 mg absolute max)',
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
      'Vasopressor shock: 1–2 mg/kg/dose q6–12h — aim to wean vasopressors',
      'Physiologic adrenal insufficiency: 8–10 mg/m²/day divided q8h',
      'BPD/CLD: 1–2 mg/kg/day — use lowest effective dose; avoid prolonged courses',
      'Risk of spontaneous intestinal perforation with concurrent indomethacin',
    ],
    references: ['NNF 9th ed. (2024)', 'Subhedar et al. Cochrane 2023'],
    calculate: (weight) => {
      const dose = 1;
      const total = weight * dose;
      return {
        dosePerKg: '1–2 mg/kg/dose (shock) | 8–10 mg/m²/day (physiologic)',
        totalDose: `${total.toFixed(0)}–${(weight * 2).toFixed(0)} mg/dose (1–2 mg/kg/dose)`,
        interval: 'q6–12h (shock); q8h (physiologic)',
        route: 'IV over 5–15 min',
        concentration: '50 mg/mL (reconstituted)',
        volumePerDose: `${mL(total, 50)}–${mL(weight * 2, 50)}`,
        basisNote: 'Shock: 1–2 mg/kg | Adrenal insufficiency: 8–10 mg/m²/day | BPD: 1 mg/kg/day',
        warningNote: 'Risk of intestinal perforation with concurrent NSAIDs (indomethacin).',
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
      'Start low: 0.5 mg/kg q6–8h PO; titrate to 1–2 mg/kg q6–8h',
      'IV dose = 0.4 mg/kg over 3 hours (then 1.6 mg/kg/day by continuous infusion)',
      'Systemic hypotension — monitor BP closely at start',
      'Do NOT use in combination with iNO without caution (rebound PPHN on withdrawal)',
      'Avoid if systemic hypotension or obstructive physiology',
    ],
    references: ['NNF 9th ed. (2024)', 'TOBY-Silo trial (Steinhorn et al.)'],
    calculate: (weight) => {
      const dosePerKg = 0.5;
      const total = weight * dosePerKg;
      return {
        dosePerKg: '0.5 mg/kg/dose (start) → titrate to 1–2 mg/kg/dose',
        totalDose: `Starting: ${total.toFixed(2)} mg/dose | Max: ${(weight * 2).toFixed(1)} mg/dose`,
        interval: 'q6–8h PO',
        route: 'PO (preferred) or IV over 3 h',
        concentration: '10 mg/mL (oral suspension) | 0.8 mg/mL (IV)',
        volumePerDose: `PO: ${mL(total, 10)} | IV: ${mL(total, 0.8)}`,
        basisNote: 'Start 0.5 mg/kg; titrate up based on SpO₂ / OI response over 24–48 h',
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
      'DART protocol: 0.15 mg/kg/day × 3d → 0.1 mg/kg/day × 3d → 0.05 mg/kg/day × 2d → 0.02 mg/kg/day × 2d',
      'Short low-dose course has acceptable neurodevelopmental safety profile (DART trial)',
      'High-dose / long courses associated with cerebral palsy risk — do not exceed DART dosing',
      'Avoid in first week of life (necrotising enterocolitis risk)',
    ],
    references: ['DART trial (Doyle et al. Lancet 2006)', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const d1 = weight * 0.15;
      const d2 = weight * 0.1;
      const d3 = weight * 0.05;
      const d4 = weight * 0.02;
      return {
        dosePerKg: 'DART: 0.15 → 0.1 → 0.05 → 0.02 mg/kg/day',
        totalDose: `Days 1–3: ${d1.toFixed(3)} mg | Days 4–6: ${d2.toFixed(3)} mg | Days 7–8: ${d3.toFixed(3)} mg | Days 9–10: ${d4.toFixed(3)} mg`,
        interval: 'q24h (once daily)',
        route: 'IV over 15 min or PO',
        concentration: '4 mg/mL (IV)',
        volumePerDose: `Days 1–3: ${mL(d1, 4)} | Days 4–6: ${mL(d2, 4)} | Days 7–8: ${mL(d3, 4)} | Days 9–10: ${mL(d4, 4)}`,
        basisNote: '10-day course. Use only DART dosing — higher doses carry neurodevelopmental risk.',
        warningNote: 'Hyperglycaemia, hypertension, infection risk. Do not use in first week of life.',
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
      'Bolus in ventilated infants: 0.05–0.1 mg/kg q4–6h PRN',
      'Infusion: 0.01–0.02 mg/kg/h (non-ventilated infants at low end)',
      'Respiratory depression — have naloxone available (0.01 mg/kg IV)',
      'Accumulates with organ immaturity — use lowest effective dose, frequent reassessment',
      'NAS/NOWS oral morphine: specialist dosing protocol',
    ],
    references: ['NNF 9th ed. (2024)', 'NEOPAIN trial (Anand et al.)'],
    calculate: (weight) => {
      const bolusDose = 0.1;
      const infMinDose = 0.01;
      const infMaxDose = 0.02;
      const bolusTotal = weight * bolusDose;
      const infMin = weight * infMinDose;
      const infMax = weight * infMaxDose;
      return {
        dosePerKg: 'Bolus: 0.05–0.1 mg/kg | Infusion: 0.01–0.02 mg/kg/h',
        totalDose: `Bolus: ${(weight * 0.05).toFixed(3)}–${bolusTotal.toFixed(3)} mg | Infusion: ${infMin.toFixed(4)}–${infMax.toFixed(4)} mg/h`,
        interval: 'Bolus: q4–6h PRN | Infusion: continuous',
        route: 'IV (bolus over 5–10 min)',
        concentration: '1 mg/mL (standard dilution)',
        volumePerDose: `Bolus (0.1 mg/kg): ${mL(bolusTotal, 1)} | Infusion: ${infMin.toFixed(3)}–${infMax.toFixed(3)} mL/h`,
        basisNote: 'Non-ventilated: lower end only. Ventilated: can use higher end.',
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
      'Shorter duration of action than morphine (preferred for procedures)',
      'Tolerance develops rapidly with continuous infusion — wean slowly',
      'Renally cleared metabolites can accumulate in renal failure',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight) => {
      const bolusDose = 2;
      const infMinDose = 1;
      const infMaxDose = 4;
      const bolusTotal = weight * bolusDose;
      const concMcgPerMl = 50;
      return {
        dosePerKg: 'Bolus: 1–4 mcg/kg | Infusion: 1–4 mcg/kg/h',
        totalDose: `Bolus: ${(weight * 1).toFixed(1)}–${(weight * 4).toFixed(1)} mcg | Infusion: ${(weight * infMinDose).toFixed(1)}–${(weight * infMaxDose).toFixed(1)} mcg/h`,
        interval: 'Bolus PRN | Infusion: continuous',
        route: 'IV (bolus over 3–5 min minimum)',
        concentration: '50 mcg/mL (standard)',
        volumePerDose: `Bolus (2 mcg/kg): ${mL(bolusTotal, 50)} | Infusion: ${((weight * infMinDose) / 50).toFixed(3)}–${((weight * infMaxDose) / 50).toFixed(3)} mL/h`,
        basisNote: 'Procedural analgesia: 2–4 mcg/kg; analgesia/sedation infusion: 1–4 mcg/kg/h',
        warningNote: 'Chest wall rigidity with rapid bolus — always give slowly over ≥ 3–5 min.',
      };
    },
  },

  {
    id: 'paracetamol-iv',
    name: 'Paracetamol (Analgesic)',
    category: 'Analgesic & Sedation',
    indications: ['Mild–moderate pain', 'Postoperative analgesia (opioid-sparing)', 'Antipyretic'],
    administration: 'IV over 15 min. PO or PR also effective.',
    monitoring: ['Hepatic function if prolonged course (> 7 days)', 'Pain score reassessment 30–60 min after dose'],
    cautions: [
      'PMA-based dosing — preterm neonates need less frequent dosing (slower clearance)',
      'Max daily dose: 60 mg/kg/day (term) or 45 mg/kg/day (preterm)',
      'Do not use IV paracetamol for PDA closure (separate higher-dose protocol)',
      'Hepatotoxic in overdose — respect dosing intervals',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      let dose: number;
      let interval: string;
      let basisNote: string;
      let maxDailyMgKg: number;
      if (pma < 28) {
        dose = 15; interval = 'q12h'; basisNote = 'PMA < 28 wks'; maxDailyMgKg = 30;
      } else if (pma < 32) {
        dose = 15; interval = 'q8–12h'; basisNote = 'PMA 28–31 wks'; maxDailyMgKg = 45;
      } else if (pma < 37) {
        dose = 15; interval = 'q8h'; basisNote = 'PMA 32–36 wks'; maxDailyMgKg = 45;
      } else {
        dose = 15; interval = 'q6h'; basisNote = 'PMA ≥ 37 wks (term)'; maxDailyMgKg = 60;
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg/dose`,
        totalDose: `${total.toFixed(0)} mg`,
        interval,
        route: 'IV over 15 min / PO / PR',
        concentration: '10 mg/mL (IV)',
        volumePerDose: mL(total, 10),
        basisNote,
        maxDose: `${maxDailyMgKg} mg/kg/day (= ${(weight * maxDailyMgKg).toFixed(0)} mg/day)`,
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
      'Treatment of active bleeding: 0.3 mg/kg IV (max 10 mg) — repeat if needed',
      'IV route: anaphylaxis risk — have resuscitation available',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFC 2024', 'NICE NG 194'],
    calculate: (weight) => {
      const prophDose = weight >= 1.5 ? 1 : 0.5;
      const treatDose = weight * 0.3;
      return {
        dosePerKg: `Prophylaxis: ${prophDose} mg (fixed) | Treatment: 0.3 mg/kg`,
        totalDose: `Prophylaxis: ${prophDose} mg | Treatment: ${treatDose.toFixed(2)} mg`,
        interval: 'Prophylaxis: single dose at birth | Treatment: repeat q6–8h if no response',
        route: 'IM (prophylaxis) | IV over 10–20 min (treatment)',
        concentration: '10 mg/mL (Konakion Neonatal 1 mg/0.1 mL or 2 mg/0.2 mL)',
        volumePerDose: `Prophylaxis: ${mL(prophDose, 10)} | Treatment: ${mL(treatDose, 10)}`,
        basisNote: `Prophylaxis: ${weight >= 1.5 ? '1 mg (BW ≥ 1.5 kg)' : '0.5 mg (BW < 1.5 kg)'}`,
        maxDose: 'Treatment: 10 mg per dose',
        warningNote: 'IV route: anaphylaxis risk — resuscitation ready. IM preferred for prophylaxis.',
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      let dose: number;
      let basisNote: string;
      if (pma < 29) {
        dose = 5; basisNote = 'PMA < 29 wks';
      } else if (pma <= 36) {
        dose = 7; basisNote = 'PMA 29–36 wks';
      } else {
        dose = 10; basisNote = 'PMA ≥ 37 wks';
      }
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg`,
        totalDose: `${total.toFixed(1)} mg`,
        interval: 'q8h',
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
    indications: ['Ureaplasma pneumonitis in preterm', 'Chlamydial pneumonia', 'Pertussis (whooping cough)'],
    administration: 'IV over 60 min. PO suspension equally effective and preferred when tolerated.',
    monitoring: ['QTc before and during treatment (QT prolongation risk)', 'LFTs', 'Clinical response (Ureaplasma: repeat NPA PCR)'],
    cautions: [
      'QT prolongation — avoid with other QT-prolonging drugs (fluconazole, cisapride)',
      'Pyloric stenosis risk with PO in infants < 6 weeks (use IV if < 6 weeks PO)',
      'Ureaplasma protocol: 10 mg/kg q24h × 3 days; some centres extend to 5 days',
      'Pertussis: 10 mg/kg/day × 5 days (not reliably bactericidal — postexposure prophylaxis)',
    ],
    references: ['NNF 9th ed. (2024)', 'Ballard et al. NEJM 2011 (Ureaplasma)', 'BNFc 2024'],
    calculate: (weight) => {
      const dose = 10;
      const total = weight * dose;
      return {
        dosePerKg: '10 mg/kg',
        totalDose: `${total.toFixed(0)} mg`,
        interval: 'q24h × 3–5 days (indication-dependent)',
        route: 'IV over 60 min or PO',
        concentration: '2 mg/mL (IV) | 40 mg/mL (suspension)',
        volumePerDose: `IV: ${mL(total, 2)} | PO: ${mL(total, 40)}`,
        basisNote: 'Ureaplasma: 3 days | Pertussis / Chlamydia: 5 days',
        warningNote: 'Check QTc before starting. Pyloric stenosis risk with PO < 6 weeks — use IV.',
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
      'Potent CYP inducer — lowers levels of many co-medications (check all concurrent drugs)',
      'Hepatotoxicity: check LFTs at baseline and weekly',
      'Meningococcal prophylaxis dose: 5 mg/kg q12h × 2 days (< 1 month)',
    ],
    references: ['NNF 9th ed. (2024)', 'PHE Meningococcal guidelines', 'BNFc 2024'],
    calculate: (weight, pma) => {
      const dose = pma < 37 ? 5 : 10;
      const total = weight * dose;
      return {
        dosePerKg: `${dose} mg/kg (preterm ${pma < 37 ? '5' : '10'} mg/kg)`,
        totalDose: `${total.toFixed(1)} mg`,
        interval: 'q12h',
        route: 'PO preferred | IV over 2–3 h',
        concentration: '20 mg/mL (suspension) | 60 mg/mL (IV reconstituted)',
        volumePerDose: `PO: ${mL(total, 20)} | IV: ${mL(total, 60)}`,
        basisNote: pma < 37 ? 'Preterm: 5 mg/kg q12h' : 'Term: 10 mg/kg q12h',
        warningNote: 'Never monotherapy — resistance emerges in days. CYP inducer — check all drug interactions.',
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
    references: ['NNF 9th ed. (2024)', 'ILAE neonatal seizure guidelines 2021'],
    calculate: (weight) => {
      const loadPE = 20;
      const maintPE = 6;
      const loadTotal = weight * loadPE;
      const maintTotal = weight * maintPE;
      return {
        dosePerKg: `Load: ${loadPE} mg PE/kg | Maintenance: 4–8 mg PE/kg/day`,
        totalDose: `Load: ${loadTotal.toFixed(0)} mg PE | Maintenance: ${maintTotal.toFixed(0)} mg PE/day`,
        interval: 'Load: single dose | Maintenance: q12h or q24h',
        route: 'IV over 10–20 min (max 3 mg PE/kg/min)',
        concentration: '75 mg/mL fosphenytoin = 50 mg PE/mL',
        volumePerDose: `Load: ${mL(loadTotal, 50)} (at 50 mg PE/mL) | Maintenance: ${mL(maintTotal, 50)}`,
        basisNote: 'Third-line seizures. Dose in PE not mg fosphenytoin.',
        warningNote: 'Continuous ECG mandatory during loading. Cardiac arrhythmia and hypotension risk.',
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
      'IV diagnostic trial: 50–100 mg as a SINGLE slow IV push while on continuous EEG',
      'Apnoea and hypotonia may occur with IV dose — resuscitation at bedside',
      'If PDE confirmed: lifelong PO pyridoxine 15–30 mg/kg/day (max 200 mg/day)',
      'Consider folinic acid-responsive seizures if pyridoxine trial negative (send urine pipecolic acid)',
    ],
    references: ['NNF 9th ed. (2024)', 'Stockler et al. Neuropediatrics 2011'],
    calculate: (weight) => {
      const trialDose = Math.min(weight * 30, 100);
      const maintDose = weight * 15;
      return {
        dosePerKg: 'Trial: 50–100 mg fixed dose | Maintenance: 15–30 mg/kg/day',
        totalDose: `Trial: ${trialDose.toFixed(0)} mg (capped 100 mg) | Maintenance: ${maintDose.toFixed(0)}–${(weight * 30).toFixed(0)} mg/day`,
        interval: 'Trial: single IV dose | Maintenance: q24h PO',
        route: 'IV over 2–3 min (trial) | PO (maintenance)',
        concentration: '50 mg/mL (IV)',
        volumePerDose: `Trial: ${mL(trialDose, 50)} IV | Maintenance: variable (oral formulation)`,
        basisNote: 'IV trial must be given under continuous EEG monitoring',
        maxDose: '100 mg per IV trial dose',
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
      'LIDOCAINE protocol: load 2 mg/kg → 6 mg/kg/h × 6h → 3 mg/kg/h × 12h → 1.5 mg/kg/h × 12h → stop',
      'Toxicity: perioral tingling, VT, cardiac arrest — have resuscitation ready',
    ],
    references: ['NNF 9th ed. (2024)', 'Malingré et al. Neuropediatrics 2006', 'Boylan et al. Lancet Neurol 2013'],
    calculate: (weight) => {
      const load = weight * 2;
      const rate1 = (weight * 6) / 60;
      const rate2 = (weight * 3) / 60;
      const rate3 = (weight * 1.5) / 60;
      const concMgPerMl = 10;
      return {
        dosePerKg: 'Load: 2 mg/kg → Infusion: 6 → 3 → 1.5 mg/kg/h (stepdown)',
        totalDose: `Load: ${load.toFixed(1)} mg`,
        interval: 'Load then stepdown infusion (total ~30 h)',
        route: 'IV (central or peripheral)',
        concentration: '10 mg/mL (standard)',
        volumePerDose: `Load: ${mL(load, concMgPerMl)} over 10 min | Step 1 (6 mg/kg/h): ${((weight * 6) / concMgPerMl).toFixed(2)} mL/h | Step 2: ${((weight * 3) / concMgPerMl).toFixed(2)} mL/h | Step 3: ${((weight * 1.5) / concMgPerMl).toFixed(2)} mL/h`,
        basisNote: 'Fourth-line only. Step 1: 6 h | Step 2: 12 h | Step 3: 12 h | Stop',
        warningNote: 'ECG mandatory throughout. Do NOT combine with fosphenytoin. QTc check before starting.',
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
    references: ['NNF 9th ed. (2024)', 'Tourneux et al. Pediatrics 2008'],
    calculate: (weight) => {
      const concMcgPerMl = 40;
      return {
        dosePerKg: '0.05–2 mcg/kg/min (usual: 0.1–0.5 mcg/kg/min)',
        totalDose: `Start: ${(0.1 * weight).toFixed(3)} mcg/min`,
        interval: 'Continuous infusion',
        route: 'CENTRAL IV only',
        concentration: `${concMcgPerMl} mcg/mL (4 mg in 100 mL NaCl 0.9%)`,
        volumePerDose: '—',
        basisNote: 'Titrate to MAP target (neonatal MAP goal typically ≥ GA in mmHg)',
        infusionNote: infusionRate(0.05, 0.2, 0.5, weight, concMcgPerMl),
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
      'May cause peripheral and mesenteric ischaemia at high doses',
      'SIADH-like effect — monitor sodium and fluid balance closely',
      'Does not replace volume resuscitation',
      'Titrate slowly — effects may take 30–60 min',
    ],
    references: ['NNF 9th ed. (2024)', 'Meyer et al. Pediatr Crit Care Med 2006'],
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      const dose = 1;
      const total = weight * dose;
      const interval = pma < 31 ? 'q24h' : pma <= 36 ? 'q12–24h' : 'q6–12h';
      const basisNote = pma < 31 ? 'PMA < 31 wks (slow clearance — start q24h)' : pma <= 36 ? 'PMA 31–36 wks' : 'PMA ≥ 37 wks';
      return {
        dosePerKg: '0.5–1 mg/kg/dose IV | 1–2 mg/kg/dose PO',
        totalDose: `IV: ${(weight * 0.5).toFixed(1)}–${total.toFixed(1)} mg | PO: ${(weight * 1).toFixed(1)}–${(weight * 2).toFixed(1)} mg`,
        interval,
        route: 'IV over 5–10 min | PO | Continuous infusion 0.1–0.4 mg/kg/h',
        concentration: '10 mg/mL (IV) | 10 mg/mL (oral solution)',
        volumePerDose: `IV (1 mg/kg): ${mL(total, 10)}`,
        basisNote,
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
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight, pma) => {
      let totalDigitalisingDose: number;
      let maintDose: number;
      let basisNote: string;
      if (pma < 30) {
        totalDigitalisingDose = 15; maintDose = 4; basisNote = 'PMA < 30 wks';
      } else if (pma <= 36) {
        totalDigitalisingDose = 20; maintDose = 5; basisNote = 'PMA 30–36 wks';
      } else {
        totalDigitalisingDose = 30; maintDose = 8; basisNote = 'PMA ≥ 37 wks (term)';
      }
      const totalMcg = weight * totalDigitalisingDose;
      const dose1 = totalMcg / 2;
      const dose2 = totalMcg / 4;
      const maintMcg = weight * maintDose;
      return {
        dosePerKg: `Digitalising total: ${totalDigitalisingDose} mcg/kg | Maintenance: ${maintDose} mcg/kg/dose`,
        totalDose: `Dose 1 (½): ${dose1.toFixed(1)} mcg | Dose 2 (¼): ${dose2.toFixed(1)} mcg | Dose 3 (¼): ${dose2.toFixed(1)} mcg | Maintenance: ${maintMcg.toFixed(1)} mcg/dose`,
        interval: 'Doses 1–2–3 at 0h, 8h, 16h | Maintenance: q12h (start 12h after last digitalising dose)',
        route: 'IV over 10–20 min | PO (maintenance)',
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
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight) => {
      const startDose = 0.25;
      const total = weight * startDose;
      return {
        dosePerKg: '0.25 mg/kg/dose (start) → titrate to 0.5–1 mg/kg/dose',
        totalDose: `Starting: ${total.toFixed(2)} mg | Usual maintenance: ${(weight * 0.5).toFixed(2)}–${(weight * 1).toFixed(2)} mg/dose`,
        interval: 'q6–8h PO',
        route: 'PO (preferred) | IV over 5–10 min with ECG monitoring (acute only)',
        concentration: '1 mg/mL (oral solution)',
        volumePerDose: `Starting dose: ${mL(total, 1)} PO`,
        basisNote: 'Start low (0.25 mg/kg) — titrate up every 48–72 h based on response and HR',
        maxDose: '4–5 mg/kg/day total daily dose',
        warningNote: 'Hypoglycaemia risk in neonates. Never stop abruptly. Contraindicated in heart failure / bronchospasm.',
      };
    },
  },

  {
    id: 'paracetamol-pda',
    name: 'Paracetamol IV (PDA Closure)',
    brandName: 'Perfalgan / Ofirmev — PDA protocol',
    category: 'Cardiovascular',
    indications: ['Hemodynamically significant PDA in preterm infants (alternative to NSAIDs)', 'PDA closure when ibuprofen/indomethacin contraindicated (renal failure, thrombocytopenia)'],
    administration: 'IV over 15 min. PO equally effective when enteral route tolerated.',
    monitoring: ['LFTs before and after course (hepatotoxicity at these repeated doses)', 'Echo at 48 h to assess ductal response', 'Urine output (gentler on kidneys than NSAIDs)', 'Platelets (less effect than NSAIDs)'],
    cautions: [
      'PDA DOSE: 15 mg/kg q6h × 3–7 days — this is HIGHER than standard analgesic dosing',
      'Monitor LFTs — hepatotoxicity possible with repeated high-dose use',
      'Safer renal and platelet profile than ibuprofen/indomethacin',
      'Do NOT confuse with standard analgesic paracetamol dosing (15 mg/kg q6–12h)',
    ],
    references: ['Oncel et al. J Pediatr 2013', 'Ohlsson & Shah Cochrane 2020', 'NNF 9th ed. (2024)'],
    calculate: (weight) => {
      const dose = 15;
      const total = weight * dose;
      return {
        dosePerKg: '15 mg/kg/dose (PDA closure protocol)',
        totalDose: `${total.toFixed(0)} mg per dose`,
        interval: 'q6h × 3–7 days',
        route: 'IV over 15 min or PO',
        concentration: '10 mg/mL (IV)',
        volumePerDose: mL(total, 10),
        basisNote: 'PDA protocol — 3 days minimum, extend to 7 days if duct not closed on echo',
        maxDose: `${(weight * 60).toFixed(0)} mg/day (= 60 mg/kg/day)`,
        warningNote: 'PDA DOSE — not standard analgesic dose. Monitor LFTs. Check echo at 48 h.',
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
      '10% calcium gluconate = 9 mg/mL elemental Ca = 0.22 mmol/mL',
      'NEVER give undiluted rapid IV push in non-arrest setting — cardiac arrest risk',
      'Extravasation → severe tissue necrosis — central line strongly preferred',
      'Do not mix with sodium bicarbonate in same line (precipitates)',
      'Cardiac arrest dose: 0.5–1 mL/kg of 10% solution',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight) => {
      const doseML = 2 * weight;
      const doseMg = doseML * 9;
      const doseMmol = doseML * 0.22;
      return {
        dosePerKg: '2 mL/kg of 10% (= 18 mg/kg elemental Ca = 0.45 mmol/kg)',
        totalDose: `${doseML.toFixed(1)} mL (= ${doseMg.toFixed(0)} mg elemental Ca = ${doseMmol.toFixed(2)} mmol)`,
        interval: 'Acute: single dose (repeat as needed) | Maintenance infusion: 45–90 mg/kg/day',
        route: 'IV over 10–20 min (diluted). Central line preferred.',
        concentration: '10% = 9 mg elemental Ca/mL = 0.22 mmol/mL',
        volumePerDose: `${doseML.toFixed(1)} mL of 10% solution`,
        basisNote: 'Symptomatic: 2 mL/kg over 10–20 min. Cardiac arrest: 0.5–1 mL/kg rapidly.',
        warningNote: 'Extravasation → tissue necrosis. Never mix with bicarbonate. ECG monitoring during infusion.',
      };
    },
  },

  {
    id: 'magnesium-sulfate',
    name: 'Magnesium Sulfate',
    category: 'Electrolyte & Metabolic',
    indications: ['Neonatal hypomagnesaemia (Mg < 0.6 mmol/L or symptomatic)', 'Adjunct in PPHN (bronchodilation + vasodilation)', 'Seizures secondary to hypomagnesaemia'],
    administration: 'IV over 2–4 h for deficiency correction. Slow infusion — rapid infusion causes hypotension and respiratory depression.',
    monitoring: ['Serum magnesium (target 0.7–1.0 mmol/L)', 'Respiratory rate and SpO₂ (respiratory depression at high levels)', 'BP (vasodilation / hypotension)', 'Deep tendon reflexes (loss = early toxicity sign)', 'Urine output (renal excretion)'],
    cautions: [
      '50% MgSO₄ = 500 mg/mL = 2 mmol/mL — MUST dilute before IV use',
      'Dilute to ≤ 20% (≤ 200 mg/mL) for neonatal use',
      'Respiratory depression at levels > 3 mmol/L — have calcium gluconate (antidote) available',
      'Antidote for toxicity: calcium gluconate 2 mL/kg IV over 10 min',
    ],
    references: ['NNF 9th ed. (2024)', 'BNFc 2024'],
    calculate: (weight) => {
      const doseMmol = 0.15 * weight;
      const doseMgSO4 = doseMmol * 246;
      const vol50Percent = doseMgSO4 / 500;
      return {
        dosePerKg: '0.1–0.2 mmol/kg (= 25–50 mg/kg MgSO₄)',
        totalDose: `${doseMmol.toFixed(2)} mmol (= ${doseMgSO4.toFixed(0)} mg MgSO₄ = ${vol50Percent.toFixed(2)} mL of 50% solution)`,
        interval: 'Acute correction: single dose over 2–4 h | Maintenance: 0.1–0.2 mmol/kg/day infusion',
        route: 'IV over 2–4 h (diluted to ≤ 20%). Never undiluted.',
        concentration: 'Dilute 50% solution to 10% (1:4 with NaCl 0.9%) = 100 mg/mL = 0.4 mmol/mL',
        volumePerDose: `${vol50Percent.toFixed(2)} mL of 50% (dilute before use) | ${(doseMgSO4 / 100).toFixed(2)} mL of 10%`,
        basisNote: 'Antidote for toxicity: calcium gluconate 2 mL/kg IV',
        warningNote: 'MUST dilute 50% solution. Respiratory depression risk. Antidote (CaGluc) at bedside.',
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
      'Metabolic acidosis dose: Base deficit × weight × 0.3 (give half over 30 min, reassess)',
      'Do NOT mix with calcium in same line (precipitates)',
    ],
    references: ['NNF 9th ed. (2024)', 'NRP 8th edition 2021'],
    calculate: (weight) => {
      const baseDeficit = 10;
      const dose = baseDeficit * weight * 0.3;
      const halfDose = dose / 2;
      return {
        dosePerKg: 'Dose (mmol) = Base Deficit × Weight × 0.3 (give half first)',
        totalDose: `Example (BD = 10): ${dose.toFixed(1)} mmol total | Give ${halfDose.toFixed(1)} mmol first`,
        interval: 'Single correction then reassess blood gas',
        route: 'IV over 30–60 min (metabolic acidosis) | 2–5 min (cardiac arrest only)',
        concentration: '4.2% (0.5 mmol/mL) — dilute 8.4% 1:1 with WFI',
        volumePerDose: `Half-dose (${halfDose.toFixed(1)} mmol): ${(halfDose / 0.5).toFixed(1)} mL of 4.2%`,
        basisNote: 'Give half → repeat blood gas → give remainder if still acidotic',
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
      'Insulin adsorbs to PVC tubing — prime line with 5–10 mL of insulin solution before connecting to patient',
      'Start at low end (0.01–0.02 units/kg/h); titrate by 0.01 units/kg/h',
      'Target BG: 90–180 mg/dL (avoid tight control — hypoglycaemia risk)',
      'Hold if BG < 90 mg/dL; STOP if BG < 54 mg/dL and give dextrose bolus',
      'Do not reduce TPN glucose rate as the primary intervention — maintain adequate caloric delivery',
    ],
    references: ['NNF 9th ed. (2024)', 'ESPEN neonatal nutrition guidelines'],
    calculate: (weight) => {
      const startDose = 0.02;
      const startTotal = weight * startDose;
      const concUnitsPerMl = 1;
      return {
        dosePerKg: '0.01–0.1 units/kg/h (start: 0.01–0.02 units/kg/h)',
        totalDose: `Start: ${startTotal.toFixed(4)} units/h`,
        interval: 'Continuous infusion',
        route: 'IV via dedicated syringe driver',
        concentration: '1 unit/mL (dilute 50 units in 50 mL NaCl 0.9%)',
        volumePerDose: `Start: ${(startTotal / concUnitsPerMl).toFixed(3)} mL/h | Max (0.1 units/kg/h): ${((weight * 0.1) / concUnitsPerMl).toFixed(3)} mL/h`,
        basisNote: 'Prime line with 5–10 mL solution before connecting. Target BG 90–180 mg/dL.',
        warningNote: 'Prime tubing — insulin adsorbs to plastic. Check BG q30 min until stable. Hold if BG < 90 mg/dL.',
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
];
