# SEE7VEN V8.0.1 — Vercel build hotfix

O preflight da V8.0 confundia arquivos instalados durante o build com arquivos versionados no repositório.

## Corrigido

- `node_modules/` não interrompe mais o preflight depois de `npm install`;
- `SUPABASE_V7_4_SETUP.sql` legado virou aviso, não erro de build;
- `vite build` usa o binário padrão do npm;
- versão do pacote: `8.0.1`.

## Limpeza recomendada no Git

Execute uma vez no seu repositório:

```bash
git rm -r --cached node_modules
git rm --ignore-unmatch SUPABASE_V7_4_SETUP.sql
git add .gitignore
git commit -m "fix: clean legacy files and Vercel preflight"
git push
```

O `.gitignore` da V8 já impede que `node_modules` volte a ser adicionado.
