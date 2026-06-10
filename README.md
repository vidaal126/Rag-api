# rag-api2

API NestJS com arquitetura Hexagonal + DDD.

## Stack

| Item | Escolha |
|---|---|
| Framework | NestJS 11 (Fastify) |
| Linguagem | TypeScript (strict) |
| Banco | PostgreSQL 17 |
| ORM | Prisma 7 (adapter `PrismaPg`) |
| Logger | nestjs-pino (estruturado, pretty em dev) |
| Segurança HTTP | @fastify/helmet, CORS, @nestjs/throttler |
| Testes | Vitest + SWC |
| Lint/Format | Biome + typescript-eslint (regras `no-unsafe-*`) |
| Docs | Swagger em `/api/docs` (somente dev) |

## Estrutura (Hexagonal + DDD)

```
src/
├── main.ts                      # bootstrap (helmet, CORS, versioning, pipes, swagger)
├── config/
│   └── env.validation.ts        # schema Joi validado no boot
├── domain/                      # zero dependências externas
│   ├── entities/user/           # entidade (factory + props privados), VO, exceções
│   ├── repositories/user/       # interface IUserRepository + token
│   └── services/                # interfaces de serviços de domínio
├── application/
│   ├── usecases/user/           # orquestração: use cases + DTOs internos
│   └── services/                # lógica pura reutilizável entre use cases
├── infrastructure/
│   ├── database/prisma/         # schema.prisma, models/, migrations/, PrismaService
│   ├── repositories/            # implementações (Prisma, in-memory)
│   ├── mappers/                 # entidade ↔ modelo de persistência
│   └── http/                    # guards, filters, interceptors, exceções base
├── presentation/
│   ├── controllers/v1/          # controllers finos
│   ├── dtos/                    # DTOs HTTP (class-validator + Swagger)
│   ├── mappers/                 # DTO HTTP → input de use case
│   └── modules/                 # app.module, shared.module, módulos de feature
└── common/                      # utilitários transversais
```

Regra de dependência: `presentation → application → domain ← infrastructure`.

## Como rodar

```bash
cp .env.example .env

# sobe o Postgres (porta 5433 no host)
docker compose up -d postgres

# aplica migrations e gera o client
npx prisma migrate dev

# dev com hot reload
yarn start:dev
```

Ou tudo via Docker:

```bash
docker compose up
```

## Scripts

| Script | Função |
|---|---|
| `yarn start:dev` | dev com hot reload |
| `yarn build` | build de produção |
| `yarn lint` | Biome + ESLint com auto-fix |
| `yarn lint:check` | lint sem escrita (CI) |
| `yarn test` | testes unitários |
| `yarn test:cov` | testes com cobertura |

## Endpoints de exemplo

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/users` | cria usuário (201, 422 se e-mail duplicado) |
| GET | `/api/v1/users/:id` | busca usuário (200, 404) |

Todas as respostas seguem o envelope padrão com `statusCode`, `timestamp`, `path`, `traceId` e `data`/`error`.

## Registries

O diretório `registries/` documenta os artefatos reutilizáveis do projeto (controllers, repositórios, serviços, contratos, utilitários). Consulte antes de criar algo novo.
