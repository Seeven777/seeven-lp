# SEE7VEN — Presence System V9.3

V9.3 transforma a LP em uma **experiência guiada por scroll**: a primeira tela fica presa no viewport e a mensagem evolui conforme o visitante rola ou puxa para baixo.

A referência de interação é a lógica de product storytelling usada em páginas como DJI: **uma ideia por vez → progressão visual → prova → interação → ação**. Layout, identidade, conteúdo e assets continuam próprios da Seeven.

## Tese comercial

**FAZEMOS MARCAS PARAREM.**

Parar é só o primeiro segundo. A marca ainda precisa ser entendida, lembrada e escolhida.

A Seeven conecta estratégia, branding, conteúdo, motion, web e físico para construir presença **do pixel ao papel**.


## V9.3 — menos informação visível, mais descoberta

A V9.3 adota **progressive disclosure**: o visitante vê primeiro somente o que ajuda a entender e desejar o trabalho. Contexto, método, FAQ, pessoas e detalhes editoriais ficam disponíveis em controles como **VER MAIS**, **ENTENDER ESTA ETAPA** e **VER CONTEXTO**.

Mudanças principais:

- Selected Work inicia com 4 projetos no desktop e 3 no mobile;
- cards mostram título, disciplina e CTA de abertura — a explicação completa fica dentro do case;
- descrição de cada filtro fica em `SOBRE ESTA CURADORIA`;
- Flagship Case mostra uma frase essencial por etapa e deixa o contexto completo sob demanda;
- Presence Engine mostra uma ideia curta por frame e guarda a explicação em `ENTENDER ESTA ETAPA`;
- Motion inicia com 4 itens no desktop / 2 no mobile;
- Behance inicia com 4 projetos no desktop / 2 no mobile;
- Why Seeven deixa apenas duas promessas visíveis e expande o restante;
- FAQ, pessoas e o processo pós-contato ficam recolhidos inicialmente;
- os disclosures usam `<details>/<summary>`, então continuam acessíveis por teclado e funcionais sem JavaScript adicional.

A intenção é reduzir carga cognitiva sem empobrecer o portfólio: **o essencial convence; o detalhe fica disponível para quem quiser aprofundar**.

## Jornada pública

```text
Story Intro / 5 frames sticky
→ Selected Work
→ Flagship Case / Sindpetshop-SP sticky
→ Presence Engine / 5 frames sticky
→ Motion Archive
→ Behance / produção contínua
→ Why Seeven / objeções
→ Pessoas
→ Contato / Brief 60s
```

### 1. Story Intro

A home abre em um palco fixo de cinco etapas:

1. **Fazemos marcas pararem.**
2. **Parar é só o primeiro segundo.**
3. **Uma marca não vive em um post.**
4. **Não somamos peças. Conectamos.**
5. **Agora, olhe o trabalho.**

Recursos V9.3:

- progressão por scroll;
- `PULAR INTRO` para retorno rápido;
- stepper clicável com cinco etapas;
- `PUXE PARA DESCOBRIR` no mobile;
- prova visual no frame final usando projetos/marcas reais do CMS/fallback;
- CTA comercial somente depois da tese;
- reduced-motion respeitado inclusive nos saltos programáticos;
- conteúdo inativo removido da navegação por teclado com `inert`.

### 2. Selected Work

O portfólio aparece imediatamente após a abertura.

- filtros realmente diferentes;
- curadoria + taxonomia para projetos futuros do CMS;
- 4 projetos iniciais no desktop / 3 no mobile;
- Case Drawer com URL compartilhável `/work/:slug`;
- cases estruturados em problema → decisão → execução → resultado.

### 3. Flagship case

O Sindpetshop-SP é contado por scroll:

`desafio → decisão → sistema → resultado`

O visitante pode continuar rolando ou selecionar uma etapa. O resultado final separa contexto institucional de métricas de performance e contém CTA de projeto.

### 4. Presence Engine

Cinco conceitos que antes ocupavam várias seções foram condensados:

`problema → decisão → presença → pixel/papel → capacidade`

