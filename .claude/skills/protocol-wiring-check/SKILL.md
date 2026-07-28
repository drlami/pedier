description: Verify a PediER ER/Ward protocol's tabs and data are correctly wired to each other (no orphaned fields, no contradicting severity/disposition, no unimplemented claims) AND that the Manage-tab cards are organized for scanning under pressure (no numbering gaps, urgent card first, no severity-blind drug lists) — run before considering any protocol "done". Use when building, editing, or reviewing a file in src/lib/protocols/.

# PediER Protocol Wiring Check

A protocol here isn't "done" when it typechecks — it's done when every fact
the app shows a doctor is actually connected to every other fact that
depends on it. The failure mode we're guarding against: a single field
that's asked for, or a claim that's written in prose, but silently isn't
read by anything (or is read by the wrong thing). In a print booklet a
typo like that is visible on the page. Here it's invisible until a
specific combination of inputs hits it in a real ER — which is exactly
why this has to be checked deliberately, not assumed from the tab layout
looking reasonable.

Reference implementation: `src/lib/protocols/pneumonia.ts` +
`src/app/diseases/[diseaseId]/er-protocol-view.tsx`. When in doubt about
whether a pattern is correct, check whether pneumonia.ts does it that way.

## Checklist — walk through each item against the protocol file in question

### 1. Every field has exactly one producer and is read by everyone who needs it
- List every `data.xxx` read inside `calculateSeverity`, `getManagement`,
  `getDisposition`, `getRedFlags`, `getDrugDoses`, `getInvestigations`.
