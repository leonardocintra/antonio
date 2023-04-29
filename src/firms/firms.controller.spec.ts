import { Test, TestingModule } from '@nestjs/testing';
import { FirmsController } from './firms.controller';
import { FirmsService } from './firms.service';

describe('FirmsController', () => {
  let controller: FirmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirmsController],
      providers: [FirmsService],
    }).compile();

    controller = module.get<FirmsController>(FirmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
