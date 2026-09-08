# SEE7VEN V9.3 / ADMIN — configuração

A rota administrativa é:

```text
/admin
```

## Projeto existente (seu caso)

Você já configurou a URL/Publishable Key e o login do Supabase. Para atualizar da V7.4 para a V8:

1. Faça **Backup JSON** no Control Room atual.
2. Abra **Supabase → SQL Editor**.
3. Execute **uma vez**:

```text
SUPABASE_V8_MIGRATION.sql
```

4. Faça o deploy da V9.3.
5. Entre em `/admin`.

A migration cria `cms_admins` e restringe a edição a administradores explícitos. Se houver apenas um usuário em Authentication, ele é preservado automaticamente. Se houver mais de um, o próprio `/admin` mostra o SQL para autorizar a conta correta.

## Instalação nova

Se for um Supabase vazio, use:

```text
SUPABASE_V8_BOOTSTRAP.sql
```

Depois:

1. crie o usuário em **Authentication → Users**;
2. entre em `/admin`;
3. se a conta ainda não estiver em `cms_admins`, copie o SQL mostrado na tela de acesso e execute no SQL Editor.

## Variáveis Vercel

```text
VITE_SUPABASE_URL = https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_...
VITE_KAREN_WHATSAPP = 55...
VITE_GUSTAVO_WHATSAPP = 55...   # opcional
```

Use Production + Preview e faça redeploy depois de alterar qualquer variável `VITE_*`.

Nunca use a Secret Key em variável exposta ao navegador.

## Adicionar Reel em poucos segundos

No Instagram:

**Reel específico → Compartilhar → Copiar link**

No Control Room:

```text
/admin → Reels & mídia → QUICK ADD / REEL
```

Escolha a marca, cole:

```text
https://www.instagram.com/reel/XXXXXXXX/
```

e salve.

Depois edite o item para adicionar:

- capa real;
- MP4/WebM próprio, se existir;
- destaque;
- ordem.

## Behance

```text
/admin → Behance → VERIFICAR NOVIDADES
```

O Behance Watch compara o perfil público da Seeven com o CMS. Quando detectar algo novo:

1. abra o projeto para conferir;
2. importe;
3. revise título, cliente, ferramentas, capa e ordem;
4. publique.

Se o Behance bloquear temporariamente a consulta automática, o cadastro manual continua disponível.
