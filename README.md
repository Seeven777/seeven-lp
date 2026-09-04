# SEE7VEN — Presence System V7.3

V7.3 transforma o portfólio em uma experiência comercial + sistema de mídia + CMS, mantendo o conceito central:

**FAZEMOS MARCAS PARAREM.**  
**Construímos presença.**  
**Do pixel ao papel.**

A direção LIGHT → DARK continua, mas a arquitetura foi endurecida para corrigir bugs de mídia, scroll longo, CMS parcial, mobile e estados sem conteúdo.

## O que mudou de verdade

### Mídia / Reels

- 32 slots continuam preservados enquanto o CMS é preenchido;
- cada Reel aceita `poster`, vídeo `.mp4/.webm` e permalink exato do Instagram;
- fallback agora segue: **poster específico do Reel → vídeo próprio → capa editorial da marca**; mídia pública genérica não é apresentada como se fosse a capa real do Reel;
- os posters editoriais locais estão em `public/portfolio/brands/`;
- preview silencioso no hover quando há arquivo de vídeo próprio;
- modal reproduz vídeo direto ou embed público do Instagram;
- Showreel fullscreen com anterior/próximo e teclado;
- mobile usa 2 colunas no arquivo audiovisual;
- vídeo em cards usa `preload="none"` para reduzir custo inicial.

### Portfólio / cases

- filtros por Estratégia, Branding, Social, Vídeo/Motion, Web e Físico/Eventos;
- cases abrem em um **Case Drawer** de tela cheia;
- URLs limpas e compartilháveis: `/work/sindpetshop-ecosystem`;
- navegação anterior/próximo entre cases;
- estrutura Desafio → Estratégia → Execução → Resultado;
- Before/After interativo no case com dados estruturados;
- o case Sindpetshop ganhou a “parte do meio” que faltava: desafio, estratégia e execução antes das métricas.


### Project Intelligence / Strategy OS

A V7.3 ganhou uma camada de case study inspirada no que funciona em portfólios de produto/UI avançados: o visitante não vê só o resultado, mas **contexto → público → insight → decisão → sistema → resultado**.

- seletor de projetos dentro de uma interface tipo produto;
- objetivo e restrição visíveis antes da solução;
- etapas de raciocínio navegáveis;
- `Project Signal` como linguagem visual de decisão, não como métrica inventada de performance;
- touchpoints por projeto;
- bloco `Project Intelligence` dentro do Case Drawer;
- campos equivalentes no Admin/Supabase para que essa camada possa ser editada sem deploy;
- referência conceitual: estudos como NEXTSTEP usam pesquisa, user persona e case study como parte central da apresentação do produto. A V7.3 adapta esse princípio ao portfólio Seeven sem copiar layout, marca ou assets.

### Reels / separação de origem e arquivo

O CMS agora separa:

- `permalink`: URL exata do Reel/Instagram;
- `video`: arquivo próprio `.mp4/.webm`;
- `poster`: capa específica;
- `url`: mantido só para compatibilidade com dados antigos.

Isso evita que o upload de um vídeo sobrescreva o link público do Reel e facilita substituir Instagram por mídia própria quando necessário.

### Capability OS

A seção de conhecimentos não usa barras de “95% de Photoshop”. Ela mostra **como as ferramentas entram no processo**.

Grupos atuais:

**Design & identidade**
- Adobe Photoshop
- Adobe Illustrator
- CorelDRAW
- Canva

**Vídeo & motion**
- Adobe Premiere Pro
- Adobe After Effects
- CapCut
- FL Studio

**3D & experimentação**
- Blender
- After Effects
- Photoshop

**Web & produto digital**
- Visual Studio / VS Code
- HTML / CSS / JavaScript
- React
- Vite
- WordPress / Elementor
- ASP.NET MVC / C#
- Supabase
- GitHub
- Vercel

**IA & automação**
- Claude
- Codex
- Gemini
- ElevenLabs
- IA generativa

A referência do Reelful foi usada somente como princípio de apresentação de capacidade por módulos, estados e workflow. Nenhum asset do projeto de terceiros é incluído no repositório.

