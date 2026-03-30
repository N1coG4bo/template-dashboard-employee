# Architecture Guide (Type-Based)

This project uses a type-based React architecture focused on clear separation of responsibilities.

## Folder Structure

src/
- assets/
  - css/
    - global.scss: global style entrypoint
    - app.scss: migrated core stylesheet
  - images/: static images used by UI
- components/
  - common/: reusable presentational components
  - layout/: shared layout pieces (Navbar, Sidebar, Footer, SettingsPanel)
- screens/: route-level container views
- services/: API and backend access layer
- hooks/: custom React hooks
- utils/: pure utility functions
- App.jsx: application shell (layout + route host)
- main.jsx: React mount entrypoint
- index.js: compatibility entrypoint importing main.jsx

## Layer Responsibilities

- components/common
  - Reusable UI blocks with minimal business logic.
- components/layout
  - Shared page chrome and navigation structure.
- screens
  - Route views that orchestrate data + UI composition.
- services
  - Network client and domain API wrappers.
- hooks
  - Reusable state/effects logic.
- utils
  - Stateless helpers (formatting, calculations).

## Routing

Main route map is in:
- src/screens/index.jsx

The app shell renders these routes in:
- src/App.jsx

## Styling

Global styles are loaded from:
- src/assets/css/global.scss

This file imports:
- src/assets/css/app.scss

Keep class names and style import order stable to preserve visual parity.

## API Setup

API base URL is read from environment variable:
- REACT_APP_API_BASE_URL

If this value is not provided, services/oracleApi.js returns safe mock fallback data for local development.

## Development Notes

Scripts are configured for Node 22 compatibility with OpenSSL legacy provider.

Common commands:
- npm install --legacy-peer-deps
- npm start
- npm run build

## Migration Status

Completed:
- Entry and app shell moved to src root
- Route host moved to screens index
- Layout and screen implementations migrated out of legacy app folder
- Legacy src/app folder removed

Current working architecture is fully under src/components, src/screens, src/services, src/hooks, and src/utils.
