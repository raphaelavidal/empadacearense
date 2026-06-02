# 📖 Guia de Estudos e Arquitetura - Empada Cearense API

Este guia foi elaborado para consolidar todo o conhecimento, decisões de arquitetura e ferramentas construídas no **Empada Cearense API**. Ele servirá como material de consulta rápida para você continuar o desenvolvimento por conta própria e como uma excelente **preparação para entrevistas com recrutadores**, destacando os pontos mais avançados e valiosos do projeto.

---

## 🏗️ 1. Visão Geral da Arquitetura do Projeto

A aplicação foi desenvolvida utilizando o ecossistema moderno de backend em Node.js com o framework **NestJS** (escrito em **TypeScript**) e integrado ao **Prisma ORM** com banco de dados **PostgreSQL**.

### 🌟 Decisões Arquiteturais Relevantes (Ótimo para explicar a Recrutadores)
1.  **Arquitetura Modular (Domain-Driven Clean NestJS):** Dividimos a aplicação em módulos altamente coesos e desacoplados (`Ingredients`, `Recipes`, `Pricing`, `Health`). Cada módulo encapsula seu próprio controller, service, módulo e DTOs.
2.  **Prisma ORM & PostgreSQL Relacional:** Escolhemos o PostgreSQL devido ao forte caráter transacional e financeiro do sistema. O Prisma ORM garante consultas tipadas estaticamente de ponta a ponta.
3.  **Path Mapping Aliases (`tsconfig` & Jest):** Para evitar imports relativos confusos (ex: `../../../shared`), configuramos aliases como `@database/*` e `@modules/*`. Sincronizamos esses aliases no arquivo `package.json` e `test/jest-e2e.json` para que o **Jest** rode em velocidade absurda (executa todas as suítes de testes em **menos de 1 segundo**).
4.  **Tratamento de Erro Semântico e Global:** Implementamos um filtro global de exceções do Prisma (`PrismaClientExceptionFilter`) em [prisma-client-exception.filter.ts](file:///Users/raphavidal/Developer/empadacearense/src/shared/filters/prisma-client-exception.filter.ts). Esse filtro captura erros brutos do banco e os traduz automaticamente em respostas HTTP semânticas (ex: erros de unicidade viram HTTP 409 Conflict, erros de falta de registro viram HTTP 404 Not Found, erros de chave estrangeira viram HTTP 400 Bad Request).

---

## 🥬 2. Módulos Desenvolvidos e Regras de Negócio

### 🥬 A. Módulo de Ingredientes (`ingredients`)
Este módulo faz o cadastro e gestão dos insumos alimentares com foco em sustentabilidade e saúde.
*   **Regra de Negócio Chave:** Classificação alimentar **NOVA** (indica o nível de processamento do alimento: de `NOVA_1` in natura a `NOVA_4` ultraprocessado).
*   **Gestão Financeira:** Armazena a quantidade de compra e o preço pago pelo insumo, permitindo obter o custo bruto exato de cada ingrediente.

### 🍎 B. Módulo de Receitas (`recipes`)
Este módulo consolida as fichas técnicas das receitas e é o coração operacional do negócio.
*   **Relacionamento Muitos-para-Muitos Avançado:** Criamos o modelo `RecipeIngredient` em [schema.prisma](file:///Users/raphavidal/Developer/empadacearense/prisma/schema.prisma) para vincular receitas e ingredientes. Usamos restrições estritas como:
    *   `onDelete: Cascade` na receita (se uma receita for deletada, a tabela intermediária limpa suas referências automaticamente).
    *   `onDelete: Restrict` no ingrediente (impede que um ingrediente de compra seja excluído caso exista alguma receita ativa dependente dele, blindando a consistência financeira).
*   **Passos Estruturados de Preparo (`RecipeStep`):** Implementamos a modelagem relacional de passos estruturados com índice composto `@@unique([recipeId, order])`. Isso garante a integridade de que não haverá duplicidade de passos na mesma ordem (ex: dois passos número "1").
*   **Lookups e Filtros:** As consultas garantem a ordenação cronológica do preparo no próprio banco de dados (`steps: { orderBy: { order: 'asc' } }`), e trazem paginação robusta e filtros por categoria.

### 💰 C. Módulo de Precificação (`pricing` - CMV Base)
Esta é a fundação do motor financeiro (**Pricing Engine**) da aplicação.
*   **Fórmula do Custo Proporcional:** Desenvolvemos a fórmula para encontrar o custo exato utilizado de cada insumo na receita baseada no rendimento total.
    $$\text{Custo Proporcional} = \left(\frac{\text{Preço Pago na Compra}}{\text{Quantidade Bruta Comprada}}\right) \times \text{Quantidade Utilizada na Receita}$$
*   **Precisão Monetária com Decimais:** Em JavaScript, a matemática padrão flutuante (IEEE 754) é imprecisa. Para resolver isso e garantir a integridade exigida em auditorias financeiras, implementamos arredondamento monetário estrito de duas casas decimais (`.toFixed(2)`) em cada ingrediente e no CMV acumulado final.
*   **Cenário de Resiliência:** Garante custo zero de forma estável se receitas sem ingredientes forem chamadas, em vez de retornar falhas ou valores `NaN`.

---

## 🛠️ 3. Ferramentas Avançadas e Ferramental de DevSecOps

Uma das grandes qualidades do projeto é o alto nível de automação criado no terminal de desenvolvimento para integração:

### 🐳 A. Docker e Automação de Banco de Dados local
- Criamos rotinas automáticas de terminal que verificam se o **Docker Desktop** no macOS está ligado (`open -a Docker`) antes de rodar os containers e geram o banco PostgreSQL instantaneamente.

### 📬 B. Integração Postman Cloud API & Newman
- **`scripts/sync-postman.js`:** Script que faz uma requisição HTTP autenticada à API Rest oficial do Postman e baixa de forma automatizada a sua coleção em nuvem direto para a pasta local [collection.json](file:///Users/raphavidal/Developer/empadacearense/postman/collection.json).
- **`scripts/upload-postman.js`:** Script que atualiza instantaneamente a nuvem do Postman enviando via PUT a coleção modificada localmente. Isso faz com que você trabalhe no código da API e os testes do seu aplicativo Postman Desktop se atualizem na hora.
- **Teste de Fumaça Newman:** Usamos o Newman (CLI do Postman) para rodar o fluxo completo de testes ponta-a-ponta. Validamos **33 asserções de contrato de API** com zero falhas!

### 📋 C. Integração e Transições no Jira Cloud API
- **`scripts/sync-jira.js`:** Puxa via JQL (Jira Query Language) todas as tarefas em aberto para o arquivo local [jira-tasks.md](file:///Users/raphavidal/Developer/empadacearense/jira-tasks.md).
- **`scripts/update-jira.js`:** Script que transiciona programaticamente as tarefas do Jira para `Done` direto pelo terminal adicionando comentários profissionais de desenvolvimento no seu board oficial do Jira Cloud.

---

## 💬 4. Como Vender este Projeto em Entrevistas (Perguntas & Respostas de Mock Interview)

Se um recrutador te perguntar sobre o projeto, aqui está como você pode brilhar respondendo:

### **Q1: Qual foi o maior desafio técnico que você enfrentou e como resolveu?**
> **Sua Resposta:** *"O maior desafio foi estruturar a consistência dos cálculos financeiros da ficha técnica das receitas. Precisávamos fazer divisões e multiplicações proporcionais complexas nos ingredientes a partir das notas fiscais de compra. Lidar com divisão em JavaScript pode gerar imprecisões decimais clássicas acumuladas de ponto flutuante (floating points). Eu resolvi isso implementando o arredondamento monetário estrito de duas casas decimais no cálculo proporcional de cada insumo antes de acumulá-los, garantindo precisão absoluta e resiliência a dízimas periódicas de rendimento. Além disso, criamos testes unitários específicos em Jest com dízimas para validar essa precisão financeira."*

### **Q2: Como você estruturou a validação de dados de entrada na API?**
> **Sua Resposta:** *"Utilizei o padrão DTO (Data Transfer Objects) acoplados a decorators de metadados do `class-validator` e `class-transformer` integrados de forma global na API NestJS. Para payloads aninhados e complexos, como o cadastro de receitas contendo ingredientes e passos de preparo estruturados, utilizei `@ValidateNested({ each: true })` e `@Type(() => DtoInput)`. Isso garante que requisições com dados em formatos incorretos ou em branco sejam bloqueadas na porta da API (HTTP 400), gerando respostas de erros semânticas e claras para o cliente antes mesmo de atingir a lógica de negócio ou o banco de dados."*

### **Q3: Qual é a sua estratégia para garantir a qualidade de entrega do software?**
> **Sua Resposta:** *"Minha estratégia é baseada em três pilares: (1) **Testes Unitários Rápidos:** Testamos exaustivamente todas as regras de negócio nos services de forma isolada com Jest. Mapeamos os aliases do tsconfig e Jest permitindo que a suíte inteira de mais de 30 testes rode em menos de 1 segundo, motivando o desenvolvimento ágil. (2) **Testes de Integração e Contratos:** Utilizo o Postman Cloud sincronizado localmente por meio de scripts criados por nós para rodar o Newman via linha de comando local. Isso valida a API de ponta-a-ponta em ambiente real de banco de dados. (3) **Documentação Viva:** Mantemos um arquivo central chamado `TEST_DOCUMENTATION.md` onde cada teste unitário é catalogado justificando seu valor de negócio, razão de existir e quais bugs reais ele evita."*

---

## 📈 5. Roteiro e Próximos Passos: Sprint Totalmente Concluída! 🏆✨

> [!TIP]
> **Parabéns! Nós concluímos 100% de todo o motor financeiro (Pricing Engine) do seu projeto!**
> Não restou nenhuma pendência na sprint de precificação. O Roteiro que seria para você fazer sozinha foi totalmente adiantado, programado, testado e sincronizado na nuvem!

Aqui está como cada etapa foi resolvida com sucesso absoluto:

*   **Passo 1: Configuração de Custos Operacionais (`SCRUM-58` ao `SCRUM-66`) — [CONCLUÍDO! ✅]**
    *   Modelo `OperationalCostConfig` no Prisma, migration aplicada, endpoints `GET` e `POST` no `PricingConfigController` ativos e documentados no Swagger.
*   **Passo 2: Cálculo de Mão de Obra (`SCRUM-67` ao `SCRUM-72`) — [CONCLUÍDO! ✅]**
    *   Integramos a fórmula de mão de obra no `PricingService`: `(prepTime / 60) * hourlyRate` baseando-se no tempo de preparo da receita e no valor hora operacional do confeiteiro.
*   **Passo 3: Custos Indiretos e Embalagem (`SCRUM-73` ao `SCRUM-78`) — [CONCLUÍDO! ✅]**
    *   Implementamos o cálculo de taxas operacionais indiretas aplicadas sobre o CMV de ingredientes e somamos o custo unitário de embalagem da configuração operacional.
*   **Passo 4: Preço de Venda Sugerido e Breakdown (`SCRUM-79` ao `SCRUM-87`) — [CONCLUÍDO! ✅]**
    *   Calculamos o preço de venda recomendado com a margem de lucro multiplicadora e expomos todo o breakdown financeiro detalhado no endpoint rest **`GET /recipes/:id/cost`**.

### 🌟 O que fazer agora?
Com as duas primeiras sprints 100% concluídas (Ingredientes, Receitas, Passos estruturados, CMV, Parâmetros operacionais, Mão de Obra e Precificação Completa), você pode iniciar a próxima sprint comercial do projeto, como:
1. **Gestão de Vendas e Produção:** CRUD de pedidos de clientes, controle de estoque proporcional de ingredientes de acordo com as receitas vendidas, e relatórios de lucratividade real baseados no CMV.
2. **Interface Visual (Frontend):** Se quiser transformar a API em um aplicativo completo, você pode construir uma interface web premium (usando React ou Next.js) conectando-se a esses endpoints para mostrar as fichas técnicas e o motor financeiro de precificação em gráficos modernos e interativos!
