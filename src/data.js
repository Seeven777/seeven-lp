export const clients = [
  {
    id: 'sindpetshop', name: 'Sindpetshop-SP', handle: '@sindpetshop_sp', category: 'Institucional', accent: '#ff7a1a',
    url: 'https://www.instagram.com/sindpetshop_sp/', website: 'https://sindpetshop.org.br/',
    brandPoster: '/portfolio/brands/sindpetshop.svg',
    publicProof: 'Representação dos trabalhadores do setor pet em todo o estado de São Paulo, com portal de notícias, CCTs, benefícios, atendimento e jornadas digitais.'
  },
  {
    id: 'venancio', name: 'Pizzaria Venâncio', handle: '@pizzariavenancio', category: 'Food', accent: '#9c2f35',
    url: 'https://www.instagram.com/pizzariavenancio/', brandPoster: '/portfolio/brands/venancio.svg',
    publicProof: 'Pizzaria em Franco da Rocha com presença pública ligada a produto, delivery e experiência local; o perfil público identificado é @pizzariavenancio.'
  },
  {
    id: 'seon', name: 'SEON', handle: '@seon.co', category: 'Lifestyle', accent: '#b9ff66',
    url: 'https://www.instagram.com/seon.co/', brandPoster: '/portfolio/brands/seon.svg'
  },
  {
    id: 'czk', name: 'CZK Drills', handle: '@czkdrills', category: 'Industrial', accent: '#f4c63d',
    url: 'https://www.instagram.com/czkdrills/', brandPoster: '/portfolio/brands/czk.svg'
  },
  {
    id: 'mibis', name: 'MIBIS Dog', handle: '@mibisdog', category: 'Food / Pet', accent: '#73cfff',
    url: 'https://www.instagram.com/mibisdog/', brandPoster: '/portfolio/brands/mibis.svg',
    publicProof: 'Marca de fast food em Franco da Rocha com forte apelo visual de produto; fontes públicas destacam hot dogs, porções e delivery.'
  },
  {
    id: 'eventos', name: 'Eventos Publi', handle: '@eventospubli', category: 'Eventos', accent: '#2aa7df',
    url: 'https://www.instagram.com/eventospubli/', website: 'https://www.eventospubli.com.br/', brandPoster: '/portfolio/brands/eventos.svg',
    publicProof: 'A empresa informa mais de 17 anos de mercado e atuação em mais de 20 cidades, com cenografia, estruturas, iluminação, LED, palcos, tendas, comunicação visual e produção técnica.'
  },
  {
    id: 'eazy', name: 'Eazy Club', handle: '@eazyclubperus_', category: 'Nightlife', accent: '#8e5cff',
    url: 'https://www.instagram.com/eazyclubperus_/', brandPoster: '/portfolio/brands/eazy.svg'
  },
  {
    id: 'salseiro', name: 'Salseiro Lounge', handle: '@salseiro.lounge', category: 'Nightlife', accent: '#ff4f9a',
    url: 'https://www.instagram.com/salseiro.lounge/', brandPoster: '/portfolio/brands/salseiro.svg'
  },
  {
    id: 'pufinho', name: 'DJ Pufinho', handle: '@djpufinho', category: 'Music', accent: '#58f5d0',
    url: 'https://www.instagram.com/djpufinho/', brandPoster: '/portfolio/brands/pufinho.svg',
    publicProof: 'Artista com presença pública em plataformas de música e lançamentos em colaboração, reforçando uma linguagem orientada a entretenimento e performance.'
  },
  {
    id: 'sabor', name: 'Sabor do Sul', handle: '@sabordosul_marmitaria', category: 'Food', accent: '#ffb55f',
    url: 'https://www.instagram.com/sabordosul_marmitaria/', website: 'https://menu.brendi.com.br/sabor-do-sul-delivery', brandPoster: '/portfolio/brands/sabor.svg',
    publicProof: 'Marmitaria e delivery em Franco da Rocha; a presença pública é orientada a produto, combos, pratos de maior saída e conversão direta para pedido.'
  },
  {
    id: 'dicarias', name: 'DiCárias', handle: '@dicarias', category: 'Music', accent: '#f3d2ff',
    url: 'https://www.instagram.com/dicarias/', brandPoster: '/portfolio/brands/dicarias.svg',
    publicProof: 'Artista com catálogo público em plataformas de música, incluindo Projeto Start, Como Eu Prometi e Pagodim do Dicá.'
  }
]

