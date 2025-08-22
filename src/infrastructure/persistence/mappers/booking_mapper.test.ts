import { DateRange } from './../../../domain/value_objects/date_range';
import { BookingMapper } from './booking_mapper';
import { PropertyEntity } from '../entities/property_entity';
import { UserEntity } from '../entities/user_entity';
import { BookingEntity } from './../entities/booking_entity';
import { Booking } from '../../../domain/entities/booking';
import { User } from '../../../domain/entities/user';
import { Property } from '../../../domain/entities/property';

describe('BookingMapper', () => {
  it("deve converter BookingEntity em Booking corretamente", () => {
    const userEntity = new UserEntity()
    userEntity.id = "1"
    userEntity.name = "João"

    const propertyEntity = new PropertyEntity()
    propertyEntity.id = "1"
    propertyEntity.name = "Casa de Praia"
    propertyEntity.description = "Uma casa linda na praia"
    propertyEntity.maxGuests = 10
    propertyEntity.basePricePerNight = 200
    
    const bookingEntity = new BookingEntity()
    bookingEntity.id = '1'
    bookingEntity.guest = userEntity
    bookingEntity.property = propertyEntity
    bookingEntity.startDate = new Date('2025-01-10')
    bookingEntity.endDate = new Date('2025-01-15')
    bookingEntity.guestCount = 5
    bookingEntity.totalPrice = 1000
    bookingEntity.status = 'CONFIRMED'

    const booking = BookingMapper.toDomain(bookingEntity)

    expect(booking).toBeInstanceOf(Booking)
    expect(booking.getId()).toBe(bookingEntity.id)
    expect(booking.getGuest().getId()).toBe(bookingEntity.guest.id)
    expect(booking.getProperty().getId()).toBe(bookingEntity.property.id)
    expect(booking.getDateRange().getStartDate()).toBe(bookingEntity.startDate)
    expect(booking.getDateRange().getEndDate()).toBe(bookingEntity.endDate)
    expect(booking.getGuestCount()).toBe(bookingEntity.guestCount)
    expect(booking.getTotalPrice()).toBe(bookingEntity.totalPrice)
    expect(booking.getStatus()).toBe(bookingEntity.status)
  })

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
     const userEntity = new UserEntity()
    userEntity.id = "1"
    userEntity.name = "João"

    const propertyEntity = new PropertyEntity()
    propertyEntity.id = "1"
    propertyEntity.name = "Casa de Praia"
    propertyEntity.description = "Uma casa linda na praia"
    propertyEntity.maxGuests = 10
    propertyEntity.basePricePerNight = 200

    const bookingEntity1 = new BookingEntity()
    bookingEntity1.guest = userEntity
    bookingEntity1.property = propertyEntity
    bookingEntity1.startDate = new Date('2025-01-10')
    bookingEntity1.endDate = new Date('2025-01-15')
    bookingEntity1.guestCount = 5
    bookingEntity1.totalPrice = 1000
    bookingEntity1.status = 'CONFIRMED'

    const bookingEntity2 = new BookingEntity()
    bookingEntity2.id = '2'
    bookingEntity2.property = propertyEntity
    bookingEntity2.startDate = new Date('2025-01-10')
    bookingEntity2.endDate = new Date('2025-01-15')
    bookingEntity2.guestCount = 5
    bookingEntity2.totalPrice = 1000
    bookingEntity2.status = 'CONFIRMED'

    const bookingEntity3 = new BookingEntity()
    bookingEntity3.id = '3'
    bookingEntity3.guest = userEntity
    bookingEntity3.startDate = new Date('2025-01-10')
    bookingEntity3.endDate = new Date('2025-01-15')
    bookingEntity3.guestCount = 5
    bookingEntity3.totalPrice = 1000
    bookingEntity3.status = 'CONFIRMED'

    const bookingEntity4 = new BookingEntity()
    bookingEntity4.id = '4'
    bookingEntity4.guest = userEntity
    bookingEntity4.property = propertyEntity
    bookingEntity4.guestCount = 5
    bookingEntity4.totalPrice = 1000
    bookingEntity4.status = 'CONFIRMED'

    const bookingEntity5 = new BookingEntity()
    bookingEntity5.id = '5'
    bookingEntity5.guest = userEntity
    bookingEntity5.property = propertyEntity
    bookingEntity5.startDate = new Date('2025-01-10')
    bookingEntity5.endDate = new Date('2025-01-15')
    bookingEntity5.totalPrice = 1000
    bookingEntity5.status = 'CONFIRMED'

    const bookingEntity6 = new BookingEntity()
    bookingEntity6.id = '6'
    bookingEntity6.guest = userEntity
    bookingEntity6.property = propertyEntity
    bookingEntity6.startDate = new Date('2025-01-10')
    bookingEntity6.endDate = new Date('2025-01-15')
    bookingEntity6.guestCount = 5
    bookingEntity6.status = 'CONFIRMED'

    const bookingEntity7 = new BookingEntity()
    bookingEntity7.id = '7'
    bookingEntity7.guest = userEntity
    bookingEntity7.property = propertyEntity
    bookingEntity7.startDate = new Date('2025-01-10')
    bookingEntity7.endDate = new Date('2025-01-15')
    bookingEntity7.totalPrice = 1000
    bookingEntity7.guestCount = 5

    expect(() => BookingMapper.toDomain(bookingEntity1)).toThrow('O ID é obrigatório')
    expect(() => BookingMapper.toDomain(bookingEntity2)).toThrow('O hóspede é obrigatório')
    expect(() => BookingMapper.toDomain(bookingEntity3)).toThrow('A propriedade é obrigatória')
    expect(() => BookingMapper.toDomain(bookingEntity4)).toThrow('As datas de início e fim são obrigatórias')
    expect(() => BookingMapper.toDomain(bookingEntity5)).toThrow('O número de hóspedes é obrigatório')
    expect(() => BookingMapper.toDomain(bookingEntity6)).toThrow('O preço total é obrigatório')
    expect(() => BookingMapper.toDomain(bookingEntity7)).toThrow('O status é obrigatório')
  })

  it("deve converter Booking para BookingEntity corretamente", () => {
    const user = new User('1', 'João')
    const property = new Property('1', 'Casa de Praia', 'Uma casa linda na praia', 10, 200)
    const dateRange = new DateRange(new Date('2025-01-10'), new Date('2025-01-15'))
    const booking = new Booking("1", property, user, dateRange, 5)

    const bookingEntity = BookingMapper.toPersistence(booking);

    expect(bookingEntity.id).toBe(booking.getId());
    expect(bookingEntity.property.id).toBe(booking.getProperty().getId());
    expect(bookingEntity.guest.id).toBe(booking.getGuest().getId());
    expect(bookingEntity.startDate).toEqual(booking.getDateRange().getStartDate());
    expect(bookingEntity.endDate).toEqual(booking.getDateRange().getEndDate());
    expect(bookingEntity.guestCount).toBe(booking.getGuestCount());
  });
});