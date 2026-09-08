# Seeven Control Room — guia rápido

Rota:

```text
/admin
```

## Dashboard

A tela inicial não é apenas contagem. Ela mostra pendências que impactam diretamente a percepção do portfólio:

- Reels sem player;
- Reels sem capa;
- projetos sem cover;
- cases incompletos.

Priorize essas pendências antes de adicionar mais efeitos na LP.

## Cadastrar um Reel corretamente

### 1. Pegue o permalink

No Instagram, abra **o Reel específico**.

Desktop: copie a URL da barra do navegador.

Celular: **Compartilhar → Copiar link**.

Exemplo:

```text
https://www.instagram.com/reel/ABC123XYZ/
```

Não use apenas:

```text
https://www.instagram.com/nome-do-perfil/
```

### 2. No Admin

Entre em:

```text
Reels & mídia → + Novo item
```

Aba **Geral**:

- Cliente
- Título
- Categoria `reel`

Aba **Mídia**:

- **Link exato do Reel** = permalink
- **Capa do Reel** = poster
- **Arquivo de vídeo** = opcional

Aba **Publicação**:

- Destaque = Sim/Não
- Publicado = Sim
- Ordem

### 3. MP4/WebM

Se você tiver o arquivo original, arraste para o Media Vault.

O painel:

1. envia o vídeo ao bucket `portfolio-assets`;
2. tenta capturar um frame;
3. salva esse frame como poster;
4. deixa os dois campos prontos para salvar.

Vídeo próprio é preferível quando você quer playback mais previsível e rápido.

## Projetos / Cases

Para um projeto aparecer como case completo, preencha pelo menos:

- título;
- cliente;
- capa;
- slug;
- desafio;
- estratégia;
- execução;
- resultado.

Exemplo de slug:

```text
venancio-social
```

Gera:

```text
/work/venancio-social
```

## Before / After

Use quando existir mudança de lógica/processo que possa ser explicada honestamente.

Não invente um “antes” apenas para preencher o componente.

Campos:

- Before / título
- Before / texto
- After / título
- After / texto

## Project Intelligence

Use para explicar raciocínio:

- Contexto
- Público
- Objetivo
- Restrição
- Insight
- Decisão
- Sistema
- Canais

Não use `signal` como se fosse uma métrica de performance. Ele é linguagem visual do case.

## Behance Watch

```text
Behance → VERIFICAR NOVIDADES
```

Quando um projeto novo aparecer:

1. Abra para confirmar;
2. Importar;
3. Edite o item importado;
4. ajuste cliente;
5. ferramentas;
6. cover;
7. ordem;
8. publique.

## Limpar um campo

Na V8, apagar o valor de um input e salvar envia `NULL` ao Supabase. Isso corrige o comportamento antigo em que um campo vazio podia continuar gravado no banco.


## Status no Control Room

O painel separa duas coisas:

- **PRONTO / SEM CAPA / PENDENTE** = qualidade/completude do conteúdo;
- **PUBLICADO / RASCUNHO** = visibilidade na LP.

Um rascunho pode estar tecnicamente “pronto” e ainda assim não aparecer no site. A LP pública consulta explicitamente apenas itens publicados.

Nas tabelas, use **ABRIR MÍDIA**, **VER CASE**, **VER BEHANCE** ou **ABRIR PRESENÇA** para conferir a referência pública sem precisar procurar o link manualmente.

## Backup

Use **Backup JSON** antes de mudanças grandes no conteúdo ou antes de migrations.
