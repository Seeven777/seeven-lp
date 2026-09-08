# SEE7VEN V9.2 — Banco / migração

A V9.2 altera a experiência pública e **não exige alteração de schema** depois da camada CMS/segurança V8.

## Se o `/admin` já funciona com `cms_admins`

Não execute migration nova por causa da V9.2.

Confirme apenas:

- `cms_admins` existe;
- `is_seeven_admin()` existe;
- bucket `portfolio-assets` existe;
- usuário correto está autorizado;
- LP pública lê apenas itens ativos;
- escrita exige Admin.

## Se o banco ainda estiver na V7.4

1. faça Backup JSON no Control Room;
2. Supabase → SQL Editor;
3. execute uma vez:

```text
SUPABASE_V8_MIGRATION.sql
```

## Instalação nova

Use somente em Supabase vazio:

```text
SUPABASE_V8_BOOTSTRAP.sql
```

Depois crie o usuário em Authentication e autorize-o em `cms_admins`.

## Variáveis Vercel

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_KAREN_WHATSAPP=55...
VITE_GUSTAVO_WHATSAPP=
```

Nunca coloque Secret/Service Role em variável `VITE_*`.
