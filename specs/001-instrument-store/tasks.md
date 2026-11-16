---

description: "Tarefas de desenvolvimento da loja virtual de instrumentos"
---

# Tasks: Loja Virtual de Instrumentos

**Input**: Design documents from `/specs/001-instrument-store/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

**Organization**: As tarefas estão agrupadas por história de usuário para permitir entrega
incremental e validação independente.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Consolidar a base executável do projeto e os limites de configuração.

- [ ] T001 Confirmar scripts de execução e validação (`start`, `dev` e `test`) em `package.json`
- [ ] T002 [P] Documentar instalação, configuração do MySQL, criação do administrador e execução em `README.md`
- [ ] T003 [P] Validar variáveis de ambiente e manter apenas exemplos sem credenciais em `.env.example`
- [ ] T004 [P] Confirmar exclusão de dependências, segredos e artefatos gerados em `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Garantir persistência, contratos HTTP, tratamento de erros e segurança básica antes
das histórias de usuário.

**⚠️ CRITICAL**: Nenhuma nova história deve ser considerada pronta antes desta fase.

- [ ] T005 Revisar `database/schema.sql` para garantir chaves estrangeiras, índices de email/slug, limites de saldo e estados de pedido coerentes com FR-007, FR-013 e FR-014
- [ ] T006 [P] Implementar execução versionada de migrações e carga inicial a partir de `database/schema.sql`
- [ ] T007 [P] Centralizar conexão, encerramento e transações MySQL em `src/shared/db.js`
- [ ] T008 Definir respostas JSON, códigos HTTP e mensagens sem vazamento de dados em `src/server.js`
- [ ] T009 Reforçar hash de senha, expiração/limpeza de sessões e cookies seguros em `src/features/auth/auth.service.js`
- [ ] T010 Implementar autorização reutilizável de cliente e administrador em `src/server.js` e `src/features/auth/auth.service.js`
- [ ] T011 [P] Separar formatação, validação e utilitários compartilhados em `public/js/` sem adicionar biblioteca de estado
- [ ] T012 [P] Criar uma estratégia de provisionamento seguro do primeiro administrador documentada em `README.md`

**Checkpoint**: Banco, configuração, autenticação base, autorização e contratos de erro estão
prontos para as histórias.

---

## Phase 3: User Story 1 - Explorar o catálogo por categoria (Priority: P1) 🎯 MVP

**Goal**: Permitir que um visitante descubra categorias, liste produtos e consulte o detalhe de
um instrumento sem autenticação.

**Independent Test**: Abrir a landing page, localizar uma categoria no header, abrir a subpágina,
selecionar um produto e conferir nome, descrição, categoria, preço, imagem e disponibilidade.

- [ ] T013 [P] [US1] Completar consultas de categorias e produtos, incluindo estado vazio e produto não encontrado, em `src/features/catalog/catalog.service.js`
- [ ] T014 [US1] Validar filtros de categoria e parâmetros de slug antes das consultas em `src/server.js`
- [ ] T015 [P] [US1] Implementar links dinâmicos de categoria e estados de carregamento no header em `public/js/app.js`
- [ ] T016 [US1] Completar landing page com exemplos de todas as categorias e fallback visual para imagens ausentes em `public/js/app.js`
- [ ] T017 [US1] Completar listagem responsiva de categoria com mensagem para categoria vazia em `public/js/app.js`
- [ ] T018 [US1] Completar detalhe de produto com disponibilidade, preço fictício e estado 404 em `public/js/app.js`
- [ ] T019 [US1] Garantir navegação por teclado, textos alternativos e hierarquia de títulos no catálogo em `public/index.html` e `public/js/app.js`

**Checkpoint**: A navegação pública do catálogo funciona sem conta e entrega o MVP.

---

## Phase 4: User Story 3 - Criar uma conta e manter dados pessoais (Priority: P1)

**Goal**: Permitir cadastro, login, logout e acesso isolado aos dados da conta.

**Independent Test**: Criar uma conta com email válido, rejeitar duplicidade, entrar, recarregar
uma nova sessão e sair sem manter acesso a páginas privadas.

