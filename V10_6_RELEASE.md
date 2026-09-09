# SEE7VEN V10.6 — Desktop Art Direction

Esta versão preserva o fluxo mobile da V10.5 e refaz a direção de arte desktop para aumentar clareza, prova e exploração.

## O que mudou

- mapa de empresas ganhou inspector contextual com Case, Site e Instagram;
- archive desktop virou grid editorial com informações e links no hover;
- os três Selected Work são reservados como flagship e deixam de reaparecer imediatamente no arquivo de marcas;
- a frase genérica `Destaque da marca` foi eliminada;
- Motion prioriza mídia CMS real e, no fallback, usa uma curadoria de contextos únicos por cliente;
- a seção de formatos deixou de reutilizar capas do portfólio e passou a usar cinco composições próprias: Tela, Rua, Palco, Papel e Objeto;
- Physical Lab e Thinking Bento usam estudos generativos de 3D para evitar repetir a mesma capa de Blender;
- parceiros viraram um marquee cinético único, clicável e pausável no desktop;
- o card de entregas tem geometria fixa e um signal visual que muda junto com a área selecionada;
- a seção `Um briefing. Uma direção.` ganhou melhor hierarquia desktop mantendo o contexto dinâmico por frente;
- tipografia, espaçamento e densidade desktop foram recalibrados para não parecer uma versão ampliada do mobile;
- gateway usa chave de sessão V10.6 para que a nova experiência seja apresentada uma vez após o deploy.

## Infraestrutura preservada

- Vercel
- Supabase
- `/admin` / Control Room
- Behance Watch
- CMS e fallbacks
- 25 parceiros
- contatos de Gustavo e Karen

Não há migration SQL nova.

## Deploy

Substitua os arquivos do repositório pelos deste pacote, confirme que `node_modules` não está versionado, faça commit e push. O Vercel conectado fará o novo build automaticamente.
