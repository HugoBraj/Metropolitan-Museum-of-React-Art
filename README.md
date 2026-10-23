# Metropolitan Museum of React Art

A React and TypeScript app for exploring The Metropolitan Museum of Art collection. The project currently contains the routed application shell, a home page placeholder, shared navigation, and a not-found page. Collection browsing, object details, search, and charts are planned but are not implemented yet.

## Requirements

- Node.js compatible with the installed Vite version
- pnpm

## Getting started

Install dependencies and start the Vite development server:

```sh
pnpm install
pnpm dev
```

Vite prints the local URL when the server starts.

## Available commands

```sh
pnpm dev      # Start the development server
pnpm build    # Type-check and create a production build
pnpm preview  # Preview the production build
pnpm lint     # Run ESLint
pnpm test     # Run the Vitest suite
```

The current test suite contains smoke tests for the home and not-found routes.

## Current structure

- `src/App.tsx` defines the routes and router.
- `src/components/AppLayout` renders the shared navigation and the active route through `Outlet`.
- `src/components/NavigationBar` contains the current collection navigation link.
- `src/pages/HomePage` is the home page placeholder.
- `src/pages/NotFoundPage` handles unmatched routes.
- `src/styles/globalStyles.css` defines global styles and CSS variables; components and pages use CSS Modules.
- `src/api` and `src/hooks` do not contain implementations yet; `src/test` contains application route smoke tests.

## Planned features

- Search the collection through The Met Open Access API, with suggestions in the navigation.
- Select a continent on the home page to browse related collection objects.
- Browse paginated object lists and view object details.
- Add a chart based on a bounded sample of returned collection objects.

The API returns object IDs for searches; object records must be fetched separately and requests should remain bounded. Use the paginated `/public/collection/v1.1/search` endpoint rather than the deprecated `/v1/search` endpoint. The API does not provide aggregation, so future chart values will be calculated client-side from a documented sample.

## Architecture and conventions

- React with TypeScript and Vite; use pnpm for package management.
- Route pages live in `src/pages`; reusable, API-independent UI lives in `src/components`.
- API requests and response types belong in `src/api`; React Query data hooks belong in `src/hooks`.
- Use named exports, CSS Modules, semantic HTML, and explicit loading, error, and empty states for data-driven views.
- The API requires no key. Handle missing object fields and images with fallbacks.

## AI usage

AI is used to structured architecture and ensures good coding practices. Its use is highly controlled so that the development remains "human-managed".

AI-assisted changes should follow the repository guidance in `.github/copilot-instructions.md`. Review generated changes and validate them with the relevant lint, build, and test commands before committing. No AI features are integrated into the application itself.
