# SEE7VEN — Presence System V8

V8 é uma revisão estrutural da LP/portfólio e do CMS. O objetivo não é adicionar mais efeitos: é tornar a experiência mais clara, estável, convincente e fácil de manter.

**Posicionamento central**

- FAZEMOS MARCAS PARAREM.
- Construímos presença.
- Do pixel ao papel.
- Uma marca. Vários pontos de contato.

## O que mudou na V8

### LP / conversão

A sequência pública foi reorganizada para funcionar como argumento comercial:

`impacto → repertório → posicionamento → trabalhos → case → audiovisual → método → digital/físico → ecossistema → problemas de negócio → capacidades → Behance → objeções → pessoas → contato`

Principais mudanças:

- hero com proposta de valor + dois CTAs claros;
- faixa de marcas logo no início;
- manifesto com contraste previsível (sem texto claro sobre fundo claro);
- filtros de portfólio por **taxonomia + curadoria**, permitindo que projetos novos do CMS entrem nas categorias;
- cada filtro tem contexto, contagem e composição visual própria;
- cases em `/work/:slug` com desafio → estratégia → execução → resultado;
- Before/After de 0% a 100%, com botões Antes / Comparar / Depois;
- Motion Archive distingue mídia real de presença editorial: Play só aparece quando existe vídeo ou permalink reproduzível;
- case Sindpetshop separa escala pública do cliente de performance de conteúdo;
- Decision System mostra contexto, público, insight e decisão sem inventar KPIs;
- Pixel → Papel e Ecosystem Explorer simplificados no mobile;
- Capability OS mostra como ferramentas entram no processo — sem barras arbitrárias de “95%”;
- soluções vendidas pelo problema do empresário, não por nomes de serviços;
- FAQ reduz objeções antes do contato;
- Brief de 60 segundos monta a conversa no WhatsApp;
- CTA persistente e simples no mobile.

### Mobile

A V8 não tenta reproduzir o desktop em miniatura:

- tipografia limitada por `clamp()`;
- Selected Work vira uma coluna;
- Reels ficam em duas colunas;
- órbita de touchpoints vira grade tocável;
- Strategy/Capability OS viram navegação horizontal + conteúdo vertical;
- Before/After recebe controles explícitos;
- CTA persistente no rodapé;
- Motion Lite respeita `prefers-reduced-motion`, ponteiro coarse e dispositivos modestos.

### Estabilidade

- removido `mix-blend-mode` do layout;
- removido `filter: invert()` estrutural;
- não existe camada global fixa com blend;
- conteúdo `data-reveal` é visível por padrão — animação é enhancement, não requisito;
- Error Boundary público;
- CMS parcial preserva os fallbacks estáticos;
- Admin e LP são carregados em chunks separados;
- API Behance possui timeout, validação de domínio e resposta sanitizada;
- preflight automático detecta regressões conhecidas.

## Control Room / `/admin`

A tela administrativa foi reconstruída como **Seeven Control Room**.

### Visão geral

O dashboard mostra:

- projetos publicados;
- Reels realmente reproduzíveis;
- quantidade de capas próprias;
- arquivo Behance;
- problemas de saúde do conteúdo;
- sequência recomendada de trabalho.

### Editor

O formulário deixou de ser uma parede única de campos.

**Reels**
- Geral
- Mídia
- Publicação

**Projetos**
- Geral
- Mídia
- Case
- Intelligence
- Publicação

**Clientes**
- Geral
- Presença
- Publicação

Recursos:

- cliente por seletor;
- upload drag-and-drop;
- validação de tipo/tamanho;
- MP4/WebM com geração automática de poster;
- preview de mídia;
- detecção de alterações não salvas;
- apagar um campo agora grava `NULL` no Supabase (em vez de ignorar a alteração);
- rascunho/publicação;
- reordenação;
- duplicação em rascunho;
- busca;
- backup JSON de todas as tabelas;
- Pitch Link Builder;
- Behance Watch;
- Reel Link Manager com instruções dentro do painel.

## Segurança V8

