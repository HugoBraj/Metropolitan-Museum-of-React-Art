# Metropolitan Museum of React Art

A React and TypeScript app for exploring The Metropolitan Museum of Art collection. The project currently contains a routed application shell with home, collection, search, artwork, and not-found pages. The collection, search, and artwork pages are placeholders; API-backed browsing and charts are planned.

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

The test suite covers the home and not-found routes, the Met API client, and its React Query hooks.

## Current structure

- `src/App.tsx` defines the routes and router.
- `src/components/AppLayout` renders the shared navigation and the active route through `Outlet`.
- `src/components/NavigationBar` contains responsive navigation, a mobile side panel, and a search form that routes to the search placeholder.
- `src/components/RoutePlaceholder` renders the simple placeholder pages.
- `src/pages/HomePage`, `src/pages/CollectionPage`, `src/pages/SearchPage`, and `src/pages/ArtworkPage` define the current page routes.
- `src/pages/NotFoundPage` handles unmatched routes.
- `src/styles/globalStyles.css` defines global styles and CSS variables; components and pages use CSS Modules.
- `src/api/metMuseumClient.ts` provides typed search and object-detail requests.
- `src/hooks/useArtworkSearch.ts` and `src/hooks/useArtwork.ts` provide cached search and object-detail queries.
- `src/test` contains route, API client, and query-hook tests.

## Planned features

- Connect search submission to the Met API and add dynamic artwork suggestions in the navigation.
- Select a continent on the home page to browse related collection objects.
- Browse paginated object lists and view object details.
- Add a chart based on a bounded sample of returned collection objects.

The API client uses paginated `/public/collection/v1.1/search` rather than the deprecated `/v1/search` endpoint. Search returns object IDs, while object details are fetched separately. Requests are bounded: page size is at most 500, and the search offset plus limit cannot exceed 10,000. React Query hooks are in place, but collection UI is not implemented yet. The API does not provide aggregation, so future chart values will be calculated client-side from a documented sample.

## Architecture and conventions

- React with TypeScript and Vite; use pnpm for package management.
- Route pages live in `src/pages`; reusable, API-independent UI lives in `src/components`.
- API requests and response types belong in `src/api`; React Query data hooks belong in `src/hooks`.
- Use named exports, CSS Modules, semantic HTML, and explicit loading, error, and empty states for data-driven views.
- The API requires no key. Handle missing object fields and images with fallbacks.

## AI usage

AI is used to structured architecture and ensures good coding practices. Its use is highly controlled so that the development remains "human-managed".

AI-assisted changes should follow the repository guidance in `.github/copilot-instructions.md`. Review generated changes and validate them with the relevant lint, build, and test commands before committing. No AI features are integrated into the application itself.
