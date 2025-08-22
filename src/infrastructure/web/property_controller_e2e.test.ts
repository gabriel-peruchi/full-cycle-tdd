import express from 'express'
import request from 'supertest'
import { DataSource } from 'typeorm';
import { PropertyController } from './property_controller';
import { TypeORMPropertyRepository } from './../repositories/typeorm_property_repository';
import { PropertyService } from '../../application/services/property_service';
import { PropertyEntity } from '../persistence/entities/property_entity';
import { BookingEntity } from '../persistence/entities/booking_entity';
import { UserEntity } from '../persistence/entities/user_entity';

let dataSource: DataSource

const app = express()
app.use(express.json())

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize()

  const propertyRepository = new TypeORMPropertyRepository(dataSource.getRepository(PropertyEntity))
  const propertyService = new PropertyService(propertyRepository)
  const propertyController = new PropertyController(propertyService)

  app.post('/properties', (req, res) => {
    propertyController.createProperty(req, res)
  })
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('PropertyController', () => {
  beforeAll(async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity)
    await propertyRepository.clear()
  })

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post('/properties').send({
      name: 'Casa de Praia',
      description: 'Uma linda casa na praia',
      maxGuests: 6,
      basePricePerNight: 200
    })

    expect(response.status).toBe(201)
    expect(response.body.property).toHaveProperty('id')
    expect(response.body.property.name).toBe('Casa de Praia')
    expect(response.body.property.description).toBe('Uma linda casa na praia')
    expect(response.body.property.maxGuests).toBe(6)
    expect(response.body.property.basePricePerNight).toBe(200)
  })

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post('/properties').send({
      name: '',
      description: 'Uma linda casa na praia',
      maxGuests: 6,
      basePricePerNight: 200
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('O nome da propriedade é obrigatório.')
  })

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await request(app).post('/properties').send({
      name: 'Casa de Praia',
      description: 'Uma linda casa na praia',
      maxGuests: 0,
      basePricePerNight: 200
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('A capacidade máxima deve ser maior que zero.')
  })

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post('/properties').send({
      name: 'Casa de Praia',
      description: 'Uma linda casa na praia',
      maxGuests: 10,
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('O preço base por noite é obrigatório.')
  })
})