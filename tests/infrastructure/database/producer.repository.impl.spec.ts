import { makeProducer } from '../../support/builders'
import { ProducerRepositoryImpl } from '../../../src/infrastructure/database/producer.repository.impl'
import {
  makeProducerReadGatewayMock,
  makeProducerWriteGatewayMock,
} from './support/gateway-mocks'

describe('ProducerRepositoryImpl', () => {
  const producer = makeProducer()

  describe('read operations', () => {
    it('delegates to ProducerReadGateway', async () => {
      const readGateway = makeProducerReadGatewayMock()
      const writeGateway = makeProducerWriteGatewayMock()

      readGateway.findById.mockResolvedValue(producer)
      readGateway.findByDocument.mockResolvedValue(producer)
      readGateway.findAll.mockResolvedValue([producer])
      readGateway.existsByDocument.mockResolvedValue(true)

      const repository = new ProducerRepositoryImpl(readGateway, writeGateway)

      await expect(repository.findById('id-1')).resolves.toBe(producer)
      await expect(repository.findByDocument(producer.document.value)).resolves.toBe(producer)
      await expect(repository.findAll()).resolves.toEqual([producer])
      await expect(repository.existsByDocument(producer.document.value, 'id-1')).resolves.toBe(true)

      expect(readGateway.findById).toHaveBeenCalledWith('id-1')
      expect(readGateway.findByDocument).toHaveBeenCalledWith(producer.document.value)
      expect(readGateway.findAll).toHaveBeenCalledTimes(1)
      expect(readGateway.existsByDocument).toHaveBeenCalledWith(producer.document.value, 'id-1')
    })
  })

  describe('write operations', () => {
    it('delegates to ProducerWriteGateway', async () => {
      const readGateway = makeProducerReadGatewayMock()
      const writeGateway = makeProducerWriteGatewayMock()

      writeGateway.save.mockResolvedValue(undefined)
      writeGateway.update.mockResolvedValue(undefined)
      writeGateway.delete.mockResolvedValue(undefined)

      const repository = new ProducerRepositoryImpl(readGateway, writeGateway)

      await expect(repository.save(producer)).resolves.toBeUndefined()
      await expect(repository.update(producer)).resolves.toBeUndefined()
      await expect(repository.delete('id-1')).resolves.toBeUndefined()

      expect(writeGateway.save).toHaveBeenCalledWith(producer)
      expect(writeGateway.update).toHaveBeenCalledWith(producer)
      expect(writeGateway.delete).toHaveBeenCalledWith('id-1')
    })
  })
})