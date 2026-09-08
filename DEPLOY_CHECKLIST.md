# SEE7VEN V9.2 — Deploy checklist

## Git

- [ ] `node_modules` não está rastreado
- [ ] `dist` não está rastreado
- [ ] `.env` / `.env.local` não estão rastreados
- [ ] arquivos V7/V8 legados foram removidos quando possível
- [ ] `git status` revisado

Se necessário:

```bash
git rm -r --cached node_modules
```

## Build

```bash
npm install
npm run preflight
npm run build
```

- [ ] preflight OK
- [ ] Vite build OK
- [ ] sem erro crítico no console

## Vercel

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_KAREN_WHATSAPP`
- [ ] `VITE_GUSTAVO_WHATSAPP` se utilizado
- [ ] Production + Preview
- [ ] redeploy após alterar variável VITE

## LP / desktop

- [ ] StoryIntro completa 01–05
- [ ] stepper muda de etapa
- [ ] Pular intro leva a Trabalhos
- [ ] prova visual do frame 05 aparece
- [ ] 1366×768 sem corte
- [ ] 1440×900 sem corte
- [ ] filtros mudam a curadoria
- [ ] Case Drawer + `/work/:slug`
- [ ] case Sindpetshop 4 etapas
- [ ] Presence Engine 5 etapas
- [ ] Motion Archive
- [ ] Behance
- [ ] FAQ
- [ ] Brief / WhatsApp

## LP / mobile

- [ ] 360×800
- [ ] 390×844
- [ ] 430×932
- [ ] texto não estoura
- [ ] swipe vertical funciona nas cenas sticky
- [ ] stepper não cobre informação importante
- [ ] filtros tocáveis
- [ ] Reels em duas colunas
- [ ] CTA inferior não cobre o conteúdo
- [ ] Brief funciona por toque

## Admin

- [ ] `/admin` login
- [ ] dashboard
- [ ] novo Reel
- [ ] permalink exato do Reel
- [ ] poster
- [ ] upload MP4/WebM
- [ ] novo projeto
- [ ] draft/publicação
- [ ] reordenar
- [ ] Behance Watch
- [ ] Backup JSON
- [ ] Pitch Link Builder

## Supabase

Se o banco já recebeu V8, não rode migration novamente.

Caso ainda seja V7.4:

```text
SUPABASE_V8_MIGRATION.sql
```
