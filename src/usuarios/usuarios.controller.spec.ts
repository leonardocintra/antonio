import { Test, TestingModule } from '@nestjs/testing';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const mockUsuarioService = {
    create: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto: CreateUsuarioDto = {
      username: 'leonardo',
      password: '123456',
      email: 'upchh@example.com',
    };

    expect(controller.create(dto)).toEqual({ username: 'leonardo' });
    expect(mockUsuarioService.create).toHaveBeenCalled();
    expect(mockUsuarioService.create).toHaveBeenCalledWith(dto);
  });
});
