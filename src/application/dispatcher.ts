import { Injectable } from '@nestjs/common'

import { CreateProducerDto, UpdateProducerDto, ProducerDto } from './dto/producer.dto'
import { CreateFarmDto, UpdateFarmDto, FarmDto } from './dto/farm.dto'
import { AddCropToFarmDto, CropDto } from './dto/crop.dto'
import { HarvestDto, CreateHarvestDto } from './dto/harvest.dto'
import { DashboardDto } from './dto/dashboard.dto'

import { CreateProducerCollaboration } from './collaborations/create-producer.collaboration'
import { UpdateProducerCollaboration } from './collaborations/update-producer.collaboration'
import { DeleteProducerCollaboration } from './collaborations/delete-producer.collaboration'
import { CreateFarmCollaboration } from './collaborations/create-farm.collaboration'
import { UpdateFarmCollaboration } from './collaborations/update-farm.collaboration'
import { DeleteFarmCollaboration } from './collaborations/delete-farm.collaboration'
import { AddCropToFarmCollaboration } from './collaborations/add-crop-to-farm.collaboration'
import { GetDashboardCollaboration } from './collaborations/get-dashboard.collaboration'
import { CreateHarvestCollaboration } from './collaborations/create-harvest.collaboration'
import { Inject } from '@nestjs/common'
import { IProducerRepository, PRODUCER_REPOSITORY } from '../domain/repositories/producer.repository'
import { IHarvestRepository, HARVEST_REPOSITORY } from '../domain/repositories/harvest.repository'
import { IFarmRepository, FARM_REPOSITORY } from '../domain/repositories/farm.repository'
import { ProducerMapper } from './mappers/producer.mapper'
import { HarvestMapper } from './mappers/harvest.mapper'
import { FarmMapper } from './mappers/farm.mapper'

@Injectable()
export class ApplicationDispatcher {
  constructor(
    private readonly createProducerCollaboration: CreateProducerCollaboration,
    private readonly updateProducerCollaboration: UpdateProducerCollaboration,
    private readonly deleteProducerCollaboration: DeleteProducerCollaboration,
    private readonly createFarmCollaboration: CreateFarmCollaboration,
    private readonly updateFarmCollaboration: UpdateFarmCollaboration,
    private readonly deleteFarmCollaboration: DeleteFarmCollaboration,
    private readonly addCropToFarmCollaboration: AddCropToFarmCollaboration,
    private readonly getDashboardCollaboration: GetDashboardCollaboration,
    private readonly createHarvestCollaboration: CreateHarvestCollaboration,

    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository,
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository,
  ) {}

  // ─── Producers ────────────────────────────────────────────────────────────

  async createProducer(data: CreateProducerDto): Promise<ProducerDto> {
    return this.createProducerCollaboration.run(data)
  }

  async updateProducer(id: string, data: UpdateProducerDto): Promise<ProducerDto> {
    return this.updateProducerCollaboration.run({ id, data })
  }

  async deleteProducer(id: string): Promise<void> {
    return this.deleteProducerCollaboration.run(id)
  }

  async getProducerById(id: string): Promise<ProducerDto | null> {
    const producer = await this.producerRepository.findById(id)
    return producer ? ProducerMapper.toDto(producer) : null
  }

  async getAllProducers(): Promise<ProducerDto[]> {
    const producers = await this.producerRepository.findAll()
    return ProducerMapper.toDtoList(producers)
  }

  // ─── Farms ────────────────────────────────────────────────────────────────

  async createFarm(data: CreateFarmDto): Promise<FarmDto> {
    return this.createFarmCollaboration.run(data)
  }

  async updateFarm(id: string, data: UpdateFarmDto): Promise<FarmDto> {
    return this.updateFarmCollaboration.run({ id, data })
  }

  async deleteFarm(id: string): Promise<void> {
    return this.deleteFarmCollaboration.run(id)
  }

  async getFarmById(id: string): Promise<FarmDto | null> {
    const farm = await this.farmRepository.findById(id)
    if (!farm) return null

    const producer = await this.producerRepository.findById(farm.producerId)
    return FarmMapper.toDto(farm, { producerName: producer?.name })
  }

  async getAllFarms(): Promise<FarmDto[]> {
    const [farms, producers] = await Promise.all([
      this.farmRepository.findAll(),
      this.producerRepository.findAll(),
    ])

    const producerNameById = new Map(producers.map((producer) => [producer.id, producer.name]))
    return FarmMapper.toDtoList(farms, { producerNameById })
  }

  // ─── Crops ────────────────────────────────────────────────────────────────

  async addCropToFarm(data: AddCropToFarmDto): Promise<CropDto> {
    return this.addCropToFarmCollaboration.run(data)
  }

  // ─── Harvests ─────────────────────────────────────────────────────────────

  async createHarvest(data: CreateHarvestDto): Promise<HarvestDto> {
    return this.createHarvestCollaboration.run(data)
  }

  async getAllHarvests(): Promise<HarvestDto[]> {
    const harvests = await this.harvestRepository.findAll()
    return HarvestMapper.toDtoList(harvests)
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboard(): Promise<DashboardDto> {
    return this.getDashboardCollaboration.run()
  }
}