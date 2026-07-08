const fs = require('fs');

const RAW_PATH = __dirname + '/formulary_raw.txt';
const OUT_PATH = __dirname + '/drugs_intermediate.json';

const raw = fs.readFileSync(RAW_PATH, 'utf8');

// Split into pages
const pageBlocks = raw.split(/===PAGE (\d+)===\n/).slice(1); // [pageNum, text, pageNum, text, ...]

// A separate font-encoding bug from the digit-range "e"-as-dash artifact (handled in cleanText
// below): in the bold/caps heading font, a dash between two words renders as a literal
// lowercase "d" with NO surrounding spaces, e.g. "IRONdINJECTABLE PREPARATIONS" for
// "IRON-INJECTABLE PREPARATIONS". This broke anchor detection for several real drug headings
// (combined-entry titles like Iron, Penicillin G, Sodium Chloride preparations), silently
// merging their content into whatever neighboring drug happened to be open.
//
// A blanket "lowercase d between two letters" regex is UNSAFE: the same raw text also has
// generic table-cell glue (missing spaces, not dashes) that happens to produce the identical
// shape, e.g. "GoodSense" (real brand name), "PredForte" (real product name), "RapidCYP",
// "UltrarapidUse", "InhaledCurrent", "MildModerateSevere", "avoidHold", "andAge" — blindly
// replacing 'd' with '-' in these would corrupt real words. Instead, whitelist only the
// specific left-hand words verified (by manually cataloging every occurrence in this PDF) to
// be genuine dash-artifacts, not real words ending in those letters.
const DASH_ARTIFACT_PREFIXES = [
  'IRON', 'Iron', 'CALCITONIN', 'PREPARATIONS', 'GLYCOL', 'HYDROCHLORIDE', 'CHLORIDE', 'TRETINOIN',
];
const DASH_ARTIFACT_RE = new RegExp(`\\b(${DASH_ARTIFACT_PREFIXES.join('|')})d([A-Z])`, 'g');
function fixHeadingDash(line) {
  return line.replace(DASH_ARTIFACT_RE, '$1-$2');
}

const allLines = []; // { text, page }
for (let i = 0; i < pageBlocks.length; i += 2) {
  const pageNum = parseInt(pageBlocks[i], 10);
  const text = pageBlocks[i + 1] || '';
  const lines = text.split('\n');
  for (const line of lines) {
    allLines.push({ text: fixHeadingDash(line), page: pageNum });
  }
}

// Noise line filters
const NOISE_EXACT = new Set([
  'For', 'exp', 'lanatio', 'n', 'of', 'ic', 'ons,', 'see', 'p.', '763',
  'Continued', 'FORMULARY', '',
]);

function isNoiseLine(t) {
  const trimmed = t.trim();
  if (NOISE_EXACT.has(trimmed)) return true;
  if (/^Chapter 30 Drug Dosages \d+$/.test(trimmed)) return true;
  if (/^[A-Z]$/.test(trimmed)) return true; // single-letter margin index
  if (/Yes\s+Yes\s+No/.test(trimmed)) return true; // icon legend row
  return false;
}

const cleanedLines = allLines.filter(l => !isNoiseLine(l.text));

// Drug name anchor: a line that is ALL CAPS (allowing digits, spaces, commas, hyphens, slashes, parens, apostrophes),
// at least 3 chars, not a pure number, and not "continued" (handled separately by looking at next word)
// Known non-drug ALL-CAPS tokens that appear as subheadings/table fragments/abbreviations
// inside a real drug's entry. These must be excluded BEFORE alphabetical LIS filtering,
// otherwise their presence in the candidate pool can distort the LIS backtrack and cause a
// REAL drug name to be dropped instead (silent identity loss, worse than a visible gap).
const NON_DRUG_BLACKLIST = new Set([
  'BID', 'TID', 'QID', 'QD', 'PRN', 'STAT', 'ADULT', 'FAILURE', 'UTI', 'URI', 'CIDP', 'EDTA',
  'BUN', 'CBC', 'CNS', 'GFR', 'NPO', 'ICU', 'PICU', 'NICU', 'ER', 'OR', 'DNA', 'RNA', 'HIV',
  'AIDS', 'CMV', 'EBV', 'RSV', 'TB', 'GI', 'GU', 'CSF', 'WBC', 'RBC', 'ANC', 'INR', 'PT', 'PTT',
  'ABG', 'VBG', 'ECG', 'EKG', 'EEG', 'MRI', 'CT', 'US', 'IU', 'NOTE', 'CAUTION', 'WARNING',
  'TABLE', 'FIGURE', 'SC/IV', 'O TID', 'O BID', 'O QID',
]);

