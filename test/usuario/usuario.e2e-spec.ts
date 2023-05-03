import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsuariosModule } from '../../src/usuarios/usuarios.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../../src/usuarios/entities/usuario.entity';

describe('UsuarioController (e2e)', () => {
  let app: INestApplication;
  const BASE_PATH = '/api/v1/usuarios';

  const mockUsuarios: Usuario[] = [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      email: 'admin@example.com',
      ativo: true,
      createdAt: '2020-01-01T00:00:00.000Z',
      updateddAt: '2020-01-01T00:00:00.000Z',
      criptografarSenha: null,
    },
    {
      id: 2,
      username: 'robinho',
      password: '123456',
      email: 'robinho@example.com',
      ativo: true,
      createdAt: '2020-01-01T00:00:00.000Z',
      updateddAt: '2020-01-01T00:00:00.000Z',
      criptografarSenha: null,
    },
    {
      id: 3,
      username: 'ronaldo',
      password: '123456',
      email: 'ronaldo@example.com',
      ativo: true,
      createdAt: '2020-01-01T00:00:00.000Z',
      updateddAt: '2020-01-01T00:00:00.000Z',
      criptografarSenha: null,
    },
  ];

  const mockUsuarioRepository = {
    find: jest.fn().mockResolvedValue(mockUsuarios),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: '1111',
        ativo: true,
        ...user,
      }),
    ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsuariosModule],
    })
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue(mockUsuarioRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  it(`${BASE_PATH} (GET)`, () => {
    return request(app.getHttpServer())
      .get(`${BASE_PATH}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUsuarios);
  });

  it(`${BASE_PATH} (POST) --> 201 deve criar um usuario com sucesso`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 'ronaldo',
        password: '#senhaSenha123#',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({
          id: '1111',
          username: 'ronaldo',
          password: '#senhaSenha123#',
          email: 'ronaldo@example.com',
          ativo: true,
        });
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando a senha fora da regra`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 'ronaldo',
        password: 'senhafacil',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: [
          'A senha deve conter letras maiusculas, minusculas e caracteres especiais',
        ],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando a senha maior que 100 caracteres`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 'ronaldo',
        password:
          'senhafsjdçlakfjask#_#_#AAAAdlfjaskl@@332332dfjaskdlfjaskçalçsdkfaklsjfaklçsdfjaklsjfakljdfalçksjdflçkajsdflkasjacil',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: ['password must be shorter than or equal to 100 characters'],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando nao informar o email`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 'ronaldo',
        password: '#senhaSenha123#',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: ['email should not be empty', 'email must be an email'],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando for um email invalido`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 'ronaldo',
        password: '#senhaSenha123#',
        email: 'invalido',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: ['email must be an email'],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando for um email com numeros`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 'ronaldo',
        password: '#senhaSenha123#',
        email: 123456,
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: ['email must be an email'],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando o username não é uma string`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: 123456,
        password: '123456',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: [
          'username must be a string',
          'username must be shorter than or equal to 100 characters',
          'A senha deve conter letras maiusculas, minusculas e caracteres especiais',
        ],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando o username é maior que 100 caracteres`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username:
          'senhafsjdçlakfjask#_#_#AAAAdlfjaskl@@332332dfjaskdlfjaskçalçsdkfaklsjfaklçsdfjaklsjfakljdfalçksjdflçkajsdflkasjacil',
        password: '#1Maria1#',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: ['username must be shorter than or equal to 100 characters'],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando o username não for informado`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        password: '#1Maria1#',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: [
          'username must be a string',
          'username should not be empty',
          'username must be shorter than or equal to 100 characters',
        ],
        statusCode: 400,
      });
  });

  it(`${BASE_PATH} (POST) --> 400 quando o username for string vazia`, () => {
    return request(app.getHttpServer())
      .post(`${BASE_PATH}`)
      .send({
        username: '',
        password: '#1Maria1#',
        email: 'ronaldo@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Bad Request',
        message: ['username should not be empty'],
        statusCode: 400,
      });
  });
});
