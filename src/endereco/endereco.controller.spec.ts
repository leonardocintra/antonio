import { Test, TestingModule } from '@nestjs/testing';
import { EnderecoController } from './endereco.controller';
import { EnderecoService } from './endereco.service';

describe('EnderecoController', () => {
  let enderecoController: EnderecoController;
  let enderecoService: EnderecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnderecoController],
      providers: [
        {
          provide: EnderecoService,
          useValue: {},
        },
      ],
    }).compile();

    enderecoController = module.get<EnderecoController>(EnderecoController);
    enderecoService = module.get<EnderecoService>(EnderecoService);
  });

  it('should be defined', () => {
    expect(enderecoController).toBeDefined();
    expect(enderecoService).toBeDefined();
  });
});
