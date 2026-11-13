# Notes from Olwtelet, project previews and a calmer site voice

Date: 2026-11-13. Owner: Isaac Rodrigues (Olwtelet). Repo: this portfolio (Astro, PT-BR at `/`, EN under `/en/`).

## Intent

The owner wants the site to read as a personal space that documents what he builds, not as a brand trying to sell something. Three things follow from that:

1. His own new home text replaces the current bio, almost word for word, with the site's links woven in.
2. Every project page gets a **project preview**: a window into the project, so a visitor recognises what was built before opening it. Not a decorative thumbnail.
3. The rest of the site's copy is rewritten in the same plain, archival voice, and the project pages get shorter and more objective.

Success: a visitor reads the home page as notes from a person, can jump from any project name to its page, and sees on each project page what the thing actually looks like.

## Goals

- Home heading becomes **"Notes from Olwtelet"** (both locales), replacing "RECEBENDO AGORA: Olwtelet é Isaac Rodrigues".
- Home bio = the owner's text (below), adapted only for links and markup; EN is a faithful translation.
- Every project mention that has a page on the site links to it; projects with only an external site link out; projects without either stay plain text.
- Header nav item "sites" becomes "projetos" / "projects".
- Footer "CURRÍCULO" becomes **"RESUMO"** (EN stays "RESUME").
- "Olwtelet" is described as a **pseudônimo / pseudonym** everywhere it was called a gaming nick/handle.
- Each project dossier shows a preview right after its descriptive text.
- Project dossiers are shorter.

## Non-goals

- No project pages for Veil, Diseens or Filmes HD Online Grátis (Filmes HD links to its own site; Veil and Diseens have no public URL yet and stay unlinked).
- No Ordfall page (removed earlier today); Ordfall stays one plain-text sentence.
- No previews on the listing cards, no video previews, no live embeds.
- No changes to routes/URLs, the TV/channel mechanics, Open Graph images or the resume's structure.

## Anti-goals (failure even if it "works")

- Any invented fact, number or screenshot that is not the real thing. A drawn preview must say it is a diagram.
- Sales voice in text we write: superlatives, "soluções", "transformar", "inovador", calls to hire. (This rule governs rewritten copy only; the owner's own bio keeps his words, including "soluções".)
- Previews that load third-party scripts or trackers into the portfolio.
- Breaking the existing interactive bits: photo toggle on "Isaac Rodrigues", the Brasília channel button, the konect "em breve neste canal" tag, the "Sintonize" channel button.

## Constraints

- Static Astro build; images live in `public/assets/…`; Prettier + `astro check` must pass.
- Toolchain quirks on this machine (node not on PATH, `pnpm` missing) — see memory; headless Edge is available for captures.
- Commits authored by Olwtelet only, no Claude trailer.

## 1. Home

### Heading
`HomeBio.astro` renders `<h1 class="bio__signal">` with a prefix span "RECEBENDO AGORA:" / "NOW RECEIVING:" and `SITE.headline`. New: the h1 text is exactly `Notes from Olwtelet` in both locales, no prefix. On the PT page the text carries `lang="en"`. `SITE.headline` becomes `Notes from Olwtelet` for both locales. *Builder's call:* keep the blinking red dot in front of it (it is the site's OSD signature).

### Bio text (PT, owner's words; links marked)
Paragraphs, in order:

