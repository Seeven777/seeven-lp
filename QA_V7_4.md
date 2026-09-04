# QA — SEE7VEN V7.4

## Validações executadas

- `App.jsx`: parser JSX/ES2022 — OK
- `admin.jsx`: parser JSX/ES2022 — OK
- `main.jsx`: parser JSX/ES2022 — OK
- `data.js`: parser ES2022 — OK
- `useCmsContent.js`: parser ES2022 — OK
- `supabase.js`: parser ES2022 — OK
- `styles.css`: parse com tinycss2 — 0 erros

## Mudanças verificadas por código

- Supabase aceita `VITE_SUPABASE_PUBLISHABLE_KEY` e fallback `VITE_SUPABASE_ANON_KEY`.
- `/admin` possui diagnóstico das variáveis ausentes.
- Nova tabela CMS `behance_items` integrada ao front-end.
- Before/After usa range 0–100.
- Filtros possuem descrição e contagem; layout filtrado recebe nova composição.
- Manifesto não usa mais texto de destaque transparente no fundo claro.
- Mobile Selected Work = 1 coluna.
- Mobile Ecosystem = grade interativa, sem colisão orbital.
- Mobile CTA fixo adicionado.

## Limitação do ambiente

`npm install` não concluiu neste ambiente por timeout de acesso ao registry, então o build Vite completo não foi executado aqui. Antes do deploy, rodar localmente:

```bash
npm install
npm run build
```

Se o build local passar, fazer o push normalmente.

## Behance / Admin V7.4

- `behance_items` integrado ao CMS.
- `/api/behance-profile` adicionado para detectar URLs públicas novas do perfil Seeven.
- `/api/behance-meta` adicionado para preencher título/capa via Open Graph quando disponível.
- Admin `BEHANCE WATCH` compara projetos detectados com fallbacks + banco antes de sugerir importação.
- `vercel.json` agora preserva `/api/*` e faz rewrite SPA apenas de `/admin` e `/work/:slug`.