Isso reduz repetição e mantém a página progressivamente mais interessante.

### 5. Motion / Behance / prova contínua

O Motion Archive não finge que um fallback é vídeo:

1. MP4/WebM próprio → player;
2. permalink exato do Instagram → embed;
3. poster sem mídia reproduzível → capa/presença;
4. sem mídia real → fallback da marca, sem botão Play falso.

O Behance Watch continua sendo o mecanismo para acompanhar projetos novos publicados em `behance.net/wedeseeven`.

## Mobile

A V9.3 trata mobile como composição própria:

- cenas sticky em `100svh`;
- tipografia limitada por viewport;
- stepper compacto;
- `PUXE PARA DESCOBRIR`;
- grids menores antes de expandir;
- Reels em duas colunas;
- CTA persistente só aparece próximo do portfólio;
- Journey Rail lateral removido no mobile;
- controles com área de toque maior;
- visual das cenas reduzido para não competir com a leitura.

## Viewport safety

Foi adicionada uma camada específica para notebooks/telas baixas. Em alturas menores, títulos, espaçamentos e painéis das cenas sticky são compactados para evitar conteúdo cortado.

## Control Room `/admin`

A base administrativa V8 foi preservada e refinada.

### Dashboard

- projetos publicados;
- Reels reproduzíveis;
- Reels com capa;
- cases incompletos;
- projetos sem cover;
- arquivo Behance;
- completude editorial do CMS.

### Editor

**Reels:** Geral / Mídia / Publicação  
**Projetos:** Geral / Mídia / Case / Intelligence / Publicação  
**Clientes:** Geral / Presença / Publicação

Também possui:

- Quick Reel;
- Media Vault;
- upload de imagem e MP4/WebM;
- poster automático de vídeo;
- rascunho/publicação;
- duplicação;
- ordenação;
- backup JSON;
- Pitch Link Builder;
- Behance Watch;
- migração progressiva da base estática para CMS.

## Supabase

V9.3 **não exige nova migration** se a segurança V8 já está aplicada.

Se o banco ainda for V7.4, execute uma vez:

```text
SUPABASE_V8_MIGRATION.sql
```

Instalação nova:

```text
SUPABASE_V8_BOOTSTRAP.sql
```

Leia `DATABASE_MIGRATION.md` antes.

## Ambiente

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_KAREN_WHATSAPP=55...
VITE_GUSTAVO_WHATSAPP=
```

Nunca exponha Secret/Service Role em variável `VITE_*`.

## Rodar

```bash
npm install
npm run preflight
npm run dev
```

Build:

```bash
npm run build
```

## Git / Vercel

O repositório público ainda pode conter `node_modules` rastreado de versões antigas. Execute uma vez no Git local:

```bash
git rm -r --cached node_modules
```

Depois:

```bash
git add .
git commit -m "feat: SEE7VEN Presence System V9.3"
git push
```

O `.gitignore` atual impede que `node_modules`, `dist` e arquivos `.env` locais voltem ao repositório.

## Arquivos centrais

```text
src/App.jsx              experiência pública
src/styles.css           visual + responsividade
src/admin.jsx            Control Room
src/data.js              fallbacks / cases / taxonomia
src/useCmsContent.js     merge CMS + fallbacks
api/behance-profile.js   Behance Watch
api/behance-meta.js      metadata de projeto Behance
scripts/preflight.mjs    quality gate local/Vercel
```

## Prioridade editorial depois do deploy

1. conectar os permalinks exatos dos Reels;
2. subir as capas reais dos vídeos;
3. adicionar cover próprio aos melhores cases;
4. importar os projetos novos do Behance pelo Control Room;
5. aprofundar 3–5 cases com material real;
6. adicionar resultados apenas quando houver período/fonte/contexto verificável.


## V10 / Interactive Presence
A experiência pública foi reformulada na V10. Consulte `V10_RELEASE.md` para deploy e principais mudanças.

### V10.2 / Presence System
A revisão V10.2 amplia clareza comercial, casos Bento, amplitude digital/física e mídia real. Consulte `V10_2_RELEASE.md`.
