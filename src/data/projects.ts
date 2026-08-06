import type { Locale } from '../config/site'

export type ProjectCategory =
  'open-source' | 'client-work' | 'experiment' | 'personal'

export type ProjectStatus =
  | 'online'
  | 'active'
  | 'completed'
  | 'prototype'
  | 'archived'
  | 'work-in-progress'

/** Which listing page the project appears on. */
export type ProjectCollection = 'open-source' | 'websites'

type LocalizedText = Record<Locale, string>
type LocalizedList = Record<Locale, string[]>

export type Project = {
  slug: string
  name: string
  collection: ProjectCollection
  category: ProjectCategory
  status?: ProjectStatus
  year?: string
  role?: LocalizedText

  /** Short one-liner used on listing pages and meta descriptions. */
  summary: LocalizedText
  overview?: LocalizedText
  problem?: LocalizedText
  roleDescription?: LocalizedText
  approach?: LocalizedText

  highlights?: LocalizedList
  stack?: string[]

  websiteUrl?: string
  repositoryUrl?: string
}

const role = {
  fullStack: {
    en: 'Full-Stack Developer',
    'pt-br': 'Desenvolvedor Full-Stack',
  },
} satisfies Record<string, LocalizedText>

/**
 * Ordered registry of every project. The index in this array defines the
 * "signal file" number shown across the site, so keep the order stable.
 *
 * Every claim here is limited to what is verifiable in the repositories,
 * live sites, or confirmed by the owner. TODO markers flag fields that
 * Isaac still needs to confirm before they can be published.
 */
