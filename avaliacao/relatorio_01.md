# Relatório — Loja de música

## Viabilidade

- Grupo: Dupla 01
- Integrantes: Lucas Machado de Almeida e Gabriel Faria Cintra de Jesus. 
- Repositório: https://github.com/luquitoma/Repositorio-Curso-DSAIA
- Stack: HTML, CSS, JavaScript, SQL, React, Bootstrap e Visual Studio Code. 
- Veredito: Viável com recorte

Uma loja em que a pessoa consulta instrumentos cabe na disciplina. Marca, acessibilidade, segurança, carrinho e pagamento não cabem juntos nesta etapa. 

## SWOT

### Forças

A dupla nomeia um usuário, quem abre a página da loja, e um resultado, consultar o catálogo. A linguagem de implementação é JavaScript.

### Fraquezas

A ideia descreve marca e “loja de alto padrão”, e não uma ação. HTML e React cobrem a mesma tela, basta escolher um. SQL não tem motor. “Entre outros” deixa a stack aberta. A justificativa fala em familiaridade e não no fluxo. O README não repete a ideia.

### Oportunidades

Constitution com um catálogo de instrumentos: nome, artista e preço. Duas telas, a lista e o detalhe. Conta, carrinho e pagamento ficam para depois.

### Ameaças

Pagamento, login e um capítulo de segurança consomem as próximas semanas. Dois modos de montar a tela, HTML solto e React, antes de existir uma página. 

## Stack técnica

**Parecer: Adequada com ajuste.** JavaScript com React serve a um catálogo, SQL sem motor e “entre outros” saem da primeira spec.

React cobre a lista e a página do instrumento musical. Visual Studio Code permanece como ambiente, e não como peça do produto. Bootstrap só entra se a dupla já for usá-lo no layout dessas duas telas. Não há motivo para trocar a linguagem.

O ajuste é tirar o que se sobrepõe. HTML e CSS soltos e React são duas formas de construir a mesma tela. SQL, sem dizer se é SQLite, PostgreSQL ou outro, pede um servidor que o catálogo ainda não exige. Na primeira spec, React mostra os instrumentos e um arquivo JSON, ou SQLite, guarda nome, descrição marca e preço. “Entre outros” sai da stack. Carrinho, pagamento e conta não escolhem tecnologia nesta etapa.

## Recomendação

**Especifiquem um catálogo de instrumentos, com nome, marca e preço, e deixem marca, pagamento e login para depois.**

A loja cabe na disciplina se a primeira spec for uma consulta. A pessoa abre a lista, escolhe um produto e vê nome, marca e preço. A constitution corta o que o PDF juntou: identidade de marca, acessibilidade como capítulo, segurança, carrinho e pagamento. A justificativa passa a explicar esse fluxo. React existe para as duas telas. O arquivo de dados existe para guardar esses três campos e impedir produto sem nome. Vale escrever o que a lista mostra quando ainda não há produto e o que a página faz quando o produto não existe. 
