# 🧪 Documentação e Estratégia de Testes

Este documento detalha a arquitetura de testes do **Empada Cearense API**. O objetivo é garantir que cada teste tenha uma **razão de ser clara**, capture bugs reais e atue como salvaguarda da qualidade do código, evitando "testes de cobertura" (focados apenas em métricas, sem validação real de regras de negócio).

---

## 🎯 Filosofia de Testes do Projeto

Para nós, um teste excelente deve:
1.  **Garantir a Regra de Negócio:** Se a regra de negócio mudar ou quebrar, o teste correspondente *deve* falhar.
2.  **Prevenir Regressões:** Mudar a estrutura interna do código (refatoração) não deve quebrar o teste, a menos que o comportamento externo ou os contratos da API mudem.
3.  **Capturar Bugs de Integração e Tipagem:** Validar o tráfego correto de DTOs, conversão de tipos de dados (como string para número em parâmetros) e relacionamentos no ORM.

---

## 📂 Catálogo Detalhado de Testes Unitários

Atualmente, o projeto possui **16 testes unitários** divididos em 3 módulos principais. Abaixo está a justificativa, o valor comercial e os potenciais bugs que cada teste previne.

### 🥬 1. Módulo de Ingredientes (`ingredients`)

Este módulo é o coração dos insumos saudáveis. Seus testes validam o cadastro seguro (classificação NOVA) e a eficiência das listagens.

#### A. `ingredients.service.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`should successfully create an ingredient`** | Garante que o mapeamento entre o DTO de criação e a chamada ao Prisma ORM está íntegro e tipado. | • Desalinhamento de nomenclatura de campos entre a API e a tabela do Prisma.<br>• Falhas ao salvar campos obrigatórios de insumos. |
| **`should return a paginated list of ingredients without search filter`** | Valida a lógica matemática do offset da paginação (`(page - 1) * limit`), o ordenamento decrescente de criação e a resposta de metadados. | • Erros de "off-by-one" (ex: pular registros errados).<br>• Erro no cálculo matemático do número total de páginas (`totalPages`). |
| **`should return a paginated list with case-insensitive name search filter`** | Valida o mecanismo de filtro textual e garante que a busca por nome ignore variações de caixa alta/baixa. | • Busca retornar zero resultados caso o usuário digite "farinha" em vez de "Farinha" (case mismatch).<br>• Ignorar termo de busca em consultas específicas. |
| **`should return a single ingredient by id`** | Assegura que a busca por um identificador único filtre exatamente a chave primária correta. | • Consulta retornar o item errado por erro no parâmetro do `where`. |
| **`should throw a NotFoundException if ingredient does not exist`** | **Validação de Erro:** Assegura que a API lance `404 Not Found` caso o ID buscado não exista. | • Retornar HTTP 200 com corpo `null` para consultas inexistentes, confundindo clientes HTTP. |
| **`should delete an ingredient by id`** | Assegura o encerramento correto do ciclo de vida do insumo no banco. | • Tentar deletar sem a cláusula restritiva correta de ID (causando deleções acidentais). |
| **`should throw a NotFoundException if ingredient does not exist for deletion`** | **Validação de Erro:** Assegura que a API lance `404 Not Found` caso tente excluir um insumo inexistente. | • Lançar erros genéricos HTTP 500 no banco quando um recurso não puder ser deletado. |

#### B. `ingredients.controller.spec.ts`

Controllers são os portões da API. Seus testes validam a **extração de parâmetros HTTP** e a **delegação de payloads**.

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`create`** | Valida se a rota `POST` recebe o payload e delega intacto para o service. | • Payload ser descartado ou corrompido antes de chegar na camada de persistência. |
| **`findAll`** | Valida se o decorator `@Query()` captura corretamente os query parameters de paginação/busca e os repassa. | • Erros graves onde `@Query()` é omitido ou mapeado incorretamente, fazendo a paginação ser ignorada na rota HTTP. |
| **`findOne`** | Valida a conversão do parâmetro de ID da URL (que chega como `string`) para `number` (`+id`). | • Erros de tipagem e runtime gerados se um ID string for repassado diretamente para uma busca de ID numérico no banco. |
| **`remove`** | Valida a conversão do ID da URL para delegação de exclusão ao service. | • Falha de exclusão por passagem de ID não convertido. |

---

### 🍎 2. Módulo de Receitas (`recipes`)

Responsável pela estrutura de receitas, passos estruturados e a amarração muitos-para-muitos dos ingredientes.

#### A. `recipes.service.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`should successfully create a recipe with steps and map it to RecipeResponseDto if all ingredients exist`** | **Altamente Crítico!** Valida a transação relacional complexa, persistência de passos estruturados e o mapeamento final. Garante que os insumos e passos aninhados no DTO sejam corretamente criados no banco e convertidos de forma limpa. | • Erros de sintaxe ou mapeamento no mapeador do Prisma.<br>• Falhas ao vincular passos ou insumos na transação de escrita. |
| **`should throw a BadRequestException if any ingredient does not exist in the database`** | **Validação de Erro:** Assegura que o service bloqueie a criação de receitas que informem IDs de insumos inexistentes no banco. | • Tentar criar associações com chaves primárias inválidas, gerando falhas brutas e HTTP 500 no banco. |
| **`should return paginated recipes and metadata with category filter`** | Valida a lógica matemática de offset/limite da paginação de receitas e a filtragem opcional e case-insensitive por categoria. | • Erros de paginação (off-by-one).<br>• Filtro de categoria retornar zero registros por variação de caixa. |
| **`should return the recipe detailed with ingredients and steps ordered by order ASC`** | Garante que a busca detalhada de receita por ID retorne todas as informações relacionadas e com os passos ordenados crescentemente por `order`. | • Passos de preparo retornados fora de ordem cronológica, prejudicando o fluxo na interface.<br>• Omissão de dados de ingredientes na visualização. |
| **`should throw a NotFoundException if recipe with given ID does not exist`** | **Validação de Erro:** Garante que a API lance `404 Not Found` semântico se a receita consultada não for localizada. | • Retornar HTTP 200 com corpo vazio ou erro genérico de banco. |

