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

/** How a project preview was made: a capture of the live site, media from the repository, or a drawn diagram. */
export type PreviewKind = 'screenshot' | 'repo' | 'diagram'

export type ProjectPreview = {
  kind: PreviewKind
  /** Basename under /assets/previews/ (both .webp and .jpg exist). Required unless kind is 'diagram'. */
  image?: string
  width?: number
  height?: number
  /** Shown in the window title bar, e.g. 'integratek.com.br' or 'github.com/Olwtelet/Resumex'. */
  source: string
  /** Where the preview window opens, in a new tab. */
  href: string
  alt: LocalizedText
}

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
  roleDescription?: LocalizedText

  highlights?: LocalizedList
  stack?: string[]

  websiteUrl?: string
  repositoryUrl?: string
  preview?: ProjectPreview
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
    slug: 'argus',
    name: 'Argus',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    role: {
      en: 'Creator and maintainer',
      'pt-br': 'Criador e mantenedor',
    },
    summary: {
      en: 'Self-hosted platform that puts dozens of public data feeds on one live map',
      'pt-br':
        'Plataforma self-hosted que reúne dezenas de fontes públicas em um mapa ao vivo',
    },
    overview: {
      en: 'Argus is an open-source intelligence and situational awareness platform that collects, normalizes, and plots dozens of public data sources on one interactive map, from aircraft, vessels, and satellites to earthquakes, fires, and internet outages. While most tools that unify this data are hosted services, it runs entirely on the operator’s own infrastructure, with no central service in the middle.',
      'pt-br':
        'O Argus é uma plataforma de inteligência de fontes abertas e consciência situacional que coleta, normaliza e plota dezenas de fontes públicas em um único mapa interativo, de aeronaves, embarcações e satélites a terremotos, queimadas e quedas de internet. Enquanto a maioria das ferramentas que unificam esses dados é serviço hospedado, ele roda inteiramente na infraestrutura do próprio operador, sem serviço central no meio.',
    },
    highlights: {
      en: [
        'SIGINT sources: KiwiSDR, PSK Reporter, SatNOGS, TinyGS, Meshtastic, and APRS',
        'OSINT aggregation of regional news through GDELT and public Telegram channels',
        'Infonet: peer-to-peer sync of events between nodes, with end-to-end encryption',
        'Ground change detection from SAR radar imagery',
      ],
      'pt-br': [
        'Fontes de SIGINT: KiwiSDR, PSK Reporter, SatNOGS, TinyGS, Meshtastic e APRS',
        'Agregação de OSINT com notícias regionais via GDELT e canais públicos do Telegram',
        'Infonet: sincronização peer-to-peer de eventos entre nós, com criptografia ponta a ponta',
        'Detecção de mudanças no solo a partir de imagens de radar SAR',
      ],
    },
    stack: [
      'Python',
      'FastAPI',
      'Next.js',
      'React',
      'MapLibre GL',
      'Tauri',
      'Rust',
      'Docker',
    ],
    repositoryUrl: 'https://github.com/Olwtelet/Argus',
    preview: {
      kind: 'diagram',
      source: 'github.com/Olwtelet/Argus',
      href: 'https://github.com/Olwtelet/Argus',
      alt: {
        en: 'Diagram of the Argus map layers: aircraft, vessels, satellites, earthquakes, fires, weather alerts and submarine cables',
        'pt-br':
          'Esquema das camadas do mapa do Argus: aeronaves, embarcações, satélites, terremotos, queimadas, alertas meteorológicos e cabos submarinos',
      },
    },
  },
  {
    slug: 'agentforge',
    name: 'AgentForge',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    summary: {
      en: 'The same agent built in ten frameworks, as a runnable comparison',
      'pt-br':
        'O mesmo agente feito em dez frameworks, numa comparação executável',
    },
    overview: {
      en: 'AgentForge shows what the same agent looks like in ten frameworks (AG2, Agno, AutoGen, CrewAI, Google ADK, LangGraph, LlamaIndex, the OpenAI Agents SDK, Pydantic AI, and smolagents), through around ninety runnable examples that each isolate one concept. Every implementation returns through a shared agent contract and calls the same tool implementations, so the benchmark does not favour whichever framework got the better-written tools.',
      'pt-br':
        'O AgentForge mostra como é o mesmo agente em dez frameworks (AG2, Agno, AutoGen, CrewAI, Google ADK, LangGraph, LlamaIndex, OpenAI Agents SDK, Pydantic AI e smolagents), em cerca de noventa exemplos executáveis, cada um isolando um conceito. Toda implementação retorna pelo mesmo contrato de agente e chama as mesmas implementações de ferramentas, e assim o benchmark não favorece o framework que ganhou as ferramentas mais bem escritas.',
    },
    highlights: {
      en: [
        'Capability matrix covering tools, streaming, memory, multi-agent, RAG, MCP, and evals',
        'Benchmark that pins model, prompts, and tools to measure latency, tokens, and failure rate',
        'Each example is a self-contained project with pinned dependencies',
        'CI runs linting, compilation, offline unit tests, and secret scanning on every change',
      ],
      'pt-br': [
        'Matriz de capacidades: ferramentas, streaming, memória, multiagente, RAG, MCP e evals',
        'Benchmark que fixa modelo, prompts e ferramentas e mede latência, tokens e taxa de falha',
        'Cada exemplo é um projeto independente, com dependências fixadas',
        'CI roda lint, compilação, testes unitários offline e varredura de segredos a cada mudança',
      ],
    },
    stack: ['Python', 'uv', 'pytest', 'LLMs', 'RAG', 'MCP', 'Streamlit'],
    repositoryUrl: 'https://github.com/Olwtelet/AgentForge',
    preview: {
      kind: 'diagram',
      source: 'github.com/Olwtelet/AgentForge',
      href: 'https://github.com/Olwtelet/AgentForge',
      alt: {
        en: 'Diagram of the AgentForge repository: the ten agent-framework folders and the three metrics compared (latency, token usage and failure rate)',
        'pt-br':
          'Esquema do repositório AgentForge: as pastas dos dez frameworks de agentes e as três métricas comparadas (latência, consumo de tokens e taxa de falha)',
      },
    },
  },
  {
    slug: 'resumex',
    name: 'Resumex',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    summary: {
      en: 'Turns a story file into a finished vertical video, entirely offline',
      'pt-br':
        'Converte um arquivo de história em um vídeo vertical pronto, totalmente offline',
    },
    overview: {
      en: 'Resumex takes a written story and returns a finished 1080×1920 MP4 with narration and synchronized captions whose timing is read directly from the speech synthesis output. The whole pipeline runs on the machine: no API keys, no cloud services, no network calls in the default path.',
      'pt-br':
        'O Resumex pega uma história escrita e devolve um MP4 pronto em 1080×1920, com narração e legendas sincronizadas, cronometradas direto da saída da síntese de voz. O pipeline inteiro roda na máquina: sem chaves de API, sem serviços em nuvem, sem chamadas de rede no caminho padrão.',
    },
    highlights: {
      en: [
        'Local text-to-speech with Kokoro, running on CPU (or a silent mode)',
        'Accepts .txt, .md and .json stories; custom footage or generated gradient backgrounds',
        'Optional local Ollama models to draft titles or score a story before rendering',
        'Optional private upload to YouTube through browser-based OAuth',
      ],
      'pt-br': [
        'Síntese de voz local com Kokoro, rodando na CPU (ou um modo silencioso)',
        'Aceita histórias em .txt, .md e .json; imagens próprias ou fundos em gradiente gerados',
        'Ollama local opcional para rascunhar títulos ou pontuar a história antes de renderizar',
        'Envio privado opcional para o YouTube via OAuth pelo navegador',
      ],
    },
    stack: ['Python', 'FFmpeg', 'Kokoro', 'SQLite', 'Ollama'],
    repositoryUrl: 'https://github.com/Olwtelet/Resumex',
    preview: {
      kind: 'repo',
      image: 'resumex',
      width: 1192,
      height: 696,
      source: 'github.com/Olwtelet/Resumex',
      href: 'https://github.com/Olwtelet/Resumex',
      alt: {
        en: 'Three real frames from a video made by resumex demo: a 9:16 gradient background with white captions and the spoken word highlighted in amber',
        'pt-br':
          'Três quadros reais de um vídeo feito pelo resumex demo: fundo em gradiente 9:16 com legendas brancas e a palavra falada destacada em âmbar',
      },
    },
  },
  {
    slug: 'obsidian-second-brain',
    name: 'Obsidian Second Brain',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    summary: {
      en: 'A public study vault of CS fundamentals, code snippets and daily logs, all cross-linked',
      'pt-br':
        'Cofre público de estudos: fundamentos de CC, trechos de código e registros diários, tudo interligado',
    },
    overview: {
      en: 'A public Obsidian vault where I keep what I am learning: computer science fundamentals, notes on JavaScript, TypeScript, React, Python and C, a "Grimorie" of solved snippets, saved clippings and daily logs from my independent coursework. I organize it with Zettelkasten and PARA so the notes link to each other, and it keeps growing instead of being finished.',
      'pt-br':
        'Um cofre público do Obsidian onde guardo o que estou aprendendo: fundamentos de ciência da computação, notas de JavaScript, TypeScript, React, Python e C, um "Grimorie" de trechos resolvidos, recortes salvos e registros diários dos meus estudos independentes. Organizo tudo com Zettelkasten e PARA, de modo que as notas se liguem umas às outras, e o cofre continua crescendo em vez de ser concluído.',
    },
    stack: ['Obsidian', 'Markdown', 'Git'],
    repositoryUrl: 'https://github.com/Olwtelet/Obsidian-Second-Brain',
    preview: {
      kind: 'diagram',
      source: 'github.com/Olwtelet/Obsidian-Second-Brain',
      href: 'https://github.com/Olwtelet/Obsidian-Second-Brain',
      alt: {
        en: 'Diagram of the Obsidian Second Brain vault: its main folders and linked notes',
        'pt-br':
          'Esquema do cofre Obsidian Second Brain: as pastas principais e as notas ligadas entre si',
      },
    },
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
      en: 'Institutional website for a nonprofit working in education, training, and civic outreach',
      'pt-br':
        'Site institucional de uma ONG que atua em educação, capacitação e ação cívica',
    },
    overview: {
      en: 'This is the institutional website of a nonprofit that works in education, professional training, sports, and civic outreach; it is where the institution explains who it is to the partners, applicants, and public bodies who look it up. Instead of building from scratch, I adapted a Tailwind CSS template, which kept the cost down and left a structure plain enough for the institution to maintain on its own.',
      'pt-br':
        'É o site institucional de uma organização sem fins lucrativos que atua com educação, capacitação profissional, esporte e ação cívica; é por ele que a instituição explica quem é aos parceiros, candidatos e órgãos públicos que a procuram. Em vez de começar do zero, adaptei um template de Tailwind CSS, o que reduziu o custo e deixou uma estrutura simples o bastante para a instituição manter sozinha.',
    },
    stack: ['Tailwind CSS', 'JavaScript'],
    websiteUrl: 'https://instituto-politecnico-do-brasil.vercel.app',
    preview: {
      kind: 'screenshot',
      image: 'instituto-politecnico-do-brasil',
      width: 1200,
      height: 750,
      source: 'instituto-politecnico-do-brasil.vercel.app',
      href: 'https://instituto-politecnico-do-brasil.vercel.app',
      alt: {
        en: 'Home page of the Instituto Politécnico do Brasil website, headed “Todo talento merece um ponto de partida”',
        'pt-br':
          'Página inicial do site do Instituto Politécnico do Brasil, com o título “Todo talento merece um ponto de partida”',
      },
    },
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
      en: 'Website for a law firm, built static-first with Astro',
      'pt-br':
        'Site de um escritório de advocacia, feito com Astro e renderização estática',
    },
    overview: {
      en: 'This is the website of a law firm, made to present its practice areas clearly and lead people who find it through search to get in touch. I built it static-first with Astro, so pages arrive as finished HTML instead of waiting on JavaScript.',
      'pt-br':
        'É o site de um escritório de advocacia, feito para apresentar as áreas de atuação com clareza e fazer com que quem o encontra pela busca entre em contato. Usei Astro com renderização estática, então as páginas chegam como HTML pronto, sem esperar por JavaScript.',
    },
    stack: ['Astro', 'TypeScript', 'Tailwind CSS'],
    websiteUrl: 'https://rochaesa.vercel.app/',
    preview: {
      kind: 'screenshot',
      image: 'rocha-e-sa',
      width: 1200,
      height: 750,
      source: 'rochaesa.vercel.app',
      href: 'https://rochaesa.vercel.app/',
      alt: {
        en: 'Home page of the Rocha & Sá law firm website, in Brasília',
        'pt-br':
          'Página inicial do site do escritório Rocha & Sá Advogados, em Brasília',
      },
    },
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
      en: 'Website and lead channel for an IT infrastructure company, still evolving',
      'pt-br':
        'Site e canal de leads de uma empresa de infraestrutura de TI, ainda em evolução',
    },
    overview: {
      en: 'The business website of an IT infrastructure company working with networking, structured cabling, CCTV and access control for corporate, residential and gaming-focused clients. It had to explain that technical catalogue to non-technical buyers and get them into a conversation as quickly as possible.',
      'pt-br':
        'O site institucional de uma empresa de infraestrutura de TI que trabalha com redes, cabeamento estruturado, CFTV e controle de acesso para clientes corporativos, residenciais e voltados a gaming. Ele precisava explicar esse catálogo técnico para quem não é da área e levar a pessoa a uma conversa o quanto antes.',
    },
    roleDescription: {
      en: 'I designed and developed the site end to end and still maintain it, adding new sections as the company needs them.',
      'pt-br':
        'Projetei e desenvolvi o site de ponta a ponta e continuo fazendo a manutenção, com novas seções publicadas conforme a empresa precisa.',
    },
    highlights: {
      en: [
        'Quote request forms that hand off directly to WhatsApp',
        'Blog for company updates and technical articles',
        'Containerized with Docker for reproducible deployment',
      ],
      'pt-br': [
        'Formulários de orçamento que passam direto para o WhatsApp',
        'Blog para novidades e artigos técnicos da empresa',
        'Containerizado com Docker para deploy reproduzível',
      ],
    },
    stack: ['Astro', 'TypeScript', 'Tailwind CSS', 'Docker'],
    websiteUrl: 'https://www.integratek.com.br/',
    preview: {
      kind: 'screenshot',
      image: 'integratek',
      width: 1200,
      height: 750,
      source: 'integratek.com.br',
      href: 'https://www.integratek.com.br/',
      alt: {
        en: 'Home page of the Integratek website, headed “Tecnologia que sustenta a sua operação”',
        'pt-br':
          'Página inicial do site da Integratek, com o título “Tecnologia que sustenta a sua operação”',
      },
    },
  },
  {
    slug: 'thalit-academy',
    name: 'CT Thalita Rodrigues',
    collection: 'websites',
    category: 'client-work',
    status: 'online',
    year: '2026',
    role: {
      en: 'Full-Stack Developer & UI/UX Designer',
      'pt-br': 'Desenvolvedor Full-Stack & UI/UX Designer',
    },
    summary: {
      en: 'Website for a tennis and beach tennis training centre in Brasília',
      'pt-br':
        'Site de um centro de treinamento de tênis e beach tennis em Brasília',
    },
    overview: {
      en: 'The website of Centro de Treinamento Thalita Rodrigues, a tennis and beach tennis training centre for children, teenagers and adults at Clube da Portuguesa in Brasília. I built it to lead visitors to book a trial lesson while still serving students who are already enrolled.',
      'pt-br':
        'O site do Centro de Treinamento Thalita Rodrigues, um centro de treinamento de tênis e beach tennis para crianças, jovens e adultos no Clube da Portuguesa, em Brasília. Fiz o site para levar o visitante a agendar uma aula experimental, sem deixar de atender os alunos já matriculados.',
    },
    highlights: {
      en: [
        'Online trial-lesson booking, with WhatsApp as the direct contact route',
        'Sections for tennis and beach tennis classes, methodology and athlete profiles',
        'Registration and results for the internal tournament (Circuito Interno CT)',
        'Technique guides, training videos and articles for enrolled students',
      ],
      'pt-br': [
        'Agendamento de aula experimental online, com o WhatsApp como via de contato direto',
        'Seções de aulas de tênis e beach tennis, metodologia e perfis de atletas',
        'Inscrição e resultados do torneio interno (Circuito Interno CT)',
        'Guias de técnica, vídeos de treino e artigos para os alunos matriculados',
      ],
    },
    stack: ['Next.js', 'React', 'TypeScript'],
    websiteUrl: 'https://thalitarodrigues.com/',
    preview: {
      kind: 'screenshot',
      image: 'thalit-academy',
      width: 1200,
      height: 750,
      source: 'thalitarodrigues.com',
      href: 'https://thalitarodrigues.com/',
      alt: {
        en: 'Home page of the Centro de Treinamento Thalita Rodrigues website, with its classes, training, tournaments and schedule menu',
        'pt-br':
          'Página inicial do site do Centro de Treinamento Thalita Rodrigues, com o menu de aulas, treinamento, torneios e agenda',
      },
    },
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
  roleDescription?: string
  highlights?: string[]
  stack?: string[]
  websiteUrl?: string
  repositoryUrl?: string
  preview?: Omit<ProjectPreview, 'alt'> & { alt: string }
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
    roleDescription: project.roleDescription?.[locale],
    highlights: project.highlights?.[locale],
    stack: project.stack,
    websiteUrl: project.websiteUrl,
    repositoryUrl: project.repositoryUrl,
    preview: project.preview && {
      ...project.preview,
      alt: project.preview.alt[locale],
    },
  }
}
