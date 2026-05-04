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
- **Database**: Replit PostgreSQL via Drizzle ORM (`lib/db/` package, `@workspace/db`)
- **AI**: Google Genkit (`genkit`, `@genkit-ai/google-genai`) with Gemini 2.5 Flash
- **Build**: esbuild (ESM bundle for API server)

## Database

All persistent data is stored in PostgreSQL (Replit managed). Schema defined with Drizzle ORM in `lib/db/src/schema/`:

| Table | Contents |
|-------|----------|
| `users` | Staff login accounts (id, username, password_hash, role, created_at) |
| `custom_protocols` | Admin-created protocols (id, data JSONB, created_at, updated_at) |
| `hidden_protocols` | IDs of built-in protocols hidden by admin |
| `custom_drugs` | Custom + edited drug entries (id, data JSONB, is_custom, timestamps) |

- Schema push: `pnpm --filter @workspace/db run push` (dev) or `push-force`
- `DATABASE_URL` is set automatically by Replit when the database is provisioned
- Admin user (`drlamiqurt`) is seeded automatically on API server startup

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

## API Routes (Express)

- `GET /api/health` — health check
- `POST /api/ai/differential-diagnosis` — AI diff diagnosis
- `POST /api/ai/drug-safety` — AI drug safety check
- `POST /api/ai/draft-protocol` — AI protocol drafting

## API Routes (additional)

- `GET /api/custom-drugs` — list all custom/edited drugs (requireAuth)
- `PUT /api/custom-drugs/:id` — upsert a custom drug (requireAuth)
- `DELETE /api/custom-drugs/:id` — delete a custom drug (requireAuth)
- `GET /api/protocols` — list custom protocols (requireAuth)
- `POST/PUT/DELETE /api/protocols/:id` — manage custom protocols (requireAdmin)
- `GET /api/users` — list users (requireAdmin)
- `POST/PUT/DELETE /api/users/:id` — manage users (requireAdmin)

## Drug Doses Page

- Built-in drugs are hardcoded in `artifacts/pmc-pedier-aid/src/lib/drug-doses.ts` (DRUGS array)
- Custom/edited drugs are stored in the database and fetched via API on page load
- `fetchCustomStore()` in `drug-store.ts` fetches from `GET /api/custom-drugs`
- `getMergedDrugs(store)` in `drug-doses.ts` merges built-in + custom drugs
- One-time migration from `localStorage["pmc-custom-drugs-v1"]` to DB on first load

## Environment Variables / Secrets

- `GOOGLE_GENAI_API_KEY` — required for all AI features (Gemini via Genkit)
- `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — set automatically by Replit PostgreSQL provisioning

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