## As 20 funções da V7.3

| # | Função | Estado |
|---|---|---|
| 1 | Media Vault | Ativa no Admin |
| 2 | Reels individualizados | Ativa / aguarda permalinks reais |
| 3 | Poster automático de vídeo | Ativa |
| 4 | Fallback inteligente de mídia | Ativa |
| 5 | Preview de vídeo no hover | Ativa |
| 6 | Showreel Mode | Ativa |
| 7 | Cases compartilháveis | Ativa em `/work/:slug` |
| 8 | Navegação contínua entre cases | Ativa |
| 9 | Pitch Mode por segmento | Ativa |
| 10 | Link personalizado por prospect | Ativa + Builder no Admin |
| 11 | Brief de 60 segundos | Ativa |
| 12 | Ecosystem Explorer | Ativa |
| 13 | Pixel → Papel scroll-driven | Ativa |
| 14 | Before / After | Ativa onde há dados estruturados |
| 15 | Métricas contextualizadas | Ativa no case principal |
| 16 | Command Palette com busca | Ativa |
| 17 | Filtros inteligentes | Ativa |
| 18 | Adaptive Motion | Ativa |
| 19 | Analytics por intenção | Ativa via `dataLayer` |
| 20 | Admin 2.3 | Ativa |

## Correções de estabilidade

- removida a dependência do header de `mix-blend-mode`;
- header identifica a fase clara/escura da seção atual;
- noise deixa de ser camada `fixed` com blend, reduzindo artefatos em páginas/capturas longas;
- `IntersectionObserver` também observa conteúdo inserido depois pelo Supabase;
- `prefers-reduced-motion`, pointer coarse e dispositivos de menor recurso ativam Motion Lite;
- CMS parcial **não apaga** automaticamente o portfólio estático: V7.3 mescla registros do Supabase com os fallbacks;
- IDs seeded dos clientes são preservados durante a migração, evitando quebrar relações entre cliente, Reel e case;
- filtros sem resultado exibem estado vazio em vez de um bloco aparentemente quebrado.

## Pitch Mode

```text
/?for=food
/?for=eventos
/?for=b2b
/?for=institucional
/?for=nightlife
```

Personalização leve:

```text
/?for=food&prospect=Empresa%20X
```

O hero reconhece o contexto e a ordem do Selected Work muda conforme o segmento.

No `/admin`, o **Pitch Link Builder** gera e copia esses links.

## Cases

URLs limpas:

```text
/work/sindpetshop-ecosystem
/work/venancio-social
/work/czk-industrial
```

A Vercel já possui rewrite SPA em `vercel.json`, então abrir uma URL de case diretamente continua carregando `index.html`.

Os cases estruturados ficam em:

```text
src/data.js → caseStudies
```

## 60 Second Brief

O CTA final abre três perguntas:

1. o que precisa mudar;
2. onde isso precisa acontecer;
3. quando o projeto deve começar.

Ao final, a mensagem é montada para WhatsApp com o contexto preenchido.

## Media Vault / Admin 2.3

Rota:

```text
/admin
```

Recursos:

- upload drag-and-drop;
- imagens e `.mp4/.webm`;
- geração de frame JPEG ao subir vídeo;
- preview da capa;
- featured / ativo / rascunho;
- busca;
- duplicação;
- reordenação;
- exportação JSON;
- indicador de readiness de mídia;
- Pitch Link Builder.

O bucket esperado é:

```text
portfolio-assets
```

Se seu schema atual ainda não tiver os campos V7.3, revise e execute:

```text
SUPABASE_V7_MIGRATION.sql
```

A migration adiciona campos sem apagar os existentes e configura o bucket/policies de mídia. Ela **não substitui** suas regras atuais de RLS das tabelas.

## Como cadastrar os 32 Reels reais

O briefing informa a distribuição dos 32 vídeos, mas não inclui os 32 permalinks/arquivos exatos. V7.3 não associa publicações aleatórias à Seeven.

