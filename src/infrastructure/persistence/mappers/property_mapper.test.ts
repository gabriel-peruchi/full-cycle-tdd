import { Property } from "../../../domain/entities/property"
import { PropertyEntity } from "../entities/property_entity"
import { PropertyMapper } from "./property_mapper"

describe('PropertyMapper', () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = new PropertyEntity()
    propertyEntity.id = "1"
    propertyEntity.name = "Casa de Praia"
    propertyEntity.description = "Uma casa linda na praia"
    propertyEntity.maxGuests = 10
    propertyEntity.basePricePerNight = 200
    propertyEntity.bookings = []

    const property = PropertyMapper.toDomain(propertyEntity)

    expect(property).toBeInstanceOf(Property)
    expect(property.getId()).toBe(propertyEntity.id)
    expect(property.getName()).toBe(propertyEntity.name)
    expect(property.getDescription()).toBe(propertyEntity.description)
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests)
    expect(property.getBasePricePerNight()).toBe(propertyEntity.basePricePerNight)
  })

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const propertyEntity1 = new PropertyEntity()
    propertyEntity1.name = "Casa de Praia"
    propertyEntity1.description = "Uma casa linda na praia"
    propertyEntity1.maxGuests = 10
    propertyEntity1.basePricePerNight = 200

    const propertyEntity2 = new PropertyEntity()
    propertyEntity2.id = "2"
    propertyEntity2.description = "Uma casa linda na praia"
    propertyEntity2.maxGuests = 10
    propertyEntity2.basePricePerNight = 200

    const propertyEntity3 = new PropertyEntity()
    propertyEntity3.id = "3"
    propertyEntity3.name = "Casa de Praia"
    propertyEntity3.description = "Uma casa linda na praia"
    propertyEntity3.basePricePerNight = 200

    const propertyEntity4 = new PropertyEntity()
    propertyEntity4.id = "4"
    propertyEntity4.name = "Casa de Praia"
    propertyEntity4.description = "Uma casa linda na praia"
    propertyEntity4.maxGuests = 10

    expect(() => PropertyMapper.toDomain(propertyEntity1)).toThrow('O ID é obrigatório')
    expect(() => PropertyMapper.toDomain(propertyEntity2)).toThrow('O nome é obrigatório')
    expect(() => PropertyMapper.toDomain(propertyEntity3)).toThrow('O número máximo de hóspedes deve ser maior que zero')
    expect(() => PropertyMapper.toDomain(propertyEntity4)).toThrow('O preço base por noite deve ser maior que zero')
  })

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property("1", "Casa de Praia", "Uma casa linda na praia", 10, 200)

    const propertyEntity = PropertyMapper.toPersistence(property)

    expect(propertyEntity).toBeInstanceOf(PropertyEntity)
    expect(propertyEntity.id).toBe(property.getId())
    expect(propertyEntity.name).toBe(property.getName())
    expect(propertyEntity.description).toBe(property.getDescription())
    expect(propertyEntity.maxGuests).toBe(property.getMaxGuests())
    expect(propertyEntity.basePricePerNight).toBe(property.getBasePricePerNight())
  })
})