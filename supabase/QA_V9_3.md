# SEE7VEN Presence System V9.3 — QA

## Escopo

V9.3 mantém o scrollytelling V9.2 e adiciona progressive disclosure para reduzir a quantidade de informação visível simultaneamente.

## Verificações V9.3

- `RevealMore` presente e baseado em `details/summary`;
- Selected Work: 4 cards desktop / 3 mobile antes de expandir;
- Motion Archive: 4 desktop / 2 mobile;
- Behance: 4 desktop / 2 mobile;
- contexto de filtros recolhido;
- contexto completo do flagship case recolhido;
- explicação do Presence Engine recolhida;
- FAQ recolhido por padrão;
- pessoas recolhidas por padrão;
- pós-contato recolhido por padrão;
- cards de projeto não exibem parágrafos longos na grade;
- mobile preserva toque e leitura sem obrigar expansão.

## Comandos

```bash
npm install
npm run preflight
npm run build
```

## Resultado esperado do preflight

```text
SEE7VEN V9.3 / PREFLIGHT OK
```

## Banco

Nenhuma nova migration é exigida em relação à V9.2. A V9.3 altera a experiência pública e a versão do Control Room, não o schema.
