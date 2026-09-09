# SEE7VEN V11 — Rebuilt Discovery Experience

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

O rodapé mostra discretamente `V11.0`, o que facilita confirmar visualmente que o deploy novo está ativo.
