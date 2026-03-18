# Database

Controle de versao do banco de dados com [Sqitch](https://sqitch.org/).

Este diretorio contem o plano de mudancas do schema, os scripts SQL de deploy/revert/verify e o script auxiliar usado no desenvolvimento local.

## Estrutura

```text
database/
├── deploy/       # Scripts forward
├── revert/       # Scripts de rollback
├── verify/       # Scripts de verificacao
├── migrate.sh    # Script local para criar o banco e executar deploy + verify
├── sqitch.conf   # Configuracao do projeto Sqitch
└── sqitch.plan   # Plano de changes
```

Cada change deve possuir arquivos correspondentes em:

- `deploy/`
- `revert/`
- `verify/`

## Ferramentas usadas

- PostgreSQL
- Sqitch
- `psql`
- `createdb`

## Fluxo do Projeto

O projeto nao usa migrations do TypeORM.

Toda evolucao de schema deve ser feita via Sqitch.

Isso vale para:

- criacao de tabelas
- alteracoes de colunas
- constraints
- indices
- seeds iniciais controladas por SQL

## Uso com Docker Compose

O fluxo principal com Docker esta definido em [docker-compose.yml](/home/mcneillbr/sources/learn/Brain_Agriculture/docker-compose.yml).

Servicos relacionados ao banco:

- `db`: sobe um PostgreSQL 16
- `migrate`: executa Sqitch, aplica o plano e verifica o schema

### Subir ambiente completo

```bash
cp .env.example .env
docker compose up --build
```

### Subir somente banco + migracao

```bash
docker compose up db migrate
```

Observacoes:

- o servico `db` usa `POSTGRES_DB=postgres` como banco administrativo inicial
- o servico `migrate` cria `DB_NAME` se ele ainda nao existir
- depois executa `sqitch deploy` e `sqitch verify`

## Uso local

Para executar o schema localmente sem Docker, use o script auxiliar:

```bash
./database/migrate.sh
```

Esse script usa estas variaveis de ambiente:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brain_agriculture
```

Observacoes importantes:

- no `.env` da aplicacao o backend usa `DB_PASS`
- no `migrate.sh` a variavel lida diretamente e `DB_PASSWORD`
- no Docker Compose isso ja esta resolvido com o mapeamento `DB_PASSWORD: ${DB_PASS}`

Se quiser rodar localmente com export manual:

```bash
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=brain_agriculture

./database/migrate.sh
```

## Comandos Sqitch uteis

A partir do diretorio `database/`:

```bash
cd database
```

Exemplos com target explicito:

```bash
sqitch deploy -t postgresql://postgres:postgres@localhost:5432/brain_agriculture
sqitch verify -t postgresql://postgres:postgres@localhost:5432/brain_agriculture
sqitch status -t postgresql://postgres:postgres@localhost:5432/brain_agriculture
sqitch log -t postgresql://postgres:postgres@localhost:5432/brain_agriculture
```

Reverter para um ponto anterior:

```bash
sqitch revert -t postgresql://postgres:postgres@localhost:5432/brain_agriculture --to @HEAD^
```

## Adicionando uma nova change

Exemplo:

```bash
cd database
sqitch add 007_add_index_to_producers_document \
  --requires 002_create_table_producers \
  --note 'Adiciona indice para document em producers'
```

Isso cria:

- `deploy/007_add_index_to_producers_document.sql`
- `revert/007_add_index_to_producers_document.sql`
- `verify/007_add_index_to_producers_document.sql`

E atualiza o `sqitch.plan`.

## Convencoes

- Prefixo numerico com 3 digitos: `007_`
- Nome descritivo em snake_case
- Declarar dependencias com `--requires` quando houver relacao entre changes
- Encapsular scripts com `BEGIN;` e `COMMIT;`
- Manter `verify/` validando existencia de objetos, colunas e constraints

## Changes atuais

Conforme [sqitch.plan](/home/mcneillbr/sources/learn/Brain_Agriculture/database/sqitch.plan):

| Ordem | Change | Objetivo |
|---|---|---|
| 000 | `create_extension_on_database` | Cria extensao `uuid-ossp` |
| 001 | `create_enum_document_type` | Cria enum de documento |
| 002 | `create_table_producers` | Cria tabela de produtores |
| 003 | `create_table_farms` | Cria tabela de fazendas |
| 004 | `create_table_harvests` | Cria tabela de safras |
| 005 | `create_table_crops` | Cria tabela de culturas |
| 006 | `insert_initial_data` | Insere dados iniciais |

## Regras reforcadas no banco

O banco atua como segunda linha de defesa alem das validacoes da domain layer.

Exemplos de regras esperadas no schema:

- soma de `arable_area` e `vegetation_area` nao excede `total_area`
- documento contem apenas digitos e comprimento valido
- culturas validas seguem a whitelist do sistema
- combinacao `farm + harvest + crop name` e unica

## Relacao com os testes

Os testes de integracao da camada de infraestrutura usam pg-mem e reproduzem o comportamento esperado do schema e dos repositorios TypeORM.

Arquivos relacionados:

- `tests/infrastructure/database/pg-mem/producer.repository.impl.pgmem.spec.ts`
- `tests/infrastructure/database/pg-mem/farm.repository.impl.pgmem.spec.ts`
- `tests/infrastructure/database/pg-mem/harvest.repository.impl.pgmem.spec.ts`
- `tests/infrastructure/database/support/pg-mem.datasource.ts`

## Troubleshooting

### `sqitch: command not found`

Instale o Sqitch localmente ou use Docker Compose.

### `psql: command not found`

O script `migrate.sh` depende de `psql` e `createdb`.

### Banco nao e criado no ambiente local

Confirme se as variaveis abaixo estao definidas corretamente:

- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`

### Divergencia entre backend e migracao local

Lembre que:

- backend usa `DB_PASS`
- script local usa `DB_PASSWORD`
- docker-compose faz a traducao entre elas para o servico `migrate`

## Referencias

- https://sqitch.org/
- https://sqitch.org/download/