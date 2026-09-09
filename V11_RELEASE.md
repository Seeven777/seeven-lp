# SEE7VEN V11.4 — Interaction & Clarity Polish

Esta versão substitui a lógica visual da V10 no site público. O Control Room, Supabase, Vercel e as rotas existentes foram preservados.

## O que a V11 resolve

- Desktop reconstruído de verdade, não apenas ampliado a partir do mobile.
- Mobile continua com uma coreografia própria para toque.
- Entrada 0–100% seguida por três caminhos de descoberta: Quem somos, Projetos e Empresas & rede.
- Hero explica de forma imediata a amplitude da Seeven.
- Empresas entram em um atlas mental em camadas, com Case, Site e Instagram.
- Áreas de atuação usam um card de geometria fixa; trocar de disciplina não altera a altura do painel.
- Método transforma “um briefing, uma direção” em quatro movimentos explicados: Briefing, Direção, Produção e Presença.
- Selected Work fica restrito a três cases fortes; o arquivo de empresas depois é textual e não repete as mesmas capas.
- Creative Lab unifica físico, prototipagem/Blender e motion em uma única seção, evitando três galerias parecidas.
- Motion deduplica capa e cliente antes de usar fallback.
- Formatos aparecem como espectro (Tela → Rua → Palco → Papel → Objeto), sem repetir clientes.
- Parceiros viraram duas linhas cinéticas e clicáveis para Instagram.
- A etapa “começar pelo problema” fica próxima da conversão.
- Brief rápido avança automaticamente nas perguntas de escolha única.

## Integrações preservadas

- Vercel e deploy automático
- Supabase / CMS
- `/admin` / Control Room
- Behance Watch
- URLs `/work/:slug`
- Gustavo: +55 11 92062-6850
- Karen: +55 11 97149-3985

## Banco de dados

Nenhuma migration nova é necessária para publicar a V11.

## Deploy

```bash
npm install
npm run preflight
npm run build
git add -A
git commit -m "feat: Seeven V11 rebuilt discovery experience"
git push
```

Não envie `node_modules`, `dist` ou arquivos `.env` para o Git.

## Performance da experiência pública

A V11 separa o CSS público do CSS legado/administrativo. A home carrega `src/public.css` (~75 KB) e o Control Room continua carregando `src/styles.css` separadamente. Isso evita transferir centenas de KB de estilos históricos para cada prospect.

O rodapé mostra discretamente `V11.1`, o que facilita confirmar visualmente que o deploy novo está ativo.

## Ajustes V11.1

- Remove a sobreposição do card Eazy Club sobre o núcleo da SEE7VEN no atlas de empresas.
- Melhora legibilidade e contenção de textos em cards, listas e blocos de pensamento.
- Troca o mock falso da camisa por uma cena Spline incorporada na aba Material.
- Adiciona a seção `Sites no ar` com previews ao vivo dos projetos web enviados.
- Atualiza a navegação principal para incluir o novo bloco de sites.


## Ajustes V11.2

- Reestrutura o hero mobile em fluxo vertical para evitar sobreposição em aparelhos menores.
- Define margens seguras e escalonamento tipográfico para faixas abaixo de 900px, 480px, 390px e 360px.
- Remove o comportamento de órbita absolutamente posicionada nos celulares menores e passa a revelar o bloco visual abaixo do texto principal.
- Refina o hero também em tablets intermediários para reduzir colisões entre tipografia e visual orbital.

## Ajustes V11.3

- Corrige colisões de texto no card de capacidades e nos cards de processo.
- Troca o protótipo 3D por uma cena Spline interativa com o foguete indicado.
- No atlas mobile, empresas passam a ocupar duas colunas e a seleção rola automaticamente até o detalhe da marca.
- Nos filtros de `O que fazemos` e `Creative Lab`, tocar em uma opção no mobile revela automaticamente o card atualizado.
- `Mais marcas. Mais contextos.` deixa de repetir a lista anterior e vira um carrossel rotativo de presença pública, com Case, Site e Instagram por marca.
- Adiciona progresso visual e controles anterior/próximo ao carrossel de empresas.

## Ajustes V11.4 — Production polish

- Autoplays do hero e do carrossel público deixam de trabalhar quando a seção está fora da viewport e respeitam `prefers-reduced-motion`.
- O carrossel centraliza somente dentro do próprio trilho, sem interferir na posição vertical da página.
- Menu mobile fecha com `Esc` e recebeu relações ARIA mais claras.
- Adicionado atalho de teclado “Pular para o conteúdo”.
- Safe areas de iPhone/iPad aplicadas ao header, menu, overlays e rodapé.
- Áreas horizontais receberam overscroll containment e touch targets mais confortáveis.
- Estados de foco, hover e pressão foram refinados sem alterar a direção visual aprovada.
- Hover dos projetos web ficou mais responsivo, mantendo fallback completo para touch/reduced motion.

### Ajustes adicionais de produção

- Evita layout shift ao abrir menu, case ou brief bloqueando o scroll sem remover visualmente a largura da barra do navegador.
- Scroll-driven scenes só calculam progresso enquanto estão próximas da viewport.
- Cliques em Case, Site, Instagram, sites publicados e parceiros agora entram no `dataLayer` para leitura de interesse comercial.
