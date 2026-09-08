# SEE7VEN V8 — Deploy Checklist

## Antes do commit

- [ ] Backup JSON feito no Control Room
- [ ] `node_modules` removido do índice do Git
- [ ] `.env` / `.env.local` não versionados
- [ ] lockfile antigo removido/regenerado (`rm -f package-lock.json && npm install`)
- [ ] `npm run preflight` passou
- [ ] `npm run build` passou
- [ ] nenhum link secreto/credencial inserido no source

### Limpar node_modules rastreado

```bash
git rm -r --cached node_modules
rm -f package-lock.json
npm install
```

O `npm install` gera um lockfile novo compatível com React 19, Supabase e Vite 7 usados pela V8.

## Supabase

- [ ] `SUPABASE_V8_MIGRATION.sql` executado uma vez
- [ ] `cms_admins` contém o usuário correto
- [ ] login em `/admin` funciona
- [ ] Admin consegue visualizar rascunhos
- [ ] Admin consegue editar/publicar
- [ ] upload no bucket `portfolio-assets` funciona
- [ ] usuário autenticado não autorizado não consegue escrever

## Vercel

Variáveis públicas esperadas:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_KAREN_WHATSAPP
VITE_GUSTAVO_WHATSAPP (opcional)
```

- [ ] Production
- [ ] Preview
- [ ] novo deploy após alteração de variável VITE

Nunca use `SUPABASE_SECRET_KEY` com prefixo `VITE_`.

## QA da LP

Desktop:

- [ ] hero legível
- [ ] manifesto sem branco sobre branco
- [ ] todos os filtros mudam a curadoria
- [ ] cases abrem e fecham
- [ ] URL `/work/:slug` abre direto
- [ ] Before/After chega a 0 e 100
- [ ] Motion Archive só mostra Play onde há mídia reproduzível
- [ ] Ecosystem sem colisão entre labels
- [ ] FAQ abre/fecha
- [ ] Brief monta WhatsApp
- [ ] Behance abre apenas links reais

Mobile 360–430 px:

- [ ] nenhum texto estoura horizontalmente
- [ ] menu abre/fecha
- [ ] filtros possuem scroll horizontal
- [ ] cards ficam em uma coluna
- [ ] Reels em duas colunas
- [ ] Before/After utilizável por toque
- [ ] Ecosystem vira grid
- [ ] Capability/Strategy navegáveis
- [ ] CTA inferior não cobre conteúdo crítico

## QA do Admin

- [ ] dashboard carrega
- [ ] nova mídia
- [ ] novo projeto
- [ ] limpar campo e salvar
- [ ] rascunho não aparece na LP
- [ ] publicar aparece sem deploy
- [ ] duplicar cria rascunho
- [ ] reordenar funciona
- [ ] upload de imagem
- [ ] upload de vídeo + tentativa de poster
- [ ] Behance Watch
- [ ] Backup JSON
- [ ] Pitch Link Builder

## Depois do deploy

- [ ] `Ctrl+Shift+R` e teste em janela anônima
- [ ] DevTools Console sem erro crítico
- [ ] Network sem 401/403 inesperado
- [ ] teste com login e sem login
- [ ] teste de um link de prospecção