- [ ] T020 [P] [US3] Completar validação de nome, email, senha e duplicidade em `src/features/auth/auth.service.js`
- [ ] T021 [US3] Implementar fluxo de registro, login, sessão atual e logout com respostas consistentes em `src/server.js`
- [ ] T022 [US3] Corrigir tratamento de sessão expirada e redirecionamento para autenticação em `public/js/app.js`
- [ ] T023 [US3] Melhorar formulários de cadastro/login com mensagens por campo e estados de envio em `public/js/app.js`
- [ ] T024 [US3] Isolar perfil, saldo e pedidos pelo usuário autenticado em `src/features/auth/auth.service.js` e `src/server.js`
- [ ] T025 [US3] Garantir que o logout remova o cookie e bloqueie novas consultas privadas em `public/js/app.js` e `src/server.js`

**Checkpoint**: Contas podem ser criadas e usadas sem expor dados entre clientes.

---

## Phase 5: User Story 4 - Simular saldo e comprar um produto (Priority: P1)

**Goal**: Permitir geração de saldo fictício, compra atômica e consulta do histórico sem
qualquer valor real.

**Independent Test**: Autenticar, gerar saldo válido, comprar um produto disponível com saldo
suficiente, rejeitar saldo insuficiente e verificar o pedido e saldo final.

- [ ] T026 [P] [US4] Validar limites configuráveis de crédito e registrar movimentações no sandbox em `src/features/sandbox/sandbox.service.js`
- [ ] T027 [US4] Tornar a compra idempotente e atômica para impedir débito duplicado, saldo negativo e produto indisponível em `src/features/orders/orders.service.js`
- [ ] T028 [US4] Garantir que item, preço, status e data do pedido sejam persistidos em `database/schema.sql` e `src/features/orders/orders.service.js`
- [ ] T029 [US4] Completar proteção de autenticação e mensagens 401/409/422 nas rotas de sandbox e pedidos em `src/server.js`
- [ ] T030 [US4] Melhorar tela de conta com saldo, sandbox, avisos de ficção, histórico e estados de erro em `public/js/app.js`
- [ ] T031 [US4] Impedir visualmente saque, transferência, conversão ou qualquer interpretação de saldo como dinheiro real em `public/index.html` e `public/js/app.js`
- [ ] T032 [US4] Exibir confirmação somente após persistência bem-sucedida e preservar dados após recarregar em `public/js/app.js`

**Checkpoint**: O fluxo de saldo e compra simulada respeita todas as invariantes financeiras
fictícias da especificação.

---

## Phase 6: User Story 2 - Entender a proposta da loja (Priority: P2)

**Goal**: Comunicar a filosofia da loja e oferecer o contato correto para visitantes.

**Independent Test**: Abrir "Sobre", ler a filosofia e seguir "Contato" até
`https://github.com/luquitoma` sem autenticação.

- [ ] T033 [P] [US2] Revisar conteúdo da filosofia da loja e avisos 3lock em `public/js/app.js`
- [ ] T034 [P] [US2] Garantir link exato, segurança de abertura externa e texto acessível em `public/js/app.js`
- [ ] T035 [US2] Integrar links "Sobre" e "Contato" em todas as variações do header em `public/index.html` e `public/js/app.js`

**Checkpoint**: Visitantes encontram propósito e contato sem depender do catálogo ou de uma conta.

---

## Phase 7: Catalog Administration (Plan Extension)

**Goal**: Permitir que um administrador autenticado mantenha categorias, produtos, preços e
disponibilidade sem editar dados diretamente na aplicação pública.

**Independent Test**: Promover um administrador, criar categoria e produto pelo painel, atualizar
o catálogo e confirmar a aparição do novo produto na navegação pública.

- [ ] T036 [P] Validar payloads, slugs, categoria existente e preço positivo nas operações administrativas em `src/features/catalog/catalog.service.js`
- [ ] T037 Proteger rotas administrativas e retornar 403 para clientes comuns em `src/server.js`
- [ ] T038 Completar formulário de categoria, produto, imagem e disponibilidade no painel em `public/js/app.js`
- [ ] T039 Adicionar atualização/arquivamento seguro de produtos sem quebrar pedidos históricos em `src/features/catalog/catalog.service.js` e `database/schema.sql`
- [ ] T040 Atualizar a navegação pública após alterações administrativas e exibir erros de conflito de slug em `public/js/app.js`

**Checkpoint**: O catálogo pode ser mantido por administradores sem acesso administrativo para
clientes e sem alterar o histórico de pedidos.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Fechar qualidade, acessibilidade, operação e rastreabilidade do site completo.

