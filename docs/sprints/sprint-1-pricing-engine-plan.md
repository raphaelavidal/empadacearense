# Plano de Implementação - Cálculo de Custo Base da Receita (Pricing Engine)

Este plano aborda a implementação da fundação do motor de precificação (**Pricing Engine**), cobrindo do **`SCRUM-50`** ao **`SCRUM-90`** (e `SCRUM-116`). O objetivo é calcular automaticamente o custo total proporcional dos ingredientes utilizados em uma receita (Custo de Matéria-Prima / CMV), tratando precisão de valores decimais, cenários de receitas sem ingredientes (custo zero), testes unitários com Jest e integração automatizada no Postman/Newman.

---

## 🛠️ User Review Required

> [!IMPORTANT]
> **Estrutura de Subrecurso REST:**
> Propomos expor a rota de cálculo no endpoint **`GET /recipes/:id/cost`**. Embora a regra de negócio resida em um novo serviço dedicado (`PricingService`), expor o endpoint de cálculo como um subrecurso de receitas torna a API altamente semântica e intuitiva de navegar.

---

## 📂 Proposed Changes

### 🍎 1. Criação do Módulo de Precificação (`Pricing`)

#### [NEW] [pricing.module.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/pricing/pricing.module.ts)
- Registrar o novo módulo NestJS.
- Importar `PrismaModule` e o serviço de receitas se necessário, ou usar `PrismaService` diretamente para otimizar queries específicas de custos.

#### [NEW] [recipe-cost-response.dto.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/pricing/dto/recipe-cost-response.dto.ts)
- Definir o DTO `RecipeCostResponseDto` com anotações de documentação Swagger.
- Propriedades de retorno:
  - `recipeId`: `number` (ID da receita)
  - `recipeName`: `string` (Nome da receita)
  - `yield`: `number` (Rendimento total)
  - `yieldUnit`: `UnitType` (Unidade de rendimento)
  - `totalBaseCost`: `number` (Custo total proporcional de ingredientes - CMV)
  - `unitBaseCost`: `number` (Custo unitário baseado no rendimento total)
  - `ingredients`: Array de custos detalhados por ingrediente:
    - `ingredientId`: `number`
    - `name`: `string`
    - `quantityUsed`: `number` (Quantidade utilizada)
    - `unit`: `UnitType` (Unidade de medida)
    - `proportionalCost`: `number` (Custo proporcional exato calculados via precisão decimal)

#### [NEW] [pricing.service.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/pricing/pricing.service.ts)
- Implementar o método `calculateRecipeBaseCost(recipeId: number): Promise<RecipeCostResponseDto>`:
  - Buscar a receita e seus ingredientes relacionados com `PrismaService`.
  - Se a receita não existir, lançar `NotFoundException` (HTTP 404).
  - Tratar receitas sem ingredientes retornando `totalBaseCost: 0` e `unitBaseCost: 0` de forma segura.
  - Para cada ingrediente:
    - Realizar a divisão matemática de custo com precisão utilizando decimais: `(purchasePrice / purchaseQuantity) * quantityUsed`.
  - Mapear a resposta achatada garantindo que todas as propriedades numéricas flutuantes sejam convertidas de `Decimal` para `number` na saída.

#### [NEW] [pricing.controller.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/pricing/pricing.controller.ts)
- Expor a rota **`GET /recipes/:id/cost`** ou **`GET /pricing/recipes/:id/cost`**.
- Adicionar decorators completos do `@nestjs/swagger` (`@ApiOperation`, `@ApiResponse`, `@ApiParam`).
- Fazer a injeção do `PricingService` para resolver o cálculo.

#### [MODIFY] [app.module.ts](file:///Users/raphavidal/Developer/empadacearense/src/app.module.ts)
- Importar e registrar o `PricingModule` no imports principal.

---

### 🧪 2. Garantia de Qualidade & Testes

#### [NEW] [pricing.service.spec.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/pricing/pricing.service.spec.ts)
- Testar cálculo base proporcional de ingredientes com sucesso.
- Testar receita sem nenhum ingrediente associado (retorno correto de custo zero).
- Testar receita inexistente (retorno de `NotFoundException`).
- Testar precisão matemática e arredondamento monetário de duas casas decimais.

#### [NEW] [pricing.controller.spec.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/pricing/pricing.controller.spec.ts)
- Validar binding e delegação correta da rota para o service.

#### [MODIFY] [TEST_DOCUMENTATION.md](file:///Users/raphavidal/Developer/empadacearense/test/TEST_DOCUMENTATION.md)
- Acrescentar a seção de testes da precificação detalhando a estratégia de exatidão de CMV proporcional.

---

### 📬 3. Integração Postman & Newman

#### [MODIFY] [collection.json](file:///Users/raphavidal/Developer/empadacearense/postman/collection.json)
- Adicionar as requisições:
  - `GET /recipes/:id/cost` (Sucesso)
  - `GET /recipes/9999/cost` (NotFound - 404)
- Adicionar asserções de testes Postman validando se a resposta é um objeto válido de custos, calculando corretamente o custo proporcional.

---

## 🧪 Verification Plan

### Automated Tests
- Executar testes unitários locais com Jest:
  ```bash
  npm run test
  ```
- Inicializar a API e rodar o Newman para validar os fluxos integrados ponta-a-ponta:
  ```bash
  npx newman run postman/collection.json
  ```
