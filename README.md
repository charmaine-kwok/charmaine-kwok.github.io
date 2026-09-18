# charmaine-kwok.github.io

My personal website and travel blog, built with Astro.

🌐 **Live site:** https://charmaine-kwok.github.io/

## About

This repository contains the source code for my personal website, where I share my projects, travel experiences, hiking journeys, and other things I am interested in.

A major part of the site is my Camino de Santiago journey, including my Camino Francés and the continuation to Finisterre and Muxía.

## Features

- Responsive personal blog
- Markdown-based blog posts
- Dark and light themes
- Day-by-day Camino journey
- Camino albergue guide and notes
- Paginated Camino posts
- Interactive Camino route map with individual walking stages
- GPX-based route and distance data
- Image lightbox
- Responsive navigation

## Camino de Santiago

The site contains a detailed record of my Camino journey:

**Camino Francés**  
Saint-Jean-Pied-de-Port → Santiago de Compostela

**Camino Finisterre & Muxía**  
Santiago de Compostela → Finisterre → Muxía

The journey is divided into individual walking days with photos, distances, experiences, accommodation notes, and recorded GPX data.

Because the complete journey is long, the day-by-day content is split across multiple pages while preserving direct links to individual days.

## Interactive Camino Route Map

The Camino overview includes an interactive Leaflet map generated from GPX tracks recorded on my Garmin watch throughout the journey.

Each walking stage can be selected individually to view:

- Start and end locations
- Route distance
- GPX-recorded distance
- Cumulative distance
- The corresponding day in the travel journal

The map also includes markers for the start, overnight stops, and the end of the Camino.

## GPX Processing

To improve performance, GPX files are processed by Astro before reaching the browser. The original GPS coordinates are used to calculate distances, while the routes are simplified using the Ramer-Douglas-Peucker algorithm for map rendering.

```text
Garmin GPX → Parse → Distance calculation
                   → RDP simplification → Leaflet
```

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- Leaflet
- Markdown
- GitHub Pages
- GitHub Actions
- pnpm

## Deployment

The website is hosted using GitHub Pages and is automatically built and deployed through GitHub Actions.

## License

The source code in this repository is provided as part of my personal website.

Unless otherwise stated, photographs and written content are my own and should not be reused without permission.
