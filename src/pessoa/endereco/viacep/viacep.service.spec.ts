import { Test, TestingModule } from '@nestjs/testing';
import { ViacepService } from './viacep.service';

describe('ViacepService', () => {
  let service: ViacepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViacepService],
    }).compile();

    service = module.get<ViacepService>(ViacepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
