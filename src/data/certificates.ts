export type Certificate = {
  /** Also the thumbnail name: /assets/images/.certificates/<slug>.{jpg,webp} */
  slug: string
  /** Official course title, kept verbatim in every locale. */
  name: string
  /** Language of the official title, for assistive tech. */
  lang: 'en' | 'pt-BR'
  issuer: 'Google' | 'Anthropic' | 'Udemy'
  /** Issue date as printed on the verification page (YYYY-MM-DD). */
  issued: string
  /** Public verification page — the proof behind each entry. */
  verifyUrl: string
}

/**
 * Newest first. Thumbnails are the certificates themselves (the Claude
 * Academy badges are captured from their verification pages), cropped to
 * 4:3 and exported at 960×720 as JPEG + WebP.
 */
export const certificates: Certificate[] = [
  {
    slug: 'google-linux-and-sql',
    name: 'Tools of the Trade: Linux and SQL',
    lang: 'en',
    issuer: 'Google',
    issued: '2026-09-09',
    verifyUrl:
      'https://www.coursera.org/account/accomplishments/verify/BDM6QII7T7ZT',
  },
  {
    slug: 'google-networks-and-network-security',
    name: 'Connect and Protect: Networks and Network Security',
    lang: 'en',
    issuer: 'Google',
    issued: '2026-09-06',
    verifyUrl:
      'https://www.coursera.org/account/accomplishments/verify/LVVYFPCE0OQL',
  },
  {
    slug: 'anthropic-claude-vertex-ai',
    name: "Claude with Google Cloud's Vertex AI",
    lang: 'en',
    issuer: 'Anthropic',
    issued: '2026-09-02',
    verifyUrl:
      'https://academy.claude.com/verify/4a532fbe6844cb8c1b87be2a988d1fe1',
  },
  {
    slug: 'google-manage-security-risks',
    name: 'Play It Safe: Manage Security Risks',
    lang: 'en',
    issuer: 'Google',
    issued: '2026-08-29',
    verifyUrl:
      'https://www.coursera.org/account/accomplishments/verify/RJ69NOHTV926',
  },
  {
    slug: 'google-foundations-of-cybersecurity',
    name: 'Foundations of Cybersecurity',
    lang: 'en',
    issuer: 'Google',
    issued: '2026-08-27',
    verifyUrl:
      'https://www.coursera.org/account/accomplishments/verify/LTLWBG6ION9N',
  },
  {
    slug: 'anthropic-claude-amazon-bedrock',
    name: 'Claude with Amazon Bedrock',
    lang: 'en',
    issuer: 'Anthropic',
    issued: '2026-08-25',
    verifyUrl:
      'https://academy.claude.com/verify/ee7535c035d529cab753e49b6c751dc8',
  },
  {
    slug: 'anthropic-claude-api',
    name: 'Building with the Claude API',
    lang: 'en',
    issuer: 'Anthropic',
    issued: '2026-08-25',
    verifyUrl:
      'https://academy.claude.com/verify/26984dbc08c3d79418a8b45adc87b1dd',
  },
  {
    slug: 'udemy-algoritmos-logica-programacao',
    name: 'Algoritmos e Lógica de Programação - O Curso COMPLETO',
    lang: 'pt-BR',
    issuer: 'Udemy',
    issued: '2026-08-24',
    verifyUrl:
      'https://www.udemy.com/certificate/UC-733fee17-7de9-4cfe-830f-ceb0865649ee/',
  },
]
