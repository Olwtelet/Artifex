import type { Locale } from '../config/site'
import { DEFAULT_LOCALE } from '../config/site'

export type LocalizedPath = Record<Locale, string>

/**
 * Single source of truth for every localized route on the site.
 * English is unprefixed; Portuguese lives under /pt-br/ with translated segments.
 */
export const routes = {
  home: { en: '/', 'pt-br': '/pt-br/' },
  openSource: { en: '/open-source/', 'pt-br': '/pt-br/codigo-aberto/' },
  websites: { en: '/websites/', 'pt-br': '/pt-br/sites/' },
  playlists: { en: '/playlists/', 'pt-br': '/pt-br/playlists/' },
  resume: { en: '/resume/', 'pt-br': '/pt-br/curriculo/' },
  projects: { en: '/projects/', 'pt-br': '/pt-br/projetos/' },
} satisfies Record<string, LocalizedPath>

export function projectRoute(slug: string): LocalizedPath {
  return {
    en: `/projects/${slug}/`,
    'pt-br': `/pt-br/projetos/${slug}/`,
  }
}

/** Normalize a pathname to always have a trailing slash ('/x' -> '/x/'). */
export function normalizePath(pathname: string): string {
  if (!pathname.startsWith('/')) pathname = '/' + pathname
  if (!pathname.endsWith('/')) pathname += '/'
  return pathname
}

export function localeFromPath(pathname: string): Locale {
  const path = normalizePath(pathname)
  return path === '/pt-br/' || path.startsWith('/pt-br/') ? 'pt-br' : 'en'
}

const PROJECT_PATTERNS: Record<Locale, RegExp> = {
  en: /^\/projects\/([^/]+)\/$/,
  'pt-br': /^\/pt-br\/projetos\/([^/]+)\/$/,
}

/**
 * Given any known pathname, return the equivalent pathname in `target` locale,
 * or null when there is no counterpart (e.g. unknown routes).
 */
export function alternatePathFor(
  pathname: string,
  target: Locale
): string | null {
  const path = normalizePath(pathname)
  const current = localeFromPath(path)
  if (current === target) return path

  for (const localized of Object.values(routes)) {
    if (localized[current] === path) return localized[target]
  }

  const projectMatch = path.match(PROJECT_PATTERNS[current])
  if (projectMatch) return projectRoute(projectMatch[1])[target]

  return null
}

/** Map of locale -> equivalent absolute-path for the given page (only existing pairs). */
export function alternatesForPath(pathname: string): Partial<LocalizedPath> {
  const result: Partial<LocalizedPath> = {}
  for (const locale of ['en', 'pt-br'] as Locale[]) {
    const alt = alternatePathFor(pathname, locale)
    if (alt) result[locale] = alt
  }
  return result
}

export function homeFor(locale: Locale): string {
  return routes.home[locale] ?? routes.home[DEFAULT_LOCALE]
}
