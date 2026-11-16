<!--
Sync Impact Report
- Version change: template/unversioned -> 1.0.0
- Modified principles: none; initial constitution
- Added sections: Core Principles, Constraints, Development Workflow, Governance
- Removed sections: none
- Follow-up TODOs: confirm the original ratification date
-->

# Loja Virtual de Instrumentos Constitution

## Core Principles

### I. Stack Web Obrigatória
O projeto MUST utilizar HTML para a estrutura das páginas, Tailwind CSS para a estilização,
Node.js para a camada de aplicação e MySQL para a persistência de dados. A introdução de
qualquer tecnologia que substitua ou contorne esses elementos exige uma alteração formal desta
constituição. Essa regra mantém o stack previsível, compartilhável e alinhado ao objetivo do
projeto.

### II. Modularidade por Domínio
Cada capacidade de negócio MUST ser organizada como um domínio independente dentro de
`src/features/`, com fronteiras, responsabilidades e dependências explícitas. Código
compartilhado só pode ser extraído quando houver necessidade comprovada por mais de um domínio,
sem criar abstrações prematuras. A modularidade reduz acoplamento e torna a evolução da loja
mais segura.

### III. Separação entre Apresentação e Dados
Componentes visuais MUST permanecer livres de lógica de negócio e acesso direto a dados. Hooks
devem coordenar estado e efeitos da interface, enquanto serviços devem encapsular chamadas à
API, regras de acesso a dados e integração com o MySQL. Cada revisão MUST verificar essa
separação; violações precisam ser corrigidas ou justificadas explicitamente. A separação
preserva testabilidade, reutilização e clareza de responsabilidades.

### IV. Dependências de UI e Estado sob Aprovação
O projeto MUST NOT adicionar bibliotecas externas de UI ou de gerenciamento de estado sem
aprovação explícita dos responsáveis pelo projeto e registro da justificativa, do impacto e
da alternativa considerada. HTML, Tailwind CSS e as capacidades existentes da aplicação
devem ser priorizados antes de novas dependências. A regra controla complexidade, custo de
manutenção e dependências desnecessárias.

### V. Governança 3lock
Toda decisão relevante de produto, arquitetura, operação ou processo MUST ser avaliada por
três travas: **Ética**, verificando privacidade, acessibilidade, transparência e tratamento
responsável de usuários e dados; **Operação**, verificando segurança, confiabilidade,
observabilidade, suporte e capacidade de execução; e **Estratégia**, verificando valor para o
negócio, sustentabilidade e alinhamento ao propósito da loja. Uma decisão que falhe em
qualquer trava MUST ser bloqueada, revista ou acompanhada de uma exceção formal aprovada.
O modelo impede que velocidade ou resultado comercial superem responsabilidade e viabilidade.

## Restrições Técnicas e de Segurança

O código MUST manter configurações e credenciais fora do repositório, validar entradas nas
fronteiras da aplicação e aplicar o princípio do menor privilégio ao acesso ao MySQL. Domínios
não podem acessar diretamente tabelas ou detalhes de infraestrutura pertencentes a outro
domínio; a comunicação deve ocorrer por contratos explícitos. Alterações que possam afetar
dados de clientes, pagamentos, pedidos ou estoque MUST incluir avaliação das três travas do
modelo 3lock antes da implementação.

## Fluxo de Desenvolvimento e Qualidade

Cada mudança MUST indicar o domínio afetado, a camada modificada e os critérios de aceitação.
Revisões MUST verificar a estrutura em `src/features/`, a separação entre componentes, hooks e
serviços, o uso do stack obrigatório e a necessidade de aprovação para novas bibliotecas.
Mudanças que alterem contratos de dados MUST incluir testes ou verificações equivalentes para
os fluxos afetados. Antes de disponibilizar uma funcionalidade, a equipe MUST registrar as
decisões 3lock relevantes e confirmar que os critérios éticos, operacionais e estratégicos
foram atendidos.

## Governance

Esta constituição prevalece sobre práticas conflitantes do projeto. Uma alteração deve
descrever a motivação, o impacto nos princípios existentes, os riscos, as migrações
necessárias e o resultado da avaliação 3lock. A alteração só entra em vigor após revisão e
aprovação explícitas dos responsáveis pelo projeto.

As revisões devem aplicar versionamento semântico: MAJOR para remoção ou redefinição
incompatível de princípios; MINOR para novos princípios ou expansões materiais de escopo; e
PATCH para esclarecimentos, correções de texto ou ajustes sem mudança semântica. Cada pull
request e revisão técnica MUST verificar a conformidade com esta constituição e registrar
exceções, com responsável, justificativa, prazo e trava 3lock afetada. Exceções vencidas
devem ser reavaliadas ou encerradas.

TODO(RATIFICATION_DATE): confirmar a data original de adoção desta constituição.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-11-15
