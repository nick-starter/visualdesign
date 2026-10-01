# Nick Child — Visual Design Folio

Interactive portfolio centerpiece: a realistic 3D phone that morphs into a portrait iPad, showcasing mobile vs tablet UI case studies. Built with Vite, React, TypeScript, Tailwind CSS, and React Three Fiber.

## Interact

- **Orbit** the device by dragging (touch or mouse).
- **Zoom** with scroll / pinch on desktop; zoom is simplified on small screens.
- **Morph to iPad / Morph to phone** expands or contracts the chassis and swaps the on-device screen.
- **Swap case study** cycles placeholder product UIs (Atlas Focus, Meridian Trails).

## Swap screen assets

1. Drop your own mockups into `public/screens/` (SVG or PNG).
2. Update paths in `src/lib/portfolio.ts` (`SCREEN_ASSETS` phone / tablet URLs).
3. Prefer portrait art: phone ~390×844, tablet ~768×1024.

## Local development

```bash
npm install
npm run dev
```

Dev server defaults to **http://127.0.0.1:43127**.

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## GitHub Pages

This repo is configured for static GitHub Pages deploy:

1. **Actions workflow** — `.github/workflows/deploy-pages.yml` builds on push to `main` and deploys the `dist/` folder.
2. **Vite `base: './'`** — relative asset paths work for both user and project Pages sites.
3. **Enable Pages** (one-time, in the GitHub UI):
   - Repo **Settings → Pages**
   - **Source**: GitHub Actions
   - After the workflow runs on `main`, the site URL appears on the Pages settings page.

Optional manual deploy with `gh-pages`:

```bash
npm run deploy
```

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- `@react-three/fiber`, `@react-three/drei`, Three.js

No auth, no database — pure static hosting.
