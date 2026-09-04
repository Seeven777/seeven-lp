# SEE7VEN — Presence V6.1

Redesign da landing page / portfólio da Seeven com foco em prospecção fria, demonstração de craft, prova visual e narrativa contínua.

## Conceito

**FAZEMOS MARCAS PARAREM.**  
Não entregamos apenas peças. Construímos presença.  
**Do pixel ao papel.**

A experiência começa clara, editorial e contida e fica progressivamente mais escura e imersiva conforme o visitante entra nos trabalhos.

## O que a V6.1 corrige

A V6.1 foca no principal problema percebido na primeira versão: **vídeos e marcas não podiam depender de quadrados abstratos sem nenhuma prova visual**.

Agora existem três níveis automáticos de mídia para cada Reel:

1. `poster` — capa real cadastrada para aquele Reel;
2. `publicCover` — mídia pública verificada da marca, quando disponível;
3. `brandPoster` — fallback editorial local da própria marca/cliente.

Isso significa que nenhum Reel precisa aparecer como um bloco vazio. Quando a capa real ainda não está disponível, o visitante ao menos vê a marca e entende de qual cliente é o conteúdo.

Também foram adicionados:

- bloco **DESTAQUES / CAPAS VISÍVEIS** antes do arquivo completo de Reels;
- indicação visual da origem da imagem: `CAPA DO REEL`, `MÍDIA PÚBLICA` ou `IDENTIDADE DA MARCA`;
- embed automático no modal quando `url` contém o permalink exato de um Reel/post público do Instagram;
- reprodução direta quando `url` aponta para `.mp4` ou `.webm`;
- fallback de imagem em caso de hotlink quebrado;
- prévia de `poster`/`cover` no `/admin`;
- suporte efetivo a `featured=true` no CMS;
- cards de projeto que usam a mídia pública da marca quando não há `cover` do projeto;
- mais projetos no Selected Work, incluindo Sabor do Sul e DJ Pufinho;
- contexto público de escala dentro do case Sindpetshop-SP, separado das métricas de performance da Seeven.

## Pesquisa pública usada como contexto

A pesquisa pública foi usada para entender melhor a natureza das marcas e tornar títulos/copies mais específicos. Ela **não substitui os arquivos originais do portfólio**.

Foram encontrados dados públicos confiáveis para, entre outros:

- Sindpetshop-SP — portal institucional e escala estadual;
- Eventos Publi — estruturas, cenografia, iluminação, painéis, palcos, estandes e operação de eventos;
- MIBIS Dog — produto/delivery e presença local;
- Sabor do Sul — marmitaria, delivery, produtos e combos;
- DJ Pufinho e DiCárias — presença pública em plataformas de música;
- Pizzaria Venâncio — presença local e delivery.

Para SEON, CZK Drills, Eazy Club e Salseiro Lounge, os resultados públicos encontrados não foram específicos o bastante para eu inserir fatos adicionais com segurança. O projeto mantém os perfis fornecidos sem inventar dados.

## Limitação importante: os 32 Reels

O resumo recebido informa **quais clientes possuem os 32 Reels e quantos pertencem a cada cliente**, mas não contém os 32 permalinks individuais nem os arquivos originais de capa/vídeo.

Por isso, a V6.1 **não inventa links de Reels**.

Hoje os slots estáticos apontam para o perfil do cliente. Assim que você cadastrar o permalink exato, por exemplo:

```text
https://www.instagram.com/reel/XXXXXXXXXXX/
```

o modal detecta a URL e tenta carregar o embed público automaticamente.

Para controle visual total, a forma recomendada continua sendo cadastrar também a capa:

```js
{
  poster: '/portfolio/sindpetshop-01.webp',
  url: 'https://www.instagram.com/reel/XXXXXXXXXXX/'
}
```

Ou hospedar o vídeo próprio:

```js
{
  poster: '/portfolio/sindpetshop-01.webp',
  video: '/portfolio/sindpetshop-01.mp4'
}
```

## Estrutura

```text
seeven-v6/
├── public/
│   └── portfolio/
│       ├── brands/         # fallbacks editoriais locais das 11 marcas
│       └── public/         # reservado para cópias locais de mídia pública/autorizada
├── src/
│   ├── App.jsx             # experiência pública
│   ├── admin.jsx           # painel opcional Supabase
│   ├── data.js             # conteúdo estático / fallback
│   ├── useCmsContent.js    # normalização CMS
│   ├── main.jsx
│   ├── styles.css
│   └── supabase.js
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Onde cadastrar capas e vídeos

### Sem Supabase

Edite `src/data.js`.

Para cada Reel:

```js
poster: '/portfolio/cliente-01.webp',
video: '/portfolio/cliente-01.mp4',
url: 'https://www.instagram.com/reel/XXXXXXXXXXX/',
featured: true
```

### Com Supabase / `/admin`

Na tabela `contents`:

- `client`: cliente;
- `category`: use algo contendo `reel`, `video` ou `motion`;
- `title`: título do item;
- `url`: permalink exato do Instagram **ou** arquivo `.mp4/.webm`;
- `poster`: URL da capa;
- `featured`: `true` para aparecer nos destaques;
- `active`: `true`;
- `order`: ordem.

A V6.1 passou a ler `featured` de verdade. Antes essa informação não participava da renderização do front-end.

## Mídia pública x produção

Algumas prévias usam URLs públicas externas como fallback para demonstrar a melhoria já nesta versão. Para produção, o ideal é substituir essas URLs por arquivos que você controla em:

- `public/portfolio/`; ou
- Supabase Storage/CDN.

Isso evita que uma mudança no site de terceiros quebre uma imagem no seu portfólio.

## Rodar localmente

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Git / Vercel

```bash
git add .
git commit -m "feat: Seeven Presence V6.1 media and portfolio"
git push
```

## WhatsApp

```env
VITE_KAREN_WHATSAPP=5511XXXXXXXXX
VITE_GUSTAVO_WHATSAPP=5511XXXXXXXXX
```

Use apenas números.

## Próximo salto de qualidade

A estrutura para mídia real agora está resolvida. Para elevar o portfólio do nível “direção visual” para “prova integral”, a prioridade é:

1. inserir as 32 capas reais;
2. cadastrar os 32 permalinks ou vídeos originais;
3. substituir os fallbacks de marca por logos/capas oficiais autorizados;
4. inserir screenshots reais dos projetos e do site Sindpetshop;
5. adicionar os links exatos dos projetos Behance.
