# SEE7VEN V10.2 — Presence, clearer and deeper

Esta revisão mantém a infraestrutura do projeto (Vercel, Supabase, Control Room `/admin`, CMS, Behance e analytics) e evolui a experiência pública.

## O que mudou

- Hero reposicionado para deixar claro em poucos segundos que a Seeven atua do digital ao físico.
- Nova seção `O que fazemos` com seis áreas: Estratégia & Marca, Digital & Produto, Conteúdo & Performance, Motion & Audiovisual, Físico & Experiência e Tecnologia & Automação.
- Presence System agora também funciona por hover/foco/toque e relaciona cada disciplina a um projeto visual.
- Selected Work prioriza mídia real já existente no CMS/Behance em vez de identidades abstratas quando há material disponível.
- Nova seção `Como pensamos` inspirada em estudos de caso Bento: problema → decisão → sistema.
- Cases abrem uma narrativa Bento mais profunda usando `caseStudies` + `projectIntelligence` já existentes no projeto.
- Motion deixou de exibir apenas placeholders “7”: os posters locais agora são usados como fallback.
- Nova parede `Do digital ao físico`, usando projetos reais do Behance para demonstrar amplitude de execução.
- CTA final ganhou atalhos por necessidade e continua levando ao brief rápido/WhatsApp.
- Brief ampliado para site/sistema, campanha/mídia, impresso/evento e tecnologia/automação.
- Responsividade refeita para as novas composições; mobile usa scroll horizontal/touch quando isso é mais natural que reduzir o desktop.
- `prefers-reduced-motion` preservado.

## Contatos

- Direção — Gustavo: +55 11 92062-6850
- Novos projetos — Karen: +55 11 97149-3985

## Deploy

O pacote não inclui `node_modules`.

1. Substitua os arquivos do repositório pelos deste pacote.
2. Preserve no Vercel as variáveis atuais de Supabase e demais integrações.
3. Rode `npm install` em um ambiente limpo.
4. Rode `npm run build`.
5. `git add -A`
6. `git commit -m "feat: Seeven V10.2 presence system"`
7. `git push`

O deploy do Vercel continua sendo disparado pelo repositório conectado.

## Validação feita nesta entrega

- `node scripts/preflight.mjs`: OK
- Sintaxe JSX validada em `App.jsx`, `admin.jsx` e `main.jsx` com parser TypeScript local: OK
- `node_modules` ausente do pacote final

O build completo não foi executado neste ambiente porque não há acesso funcional para instalar as dependências npm nativas do Vite/Rollup. O Vercel instalará as dependências do zero no ambiente de build.
