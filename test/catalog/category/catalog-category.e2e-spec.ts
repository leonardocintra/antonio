import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule } from '../../../src/app.module';

describe('CatalogController - Category (e2e)', () => {
  let app: INestApplication;
  const BASE_PATH = '/api/v1/catalogs/categories';
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

  it(`${BASE_PATH} (GET - 404) - should status 404 when firm not exists`, async () => {
    const url = `${BASE_PATH}`;
    const response = await request(app.getHttpServer())
      .get(url)
      .set('Authorization', 'Bearer ' + jwtToken);

    expect(response.body).toBeDefined();
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body.status).toEqual(404);
    expect(response.body.error).toEqual('Entity Firm not found');
  });
});
