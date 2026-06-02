# PMC PediER Aid - Project Status

## Removed Features
The following features and components have been permanently removed from the project as of June 2026:
- **api-server**: The Express API server used for AI features is gone.
- **Differential Diagnosis**: The AI-powered differential diagnosis section has been removed.
- **Drug Safety Checker**: The AI drug safety checker has been removed.
- **AI Protocol Drafter**: The AI-assisted protocol drafting in the admin panel has been removed.

## Current Architecture
- **Frontend-only**: The application is now a pure client-side React app.
- **Persistence**: All data (auth, custom protocols, custom drugs) is stored in `localStorage`.
- **Calculators**: Weight-based calculators (Cardiac Arrest, RSI, etc.) remain functional as they are pure client-side logic.
