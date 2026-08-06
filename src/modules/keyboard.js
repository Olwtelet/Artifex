import { get } from 'svelte/store'

import {
  currentChannel,
  toggleSpace,
  incrementChannel,
  decrementChannel,
  toggleContent,
  gotoChannel,
  toggleFullscreen,
} from './tv.js'
import { gotoPage } from './navigation.js'

function isValidHotkey(e) {
  const activeEl = document.activeElement

  if (activeEl == null || activeEl === document.body) return true

  // never steal keys from editable or form elements
  if (activeEl.isContentEditable) return false
  const tag = activeEl.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return false

  // Enter/Space must keep activating focused buttons and links
  if (
    (tag === 'BUTTON' || tag === 'A') &&
    (e.key === 'Enter' || e.key === ' ')
  ) {
    return false
  }

  // any other focused element (e.g. a dossier title) still allows hotkeys
  return true
}

function handleEscape() {
  const activeEl = document.activeElement

  // let the text navigation cancel its edit instead of leaving the page
  if (activeEl instanceof HTMLElement && activeEl.isContentEditable) {
    activeEl.blur()
    return
  }

  // ESC closes an open signal-file dossier, returning to its index
  const dossier = document.querySelector('[data-dossier][data-return-url]')
  if (dossier) {
    gotoPage(dossier.dataset.returnUrl)
  }
}

function handleHotkey(e) {
  if (e.key === 'Escape') return handleEscape()
  if (!isValidHotkey(e)) return
  if (e.key === 'r') return toggleSpace()
  if (e.key === '+' || e.key === '=') return incrementChannel()
  if (e.key === '-') return decrementChannel()
  if (e.key === 'h') return toggleContent()
  if (e.key === 'f') return toggleFullscreen()

  const channelNumber = Number(e.key)

  // ignore non-number keys
  if (Number.isNaN(channelNumber)) {
    return
  }

  // toggle between a X channel and channel 0
  if (channelNumber === get(currentChannel)) {
    gotoChannel(0)
  } else {
    gotoChannel(channelNumber)
  }
}

export function initHotkeys() {
  window.addEventListener('keyup', handleHotkey)
}