- For each one, confirm it's actually settable: either a `questions[]`
  entry with that `id`, a `historyChecklist[]` entry with that `id`, an
  `admitOverrides`/`severityClassification.admitOverrides` entry with that
  `id`, or one of the shared vitals-bar fields (`weight`, `ageMonths`,
  `oxygenSaturation`, `heartRate`, `respiratoryRate` — these sync in
  automatically from `ErProtocolView`, don't need a `questions[]` entry).
- Flag any `data.xxx` read that has no producer anywhere — it will always
  be `undefined` and silently take the "else" branch forever.
- Flag any question/history item whose `id` is never read anywhere — dead
  input, confusing to whoever fills it in for no effect.

### 2. Severity has exactly one source of truth
- If the protocol uses `severityClassification` (reference mode — the
  clinician taps a band), severity comes from `formData.manualSeverity`,
  full stop. `calculateSeverity` should not also try to compute a
  competing severity from other inputs.
- If the protocol scores/gates severity, `calculateSeverity` is the only
  place that decides the level. `getManagement`, `getDisposition`,
  `getRedFlags`, `getDrugDoses` must all take the `Severity` object as
  given — never re-derive their own judgment of "how sick" from raw
  `formData` independently. Two independent judgments is how you get a
  contradiction between tabs.

### 3. Admit-overrides are facts, never folded into severity text
- Mandatory-admission facts (age cutoff, immunocompromise, complication,
  failed outpatient therapy, etc.) belong in `admitOverrides`, kept
  separate from the severity band/score.
- There must be no static per-band "what happens now" string anywhere
  outside `getDisposition(severity, data)`. A second static copy is
  exactly the bug already hit once in this codebase (see the comment in
  `SeverityClassification` in `types.ts`): the UI showed "discharge" for
  a band while the override checklist simultaneously said "admit."
  `getDisposition` is the only function allowed to combine severity +
  overrides into an answer.

### 4. Every prose claim is actually implemented
- For each `historyChecklist[].ifYes` that promises an action ("add
  Clindamycin", "urgent ENT referral", "no observation option") — grep
  `getManagement`/`getDrugDoses` for that drug/action and confirm it's
  actually conditionally added when that flag is true, not just described
  in the question text.
- Same check in reverse: if `getManagement` branches on a condition
  (e.g. `hasOverride`, `isNeonate`, `failed`), confirm the UI actually
  lets a clinician set that condition (a real question, history item, or
  override — not a variable that's always false because nothing sets it).
- **Real example already caught and fixed** (pneumonia.ts, 2026-07-28):
  `historyChecklist` had 6 context flags (TB contact, post-viral prodrome,
  aspiration risk, underlying lung disease, prior hospitalisation, CHD/
  chest wall deformity) documented in a code comment as flags that "change
  MANAGEMENT" — but `getManagement`/`getDrugDoses` never read any of the
  6 `data.xxx` ids. Ticking "yes" showed a note once in Assess and changed
  nothing downstream. The fix: destructure the flags at the top of
  `getManagement`, build a `contextLines: string[]` from whichever are
  true, and render them as one additional card (see item 10) rather than
  leaving them as a note only the Assess tab sees. `getDrugDoses` was
  updated the same way — the matching drug entries now say
  `⚠ INDICATED — <flag> flagged in Assess` in their `notes` field instead
  of a generic "if suspected" note. When you find a similar checklist of
  "changes management" flags in another protocol, use this same shape:
  one `contextLines` builder, one extra card, and matching `notes` updates
  in `getDrugDoses` — don't invent a different mechanism per protocol.

### 5. Drug doses are computed, not copy-pasted
- Every dose in `getDrugDoses` should be a function of `data.weight`
  (mg/kg arithmetic) unless it's genuinely weight-independent (e.g. a
  single-dose IM injection by age band). A flat hardcoded number where a
  per-kg dose is standard is a red flag on its own.
- Check for a sane max-dose cap (`Math.min(x * wt, max)`) on anything
  that has a real adult-dose ceiling.
- If age changes which drug/regimen applies (neonate vs. infant vs.
  child), confirm the branch actually reads `data.ageMonths` and handles
  the "age not entered yet" case explicitly (pneumonia.ts shows both
  options rather than silently guessing — copy that pattern).
- **The dose LIST itself must respond to severity, not just the numbers
  in it.** Check whether `getDrugDoses` actually reads its `severity`
  parameter at all (`grep` for `severity\.` inside the function body — if
  that's empty, the whole list is severity-blind). Real example: before
  a 2026-07-28 fix, pneumonia.ts's `getDrugDoses` never read `severity`,
  so oral Amoxicillin and IV Ceftriaxone/Vancomycin/Clindamycin all
  appeared unconditionally regardless of whether Mild, Moderate, or
  Severe was tapped — a doctor treating a severe case saw an oral option
  sitting right next to the IV ones as if it were still on the table.
  The fix pattern: derive boolean gates once (e.g. `showOral`, `showIV`,
  `showStaphCover`) from `severity.level` / `severity.admitOverrides` /
  the same context flags used in `getManagement`, and wrap each `doses
  .push(...)` block in the matching `if (...)`. Also add the same
  "severity not yet selected" early return `getManagement` already has
  (`if (severity.level !== 'severe' && ... !== 'mild') { ...placeholder...
  return doses; }`) so an unselected band shows a prompt instead of an
  empty or misleadingly partial list.

### 6. Any export/summary feature includes everything, not a subset
- If there's a "copy orders" / "copy summary" action, confirm it pulls
  from management recommendations, drug doses, AND investigations — not
  just whichever tab's component happens to own the button. (This exact
  gap exists in `copyOrders` in `er-protocol-view.tsx` today — it omits
  `erData.investigations`. Known, deprioritized, but don't copy the same
  omission into a new export feature.)

### 7. References are real and checkable
- Every entry in `getReferences()` needs a real title and a working URL
  (or an honest empty `url: ''` for a textbook citation with no online
  version — never a plausible-sounding fabricated guideline title). See
  `_TRIAGE_REVIEW_NOTES.md` in the Guidelines source folder for examples
  of exactly this kind of fabrication already caught once.

### 8. Ward handoff, if mentioned, actually exists
- If `getManagement`/`getDisposition` text tells the clinician "see the
  X Ward Protocol," confirm a `ward-*.ts` file with that content actually
  exists in `src/lib/protocols/`. A named handoff to a protocol that
  doesn't exist is a dead end for whoever reads it at 3am.

### 9. `lastUpdated` and sourcing are honest
- `lastUpdated` should reflect when the clinical content was actually
  verified, not just when the file was last touched for a UI tweak.

### 10. Management cards are organized for scanning under pressure, not just correct
Wiring can be 100% correct and the Manage tab can still be confusing.
Check the actual rendered card list (`getManagement`'s returned array,
in order) for these, all found and fixed in pneumonia.ts on 2026-07-28:
- **No numbering gaps.** Don't title cards "STEP 1", "STEP 1B", "STEP 2",
  "STEP 4" — a reader sees the gap (where's 3?) and assumes something is
  missing or broken. Either keep a genuinely gapless numbered sequence, or
  give non-sequential cards a plain descriptive title with no step number
  at all (e.g. "CONTEXT — ...", "HANDOVER — ...", "IF THIS HAPPENS NOW —
  ...").
- **The most urgent card goes near the top, not the bottom.** A
  life-threatening-deterioration card is the single most time-critical
  thing on the tab — it was previously last in the array (after a
  "you're admitted, ward takes over" HANDOVER card). Move it to render
  right after the primary immediate-management card, in every severity
  branch, so it's seen regardless of which band was tapped.
- **Split compound bullets: one action per line, citation/rationale as a
  sub-line.** A string that bundles an instruction with its citation
  ("Oxygen — titrate to SpO₂ ≥ 94%. Where ventilator-derived CPAP is
  unavailable, bubble CPAP improves mortality... (Nelson).") is two
  things wearing one checkbox. Split it into the action string, then a
  second array entry starting with `'•  '` (two spaces after the bullet)
  — `ManageTab` in `er-protocol-view.tsx` already renders any
  recommendation starting with `•` as an unchecked, indented, muted
  sub-line instead of a checkbox row. Same treatment for a bullet that
  bundles two unrelated orders (e.g. "CXR ... Blood: CBC, CRP...") —
  split into two full bullets instead, since both need their own
  checkbox.
- **A card built from the clinician's own answers (not generic protocol
  text) should look visually different from the generic step cards.**
  `ManageTab`'s tone-matching in `er-protocol-view.tsx` is a keyword
  ternary on the card title (`STEP 4`/`LIFE-THREAT`/`FAILURE` → red,
  `STEP 3`/`ESCALATION` → orange, `STEP 2`/`REASSESS` → amber, `CONTEXT`/
  `BASED ON YOUR ANSWERS` → indigo, else → default gray). If a new
  protocol introduces another dynamically-personalized card, either reuse
  the `CONTEXT`/`BASED ON YOUR ANSWERS` keyword or extend that same
  ternary chain with a new keyword — don't invent a separate styling
  mechanism, and grep existing titles first (`grep -rniE "title:.*YOURKEYWORD"
  *.ts`) to make sure it doesn't accidentally match another protocol's
  card.

## Open design questions — recorded so they aren't silently re-decided

- **Tab order is `assess → manage → labs → dispose`, not `assess → labs →
  manage → dispose`.** Raised 2026-07-28: real clinical workflow often
  orders investigations before committing to management. Left as-is
  deliberately for now — the counter-argument is that this is an
  *emergency* app, and for a genuinely sick child, stabilization
  (oxygen, first antibiotic dose) starts immediately rather than waiting
  on labs; the severe-pathway text already says "blood culture × 2
  BEFORE antibiotics" as one bullet inside Manage rather than requiring a
  separate tab visit first. No decision was made to change the tab
  order — if this comes up again, it's a UX/priority call for the user to
  make, not something to "fix" unilaterally, since tabs aren't a gated
  wizard and reordering them doesn't add or remove any information either
  way.

## How to use this on an existing protocol

Read the protocol file (`src/lib/protocols/<id>.ts`) end to end, then
walk items 1–10 against it. For item 1 specifically, grep is faster than
reading: `grep -oE "data\.[a-zA-Z_]+" <file>.ts | sort -u` gives you every
field read; cross-reference each against the `id:` values defined in
`questions`, `historyChecklist`, and `admitOverrides` in the same file.
For item 5's severity-blindness check: `grep "severity\." <file>.ts` inside
`getDrugDoses` specifically — empty means the whole dose list ignores it.

## How to use this when reviewing many protocols at once

Reviewing several protocols is independent, read-heavy work per file —
launch one agent per protocol (or small group) with this checklist
inline in the prompt, since a fresh agent won't have this file's context
otherwise. Report back a simple per-protocol pass/fail list against the
10 items, not a rewrite — fixing wiring bugs is a decision for whoever's
building that protocol, not something to silently patch.
