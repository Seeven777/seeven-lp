# SEE7VEN — Presence System V10.4

Landing page + portfólio + apresentação comercial da Seeven.

A V10.4 mantém a infraestrutura existente de **Vercel + Supabase + Control Room** e concentra a evolução na experiência pública, principalmente no mobile: menos repetição, menos scroll obrigatório e mais exploração por toque, swipe e progressive disclosure.

## Tese comercial

A Seeven conecta **estratégia, marca, produto digital, conteúdo, performance, audiovisual, tecnologia e execução física** sob uma única direção.

O visitante não precisa saber o nome do serviço antes de entrar em contato. Pode chegar com um objetivo, problema ou ideia; a Seeven organiza a combinação necessária.

## Jornada pública V10.4

```text
Hero / promessa
→ Entregas / capability universe
→ Como conectamos / system
→ Selected Work
→ Arquivo compacto de marcas
→ Como pensamos / Bento
→ Comece pelo problema
→ Motion & Content
→ Formato não é limite
→ Creative Network / parceiros
→ Contato + Brief 60s
```

### Desktop

- storytelling por scroll sem scroll hijacking;
- Presence System visual e interativo;
- cases em formato Bento;
- arquivo editorial de marcas;
- rede de parceiros;
- URLs compartilháveis `/work/:slug`.

### Mobile

A versão mobile não é apenas o desktop empilhado:

- header se recolhe ao rolar para baixo e retorna ao subir;
- Hero mais curto e com orbit contido no viewport;
- áreas de atuação em tabs horizontais nativas;
- Presence System vira ferramenta de toque em vez de sticky de múltiplas telas;
- Selected Work vira rail com snap;
- arquivo de marcas vira índice compacto;
- Bento mantém a direção visual com cartões swipeáveis;
- soluções por problema usam seleção horizontal + uma única resposta;
- Motion, prova e parceiros usam rails táteis;
- contato não repete a lista de serviços — as escolhas ficam no Brief.

## CMS / Control Room

Preservado em `/admin`.

Conteúdos públicos continuam consumindo Supabase quando configurado, com fallback local seguro. Parceiros reutilizam `public.contents` com `category = partner`, portanto **V10.4 não exige nova migration SQL**.

## Contatos

- Gustavo — Direção — +55 11 92062-6850
- Karen — Novos projetos — +55 11 97149-3985

## Deploy

O projeto continua preparado para deploy automático no Vercel após push no repositório conectado.

```bash
npm install
npm run preflight
npm run build
```

Não versione:

- `node_modules/`
- `dist/`
- `.env`
- `.env.local`

## Variáveis de ambiente

Use `.env.example` como referência. As integrações existentes de Supabase/Vercel foram preservadas.
