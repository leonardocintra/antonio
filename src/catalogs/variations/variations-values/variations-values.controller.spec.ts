import { Test, TestingModule } from '@nestjs/testing';
import { VariationsValuesController } from './variations-values.controller';
import { VariationsValuesService } from './variations-values.service';

describe('VariationsValuesController', () => {
  let controller: VariationsValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationsValuesController],
      providers: [VariationsValuesService],
    }).compile();

    controller = module.get<VariationsValuesController>(VariationsValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
