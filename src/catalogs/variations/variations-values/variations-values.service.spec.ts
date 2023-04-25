import { Test, TestingModule } from '@nestjs/testing';
import { VariationsValuesService } from './variations-values.service';

describe('VariationsValuesService', () => {
  let service: VariationsValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariationsValuesService],
    }).compile();

    service = module.get<VariationsValuesService>(VariationsValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
