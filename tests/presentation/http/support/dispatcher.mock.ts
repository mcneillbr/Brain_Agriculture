/**
 * Dispatcher mock factory for controller unit tests.
 *
 * Returns a `jest.Mocked<ApplicationDispatcher>` with every public method
 * replaced by a jest.fn() stub.  Individual specs call `.mockResolvedValue()`
 * or `.mockRejectedValue()` on the specific methods they exercise.
 *
 * The `as unknown as` cast lives here so it does not pollute spec files.
 */
import { ApplicationDispatcher } from '../../../../src/application/dispatcher'

export function makeDispatcherMock(): jest.Mocked<ApplicationDispatcher> {
  return {
    // Producers
    getAllProducers: jest.fn(),
    getProducerById: jest.fn(),
    createProducer: jest.fn(),
    updateProducer: jest.fn(),
    deleteProducer: jest.fn(),

    // Farms
    createFarm: jest.fn(),
    updateFarm: jest.fn(),
    deleteFarm: jest.fn(),

    // Crops
    addCropToFarm: jest.fn(),

    // Harvests
    getAllHarvests: jest.fn(),
    createHarvest: jest.fn(),

    // Dashboard
    getDashboard: jest.fn(),
  } as unknown as jest.Mocked<ApplicationDispatcher>
}
