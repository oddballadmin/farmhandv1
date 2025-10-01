# Copilot Instructions for farmhandv1

Concise, project-specific guidance for AI coding agents working in this monorepo.

## Architecture Overview

- Monorepo uses npm workspaces: `apps/api` (Express + TypeScript) and `apps/web` (Vite + React + TS). Shared TS config in `tsconfig.base.json`.
- API: Pure in-memory repositories (see `apps/api/src/repositories.ts`) implementing a generic CRUD interface. Domain models in `domain.ts`; request validation via Zod schemas in `validation.ts`; routes assembled in `routes.ts`; server entry in `index.ts`.
- Web: React app with module-oriented UI under `apps/web/src/ui/modules`. Layout shell (`ui/layout/DashboardLayout.tsx`) provides header, sidebar, and nested routes. Theming & design tokens centralized in `src/App.css` (semantic CSS variables for light/dark + elevation + accents). State for UI shell (sidebar etc.) handled by a Zustand store in `ui/state/uiStore.ts` (if present—extend similarly).
- Livestock feature: Sub-menu pattern implemented with `GenericSubMenu` + module-specific lists (see `ui/modules/sub-menus`). Animals UI split into category selection then per‑category list (`AnimalsPage.tsx`). Breeding management in `BreedingPage.tsx` and also quick-add breeding from Animals view.

## Data & Domain Conventions

- IDs are UUIDs (generated in repos). In-memory only; persistence layer replacement should plug into the `Repository<T>` interface.
- `Animal` extended with lifecycle `status` (open | bred | pregnant | fresh | dry). Breeding workflow updates female `status` to `bred` when a breeding record is created.
- `BreedingRecord` stores `maleAnimalId`, `femaleAnimalId`, ISO `breedingDate`, optional `expectedDueDate` (first day of month if only month known), `status` lifecycle (planned → confirmed → successful/unsuccessful).

## API Patterns

- Validation: Always validate request payloads with the corresponding Zod schema (`validation.ts`) before repository interaction.
- Routes follow RESTful plural nouns; patch endpoints accept partial payloads (`updateXSchema = createXSchema.partial()`).
- Add new domain type: update `domain.ts`, add schema(s) in `validation.ts`, seed (optional) in `repositories.ts`, wire CRUD routes in `routes.ts`.
- Side-effects (e.g., updating animal status after breeding) currently performed client-side by chaining a POST (breeding) then PATCH (animal). If centralizing, add a service function in `routes.ts` or a thin domain service layer first.

## Frontend Patterns

- Theming: Only use CSS variables defined in `App.css`; do not introduce hard-coded colors. For new surface elements prefer `--card-bg`, `--card-border`, `--panel-bg`, `--fg`, `--divider-color`, and accent gradients.
- Avoid inline styles for reusable UI; prefer a colocated `*.css` file (see `animals.css`). Inline is acceptable for one-off layout tweaks or dynamic style states.
- Sub-menus: Add item in `Livestock-sub-menu.tsx` (or create a new module sub-menu) and ensure route exists in `DashboardLayout.tsx`.
- New modals: Use an overlay div + token-based colors (`--card-bg`, `--fg`), and ensure keyboard accessibility (focus trap not yet implemented—add before complex expansion).
- Sorting/filtering: Client-side sorting done via `useMemo` on the fetched array; keep transformations pure & stable.
- Breeding quick-add: Creating a record plus status mutation mirrors how multi-step workflows should stage changes until a backend aggregation endpoint exists.

## Coding Conventions

- Use named imports for React (`import { useState, useEffect } from 'react'`) and avoid default `React` import unless JSX runtime needs it.
- Type inference preferred; explicit interfaces for data contracts at API boundary or persisted structures.
- Keep repository functions async for future persistence swap, even if in-memory now.
- Favor small, focused components; avoid context proliferation—Zustand or simple prop drilling for now.

## Build & Run

- Install deps: `npm install` at root (workspaces handle both apps).
- Dev (concurrently API + Web): `npm run dev` (root script presumably runs both; if absent, run each: `npm run dev -w apps/api` and `npm run dev -w apps/web`).
- Build API: `npm run build -w=apps/api` (tsc). Build Web: `npm run build -w=apps/web` (tsc + Vite bundle).
- Tests: See `apps/api/tests/*.test.ts` for example (add similar patterns if expanding).

## Adding a Feature (Example: Feed Scheduling)

