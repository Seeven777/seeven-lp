# SEE7VEN Presence System V9.2 — QA

## Jornada esperada

```text
StoryIntro
→ Selected Work
→ Flagship Case
→ Presence Engine
→ Motion Archive
→ Behance
→ Why Seeven
→ Pessoas
→ Contato
```

## V9.2 — pontos verificados

- abertura sticky em cinco estados;
- stepper da abertura navegável;
- `PULAR INTRO`;
- CTA somente no frame final;
- prova visual no último frame;
- `inert` + `aria-hidden` para frames inativos;
- reduced-motion também desativa smooth scroll programático;
- Journey Rail some durante a abertura para não competir com o hero;
- regras específicas para telas desktop de baixa altura;
- mobile usa `PUXE PARA DESCOBRIR` e stepper compacto;
- Selected Work abre compacto;
- Case Sindpetshop continua sticky;
- Presence Engine substitui seções redundantes;
- Motion Archive não cria Play falso;
- Behance abre compacto e expande sob demanda;
- CTA mobile começa apenas perto do portfólio;
- deep links `/work/:slug` preservados.

## Integridade de conteúdo

- 11+ clientes seeded;
- 11+ projetos selecionados;
- 32 slots de Reel preservados;
- 11 fallbacks locais de marca;
- 6 curadorias de portfólio distintas;
- LP pública solicita somente conteúdo ativo/publicado.

## Segurança

- frontend usa Publishable Key;
- `SUPABASE_SECRET_KEY` não aparece no bundle público;
- `/admin` recebe `noindex`/`no-store`;
- RLS V8 usa `cms_admins` + `is_seeven_admin()` quando migration aplicada;
- bucket público lê assets, escrita exige Admin.

## Validação automática

A release deve passar:

```text
npm run preflight
Node syntax / APIs
JSX transpile syntax
CSS parse
JSON parse
secret scan
ZIP integrity
```

## QA manual pós-deploy

### Desktop

- 1366×768;
- 1440×900;
- 1920×1080.

Validar:

- cinco frames da abertura;
- stepper;
- Pular intro;
- header e contraste light/dark;
- filtros;
- Case Drawer;
- Flagship Case;
- Presence Engine;
- Motion Archive;
- Behance;
- FAQ;
- Brief;
- contato.

### Mobile

Testar pelo menos:

- 360×800;
- 390×844;
- 430×932.

Validar:

- swipe vertical não bloqueado;
- nenhum texto cortado;
- stepper não sobrepõe CTA/texto;
- títulos não extrapolam viewport;
- filtros horizontais;
- cards;
- Reels em duas colunas;
- Case Drawer;
- brief;
- CTA inferior.

### Admin

- login;
- dashboard;
- Quick Reel;
- CRUD;
- limpar campo e salvar;
- draft/publicação;
- upload de imagem;
- upload de vídeo;
- geração de poster;
- reordenar;
- Behance Watch;
- backup JSON;
- Pitch Link Builder.

## Resultado do ciclo final neste ambiente

A release passou em:

```text
SEE7VEN V9.2 / PREFLIGHT OK
✓ 11 clientes
✓ 12 projetos selecionados
✓ 32 slots de Reel
✓ 11 fallbacks locais de marca
✓ 6 curadorias distintas
```

Também passaram:

- sintaxe Node/JS das APIs, data, Supabase, CMS e preflight;
- transpile de `App.jsx`, `admin.jsx` e `main.jsx`;
- CSS com 0 erros de parsing e chaves balanceadas;
- `package.json` válido;
- `vercel.json` válido;
- scan de tokens secretos concretos.

### Build Vite

Foi tentado `npm install && npm run build`, mas o ambiente de montagem não conseguiu concluir o download das dependências dentro do limite disponível. Nenhum `node_modules` parcial ficou no pacote.

A validação final de bundling deve ocorrer localmente ou na Vercel:

```bash
npm install
npm run preflight
npm run build
```
