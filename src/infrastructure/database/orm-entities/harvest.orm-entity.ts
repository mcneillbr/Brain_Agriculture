import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm'
import { CropOrmEntity } from './crop.orm-entity'

@Entity('harvests')
@Index('idx_harvests_year', ['year'])
export class HarvestOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @Column({ type: 'int', unique: true })
  year!: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @OneToMany(() => CropOrmEntity, (crop) => crop.harvest)
  crops!: CropOrmEntity[]
}