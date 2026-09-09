# SEE7VEN Presence V7.3 — QA visual/stability

## Correções motivadas pela captura enviada

1. **Manifesto e Project Intelligence podiam desaparecer**
   - Causa: `data-reveal` começava com `opacity: 0` e dependia do IntersectionObserver.
   - Correção: conteúdo agora é visível por padrão; o observer apenas adiciona movimento.

2. **Grande vazio preto antes de “É A PROVA DA DECISÃO”**
   - Causa: o console Strategy OS estava presente no DOM, porém invisível pelo reveal.
   - Correção: Strategy OS permanece renderizado mesmo quando a captura full-page não dispara scroll/intersection.

3. **Risco de repetição/stitching em screenshot longo**
   - Reduzidos os principais gatilhos de composição: header sem `mix-blend-mode:difference`, sem `filter:invert`, noise global não-fixo e cursor sem blend mode.
   - React StrictMode removido do bootstrap para o preview de desenvolvimento não executar effects duas vezes.
   - Observação: ferramentas de captura podem ter bugs próprios; a V7.3 removeu os fatores de risco encontrados no projeto.

4. **Selected Work com buracos/órfãos no grid**
   - `grid-auto-flow:dense` + reequilíbrio dos tamanhos dos 11 projetos.
   - Linhas editoriais passam a fechar em 12 colunas.

5. **32 Reels pequenos demais**
   - Desktop: 6 colunas.
   - 1180px: 5 colunas.
   - Tablet: 4 colunas.
   - Mobile: 2 colunas.

6. **Case Sindpetshop com colisão de escala tipográfica**
   - “UM CASE DIFÍCIL” reduzido e reespaçado.
   - Fechamento “É UM SISTEMA DE COMUNICAÇÃO” recebeu layout próprio para não ficar espremido na borda.

## Validação estática

- `App.jsx`: parse JSX OK (TypeScript parser)
- `admin.jsx`: parse JSX OK
- `main.jsx`: parse JSX OK
- `data.js`: parse JS OK
- `useCmsContent.js`: parse JS OK
- `supabase.js`: parse JS OK
- `styles.css`: parse CSS OK (tinycss2)

## Limitação do ambiente

O `npm install` não concluiu porque o ambiente não acessa o registry do npm. O build Vite final deve ser validado localmente ou no Vercel com `npm install && npm run build`.