export const allProjects: Project[] = [
  {
    slug: 'resumex',
    name: 'Resumex',
    collection: 'open-source',
    category: 'open-source',
    // TODO(owner): confirm current status (active / archived) and year.
    summary: {
      en: 'Automated pipeline that turns Reddit posts into short-form videos',
      'pt-br':
        'Pipeline automatizado que transforma posts do Reddit em vídeos curtos',
    },
    overview: {
      en: 'Resumex is an automation pipeline that takes Reddit posts and turns them into ready-to-render short-form videos, covering the whole path from content collection to final output.',
      'pt-br':
        'O Resumex é um pipeline de automação que pega posts do Reddit e os transforma em vídeos curtos prontos para renderizar, cobrindo o caminho inteiro da coleta de conteúdo até a saída final.',
    },
    highlights: {
      en: [
        'Scrapes Reddit content automatically',
        'Scores posts for short-form potential before rendering',
        'Generates the final video end-to-end',
      ],
      'pt-br': [
        'Coleta conteúdo do Reddit automaticamente',
        'Pontua posts pelo potencial de vídeo curto antes de renderizar',
        'Gera o vídeo final de ponta a ponta',
      ],
    },
    stack: ['Python'],
    repositoryUrl: 'https://github.com/Olwtelet/Resumex',
  },
  {
    slug: 'agentforge',
    name: 'AgentForge',
    collection: 'open-source',
    category: 'open-source',
    // TODO(owner): confirm current status and year.
    summary: {
      en: 'Hands-on platform to build, test, and benchmark multi-agent AI frameworks',
      'pt-br':
        'Plataforma prática para construir, testar e comparar frameworks de IA multiagente',
    },
    overview: {
      en: 'AgentForge is a workbench for experimenting with multi-agent AI frameworks: building agents, running them against RAG workflows, and comparing how different frameworks behave on the same task.',
      'pt-br':
        'O AgentForge é uma bancada para experimentar frameworks de IA multiagente: construir agentes, executá-los contra fluxos de RAG e comparar como diferentes frameworks se comportam na mesma tarefa.',
    },
    stack: ['Python', 'LLMs', 'RAG'],
    repositoryUrl: 'https://github.com/Olwtelet/AgentForge',
  },
  {
    slug: 'obsidian-second-brain',
    name: 'Obsidian Second Brain',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    summary: {
      en: 'Personal vault of CS fundamentals, cheatsheets, and daily study logs',
      'pt-br':
        'Cofre pessoal com fundamentos de CC, cheatsheets e registros diários de estudo',
    },
    overview: {
      en: 'A public Obsidian vault where I keep computer science fundamentals, data-structure cheatsheets, and daily logs from my independent coursework. It grows as I study.',
      'pt-br':
        'Um cofre público do Obsidian onde guardo fundamentos de ciência da computação, cheatsheets de estruturas de dados e registros diários dos meus estudos independentes. Ele cresce junto com os estudos.',
    },
    stack: ['Obsidian', 'Markdown'],
    repositoryUrl: 'https://github.com/Olwtelet/Obsidian-Second-Brain',
  },
  {
    slug: 'instituto-politecnico-do-brasil',
    name: 'Instituto Politécnico do Brasil',
    collection: 'websites',
    category: 'client-work',
    status: 'online',
    year: '2026',
    role: role.fullStack,
    summary: {
      en: 'Institutional website for a nonprofit in education, training, and civic outreach',
      'pt-br':
        'Site institucional para uma ONG de educação, capacitação e ação cívica',
    },
    overview: {
      en: 'The institutional website of a nonprofit that operates nationwide in education, training, sports, and civic outreach.',
      'pt-br':
        'O site institucional de uma organização sem fins lucrativos que atua em todo o país com educação, capacitação, esporte e ação cívica.',
    },
    approach: {
      en: 'Instead of building everything from zero, I adapted and customized a Tailwind CSS template to present the mission, projects, leadership, and contact channels, keeping the front-end simple for the institution to maintain.',
      'pt-br':
        'Em vez de construir tudo do zero, adaptei e personalizei um template de Tailwind CSS para apresentar a missão, os projetos, a liderança e os canais de contato, mantendo o front-end simples para a instituição manter.',
    },
    stack: ['Tailwind CSS'],
    websiteUrl: 'https://instituto-politecnico-do-brasil.vercel.app',
  },
  {
    slug: 'integratek',
    name: 'Integratek',
    collection: 'websites',
    category: 'client-work',
    status: 'active',
    year: '2026',
    role: role.fullStack,
    summary: {
      en: 'Business website and lead channel for an IT infrastructure company',
      'pt-br':
        'Site institucional e canal de leads para uma empresa de infraestrutura de TI',
    },
    overview: {
      en: 'The business website of an IT infrastructure company that works with networking, structured cabling, CCTV, and access control.',
      'pt-br':
        'O site institucional de uma empresa de infraestrutura de TI que trabalha com redes, cabeamento estruturado, CFTV e controle de acesso.',
    },
    roleDescription: {
      en: 'I designed and developed the site, and I continue to maintain it and ship new sections as the company needs them.',
      'pt-br':
        'Projetei e desenvolvi o site, e continuo mantendo a plataforma e publicando novas seções conforme a empresa precisa.',
    },
    highlights: {
      en: [
        'Blog for company updates and articles',
        'Quote request forms integrated with WhatsApp',
        'Containerized with Docker for reproducible deployment',
      ],
      'pt-br': [
        'Blog para novidades e artigos da empresa',
        'Formulários de orçamento integrados com o WhatsApp',
        'Containerizado com Docker para deploy reproduzível',
      ],
    },
    stack: ['Astro', 'TypeScript', 'Tailwind CSS', 'Docker'],
    websiteUrl: 'https://www.integratek.com.br/',
  },
  {
    slug: 'rocha-e-sa',
    name: 'Rocha & Sá',
    collection: 'websites',
    category: 'client-work',
    status: 'online',
    year: '2026',
    role: role.fullStack,
    summary: {
      en: 'Website for a full-service Brazilian law firm',
      'pt-br': 'Site para um escritório de advocacia brasileiro',
    },
    overview: {
      en: 'The website of a Brazilian law firm working in civil and corporate law, built to present the practice areas and support lead generation.',
      'pt-br':
        'O site de um escritório de advocacia brasileiro que atua em direito civil e empresarial, feito para apresentar as áreas de atuação e apoiar a geração de leads.',
    },
    approach: {
      en: 'Built as a static-first Astro site with attention to SEO fundamentals — semantic markup, per-page metadata, and fast loads on mobile connections.',
      'pt-br':
        'Construído como um site Astro estático, com atenção aos fundamentos de SEO — marcação semântica, metadados por página e carregamento rápido em conexões móveis.',
    },
    stack: ['Astro', 'TypeScript', 'Tailwind CSS'],
    websiteUrl: 'https://rochaesa.vercel.app/',
  },
  {
    slug: 'fhdog',
    name: 'Filmes HD Online Grátis',
    collection: 'websites',
    category: 'personal',
    status: 'active',
    year: '2026',
    role: {
      en: 'Design, development, and curation',
      'pt-br': 'Design, desenvolvimento e curadoria',
    },
    summary: {
      en: 'Film curation platform and community archive built on an SMPTE test-card design system',
      'pt-br':
        'Plataforma de curadoria de cinema e arquivo da comunidade, construída sobre a carta de ajuste SMPTE',
    },
    overview: {
      en: 'A film curation site: one session every Saturday, hand-picked, with the reason for each choice on record. The site is the public archive of those choices — the screening itself happens live in the community Discord. It is not streaming: no film is hosted or distributed.',
      'pt-br':
        'Um site de curadoria de cinema: uma sessão por sábado, escolhida a dedo, com o motivo da escolha registrado. O site é o arquivo público dessas escolhas — a exibição em si acontece ao vivo, na sala do Discord da comunidade. Não é streaming: nenhum filme é hospedado ou distribuído.',
    },
    approach: {
      en: 'The identity comes from the SMPTE color bars — the seven bars anchor the layout, the dark surfaces derive from the PLUGE grays, and each film’s curated tone maps to its nearest bar, tinting the whole page. Sessions are Markdown files validated by a zod schema at build time, so a malformed field breaks the build instead of shipping a broken page. Authorization is enforced server-side with Supabase RLS on every request.',
      'pt-br':
        'A identidade vem das barras de teste SMPTE — as sete barras ancoram o layout, as superfícies escuras derivam dos cinzas do PLUGE, e o tom curado de cada filme é mapeado para a barra de matiz mais próximo, tingindo a página inteira. As sessões são arquivos Markdown validados por um schema zod no build, então um campo malformado quebra o build em vez de virar uma página torta. A autorização é imposta no servidor com RLS do Supabase a cada requisição.',
    },
    highlights: {
      en: [
        'Sign-in only through Discord — the community server is the identity',
        'Public profiles, favorites, watched lists, community ranking, and a PNG dossier export',
        'Zero JavaScript by default: islands add ~7 KB on the home and no route ships more than 13 KB',
        'The 217 KB Supabase SDK loads only when a session cookie exists',
        'Focus rings, one h1 per page, native dialogs, and reduced-motion support across all routes',
      ],
      'pt-br': [
        'Entrada somente pelo Discord — a identidade é a do servidor da comunidade',
        'Perfis públicos, favoritos, assistidos, ranking da comunidade e exportação de dossiê em PNG',
        'Zero JavaScript por padrão: as ilhas somam ~7 KB na home e nenhuma rota passa de 13 KB',
        'O SDK do Supabase, de 217 KB, só carrega quando existe cookie de sessão',
        'Anel de foco, um h1 por página, diálogos nativos e reduced-motion em todas as rotas',
      ],
    },
    stack: ['Astro', 'TypeScript', 'Supabase', 'PostgreSQL', 'CSS'],
    websiteUrl: 'https://filmeshdonlinegratis.vercel.app',
  },
]

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug)
}

