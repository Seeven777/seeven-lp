# Seeven — Digital Portfolio Experience v3

LP + portfolio editorial + showreel + case study + admin CMS.

## O que mudou
- Showreel com 3 trabalhos em destaque.
- Showcase reduzido inicialmente para uma seleção de trabalhos; botão para explorar todos.
- Filtros por cliente.
- Capas locais para os 17 Reels iniciais, eliminando dependência de thumbnails do Instagram.
- Admin com upload de capa para Reels e projetos.
- Reordenação de itens pelo painel.
- Portfólio editorial com 3 projetos em destaque + coleção complementar.
- Cases em modal e Reels em modal sem abandonar a LP.
- Supabase Storage `portfolio-assets` para capas enviadas pelo Admin.

## Rodar localmente
```bash
npm install
npm run dev
```

## Supabase
Crie um projeto no Supabase e execute `supabase/schema.sql` no SQL Editor.
Depois configure:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Não coloque service role key no frontend.

## Admin
Acesse `/admin`.
Com Supabase configurado, o login usa Supabase Auth.
Sem Supabase, o painel abre em modo local apenas para pré-visualização; alterações não são persistentes.

## Publicação
1. Substitua o projeto atual pelo conteúdo desta pasta.
2. Configure as variáveis no Vercel.
3. Faça deploy.
4. Crie o usuário administrador no Supabase Auth.
5. No Admin, substitua as capas editoriais iniciais pelas capas reais dos Reels.
