import { NotFoundException } from '@nestjs/common'
import { ProducerController } from '../../../../src/presentation/http/controllers/producer.controller'
import { makeDispatcherMock } from '../support/dispatcher.mock'

describe('ProducerController', () => {
  let controller: ProducerController
  let dispatcher: ReturnType<typeof makeDispatcherMock>

  beforeEach(() => {
    dispatcher = makeDispatcherMock()
    controller = new ProducerController(dispatcher)
  })

  it('findAll delegates to dispatcher.getAllProducers', async () => {
    const producers = [{ id: 'p1', name: 'Ana' }]
    dispatcher.getAllProducers.mockResolvedValue(producers as any)

    await expect(controller.findAll()).resolves.toBe(producers)
    expect(dispatcher.getAllProducers).toHaveBeenCalledTimes(1)
  })

  it('findOne returns producer when found', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    const producer = { id, name: 'Ana' }
    dispatcher.getProducerById.mockResolvedValue(producer as any)

    await expect(controller.findOne(id)).resolves.toBe(producer)
    expect(dispatcher.getProducerById).toHaveBeenCalledTimes(1)
    expect(dispatcher.getProducerById).toHaveBeenCalledWith(id)
  })

  it('findOne throws NotFoundException when producer does not exist', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440999'
    dispatcher.getProducerById.mockResolvedValue(null)

    await expect(controller.findOne(id)).rejects.toBeInstanceOf(NotFoundException)
    expect(dispatcher.getProducerById).toHaveBeenCalledTimes(1)
    expect(dispatcher.getProducerById).toHaveBeenCalledWith(id)
  })

  it('create delegates to dispatcher.createProducer', async () => {
    const body = { name: 'Ana', document: '52998224725' }
    const created = { id: 'p1', ...body }

    dispatcher.createProducer.mockResolvedValue(created as any)

    await expect(controller.create(body as any)).resolves.toBe(created)
    expect(dispatcher.createProducer).toHaveBeenCalledTimes(1)
    expect(dispatcher.createProducer).toHaveBeenCalledWith(body)
  })

  it('update delegates to dispatcher.updateProducer', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    const body = { name: 'Ana Atualizada' }
    const updated = { id, ...body }

    dispatcher.updateProducer.mockResolvedValue(updated as any)

    await expect(controller.update(id, body as any)).resolves.toBe(updated)
    expect(dispatcher.updateProducer).toHaveBeenCalledTimes(1)
    expect(dispatcher.updateProducer).toHaveBeenCalledWith(id, body)
  })

  it('remove delegates to dispatcher.deleteProducer', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    dispatcher.deleteProducer.mockResolvedValue(undefined)

    await expect(controller.remove(id)).resolves.toBeUndefined()
    expect(dispatcher.deleteProducer).toHaveBeenCalledTimes(1)
    expect(dispatcher.deleteProducer).toHaveBeenCalledWith(id)
  })
})