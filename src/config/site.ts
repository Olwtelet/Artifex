export type Locale = 'pt-br' | 'en'

export const LOCALES: Locale[] = ['pt-br', 'en']
/** Portuguese is served unprefixed at the root; English lives under /en/. */
export const DEFAULT_LOCALE: Locale = 'pt-br'

/** BCP 47 language codes used for hreflang / og:locale */
export const LOCALE_CODES: Record<Locale, string> = {
  'pt-br': 'pt-BR',
  en: 'en',
}

export const OG_LOCALES: Record<Locale, string> = {
  'pt-br': 'pt_BR',
  en: 'en_US',
}

export const SITE = {
  name: 'olwtelet',
  displayName: 'Olwtelet',
  author: 'Isaac Rodrigues',
  /** Legal name as printed on certificates — another name for the same person. */
  fullName: 'Isaac Rodrigues Barros',
  url: 'https://olwtelet.vercel.app',
  email: 'olwtelet@outlook.com',
  jobTitle: {
    'pt-br': 'Desenvolvedor Full-Stack',
    en: 'Full-Stack Developer',
  } satisfies Record<Locale, string>,
  /** Home h1 — says outright that Olwtelet is Isaac Rodrigues. */
  headline: {
    'pt-br': 'Olwtelet é Isaac Rodrigues',
    en: 'Olwtelet is Isaac Rodrigues',
  } satisfies Record<Locale, string>,
  location: {
    city: 'Brasília',
    region: 'DF',
    country: 'BR',
  },
  social: {
    github: 'https://github.com/olwtelet',
    linkedin: 'https://www.linkedin.com/in/olwtelet/',
    bluesky: 'https://bsky.app/profile/Olwtelet.dev',
    instagram: 'https://instagram.com/olwtelets',
    orcid: 'https://orcid.org/0009-0008-2485-7398',
  },
  /** Areas demonstrated by projects, client work, and verifiable certificates — used by Person.knowsAbout */
  knowsAbout: [
    'TypeScript',
    'JavaScript',
    'Python',
    'SQL',
    'React',
    'Next.js',
    'Astro',
    'Svelte',
    'Node.js',
    'FastAPI',
    'Docker',
    'Linux',
    'Web development',
    'Automation',
    'Applied AI',
    'Retrieval-augmented generation',
    'Multi-agent systems',
    'Cybersecurity',
    'Application security',
  ],
  ogImage: {
    'pt-br': '/assets/og/home-pt-br.png',
    en: '/assets/og/home-en.png',
  } satisfies Record<Locale, string>,
} as const
