# Translation Memory Creator

A Nuxt 3 front-end prototype for the PONS Translation Memory Creator wizard.

## Quick start

```bash
git clone <repo> && cd tm-creator
npm install
npm run dev   # http://localhost:3000
```

Opens directly at **http://localhost:3000/translation-memories/creator**.

## Tech stack

- **Nuxt 3** + **Nuxt UI** (Tailwind-based component library)
- **Pinia** — wizard & segments state
- **VueUse** — utilities
- **Mock data** — `mocks/segments.json` (127 DE→EN pairs) + `mocks/ai-suggestions.json`
- **Server API** — `server/api/*` Nitro route handlers (no real backend)

## Wizard flow

| Step | Route | Description |
|------|-------|-------------|
| 1 | Source Input | Choose source type, upload 2 files, set language pair |
| 2 | Match & Validate | Alignment animation → segment review table |
| 3 | Precision Editing | Full editing — AI review, export .tmx, save to TM |

## Stories implemented

- **PEG-1284** — Two-document upload with format validation, mock progress, auto-advance
- **PEG-1292** — Confirmed/Excluded segment tabs, score badges, pagination, search & filter
- **PEG-1293** — Row selection, Save Segments dropdown (existing/new TM dialog), .tmx export
- **PEG-1295** — Per-segment AI suggestion drawer with diff view, bulk accept-all / accept-specific
