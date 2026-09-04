# SEE7VEN — Presence V6

Redesign completo da landing page / portfólio da Seeven com foco em prospecção fria, demonstração de craft e narrativa contínua.

## Conceito

**FAZEMOS MARCAS PARAREM.**  
Não entregamos apenas peças. Construímos presença.  
**Do pixel ao papel.**

A experiência foi desenhada para começar clara, editorial e contida, e ficar progressivamente mais escura e imersiva conforme o visitante entra nos trabalhos.

## O que mudou

- Hero com tese curta e objeto 7 tridimensional em CSS.
- Narrativa LIGHT → DARK sem sensação de “seções empilhadas”.
- Portfólio editorial em formatos variados; sem grade de cards idênticos.
- 32 slots de Reels organizados por 11 clientes, com filtros e modal.
- Case Sindpetshop-SP tratado como ecossistema: estratégia → identidade → conteúdo → site → campanhas → performance → presença.
- Seção “Do pixel ao papel” com mesa de direção de arte e mockups físicos/digitais.
- Ecossistema de pontos de contato de marca.
- Serviços reorganizados por problema do cliente, não por disciplina.
- Processo estratégico explícito.
- Parede visual de projetos / Behance.
- Seeven Lab.
- Pessoas por trás da operação.
- CTA final direto para WhatsApp.
- Command Palette (`Ctrl/Cmd + K`).
- Responsivo, reduced-motion e cuidados de performance.
- `/admin` opcional com Supabase; o site público funciona sem Supabase.

## Estrutura

```text
seeven-v6/
├── public/
│   └── portfolio/          # coloque aqui posters e vídeos reais
├── src/
│   ├── App.jsx             # experiência pública
│   ├── admin.jsx           # painel opcional Supabase
│   ├── data.js             # conteúdo estático / fallback
│   ├── main.jsx
│   ├── styles.css
│   └── supabase.js
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Subir no Git / Vercel

Se você for substituir o projeto atual:

```bash
git add .
git commit -m "feat: redesign Seeven Presence V6"
git push
```

O Vercel deve detectar o commit e executar o build automaticamente.

## Reels reais — ponto mais importante

A interface já possui os 32 slots definidos em `src/data.js`. Hoje eles usam um fallback editorial intencional para não depender de thumbnails falsas.

1. Coloque os arquivos em `public/portfolio/`, por exemplo:

```text
public/portfolio/sindpetshop-01.webp
public/portfolio/sindpetshop-01.mp4
```

2. Em `src/data.js`, no item do Reel, use:

```js
poster: '/portfolio/sindpetshop-01.webp',
video: '/portfolio/sindpetshop-01.mp4',
```

Assim o card passa a mostrar a capa real e o modal reproduz o vídeo real.

## Projetos reais / Behance

Os `href: '#'` foram mantidos propositalmente onde o briefing não forneceu URL exata. Troque os links em `src/data.js` pelos projetos reais antes de publicar.

## WhatsApp

Por padrão foi mantido o número presente no projeto público atual para Karen. Recomenda-se configurar pelo Vercel:

```env
VITE_KAREN_WHATSAPP=5511XXXXXXXXX
VITE_GUSTAVO_WHATSAPP=5511XXXXXXXXX
```

Use apenas números, sem `+`, espaços ou hífens.

## Supabase / Admin

O site não exige Supabase para renderizar. Para ativar `/admin`, copie `.env.example` para `.env.local` e informe:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

O painel tenta operar as tabelas descritas no briefing (`clients`, `contents`, `projects`, `services`). Como o schema real não estava disponível no material recebido, revise nomes de colunas antes de usar escrita em produção.

## Direção para V6.1

A maior evolução restante não é adicionar mais efeitos. É substituir os fallbacks pelos assets reais:

- capas reais dos 32 Reels;
- vídeos originais;
- imagens dos projetos Behance;
- screenshots reais do site Sindpetshop em desktop/tablet/mobile;
- mockups físicos reais (crachá, folder, camiseta, banner, papelaria);
- retratos reais de Karen e Gustavo.

Com esses arquivos, a estrutura atual deixa de ser somente uma direção de alto nível e vira um portfólio com prova visual integral.
