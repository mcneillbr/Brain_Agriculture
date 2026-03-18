# AGENTS.MD

Guia operacional para uso de agentes de IA neste repositório.

## 1) Objetivo do projeto

- Backend em **NestJS + DDD (Domain-Driven Design)** com TypeScript — API REST para gestão de produtores rurais, fazendas, safras e culturas.
- Frontend em **Next.js 14 (App Router)** com React, Redux Toolkit e styled-components — painel de controle com listagem de produtores e dashboard de indicadores.
- Foco em código limpo, testável e orientado a casos de uso.

## 2) Princípios obrigatórios

- Aplicar **DDD tático** no backend: `Entity`, `Value Object`, `Aggregate Root`, `Domain Service`, `Repository`.
- Separar camadas e dependências sempre do mais externo para o mais interno.
- Regra de ouro: o domínio **não** depende de framework, ORM ou HTTP.
- Preferir casos de uso explícitos (`Collaboration`) para orquestração no backend.
- Manter coesão alta e acoplamento baixo em ambos os projetos.
- No frontend, componentes React não acessam a API diretamente — toda comunicação remota passa por `application/services/api.ts` e pelos Redux slices.

## 3) Arquitetura de referência

### Backend (NestJS + DDD) — `src/`

Estrutura real do projeto:

```text
src/
├── app.module.ts
├── main.ts
├── domain/
│   ├── entities/
│   │   ├── entity.base.ts            ← base com id + equals
│   │   ├── aggregate-root.base.ts    ← base com eventos de domínio + createdAt/updatedAt
│   │   ├── domain-error.ts           ← DomainError (extends Error)
│   │   ├── producer.entity.ts        ← aggregate root: valida nome e Document VO
│   │   ├── farm.entity.ts            ← aggregate root: valida área + gerencia Crop[]
│   │   ├── crop.entity.ts            ← entidade subordinada ao Farm
│   │   └── harvest.entity.ts         ← aggregate root simples: nome + ano (1900..hoje+5)
│   ├── value-objects/
│   │   ├── value-object.base.ts      ← props imutáveis (Object.freeze) + equals por JSON
│   │   ├── document.vo.ts            ← CPF/CNPJ com validação de dígitos verificadores
│   │   ├── area.vo.ts                ← totalArea ≥ arableArea + vegetationArea
│   │   ├── state.vo.ts               ← 27 UFs brasileiras (normaliza para maiúsculo)
│   │   └── crop-name.vo.ts           ← whitelist: Soja, Milho, Algodão, Café, Cana de Açúcar
│   ├── events/
│   │   ├── domain-event.base.ts
│   │   ├── producer-created.event.ts
│   │   ├── farm-created.event.ts
│   │   └── farm-crop-added.event.ts
│   └── repositories/
│       ├── producer.repository.ts    ← IProducerRepository + PRODUCER_REPOSITORY (Symbol)
│       ├── farm.repository.ts        ← IFarmRepository + FARM_REPOSITORY (Symbol) — inclui queries do dashboard
│       └── harvest.repository.ts     ← IHarvestRepository + HARVEST_REPOSITORY (Symbol)
│
├── application/
│   ├── dispatcher.ts                 ← fachada única injetada nos controllers
│   ├── application.module.ts
│   ├── index.ts
│   ├── collaborations/
│   │   ├── collaboration.base.ts              ← interface Collaboration<TInput, TOutput>
│   │   ├── create-producer.collaboration.ts   ← verifica unicidade de documento
│   │   ├── update-producer.collaboration.ts   ← valida duplicidade ao trocar documento
│   │   ├── delete-producer.collaboration.ts   ← verifica existência antes de deletar
│   │   ├── create-farm.collaboration.ts       ← valida que producer existe
│   │   ├── update-farm.collaboration.ts       ← merge parcial de áreas sem sobrescrever
│   │   ├── delete-farm.collaboration.ts
│   │   ├── add-crop-to-farm.collaboration.ts  ← delega duplicidade ao aggregate Farm
│   │   ├── create-harvest.collaboration.ts    ← verifica unicidade por ano
│   │   └── get-dashboard.collaboration.ts     ← agrega 5 queries com Promise.all
│   ├── dto/
│   │   ├── producer.dto.ts    ← CreateProducerDto, UpdateProducerDto, ProducerDto
│   │   ├── farm.dto.ts        ← CreateFarmDto, UpdateFarmDto, FarmDto
│   │   ├── crop.dto.ts        ← AddCropToFarmDto, CropDto
│   │   ├── harvest.dto.ts     ← CreateHarvestDto, HarvestDto
│   │   └── dashboard.dto.ts   ← DashboardDto, PieSliceDto
│   └── mappers/
│       ├── producer.mapper.ts  ← Producer → ProducerDto
│       ├── farm.mapper.ts      ← Farm → FarmDto (inclui Crop[] via CropMapper)
│       ├── crop.mapper.ts      ← Crop → CropDto
│       └── harvest.mapper.ts   ← Harvest → HarvestDto
│
├── infrastructure/
│   ├── client/
│   │   ├── data-source.ts        ← TypeORM DataSource configurado via env vars
│   │   ├── database.module.ts    ← módulo NestJS global, registra todas as ORM entities
│   │   └── env.validation.ts     ← valida: PORT, NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_SSL
│   └── database/
│       ├── orm-entities/
│       │   ├── producer.orm-entity.ts
│       │   ├── farm.orm-entity.ts      ← eager load de crops via OneToMany
│       │   ├── crop.orm-entity.ts      ← unique constraint (farmId, harvestId, name)
│       │   └── harvest.orm-entity.ts
│       ├── mappers/
│       │   ├── producer.infra-mapper.ts
│       │   ├── farm.infra-mapper.ts    ← reconstrói Crop[] ao mapear para domínio
│       │   └── harvest.infra-mapper.ts
│       ├── gateways/                   ← padrão Read/Write separados por aggregate
│       │   ├── producer-read.gateway.ts   ← findById, findByDocument, findAll, existsByDocument
│       │   ├── producer-write.gateway.ts  ← insert (save), save (update), delete
│       │   ├── farm-read.gateway.ts       ← findById, findByProducerId, findAll, countAll,
│       │   │                                sumTotalArea, countByState, countByCrop, sumAreaUsage
│       │   ├── farm-write.gateway.ts
│       │   ├── harvest-read.gateway.ts    ← findById, findByYear, findAll, existsByYear
│       │   └── harvest-write.gateway.ts
│       ├── producer.repository.impl.ts   ← implementa IProducerRepository
│       ├── farm.repository.impl.ts       ← implementa IFarmRepository
│       ├── harvest.repository.impl.ts    ← implementa IHarvestRepository
│       └── infrastructure.module.ts      ← registra todos os tokens de injeção (Symbols)
│
└── presentation/
    └── http/
        ├── controllers/
        │   ├── producer.controller.ts   ← GET /producers, GET /producers/:id, POST, PATCH, DELETE
        │   ├── farm.controller.ts        ← POST /farms, PATCH /farms/:id, DELETE /farms/:id
        │   ├── crop.controller.ts        ← POST /crops
        │   ├── harvest.controller.ts     ← GET /harvests, POST /harvests
        │   └── dashboard.controller.ts   ← GET /dashboard
        ├── dtos/                         ← DTOs HTTP com class-validator (validação de borda)
        │   ├── producer.http-dto.ts
        │   ├── farm.http-dto.ts
        │   ├── crop-harvest.http-dto.ts
        │   └── dashboard.http-dto.ts
        ├── filters/
        │   └── global-exception.filter.ts  ← converte DomainError em 400, Not Found em 404
        ├── interceptors/
        │   └── logging.interceptor.ts
        ├── pipes/
        │   └── parse-uuid.pipe.ts
        └── http.module.ts
```

