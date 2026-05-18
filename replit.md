# PMC PediER Aid — Workspace

## Overview

pnpm workspace monorepo using TypeScript. PMC PediER Aid is a pediatric emergency clinical decision support tool for residents, built by Dr Lami Qurt. It features 80+ disease protocols organized by clinical system, AI-powered differential diagnosis and drug safety checking, cardiac arrest / RSI calculators, and admin protocol management.

## Architecture

```
artifacts/
  pmc-pedier-aid/   — React + Vite frontend (port 20275, preview path /)
  api-server/       — Express 5 API server (port 8080, preview path /api)
  mockup-sandbox/   — Component preview server for Canvas (port 8081)
```

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, Wouter (routing), TanStack Query, Tailwind v4, shadcn/ui
- **API framework**: Express 5
- **Database**: None — all persistence is client-side localStorage
- **AI**: Google Genkit (`genkit`, `@genkit-ai/google-genai`) with Gemini 2.5 Flash
- **Build**: esbuild (ESM bundle for API server)

## Data Storage (No Database)

All persistent data lives in the browser via localStorage:

| Key | Contents |
|-----|----------|
| `pmc-auth-session` | JSON session object `{id, username, role}` — set on login |
| `pmc-custom-drugs-v2` | Custom + edited drug entries (array of DrugEntry objects) |
| `pmc-custom-protocols-v1` | Admin-created protocols (array of CustomProtocol objects) |
| `pmc-hidden-protocols-v1` | Array of built-in protocol IDs hidden by admin |

**Auth** — Passwords are verified client-side with bcryptjs against hardcoded bcrypt hashes in `src/lib/static-users.ts`. Two accounts: `drlamiqurt` (admin) and `drsamer` (specialist).

**Custom drugs** — Pre-seeded on first load with 5 entries (Amoxicillin-Clavulanate, Amoxicillin override, Cefdinir, Cefixime, Metronidazole override). Managed in `src/lib/drug-store.ts`.

**Protocols** — Managed via `src/contexts/protocols-context.tsx`. Custom protocols and hidden protocol IDs are stored in localStorage.

## Key Features

1. **Protocol Library** — 80+ disease protocols in `artifacts/pmc-pedier-aid/src/lib/protocols/`. Each protocol is a TypeScript file with `calculateSeverity`, `getManagement`, `getDisposition`, `getRedFlags`, `getDrugDoses`, `getReferences` functions. Protocol index at `src/lib/protocols/index.ts`.

2. **AI Differential Diagnosis** — POST `/api/ai/differential-diagnosis` — input: `{age, symptoms, history}`, returns ranked differentials, workup, management, red flags.

3. **AI Drug Safety Checker** — POST `/api/ai/drug-safety` — input: `{drugList}`, returns interactions, breastfeeding safety, renal adjustments.

4. **Admin Protocol Drafting** — POST `/api/ai/draft-protocol` — input: `{guidelineText}`, returns structured JSON protocol draft from medical guidelines.

5. **Cardiac Arrest / RSI Calculators** — Pure client-side weight-based drug dose calculators at `/cardiac-arrest`.

## Routing (Wouter)

| Path | Component |
|------|-----------|
| `/` | `src/pages/home.tsx` — protocol browser with sidebar system filter |
| `/diseases/:diseaseId` | `src/pages/disease.tsx` → `src/app/diseases/[diseaseId]/assessment-form.tsx` |
| `/diseases/:diseaseId/summary` | `src/pages/summary.tsx` — printable assessment summary |
| `/cardiac-arrest` | `src/pages/cardiac-arrest.tsx` |
| `/differential-diagnosis` | `src/pages/differential-diagnosis.tsx` |
| `/drug-safety` | `src/pages/drug-safety.tsx` |
| `/admin` | `src/pages/admin.tsx` |
| `/admin/protocols` | `src/pages/admin-protocols.tsx` |
| `/admin/protocols/:protocolId` | `src/pages/admin-protocol-editor.tsx` |

## API Routes (Express — AI only, no DB)

- `GET /api/health` — health check
- `POST /api/ai/differential-diagnosis` — AI diff diagnosis
- `POST /api/ai/drug-safety` — AI drug safety check
- `POST /api/ai/draft-protocol` — AI protocol drafting

## Drug Doses Page

- Built-in drugs are hardcoded in `artifacts/pmc-pedier-aid/src/lib/drug-doses.ts` (DRUGS array)
- Custom/edited drugs are stored in localStorage key `pmc-custom-drugs-v2`
- `loadCustomStore()` / `saveCustomStore()` in `drug-store.ts` read/write localStorage
- `getMergedDrugs(store)` in `drug-doses.ts` merges built-in + custom drugs

## Environment Variables / Secrets

- `GOOGLE_GENAI_API_KEY` — required for all AI features (Gemini via Genkit)

## Key Commands

- `pnpm --filter @workspace/pmc-pedier-aid run dev` — run frontend locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm run typecheck` — full typecheck across all packages

## Migration Notes

Migrated from Next.js/Vercel to Replit pnpm monorepo:
- Next.js Server Actions → Express API routes in `artifacts/api-server/src/routes/ai.ts`
- `next/link` → Wouter `<Link>`
- `next/navigation` (`usePathname`, `useSearchParams`, `useRouter`) → Wouter hooks
- `useActionState`/`useFormStatus` → custom `useState`/`fetch` hooks
- Tailwind v3 CSS variables → Tailwind v4 `@theme inline` with HSL values
- Protocol library is pure client-side TypeScript, no database needed

Migrated from PostgreSQL to localStorage:
- DB auth (bcrypt + JWT + sessions) → client-side bcryptjs against static hashes in `static-users.ts`
- DB custom drugs → localStorage `pmc-custom-drugs-v2` (pre-seeded)
- DB custom/hidden protocols → localStorage via `protocols-context.tsx`
- Express auth/users/protocols/drugs/activity-logs routes → removed; API server is AI-only
