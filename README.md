# SEE7VEN — Creative Presence Studio

Site público + portfólio + ferramenta de captação da Seeven.

A proposta da V11 é simples: um prospect recebe o link e consegue descobrir, sem uma apresentação paralela, **quem é a Seeven, o que ela consegue construir, com quais empresas já trabalhou, como pensa, como coordena diferentes frentes, quais parceiros ampliam a execução e como iniciar um projeto**.

## Jornada pública V11

```text
Loading 0–100
→ Gateway: Quem somos / Projetos / Empresas & rede / Ver experiência completa
→ Hero: tudo que uma marca precisa
→ Atlas: empresas que passaram por aqui
→ O que fazemos: 6 frentes, 1 card de geometria estável
→ Método: briefing → direção → produção → presença
→ Selected Work: 3 cases fortes
→ Public Presence Index: Case / Site / Instagram
→ Creative Lab: material / 3D / motion
→ Como pensamos: contexto / protótipo / sistema / entrega
→ Creative Network: parceiros em marquee cinético
→ Começar pelo problema
→ Contato + Brief rápido
```

## Desktop

O desktop usa hover, cursor contextual, sticky storytelling, mapa em camadas, grids editoriais, painéis fixos e mudança de estado sem reflow.

## Mobile

O mobile não é o desktop comprimido. Tabs e galerias viram rails com snap; mapas viram uma composição tocável; cards mantêm proporção estável; o header libera espaço ao rolar.

## CMS / Control Room

O painel permanece em `/admin`. O conteúdo público continua consumindo Supabase quando configurado, com fallback local seguro.

## Contatos

- Gustavo — Direção — +55 11 92062-6850
- Karen — Novos projetos — +55 11 97149-3985

## Desenvolvimento

```bash
npm install
npm run preflight
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

O repositório segue preparado para Vercel. Após o push na branch conectada, o deploy é automático.

Não versione `node_modules/`, `dist/`, `.env` ou `.env.local`.
