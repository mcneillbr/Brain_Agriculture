import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { IFarmRepository, FARM_REPOSITORY } from '../../domain/repositories/farm.repository'

@Injectable()
export class DeleteFarmCollaboration implements Collaboration<string, void> {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
  ) {}

  async run(id: string): Promise<void> {
    const farm = await this.farmRepository.findById(id)
    if (!farm) throw new NotFoundException(`Fazenda com id "${id}" não encontrada`)

    await this.farmRepository.delete(id)
  }
}