export function getProjectsByCollection(
  collection: ProjectCollection
): Project[] {
  return allProjects.filter((p) => p.collection === collection)
}

/** Two-digit archive number derived from the registry order ('01', '02', …). */
export function fileNumber(project: Project): string {
  const index = allProjects.findIndex((p) => p.slug === project.slug)
  return String(index + 1).padStart(2, '0')
}

export function nextProject(project: Project): Project {
  const index = allProjects.findIndex((p) => p.slug === project.slug)
  return allProjects[(index + 1) % allProjects.length]
}

/** Flattened, single-locale view of a project for rendering. */
export type LocalizedProject = {
  slug: string
  name: string
  collection: ProjectCollection
  category: ProjectCategory
  status?: ProjectStatus
  year?: string
  role?: string
  summary: string
  overview?: string
  problem?: string
  roleDescription?: string
  approach?: string
  highlights?: string[]
  stack?: string[]
  websiteUrl?: string
  repositoryUrl?: string
}

export function localizeProject(
  project: Project,
  locale: Locale
): LocalizedProject {
  return {
    slug: project.slug,
    name: project.name,
    collection: project.collection,
    category: project.category,
    status: project.status,
    year: project.year,
    role: project.role?.[locale],
    summary: project.summary[locale],
    overview: project.overview?.[locale],
    problem: project.problem?.[locale],
    roleDescription: project.roleDescription?.[locale],
    approach: project.approach?.[locale],
    highlights: project.highlights?.[locale],
    stack: project.stack,
    websiteUrl: project.websiteUrl,
    repositoryUrl: project.repositoryUrl,
  }
}
