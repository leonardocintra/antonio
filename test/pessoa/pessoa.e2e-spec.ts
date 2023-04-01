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

  it('/api/v1/pessoa (GET - 404) - Pessoa não encontrada by UUID', async () => {
    const url = `${BASE_PATH}/09b58991-538e-4410-824f-054bf8009d55`;
    return request(app.getHttpServer())
      .get(url)
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(HttpStatus.NOT_FOUND, {
        statusCode: 404,
        message: 'Pessoa',
        error:
          'Could not find any entity of type "Pessoa" matching: {\n    "id": "09b58991-538e-4410-824f-054bf8009d55"\n}',
      });
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email not send', async () => {
    const pessoa = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      enderecos: [],
      telefones: [],
    };

    return request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa)
      .expect(HttpStatus.BAD_REQUEST, {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email null', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: null,
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    return request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa)
      .expect(HttpStatus.BAD_REQUEST, {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email empty', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: '',
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    return request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa)
      .expect(HttpStatus.BAD_REQUEST, {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email invalid', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: 'invalid',
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0]).toEqual('email must be an email');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome not send', async () => {
    const pessoa = {
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(2);
    expect(response.body.message[0]).toEqual(
      'nome must be shorter than or equal to 100 characters',
    );
    expect(response.body.message[1]).toEqual('nome should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome null', async () => {
    const pessoa: CreatePessoaDto = {
      nome: null,
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(2);
    expect(response.body.message[0]).toEqual(
      'nome must be shorter than or equal to 100 characters',
    );
    expect(response.body.message[1]).toEqual('nome should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome empty', async () => {
    const pessoa: CreatePessoaDto = {
      nome: '',
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0]).toEqual('nome should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Nome mais que 100 caracteres', async () => {
    const pessoa: CreatePessoaDto = {
      nome: 'aaaaaaaaaaaaaaadddddddddddd kkkkkkkkkkkkkkkkkkkkkkk dddddddddddd oooooooooooooooo oooooooooooooooo ppppppppppppp ccccccccc',
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0]).toEqual(
      'nome must be shorter than or equal to 100 characters',
    );
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Sobrenome not send', async () => {
    const pessoa = {
      nome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(2);
    expect(response.body.message[0]).toEqual(
      'sobrenome must be shorter than or equal to 100 characters',
    );
    expect(response.body.message[1]).toEqual('sobrenome should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Sobrenome null', async () => {
    const pessoa: CreatePessoaDto = {
      sobrenome: null,
      nome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(2);
    expect(response.body.message[0]).toEqual(
      'sobrenome must be shorter than or equal to 100 characters',
    );
    expect(response.body.message[1]).toEqual('sobrenome should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Sobrenome empty', async () => {
    const pessoa: CreatePessoaDto = {
      sobrenome: '',
      nome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0]).toEqual('sobrenome should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Sobrenome mais que 100 caracteres', async () => {
    const pessoa: CreatePessoaDto = {
      sobrenome:
        'aaaaaaaaaaaaaaadddddddddddd kkkkkkkkkkkkkkkkkkkkkkk dddddddddddd oooooooooooooooo oooooooooooooooo ppppppppppppp ccccccccc',
      nome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0]).toEqual(
      'sobrenome must be shorter than or equal to 100 characters',
    );
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - CPF/CNPJ not send', async () => {
    const pessoa = {
      sobrenome: faker.name.lastName(),
      nome: faker.name.firstName(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(3);
    expect(response.body.message[0]).toEqual(
      'cpfCnpj must be longer than or equal to 11 characters',
    );
    expect(response.body.message[1]).toEqual(
      'cpfCnpj must be shorter than or equal to 14 characters',
    );
    expect(response.body.message[2]).toEqual('cpfCnpj should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - CPF/CNPJ null', async () => {
    const pessoa: CreatePessoaDto = {
      sobrenome: faker.name.lastName(),
      nome: faker.name.firstName(),
      cpfCnpj: null,
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(3);
    expect(response.body.message[0]).toEqual(
      'cpfCnpj must be longer than or equal to 11 characters',
    );
    expect(response.body.message[1]).toEqual(
      'cpfCnpj must be shorter than or equal to 14 characters',
    );
    expect(response.body.message[2]).toEqual('cpfCnpj should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - CPF/CNPJ empty', async () => {
    const pessoa: CreatePessoaDto = {
      sobrenome: faker.name.lastName(),
      nome: faker.name.firstName(),
      cpfCnpj: '',
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(2);
    expect(response.body.message[0]).toEqual(
      'cpfCnpj must be longer than or equal to 11 characters',
    );
    expect(response.body.message[1]).toEqual('cpfCnpj should not be empty');
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - CPF/CNPJ mais que 14 caracteres', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
      cpfCnpj: 'Util.getRandomCPF()33333333333333333333333',
      sexo: SexoEnum.MASCULINO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.statusCode).toEqual(400);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0]).toEqual(
      'cpfCnpj must be shorter than or equal to 14 characters',
    );
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - CPF/CNPJ duplicado', async () => {
    const cpfDuplicado = Util.getRandomCPF();

    const pessoa1: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: cpfDuplicado,
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email('example.fakerjs.dev'),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const pessoa2: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: cpfDuplicado,
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email('example.fakerjs.dev'),
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response1 = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa1);

    expect(response1.status).toEqual(HttpStatus.CREATED);
    expect(response1.body).toBeDefined();
    expect(response1.body.id).toMatch(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    expect(response1.body.nome).not.toBeNull();
    expect(response1.body.sobrenome).not.toBeNull();
    expect(response1.body.cpfCnpj).not.toBeNull();
    expect(response1.body.sexo).not.toBeNull();
    expect(response1.body.ativo).not.toBeNull();
    expect(response1.body.email).not.toBeNull();
    expect(response1.body.enderecos).toHaveLength(0);

    const response2 = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa2);

    expect(response2.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response2.body).toBeDefined();
    expect(response2.body.status).toEqual(400);
    expect(response2.body.error).toContain(
      `Field already exists. Duplicate entry '${cpfDuplicado}' for key`,
    );
    expect(response2.body.errorMessageDetail).toBeDefined();
  });

  it('/api/v1/pessoa (POST - 400) - Cadastrar Pessoa - Email duplicado', async () => {
    const emailUnico = faker.internet.email();

    const pessoa1: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: emailUnico,
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const pessoa2: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: emailUnico,
      enderecos: [],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response1 = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa1);

    expect(response1.status).toEqual(HttpStatus.CREATED);
    expect(response1.body).toBeDefined();
    expect(response1.body.id).toMatch(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    expect(response1.body.nome).not.toBeNull();
    expect(response1.body.sobrenome).not.toBeNull();
    expect(response1.body.cpfCnpj).not.toBeNull();
    expect(response1.body.sexo).not.toBeNull();
    expect(response1.body.ativo).not.toBeNull();
    expect(response1.body.email).not.toBeNull();
    expect(response1.body.enderecos).toHaveLength(0);

    const response2 = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa2);

    expect(response2.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response2.body).toBeDefined();
    expect(response2.body.status).toEqual(400);
    expect(response2.body.errorMessageDetail).toBeDefined();
    expect(response2.body.error).toContain(
      `Field already exists. Duplicate entry '${emailUnico}' for key`,
    );
  });

  it('/api/v1/pessoa (POST - 201) - Cadastrar Pessoa sem endereço e telefone', async () => {
    const pessoa: CreatePessoaDto = {
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

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

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
    expect(response.body.telefones).toHaveLength(0);
  });

  it('/api/v1/pessoa (POST - 201) - Cadastrar Pessoa com endereco mas sem telefone', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [
        {
          bairro: faker.animal.bird(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: faker.address.countryCode(),
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
        },
        {
          bairro: faker.animal.bird(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: faker.address.countryCode(),
          complemento: faker.animal.fish(),
          referencia: faker.animal.fish(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
        },
      ],
      telefones: [],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

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
    expect(response.body.enderecos).toHaveLength(2);
    expect(response.body.enderecos[0].bairro).not.toBeNull();
    expect(response.body.enderecos[0].cep).not.toBeNull();
    expect(response.body.enderecos[0].cidade).not.toBeNull();
    expect(response.body.enderecos[0].uf).not.toBeNull();
    expect(response.body.enderecos[0].complemento).not.toBeNull();
    expect(response.body.enderecos[0].referencia).not.toBeNull();
    expect(response.body.enderecos[0].endereco).not.toBeNull();
    expect(response.body.enderecos[0].numero).not.toBeNull();
    expect(response.body.enderecos[1].bairro).not.toBeNull();
    expect(response.body.enderecos[1].cep).not.toBeNull();
    expect(response.body.enderecos[1].cidade).not.toBeNull();
    expect(response.body.enderecos[1].uf).not.toBeNull();
    expect(response.body.enderecos[1].complemento).not.toBeNull();
    expect(response.body.enderecos[1].referencia).not.toBeNull();
    expect(response.body.enderecos[1].endereco).not.toBeNull();
    expect(response.body.enderecos[1].numero).not.toBeNull();
    expect(response.body.telefones).toHaveLength(0);
  });

  it('/api/v1/pessoa (POST - 201) - Cadastrar Pessoa com telefone mas sem endereco', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [],
      telefones: [
        {
          area: '35',
          numero: faker.phone.number('########'),
          tipo: 'mobile',
        },
        {
          area: '16',
          numero: faker.phone.number('########'),
          tipo: 'comercial',
        },
      ],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

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
    expect(response.body.telefones).toHaveLength(2);
  });

  it('/api/v1/pessoa (POST - 201) - Cadastrar Pessoa com telefone e endereco', async () => {
    const pessoa: CreatePessoaDto = {
      nome: faker.name.firstName('female'),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(),
      enderecos: [
        {
          bairro: faker.animal.bird(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: faker.address.countryCode(),
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
        },
        {
          bairro: faker.animal.bird(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: faker.address.countryCode(),
          complemento: faker.animal.fish(),
          referencia: faker.animal.fish(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
        },
      ],
      telefones: [
        {
          area: '35',
          numero: faker.phone.number('########'),
          tipo: 'mobile',
        },
        {
          area: '16',
          numero: faker.phone.number('########'),
          tipo: 'comercial',
        },
      ],
      usuarioInsert: undefined,
      usuarioUpdate: undefined,
    };

    const response = await request(app.getHttpServer())
      .post(BASE_PATH)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(pessoa);

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
    expect(response.body.enderecos).toHaveLength(2);
    expect(response.body.telefones).toHaveLength(2);
  });
});
