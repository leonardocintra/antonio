import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SexoEnum } from './enum/sexoEnum';
import { Pessoa } from './pessoa.entity';
import { PessoaService } from './pessoa.service';

const pessoaEntityList: Pessoa[] = [
  new Pessoa({
    id: '1',
    nome: 'Leonardo',
    sobrenome: 'Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.MASCULINO,
    email: 'leonardo.ncintra@outlook.com',
  }),
  new Pessoa({
    id: '2',
    nome: 'Juliana',
    sobrenome: 'Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.FEMININO,
    email: 'juliana.ncintra@outlook.com',
  }),
];

describe('PessoaService', () => {
  let pessoaService: PessoaService;
  let pessoaRepository: Repository<Pessoa>;

  const GET_REPOSITORY_TOKEN_PESSOA = getRepositoryToken(Pessoa);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        {
          provide: GET_REPOSITORY_TOKEN_PESSOA,
          useValue: {
            find: jest.fn().mockResolvedValue(pessoaEntityList),
          },
        },
      ],
    }).compile();

    pessoaService = module.get<PessoaService>(PessoaService);
    pessoaRepository = module.get(GET_REPOSITORY_TOKEN_PESSOA);
  });

  it('should be defined', () => {
    expect(pessoaService).toBeDefined();
    expect(pessoaRepository).toBeDefined();
  });

  describe('findAll pessoas', () => {
    it('deve retornar uma lista de pessoas cadastradas com sucesso', async () => {
      // arrange
      // act
      const result = await pessoaService.findAll();
      // assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(pessoaEntityList);
    });
  });
});