Regras:
- `domain` não importa NestJS, TypeORM, HTTP.
- `application` depende apenas de contratos do `domain`.
- `infrastructure` implementa os contratos (`Repository`, gateways) com TypeORM + PostgreSQL.
- `presentation` apenas adapta entrada/saída HTTP; toda lógica fica no `ApplicationDispatcher`.
- Variáveis de ambiente obrigatórias: `PORT`, `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_SSL`.

### Frontend (Next.js 14 + Redux) — `frontend/src/`

Estrutura real do projeto:

```text
frontend/src/
├── app/                          ← Next.js App Router
│   ├── layout.tsx                ← root layout com StyledComponentsRegistry + ReduxProvider
│   ├── page.tsx                  ← redireciona para /dashboard
│   ├── dashboard/
│   │   └── page.tsx              ← DashboardPage (gráficos de KPIs)
│   ├── producers/
│   │   ├── page.tsx              ← listagem de produtores
│   │   ├── new/page.tsx          ← formulário de cadastro
│   │   └── [id]/page.tsx         ← detalhe/edição do produtor
│   ├── reports/
│   │   └── page.tsx              ← ReportsPage (tabela de relatório por produtor)
│   └── settings/
│       └── page.tsx              ← SettingsPage (placeholder)
│
├── application/
│   ├── hooks/
│   │   ├── useDashboard.ts       ← selectors + dispatch para o slice de dashboard
│   │   ├── useProducers.ts       ← selectors + dispatch para o slice de produtores
│   │   └── useReports.ts         ← selectors + dispatch para o slice de relatórios
│   ├── services/
│   │   └── api.ts                ← cliente HTTP único (fetch); expõe api.producers, api.farms,
│   │                                api.harvests, api.crops, api.dashboard, api.reports
│   └── store/
│       ├── store.ts              ← Redux store: dashboard + producers + reports slices
│       ├── hooks.ts              ← useAppDispatch / useAppSelector tipados
│       ├── provider.tsx          ← ReduxProvider (Client Component)
│       └── slices/
│           ├── dashboardSlice.ts
│           ├── producersSlice.ts
│           └── reportsSlice.ts
│
├── components/                   ← Atomic Design
│   ├── atoms/
│   │   ├── Avatar/Avatar.tsx
│   │   ├── Badge/Badge.tsx
│   │   ├── Button/Button.tsx
│   │   ├── Input/Input.tsx
│   │   └── Spinner/Spinner.tsx
│   ├── molecules/
│   │   ├── DonutChart/DonutChart.tsx
│   │   ├── NavItem/NavItem.tsx
│   │   ├── SearchBar/SearchBar.tsx
│   │   └── StatCard/StatCard.tsx
│   ├── organisms/
│   │   ├── AreaByCropChart/AreaByCropChart.tsx
│   │   ├── DashboardCharts/DashboardCharts.tsx
│   │   ├── FarmsByStateChart/FarmsByStateChart.tsx
│   │   ├── ProducerForm/ProducerForm.tsx
│   │   ├── ProducerReportTable/ProducerReportTable.tsx
│   │   ├── ProducerTable/ProducerTable.tsx
│   │   ├── Sidebar/Sidebar.tsx
│   │   └── TopBar/TopBar.tsx
│   └── templates/
│       └── AppLayout/AppLayout.tsx   ← layout de página com Sidebar + TopBar
│
├── domain/
│   └── types/
│       └── index.ts              ← interfaces TypeScript que espelham os DTOs do backend:
│                                    ProducerDto, FarmDto, HarvestDto, CropDto, DashboardDto,
│                                    ReportsFiltersDto, ReportsKpisDto, etc.
│
└── styles/
    ├── GlobalStyles.ts
    ├── StyledComponentsRegistry.tsx  ← SSR para styled-components no App Router
    └── theme.ts
```

