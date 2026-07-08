const fs = require('fs');

const IN_PATH = __dirname + '/drugs_intermediate.json';
const OUT_PATH = __dirname + '/drugs_classified.json';

const drugs = JSON.parse(fs.readFileSync(IN_PATH, 'utf8'));

const ROUTES = ['PO', 'IV', 'IM', 'PR', 'SC', 'SL', 'IT', 'IO'];
const ROUTE_ALT = ROUTES.join('|');

// A route-only header line, e.g. "PO:", "IV:", "PO/PR:", "Inhalation (nonacute use; see remarks):"
const ROUTE_LABEL_RE = new RegExp(
  `^((?:${ROUTE_ALT}|Inhalation|Inhalations|Nebulization|Nebulized|Topical|Rectal|Sublingual|Intranasal|Intrathecal|Ophthalmic|Otic)(?:\\/(?:${ROUTE_ALT}))*)\\s*(?:\\(.*\\))?:\\s*$`,
  'i'
);

// An age/population label, possibly with dose content following on the same line
const LABEL_RE = /^([A-Za-z][A-Za-z0-9 ,()<>≥≤\/\-–.]*?):\s*(.*)$/;
const AGE_WORD_RE = /^(neonate|preterm|term|infant|child|pediatric|adolescent|adult|newborn|<|>|≥|≤|\d)/i;

const RISK_WORDS = [
  'see remarks', 'see above', 'see below', 'see chapter', 'see package insert', 'see table',
  'consider', 'unless', 'weight (lbs)', 'weight (kg)', 'gestational age', 'loading dose',
  'may require', 'if not', 'if the', 'depending on', 'individualize', 'titrate', 'renal',
  'hepatic', 'dialysis', 'crcl', 'gfr',
];

const DOSE_RE = /(\d+(?:\.\d+)?)(?:[–-](\d+(?:\.\d+)?))?\s*mg\/kg\/dose\b/i;
const ROUTE_TOKEN_RE = new RegExp(`\\b(${ROUTE_ALT})(?:\\/(?:${ROUTE_ALT}))*\\b`, 'i');
const FREQ_Q_RE = /\bQ(\d+(?:\.\d+)?)(?:[–-](\d+(?:\.\d+)?))?\s*hr\b/i;
const FREQ_NAMED_RE = /\b(BID|TID|QID|QD|once daily)\b/i;
const MAX_DOSE_RE = /max\.?\s*dose:?\s*(\d+(?:\.\d+)?)\s*mg\/kg\/(24\s*hr|dose)/i;
const MAX_DOSE_FLAT_RE = /max\.?\s*dose:?\s*(\d+(?:\.\d+)?)\s*mg\/(24\s*hr|dose)\b(?!\/kg)/i;
// "max. dose: the lesser of X mg/kg/24hr or Y mg/24hr" — a genuine dual safety cap (whichever
// is reached first applies), not ambiguity. Worth handling explicitly since it's common.
const MAX_DOSE_LESSER_RE = /max\.?\s*dose:?\s*the lesser of\s*(\d+(?:\.\d+)?)\s*mg\/kg\/(24\s*hr|dose)\s*or\s*(\d+(?:\.\d+)?)\s*(?:g|mg)\/(24\s*hr|dose)/i;

const PROXIMITY_WINDOW = 100; // chars after the dose match to search for route/frequency

function buildSegments(rawText) {
  const lines = rawText.split('\n');
  const segments = []; // { label, text }
  let currentRoute = null;
  let currentAge = null;
  let openSeg = null;

  function closeSeg() {
    if (openSeg) segments.push(openSeg);
    openSeg = null;
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const routeM = trimmed.match(ROUTE_LABEL_RE);
    if (routeM) {
      closeSeg();
      currentRoute = routeM[1].toUpperCase();
      currentAge = null;
      continue;
    }

    const labelM = trimmed.match(LABEL_RE);
    if (labelM && labelM[1].length <= 60) {
      const labelText = labelM[1].trim();
      const content = labelM[2];
      const isAge = AGE_WORD_RE.test(labelText);

      if (isAge) {
        closeSeg();
        currentAge = labelText;
        if (content && content.trim()) {
          openSeg = {
            label: [currentRoute, currentAge].filter(Boolean).join(' - '),
            text: content,
          };
        }
        continue;
      }

      // Indication-level label (only meaningful once we have an age context;
      // otherwise it's likely prose with an incidental colon — treat as continuation)
      if (currentAge) {
        closeSeg();
        openSeg = {
          label: [currentRoute, currentAge, labelText].filter(Boolean).join(' - '),
          text: content,
        };
        continue;
      }
    }

    // Continuation line
    if (openSeg) {
      openSeg.text += ' ' + trimmed;
    }
  }
  closeSeg();
  return segments;
}

