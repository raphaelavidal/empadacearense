# Plano de Implementação - Transparência Nutricional & Classificação NOVA

Este plano detalha o design técnico, a arquitetura e o roteiro de execução para a sprint de **Transparência Nutricional (sprint `SCRUM-91` a `SCRUM-115`)**. 

O principal objetivo deste módulo é fornecer rastreabilidade alimentar completa. O sistema deve armazenar a composição textual dos rótulos dos ingredientes (`compositionLabel`), rastrear a verificação da classificação (`isNovaVerified`), expor a classificação de processamento dos alimentos no padrão NOVA (Grupos 1 a 4) e **classificar automaticamente as receitas** com base na presença ou ausência de ingredientes ultraprocessados.

---

## 🛠️ User Review Required

> [!IMPORTANT]
> **Fórmula de Classificação Dinâmica da Receita (`SCRUM-104`):**
> Propomos que a classificação consolidada da receita seja computada sob demanda (dinamicamente) no serviço `RecipesService` no momento da serialização do DTO de retorno, seguindo o padrão científico de criticidade do guia alimentar:
> 1. Se **pelo menos um** ingrediente for classificado como **`NOVA_4`** (Alimentos Ultraprocessados), a receita é rotulada como **`Contém ultraprocessados`**.
> 2. Se a receita não contiver nenhum `NOVA_4`, mas contiver **pelo menos um** ingrediente classificado como **`NOVA_3`** (Alimentos Processados), a receita é rotulada como **`Processada`**.
> 3. Caso contrário (todos os ingredientes pertencem ao grupo `NOVA_1` ou `NOVA_2`, ou a receita não possui ingredientes), a receita é rotulada como **`Natural`**.
>
> Essa abordagem evita redundância e anomalias de sincronização no banco de dados, recalculando instantaneamente o rótulo nutricional se a composição ou classificação dos ingredientes sofrer alguma alteração.

---

## 📂 Proposed Changes

### 🍎 1. Contratos DTO & Documentação Swagger (Ingredientes)

#### [MODIFY] [create-ingredient.dto.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/ingredients/dto/create-ingredient.dto.ts)
- Adicionar anotações `@ApiProperty` e `@ApiPropertyOptional` para documentação Swagger completa de todos os campos:
  - `name`, `brand`, `unit`, `novaClassification`, `compositionLabel`, `isNovaVerified`, `purchasePrice`, `purchaseQuantity`.

#### [NEW] [ingredient-response.dto.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/ingredients/dto/ingredient-response.dto.ts)
- Criar a classe `IngredientResponseDto` para formalizar a saída dos endpoints de ingredientes com documentação Swagger rica.
- Adicionar propriedades:
  - `id`, `name`, `brand`, `unit`, `novaClassification`, `compositionLabel`, `isNovaVerified`, `purchasePrice`, `purchaseQuantity`, `createdAt`, `updatedAt`.

#### [MODIFY] [ingredients.controller.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/ingredients/ingredients.controller.ts)
- Decorar os métodos `@Post()`, `@Get()`, e `@Get(':id')` com respostas Swagger explícitas apontando para `IngredientResponseDto`.

---

### 🥗 2. Agregação e Rótulo Nutricional de Receitas

#### [MODIFY] [recipe-response.dto.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/recipes/dto/recipe-response.dto.ts)
- Atualizar `RecipeIngredientResponseDto` para retornar `compositionLabel` e `isNovaVerified`, mantendo o Swagger atualizado.
- Adicionar o campo consolidado de classificação na receita principal:
  ```typescript
  @ApiProperty({
    description: 'Classificação nutricional consolidada da receita',
    example: 'Natural',
    enum: ['Natural', 'Processada', 'Contém ultraprocessados'],
  })
  classification: 'Natural' | 'Processada' | 'Contém ultraprocessados';
  ```

#### [MODIFY] [recipes.service.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/recipes/recipes.service.ts)
- Adicionar a lógica de classificação dinâmica no método `mapToResponse(recipe: any)`:
  - Analisar os ingredientes da receita.
  - Implementar a regra de precedência descrita na seção *User Review Required*.
  - Retornar o campo consolidado `classification` no DTO de saída.

---

### 📄 3. Arquitetura para Automação Futura (ADR)

#### [NEW] [0002-classificacao-nova-automatizada.md](file:///Users/raphavidal/Developer/empadacearense/docs/adr/0002-classificacao-nova-automatizada.md)
- Criar um registro de decisão arquitetural (ADR) formal detalhando o design da futura classificação automática:
  - Integração assíncrona ou síncrona com LLM (ex: Gemini API) enviando `compositionLabel`.
  - Tratamento de ingredientes suspeitos ou termos químicos que disparam alertas `NOVA_4`.
  - Mecanismo de curadoria com revisão humana controlada por `isNovaVerified`.

---

### 🧪 4. Garantia de Qualidade & Testes

#### [MODIFY] [recipes.service.spec.ts](file:///Users/raphavidal/Developer/empadacearense/src/modules/recipes/recipes.service.spec.ts)
- Escrever testes unitários específicos para validar a classificação de receitas com diferentes combinações de ingredientes:
  - Caso 1: Receita contendo ingredientes apenas `NOVA_1`/`NOVA_2` -> Classificada como `Natural`.
  - Caso 2: Receita contendo ingrediente `NOVA_3` (ex: pão ou queijo processado) sem `NOVA_4` -> Classificada como `Processada`.
  - Caso 3: Receita contendo ingrediente `NOVA_4` (ex: essência artificial ou aditivos químicos) -> Classificada como `Contém ultraprocessados`.
  - Caso 4: Receita vazia (sem ingredientes) -> Classificada como `Natural`.

---

### 📬 5. Integração com Postman & Newman

#### [MODIFY] [collection.json](file:///Users/raphavidal/Developer/empadacearense/postman/collection.json)
- Acrescentar testes automatizados pós-requisição que validem o campo `classification` e a presença dos atributos de transparência nutricional nas respostas da API de receitas e ingredientes.

---

## 🧪 Verification Plan

### Automated Tests
- Rodar a suíte completa de testes unitários local:
  ```bash
  npm run test
  ```
- Validar builds de produção do NestJS para garantir que não há erros de tipagem TypeScript:
  ```bash
  npm run build
  ```
- Executar os testes automatizados de integração API com Newman:
  ```bash
  npx newman run postman/collection.json
  ```
