/**
 * Generates the complete favicon/icon set from the Olwtelet "A" mark
 * (public/assets/images/logo.svg).
 *
 *   pnpm generate:icons
 *
 * The mark is dressed as a signal on the site's CRT: the red/cyan split of
 * .glitchy-text, plus a soft screen glow and scanlines on the large icons.
 * The tiny favicons stay flat so the A still reads at 16px.
 *
 * Outputs (all in public/):
 *   favicon.svg, favicon.ico (16+32+48), favicon-16x16.png, favicon-32x32.png,
 *   favicon-48x48.png, apple-touch-icon.png (180), icon-192.png, icon-512.png,
 *   icon-512-maskable.png
 */
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { readLogo } from './logo.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

/** Icon canvas, in SVG units. */
const S = 512

/**
 * The mark centred on a black square.
 * - fill: share of the square's height taken by the A
 * - split: red/cyan offset in canvas units (0 keeps it flat white)
 * - crt: output size in px to draw the screen glow and scanlines for
 *   (scanline spacing is set in real pixels so it never aliases), or false
 */
function iconSvg(
  { viewBox: [vx, vy, vw, vh], d },
  { fill, split = 0, crt = false }
) {
  const k = (S * fill) / vh
  const tx = (S - vw * k) / 2 - vx * k
  const ty = (S - vh * k) / 2 - vy * k
  const layer = (color, opacity, dx, dy) => {
    const alpha = opacity < 1 ? ` fill-opacity="${opacity}"` : ''
    const shift =
      dx || dy
        ? ` transform="translate(${(dx / k).toFixed(2)} ${(dy / k).toFixed(2)})"`
        : ''
    return `<use href="#mark" fill="${color}"${alpha}${shift}/>`
  }
  const period = crt ? (Math.max(3, Math.round(crt / 128)) * S) / crt : 0

  // the path is defined once and drawn by every colour layer
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <defs>
    <path id="mark" fill-rule="evenodd" d="${d}"/>
    ${
      crt
        ? `<radialGradient id="glow" cx="50%" cy="42%" r="75%">
      <stop offset="0" stop-color="#1e1e1e"/>
      <stop offset="1" stop-color="#000000"/>
    </radialGradient>
    <pattern id="scanlines" width="${S}" height="${period.toFixed(3)}" patternUnits="userSpaceOnUse">
      <rect width="${S}" height="${(period / 3).toFixed(3)}" fill="#000000" fill-opacity="0.15"/>
    </pattern>`
        : ''
    }
  </defs>
  <rect width="${S}" height="${S}" fill="${crt ? 'url(#glow)' : '#000000'}"/>
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(5)})">
    ${split ? layer('#02b7b6', 0.85, split, split * 0.6) + layer('#b70202', 0.85, -split, -split * 0.6) : ''}
    ${layer('#ffffff', 1, 0, 0)}
  </g>
  ${crt ? `<rect width="${S}" height="${S}" fill="url(#scanlines)"/>` : ''}
</svg>
`
}

async function png(svg, size) {
  return sharp(Buffer.from(svg), { density: 144 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: size <= 48 })
    .toBuffer()
}

/** Pack PNG buffers into a .ico container (PNG-in-ICO, fine for all modern consumers). */
function packIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)

  const dir = Buffer.alloc(16 * entries.length)
  let offset = 6 + dir.length
  entries.forEach(({ size, buffer }, i) => {
    const base = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, base) // width
    dir.writeUInt8(size >= 256 ? 0 : size, base + 1) // height
    dir.writeUInt8(0, base + 2) // palette colors
    dir.writeUInt8(0, base + 3) // reserved
    dir.writeUInt16LE(1, base + 4) // color planes
    dir.writeUInt16LE(32, base + 6) // bits per pixel
    dir.writeUInt32LE(buffer.length, base + 8)
    dir.writeUInt32LE(offset, base + 12)
    offset += buffer.length
  })

  return Buffer.concat([header, dir, ...entries.map((e) => e.buffer)])
}

async function main() {
  await mkdir(publicDir, { recursive: true })
  const logo = await readLogo()

  const flat = (split) => iconSvg(logo, { fill: 0.9, split })
  const screen = (size, fill = 0.8) =>
    iconSvg(logo, { fill, split: 10, crt: size })

  await writeFile(path.join(publicDir, 'favicon.svg'), flat(10))

  const files = {
    'favicon-16x16.png': [flat(0), 16],
    'favicon-32x32.png': [flat(10), 32],
    'favicon-48x48.png': [flat(10), 48],
    'apple-touch-icon.png': [screen(180), 180],
    'icon-192.png': [screen(192), 192],
    'icon-512.png': [screen(512), 512],
    // maskable: the A stays inside the 80% safe circle
    'icon-512-maskable.png': [screen(512, 0.52), 512],
  }
  for (const [name, [svg, size]] of Object.entries(files)) {
    await writeFile(path.join(publicDir, name), await png(svg, size))
  }

  const icoEntries = []
  for (const [size, split] of [
    [16, 0],
    [32, 10],
    [48, 10],
  ]) {
    icoEntries.push({ size, buffer: await png(flat(split), size) })
  }
  await writeFile(path.join(publicDir, 'favicon.ico'), packIco(icoEntries))

  console.log('icons written to public/')
}

main()
