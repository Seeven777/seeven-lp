# Migração V7.4 → V8

Esta é a sequência recomendada para o repositório que já está online.

## 1. Faça backup

No `/admin`, use **Backup JSON** antes de trocar o código.

Opcionalmente, exporte também as tabelas pelo Supabase.

## 2. Substitua os arquivos do projeto

Extraia o ZIP V8 e copie o conteúdo para a raiz do repositório.

Não copie `node_modules` de nenhuma máquina.

## 3. Limpe `node_modules` do Git

O repositório público atual possui `node_modules` já rastreado. O `.gitignore` sozinho não remove arquivos que já estão no histórico/índice.

Execute:

```bash
git rm -r --cached node_modules
```

Depois:

```bash
git status
```

É normal aparecer uma grande quantidade de arquivos de `node_modules` como removidos.

## 4. Instale e valide localmente

```bash
npm install
npm run preflight
npm run build
```

Se o build falhar, não faça o deploy até entender o erro.

## 5. Execute a migration V8 no Supabase

Abra:

**Supabase → SQL Editor**

Cole e execute:

```text
SUPABASE_V8_MIGRATION.sql
```

Execute apenas uma vez no upgrade normal.

A migration:

- cria `cms_admins`;
- preserva automaticamente o administrador quando existe exatamente uma conta em Authentication;
- restringe escrita a administradores explícitos;
- mantém leitura pública de itens publicados;
- permite que o Admin leia rascunhos;
- restringe upload/alteração/exclusão do Media Vault;
- adiciona `stack` em `services`;
- cria triggers de `updated_at`;
- cria índices de leitura/ordenação.

## 6. Outro usuário administrativo

Primeiro crie a conta em:

**Supabase → Authentication → Users**

Depois, no SQL Editor:

```sql
insert into public.cms_admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('OUTRO_EMAIL@EXEMPLO.COM')
on conflict (user_id) do update set email = excluded.email;
```

## 7. Confirme as variáveis da Vercel

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

A Secret Key nunca deve ser colocada no frontend.

## 8. Commit

```bash
git add .
git commit -m "feat: Seeven Presence System V8"
git push
```

## 9. Pós-deploy

Teste:

- `/`
- `/admin`
- `/work/sindpetshop-ecosystem`
- `/?for=food`
- mobile 360–430 px
- desktop 1366 px+
- login do Admin
- edição + limpeza de campo
- upload de imagem
- Reel com permalink
- Behance Watch
- Brief → WhatsApp

## Fresh install

Em um Supabase vazio:

1. execute `SUPABASE_V8_BOOTSTRAP.sql`;
2. crie o usuário em Authentication;
3. entre em `/admin`;
4. se necessário, autorize a conta em `cms_admins` usando o SQL mostrado pela própria tela de acesso.

Não execute a migration de upgrade em um banco que já foi criado pelo bootstrap V8.
