# SEE7VEN V7.2 — QA / Entrega

## Validações executadas neste ambiente

- JSX/JS: parse estático com TypeScript (`--allowJs --jsx react --noResolve`) sem erros de sintaxe.
- CSS: parse completo com PostCSS sem erros.
- Dados estáticos: 32 slots de Reels, 11 clientes, 11 projetos selecionados, 5 perfis de Project Intelligence e 6 estágios estratégicos.
- Assets locais: fallback SVG presente para as 11 marcas cadastradas.
- Rotas SPA: `vercel.json` mantém rewrite para `index.html`, incluindo `/work/:slug`.
- Arquivo final: testado com `unzip -t` após empacotamento.

## Correções importantes da V7.2

1. `poster`, `video` e `permalink` de Reel são campos independentes.
2. Uma imagem genérica da marca não é mais apresentada como se fosse a capa real do Reel.
3. Slots sem mídia real exibem estado editorial explícito (`POSTER PENDENTE`).
4. Showreel só fica disponível quando existe mídia reproduzível.
5. Header não depende de `mix-blend-mode` para trocar contraste entre light/dark.
6. Conteúdo carregado pelo CMS passa pelo observador de reveal mesmo quando chega depois do primeiro render.
7. Mobile Reel Grid usa densidade reduzida e Motion Lite em dispositivos apropriados.
8. Project Intelligence separa contexto, público, insight, decisão, sistema e resultado.
9. Métricas/“signals” conceituais são rotulados como mapa visual e não como KPI.
10. Admin 2.3 recebeu campos para intelligence, mídia e permalinks reais.

## Dependência de conteúdo que não pode ser inventada

O briefing informa que existem 32 Reels, mas não fornece os 32 permalinks/arquivos/capas correspondentes. Portanto, os slots continuam preparados para substituição pelo Media Vault, sem atribuir publicações aleatórias como trabalho da SEE7VEN.

Para finalizar cada Reel no Admin, preencher preferencialmente:

- `client`
- `permalink` (Instagram Reel exato)
- `video` (`.mp4/.webm`, se houver cópia própria)
- `poster`
- `title`
- `featured`
- `order`

## Limitação do ambiente de validação

Este ambiente não possui `node_modules` do projeto e não consegue resolver o registro npm externo. Por isso, não foi possível executar aqui o build real do Vite com `npm install && npm run build`.

Antes do push no Git/Vercel, execute localmente:

```bash
npm install
npm run build
npm run dev
```

Depois siga `DEPLOY_CHECKLIST.md`.
