# Feature Specification: Loja Virtual de Instrumentos

**Feature Branch**: `001-instrument-store`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "Gere a especificação para o projeto, é uma loja de instrumentos musicais, separados por categoria, que podem ser acessados no header, assim como outras informações: um 'contato', que leva ao link 'https://github.com/luquitoma'; um 'sobre', que explique a filosofia da loja, e uma landing page exemplificando alguns dos instrumentos de cada categoria, porém cada categoria tem sua própria subpágina, onde você também pode entrar em cada produto individualmente para simular uma compra. Também inclua a possibilidade de cadastrar uma conta na página, e todas as informações (produtos, clientes) deverão ser armazenados no banco de dados. Adicione também um sandbox para o usuário poder 'gerar dinheiro' para si, para que as compras dos produtos fictícios possam ser efetuadas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar o catálogo por categoria (Priority: P1)

Como visitante, quero conhecer a loja e navegar por categorias de instrumentos para encontrar
produtos de meu interesse com o mínimo de esforço.

**Why this priority**: O catálogo e a descoberta de produtos são o valor central da loja e
precisam funcionar mesmo antes de uma conta ser criada.

**Independent Test**: Um visitante pode abrir a landing page, identificar exemplos de categorias,
acessar uma categoria pelo header e visualizar seus produtos sem autenticação.

**Acceptance Scenarios**:

1. **Given** que o visitante está em qualquer página pública, **When** abre o header,
   **Then** vê links para todas as categorias disponíveis e para as páginas "Sobre" e
   "Contato".
2. **Given** que o visitante está na landing page, **When** seleciona uma categoria,
   **Then** é levado à subpágina da categoria com a lista de produtos correspondentes.
3. **Given** que o visitante está em uma subpágina de categoria, **When** seleciona um produto,
   **Then** vê nome, descrição, categoria, preço fictício, imagem ou representação visual e
   disponibilidade do produto.

---

### User Story 2 - Entender a proposta da loja (Priority: P2)

Como visitante, quero conhecer a filosofia da loja e encontrar um canal de contato confiável
para decidir se a experiência é adequada para mim.

**Why this priority**: Transparência sobre propósito e contato reforça confiança sem exigir
cadastro ou compra.

**Independent Test**: Um visitante acessa "Sobre", entende a filosofia apresentada e abre o
link de "Contato" para `https://github.com/luquitoma`.

**Acceptance Scenarios**:

1. **Given** que o visitante vê o header, **When** seleciona "Sobre", **Then** acessa uma
   página que explica a filosofia da loja em linguagem clara.
2. **Given** que o visitante seleciona "Contato", **When** a página é carregada, **Then** vê
   um link explícito para `https://github.com/luquitoma` que abre o destino correto.

---

### User Story 3 - Criar uma conta e manter dados pessoais (Priority: P1)

Como visitante, quero cadastrar uma conta para me identificar durante uma compra simulada e
ter meus dados preservados para usos futuros.

**Why this priority**: A conta é necessária para associar saldo fictício, pedidos e histórico a
uma pessoa sem permitir que dados sejam tratados anonimamente.

**Independent Test**: Um visitante preenche o cadastro com dados válidos, conclui o registro,
entra na conta e confirma que seu perfil está disponível em uma nova sessão.

**Acceptance Scenarios**:

1. **Given** que o visitante não possui conta, **When** informa os campos obrigatórios válidos,
   **Then** a conta é criada e o usuário recebe confirmação de sucesso.
2. **Given** que o visitante envia dados inválidos ou já cadastrados, **When** tenta concluir o
   cadastro, **Then** recebe mensagens específicas e a conta não é criada duplicadamente.
3. **Given** que o usuário possui uma conta, **When** encerra e inicia uma nova sessão,
   **Then** seus dados de perfil permanecem disponíveis após autenticação bem-sucedida.

---

### User Story 4 - Simular saldo e comprar um produto (Priority: P1)

Como usuário autenticado, quero adicionar dinheiro exclusivamente fictício ao meu saldo e
usá-lo para simular a compra de um instrumento.

**Why this priority**: O sandbox torna possível testar o fluxo de compra sem cobrança real,
cartão, transferência ou promessa de valor monetário.

**Independent Test**: Um usuário autenticado gera saldo fictício, abre um produto, confirma a
compra quando possui saldo suficiente e consulta o pedido criado.

**Acceptance Scenarios**:

1. **Given** que o usuário autenticado possui saldo fictício zero ou insuficiente, **When**
   acessa o sandbox e informa um valor permitido, **Then** o saldo fictício é atualizado e a
   tela identifica claramente que não possui valor real.
2. **Given** que o usuário possui saldo suficiente, **When** seleciona comprar em um produto e
   confirma a simulação, **Then** o saldo é reduzido pelo preço, o pedido é criado e o usuário
   recebe uma confirmação.
3. **Given** que o usuário possui saldo insuficiente, **When** tenta confirmar a compra,
   **Then** a compra não é criada e o usuário é orientado a adicionar saldo fictício.
4. **Given** que o usuário não está autenticado, **When** tenta gerar saldo ou comprar,
   **Then** é direcionado ao cadastro ou login antes de continuar.
5. **Given** que uma compra simulada foi concluída, **When** o usuário consulta seu histórico,
   **Then** vê o produto, o valor, a data e o status da simulação.

---

### Edge Cases

- Uma categoria sem produtos deve apresentar uma mensagem útil e manter a navegação para as
  demais categorias.
- Um produto indisponível não pode ser comprado e deve exibir seu estado claramente.
- Um produto removido ou inexistente deve resultar em uma página de não encontrado, sem expor
  dados de outro produto.
