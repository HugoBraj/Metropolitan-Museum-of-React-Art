# Metropolitan Museum of React Art

A React and TypeScript app for exploring The Metropolitan Museum of Art collection. The home page pairs a short introduction and a primary exploration link with three image-backed links for departments, continents, and statistics. The dedicated continent map shows artwork counts on hover and keeps selected-continent results on the same page. Department selections work the same way, and artwork details include breadcrumbs back to their originating results. Navigation search offers artwork suggestions; statistics show creation dates from a fixed snapshot of the Met's Open Access dataset.

## Requirements

- Node.js `^22.12.0`, `^24.0.0`, or `>=26.0.0`, as required by the installed Vitest version
- pnpm (the project does not pin a pnpm version)
- Network access to the Met Collection API and image servers for collection browsing

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

The test suite covers skeleton loading states, home and not-found routes, department and continent results, artwork breadcrumbs, discovery-link descriptions, collection filters and sorting, navigation search, statistics, the Met API client, and its React Query hooks.

## Routes

- `/`: home page.
- `/collection`: searchable, paginated collection; filters, sorting, and page selection are stored in the URL.
- `/departments`: department browsing, with the selected department in the URL.
- `/continents`: interactive map and continent browsing, with the selected region in the URL.
- `/collection/:region`: direct route to a regional collection.
- `/objects/:objectId`: artwork detail.
- `/statistics`: static creation-date chart.
- Unmatched routes display the not-found page.

Artwork links from results pass breadcrumb context through router state. A direct artwork URL without that state falls back to a link to All objects.

## Current structure

- `src/App.tsx` defines the routes and router.
- `src/components/AppLayout` renders the shared navigation and the active route through `Outlet`, followed by the shared footer inside the scrolling content area.
- `src/components/NavigationBar` contains responsive navigation and artwork search: submit to All objects or select a suggestion to open its detail page.
- `src/components/WorldMap` makes the supplied continent SVG keyboard- and pointer-accessible, with cached per-continent result counts.
- `src/components/Results` uses a data-fetching hook to display paginated, sortable artwork results for supplied search criteria; `src/components/Breadcrumbs` renders the path back to a parent view.
- `src/components/CreationDateChart` displays the precomputed creation-date counts.
- `src/components/ArtworkCard` displays a collection result with image and metadata fallbacks.
- `src/components/LoadingSkeleton` provides accessible loading placeholders for artwork grids, suggestions, departments, artwork details, and map counts.
- `src/pages/HomePage` renders an introduction and three responsive image-backed discovery links; descriptions reveal on hover/focus and remain visible on touch devices. `src/pages/ContinentsPage` renders the interactive map, then displays selected-continent results in place.
- `src/pages/CollectionPage` provides text search, department, medium, location, creation-date, artist/culture, highlight, on-view, and image filters, passing criteria to the shared results view. Highlights are enabled by default and can be turned off. Date sorting applies to the current page.
- `src/pages/DepartmentsPage` loads the official museum departments and displays the selected department's results in place. `src/pages/RegionCollectionPage` uses the shared results view for region routes. `src/pages/StatisticsPage` displays the static creation-date chart.
- `src/pages/NotFoundPage` handles unmatched routes.
- `src/styles/globalStyles.css` defines global styles and CSS variables; components and pages use CSS Modules.
- `src/api/metMuseumClient.ts` provides typed search, department-list, and object-detail requests.
- `src/hooks/useArtwork.ts` provides cached object-detail queries; `src/hooks/useArtworkImage.ts` tries primary and additional image URLs before displaying a fallback.
- `src/hooks/useArtworkSuggestions.ts` debounces navigation searches by 300 ms after two characters and loads at most eight object details.
- `src/hooks/useDepartments.ts` caches department options; `src/hooks/useCollectionArtworks.ts` pages search IDs and hydrates a bounded set of object records.
- `src/data/creationDateStatistics.ts` stores the precomputed chart totals and the source snapshot.
- `src/constants/artworkRegions.ts` maps map-path IDs and route slugs to API geographic terms.
- `src/test` contains route, API client, query-hook, and continent-browsing tests.

## Data And Limitations

The API client uses paginated `/public/collection/v1.1/search` rather than the deprecated `/v1/search` endpoint. Search returns object IDs, while object details are fetched separately. The client limits a search request to 500 IDs and requires offset plus limit to stay within 10,000. Collection and continent views request at most 12 object details per page. Creation-date sorting applies to the loaded page, not the entire result set.

North America uses searches for the United States, Canada, Mexico, Cuba, Guatemala, and Costa Rica because the API returns no results for its broad continent name. This is not an exhaustive list of countries. Counts are sums of the geographic search totals and can include overlapping objects; IDs are deduplicated within each displayed page. Pages can therefore contain fewer than 12 objects. If a geographic search fails, the results from other locations remain visible with a warning; if every geographic search fails, the view shows an error. A failed object-detail request can also make the results page fail. Continent counts are requested only while the map is displayed and cached for 24 hours.

Artwork cards and details try the available primary and additional image URLs, then show a placeholder if none load. The API can omit images or metadata, and the presence of an image URL does not guarantee that the image server will respond successfully.

Statistics make no API requests. Their static counts were aggregated from all 503,378 records in the Met's [Open Access CSV snapshot from November 16, 2026](https://github.com/metmuseum/openaccess/blob/15d35b4b1f7f87baa8d42cc24481f68f76817d20/MetObjects.csv). Each record is grouped by `Object Begin Date`, or `Object End Date` if the begin year is absent. The 1,105 records whose begin and end years are both zero are excluded, leaving 502,273 dated records. Years can be approximate, and the dataset is not a complete record of the museum's collection. The snapshot and counts do not update automatically.

## Visual system

Shared colors, map-region fills, shadows, and fonts are defined as CSS custom properties in `src/styles/globalStyles.css`. DM Sans and Manrope are loaded from Google Fonts with system fallbacks.

## Architecture and conventions

- React with TypeScript and Vite; use pnpm for package management.
- Route pages live in `src/pages`; reusable UI lives in `src/components`. `Results` loads data through a React Query hook.
- API requests and response types belong in `src/api`; React Query data hooks belong in `src/hooks`.
- Use named exports, CSS Modules, semantic HTML, and explicit loading, error, and empty states for data-driven views.
- The API requires no key. Handle missing object fields and images with fallbacks.

## AI usage

AI is used to help structure the architecture and support coding practices. Its use remains human-managed.

Review generated changes and validate them with the relevant lint, build, and test commands before committing. No AI features are integrated into the application itself.

## Author

Hugo Brajdic
