/**
 * Build-time Open Graph image generator (1200x630).
 *
 *   pnpm generate:og
 *
 * Renders an SVG "broadcast frame" template through sharp and writes:
 *   public/assets/og/home-en.png, home-pt-br.png
 *   public/assets/og/project-<slug>-<locale>.png  (for every project)
 *
 * No external APIs involved; output is committed so deploys never depend
 * on this script succeeding in CI.
 */
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  allProjects,
  fileNumber,
  localizeProject,
} from '../src/data/projects.ts'
import { useTranslations } from '../src/i18n/translations.ts'
import { readLogo } from './logo.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'assets', 'og')

const W = 1200
const H = 630
const MONO = "Consolas, 'Courier New', monospace"

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Glitchy chromatic text mimicking the site's .glitchy-text shadow. */
function glitchText({ x, y, size, text, fill = '#ffffff', spacing = 2 }) {
  const t = esc(text)
  const common = `font-family="${MONO}" font-size="${size}" letter-spacing="${spacing}" text-transform="uppercase"`
  return `
    <text x="${x + 4}" y="${y + 3}" ${common} fill="rgba(2,183,182,0.55)">${t}</text>
    <text x="${x - 4}" y="${y - 3}" ${common} fill="rgba(183,2,2,0.55)">${t}</text>
    <text x="${x}" y="${y}" ${common} fill="${fill}">${t}</text>`
}

function plainText({ x, y, size, text, fill = '#a0a0a0', spacing = 2 }) {
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" letter-spacing="${spacing}" fill="${fill}">${esc(text)}</text>`
}

const SMPTE = [
  '#c0c0c0',
  '#c0c000',
  '#00c0c0',
  '#00c000',
  '#c000c0',
  '#c00000',
  '#0000c0',
]

function colorBars({ y, height }) {
  const inner = W - 120
  const barW = inner / SMPTE.length
  return SMPTE.map(
    (color, i) =>
      `<rect x="${60 + i * barW}" y="${y}" width="${Math.ceil(barW)}" height="${height}" fill="${color}" opacity="0.85"/>`
  ).join('')
}

const LOGO = await readLogo()

/**
 * The Olwtelet "A" as a station bug — the translucent channel logo a
 * broadcaster keeps in the corner of the picture — with glitchText's split.
 */
function stationBug({
  height = 150,
  right = 80,
  top = 140,
  opacity = 0.6,
} = {}) {
  const [vx, vy, vw, vh] = LOGO.viewBox
  const k = height / vh
  const x = W - right - vw * k
  const layer = (fill, dx, dy) =>
    `<path fill="${fill}" fill-rule="evenodd" transform="translate(${(dx / k).toFixed(2)} ${(dy / k).toFixed(2)})" d="${LOGO.d}"/>`
  return `<g opacity="${opacity}" transform="translate(${(x - vx * k).toFixed(2)} ${(top - vy * k).toFixed(2)}) scale(${k.toFixed(5)})">
    ${layer('rgba(2,183,182,0.55)', 4, 3)}
    ${layer('rgba(183,2,2,0.55)', -4, -3)}
    ${layer('#ffffff', 0, 0)}
  </g>`
}

