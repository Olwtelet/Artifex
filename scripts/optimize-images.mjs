/**
 * One-off optimizer for heavy raster assets.
 *
 *   pnpm optimize:images
 *
 * Currently: resizes public/assets/images/me.jpg (shown at ~476px max)
 * and emits an accompanying me.webp used when supported.
 */
import sharp from 'sharp'
import { rename, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(root, 'public', 'assets', 'images')

const TARGET = 640

async function main() {
  const source = path.join(imagesDir, 'me.jpg')
  const meta = await sharp(source).metadata()

  if ((meta.width ?? 0) > TARGET) {
    const tmp = source + '.tmp'
    await sharp(source)
      .resize(TARGET, TARGET, { fit: 'cover' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tmp)
    await rename(tmp, source)
  }

  await sharp(source)
    .webp({ quality: 80 })
    .toFile(path.join(imagesDir, 'me.webp'))

  for (const file of ['me.jpg', 'me.webp']) {
    const { size } = await stat(path.join(imagesDir, file))
    console.log(file, Math.round(size / 1024) + 'kB')
  }
}

main()
