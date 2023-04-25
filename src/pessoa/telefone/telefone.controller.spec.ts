import { Test, TestingModule } from '@nestjs/testing';
import { TelefoneController } from './telefone.controller';

describe('TelefoneController', () => {
  let controller: TelefoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelefoneController],
    }).compile();

    controller = module.get<TelefoneController>(TelefoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
