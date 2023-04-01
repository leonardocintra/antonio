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
        id: 'aaa123',
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

    const result = await controller.create(dto);
    expect(result).toBeDefined();
    expect(result.username).toBeDefined();
    expect(result.password).toBeDefined();
    expect(result.email).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.id).toEqual('aaa123');
    expect(result.username).toEqual('leonardo');
    expect(result.password).toEqual('123456');
    expect(result.email).toEqual('upchh@example.com');
    expect(result).toEqual({
      id: 'aaa123',
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