V7.4 permitia escrita para qualquer conta autenticada no projeto Supabase. V8 restringe o CMS a usuários registrados em:

```text
public.cms_admins
```

A função:

```text
public.is_seeven_admin()
```

é usada nas policies de tabelas e Storage.

### Upgrade da V7.4

Execute **uma vez**:

```text
SUPABASE_V8_MIGRATION.sql
```

A migration preserva automaticamente o usuário existente somente quando o projeto possui exatamente uma conta em Authentication. Se houver mais de uma, o `/admin` fornece o SQL específico para autorizar a conta correta.

Para outro usuário, veja `MIGRATION_V8.md`.

## Behance Watch

No Control Room:

```text
/admin → Behance → VERIFICAR NOVIDADES
```

O backend consulta o perfil público da Seeven, compara URLs já conhecidas e permite importar projetos novos.

APIs:

```text
/api/behance-profile
/api/behance-meta?url=...
```

Elas não usam chave secreta do Behance e não inserem automaticamente um projeto sem sua ação no Admin.

## Reels: como funciona

Os 32 slots do briefing continuam preservados. Para transformar um slot em mídia real, cadastre:

```text
permalink = https://www.instagram.com/reel/XXXXXXXX/
poster    = capa real do Reel
video     = MP4/WebM próprio (opcional)
```

Regras públicas:

1. `video` próprio → player direto;
2. permalink exato → embed do Instagram;
3. poster sem player → capa editorial;
4. sem mídia real → apenas presença da marca, sem fingir que é um vídeo reproduzível.

Veja `ADMIN_GUIDE.md`.

## Pitch Mode

```text
/?for=food
/?for=eventos
/?for=b2b
/?for=institucional
/?for=nightlife
```

Com prospect:

```text
/?for=food&prospect=Empresa%20X
```

O Control Room possui um builder para copiar esses links.

## Analytics

`track()` envia eventos ao `window.dataLayer` quando disponível e também dispara `seeven:analytics`.

Eventos centrais:

```text
page_view
work_filter
case_open
case_navigate
strategy_project
strategy_stage
ecosystem_touchpoint
tool_evidence_open
behance_project_open
brief_started
brief_answer
brief_completed
ui_error
```

## Estrutura

```text
seeven-presence-v8/
├── .github/workflows/quality.yml
├── api/
│   ├── behance-meta.js
│   └── behance-profile.js
├── public/portfolio/brands/
├── scripts/preflight.mjs
├── src/
│   ├── App.jsx
│   ├── admin.jsx
│   ├── data.js
│   ├── main.jsx
│   ├── styles.css
│   ├── supabase.js
│   └── useCmsContent.js
├── ADMIN_GUIDE.md
├── MIGRATION_V8.md
├── QA_V8.md
├── SUPABASE_V8_BOOTSTRAP.sql
├── SUPABASE_V8_MIGRATION.sql
├── package.json
├── vercel.json
└── vite.config.js
```

## Ambiente

`.env.local`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_KAREN_WHATSAPP=5511XXXXXXXXX
VITE_GUSTAVO_WHATSAPP=5511XXXXXXXXX
```

Nunca use `SUPABASE_SECRET_KEY` em uma variável `VITE_*`.

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


### `package-lock.json`

O pacote final não inclui um lockfile gerado neste ambiente porque o registry do npm ficou indisponível durante o QA. No seu repositório, gere um lockfile novo antes do commit final:

```bash
rm -f package-lock.json
npm install
npm run build
git add package-lock.json
```

Isso também substitui o lockfile antigo do repositório, que pertence à configuração anterior do projeto.

## Git / Vercel

O repositório público atual ainda possui `node_modules` versionado. Antes do commit da V8, remova-o do índice:

```bash
git rm -r --cached node_modules
git add .gitignore
git add .
git commit -m "feat: Seeven Presence System V8"
git push
```

O `.gitignore` da V8 impede que `node_modules`, `dist`, `.vercel` e `.env.*` retornem ao Git.

Siga `MIGRATION_V8.md` e `DEPLOY_CHECKLIST.md` antes do push.
