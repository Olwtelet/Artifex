// @ts-check
import { defineConfig, envField } from 'astro/config'

import sitemap from '@astrojs/sitemap'

import svelte from '@astrojs/svelte'

import { allProjects } from './src/data/projects.ts'

// Portuguese moved to the root and English moved under /en/. Keep the
// previous URLs working for links that were already shared. Static builds
// cannot redirect dynamic routes, so project pages are listed one by one.
/** @type {Record<string, string>} */
const legacyRedirects = {
  '/pt-br': '/',
  '/pt-br/codigo-aberto': '/codigo-aberto/',
  '/pt-br/sites': '/sites/',
  '/pt-br/playlists': '/playlists/',
  '/pt-br/curriculo': '/curriculo/',
  '/pt-br/projetos': '/projetos/',
  '/open-source': '/en/open-source/',
  '/websites': '/en/websites/',
  '/resume': '/en/resume/',
  '/projects': '/en/projects/',
}
for (const { slug } of allProjects) {
  legacyRedirects['/pt-br/projetos/' + slug] = '/projetos/' + slug + '/'
  legacyRedirects['/projects/' + slug] = '/en/projects/' + slug + '/'
}

// https://astro.build/config
export default defineConfig({
  site: 'https://olwtelet.vercel.app',

  i18n: {
    defaultLocale: 'pt-br',
    locales: ['pt-br', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  redirects: legacyRedirects,

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    svelte(),
  ],

  env: {
    schema: {
      NODE_ENV: envField.string({
        default: 'development',
        access: 'public',
        context: 'server',
      }),
    },
  },
})
