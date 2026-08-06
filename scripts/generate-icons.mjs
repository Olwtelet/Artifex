/**
 * Generates the complete favicon/icon set from a single SVG source.
 *
 *   pnpm generate:icons
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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

/**
 * A tiny CRT television broadcasting SMPTE color bars, on the site's black.
 * `pad` grows the safe area (used for the maskable variant).
 */
function tvSvg({ pad = 0 } = {}) {
  const s = 64 + pad * 2
  const o = pad // offset
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="#000000"/>
  <g stroke="#f1f2f6" stroke-width="4" fill="none" stroke-linecap="round">
    <path d="M${o + 20} ${o + 6} L${o + 32} ${o + 18} L${o + 46} ${o + 4}"/>
    <rect x="${o + 6}" y="${o + 18}" width="${52}" height="${40}" rx="3"/>
  </g>
  <!-- SMPTE color bars on the screen -->
  <g>
    <rect x="${o + 12}" y="${o + 24}" width="8" height="28" fill="#c0c0c0"/>
    <rect x="${o + 20}" y="${o + 24}" width="8" height="28" fill="#c0c000"/>
    <rect x="${o + 28}" y="${o + 24}" width="8" height="28" fill="#00c0c0"/>
    <rect x="${o + 36}" y="${o + 24}" width="8" height="28" fill="#00c000"/>
    <rect x="${o + 44}" y="${o + 24}" width="8" height="28" fill="#c000c0"/>
  </g>
  <!-- scanlines -->
  <g fill="#000000" opacity="0.25">
    ${Array.from({ length: 7 })
      .map(
        (_, i) =>
          `<rect x="${o + 12}" y="${o + 26 + i * 4}" width="40" height="1.5"/>`
      )
      .join('\n    ')}
  </g>
</svg>`
}

async function png(svg, size) {
  return sharp(Buffer.from(svg), { density: 300 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true })
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

  const svg = tvSvg()
  // maskable: content inside the central 60% (safe zone is 80%)
  const maskableSvg = tvSvg({ pad: 22 })

  await writeFile(path.join(publicDir, 'favicon.svg'), svg)

  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon-48x48.png': 48,
    'apple-touch-icon.png': 180,
    'icon-192.png': 192,
    'icon-512.png': 512,
  }

  for (const [name, size] of Object.entries(sizes)) {
    await writeFile(path.join(publicDir, name), await png(svg, size))
  }

  await writeFile(
    path.join(publicDir, 'icon-512-maskable.png'),
    await png(maskableSvg, 512)
  )

  const icoEntries = []
  for (const size of [16, 32, 48]) {
    icoEntries.push({ size, buffer: await png(svg, size) })
  }
  await writeFile(path.join(publicDir, 'favicon.ico'), packIco(icoEntries))

  console.log('icons written to public/')
}

main()
