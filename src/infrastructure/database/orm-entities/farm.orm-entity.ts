import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm'
import { ProducerOrmEntity } from './producer.orm-entity'
import { CropOrmEntity } from './crop.orm-entity'

@Entity('farms')
@Index('idx_farms_producer_id', ['producerId'])
@Index('idx_farms_state', ['state'])
export class FarmOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'producer_id', type: 'uuid' })
  producerId!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 100 })
  city!: string

  @Column({ type: 'char', length: 2 })
  state!: string

  @Column({ name: 'total_area', type: 'float' })
  totalArea!: number

  @Column({ name: 'arable_area', type: 'float', default: 0 })
  arableArea!: number

  @Column({ name: 'vegetation_area', type: 'float', default: 0 })
  vegetationArea!: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @ManyToOne(() => ProducerOrmEntity, (producer) => producer.farms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producer_id' })
  producer!: ProducerOrmEntity

  @OneToMany(() => CropOrmEntity, (crop) => crop.farm, { cascade: true, eager: true })
  crops!: CropOrmEntity[]
}