import { Test, TestingModule } from '@nestjs/testing';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

describe('PessoaController', () => {
  let pessoaController: PessoaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [
        {
          provide: PessoaService,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    pessoaController = module.get<PessoaController>(PessoaController);
  });

  it('should be defined', () => {
    expect(pessoaController).toBeDefined();
  });
});
