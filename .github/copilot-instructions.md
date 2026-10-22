# Copilot instructions

## Project
React + TypeScript app built with Vite and pnpm, using the Metropolitan Museum of Art Open Access API (no API key required).
Minimum required features: a list, a detail view, and at least one chart.

## Language
- Write everything in English: code, identifiers, comments, UI text, commit messages, README.
- Never use French anywhere in the repository.

## Package manager
- Use pnpm only. Never suggest npm or yarn commands.
- Do not add a dependency without asking first. Prefer what is already installed (react-router-dom, @tanstack/react-query, recharts, vitest).
- Keep versions compatible with the installed React version.

## Architecture
- src/api: HTTP calls and API types only (metMuseumClient.ts).
- src/hooks: data-fetching hooks built on react-query (useDepartments, useArtwork...).
- src/components: reusable UI pieces, one folder per component.
- src/pages: one component per route, suffixed with "Page".
- Pages read the URL and call hooks. Components receive props and never call the API directly.
- Never create an empty folder or a placeholder file.

## File and component naming
- Each component lives in its own folder with the same name: ArtworkCard/ArtworkCard.tsx and ArtworkCard.module.css.
- Never name a file index.tsx, page.tsx, utils.ts or helpers.ts. File names must describe their content.
- Use named exports only, no default exports. Do not use React.FC.
- Props interface is named ComponentNameProps.

## Styling and DOM
- Use CSS Modules only, no global class names except in src/styles/globalStyles.css (variables and reset).
- Class names describe a role (cardImage, chartLegend), never container, wrapper, div1 or box.
- Prefer semantic elements (header, nav, main, section, article, figure) over anonymous divs.
- Never reuse the same class name for different purposes within a file.
- Put colors, spacings and fonts in CSS variables instead of repeating values.

## Code quality
- Apply YAGNI: implement only what is asked. No speculative features, no unused endpoints, no "just in case" code.
- No duplication: extract a hook or a component as soon as the same logic or JSX appears twice.
- No dead code: no unused imports, variables, components, commented-out code or console.log.
- No debug UI, no mock data left in the app.
- Keep functions small, with explicit names and strict TypeScript (no any).

## Data handling (Met API)
- List and search endpoints return only object IDs. Paginate and limit the number of detail requests.
- Stay below the API rate limit, and cache with react-query.
- Many artworks have no image or empty fields: always provide a fallback.
- Every data-driven view must handle loading, error and empty states.
- The API provides no aggregation: chart data is computed client-side from a sample, and this limit must be documented.

## Routing and UX
- Every route must resolve to a page. Keep a NotFoundPage on the "*" route.
- Navbar is a component rendered through AppLayout with Outlet.
- Each button or menu item must act only on its own item (no handler shared by all items).

## Tests
- Use Vitest and React Testing Library.
- Integration tests cover the main flows: list, navigation to detail, chart rendering.
- Tests must run with `pnpm test`.

## Git
- Do not commit or push on my behalf.
- When asked for a commit message, use Conventional Commits in English (feat:, fix:, chore:, docs:, test:, refactor:), one logical change per commit.

## README
- When changing structure, scripts or features, remind me to update the README (quick start, architecture, blockers, AI usage).