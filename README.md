# Avanti Landscaping — Website

Static marketing site for Avanti Landscaping LLC (Waxhaw, NC).

## Structure
- `index.html`, `services.html`, `areas.html`, `about.html`, `gallery.html`, `contact.html`, `blog.html` + blog posts
- `css/style.css` — design system
- `js/main.js` — nav, before/after slider, contact form
- `assets/` — logo (SVG) + optimized project photos
- `Caddyfile` — tells Railway (Caddy web server) how to serve the static files

## Deploy (Railway)
Railway auto-detects the `Caddyfile` and serves the site. No build step needed.
