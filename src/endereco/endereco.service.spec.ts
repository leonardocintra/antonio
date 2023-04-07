import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Endereco } from './entities/endereco.entity';
import { EnderecoService } from './endereco.service';

describe('EnderecoService', () => {
  let enderecoService: EnderecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnderecoService,
        {
          provide: getRepositoryToken(Endereco),
          useValue: {},
        },
      ],
    }).compile();

    enderecoService = module.get<EnderecoService>(EnderecoService);
  });

  it('should be defined', () => {
    expect(enderecoService).toBeDefined();
  });
});
