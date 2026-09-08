# SEE7VEN V10.3 — Network & Clarity

Esta versão mantém Vercel, Supabase, Control Room, Behance Watch e o deploy atual. O foco é deixar a experiência mais clara comercialmente sem perder o caráter de portfólio interativo.

## O que mudou

- Hero mais autoexplicativo: uma direção para branding, web, conteúdo, motion, performance, tecnologia e físico.
- Orbit inicial agora usa marcas válidas/curadas, evitando títulos de projeto como se fossem clientes.
- Presence System ganhou exemplos reais, mídia em destaque, CTA para abrir o raciocínio e menos aparência de diagrama abstrato.
- Reentrada do arquivo visual de marcas, inspirado no grid que já havia funcionado bem nas versões anteriores.
- Motion Archive deixa de depender visualmente dos posters genéricos locais: quando não há mídia própria, usa o arquivo Behance/cliente como referência visual.
- Case final ganhou entregáveis, contexto e CTA mais estruturado.
- URLs `/work/:slug` agora realmente abrem o case correspondente; voltar/avançar do navegador também funciona.
- Metadata e canonical são atualizados por case no cliente; sitemap inclui os cases seeded.
- CMS passa a ser autoridade quando uma tabela já possui conteúdo publicado; o fallback não repõe automaticamente um item que foi despublicado.
- Nova seção **Creative Network** com 25 parceiros e links diretos para Instagram.
- Nova aba **Parceiros** no Control Room, usando a tabela `contents` com `category=partner`; nenhuma migration nova é obrigatória.
- Quick Add de parceiro no Admin.
- Dashboard do Control Room passa a sinalizar quando a rede ainda está apenas no fallback.
- Brief inclui `Projeto 360° / várias frentes` e atalho direto para WhatsApp.

## Parceiros

A base local contém 25 parceiros. A LP funciona imediatamente após o deploy.

Para tornar fotos, ordem e descrições editáveis no banco, abra `/admin` e use **MIGRAR BASE PARA O CMS**. O processo insere somente os parceiros ainda ausentes, sem duplicar.

## Deploy

1. Substitua os arquivos do repositório pelos deste pacote.
2. Não envie `node_modules/` nem `dist/`.
3. Rode `npm install` em ambiente limpo.
4. Rode `npm run preflight`.
5. Faça commit/push.
6. O Vercel deve instalar as dependências e executar o build normalmente.

Não é necessário alterar as variáveis já existentes do Supabase/Vercel.
