# Mídia do portfólio

Coloque aqui os arquivos das peças — vídeos, imagens, tours.

Depois registre cada peça em `src/web/config/media.ts`, trocando o `null`
do encaixe correspondente. Nenhum componente precisa ser alterado.

## Nomes de arquivo

Use o empreendimento e o que a peça é:

    aurora-filme.mp4
    aurora-filme-capa.jpg
    aurora-tour-360.mp4
    aurora-tour-360-capa.jpg

Asset regenerado ganha **nome novo** (`-v2`), nunca sobrescreve o antigo —
regra da casa, porque renomear é o único jeito confiável de vencer cache.

## Vídeo

Todo vídeo precisa de uma **capa** (`poster`). Até o visitante clicar em
play, só a capa é baixada; o vídeo tem `preload="none"` e só desce no clique.

Encode sugerido para peça de portfólio (≠ do hero, que é all-intra):

    ffmpeg -i entrada.mov -an -vf "scale=1280:-2" \
      -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
      -movflags +faststart saida.mp4

`+faststart` é obrigatório: sem ele o navegador precisa baixar o arquivo
inteiro antes do primeiro quadro.

**Não** use o `keep-allintra` aqui. Ele existe só para o vídeo do hero, que
depende de I-frame em todo quadro para o scrub. Peça de portfólio toca
normalmente e deve ser comprimida normalmente.

## Peso

O hero já custa 14 MB. Mire em **menos de 6 MB por peça** e deixe o
`asset-optimizer` comprimir no build — ele recomprime tudo em `public/`
automaticamente, e para estes arquivos isso é desejável.
