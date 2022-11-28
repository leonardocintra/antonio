import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { SexoEnum } from './enum/sexoEnum';
import { Pessoa } from './pessoa.entity';
import { PessoaService } from './pessoa.service';

const pessoaEntityList: Pessoa[] = [
  new Pessoa({
    id: '26c971c2-b831-4df0-9947-319900a92064',
    nome: 'Leonardo',
    sobrenome: 'Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.MASCULINO,
    email: 'leonardo.ncintra@outlook.com',
  }),
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
            findOneByOrFail: jest.fn().mockResolvedValue(pessoaEntityList[0]),
            create: jest.fn().mockReturnValue(pessoaEntityList[1]),
            save: jest.fn().mockReturnValue(pessoaEntityList[1]),
          },
        },
      ],
    }).compile();

    pessoaService = module.get<PessoaService>(PessoaService);
    pessoaRepository = module.get<Repository<Pessoa>>(
      GET_REPOSITORY_TOKEN_PESSOA,
    );
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
      expect(pessoaRepository.find).toHaveBeenCalledTimes(1);
    });

    it('deve retornar um erro', async () => {
      // arrange
      jest.spyOn(pessoaRepository, 'find').mockRejectedValueOnce(new Error());
      // act
      // assert
      expect(pessoaService.findAll()).rejects.toThrowError();
    });
  });

  describe('findByUuid pessoa', () => {
    it('deve retornar uma pessoa por uuid com sucess', async () => {
      // arrange
      // act
      const result = await pessoaService.findByUuid(
        '26c971c2-b831-4df0-9947-319900a92064',
      );
      // assert
      expect(result).toEqual(pessoaEntityList[0]);
      expect(result.nome).toEqual('Leonardo');
      expect(result.id).toEqual('26c971c2-b831-4df0-9947-319900a92064');
      expect(pessoaRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
    });

    it('deve retornar erro NotFoundException quando nao encontrar pessoa', async () => {
      // arrange
      jest
        .spyOn(pessoaRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());
      // act
      // assert
      expect(pessoaService.findByUuid('111')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('crete pessoa', () => {
    it('deve dar erro na hora de criar uma pessoa', async () => {
      const data: CreatePessoaDto = {
        nome: 'Juliana',
        sobrenome: 'Cintra',
        cpfCnpj: '56655835453',
        sexo: SexoEnum.FEMININO,
        email: 'juliana.ncintra@outlook.com',
      };

      jest.spyOn(pessoaRepository, 'save').mockRejectedValueOnce(new Error());

      expect(pessoaService.create(data)).rejects.toThrowError();
    });

    it('deve criar uma pessoa com sucesso', async () => {
      // arrange
      const data: CreatePessoaDto = {
        nome: 'Juliana',
        sobrenome: 'Cintra',
        cpfCnpj: '56655835453',
        sexo: SexoEnum.FEMININO,
        email: 'juliana.ncintra@outlook.com',
      };
      // act
      const result = await pessoaService.create(data);
      // assert
      expect(result).toEqual(pessoaEntityList[1]);
      expect(pessoaRepository.save).toHaveBeenCalledTimes(1);
      expect(pessoaRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
