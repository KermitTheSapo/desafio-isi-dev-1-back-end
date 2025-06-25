# Desafio Técnico – Desenvolvedor Fullstack Júnior - Backend

Backend API para gerenciamento de produtos com sistema de cupons de desconto, desenvolvido com NestJS e TypeScript.

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e execução

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd desafio-isi-dev-1-back-end
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

4. **Execute o projeto em modo de desenvolvimento**

```bash
npm run start:dev
```

5. **Acesse a aplicação**

- API: http://localhost:3001/api/v1
- Documentação Swagger: http://localhost:3001/docs

### Scripts disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Executa em modo desenvolvimento com hot-reload
npm run start:debug        # Executa em modo debug

# Build e produção
npm run build              # Build da aplicação
npm run start:prod         # Executa em modo produção

# Testes
npm test                   # Executa todos os testes
npm run test:watch         # Executa testes em modo watch
npm run test:cov           # Executa testes com coverage
npm run test:unit          # Executa apenas testes unitários
npm run test:integration   # Executa apenas testes de integração

# Qualidade de código
npm run lint               # Verifica linting
npm run lint:fix           # Corrige problemas de linting automaticamente
npm run format             # Formata código com Prettier
npm run format:check       # Verifica formatação
npm run typecheck          # Verifica tipagem TypeScript
npm run check-all          # Executa todas as verificações
```

## 📁 Estrutura do projeto

```
src/
├── app.module.ts          # Módulo principal da aplicação
├── main.ts               # Ponto de entrada da aplicação
├── common/               # Utilitários e interfaces compartilhados
│   └── interfaces/       # Interfaces comuns
├── products/             # Módulo de produtos
│   ├── products.controller.ts    # Controller REST para produtos
│   ├── products.service.ts       # Lógica de negócio de produtos
│   ├── products.module.ts        # Configuração do módulo
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # Entidades do banco de dados
│   ├── interfaces/       # Interfaces específicas de produtos
│   └── services/         # Serviços auxiliares (validação, query builder, etc.)
└── coupons/              # Módulo de cupons
    ├── coupons.controller.ts     # Controller REST para cupons
    ├── coupons.service.ts        # Lógica de negócio de cupons
    ├── coupons.module.ts         # Configuração do módulo
    ├── dto/              # Data Transfer Objects
    └── entities/         # Entidades do banco de dados

tests/                    # Testes organizados por módulo
├── setup.ts             # Configuração global dos testes
├── products/            # Testes do módulo de produtos
└── coupons/             # Testes do módulo de cupons

