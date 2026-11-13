// Captures the project preview images into public/assets/previews/.
//
//   node scripts/capture-previews.mjs            # everything
//   node scripts/capture-previews.mjs integratek # only the slugs given
//
// Live sites are captured with headless Microsoft Edge through the Chrome
// DevTools Protocol (no extra dependency: Node's global WebSocket). Cookie
// banners are declined or hidden first, never accepted. Repository media is
// downloaded as is. Each image is written as .webp and .jpg; the run stops
// with exit 1 if a page fails to load or a capture looks empty.
import { spawn, spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'assets', 'previews')

const SITES = [
  { slug: 'integratek', url: 'https://www.integratek.com.br/' },
  { slug: 'rocha-e-sa', url: 'https://rochaesa.vercel.app/' },
  { slug: 'thalit-academy', url: 'https://thalitarodrigues.com/' },
  {
    slug: 'instituto-politecnico-do-brasil',
    url: 'https://instituto-politecnico-do-brasil.vercel.app/',
  },
]

const REPO_MEDIA = [
  {
    slug: 'resumex',
    url: 'https://raw.githubusercontent.com/Olwtelet/Resumex/HEAD/docs/assets/preview.png',
  },
]

export const EDGE = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find((path) => existsSync(path))

const VIEWPORT = { width: 1440, height: 900 }
const OUTPUT = { width: 1200, height: 750 }
const MIN_PNG_BYTES = 30_000
const SETTLE_MS = 3000

// Shared page-side helpers. A consent prompt is the smallest visible element
// that mentions cookies/consent/LGPD and offers a choice button. The site's
// own header, nav and main content are never touched.
const CONSENT_HELPERS = `
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'
  }
  const cls = (el) => (typeof el.className === 'string' ? el.className : el.className?.baseVal || '')
  const words = /cookie|consent|lgpd/i
  const decline = /recusar|rejeitar|negar|apenas (os )?(necess|essenc)|somente (necess|essenc)|decline|reject/i
  const accept = /aceit|accept|concordo|ok, entendi|permitir|allow/i
  const choice = /recusar|rejeitar|negar|necess|essenc|decline|reject|aceit|accept|concordo|entendi|permitir|allow|configur|prefer|gerenciar|manage/i
  const label = (el) => (el.textContent || el.value || '').trim()
  const buttons = (el) =>
    [...el.querySelectorAll('button, [role="button"], a, input[type="button"], input[type="submit"]')].filter(visible)
  const isPrompt = (el) => {
    if (!visible(el)) return false
    const text = label(el)
    const named = words.test(el.id + ' ' + cls(el) + ' ' + (el.getAttribute('aria-label') || ''))
    // the words must be in the prompt's own text, not only in a button label
    // (a lone 'Configurar cookies' button in a footer is not a prompt)
    let own = text
    for (const b of buttons(el)) own = own.replace(label(b), '')
    const worded = text.length < 1500 && words.test(own)
    return (named || worded) && buttons(el).some((b) => choice.test(label(b)))
  }
  const prompts = () => {
    const all = [...document.querySelectorAll('body *')].filter(isPrompt)
    return all.filter((el) => !all.some((other) => other !== el && el.contains(other)))
  }
  const isProtected = (el) =>
    el === document.body || el.matches('header, nav, main') || !!el.closest('header, nav') || !!el.querySelector('nav, main, h1')
  const describe = (el) =>
    el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls(el).trim() ? '.' + cls(el).trim().split(/\\s+/).slice(0, 2).join('.') : '')
`

// Clicks a decline button inside each consent prompt. Never an accept
// button, never a link that would navigate away.
export const DECLINE_JS = `(() => {
  ${CONSENT_HELPERS}
  const href = location.href
  const actions = []
  for (const box of prompts()) {
    if (isProtected(box)) continue
    const button = buttons(box).find((b) => {
      const text = label(b)
      if (!decline.test(text) || accept.test(text)) return false
      if (b.tagName === 'A') {
        const target = (b.getAttribute('href') || '').trim().toLowerCase()
        if (target && !target.startsWith('#') && !target.startsWith('javascript:')) return false
      }
      return true
    })
    if (button) {
      button.click()
      actions.push('declined via "' + label(button).slice(0, 40) + '" in ' + describe(box))
    }
  }
  return { href, actions }
})()`

