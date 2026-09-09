# Migração SEE7VEN V7.4 → V8.0.1

Este projeto já possui Supabase configurado na V7.4. Para atualizar sem apagar conteúdo, use **SUPABASE_V8_MIGRATION.sql**.

## 1. Faça backup

No Control Room, exporte o backup JSON antes da migration. No Supabase, confirme que o projeto correto está aberto.

## 2. Atualize o código

Substitua os arquivos da aplicação pelos da V8.0.1. Ao atualizar um repositório existente, arquivos antigos não são apagados automaticamente apenas porque não existem no ZIP novo.

Faça a limpeza uma vez:

```bash
git rm -r --cached node_modules
git rm --ignore-unmatch <arquivo-setup-legado-v7.4>.sql
git rm --ignore-unmatch qa-prototype.html
git add .gitignore
```

Se `node_modules` não estiver rastreado, o primeiro comando pode apenas informar que não encontrou arquivos; isso não é problema.

## 3. Supabase existente

No SQL Editor execute:

```text
SUPABASE_V8_MIGRATION.sql
```

A migration preserva as tabelas existentes e acrescenta a camada V8, incluindo autorização administrativa por `cms_admins` / `is_seeven_admin()`.

**Não execute `SUPABASE_V8_BOOTSTRAP.sql` sobre a instalação V7.4 existente.**

## 4. Instalação nova do zero

Somente para um projeto Supabase novo, sem a estrutura anterior, use:

```text
SUPABASE_V8_BOOTSTRAP.sql
```

Depois crie o usuário em Authentication e autorize-o como administrador conforme `ADMIN_SETUP.md`.

## 5. Variáveis Vercel

Mantenha:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_KAREN_WHATSAPP=...
VITE_GUSTAVO_WHATSAPP=...
```

Nunca coloque uma Secret Key em variável `VITE_*`.

## 6. Build local

```bash
npm install
npm run preflight
npm run build
```

Na V8.0.1, a presença de `node_modules` após `npm install` não é mais tratada como erro. Arquivos legados de documentação também não interrompem um deploy de produção, embora devam ser removidos do Git.

## 7. Commit

```bash
git add .
git commit -m "fix: SEE7VEN V8.0.1 Vercel build"
git push
```

Com o projeto conectado à Vercel, o push dispara o novo deploy.
