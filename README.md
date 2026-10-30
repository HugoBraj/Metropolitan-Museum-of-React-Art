# Metropolitan Museum of React Art

A React and TypeScript app for exploring The Metropolitan Museum of Art collection. The home page pairs a short introduction and a primary exploration link with four image-backed links for categories, continents, chronology, and statistics. The continent map has its own route and leads to region artwork lists. Category browsing, dynamic search suggestions, artwork details, chronology, and charts are still planned.

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

The test suite covers the home and not-found routes, navigation to the dedicated continent map, the Met API client, and its React Query hooks.

## Current structure

- `src/App.tsx` defines the routes and router.
- `src/components/AppLayout` renders the shared navigation and the active route through `Outlet`.
- `src/components/NavigationBar` contains the responsive museum navigation and a search form that routes to the search placeholder.
- `src/components/WorldMap` makes the supplied continent SVG keyboard- and pointer-accessible.
- `src/components/RoutePlaceholder` renders the simple category, chronology, statistics, collection, search, and artwork pages.
- `src/components/ArtworkCard` displays a collection result with image and metadata fallbacks.
- `src/pages/HomePage` renders the introduction and four image-backed discovery links; `src/pages/ContinentsPage` renders the dedicated interactive map.
- `src/pages/RegionCollectionPage` loads the selected region's artwork list.
- `src/pages/CollectionPage`, `src/pages/CategoriesPage`, `src/pages/ChronologyPage`, `src/pages/StatisticsPage`, `src/pages/SearchPage`, and `src/pages/ArtworkPage` are route placeholders.
- `src/pages/NotFoundPage` handles unmatched routes.
- `src/styles/globalStyles.css` defines global styles and CSS variables; components and pages use CSS Modules.
- `src/api/metMuseumClient.ts` provides typed search and object-detail requests.
- `src/hooks/useArtworkSearch.ts` and `src/hooks/useArtwork.ts` provide cached search and object-detail queries.
- `src/hooks/useRegionArtworks.ts` runs bounded regional searches and hydrates a maximum of 12 object records.
- `src/constants/artworkRegions.ts` maps map-path IDs and route slugs to API geographic terms.
- `src/test` contains route, API client, query-hook, and continent-browsing tests.

## Planned features

- Connect search submission to the Met API and add dynamic artwork suggestions in the navigation.
- Implement category and chronology exploration pages.
- Show artwork metadata on the object detail route.
- Add a chart based on a bounded sample of returned collection objects.

The API client uses paginated `/public/collection/v1.1/search` rather than the deprecated `/v1/search` endpoint. Search returns object IDs, while object details are fetched separately. Requests are bounded: page size is at most 500, and the search offset plus limit cannot exceed 10,000. The continent view fetches at most 12 object details at a time; North America uses country-level geographic searches because the API returns no results for its broad continent name. The API does not provide aggregation, so future chart values will be calculated client-side from a documented sample.

## Visual system

Shared colors, map-region fills, shadows, and fonts are defined as CSS custom properties in `src/styles/globalStyles.css`. DM Sans and Manrope are loaded from Google Fonts with system fallbacks.

## Architecture and conventions

- React with TypeScript and Vite; use pnpm for package management.
- Route pages live in `src/pages`; reusable, API-independent UI lives in `src/components`.
- API requests and response types belong in `src/api`; React Query data hooks belong in `src/hooks`.
- Use named exports, CSS Modules, semantic HTML, and explicit loading, error, and empty states for data-driven views.
- The API requires no key. Handle missing object fields and images with fallbacks.

## AI usage

AI is used to structured architecture and ensures good coding practices. Its use is highly controlled so that the development remains "human-managed".

AI-assisted changes should follow the repository guidance in `.github/copilot-instructions.md`. Review generated changes and validate them with the relevant lint, build, and test commands before committing. No AI features are integrated into the application itself.