// Hides consent prompts that are still visible (and consent iframes), then
// reports any prompt it was not allowed to hide.
export const HIDE_JS = `(() => {
  ${CONSENT_HELPERS}
  const hidden = []
  for (const box of prompts()) {
    if (isProtected(box)) continue
    let target = box
    for (let el = box; el && el !== document.body && !isProtected(el); el = el.parentElement) {
      const position = getComputedStyle(el).position
      if (position === 'fixed' || position === 'sticky') {
        target = el
        break
      }
    }
    target.style.setProperty('display', 'none', 'important')
    hidden.push(describe(target))
  }
  for (const frame of document.querySelectorAll('iframe')) {
    const id = (frame.src || '') + ' ' + frame.id + ' ' + cls(frame)
    if (visible(frame) && /consent|cookie|onetrust|cookiebot|didomi|usercentrics|trustarc/i.test(id)) {
      frame.style.setProperty('display', 'none', 'important')
      hidden.push(describe(frame))
    }
  }
  window.scrollTo(0, 0)
  return { href: location.href, hidden, remaining: prompts().map(describe) }
})()`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Minimal CDP client over one browser-level WebSocket (flattened sessions). */
export class Cdp {
  #ws
  #id = 0
  #pending = new Map()
  #waiters = []

  static async connect(url) {
    const cdp = new Cdp()
    cdp.#ws = new WebSocket(url)
    await new Promise((resolve, reject) => {
      cdp.#ws.addEventListener('open', resolve, { once: true })
      cdp.#ws.addEventListener('error', reject, { once: true })
    })
    cdp.#ws.addEventListener('message', (event) => cdp.#onMessage(event.data))
    // A dropped connection must fail every call in flight, never hang it.
    cdp.#ws.addEventListener('close', () =>
      cdp.#failAll(new Error('DevTools connection closed'))
    )
    cdp.#ws.addEventListener('error', () =>
      cdp.#failAll(new Error('DevTools connection closed after an error'))
    )
    return cdp
  }

  #failAll(error) {
    for (const { reject } of this.#pending.values()) reject(error)
    this.#pending.clear()
    for (const waiter of this.#waiters) waiter.reject(error)
    this.#waiters = []
  }

  #onMessage(raw) {
    const msg = JSON.parse(raw)
    if (msg.id && this.#pending.has(msg.id)) {
      const { resolve, reject } = this.#pending.get(msg.id)
      this.#pending.delete(msg.id)
      if (msg.error) reject(new Error(msg.error.message))
      else resolve(msg.result)
      return
    }
    this.#waiters = this.#waiters.filter((w) => {
      if (w.method !== msg.method || w.sessionId !== msg.sessionId) return true
      w.resolve(msg.params)
      return false
    })
  }

  send(method, params = {}, sessionId, timeoutMs = 30_000) {
    const id = ++this.#id
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id)
        reject(new Error(`timed out waiting for ${method}`))
      }, timeoutMs)
      this.#pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer)
          resolve(value)
        },
        reject: (error) => {
          clearTimeout(timer)
          reject(error)
        },
      })
      this.#ws.send(JSON.stringify({ id, method, params, sessionId }))
    })
  }

  waitFor(method, sessionId, timeoutMs) {
    return new Promise((resolve, reject) => {
      const waiter = {
        method,
        sessionId,
        resolve: (params) => {
          clearTimeout(timer)
          resolve(params)
        },
        reject: (error) => {
          clearTimeout(timer)
          reject(error)
        },
      }
      const timer = setTimeout(() => {
        this.#waiters = this.#waiters.filter((w) => w !== waiter)
        reject(new Error(`timed out waiting for ${method}`))
      }, timeoutMs)
      this.#waiters.push(waiter)
    })
  }

  close() {
    this.#ws.close()
    this.#failAll(new Error('DevTools connection closed'))
  }
}

export function launchEdge(profileDir) {
  if (!EDGE) throw new Error('Microsoft Edge not found')
  const proc = spawn(
    EDGE,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      '--mute-audio',
      'about:blank',
    ],
    { stdio: 'ignore' }
  )
  // On Windows Edge prints nothing to stderr; it writes the port and the
  // browser endpoint path to DevToolsActivePort in the profile instead.
  const wsUrl = (async () => {
    const file = join(profileDir, 'DevToolsActivePort')
    for (let waited = 0; waited < 20000; waited += 250) {
      if (existsSync(file)) {
        const [port, path] = readFileSync(file, 'utf8').trim().split(/\r?\n/)
        if (port && path) return `ws://127.0.0.1:${port}${path}`
      }
      await sleep(250)
    }
    throw new Error('Edge did not start')
  })()
  return { proc, wsUrl }
}

/** Ends Edge and every process it started (renderers, GPU). */
export function stopEdge(proc) {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], {
      stdio: 'ignore',
    })
  } else {
    proc.kill()
  }
}

