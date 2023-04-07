import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreatePessoaDto } from '../../src/pessoa/dto/create-pessoa.dto';
import { faker } from '@faker-js/faker';
import { Util } from '../utils';
import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';
import { AppModule } from '../../src/app.module';

describe('PessoaController - Endereço (e2e)', () => {
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

  describe('Cadastro de pessoa - LOGIN/AUTH', () => {
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
  });

  describe('Cadastro de pessoa - Campo BAIRRO do endereco', () => {
    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo bairro com string vazia', async () => {
      pessoaDto.enderecos = [
        {
          bairro: '',
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.bairro should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo bairro null', async () => {
      pessoaDto.enderecos = [
        {
          bairro: null,
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
      expect(response.body.message[1]).toEqual(
        'enderecos.0.bairro must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.bairro must be shorter than or equal to 100 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.bairro should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo bairro não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(3);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.bairro must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.bairro must be shorter than or equal to 100 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.bairro should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo bairro maior que 100 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          bairro:
            'aaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbb ccccccccccccccccc dddddddddddddddd eeeeeeeeeeeeeeee ddddddddddddddd fffffffffffffff ggggggggggg',
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.bairro must be shorter than or equal to 100 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo bairro numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            bairro: 10000,
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.bairro must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.bairro must be shorter than or equal to 100 characters',
      );
    });
  });

  describe('Cadastro de pessoa - Campo CEP do endereco', () => {
    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cep com string vazia', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: '',
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cep must be longer than or equal to 8 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cep must be a number string',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.cep should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cep null', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: null,
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
        },
      ];
      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(pessoaDto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cep must be longer than or equal to 8 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cep must be shorter than or equal to 8 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.cep must be a number string',
      );
      expect(response.body.message[3]).toEqual(
        'enderecos.0.cep should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cep não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            bairro: faker.address.street(),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cep must be longer than or equal to 8 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cep must be shorter than or equal to 8 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.cep must be a number string',
      );
      expect(response.body.message[3]).toEqual(
        'enderecos.0.cep should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cep menor que 8 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          cep: faker.address.zipCode('####'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.cep must be longer than or equal to 8 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cep maior que 8 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          cep: faker.address.zipCode('##########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.cep must be shorter than or equal to 8 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cep numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: 123456,
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            endereco: faker.address.street(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(3);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cep must be shorter than or equal to 8 characters',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cep must be longer than or equal to 8 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.cep must be a number string',
      );
    });
  });

  describe('Cadastro de pessoa - Campo CIDADE do endereco', () => {
    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cidade com string vazia', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: '',
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.cidade should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cidade null', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: null,
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cidade must be shorter than or equal to 100 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cidade must be a string',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.cidade should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cidade não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            bairro: faker.address.street(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(3);
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cidade must be shorter than or equal to 100 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cidade must be a string',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.cidade should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cidade maior que 100 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          cep: faker.address.zipCode('########'),
          cidade:
            'faker.address.cityName() aaaaaaaaaaaaaaaaa  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.cidade must be shorter than or equal to 100 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo cidade numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: 1231231,
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            endereco: faker.address.street(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.cidade must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.cidade must be shorter than or equal to 100 characters',
      );
    });
  });

  describe('Cadastro de pessoa - Campo UF do endereco', () => {
    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo uf com string vazia', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.city(),
          uf: '',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
      expect(response.body.message[0]).toEqual(
        'enderecos.0.uf must be longer than or equal to 2 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.uf must be one of the following values: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.uf should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo uf null', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.city(),
          uf: null,
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: faker.address.zipCode('####'),
        },
      ];
      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(pessoaDto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(5);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.uf must be shorter than or equal to 2 characters',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.uf must be longer than or equal to 2 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.uf must be one of the following values: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO',
      );
      expect(response.body.message[3]).toEqual(
        'enderecos.0.uf must be a string',
      );
      expect(response.body.message[4]).toEqual(
        'enderecos.0.uf should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo uf não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cidade: faker.address.city(),
            cep: faker.address.zipCode('########'),
            bairro: faker.address.street(),
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(5);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.uf must be shorter than or equal to 2 characters',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.uf must be longer than or equal to 2 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.uf must be one of the following values: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO',
      );
      expect(response.body.message[3]).toEqual(
        'enderecos.0.uf must be a string',
      );
      expect(response.body.message[4]).toEqual(
        'enderecos.0.uf should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo uf maior que 2 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          cep: faker.address.zipCode('########'),
          cidade: faker.address.city(),
          uf: 'MGG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.uf must be shorter than or equal to 2 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.uf must be one of the following values: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo uf numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.city(),
            uf: 23,
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            endereco: faker.address.street(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.uf must be shorter than or equal to 2 characters',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.uf must be longer than or equal to 2 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.uf must be one of the following values: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO',
      );
      expect(response.body.message[3]).toEqual(
        'enderecos.0.uf must be a string',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo uf invalido', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.city(),
            uf: 'NY',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            endereco: faker.address.street(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(1);
      expect(response.body.message[0]).toEqual(
        'enderecos.0.uf must be one of the following values: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO',
      );
    });
  });

  describe('Cadastro de pessoa - Campo NUMERO do endereco', () => {
    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo numero com string vazia', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'RJ',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: '',
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
        'enderecos.0.numero should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo numero null', async () => {
      pessoaDto.enderecos = [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          numero: null,
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
      expect(response.body.message[0]).toEqual(
        'enderecos.0.numero must be shorter than or equal to 10 characters',
      )
      expect(response.body.message[1]).toEqual(
        'enderecos.0.numero must be a string',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.numero should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo numero não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            bairro: faker.address.street(),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            endereco: faker.address.street(),
          },
        ],
        telefones: [],
        usuarioInsert: undefined,
        usuarioUpdate: undefined,
      };
      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(3);
      expect(response.body.message[0]).toEqual(
        'enderecos.0.numero must be shorter than or equal to 10 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.numero must be a string',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.numero should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo numero maior que 10 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          endereco: faker.address.street(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('#######################'),
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
        'enderecos.0.numero must be shorter than or equal to 10 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo numero é numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            endereco: faker.address.street(),
            bairro: faker.address.street(),
            numero: 12312,
          },
        ],
        telefones: [],
        usuarioInsert: undefined,
        usuarioUpdate: undefined,
      };

      const response = await request(app.getHttpServer())
        .post(BASE_PATH)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[0]).toEqual(
        'enderecos.0.numero must be shorter than or equal to 10 characters',
      );
      expect(response.body.message[1]).toEqual(
        'enderecos.0.numero must be a string',
      );
    });
  });

  describe('Cadastro de pessoa - Campo ENDERECO do endereco', () => {
    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo endereco com string vazia', async () => {
      pessoaDto.enderecos = [
        {
          endereco: '',
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.endereco should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo endereco null', async () => {
      pessoaDto.enderecos = [
        {
          endereco: null,
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
      expect(response.body.message[1]).toEqual(
        'enderecos.0.endereco must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.endereco must be shorter than or equal to 100 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.endereco should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo endereco não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(3);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.endereco must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.endereco must be shorter than or equal to 100 characters',
      );
      expect(response.body.message[2]).toEqual(
        'enderecos.0.endereco should not be empty',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo endereco maior que 100 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          endereco:
            'aaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbb ccccccccccccccccc dddddddddddddddd eeeeeeeeeeeeeeee ddddddddddddddd fffffffffffffff ggggggggggg',
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          complemento: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.endereco must be shorter than or equal to 100 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo endereco numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            endereco: 10000,
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            complemento: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.endereco must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.endereco must be shorter than or equal to 100 characters',
      );
    });
  });

  describe('Cadastro de pessoa - Campo COMPLEMENTO do endereco', () => {
    it('/api/v1/pessoa (POST - 201) - quando o endereco esta com o campo complento não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'RR',
            referencia: faker.animal.crocodilia(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toBeDefined();
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo complemento maior que 50 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          complemento:
            'aaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbb ccccccccccccccccc dddddddddddddddd eeeeeeeeeeeeeeee ddddddddddddddd fffffffffffffff ggggggggggg',
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          endereco: faker.animal.fish(),
          referencia: faker.animal.crocodilia(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.complemento must be shorter than or equal to 50 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo complemento numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            complemento: 10000,
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            endereco: faker.animal.fish(),
            referencia: faker.animal.crocodilia(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.complemento must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.complemento must be shorter than or equal to 50 characters',
      );
    });
  });

  describe('Cadastro de pessoa - Campo REFERENCIA do endereco', () => {
    it('/api/v1/pessoa (POST - 201) - quando o endereco esta com o campo referencia não informado', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'RR',
            complemento: faker.animal.crocodilia(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toBeDefined();
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo referencia maior que 100 caracteres', async () => {
      pessoaDto.enderecos = [
        {
          referencia:
            'aaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbb ccccccccccccccccc dddddddddddddddd eeeeeeeeeeeeeeee ddddddddddddddd fffffffffffffff ggggggggggg',
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: 'MG',
          endereco: faker.animal.fish(),
          complemento: faker.animal.crocodilia(),
          bairro: faker.address.street(),
          numero: faker.address.zipCode('####'),
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
        'enderecos.0.referencia must be shorter than or equal to 100 characters',
      );
    });

    it('/api/v1/pessoa (POST - 400) - quando o endereco esta com o campo referencia numerico', async () => {
      const dto = {
        nome: faker.name.firstName('female'),
        sobrenome: faker.name.lastName(),
        cpfCnpj: Util.getRandomCPF(),
        sexo: SexoEnum.FEMININO,
        email: faker.internet.email(),
        enderecos: [
          {
            referencia: 10000,
            cep: faker.address.zipCode('########'),
            cidade: faker.address.cityName(),
            uf: 'MG',
            endereco: faker.animal.fish(),
            complemento: faker.animal.crocodilia(),
            bairro: faker.address.street(),
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
        .send(dto);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toEqual(400);
      expect(response.body.message).toHaveLength(2);
      expect(response.body.message[1]).toEqual(
        'enderecos.0.referencia must be a string',
      );
      expect(response.body.message[0]).toEqual(
        'enderecos.0.referencia must be shorter than or equal to 100 characters',
      );
    });
  });
});
