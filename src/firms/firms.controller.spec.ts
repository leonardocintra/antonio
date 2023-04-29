import { Test, TestingModule } from '@nestjs/testing';
import { FirmsController } from './firms.controller';
import { FirmsService } from './firms.service';
import { PessoaService } from '../pessoa/pessoa.service';

describe('FirmsController', () => {
  let firmController: FirmsController;
  let firmService: FirmsService;
  let pessoaService: PessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirmsController],
      providers: [
        {
          provide: FirmsService,
          useValue: {},
        },
        {
          provide: PessoaService,
          useValue: {},
        },
      ],
    }).compile();

    firmController = module.get<FirmsController>(FirmsController);
    pessoaService = module.get<PessoaService>(PessoaService);
    firmService = module.get<FirmsService>(FirmsService);
  });

  it('should be defined', () => {
    expect(firmController).toBeDefined();
    expect(firmService).toBeDefined();
    expect(pessoaService).toBeDefined();
  });
});
