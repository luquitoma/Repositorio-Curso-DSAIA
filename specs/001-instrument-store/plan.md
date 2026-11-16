# Plano de Implementação — Loja Virtual de Instrumentos

## Problema e abordagem

Implementar a loja virtual descrita em `specs/001-instrument-store/spec.md` usando HTML,
Tailwind CSS e JavaScript modular, com Node.js no front/back-end e MySQL para persistência.
A primeira versão terá catálogo administrável, contas com email e senha, navegação pública,
compras fictícias e sandbox de saldo sem qualquer pagamento real.

## Decisões confirmadas

- Autenticação por email e senha com sessão própria.
- Categorias e produtos gerenciados por um painel administrativo.
- Front-end em JavaScript modular sem framework de UI ou gerenciamento de estado.
- O sandbox só movimenta saldo fictício e não terá saque, conversão ou integração financeira.

## Todos

1. Definir o scaffold do projeto Node.js, scripts de desenvolvimento e convenções de módulos,
   mantendo a separação entre componentes visuais, hooks e serviços em `src/features/`.
2. Modelar o banco MySQL para usuários, categorias, produtos, saldo, movimentações e pedidos;
   criar migrações, carga inicial mínima e regras de integridade.
3. Implementar o back-end modular para catálogo público, autenticação, sessões, painel
   administrativo e autorização por papel.
4. Implementar as páginas HTML e estilos Tailwind para landing page, categorias, produto,
   Sobre, Contato, cadastro/login, conta, sandbox, histórico e painel administrativo.
5. Implementar o fluxo transacional de saldo e compra simulada, impedindo saldo negativo,
   duplicidade, compra sem autorização, produto indisponível e confirmação falsa.
6. Adicionar testes focados para autenticação, autorização, persistência, invariantes do
   sandbox/compra e fluxos públicos principais.
7. Executar validação de qualidade, acessibilidade básica, segurança, build e testes contra os
   critérios de aceitação da especificação.

## Dependências e ordem

- O scaffold e o modelo de dados precedem os serviços de negócio.
- Autenticação e autorização precedem conta, sandbox e painel administrativo.
- Catálogo e serviços de dados precedem as telas que os consomem.
- O fluxo transacional depende do modelo de dados e da autenticação.
- Testes e validação final dependem de todas as áreas funcionais.

## Considerações

- O painel administrativo exige uma forma segura de provisionar o primeiro administrador,
  mantida fora do fluxo público de cadastro.
- Senhas devem ser armazenadas com hash; credenciais e configuração do MySQL ficam fora do
  repositório.
- A compra deve usar uma transação do banco para validar disponibilidade, saldo e criação do
  pedido de forma atômica.
- Bibliotecas externas de UI ou gerenciamento de estado não serão adicionadas sem aprovação
  explícita, conforme a constituição.
- O conteúdo do "Sobre" deve refletir a filosofia da loja e os avisos do 3lock; o contato
  deve apontar exatamente para `https://github.com/luquitoma`.
