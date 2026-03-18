# Brain Agriculture

Sistema full-stack para gestao de produtores rurais, fazendas, safras e culturas.

- Backend: NestJS + DDD + TypeORM + PostgreSQL
- Frontend: Next.js 14 + Redux Toolkit + styled-components
- Banco e schema: PostgreSQL + Sqitch
- Testes: Jest, React Testing Library e pg-mem

## Visao Geral

O backend expoe uma API REST com prefixo `/api` para cadastro e consulta de produtores, fazendas, safras, culturas e dashboard.

O frontend consome essa API por meio de um unico cliente HTTP em `frontend/src/application/services/api.ts`, com estado global centralizado em Redux.

## Stack

### Backend

- Node.js 18+
- NestJS 11
- TypeScript 5
- TypeORM 0.3
- PostgreSQL 16
- Sqitch
- Jest
- pg-mem

### Frontend

- Next.js 14
- React 18
- Redux Toolkit 2
- styled-components 6
- Recharts
- Jest + React Testing Library

## Estrutura do Projeto

```text
.
├── src/                 # Backend
├── frontend/            # Frontend Next.js
├── database/            # Plano Sqitch + scripts deploy/revert/verify
├── tests/               # Testes do backend
├── docker/              # Dockerfiles de api, frontend e migrate
├── docker-compose.yml   # Orquestracao local
├── README.md
├── QuickStart.md
└── AGENTS.MD
```

## Pre-requisitos

### Desenvolvimento local

- Node.js 18+
- npm 9+
- PostgreSQL 16+ ou compativel
- Sqitch + `psql` + `createdb`

### Desenvolvimento com Docker

- Docker
- Docker Compose

## Variaveis de Ambiente

Use a raiz do projeto como origem das variaveis do backend.

Arquivo de exemplo: `.env.example`

