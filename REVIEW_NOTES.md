# PediER — HFOV & Mechanical Ventilation Safety Review

**Date:** 2026-06-03  
**Reviewer:** Claude Code (claude-sonnet-4-6)  
**Status:** Review complete. No patches applied yet. Awaiting approval per patch.

---

## Files Reviewed

- `artifacts/pmc-pedier-aid/src/lib/calculators/hfov-logic.ts`
- `artifacts/pmc-pedier-aid/src/lib/calculators/mechanical-ventilation.ts`
- `artifacts/pmc-pedier-aid/src/app/hfov/hfov-protocol.tsx`
- `artifacts/pmc-pedier-aid/src/app/mech-vent/mech-vent-protocol.tsx`
- `artifacts/pmc-pedier-aid/src/pages/calculators/PediatricVentilatorCalculator.tsx`
- `artifacts/pmc-pedier-aid/src/lib/calculators/formulas.ts`
- `artifacts/pmc-pedier-aid/src/lib/safety-engine.ts`

---

## Verdicts

| File | Verdict |
|---|---|
| `hfov-logic.ts` | Needs major fixes |
| `mechanical-ventilation.ts` | Needs major fixes |
| `hfov-protocol.tsx` | Needs minor fixes |
| `mech-vent-protocol.tsx` | Needs minor fixes |
| `PediatricVentilatorCalculator.tsx` | **Unsafe until revised** — runtime crash |

---

## Patch Plan (apply in order, one at a time)

### PATCH 1 — P0 — Runtime Crash Fix ✅ DO FIRST
- **File:** `src/pages/calculators/PediatricVentilatorCalculator.tsx`
- **Lines:** 306 and 310
- **Fix:** `results.weaning.ready` → `results.weaning.status`
- **Why:** The field `ready` does not exist on the return type of `calculatePediatricVent()`. Calling `.toUpperCase()` on `undefined` crashes the page.

---

### PATCH 2 — P1 — `mechanical-ventilation.ts` (4 fixes, one session)

**Fix 2a — Remove P/F ratio block**
- The P/F thresholds (100 / 200 / 300) are from the adult Berlin ARDS Definition.
- PALICC-2 explicitly uses OI/OSI for PARDS severity, not P/F ratio.
- Remove or demote to informational-only with a note it is not PALICC-2 severity grading.

**Fix 2b — Wire `isStabile` into weaning readiness**
- `const isStabile = (inputs.lactate || 0) < 2;` is computed but never used (dead code).
- A patient with lactate > 2 should not be declared weaning-ready on gas exchange alone.
- Change `if (isGasReady)` → `if (isGasReady && isStabile)` or add a `caution` tier.

**Fix 2c — Fix OI < 4 label**
- Current: OI < 8 → message `'Mild Injury'`
- Fix: OI < 4 → `'No PARDS Criteria'`, OI 4–8 → `'Mild PARDS'`
- PALICC-2 requires OI ≥ 4 for any PARDS diagnosis.

**Fix 2d — Fix driving pressure danger message**
- Current: `dPMessage = 'INCREASED CONCERN'` at danger level
- Fix: `'HIGH VILI RISK — Reduce PEEP or Pplat'`
- Message is too soft for a danger-level clinical signal.

---

### PATCH 3 — P1 — `hfov-logic.ts` (4 fixes, one session)

**Fix 3a — Remove `'asthma'` from `HFOVDiagnosis` type**
- Current: `export type HFOVDiagnosis = 'ards' | 'air-leak' | 'asthma' | 'phtn' | 'other';`
- Fix: Remove `'asthma'`
- HFOV is relatively contraindicated in obstructive disease (gas trapping risk).
- The UI dropdown already excludes asthma — the type must match.

**Fix 3b — Add safety note to amplitude formula**
- Current: `startAmp = \`${convPip + 10} - ${convPip + 20}\`` with no ceiling
- For a 5 kg infant with PIP 28, this outputs 38–48 cmH2O amplitude — dangerously high.
- Add output note: "Titrate to chest wiggle (clavicles to mid-thighs). This range is a starting point only; reassess immediately."

**Fix 3c — Fix OI < 4 label**
- Same as Fix 2c above — apply identically.

**Fix 3d — Add hemodynamic stability to weaning readiness**
- Current weaning check: `fio2 <= 0.40 && map <= 18`
- Missing: hemodynamic stability condition.
- Add a note in weaning steps: "Confirm hemodynamic stability before reducing MAP."

---

### PATCH 4 — P2 — Extract OI/OSI to `formulas.ts`
- Both `hfov-logic.ts` and `mechanical-ventilation.ts` contain identical OI/OSI formula code.
- Add to `src/lib/calculators/formulas.ts`:
  ```typescript
  export const calculateOxygenationIndex = (fio2: number, map: number, pao2: number): number
  export const calculateOSI = (fio2: number, map: number, spo2: number): number
  ```
- Replace both inline implementations with imports from formulas.ts.
- Pure refactor — no logic change.

---

### PATCH 5 — P2 — Remove `"use client"` from UI files
- **Files:** `hfov-protocol.tsx` line 1, `mech-vent-protocol.tsx` line 1
- This is a Next.js App Router directive. This project uses Vite. It has no functional effect but is misleading.
- One-line delete per file.

---

## Do NOT Change

- PALICC-2 / PEMVECC reference links
- OI/OSI severity thresholds (OI: 8/16 — Moderate/Severe; OSI: 5/12)
- Hz frequency age-based ranges (PEMVECC-consistent)
- RR age-based ranges (PEMVECC/PALS-consistent)
- DOPES mnemonic content and layout
- ARDS lung-protective VT 3–6 mL/kg (PALICC-2)
- Tab layout: Indications / Calculator / Troubleshooting
- `formulas.ts` existing calculations (GFR, Parkland, fluids, etc.)
- `picu-placeholders.ts` — placeholder stubs only, no logic

---

## Architecture Notes

- Two mechanical vent UIs exist — `mech-vent-protocol.tsx` (correct, newer) and `PediatricVentilatorCalculator.tsx` (buggy, older). The older one should be fixed then evaluated for removal.
- `safety-engine.ts` handles drug interactions only — intentionally not connected to ventilator calculators.
- OI/OSI formula is duplicated across both logic engines — Patch 4 addresses this.
