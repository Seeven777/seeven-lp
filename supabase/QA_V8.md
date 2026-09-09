# SEE7VEN Presence System V8 — QA final

Data da revisão: 2026-09-08

## Escopo validado

A revisão cobre a LP pública, rotas de case, experiência mobile, Control Room (`/admin`), integração Supabase, Media Vault, Behance Watch, Vercel e higiene do repositório.

## Resultado dos testes estáticos

### Dados / curadoria

- 11 clientes seeded: OK
- 12 projetos em Selected Work: OK
- 32 slots de Reel: OK
- 11 fallbacks locais de marca: OK
- 6 filtros com conjuntos diferentes: OK
- IDs duplicados em clientes/projetos/Reels: não encontrados
- referências de `clientId` inválidas: não encontradas

### JavaScript / JSX

- `src/*.js`, `api/*.js`, `scripts/*.mjs` e `vite.config.js`: `node --check` aprovado
- `App.jsx`, `admin.jsx` e `main.jsx`: parser TypeScript em modo JSX aprovado
- `package.json`: JSON válido
- `vercel.json`: JSON válido

### CSS

- parsing com `tinycss2`: 0 erros
- chaves balanceadas: OK
- `mix-blend-mode`: não usado
- `filter: invert()`: não usado
- `content-visibility:auto`: não usado
- conteúdo `data-reveal` visível por padrão: OK
- Before/After: handle ligado a `--ba` real, incluindo 0% e 100%

### Segurança / frontend

- `SUPABASE_SECRET_KEY` não aparece no bundle do navegador
- `/admin` recebe `X-Robots-Tag: noindex, nofollow, noarchive`
- headers `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`: configurados
- LP pública consulta explicitamente apenas conteúdo `active=true/null`
- RLS V8 restringe escrita via `cms_admins` / `is_seeven_admin()`
- Media Vault usa a mesma autorização administrativa

### Admin / Control Room

Validado em código:

- login com erros amigáveis
- validação de permissão administrativa
- dashboard de completude editorial
- Quick Add de Reel
- editor por abas
- limpar campo envia `NULL`
- upload de imagem/vídeo
- tentativa de geração automática de poster de vídeo
- estados Publicado/Rascunho separados de Pronto/Pendente
- duplicação cria rascunho
- reordenação normaliza ordens duplicadas
- Backup JSON
- Pitch Link Builder
- Behance Watch
- links contextuais para abrir mídia/case/Behance/presença
- foco preso em dialogs/drawers + ESC
- mensagens de status com `aria-live`

## Correções específicas de regressões relatadas

- texto claro sobre fundo claro: contraste passou a ser determinado pela fase clara/escura da seção
- filtros que pareciam iguais: cada filtro possui curadoria e composição próprias
- Before/After cortado: slider vai de 0 a 100 e o handle chega às bordas sem cortar o botão
- Reels sem capa real: fallback é identificado como presença editorial e não como vídeo confirmado
- arquivo Motion deixa de limitar artificialmente a 32 itens quando o CMS crescer
- Behance expandido mostra todos os itens carregados, não apenas os primeiros 24
- Vídeo/Embalagem no ecossistema: mobile vira grid; desktop usa posições explícitas
- tipografia mobile: limites específicos por breakpoint
- CTA mobile: aparece após o primeiro trecho e some próximo ao contato
- cases agora possuem CTA contextual antes de anterior/próximo

## SQL

Revisão estática:

- `SUPABASE_V8_MIGRATION.sql`: BEGIN/COMMIT presentes, blocos `$$` balanceados
- `SUPABASE_V8_BOOTSTRAP.sql`: BEGIN/COMMIT presentes, blocos `$$` balanceados
- migration de upgrade e bootstrap novo estão separados

A execução real do SQL deve ocorrer no Supabase do projeto, conforme `MIGRATION_V8.md`.

## Build npm

O build Vite completo não pôde ser executado neste ambiente porque `npm install` não conseguiu acessar/concluir o registry dentro do tempo disponível. A tentativa foi realizada e expirou por timeout.

Por isso, antes do push final no seu Git:

```bash
rm -f package-lock.json
npm install
npm run preflight
npm run build
```

Depois adicione o `package-lock.json` novo ao commit.

Essa é a única validação técnica relevante que permanece obrigatoriamente local/CI.

## Git atual auditado

O `main` público consultado durante esta revisão ainda exibe `node_modules` rastreado e documentação acumulada da V7. O pacote V8 não contém `node_modules` e inclui `.gitignore` + Quality Gate.

Antes do commit:

```bash
git rm -r --cached node_modules
```

## QA pós-deploy recomendado

Testar em Production e Preview:

- `/`
- `/admin`
- `/work/sindpetshop-ecosystem`
- `/?for=food`
- `/?for=eventos&prospect=Empresa%20Teste`
- viewport 360, 390, 430, 768, 1366 e 1920 px
- login / logout
- novo Reel com permalink
- upload de capa
- rascunho não aparece na LP
- publicação aparece sem novo deploy
- Behance Watch
- Before/After 0 / 50 / 100
- Brief → WhatsApp
- Console sem erro crítico

## Status da release

**Release candidate consolidada.**

A V8 está pronta para migração e deploy após o `npm install && npm run build` local e execução da migration Supabase.