function isDrugNameLine(t) {
  const trimmed = t.trim();
  if (trimmed.length < 3) return false;
  if (!/^[A-Z0-9][A-Z0-9 ,\.\-\/()'’±]*$/.test(trimmed)) return false;
  if (!/[A-Z]{2,}/.test(trimmed)) return false; // must contain a real word, not just digits/punct
  if (NON_DRUG_BLACKLIST.has(trimmed)) return false;
  if (/^CYP[\s\d]/.test(trimmed)) return false; // pharmacogenomic subheadings, e.g. "CYP 2D6"
  if (/^CYP\s*P?450/.test(trimmed)) return false;
  // Table rows: multiple comma-grouped numbers (e.g. "MT 2 2,600 15,200 8,800")
  if ((trimmed.match(/\d,\d{3}/g) || []).length >= 2) return false;
  // Captions/sentences: too many words, or dominated by stopwords typical of table captions
  const words = trimmed.split(/\s+/);
  if (words.length > 8) return false;
  if (/^(WEIGHT|WITHOUT|AND |RECOMMENDED |CONVERTING |DOSAGES )/.test(trimmed)) return false;
  return true;
}

// Build drug blocks
const drugs = []; // { name, startPage, lines: [] }
let current = null;

for (let i = 0; i < cleanedLines.length; i++) {
  const { text, page } = cleanedLines[i];
  const trimmed = text.trim();

  if (isDrugNameLine(trimmed)) {
    // Check if this is a "continued" marker: "DRUGNAME continued" (mixed case "continued" would have been
    // stripped already since it fails ALL-CAPS test... but "continued" appears lowercase attached same line
    // e.g. "ACETAMINOPHEN continued" - lowercase word breaks the ALL-CAPS regex, so isDrugNameLine returns false.
    // Handle that case explicitly:
    current = { name: trimmed, startPage: page, lines: [] };
    drugs.push(current);
    continue;
  }

  // "DRUGNAME continued" pattern (mixed case)
  const contMatch = trimmed.match(/^([A-Z0-9][A-Z0-9 ,\.\-\/()'’±]*?)\s+continued$/);
  if (contMatch) {
    const name = contMatch[1].trim();
    const existing = drugs.find(d => d.name === name);
    if (existing) {
      current = existing;
    } else {
      current = { name, startPage: page, lines: [] };
      drugs.push(current);
    }
    continue;
  }

  if (current) {
    current.lines.push(text);
  }
}

console.log('Total drug blocks (incl. continuations merged by name):', drugs.length);

// NOTE: Harriet Lane is *mostly* alphabetical but NOT strictly so (e.g. LACOSAMIDE on p.1198
// genuinely precedes LABETALOL on p.1200 in the source book — newer drugs get inserted near
// their alphabetical neighborhood without a full re-sort). An alphabetical-order filter (e.g.
// longest-increasing-subsequence) was tried and rejected: it silently folded real drugs
// (AMPHOTERICIN B LIPOSOMAL, LABETALOL, NEOMYCIN SULFATE) into a neighbor's text. Silent
// data loss is worse than a few leftover junk entries, so we rely ONLY on the blacklist and
// structural filters above (isDrugNameLine) and accept some residual noise for manual pruning.

// Merge duplicate names (continued blocks not caught above, safety net)
const merged = {};
const order = [];
for (const d of drugs) {
  if (!merged[d.name]) {
    merged[d.name] = { name: d.name, startPage: d.startPage, lines: [] };
    order.push(d.name);
  }
  merged[d.name].lines.push(...d.lines);
}

const finalDrugs = order.map(name => merged[name]);
console.log('Unique drug names:', finalDrugs.length);

// Clean text artifacts within each drug's lines, join into single text blob
function cleanText(text) {
  let t = text;
  // en-dash artifact: digit-e-digit -> digit–digit (handles "10e15", "10 e 15", "8e10", "Q4e6")
  t = t.replace(/(\d)\s*e\s*(\d)/g, '$1–$2');
  // þ glyph artifact standing in for "+" (combination drug separator, e.g. "Fluticasone þ Vilanterol")
  t = t.replace(/þ/g, '+');
  // Lone "O" between route and frequency is a corrupted "÷" (divided) symbol, e.g. "PO O TID" = "PO ÷ TID"
  t = t.replace(/\b(PO|IV|IM|PR|SC|SL|IT|IO)\s+O\s+(BID|TID|QID|QD|once)/g, '$1 ÷ $2');
  // collapse multiple spaces
  t = t.replace(/[ \t]+/g, ' ');
  return t;
}

const output = finalDrugs.map(d => {
  const joined = d.lines.join('\n');
  return {
    name: d.name,
    startPage: d.startPage,
    rawText: cleanText(joined).trim(),
  };
}).filter(d =>
  // Drop near-empty blocks (likely false-positive anchors), but keep legitimate short
  // "See X" trade-name cross-reference stubs (e.g. "See Surfactant, pulmonary" = 26 chars)
  // regardless of length.
  d.rawText.length > 30 || /^See\b/i.test(d.rawText.trim())
);

console.log('Drugs after filtering near-empty blocks:', output.length);

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
console.log('Written to', OUT_PATH);