/** Shared broadcast-frame chrome: noise, scanlines, station bug, frame, vignette. */
function frame(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
    </radialGradient>
    <pattern id="scanlines" width="4" height="6" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" y="0" fill="#ffffff" opacity="0.045"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="#000000"/>
  <rect width="${W}" height="${H}" filter="url(#noise)" opacity="0.10"/>
  <rect width="${W}" height="${H}" fill="url(#scanlines)"/>

  ${content}
  ${stationBug()}

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- CRT frame -->
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="22" fill="none" stroke="#3d3d3d" stroke-width="4"/>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="14" fill="none" stroke="#1f1f1f" stroke-width="2"/>
</svg>`
}

function header({ leftLabel, rightLabel }) {
  return `
  ${plainText({ x: 72, y: 96, size: 30, text: leftLabel, fill: '#a0a0a0', spacing: 8 })}
  <circle cx="${W - 320}" cy="86" r="10" fill="#ff0000"/>
  ${plainText({ x: W - 300, y: 96, size: 28, text: rightLabel, fill: '#a0a0a0', spacing: 4 })}`
}

/**
 * Join a stack list, dropping trailing entries that would run past the frame.
 * At 28px monospace roughly 46 characters fit inside the safe area.
 */
const STACK_MAX_CHARS = 46

function fitStack(stack) {
  const parts = []
  for (const item of stack) {
    const candidate = [...parts, item].join(' / ')
    if (parts.length > 0 && candidate.length > STACK_MAX_CHARS) {
      return parts.join(' / ') + ' / …'
    }
    parts.push(item)
  }
  return parts.join(' / ')
}

/** Wrap a long name into lines that fit the frame at a given font size. */
function fitName(name) {
  if (name.length <= 14) return { size: 92, lines: [name] }
  if (name.length <= 22) return { size: 68, lines: [name] }
  const words = name.split(' ')
  const lines = ['']
  for (const word of words) {
    const candidate = lines[lines.length - 1]
      ? lines[lines.length - 1] + ' ' + word
      : word
    if (candidate.length > 18 && lines[lines.length - 1] !== '') {
      lines.push(word)
    } else {
      lines[lines.length - 1] = candidate
    }
  }
  return { size: 56, lines }
}

function homeSvg(locale) {
  const lines =
    locale === 'en'
      ? {
          role: 'FULL-STACK DEVELOPER',
          areas: 'APPLIED AI / WEB / AUTOMATION / SECURITY',
          place: 'BRASÍLIA, BRAZIL',
        }
      : {
          role: 'DESENVOLVEDOR FULL-STACK',
          areas: 'IA APLICADA / WEB / AUTOMAÇÃO / SEGURANÇA',
          place: 'BRASÍLIA, BRASIL',
        }

  const content = `
  ${header({ leftLabel: 'OLWTELET.VERCEL.APP', rightLabel: 'REC · CH 00' })}
  ${glitchText({ x: 70, y: 288, size: 104, text: 'OLWTELET', spacing: 6 })}
  ${plainText({ x: 72, y: 362, size: 40, text: 'ISAAC RODRIGUES', fill: '#e8e8e8', spacing: 4 })}
  ${plainText({ x: 72, y: 416, size: 28, text: lines.role })}
  ${plainText({ x: 72, y: 462, size: 26, text: lines.areas })}
  ${plainText({ x: 72, y: 504, size: 26, text: lines.place })}
  ${colorBars({ y: H - 96, height: 36 })}`

  return frame(content)
}

function projectSvg(project, locale) {
  const t = useTranslations(locale)
  const lp = localizeProject(project, locale)
  const num = fileNumber(project)

  const { size, lines } = fitName(project.name.toUpperCase())
  const nameStartY = lines.length > 1 ? 222 : 268
  const nameBlock = lines
    .map((line, i) =>
      glitchText({ x: 70, y: nameStartY + i * (size + 12), size, text: line })
    )
    .join('')
  const afterName = nameStartY + (lines.length - 1) * (size + 12)

  const meta = []
  meta.push(t.category[lp.category])
  if (lp.stack?.length) meta.push(fitStack(lp.stack))
  const statusLine = lp.status
    ? `${t.dossier.status}: ${t.status[lp.status]}${lp.year ? ` · ${lp.year}` : ''}`
    : lp.year || ''

  const metaBlock = [
    plainText({
      x: 72,
      y: afterName + 64,
      size: 34,
      text: meta[0],
      fill: '#e8e8e8',
      spacing: 4,
    }),
    meta[1]
      ? plainText({ x: 72, y: afterName + 110, size: 28, text: meta[1] })
      : '',
    statusLine
      ? plainText({ x: 72, y: afterName + 150, size: 28, text: statusLine })
      : '',
  ].join('')

  const content = `
  ${header({
    leftLabel: `OLWTELET · ${t.dossier.signalFile} ${num}`,
    rightLabel: `REC · CH ${num}`,
  })}
  ${nameBlock}
  ${metaBlock}
  ${colorBars({ y: H - 96, height: 36 })}`

  return frame(content)
}

async function render(svg, file) {
  await sharp(Buffer.from(svg), { density: 72 })
    .resize(W, H)
    .png({ compressionLevel: 9, palette: true, colors: 128, dither: 0.5 })
    .toFile(path.join(outDir, file))
  console.log('wrote', file)
}

async function main() {
  await mkdir(outDir, { recursive: true })

  for (const locale of ['en', 'pt-br']) {
    await render(homeSvg(locale), `home-${locale}.png`)
    for (const project of allProjects) {
      await render(
        projectSvg(project, locale),
        `project-${project.slug}-${locale}.png`
      )
    }
  }
}

main()
