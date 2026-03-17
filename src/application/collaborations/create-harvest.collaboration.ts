import { Inject, Injectable } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { CreateHarvestDto, HarvestDto } from '../dto/harvest.dto'
import { IHarvestRepository, HARVEST_REPOSITORY } from '../../domain/repositories/harvest.repository'
import { Harvest } from '../../domain/entities/harvest.entity'
import { HarvestMapper } from '../mappers/harvest.mapper'
import { DomainError } from '../../domain/entities/domain-error'

@Injectable()
export class CreateHarvestCollaboration implements Collaboration<CreateHarvestDto, HarvestDto> {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository,
  ) {}

  async run(input: CreateHarvestDto): Promise<HarvestDto> {
    const alreadyExists = await this.harvestRepository.existsByYear(input.year)
    if (alreadyExists) {
      throw new DomainError(`Já existe uma safra cadastrada para o ano ${input.year}`)
    }

    const harvest = Harvest.create({ name: input.name, year: input.year })

    await this.harvestRepository.save(harvest)

    return HarvestMapper.toDto(harvest)
  }
}