function tryStructureSegment(seg) {
  const lower = seg.text.toLowerCase();
  let cutoff = seg.text.length;
  for (const risk of RISK_WORDS) {
    const idx = lower.indexOf(risk);
    if (idx !== -1 && idx < cutoff) cutoff = idx;
  }
  const core = seg.text.slice(0, cutoff);

  const doseMatches = [...core.matchAll(new RegExp(DOSE_RE.source, 'gi'))];
  if (doseMatches.length !== 1) return null; // none, or ambiguous (multiple doses in one segment)
  const doseM = doseMatches[0];
  const [, doseLow, doseHigh] = doseM;

  // Search a window after the dose figure for route + frequency (order-independent)
  const windowStart = doseM.index + doseM[0].length;
  const window = core.slice(windowStart, windowStart + PROXIMITY_WINDOW);

  const routeTokenM = window.match(ROUTE_TOKEN_RE);
  const routeFromLabel = seg.label.match(new RegExp(`\\b(${ROUTE_ALT})\\b`, 'i'));
  const route = routeTokenM ? routeTokenM[1].toUpperCase() : (routeFromLabel ? routeFromLabel[1].toUpperCase() : null);
  if (!route) return null;

  const freqQ = window.match(FREQ_Q_RE);
  const freqNamed = window.match(FREQ_NAMED_RE);
  if (!freqQ && !freqNamed) return null;

  const maxLesserM = core.match(MAX_DOSE_LESSER_RE);
  const maxM = core.match(MAX_DOSE_RE);
  const maxFlatM = core.match(MAX_DOSE_FLAT_RE);

  // A weight-based calculator with no enforced ceiling can over-dose a heavy patient — a max
  // dose figure is mandatory for structuring, not optional. No max found = no calculator,
  // falls back to raw text instead of silently omitting the safety cap.
  if (!maxLesserM && !maxM && !maxFlatM) return null;

  let maxDose;
  if (maxLesserM) {
    maxDose = {
      value: parseFloat(maxLesserM[1]),
      unit: maxLesserM[2].includes('24') ? 'mg/kg/24hr' : 'mg/kg/dose',
      flatCap: { value: parseFloat(maxLesserM[3]), unit: maxLesserM[4].includes('24') ? 'mg/24hr' : 'mg/dose' },
    };
  } else if (maxM) {
    maxDose = { value: parseFloat(maxM[1]), unit: maxM[2].includes('24') ? 'mg/kg/24hr' : 'mg/kg/dose' };
  } else {
    maxDose = { value: parseFloat(maxFlatM[1]), unit: maxFlatM[2].includes('24') ? 'mg/24hr' : 'mg/dose' };
  }

  return {
    ageGroup: seg.label,
    doseLow: parseFloat(doseLow),
    doseHigh: doseHigh ? parseFloat(doseHigh) : parseFloat(doseLow),
    doseUnit: 'mg/kg/dose',
    route,
    frequency: freqQ
      ? (freqQ[2] ? `Q${freqQ[1]}-${freqQ[2]}hr` : `Q${freqQ[1]}hr`)
      : freqNamed[1].toUpperCase(),
    maxDose,
  };
}

let totalWithStructured = 0;
let totalSegments = 0;
let structuredSegments = 0;

const classified = drugs.map(d => {
  const segments = buildSegments(d.rawText);
  const structured = [];
  for (const seg of segments) {
    totalSegments++;
    const s = tryStructureSegment(seg);
    if (s) {
      structured.push(s);
      structuredSegments++;
    }
  }
  if (structured.length > 0) totalWithStructured++;
  return {
    name: d.name,
    startPage: d.startPage,
    rawText: d.rawText,
    structuredDoses: structured,
  };
});

console.log('Total drugs:', drugs.length);
console.log('Drugs with >=1 structured dose entry:', totalWithStructured);
console.log('Total population/indication segments found:', totalSegments);
console.log('Segments successfully structured:', structuredSegments);

fs.writeFileSync(OUT_PATH, JSON.stringify(classified, null, 2), 'utf8');
console.log('Written to', OUT_PATH);
