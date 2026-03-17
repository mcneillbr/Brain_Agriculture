import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { FarmOrmEntity } from './farm.orm-entity'

@Entity('producers')
export class ProducerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 14, unique: true })
  document!: string

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: ['CPF', 'CNPJ'],
  })
  documentType!: 'CPF' | 'CNPJ'

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @OneToMany(() => FarmOrmEntity, (farm) => farm.producer, { cascade: true })
  farms!: FarmOrmEntity[]
}