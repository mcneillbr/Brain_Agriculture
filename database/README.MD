# database

Controle de versão do banco de dados com [Sqitch](https://sqitch.org/).

## Estrutura

```
database/
├── deploy/     # Scripts de aplicação (forward)
├── revert/     # Scripts de reversão (rollback)
├── verify/     # Scripts de verificação pós-deploy
├── sqitch.conf # Configuração do projeto
└── sqitch.plan # Histórico de changes (não editar manualmente)
```

Cada change tem obrigatoriamente três arquivos correspondentes em `deploy/`, `revert/` e `verify/`.

## Pré-requisitos

- Docker + Docker Compose (recomendado)
- Ou Sqitch instalado localmente

### Instalar Sqitch localmente (opcional)

```bash
# macOS
brew install sqitch --with-postgres-support

# Ubuntu/Debian
sudo apt-get install sqitch libdbd-pg-perl

# Via cpan
cpan App::Sqitch DBD::Pg
```

## Uso com Docker (recomendado)

O `docker-compose.yml` na raiz do projeto já sobe o Postgres e aplica as migrations automaticamente via `sqitch deploy`. Para rodar manualmente:

```bash
# Subir o banco
docker compose up -d postgres

# Rodar as migrations dentro do container sqitch
docker compose run --rm sqitch deploy

# Verificar status
docker compose run --rm sqitch status

# Ver histórico
docker compose run --rm sqitch log
```

## Uso local

Configure a variável de ambiente com a connection string:

```bash
export SQITCH_TARGET="db:pg://postgres:postgres@localhost:5432/brain_agriculture"
```

```bash
# Aplicar todas as changes pendentes
sqitch deploy

# Aplicar até uma change específica
sqitch deploy --to 003_create_table_farms

# Reverter a última change
sqitch revert --to @HEAD^

# Reverter tudo
sqitch revert

# Verificar integridade após deploy
sqitch verify

# Ver status atual
sqitch status

# Ver log de changes aplicadas
sqitch log
```

## Adicionando uma nova change

```bash
# Cria os três arquivos (deploy, revert, verify) automaticamente
sqitch add 006_add_column_farms_description \
  --requires 003_create_table_farms \
  --note 'Adiciona coluna description em farms'
```

Isso gera:
- `deploy/006_add_column_farms_description.sql`
- `revert/006_add_column_farms_description.sql`
- `verify/006_add_column_farms_description.sql`

E atualiza o `sqitch.plan` automaticamente.

## Convenções

| Convenção | Exemplo |
|-----------|---------|
| Prefixo numérico com 3 dígitos | `006_` |
| Snake case descritivo | `create_table_producers` |
| Sempre declarar `requires` | `--requires 002_create_table_producers` |
| Transações explícitas | `BEGIN; ... COMMIT;` em todo script |
| `verify` usa `SELECT ... WHERE false` | Valida colunas sem retornar dados |

## Changes disponíveis

| # | Change | Descrição |
|---|--------|-----------|
| 001 | `create_enum_document_type` | Enum `CPF`/`CNPJ` |
| 002 | `create_table_producers` | Produtores rurais |
| 003 | `create_table_farms` | Fazendas com validação de áreas |
| 004 | `create_table_harvests` | Safras por ano |
| 005 | `create_table_crops` | Culturas por fazenda e safra |

## Constraints de negócio no banco

As seguintes regras de negócio são reforçadas diretamente no PostgreSQL como segunda linha de defesa (a primeira é a domain layer):

- `chk_farms_areas_sum` — `arable_area + vegetation_area <= total_area`
- `chk_farms_state_valid` — apenas siglas de estados brasileiros válidos
- `chk_producers_document_length` — CPF com 11 dígitos, CNPJ com 14
- `chk_producers_document_digits` — documento contém apenas dígitos
- `uq_crop_farm_harvest_name` — mesma cultura não pode ser duplicada na mesma fazenda/safra
- `chk_crops_name_valid` — apenas culturas permitidas pelo sistema


# Links

https://sqitch.org/download