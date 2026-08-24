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
      en: 'Self-hosted situational awareness platform that folds dozens of public feeds into one live map',
      'pt-br':
        'Plataforma de consciência situacional self-hosted que reúne dezenas de fontes públicas em um mapa ao vivo',
    },
    overview: {
      en: 'Argus is an open-source intelligence and situational awareness platform. It collects, normalizes, and plots dozens of public data sources onto a single interactive map — aircraft, vessels, satellites, earthquakes, fires, air quality, weather alerts, power plants, submarine cables and internet outages among them — and it runs entirely on the operator’s own infrastructure, with no central service in the middle.',
      'pt-br':
        'O Argus é uma plataforma de inteligência de fontes abertas e consciência situacional. Ele coleta, normaliza e plota dezenas de fontes públicas em um único mapa interativo — aeronaves, embarcações, satélites, terremotos, queimadas, qualidade do ar, alertas meteorológicos, usinas, cabos submarinos e quedas de internet, entre outros — e roda inteiramente na infraestrutura do próprio operador, sem serviço central no meio.',
    },
    problem: {
      en: 'The data is public, but it is scattered across dozens of APIs that speak different formats, and most tools that unify it are hosted services: you send them your queries, and you stop being able to run the thing on your own terms.',
      'pt-br':
        'Os dados são públicos, mas estão espalhados por dezenas de APIs que falam formatos diferentes, e a maioria das ferramentas que os unifica é serviço hospedado: você manda as suas consultas para eles e deixa de conseguir rodar a coisa nos seus próprios termos.',
    },
    approach: {
      en: 'The system is split into four parts — a FastAPI backend that collects and normalizes the feeds, a Next.js dashboard drawing the map with MapLibre GL, a Tauri desktop shell, and the mesh services. Everything is configured through environment variables and no API key is required to start, so a first run works before the operator has signed up for anything. It ships as Docker images and is licensed AGPL-3.0, which keeps network-hosted forks open too.',
      'pt-br':
        'O sistema é dividido em quatro partes — um backend FastAPI que coleta e normaliza as fontes, um painel Next.js que desenha o mapa com MapLibre GL, uma casca desktop em Tauri e os serviços de mesh. Tudo é configurado por variáveis de ambiente e nenhuma chave de API é obrigatória para começar, então a primeira execução funciona antes de o operador se cadastrar em qualquer lugar. É distribuído como imagens Docker e licenciado sob AGPL-3.0, o que mantém abertos também os forks hospedados em rede.',
    },
    highlights: {
      en: [
        'Independent map layers for aircraft, vessels, satellites, orbital imagery, and infrastructure',
        'SIGINT sources: KiwiSDR, PSK Reporter, SatNOGS, TinyGS, Meshtastic, and APRS',
        'OSINT aggregation of regional news through GDELT and public Telegram channels',
        'Infonet — a peer-to-peer layer that syncs events between nodes with end-to-end encryption',
        'Ground change detection from SAR radar imagery',
        'Official Docker images and signature-verified desktop updates',
      ],
      'pt-br': [
        'Camadas independentes de mapa para aeronaves, embarcações, satélites, imagens orbitais e infraestrutura',
        'Fontes de SIGINT: KiwiSDR, PSK Reporter, SatNOGS, TinyGS, Meshtastic e APRS',
        'Agregação de OSINT com notícias regionais via GDELT e canais públicos do Telegram',
        'Infonet — uma camada peer-to-peer que sincroniza eventos entre nós com criptografia ponta a ponta',
        'Detecção de mudanças no solo a partir de imagens de radar SAR',
        'Imagens Docker oficiais e atualizações desktop verificadas por assinatura',
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
  },
  {
    slug: 'agentforge',
    name: 'AgentForge',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    summary: {
      en: 'The same agent, built ten different ways — a runnable comparison of agent frameworks',
      'pt-br':
        'O mesmo agente, construído de dez formas diferentes — uma comparação executável de frameworks de agentes',
    },
    overview: {
      en: 'AgentForge answers a question that framework documentation cannot: what does the same agent actually look like in each of them? It holds around ninety runnable examples across ten frameworks — AG2, Agno, AutoGen, CrewAI, Google ADK, LangGraph, LlamaIndex, the OpenAI Agents SDK, Pydantic AI, and smolagents — each example isolating one concept.',
      'pt-br':
        'O AgentForge responde a uma pergunta que a documentação dos frameworks não responde: como é, de fato, o mesmo agente em cada um deles? São cerca de noventa exemplos executáveis em dez frameworks — AG2, Agno, AutoGen, CrewAI, Google ADK, LangGraph, LlamaIndex, OpenAI Agents SDK, Pydantic AI e smolagents — cada exemplo isolando um conceito.',
    },
    problem: {
      en: 'Choosing an agent framework usually means reading ten marketing pages that all promise the same things. What is missing is the boring comparison: the same task, the same tools, written each way, so the differences are in the code instead of in the pitch.',
      'pt-br':
        'Escolher um framework de agentes geralmente significa ler dez páginas de marketing que prometem as mesmas coisas. O que falta é a comparação chata: a mesma tarefa, as mesmas ferramentas, escritas de cada jeito, para que as diferenças estejam no código e não no discurso.',
    },
    approach: {
      en: 'Every implementation returns through a shared agent contract (`AgentResult` and `TokenUsage`) and calls the same shared tool implementations, which is what keeps the benchmark from quietly favouring whichever framework got the better-written tools. Results are written as JSONL and rendered into Markdown reports. Unit tests run with no credentials and no network, using mocked HTTP, so the repository stays reproducible for anyone who clones it.',
      'pt-br':
        'Toda implementação retorna por um contrato compartilhado de agente (`AgentResult` e `TokenUsage`) e chama as mesmas implementações de ferramentas, que é o que impede o benchmark de favorecer discretamente o framework que ganhou as ferramentas mais bem escritas. Os resultados são gravados em JSONL e renderizados em relatórios Markdown. Os testes unitários rodam sem credenciais e sem rede, com HTTP mockado, então o repositório permanece reproduzível para quem clonar.',
    },
    highlights: {
      en: [
        'Capability matrix tracking tools, streaming, memory, human-in-the-loop, multi-agent, RAG, MCP, tracing, and evals across frameworks',
        'Benchmark harness measuring latency, token usage, and failure rate on equal footing',
        'Each example is a self-contained project with pinned dependencies',
        'CI runs linting, compilation, and secret scanning on every change',
      ],
      'pt-br': [
        'Matriz de capacidades acompanhando ferramentas, streaming, memória, human-in-the-loop, multiagente, RAG, MCP, tracing e evals entre os frameworks',
        'Bancada de benchmark medindo latência, uso de tokens e taxa de falha em pé de igualdade',
        'Cada exemplo é um projeto independente, com dependências fixadas',
        'CI roda lint, compilação e varredura de segredos a cada mudança',
      ],
    },
    stack: ['Python', 'uv', 'pytest', 'LLMs', 'RAG', 'MCP'],
    repositoryUrl: 'https://github.com/Olwtelet/AgentForge',
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
        'Transforma um arquivo de história em vídeo vertical pronto, totalmente offline',
    },
    overview: {
      en: 'Resumex takes a written story and returns a finished 1080×1920 MP4 with narration and synchronized captions. The whole pipeline runs on the machine: no API keys, no cloud services, no network calls in the default path.',
      'pt-br':
        'O Resumex pega uma história escrita e devolve um MP4 pronto em 1080×1920, com narração e legendas sincronizadas. O pipeline inteiro roda na máquina: sem chaves de API, sem serviços em nuvem, sem chamadas de rede no caminho padrão.',
    },
    problem: {
      en: 'Producing short-form video from written material is mostly repetitive assembly — narrate, transcribe, time the captions, compose, encode — and the usual tooling pushes each of those steps through a different paid service.',
      'pt-br':
        'Produzir vídeo curto a partir de material escrito é, na maior parte, montagem repetitiva — narrar, transcrever, cronometrar as legendas, compor, codificar — e as ferramentas usuais empurram cada uma dessas etapas para um serviço pago diferente.',
    },
    approach: {
      en: 'Caption timing is read directly from the speech synthesis output instead of transcribing the audio back, which removes an entire error-prone stage. Rendering is a single deterministic FFmpeg pass, so the same input yields the same file. Completed work is tracked in SQLite, making batch runs resumable rather than repeated.',
      'pt-br':
        'O tempo das legendas é lido diretamente da saída da síntese de voz, em vez de transcrever o áudio de volta, o que elimina uma etapa inteira sujeita a erro. A renderização é uma única passada determinística do FFmpeg, então a mesma entrada gera o mesmo arquivo. O trabalho concluído é registrado em SQLite, tornando as execuções em lote retomáveis em vez de repetidas.',
    },
    highlights: {
      en: [
        'Local text-to-speech with Kokoro, running on CPU (or a silent mode)',
        'Accepts .txt, .md, and .json stories; custom footage or generated gradient backgrounds',
        'Optional local Ollama models to draft titles or score a story before rendering',
        'Optional private upload to YouTube through browser-based OAuth',
      ],
      'pt-br': [
        'Síntese de voz local com Kokoro, rodando na CPU (ou um modo silencioso)',
        'Aceita histórias em .txt, .md e .json; imagens próprias ou fundos em gradiente gerados',
        'Modelos Ollama locais opcionais para rascunhar títulos ou pontuar uma história antes de renderizar',
        'Envio privado opcional para o YouTube via OAuth pelo navegador',
      ],
    },
    stack: ['Python', 'FFmpeg', 'Kokoro', 'SQLite', 'Ollama'],
    repositoryUrl: 'https://github.com/Olwtelet/Resumex',
  },
  {
    slug: 'obsidian-second-brain',
    name: 'Obsidian Second Brain',
    collection: 'open-source',
    category: 'open-source',
    status: 'work-in-progress',
    summary: {
      en: 'A public study vault: CS fundamentals, code snippets, and daily logs, all cross-linked',
      'pt-br':
        'Um cofre público de estudos: fundamentos de CC, trechos de código e registros diários, todos interligados',
    },
    overview: {
      en: 'A public Obsidian vault where I keep what I am learning: computer science fundamentals, notes on JavaScript, TypeScript, React, Python and C, a "Grimorie" of solved snippets, saved clippings, and daily logs from my independent coursework. It is organized with Zettelkasten and PARA so the notes link to each other rather than sitting in folders, and it grows continuously instead of being finished.',
      'pt-br':
        'Um cofre público do Obsidian onde guardo o que estou aprendendo: fundamentos de ciência da computação, notas de JavaScript, TypeScript, React, Python e C, um "Grimorie" de trechos resolvidos, recortes salvos e registros diários dos meus estudos independentes. É organizado com Zettelkasten e PARA, para que as notas se liguem umas às outras em vez de ficarem paradas em pastas, e cresce continuamente em vez de ser concluído.',
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
      en: 'Institutional website for a nonprofit working in education, training, and civic outreach',
      'pt-br':
        'Site institucional para uma ONG que atua em educação, capacitação e ação cívica',
    },
    overview: {
      en: 'The institutional website of a nonprofit that operates nationwide across education, professional training, sports, and civic outreach. The site is where the institution explains who it is to the partners, applicants, and public bodies who look it up.',
      'pt-br':
        'O site institucional de uma organização sem fins lucrativos que atua em todo o país com educação, capacitação profissional, esporte e ação cívica. O site é onde a instituição explica quem é para os parceiros, candidatos e órgãos públicos que a procuram.',
    },
    problem: {
      en: 'An institution with several distinct fronts needs a page that makes its scope legible quickly — and, just as importantly, one that its own team can keep current without calling a developer for every update.',
      'pt-br':
        'Uma instituição com várias frentes distintas precisa de uma página que torne o escopo legível rapidamente — e, tão importante quanto, que a própria equipe consiga manter atualizada sem chamar um desenvolvedor a cada mudança.',
    },
    approach: {
      en: 'Rather than build from zero, I adapted and customized a Tailwind CSS template to carry the mission, projects, leadership, and contact channels. That decision was the point: it kept the cost down and left a front-end structure plain enough for the institution to maintain on its own.',
      'pt-br':
        'Em vez de construir do zero, adaptei e personalizei um template de Tailwind CSS para carregar a missão, os projetos, a liderança e os canais de contato. Essa decisão era justamente o ponto: reduziu o custo e deixou uma estrutura de front-end simples o bastante para a instituição manter sozinha.',
    },
    stack: ['Tailwind CSS', 'JavaScript'],
    websiteUrl: 'https://instituto-politecnico-do-brasil.vercel.app',
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
      en: 'Website for a Brazilian law firm working in civil and corporate law',
      'pt-br':
        'Site para um escritório de advocacia brasileiro de direito civil e empresarial',
    },
    overview: {
      en: 'The website of a Brazilian law firm practising civil and corporate law, built to present the practice areas clearly and turn searches into contacts.',
      'pt-br':
        'O site de um escritório de advocacia brasileiro que atua em direito civil e empresarial, feito para apresentar as áreas de atuação com clareza e transformar buscas em contatos.',
    },
    problem: {
      en: 'A law firm is usually found before it is met. The site had to do the work a first impression does — establish credibility and make the practice areas obvious — while ranking for people searching for a lawyer in the first place.',
      'pt-br':
        'Um escritório de advocacia costuma ser encontrado antes de ser conhecido. O site precisava fazer o trabalho de uma primeira impressão — estabelecer credibilidade e deixar as áreas de atuação evidentes — enquanto ranqueia para quem está procurando um advogado.',
    },
    approach: {
      en: 'Built static-first with Astro, so pages arrive as finished HTML instead of waiting on JavaScript. SEO was treated as structure rather than a plugin: semantic markup, per-page metadata, and load times that hold up on mobile connections, which is where most of these searches start.',
      'pt-br':
        'Construído com Astro e renderização estática, então as páginas chegam como HTML pronto em vez de esperar por JavaScript. O SEO foi tratado como estrutura, não como plugin: marcação semântica, metadados por página e tempos de carregamento que se sustentam em conexão móvel, que é onde a maioria dessas buscas começa.',
    },
    stack: ['Astro', 'TypeScript', 'Tailwind CSS'],
    websiteUrl: 'https://rochaesa.vercel.app/',
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
      en: 'Business website and lead channel for an IT infrastructure company, still shipping',
      'pt-br':
        'Site institucional e canal de leads para uma empresa de infraestrutura de TI, ainda em evolução',
    },
    overview: {
      en: 'The business website of an IT infrastructure company working with networking, structured cabling, CCTV, and access control for corporate, residential, and gaming-focused clients.',
      'pt-br':
        'O site institucional de uma empresa de infraestrutura de TI que trabalha com redes, cabeamento estruturado, CFTV e controle de acesso para clientes corporativos, residenciais e voltados a gaming.',
    },
    problem: {
      en: 'Infrastructure work is sold by conversation, not by cart. The site needed to explain a technical catalogue to non-technical buyers and then hand them off to a real conversation as quickly as possible.',
      'pt-br':
        'Trabalho de infraestrutura se vende por conversa, não por carrinho. O site precisava explicar um catálogo técnico para compradores não técnicos e então passá-los para uma conversa real o mais rápido possível.',
    },
    roleDescription: {
      en: 'I designed and developed the site end to end, and I continue to maintain it — this is an ongoing engagement, not a delivered-and-closed project, so new sections ship as the company needs them.',
      'pt-br':
        'Projetei e desenvolvi o site de ponta a ponta, e continuo mantendo-o — este é um trabalho em andamento, não um projeto entregue e encerrado, então novas seções são publicadas conforme a empresa precisa.',
    },
    approach: {
      en: 'Quote requests hand off to WhatsApp instead of a contact form nobody checks, which matches how the company already talks to clients. The build is containerized with Docker so deployments are reproducible rather than dependent on one machine.',
      'pt-br':
        'Os pedidos de orçamento passam para o WhatsApp em vez de um formulário que ninguém confere, o que combina com o jeito que a empresa já fala com os clientes. O build é containerizado com Docker, então os deploys são reproduzíveis em vez de depender de uma máquina específica.',
    },
    highlights: {
      en: [
        'Blog for company updates and technical articles',
        'Quote request forms that hand off directly to WhatsApp',
        'Containerized with Docker for reproducible deployment',
        'Maintained continuously, with new sections added over time',
      ],
      'pt-br': [
        'Blog para novidades e artigos técnicos da empresa',
        'Formulários de orçamento que passam direto para o WhatsApp',
        'Containerizado com Docker para deploy reproduzível',
        'Mantido continuamente, com novas seções adicionadas ao longo do tempo',
      ],
    },
    stack: ['Astro', 'TypeScript', 'Tailwind CSS', 'Docker'],
    websiteUrl: 'https://www.integratek.com.br/',
  },
  {
    slug: 'thalit-academy',
    name: 'CT Thalita Rodrigues',
    collection: 'websites',
    category: 'client-work',
    status: 'online',
    // TODO(owner): confirm the year this was delivered, and whether this was
    // a paid client engagement or work done for family, so the resume can
    // describe the relationship accurately.
    role: role.fullStack,
    summary: {
      en: 'Website for a tennis and beach tennis training centre in Brasília',
      'pt-br':
        'Site para um centro de treinamento de tênis e beach tennis em Brasília',
    },
    overview: {
      en: 'The website of Centro de Treinamento Thalita Rodrigues, a tennis and beach tennis training centre based at Clube da Portuguesa in Águas Claras, Brasília. It serves children, teenagers, and adults, from a first trial lesson through to competitive play.',
      'pt-br':
        'O site do Centro de Treinamento Thalita Rodrigues, um centro de treinamento de tênis e beach tennis no Clube da Portuguesa, em Águas Claras, Brasília. Atende crianças, jovens e adultos, da primeira aula experimental até o nível competitivo.',
    },
    problem: {
      en: 'A training centre lives or dies by the trial lesson: everything on the site has to lead a curious visitor to booking one, while still serving the students already enrolled who come back for schedules, tournament results, and technique material.',
      'pt-br':
        'Um centro de treinamento vive da aula experimental: tudo no site precisa levar o visitante curioso a agendar uma, sem deixar de servir os alunos já matriculados, que voltam para ver horários, resultados de torneios e material de técnica.',
    },
    approach: {
      en: 'The site is built with Next.js and splits into two jobs at once: a conversion path that ends in a scheduled trial lesson or a WhatsApp conversation, and an ongoing content area — technique guides, training videos, articles, tournament registration and results — that gives enrolled students a reason to return.',
      'pt-br':
        'O site é feito com Next.js e cumpre duas funções ao mesmo tempo: um caminho de conversão que termina em uma aula experimental agendada ou em uma conversa no WhatsApp, e uma área de conteúdo contínuo — guias de técnica, vídeos de treino, artigos, inscrição e resultados de torneios — que dá aos alunos matriculados um motivo para voltar.',
    },
    highlights: {
      en: [
        'Online trial-lesson scheduling, with WhatsApp as the direct contact route',
        'Sections for tennis and beach tennis classes, methodology, and athlete profiles',
        'Internal tournament (Circuito Interno CT) registration and results',
        'Technique guides, training videos, and articles for enrolled students',
      ],
      'pt-br': [
        'Agendamento de aula experimental online, com o WhatsApp como via de contato direto',
        'Seções de aulas de tênis e beach tennis, metodologia e perfis de atletas',
        'Inscrição e resultados do torneio interno (Circuito Interno CT)',
        'Guias de técnica, vídeos de treino e artigos para os alunos matriculados',
      ],
    },
    stack: ['Next.js', 'React', 'TypeScript'],
    websiteUrl: 'https://thalitacademy.vercel.app/',
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
    problem: {
      en: 'A weekly watch party leaves nothing behind: the conversation scrolls away in Discord and the reason a film was chosen disappears with it. The site exists to be the memory the chat room does not keep.',
      'pt-br':
        'Uma sessão semanal não deixa nada para trás: a conversa some no scroll do Discord e o motivo de um filme ter sido escolhido vai junto. O site existe para ser a memória que a sala de chat não guarda.',
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
