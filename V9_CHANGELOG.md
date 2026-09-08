# SEE7VEN Presence System V9.2 — changelog

## Abertura

- home convertida em scrollytelling sticky de cinco etapas;
- stepper clicável para navegar entre etapas;
- indicador mobile `PUXE PARA DESCOBRIR`;
- `PULAR INTRO` preservado;
- prova visual com projetos/marcas no frame final;
- Journey Rail escondido durante a introdução;
- frames inativos usam `inert` + `aria-hidden`;
- navegação programática respeita reduced motion.

## Conversão

- sequência pública reduzida para uma ideia por vez;
- CTA comercial entra depois da tese, não antes;
- trabalho real aparece imediatamente após a abertura;
- flagship case e Presence Engine mantêm progressão por scroll;
- Motion/Behance abrem compactos para reduzir fadiga;
- FAQ e Brief fecham objeção e ação.

## Mobile / viewport

- narrativa própria para `100svh`;
- stepper compacto;
- densidade visual reduzida;
- regra especial para notebooks/telas de baixa altura;
- `touch-action: pan-y` nas cenas sticky.

## Código

- componentes públicos V8 não renderizados foram removidos de `App.jsx`;
- imports mortos removidos;
- backup do Control Room marcado como V9.2;
- metadados OG/canonical refinados;
- preflight atualizado para V9.2.
