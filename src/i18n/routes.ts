import type { Locale } from '../config/site'
import { DEFAULT_LOCALE, LOCALES } from '../config/site'

export type LocalizedPath = Record<Locale, string>

/**
 * Single source of truth for every localized route on the site.
 * Portuguese is the default locale and lives unprefixed; English lives under
 * /en/ with translated segments.
 */
export const routes = {
  home: { 'pt-br': '/', en: '/en/' },
  openSource: { 'pt-br': '/codigo-aberto/', en: '/en/open-source/' },
  websites: { 'pt-br': '/sites/', en: '/en/websites/' },
  certificates: { 'pt-br': '/certificados/', en: '/en/certificates/' },
  resume: { 'pt-br': '/curriculo/', en: '/en/resume/' },
  projects: { 'pt-br': '/projetos/', en: '/en/projects/' },
} satisfies Record<string, LocalizedPath>

export function projectRoute(slug: string): LocalizedPath {
  return {
    'pt-br': '/projetos/' + slug + '/',
    en: '/en/projects/' + slug + '/',
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
  return path.startsWith('/en/') ? 'en' : 'pt-br'
}

const PROJECT_PATTERNS: Record<Locale, RegExp> = {
  'pt-br': /^\/projetos\/([^/]+)\/$/,
  en: /^\/en\/projects\/([^/]+)\/$/,
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
  for (const locale of LOCALES) {
    const alt = alternatePathFor(pathname, locale)
    if (alt) result[locale] = alt
  }
  return result
}

export function homeFor(locale: Locale): string {
  return routes.home[locale] ?? routes.home[DEFAULT_LOCALE]
}
