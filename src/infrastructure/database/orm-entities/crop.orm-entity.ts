import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm'
import { FarmOrmEntity } from './farm.orm-entity'
import { HarvestOrmEntity } from './harvest.orm-entity'

@Entity('crops')
@Unique('uq_crop_farm_harvest_name', ['farmId', 'harvestId', 'name'])
@Index('idx_crops_farm_id', ['farmId'])
@Index('idx_crops_harvest_id', ['harvestId'])
export class CropOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId!: string

  @Column({ name: 'harvest_id', type: 'uuid' })
  harvestId!: string

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @ManyToOne(() => FarmOrmEntity, (farm) => farm.crops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm!: FarmOrmEntity

  @ManyToOne(() => HarvestOrmEntity, (harvest) => harvest.crops, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'harvest_id' })
  harvest!: HarvestOrmEntity
}