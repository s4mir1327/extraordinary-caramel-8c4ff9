# AGENTS.md

## Overview
Static single-page portfolio for Sameer Razza. No framework, no bundler, no package.json — Netlify publishes the repo root as-is (`netlify.toml` → `publish = "."`).

## Files
- `index.html` — all content. Sections are `<section id="…">` matching navbar anchors (home, about, skills, projects, achievements, education, contact).
- `style.css` — ordered as tokens → base → components → sections → responsive. Theming uses CSS variables under `[data-theme='dark']` / `[data-theme='light']` on `<html>`.
- `script.js` — one IIFE: theme toggle, mobile menu, active-link observer, reveal-on-scroll, Netlify Forms AJAX submit.
- `certificates/` — certificate PDFs shown in the Achievements section; cards are rendered from the `achievements` array in `script.js` (paths are `encodeURI`'d, so file names may contain spaces). PDF viewer is a native `<dialog>`; on mobile/touch "View" opens a new tab.
- `favicon.svg`, `resume.pdf` (placeholder).

## Conventions and decisions
- An inline script in `<head>` sets `data-theme` before paint to avoid a theme flash; `script.js` keeps it in sync and stores it in `localStorage`.
- Reveal animations are gated on the `.js` class on `<html>` so content stays visible without JavaScript.
- Skill bars: set the percentage via `data-level` on `.skill-card` (and keep `aria-valuenow` in sync).
- Icons are inline SVG strokes using `currentColor`; no icon library.
- Contact form `name="contact"` with `data-netlify="true"` and honeypot `bot-field`. It posts URL-encoded data to `/`. Netlify Forms was enabled via the netlify-forms skill's `enable.cjs` script. Field names must stay in sync if the form changes.
- Placeholder links (`href="#"`) are marked with `TODO` comments.
