import { Producer } from '../../domain/entities/producer.entity'
import { ProducerDto } from '../dto/producer.dto'

export class ProducerMapper {
  static toDto(producer: Producer): ProducerDto {
    return {
      id: producer.id,
      name: producer.name,
      document: producer.document.value,
      documentType: producer.document.type,
      documentFormatted: producer.document.formatted,
      createdAt: producer.createdAt,
      updatedAt: producer.updatedAt,
    }
  }

  static toDtoList(producers: Producer[]): ProducerDto[] {
    return producers.map(ProducerMapper.toDto)
  }
}