Para cada item real, use o Admin:

```text
client      = sindpetshop
category    = reel
permalink   = https://www.instagram.com/reel/XXXXXXXX/
video        = https://.../portfolio-assets/video.mp4  (opcional)
poster      = https://.../portfolio-assets/...
featured    = true/false
order       = ...
```

Ou suba um `.mp4/.webm`: o Admin salva o arquivo e tenta gerar a capa automaticamente.

## CMS híbrido durante a migração

V6.1 podia substituir toda a lista estática assim que encontrasse poucos registros no Supabase. V7.3 usa um merge progressivo:

- cliente CMS sobrepõe o cliente seeded correspondente;
- projeto CMS sobrepõe o slot seeded do mesmo cliente quando aplicável;
- Reel CMS preenche os slots existentes daquele cliente;
- itens extras são adicionados;
- fallbacks permanecem até serem efetivamente substituídos.

Isso permite migrar o conteúdo aos poucos sem deixar a página pela metade.

## Behance

A parede editorial aponta para projetos públicos da própria Seeven e usa capas remotas apenas como apoio. Para produção, prefira importar cópias dos seus próprios assets para `portfolio-assets` e trocar os hotlinks.

Veja `PUBLIC_SOURCES.md` para os limites do uso de dados públicos.

## Analytics

`track()` envia para `window.dataLayer` quando disponível e dispara `seeven:analytics` localmente.

Eventos principais:

```text
page_view
case_open
case_navigate
case_source_open
work_filter
reel_open
reel_featured_open
reel_play
showreel_start
showreel_previous
showreel_next
portfolio_filter
ecosystem_touchpoint
toolchain_group
toolchain_tool
tool_evidence_open
behance_project_open
brief_started
brief_answer
brief_completed
command_palette_open
strategy_project
strategy_stage
case_share
```

## Estrutura

```text
seeven-presence-v7.3/
├── public/
│   └── portfolio/
│       ├── brands/
│       └── README.txt
├── src/
│   ├── App.jsx
│   ├── admin.jsx
│   ├── data.js
│   ├── main.jsx
│   ├── styles.css
│   ├── supabase.js
│   └── useCmsContent.js
├── .env.example
├── AUDITORIA_ESTRATEGICA.md
├── DEPLOY_CHECKLIST.md
├── PUBLIC_SOURCES.md
├── SUPABASE_V7_MIGRATION.sql
├── V7_CHANGELOG.md
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Ambiente

Copie `.env.example` para `.env.local`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_KAREN_WHATSAPP=5511XXXXXXXXX
VITE_GUSTAVO_WHATSAPP=5511XXXXXXXXX
```

## Rodar

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
git commit -m "feat: Seeven Presence System V7.3"
git push
```

Se o repositório já estiver conectado à Vercel, o push dispara o deploy.

Antes do push, siga `DEPLOY_CHECKLIST.md`.

## Prioridade de conteúdo daqui para frente

1. cadastrar os 32 permalinks/arquivos corretos;
2. subir as 32 capas reais;
3. substituir hotlinks por assets próprios;
4. cadastrar screenshots desktop/mobile dos sites;
5. adicionar métricas verificáveis aos demais cases;
6. transformar 3–5 cases em narrativas ainda mais longas quando houver material suficiente.


## V7.3 — correções visuais da captura longa

- Conteúdo `data-reveal` nunca mais fica invisível se o navegador não disparar IntersectionObserver.
- Header sem `mix-blend-mode:difference` / `filter:invert`, reduzindo glitches de composição.
- Noise global deixou de ser uma camada fixa blendada sobre todo o documento.
- Grid de Selected Work rebalanceado para eliminar órfãos e vazios.
- Motion Archive ampliado para 6 colunas no desktop e 2 no mobile.
- Strategy OS permanece legível mesmo em captura full-page.
- Case Sindpetshop recebeu ajuste de ritmo, escala tipográfica e fechamento.
- React StrictMode removido do bootstrap para evitar efeitos duplicados durante preview de desenvolvimento.
