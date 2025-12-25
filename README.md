# Mooove — Avax Chronicles (Separated)

This repository contains a split-up version of the single-file `AvaxChronicles` React component. It has been refactored into smaller components and utilities for clarity and maintainability.

## What's included

- Vite + React project skeleton
- Tailwind CSS setup
- `src/components`:
  - `Header.jsx`
  - `PoliceStation.jsx`
  - `Courtroom.jsx`
  - `CaseCard.jsx`
  - `SubmitForm.jsx`
- `src/utils/storage.js` — wrapper to use `window.storage` when available or fallback to `localStorage`
- `src/utils/constants.js` — phases and pages
- `src/hooks/useTimer.js` — small timer hook (included for future use)
- `src/App.jsx` — the main app, wiring components and state

## How to run

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`

Note: The code expects `window.storage` helpers and `window.ethereum` (Metamask) integrations in the browser; fallback behaviors are provided for local development.

## Next steps / suggestions

- Add unit tests / integration tests
- Optional: move state into React Context for larger apps
- Implement real storage adapters or a backend

---

If you'd like, I can now:
- Add route-based pages
- Move state into React Context
- Add unit tests and linting

Tell me which next step you prefer.
