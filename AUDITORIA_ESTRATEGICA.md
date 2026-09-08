# Auditoria estratégica — SEE7VEN V8

## Problema que a V8 resolve

As versões anteriores tinham boas ideias visuais, mas alguns elementos competiam com a compreensão:

- tipografia extrema em determinados breakpoints;
- contraste inconsistente;
- filtros com pouca sensação de mudança;
- muitas seções funcionando como demonstração técnica ao mesmo tempo;
- fallbacks de Reel parecendo mídia real;
- motion e composição criando risco de bugs em captura/scroll longo;
- Admin com aparência de CRUD e formulário excessivamente longo;
- segurança Supabase permissiva para qualquer usuário autenticado;
- documentação acumulada e `node_modules` rastreado no Git.

A V8 prioriza **clareza → prova → profundidade → ação**.

## Princípios usados

### 1. Trabalho antes de discurso

Selected Work aparece cedo. O visitante deve perceber repertório antes de ler uma longa lista de serviços.

### 2. Case é uma história comercial

Projeto forte responde:

`qual era o problema → qual decisão foi tomada → como foi executada → o que mudou`

A estética é apresentada como consequência, não como justificativa suficiente.

### 3. Prova sem inventar prova

A V8 não adiciona depoimentos fictícios, clientes não confirmados ou métricas não suportadas.

- escala do Sindpetshop = contexto público do cliente;
- métricas de agosto/2026 = performance identificada pelo recorte fornecido;
- Capability OS diferencia uso/ferramenta de evidência pública.

### 4. Problema antes do nome do serviço

Empresário não deveria precisar decidir entre “branding”, “LP”, “motion” e “tráfego” antes de explicar o que está errado.

A seção de soluções começa por frases como:

- Quero vender mais.
- Minha marca está ultrapassada.
- Ninguém entende o que eu faço.
- Preciso parecer maior.
- Preciso chamar atenção.

### 5. Mobile é outra composição

No celular, a V8 troca complexidade espacial por interação direta:

- órbita → grid;
- mosaico → uma coluna;
- painéis laterais → fluxo vertical;
- CTA final distante → ação persistente.

### 6. Motion é enhancement

Nada importante depende de IntersectionObserver para existir.

Se animação falhar ou o usuário pedir reduced motion, a informação continua acessível.

## Repositório

Auditoria pública realizada sobre:

`https://github.com/Seeven777/seeven-lp`

O branch main ainda expõe `node_modules` rastreado e documentação de versões V7 antigas. A V8 entrega `.gitignore`, Quality Gate e instruções explícitas para limpar o índice.

## Behance

Perfil observado:

`https://www.behance.net/wedeseeven`

A indexação pública recente já mostra novos projetos além do seed estático, incluindo trabalhos de eventos, web, 3D, food e identidade. A V8 não tenta congelar essa lista em código: o Behance Watch existe justamente para detectar/importar novas publicações.

## O que foi removido ou reduzido

- efeitos globais de blend/invert;
- dependência visual de conteúdo escondido por observer;
- promessa de “32 vídeos reproduzíveis” enquanto os permalinks não existem;
- textos internos de fallback nos SVGs;
- formulário administrativo monolítico;
- escrita Supabase para qualquer conta autenticada;
- documentação V7 redundante no pacote final.

## O que foi acrescentado

- Client Rail;
- filtros dinâmicos;
- Case Drawer mais claro;
- Reel readiness honesto;
- Decision/FAQ;
- Brief de 60 segundos;
- Control Room;
- Content Health;
- editor por etapas;
- Behance Watch;
- RLS administrativo explícito;
- preflight;
- GitHub Actions Quality Gate;
- guia de migração.

## Prioridade de conteúdo após o deploy

1. colocar capa real nos cases mais importantes;
2. cadastrar os permalinks corretos dos Reels;
3. transformar 3–5 projetos em cases completos;
4. importar os novos projetos Behance;
5. substituir hotlinks por arquivos próprios;
6. adicionar provas/métricas somente quando verificáveis.
