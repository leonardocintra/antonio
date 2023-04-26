import { Test, TestingModule } from '@nestjs/testing';
import { ViacepService } from './viacep.service';
import { HttpModule } from '@nestjs/axios';

describe('ViacepService', () => {
  let viaCepService: ViacepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ViacepService, ],
    }).compile();

    viaCepService = module.get<ViacepService>(ViacepService);
  });

  it('should be defined', () => {
    expect(viaCepService).toBeDefined();
  });
});