Regras:
- Componentes React não importam `api.ts` diretamente — usam hooks do `application/hooks/`.
- `api.ts` é o **único** ponto de saída HTTP; todas as chamadas passam por ele.
- Os tipos em `domain/types/index.ts` espelham exatamente os DTOs do backend — manter sincronizados.
- Redux slices gerenciam estado global; use `useAppDispatch` / `useAppSelector` tipados.
- Styled-components requer o `StyledComponentsRegistry` para SSR no App Router.

## 4) Padrões de código

- Nomear collaborations com verbo + contexto: `CreateProducerCollaboration`, `GetDashboardCollaboration`.
- `DTO` para bordas (entrada/saída HTTP e Redux), nunca para regra de negócio interna.
- `Value Object` imutável com validação no factory — `props` sempre `Object.freeze`.
- Evitar lógica de negócio em `Controller` e em componentes de UI.
- Erros de domínio explícitos com `DomainError`; o filter HTTP mapeia para status codes adequados.
- Novos campos no backend exigem atualização simultânea de: DTO de aplicação, mapper, HTTP DTO, e `domain/types/index.ts` no frontend.

## 5) Fluxo de trabalho do agente

Ao receber uma tarefa, o agente deve seguir:

1. Ler contexto e identificar a camada afetada (domain / application / infra / presentation / frontend).
2. Propor plano curto de implementação.
3. Implementar primeiro o domínio e a collaboration.
4. Implementar adaptadores (`infra` / `presentation`).
5. Atualizar `domain/types/index.ts` no frontend se o contrato de DTO mudar.
6. Criar/atualizar testes em `tests/` (backend) ou no próprio componente/slice (frontend).
7. Validar build/lint/test nos dois projetos.
8. Entregar resumo objetivo com arquivos alterados.

## 6) Definição de pronto (DoD)

Uma entrega só é concluída quando:

- Regras de negócio cobertas com testes unitários.
- Integrações críticas cobertas com testes de integração (pg-mem ou mocks tipados).
- Sem erros de lint e build nos dois projetos.
- Sem quebrar contratos públicos existentes (ou com migração documentada).
- Documentação mínima atualizada (README, exemplos de endpoint, payloads).