1. "Meu nome é **[Isaac Rodrigues]**{photo toggle}. Sou desenvolvedor de software em **[Brasília, Brasil]**{channel 8 button}. Olwtelet é o pseudônimo que utilizo desde meus primeiros projetos na internet e que hoje reúne meu trabalho como programador, pesquisador independente e criador."
2. "Na Olwtelet Productions, desenvolvo projetos próprios de software, jogos e aplicações web. Atualmente trabalho no Veil, um jogo de estratégia para navegador inspirado no xadrez, e na Diseens, uma plataforma de passaporte acadêmico. Também sou responsável pelo **[Filmes HD Online Grátis]**{https://filmeshdonlinegratis.vercel.app/}, um projeto independente de curadoria cinematográfica com sessões organizadas ao vivo pelo Discord."
3. "Estudo Ciência da Computação e acompanho materiais do MIT OpenCourseWare desde 2024. No desenvolvimento, trabalho principalmente com TypeScript, Python, React, Next.js, Node.js e FastAPI. Tenho particular interesse em inteligência artificial, cibersegurança e arquitetura de sistemas."
4. "Também atuo no desenvolvimento de soluções para clientes. Desde junho de 2026, trabalho com a **[Integratek]**{project page}, onde desenvolvi o site institucional, o blog e os formulários de orçamento. Outros trabalhos incluem os sites da **[Rocha & Sá]**{page}, do **[CT Thalita Rodrigues]**{page} e do **[Instituto Politécnico do Brasil]**{page}."
5. "Na Ordfall, participo de projetos relacionados à cibersegurança, com atividades de análise de vulnerabilidades e revisão de código, dependências e configurações." (no link)
6. "Entre meus projetos independentes estão o **[Argus]**{page}, uma plataforma que reúne fontes públicas de dados sobre aeronaves, embarcações, satélites e terremotos em um mapa interativo, e o **[AgentForge]**{page}, um ambiente de comparação entre dez frameworks de agentes de IA. O segundo utiliza implementações equivalentes para avaliar latência, consumo de tokens e taxa de falhas. Ambos têm código aberto."
7. "Além da programação, mantenho meu perfil de jogador sob o pseudônimo Olwtelet no **[Konect]**{https://konect.gg/olwtelet} {tag: em breve neste canal}."
8. "**[Sintonize]**{channel 1 button}: este site funciona como um arquivo do meu trabalho: **[projetos]**{/projetos/}, **[experimentos]**{/codigo-aberto/}, **[certificados]**{/certificados/} e outras iniciativas que desenvolvo ao longo do tempo."

Removed from the home: "Código no GitHub, contato por e-mail." (e-mail and LinkedIn remain in the footer).

Owner-approved adaptations only: "Sintoniza" → "Sintonize" (matches the existing button); Integratek now links to its project page instead of its external site. EN is a faithful translation keeping the same links (EN routes).

### Meta
Home `description` (PT/EN) reworded around the pseudonym, e.g. "Olwtelet é o pseudônimo de Isaac Rodrigues, desenvolvedor de software em Brasília. Notas e arquivo do que ele constrói." Same change in the `seo.ts` comment ("gaming handle"); `personSchema` stays (alternateName already carries Olwtelet). `README.md` has no handle wording to fix.

## 2. Labels

- `translations.ts` `nav.websites` → replaced by `nav.projects`: PT "projetos", EN "projects"; `Header.astro` points it at `routes.projects`. "código-aberto" stays.
- `footer.resume`: PT "RESUMO", EN "RESUME". The owner explicitly wants a word that carries the idea of "resumo" (he rejected "Trajetória"), knowing the page is the CV. *Builder's call:* only the footer label changes; the page at `/curriculo/` keeps its title "Currículo".
- `pagesIndex.js`: add alias `resumo` for `/curriculo/`.
- *Builder's call:* website dossiers' "return" goes to `/projetos/` (the archive) instead of `/sites/`, since "sites" leaves the nav; `/sites/` and `/en/websites/` stay reachable.

## 3. Project preview

### Approaches considered
- **A. Framed static preview inside each dossier (chosen).** A "window" with a title bar and the real thing inside: a screenshot of the live site, the repo's own real media where it exists, or a diagram built from the repo's real contents where there is no interface. Fast, works offline, no third-party code, honest labelling.
- B. Live `<iframe>` of each site. Rejected: sites can refuse framing, it injects their scripts/trackers into the portfolio, it is slow, and it has no answer for repos without a UI.
- C. Hover thumbnails on the listing pages. Rejected: the owner wants the preview inside each project's presentation.

