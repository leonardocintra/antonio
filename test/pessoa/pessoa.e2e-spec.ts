import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreatePessoaDto } from '../../src/pessoa/dto/createPessoaDto';
import { faker } from '@faker-js/faker';
import { Util } from '../utils';
import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';

describe('PessoaController (e2e)', () => {
  let app: INestApplication;
  const BASE_PATH = '/api/v1/pessoa';

  async function fazerLogin() {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'leonardo', password: 'C7jwurrnleo#' })
      .expect(201);

    const token = loginResponse.body.token;
    return token;
  }

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

  it('/api/v1/pessoa (GET - 401) - Unauthorized', async () => {
    const response = await request(app.getHttpServer()).get(BASE_PATH);
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.statusCode).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/api/v1/pessoa (GET - 404) - Pessoa não encontrada by UUID', async () => {
    const token = await fazerLogin();

    const response = await request(app.getHttpServer())
      .get(BASE_PATH + '/0c39b3eb-f17f-4b55-888a-2286a74a1b59')
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body.statusCode).toEqual(404);
    expect(response.body.message).toEqual('Pessoa');
    expect(response.body.error).toEqual(
      'Could not find any entity of type "Pessoa" matching: {\n    "id": "0c39b3eb-f17f-4b55-888a-2286a74a1b59"\n}',
    );
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email not send', async () => {
    const token = await fazerLogin();

    const pessoa = {
      nome: faker.name.firstName("female"),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(1)
    expect(response.body.message[0]).toEqual("email must be an email")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email null', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName("female"),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: null,
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(1)
    expect(response.body.message[0]).toEqual("email must be an email")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email empty', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName("female"),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: '',
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(1)
    expect(response.body.message[0]).toEqual("email must be an email")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email invalid', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName("female"),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: 'invalid',
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(1)
    expect(response.body.message[0]).toEqual("email must be an email")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome not send', async () => {
    const token = await fazerLogin();

    const pessoa = {
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(2)
    expect(response.body.message[0]).toEqual("nome must be shorter than or equal to 100 characters")
    expect(response.body.message[1]).toEqual("nome should not be empty")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome null', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: null,
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(2)
    expect(response.body.message[0]).toEqual("nome must be shorter than or equal to 100 characters")
    expect(response.body.message[1]).toEqual("nome should not be empty")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome empty', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: '',
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(1)
    expect(response.body.message[0]).toEqual("nome should not be empty")
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome mais que 100 caracteres', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: 'aaaaaaaaaaaaaaadddddddddddd kkkkkkkkkkkkkkkkkkkkkkk dddddddddddd oooooooooooooooo oooooooooooooooo ppppppppppppp ccccccccc',
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400)
    expect(response.body.message).toHaveLength(1)
    expect(response.body.message[0]).toEqual("nome must be shorter than or equal to 100 characters")
  });

  it('/api/v1/pessoa (POST - 201) - Cadastrar Pessoa sem endereço', async () => {
    const token = await fazerLogin();

    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName("female"),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + token)
      .send(pessoa);

    console.log(response.body)

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body.id).toMatch(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    expect(response.body.nome).not.toBeNull();
    expect(response.body.sobrenome).not.toBeNull();
    expect(response.body.cpfCnpj).not.toBeNull();
    expect(response.body.sexo).not.toBeNull();
    expect(response.body.ativo).not.toBeNull();
    expect(response.body.email).not.toBeNull();
    expect(response.body.enderecos).toHaveLength(0);
  });
});
