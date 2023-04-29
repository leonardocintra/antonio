import { Test, TestingModule } from '@nestjs/testing';
import { FirmsService } from './firms.service';

describe('FirmsService', () => {
  let service: FirmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirmsService],
    }).compile();

    service = module.get<FirmsService>(FirmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
