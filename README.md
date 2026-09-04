# Seeven Projects — V4 Digital Experience

Versão reconstruída com inspiração na lógica visual do projeto eGames do Behance: blocos de produto, contraste entre superfícies, métricas, cards de conteúdo e narrativa visual — reinterpretados para a identidade Seeven.

## Novidades
- Hero com mockup interativo e efeito 3D pelo mouse.
- Cursor magnético no desktop.
- Command Palette com `Ctrl/Cmd + K`.
- Showcase com projeto principal + grid de Reels.
- Filtros por cliente.
- Modal de Reels do Instagram.
- Browser de projetos com navegação anterior/próximo.
- Case study com narrativa de desafio, direção e resultado.
- LAB para experimentações.
- Botão de compartilhamento da LP.
- Mobile-first com navegação e carrosséis responsivos.
- Admin/Supabase da versão anterior preservado.

## Rodar
```bash
npm install
npm run dev
```

## Supabase
Copie `.env.example` para `.env` e configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Publicação
Antes de publicar, revise WhatsApp, métricas, URLs e capas no Admin.

> Observação: a referência visual do eGames foi usada como inspiração de composição, ritmo e interação; a implementação é uma direção própria para a Seeven.


## Como usar o Admin

Acesse `/admin`.

### Conteúdos / Reels
- **client_name**: cliente que aparece no filtro de clientes.
- **category**: categoria usada no segundo filtro (SOCIAL, CAMPANHA, EVENTO etc.).
- **title**: nome curto que aparece no card.
- **url**: URL do Reel do Instagram.
- **poster_url**: capa do Reel. Prefira o botão **Enviar arquivo de capa** para não depender de thumbnail do Instagram.
- **featured**: se marcado, o conteúdo entra primeiro no bloco de destaques.
- **active**: se desmarcado, deixa de aparecer na LP.
- **sort_order**: ordem; use os botões subir/descer na lista.

### Para trocar uma publicação de categoria
1. Abra `/admin`.
2. Clique em **Conteúdos**.
3. Clique no ícone de edição do Reel.
4. Escolha a nova categoria em **category**.
5. Confira o cliente e a URL.
6. Marque **Destaque na página** se quiser que ele apareça entre os primeiros.
7. Clique em **Salvar alterações**.

### Para trocar o cliente de um Reel
Edite **client_name** e escolha o cliente exatamente com o mesmo nome cadastrado em **Clientes**. A publicação passará automaticamente a aparecer no filtro daquele cliente.

### Para esconder sem apagar
Desmarque **Publicado na página**. O item continua salvo no Admin e pode ser reativado depois.

### Para mudar a ordem
Use **Subir** e **Descer** na lista. Isso altera o `sort_order` e a posição do conteúdo na LP.

### Capas
O upload de capa envia a imagem para o bucket público `portfolio-assets` do Supabase e grava a URL em `poster_url`. Assim a LP usa uma imagem estável, em vez de depender de uma thumbnail carregada diretamente do Instagram.
