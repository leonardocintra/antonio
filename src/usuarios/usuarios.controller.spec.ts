import { Test, TestingModule } from '@nestjs/testing';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  const mockUsuarioService = {
    create: jest.fn((dto) => {
      return {
        id: '123',
        ...dto,
      };
    }),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [UsuariosService],
    })
      .overrideProvider(UsuariosService)
      .useValue(mockUsuarioService)
      .compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto: CreateUsuarioDto = {
      username: 'leonardo',
      password: '123456',
      email: 'upchh@example.com',
    };

    expect(controller.create(dto)).toEqual({
      id: '123',
      username: 'leonardo',
      password: '123456',
      email: 'upchh@example.com',
    });
    expect(mockUsuarioService.create).toHaveBeenCalled();
    expect(mockUsuarioService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a usuario', () => {
    const dto: CreateUsuarioDto = {
      username: 'juliana',
      password: '123456',
      email: 'upchh@example.com',
    };

    expect(controller.update('1', dto)).toEqual({
      id: '1',
      ...dto,
    });

    expect(mockUsuarioService.update).toHaveBeenCalled();
  });
});
