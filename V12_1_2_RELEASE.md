# SEE7VEN V12.1.2 — Stabilization

Esta release não altera o visual aprovado. O objetivo é isolar definitivamente a LP pública do Control Room.

## O que mudou

- `/` e `/work/...` carregam apenas `public-entry.jsx` + `public.css` + `App.jsx`.
- `/admin` carrega apenas `admin-entry.jsx` + `admin.css` + `admin.jsx`.
- `main.jsx` virou apenas um roteador de bootstrap e não importa CSS global.
- `styles.css` deixou de participar do runtime; `admin.css` é a folha exclusiva do Control Room.
- Rotas abaixo de `/admin/` também usam o entrypoint administrativo.
- Preflight atualizado para validar os dois entrypoints isolados e `admin.css`.

## Objetivo

Preservar simultaneamente a LP pública da V12.1 e o Control Room estilizado, sem vazamento de CSS entre os dois ambientes.
