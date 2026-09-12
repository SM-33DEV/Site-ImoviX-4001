# IMOVIX — contexto para continuidade

Atualizado em 2026-09-12. Projeto institucional de tecnologia e marketing imobiliário 3D. A versão de trabalho está na branch `feat/prancheta`.

## Decisões do usuário a preservar

- Design minimalista, com inspiração no INCO apenas na organização visual. Usar o azul IMOVIX, nunca o verde da referência.
- Fonte Archivo em todo o site, incluindo as frases do hero.
- A experiência inicial é o vídeo controlado pelo scroll, com frases sobrepostas. Não colocar logomarca nem navegação sobre ele; a navegação começa depois.
- Preservar o valor de captação **R$ 7.200.000** e sua contagem animada.
- Esteira e bloco de captação compactos: o usuário rejeitou tamanhos excessivos por competir com o restante do site.
- As marcas de construtoras da esteira são fictícias. Manter a identificação de demonstração; não alegar parceria real.
- Quatro soluções: Filmes 3D, Experiências digitais, Visualização arquitetônica e Tecnologia comercial. As imagens correspondentes estão em `packages/web/public/images/solutions`.
- WhatsApp é uma integração futura. Não inventar número de telefone, clientes reais ou dados de captação.

## Estrutura

- React + TypeScript + Vite, com Bun workspaces.
- Página: `packages/web/src/web/pages/index.tsx`.
- Blocos gerais e soluções: `packages/web/src/web/components/studio.tsx`.
- Estilo atual: `packages/web/src/web/studio.css`.
- Hero, números e esteira: `packages/web/src/web/components/sections`.
- Desktop usa `public/video/hero-scrub-v2.mp4`. Celulares usam quadros WebP do mesmo vídeo; preservar os dois modos e a alternativa para movimento reduzido.

## Cuidado crítico com o vídeo

O arquivo do hero é all-intra para permitir busca fluida por quadro. Não recomprimir em GOP comum. `scripts/keep-allintra.ts` protege o vídeo antes dos builds web; ele precisa rodar em ambientes novos, pois o cache de proteção não é versionado. Verifique que o vídeo em `dist` continua igual ao original após o build.

## Hospedagem e trabalho remoto

O Sites hospeda a última versão publicada, com acesso privado. O endereço do Runable antigo não foi alterado. A identidade do Sites já está em `.openai/hosting.json`: reutilize-a, nunca crie outra para uma atualização. Publicação e prévia de desenvolvimento não são a mesma coisa.

Leia [REMOTE-DEVELOPMENT.md](REMOTE-DEVELOPMENT.md) para abrir o ambiente remoto. Nenhuma credencial ou memória pessoal deve ser copiada para o repositório público.
