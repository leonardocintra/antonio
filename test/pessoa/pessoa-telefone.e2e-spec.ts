import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreatePessoaDto } from '../../src/pessoa/dto/createPessoaDto';
import { faker } from '@faker-js/faker';
import { Util } from '../utils';
import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';
import { AppModule } from '../../src/app.module';

describe('PessoaController (e2e)', () => {
  let app: INestApplication;
  const BASE_PATH = '/api/v1/pessoa';
  const username = 'usuarioTeste';
  const password = '#usuARIO2023#';
  let jwtToken = '';

  const pessoaDto: CreatePessoaDto = {
    nome: faker.name.firstName('female'),
    sobrenome: faker.name.lastName(),
    cpfCnpj: Util.getRandomCPF(),
    sexo: SexoEnum.FEMININO,
    email: faker.internet.email(),
    enderecos: [],
    telefones: [],
    usuarioInsert: undefined,
    usuarioUpdate: undefined,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (GET/POST) - login ou new user', async () => {
    const responseUsuario = await request(app.getHttpServer()).get(
      `/api/v1/usuarios/username/${username}`,
    );

    if (responseUsuario.status === HttpStatus.NOT_FOUND) {
      // cria novo usuario
      try {
        await request(app.getHttpServer())
          .post('/api/v1/usuarios')
          .send({
            username: `${username}`,
            password: `${password}`,
            email: 'usuarioTeste@outlook.com',
          })
          .expect(201);
      } catch (error) {
        console.log(error);
      }
    }

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username, password })
      .expect(201);

    jwtToken = loginResponse.body.token;
  });

  it('/api/v1/pessoa (GET - 401) - Unauthorized', async () => {
    return request(app.getHttpServer()).get(`${BASE_PATH}`).expect(401, {
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  describe('Cadastro de pessoas com telefone', () => {
    it('/api/v1/pessoa (POST - 400) - quando o telefone é string vazia', async () => {
      pessoaDto.telefones = [
        {
          area: '35',
          numero: faker.phone.number('########'),
          tipo: '',
        },
      ];

      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(pessoaDto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[0]).toEqual(
        'telefones.0.tipo must be one of the following values: mobile, residencial, comercial',
      );
      expect(response.body.message[1]).toEqual(
        'telefones.0.tipo should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o telefone é de um tipo invalido', async () => {
      pessoaDto.telefones = [
        {
          area: '35',
          numero: faker.phone.number('########'),
          tipo: 'hotel',
        },
      ];
      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(pessoaDto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(1);
      expect(response.body.message[0]).toEqual(
        'telefones.0.tipo must be one of the following values: mobile, residencial, comercial',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o telefone não foi informato o tipo', async () => {
      pessoaDto.telefones = [
        {
          area: '35',
          numero: faker.phone.number('########'),
          tipo: null,
        },
      ];
      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(pessoaDto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(3);
      expect(response.body.message[0]).toEqual('telefones.0.tipo must be one of the following values: mobile, residencial, comercial',);
      expect(response.body.message[1]).toEqual('telefones.0.tipo must be shorter than or equal to 10 characters',);
      expect(response.body.message[2]).toEqual('telefones.0.tipo should not be empty',);
    });
  });
});