export const featuredProjects = [
  {
    id: 'sindpetshop-ecosystem', clientId: 'sindpetshop', client: 'Sindpetshop-SP', label: 'CASE / ECOSSISTEMA',
    title: 'De comunicação sindical a presença digital completa.',
    summary: 'Estratégia, identidade, conteúdo, site, campanhas, materiais e jornadas digitais conectadas.',
    tags: ['Estratégia', 'Social', 'Web', 'Campanhas'], theme: 'orange', size: 'xl', href: '#case-sindpetshop'
  },
  {
    id: 'venancio-social', clientId: 'venancio', client: 'Pizzaria Venâncio', label: 'SOCIAL / FOOD',
    title: 'Produto primeiro. Desejo antes da legenda.',
    summary: 'Direção visual para uma marca local em que massa, textura, produto e atmosfera precisam vender em poucos segundos.',
    tags: ['Social', 'Direção de arte', 'Conteúdo'], theme: 'wine', size: 'md', href: 'https://www.instagram.com/pizzariavenancio/'
  },
  {
    id: 'seon-identity', clientId: 'seon', client: 'SEON', label: 'BRAND / CONTENT',
    title: 'Uma linguagem que parece pertencer à marca.',
    summary: 'Sistema visual, ritmo e presença digital com identidade reconhecível.',
    tags: ['Branding', 'Social', 'Motion'], theme: 'acid', size: 'md', href: 'https://www.instagram.com/seon.co/'
  },
  {
    id: 'eazy-experience', clientId: 'eazy', client: 'Eazy Club', label: 'NIGHTLIFE / CAMPAIGN',
    title: 'Comunicação com pulso.',
    summary: 'Conteúdo e peças promocionais construídas para o ritmo do público.',
    tags: ['Campanha', 'Social', 'Vídeo'], theme: 'violet', size: 'lg', href: 'https://www.instagram.com/eazyclubperus_/'
  },
  {
    id: 'czk-industrial', clientId: 'czk', client: 'CZK Drills', label: 'B2B / INDUSTRIAL',
    title: 'Técnico sem parecer frio.',
    summary: 'Clareza comercial e direção visual para um produto altamente específico.',
    tags: ['B2B', 'Conteúdo', 'Design'], theme: 'steel', size: 'sm', href: 'https://www.instagram.com/czkdrills/'
  },
  {
    id: 'mibis-food', clientId: 'mibis', client: 'MIBIS Dog', label: 'FOOD / SOCIAL',
    title: 'Produto que se explica em um frame.',
    summary: 'Conteúdo visual guiado por produto, textura, fome e reconhecimento rápido da marca.',
    tags: ['Social', 'Conteúdo', 'Vídeo'], theme: 'sky', size: 'sm', href: 'https://www.instagram.com/mibisdog/',
  },
  {
    id: 'eventos-experience', clientId: 'eventos', client: 'Eventos Publi', label: 'EVENTS / EXPERIENCE',
    title: 'Estrutura também comunica.',
    summary: 'Uma empresa que atua com estruturas, cenografia, iluminação e experiências precisa parecer capaz de operar em escala.',
    tags: ['Eventos', 'Site', 'Conteúdo'], theme: 'event', size: 'md', href: 'https://www.eventospubli.com.br/'
  },
  {
    id: 'dicarias-music', clientId: 'dicarias', client: 'DiCárias', label: 'MUSIC / CONTENT',
    title: 'Identidade que acompanha o lançamento.',
    summary: 'Música pede presença: capa, vídeo, social e ritmo visual trabalhando para o mesmo momento.',
    tags: ['Música', 'Conteúdo', 'Vídeo'], theme: 'music', size: 'md', href: 'https://www.instagram.com/dicarias/'
  },
  {
    id: 'sabor-conversion', clientId: 'sabor', client: 'Sabor do Sul', label: 'FOOD / CONVERSION',
    title: 'A comunicação termina no pedido.',
    summary: 'Produto, oferta e leitura rápida para uma operação de marmitaria e delivery em que desejo e conversão precisam coexistir.',
    tags: ['Food', 'Conteúdo', 'Conversão'], theme: 'food', size: 'sm', href: 'https://menu.brendi.com.br/sabor-do-sul-delivery',
  },
  {
    id: 'pufinho-music', clientId: 'pufinho', client: 'DJ Pufinho', label: 'MUSIC / MOTION',
    title: 'Quando a peça precisa ter ritmo antes do play.',
    summary: 'Direção para entretenimento: presença visual, movimento e reconhecimento trabalhando junto do conteúdo musical.',
    tags: ['Música', 'Motion', 'Social'], theme: 'music', size: 'sm', href: 'https://www.instagram.com/djpufinho/',
  },
  {
    id: 'salseiro-nightlife', clientId: 'salseiro', client: 'Salseiro Lounge', label: 'NIGHTLIFE / SOCIAL',
    title: 'A atmosfera precisa chegar antes da noite.',
    summary: 'Conteúdo e direção visual para uma marca de nightlife em que clima, recorrência e percepção precisam trabalhar juntos.',
    tags: ['Nightlife', 'Social', 'Motion'], theme: 'violet', size: 'sm', href: 'https://www.instagram.com/salseiro.lounge/'
  }
]

