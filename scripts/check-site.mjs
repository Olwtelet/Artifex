// Checks the built site in dist/ against what the pages must contain.
// Run after `astro build`: node scripts/check-site.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const failures = []
let total = 0

/** HTML of a built route such as '/' or '/en/projects/argus/' ('' if missing). */
function page(route) {
  const file = join(dist, route, 'index.html')
  return existsSync(file) ? readFileSync(file, 'utf8') : ''
}

/** Visible-ish text: tags stripped, entities decoded, whitespace collapsed. */
function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** First slice of html from the first match of `start` to the next `end`. */
function slice(html, start, end) {
  const from = html.indexOf(start)
  if (from === -1) return ''
  const to = html.indexOf(end, from + start.length)
  return to === -1 ? html.slice(from) : html.slice(from, to)
}

/** Every built HTML file under dist/. */
function allHtml(dir = dist) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return allHtml(path)
    return name.endsWith('.html') ? [path] : []
  })
}

function check(name, ok, detail = '') {
  total += 1
  if (!ok) failures.push(detail ? `${name} — ${detail}` : name)
}

// --- Task 1 ---
check('home exists', page('/').includes('<html'))
check('en home exists', page('/en/').includes('<html'))

// --- Task 2 ---
{
  const homes = [
    {
      route: '/',
      intro: 'Meu nome é Isaac Rodrigues',
      ordfall:
        'Na Ordfall, participo de projetos relacionados à cibersegurança',
      prefix: '/projetos/',
      lists: ['/projetos/', '/codigo-aberto/', '/certificados/'],
      gone: 'Código no GitHub',
      meta: 'pseudônimo',
      receiving: 'RECEBENDO AGORA',
    },
    {
      route: '/en/',
      intro: 'My name is Isaac Rodrigues',
      ordfall: 'At Ordfall',
      prefix: '/en/projects/',
      lists: ['/en/projects/', '/en/open-source/', '/en/certificates/'],
      gone: 'Code is on',
      meta: 'pseudonym',
      receiving: 'NOW RECEIVING',
    },
  ]
  const counts = []
  for (const h of homes) {
    const html = page(h.route)
    const bio = slice(html, '<article class="bio', '</article>')
    const h1 = slice(bio, '<h1', '</h1>')
    check(
      `${h.route} h1 is Notes from Olwtelet`,
      text(h1) === 'Notes from Olwtelet',
      text(h1)
    )
    check(`${h.route} has no ${h.receiving}`, !html.includes(h.receiving))
    check(`${h.route} bio intro`, text(bio).includes(h.intro))
    check(`${h.route} ordfall sentence`, text(bio).includes(h.ordfall))
    const slugs = [
      'integratek',
      'rocha-e-sa',
      'thalit-academy',
      'instituto-politecnico-do-brasil',
      'argus',
      'agentforge',
    ]
    for (const slug of slugs) {
      check(
        `${h.route} links ${slug}`,
        bio.includes(`href="${h.prefix}${slug}/"`)
      )
    }
    for (const href of [
      'https://filmeshdonlinegratis.vercel.app/',
      'https://konect.gg/olwtelet',
      ...h.lists,
    ]) {
      check(`${h.route} links ${href}`, bio.includes(`href="${href}"`))
    }
    for (const marker of [
      'js-photo-toggle',
      'data-channel="8"',
      'data-channel="1"',
      'bio__soon',
    ]) {
      check(`${h.route} keeps ${marker}`, bio.includes(marker))
    }
    check(
      `${h.route} drops the GitHub/e-mail line`,
      !text(bio).includes(h.gone)
    )
    const meta = slice(html, '<meta name="description"', '>')
    check(`${h.route} meta says ${h.meta}`, meta.includes(h.meta), meta)
    counts.push(
      (bio.match(/<a\s/g) || []).length + (bio.match(/<button/g) || []).length
    )
  }
  check(
    'PT h1 text is marked lang="en"',
    slice(page('/'), '<h1', '</h1>').includes('lang="en"')
  )
  check(
    'PT and EN bios have the same links and buttons',
    counts[0] === counts[1],
    counts.join(' vs ')
  )
  const handle = allHtml().filter((file) =>
    /\bnick\b|gaming handle/i.test(readFileSync(file, 'utf8'))
  )
  check(
    'no "nick" or "gaming handle" anywhere',
    handle.length === 0,
    handle.join(', ')
  )
}

