// Text-navigation index. Keep aliases lowercase; grouped per locale so the
// contenteditable navigation resolves against the language being browsed.

const SHARED_EXTERNAL = [
  {
    aliases: ['github', 'repositories'],
    url: 'https://github.com/olwtelet',
    external: true,
  },
  {
    aliases: ['twitter', 'bluesky'],
    url: 'https://bsky.app/profile/Olwtelet.dev',
    external: true,
  },
  {
    aliases: ['instagram', 'photos'],
    url: 'https://instagram.com/olwtelets',
    external: true,
  },
]

export const PAGES = {
  'pt-br': [
    {
      aliases: ['codigo-aberto', 'código-aberto', 'oss', 'opensource'],
      url: '/codigo-aberto/',
    },
    {
      aliases: ['sites', 'websites'],
      url: '/sites/',
    },
    {
      aliases: ['certificados', 'certificacoes', 'certificações', 'certs'],
      url: '/certificados/',
    },
    {
      aliases: ['projetos', 'arquivo'],
      url: '/projetos/',
    },
    {
      aliases: ['curriculo', 'currículo', 'cv'],
      url: '/curriculo/',
      external: true,
    },
    {
      aliases: ['home', 'inicio', 'início'],
      url: '/',
    },
    ...SHARED_EXTERNAL,
  ],
  en: [
    {
      aliases: ['open-source', 'oss', 'opensource'],
      url: '/en/open-source/',
    },
    {
      aliases: ['websites', 'sites'],
      url: '/en/websites/',
    },
    {
      aliases: ['certificates', 'certifications', 'certs'],
      url: '/en/certificates/',
    },
    {
      aliases: ['projects', 'archive'],
      url: '/en/projects/',
    },
    {
      aliases: ['resume', 'cv'],
      url: '/en/resume/',
      external: true,
    },
    {
      aliases: ['home', 'index'],
      url: '/en/',
    },
    ...SHARED_EXTERNAL,
  ],
}

export function pagesForCurrentLocale() {
  const lang = document.documentElement.lang || 'pt-BR'
  return lang.toLowerCase().startsWith('en') ? PAGES.en : PAGES['pt-br']
}
