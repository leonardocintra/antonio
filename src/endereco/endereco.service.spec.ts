import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Endereco } from './entities/endereco.entity';
import { EnderecoService } from './endereco.service';

describe('EnderecoService', () => {
  let enderecoService: EnderecoService;

  const GET_REPOSITORY_TOKEN_ENDERECO = getRepositoryToken(Endereco);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnderecoService,
        {
          provide: GET_REPOSITORY_TOKEN_ENDERECO,
          useValue: {
            find: jest.fn(),
            findOneByOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    enderecoService = module.get<EnderecoService>(EnderecoService);
  });

  it('should be defined', () => {
    expect(enderecoService).toBeDefined();
  });
});
