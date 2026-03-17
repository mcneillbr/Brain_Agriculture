import { Inject, Injectable } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { DashboardDto, PieSliceDto } from '../dto/dashboard.dto'
import { IFarmRepository, FARM_REPOSITORY } from '../../domain/repositories/farm.repository'

@Injectable()
export class GetDashboardCollaboration implements Collaboration<void, DashboardDto> {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
  ) {}

  async run(): Promise<DashboardDto> {
    const [totalFarms, totalHectares, byStateRaw, byCropRaw, areaUsage] = await Promise.all([
      this.farmRepository.countAll(),
      this.farmRepository.sumTotalArea(),
      this.farmRepository.countByState(),
      this.farmRepository.countByCrop(),
      this.farmRepository.sumAreaUsage(),
    ])

    const totalFarmsForState = byStateRaw.reduce((sum, s) => sum + s.count, 0)
    const totalFarmsForCrop  = byCropRaw.reduce((sum, c) => sum + c.count, 0)
    const totalArea = areaUsage.arableArea + areaUsage.vegetationArea || 1

    const toSlices = (
      raw: { label: string; count: number }[],
      total: number,
    ): PieSliceDto[] =>
      raw.map(({ label, count }) => ({
        label,
        value: count,
        percentage: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
      }))

    const byState = toSlices(
      byStateRaw.map((r) => ({ label: r.state, count: r.count })),
      totalFarmsForState,
    )

    const byCrop = toSlices(
      byCropRaw.map((r) => ({ label: r.crop, count: r.count })),
      totalFarmsForCrop,
    )

    const unusedArea = Math.max(0, totalHectares - areaUsage.arableArea - areaUsage.vegetationArea)

    return {
      totalFarms,
      totalHectares,
      byState,
      byCrop,
      byLandUse: {
        arableArea: areaUsage.arableArea,
        vegetationArea: areaUsage.vegetationArea,
        unusedArea,
      },
    }
  }
}