import { loadingPage, LOADING_STATE } from './tv.js'
import { navigate, swapFunctions } from 'astro:transitions/client'

const MIN_LOADING_TIME = 300
const RETURN_SLUG_KEY = 'dossier-return-slug'

export function gotoPage(url) {
  if (!url || url.startsWith('#')) return
  navigate(url)
}

function readReturnSlug() {
  try {
    const slug = sessionStorage.getItem(RETURN_SLUG_KEY)
    sessionStorage.removeItem(RETURN_SLUG_KEY)
    return slug
  } catch {
    return null
  }
}

function saveReturnSlug(slug) {
  try {
    sessionStorage.setItem(RETURN_SLUG_KEY, slug)
  } catch {
    /* storage unavailable */
  }
}

export function setupClientNavigation() {
  document.addEventListener('astro:before-preparation', (event) => {
    const navStart = performance.now()
    loadingPage.set(LOADING_STATE.Loading)

    // Wrap loader to enforce minimum time BEFORE swap so old content stays visible
    const originalLoader = event.loader
    event.loader = async () => {
      const start = navStart
      await originalLoader()
      const elapsed = performance.now() - start
      const remaining = MIN_LOADING_TIME - elapsed

      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining))
      }
    }
  })

  document.addEventListener('astro:before-swap', (event) => {
    const newDoc = event.newDocument
    if (!newDoc) return

    // Mirror native sequence except we don't replace the whole body element.
    event.swap = () => {
      //Mark new scripts that should not execute
      swapFunctions.deselectScripts(newDoc)

      // We skip swapRootAttributes (it would drop the webp/avif support
      // classes), but the document language must follow the page locale.
      document.documentElement.lang = newDoc.documentElement.lang

      // essential for page-specific styles
      swapFunctions.swapHeadElements(newDoc)

      const restoreFocus = swapFunctions.saveFocus()

      const currentSwapContainer = document.querySelector(
        '[data-swap-container]'
      )
      const newSwapContainer = newDoc.querySelector('[data-swap-container]')
      // custom swap container to preserve css animations
      swapFunctions.swapBodyElement(newSwapContainer, currentSwapContainer)

      restoreFocus()
    }
  })

  document.addEventListener('astro:after-swap', () => {
    loadingPage.set(LOADING_STATE.Done)

    const content = document.querySelector('.tv-content')

    // Opening a signal file: move focus to the dossier title.
    const dossierTitle = document.querySelector('[data-dossier] h1')
    if (dossierTitle instanceof HTMLElement) {
      if (content) content.scrollTop = 0
      dossierTitle.focus()
      return
    }

    // Returning from a dossier: put focus back on the originating item.
    const slug = readReturnSlug()
    if (slug) {
      const item = document.querySelector(
        `[data-project-link][data-slug="${CSS.escape(slug)}"]`
      )
      if (item instanceof HTMLElement) {
        item.focus()
        return
      }
    }

    // Default: new page starts at the top of the screen.
    if (content) content.scrollTop = 0
  })

  // Remember which project item opened a dossier so focus can be restored.
  document.addEventListener('click', (event) => {
    const target = event.target
    const link =
      target instanceof Element && target.closest('[data-project-link]')
    if (link instanceof HTMLElement && link.dataset.slug) {
      saveReturnSlug(link.dataset.slug)
    }
  })
}