/** Opens `url` in a new tab at the capture viewport and waits for `load`. */
export async function openPage(cdp, url) {
  const { targetId } = await cdp.send('Target.createTarget', {
    url: 'about:blank',
  })
  const close = async () => {
    try {
      await cdp.send('Target.closeTarget', { targetId }, undefined, 5000)
    } catch {
      // the tab or the connection is already gone; nothing left to close
    }
  }
  try {
    const { sessionId } = await cdp.send('Target.attachToTarget', {
      targetId,
      flatten: true,
    })
    await cdp.send('Page.enable', {}, sessionId)
    await cdp.send(
      'Emulation.setDeviceMetricsOverride',
      { ...VIEWPORT, deviceScaleFactor: 1, mobile: false },
      sessionId
    )
    const loaded = cdp.waitFor('Page.loadEventFired', sessionId, 45_000)
    const nav = await cdp.send('Page.navigate', { url }, sessionId)
    if (nav.errorText) throw new Error(`${url}: ${nav.errorText}`)
    await loaded
    return { sessionId, close }
  } catch (error) {
    await close()
    throw error
  }
}

/** Runs a page script and returns its value; a script error fails the run. */
async function evaluate(cdp, sessionId, expression) {
  const { result, exceptionDetails } = await cdp.send(
    'Runtime.evaluate',
    { expression, returnByValue: true },
    sessionId
  )
  if (exceptionDetails) {
    throw new Error(
      `page script failed: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`
    )
  }
  return result.value
}

const withoutHash = (href) => href.split('#')[0]

/**
 * Declines consent prompts, hides what is left, and refuses to continue if
 * the page navigated or a prompt it may not hide is still on screen.
 */
export async function handleConsent(cdp, sessionId) {
  const declined = await evaluate(cdp, sessionId, DECLINE_JS)
  await sleep(1000)
  const after = await evaluate(cdp, sessionId, HIDE_JS)
  if (withoutHash(after.href) !== withoutHash(declined.href)) {
    throw new Error(
      `consent handling navigated away: ${declined.href} -> ${after.href}`
    )
  }
  if (after.remaining.length > 0) {
    throw new Error(
      `consent prompt still visible, not hidden automatically: ${after.remaining.join(', ')}`
    )
  }
  return { actions: declined.actions, hidden: after.hidden }
}

export async function capturePage(cdp, url) {
  if (/^https?:/.test(url)) {
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) throw new Error(`${url} answered ${response.status}`)
  }
  const page = await openPage(cdp, url)
  try {
    await sleep(SETTLE_MS)
    const consent = await handleConsent(cdp, page.sessionId)
    await sleep(1000)
    const { data } = await cdp.send(
      'Page.captureScreenshot',
      { format: 'png' },
      page.sessionId
    )
    const summary = [
      ...consent.actions,
      ...consent.hidden.map((what) => `hid ${what}`),
    ]
    return {
      png: Buffer.from(data, 'base64'),
      consent: summary.join('; ') || 'no banner found',
    }
  } finally {
    await page.close()
  }
}

async function write(slug, png, size) {
  if (png.length < MIN_PNG_BYTES) {
    throw new Error(`${slug}: capture is only ${png.length} bytes, looks empty`)
  }
  const image = size
    ? sharp(png).resize(size.width, size.height, {
        fit: 'cover',
        position: 'top',
      })
    : sharp(png)
  await image
    .clone()
    .webp({ quality: 80 })
    .toFile(join(outDir, `${slug}.webp`))
  await image
    .clone()
    .flatten({ background: '#000' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(outDir, `${slug}.jpg`))
  const meta = await sharp(join(outDir, `${slug}.jpg`)).metadata()
  console.log(`wrote ${slug} (${meta.width}x${meta.height})`)
}

async function main() {
  const only = new Set(process.argv.slice(2))
  const wanted = (slug) => only.size === 0 || only.has(slug)
  mkdirSync(outDir, { recursive: true })

  for (const media of REPO_MEDIA.filter((m) => wanted(m.slug))) {
    const response = await fetch(media.url)
    if (!response.ok)
      throw new Error(`${media.url} answered ${response.status}`)
    await write(media.slug, Buffer.from(await response.arrayBuffer()))
  }

  const sites = SITES.filter((s) => wanted(s.slug))
  if (sites.length === 0) return

  const profileDir = mkdtempSync(join(tmpdir(), 'olw-capture-'))
  const { proc, wsUrl } = launchEdge(profileDir)
  let cdp
  try {
    cdp = await Cdp.connect(await wsUrl)
    for (const site of sites) {
      const { png, consent } = await capturePage(cdp, site.url)
      console.log(`${site.slug}: consent ${consent}`)
      await write(site.slug, png, OUTPUT)
    }
  } finally {
    cdp?.close()
    stopEdge(proc)
    // Edge can hold profile files for a moment after it exits.
    try {
      rmSync(profileDir, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 300,
      })
    } catch (error) {
      console.warn(`could not remove ${profileDir}: ${error.message}`)
    }
  }
}

// Run only when called as a script, so the helpers can be imported by tests.
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
