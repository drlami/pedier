// PediaLab — Paediatric Blood Chemistry & Body Fluid Reference Ranges
// Sourced from: Harriet Lane Handbook, Chapter 28 "Blood Chemistry and Body Fluids", Table 28.1–28.3 and eTables 28.1–28.2.
// Every range below was verified against the rendered page images (not just OCR text extraction).
// One entry from the source table ("Porcelain", between Phosphorus and Potassium) was excluded — its
// mg/dL-to-mmol/L conversion factor is internally inconsistent between the low and high ends of its own
// range, which is not possible for a real unit conversion, so it could not be verified as usable data.
// ALL values must be confirmed against your local laboratory's reference ranges — methods and assay
// platforms vary between labs and materially affect normal ranges.

export type LabCategory =
  | 'Electrolytes & Renal'
  | 'Liver & Pancreas'
  | 'Calcium, Phosphate & Bone'
  | 'Inflammation & Blood Gas'
  | 'Metabolic'
  | 'Iron Studies & Haematology'
  | 'Vitamins & Trace Elements'
  | 'Haematology (CBC)'
  | 'Endocrine'
  | 'Immunology'
  | 'Screening & Specialized Tests';

export const LAB_CATEGORIES: LabCategory[] = [
  'Electrolytes & Renal',
  'Liver & Pancreas',
  'Calcium, Phosphate & Bone',
  'Inflammation & Blood Gas',
  'Metabolic',
  'Iron Studies & Haematology',
  'Vitamins & Trace Elements',
  'Haematology (CBC)',
  'Endocrine',
  'Immunology',
  'Screening & Specialized Tests',
];

export interface LabRange {
  /** Display text for the age/sex band exactly as printed, e.g. "15 days to <1 year (male)". */
  label: string;
  /** Inclusive lower age bound in days. */
  minAgeDays: number;
  /** Exclusive upper age bound in days; null = no upper bound. */
  maxAgeDays: number | null;
  sex?: 'male' | 'female';
  low: number;
  high: number;
  unit: string;
  lowSI: number;
  highSI: number;
  unitSI: string;
}

export interface LabTest {
  id: string;
  name: string;
  aliases?: string[];
  category: LabCategory;
  ranges: LabRange[];
  notes?: string[];
  crossReference?: string;
  references: string[];
}

const HL_REF = 'Harriet Lane Handbook, Table 28.1 — Reference Values';
const NELSON_REF = 'Nelson Textbook of Pediatrics, Table 770.5 — Reference Intervals';

const YEAR = 365.25;
const y = (n: number) => Math.round(n * YEAR);

export function ageDaysFrom(value: number, unit: 'days' | 'months' | 'years'): number {
  if (unit === 'days') return Math.round(value);
  if (unit === 'months') return Math.round(value * (YEAR / 12));
  return Math.round(value * YEAR);
}

export function isRangeActive(range: LabRange, ageDays: number, sex: 'male' | 'female' | 'any'): boolean {
  if (range.sex && sex !== 'any' && range.sex !== sex) return false;
  if (ageDays < range.minAgeDays) return false;
  if (range.maxAgeDays !== null && ageDays >= range.maxAgeDays) return false;
  return true;
}

