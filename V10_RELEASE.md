# SEE7VEN V10 — Interactive Presence

Esta versão reformula a experiência pública e preserva a infraestrutura existente de Vercel, Supabase e `/admin`.

## Principais mudanças
- Nova home em dark editorial com linguagem de creative studio.
- Hero scrollytelling com transformação de mensagem em Presence Network.
- Presence System interativo e responsivo.
- Selected Work orientado a projeto, com visual adaptado à cor/identidade do cliente.
- Novo Case Study em Bento, sem remover o conteúdo existente no CMS.
- Capabilities com progressive disclosure em vez de grade de serviços estática.
- Motion Archive contínuo.
- Novo CTA final e brief de 4 passos integrado ao WhatsApp.
- Contatos fallback: Gustavo (+55 11 92062-6850) e Karen (+55 11 97149-3985).
- Mobile redesenhado como experiência própria, não apenas desktop empilhado.
- `prefers-reduced-motion` preservado.
- robots.txt e sitemap.xml adicionados.
- `node_modules` removido do pacote de entrega.

## Deploy
1. Substitua os arquivos do repositório pelos deste pacote.
2. Certifique-se de que `node_modules/` antigo não seja commitado. Caso já esteja rastreado: `git rm -r --cached node_modules`.
3. `git add -A`
4. `git commit -m "feat: Seeven V10 interactive presence"`
5. `git push`

O Vercel deverá instalar as dependências e executar `npm run build` automaticamente.

## Variáveis existentes
As integrações Supabase continuam usando as mesmas variáveis Vite já utilizadas pelo projeto. Os números de WhatsApp têm fallback no frontend, mas podem continuar sendo gerenciados por variáveis se desejado em versões futuras.
