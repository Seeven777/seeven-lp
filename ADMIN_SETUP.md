# SEE7VEN / ADMIN — configuração rápida

A tela “Supabase não configurado” significa que o `/admin` foi carregado corretamente, mas o build da Vercel não recebeu as credenciais públicas do projeto Supabase.

## Se você ainda NÃO criou um projeto Supabase

1. Acesse https://supabase.com/dashboard e crie um projeto.
2. No projeto, abra **SQL Editor**.
3. Cole e execute o arquivo `SUPABASE_V7_4_SETUP.sql` deste pacote.
4. Vá em **Authentication → Users** e crie o usuário/e-mail que será usado para entrar no `/admin`.
5. Abra **Connect** ou **Settings → API Keys**.
6. Copie:
   - Project URL;
   - Publishable key (`sb_publishable_...`).

## Vercel

No projeto da Seeven:

1. **Settings → Environment Variables**.
2. Adicione:

```text
VITE_SUPABASE_URL = https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_...
```

3. Marque **Production** e **Preview**.
4. Salve.
5. Vá em **Deployments** e faça um **Redeploy** do último commit.

Importante: em Vite, as variáveis `VITE_*` entram durante o build. Por isso é necessário redeploy depois de adicioná-las.

## Entrar

Depois do redeploy:

```text
https://SEU-DOMINIO/admin
```

Use o e-mail e senha criados em **Supabase → Authentication → Users**.

## Adicionar Reels

Abra:

```text
/admin → contents
```

Para cada Reel:

- `client`: slug do cliente, por exemplo `sindpetshop`;
- `category`: `reel`;
- `title`: nome interno;
- `permalink`: link exato do Reel do Instagram;
- `video`: opcional, arquivo `.mp4/.webm`;
- `poster`: capa;
- `featured`: Sim para aparecer nos destaques;
- `active`: Sim;
- `order`: posição.

## Adicionar projetos do Behance

Abra:

```text
/admin → behance
```

A V7.4 possui **BEHANCE WATCH**. Clique em **VERIFICAR NOVIDADES**. O painel consulta o perfil público da Seeven e mostra projetos que ainda não estão no fallback estático nem no CMS. Clique em **IMPORTAR PARA O CMS** e depois revise cliente, ferramentas, capa e ordem.

Se a consulta automática falhar por bloqueio temporário do Behance, cadastre manualmente os mesmos campos na aba Behance.
