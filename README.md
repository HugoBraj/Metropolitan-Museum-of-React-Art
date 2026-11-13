# Metropolitan Museum of React Art

A React and TypeScript app for exploring The Metropolitan Museum of Art collection. The home page pairs a short introduction and a primary exploration link with three image-backed links for departments, continents, and statistics. The dedicated continent map shows artwork counts on hover and keeps selected-continent results on the same page. Department selections work the same way, and artwork details include breadcrumbs back to their originating results. Navigation search offers artwork suggestions; charts are still planned.

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

The test suite covers the shared loader, home and not-found routes, department and continent results, artwork breadcrumbs, discovery-link descriptions, collection filters and sorting, navigation search, the Met API client, and its React Query hooks.

## Current structure

- `src/App.tsx` defines the routes and router.
- `src/components/AppLayout` renders the shared navigation and the active route through `Outlet`.
- `src/components/NavigationBar` contains responsive navigation and artwork search: submit to All objects or select a suggestion to open its detail page.
- `src/components/WorldMap` makes the supplied continent SVG keyboard- and pointer-accessible, with cached per-continent result counts.
- `src/components/Results` fetches and displays paginated, sortable artwork results for supplied search criteria; `src/components/Breadcrumbs` renders the path back to a parent view.
- `src/components/RoutePlaceholder` renders the statistics placeholder page.
- `src/components/ArtworkCard` displays a collection result with image and metadata fallbacks.
- `src/components/Loader` provides a shared accessible animated loading indicator, with a compact variant for the map tooltip.
- `src/pages/HomePage` renders an introduction and three responsive image-backed discovery links; descriptions reveal on hover/focus and remain visible on touch devices. `src/pages/ContinentsPage` renders the interactive map, then displays selected-continent results in place.
- `src/pages/CollectionPage` provides text search, department, medium, location, creation-date, artist/culture, highlight, on-view, and image filters, passing criteria to the shared results view. Highlights are enabled by default and can be turned off. Date sorting applies to the current page.
- `src/pages/DepartmentsPage` loads the official museum departments and displays the selected department's results in place. `src/pages/RegionCollectionPage` uses the shared results view for region routes. `src/pages/StatisticsPage` remains a route placeholder.
- `src/pages/NotFoundPage` handles unmatched routes.
- `src/styles/globalStyles.css` defines global styles and CSS variables; components and pages use CSS Modules.
- `src/api/metMuseumClient.ts` provides typed search, department-list, and object-detail requests.
- `src/hooks/useArtworkSearch.ts` and `src/hooks/useArtwork.ts` provide cached search and object-detail queries.
- `src/hooks/useArtworkSuggestions.ts` debounces navigation searches by 300 ms after two characters and loads at most eight object details.
- `src/hooks/useDepartments.ts` caches department options; `src/hooks/useCollectionArtworks.ts` pages search IDs and hydrates a bounded set of object records.
- `src/constants/artworkRegions.ts` maps map-path IDs and route slugs to API geographic terms.
- `src/test` contains route, API client, query-hook, and continent-browsing tests.

## Planned features

- Add a chart based on a bounded sample of returned collection objects.

The API client uses paginated `/public/collection/v1.1/search` rather than the deprecated `/v1/search` endpoint. Search returns object IDs, while object details are fetched separately. Requests are bounded: page size is at most 500, and the search offset plus limit cannot exceed 10,000. Collection and continent views hydrate at most 12 object details at a time; North America uses country-level geographic searches because the API returns no results for its broad continent name. A failed country search does not discard successful regional results; the view marks them as incomplete. Continent counts are queried and cached only while the map is displayed. Creation-date sorting currently applies to the loaded result page, not the entire API result set. The API does not provide aggregation, so future chart values will be calculated client-side from a documented sample.

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