// --- Task 3 ---
{
  const menu = (route) => slice(page(route), 'class="nav__menu"', '</ul>')
  const footer = (route) =>
    slice(page(route), '<footer class="footer"', '</footer>')
  const links = (route) => slice(page(route), 'class="dossier__links"', '</ul>')
  check(
    'PT menu links projetos',
    /<a href="\/projetos\/"[^>]*>projetos<\/a>/.test(menu('/')),
    menu('/')
  )
  check('PT menu has no sites item', !/>\s*sites\s*</.test(menu('/')))
  check(
    'EN menu links projects',
    /<a href="\/en\/projects\/"[^>]*>projects<\/a>/.test(menu('/en/')),
    menu('/en/')
  )
  check('EN menu has no websites item', !/>\s*websites\s*</.test(menu('/en/')))
  check(
    'PT footer says RESUMO',
    text(footer('/')).includes('RESUMO'),
    text(footer('/'))
  )
  check('EN footer says RESUME', text(footer('/en/')).includes('RESUME'))
  check(
    'website dossier returns to /projetos/',
    links('/projetos/rocha-e-sa/').includes('href="/projetos/"')
  )
  check(
    'EN website dossier returns to /en/projects/',
    links('/en/projects/rocha-e-sa/').includes('href="/en/projects/"')
  )
  check(
    'open-source dossier still returns to /codigo-aberto/',
    links('/projetos/argus/').includes('href="/codigo-aberto/"')
  )
  check('/sites/ still renders', page('/sites/').includes('<html'))
  check('/en/websites/ still renders', page('/en/websites/').includes('<html'))
}

// --- Task 4 ---
/** Every built project dossier route, both locales. */
function dossierRoutes() {
  return [
    ['/projetos/', join(dist, 'projetos')],
    ['/en/projects/', join(dist, 'en', 'projects')],
  ].flatMap(([prefix, dir]) =>
    readdirSync(dir)
      .filter((name) => statSync(join(dir, name)).isDirectory())
      .map((name) => `${prefix}${name}/`)
  )
}
{
  for (const route of dossierRoutes()) {
    const html = page(route)
    if (!html.includes('class="preview"')) continue
    const figure = slice(html, '<figure class="preview"', '</figure>')
    const window = slice(figure, '<a class="preview__window"', '>')
    check(
      `${route} preview link has aria-label`,
      window.includes('aria-label='),
      window
    )
    check(
      `${route} preview opens in a new tab`,
      window.includes('target="_blank"')
    )
    const img = slice(figure, '<img', '>')
    if (img) {
      const src = (img.match(/src="([^"]+)"/) || [])[1] || ''
      const base = src.replace(/\.jpg$/, '')
      check(
        `${route} preview img has width/height`,
        /\swidth="\d+"/.test(img) && /\sheight="\d+"/.test(img),
        img
      )
      check(
        `${route} preview jpg exists`,
        src.endsWith('.jpg') && existsSync(join(dist, src)),
        src
      )
      check(
        `${route} preview webp exists`,
        existsSync(join(dist, `${base}.webp`)),
        `${base}.webp`
      )
    } else {
      check(
        `${route} preview is an image or a diagram`,
        figure.includes('data-diagram=')
      )
    }
    const overview = Math.max(
      html.indexOf('>VISÃO GERAL<'),
      html.indexOf('>OVERVIEW<')
    )
    const role = Math.max(
      html.indexOf('>MINHA FUNÇÃO<'),
      html.indexOf('>MY ROLE<')
    )
    const at = html.indexOf('<figure class="preview"')
    check(
      `${route} preview comes after the overview`,
      overview !== -1 && at > overview
    )
    if (role !== -1) check(`${route} preview comes before my role`, at < role)
  }
  check(
    'Resumex dossier has a preview',
    page('/projetos/resumex/').includes('class="preview"')
  )
  check(
    'EN Resumex dossier has a preview',
    page('/en/projects/resumex/').includes('class="preview"')
  )
}

