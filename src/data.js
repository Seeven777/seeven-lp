export const clients = [
  { id: 'sindpetshop', name: 'Sindpetshop-SP', handle: '@sindpetshop_sp', category: 'Institucional', accent: '#ff7a1a', url: 'https://www.instagram.com/sindpetshop_sp/' },
  { id: 'venancio', name: 'Pizzaria Venâncio', handle: '@pizzariavenancio', category: 'Food', accent: '#9c2f35', url: 'https://www.instagram.com/pizzariavenancio/' },
  { id: 'seon', name: 'SEON', handle: '@seon.co', category: 'Lifestyle', accent: '#b9ff66', url: 'https://www.instagram.com/seon.co/' },
  { id: 'czk', name: 'CZK Drills', handle: '@czkdrills', category: 'Industrial', accent: '#f4c63d', url: 'https://www.instagram.com/czkdrills/' },
  { id: 'mibis', name: 'MIBIS Dog', handle: '@mibisdog', category: 'Pet', accent: '#73cfff', url: 'https://www.instagram.com/mibisdog/' },
  { id: 'eventos', name: 'Eventos Publi', handle: '@eventospubli', category: 'Eventos', accent: '#f2ede5', url: 'https://www.instagram.com/eventospubli/' },
  { id: 'eazy', name: 'Eazy Club', handle: '@eazyclubperus_', category: 'Nightlife', accent: '#8e5cff', url: 'https://www.instagram.com/eazyclubperus_/' },
  { id: 'salseiro', name: 'Salseiro Lounge', handle: '@salseiro.lounge', category: 'Nightlife', accent: '#ff4f9a', url: 'https://www.instagram.com/salseiro.lounge/' },
  { id: 'pufinho', name: 'DJ Pufinho', handle: '@djpufinho', category: 'Music', accent: '#58f5d0', url: 'https://www.instagram.com/djpufinho/' },
  { id: 'sabor', name: 'Sabor do Sul', handle: '@sabordosul_marmitaria', category: 'Food', accent: '#ffb55f', url: 'https://www.instagram.com/sabordosul_marmitaria/' },
  { id: 'dicarias', name: 'Dicarias Cantor', handle: '@dicarias', category: 'Music', accent: '#f3d2ff', url: '#' }
]

export const featuredProjects = [
  {
    id: 'sindpetshop-ecosystem',
    client: 'Sindpetshop-SP',
    label: 'CASE / ECOSSISTEMA',
    title: 'De comunicação sindical a presença digital completa.',
    summary: 'Estratégia, identidade, conteúdo, site, campanhas, materiais e jornadas digitais conectadas.',
    tags: ['Estratégia', 'Social', 'Web', 'Campanhas'],
    theme: 'orange',
    size: 'xl',
    href: '#case-sindpetshop'
  },
  {
    id: 'venancio-social',
    client: 'Pizzaria Venâncio',
    label: 'SOCIAL / FOOD',
    title: 'Produto antes da legenda.',
    summary: 'Direção visual para transformar desejo em atenção e atenção em pedido.',
    tags: ['Social', 'Direção de arte', 'Conteúdo'],
    theme: 'wine',
    size: 'md',
    href: '#portfolio'
  },
  {
    id: 'seon-identity',
    client: 'SEON',
    label: 'BRAND / CONTENT',
    title: 'Uma linguagem que parece pertencer à marca.',
    summary: 'Sistema visual, ritmo e presença digital com identidade reconhecível.',
    tags: ['Branding', 'Social', 'Motion'],
    theme: 'acid',
    size: 'md',
    href: '#portfolio'
  },
  {
    id: 'eazy-experience',
    client: 'Eazy Club',
    label: 'NIGHTLIFE / CAMPAIGN',
    title: 'Comunicação com pulso.',
    summary: 'Conteúdo e peças promocionais construídas para o ritmo do público.',
    tags: ['Campanha', 'Social', 'Vídeo'],
    theme: 'violet',
    size: 'lg',
    href: '#portfolio'
  },
  {
    id: 'czk-industrial',
    client: 'CZK Drills',
    label: 'B2B / INDUSTRIAL',
    title: 'Técnico sem parecer frio.',
    summary: 'Clareza comercial e direção visual para um produto altamente específico.',
    tags: ['B2B', 'Conteúdo', 'Design'],
    theme: 'steel',
    size: 'sm',
    href: '#portfolio'
  },
  {
    id: 'mibis-pet',
    client: 'MIBIS Dog',
    label: 'PET / SOCIAL',
    title: 'Afeto com direção.',
    summary: 'Conteúdo leve sem perder consistência de marca.',
    tags: ['Social', 'Conteúdo', 'Vídeo'],
    theme: 'sky',
    size: 'sm',
    href: '#portfolio'
  }
]