export const labTests: LabTest[] = [
  // ─── Electrolytes & Renal ──────────────────────────────────────────────
  {
    id: 'sodium',
    name: 'Sodium',
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    notes: ['This table does not stratify below age 3 years — use your local lab\'s neonatal/infant range for younger patients.'],
    ranges: [
      { label: '3–5 years', minAgeDays: y(3), maxAgeDays: y(6), low: 135, high: 142, unit: 'mEq/L', lowSI: 135, highSI: 142, unitSI: 'mmol/L' },
      { label: '6–15 years', minAgeDays: y(6), maxAgeDays: y(16), low: 136, high: 143, unit: 'mEq/L', lowSI: 136, highSI: 143, unitSI: 'mmol/L' },
      { label: '16–49 years (male)', minAgeDays: y(16), maxAgeDays: y(50), sex: 'male', low: 137, high: 143, unit: 'mEq/L', lowSI: 137, highSI: 143, unitSI: 'mmol/L' },
      { label: '16–49 years (female)', minAgeDays: y(16), maxAgeDays: y(50), sex: 'female', low: 137, high: 142, unit: 'mEq/L', lowSI: 137, highSI: 142, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'potassium',
    name: 'Potassium',
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    ranges: [
      { label: 'Preterm', minAgeDays: -90, maxAgeDays: 0, low: 3.0, high: 6.0, unit: 'mEq/L', lowSI: 3.0, highSI: 6.0, unitSI: 'mmol/L' },
      { label: 'Newborn', minAgeDays: 0, maxAgeDays: 30, low: 3.7, high: 5.9, unit: 'mEq/L', lowSI: 3.7, highSI: 5.9, unitSI: 'mmol/L' },
      { label: 'Infant', minAgeDays: 30, maxAgeDays: y(3), low: 4.1, high: 5.3, unit: 'mEq/L', lowSI: 4.1, highSI: 5.3, unitSI: 'mmol/L' },
      { label: '3–5 years', minAgeDays: y(3), maxAgeDays: y(6), low: 3.9, high: 4.6, unit: 'mEq/L', lowSI: 3.9, highSI: 4.6, unitSI: 'mmol/L' },
      { label: '6 years and older', minAgeDays: y(6), maxAgeDays: null, low: 3.8, high: 4.9, unit: 'mEq/L', lowSI: 3.8, highSI: 4.9, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'chloride',
    name: 'Chloride',
    aliases: ['Chloride (serum)'],
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    notes: ['This table does not stratify below age 3 years — use your local lab\'s neonatal/infant range for younger patients.'],
    ranges: [
      { label: '3–5 years', minAgeDays: y(3), maxAgeDays: y(6), low: 100, high: 107, unit: 'mEq/L', lowSI: 100, highSI: 107, unitSI: 'mmol/L' },
      { label: '6–11 years', minAgeDays: y(6), maxAgeDays: y(12), low: 101, high: 107, unit: 'mEq/L', lowSI: 101, highSI: 107, unitSI: 'mmol/L' },
      { label: '12–29 years (male)', minAgeDays: y(12), maxAgeDays: y(30), sex: 'male', low: 101, high: 106, unit: 'mEq/L', lowSI: 101, highSI: 106, unitSI: 'mmol/L' },
      { label: '12–29 years (female)', minAgeDays: y(12), maxAgeDays: y(30), sex: 'female', low: 100, high: 107, unit: 'mEq/L', lowSI: 100, highSI: 107, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'bicarbonate',
    name: 'Bicarbonate',
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 5, high: 20, unit: 'mEq/L', lowSI: 5, highSI: 20, unitSI: 'mmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 10, high: 24, unit: 'mEq/L', lowSI: 10, highSI: 24, unitSI: 'mmol/L' },
      { label: '1 to <5 years', minAgeDays: y(1), maxAgeDays: y(5), low: 14, high: 24, unit: 'mEq/L', lowSI: 14, highSI: 24, unitSI: 'mmol/L' },
      { label: '5 to <15 years', minAgeDays: y(5), maxAgeDays: y(15), low: 17, high: 26, unit: 'mEq/L', lowSI: 17, highSI: 26, unitSI: 'mmol/L' },
      { label: 'Male 15 to <19 years', minAgeDays: y(15), maxAgeDays: y(19), sex: 'male', low: 18, high: 28, unit: 'mEq/L', lowSI: 18, highSI: 28, unitSI: 'mmol/L' },
      { label: 'Female 15 to <19 years', minAgeDays: y(15), maxAgeDays: y(19), sex: 'female', low: 17, high: 26, unit: 'mEq/L', lowSI: 17, highSI: 26, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'urea-nitrogen',
    name: 'Urea Nitrogen (BUN)',
    aliases: ['BUN'],
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 2.8, high: 23.0, unit: 'mg/dL', lowSI: 1.0, highSI: 8.2, unitSI: 'mmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 3.4, high: 16.8, unit: 'mg/dL', lowSI: 1.2, highSI: 6.0, unitSI: 'mmol/L' },
      { label: '1 to <10 years', minAgeDays: y(1), maxAgeDays: y(10), low: 9.0, high: 22.1, unit: 'mg/dL', lowSI: 3.2, highSI: 7.9, unitSI: 'mmol/L' },
      { label: '10 to <19 years (male)', minAgeDays: y(10), maxAgeDays: y(19), sex: 'male', low: 7.3, high: 21, unit: 'mg/dL', lowSI: 2.6, highSI: 7.5, unitSI: 'mmol/L' },
      { label: '10 to <19 years (female)', minAgeDays: y(10), maxAgeDays: y(19), sex: 'female', low: 7.3, high: 19, unit: 'mg/dL', lowSI: 2.6, highSI: 6.8, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'creatinine',
    name: 'Creatinine (Serum, Enzymatic)',
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 0.32, high: 0.92, unit: 'mg/dL', lowSI: 29, highSI: 82, unitSI: 'mcmol/L' },
      { label: '15 days to <2 years', minAgeDays: 15, maxAgeDays: y(2), low: 0.10, high: 0.36, unit: 'mg/dL', lowSI: 9, highSI: 32, unitSI: 'mcmol/L' },
      { label: '2 to <5 years', minAgeDays: y(2), maxAgeDays: y(5), low: 0.20, high: 0.43, unit: 'mg/dL', lowSI: 18, highSI: 38, unitSI: 'mcmol/L' },
      { label: '5 to <12 years', minAgeDays: y(5), maxAgeDays: y(12), low: 0.31, high: 0.61, unit: 'mg/dL', lowSI: 27, highSI: 54, unitSI: 'mcmol/L' },
      { label: '12 to <15 years', minAgeDays: y(12), maxAgeDays: y(15), low: 0.45, high: 0.81, unit: 'mg/dL', lowSI: 40, highSI: 72, unitSI: 'mcmol/L' },
      { label: '15 to <19 years (male)', minAgeDays: y(15), maxAgeDays: y(19), sex: 'male', low: 0.62, high: 1.08, unit: 'mg/dL', lowSI: 55, highSI: 96, unitSI: 'mcmol/L' },
      { label: '15 to <19 years (female)', minAgeDays: y(15), maxAgeDays: y(19), sex: 'female', low: 0.49, high: 0.84, unit: 'mg/dL', lowSI: 43, highSI: 74, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'uric-acid',
    name: 'Uric Acid',
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 2.8, high: 12.7, unit: 'mg/dL', lowSI: 164, highSI: 757, unitSI: 'mcmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 1.6, high: 6.3, unit: 'mg/dL', lowSI: 94, highSI: 377, unitSI: 'mcmol/L' },
      { label: '1 to <12 years', minAgeDays: y(1), maxAgeDays: y(12), low: 1.8, high: 4.9, unit: 'mg/dL', lowSI: 106, highSI: 289, unitSI: 'mcmol/L' },
      { label: '12 to <19 years (male)', minAgeDays: y(12), maxAgeDays: y(19), sex: 'male', low: 2.6, high: 7.6, unit: 'mg/dL', lowSI: 156, highSI: 454, unitSI: 'mcmol/L' },
      { label: '12 to <19 years (female)', minAgeDays: y(12), maxAgeDays: y(19), sex: 'female', low: 2.6, high: 5.9, unit: 'mg/dL', lowSI: 153, highSI: 349, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'osmolality',
    name: 'Osmolality (Serum)',
    category: 'Electrolytes & Renal',
    references: [HL_REF],
    ranges: [
      { label: '0–16 years', minAgeDays: 0, maxAgeDays: y(16), low: 271, high: 296, unit: 'mOsm/kg', lowSI: 271, highSI: 296, unitSI: 'mmol/kg' },
      { label: '17 years and older', minAgeDays: y(16), maxAgeDays: null, low: 280, high: 303, unit: 'mOsm/kg', lowSI: 280, highSI: 303, unitSI: 'mmol/kg' },
    ],
  },

  // ─── Liver & Pancreas ──────────────────────────────────────────────────
  {
    id: 'alt',
    name: 'Alanine Aminotransferase (ALT)',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 year', minAgeDays: 0, maxAgeDays: y(1), low: 5, high: 33, unit: 'U/L', lowSI: 5, highSI: 33, unitSI: 'U/L' },
      { label: '1 to <13 years', minAgeDays: y(1), maxAgeDays: y(13), low: 9, high: 25, unit: 'U/L', lowSI: 9, highSI: 25, unitSI: 'U/L' },
      { label: '13 to <19 years (male)', minAgeDays: y(13), maxAgeDays: y(19), sex: 'male', low: 9, high: 24, unit: 'U/L', lowSI: 9, highSI: 24, unitSI: 'U/L' },
      { label: '13 to <19 years (female)', minAgeDays: y(13), maxAgeDays: y(19), sex: 'female', low: 8, high: 22, unit: 'U/L', lowSI: 8, highSI: 22, unitSI: 'U/L' },
    ],
  },
  {
    id: 'ast',
    name: 'Aspartate Aminotransferase (AST)',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 32, high: 162, unit: 'U/L', lowSI: 32, highSI: 162, unitSI: 'U/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 20, high: 67, unit: 'U/L', lowSI: 20, highSI: 67, unitSI: 'U/L' },
      { label: '1 to <7 years', minAgeDays: y(1), maxAgeDays: y(7), low: 21, high: 44, unit: 'U/L', lowSI: 21, highSI: 44, unitSI: 'U/L' },
      { label: '7 to <12 years', minAgeDays: y(7), maxAgeDays: y(12), low: 18, high: 36, unit: 'U/L', lowSI: 18, highSI: 36, unitSI: 'U/L' },
      { label: '12 to <19 years (male)', minAgeDays: y(12), maxAgeDays: y(19), sex: 'male', low: 14, high: 35, unit: 'U/L', lowSI: 14, highSI: 35, unitSI: 'U/L' },
      { label: '12 to <19 years (female)', minAgeDays: y(12), maxAgeDays: y(19), sex: 'female', low: 13, high: 26, unit: 'U/L', lowSI: 13, highSI: 26, unitSI: 'U/L' },
    ],
  },
  {
    id: 'alkaline-phosphatase',
    name: 'Alkaline Phosphatase',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 90, high: 273, unit: 'U/L', lowSI: 90, highSI: 273, unitSI: 'U/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 134, high: 518, unit: 'U/L', lowSI: 134, highSI: 518, unitSI: 'U/L' },
      { label: '1 to <10 years', minAgeDays: y(1), maxAgeDays: y(10), low: 156, high: 369, unit: 'U/L', lowSI: 156, highSI: 369, unitSI: 'U/L' },
      { label: '10 to <13 years', minAgeDays: y(10), maxAgeDays: y(13), low: 141, high: 460, unit: 'U/L', lowSI: 141, highSI: 460, unitSI: 'U/L' },
      { label: '13 to <15 years (male)', minAgeDays: y(13), maxAgeDays: y(15), sex: 'male', low: 127, high: 517, unit: 'U/L', lowSI: 127, highSI: 517, unitSI: 'U/L' },
      { label: '13 to <15 years (female)', minAgeDays: y(13), maxAgeDays: y(15), sex: 'female', low: 62, high: 280, unit: 'U/L', lowSI: 62, highSI: 280, unitSI: 'U/L' },
      { label: '15 to <17 years (male)', minAgeDays: y(15), maxAgeDays: y(17), sex: 'male', low: 89, high: 365, unit: 'U/L', lowSI: 89, highSI: 365, unitSI: 'U/L' },
      { label: '15 to <17 years (female)', minAgeDays: y(15), maxAgeDays: y(17), sex: 'female', low: 54, high: 128, unit: 'U/L', lowSI: 54, highSI: 128, unitSI: 'U/L' },
      { label: '17 to <19 years (male)', minAgeDays: y(17), maxAgeDays: y(19), sex: 'male', low: 59, high: 164, unit: 'U/L', lowSI: 59, highSI: 164, unitSI: 'U/L' },
      { label: '17 to <19 years (female)', minAgeDays: y(17), maxAgeDays: y(19), sex: 'female', low: 48, high: 95, unit: 'U/L', lowSI: 48, highSI: 95, unitSI: 'U/L' },
    ],
  },
  {
    id: 'ggt',
    name: 'Gamma-Glutamyl Transferase (GGT)',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 23, high: 219, unit: 'U/L', lowSI: 23, highSI: 219, unitSI: 'U/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 8, high: 127, unit: 'U/L', lowSI: 8, highSI: 127, unitSI: 'U/L' },
      { label: '1 to <11 years', minAgeDays: y(1), maxAgeDays: y(11), low: 6, high: 16, unit: 'U/L', lowSI: 6, highSI: 16, unitSI: 'U/L' },
      { label: '11 to <19 years', minAgeDays: y(11), maxAgeDays: y(19), low: 7, high: 21, unit: 'U/L', lowSI: 7, highSI: 21, unitSI: 'U/L' },
    ],
  },
  {
    id: 'albumin',
    name: 'Albumin',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    notes: ['Assay with bromocresol green.'],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 3.3, high: 4.5, unit: 'g/dL', lowSI: 33, highSI: 45, unitSI: 'g/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 2.8, high: 4.7, unit: 'g/dL', lowSI: 28, highSI: 47, unitSI: 'g/L' },
      { label: '1 to <8 years', minAgeDays: y(1), maxAgeDays: y(8), low: 3.8, high: 4.7, unit: 'g/dL', lowSI: 38, highSI: 47, unitSI: 'g/L' },
      { label: '8 to <15 years', minAgeDays: y(8), maxAgeDays: y(15), low: 4.1, high: 4.8, unit: 'g/dL', lowSI: 41, highSI: 48, unitSI: 'g/L' },
      { label: '15 to <19 years (male)', minAgeDays: y(15), maxAgeDays: y(19), sex: 'male', low: 4.1, high: 5.1, unit: 'g/dL', lowSI: 41, highSI: 51, unitSI: 'g/L' },
      { label: '15 to <19 years (female)', minAgeDays: y(15), maxAgeDays: y(19), sex: 'female', low: 4.0, high: 4.9, unit: 'g/dL', lowSI: 40, highSI: 49, unitSI: 'g/L' },
    ],
  },
  {
    id: 'total-protein',
    name: 'Total Protein',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 5.3, high: 8.3, unit: 'g/dL', lowSI: 53, highSI: 83, unitSI: 'g/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 4.4, high: 7.1, unit: 'g/dL', lowSI: 44, highSI: 71, unitSI: 'g/L' },
      { label: '1 to <6 years', minAgeDays: y(1), maxAgeDays: y(6), low: 6.1, high: 7.5, unit: 'g/dL', lowSI: 61, highSI: 75, unitSI: 'g/L' },
      { label: '6 to <9 years', minAgeDays: y(6), maxAgeDays: y(9), low: 6.4, high: 7.7, unit: 'g/dL', lowSI: 64, highSI: 77, unitSI: 'g/L' },
      { label: '9 to <19 years', minAgeDays: y(9), maxAgeDays: y(19), low: 6.5, high: 8.1, unit: 'g/dL', lowSI: 65, highSI: 81, unitSI: 'g/L' },
    ],
  },
  {
    id: 'bilirubin-total',
    name: 'Bilirubin (Total)',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    crossReference: 'For neonatal hyperbilirubinemia management, use the Hyperbilirubinemia calculator instead — these are broad reference ranges, not phototherapy/exchange thresholds.',
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 0.19, high: 16.60, unit: 'mg/dL', lowSI: 3.3, highSI: 283.8, unitSI: 'mcmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 0.05, high: 0.68, unit: 'mg/dL', lowSI: 0.8, highSI: 11.7, unitSI: 'mcmol/L' },
      { label: '1 to <9 years', minAgeDays: y(1), maxAgeDays: y(9), low: 0.05, high: 0.40, unit: 'mg/dL', lowSI: 0.8, highSI: 6.8, unitSI: 'mcmol/L' },
      { label: '9 to <12 years', minAgeDays: y(9), maxAgeDays: y(12), low: 0.05, high: 0.55, unit: 'mg/dL', lowSI: 0.8, highSI: 9.4, unitSI: 'mcmol/L' },
      { label: '12 to <15 years', minAgeDays: y(12), maxAgeDays: y(15), low: 0.10, high: 0.70, unit: 'mg/dL', lowSI: 1.7, highSI: 11.9, unitSI: 'mcmol/L' },
      { label: '15 to <19 years', minAgeDays: y(15), maxAgeDays: y(19), low: 0.10, high: 0.84, unit: 'mg/dL', lowSI: 1.7, highSI: 14.4, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'bilirubin-direct',
    name: 'Bilirubin (Direct)',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 0.33, high: 0.71, unit: 'mg/dL', lowSI: 5.7, highSI: 12.1, unitSI: 'mcmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 0.05, high: 0.30, unit: 'mg/dL', lowSI: 0.8, highSI: 5.2, unitSI: 'mcmol/L' },
      { label: '1 to <9 years', minAgeDays: y(1), maxAgeDays: y(9), low: 0.05, high: 0.20, unit: 'mg/dL', lowSI: 0.8, highSI: 3.4, unitSI: 'mcmol/L' },
      { label: '9 to <13 years', minAgeDays: y(9), maxAgeDays: y(13), low: 0.05, high: 0.29, unit: 'mg/dL', lowSI: 0.8, highSI: 5.0, unitSI: 'mcmol/L' },
      { label: '13 to <19 years (female)', minAgeDays: y(13), maxAgeDays: y(19), sex: 'female', low: 0.10, high: 0.39, unit: 'mg/dL', lowSI: 1.7, highSI: 6.7, unitSI: 'mcmol/L' },
      { label: '13 to <19 years (male)', minAgeDays: y(13), maxAgeDays: y(19), sex: 'male', low: 0.11, high: 0.42, unit: 'mg/dL', lowSI: 1.9, highSI: 7.1, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'amylase',
    name: 'Amylase',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 3, high: 10, unit: 'U/L', lowSI: 3, highSI: 10, unitSI: 'U/L' },
      { label: '15 days to <13 weeks', minAgeDays: 15, maxAgeDays: 91, low: 2, high: 22, unit: 'U/L', lowSI: 2, highSI: 22, unitSI: 'U/L' },
      { label: '13 weeks to <1 year', minAgeDays: 91, maxAgeDays: y(1), low: 3, high: 50, unit: 'U/L', lowSI: 3, highSI: 50, unitSI: 'U/L' },
      { label: '1 year to <19 years', minAgeDays: y(1), maxAgeDays: y(19), low: 25, high: 101, unit: 'U/L', lowSI: 25, highSI: 101, unitSI: 'U/L' },
    ],
  },
  {
    id: 'lipase',
    name: 'Lipase',
    category: 'Liver & Pancreas',
    references: [HL_REF],
    ranges: [
      { label: '0 to <19 years', minAgeDays: 0, maxAgeDays: y(19), low: 4, high: 39, unit: 'U/L', lowSI: 4, highSI: 39, unitSI: 'U/L' },
    ],
  },

  // ─── Calcium, Phosphate & Bone ─────────────────────────────────────────
  {
    id: 'calcium-total',
    name: 'Calcium (Total)',
    category: 'Calcium, Phosphate & Bone',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 year', minAgeDays: 0, maxAgeDays: y(1), low: 8.5, high: 11.0, unit: 'mg/dL', lowSI: 2.1, highSI: 2.7, unitSI: 'mmol/L' },
      { label: '1 year to <19 years', minAgeDays: y(1), maxAgeDays: y(19), low: 9.2, high: 10.5, unit: 'mg/dL', lowSI: 2.3, highSI: 2.6, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'calcium-ionized',
    name: 'Calcium (Ionized)',
    category: 'Calcium, Phosphate & Bone',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 month', minAgeDays: 0, maxAgeDays: 30, low: 4.4, high: 5.4, unit: 'mg/dL', lowSI: 1.10, highSI: 1.35, unitSI: 'mmol/L' },
      { label: '1 month to adult', minAgeDays: 30, maxAgeDays: null, low: 4.44, high: 5.2, unit: 'mg/dL', lowSI: 1.11, highSI: 1.30, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'phosphorus',
    name: 'Phosphorus',
    category: 'Calcium, Phosphate & Bone',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 5.6, high: 10.5, unit: 'mg/dL', lowSI: 1.8, highSI: 3.4, unitSI: 'mmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 4.8, high: 8.4, unit: 'mg/dL', lowSI: 1.5, highSI: 2.7, unitSI: 'mmol/L' },
      { label: '1 to <5 years', minAgeDays: y(1), maxAgeDays: y(5), low: 4.3, high: 6.8, unit: 'mg/dL', lowSI: 1.4, highSI: 2.2, unitSI: 'mmol/L' },
      { label: '5 to <13 years', minAgeDays: y(5), maxAgeDays: y(13), low: 4.1, high: 5.9, unit: 'mg/dL', lowSI: 1.3, highSI: 1.9, unitSI: 'mmol/L' },
      { label: '13 to <16 years (male)', minAgeDays: y(13), maxAgeDays: y(16), sex: 'male', low: 3.5, high: 6.2, unit: 'mg/dL', lowSI: 1.1, highSI: 2.0, unitSI: 'mmol/L' },
      { label: '13 to <16 years (female)', minAgeDays: y(13), maxAgeDays: y(16), sex: 'female', low: 3.2, high: 5.5, unit: 'mg/dL', lowSI: 1.0, highSI: 1.8, unitSI: 'mmol/L' },
      { label: '16 to <19 years', minAgeDays: y(16), maxAgeDays: y(19), low: 2.9, high: 5.0, unit: 'mg/dL', lowSI: 0.9, highSI: 1.6, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    category: 'Calcium, Phosphate & Bone',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 1.99, high: 3.94, unit: 'mg/dL', lowSI: 0.82, highSI: 1.62, unitSI: 'mmol/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 1.97, high: 3.09, unit: 'mg/dL', lowSI: 0.81, highSI: 1.27, unitSI: 'mmol/L' },
      { label: '1 to <19 years', minAgeDays: y(1), maxAgeDays: y(19), low: 2.09, high: 2.84, unit: 'mg/dL', lowSI: 0.86, highSI: 1.17, unitSI: 'mmol/L' },
    ],
  },

  // ─── Inflammation & Blood Gas ──────────────────────────────────────────
  {
    id: 'crp',
    name: 'C-Reactive Protein (High Sensitivity)',
    aliases: ['CRP', 'hs-CRP'],
    category: 'Inflammation & Blood Gas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 0.3, high: 6.1, unit: 'mg/L', lowSI: 0.3, highSI: 6.1, unitSI: 'mg/L' },
      { label: '15 days to <15 years', minAgeDays: 15, maxAgeDays: y(15), low: 0.1, high: 1.0, unit: 'mg/L', lowSI: 0.1, highSI: 1.0, unitSI: 'mg/L' },
      { label: '15 to <19 years', minAgeDays: y(15), maxAgeDays: y(19), low: 0.1, high: 1.7, unit: 'mg/L', lowSI: 0.1, highSI: 1.7, unitSI: 'mg/L' },
    ],
  },
  {
    id: 'esr',
    name: 'Erythrocyte Sedimentation Rate (ESR)',
    aliases: ['ESR'],
    category: 'Inflammation & Blood Gas',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 month', minAgeDays: 0, maxAgeDays: 30, low: 0, high: 2, unit: 'mm/hr', lowSI: 0, highSI: 2, unitSI: 'mm/hr' },
      { label: '1 month–12 years', minAgeDays: 30, maxAgeDays: y(12), low: 0, high: 20, unit: 'mm/hr', lowSI: 0, highSI: 20, unitSI: 'mm/hr' },
      { label: '>12 years (male)', minAgeDays: y(12), maxAgeDays: null, sex: 'male', low: 0, high: 15, unit: 'mm/hr', lowSI: 0, highSI: 15, unitSI: 'mm/hr' },
      { label: '>12 years (female)', minAgeDays: y(12), maxAgeDays: null, sex: 'female', low: 0, high: 20, unit: 'mm/hr', lowSI: 0, highSI: 20, unitSI: 'mm/hr' },
    ],
  },
  {
    id: 'lactate',
    name: 'Lactate',
    category: 'Inflammation & Blood Gas',
    references: [HL_REF],
    ranges: [
      { label: '0–90 days', minAgeDays: 0, maxAgeDays: 91, low: 9, high: 32, unit: 'mg/dL', lowSI: 1.0, highSI: 3.5, unitSI: 'mmol/L' },
      { label: '3–24 months', minAgeDays: 91, maxAgeDays: y(2), low: 9, high: 30, unit: 'mg/dL', lowSI: 1.0, highSI: 3.3, unitSI: 'mmol/L' },
      { label: '2–18 years', minAgeDays: y(2), maxAgeDays: y(18), low: 9, high: 22, unit: 'mg/dL', lowSI: 1.0, highSI: 2.4, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'ldh',
    name: 'Lactate Dehydrogenase (LDH)',
    category: 'Inflammation & Blood Gas',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 309, high: 1222, unit: 'U/L', lowSI: 309, highSI: 1222, unitSI: 'U/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 163, high: 452, unit: 'U/L', lowSI: 163, highSI: 452, unitSI: 'U/L' },
      { label: '1 to <10 years', minAgeDays: y(1), maxAgeDays: y(10), low: 192, high: 321, unit: 'U/L', lowSI: 192, highSI: 321, unitSI: 'U/L' },
      { label: '10 to <15 years (male)', minAgeDays: y(10), maxAgeDays: y(15), sex: 'male', low: 170, high: 283, unit: 'U/L', lowSI: 170, highSI: 283, unitSI: 'U/L' },
      { label: '10 to <15 years (female)', minAgeDays: y(10), maxAgeDays: y(15), sex: 'female', low: 157, high: 272, unit: 'U/L', lowSI: 157, highSI: 272, unitSI: 'U/L' },
      { label: '15 to <19 years', minAgeDays: y(15), maxAgeDays: y(19), low: 130, high: 250, unit: 'U/L', lowSI: 130, highSI: 250, unitSI: 'U/L' },
    ],
  },
  {
    id: 'creatine-kinase',
    name: 'Creatine Kinase (CK)',
    category: 'Inflammation & Blood Gas',
    references: [HL_REF],
    ranges: [
      { label: '6 months to 2 years (male)', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(2), sex: 'male', low: 50, high: 272, unit: 'U/L', lowSI: 50, highSI: 272, unitSI: 'U/L' },
      { label: '6 months to 2 years (female)', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(2), sex: 'female', low: 38, high: 260, unit: 'U/L', lowSI: 38, highSI: 260, unitSI: 'U/L' },
      { label: '3–5 years (male)', minAgeDays: y(3), maxAgeDays: y(6), sex: 'male', low: 59, high: 296, unit: 'U/L', lowSI: 59, highSI: 296, unitSI: 'U/L' },
      { label: '3–5 years (female)', minAgeDays: y(3), maxAgeDays: y(6), sex: 'female', low: 42, high: 227, unit: 'U/L', lowSI: 42, highSI: 227, unitSI: 'U/L' },
      { label: '6–8 years (male)', minAgeDays: y(6), maxAgeDays: y(9), sex: 'male', low: 54, high: 275, unit: 'U/L', lowSI: 54, highSI: 275, unitSI: 'U/L' },
      { label: '6–8 years (female)', minAgeDays: y(6), maxAgeDays: y(9), sex: 'female', low: 50, high: 231, unit: 'U/L', lowSI: 50, highSI: 231, unitSI: 'U/L' },
      { label: '9–11 years (male)', minAgeDays: y(9), maxAgeDays: y(12), sex: 'male', low: 55, high: 324, unit: 'U/L', lowSI: 55, highSI: 324, unitSI: 'U/L' },
      { label: '9–11 years (female)', minAgeDays: y(9), maxAgeDays: y(12), sex: 'female', low: 52, high: 256, unit: 'U/L', lowSI: 52, highSI: 256, unitSI: 'U/L' },
      { label: '12–14 years (male)', minAgeDays: y(12), maxAgeDays: y(15), sex: 'male', low: 63, high: 407, unit: 'U/L', lowSI: 63, highSI: 407, unitSI: 'U/L' },
      { label: '12–14 years (female)', minAgeDays: y(12), maxAgeDays: y(15), sex: 'female', low: 45, high: 257, unit: 'U/L', lowSI: 45, highSI: 257, unitSI: 'U/L' },
      { label: '15–17 years (male)', minAgeDays: y(15), maxAgeDays: y(18), sex: 'male', low: 68, high: 914, unit: 'U/L', lowSI: 68, highSI: 914, unitSI: 'U/L' },
      { label: '15–17 years (female)', minAgeDays: y(15), maxAgeDays: y(18), sex: 'female', low: 45, high: 458, unit: 'U/L', lowSI: 45, highSI: 458, unitSI: 'U/L' },
    ],
  },
  {
    id: 'carboxyhemoglobin',
    name: 'Carbon Monoxide (Carboxyhemoglobin)',
    category: 'Inflammation & Blood Gas',
    references: [HL_REF],
    ranges: [
      { label: 'Nonsmoker', minAgeDays: 0, maxAgeDays: null, low: 0, high: 2, unit: '% total Hgb', lowSI: 0, highSI: 2, unitSI: '% total Hgb' },
      { label: 'Smoker', minAgeDays: 0, maxAgeDays: null, low: 0, high: 10, unit: '% total Hgb', lowSI: 0, highSI: 10, unitSI: '% total Hgb' },
    ],
    notes: ['Both bands apply regardless of age — select whichever matches the patient\'s smoke exposure.'],
  },

  // ─── Metabolic ──────────────────────────────────────────────────────────
  {
    id: 'ammonia',
    name: 'Ammonia',
    category: 'Metabolic',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 0, high: 161.8, unit: 'mcg/dL', lowSI: 0, highSI: 95, unitSI: 'mcmol/L' },
      { label: '15 days to 6 years', minAgeDays: 15, maxAgeDays: y(6), low: 0, high: 115.8, unit: 'mcg/dL', lowSI: 0, highSI: 68, unitSI: 'mcmol/L' },
      { label: '>6 years', minAgeDays: y(6), maxAgeDays: null, low: 0, high: 122.6, unit: 'mcg/dL', lowSI: 0, highSI: 72, unitSI: 'mcmol/L' },
    ],
  },

  // ─── Iron Studies & Haematology ─────────────────────────────────────────
  {
    id: 'aso-titer',
    name: 'Antistreptolysin-O Titer',
    aliases: ['ASO'],
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0 to <6 months', minAgeDays: 0, maxAgeDays: ageDaysFrom(6, 'months'), low: 0, high: 0, unit: 'IU/mL', lowSI: 0, highSI: 0, unitSI: 'IU/mL' },
      { label: '6 months to <1 year', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(1), low: 0, high: 30, unit: 'IU/mL', lowSI: 0, highSI: 30, unitSI: 'IU/mL' },
      { label: '1 to <6 years', minAgeDays: y(1), maxAgeDays: y(6), low: 0, high: 104, unit: 'IU/mL', lowSI: 0, highSI: 104, unitSI: 'IU/mL' },
      { label: '6 to <19 years', minAgeDays: y(6), maxAgeDays: y(19), low: 0, high: 331, unit: 'IU/mL', lowSI: 0, highSI: 331, unitSI: 'IU/mL' },
    ],
  },
  {
    id: 'ferritin',
    name: 'Ferritin',
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '4 to <15 days', minAgeDays: 4, maxAgeDays: 15, low: 100, high: 717, unit: 'ng/mL', lowSI: 224, highSI: 1611, unitSI: 'pmol/L' },
      { label: '15 days to <6 months', minAgeDays: 15, maxAgeDays: ageDaysFrom(6, 'months'), low: 14, high: 647, unit: 'ng/mL', lowSI: 31, highSI: 1454, unitSI: 'pmol/L' },
      { label: '6 months to <1 year', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(1), low: 8, high: 182, unit: 'ng/mL', lowSI: 19, highSI: 409, unitSI: 'pmol/L' },
      { label: '1 to <5 years', minAgeDays: y(1), maxAgeDays: y(5), low: 5, high: 100, unit: 'ng/mL', lowSI: 12, highSI: 224, unitSI: 'pmol/L' },
      { label: '5 to <14 years', minAgeDays: y(5), maxAgeDays: y(14), low: 14, high: 79, unit: 'ng/mL', lowSI: 31, highSI: 177, unitSI: 'pmol/L' },
      { label: '14 to <19 years (female)', minAgeDays: y(14), maxAgeDays: y(19), sex: 'female', low: 6, high: 67, unit: 'ng/mL', lowSI: 12, highSI: 152, unitSI: 'pmol/L' },
      { label: '14 to <16 years (male)', minAgeDays: y(14), maxAgeDays: y(16), sex: 'male', low: 13, high: 83, unit: 'ng/mL', lowSI: 28, highSI: 186, unitSI: 'pmol/L' },
      { label: '16 to <19 years (male)', minAgeDays: y(16), maxAgeDays: y(19), sex: 'male', low: 11, high: 172, unit: 'ng/mL', lowSI: 25, highSI: 386, unitSI: 'pmol/L' },
    ],
  },
  {
    id: 'folate-rbc',
    name: 'Folate (RBC)',
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 366, high: 366, unit: 'ng/mL (≥)', lowSI: 829, highSI: 829, unitSI: 'nmol/L (≥)' },
    ],
  },
  {
    id: 'folate-serum',
    name: 'Folate (Serum)',
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    notes: ['Categorical result, not age-banded — the three bands below apply at any age; use whichever matches the reported value.'],
    ranges: [
      { label: 'Deficient', minAgeDays: 0, maxAgeDays: null, low: 0, high: 3.9, unit: 'ng/mL', lowSI: 0, highSI: 8.8, unitSI: 'nmol/L' },
      { label: 'Indeterminate', minAgeDays: 0, maxAgeDays: null, low: 4.0, high: 5.8, unit: 'ng/mL', lowSI: 9.1, highSI: 13.1, unitSI: 'nmol/L' },
      { label: 'Normal', minAgeDays: 0, maxAgeDays: null, low: 5.9, high: 5.9, unit: 'ng/mL (≥)', lowSI: 13.4, highSI: 13.4, unitSI: 'nmol/L (≥)' },
    ],
  },
  {
    id: 'haptoglobin',
    name: 'Haptoglobin',
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 0, high: 10, unit: 'mg/dL', lowSI: 0, highSI: 0.10, unitSI: 'g/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 7, high: 221, unit: 'mg/dL', lowSI: 0.07, highSI: 2.21, unitSI: 'g/L' },
      { label: '1 to <12 years', minAgeDays: y(1), maxAgeDays: y(12), low: 7, high: 163, unit: 'mg/dL', lowSI: 0.07, highSI: 1.63, unitSI: 'g/L' },
      { label: '12 to <19 years', minAgeDays: y(12), maxAgeDays: y(19), low: 7, high: 179, unit: 'mg/dL', lowSI: 0.07, highSI: 1.79, unitSI: 'g/L' },
    ],
  },
  {
    id: 'hemoglobin-f',
    name: 'Hemoglobin F (% Total Hemoglobin)',
    aliases: ['HbF'],
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0–1 month', minAgeDays: 0, maxAgeDays: 30, low: 45.8, high: 91.7, unit: '%', lowSI: 45.8, highSI: 91.7, unitSI: '%' },
      { label: '2 months', minAgeDays: 30, maxAgeDays: 61, low: 32.7, high: 85.2, unit: '%', lowSI: 32.7, highSI: 85.2, unitSI: '%' },
      { label: '3 months', minAgeDays: 61, maxAgeDays: 91, low: 14.5, high: 73.7, unit: '%', lowSI: 14.5, highSI: 73.7, unitSI: '%' },
      { label: '4 months', minAgeDays: 91, maxAgeDays: 122, low: 4.2, high: 56.9, unit: '%', lowSI: 4.2, highSI: 56.9, unitSI: '%' },
      { label: '5 months', minAgeDays: 122, maxAgeDays: 152, low: 1.0, high: 38.1, unit: '%', lowSI: 1.0, highSI: 38.1, unitSI: '%' },
      { label: '6–8 months', minAgeDays: 152, maxAgeDays: 244, low: 0.9, high: 19.4, unit: '%', lowSI: 0.9, highSI: 19.4, unitSI: '%' },
      { label: '9–12 months', minAgeDays: 244, maxAgeDays: 365, low: 0.6, high: 11.6, unit: '%', lowSI: 0.6, highSI: 11.6, unitSI: '%' },
      { label: '13–23 months', minAgeDays: 365, maxAgeDays: 730, low: 0.0, high: 8.5, unit: '%', lowSI: 0.0, highSI: 8.5, unitSI: '%' },
      { label: '2 years and older', minAgeDays: 730, maxAgeDays: null, low: 0.0, high: 2.1, unit: '%', lowSI: 0.0, highSI: 2.1, unitSI: '%' },
    ],
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0 to <14 years', minAgeDays: 0, maxAgeDays: y(14), low: 16, high: 128, unit: 'mcg/dL', lowSI: 2.8, highSI: 22.9, unitSI: 'mcmol/L' },
      { label: '14 to <19 years (male)', minAgeDays: y(14), maxAgeDays: y(19), sex: 'male', low: 31, high: 168, unit: 'mcg/dL', lowSI: 5.5, highSI: 30.0, unitSI: 'mcmol/L' },
      { label: '14 to <19 years (female)', minAgeDays: y(14), maxAgeDays: y(19), sex: 'female', low: 20, high: 162, unit: 'mcg/dL', lowSI: 3.5, highSI: 29.0, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'tibc',
    name: 'Total Iron-Binding Capacity (TIBC)',
    aliases: ['TIBC'],
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0–2 months', minAgeDays: 0, maxAgeDays: ageDaysFrom(2, 'months'), low: 59, high: 175, unit: 'mcg/dL', lowSI: 11, highSI: 31, unitSI: 'mcmol/L' },
      { label: '3 months to 17 years', minAgeDays: ageDaysFrom(3, 'months'), maxAgeDays: y(18), low: 250, high: 400, unit: 'mcg/dL', lowSI: 45, highSI: 72, unitSI: 'mcmol/L' },
      { label: '18 years and older', minAgeDays: y(18), maxAgeDays: null, low: 240, high: 450, unit: 'mcg/dL', lowSI: 43, highSI: 81, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'transferrin',
    name: 'Transferrin',
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0 to <9 weeks', minAgeDays: 0, maxAgeDays: 63, low: 104, high: 224, unit: 'mg/dL', lowSI: 1.04, highSI: 2.24, unitSI: 'g/L' },
      { label: '9 weeks to <1 year', minAgeDays: 63, maxAgeDays: y(1), low: 107, high: 324, unit: 'mg/dL', lowSI: 1.07, highSI: 3.24, unitSI: 'g/L' },
      { label: '1 to <19 years', minAgeDays: y(1), maxAgeDays: y(19), low: 220, high: 337, unit: 'mg/dL', lowSI: 2.2, highSI: 3.37, unitSI: 'g/L' },
    ],
  },
  {
    id: 'rheumatoid-factor',
    name: 'Rheumatoid Factor',
    aliases: ['RF'],
    category: 'Iron Studies & Haematology',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 9.0, high: 17.1, unit: 'IU/mL', lowSI: 9.0, highSI: 17.1, unitSI: 'IU/mL' },
      { label: '15 days to <19 years', minAgeDays: 15, maxAgeDays: y(19), low: 0, high: 9.0, unit: 'IU/mL', lowSI: 0, highSI: 9.0, unitSI: 'IU/mL' },
    ],
  },

  // ─── Vitamins & Trace Elements ──────────────────────────────────────────
  {
    id: 'prealbumin',
    name: 'Prealbumin',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '0–14 days', minAgeDays: 0, maxAgeDays: 15, low: 2, high: 12, unit: 'mg/dL', lowSI: 0.02, highSI: 0.12, unitSI: 'g/L' },
      { label: '15 days to <1 year', minAgeDays: 15, maxAgeDays: y(1), low: 5, high: 24, unit: 'mg/dL', lowSI: 0.05, highSI: 0.24, unitSI: 'g/L' },
      { label: '1 to <5 years', minAgeDays: y(1), maxAgeDays: y(5), low: 12, high: 23, unit: 'mg/dL', lowSI: 0.12, highSI: 0.23, unitSI: 'g/L' },
      { label: '5 to <13 years', minAgeDays: y(5), maxAgeDays: y(13), low: 14, high: 26, unit: 'mg/dL', lowSI: 0.14, highSI: 0.26, unitSI: 'g/L' },
      { label: '13 to <16 years', minAgeDays: y(13), maxAgeDays: y(16), low: 18, high: 31, unit: 'mg/dL', lowSI: 0.18, highSI: 0.31, unitSI: 'g/L' },
      { label: '16 to <19 years (male)', minAgeDays: y(16), maxAgeDays: y(19), sex: 'male', low: 20, high: 35, unit: 'mg/dL', lowSI: 0.20, highSI: 0.35, unitSI: 'g/L' },
      { label: '16 to <19 years (female)', minAgeDays: y(16), maxAgeDays: y(19), sex: 'female', low: 17, high: 33, unit: 'mg/dL', lowSI: 0.17, highSI: 0.33, unitSI: 'g/L' },
    ],
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '6 months to 2 years', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(3), low: 72, high: 178, unit: 'mcg/dL', lowSI: 11.3, highSI: 28.0, unitSI: 'mcmol/L' },
      { label: '3–4 years', minAgeDays: y(3), maxAgeDays: y(5), low: 80, high: 160, unit: 'mcg/dL', lowSI: 12.6, highSI: 25.2, unitSI: 'mcmol/L' },
      { label: '5–6 years', minAgeDays: y(5), maxAgeDays: y(7), low: 76, high: 167, unit: 'mcg/dL', lowSI: 12.0, highSI: 26.3, unitSI: 'mcmol/L' },
      { label: '7–8 years', minAgeDays: y(7), maxAgeDays: y(9), low: 79, high: 147, unit: 'mcg/dL', lowSI: 12.4, highSI: 23.1, unitSI: 'mcmol/L' },
      { label: '9–10 years', minAgeDays: y(9), maxAgeDays: y(11), low: 84, high: 154, unit: 'mcg/dL', lowSI: 13.2, highSI: 24.2, unitSI: 'mcmol/L' },
      { label: '11–12 years', minAgeDays: y(11), maxAgeDays: y(13), low: 73, high: 149, unit: 'mcg/dL', lowSI: 11.5, highSI: 23.4, unitSI: 'mcmol/L' },
      { label: '13–14 years', minAgeDays: y(13), maxAgeDays: y(15), low: 66, high: 137, unit: 'mcg/dL', lowSI: 10.4, highSI: 21.6, unitSI: 'mcmol/L' },
      { label: '15–16 years', minAgeDays: y(15), maxAgeDays: y(17), low: 60, high: 132, unit: 'mcg/dL', lowSI: 9.4, highSI: 20.8, unitSI: 'mcmol/L' },
      { label: '17–18 years', minAgeDays: y(17), maxAgeDays: y(19), low: 59, high: 146, unit: 'mcg/dL', lowSI: 9.3, highSI: 23.0, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '6 months to 2 years', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(3), low: 56, high: 125, unit: 'mcg/dL', lowSI: 8.6, highSI: 19.1, unitSI: 'mcmol/L' },
      { label: '3–4 years', minAgeDays: y(3), maxAgeDays: y(5), low: 60, high: 120, unit: 'mcg/dL', lowSI: 9.2, highSI: 18.4, unitSI: 'mcmol/L' },
      { label: '5–6 years', minAgeDays: y(5), maxAgeDays: y(7), low: 64, high: 117, unit: 'mcg/dL', lowSI: 9.8, highSI: 17.9, unitSI: 'mcmol/L' },
      { label: '7–8 years', minAgeDays: y(7), maxAgeDays: y(9), low: 65, high: 125, unit: 'mcg/dL', lowSI: 9.9, highSI: 19.1, unitSI: 'mcmol/L' },
      { label: '9–10 years', minAgeDays: y(9), maxAgeDays: y(11), low: 66, high: 125, unit: 'mcg/dL', lowSI: 10.1, highSI: 19.1, unitSI: 'mcmol/L' },
      { label: '11–12 years', minAgeDays: y(11), maxAgeDays: y(13), low: 66, high: 127, unit: 'mcg/dL', lowSI: 10.1, highSI: 19.4, unitSI: 'mcmol/L' },
      { label: '13–14 years', minAgeDays: y(13), maxAgeDays: y(15), low: 69, high: 124, unit: 'mcg/dL', lowSI: 10.6, highSI: 19.0, unitSI: 'mcmol/L' },
      { label: '15–16 years', minAgeDays: y(15), maxAgeDays: y(17), low: 62, high: 123, unit: 'mcg/dL', lowSI: 9.5, highSI: 18.8, unitSI: 'mcmol/L' },
      { label: '17–18 years', minAgeDays: y(17), maxAgeDays: y(19), low: 62, high: 133, unit: 'mcg/dL', lowSI: 9.5, highSI: 20.3, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'vitamin-a',
    name: 'Vitamin A (Retinol)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 year', minAgeDays: 0, maxAgeDays: y(1), low: 8.0, high: 53.6, unit: 'mcg/dL', lowSI: 0, highSI: 2, unitSI: 'mcmol/L' },
      { label: '1 to <11 years', minAgeDays: y(1), maxAgeDays: y(11), low: 27.5, high: 44.4, unit: 'mcg/dL', lowSI: 1, highSI: 2, unitSI: 'mcmol/L' },
      { label: '11 to <16 years', minAgeDays: y(11), maxAgeDays: y(16), low: 24.9, high: 55.0, unit: 'mcg/dL', lowSI: 1, highSI: 2, unitSI: 'mcmol/L' },
      { label: '16 to <19 years', minAgeDays: y(16), maxAgeDays: y(19), low: 28.7, high: 75.1, unit: 'mcg/dL', lowSI: 1, highSI: 3, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'vitamin-b1',
    name: 'Vitamin B1 (Thiamine, Whole Blood)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 90, high: 140, unit: 'nmol/L', lowSI: 90, highSI: 140, unitSI: 'nmol/L' },
    ],
  },
  {
    id: 'vitamin-b2',
    name: 'Vitamin B2 (Riboflavin)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 4, high: 24, unit: 'mcg/dL', lowSI: 106, highSI: 638, unitSI: 'nmol/L' },
    ],
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12 (Cobalamin)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '5 days to <1 year', minAgeDays: 5, maxAgeDays: y(1), low: 259, high: 1576, unit: 'pg/mL', lowSI: 191, highSI: 1163, unitSI: 'pmol/L' },
      { label: '1 to <9 years', minAgeDays: y(1), maxAgeDays: y(9), low: 283, high: 1613, unit: 'pg/mL', lowSI: 209, highSI: 1190, unitSI: 'pmol/L' },
      { label: '9 to <14 years', minAgeDays: y(9), maxAgeDays: y(14), low: 252, high: 1125, unit: 'pg/mL', lowSI: 186, highSI: 830, unitSI: 'pmol/L' },
      { label: '14 to <17 years', minAgeDays: y(14), maxAgeDays: y(17), low: 244, high: 888, unit: 'pg/mL', lowSI: 180, highSI: 655, unitSI: 'pmol/L' },
      { label: '17 to <19 years', minAgeDays: y(17), maxAgeDays: y(19), low: 203, high: 811, unit: 'pg/mL', lowSI: 150, highSI: 599, unitSI: 'pmol/L' },
    ],
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C (Ascorbic Acid)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 0.4, high: 1.5, unit: 'mg/dL', lowSI: 23, highSI: 85, unitSI: 'mcmol/L' },
    ],
  },
  {
    id: 'vitamin-d-1-25',
    name: 'Vitamin D (1,25-Dihydroxy)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 year', minAgeDays: 0, maxAgeDays: y(1), low: 32, high: 196, unit: 'pg/mL', lowSI: 77, highSI: 471, unitSI: 'pmol/L' },
      { label: '1 to <3 years', minAgeDays: y(1), maxAgeDays: y(3), low: 47, high: 151, unit: 'pg/mL', lowSI: 113, highSI: 363, unitSI: 'pmol/L' },
      { label: '3 to <19 years', minAgeDays: y(3), maxAgeDays: y(19), low: 45, high: 102, unit: 'pg/mL', lowSI: 108, highSI: 246, unitSI: 'pmol/L' },
    ],
  },
  {
    id: 'vitamin-d-25-oh',
    name: 'Vitamin D (25-Hydroxy)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    notes: [
      'Categorical result, not age-banded — the bands below apply at any age; use whichever matches the reported value.',
      'Controversy exists regarding the optimal 25-hydroxyvitamin D level; some experts recommend a level ≥30 ng/mL as sufficient.',
    ],
    ranges: [
      { label: 'Deficient', minAgeDays: 0, maxAgeDays: null, low: 0, high: 12, unit: 'ng/mL (<)', lowSI: 0, highSI: 30, unitSI: 'nmol/L (<)' },
      { label: 'Insufficient', minAgeDays: 0, maxAgeDays: null, low: 12, high: 20, unit: 'ng/mL', lowSI: 30, highSI: 50, unitSI: 'nmol/L' },
      { label: 'Sufficient', minAgeDays: 0, maxAgeDays: null, low: 20, high: 50, unit: 'ng/mL (>)', lowSI: 50, highSI: 125, unitSI: 'nmol/L (>)' },
      { label: 'Excess', minAgeDays: 0, maxAgeDays: null, low: 50, high: 60, unit: 'ng/mL (>)', lowSI: 125, highSI: 150, unitSI: 'nmol/L (>)' },
    ],
  },
  {
    id: 'vitamin-e',
    name: 'Vitamin E (α-Tocopherol)',
    category: 'Vitamins & Trace Elements',
    references: [HL_REF],
    ranges: [
      { label: '0 to <1 year', minAgeDays: 0, maxAgeDays: y(1), low: 0.2, high: 2.1, unit: 'mg/dL', lowSI: 5.0, highSI: 50.0, unitSI: 'mcmol/L' },
      { label: '1 to <19 years', minAgeDays: y(1), maxAgeDays: y(19), low: 0.6, high: 1.4, unit: 'mg/dL', lowSI: 14.5, highSI: 33.0, unitSI: 'mcmol/L' },
    ],
  },

  // ─── Haematology (CBC) — sourced from Nelson, not in Harriet Lane Ch. 28 ──
  {
    id: 'hematocrit',
    name: 'Hematocrit',
    aliases: ['HCT', 'Hct'],
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    ranges: [
      { label: '0–30 days', minAgeDays: 0, maxAgeDays: 30, low: 44, high: 70, unit: '%', lowSI: 0.44, highSI: 0.70, unitSI: 'fraction' },
      { label: '1–23 months', minAgeDays: 30, maxAgeDays: y(2), low: 32, high: 42, unit: '%', lowSI: 0.32, highSI: 0.42, unitSI: 'fraction' },
      { label: '2–9 years', minAgeDays: y(2), maxAgeDays: y(10), low: 33, high: 43, unit: '%', lowSI: 0.33, highSI: 0.43, unitSI: 'fraction' },
      { label: '10–17 years (male)', minAgeDays: y(10), maxAgeDays: y(18), sex: 'male', low: 36, high: 47, unit: '%', lowSI: 0.36, highSI: 0.47, unitSI: 'fraction' },
      { label: '10–17 years (female)', minAgeDays: y(10), maxAgeDays: y(18), sex: 'female', low: 35, high: 45, unit: '%', lowSI: 0.35, highSI: 0.45, unitSI: 'fraction' },
      { label: '18–99 years (male)', minAgeDays: y(18), maxAgeDays: null, sex: 'male', low: 42, high: 52, unit: '%', lowSI: 0.42, highSI: 0.52, unitSI: 'fraction' },
      { label: '18–99 years (female)', minAgeDays: y(18), maxAgeDays: null, sex: 'female', low: 37, high: 47, unit: '%', lowSI: 0.37, highSI: 0.47, unitSI: 'fraction' },
    ],
  },
  {
    id: 'hemoglobin',
    name: 'Hemoglobin',
    aliases: ['Hb'],
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    ranges: [
      { label: '0–30 days', minAgeDays: 0, maxAgeDays: 30, low: 15.0, high: 24.0, unit: 'g/dL', lowSI: 2.32, highSI: 3.72, unitSI: 'mmol/L' },
      { label: '1–23 months', minAgeDays: 30, maxAgeDays: y(2), low: 10.5, high: 14.0, unit: 'g/dL', lowSI: 1.63, highSI: 2.17, unitSI: 'mmol/L' },
      { label: '2–9 years', minAgeDays: y(2), maxAgeDays: y(10), low: 11.5, high: 14.5, unit: 'g/dL', lowSI: 1.78, highSI: 2.25, unitSI: 'mmol/L' },
      { label: '10–17 years (male)', minAgeDays: y(10), maxAgeDays: y(18), sex: 'male', low: 12.5, high: 16.1, unit: 'g/dL', lowSI: 1.93, highSI: 2.50, unitSI: 'mmol/L' },
      { label: '10–17 years (female)', minAgeDays: y(10), maxAgeDays: y(18), sex: 'female', low: 12.0, high: 15.0, unit: 'g/dL', lowSI: 1.86, highSI: 2.32, unitSI: 'mmol/L' },
      { label: '18–99 years (male)', minAgeDays: y(18), maxAgeDays: null, sex: 'male', low: 13.5, high: 18.0, unit: 'g/dL', lowSI: 2.09, highSI: 2.79, unitSI: 'mmol/L' },
      { label: '18–99 years (female)', minAgeDays: y(18), maxAgeDays: null, sex: 'female', low: 12.5, high: 16.0, unit: 'g/dL', lowSI: 1.93, highSI: 2.48, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'mch',
    name: 'Mean Corpuscular Hemoglobin (MCH)',
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    notes: ['Nelson\'s printed SI values for the 10–17y and 18–99y bands (0.26–0.32 and 0.27–0.31) do not match the ×0.0155 conversion factor given for the younger bands — shown here exactly as printed, but treat those two SI figures with caution and prefer the conventional-unit value.'],
    ranges: [
      { label: '0–30 days', minAgeDays: 0, maxAgeDays: 30, low: 33, high: 39, unit: 'pg/cell', lowSI: 0.51, highSI: 0.60, unitSI: 'fmol/cell' },
      { label: '1–23 months', minAgeDays: 30, maxAgeDays: y(2), low: 24, high: 30, unit: 'pg/cell', lowSI: 0.37, highSI: 0.46, unitSI: 'fmol/cell' },
      { label: '2–9 years', minAgeDays: y(2), maxAgeDays: y(10), low: 25, high: 31, unit: 'pg/cell', lowSI: 0.39, highSI: 0.48, unitSI: 'fmol/cell' },
      { label: '10–17 years', minAgeDays: y(10), maxAgeDays: y(18), low: 26, high: 32, unit: 'pg/cell', lowSI: 0.26, highSI: 0.32, unitSI: 'fmol/cell' },
      { label: '18–99 years', minAgeDays: y(18), maxAgeDays: null, low: 27, high: 31, unit: 'pg/cell', lowSI: 0.27, highSI: 0.31, unitSI: 'fmol/cell' },
    ],
  },
  {
    id: 'mchc',
    name: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 32, high: 36, unit: '% Hb/cell', lowSI: 4.96, highSI: 5.58, unitSI: 'mmol Hb/L RBC' },
    ],
  },
  {
    id: 'mcv',
    name: 'Mean Corpuscular Volume (MCV)',
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    ranges: [
      { label: '0–30 days', minAgeDays: 0, maxAgeDays: 30, low: 99, high: 115, unit: 'µm³', lowSI: 99, highSI: 115, unitSI: 'fL' },
      { label: '1–23 months', minAgeDays: 30, maxAgeDays: y(2), low: 72, high: 88, unit: 'µm³', lowSI: 72, highSI: 88, unitSI: 'fL' },
      { label: '2–9 years', minAgeDays: y(2), maxAgeDays: y(10), low: 76, high: 90, unit: 'µm³', lowSI: 76, highSI: 90, unitSI: 'fL' },
      { label: '10–17 years', minAgeDays: y(10), maxAgeDays: y(18), low: 78, high: 95, unit: 'µm³', lowSI: 78, highSI: 95, unitSI: 'fL' },
      { label: '18–99 years', minAgeDays: y(18), maxAgeDays: null, low: 78, high: 100, unit: 'µm³', lowSI: 78, highSI: 100, unitSI: 'fL' },
    ],
  },
  {
    id: 'wbc-count',
    name: 'Leukocyte Count (WBC)',
    aliases: ['WBC count'],
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    ranges: [
      { label: '0–30 days', minAgeDays: 0, maxAgeDays: 30, low: 9.1, high: 34.0, unit: '×1,000/mm³', lowSI: 9.1, highSI: 34.0, unitSI: '×10⁹/L' },
      { label: '1–23 months', minAgeDays: 30, maxAgeDays: y(2), low: 6.0, high: 14.0, unit: '×1,000/mm³', lowSI: 6.0, highSI: 14.0, unitSI: '×10⁹/L' },
      { label: '2–9 years', minAgeDays: y(2), maxAgeDays: y(10), low: 4.0, high: 12.0, unit: '×1,000/mm³', lowSI: 4.0, highSI: 12.0, unitSI: '×10⁹/L' },
      { label: '10–17 years', minAgeDays: y(10), maxAgeDays: y(18), low: 4.0, high: 10.5, unit: '×1,000/mm³', lowSI: 4.0, highSI: 10.5, unitSI: '×10⁹/L' },
      { label: '18–99 years', minAgeDays: y(18), maxAgeDays: null, low: 4.0, high: 10.5, unit: '×1,000/mm³', lowSI: 4.0, highSI: 10.5, unitSI: '×10⁹/L' },
    ],
  },
  {
    id: 'platelet-count',
    name: 'Platelet Count',
    aliases: ['Thrombocyte count'],
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    ranges: [
      { label: 'Newborn (after 1wk, same as adult)', minAgeDays: 0, maxAgeDays: 7, low: 84, high: 478, unit: '×10³/mm³', lowSI: 84, highSI: 478, unitSI: '×10⁹/L' },
      { label: 'Adult', minAgeDays: 7, maxAgeDays: null, low: 150, high: 400, unit: '×10³/mm³', lowSI: 150, highSI: 400, unitSI: '×10⁹/L' },
    ],
  },
  {
    id: 'reticulocyte-count',
    name: 'Reticulocyte Count',
    category: 'Haematology (CBC)',
    references: [NELSON_REF],
    notes: ['Neonatal values (capillary) fall over the first 3 months of life; the adult range applies from later childhood onward.'],
    ranges: [
      { label: '1 day', minAgeDays: 0, maxAgeDays: 2, low: 0.4, high: 6.0, unit: '%', lowSI: 0.004, highSI: 0.060, unitSI: 'fraction' },
      { label: '7 days', minAgeDays: 2, maxAgeDays: 8, low: 0, high: 1.3, unit: '% (<0.1–1.3)', lowSI: 0, highSI: 0.013, unitSI: 'fraction' },
      { label: '1–4 weeks', minAgeDays: 8, maxAgeDays: 29, low: 0, high: 1.2, unit: '% (<1.0–1.2)', lowSI: 0, highSI: 0.012, unitSI: 'fraction' },
      { label: '5–6 weeks', minAgeDays: 29, maxAgeDays: 43, low: 0, high: 2.4, unit: '% (<0.1–2.4)', lowSI: 0, highSI: 0.024, unitSI: 'fraction' },
      { label: '7–8 weeks', minAgeDays: 43, maxAgeDays: 57, low: 0.1, high: 2.9, unit: '%', lowSI: 0.001, highSI: 0.029, unitSI: 'fraction' },
      { label: '9–10 weeks', minAgeDays: 57, maxAgeDays: 71, low: 0, high: 2.6, unit: '% (<0.1–2.6)', lowSI: 0, highSI: 0.026, unitSI: 'fraction' },
      { label: '11–12 weeks', minAgeDays: 71, maxAgeDays: 91, low: 0.1, high: 1.3, unit: '%', lowSI: 0.001, highSI: 0.013, unitSI: 'fraction' },
      { label: 'Adult', minAgeDays: 91, maxAgeDays: null, low: 0.5, high: 1.5, unit: '% (or 25,000–75,000/mm³)', lowSI: 0.005, highSI: 0.015, unitSI: 'fraction' },
    ],
  },

  // ─── Endocrine — sourced from Nelson, HL Ch. 28 defers this to its own Ch. 10 ──
  {
    id: 'adh',
    name: 'Antidiuretic Hormone (ADH, Vasopressin)',
    category: 'Endocrine',
    references: [NELSON_REF],
    notes: ['Reference range depends on plasma osmolality, not age — bands below are by osmolality (mOsm/kg), each applies at any age.'],
    ranges: [
      { label: 'Plasma osmolality 270–280 mOsm/kg', minAgeDays: 0, maxAgeDays: null, low: 0, high: 1.5, unit: 'pg/mL (<)', lowSI: 0, highSI: 1.5, unitSI: 'ng/L (<)' },
      { label: 'Plasma osmolality 280–285 mOsm/kg', minAgeDays: 0, maxAgeDays: null, low: 0, high: 2.5, unit: 'pg/mL (<)', lowSI: 0, highSI: 2.5, unitSI: 'ng/L (<)' },
      { label: 'Plasma osmolality 285–290 mOsm/kg', minAgeDays: 0, maxAgeDays: null, low: 1, high: 5, unit: 'pg/mL', lowSI: 1, highSI: 5, unitSI: 'ng/L' },
      { label: 'Plasma osmolality 290–295 mOsm/kg', minAgeDays: 0, maxAgeDays: null, low: 2, high: 7, unit: 'pg/mL', lowSI: 2, highSI: 7, unitSI: 'ng/L' },
      { label: 'Plasma osmolality 295–300 mOsm/kg', minAgeDays: 0, maxAgeDays: null, low: 4, high: 12, unit: 'pg/mL', lowSI: 4, highSI: 12, unitSI: 'ng/L' },
    ],
  },
  {
    id: 'cortisol',
    name: 'Cortisol',
    category: 'Endocrine',
    references: [NELSON_REF],
    notes: ['8 PM value is expressed as a fraction of that day\'s 8 AM value (≤50%), not an absolute concentration.'],
    ranges: [
      { label: 'Newborn', minAgeDays: 0, maxAgeDays: 30, low: 1, high: 24, unit: 'µg/dL', lowSI: 28, highSI: 662, unitSI: 'nmol/L' },
      { label: 'Adults, 8 AM', minAgeDays: y(18), maxAgeDays: null, low: 5, high: 23, unit: 'µg/dL', lowSI: 138, highSI: 635, unitSI: 'nmol/L' },
      { label: 'Adults, 4 PM', minAgeDays: y(18), maxAgeDays: null, low: 3, high: 15, unit: 'µg/dL', lowSI: 82, highSI: 413, unitSI: 'nmol/L' },
      { label: 'Adults, 8 PM (≤50% of 8 AM value)', minAgeDays: y(18), maxAgeDays: null, low: 0, high: 0.50, unit: 'fraction of 8 AM (≤)', lowSI: 0, highSI: 0.50, unitSI: 'fraction of 8 AM (≤)' },
    ],
  },
  {
    id: 'tsh',
    name: 'Thyroid-Stimulating Hormone (TSH)',
    category: 'Endocrine',
    references: [NELSON_REF],
    ranges: [
      { label: '0–3 days', minAgeDays: 0, maxAgeDays: 4, low: 1.00, high: 20.00, unit: 'mIU/L', lowSI: 1.00, highSI: 20.00, unitSI: 'mIU/L' },
      { label: '4–30 days', minAgeDays: 4, maxAgeDays: 31, low: 0.5, high: 6.5, unit: 'mIU/L', lowSI: 0.5, highSI: 6.5, unitSI: 'mIU/L' },
      { label: '1–5 months', minAgeDays: 31, maxAgeDays: ageDaysFrom(5, 'months'), low: 0.5, high: 6.0, unit: 'mIU/L', lowSI: 0.5, highSI: 6.0, unitSI: 'mIU/L' },
      { label: '6 months–18 years', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(18), low: 0.5, high: 4.5, unit: 'mIU/L', lowSI: 0.5, highSI: 4.5, unitSI: 'mIU/L' },
    ],
  },
  {
    id: 'trh',
    name: 'Thyrotropin-Releasing Hormone (TRH)',
    category: 'Endocrine',
    references: [NELSON_REF],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 5, high: 60, unit: 'pg/mL', lowSI: 14, highSI: 165, unitSI: 'pmol/L' },
    ],
  },
  {
    id: 'tbg',
    name: 'Thyroxine-Binding Globulin (TBG)',
    category: 'Endocrine',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 1.4, high: 9.4, unit: 'mg/dL', lowSI: 14, highSI: 94, unitSI: 'mg/L' },
      { label: '1–4 weeks', minAgeDays: 1, maxAgeDays: 29, low: 1.0, high: 9.0, unit: 'mg/dL', lowSI: 10, highSI: 90, unitSI: 'mg/L' },
      { label: '1–12 months', minAgeDays: 29, maxAgeDays: y(1), low: 2.0, high: 7.6, unit: 'mg/dL', lowSI: 20, highSI: 76, unitSI: 'mg/L' },
      { label: '1–5 years', minAgeDays: y(1), maxAgeDays: y(5), low: 2.9, high: 5.4, unit: 'mg/dL', lowSI: 29, highSI: 54, unitSI: 'mg/L' },
      { label: '5–10 years', minAgeDays: y(5), maxAgeDays: y(10), low: 2.5, high: 5.0, unit: 'mg/dL', lowSI: 25, highSI: 50, unitSI: 'mg/L' },
      { label: '10–15 years', minAgeDays: y(10), maxAgeDays: y(15), low: 2.1, high: 4.6, unit: 'mg/dL', lowSI: 21, highSI: 46, unitSI: 'mg/L' },
      { label: 'Adult', minAgeDays: y(15), maxAgeDays: null, low: 1.5, high: 3.4, unit: 'mg/dL', lowSI: 15, highSI: 34, unitSI: 'mg/L' },
    ],
  },
  {
    id: 't4-total',
    name: 'Thyroxine (T4), Total',
    category: 'Endocrine',
    references: [NELSON_REF],
    notes: ['Newborn screen (filter paper) uses a different specimen type: 6.2–22.0 µg/dL (80–283 nmol/L).'],
    ranges: [
      { label: '0–3 days', minAgeDays: 0, maxAgeDays: 4, low: 8.0, high: 20.0, unit: 'µg/dL', lowSI: 103, highSI: 258, unitSI: 'nmol/L' },
      { label: '3–30 days', minAgeDays: 4, maxAgeDays: 31, low: 5.0, high: 15.0, unit: 'µg/dL', lowSI: 64, highSI: 193, unitSI: 'nmol/L' },
      { label: '31–365 days', minAgeDays: 31, maxAgeDays: y(1), low: 6.0, high: 14.0, unit: 'µg/dL', lowSI: 77, highSI: 180, unitSI: 'nmol/L' },
      { label: '1–5 years', minAgeDays: y(1), maxAgeDays: y(5), low: 4.5, high: 11.0, unit: 'µg/dL', lowSI: 58, highSI: 142, unitSI: 'nmol/L' },
      { label: '6–18 years', minAgeDays: y(6), maxAgeDays: y(18), low: 4.5, high: 10.0, unit: 'µg/dL', lowSI: 58, highSI: 129, unitSI: 'nmol/L' },
    ],
  },
  {
    id: 't4-free',
    name: 'Thyroxine (T4), Free',
    category: 'Endocrine',
    references: [NELSON_REF],
    ranges: [
      { label: '0–3 days', minAgeDays: 0, maxAgeDays: 4, low: 2.00, high: 5.00, unit: 'ng/dL', lowSI: 25.7, highSI: 64.3, unitSI: 'pmol/L' },
      { label: '3–30 days', minAgeDays: 4, maxAgeDays: 31, low: 0.90, high: 2.20, unit: 'ng/dL', lowSI: 11.6, highSI: 28.3, unitSI: 'pmol/L' },
      { label: '31 days–18 years', minAgeDays: 31, maxAgeDays: y(18), low: 0.7, high: 2.00, unit: 'ng/dL', lowSI: 9.0, highSI: 25.7, unitSI: 'pmol/L' },
    ],
  },
  {
    id: 't3-total',
    name: 'Triiodothyronine (T3), Total',
    category: 'Endocrine',
    references: [NELSON_REF],
    ranges: [
      { label: '0–3 days', minAgeDays: 0, maxAgeDays: 4, low: 60, high: 300, unit: 'ng/dL', lowSI: 0.9, highSI: 4.7, unitSI: 'nmol/L' },
      { label: '4–365 days', minAgeDays: 4, maxAgeDays: y(1), low: 90, high: 260, unit: 'ng/dL', lowSI: 1.4, highSI: 4.0, unitSI: 'nmol/L' },
      { label: '1–6 years', minAgeDays: y(1), maxAgeDays: y(6), low: 90, high: 240, unit: 'ng/dL', lowSI: 1.4, highSI: 3.7, unitSI: 'nmol/L' },
      { label: '7–11 years', minAgeDays: y(7), maxAgeDays: y(11), low: 90, high: 230, unit: 'ng/dL', lowSI: 1.4, highSI: 3.6, unitSI: 'nmol/L' },
      { label: '12–18 years', minAgeDays: y(12), maxAgeDays: y(18), low: 100, high: 210, unit: 'ng/dL', lowSI: 1.5, highSI: 3.3, unitSI: 'nmol/L' },
    ],
  },
  {
    id: 't3-free',
    name: 'Triiodothyronine (T3), Free',
    category: 'Endocrine',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 20, high: 240, unit: 'pg/dL', lowSI: 0.3, highSI: 3.7, unitSI: 'pmol/L' },
      { label: '1–3 days', minAgeDays: 1, maxAgeDays: 4, low: 200, high: 610, unit: 'pg/dL', lowSI: 3.1, highSI: 9.4, unitSI: 'pmol/L' },
      { label: '6 weeks', minAgeDays: 4, maxAgeDays: 60, low: 240, high: 560, unit: 'pg/dL', lowSI: 3.7, highSI: 8.6, unitSI: 'pmol/L' },
      { label: 'Adult (20–50 years)', minAgeDays: y(20), maxAgeDays: y(50), low: 230, high: 660, unit: 'pg/dL', lowSI: 3.5, highSI: 10.0, unitSI: 'pmol/L' },
    ],
  },

  // ─── Immunology — sourced from Nelson, HL Ch. 28 defers this to its own Ch. 15 ──
  {
    id: 'iga',
    name: 'Immunoglobulin A (IgA)',
    category: 'Immunology',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 1.4, high: 3.6, unit: 'mg/dL', lowSI: 14, highSI: 36, unitSI: 'mg/L' },
      { label: '1–3 months', minAgeDays: 1, maxAgeDays: 91, low: 1.3, high: 53, unit: 'mg/dL', lowSI: 13, highSI: 530, unitSI: 'mg/L' },
      { label: '4–6 months', minAgeDays: 91, maxAgeDays: ageDaysFrom(6, 'months') + 1, low: 4.4, high: 84, unit: 'mg/dL', lowSI: 44, highSI: 840, unitSI: 'mg/L' },
      { label: '7 months–1 year', minAgeDays: ageDaysFrom(7, 'months'), maxAgeDays: y(1), low: 11, high: 106, unit: 'mg/dL', lowSI: 110, highSI: 1060, unitSI: 'mg/L' },
      { label: '2–5 years', minAgeDays: y(2), maxAgeDays: y(6), low: 14, high: 159, unit: 'mg/dL', lowSI: 140, highSI: 1590, unitSI: 'mg/L' },
      { label: '6–10 years', minAgeDays: y(6), maxAgeDays: y(11), low: 33, high: 236, unit: 'mg/dL', lowSI: 330, highSI: 2360, unitSI: 'mg/L' },
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 70, high: 312, unit: 'mg/dL', lowSI: 700, highSI: 3120, unitSI: 'mg/L' },
    ],
  },
  {
    id: 'igd',
    name: 'Immunoglobulin D (IgD)',
    category: 'Immunology',
    references: [NELSON_REF],
    notes: ['Not detected in newborns.'],
    ranges: [
      { label: 'Newborn (none detected)', minAgeDays: 0, maxAgeDays: 30, low: 0, high: 0, unit: 'mg/dL', lowSI: 0, highSI: 0, unitSI: 'mg/L' },
      { label: 'Thereafter', minAgeDays: 30, maxAgeDays: null, low: 0, high: 8, unit: 'mg/dL', lowSI: 0, highSI: 80, unitSI: 'mg/L' },
    ],
  },
  {
    id: 'ige',
    name: 'Immunoglobulin E (IgE)',
    category: 'Immunology',
    references: [NELSON_REF],
    ranges: [
      { label: 'All ages (male)', minAgeDays: 0, maxAgeDays: null, sex: 'male', low: 0, high: 230, unit: 'IU/mL', lowSI: 0, highSI: 230, unitSI: 'kIU/L' },
      { label: 'All ages (female)', minAgeDays: 0, maxAgeDays: null, sex: 'female', low: 0, high: 170, unit: 'IU/mL', lowSI: 0, highSI: 170, unitSI: 'kIU/L' },
    ],
  },
  {
    id: 'igg',
    name: 'Immunoglobulin G (IgG)',
    category: 'Immunology',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 636, high: 1606, unit: 'mg/dL', lowSI: 6.36, highSI: 16.06, unitSI: 'g/L' },
      { label: '1 month', minAgeDays: 1, maxAgeDays: 31, low: 251, high: 906, unit: 'mg/dL', lowSI: 2.51, highSI: 9.06, unitSI: 'g/L' },
      { label: '2–4 months', minAgeDays: 31, maxAgeDays: ageDaysFrom(4, 'months') + 1, low: 176, high: 601, unit: 'mg/dL', lowSI: 1.76, highSI: 6.01, unitSI: 'g/L' },
      { label: '5–12 months', minAgeDays: ageDaysFrom(5, 'months'), maxAgeDays: y(1), low: 172, high: 1069, unit: 'mg/dL', lowSI: 1.72, highSI: 10.69, unitSI: 'g/L' },
      { label: '1–5 years', minAgeDays: y(1), maxAgeDays: y(6), low: 345, high: 1236, unit: 'mg/dL', lowSI: 3.45, highSI: 12.36, unitSI: 'g/L' },
      { label: '6–10 years', minAgeDays: y(6), maxAgeDays: y(11), low: 608, high: 1572, unit: 'mg/dL', lowSI: 6.08, highSI: 15.72, unitSI: 'g/L' },
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 639, high: 1349, unit: 'mg/dL', lowSI: 6.39, highSI: 13.49, unitSI: 'g/L' },
    ],
  },
  {
    id: 'igm',
    name: 'Immunoglobulin M (IgM)',
    category: 'Immunology',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 6.3, high: 25, unit: 'mg/dL', lowSI: 63, highSI: 250, unitSI: 'mg/L' },
      { label: '1–4 months', minAgeDays: 1, maxAgeDays: ageDaysFrom(4, 'months') + 1, low: 17, high: 105, unit: 'mg/dL', lowSI: 170, highSI: 1050, unitSI: 'mg/L' },
      { label: '5–9 months', minAgeDays: ageDaysFrom(5, 'months'), maxAgeDays: ageDaysFrom(9, 'months') + 1, low: 33, high: 126, unit: 'mg/dL', lowSI: 330, highSI: 1260, unitSI: 'mg/L' },
      { label: '10 months–1 year', minAgeDays: ageDaysFrom(10, 'months'), maxAgeDays: y(1), low: 41, high: 173, unit: 'mg/dL', lowSI: 410, highSI: 1730, unitSI: 'mg/L' },
      { label: '2–8 years', minAgeDays: y(2), maxAgeDays: y(9), low: 43, high: 207, unit: 'mg/dL', lowSI: 430, highSI: 2070, unitSI: 'mg/L' },
      { label: '9–10 years', minAgeDays: y(9), maxAgeDays: y(11), low: 52, high: 242, unit: 'mg/dL', lowSI: 520, highSI: 2420, unitSI: 'mg/L' },
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 56, high: 352, unit: 'mg/dL', lowSI: 560, highSI: 3520, unitSI: 'mg/L' },
    ],
  },

  // ─── Screening & Specialized Tests — sourced from Nelson ──────────────────
  {
    id: 'lead',
    name: 'Lead (Blood)',
    category: 'Screening & Specialized Tests',
    references: [NELSON_REF],
    notes: ['Reference value reflects the current CDC blood lead reference value; check for updates, as this threshold has been revised downward over time.'],
    ranges: [
      { label: 'Child, reference value', minAgeDays: 0, maxAgeDays: y(18), low: 0, high: 3.5, unit: 'µg/dL (<)', lowSI: 0, highSI: 0.0024, unitSI: 'mmol/L (<)' },
      { label: 'Initiate chelation therapy', minAgeDays: 0, maxAgeDays: null, low: 70, high: 70, unit: 'µg/dL (≥)', lowSI: 3.38, highSI: 3.38, unitSI: 'mmol/L (≥)' },
    ],
  },
  {
    id: 'chloride-sweat',
    name: 'Chloride, Sweat',
    category: 'Screening & Specialized Tests',
    references: [NELSON_REF],
    notes: ['Diagnostic test for cystic fibrosis, not a general chloride reference range — categorical, applies at any age.'],
    ranges: [
      { label: 'CF unlikely', minAgeDays: 0, maxAgeDays: null, low: 0, high: 29, unit: 'mmol/L (≤)', lowSI: 0, highSI: 29, unitSI: 'mmol/L (≤)' },
      { label: 'Intermediate', minAgeDays: 0, maxAgeDays: null, low: 30, high: 59, unit: 'mmol/L', lowSI: 30, highSI: 59, unitSI: 'mmol/L' },
      { label: 'Indicative of CF', minAgeDays: 0, maxAgeDays: null, low: 60, high: 60, unit: 'mmol/L (≥)', lowSI: 60, highSI: 60, unitSI: 'mmol/L (≥)' },
    ],
  },
  {
    id: 'g6pd',
    name: 'G6PD in Erythrocytes',
    category: 'Screening & Specialized Tests',
    references: [NELSON_REF],
    notes: ['Newborn values run ~50% higher than the adult range shown — a "normal" newborn result near the adult upper limit is expected, not high.'],
    ranges: [
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 3.4, high: 8.0, unit: 'U/g Hb', lowSI: 0.22, highSI: 0.52, unitSI: 'mU/mol Hb' },
    ],
  },

  // ─── Additions to existing categories — sourced from Nelson ───────────────
  {
    id: 'anion-gap',
    name: 'Anion Gap',
    category: 'Electrolytes & Renal',
    references: [NELSON_REF],
    notes: ['Calculated as sodium − (chloride + bicarbonate). See also the dedicated Anion Gap calculator elsewhere in this app.'],
    ranges: [
      { label: 'All ages', minAgeDays: 0, maxAgeDays: null, low: 7, high: 16, unit: 'mEq/L', lowSI: 7, highSI: 16, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'creatinine-clearance',
    name: 'Creatinine Clearance (Endogenous)',
    category: 'Electrolytes & Renal',
    references: [NELSON_REF],
    notes: ['Declines by <6.5 mL/min/1.73m² per decade after young adulthood. See also the GFR calculator elsewhere in this app.'],
    ranges: [
      { label: 'Newborn', minAgeDays: 0, maxAgeDays: 30, low: 40, high: 65, unit: 'mL/min/1.73m²', lowSI: 40, highSI: 65, unitSI: 'mL/min/1.73m²' },
      { label: '<40 years (male)', minAgeDays: y(1), maxAgeDays: y(40), sex: 'male', low: 97, high: 137, unit: 'mL/min/1.73m²', lowSI: 97, highSI: 137, unitSI: 'mL/min/1.73m²' },
      { label: '<40 years (female)', minAgeDays: y(1), maxAgeDays: y(40), sex: 'female', low: 88, high: 128, unit: 'mL/min/1.73m²', lowSI: 88, highSI: 128, unitSI: 'mL/min/1.73m²' },
    ],
  },
  {
    id: 'amylase-isoenzymes',
    name: 'Amylase Isoenzymes (% Pancreatic Fraction)',
    category: 'Liver & Pancreas',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord–8 months', minAgeDays: -1, maxAgeDays: ageDaysFrom(8, 'months') + 1, low: 0, high: 34, unit: '%', lowSI: 0, highSI: 0.34, unitSI: 'fraction' },
      { label: '9 months–4 years', minAgeDays: ageDaysFrom(9, 'months'), maxAgeDays: y(5), low: 5, high: 56, unit: '%', lowSI: 0.05, highSI: 0.56, unitSI: 'fraction' },
      { label: '5–19 years', minAgeDays: y(5), maxAgeDays: y(19), low: 23, high: 59, unit: '%', lowSI: 0.23, highSI: 0.59, unitSI: 'fraction' },
    ],
  },
  {
    id: 'base-excess',
    name: 'Base Excess',
    category: 'Inflammation & Blood Gas',
    references: [NELSON_REF],
    ranges: [
      { label: 'Newborn', minAgeDays: 0, maxAgeDays: 30, low: -10, high: -2, unit: 'mmol/L', lowSI: -10, highSI: -2, unitSI: 'mmol/L' },
      { label: 'Infant', minAgeDays: 30, maxAgeDays: y(1), low: -7, high: -1, unit: 'mmol/L', lowSI: -7, highSI: -1, unitSI: 'mmol/L' },
      { label: 'Child', minAgeDays: y(1), maxAgeDays: y(13), low: -4, high: 2, unit: 'mmol/L', lowSI: -4, highSI: 2, unitSI: 'mmol/L' },
      { label: 'Thereafter', minAgeDays: y(13), maxAgeDays: null, low: -3, high: 3, unit: 'mmol/L', lowSI: -3, highSI: 3, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'ck-mb',
    name: 'Creatine Kinase-MB (% of Total)',
    category: 'Inflammation & Blood Gas',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 0.3, high: 3.1, unit: '%', lowSI: 0.3, highSI: 3.1, unitSI: '%' },
      { label: '5–8 hours', minAgeDays: 0, maxAgeDays: 1, low: 1.7, high: 7.9, unit: '%', lowSI: 1.7, highSI: 7.9, unitSI: '%' },
      { label: '24–33 hours', minAgeDays: 1, maxAgeDays: 2, low: 1.8, high: 5, unit: '%', lowSI: 1.8, highSI: 5, unitSI: '%' },
      { label: '72–100 hours', minAgeDays: 3, maxAgeDays: 5, low: 1.4, high: 5.4, unit: '%', lowSI: 1.4, highSI: 5.4, unitSI: '%' },
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 0, high: 2, unit: '%', lowSI: 0, highSI: 2, unitSI: '%' },
    ],
  },
  {
    id: 'ck-bb',
    name: 'Creatine Kinase-BB (% of Total)',
    category: 'Inflammation & Blood Gas',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 1, low: 0.3, high: 10.5, unit: '%', lowSI: 0.3, highSI: 10.5, unitSI: '%' },
      { label: '5–8 hours', minAgeDays: 0, maxAgeDays: 1, low: 3.6, high: 13.4, unit: '%', lowSI: 3.6, highSI: 13.4, unitSI: '%' },
      { label: '24–33 hours', minAgeDays: 1, maxAgeDays: 2, low: 2.3, high: 8.6, unit: '%', lowSI: 2.3, highSI: 8.6, unitSI: '%' },
      { label: '72–100 hours', minAgeDays: 3, maxAgeDays: 5, low: 5.1, high: 13.3, unit: '%', lowSI: 5.1, highSI: 13.3, unitSI: '%' },
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 0, high: 0, unit: '%', lowSI: 0, highSI: 0, unitSI: '%' },
    ],
  },
  {
    id: 'anti-dnase-b',
    name: 'Antideoxyribonuclease B Titer (Anti-DNase B)',
    category: 'Iron Studies & Haematology',
    references: [NELSON_REF],
    notes: ['Post-streptococcal serology, typically paired with ASO titer.'],
    ranges: [
      { label: '4–6 years, upper limit of normal', minAgeDays: y(4), maxAgeDays: y(7), low: 240, high: 480, unit: 'U (≤)', lowSI: 240, highSI: 480, unitSI: 'U (≤)' },
      { label: '7–12 years, upper limit of normal', minAgeDays: y(7), maxAgeDays: y(13), low: 480, high: 800, unit: 'U (≤)', lowSI: 480, highSI: 800, unitSI: 'U (≤)' },
    ],
  },
  {
    id: 'glucose',
    name: 'Glucose',
    category: 'Metabolic',
    references: [NELSON_REF],
    ranges: [
      { label: 'Cord blood', minAgeDays: -1, maxAgeDays: 0, low: 45, high: 96, unit: 'mg/dL', lowSI: 2.5, highSI: 5.3, unitSI: 'mmol/L' },
      { label: 'Premature', minAgeDays: 0, maxAgeDays: 1, low: 20, high: 60, unit: 'mg/dL', lowSI: 1.1, highSI: 3.3, unitSI: 'mmol/L' },
      { label: 'Neonate', minAgeDays: 0, maxAgeDays: 1, low: 30, high: 60, unit: 'mg/dL', lowSI: 1.7, highSI: 3.3, unitSI: 'mmol/L' },
      { label: 'Newborn, 1 day', minAgeDays: 1, maxAgeDays: 2, low: 40, high: 60, unit: 'mg/dL', lowSI: 2.2, highSI: 3.3, unitSI: 'mmol/L' },
      { label: 'Newborn, >1 day', minAgeDays: 2, maxAgeDays: 30, low: 50, high: 90, unit: 'mg/dL', lowSI: 2.8, highSI: 5.0, unitSI: 'mmol/L' },
      { label: 'Child', minAgeDays: 30, maxAgeDays: y(18), low: 60, high: 100, unit: 'mg/dL', lowSI: 3.3, highSI: 5.5, unitSI: 'mmol/L' },
      { label: 'Adult', minAgeDays: y(18), maxAgeDays: null, low: 70, high: 105, unit: 'mg/dL', lowSI: 3.9, highSI: 5.8, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'pyruvate',
    name: 'Pyruvate',
    category: 'Metabolic',
    references: [NELSON_REF],
    notes: ['Reported as mean ± SD (0.076 ± 0.026 mmol/L), not a percentile range — band below approximates ±1 SD.'],
    ranges: [
      { label: '7–17 years (≈ mean ± 1 SD)', minAgeDays: y(7), maxAgeDays: y(17), low: 0.050, high: 0.102, unit: 'mmol/L', lowSI: 0.050, highSI: 0.102, unitSI: 'mmol/L' },
    ],
  },
  {
    id: 'd-lactate',
    name: 'D-Lactate',
    category: 'Metabolic',
    references: [NELSON_REF],
    notes: ['Distinct from the standard L-lactate test — only validated for the narrow age range shown.'],
    ranges: [
      { label: '6 months–3 years', minAgeDays: ageDaysFrom(6, 'months'), maxAgeDays: y(3), low: 0.0, high: 0.3, unit: 'mmol/L', lowSI: 0.0, highSI: 0.3, unitSI: 'mmol/L' },
    ],
  },
];

// ─── Arterial Blood Gas (special panel — three parameters per age band) ────

export interface BloodGasRow {
  label: string;
  phLow: number;
  phHigh: number;
  pao2Low: number;
  pao2High: number;
  paco2Low: number;
  paco2High: number;
}

export const arterialBloodGasPanel: BloodGasRow[] = [
  { label: 'Cord blood (umbilical artery)', phLow: 7.18, phHigh: 7.38, pao2Low: 5.7, pao2High: 30.5, paco2Low: 42, paco2High: 74 },
  { label: 'Newborn (birth)', phLow: 7.11, phHigh: 7.36, pao2Low: 8, pao2High: 24, paco2Low: 27, paco2High: 40 },
  { label: '5–10 min', phLow: 7.09, phHigh: 7.30, pao2Low: 33, pao2High: 75, paco2Low: 27, paco2High: 40 },
  { label: '30 min', phLow: 7.21, phHigh: 7.38, pao2Low: 31, pao2High: 85, paco2Low: 27, paco2High: 40 },
  { label: '60 min', phLow: 7.26, phHigh: 7.49, pao2Low: 55, pao2High: 80, paco2Low: 27, paco2High: 40 },
  { label: '1 day', phLow: 7.29, phHigh: 7.45, pao2Low: 54, pao2High: 95, paco2Low: 27, paco2High: 40 },
  { label: 'Child/adult', phLow: 7.35, phHigh: 7.45, pao2Low: 83, pao2High: 108, paco2Low: 32, paco2High: 48 },
];

export const bloodGasNote =
  'Breathing room air. Venous blood gases can be used to assess acid-base status, not oxygenation. PvCO2 is 2–8 mmHg higher than PaCO2, and pH is slightly lower. Peripheral venous samples are strongly affected by the local circulatory and metabolic environment. Arterialized capillary blood gases correlate better than venous samples with arterial pH and PaCO2.';

// ─── Lipid Panel (special panel — categorical, not age-banded) ────────────

export interface LipidRow {
  label: string;
  desirable: string;
  borderline: string;
  high: string;
}

export const lipidPanel: LipidRow[] = [
  { label: 'Total Cholesterol', desirable: '<170 mg/dL (4.4 mmol/L)', borderline: '170–199 mg/dL (4.4–5.1 mmol/L)', high: '≥200 mg/dL (5.2 mmol/L)' },
  { label: 'LDL', desirable: '<110 mg/dL (2.8 mmol/L)', borderline: '110–129 mg/dL (2.8–3.3 mmol/L)', high: '≥130 mg/dL (3.4 mmol/L)' },
  { label: 'Non-HDL', desirable: '<120 mg/dL (3.1 mmol/L)', borderline: '120–144 mg/dL (3.1–3.7 mmol/L)', high: '≥145 mg/dL (3.8 mmol/L)' },
  { label: 'HDL*', desirable: '>45 mg/dL (1.2 mmol/L)', borderline: '40–45 mg/dL (1.0–1.2 mmol/L)', high: '<40 mg/dL (1.0 mmol/L)' },
  { label: 'Triglycerides (0–9 years)', desirable: '<75 mg/dL (0.8 mmol/L)', borderline: '75–99 mg/dL (0.8–1.1 mmol/L)', high: '≥100 mg/dL (1.1 mmol/L)' },
  { label: 'Triglycerides (10–19 years)', desirable: '<90 mg/dL (1.0 mmol/L)', borderline: '90–129 mg/dL (1.0–1.5 mmol/L)', high: '≥130 mg/dL (1.5 mmol/L)' },
];

export const lipidPanelNote =
  '*For HDL, the risk direction is reversed — a LOW value is the "high risk" finding, unlike the other lipid measures. These cut-points have not been validated to demonstrate increased risk of atherosclerosis or cardiovascular events.';

// ─── Body Fluids (CSF, Urine, Transudate/Exudate, Synovial Fluid) ─────────
// Generic table shape — these panels don't fit the single-analyte age-band model above
// (mixed collection types, categorical groups, or multiple sub-tables per fluid).

export interface FluidTable {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export interface FluidPanel {
  id: string;
  name: string;
  tables: FluidTable[];
  notes?: string[];
  references: string[];
}

const HL_REF_282 = 'Harriet Lane Handbook, Table 28.2 — Evaluation of Cerebrospinal Fluid';
const HL_REF_283 = 'Harriet Lane Handbook, Table 28.3 — Evaluation of Urine';
const HL_REF_E281 = 'Harriet Lane Handbook, eTable 28.1 — Evaluation of Transudate vs. Exudate';
const HL_REF_E282 = 'Harriet Lane Handbook, eTable 28.2 — Characteristics of Synovial Fluid';

export const bodyFluidPanels: FluidPanel[] = [
  {
    id: 'csf',
    name: 'Cerebrospinal Fluid (CSF)',
    references: [HL_REF_282],
    tables: [
      {
        id: 'csf-wbc',
        title: 'WBC Count',
        columns: ['Age', 'Count/mcL (median)', '95th Percentile'],
        rows: [
          ['0–28 days', '0–12 (median 4)', '16'],
          ['29–60 days', '0–8 (median 2)', '11'],
          ['Child', '0–7', '—'],
        ],
      },
      {
        id: 'csf-glucose-neonate',
        title: 'Glucose — Neonates (by Age)',
        columns: ['Age', 'Median', '5th Percentile'],
        rows: [
          ['0–28 days', '45 mg/dL', '35 mg/dL'],
          ['29–60 days', '47 mg/dL', '37 mg/dL'],
        ],
      },
      {
        id: 'csf-glucose-older',
        title: 'Glucose — Infant/Child vs. Adult',
        columns: ['Group', 'Conventional Units', 'SI Units'],
        rows: [
          ['Infant, child', '60–80 mg/dL', '3.3–4.4 mmol/L'],
          ['Adult', '40–70 mg/dL', '2.2–3.9 mmol/L'],
        ],
      },
      {
        id: 'csf-protein-neonate',
        title: 'Protein — Neonates (by Age)',
        columns: ['Age', 'Median', '95th Percentile'],
        rows: [
          ['0–28 days', '66 mg/dL', '118 mg/dL'],
          ['29–60 days', '49 mg/dL', '91 mg/dL'],
        ],
      },
      {
        id: 'csf-protein-older',
        title: 'Protein — Older Infants/Children',
        columns: ['Age', 'Conventional Units', 'SI Units'],
        rows: [
          ['6 months to 2 years', '6–25 mg/dL', '60–250 mg/L'],
          ['2–6 years', '5–25 mg/dL', '50–250 mg/L'],
          ['6–12 years', '5–28 mg/dL', '50–280 mg/L'],
          ['12–18 years', '6–34 mg/dL', '60–340 mg/L'],
        ],
      },
      {
        id: 'csf-opening-pressure',
        title: 'Opening Pressure (Lateral Recumbent Position)',
        columns: ['Measure', 'Value'],
        rows: [
          ['1–18 years', '11.5–28 cm H2O (10th–90th percentile)'],
          ['Respiratory variation', '0.5–1 cm H2O'],
        ],
      },
    ],
  },
  {
    id: 'urine',
    name: 'Urine',
    references: [HL_REF_283],
    tables: [
      {
        id: 'urine-albumin',
        title: 'Albumin',
        columns: ['Collection', 'Reference Range'],
        rows: [
          ['Random (first morning), male', '<22 mg urine albumin/g creatinine'],
          ['Random (first morning), female', '<30 mg urine albumin/g creatinine'],
          ['24-hr, 4–16 years (male)', '3.35–13.15 mg/1.73 m²/day'],
          ['24-hr, 4–16 years (female)', '3.75–18.34 mg/1.73 m²/day'],
        ],
      },
      {
        id: 'urine-calcium',
        title: 'Calcium',
        columns: ['Collection / Age', 'Reference Range'],
        rows: [
          ['Random, 1 month–1 year', '0.03–0.81 mg/mg creatinine'],
          ['Random, 1–2 years', '0.03–0.56 mg/mg creatinine'],
          ['Random, 2–3 years', '0.02–0.5 mg/mg creatinine'],
          ['Random, 3–5 years', '0.02–0.41 mg/mg creatinine'],
          ['Random, 5–7 years', '0.01–0.3 mg/mg creatinine'],
          ['Random, 7–10 years', '0.01–0.25 mg/mg creatinine'],
          ['Random, 10–14 years', '0.01–0.24 mg/mg creatinine'],
          ['Random, 14–17 years', '0.01–0.24 mg/mg creatinine'],
          ['24-hr, 2–18 years (male)', '0.75–3.79 mg/kg/day'],
          ['24-hr, 2–18 years (female)', '0.73–3.41 mg/kg/day'],
        ],
      },
      {
        id: 'urine-chloride',
        title: 'Chloride',
        columns: ['Collection / Age', 'Reference Range'],
        rows: [
          ['Random, male', '25–253 mmol/g creatinine'],
          ['Random, female', '39–348 mmol/g creatinine'],
          ['24-hr, infant', '2–10 mmol/day'],
          ['24-hr, child <6 years', '15–40 mmol/day'],
          ['24-hr, 6–10 years (male)', '36–110 mmol/day'],
          ['24-hr, 6–10 years (female)', '18–74 mmol/day'],
          ['24-hr, 10–14 years (male)', '64–176 mmol/day'],
          ['24-hr, 10–14 years (female)', '36–173 mmol/day'],
          ['24-hr, adult', '110–250 mmol/day'],
        ],
      },
      {
        id: 'urine-creatinine',
        title: 'Creatinine',
        columns: ['Collection / Age', 'Reference Range'],
        rows: [
          ['Random, 3–5 years', '15–152 mg/dL'],
          ['Random, 6–11 years', '14–196 mg/dL'],
          ['Random, 12–13 years', '21–215 mg/dL'],
          ['Random, 14–29 years', '19–305 mg/dL'],
          ['24-hr, infant', '8–20 mg/kg/day'],
          ['24-hr, child', '8–22 mg/kg/day'],
          ['24-hr, adolescent', '8–30 mg/kg/day'],
          ['24-hr, adult (male)', '14–26 mg/kg/day'],
          ['24-hr, adult (female)', '11–20 mg/kg/day'],
        ],
      },
      {
        id: 'urine-potassium',
        title: 'Potassium',
        columns: ['Collection / Age', 'Reference Range'],
        rows: [
          ['Random, male', '13–116 mmol/g creatinine'],
          ['Random, female', '8–129 mmol/g creatinine'],
          ['24-hr, 6–10 years (male)', '17–54 mmol/day'],
          ['24-hr, 6–10 years (female)', '8–37 mmol/day'],
          ['24-hr, 10–14 years (male)', '22–57 mmol/day'],
          ['24-hr, 10–14 years (female)', '18–58 mmol/day'],
          ['24-hr, adult', '25–125 mmol/day'],
        ],
      },
      {
        id: 'urine-protein',
        title: 'Protein',
        columns: ['Collection / Age', 'Reference Range'],
        rows: [
          ['Random, 6–24 months', '<0.5 mg protein/mg creatinine'],
          ['Random, >2 years', '<0.2 mg protein/mg creatinine'],
          ['24-hr, at rest', '50–80 mg/day'],
          ['24-hr, after intense exercise', '<250 mg/day'],
        ],
      },
      {
        id: 'urine-sodium',
        title: 'Sodium',
        columns: ['Collection / Age', 'Reference Range'],
        rows: [
          ['Random, male', '23–229 mmol/g creatinine'],
          ['Random, female', '26–297 mmol/g creatinine'],
          ['24-hr, 6–10 years (male)', '41–115 mmol/day'],
          ['24-hr, 6–10 years (female)', '20–69 mmol/day'],
          ['24-hr, 10–14 years (male)', '63–177 mmol/day'],
          ['24-hr, 10–14 years (female)', '48–168 mmol/day'],
          ['24-hr, adult (male)', '40–220 mmol/day'],
          ['24-hr, adult (female)', '27–287 mmol/day'],
        ],
      },
      {
        id: 'urine-urea-nitrogen',
        title: 'Urea Nitrogen',
        columns: ['Collection', 'Reference Range'],
        rows: [
          ['Random, male', '102–352 mmol/g creatinine'],
          ['Random, female', '112–416 mmol/g creatinine'],
          ['24-hr collection', '10–20 g/day'],
        ],
      },
      {
        id: 'urine-osmolality',
        title: 'Urine Osmolality',
        columns: ['Condition', 'Reference Range'],
        rows: [
          ['Random', '50–1,200 mOsm/kg H2O, depending on fluid intake'],
          ['On average fluid intake', '300–900 mOsm/kg H2O'],
          ['After 12-hr fluid restriction', '>850 mOsm/kg H2O'],
          ['24-hr collection', '~300–900 mOsm/kg H2O'],
        ],
      },
    ],
  },
  {
    id: 'transudate-exudate',
    name: 'Transudate vs. Exudate (Pleural, Pericardial, or Peritoneal Fluid)',
    references: [HL_REF_E281],
    notes: [
      'Always obtain serum glucose, LDH, protein, and amylase for comparison.',
      'Not all exudate criteria need be met for classification as an exudate.',
      'In peritoneal fluid, WBC count ≥250 cells/mm³ suggests peritonitis.',
      'Collect pH anaerobically in a heparinized syringe.',
    ],
    tables: [
      {
        id: 'te-comparison',
        title: 'Comparison',
        columns: ['Measurement', 'Transudate', 'Exudate'],
        rows: [
          ['Protein (g/dL)', '<3.0', '≥3.0'],
          ['Fluid/serum protein ratio', '<0.5', '≥0.5'],
          ['LDH (IU/L)', '<200', '≥200'],
          ['Fluid/serum LDH ratio', '<0.6', '≥0.6'],
          ['WBCs (cells/mm³)', '<10,000', '>50,000'],
          ['Glucose (mg/dL)', '≥60', '<60'],
          ['pH', '≥7.2', '<7.2'],
        ],
      },
    ],
  },
  {
    id: 'synovial',
    name: 'Synovial Fluid',
    references: [HL_REF_E282],
    tables: [
      {
        id: 'synovial-characteristics',
        title: 'Characteristics by Group',
        columns: ['Group', 'Clarity', 'Color', 'WBC Count (WBC/mL)', 'PMN (%)', 'RBC Present', 'Glucose Diff.* (mg/dL)'],
        rows: [
          ['Normal', 'Transparent', 'Yellow', '<150', '<25', 'No', '0–10'],
          ['Noninflammatory', 'Transparent', 'Xanthochromic', '<3,000', '<30', 'No', '0–10'],
          ['Inflammatory', 'Transparent to opaque', 'Xanthochromic, white, or bloody', '3,000–75,000', '>50', 'No', '0–40'],
          ['Infectious', 'Opaque', 'White', '50,000–200,000', '>90', 'Yes', '20–100'],
          ['Hemorrhagic', 'Opaque', 'Red-brown or xanthochromic', '50–10,000', '<50', 'Yes', '0–20'],
        ],
      },
    ],
    notes: ['*Glucose difference = blood glucose minus synovial fluid glucose.'],
  },
];

// ─── Additional multi-column panels — sourced from Nelson, not in Harriet Lane Ch. 28 ──
// Same generic table shape as the body-fluid panels above; these don't fit the
// single-analyte age-band model (one row per cell type/isoenzyme/condition, not per age).

const NELSON_REF_PANELS = 'Nelson Textbook of Pediatrics, Table 770.5 — Reference Intervals';

export const nelsonPanels: FluidPanel[] = [
  {
    id: 'leukocyte-differential',
    name: 'Leukocyte Differential',
    references: [NELSON_REF_PANELS],
    tables: [
      {
        id: 'differential',
        title: 'By Cell Type (All Ages)',
        columns: ['Cell Type', '% of Total', 'Absolute Count (cells/mm³)'],
        rows: [
          ['Myelocytes', '0%', '0'],
          ['Neutrophils ("bands")', '3–5%', '150–400'],
          ['Neutrophils ("segs")', '54–62%', '3,000–5,800'],
          ['Lymphocytes', '25–33%', '1,500–3,000'],
          ['Monocytes', '3–7%', '285–500'],
          ['Eosinophils', '1–3%', '50–250'],
          ['Basophils', '0–0.75%', '15–50'],
        ],
      },
    ],
  },
  {
    id: 'ldh-isoenzymes',
    name: 'Lactate Dehydrogenase (LDH) Isoenzymes',
    references: [NELSON_REF_PANELS],
    notes: ['Expressed as % of total LDH activity.'],
    tables: [
      {
        id: 'ldh-iso',
        title: '% of Total Activity by Age',
        columns: ['Isoenzyme', '1–6 years', '7–19 years'],
        rows: [
          ['LD1', '20–38%', '20–35%'],
          ['LD2', '27–38%', '31–38%'],
          ['LD3', '16–26%', '19–28%'],
          ['LD4', '5–16%', '7–13%'],
          ['LD5', '3–13%', '5–12%'],
        ],
      },
    ],
  },
  {
    id: 'ogtt',
    name: 'Glucose Tolerance Test (OGTT)',
    references: [NELSON_REF_PANELS],
    notes: [
      'Oral dose: Adult 75 g; Child 1.75 g/kg ideal weight, up to a maximum of 75 g.',
      'See also the DKA/diabetes calculators elsewhere in this app for management once diabetes is diagnosed.',
    ],
    tables: [
      {
        id: 'ogtt-table',
        title: 'Fasting and 2-Hour Glucose',
        columns: ['Timepoint', 'Normal', 'Diabetic'],
        rows: [
          ['Fasting', '70–105 mg/dL (3.9–5.8 mmol/L)', '≥126 mg/dL (≥7.0 mmol/L)'],
          ['120 min', '70–120 mg/dL (3.9–6.7 mmol/L)', '≥200 mg/dL (≥11 mmol/L)'],
        ],
      },
    ],
  },
];
