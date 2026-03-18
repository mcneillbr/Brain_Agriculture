import { CropController } from '../../../../src/presentation/http/controllers/crop.controller'
import { makeDispatcherMock } from '../support/dispatcher.mock'

describe('CropController', () => {
  let controller: CropController
  let dispatcher: ReturnType<typeof makeDispatcherMock>

  beforeEach(() => {
    dispatcher = makeDispatcherMock()
    controller = new CropController(dispatcher)
  })

  it('create delegates to dispatcher.addCropToFarm', async () => {
    const body = {
      farmId: '550e8400-e29b-41d4-a716-446655440000',
      harvestId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Soja',
    }
    const created = { id: 'crop-1', ...body, createdAt: new Date() }

    dispatcher.addCropToFarm.mockResolvedValue(created as any)

    await expect(controller.create(body as any)).resolves.toBe(created)
    expect(dispatcher.addCropToFarm).toHaveBeenCalledTimes(1)
    expect(dispatcher.addCropToFarm).toHaveBeenCalledWith(body)
  })
})