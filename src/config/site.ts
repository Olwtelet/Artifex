export type Locale = 'en' | 'pt-br'

export const LOCALES: Locale[] = ['en', 'pt-br']
export const DEFAULT_LOCALE: Locale = 'en'

/** BCP 47 language codes used for hreflang / og:locale */
export const LOCALE_CODES: Record<Locale, string> = {
  en: 'en',
  'pt-br': 'pt-BR',
}

export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  'pt-br': 'pt_BR',
}

export const SITE = {
  name: 'olwtelet',
  displayName: 'Olwtelet',
  author: 'Isaac Rodrigues',
  url: 'https://olwtelet.vercel.app',
  email: 'olwtelet@outlook.com',
  jobTitle: {
    en: 'Full-Stack Developer',
    'pt-br': 'Desenvolvedor Full-Stack',
  } satisfies Record<Locale, string>,
  tagline: {
    en: 'Full-Stack Developer focused on applied AI',
    'pt-br': 'Desenvolvedor Full-Stack com foco em IA aplicada',
  } satisfies Record<Locale, string>,
  location: {
    city: 'Brasília',
    region: 'DF',
    country: 'BR',
  },
  social: {
    github: 'https://github.com/olwtelet',
    linkedin: 'https://www.linkedin.com/in/isaac-r-a8a777368/',
    bluesky: 'https://bsky.app/profile/Olwtelet.dev',
    instagram: 'https://instagram.com/olwtelets',
  },
  /** Areas actually demonstrated by repository projects — used by Person.knowsAbout */
  knowsAbout: [
    'TypeScript',
    'JavaScript',
    'Python',
    'React',
    'Astro',
    'Svelte',
    'Node.js',
    'Web development',
    'Automation',
    'Applied AI',
    'Retrieval-augmented generation',
    'Multi-agent systems',
  ],
  ogImage: {
    en: '/assets/og/home-en.png',
    'pt-br': '/assets/og/home-pt-br.png',
  } satisfies Record<Locale, string>,
} as const
