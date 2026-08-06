export type Playlist = {
  name: string
  url: string
  /** Creative descriptions are written in Portuguese by design — they are part of the playlists. */
  description: string
  image: string
}

export const playlists: Playlist[] = [
  {
    name: 'Filmes HD Online Grátis',
    url: 'https://open.spotify.com/playlist/0rOUdPuqoErRWxtTQbRDFD',
    description:
      'Não vulgaridade, não mediocridade — vigor, valor, veredito. Só os melhores dos melhores. FILMES HD ONLINE GRÁTIS',
    image: '/assets/images/.playlist/FilmesHDOnlineGratis.jpg',
  },
  {
    name: 'Madrugadas em Rádio FM',
    url: 'https://open.spotify.com/playlist/1kr8i36jGVEc3VVyXGxgYA',
    description:
      'A tentativa definitiva de criar a melhor playlist de Rock Brasileiro do Spotify. Sem filler. Só música que ficou na história — ou merecia.',
    image: '/assets/images/.playlist/MadrugadasEmRadioFM.jpg',
  },
  {
    name: 'Carro Vermelho',
    url: 'https://open.spotify.com/playlist/5CMmvE78xG3Cn6eyA7yAWh',
    description:
      'Estrada vazia, farol baixo, rádio no talo. Cada faixa é um quilômetro a mais entre você e o lugar de onde saiu.',
    image: '/assets/images/.playlist/CarroVermelho.jpg',
  },
  {
    name: 'Angels Fight Devils With Grace',
    url: 'https://open.spotify.com/playlist/04l8q20PHavWBOp6J6ZH6V',
    description:
      '"Chamo-me... Maria," diz a mulher sorrindo. O rosto, a voz... é igual a ela.',
    image: '/assets/images/.playlist/AngelsFightDevilsWithGrace.jpg',
  },
]
