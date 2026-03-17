import { Producer } from "../entities/producer.entity";

export interface IProducerRepository {
  findById(id: string): Promise<Producer | null>;
  findByDocument(document: string): Promise<Producer | null>;
  findAll(): Promise<Producer[]>;
  save(producer: Producer): Promise<void>;
  update(producer: Producer): Promise<void>;
  delete(id: string): Promise<void>;
  existsByDocument(document: string, excludeId?: string): Promise<boolean>;
}

export const PRODUCER_REPOSITORY = Symbol("IProducerRepository");