#### B. `recipes.controller.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`create`** | Garante que o JSON aninhado e complexo enviado no `POST /recipes` chegue íntegro ao service. | • Descarte de arrays de ingredientes ou passos aninhados no binding do body da requisição HTTP. |
| **`findAll`** | Valida se a rota `GET /recipes` recebe os query parameters de paginação/busca e os delega perfeitamente. | • Parâmetros de paginação e busca sendo ignorados no binding HTTP do NestJS. |
| **`findOne`** | Valida a conversão automática do parâmetro de ID da URL (string) para number (`+id`) e a chamada correta do service. | • Erros de tipagem e runtime gerados se um ID string for repassado diretamente para a busca. |

---

### 💰 3. Módulo de Precificação (`pricing`)

Responsável pelo motor de cálculo financeiro e precisão decimal proporcional de CMV.

#### A. `pricing.service.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`should successfully calculate the base proportional cost of ingredients and unit cost`** | **Altamente Crítico!** Garante a exatidão matemática do cálculo proporcional do custo de ingredientes: `(preço_compra / quantidade_compra) * quantidade_usada`. | • Erros de lógica matemática ou fórmulas incorretas.<br>• Falhas no mapeamento do custo acumulado. |
| **`should return total and unit cost of zero if recipe has no ingredients`** | **Validação de Borda:** Assegura estabilidade e retorno seguro (custo zero) quando receitas vazias forem consultadas. | • Lançar erros HTTP 500 ou retornar `NaN`/`null` para receitas sem insumos. |
| **`should throw a NotFoundException if the recipe does not exist`** | **Validação de Erro:** Assegura que a busca de precificação retorne 404 semântico e consistente para IDs inválidos. | • Retornar respostas de sucesso com corpos nulos ou vazios. |
| **`should handle decimal rounding precision correctly`** | **Precisão Monetária:** Valida se a dízima periódica ou arredondamento matemático é tratado na precisão de exatamente duas casas decimais (`.toFixed(2)`). | • Dízimas ou pequenos desvios de precisão IEEE 754 se acumularem em grandes produções. |
| **`getConfig (default)`** | Garante inicialização e retorno de parâmetros padrão se a tabela do banco de dados estiver vazia, impedindo quebras iniciais no deploy. | • Erro de ponteiro nulo (null pointer) ao tentar ler tabelas de configuração vazias. |
| **`getConfig (existing)`** | Assegura a recuperação correta dos parâmetros financeiros existentes no banco de dados. | • Omissão ou falha de leitura das configurações gravadas. |
| **`updateConfig (create)`** | Valida a gravação da primeira entrada de configurações se o banco estiver vazio. | • Erro de runtime de escrita inicial. |
| **`updateConfig (update)`** | Valida o mecanismo de substituição (UPSERT) mantendo sempre uma única configuração ativa na base de dados. | • Acúmulo desnecessário de linhas de configuração antigas no banco de dados. |

#### B. `pricing.controller.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`calculateCost`** | Valida a correta conversão de parâmetros de URL e delegação semântica da rota `GET /recipes/:id/cost` ao service. | • Desalinhamento de binding ou omissão de conversão de parâmetros. |

#### C. `pricing-config.controller.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`getConfig`** | Valida a correta delegação da rota `GET /pricing/config` para o service. | • Erro no mapeamento da rota HTTP de consulta. |
| **`updateConfig`** | Valida o binding do body da requisição `POST /pricing/config` e delegação com payload. | • Descarte de dados de payload do body do JSON. |

---

### 🏥 4. Módulo de Infraestrutura (`health`)

#### A. `health.controller.spec.ts`

| Teste (Caso de Uso) | Razão de Existir / Valor de Negócio | Bugs Reais que Captura |
| :--- | :--- | :--- |
| **`should return status ok`** | Atua como **Sanity Test (Heartbeat)**. Valida se o container de injeção de dependências do NestJS consegue inicializar e que as rotas de infraestrutura mais básicas respondem. | • Falhas catastróficas de bootstrap da aplicação que impeçam o servidor de subir. |

---

## 🛠️ Análise de Testes Desnecessários ou Redundantes

Realizamos uma varredura completa nas suítes de testes em busca de redundâncias:

1.  **Mocking Estratégico:** Todos os testes unitários usam mocks puros do Prisma (`PrismaService`). Isso significa que eles **não dependem de um banco real rodando** e executam em **milisegundos**.
2.  **Sem "Testes para Encher Linhas":** Não há testes repetidos que validem exatamente o mesmo caminho de código sob condições idênticas.
3.  **Controllers vs Services:** À primeira vista, testar a delegação de um controller para um service pode parecer redundante. No entanto, no NestJS, isso é **vital** porque:
    *   Valida a conversão de parâmetros (`+id`, `@Query()`).
    *   Assegura que decorators do Swagger e decorators HTTP estejam configurados sem erros de digitação.
    *   Portanto, **nenhum teste atual é desnecessário ou elegível para remoção**, pois todos protegem o fluxo de dados contra regressões de integração.
