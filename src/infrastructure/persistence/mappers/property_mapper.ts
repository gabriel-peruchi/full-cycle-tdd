import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    if (!entity.id) {
      throw new Error("O ID é obrigatório")
    }

    if (!entity.name) {
      throw new Error("O nome é obrigatório")
    }

    if (!entity.description) {
      throw new Error("A descrição é obrigatória")
    }

    if (!entity.maxGuests) {
      throw new Error("O número máximo de hóspedes é obrigatório")
    }

    if (!entity.basePricePerNight) {
      throw new Error("O preço base por noite é obrigatório")
    }

    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight)
    );
  }

  static toPersistence(domain: Property): PropertyEntity {
    const entity = new PropertyEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.description = domain.getDescription();
    entity.maxGuests = domain.getMaxGuests();
    entity.basePricePerNight = domain.getBasePricePerNight();
    return entity;
  }
}
