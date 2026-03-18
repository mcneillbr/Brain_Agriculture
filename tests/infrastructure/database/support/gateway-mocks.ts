/**
 * Typed gateway mock factories for infrastructure unit tests.
 *
 * Each factory returns a fully-mocked instance whose public methods are
 * jest.fn() stubs.  The single `as unknown as` cast lives here so individual
 * spec files stay clean.
 */
import { FarmReadGateway } from '../../../../src/infrastructure/database/gateways/farm-read.gateway'
import { FarmWriteGateway } from '../../../../src/infrastructure/database/gateways/farm-write.gateway'
import { HarvestReadGateway } from '../../../../src/infrastructure/database/gateways/harvest-read.gateway'
import { HarvestWriteGateway } from '../../../../src/infrastructure/database/gateways/harvest-write.gateway'
import { ProducerReadGateway } from '../../../../src/infrastructure/database/gateways/producer-read.gateway'
import { ProducerWriteGateway } from '../../../../src/infrastructure/database/gateways/producer-write.gateway'

// ─── Producer ─────────────────────────────────────────────────────────────────

export function makeProducerReadGatewayMock(): jest.Mocked<ProducerReadGateway> {
  return {
    findById: jest.fn(),
    findByDocument: jest.fn(),
    findAll: jest.fn(),
    existsByDocument: jest.fn(),
  } as unknown as jest.Mocked<ProducerReadGateway>
}

export function makeProducerWriteGatewayMock(): jest.Mocked<ProducerWriteGateway> {
  return {
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<ProducerWriteGateway>
}

// ─── Farm ─────────────────────────────────────────────────────────────────────

export function makeFarmReadGatewayMock(): jest.Mocked<FarmReadGateway> {
  return {
    findById: jest.fn(),
    findByProducerId: jest.fn(),
    findAll: jest.fn(),
    countAll: jest.fn(),
    sumTotalArea: jest.fn(),
    countByState: jest.fn(),
    countByCrop: jest.fn(),
    sumAreaUsage: jest.fn(),
  } as unknown as jest.Mocked<FarmReadGateway>
}

export function makeFarmWriteGatewayMock(): jest.Mocked<FarmWriteGateway> {
  return {
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<FarmWriteGateway>
}

// ─── Harvest ──────────────────────────────────────────────────────────────────

export function makeHarvestReadGatewayMock(): jest.Mocked<HarvestReadGateway> {
  return {
    findById: jest.fn(),
    findByYear: jest.fn(),
    findAll: jest.fn(),
    existsByYear: jest.fn(),
  } as unknown as jest.Mocked<HarvestReadGateway>
}

export function makeHarvestWriteGatewayMock(): jest.Mocked<HarvestWriteGateway> {
  return {
    save: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<HarvestWriteGateway>
}
