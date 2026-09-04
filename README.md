# SEE7VEN — Portfolio Digital V5

Versão portfolio-first da Seeven Projects: o trabalho ocupa o centro da experiência, com arquivo filtrável, cases, projetos Behance, motion de scroll, Command Palette, modais de mídia e CMS/Admin preservado.

## Contatos
- Karen: +55 11 97149-3985
- Gustavo: +55 11 92062-6850

## Rodar
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## CMS / Supabase
As estruturas anteriores de `src/admin.jsx`, `src/assets.js`, `src/supabase.js` e `supabase/schema.sql` foram preservadas. O Admin continua permitindo editar clientes, conteúdos, categorias, capas, destaque/publicação, ordem, projetos e serviços.

### Capas dos Reels
Os arquivos em `public/assets/posters/` são capas editoriais de fallback. Para usar a capa real de um Reel, abra `/admin` e preencha `poster_url` com a URL da imagem/capa ou faça upload pelo fluxo de assets do Supabase.

## Direção V5
- portfolio-first
- editorial grid
- arquivo de 32 Reels
- filtros por cliente, categoria e busca
- projetos Behance em wall visual
- case Sindpetshop-SP com dados reais fornecidos
- CTA separado para Karen e Gustavo
- mobile-first
- scroll reveal + parallax + microinterações
- Command Palette com Ctrl/Cmd + K