Valores esperados:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=brain_agriculture
DB_SSL=false
```

Observacoes:

- O backend le essas variaveis em `src/infrastructure/client/env.validation.ts`.
- O frontend usa rewrite de `/api/*` para o backend.
- Em Docker, o frontend recebe `API_URL=http://api:3000`.

## Instalacao Local

### 1. Clonar o repositorio

```bash
git clone https://github.com/mcneillbr/Brain_Agriculture.git
cd Brain_Agriculture
```

### 2. Instalar dependencias do backend

```bash
npm install
```

### 3. Instalar dependencias do frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Configurar ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores do seu banco local.

### 5. Criar schema com Sqitch

O projeto nao usa migrations do TypeORM. O schema e os dados iniciais sao aplicados via Sqitch.

```bash
./database/migrate.sh
```

Esse script:

- verifica se o banco existe
- cria o banco se necessario
- executa `sqitch deploy`
- executa `sqitch verify`

## Execucao Local

### Backend

```bash
npm run start:dev
```

Disponivel em:

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

### Frontend

```bash
cd frontend
npm run dev
```

Disponivel em:

- UI: `http://localhost:5000`

## Execucao com Docker

O projeto possui 4 servicos:

- `db`: PostgreSQL
- `migrate`: executa Sqitch e finaliza
- `api`: backend NestJS
- `frontend`: aplicacao Next.js

Somente as portas `3000` e `5000` ficam expostas no host.

### Subir tudo

```bash
cp .env.example .env
docker compose up --build
```

Disponivel em:

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Frontend: `http://localhost:5000`

Observacoes:

- O banco nao expoe porta para o host.
- O servico `migrate` depende do `db` saudavel e aplica os scripts Sqitch antes da API subir.

## Endpoints Principais

Todos os endpoints abaixo usam o prefixo `/api`.

### Produtores

- `GET /api/producers`
- `GET /api/producers/:id`
- `POST /api/producers`
- `PATCH /api/producers/:id`
- `DELETE /api/producers/:id`

Exemplo:

```bash
curl http://localhost:3000/api/producers
```

### Fazendas

- `POST /api/farms`
- `PATCH /api/farms/:id`
- `DELETE /api/farms/:id`

### Culturas

- `POST /api/crops`

### Safras

- `GET /api/harvests`
- `POST /api/harvests`

### Dashboard

- `GET /api/dashboard`

## Arquitetura

### Backend

```text
HTTP Controller
  -> ApplicationDispatcher
  -> Collaboration
  -> Domain
  -> Repository
  -> Gateway/TypeORM
  -> PostgreSQL
```

Camadas:

- `src/domain/`: entidades, value objects, eventos e contratos
- `src/application/`: collaborations, DTOs e mappers
- `src/infrastructure/`: TypeORM, gateways e implementacoes de repositorio
- `src/presentation/http/`: controllers, DTOs HTTP, pipes, filters e interceptors

### Frontend

```text
Next App Router page
  -> hooks
  -> Redux slices/store
  -> api.ts
  -> Backend /api
```

Camadas:

- `frontend/src/app/`: rotas e paginas
- `frontend/src/application/`: hooks, store e servico HTTP
- `frontend/src/components/`: atoms, molecules, organisms e templates
- `frontend/src/domain/types/`: contratos TypeScript alinhados ao backend

## Testes

### Backend

```bash
npm run test
npm run test:watch
npm run build
```

Cobertura atual inclui:

- dominio: entities, value objects e contratos de repositorio
- presentation: controllers, filter, interceptor e pipe
- infrastructure: wiring tests com mocks tipados e integracao com pg-mem

### Frontend

```bash
cd frontend
npm run test
npm run lint
npm run build
```

Os testes do frontend ficam junto ao codigo, por exemplo:

- `frontend/src/app/dashboard/DashboardPage.spec.tsx`
- `frontend/src/components/organisms/FarmsByStateChart/FarmsByStateChart.spec.tsx`
- `frontend/src/application/store/slices/reportsSlice.spec.ts`

### Testes de carga

```bash
npm run test:load:smoke
npm run test:load
```

Arquivos relacionados:

- `tests/artillery/load.yml`
- `tests/artillery/cpfs.csv`

## Banco de Dados

O schema do banco esta em `database/`.

Conteudo principal:

- `sqitch.plan`
- `deploy/*.sql`
- `revert/*.sql`
- `verify/*.sql`
- `migrate.sh`

O script inicial cria a extensao `uuid-ossp`, e os scripts posteriores criam enums, tabelas e dados iniciais.

## Fluxo de Desenvolvimento

Ao alterar contratos do backend, atualize tambem:

- DTO de aplicacao
- mapper correspondente
- HTTP DTO
- `frontend/src/domain/types/index.ts`

Ao alterar persistencia:

- plano Sqitch e scripts SQL em `database/`
- gateways e repositorios TypeORM
- testes de integracao com pg-mem quando aplicavel

## Troubleshooting

### Backend nao sobe por variaveis ausentes

Verifique o arquivo `.env` e os campos obrigatorios:

- `PORT`
- `NODE_ENV`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `DB_SSL`

### Frontend nao consegue chamar a API

Confirme:

- backend rodando em `http://localhost:3000`
- frontend rodando em `http://localhost:5000`
- rewrite configurado em `frontend/next.config.js`

### Sqitch falha ao aplicar schema

Confirme que estes comandos existem no ambiente:

- `sqitch`
- `psql`
- `createdb`

## Documentacao Relacionada

- `QuickStart.md`
- `AGENTS.MD`
- `database/README.MD`

### Problema: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solução**: PostgreSQL não está rodando.

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Problema: `ValidationError: DB_HOST is not defined`

**Solução**: Crie ou complete o arquivo `.env` com todas as variáveis obrigatórias.

### Problema: `ERR_INVALID_ARG_TYPE in TypeORM`

**Solução**: Verifique que sua versão do Node.js é >= 18 e reinstale dependências:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Status do Projeto

| Componente | Status | Cobertura |
|-----------|--------|-----------|
| Domain (Entities) | ✅ Pronto | 95% |
| Domain (Value Objects) | ✅ Pronto | 100% |
| Collaborations | ✅ Pronto | 90% |
| Repositories | ✅ Pronto | 85% |
| Controllers | ✅ Pronto | 80% |
| Frontend (Components) | ✅ Pronto | 75% |
| Frontend (Redux) | ✅ Pronto | 85% |
| Dashboard | ✅ Pronto | 70% |

---

## 📄 Licença

Este projeto é licenciado sob a **MIT License** — veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## 📧 Contato

- **Autor**: [Seu Nome]
- **Email**: seu-email@example.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/rural-management/issues)

---

**Última atualização**: 2024-01-15