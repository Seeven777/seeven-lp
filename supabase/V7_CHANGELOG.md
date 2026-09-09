# SEE7VEN Presence System — V7.2 Changelog

## Estabilidade

- header claro/escuro sem `mix-blend-mode`;
- ruído global não é mais layer fixed de blend;
- IntersectionObserver acompanha conteúdo assíncrono;
- Motion Lite automático por preferência/dispositivo;
- mobile Reel Grid padronizado em 2 colunas;
- estado vazio para filtros;
- vídeos de hover passam a usar `preload="none"`.

## CMS

- merge progressivo entre Supabase e fallbacks locais;
- IDs seeded de clientes preservados durante migração;
- projetos e Reels podem ser migrados aos poucos sem apagar o restante do portfólio;
- migration SQL adicionada.

## Portfólio

- filtros inteligentes;
- Case Drawer completo;
- clean URLs `/work/:slug`;
- anterior/próximo por teclado e interface;
- Desafio → Estratégia → Execução → Resultado;
- Before/After estruturado;
- Sindpetshop ganhou narrativa intermediária e contexto de métricas.

## Motion Archive

- fallback: poster → mídia pública → brand poster → editorial;
- posters locais para as 11 marcas;
- preview de vídeo no hover;
- modal de Reel;
- embed do Instagram quando o permalink é exato;
- Showreel fullscreen;
- tracking de anterior/próximo.

## Capability OS

Conhecimentos organizados por workflow:

- Photoshop;
- Illustrator;
- CorelDRAW;
- Canva;
- Premiere Pro;
- After Effects;
- CapCut;
- FL Studio;
- Blender;
- Visual Studio / VS Code;
- React;
- Vite;
- Supabase;
- GitHub;
- Vercel;
- Claude;
- Codex;
- IA generativa.

## Prospecção

- Pitch Mode;
- prospect no Hero;
- ordem de cases por segmento;
- Pitch Link Builder no Admin;
- brief de 60 segundos;
- WhatsApp preenchido.

## Admin 2.2

- Media Vault;
- drag-and-drop;
- poster automático de vídeo;
- preview;
- readiness;
- busca;
- ordenação;
- duplicar;
- rascunho/ativo;
- exportar JSON;
- campos ampliados de clientes/projetos.

## Conteúdo ainda necessário

A aplicação está preparada, mas V7.1 não inventa:

- os 32 permalinks exatos;
- as 32 capas originais;
- métricas não fornecidas/verificadas;
- imagens de cases que ainda não foram disponibilizadas pelo proprietário do projeto.

## V7.2 — Product Case Study / NEXTSTEP pass

- nova seção **Project Intelligence / Strategy OS**;
- cases passam a expor contexto, público, insight, decisão, sistema e resultado;
- painel de inteligência dentro do Case Drawer;
- botão para copiar deep link do case;
- Admin 2.3 com campos de Project Intelligence;
- migration Supabase ampliada para os novos campos;
- `permalink`, `video` e `poster` separados no CMS de Reels;
- upload de vídeo não sobrescreve mais o permalink público;
- fallback dos 32 Reels deixa de repetir a mesma imagem pública como se fosse capa real;
- capas sem asset específico passam a ser editoriais, com identidade visível e estado `POSTER PENDENTE`;
- header desktop deixa definitivamente de usar `mix-blend-mode` / `filter` e passa a responder ao phase detector;
- pesquisa/estratégia passam a ser tratadas como parte do portfólio, não como texto auxiliar;
- referência NEXTSTEP registrada apenas como inspiração de estrutura de case study e produto — sem copiar layout ou assets.


## V7.3 — Stability & Visual Polish

- Reveal passou de mecanismo de visibilidade para enhancement de animação.
- Corrigidos vazios aparentes no Manifesto e Project Intelligence em capturas longas.
- Removido blend/invert do header e blend fixo do noise global.
- Grid Selected Work densificado e tamanhos reequilibrados.
- Motion Archive aumentado visualmente.
- Case Sindpetshop refinado.
- Bootstrap sem StrictMode para preview mais previsível.

## V7.4 — Commercial Clarity / Admin Recovery

- contraste do manifesto corrigido;
- filtros passam a exibir curadoria, contagem, descrição e nova composição;
- Before/After expandido para 0–100;
- escala tipográfica revisada;
- Brand Ecosystem reorganizado e redesenhado no mobile;
- Selected Work em coluna única no mobile;
- CTA comercial fixo no mobile;
- suporte a `VITE_SUPABASE_PUBLISHABLE_KEY`;
- diagnóstico guiado quando o Supabase não estiver conectado;
- `behance_items` adicionado ao CMS;
- Visual Archive passa a aceitar projetos do Behance via Supabase;
- novo `SUPABASE_V7_4_SETUP.sql` para bootstrap completo.
