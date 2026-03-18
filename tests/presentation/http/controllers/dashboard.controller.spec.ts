import { DashboardController } from '../../../../src/presentation/http/controllers/dashboard.controller'
import { makeDispatcherMock } from '../support/dispatcher.mock'

describe('DashboardController', () => {
  let controller: DashboardController
  let dispatcher: ReturnType<typeof makeDispatcherMock>

  beforeEach(() => {
    dispatcher = makeDispatcherMock()
    controller = new DashboardController(dispatcher)
  })

  it('getDashboard delegates to dispatcher.getDashboard', async () => {
    const dashboard = {
      totalFarms: 10,
      totalHectares: 5000,
      byState: [{ label: 'SP', value: 4, percentage: 40 }],
      byCrop: [{ label: 'Soja', value: 6, percentage: 60 }],
      byLandUse: {
        arableArea: 3000,
        vegetationArea: 1500,
        unusedArea: 500,
      },
    }

    dispatcher.getDashboard.mockResolvedValue(dashboard)

    await expect(controller.getDashboard()).resolves.toBe(dashboard)
    expect(dispatcher.getDashboard).toHaveBeenCalledTimes(1)
  })
})