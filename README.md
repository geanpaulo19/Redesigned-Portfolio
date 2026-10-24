# Gean Paulo - Portfolio

Cinematic portfolio for [geanpaulo.com](https://geanpaulo.com), built with **React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui**.

- Fullscreen looping video hero with kinetic display typography
- Archivo variable (display) + Inter (body) + JetBrains Mono (labels)
- Dark-only theme driven by CSS variables (`src/index.css`)
- Horizontal scroll-driven project gallery, skills marquee, daily quote, contact, Cal.com booking

## Commands

```bash
npm install     # install dependencies
npm run dev     # local dev server
npm run build   # type-check + production build to dist/
npm run preview # serve the production build locally
```

## Deploy (GitHub Pages)

`npm run build` outputs a static site to `dist/` (CNAME, robots.txt, sitemap.xml, and 404.html are copied from `public/`). Deploy `dist/` to the `geanpaulo.com` GitHub Pages root (e.g. via GitHub Actions or by pushing `dist/` to the `main` branch of the pages repo).

## Structure

```text
.
├── index.html            # meta/SEO, fonts, Cal.com embed
├── public/               # copied verbatim to dist/ (assets, CNAME, robots, sitemap, 404)
├── src/
│   ├── components/       # sections + shadcn/ui primitives (ui/)
│   ├── data/             # projects + site content
│   ├── hooks/            # useReveal, useManilaTime
│   └── index.css         # Tailwind v4 + design tokens
└── .github/workflows/    # GitHub Pages deploy (builds dist/ on push)
```
