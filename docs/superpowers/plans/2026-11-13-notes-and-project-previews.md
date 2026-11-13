# Notes from Olwtelet and Project Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the owner's "Notes from Olwtelet" text on the home page, rename the nav/footer labels, give every project page a real preview window, and rewrite the rest of the site in a plain archival voice with shorter project pages.

**Architecture:** Static Astro site. Content lives in `src/pages/*` (home, listings, resume) and `src/data/projects.ts` (project registry rendered by `ProjectDossier.astro`). Previews are a new `preview` field on `Project`, rendered by a new `ProjectPreview.astro` (image kinds) that delegates drawn previews to `PreviewDiagram.astro`. Images come from a zero-dependency CDP capture script. A build-output checker (`scripts/check-site.mjs`) is the test harness: each task adds its assertions first, sees them fail against `dist/`, then makes them pass.

**Tech Stack:** Astro 5, TypeScript, Svelte (untouched), sharp (already a devDependency), Microsoft Edge (headless, via Chrome DevTools Protocol over Node's global `WebSocket`).

**Spec:** `docs/superpowers/specs/2026-11-13-notes-and-project-previews-design.md`

## Global Constraints

- Toolchain on this machine: in Bash, `export PATH="/c/Program Files/nodejs:$PATH"` first; run binaries as `node_modules/.bin/astro`, `node_modules/.bin/prettier`; `pnpm` is not installed.
- Build + test loop: `node_modules/.bin/astro build && node scripts/check-site.mjs`.
- Every edited file passes `node_modules/.bin/prettier --check`; `astro check` reports 0 errors.
- Home heading text is exactly `Notes from Olwtelet` in both locales; on the PT page it carries `lang="en"`.
- Footer label: PT `RESUMO`, EN `RESUME`. Nav label: PT `projetos`, EN `projects`, linking to `/projetos/` and `/en/projects/`.
- "Olwtelet" is a "pseudônimo"/"pseudonym"; the words `nick` and `gaming handle` must not appear in the built site.
- The owner's bio is used word for word except: "Sintoniza" → "Sintonize", and the links listed in Task 2.
- Copy we rewrite never adds a fact; banned in rewritten copy: `soluções`, `inovador`, `inovadora`, `transformar`, `de ponta`, `excelência`, `incrível`, `solutions`, `innovative`, `cutting-edge`, `seamless`, `world-class`, `passionate`.
- Preview kind labels: PT `CAPTURA` / `DO REPOSITÓRIO` / `ESQUEMA`; EN `SCREENSHOT` / `FROM THE REPO` / `DIAGRAM`. Title bar prefix PT `PRÉVIA`, EN `PREVIEW`.
- Consent banners are declined or hidden before a capture, never accepted.
- Commits: none during execution. Repo rule: commit only when the owner asks, authored by Olwtelet, no Claude trailer.

## Review Focus

- Phone width (375 px): the preview window and the diagrams (long folder names such as `study-agents-differences`, `Artigos de programação`) must not cause horizontal scroll. Task 6 checks `scrollWidth` in the browser.
- A capture that fails or a site that is down must stop the script with a non-zero exit, never write a blank or banner-covered image. Task 5's script asserts the PNG is larger than 30 KB and that the page reached `load`, and check-site asserts every referenced image exists in `dist/`.
- PT/EN drift in the bio: both pages must carry the same set of links and interactive elements. Task 2 asserts link-count parity and the presence of the photo toggle, `data-channel="8"`, `data-channel="1"` and `bio__soon` on both.
- Keyboard and screen-reader use of the preview: the window link needs an accessible name and a visible focus style, and the dossier's ESC-to-index still works. Task 4 asserts `aria-label` on every `.preview__window`; Task 6 tabs to it in the browser.
- Old routes still answer: `/sites/` and `/en/websites/` keep rendering after the nav change. Task 3 asserts both files exist in `dist/`.

---

### Task 1: Build-output checker

**Files:**
- Create: `scripts/check-site.mjs`
- Modify: `package.json` (add `"check:site": "node scripts/check-site.mjs"`)

**Interfaces:**
- Produces: in `scripts/check-site.mjs`, `page(route: string): string` (reads `dist/<route>/index.html`, route like `/` or `/en/projetos/argus/`), `text(html: string): string` (strips tags, collapses whitespace, decodes `&amp;`), `check(name: string, ok: boolean, detail?: string): void` (records a failure), and a final summary that prints each failure and exits 1 if any. Later tasks append `check(...)` blocks under a comment header `// --- Task N ---`.

- [ ] **Step 1:** Write the harness with one baseline block: `check('home exists', page('/').includes('<html'))` and `check('en home exists', page('/en/').includes('<html'))`.
- [ ] **Step 2:** Run `node_modules/.bin/astro build && node scripts/check-site.mjs`. Expected: `0 failures`, exit 0.

### Task 2: Home: heading, owner's bio, pseudonym meta

**Files:**
- Modify: `src/components/HomeBio.astro` (drop the `NOW RECEIVING:`/`RECEBENDO AGORA:` prefix; h1 renders `SITE.headline[locale]`; keep the blinking dot via a `span[aria-hidden]` before the text; wrap the text in `<span lang="en">` when `locale === 'pt-br'`)
- Modify: `src/config/site.ts` (`headline` → `'Notes from Olwtelet'` for both locales; update its comment)
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro` (bio paragraphs, `description`)
- Modify: `src/utils/seo.ts` (comment "gaming handle" → "pseudonym")
- Test: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: `projectRoute(slug)[locale]`, `routes.projects|openSource|certificates[locale]` from `src/i18n/routes.ts`.

The PT text is the spec's §1 "Bio text", paragraphs 1–8, verbatim. Links:
- `Isaac Rodrigues` = existing photo-toggle button; `Brasília, Brasil` (EN `Brasília, Brazil`) = existing `data-channel="8"` button.
- `Filmes HD Online Grátis` → `https://filmeshdonlinegratis.vercel.app/` (external).
- `Integratek`, `Rocha & Sá`, `CT Thalita Rodrigues`, `Instituto Politécnico do Brasil`, `Argus`, `AgentForge` → `projectRoute('integratek' | 'rocha-e-sa' | 'thalit-academy' | 'instituto-politecnico-do-brasil' | 'argus' | 'agentforge')[locale]`.
- `Konect` → `https://konect.gg/olwtelet` followed by the existing `<span class="bio__soon">` tag.
- `Sintonize` (EN `Tune in`) = existing `data-channel="1"` button; `projetos` → `routes.projects`, `experimentos` (EN `experiments`) → `routes.openSource`, `certificados` (EN `certificates`) → `routes.certificates`.
- Veil, Diseens, Olwtelet Productions, Ordfall, MIT OpenCourseWare: plain text.
- External links: `target="_blank" rel="noopener noreferrer"`.

Meta `description`: PT `Olwtelet é o pseudônimo de Isaac Rodrigues, desenvolvedor de software em Brasília. Notas e arquivo do que ele constrói.` EN `Olwtelet is the pseudonym of Isaac Rodrigues, a software developer in Brasília, Brazil. Notes and an archive of what he builds.`

- [ ] **Step 1: Add the failing checks** under `// --- Task 2 ---`, for both `/` and `/en/`:
  - h1 text equals `Notes from Olwtelet`; html does not contain `RECEBENDO AGORA` / `NOW RECEIVING`; PT h1 contains `lang="en"`.
  - PT text contains `Meu nome é Isaac Rodrigues` and `Na Ordfall, participo de projetos relacionados à cibersegurança`; EN contains `My name is Isaac Rodrigues`.
  - hrefs present (PT): `/projetos/integratek/`, `/projetos/rocha-e-sa/`, `/projetos/thalit-academy/`, `/projetos/instituto-politecnico-do-brasil/`, `/projetos/argus/`, `/projetos/agentforge/`, `https://filmeshdonlinegratis.vercel.app/`, `https://konect.gg/olwtelet`, `/projetos/`, `/codigo-aberto/`, `/certificados/`; EN the `/en/...` equivalents.
  - both contain `js-photo-toggle`, `data-channel="8"`, `data-channel="1"`, `bio__soon`; neither bio contains `Código no GitHub` / `Code is on`.
  - count of `<a ` + `<button` inside `<article class="bio"` is equal on PT and EN.
  - meta description of both contains `pseudônimo`/`pseudonym`; site-wide (every `dist/**/*.html`) no match for `/\bnick\b/i` or `/gaming handle/i`.
- [ ] **Step 2:** Build + run checker. Expected: the Task 2 checks FAIL.
- [ ] **Step 3:** Implement the files above.
- [ ] **Step 4:** Build + run checker. Expected: 0 failures.

### Task 3: Nav, footer, text-nav alias, dossier return

**Files:**
- Modify: `src/i18n/translations.ts` (`nav.websites` → `nav.projects`: PT `projetos`, EN `projects`; `footer.resume`: PT `RESUMO`)
- Modify: `src/components/Header.astro:22-25` (`homeNav` second item → `{ label: t.nav.projects, href: routes.projects[locale] }`)
- Modify: `src/modules/pagesIndex.js` (PT `/curriculo/` aliases gain `resumo`)
- Modify: `src/components/ProjectDossier.astro` (`returnPath` for `collection === 'websites'` → `routes.projects[locale]`)
- Test: `scripts/check-site.mjs`

- [ ] **Step 1: Add failing checks:** PT home nav contains `href="/projetos/"` with text `projetos` and no nav link with text `sites`; EN home nav `href="/en/projects/"` text `projects`; PT footer text contains `RESUMO`, EN footer `RESUME`; `/projetos/rocha-e-sa/` contains `href="/projetos/"` in `.dossier__links`; `/projetos/argus/` return still `href="/codigo-aberto/"`; `dist/sites/index.html` and `dist/en/websites/index.html` exist.
- [ ] **Step 2:** Build + checker → Task 3 checks FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Build + checker → 0 failures.

### Task 4: Preview type, window component, dossier placement

**Files:**
- Modify: `src/data/projects.ts` (types and `localizeProject`)
- Create: `src/components/ProjectPreview.astro`
- Create: `src/components/PreviewDiagram.astro` (stub here: renders `<div class="diagram" data-diagram={slug}></div>`; Task 6 fills it)
- Modify: `src/components/ProjectDossier.astro` (render the preview right after the OVERVIEW section, before MY ROLE)
- Modify: `src/i18n/translations.ts` (new `preview` group)
- Test: `scripts/check-site.mjs`

**Interfaces:**
- Produces (in `projects.ts`):
  ```ts
  export type PreviewKind = 'screenshot' | 'repo' | 'diagram'
  export type ProjectPreview = {
    kind: PreviewKind
    /** Basename under /assets/previews/ (both .webp and .jpg exist). Required unless kind is 'diagram'. */
    image?: string
    width?: number
    height?: number
    /** Title-bar source, e.g. 'integratek.com.br' or 'github.com/Olwtelet/Resumex' */
    source: string
    /** Where the window opens (new tab) */
    href: string
    alt: LocalizedText
  }
  ```
  `Project.preview?: ProjectPreview`; `LocalizedProject.preview?: Omit<ProjectPreview, 'alt'> & { alt: string }`.
- Produces: `ProjectPreview.astro` props `{ preview: LocalizedProject['preview']; slug: string; locale: Locale }` rendering `<figure class="preview" data-preview-kind={kind}>` › `<a class="preview__window" href target="_blank" rel="noopener noreferrer" aria-label={t.preview.open(source)}>` › `<span class="preview__bar">{t.preview.label} · {source}<span class="preview__kind">{t.preview.kind[kind]}</span></span>` + body: `<picture>` (webp source + jpg `<img>` with `width`, `height`, `alt`, `loading="lazy"`, `decoding="async"`) or `<PreviewDiagram slug locale />` for `diagram`.
- Produces: `PreviewDiagram.astro` props `{ slug: string; locale: Locale }`.
- Translations: `preview: { label, kind: { screenshot, repo, diagram }, open: (source: string) => string }` with the Global Constraints strings; `open` PT `Abrir ${source} em nova aba`, EN `Open ${source} in a new tab`.
- Styling (builder's call within): OSD look matching `.dossier__section h2` (0.8rem uppercase, `--text-secondary`), 1px border `rgba(255,255,255,0.25)`, image `width: 100%; height: auto`, visible `:focus-visible` outline, optional faint scanline overlay that never hides content.

- [ ] **Step 1: Add failing checks:** set a temporary fixture-free assertion that will pass only once Tasks 5–6 add data: for every dossier route in `dist/projetos/*/` and `dist/en/projects/*/`, if it contains `class="preview"` then the `.preview__window` has `aria-label`, `target="_blank"`, and either a `<img` with `width=` and `height=` whose `/assets/previews/<name>.jpg` and `.webp` exist in `dist/`, or `data-diagram=`. Also: the preview appears after the OVERVIEW heading and before `MINHA FUNÇÃO`/`MY ROLE` when both exist.
- [ ] **Step 2:** Add `preview` to one project temporarily (Resumex, kind `repo`, image `resumex`, 1192×696, source `github.com/Olwtelet/Resumex`, href its repo) without the image file; build + checker → FAIL on the missing file. (This proves the file check works.)
- [ ] **Step 3:** Implement types, component, translations, placement. Keep the Resumex entry; Task 5 supplies its image.
- [ ] **Step 4:** Build + checker → only the missing-image check for Resumex fails (fixed in Task 5).

### Task 5: Capture script and image-backed previews

**Files:**
- Create: `scripts/capture-previews.mjs`
- Create: `public/assets/previews/{integratek,rocha-e-sa,thalit-academy,instituto-politecnico-do-brasil,resumex}.{webp,jpg}` (script output)
- Modify: `src/data/projects.ts` (`preview` for those five projects)
- Modify: `package.json` (`"capture:previews": "node scripts/capture-previews.mjs"`)
- Test: `scripts/check-site.mjs`

**Interfaces:**
- Script targets (exact): `{ slug: 'integratek', url: 'https://www.integratek.com.br/' }`, `{ slug: 'rocha-e-sa', url: 'https://rochaesa.vercel.app/' }`, `{ slug: 'thalit-academy', url: 'https://thalitarodrigues.com/' }`, `{ slug: 'instituto-politecnico-do-brasil', url: 'https://instituto-politecnico-do-brasil.vercel.app/' }`; download `{ slug: 'resumex', url: 'https://raw.githubusercontent.com/Olwtelet/Resumex/HEAD/docs/assets/preview.png' }`.
- Capture: launch `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` (fall back to `C:\Program Files\Microsoft\Edge\Application\msedge.exe`) with `--headless=new --remote-debugging-port=0 --user-data-dir=<os.tmpdir()/olw-capture>`; read the WS URL from stderr `DevTools listening on`; via CDP: `Emulation.setDeviceMetricsOverride {width:1440,height:900,deviceScaleFactor:1,mobile:false}`, `Page.navigate`, wait for `Page.loadEventFired` + 3 s, run the consent handler, wait 1 s, `Page.captureScreenshot {format:'png'}`.
- Consent handler (Runtime.evaluate): click the first visible button whose text matches `/recusar|rejeitar|negar|apenas (os )?(necess|essenc)|somente (necess|essenc)|decline|reject/i`; if none, set `display:none` on fixed/sticky elements whose text or id/class matches `/cookie|consent|lgpd|privacidade/i`. Never click anything matching `/aceit|accept|concordo|ok, entendi/i`. Log which branch ran per site.
- Output: `sharp` resize to 1200×750 (screenshots) / keep 1192×696 (Resumex) → `.webp` quality 80 and `.jpg` quality 82 into `public/assets/previews/`. Abort with exit 1 if a PNG is < 30 KB or navigation failed.
- Data (`preview` per project): kind `screenshot`, `image` = slug, 1200×750, `source` = host without `www.` (`integratek.com.br`, `rochaesa.vercel.app`, `thalitarodrigues.com`, `instituto-politecnico-do-brasil.vercel.app`), `href` = the project's `websiteUrl`; Resumex as in Task 4. Alt text PT/EN describes what the image shows (e.g. "Página inicial do site da Integratek").

- [ ] **Step 1: Add failing checks:** each of the five dossiers (PT and EN) contains `class="preview"` with `data-preview-kind` = `screenshot` (four sites) / `repo` (Resumex) and the kind label text (`CAPTURA`/`SCREENSHOT`, `DO REPOSITÓRIO`/`FROM THE REPO`).
- [ ] **Step 2:** Build + checker → FAIL.
- [ ] **Step 3:** Write the script; run `node scripts/capture-previews.mjs`. Expected: five `wrote ...` lines, exit 0.
- [ ] **Step 4:** Open each `.jpg` with the Read tool and confirm: real page content, no consent banner, no error page. Re-run with adjusted wait if not.
- [ ] **Step 5:** Add the `preview` data; build + checker → 0 failures.

### Task 6: Drawn previews (AgentForge, Argus, Obsidian Second Brain)

**Files:**
- Modify: `src/components/PreviewDiagram.astro`
- Modify: `src/data/projects.ts` (`preview` with kind `diagram` for `agentforge`, `argus`, `obsidian-second-brain`)
- Test: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: `PreviewDiagram.astro` props from Task 4.
- Data: `source` = `github.com/Olwtelet/AgentForge` | `github.com/Olwtelet/Argus` | `github.com/Olwtelet/Obsidian-Second-Brain`, `href` = the repository URL, `alt` describes the diagram as a diagram.

Content (real facts only, HTML/inline SVG so text uses the site font and is translatable):
- `agentforge`: a file-tree view: `AgentForge/` › `ag2/`, `agno/`, `autogen/`, `crewai/`, `google-adk/`, `langgraph/`, `llama-index/`, `openai-agents-sdk/`, `pydantic-ai/`, `smolagents/`, `study-agents-differences/`; beside it a "measured" list: PT `latência`, `consumo de tokens`, `taxa de falha` / EN `latency`, `token usage`, `failure rate`. No numbers.
- `argus`: inline SVG schematic map (abstract coastline/grid, no real geography claimed) with a layer legend: PT `aeronaves`, `embarcações`, `satélites`, `terremotos`, `queimadas`, `alertas meteorológicos`, `cabos submarinos` / EN `aircraft`, `vessels`, `satellites`, `earthquakes`, `fires`, `weather alerts`, `submarine cables`.
- `obsidian-second-brain`: a vault tree + link lines: `CodeConcepts/`, `Studies/`, `Clippings/`, `Filosofia/`, `Artigos de programação/`, `RoadMap - Fundamentos do desenvolvimento web.md`.

- [ ] **Step 1: Add failing checks:** each of the three dossiers (PT/EN) has `data-preview-kind="diagram"`, the label `ESQUEMA`/`DIAGRAM`, and its key strings: AgentForge `smolagents` and `study-agents-differences`; Argus `satélites`/`satellites`; Obsidian `CodeConcepts`.
- [ ] **Step 2:** Build + checker → FAIL.
- [ ] **Step 3:** Implement the diagrams and data.
- [ ] **Step 4:** Build + checker → 0 failures.
- [ ] **Step 5: Browser check** (preview server per memory `portfolio-local-toolchain-quirks`): at 375×812 on `/projetos/agentforge/`, `/projetos/argus/`, `/projetos/obsidian-second-brain/`, `/projetos/integratek/`, `document.documentElement.scrollWidth === 375`; Tab reaches `.preview__window` and shows a focus outline; ESC still returns to the index.

### Task 7: Shorter project pages and archival copy

**Files:**
- Modify: `src/data/projects.ts` (all eight projects' `summary`, `overview`, `roleDescription`, `highlights`; delete `problem`, `approach` fields and their type entries)
- Modify: `src/components/ProjectDossier.astro` (remove PROBLEM/APPROACH from `sections`)
- Modify: `src/i18n/translations.ts` (remove `dossier.problem`, `dossier.approach`)
- Modify: `src/pages/{sites,codigo-aberto,certificados}.astro`, `src/pages/projetos/index.astro`, `src/pages/en/{websites,open-source,certificates}.astro`, `src/pages/en/projects/index.astro` (`description`)
- Modify: `src/pages/curriculo.md`, `src/pages/en/resume.md` (only `conhecido online como Olwtelet` → `Olwtelet é o pseudônimo com que assina o trabalho` / `known online as Olwtelet` → `Olwtelet is the pseudonym on his work`)
- Modify: `README.md` (intro paragraph only)
- Test: `scripts/check-site.mjs`

Rules: `overview` ≤ 2 sentences; `roleDescription` 1 sentence; `highlights` ≤ 4 items, each ≤ 90 characters; `summary` ≤ 100 characters; every remaining statement must already exist in the current text (rewording/cutting only). Voice per Global Constraints.

- [ ] **Step 1: Add failing checks:** no dossier (PT/EN) contains `O PROBLEMA`, `ABORDAGEM`, `THE PROBLEM`, `APPROACH`; each dossier's `.dossier__list li` count ≤ 4; the OVERVIEW paragraph has ≤ 2 matches of `/[.!?](\s|$)/` (so `Next.js` does not count); no banned word (Global Constraints) in any dossier or listing page or the resume pages.
- [ ] **Step 2:** Build + checker → FAIL.
- [ ] **Step 3:** Rewrite. Then run a fact diff: for each changed project, every noun phrase/number in the new text appears in the old text (`git diff -U0 src/data/projects.ts`, read side by side).
- [ ] **Step 4:** Build + checker → 0 failures; `astro check` 0 errors; Prettier clean.

### Task 8: Final verification and hand-off

- [ ] **Step 1:** `node_modules/.bin/prettier --check "src/**/*.{astro,svelte,ts,js,css,md}" scripts/*.mjs README.md` → clean; `node_modules/.bin/astro check` → 0 errors; build + checker → 0 failures.
- [ ] **Step 2:** Browser pass on `/`, `/en/`, `/projetos/`, two dossiers per kind, `/curriculo/` at 1280×800 and 375×812: no overflow, photo toggle opens, Brasília/Sintonize buttons switch channel, previews load.
- [ ] **Step 3:** Restore `.claude/launch.json` with `git checkout HEAD -- .claude/launch.json`; `git status` shows only intended files (spec, plan, sources, `public/assets/previews/*`, scripts).
- [ ] **Step 4:** Ask the owner whether to commit and push (repo rule).
