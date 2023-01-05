import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { Endereco } from '../endereco/entity/endereco.entity';
import { Pessoa } from '../pessoa/entity/pessoa.entity';
import { PessoaService } from '../pessoa/pessoa.service';
import { PessoaEnderecoService } from './pessoa-endereco.service';

describe('PessoaEnderecoService', () => {
  let pessoaEnderecoService: PessoaEnderecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaEnderecoService,
        PessoaService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {},
        },
        EnderecoService,
        {
          provide: getRepositoryToken(Endereco),
          useValue: {},
        },
      ],
    }).compile();

    pessoaEnderecoService = module.get<PessoaEnderecoService>(
      PessoaEnderecoService,
    );
  });

  it('should be defined', () => {
    expect(pessoaEnderecoService).toBeDefined();
  });
});
