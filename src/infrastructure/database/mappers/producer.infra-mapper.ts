import { Producer } from '../../../domain/entities/producer.entity'
import { ProducerOrmEntity } from '../orm-entities/producer.orm-entity'

export class ProducerInfraMapper {
	static toDomain(orm: ProducerOrmEntity): Producer {
		return Producer.create({
			id: orm.id,
			name: orm.name,
			document: orm.document,
		})
	}

	static toOrm(domain: Producer): ProducerOrmEntity {
		const orm = new ProducerOrmEntity()
		orm.id = domain.id
		orm.name = domain.name
		orm.document = domain.document.value
		orm.documentType = domain.document.type
		return orm
	}
}

