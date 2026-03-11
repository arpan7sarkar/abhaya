# Avaya — Women Safety Web App

A React SPA for women safety with live map, color-coded road safety overlays, safest-route routing, and emergency SOS.

## Features

- **Landing Page** — Intro and CTA to open the map
- **Live Map** — Leaflet map with OSM tiles, user location, nearby roads
- **Safety Overlays** — Color-coded polylines (green/amber/red by safety score)
- **Safest Route** — Search destination, get safest path via backend API
- **SOS Button** — Find nearest police station, call directly
- **Report Unsafe Road** — Report safety issues from road popups
- **Error Boundary** — Graceful error recovery
- **Toast Notifications** — Success/error feedback
- **PWA Ready** — Manifest and meta tags for installability

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS v4
- Leaflet + react-leaflet
- Zustand
- Axios
- React Router
- lucide-react

## Setup

```bash
# Copy env and fill values
cp .env.example .env

# Install & run
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000 (required for map data)

## Build

```bash
npm run build
npm run preview
```

## Deployment

- **Vercel**: `vercel.json` included for SPA routing
- **Netlify**: Add `_redirects` with `/* /index.html 200`
- **Static**: Configure server to serve `index.html` for all routes
