import { UserRepository } from './../../domain/repositories/user_repository';
import { UserController } from './user_controller';
import express from 'express'
import request from 'supertest'
import { UserService } from '../../application/services/user_service';
import { TypeORMUserRepository } from '../repositories/typeorm_user_repository';
import { UserEntity } from '../persistence/entities/user_entity';
import { DataSource } from 'typeorm';

let dataSource: DataSource

const app = express()
app.use(express.json())

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize()

  const userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity))
  const userService = new UserService(userRepository)
  const userController = new UserController(userService)

  app.post('/users', (req, res) => {
    userController.createUser(req, res)
  })
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('UserController', () => {
  beforeAll(async () => {
    const userRepository = dataSource.getRepository(UserEntity)
    await userRepository.clear()
  })

  it("deve criar um usuário com sucesso", async () => {
    const response1 = await request(app).post('/users').send({
      name: 'João Silva'
    })

    const response2 = await request(app).post('/users').send({
      name: 'Maria Eduarda'
    })

    expect(response1.status).toBe(201)
    expect(response1.body.user).toHaveProperty('id')
    expect(response1.body.user.name).toBe('João Silva')
    expect(response1.body.message).toBe('User created successfully')
    expect(response2.status).toBe(201)
    expect(response2.body.user).toHaveProperty('id')
    expect(response2.body.user.name).toBe('Maria Eduarda')
    expect(response2.body.message).toBe('User created successfully')
  })

  it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post('/users').send({
      name: ''
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('O campo nome é obrigatório.')
  })
})