// Tests for scripts/capture-previews.mjs.
//   node --test scripts/capture-previews.test.mjs
// The consent tests drive a real headless Edge against local fixture pages;
// they are skipped when Edge is not installed.
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { after, before, describe, test } from 'node:test'
import {
  Cdp,
  EDGE,
  handleConsent,
  launchEdge,
  openPage,
  stopEdge,
} from './capture-previews.mjs'

/** A WebSocket stand-in that never answers unless told to. */
class SilentSocket extends EventTarget {
  sent = []
  constructor() {
    super()
    queueMicrotask(() => this.dispatchEvent(new Event('open')))
  }
  send(data) {
    this.sent.push(JSON.parse(data))
  }
  close() {
    this.dispatchEvent(new Event('close'))
  }
}

describe('Cdp client', () => {
  let realWebSocket
  before(() => {
    realWebSocket = globalThis.WebSocket
    globalThis.WebSocket = SilentSocket
  })
  after(() => {
    globalThis.WebSocket = realWebSocket
  })

  test('send rejects when no reply arrives within its timeout', async () => {
    const cdp = await Cdp.connect('ws://fake')
    await assert.rejects(
      cdp.send('Page.enable', {}, undefined, 50),
      /timed out/
    )
  })

  test('pending sends reject when the socket closes', async () => {
    const cdp = await Cdp.connect('ws://fake')
    const pending = cdp.send('Page.enable')
    cdp.close()
    await assert.rejects(pending, /closed/)
  })

  test('waitFor rejects when the socket closes', async () => {
    const cdp = await Cdp.connect('ws://fake')
    const waiting = cdp.waitFor('Page.loadEventFired', 'session', 60_000)
    cdp.close()
    await assert.rejects(waiting, /closed/)
  })
})

const FIXTURES = {
  'declines.html': `<!doctype html><html><body>
    <header id="site-header" style="position:sticky;top:0">Logo <nav><a href="cookies.html">Política de Cookies</a></nav></header>
    <main><p>Conteúdo</p></main>
    <div id="cookie-banner" style="position:fixed;bottom:0;left:0;right:0">Usamos cookies.
      <button onclick="document.getElementById('cookie-banner').remove()">Recusar</button>
      <button onclick="document.body.dataset.accepted='1'">Aceitar</button>
    </div></body></html>`,
  'article-link.html': `<!doctype html><html><body>
    <header id="site-header" style="position:sticky;top:0">Logo</header>
    <main><a id="article" href="other.html">Como recusar um convite</a></main>
    <div class="consent" style="position:fixed;bottom:0;left:0;right:0">Este site usa cookies.
      <button onclick="document.body.dataset.accepted='1'">Aceitar</button>
    </div></body></html>`,
  'navigating-decline.html': `<!doctype html><html><body>
    <main><p>Conteúdo</p></main>
    <div class="cookie-consent" style="position:fixed;bottom:0;left:0;right:0">Usamos cookies.
      <a href="other.html">Recusar</a>
      <button onclick="document.body.dataset.accepted='1'">Aceitar</button>
    </div></body></html>`,
  'static-banner.html': `<!doctype html><html><body>
    <div id="lgpd">Este site usa cookies conforme a LGPD.
      <button onclick="document.body.dataset.accepted='1'">Aceitar</button>
    </div>
    <header id="site-header">Logo</header><main><p>Conteúdo</p></main></body></html>`,
  'banner-in-header.html': `<!doctype html><html><body>
    <header style="position:sticky;top:0">Logo
      <div>Usamos cookies. <button onclick="document.body.dataset.accepted='1'">Aceitar</button></div>
    </header><main><p>Conteúdo</p></main></body></html>`,
  'footer-settings.html': `<!doctype html><html><body>
    <main><p>Conteúdo</p></main>
    <footer><ul><li><button id="settings">Configurar cookies</button></li><li><a href="privacidade.html">Privacidade</a></li></ul></footer>
    </body></html>`,
  'other.html': `<!doctype html><html><body><p>Outra página</p></body></html>`,
}

describe('consent handling in a real browser', { skip: !EDGE }, () => {
  let dir
  let profile
  let edge
  let cdp
  const url = (name) => pathToFileURL(join(dir, name)).href

  before(async () => {
    dir = mkdtempSync(join(tmpdir(), 'olw-consent-fixtures-'))
    for (const [name, html] of Object.entries(FIXTURES)) {
      writeFileSync(join(dir, name), html)
    }
    profile = mkdtempSync(join(tmpdir(), 'olw-capture-test-'))
    edge = launchEdge(profile)
    cdp = await Cdp.connect(await edge.wsUrl)
  })

  after(() => {
    cdp?.close()
    if (edge) stopEdge(edge.proc)
    rmSync(dir, { recursive: true, force: true })
    try {
      rmSync(profile, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 300,
      })
    } catch {
      // Edge can keep its profile locked briefly; the OS temp dir cleans up
    }
  })

  /** Opens a fixture, runs the handler, returns its report plus page state. */
  async function run(name) {
    const page = await openPage(cdp, url(name))
    try {
      const report = await handleConsent(cdp, page.sessionId)
      const { result } = await cdp.send(
        'Runtime.evaluate',
        {
          expression: `({
            href: location.href,
            accepted: document.body.dataset.accepted === '1',
            header: (() => { const h = document.querySelector('header'); return !!h && getComputedStyle(h).display !== 'none' })(),
          })`,
          returnByValue: true,
        },
        page.sessionId
      )
      return { report, state: result.value }
    } finally {
      await page.close()
    }
  }

  test('declines through the banner and keeps the site header', async () => {
    const { report, state } = await run('declines.html')
    assert.match(report.actions.join(' '), /declined/)
    assert.equal(state.accepted, false)
    assert.equal(state.header, true)
    assert.equal(state.href, url('declines.html'))
  })

  test('never clicks a page link outside the banner', async () => {
    const { report, state } = await run('article-link.html')
    assert.equal(state.href, url('article-link.html'))
    assert.equal(state.accepted, false)
    assert.equal(state.header, true)
    assert.ok(report.hidden.length >= 1, 'the banner is hidden instead')
  })

  test('never follows a decline link that navigates', async () => {
    const { report, state } = await run('navigating-decline.html')
    assert.equal(state.href, url('navigating-decline.html'))
    assert.equal(state.accepted, false)
    assert.ok(report.hidden.length >= 1)
  })

  test('hides a consent banner that is not fixed or sticky', async () => {
    const { report, state } = await run('static-banner.html')
    assert.equal(state.accepted, false)
    assert.equal(state.header, true)
    assert.ok(report.hidden.length >= 1)
  })

  test('leaves a lone cookie-settings button in the footer alone', async () => {
    const page = await openPage(cdp, url('footer-settings.html'))
    try {
      const report = await handleConsent(cdp, page.sessionId)
      assert.deepEqual(report.hidden, [])
      assert.deepEqual(report.actions, [])
    } finally {
      await page.close()
    }
  })

  test('refuses to go on when a consent prompt it must not hide remains', async () => {
    await assert.rejects(run('banner-in-header.html'), /consent/i)
  })
})