- Valores de saldo nulos, negativos, excessivos ou com formato inválido devem ser rejeitados
  sem alterar o saldo.
- A confirmação repetida da mesma compra não deve debitar o saldo nem criar pedidos duplicados.
- Falhas ao salvar cadastro, saldo ou pedido devem informar que a operação não foi concluída e
  não podem apresentar uma confirmação falsa.
- O sandbox não pode oferecer saque, conversão, transferência ou qualquer interpretação de
  saldo fictício como dinheiro real.
- O usuário deve conseguir sair da conta; páginas privadas não podem permanecer acessíveis
  após o encerramento da sessão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma landing page com a proposta da loja e exemplos de
  instrumentos pertencentes a cada categoria disponível.
- **FR-002**: O sistema MUST disponibilizar no header links para cada categoria, "Sobre",
  "Contato", cadastro e, quando aplicável, acesso à conta.
- **FR-003**: O sistema MUST oferecer uma subpágina independente para cada categoria, listando
  apenas os produtos daquela categoria.
- **FR-004**: O sistema MUST permitir abrir uma página individual de produto com informações
  suficientes para avaliar uma compra simulada.
- **FR-005**: O sistema MUST apresentar uma página "Sobre" que explique a filosofia da loja e
  uma página "Contato" com o link exato `https://github.com/luquitoma`.
- **FR-006**: O sistema MUST permitir o cadastro, autenticação e encerramento de sessão de
  contas de clientes.
- **FR-007**: O sistema MUST validar dados obrigatórios de cadastro e impedir duplicidade de
  conta conforme o identificador cadastrado.
- **FR-008**: O sistema MUST persistir os dados de produtos, categorias e clientes para que
  permaneçam disponíveis após o encerramento da sessão.
- **FR-009**: O sistema MUST exigir autenticação para acessar o saldo fictício, criar pedidos
  simulados ou consultar informações privadas da conta.
- **FR-010**: O sistema MUST oferecer um sandbox no qual um usuário autenticado possa gerar
  saldo fictício dentro de limites definidos e visíveis.
- **FR-011**: O sistema MUST identificar em todas as telas relevantes que o saldo e as compras
  são fictícios e não representam dinheiro, pagamento ou entrega reais.
- **FR-012**: O sistema MUST permitir confirmar uma compra simulada somente quando o produto
  estiver disponível e o saldo fictício for suficiente.
- **FR-013**: O sistema MUST persistir saldo, pedidos simulados, itens, valores, datas e status
  associados ao cliente responsável.
- **FR-014**: O sistema MUST impedir saldo negativo, débito acima do saldo, duplicidade de
  confirmação e operações sem autorização.
- **FR-015**: O sistema MUST informar o resultado de cada operação de cadastro, geração de saldo
  e compra com mensagens compreensíveis, sem confirmar operações que falharam.
- **FR-016**: O sistema MUST proteger dados pessoais de clientes contra consulta ou alteração
  por outros clientes.

### Key Entities

- **Categoria**: Agrupamento navegável de instrumentos, com nome, descrição e produtos
  associados.
- **Produto**: Instrumento exibido no catálogo, com nome, descrição, categoria, preço fictício,
  representação visual e disponibilidade.
- **Cliente**: Pessoa com conta, credenciais, dados de perfil, saldo fictício e histórico de
  compras simuladas.
- **Saldo fictício**: Quantia demonstrativa pertencente a um cliente, com registros de geração
  e débitos, sem valor monetário real.
- **Pedido simulado**: Registro de uma compra fictícia, contendo cliente, produto ou itens,
  valor, data e status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos usuários de teste conseguem localizar uma categoria e abrir um
  produto em até 60 segundos a partir da landing page.
- **SC-002**: Pelo menos 95% dos usuários de teste conseguem concluir um cadastro válido em até
  2 minutos, sem ajuda externa.
- **SC-003**: 100% das tentativas de compra sem autenticação, com produto indisponível ou com
  saldo insuficiente são bloqueadas sem criação de pedido ou débito indevido.
- **SC-004**: 100% das compras simuladas aprovadas aparecem no histórico do cliente com produto,
  valor, data e status corretos.
- **SC-005**: 100% das telas de saldo e compra deixam explícito que as operações são fictícias,
  e nenhum fluxo oferece saque ou cobrança real.
- **SC-006**: Pelo menos 90% dos usuários de teste conseguem encontrar a filosofia da loja e
  abrir o contato correto em até 30 segundos.
- **SC-007**: Nenhum usuário de teste consegue consultar ou alterar dados privados pertencentes
  a outro cliente.

## Assumptions

- A primeira versão terá um único tipo de cliente, sem painel administrativo ou permissões
  distintas para funcionários.
- Produtos, categorias e disponibilidade serão mantidos pelo próprio projeto; não haverá
  integração com fornecedores ou estoque físico na primeira versão.
- O cadastro usará identificador e credencial convencionais, com mensagens de erro
  compreensíveis e recuperação adequada para credenciais esquecidas em uma evolução posterior.
- O sandbox aceitará apenas valores positivos dentro de um limite definido e exibido ao usuário,
  sem qualquer saída de dinheiro ou integração de pagamento.
- A compra simulada representa apenas a criação de um pedido demonstrativo; não haverá entrega,
  faturamento, cobrança, imposto ou comunicação com transportadoras.
- O catálogo público poderá ser consultado sem conta, mas ações pessoais e histórico exigirão
  autenticação.
- A experiência deve atender navegação por teclado, leitura clara e mensagens de estado
  compreensíveis para usuários com diferentes necessidades de acesso.
