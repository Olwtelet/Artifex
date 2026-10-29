import type { Locale } from '../config/site'

/**
 * Every UI string on the site, per locale. Proper nouns and technology
 * names are intentionally kept identical across locales.
 */
const translations = {
  en: {
    skipToContent: 'Skip to content',
    nav: {
      openSource: 'open-source',
      websites: 'websites',
    },
    footer: {
      resume: 'RESUME',
      email: 'EMAIL',
      linkedin: 'LINKEDIN',
    },
    lang: {
      label: 'Language',
      switchTo: 'Mudar para português',
    },
    header: {
      textNavLabel: 'navigation by text',
    },
    channel: {
      previous: 'previous channel',
      next: 'next channel',
      label: 'CHANNEL',
    },
    listing: {
      openFile: 'OPEN FILE',
      externalLink: 'EXTERNAL',
      file: 'FILE',
      files: 'FILES',
      channelIndex: 'CHANNEL INDEX',
    },
    dossier: {
      signalFile: 'SIGNAL FILE',
      project: 'PROJECT',
      status: 'STATUS',
      year: 'YEAR',
      role: 'ROLE',
      category: 'CATEGORY',
      overview: 'OVERVIEW',
      problem: 'THE PROBLEM',
      myRole: 'MY ROLE',
      approach: 'APPROACH',
      features: 'FEATURES',
      stack: 'STACK',
      links: 'LINKS',
      openWebsite: 'OPEN WEBSITE',
      viewSource: 'VIEW SOURCE',
      return: 'RETURN',
      nextFile: 'NEXT FILE',
      escHint: 'ESC RETURNS TO INDEX',
    },
    status: {
      online: 'ONLINE',
      active: 'ACTIVE',
      completed: 'COMPLETED',
      prototype: 'PROTOTYPE',
      archived: 'ARCHIVED',
      'work-in-progress': 'WORK IN PROGRESS',
    },
    category: {
      'open-source': 'OPEN SOURCE',
      'client-work': 'CLIENT WORK',
      experiment: 'EXPERIMENT',
      personal: 'PERSONAL PROJECT',
    },
    notFound: {
      noSignal: 'NO SIGNAL',
      error: 'ERROR 404',
      channelNotFound: 'CHANNEL NOT FOUND',
      returnHome: 'RETURN TO CHANNEL 00',
    },
    bio: {
      photoToggle: 'Identify signal: show a photo of Isaac Rodrigues',
    },
  },
  'pt-br': {
    skipToContent: 'Pular para o conteúdo',
    nav: {
      openSource: 'código-aberto',
      websites: 'sites',
    },
    footer: {
      resume: 'CURRÍCULO',
      email: 'E-MAIL',
      linkedin: 'LINKEDIN',
    },
    lang: {
      label: 'Idioma',
      switchTo: 'Switch to English',
    },
    header: {
      textNavLabel: 'navegação por texto',
    },
    channel: {
      previous: 'canal anterior',
      next: 'próximo canal',
      label: 'CANAL',
    },
    listing: {
      openFile: 'ABRIR ARQUIVO',
      externalLink: 'EXTERNO',
      file: 'ARQUIVO',
      files: 'ARQUIVOS',
      channelIndex: 'ÍNDICE DE CANAIS',
    },
    dossier: {
      signalFile: 'ARQUIVO DE SINAL',
      project: 'PROJETO',
      status: 'STATUS',
      year: 'ANO',
      role: 'FUNÇÃO',
      category: 'CATEGORIA',
      overview: 'VISÃO GERAL',
      problem: 'O PROBLEMA',
      myRole: 'MINHA FUNÇÃO',
      approach: 'ABORDAGEM',
      features: 'FUNCIONALIDADES',
      stack: 'STACK',
      links: 'LINKS',
      openWebsite: 'ABRIR SITE',
      viewSource: 'VER CÓDIGO',
      return: 'VOLTAR',
      nextFile: 'PRÓXIMO ARQUIVO',
      escHint: 'ESC VOLTA AO ÍNDICE',
    },
    status: {
      online: 'NO AR',
      active: 'ATIVO',
      completed: 'CONCLUÍDO',
      prototype: 'PROTÓTIPO',
      archived: 'ARQUIVADO',
      'work-in-progress': 'EM CONSTRUÇÃO',
    },
    category: {
      'open-source': 'CÓDIGO ABERTO',
      'client-work': 'TRABALHO PARA CLIENTE',
      experiment: 'EXPERIMENTO',
      personal: 'PROJETO PESSOAL',
    },
    notFound: {
      noSignal: 'SEM SINAL',
      error: 'ERRO 404',
      channelNotFound: 'CANAL NÃO ENCONTRADO',
      returnHome: 'VOLTAR AO CANAL 00',
    },
    bio: {
      photoToggle: 'Identificar sinal: mostrar uma foto de Isaac Rodrigues',
    },
  },
} as const

export type Translations = (typeof translations)[Locale]

export function useTranslations(locale: Locale): Translations {
  return translations[locale]
}