// --- Task 5 ---
{
  const expected = [
    ['integratek', 'screenshot'],
    ['rocha-e-sa', 'screenshot'],
    ['thalit-academy', 'screenshot'],
    ['instituto-politecnico-do-brasil', 'screenshot'],
    ['resumex', 'repo'],
  ]
  const labels = {
    screenshot: ['CAPTURA', 'SCREENSHOT'],
    repo: ['DO REPOSITÓRIO', 'FROM THE REPO'],
  }
  for (const [slug, kind] of expected) {
    for (const [i, route] of [
      `/projetos/${slug}/`,
      `/en/projects/${slug}/`,
    ].entries()) {
      const figure = slice(page(route), '<figure class="preview"', '</figure>')
      check(
        `${route} preview kind is ${kind}`,
        figure.includes(`data-preview-kind="${kind}"`)
      )
      check(
        `${route} shows ${labels[kind][i]}`,
        text(figure).includes(labels[kind][i]),
        text(figure)
      )
    }
  }
}

// --- Task 6 ---
{
  const diagrams = [
    [
      'agentforge',
      ['smolagents', 'study-agents-differences'],
      ['latência', 'latency'],
    ],
    ['argus', [], ['satélites', 'satellites']],
    ['obsidian-second-brain', ['CodeConcepts'], []],
  ]
  for (const [slug, shared, perLocale] of diagrams) {
    for (const [i, route] of [
      `/projetos/${slug}/`,
      `/en/projects/${slug}/`,
    ].entries()) {
      const figure = slice(page(route), '<figure class="preview"', '</figure>')
      check(
        `${route} preview kind is diagram`,
        figure.includes('data-preview-kind="diagram"')
      )
      check(
        `${route} shows ${['ESQUEMA', 'DIAGRAM'][i]}`,
        text(figure).includes(['ESQUEMA', 'DIAGRAM'][i])
      )
      for (const word of shared)
        check(`${route} diagram shows ${word}`, text(figure).includes(word))
      if (perLocale.length) {
        check(
          `${route} diagram shows ${perLocale[i]}`,
          text(figure).includes(perLocale[i])
        )
      }
    }
  }
}

// --- Task 7 ---
{
  const banned =
    /soluções|inovador|inovadora|transformar|de ponta(?! a ponta)|excelência|incrível|solutions|innovative|cutting-edge|seamless|world-class|passionate/i
  for (const route of dossierRoutes()) {
    const html = page(route)
    for (const heading of [
      'O PROBLEMA',
      'ABORDAGEM',
      'THE PROBLEM',
      'APPROACH',
    ]) {
      check(
        `${route} has no ${heading} section`,
        !html.includes(`>${heading}<`)
      )
    }
    const items = (
      slice(html, 'class="dossier__list"', '</ul>').match(/<li/g) || []
    ).length
    check(`${route} has at most 4 features`, items <= 4, `${items} items`)
    const overview = slice(html, 'class="dossier__section"', '</section>')
    const sentences = (
      text(slice(overview, '<p', '</p>')).match(/[.!?](\s|$)/g) || []
    ).length
    check(
      `${route} overview has at most 2 sentences`,
      sentences <= 2,
      `${sentences} sentences`
    )
    check(
      `${route} avoids sales words`,
      !banned.test(text(slice(html, '<article class="dossier"', '</article>'))),
      (text(html).match(banned) || [''])[0]
    )
  }
  const listings = [
    '/projetos/',
    '/codigo-aberto/',
    '/sites/',
    '/certificados/',
    '/en/projects/',
    '/en/open-source/',
    '/en/websites/',
    '/en/certificates/',
    '/resumo/',
    '/en/resume/',
  ]
  for (const route of listings) {
    const html = page(route)
    check(
      `${route} avoids sales words`,
      !banned.test(text(html)),
      (text(html).match(banned) || [''])[0]
    )
  }
  for (const route of ['/projetos/', '/en/projects/']) {
    for (const small of page(route).match(
      /<small class="project-list__summary"[^>]*>[^<]*<\/small>/g
    ) || []) {
      const summary = text(small)
      check(
        `${route} summary ≤ 100 chars`,
        summary.length <= 100,
        `${summary.length}: ${summary}`
      )
    }
  }
}

