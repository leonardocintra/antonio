import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Usuario } from '../entities/usuario.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { AuthService } from './auth.service';
import { compareSync, hashSync } from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usuarioService: UsuariosService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuariosService>(UsuariosService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usuarioService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('should generate a JWT token for the user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock-token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(mockUser);

      expect(result).toEqual({ token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });

  describe('validateUser', () => {
    it('should return the user if it is valid', async () => {
      const mockUsername = 'john.doe';
      const mockPassword = 'password';

      const mockUser = new Usuario({
        id: 1,
        username: mockUsername,
        password: hashSync(mockPassword, 10),
      });

      jest
        .spyOn(usuarioService, 'findOneByUsername')
        .mockResolvedValue(mockUser);

      const result = await authService.validateUser(mockUsername, mockPassword);

      expect(result).toBe(mockUser);
      expect(usuarioService.findOneByUsername).toHaveBeenCalledWith(
        mockUsername,
      );
      expect(compareSync(mockPassword, mockUser.password)).toBe(true);
    });

    it('should return null if the user is invalid', async () => {
      const mockUsername = 'invalid-user';
      const mockPassword = 'password';

      jest.spyOn(usuarioService, 'findOneByUsername').mockResolvedValue(null);

      const result = await authService.validateUser(mockUsername, mockPassword);

      expect(result).toBeNull();
      expect(usuarioService.findOneByUsername).toHaveBeenCalledWith(
        mockUsername,
      );
    });

    it('should return null if the password is invalid', async () => {
      const mockUsername = 'robinho';
      const mockPassword = 'password-invalid';

      const mockUser = new Usuario({
        id: 1,
        username: mockUsername,
        password: hashSync('password-valid', 10),
      });

      jest
        .spyOn(usuarioService, 'findOneByUsername')
        .mockResolvedValue(mockUser);

      const result = await authService.validateUser(mockUsername, mockPassword);

      expect(result).toBeNull();
      expect(usuarioService.findOneByUsername).toHaveBeenCalledWith(
        mockUsername,
      );
    });

    it('should return null if an error occurs while retrieving the user', async () => {
      const mockUsername = 'john.doe';
      const mockPassword = 'password';

      jest
        .spyOn(usuarioService, 'findOneByUsername')
        .mockRejectedValueOnce(new Error('Database error'));

      const result = await authService.validateUser(mockUsername, mockPassword);

      expect(result).toBeNull();
      expect(usuarioService.findOneByUsername).toHaveBeenCalledWith(
        mockUsername,
      );
    });
  });
});
