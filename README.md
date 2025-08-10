# Farm Management SaaS – MVP Scaffold

This repo is a clean, extendable monorepo starter for a Farm Management SaaS MVP.

- Backend: TypeScript + Express (modular, domain-first, repository pattern, Vitest tests)
- Frontend: Vite + React + TypeScript (proxy to API, simple starter UI)
- Docs: This README and the provided PDF spec `farm_saas_mvp_spec_full.pdf`

## Structure

- `apps/api` – Express API (TS)
- `apps/web` – Vite React app (TS)
- `tsconfig.base.json` – Shared TS config

## Run locally

- Install dependencies at the root (uses npm workspaces).
- Start API and Web each in its app folder.
- Web is configured to proxy `/api` to the API server.

## Extend

- Add new domain models in `apps/api/src/domain.ts`.
- Implement repositories under `apps/api/src/repositories.ts` (start with memory, later swap to DB).
- Add new routes under `apps/api/src/routes.ts`.
- Expand tests in `apps/api/tests`.

## Notes

- Keep code small, strongly-typed, and commented.
- Use the OpenAPI file at `apps/api/openapi.yaml` to document endpoints.
- The PDF spec is included in repo root for reference.
