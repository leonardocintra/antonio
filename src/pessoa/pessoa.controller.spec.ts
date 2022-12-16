import { Test, TestingModule } from '@nestjs/testing';
import { EnderecoService } from '../endereco/endereco.service';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

describe('PessoaController', () => {
  let pessoaController: PessoaController;
  let pessoaService: PessoaService;
  let enderecoService: EnderecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [
        {
          provide: PessoaService,
          useValue: {
            findAll: jest.fn(),
            findByUuid: jest.fn(),
            deleteByUuid: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: EnderecoService,
          useValue: {},
        },
      ],
    }).compile();

    pessoaController = module.get<PessoaController>(PessoaController);
    pessoaService = module.get<PessoaService>(PessoaService);
    enderecoService = module.get<EnderecoService>(EnderecoService);
  });

  it('should be defined', () => {
    expect(pessoaController).toBeDefined();
    expect(pessoaService).toBeDefined();
    expect(enderecoService).toBeDefined();
  });
});
