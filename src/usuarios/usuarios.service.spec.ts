import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const mockUsuarioRepository = {
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new usuario - gravar e retornar', async () => {
    expect(
      await service.create({
        username: 'teste',
        password: '123456',
        email: 'kenaa@example.com',
      }),
    ).toEqual({
      id: '1111',
      username: 'teste',
      password: '123456',
      email: 'kenaa@example.com',
      ativo: true,
    });
  });
});
