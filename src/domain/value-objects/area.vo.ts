import { ValueObject } from "./value-object.base";
import { DomainError } from "../entities/domain-error";

interface AreaProps {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
}

export class Area extends ValueObject<AreaProps> {
  private constructor(props: AreaProps) {
    super(props);
  }

  static create(
    totalArea: number,
    arableArea: number,
    vegetationArea: number,
  ): Area {
    if (totalArea <= 0) {
      throw new DomainError("Área total deve ser maior que zero");
    }
    if (arableArea < 0) {
      throw new DomainError("Área agricultável não pode ser negativa");
    }
    if (vegetationArea < 0) {
      throw new DomainError("Área de vegetação não pode ser negativa");
    }
    if (arableArea + vegetationArea > totalArea) {
      throw new DomainError(
        `Soma das áreas agricultável (${arableArea} ha) e vegetação (${vegetationArea} ha) ` +
          `não pode ultrapassar a área total (${totalArea} ha)`,
      );
    }

    return new Area({ totalArea, arableArea, vegetationArea });
  }

  get totalArea(): number {
    return this.props.totalArea;
  }

  get arableArea(): number {
    return this.props.arableArea;
  }

  get vegetationArea(): number {
    return this.props.vegetationArea;
  }

  get unusedArea(): number {
    return (
      this.props.totalArea - this.props.arableArea - this.props.vegetationArea
    );
  }

  get arablePercentage(): number {
    return (this.props.arableArea / this.props.totalArea) * 100;
  }

  get vegetationPercentage(): number {
    return (this.props.vegetationArea / this.props.totalArea) * 100;
  }
  get unusedPercentage(): number {
    return (this.unusedArea / this.props.totalArea) * 100;
  }
}