coverage/                # Relatórios de cobertura de testes
```

### Descrição das principais pastas

- **`src/`**: Código fonte da aplicação
- **`src/common/`**: Interfaces e utilitários compartilhados entre módulos
- **`src/products/`**: Módulo completo para gerenciamento de produtos, incluindo aplicação de cupons e descontos
- **`src/coupons/`**: Módulo para gerenciamento de cupons de desconto
- **`tests/`**: Testes unitários e de integração organizados por módulo
- **`coverage/`**: Relatórios de cobertura de código gerados pelos testes

## 🛠 Tecnologias utilizadas

### Framework e Runtime

- **NestJS** (v11.1.3) - Framework Node.js para construção de APIs escaláveis e bem estruturadas
  - _Motivo_: Arquitetura modular, decorators, injeção de dependência nativa e excelente suporte ao TypeScript
- **Node.js** - Runtime JavaScript
- **TypeScript** (v5.8.3) - Superset do JavaScript com tipagem estática
  - _Motivo_: Maior segurança de tipos, melhor experiência de desenvolvimento e manutenibilidade

### Banco de Dados e ORM

- **TypeORM** (v0.3.25) - ORM para TypeScript e JavaScript
  - _Motivo_: Excelente integração com NestJS, suporte robusto ao SQLite e migrations automáticas
- **SQLite3** (v5.1.7) - Banco de dados para desenvolvimento e testes
  - _Motivo_: Simplicidade para desenvolvimento, não requer configuração adicional, ideal para demos e testes

### Validação e Transformação

- **class-validator** (v0.14.2) - Validação baseada em decorators
  - _Motivo_: Integração nativa com NestJS, validação declarativa e mensagens de erro personalizáveis
- **class-transformer** (v0.5.1) - Transformação de objetos
  - _Motivo_: Conversão automática de tipos e serialização/deserialização de dados

### Documentação

- **Swagger/OpenAPI** (@nestjs/swagger v11.2.0) - Documentação automática da API
  - _Motivo_: Geração automática de documentação, interface interativa para testes da API

### Testes

- **Jest** (v30.0.2) - Framework de testes
  - _Motivo_: Excelente suporte ao TypeScript, mocking robusto e relatórios de cobertura

### Qualidade de Código

- **ESLint** (v9.0.0) - Linter para JavaScript/TypeScript
  - _Motivo_: Identificação de problemas de código, manutenção de padrões
- **Prettier** (v3.0.0) - Formatador de código
  - _Motivo_: Formatação consistente, integração com editores

## 🏗 Arquitetura e Decisões Técnicas

### Padrões Arquiteturais

- **Modular Architecture**: Separação em módulos independentes (Products, Coupons)
- **Service Layer Pattern**: Separação clara entre controllers e lógica de negócio
- **Repository Pattern**: Abstração do acesso a dados através do TypeORM
- **DTO Pattern**: Validação e transformação de dados de entrada e saída

### Estrutura de Serviços Especializados

O módulo de produtos utiliza uma arquitetura de serviços especializados:

- **ProductsService**: Orquestração geral e operações CRUD
- **ProductValidationService**: Validações específicas de negócio
- **ProductQueryBuilderService**: Construção dinâmica de queries
- **ProductDiscountService**: Lógica de aplicação de descontos

### Banco de Dados

- **SQLite em memória** para desenvolvimento/testes
- **Sincronização automática** de schema
- **Entidades relacionais** para produtos, cupons e aplicações de cupons

### Validação e Transformação

- Validação automática de DTOs usando decorators
- Transformação implícita de tipos
- Whitelist de propriedades para segurança

## 📊 Funcionalidades Implementadas

### Produtos

- ✅ CRUD completo de produtos
- ✅ Busca com filtros (nome, categoria, preço)
- ✅ Aplicação de cupons de desconto
- ✅ Aplicação de desconto percentual direto
- ✅ Validações de negócio

### Cupons

- ✅ CRUD completo de cupons
- ✅ Busca por código
- ✅ Estatísticas de uso
- ✅ Validação de expiração e limites

### Qualidade

- ✅ Testes unitários abrangentes (>90% cobertura)
- ✅ Testes de integração
- ✅ Documentação automática com Swagger
- ✅ Validação rigorosa de dados
- ✅ Tratamento de erros consistente

## 🔧 Configuração de Ambiente

O arquivo `.env.example` contém todas as variáveis necessárias:

```bash
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_TYPE=sqlite
DB_DATABASE=:memory:
DB_SYNCHRONIZE=true
DB_LOGGING=true

# Application Configuration
API_PREFIX=api/v1
CORS_ENABLED=true

# Validation Configuration
VALIDATION_WHITELIST=true
VALIDATION_FORBID_NON_WHITELISTED=true
```

## 🧪 Executando Testes

```bash
# Todos os testes
npm test

# Testes com coverage
npm run test:cov

# Testes em modo watch
npm run test:watch

# Apenas testes unitários
npm run test:unit
```

Os testes cobrem:

- Validação de DTOs
- Lógica de negócio dos serviços
- Endpoints dos controllers
- Entidades do banco de dados
- Cenários de erro e edge cases

## 📝 API Documentation

A documentação completa da API está disponível em `/docs` quando a aplicação estiver rodando, gerada automaticamente pelo Swagger com base nos decorators dos controllers.

---

Desenvolvido como parte do Desafio ISI Dev 🚀
