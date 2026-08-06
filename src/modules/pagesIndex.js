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
  en: [
    {
      aliases: ['open-source', 'oss', 'opensource'],
      url: '/open-source/',
    },
    {
      aliases: ['websites', 'sites'],
      url: '/websites/',
    },
    {
      aliases: ['playlists', 'music'],
      url: '/playlists/',
    },
    {
      aliases: ['projects', 'archive'],
      url: '/projects/',
    },
    {
      aliases: ['resume', 'cv'],
      url: '/resume/',
      external: true,
    },
    {
      aliases: ['home', 'index'],
      url: '/',
    },
    ...SHARED_EXTERNAL,
  ],
  'pt-br': [
    {
      aliases: ['codigo-aberto', 'código-aberto', 'oss', 'opensource'],
      url: '/pt-br/codigo-aberto/',
    },
    {
      aliases: ['sites', 'websites'],
      url: '/pt-br/sites/',
    },
    {
      aliases: ['playlists', 'musica', 'música'],
      url: '/pt-br/playlists/',
    },
    {
      aliases: ['projetos', 'arquivo'],
      url: '/pt-br/projetos/',
    },
    {
      aliases: ['curriculo', 'currículo', 'cv'],
      url: '/pt-br/curriculo/',
      external: true,
    },
    {
      aliases: ['home', 'inicio', 'início'],
      url: '/pt-br/',
    },
    ...SHARED_EXTERNAL,
  ],
}

export function pagesForCurrentLocale() {
  const lang = document.documentElement.lang || 'en'
  return lang.toLowerCase().startsWith('pt') ? PAGES['pt-br'] : PAGES.en
}
