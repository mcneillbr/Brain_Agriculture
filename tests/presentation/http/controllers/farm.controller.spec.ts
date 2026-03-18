import { FarmController } from '../../../../src/presentation/http/controllers/farm.controller'
import { makeDispatcherMock } from '../support/dispatcher.mock'

describe('FarmController', () => {
  let controller: FarmController
  let dispatcher: ReturnType<typeof makeDispatcherMock>

  beforeEach(() => {
    dispatcher = makeDispatcherMock()
    controller = new FarmController(dispatcher)
  })

  it('create delegates to dispatcher.createFarm', async () => {
    const body = {
      producerId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Fazenda Esperanca',
      city: 'Ribeirao Preto',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 150,
    }
    const created = { id: 'farm-1', ...body, crops: [] }

    dispatcher.createFarm.mockResolvedValue(created as any)

    await expect(controller.create(body as any)).resolves.toBe(created)
    expect(dispatcher.createFarm).toHaveBeenCalledTimes(1)
    expect(dispatcher.createFarm).toHaveBeenCalledWith(body)
  })

  it('update delegates to dispatcher.updateFarm', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440010'
    const body = { name: 'Fazenda Atualizada' }
    const updated = { id, ...body }

    dispatcher.updateFarm.mockResolvedValue(updated as any)

    await expect(controller.update(id, body as any)).resolves.toBe(updated)
    expect(dispatcher.updateFarm).toHaveBeenCalledTimes(1)
    expect(dispatcher.updateFarm).toHaveBeenCalledWith(id, body)
  })

  it('remove delegates to dispatcher.deleteFarm', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440010'
    dispatcher.deleteFarm.mockResolvedValue(undefined)

    await expect(controller.remove(id)).resolves.toBeUndefined()
    expect(dispatcher.deleteFarm).toHaveBeenCalledTimes(1)
    expect(dispatcher.deleteFarm).toHaveBeenCalledWith(id)
  })
})