### Placement and frame
In `ProjectDossier.astro`, right after the OVERVIEW section (the descriptive text), full width of the text column. Frame: a bordered window in the site's OSD style with a title bar `PRÉVIA · <source>` / `PREVIEW · <source>` and a kind tag: `CAPTURA`/`SCREENSHOT` for real captures, `DO REPOSITÓRIO`/`FROM THE REPO` for repo media, `ESQUEMA`/`DIAGRAM` for drawn previews. The window is a link to the live site or repo (new tab, accessible label). Images: `<picture>` WebP + JPEG, explicit width/height, `loading="lazy"`, localized alt text. *Builder's call:* a faint scanline overlay to match the TV look, as long as the image stays readable.

### Source per project
| Project | Kind | Source |
|---|---|---|
| Integratek | screenshot | live homepage, desktop viewport (1440×900, top of page) |
| Rocha & Sá | screenshot | live homepage |
| CT Thalita Rodrigues | screenshot | live homepage |
| Instituto Politécnico do Brasil | screenshot | live homepage |
| Resumex | repo media | `docs/assets/preview.png` from the repo: real frames from `resumex demo` |
| AgentForge | diagram | the repo's real layout: the ten framework folders (`ag2`, `agno`, `autogen`, `crewai`, `google-adk`, `langgraph`, `llama-index`, `openai-agents-sdk`, `pydantic-ai`, `smolagents`) plus `study-agents-differences`, and the three measured metrics (latency, token usage, failure rate) — no numbers |
| Argus | diagram | schematic map with the real layer names from the project (aircraft, vessels, satellites, earthquakes, fires, weather alerts, submarine cables…); no hosted instance or README screenshot exists |
| Obsidian Second Brain | diagram | the vault's real top-level folders (e.g. `CodeConcepts`, `Studies`, `Clippings`, `Filosofia`, `Artigos de programação`) as a linked-notes view |

Not used: AgentForge's README banner (AI artwork with third-party logos; it does not show the project).

Screenshots are produced by a re-runnable script (`scripts/capture-previews.mjs`, headless Edge, then `sharp` for WebP/JPEG) and committed under `public/assets/previews/`. Cookie/consent banners (thalitarodrigues.com has one) must not appear in the capture: decline non-essential or hide the banner before capturing; never accept on the owner's behalf. Diagrams are drawn as SVG/HTML from the facts above (*builder's call:* inline in an Astro component, so text is real, translatable and uses the site font). If the owner later supplies a real Argus screenshot, it replaces the diagram.

Data: `Project` gains `preview?: { kind: 'screenshot' | 'repo' | 'diagram'; src?: string; width?: number; height?: number; alt: LocalizedText }`; diagrams are selected by slug inside the component.

## 4. Site voice and shorter project pages

Voice: first person where natural, plain sentences, what it is and what I did; no superlatives, no sales verbs; keep every fact as it is (rewording and cutting only, never adding claims).

Shorter dossiers — *builder's call, owner to confirm on review:* each project keeps, in this order, OVERVIEW (at most two sentences), the preview, MY ROLE (one sentence, where it exists), FEATURES (at most four short items), STACK and LINKS. The OSD labels ("ARQUIVO DE SINAL", "ÍNDICE DE CANAIS") stay, since the committed OG images print them. The PROBLEM and APPROACH sections are dropped from the data; anything essential from them moves into the overview in one clause. Listing `summary` lines get shorter.

Also rewritten in this voice: the descriptions and headings of `/projetos/`, `/codigo-aberto/`, `/sites/`, `/certificados/` (PT/EN), the README's intro paragraph. The resume keeps its structure; only "conhecido online como Olwtelet" becomes pseudonym wording.

## Verification

`astro check` and `astro build` pass; Prettier clean; every home link resolves (internal routes exist, external URLs correct); each dossier shows its preview with the right label and link; no "gaming handle"/"nick" wording left; no horizontal overflow at 375 px; previews load lazily and keep their aspect ratio.

## Left to the builder

Exact frame styling, diagram drawing, image sizes/quality, the EN translation wording, and the shortened project copy within the rules above.
