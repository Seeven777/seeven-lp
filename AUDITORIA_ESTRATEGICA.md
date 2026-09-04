# Auditoria estratégica — SEE7VEN Presence System V7.2

## Diagnóstico da V6.1

A identidade visual já tinha força, mas quatro problemas criavam a sensação de página “bugada” ou “pela metade”:

1. **mídia sem fonte real:** os 32 slots existiam, mas sem os 32 posters/permalinks individuais;
2. **CMS parcialmente migrado:** poucos registros do Supabase podiam substituir listas estáticas inteiras;
3. **composição pesada em página longa:** fixed layers + blend modes aumentavam risco de glitches em captura/mobile;
4. **narrativa interrompida:** alguns blocos chegavam ao conceito e pulavam direto para a conclusão.

## Decisão de produto

A V7.2 não tenta resolver essas lacunas adicionando apenas mais efeitos. A regra agora é:

**ESTABILIDADE → CONTEÚDO REAL → PROVA → INTERAÇÃO → CONVERSÃO**

O site passa a atuar como:

- portfólio;
- sistema de cases;
- arquivo audiovisual;
- showreel;
- capability map;
- ferramenta de prospecção;
- mini-brief;
- CMS de mídia.

## Correções da captura longa

O código anterior continha elementos fixed com blend/compositing durante uma página muito extensa. Isso não significava necessariamente que o React estivesse duplicando seções, mas era uma fonte plausível de artefatos em long screenshots e certos browsers.

V7.2:

- remove o blend do header;
- troca o noise global fixed por camada do documento;
- usa detecção explícita de fase clara/escura;
- cria Motion Lite em dispositivos menos adequados a efeitos pesados.

## Reels / capas

A correção central é separar **slot de conteúdo** de **mídia real**.

Cada Reel pode ter:

- poster;
- arquivo de vídeo;
- permalink;
- cliente;
- categoria;
- título;
- featured;
- ordem.

Enquanto o asset real não existe, o visitante vê a identidade da marca e não um retângulo vazio.

Isso não substitui as capas originais. É um fallback temporário deliberado.

## CMS híbrido

A migração de conteúdo não precisa mais acontecer toda de uma vez.

V7.1 preserva o portfólio seeded e sobrepõe os dados do Supabase progressivamente. Esse detalhe é importante porque evita a situação em que cadastrar 3 Reels no banco faz os outros 29 desaparecerem.

## Cases

Selected Work deixa de ser apenas uma grade que joga o visitante para Instagram.

A camada de case responde:

1. qual era o problema;
2. qual decisão organizou o trabalho;
3. o que foi executado;
4. qual foi o resultado;
5. qual presença pública pode ser consultada.

Isso é especialmente importante no Sindpetshop, onde o valor do trabalho está na integração de diferentes jornadas e não em uma única peça.

## Reelful / Capability OS

O projeto Reelful foi analisado como referência de **linguagem de produto**: módulos, hierarquia, estados e fluxo. A Seeven adapta essa lógica para apresentar repertório técnico.

Por isso o visitante não recebe “20 logos de programas”. Ele pode navegar por capacidades e entender como Photoshop, After Effects, Blender, React, Supabase, Codex etc. entram em entregas diferentes.

## As 20 funções

As 20 funções propostas foram transformadas em recursos ativos ou infraestrutura concreta. O único bloqueio relevante que permanece é conteúdo proprietário que ainda não foi fornecido, sobretudo os 32 Reels/capas exatos.

Ver tabela de status no `README.md`.

## Próximo salto qualitativo

A partir daqui, a maior evolução não virá de mais JavaScript. Virá de **substituir fallbacks por provas reais**:

- 32 capas;
- 32 permalinks/arquivos;
- screenshots de sites;
- mockups físicos reais;
- 3–5 cases com processo e métricas documentadas.

Com isso, a mesma arquitetura deixa de apenas parecer avançada e passa a carregar evidência suficiente para sustentar a promessa comercial.


## NEXTSTEP / case study como produto

A referência NEXTSTEP reforça uma lacuna que ainda existia: portfólios fortes de UI/UX não tratam pesquisa, público e decisão como bastidores descartáveis. Eles fazem isso virar parte da própria apresentação. O projeto público é categorizado no Behance com **user persona, research e Case Study**, além de landing page, Web Design, UI/UX e Mobile app.

A V7.2 traduz esse princípio para uma agência multidisciplinar por meio do **Project Intelligence / Strategy OS**. O visitante consegue alternar projetos e percorrer:

**Contexto → Público → Insight → Decisão → Sistema → Resultado**

A intenção é resolver a sensação de “informação pela metade”: em vez de mostrar uma estética forte e pular direto para o resultado, a página revela a lógica que conectou problema e execução.

O mesmo raciocínio entra dentro dos cases e no Admin 2.3, para que novos projetos possam receber esse nível de profundidade sem alteração de código.

## V7.2 — correção adicional do Motion Archive

O fallback anterior podia usar a mesma mídia pública de um cliente em vários slots e dar a impressão de que aquela imagem era a capa específica de cada Reel. Isso foi corrigido.

Agora:

- `poster` = capa específica do Reel;
- `video` = arquivo próprio;
- `permalink` = URL pública específica;
- ausência de poster = **capa editorial claramente marcada como pendente**, usando a identidade da marca apenas como apoio visual.

Essa distinção é menos “mágica”, porém comercialmente e tecnicamente mais correta.