const reelPlan = [
  ['sindpetshop', 3], ['seon', 3], ['mibis', 2], ['eazy', 3], ['pufinho', 3],
  ['dicarias', 3], ['venancio', 3], ['czk', 3], ['eventos', 3], ['salseiro', 3], ['sabor', 3]
]

const highlightedClients = new Set(['sindpetshop', 'mibis', 'eventos', 'pufinho', 'sabor'])

export const reels = reelPlan.flatMap(([clientId, count]) => {
  const client = clients.find(c => c.id === clientId)
  return Array.from({ length: count }, (_, index) => ({
    id: `${clientId}-${index + 1}`,
    clientId,
    client: client?.name || clientId,
    title: index === 0 ? 'Destaque da marca' : `Reel ${String(index + 1).padStart(2, '0')}`,
    poster: '',
    video: '',
    url: client?.url || '#',
    accent: client?.accent || '#8b5cf6',
    featured: index === 0 && highlightedClients.has(clientId),
    publicContext: client?.publicProof || ''
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

export const sindpetshopScale = [
  { value: '461.529', label: 'trabalhadores representados' },
  { value: '645', label: 'cidades atendidas' },
  { value: '5.341', label: 'ações jurídicas concluídas' },
  { value: '25.450', label: 'atendimentos realizados' }
]

export const behanceProjects = [
  { id: 1, title: 'Mês das Mulheres', client: 'Sindpetshop-SP', theme: 'editorial', url: 'https://www.behance.net/gallery/246850123/Sindpetshop-SP-(-Mes-das-Mulheres-)', cover: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/6fcf6b246850123.69cd56879b8d5.png', tools: ['Photoshop'] },
  { id: 2, title: 'Campanha Maio Lilás', client: 'Consciência Jovem', theme: 'lilac', url: 'https://www.behance.net/gallery/248486127/Campanha-Maio-Lilas-Consciencia-Jovem', cover: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/e0746b248486127.69f24cbcc466d.png', tools: ['Photoshop'] },
  { id: 3, title: 'Nova identidade visual', client: 'Sindpetshop-SP', theme: 'orange', url: 'https://www.behance.net/gallery/246851585/Sindpetshop-SP-(-Nova-identidade-visual-)', cover: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/541833246851585.69cd5cc32dab1.png', tools: ['Branding', 'Social'] },
  { id: 4, title: 'Cajamar Fest', client: 'Evento', theme: 'festival', url: 'https://www.behance.net/gallery/196628485/CAJAMAR-FEST', cover: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/642b63196628485.6622bbe1949a2.jpg', tools: ['Event', 'Content'] },
  { id: 5, title: 'Modelagem 3D', client: 'Seeven Lab', theme: 'chrome', url: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D', cover: 'https://mir-s3-cdn-cf.behance.net/projects/404/296feb252638325.Y3JvcCwxMDA3LDc4OCw3NCww.png', tools: ['Blender', 'Photoshop', 'Premiere Pro', 'After Effects'] },
  { id: 6, title: 'Campanha de Junho', client: 'Sindpetshop-SP', theme: 'blue', url: 'https://www.behance.net/gallery/250101129/Campanha-de-junho-Sindpetshop-SP', cover: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/7b785e250101129.6a19e6caa72aa.png', tools: ['Photoshop'] },
  { id: 7, title: 'Sistema institucional', client: 'Sindpetshop-SP', theme: 'mono', url: 'https://www.behance.net/gallery/246850317/Sindpetshop-SP', cover: 'https://mir-s3-cdn-cf.behance.net/projects/404/2b5ea3246850317.Y3JvcCwxMTgyLDkyNSwzNTQsMA.png', tools: ['After Effects', 'Photoshop', 'Illustrator'] },
  { id: 8, title: 'Abril Verde', client: 'Sindpetshop-SP', theme: 'green', url: 'https://www.behance.net/gallery/246847939/Sindpetshop-SP-(-Abril-verde-)', cover: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/1b225e246847939.69cd4e19a40c1.png', tools: ['Photoshop'] }
]

// V7 — knowledge / capability system
export const knowledgeGroups = [
  {
    id: 'design', label: 'Design & identidade', accent: '#ff7a1a',
    tools: [
      { name: 'Adobe Photoshop', short: 'PS', use: 'Tratamento, composição, mockups e direção visual.' },
      { name: 'Adobe Illustrator', short: 'AI', use: 'Identidade, vetores, sistemas gráficos e acabamento.' },
      { name: 'CorelDRAW', short: 'CD', use: 'Artes finais, produção gráfica e materiais físicos.' },
      { name: 'Canva', short: 'CV', use: 'Desdobramentos rápidos, templates e colaboração.' }
    ]
  },
  {
    id: 'motion', label: 'Vídeo & motion', accent: '#9b7cff',
    tools: [
      { name: 'Adobe Premiere Pro', short: 'PR', use: 'Edição, montagem, ritmo e finalização audiovisual.' },
      { name: 'Adobe After Effects', short: 'AE', use: 'Motion design, composição e animação.' },
      { name: 'CapCut', short: 'CC', use: 'Conteúdo vertical, cortes rápidos e versões para social.' },
      { name: 'FL Studio', short: 'FL', use: 'Áudio, trilhas, montagem e experimentação sonora.' }
    ]
  },
  {
    id: '3d', label: '3D & experimentação', accent: '#59d9ff',
    tools: [
      { name: 'Blender', short: 'BL', use: 'Modelagem, iluminação, render e cenas 3D.' },
      { name: 'After Effects', short: 'AE', use: 'Integração 2D/3D, composição e acabamento.' },
      { name: 'Photoshop', short: 'PS', use: 'Concept art, texturas e pós-produção.' }
    ]
  },
  {
    id: 'dev', label: 'Web & produto digital', accent: '#b7ff66',
    tools: [
      { name: 'Visual Studio / VS Code', short: 'VS', use: 'Desenvolvimento, depuração e manutenção de sistemas e interfaces.' },
      { name: 'HTML / CSS / JavaScript', short: 'WEB', use: 'Fundação de interfaces, landing pages, interações e integrações front-end.' },
      { name: 'React', short: 'RX', use: 'Interfaces e experiências digitais interativas.' },
      { name: 'Vite', short: 'VT', use: 'Build e desenvolvimento front-end.' },
      { name: 'WordPress / Elementor', short: 'WP', use: 'Sites, landing pages e operação de conteúdo com edição visual.' },
      { name: 'ASP.NET MVC / C#', short: 'NET', use: 'Sistemas institucionais, rotas, formulários e aplicações web estruturadas.' },
      { name: 'Supabase', short: 'SB', use: 'CMS, autenticação, banco e storage.' },
      { name: 'GitHub', short: 'GH', use: 'Versionamento, colaboração e deploy workflow.' },
      { name: 'Vercel', short: 'VC', use: 'Deploy e distribuição de experiências web.' }
    ]
  },
  {
    id: 'ai', label: 'IA & automação', accent: '#ffbc7d',
    tools: [
      { name: 'Claude', short: 'CL', use: 'Pesquisa, ideação, apoio textual e fluxos de raciocínio.' },
      { name: 'Codex', short: 'CX', use: 'Desenvolvimento assistido, revisão e automação de código.' },
      { name: 'Gemini', short: 'GM', use: 'Exploração multimodal, protótipos e experimentação com geração visual e vídeo.' },
      { name: 'ElevenLabs', short: '11', use: 'Voz sintética, narração e prototipação de áudio.' },
      { name: 'IA generativa', short: 'AI', use: 'Prototipação visual, conceito, vídeo e exploração criativa.' }
    ]
  }
]

export const capabilityPipelines = [
  { title: 'Campanha', flow: ['Estratégia', 'Photoshop / Illustrator', 'After Effects / Premiere', 'Social / Mídia'] },
  { title: 'Presença digital', flow: ['Posicionamento', 'UI / Direção', 'React / Vite', 'Supabase / Vercel'] },
  { title: 'Conteúdo', flow: ['Roteiro', 'Captação / IA', 'Premiere / CapCut', 'Motion / Distribuição'] },
  { title: 'Físico', flow: ['Sistema visual', 'Illustrator / CorelDRAW', 'Arte-final', 'Produção'] }
]

export const ecosystemDetails = {
  Instagram: { title: 'SOCIAL', copy: 'Conteúdo, campanhas, séries, carrosséis, Reels e linguagem recorrente.' },
  Site: { title: 'WEB', copy: 'Institucional, landing pages, experiências interativas e ecossistemas digitais.' },
  Google: { title: 'DISCOVERY', copy: 'Presença local, indexação e pontos de descoberta da marca.' },
  WhatsApp: { title: 'CONVERSION', copy: 'Fluxos de contato, qualificação e caminhos de conversão.' },
  Campanha: { title: 'CAMPAIGN', copy: 'Conceito, direção, desdobramentos e distribuição.' },
  Evento: { title: 'EXPERIENCE', copy: 'Peças, materiais, sinalização e presença física.' },
  Embalagem: { title: 'PACKAGING', copy: 'A marca aplicada no produto e na experiência de compra.' },
  Uniforme: { title: 'BRAND SYSTEM', copy: 'Consistência também quando a comunicação sai da tela.' },
  Impresso: { title: 'PRINT', copy: 'Folder, crachá, papelaria, cartaz e materiais de apoio.' },
  Vídeo: { title: 'MOTION', copy: 'Roteiro, edição, motion e formatos de performance.' }
}

export const pitchPresets = {
  food: ['venancio-social', 'mibis-food', 'sabor-conversion'],
  eventos: ['eventos-experience', 'eazy-experience', 'pufinho-music'],
  b2b: ['czk-industrial', 'sindpetshop-ecosystem', 'seon-identity'],
  institucional: ['sindpetshop-ecosystem', 'czk-industrial', 'seon-identity'],
  nightlife: ['eazy-experience', 'salseiro-nightlife', 'pufinho-music', 'dicarias-music']
}

// V7.1 — structured case stories used by the portfolio drawer.
// The goal is to keep the public portfolio useful even before every project has a long-form page in the CMS.
export const caseStudies = {
  'sindpetshop-ecosystem': {
    id: 'sindpetshop-ecosystem',
    clientId: 'sindpetshop',
    client: 'Sindpetshop-SP',
    eyebrow: 'INSTITUCIONAL / ECOSSISTEMA',
    headline: 'Transformar informação complexa em presença que o trabalhador consegue usar.',
    intro: 'O desafio não era produzir peças isoladas. Era construir coerência entre conteúdo, site, campanhas, jornadas de atendimento e materiais físicos.',
    challenge: 'Comunicação trabalhista e sindical mistura urgência, regras, datas, direitos, negociações e públicos com níveis muito diferentes de familiaridade com o tema.',
    strategy: 'Criar uma linguagem reconhecível, hierarquia editorial forte e um sistema capaz de trocar de assunto sem perder identidade.',
    execution: ['Estratégia de conteúdo', 'Sistema visual', 'Social & Reels', 'Website', 'Landing pages', 'Campanhas', 'Impresso'],
    result: 'Uma presença multicanal em que cada ponto de contato ajuda a mesma marca a informar, orientar e converter atenção em ação.',
    accent: '#ff7a1a',
    proof: ['22,2 mil visualizações', '5,1 mil de alcance', '600 interações', '+127 seguidores em recorte'],
    before: { title: 'ANTES', text: 'Comunicação percebida como peças e canais separados.' },
    after: { title: 'DEPOIS', text: 'Um sistema editorial que conecta social, site, campanha, atendimento e material físico.' },
    source: 'https://sindpetshop.org.br/'
  },
  'venancio-social': {
    id: 'venancio-social', clientId: 'venancio', client: 'Pizzaria Venâncio', eyebrow: 'FOOD / SOCIAL',
    headline: 'Fazer o produto vender antes que a pessoa termine de ler.',
    intro: 'Em food, o frame precisa carregar textura, desejo, preço percebido e personalidade ao mesmo tempo.',
    challenge: 'Transformar uma operação local em uma presença visual mais memorável sem afastar a comunicação do produto real.',
    strategy: 'Produto como protagonista, enquadramentos diretos, contraste e peças com leitura instantânea.',
    execution: ['Direção de arte', 'Social', 'Conteúdo', 'Motion'],
    result: 'Uma linguagem que faz o produto ocupar o espaço principal e reduz a dependência de texto para gerar interesse.', accent: '#9c2f35',
    proof: ['Produto-first', 'Leitura rápida', 'Consistência social'], source: 'https://www.instagram.com/pizzariavenancio/'
  },
  'seon-identity': {
    id: 'seon-identity', clientId: 'seon', client: 'SEON', eyebrow: 'BRAND / CONTENT',
    headline: 'Uma linguagem que parece pertencer à marca — não ao template.',
    intro: 'O objetivo é construir reconhecimento por ritmo, composição e consistência, não pela repetição mecânica de um layout.',
    challenge: 'Criar uma presença flexível o suficiente para variar conteúdo sem perder personalidade.',
    strategy: 'Sistema visual modular, tipografia de impacto, composição e motion tratados como parte da identidade.',
    execution: ['Brand system', 'Social', 'Motion', 'Direção visual'], result: 'Conteúdo variável com assinatura consistente.', accent: '#b9ff66',
    proof: ['Sistema modular', 'Motion', 'Conteúdo'], source: 'https://www.instagram.com/seon.co/'
  },
  'eazy-experience': {
    id: 'eazy-experience', clientId: 'eazy', client: 'Eazy Club', eyebrow: 'NIGHTLIFE / CAMPAIGN',
    headline: 'Comunicação que precisa ter pulso antes da música começar.',
    intro: 'Nightlife vende expectativa. A peça precisa antecipar energia, atmosfera e urgência.',
    challenge: 'Organizar informação promocional sem perder intensidade visual.', strategy: 'Hierarquia curta, cor, luz e motion como componentes de ritmo.',
    execution: ['Campanha', 'Social', 'Vídeo', 'Motion'], result: 'Uma presença construída para ser percebida em ambientes de alta competição visual.', accent: '#8e5cff',
    proof: ['Campanha', 'Vídeo vertical', 'Nightlife'], source: 'https://www.instagram.com/eazyclubperus_/'
  },
  'czk-industrial': {
    id: 'czk-industrial', clientId: 'czk', client: 'CZK Drills', eyebrow: 'B2B / INDUSTRIAL',
    headline: 'Ser técnico sem parecer frio. Ser comercial sem parecer genérico.',
    intro: 'Produtos industriais específicos exigem clareza, precisão e uma direção que transmita confiança.',
    challenge: 'Comunicar especificidade técnica para um público profissional sem sacrificar impacto visual.', strategy: 'Estrutura, contraste, informação curta e linguagem visual de precisão.',
    execution: ['B2B', 'Conteúdo', 'Design', 'Produto'], result: 'Uma comunicação mais clara para um produto altamente específico.', accent: '#f4c63d',
    proof: ['B2B', 'Produto técnico', 'Clareza'], source: 'https://www.instagram.com/czkdrills/'
  },
  'mibis-food': {
    id: 'mibis-food', clientId: 'mibis', client: 'MIBIS Dog', eyebrow: 'FOOD / SOCIAL',
    headline: 'Um frame precisa abrir o apetite.', intro: 'Para fast food, reconhecimento de produto e vontade de pedir precisam acontecer quase instantaneamente.',
    challenge: 'Criar conteúdo com apelo de produto mantendo a assinatura da marca.', strategy: 'Produto em escala, contraste, close e comunicação orientada a desejo.',
    execution: ['Social', 'Conteúdo', 'Vídeo'], result: 'Uma linguagem direta, visual e orientada ao produto.', accent: '#73cfff',
    proof: ['Fast food', 'Delivery', 'Produto'], source: 'https://www.instagram.com/mibisdog/'
  },
  'eventos-experience': {
    id: 'eventos-experience', clientId: 'eventos', client: 'Eventos Publi', eyebrow: 'EVENTS / EXPERIENCE',
    headline: 'Quem entrega escala precisa parecer capaz de operar em escala.', intro: 'A presença da marca precisa acompanhar a dimensão física das estruturas, cenografia, LED, iluminação e produção.',
    challenge: 'Organizar um portfólio amplo de soluções sem diluir a percepção de especialidade.', strategy: 'Mostrar infraestrutura como experiência e transformar variedade em prova de capacidade.',
    execution: ['Eventos', 'Experiência', 'Conteúdo', 'Web'], result: 'Uma narrativa mais próxima do que o cliente realmente compra: capacidade de execução.', accent: '#2aa7df',
    proof: ['Estruturas', 'Cenografia', 'LED / iluminação'], source: 'https://www.eventospubli.com.br/'
  },
  'dicarias-music': {
    id: 'dicarias-music', clientId: 'dicarias', client: 'DiCárias', eyebrow: 'MUSIC / CONTENT',
    headline: 'A identidade visual precisa acompanhar o momento da música.', intro: 'Lançamento musical é uma sequência: capa, teaser, vídeo, social e recorrência.',
    challenge: 'Dar unidade a formatos que vivem em tempos e plataformas diferentes.', strategy: 'Construir um universo visual que acompanha a música sem competir com ela.',
    execution: ['Música', 'Conteúdo', 'Vídeo', 'Social'], result: 'Presença visual conectada ao ritmo de lançamento.', accent: '#f3d2ff',
    proof: ['Lançamento', 'Social', 'Vídeo'], source: 'https://www.instagram.com/dicarias/'
  },
  'sabor-conversion': {
    id: 'sabor-conversion', clientId: 'sabor', client: 'Sabor do Sul', eyebrow: 'FOOD / CONVERSION',
    headline: 'A comunicação termina no pedido.', intro: 'Em delivery, estética e conversão não são objetivos separados.',
    challenge: 'Dar destaque a produto, oferta e variedade sem virar um catálogo visualmente ruidoso.', strategy: 'Hierarquia de oferta, fotografia/produto e chamadas simples.',
    execution: ['Food', 'Conteúdo', 'Conversão'], result: 'Comunicação pensada para reduzir distância entre desejo e pedido.', accent: '#ffb55f',
    proof: ['Delivery', 'Combos', 'Conversão'], source: 'https://menu.brendi.com.br/sabor-do-sul-delivery'
  },
  'pufinho-music': {
    id: 'pufinho-music', clientId: 'pufinho', client: 'DJ Pufinho', eyebrow: 'MUSIC / MOTION',
    headline: 'A peça precisa ter ritmo antes do play.', intro: 'Entretenimento pede movimento, presença e identificação instantânea.',
    challenge: 'Traduzir energia musical para peças que muitas vezes são vistas sem áudio.', strategy: 'Motion, tipografia, contraste e ritmo de montagem como extensão da performance.',
    execution: ['Motion', 'Social', 'Música', 'Vídeo'], result: 'Conteúdo visual que antecipa a energia do artista.', accent: '#58f5d0',
    proof: ['Motion', 'Performance', 'Social'], source: 'https://www.instagram.com/djpufinho/'
  }
}

export const portfolioFilterOptions = [
  { id: 'all', label: 'Tudo' },
  { id: 'strategy', label: 'Estratégia', match: ['Estratégia','Institucional','B2B'] },
  { id: 'brand', label: 'Branding', match: ['Branding','Brand','Identidade','Direção de arte','Design'] },
  { id: 'social', label: 'Social', match: ['Social','Conteúdo'] },
  { id: 'video', label: 'Vídeo / Motion', match: ['Vídeo','Motion','Música'] },
  { id: 'web', label: 'Web', match: ['Web','Site','Landing page'] },
  { id: 'physical', label: 'Físico / Eventos', match: ['Eventos','Impresso','Materiais'] }
]

export const pitchCopy = {
  food: { kicker: 'FOOD / CONVERSION', line: 'Produto, desejo e conversão no mesmo sistema.' },
  eventos: { kicker: 'EVENTS / EXPERIENCE', line: 'Fazer capacidade de execução parecer tão grande quanto ela é.' },
  b2b: { kicker: 'B2B / CLARITY', line: 'Transformar complexidade técnica em percepção, confiança e ação.' },
  institucional: { kicker: 'INSTITUTIONAL / SYSTEM', line: 'Organizar complexidade sem transformar a marca em burocracia.' },
  nightlife: { kicker: 'NIGHTLIFE / ATTENTION', line: 'Energia, frequência e presença para disputar atenção em segundos.' }
}

// V7.2 — PROJECT INTELLIGENCE / STRATEGY OS
// Inspired by the case-study discipline of product/UI portfolios: research,
// context and decisions are presented as part of the work instead of hidden
// behind the final visual result.
export const strategyStages = [
  { id: 'context', label: 'Contexto', index: '01' },
  { id: 'audience', label: 'Público', index: '02' },
  { id: 'insight', label: 'Insight', index: '03' },
  { id: 'decision', label: 'Decisão', index: '04' },
  { id: 'system', label: 'Sistema', index: '05' },
  { id: 'result', label: 'Resultado', index: '06' }
]

export const projectIntelligence = [
  {
    id: 'sindpetshop-ecosystem',
    client: 'Sindpetshop-SP',
    category: 'INSTITUCIONAL / ECOSSISTEMA',
    accent: '#ff7a1a',
    context: 'Muitos assuntos, níveis diferentes de urgência e uma comunicação que precisa continuar clara em social, site, campanha e material físico.',
    audience: 'Trabalhadores do setor pet, empresas, parceiros e públicos que chegam com níveis diferentes de familiaridade com temas trabalhistas.',
    insight: 'Quando a informação é complexa, consistência não significa repetir layout. Significa repetir uma lógica de leitura.',
    decision: 'Criar um sistema editorial modular, com hierarquia forte e identidade reconhecível antes de multiplicar peças.',
    system: 'Estratégia → identidade → conteúdo → site → campanhas → landing pages → impresso.',
    result: 'A marca passa a funcionar como um ecossistema: cada canal resolve uma parte da jornada sem parecer uma operação diferente.',
    objective: 'Tornar informação complexa perceptível, compreensível e acionável.',
    constraint: 'Clareza jurídica e institucional sem perder impacto visual.',
    focus: ['Clareza', 'Sistema', 'Escala'],
    channels: ['Social', 'Web', 'Landing pages', 'Impresso', 'Vídeo'],
    signal: [82, 94, 76, 90, 88, 84]
  },
  {
    id: 'venancio-social',
    client: 'Pizzaria Venâncio',
    category: 'FOOD / SOCIAL',
    accent: '#9c2f35',
    context: 'No feed de food, o produto disputa atenção em segundos e precisa gerar desejo antes de qualquer explicação.',
    audience: 'Pessoas próximas da operação e consumidores decidindo o que pedir.',
    insight: 'Em produto de consumo, a peça mais forte costuma ser a que deixa o produto falar primeiro.',
    decision: 'Tratar fotografia, escala, textura e contraste como argumentos comerciais — não como decoração.',
    system: 'Produto → enquadramento → oferta → social → recorrência.',
    result: 'Comunicação mais rápida, reconhecível e orientada a produto.',
    objective: 'Diminuir a distância entre ver e querer pedir.',
    constraint: 'Informação promocional sem transformar o conteúdo em panfleto.',
    focus: ['Desejo', 'Produto', 'Conversão'],
    channels: ['Social', 'Motion', 'Campanha'],
    signal: [94, 70, 88, 74, 63, 81]
  },
  {
    id: 'czk-industrial',
    client: 'CZK Drills',
    category: 'B2B / INDUSTRIAL',
    accent: '#f4c63d',
    context: 'Produtos técnicos precisam transmitir precisão e confiança sem depender de uma parede de especificações.',
    audience: 'Compradores, profissionais e pessoas que avaliam produto técnico de forma racional e comparativa.',
    insight: 'No B2B, clareza visual também é percepção de competência.',
    decision: 'Usar estrutura, contraste e linguagem de precisão para tornar o produto específico mais fácil de entender.',
    system: 'Produto → informação → prova → conteúdo → presença B2B.',
    result: 'Uma comunicação mais técnica sem ficar fria e mais comercial sem ficar genérica.',
    objective: 'Transformar especificidade técnica em confiança.',
    constraint: 'Equilibrar informação, precisão e impacto.',
    focus: ['Precisão', 'Clareza', 'Confiança'],
    channels: ['B2B', 'Social', 'Produto'],
    signal: [72, 88, 91, 78, 69, 83]
  },
  {
    id: 'eventos-experience',
    client: 'Eventos Publi',
    category: 'EVENTS / EXPERIENCE',
    accent: '#2aa7df',
    context: 'A operação física é grande. A comunicação precisa fazer essa capacidade parecer tangível antes do orçamento.',
    audience: 'Marcas e organizadores avaliando estrutura, cenografia, produção e capacidade de execução.',
    insight: 'Portfólio de eventos vende melhor quando variedade vira evidência de operação — e não uma lista de serviços.',
    decision: 'Organizar a presença por escala, experiência e prova visual de execução.',
    system: 'Estrutura → experiência → conteúdo → portfólio → contato.',
    result: 'A marca comunica capacidade de entrega, não apenas disponibilidade de equipamentos.',
    objective: 'Transformar infraestrutura em percepção de experiência e escala.',
    constraint: 'Muitos serviços sem diluir posicionamento.',
    focus: ['Escala', 'Experiência', 'Prova'],
    channels: ['Eventos', 'Social', 'Web', 'Vídeo'],
    signal: [80, 83, 77, 92, 86, 79]
  },
  {
    id: 'eazy-experience',
    client: 'Eazy Club',
    category: 'NIGHTLIFE / CAMPAIGN',
    accent: '#8e5cff',
    context: 'Nightlife disputa atenção em um ambiente saturado de cor, música, datas e ofertas.',
    audience: 'Público buscando entretenimento, novidade e uma razão imediata para sair.',
    insight: 'A comunicação precisa carregar atmosfera antes do evento acontecer.',
    decision: 'Tratar tipografia, luz, ritmo e motion como parte da experiência do evento.',
    system: 'Atmosfera → campanha → social → vídeo → recorrência.',
    result: 'Uma presença com mais pulso e reconhecimento em formatos de alta competição visual.',
    objective: 'Gerar expectativa e urgência sem perder identidade.',
    constraint: 'Muita informação promocional em pouco tempo de atenção.',
    focus: ['Energia', 'Urgência', 'Motion'],
    channels: ['Social', 'Motion', 'Campanha', 'Vídeo'],
    signal: [88, 74, 93, 82, 90, 76]
  }
]
