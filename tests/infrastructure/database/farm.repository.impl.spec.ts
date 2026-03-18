import { makeFarm } from '../../support/builders'
import { FarmRepositoryImpl } from '../../../src/infrastructure/database/farm.repository.impl'
import { makeFarmReadGatewayMock, makeFarmWriteGatewayMock } from './support/gateway-mocks'

describe('FarmRepositoryImpl', () => {
  const farm = makeFarm({ producerId: 'producer-1' })

  describe('read operations', () => {
    it('delegates to FarmReadGateway', async () => {
      const readGateway = makeFarmReadGatewayMock()
      const writeGateway = makeFarmWriteGatewayMock()

      readGateway.findById.mockResolvedValue(farm)
      readGateway.findByProducerId.mockResolvedValue([farm])
      readGateway.findAll.mockResolvedValue([farm])
      readGateway.countAll.mockResolvedValue(1)
      readGateway.sumTotalArea.mockResolvedValue(farm.area.totalArea)
      readGateway.countByState.mockResolvedValue([{ state: 'SP', count: 1 }])
      readGateway.countByCrop.mockResolvedValue([{ crop: 'Soja', count: 1 }])
      readGateway.sumAreaUsage.mockResolvedValue({
        arableArea: farm.area.arableArea,
        vegetationArea: farm.area.vegetationArea,
      })

      const repository = new FarmRepositoryImpl(readGateway, writeGateway)

      await expect(repository.findById('farm-1')).resolves.toBe(farm)
      await expect(repository.findByProducerId('producer-1')).resolves.toEqual([farm])
      await expect(repository.findAll()).resolves.toEqual([farm])
      await expect(repository.countAll()).resolves.toBe(1)
      await expect(repository.sumTotalArea()).resolves.toBe(farm.area.totalArea)
      await expect(repository.countByState()).resolves.toEqual([{ state: 'SP', count: 1 }])
      await expect(repository.countByCrop()).resolves.toEqual([{ crop: 'Soja', count: 1 }])
      await expect(repository.sumAreaUsage()).resolves.toEqual({
        arableArea: farm.area.arableArea,
        vegetationArea: farm.area.vegetationArea,
      })

      expect(readGateway.findById).toHaveBeenCalledWith('farm-1')
      expect(readGateway.findByProducerId).toHaveBeenCalledWith('producer-1')
    })
  })

  describe('write operations', () => {
    it('delegates to FarmWriteGateway', async () => {
      const readGateway = makeFarmReadGatewayMock()
      const writeGateway = makeFarmWriteGatewayMock()

      writeGateway.save.mockResolvedValue(undefined)
      writeGateway.update.mockResolvedValue(undefined)
      writeGateway.delete.mockResolvedValue(undefined)

      const repository = new FarmRepositoryImpl(readGateway, writeGateway)

      await expect(repository.save(farm)).resolves.toBeUndefined()
      await expect(repository.update(farm)).resolves.toBeUndefined()
      await expect(repository.delete('farm-1')).resolves.toBeUndefined()

      expect(writeGateway.save).toHaveBeenCalledWith(farm)
      expect(writeGateway.update).toHaveBeenCalledWith(farm)
      expect(writeGateway.delete).toHaveBeenCalledWith('farm-1')
    })
  })
})