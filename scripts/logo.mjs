/**
 * Reads the Olwtelet "A" mark (public/assets/images/logo.svg) for the
 * build-time image scripts: its viewBox and its single path.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export async function readLogo() {
  const svg = await readFile(
    path.join(root, 'public', 'assets', 'images', 'logo.svg'),
    'utf8'
  )
  const viewBox = svg
    .match(/viewBox="([^"]+)"/)?.[1]
    .split(/\s+/)
    .map(Number)
  const d = svg.match(/ d="([^"]+)"/)?.[1]
  if (!viewBox || viewBox.length !== 4 || !d) {
    throw new Error('logo.svg must have a viewBox and a single path')
  }
  return { viewBox, d }
}
