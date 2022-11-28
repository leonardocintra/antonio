import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SexoEnum } from './enum/sexoEnum';
import { Pessoa } from './pessoa.entity';
import { PessoaService } from './pessoa.service';

const pessoaEntity: Pessoa = new Pessoa({
  id: '26c971c2-b831-4df0-9947-319900a92064',
  nome: 'Leonardo',
  sobrenome: 'Cintra',
  cpfCnpj: '56655835453',
  sexo: SexoEnum.MASCULINO,
  email: 'leonardo.ncintra@outlook.com',
});

const pessoaEntityList: Pessoa[] = [
  pessoaEntity,
  new Pessoa({
    id: '2d2a5822-5424-4030-9ab7-3a70a52d0843',
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
            findOneByOrFail: jest.fn().mockResolvedValue(pessoaEntity),
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

  describe('findByUuid pessoa', () => {
    it('deve retornar uma pessoa por uuid com sucesso', async () => {
      // arrange
      // act
      const result = await pessoaService.findByUuid(
        '2d2a5822-5424-4030-9ab7-3a70a52d0843',
      );
      // assert
      expect(result).toEqual(pessoaEntity);
      expect(result.nome).toEqual('Leonardo');
    });
  });
});
