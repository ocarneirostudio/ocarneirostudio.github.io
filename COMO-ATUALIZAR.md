# Como atualizar o site

Todo o conteúdo fica na pasta `conteudo/`. Você não precisa mexer no código.
Pelo GitHub, abra o arquivo, clique no lápis ✏️, edite e clique em **Commit changes**.
O site atualiza sozinho em 1 ou 2 minutos.

## Seus contatos — `conteudo/site.json`
Preencha entre as aspas. O que ficar vazio (`""`) não aparece no site.
```json
"email": "seuemail@exemplo.com",
"youtube": "https://www.youtube.com/@seucanal",
"whatsapp": "5531999999999",
```

## Novo trabalho — `conteudo/trabalhos.json`
1. Suba as imagens para `assets/img/trabalhos/` (de preferência em .webp ou .jpg, com até 1600 px de largura).
2. Copie um bloco `{ ... }` de outro trabalho, cole no lugar que quiser da lista e troque os textos.
3. Atenção à vírgula entre um bloco e outro.

- `categorias`: use `design`, `ilustracao`, `motion`, `cinema` ou `som`
- `tamanho`: `largo` (2/3 da linha), `medio` (metade) ou `""` (1/3)
- `video`: um vídeo curto (.mp4) que toca quando o mouse passa por cima do card
- Na `galeria`, `"meia": true` deixa a imagem com metade da largura

## Vídeo do YouTube — `conteudo/videos.json`
```json
{ "titulo": "Nome do vídeo", "descricao": "Uma frase", "youtube": "https://www.youtube.com/watch?v=XXXXXXXXXXX" }
```

## Som e música — `conteudo/sons.json`
Cada item vai para uma seção da página Audiovisual: `"secao": "sound-design"` ou `"secao": "musica"`.

Com um arquivo de áudio (suba o .mp3 para `assets/audio/`):
```json
{ "secao": "musica", "titulo": "Nome do beat", "descricao": "Beat", "arquivo": "assets/audio/nome.mp3" }
```
Com um vídeo do YouTube:
```json
{ "secao": "sound-design", "titulo": "Nome", "descricao": "Sound design", "youtube": "https://www.youtube.com/watch?v=XXXXXXXXXXX" }
```

## Novo artigo
1. Crie `conteudo/artigos/nome-do-artigo.md`. Use o `_modelo.md` como exemplo.
2. Adicione o artigo em `conteudo/artigos.json`:
```json
{ "slug": "nome-do-artigo", "titulo": "Título", "data": "2026-11-07", "resumo": "Uma frase", "capa": "", "tags": ["Som"] }
```
O `slug` precisa ser igual ao nome do arquivo .md, sem o `.md`.

### Ilustrações interativas nos artigos
Escreva uma destas linhas, sozinha, no meio do texto do artigo:
```html
<div class="viz" data-viz="camadas"></div>
<div class="viz" data-viz="posicao"></div>
<div class="viz" data-viz="proximidade"></div>
<div class="viz" data-viz="enquadramento"></div>
<div class="viz" data-viz="frequencias"></div>
```

## Limites do GitHub
- Cada arquivo pode ter no máximo 100 MB, e o site inteiro, até 1 GB.
- Vídeos longos devem ir para o YouTube ou o Vimeo. Use `videos.json` com o link.
