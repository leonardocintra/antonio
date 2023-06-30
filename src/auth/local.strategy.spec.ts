import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should return the user if it is valid', async () => {
      const mockUsername = 'john.doe';
      const mockPassword = 'password';

      const mockUser = { id: 1, username: mockUsername };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await localStrategy.validate(mockUsername, mockPassword);

      expect(result).toBe(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockUsername,
        mockPassword,
      );
    });

    it('should throw UnauthorizedException if the user is invalid', async () => {
      const mockUsername = 'john.doe';
      const mockPassword = 'password';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        localStrategy.validate(mockUsername, mockPassword),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
