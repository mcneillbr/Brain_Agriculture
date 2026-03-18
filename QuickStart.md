# Quick Start

Guia rapido para subir o projeto localmente ou com Docker.

## Opcao 1: Docker Compose

Recomendado para iniciar tudo com PostgreSQL + Sqitch + API + frontend.

### 1. Preparar ambiente

```bash
cp .env.example .env
```

Se quiser, ajuste usuario, senha e nome do banco no `.env`.

### 2. Subir os servicos

```bash
docker compose up --build
```

### 3. Acessar

- Frontend: `http://localhost:5000`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

### O que acontece no compose

1. O servico `db` sobe o PostgreSQL.
2. O servico `migrate` espera o banco ficar saudavel.
3. `migrate` executa `sqitch deploy` e `sqitch verify`.
4. A `api` sobe somente depois das migracoes.
5. O `frontend` sobe com rewrite para a API interna `http://api:3000`.

## Opcao 2: Desenvolvimento Local

Use esta opcao se voce ja tem PostgreSQL e Sqitch instalados na maquina.

### 1. Instalar dependencias

Backend:

```bash
npm install
```

Frontend:

```bash
cd frontend
npm install
cd ..
```

### 2. Configurar ambiente

```bash
cp .env.example .env
```

Valores padrao:

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

### 3. Preparar banco com Sqitch

```bash
./database/migrate.sh
```

Requisitos desse passo:

- PostgreSQL acessivel com as credenciais do `.env`
- `sqitch`, `psql` e `createdb` instalados

### 4. Subir backend

```bash
npm run start:dev
```

Disponivel em:

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

### 5. Subir frontend

```bash
cd frontend
npm run dev
```

Disponivel em:

- Frontend: `http://localhost:5000`

## Comandos Essenciais

### Backend

```bash
npm run build
npm run test
npm run test:watch
npm run start
npm run start:dev
```

### Frontend

```bash
cd frontend
npm run build
npm run test
npm run lint
npm run dev
```

## Teste Rapido da API

Listar produtores:

```bash
curl http://localhost:3000/api/producers
```

Listar safras:

```bash
curl http://localhost:3000/api/harvests
```

Consultar dashboard:

```bash
curl http://localhost:3000/api/dashboard
```

## Estrutura Minima para Trabalhar

```text
src/                 backend NestJS + DDD
frontend/            app Next.js
database/            schema e dados via Sqitch
tests/               testes do backend
docker/              Dockerfiles e entrypoints
docker-compose.yml   orquestracao local
```

## Quando Alterar Contratos

Se voce adicionar ou mudar campos do backend, atualize estes pontos juntos:

1. `src/application/dto/*`
2. `src/application/mappers/*`
3. `src/presentation/http/dtos/*`
4. `frontend/src/domain/types/index.ts`
5. testes afetados

## Quando Alterar Banco

Nao use migration do TypeORM neste projeto.

Use sempre:

1. `database/sqitch.plan`
2. `database/deploy/*.sql`
3. `database/revert/*.sql`
4. `database/verify/*.sql`

Depois valide com:

```bash
./database/migrate.sh
```

## Problemas Comuns

### Porta 3000 ocupada

O backend usa a porta `3000`.

```bash
lsof -ti:3000 | xargs kill -9
```

### Porta 5000 ocupada

O frontend usa a porta `5000`.

```bash
lsof -ti:5000 | xargs kill -9
```

### Erro de conexao com banco

Revise o `.env` e confirme que o banco esta acessivel em `DB_HOST:DB_PORT`.

### Frontend sem dados

Confirme que:

- a API esta no ar em `http://localhost:3000/api`
- o frontend esta no ar em `http://localhost:5000`
- as migracoes Sqitch foram aplicadas

## Leitura Recomendada

- `README.md`
- `AGENTS.MD`
- `database/README.MD`