- [ ] T041 [P] Revisar todos os componentes e serviços para manter a separação de domínio em `src/features/` e componentes visuais sem lógica de negócio em `public/`
- [ ] T042 [P] Auditar textos, contraste, foco, teclado, alt text e mensagens de erro em `public/index.html` e `public/js/app.js`
- [ ] T043 [P] Adicionar cobertura de regressão para hash de senha e invariantes do sandbox/compra em `test/`
- [ ] T044 [P] Atualizar documentação de configuração, administrador, banco e limites fictícios em `README.md`
- [ ] T045 Executar `npm.cmd test`, verificação de sintaxe JavaScript e validação do servidor HTTP contra `src/server.js`
- [ ] T046 Executar revisão de segurança 3lock para credenciais, autorização, dados pessoais e operações fictícias em `src/` e `database/schema.sql`
- [ ] T047 Executar validação manual dos critérios SC-001 a SC-007 usando `specs/001-instrument-store/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; prepara execução e configuração.
- **Foundational (Phase 2)**: Depende da Setup e bloqueia todas as histórias.
- **US1 (Phase 3)**: Depende da persistência e contratos fundacionais; é o MVP público.
- **US3 (Phase 4)**: Depende da autenticação fundacional; pode avançar após o catálogo.
- **US4 (Phase 5)**: Depende de US3 para exigir autenticação e de US1 para selecionar produtos.
- **US2 (Phase 6)**: Depende apenas do shell público e pode ser feita em paralelo com US1.
- **US5 (Phase 7)**: Depende de autorização fundacional e do catálogo de US1.
- **Polish (Phase 8)**: Depende das histórias desejadas para a entrega.

### User Story Dependencies

- **US1 (P1)**: Foundational → independente para visitantes.
- **US3 (P1)**: Foundational → independente para contas.
- **US4 (P1)**: Foundational + US1 + US3.
- **US2 (P2)**: Foundational → independente para visitantes.
- **Administração (extensão do plano)**: Foundational + US1; requer administrador provisionado.

### Parallel Opportunities

- T002–T004 podem ser executadas em paralelo.
- T006–T007 e T011–T012 podem ser executadas em paralelo após o scaffold.
- T013, T015 e T019 podem ser executadas em paralelo dentro de US1.
- T020 e T023 podem ser executadas em paralelo dentro de US3.
- T026 e T028 podem ser executadas em paralelo antes da integração em T027.
- T033 e T034 podem ser executadas em paralelo em US2.
- T036 e T038 podem ser executadas em paralelo antes da integração administrativa.
- T041–T044 podem ser executadas em paralelo na fase de polish.

## Parallel Example: User Story 1

```text
T013: Consultas e estados do catálogo em src/features/catalog/catalog.service.js
T015: Header e links dinâmicos em public/js/app.js
T019: Acessibilidade do catálogo em public/index.html e public/js/app.js
```

## Parallel Example: User Story 4

```text
T026: Limites e movimentações do sandbox em src/features/sandbox/sandbox.service.js
T028: Persistência de itens e pedidos em database/schema.sql e src/features/orders/orders.service.js
T030: Tela de conta e histórico em public/js/app.js
```

## Implementation Strategy

### MVP First

1. Concluir Setup e Foundational.
2. Entregar US1: landing page, categorias e detalhe de produto.
3. Validar o fluxo público do catálogo contra SC-001.
4. Só então avançar para contas e compras simuladas.

### Incremental Delivery

1. Setup + Foundational: base operacional.
2. US1: catálogo público demonstrável.
3. US3: contas e sessões.
4. US4: sandbox e compras fictícias.
5. US2: conteúdo institucional e contato.
6. US5: manutenção administrativa do catálogo.
7. Polish: qualidade, segurança, acessibilidade e critérios de sucesso.

### Notes

- O painel administrativo aparece como US5 porque foi escolhido como decisão de implementação,
  embora a especificação inicial o trate como fora da primeira versão; a tarefa torna essa
  expansão explícita e rastreável.
- Nenhuma tarefa adiciona biblioteca externa de UI ou gerenciamento de estado sem aprovação,
  conforme a constituição.
- Cada tarefa possui checkbox, ID sequencial, marcador de paralelismo quando aplicável, label
  de história nas fases de usuário e caminho de arquivo.
