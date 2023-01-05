import { Test, TestingModule } from '@nestjs/testing';
import { PessoaEnderecoController } from './pessoa-endereco.controller';
import { PessoaEnderecoService } from './pessoa-endereco.service';

describe('PessoaEnderecoController', () => {
  let pessoaEnderecoController: PessoaEnderecoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaEnderecoController],
      providers: [
        {
          provide: PessoaEnderecoService,
          useValue: {},
        },
      ],
    }).compile();

    pessoaEnderecoController = module.get<PessoaEnderecoController>(
      PessoaEnderecoController,
    );
  });

  it('should be defined', () => {
    expect(pessoaEnderecoController).toBeDefined();
  });
});
