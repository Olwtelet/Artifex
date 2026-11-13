import type { Locale } from '../config/site'
import { SITE, LOCALE_CODES } from '../config/site'
import type { LocalizedProject } from '../data/projects'
import { projectRoute } from '../i18n/routes'

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href
}

/**
 * Serialize JSON-LD so it is safe to inline in a <script> tag
 * (escapes `<` to prevent breaking out of the script context).
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function personSchema(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.author,
    // "Olwtelet" is the pseudonym he works under — the same person
    alternateName: [SITE.displayName, SITE.fullName],
    url: SITE.url,
    jobTitle: SITE.jobTitle[locale],
    email: `mailto:${SITE.email}`,
    sameAs: Object.values(SITE.social),
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    knowsAbout: [...SITE.knowsAbout],
  }
}

export function websiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.displayName,
    alternateName: SITE.author,
    url: SITE.url,
    inLanguage: LOCALE_CODES[locale],
    author: { '@id': `${SITE.url}/#person` },
  }
}

export function profilePageSchema(locale: Locale, canonicalUrl: string) {
  return {
    '@type': 'ProfilePage',
    url: canonicalUrl,
    inLanguage: LOCALE_CODES[locale],
    mainEntity: personSchema(locale),
  }
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** SoftwareSourceCode for open-source repos, WebSite for shipped sites. */
export function projectSchema(project: LocalizedProject, locale: Locale) {
  const url = absoluteUrl(projectRoute(project.slug)[locale])

  if (project.repositoryUrl) {
    return {
      '@type': 'SoftwareSourceCode',
      name: project.name,
      description: project.summary,
      url,
      codeRepository: project.repositoryUrl,
      author: { '@id': `${SITE.url}/#person` },
      ...(project.stack?.length
        ? { programmingLanguage: project.stack[0] }
        : {}),
    }
  }

  return {
    '@type': 'CreativeWork',
    name: project.name,
    description: project.summary,
    url,
    ...(project.websiteUrl ? { mainEntityOfPage: project.websiteUrl } : {}),
    author: { '@id': `${SITE.url}/#person` },
    ...(project.year ? { dateCreated: project.year } : {}),
  }
}

/** Wrap schema nodes in a single @graph document. */
export function jsonLdDocument(nodes: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}
