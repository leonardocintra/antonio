import { Test, TestingModule } from '@nestjs/testing';
import { createPessoaDtoMock } from '../../test/mocks/pessoaDtoMock';
import { pessoaEntityListMock } from '../../test/mocks/pessoaEntityMock';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

describe('PessoaController', () => {
  let pessoaController: PessoaController;
  let pessoaService: PessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [
        {
          provide: PessoaService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(pessoaEntityListMock),
            findByUuid: jest.fn(),
            deleteByUuid: jest.fn(),
            create: jest.fn().mockResolvedValue(pessoaEntityListMock[1]),
          },
        }
      ],
    }).compile();

    pessoaController = module.get<PessoaController>(PessoaController);
    pessoaService = module.get<PessoaService>(PessoaService);
  });

  it('should be defined', () => {
    expect(pessoaController).toBeDefined();
    expect(pessoaService).toBeDefined();
  });

  describe('getPessoas', () => {
    it('deve retornar todas as pessoas com sucesso', async () => {
      // arrange
      // act
      const result = await pessoaController.getPessoas();
      // assert
      expect(result).toEqual(pessoaEntityListMock);
      expect(typeof result).toEqual('object');
      expect(pessoaService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma exception', () => {
      // arrange
      jest.spyOn(pessoaService, 'findAll').mockRejectedValueOnce(new Error());
      // assert
      expect(pessoaController.getPessoas()).rejects.toThrowError();
    });
  });

  describe('createPessoa', () => {
    it('deve cadastrar uma pessoa com sucesso', async () => {
      const body = createPessoaDtoMock;
      const result = await pessoaController.createPessoa(body);
      // assert
      expect(result).toEqual(pessoaEntityListMock[1]);
      expect(pessoaService.create).toHaveBeenCalledTimes(1);
      // assert - espero que tenha chamado com um parametro especifico, nesse caso o body
      expect(pessoaService.create).toHaveBeenCalledWith(body);
    });

    it('deve retornar uma exception (geral)', () => {
      const body = createPessoaDtoMock;
      jest.spyOn(pessoaService, 'create').mockRejectedValueOnce(new Error());

      expect(pessoaController.createPessoa(body)).rejects.toThrowError();
    });
  });
});
