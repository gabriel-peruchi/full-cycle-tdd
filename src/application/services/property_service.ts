import { v4 as uuidv4 } from 'uuid'
import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDTO } from "../dtos/create_property_dto";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(data: CreatePropertyDTO ): Promise<Property> {
    const property = new Property(uuidv4(), data.name, data.description, data.maxGuests, data.basePricePerNight);
    await this.propertyRepository.save(property);
    return property;
  }
}
