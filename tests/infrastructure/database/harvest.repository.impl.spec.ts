import { makeHarvest } from '../../support/builders'
import { HarvestRepositoryImpl } from '../../../src/infrastructure/database/harvest.repository.impl'
import {
  makeHarvestReadGatewayMock,
  makeHarvestWriteGatewayMock,
} from './support/gateway-mocks'

describe('HarvestRepositoryImpl', () => {
  const harvest = makeHarvest()

  describe('read operations', () => {
    it('delegates to HarvestReadGateway', async () => {
      const readGateway = makeHarvestReadGatewayMock()
      const writeGateway = makeHarvestWriteGatewayMock()

      readGateway.findById.mockResolvedValue(harvest)
      readGateway.findByYear.mockResolvedValue(harvest)
      readGateway.findAll.mockResolvedValue([harvest])
      readGateway.existsByYear.mockResolvedValue(true)

      const repository = new HarvestRepositoryImpl(readGateway, writeGateway)

      await expect(repository.findById('harvest-1')).resolves.toBe(harvest)
      await expect(repository.findByYear(harvest.year)).resolves.toBe(harvest)
      await expect(repository.findAll()).resolves.toEqual([harvest])
      await expect(repository.existsByYear(harvest.year, 'harvest-1')).resolves.toBe(true)

      expect(readGateway.findById).toHaveBeenCalledWith('harvest-1')
      expect(readGateway.findByYear).toHaveBeenCalledWith(harvest.year)
      expect(readGateway.findAll).toHaveBeenCalledTimes(1)
      expect(readGateway.existsByYear).toHaveBeenCalledWith(harvest.year, 'harvest-1')
    })
  })

  describe('write operations', () => {
    it('delegates to HarvestWriteGateway', async () => {
      const readGateway = makeHarvestReadGatewayMock()
      const writeGateway = makeHarvestWriteGatewayMock()

      writeGateway.save.mockResolvedValue(undefined)
      writeGateway.delete.mockResolvedValue(undefined)

      const repository = new HarvestRepositoryImpl(readGateway, writeGateway)

      await expect(repository.save(harvest)).resolves.toBeUndefined()
      await expect(repository.delete('harvest-1')).resolves.toBeUndefined()

      expect(writeGateway.save).toHaveBeenCalledWith(harvest)
      expect(writeGateway.delete).toHaveBeenCalledWith('harvest-1')
    })
  })
})