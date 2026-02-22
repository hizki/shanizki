<p align="center">
  <img src="docs/logo.png" alt="SHANIZKI logo" width="200" />
</p>

# SHANIZKI — אהבה כבושה

A product showcase site for SHANIZKI, a small-batch fermentation pantry by Shany & Guy.

Live at **https://shanizki.com**

---

## How to run locally

```bash
# 1. Install dependencies
npm install

# 2. Create a local .env file (see .env.example for the keys you need)
cp .env.example .env
# Then fill in the real values

# 3. Start the dev server
npm run dev
```

Other useful commands:

```bash
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview the production build locally
npm run lint       # Check code style
npm run typecheck  # Check TypeScript types
```

---

## The tech stack (explained simply)

### The app itself

| Tech | What it does |
|---|---|
| **[React](https://react.dev)** | A JavaScript library for building user interfaces. You write your UI as "components" (small reusable pieces like a header, a product card, etc.) and React figures out how to update the browser efficiently when data changes. |
| **[TypeScript](https://www.typescriptlang.org)** | JavaScript with types. Instead of `let x = 5` you write `let x: number = 5`. This catches bugs before you even run the code — like spell-check but for your logic. |
| **[Vite](https://vitejs.dev)** | The build tool. It takes all your `.tsx` files, CSS, images, etc. and bundles them into a fast, optimized set of files a browser can load. During development, it also runs a local server with instant hot-reload (you save a file, the browser updates immediately). |
| **[Tailwind CSS](https://tailwindcss.com)** | A CSS framework where you style things by adding class names directly in your HTML/JSX (e.g. `className="text-purple-900 font-bold"`). No separate CSS files to manage — the class names *are* the styles. |
| **[React Router](https://reactrouter.com)** | Handles navigation between pages (`/`, `/products`, `/admin`, etc.) without the browser doing a full page reload. It makes the app feel fast and app-like (a "Single Page App" or SPA). |

### Data & backend

| Tech | What it does |
|---|---|
| **[Supabase](https://supabase.com)** | A cloud database + file storage service. The product data, process descriptions, and cat images all live in a Supabase PostgreSQL database. Images are stored in Supabase Storage (like a file drive in the cloud). The app talks to Supabase via its JavaScript client library. There's no custom backend server — Supabase *is* the backend. |

### Hosting & deployment

| Tech | What it does |
|---|---|
| **[Netlify](https://www.netlify.com)** | Hosts the site. Every time you push to the `main` branch on GitHub, Netlify automatically runs `npm run build` and deploys the result. The `netlify.toml` file in the repo tells Netlify how to build and that all routes should serve `index.html` (so React Router can handle them). |
| **[GitHub Actions](https://github.com/features/actions)** | Runs automated checks (lint, typecheck, build) on every push and pull request. If any check fails, the CI turns red and the PR can't be merged. This prevents broken code from reaching production. The workflow is defined in `.github/workflows/ci.yml`. |

### Developer tools

| Tech | What it does |
|---|---|
| **[ESLint](https://eslint.org)** | A linter — it reads your code and flags problems like unused variables, missing imports, or style inconsistencies. Think of it as a code reviewer that never sleeps. |
| **[PostCSS](https://postcss.org) + [Autoprefixer](https://github.com/postcss/autoprefixer)** | PostCSS processes your CSS after Tailwind generates it. Autoprefixer adds browser-specific prefixes (like `-webkit-`) so styles work across all browsers without you thinking about it. |

### Notable libraries

| Library | What it does |
|---|---|
| **[@dnd-kit](https://dndkit.com)** | Drag-and-drop for the admin panel — lets you reorder cat gallery images by dragging them. |
| **[react-dropzone](https://react-dropzone.js.org)** | The "drag a file here to upload" drop zone in the admin panel. |
| **[browser-image-compression](https://github.com/nicolo-ribaudo/browser-image-compression)** | Compresses uploaded images in the browser before sending them to Supabase, so uploads are smaller and faster. |
| **[Lucide React](https://lucide.dev)** | The icon set used throughout the site (arrows, menu icons, upload icons, etc.). |

---

## How it all fits together

```
You edit code locally
        │
        ▼
   git push to GitHub
        │
        ├──► GitHub Actions runs lint + typecheck + build (CI)
        │
        └──► Netlify detects the push, runs "npm run build",
             and deploys the dist/ folder to shanizki.netlify.app
                    │
                    ▼
            User visits the site
                    │
                    ▼
            React app loads in browser
                    │
                    ▼
            App fetches data from Supabase (database + images)
```

---

## Project structure

```
src/
├── components/    UI building blocks (Header, Footer, ProductCard, etc.)
├── pages/         Full-page components mapped to routes (Home, Products, Admin, etc.)
├── lib/           Supabase client setup
├── types/         TypeScript type definitions
└── main.tsx       App entry point

public/            Static files copied as-is to the build output
supabase/          Database migration SQL files
.github/workflows/ CI pipeline definition
netlify.toml       Netlify build + redirect config
.env.example       Template for required environment variables
```

---

## Environment variables

| Variable | Where it's used |
|---|---|
| `VITE_SUPABASE_URL` | The Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | The Supabase anonymous/public API key |

These are set in two places:
- **Locally**: in a `.env` file (git-ignored, never committed)
- **Netlify**: in the site's environment variable settings
