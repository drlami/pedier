Harriet Lane formulary extraction pipeline. Run in order with `pdfjs-dist@3.11.174` installed
(`npm install pdfjs-dist@3.11.174` in this directory) and the source PDF at
`C:/Users/hp/myproject/books/harrietlane.pdf`.

1. `node extract.js` → `formulary_raw.txt` (pages 994–1404, reading-order-corrected, sidebar-stripped)
2. `node split_drugs.js` → `drugs_intermediate.json` (per-drug `{name, startPage, rawText}`)
3. `node classify.js` → `drugs_classified.json` (adds `structuredDoses[]`; empty = fallback to raw text)

See `../../../../.claude/projects/C--Users-hp/memory/pedier-formulary-plan.md` (or ask Claude to
recall the "Pedier Formulary Plan" memory) for the full history of bugs found and fixed in this
pipeline, the parsing strategy rationale, and next steps (TS data file generation, UI build).

Do not blindly re-run without reading that memory first — several fixes here (sidebar x-cutoff,
`±` in drug names, the whitelisted "d"-as-dash artifact) exist because of specific, verified bugs
that silently corrupted clinical dosing data. Changing the filters without re-validating against
the source PDF risks reintroducing them.
