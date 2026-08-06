# olwtelet.dev

Personal website of **Isaac Rodrigues** — Computer Science student and full-stack developer focused on applied AI. Built as a TV/off-air-inspired interactive experience, showcasing projects, open-source work, and a bit of personality.

🔗 [olwtelet.vercel.app](https://olwtelet.vercel.app)

---

## ✨ Overview

This is **Portfolio V2**, a full rebuild of my personal site adapted from a TV/CRT-themed template. It moves away from a traditional portfolio layout in favor of a more expressive, retro-terminal experience — complete with channel-switching navigation, static/noise effects, an editable text-based breadcrumb, per-project "signal file" dossiers, and a fully bilingual (EN / PT-BR) statically-rendered structure.

## 🛠 Tech Stack

- **[Astro](https://astro.build/)** — core framework, static-first rendering, built-in i18n routing
- **[Svelte](https://svelte.dev/)** — interactive client-side components
- **TypeScript** — type safety across components and modules
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — automatic sitemap generation
- **[sharp](https://sharp.pixelplumbing.com/)** — build-time icon & Open Graph image generation
- **pnpm** — package management
- **ESLint + Prettier** — linting and code formatting

## 📂 Project Structure

```
olwtelet.dev
│
├── public
│   ├── assets
│   │   ├── fonts
│   │   ├── images
│   │   │   └── .playlist      # Spotify playlist cover art
│   │   ├── og                 # generated Open Graph images (1200x630)
│   │   └── videos
│   ├── favicon.*              # generated icon set
│   └── site.webmanifest
│
├── scripts                    # generate-icons, generate-og, optimize-images
│
├── src
│   ├── components             # Header, Footer, ProjectList, ProjectDossier, TV effects, etc.
│   ├── config                 # site.ts — single source of truth for site metadata
│   ├── data                   # projects.ts, playlists.ts — typed, localized content
│   ├── i18n                   # routes.ts (locale route map), translations.ts (UI strings)
│   ├── layouts                # TVLayout, MarkdownLayout
│   ├── modules                # Shared logic: navigation, keyboard, TV state
│   ├── pages                  # English routes + pt-br/ mirrored routes
│   ├── styles
│   └── utils                  # seo.ts — canonical/JSON-LD helpers
│
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🧭 Site Sections

| Section     | English             | Português                   |
| ----------- | ------------------- | --------------------------- |
| Home        | `/`                 | `/pt-br/`                   |
| Open Source | `/open-source/`     | `/pt-br/codigo-aberto/`     |
| Websites    | `/websites/`        | `/pt-br/sites/`             |
| Archive     | `/projects/`        | `/pt-br/projetos/`          |
| Project     | `/projects/[slug]/` | `/pt-br/projetos/[slug]/`   |
| Playlists   | `/playlists/`       | `/pt-br/playlists/`         |
| Resume      | `/resume/`          | `/pt-br/curriculo/`         |

## ⚡ Quick Start

Clone the repository:

```bash
git clone https://github.com/Olwtelet/olwtelet.dev.git
cd olwtelet.dev
```

Install dependencies (pnpm required):

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:4321`.

### Other commands

```bash
pnpm build            # generate the production build
pnpm preview          # preview the production build locally
pnpm check            # astro type checking
pnpm lint             # eslint
pnpm format:check     # prettier check
pnpm generate:icons   # regenerate the favicon/icon set
pnpm generate:og      # regenerate Open Graph images
pnpm optimize:images  # re-optimize heavy raster assets
```

## 🎨 Design Philosophy

Built around a "no signal / off-air" TV aesthetic:

- Monospace, terminal-inspired typography
- Static and scanline visual effects
- Channel-based navigation metaphor
- Projects presented as broadcast "signal file" dossiers
- Minimal color palette with high-contrast accents
- Fully responsive, keyboard-accessible, reduced-motion aware

## 🚀 Deployment

Deployed on [Vercel](https://vercel.com), with automatic builds triggered on every push to `main`.

## 👨‍💻 Author

**Isaac Rodrigues** ([@Olwtelet](https://github.com/olwtelet))

Full-Stack Developer building web products, automation tools, and applied AI experiments — currently exploring AI agents, RAG pipelines, and agent-based systems.

- [GitHub](https://github.com/olwtelet)
- [LinkedIn](https://www.linkedin.com/in/isaac-r-a8a777368/)
- [Bluesky](https://bsky.app/profile/Olwtelet.dev)
- [Instagram](https://instagram.com/olwtelets)
- [Email](mailto:olwtelet@outlook.com)

---

⭐ If you like this project, consider giving it a star!
