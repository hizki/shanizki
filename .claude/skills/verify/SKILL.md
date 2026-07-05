---
name: verify
description: How to build, run, and visually verify this Vite React SPA (Hebrew RTL site)
---

# Verifying shanizki

Vite + React + Tailwind SPA, Hebrew RTL. Supabase-backed pages (products,
processes, cats) need `.env` (already present locally); static pages
(recipes, wedding photos) work without network.

## Build / static checks

```bash
npm run typecheck   # tsc, no emit
npm run lint        # eslint (react-refresh rule fires on .tsx data modules — scoped disable is fine)
npm run build       # vite build
```

## Run + screenshot (headless, no Playwright installed)

```bash
npm run dev -- --port 5199 > /tmp/vite.log 2>&1 &
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --virtual-time-budget=8000 --window-size=1280,1000 \
  --screenshot=out.png http://localhost:5199/<route>
```

- Old-style `--screenshot` captures the viewport only; for a full page use a
  tall `--window-size` (e.g. `1280,9500`) and crop with PIL (`python3 -c` +
  Pillow is available).
- `--virtual-time-budget` lets React render before capture.
- Kill with `pkill -f "vite.*5199"`.

## Flows worth driving

- `/recipes` → `/recipe/:id` (static data in `src/data/recipes.tsx`)
- Bad ids on detail routes should show a Hebrew not-found message, not crash.
- Check RTL layout in screenshots: grids should start on the right, back-links
  use `ArrowRight`.

## Gotchas

- lucide-react is pinned old (0.344): icon is `AlertTriangle`, not
  `TriangleAlert`. Check `node_modules/lucide-react/dist/lucide-react.d.ts`
  before importing new icons.
- Header/nav is a fullscreen hamburger menu (`src/components/Header.tsx`);
  new pages need a `<li>` there and optionally in `Footer.tsx`.
