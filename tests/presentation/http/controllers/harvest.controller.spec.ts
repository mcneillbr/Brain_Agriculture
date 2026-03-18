import { HarvestController } from '../../../../src/presentation/http/controllers/harvest.controller'
import { makeDispatcherMock } from '../support/dispatcher.mock'

describe('HarvestController', () => {
  let controller: HarvestController
  let dispatcher: ReturnType<typeof makeDispatcherMock>

  beforeEach(() => {
    dispatcher = makeDispatcherMock()
    controller = new HarvestController(dispatcher)
  })

  it('findAll delegates to dispatcher.getAllHarvests', async () => {
    const harvests = [{ id: 'h1', name: 'Safra 2024', year: 2024 }]
    dispatcher.getAllHarvests.mockResolvedValue(harvests as any)

    await expect(controller.findAll()).resolves.toBe(harvests)
    expect(dispatcher.getAllHarvests).toHaveBeenCalledTimes(1)
  })

  it('create delegates to dispatcher.createHarvest', async () => {
    const body = { name: 'Safra 2025', year: 2025 }
    const created = { id: 'h2', ...body, createdAt: new Date() }

    dispatcher.createHarvest.mockResolvedValue(created as any)

    await expect(controller.create(body as any)).resolves.toBe(created)
    expect(dispatcher.createHarvest).toHaveBeenCalledTimes(1)
    expect(dispatcher.createHarvest).toHaveBeenCalledWith(body)
  })
})