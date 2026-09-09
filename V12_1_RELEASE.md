# SEE7VEN V12.1 — Story + Admin Fix

## Control Room
- CSS do `/admin` agora é importado diretamente pelo módulo do painel, removendo a dependência de um import dinâmico de stylesheet separado.
- A LP continua carregando apenas `public.css`; o admin carrega `styles.css` junto com `admin.jsx`.

## Narrativa da marca
- Novo capítulo `00 / POR QUE A SEE7VEN EXISTE` logo após o Hero.
- A seção explica, em três movimentos, por que a Seeven existe: Entender → Organizar → Colocar no mundo.
- A promessa central passa a ser: o cliente chega com um objetivo; a Seeven conecta as disciplinas e garante que a marca pareça uma só.
- O Hero foi levemente reescrito para vender o resultado antes da lista de serviços.

## Infra
- Vercel, Supabase, CMS, Behance, pitch links, parceiros e contatos permanecem inalterados.

## 12.1.1 — Admin CSS hotfix

- O stylesheet completo do Control Room agora é importado estaticamente pelo entrypoint `main.jsx`.
- O Admin deixa de depender do carregamento de CSS de um chunk dinâmico.
- Isso garante que `/admin` receba o layout completo mesmo com cache/chunk splitting no Vercel.

## V12.1.3 — Admin stylesheet stability

- O CSS do Admin e o CSS público viraram assets explícitos gerenciados pelo entrypoint principal.
- O React só monta depois que o stylesheet da rota terminou de carregar.
- `/admin` recebe `admin.css`; a LP recebe apenas `public.css`.
- Remove dependência do carregamento automático de CSS em chunks dinâmicos do Vite.