1. Domain: Add `FeedSchedule` interface in `domain.ts`.
2. Validation: Add `createFeedScheduleSchema` / `updateFeedScheduleSchema` in `validation.ts`.
3. Repo: Seed optional examples in `repositories.ts`; expose in `repos`.
4. Routes: CRUD endpoints in `routes.ts` using validation helpers.
5. Frontend: Add sub-menu link & page component under `ui/modules/Livestock` or new module folder; adhere to token-based styling.
6. Instructions doc: Update this file if a new cross-cutting pattern is introduced.

## Pitfalls / Gotchas

- Do not hard-code colors or shadow declarations; always rely on tokens—dark mode depends on it.
- Remember to patch related entities when creating dependent records (e.g., breeding → update female status).
- In-memory data will reset on server restart—design UI with optimistic updates tolerant of refresh loss.
- Keep Zod schemas in sync with domain or type drift will silently allow stale frontend assumptions.

## When Unsure

- Search by domain keyword (e.g., `BreedingRecord`) to trace full flow (domain → validation → repo seed → routes → UI usage).
- Emulate existing patterns before inventing new abstractions; propose refactors only after adding feature parity.

---

Provide feedback if you need more detail on theming, state management, or planned persistence migration.

## Project Workflow Philosophy

- Prefer vertical slices: domain + validation + route + UI in one focused PR.
- Keep changes small & cohesive (avoid sprawling refactors mixed with feature work).
- Client performs lightweight domain side‑effects (e.g., breeding POST then animal PATCH) until a service layer is introduced—mirror existing pattern before abstracting.
- Always introduce new data via domain → validation → seed (optional) → route; UI should not assume fields absent from schemas.
- Theming consistency is non‑negotiable: new components must use existing semantic tokens (no raw hex).
- Minimize inline styles; colocate component CSS (e.g., `animals.css`) when styles are reused or exceed a few declarations.
- Optimize later: first get parity with existing patterns, then propose refactor with rationale.

## Common Commands

Install deps (root): `npm install`
Dev both apps: `npm run dev`
Dev single API: `npm run dev -w apps/api`
Dev single Web: `npm run dev -w apps/web`
Build API: `npm run build -w=apps/api`
Build Web: `npm run build -w=apps/web`
Run API tests: `npm test -w apps/api` (add new tests under `apps/api/tests`)

## Styling Token Dictionary (Key Semantic Vars)

Background layers: `--page-bg-1`, `--page-bg-2`, `--surface-bg`, `--panel-bg`
Text: `--fg` (primary), `--fg-secondary`
Cards / Panels: `--card-bg`, `--card-border`, `--module-panel-bg`, `--module-panel-border`
Borders & dividers: `--border-color`, `--divider-color`
Navigation: `--nav-link-color`, `--nav-link-hover-bg`, `--nav-link-active-bg`, `--nav-link-active-color`
Buttons (action examples): `--action-btn-bg`, `--action-btn-hover-bg`, `--action-btn-color`
Accents / gender tags: `--accent-male`, `--accent-female`
Signals: `--positive-color`, `--negative-color`
Typography families: `--font-body`, `--font-heading`
Elevation shadows: `--elevation-1`, `--elevation-2`

Use mode mapping (light/dark) variables rather than hard-coded colors; dark overrides are supplied via media query and `data-theme` overrides.

## Workflow Notes & Examples

Adding a breeding record from Animals view:

1. UI collects male/female, date, due month.
2. POST `/api/breeding-records` with ISO dates (due month coerced to first day).
3. PATCH female animal `status: "bred"`.
4. Locally update state (optimistic) to reflect new status.

Adding a new domain entity (e.g., FeedSchedule):

1. `domain.ts`: add interface.
2. `validation.ts`: add create/update schemas.
3. `repositories.ts`: optional seed; export via `repos`.
4. `routes.ts`: CRUD endpoints + schema validation.
5. Web: component UI + route + (optional) sub-menu item.

UI pattern checklist:

- Data fetch: simple `useEffect` + `fetch`; wrap transformations with `useMemo` for stable sorting/filtering.
- Sorting: store `sortKey` + `sortDir`; pure comparator; never mutate original array.
- Mass edit: Set of selected IDs, supports select all of filtered result.
- Modals: overlay + token backgrounds; ensure accessible labels and focus handling when complexity increases.

## Do / Avoid

Do: Add tests alongside new API behaviors. Avoid: introducing service abstractions prematurely.
Do: Keep animal & breeding flows consistent with existing optimistic updates. Avoid: assuming persistence beyond runtime.
Do: Consolidate repeated inline styles into a CSS module/file when reused >2 places. Avoid: scattering one-off tokens.
