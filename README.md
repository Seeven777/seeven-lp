# Seeven LP / Portfolio v2.1

Landing page + portfolio showcase + admin CMS foundation.

## O que entrou nesta versão

- Showcase com 17 Reels cadastrados.
- Posters configuráveis por conteúdo (`poster_url`).
- Modal para assistir cada Reel dentro da LP.
- Portfólio com capas reais dos projetos do Behance.
- Modal de projeto com capa, categoria, descrição e botão para abrir o Behance.
- `/admin` para clientes, conteúdos, portfólio e serviços.
- Campos de capa de projeto, poster de Reel e descrição de projeto.
- Supabase opcional para persistência e autenticação.
- Fallback local: o site funciona mesmo antes de configurar o Supabase.
- Layout responsivo e mobile-first.

## Rodar

```bash
npm install
npm run dev
```

## Admin

Abra `/admin`.

Sem Supabase, o painel funciona em modo local apenas para visualização/estrutura; para salvar alterações permanentemente, configure o Supabase.

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Crie um usuário de autenticação para o administrador.
4. Copie `.env.example` para `.env`.
5. Preencha:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

6. Na Vercel, adicione as mesmas variáveis em Project Settings > Environment Variables.

Nunca coloque a `service_role` key no frontend.

## WhatsApp

O número atual no `src/main.jsx` é `5511971493985`. Altere se necessário antes da publicação.