// --- Final review fixes ---
{
  // The IPB screenshot shows "em Brasília e em todo o Distrito Federal";
  // the overview must not claim a nationwide scope.
  for (const route of [
    '/projetos/instituto-politecnico-do-brasil/',
    '/en/projects/instituto-politecnico-do-brasil/',
  ]) {
    const article = text(
      slice(page(route), '<article class="dossier"', '</article>')
    )
    check(
      `${route} makes no nationwide claim`,
      !/todo o país|nationwide/i.test(article)
    )
  }
  const ptResume = text(page('/resumo/'))
  const enResume = text(page('/en/resume/'))
  check(
    'PT resume says "Assina o trabalho como Olwtelet"',
    ptResume.includes('Assina o trabalho como Olwtelet.')
  )
  check(
    'EN resume says "Works under the pseudonym Olwtelet"',
    enResume.includes('Works under the pseudonym Olwtelet.')
  )
  check(
    'EN resume drops "the pseudonym on his work"',
    !enResume.includes('pseudonym on his work')
  )
}

// --- Resume page is called "Resumo" in Portuguese ---
{
  const html = page('/resumo/')
  const strip = text(slice(html, '<div class="archive-strip"', '</div>'))
  check(
    'PT resume strip says RESUMO',
    strip.includes('SIGNAL ARCHIVE / RESUMO'),
    strip
  )
  check('PT resume tab title is Resumo', html.includes('<title>Resumo</title>'))
  check(
    'PT resume page has no "Currículo"',
    !/curr[íi]culo/i.test(text(html)),
    (text(html).match(/.{20}curr[íi]culo.{20}/i) || [''])[0]
  )
  const en = text(
    slice(page('/en/resume/'), '<div class="archive-strip"', '</div>')
  )
  check(
    'EN resume strip still says RESUME',
    en.includes('SIGNAL ARCHIVE / RESUME'),
    en
  )
}

// --- Resume lives at /resumo/; the old address redirects there ---
{
  const redirectsTo = (route, target) => {
    const html = page(route)
    return html.includes(`content="0;url=${target}"`)
  }
  check(
    '/resumo/ is the PT resume page',
    page('/resumo/').includes('<title>Resumo</title>')
  )
  check(
    '/curriculo/ redirects to /resumo/',
    redirectsTo('/curriculo/', '/resumo/'),
    page('/curriculo/').slice(0, 160)
  )
  check(
    '/pt-br/curriculo/ redirects straight to /resumo/',
    redirectsTo('/pt-br/curriculo/', '/resumo/'),
    page('/pt-br/curriculo/').slice(0, 160)
  )
  const footer = slice(page('/'), '<footer class="footer"', '</footer>')
  check(
    'PT footer RESUMO links /resumo/',
    footer.includes('href="/resumo/"'),
    footer.slice(0, 200)
  )
  const enHead = slice(page('/en/resume/'), '<head', '</head>')
  check(
    'EN resume points its PT alternate at /resumo/',
    enHead.includes(
      'hreflang="pt-BR" href="https://olwtelet.vercel.app/resumo/"'
    )
  )
  const linking = allHtml()
    .filter(
      (file) =>
        !/Redirecting to:/.test(readFileSync(file, 'utf8').slice(0, 200))
    )
    .filter((file) =>
      /href="[^"]*\/curriculo\//.test(readFileSync(file, 'utf8'))
    )
  check(
    'no page links to /curriculo/ any more',
    linking.length === 0,
    linking.join(', ')
  )
}

// --- end of checks ---

for (const failure of failures) console.log(`FAIL ${failure}`)
console.log(
  `${total - failures.length}/${total} checks passed, ${failures.length} failures`
)
process.exit(failures.length ? 1 : 0)
