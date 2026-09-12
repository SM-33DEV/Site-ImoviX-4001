# Trabalhar no IMOVIX de outro computador

## No navegador, sem depender do computador original

1. Entre no GitHub com a conta que tem acesso ao projeto.
2. Abra a branch [feat/prancheta](https://github.com/SM-33DEV/Site-ImoviX-4001/tree/feat/prancheta). Ela contém o front-end atual; não use `main` como ponto de partida desta versão.
3. Selecione **Code → Codespaces → Create codespace on feat/prancheta**. Confira a conta de cobrança, a franquia e a máquina antes de confirmar; esta preparação não cria um Codespace nem altera limites de gastos.
4. Aguarde a instalação automática. O ambiente instala Bun 1.3.14, as dependências do lockfile e inicia a prévia na porta 4200.
5. Abra **Ports → 4200 → Open in Browser**. Mantenha **Port Visibility: Private**. No Codespaces, a prévia usa um endereço HTTPS autenticado, não o localhost do computador antigo.
6. Edite os arquivos e salve. A prévia de desenvolvimento atualiza com as alterações. Para continuar em outra máquina, abra o **mesmo Codespace** em https://github.com/codespaces.

Se o servidor não iniciar, execute `bun run dev:remote` no terminal. O log de inicialização fica em `.cache/codespaces/preview.log`. O comando usa `--strictPort` para não mudar de porta silenciosamente.

Fechar a aba não equivale a encerrar o ambiente: use **Stop codespace** quando terminar. Computação e armazenamento podem consumir franquia ou gerar cobrança conforme a conta. Não exclua o ambiente antes de enviar os arquivos que deseja manter ao GitHub.

## Salvar o progresso entre ambientes

Um Codespace mantém seus próprios arquivos, mas alterações nele não atualizam automaticamente outro clone nem o site publicado. Revise as alterações no controle de versão, faça commit e envie à branch. No outro clone, atualize a branch antes de começar. Evite editar a mesma branch simultaneamente em dois ambientes sem sincronizar.

Esta configuração não replica a conversa local, sessões autenticadas, credenciais, plugins ou o cofre NELAYA. O contexto essencial do site está em [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md). Se usar outro agente de código, peça que leia esse arquivo. Autentique suas ferramentas diretamente no novo ambiente; nunca coloque tokens no repositório.

## Em outro computador, rodando localmente

Instale Git, Node.js 22 e Bun 1.3.14. Depois:

```sh
git clone --branch feat/prancheta https://github.com/SM-33DEV/Site-ImoviX-4001.git
cd Site-ImoviX-4001
bun install --frozen-lockfile
bun run dev -- --port 4200
```

Abra http://localhost:4200 nessa nova máquina. Não é necessário copiar a pasta `node_modules` nem a `.env` do computador antigo. O site institucional atual não exige chaves de banco ou WhatsApp para renderizar.

## Verificação e publicação

```sh
cd packages/web
bun run typecheck
cd ../..
bun run build:web
```

O build web protege o vídeo all-intra antes de otimizar os arquivos. A saída fica em `packages/web/dist`.

A prévia e o site publicado são separados. Para atualizar a publicação existente, reutilize a identidade em `.openai/hosting.json`, prepare a saída estática na raiz `dist` e use o fluxo de publicação do Sites. Não crie outro Site, não altere a audiência privada e não reutilize uma saída `dist` antiga. O acesso ao Sites exige autenticação própria no ambiente que publicar.

Não foram criados automação de publicação, túnel para o PC antigo ou novo serviço de banco de dados.

Referências: [Configuração Codespaces](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers), [portas e visibilidade](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace), [franquia de uso](https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage).