const reelPlan = [
  ['sindpetshop', 3], ['seon', 3], ['mibis', 2], ['eazy', 3], ['pufinho', 3],
  ['dicarias', 3], ['venancio', 3], ['czk', 3], ['eventos', 3], ['salseiro', 3], ['sabor', 3]
]

export const reels = reelPlan.flatMap(([clientId, count]) => {
  const client = clients.find(c => c.id === clientId)
  return Array.from({ length: count }, (_, index) => ({
    id: `${clientId}-${index + 1}`,
    clientId,
    client: client?.name || clientId,
    title: `Reel ${String(index + 1).padStart(2, '0')}`,
    poster: '',
    video: '',
    url: client?.url || '#',
    accent: client?.accent || '#8b5cf6'
  }))
})

export const solutions = [
  {
    problem: 'Quero vender mais.',
    answer: 'Estratégia de aquisição, conteúdo, mídia e uma página que transforme interesse em ação.',
    stack: ['Tráfego', 'Conteúdo', 'Landing page']
  },
  {
    problem: 'Minha marca está ultrapassada.',
    answer: 'Reposicionamento visual para que a percepção acompanhe a qualidade do que você entrega.',
    stack: ['Estratégia', 'Identidade', 'Direção visual']
  },
  {
    problem: 'Ninguém entende o que eu faço.',
    answer: 'Clareza de mensagem, hierarquia e uma experiência que explica sem cansar.',
    stack: ['Posicionamento', 'Copy', 'Site']
  },
  {
    problem: 'Preciso parecer maior.',
    answer: 'Consistência entre os pontos de contato para que a empresa pareça uma marca, não um conjunto de peças.',
    stack: ['Branding', 'Digital', 'Materiais']
  },
  {
    problem: 'Preciso chamar atenção.',
    answer: 'Conceito criativo, vídeo, motion e campanha pensados para interromper o automático.',
    stack: ['Campanha', 'Vídeo', 'Social']
  }
]

export const touchpoints = [
  'Instagram', 'Site', 'Google', 'WhatsApp', 'Campanha', 'Evento', 'Embalagem', 'Uniforme', 'Impresso', 'Vídeo'
]

export const process = [
  ['01', 'Problema', 'Antes de desenhar, entendemos o que precisa mudar.'],
  ['02', 'Estratégia', 'Definimos a ideia que organiza decisões.'],
  ['03', 'Direção', 'Transformamos estratégia em linguagem.'],
  ['04', 'Criação', 'Construímos as peças e experiências.'],
  ['05', 'Distribuição', 'Levamos a marca aos pontos certos.'],
  ['06', 'Evolução', 'Observamos, aprendemos e refinamos.']
]

export const sindpetshopStats = [
  { value: '22,2 mil', label: 'visualizações', delta: '+45,9%' },
  { value: '5,1 mil', label: 'de alcance', delta: '+41,7%' },
  { value: '600', label: 'interações', delta: '+12,4%' },
  { value: '+127', label: 'seguidores em um recorte', delta: 'agosto / 2026' }
]

export const behanceProjects = [
  ['Mês das Mulheres', 'Sindpetshop-SP', 'editorial'],
  ['Maio Lilás', 'Consciência Jovem', 'lilac'],
  ['Nova identidade visual', 'Sindpetshop-SP', 'orange'],
  ['Cajamar Fest', 'Evento', 'festival'],
  ['Modelagem 3D', 'Seeven Lab', 'chrome'],
  ['Campanha de Junho', 'Sindpetshop-SP', 'blue'],
  ['Sistema institucional', 'Sindpetshop-SP', 'mono'],
  ['Abril Verde', 'Sindpetshop-SP', 'green']
].map(([title, client, theme], index) => ({ id: index + 1, title, client, theme, url: '#' }))
