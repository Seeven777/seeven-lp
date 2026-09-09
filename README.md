# SEE7VEN — Presence System V10.5

Landing page + portfólio + apresentação comercial + captação da Seeven.

A V10.5 preserva a infraestrutura existente de **Vercel + Supabase + Control Room** e reorganiza a experiência pública para uma jornada de descoberta: primeiro gerar curiosidade, depois explicar capacidade, provar repertório, apresentar a rede e só então pedir contato.

## Tese comercial

A Seeven conecta **estratégia, marca, produto digital, conteúdo, performance, audiovisual, tecnologia e execução física** sob uma única direção.

O visitante não precisa descobrir sozinho qual serviço contratar. Pode chegar com um objetivo, problema ou ideia; a Seeven organiza as frentes e a execução necessária.

## Jornada pública V10.5

```text
Loading 0–100
→ Gateway: quem somos / projetos / empresas & rede / ver tudo
→ Hero / promessa
→ Empresas que passaram por aqui / mapa mental em camadas
→ Entregas / capability universe
→ Um briefing, uma direção / WHY + HOW por frente
→ Physical Lab / vestuário, impresso e 3D
→ Selected Work
→ Mais marcas, mais contextos / case + site + Instagram
→ Como pensamos / Bento + Blender / 3D
→ Motion & Content / curadoria sem capas repetidas
→ Tela, rua, palco, papel / formatos sem repetir clientes
→ Creative Network / parceiros em rails cinéticos
→ Comece pelo problema
→ Contato + Brief rápido
```

## Desktop

- loader e gateway de descoberta na primeira visita da sessão;
- mapa de marcas em camadas, com empresas clicáveis;
- cards de capacidades com geometria estável;
- Presence System com contexto dinâmico de **por que** e **como** cada frente entra;
- Physical Lab interativo antes dos cases;
- cases em formato Bento;
- links públicos para site e Instagram das marcas;
- seção de formatos separada de Motion;
- rede de parceiros cinética;
- URLs compartilháveis `/work/:slug`.

## Mobile

A versão mobile é coreografada especificamente para toque:

- loader e gateway em três escolhas táteis;
- mapa de marcas mostra todas as principais empresas, sem esconder nós por CSS;
- tabs de entregas têm snap e largura suficiente para os títulos completos;
- o card de entrega mantém altura fixa ao trocar de área;
- Presence System mostra explicação antes do exemplo real;
- Physical Lab vira um palco compacto;
- projetos, marcas e formatos usam rails com snap;
- rede de parceiros não usa cards vazios;
- perguntas por problema ficam próximas da conversão;
- opções de escolha única do Brief avançam automaticamente.

## CMS / Control Room

Preservado em `/admin`.

Conteúdos públicos continuam consumindo Supabase quando configurado, com fallback local seguro. Parceiros reutilizam `public.contents` com `category = partner`, portanto **V10.5 não exige nova migration SQL**.

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
