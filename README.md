# Empada Cearense API 🍎💰

ERP focado em empreendedoras de alimentação saudável e sem ultraprocessados.

O sistema combina:
- transparência nutricional
- classificação NOVA
- precificação inteligente
- gestão de receitas
- cálculo de CMV

---

# Objetivo do Projeto

O Empada Cearense busca ajudar produtoras de alimentos a:

- calcular corretamente seus custos
- valorizar mão de obra
- reduzir erros de precificação
- manter rastreabilidade nutricional
- identificar ultraprocessados
- gerar transparência para consumidores finais

---

# Principais Funcionalidades

## Gestão de Ingredientes

- cadastro de insumos
- composição textual dos ingredientes
- classificação NOVA
- informações nutricionais
- custos de compra

---

## Gestão de Receitas

- fichas técnicas
- rendimento
- tempo de preparo
- ingredientes e quantidades
- modo de preparo estruturado

---

## Precificação Inteligente

- cálculo automático de CMV
- cálculo de mão de obra
- custos operacionais
- margem de lucro
- preço sugerido

---

## Transparência Nutricional

- rastreabilidade alimentar
- identificação de ultraprocessados
- preparação para classificação automática futura

---

# Stack Tecnológica

## Backend

- TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- Docker

---

## Qualidade

- ESLint
- Prettier
- Jest
- TDD para regras críticas de negócio

---

# Estrutura do Projeto

```text
src/
├── config/
├── database/
├── modules/
├── shared/
```

---

# Arquitetura

O projeto segue arquitetura modular baseada no NestJS.

## Modules

Responsáveis pela separação de domínios:

- ingredients
- recipes
- pricing
- nutritional

---

## Services

Contêm regras de negócio:
- cálculo de custo
- classificação NOVA
- agregações nutricionais

---

## Controllers

Responsáveis pela exposição da API REST.

---

## DTOs

Responsáveis por:
- validação
- transformação
- tipagem dos dados

---

# Ambiente de Desenvolvimento

## Requisitos

- Node.js
- Docker Desktop
- PostgreSQL (via Docker)

---

# Configuração do Projeto

## Instalar dependências

```bash
npm install
```

---

## Configurar variáveis de ambiente

Crie um arquivo `.env`:

```env
PORT=3000

DATABASE_URL="postgresql://postgres:postgres@localhost:5433/empada_cearense"
```

---

# Executando PostgreSQL com Docker

```bash
docker compose up -d
```

---

# Executando o projeto

## Desenvolvimento

```bash
npm run start:dev
```

---

# Testes

## Executar testes unitários

```bash
npm run test
```

---

## Coverage

```bash
npm run test:cov
```

---

# Documentação da API

Futuramente disponível via Swagger:

```text
http://localhost:3000/api
```

---

# Roadmap do MVP

## Sprint 1
- setup do projeto
- Docker
- PostgreSQL
- Prisma

## Sprint 2
- gestão de ingredientes

## Sprint 3
- gestão de receitas

## Sprint 4
- motor de precificação

## Sprint 5
- classificação NOVA

---

# Futuras Funcionalidades

- classificação automática de ingredientes
- análise nutricional inteligente
- geração de páginas públicas de produtos
- detecção de ultraprocessados
- relatórios financeiros
- gestão de estoque
- multiusuário

---

# Status

🚧 MVP em desenvolvimento