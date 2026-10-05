# Sameer Razza — Portfolio

A single-page resume and portfolio site for Sameer Razza, a Computer Science Engineering undergraduate and aspiring Full Stack Web Developer based in Bengaluru.

## Features

- Sticky navbar with active-section highlighting and a mobile hamburger menu
- Dark/light mode toggle (remembers your choice, respects the system preference)
- Sections: Home, About, Skills (animated progress bars + interpersonal tags), Projects, Education (timeline), Contact
- Contact form powered by **Netlify Forms** (AJAX submit with an inline success message, honeypot spam protection)
- Scroll fade-in animations that respect `prefers-reduced-motion`
- SEO and Open Graph meta tags, SVG favicon, semantic and accessible markup

## Tech

Plain HTML, CSS, and vanilla JavaScript. The only external resource is the Inter font from Google Fonts. No build step.

```
index.html    page markup and content
style.css     theme tokens, layout, components, responsive rules
script.js     theme toggle, menu, scroll effects, form submission
favicon.svg   site icon
resume.pdf    placeholder resume (replace with the real one)
netlify.toml  publishes the project root
```

## Run locally

Open `index.html` in a browser, or run `netlify dev` to emulate Netlify Forms locally.

## Before going live

- Replace `resume.pdf` with the final resume.
- Replace the `#` placeholder links for GitHub and the project "GitHub" / "Live Demo" buttons in `index.html` (marked with `TODO` comments).
- Form submissions appear in the Netlify UI under **Forms → contact**. Turn on email notifications there if you want them forwarded to your inbox.