## 7) Testes

### Backend (`tests/`)

Estrutura real:

```text
tests/
├── support/
│   └── builders.ts                   ← makeProducer(), makeFarm(), makeHarvest() + VALID_CPF/CNPJ
├── domain/
│   ├── entities/                     ← entity.base, aggregate-root.base, producer, farm, crop, harvest
│   ├── value-objects/                ← value-object.base, document.vo, area.vo, state.vo, crop-name.vo
│   └── repositories/                 ← contract tests com InMemory implementations
├── infrastructure/
│   └── database/
│       ├── support/
│       │   ├── pg-mem.datasource.ts  ← helper compartilhado: cria DataSource pg-mem com uuid_generate_v4
│       │   └── gateway-mocks.ts      ← factories tipadas: makeProducerReadGatewayMock(), etc.
│       ├── pg-mem/                   ← testes de integração com TypeORM real + pg-mem
│       │   ├── producer.repository.impl.pgmem.spec.ts
│       │   ├── farm.repository.impl.pgmem.spec.ts     ← inclui dashboard aggregates
│       │   └── harvest.repository.impl.pgmem.spec.ts
│       ├── producer.repository.impl.spec.ts  ← wiring tests com gateway mocks
│       ├── farm.repository.impl.spec.ts
│       └── harvest.repository.impl.spec.ts
└── presentation/
    └── http/
        ├── support/
        │   └── dispatcher.mock.ts    ← makeDispatcherMock() — jest.Mocked<ApplicationDispatcher>
        ├── controllers/              ← crop, dashboard, farm, harvest, producer
        ├── filters/
        ├── interceptors/
        └── pipes/
```

Regras:
- **Nunca usar banco de dados real em testes** — usar pg-mem para integração ou mocks tipados para unitários.
- Unitários de domínio: rápidos, sem banco, sem framework.
- Infrastructure: prefer pg-mem sobre mocks quando o comportamento real do TypeORM importa.
- Centralizar helpers em `tests/support/` (builders) e `tests/infrastructure/database/support/` (gateway-mocks, pg-mem.datasource).
- Specs de controllers usam sempre `makeDispatcherMock()`.
- Espelhar estrutura do `src/` dentro de `tests/` quando útil.

Comandos padrão:

```bash
# Backend
npm run build
npm run test
npm run test:watch
npm run start:dev

# Frontend
cd frontend
npm run build
npm run test
npm run lint
npm run dev
```

### Frontend (`frontend/src/`)

Testes ficam junto ao código-fonte (ex.: `FarmsByStateChart.spec.tsx`, `reportsSlice.spec.ts`).
- Usar React Testing Library para componentes.
- Usar Jest para slices e hooks puros.
- Mocks de `api.ts` via `jest.mock('@/application/services/api')`.

## 8) Qualidade e segurança

- Validar entrada na borda HTTP com class-validator nos HTTP DTOs.
- `env.validation.ts` garante que todas as variáveis de ambiente obrigatórias estejam presentes antes de inicializar a aplicação.
- Não expor detalhes internos (stack trace, mensagens de DomainError) em respostas HTTP de produção.
- Usar variáveis de ambiente para segredos (DB_PASS, etc.) — nunca hardcoded.
- `api.ts` no frontend trata falhas HTTP e lança erros descritivos sem expor internals.

## 9) Convenções de commit e PR

- Commits pequenos e semânticos.
- Prefixos sugeridos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- PR deve incluir:
  - objetivo;
  - decisão arquitetural relevante;
  - evidência de testes (número de suites/tests passando).

## 10) Checklist rápido para novas features

- [ ] Existe collaboration clara no backend?
- [ ] Regra de negócio está no domínio (não no controller/UI)?
- [ ] Contratos (`Repository`/gateway) definidos no lugar certo?
- [ ] Mapeamentos de DTO/ViewModel explícitos (backend mapper + `domain/types/index.ts` no frontend)?
- [ ] Testes adicionados e passando (builders/mocks compartilhados usados)?
- [ ] Build e lint limpos nos dois projetos?

---

## Template de solicitação para o agente

Use este formato para pedir implementações:

```md
Contexto: <camada e bounded context afetados>
Objetivo: <resultado esperado>
Regras de negócio:
- ...
Entradas/Saídas:
- ...
Critérios de aceite:
- ...
Restrições técnicas:
- usar DDD no backend
- manter compatibilidade com endpoints atuais
- sem banco real em testes (usar pg-mem ou mocks tipados)
- adicionar testes unitários e/ou integração
```

