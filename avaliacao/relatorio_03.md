# Relatório — Loja de música — semana 3

## Viabilidade

- Grupo: Dupla 01
- Integrantes: Lucas Machado de Almeida e Gabriel Faria Cintra de Jesus
- Specify: https://github.com/luquitoma/Repositorio-Curso-DSAIA/blob/main/specs/001-instrument-store/spec.md
- Plan: https://github.com/luquitoma/Repositorio-Curso-DSAIA/blob/main/specs/001-instrument-store/plan.md
- Tasks: https://github.com/luquitoma/Repositorio-Curso-DSAIA/blob/main/specs/001-instrument-store/tasks.md

Os três links abrem na `main`. A spec está em rascunho e descreve landing, categorias, página do instrumento, conta, sessão, saldo fictício e compra simulada. O plano confirma Node.js, HTML, Tailwind, JavaScript modular e MySQL, com painel administrativo. As tarefas T001 a T047 estão desmarcadas e cobrem esse conjunto, inclusive o painel. 

## SWOT

### Forças

O visitante consulta o catálogo sem conta, e isso está na história 1, no FR-001 a FR-004 e nas tarefas T013 a T019. A estratégia do backlog ainda chama essa parte de MVP e manda validá-la antes de conta e compra. As caixas continuam vazias, então a semana 3 não finge implementação.

### Fraquezas

No projeto ficam de fora cadastro, carrinho, saldo, pedido, pagamento e painel. Na spec, conta e compra simulada são prioridade P1, do FR-006 ao FR-016. O plano ainda acrescenta o painel, e a própria spec diz que a primeira versão não tem painel nem papéis de funcionário. As tarefas T036 a T040 tornam esse painel parte do trabalho. A stack também trocou: a semana 1 era React; o plano agora é Node e MySQL.

### Oportunidades

O recorte do projeto já cabe numa iteração: lista por categoria e página com nome, marca, descrição, preço e disponibilidade. As tarefas do catálogo público, até o checkpoint da história 1, servem a isso. Conta, saldo, pedido e painel podem esperar outra spec.

### Ameaças

A semana 4 então não tem um “pronto” só: o projeto pede o catálogo navegável, e o GitHub pede cadastro, sandbox e histórico.

## Stack técnica

**Parecer: O plano escolhe uma stack, e o recorte do PDF não a usa.** Node, HTML, Tailwind e MySQL aparecem no plano e nas tarefas. React saiu sem estar na spec desta semana.

MySQL entra para usuários, saldo, pedidos e painel. Um catálogo só de leitura, como o projeto descreve, não pede esse banco nesta iteração. Não há motivo para manter conta e compra no mesmo recorte do catálogo.

## Recomendação

**Façam os três arquivos caberem no recorte do projeto: catálogo público, sem conta, compra ou painel.**

Entram lista por categoria e página do instrumento, com nome, marca, descrição, preço e disponibilidade. Ficam fora cadastro, login, saldo, pedido, pagamento e painel. Se a dupla quiser conta e compra simulada, o texto do projeto precisa dizer isso, e o painel continua de fora, como a spec já assumiu. As tarefas que não servirem a esse caminho não são desta iteração.
Ou seja, dividam em duas features sem login e navegação e uma segunda com login, conta e adm. Executem a primeira feature e se tudo estiver correto e aprovado realizem a segunda.  
