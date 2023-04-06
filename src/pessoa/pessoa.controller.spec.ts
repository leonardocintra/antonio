import { Test, TestingModule } from '@nestjs/testing';
import { createPessoaDtoMock } from '../../test/mocks/pessoaDtoMock';
import { pessoaEntityListMock } from '../../test/mocks/pessoaEntityMock';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

let requestMock = {
  user: {
    id: 'e4e5263a-3e77-431c-ae47-70b858618682',
  },
};

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
            findByUuid: jest.fn().mockResolvedValue(pessoaEntityListMock[1]),
            create: jest.fn().mockResolvedValue(pessoaEntityListMock[1]),
            delete: jest.fn(),
          },
        },
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

    it('deve retornar uma pessoa by id', async () => {
      const result = await pessoaController.getById(
        '2d2a5822-5424-4030-9ab7-3a70a52d0843',
      );
      expect(typeof result).toEqual('object');
      expect(result).toEqual(pessoaEntityListMock[1]);
      expect(pessoaService.findByUuid).toHaveBeenCalledTimes(1);
      expect(result.id).toEqual('2d2a5822-5424-4030-9ab7-3a70a52d0843');
      expect(result.nome).toEqual('Juliana');
      expect(result.sobrenome).toEqual('Cintra');
    });
  });

  describe('createPessoa', () => {
    it('deve cadastrar uma pessoa com sucesso', async () => {
      const body = createPessoaDtoMock;
      const result = await pessoaController.createPessoa(requestMock, body);
      // assert
      expect(result).toEqual(pessoaEntityListMock[1]);
      expect(pessoaService.create).toHaveBeenCalledTimes(1);
      // assert - espero que tenha chamado com um parametro especifico, nesse caso o requestUser e body
      expect(pessoaService.create).toHaveBeenCalledWith(
        body,
        requestMock.user.id,
      );
    });

    it('deve retornar uma exception (geral)', () => {
      const body = createPessoaDtoMock;
      jest.spyOn(pessoaService, 'create').mockRejectedValueOnce(new Error());

      expect(
        pessoaController.createPessoa(requestMock, body),
      ).rejects.toThrowError();
    });
  });

  describe('deletePessoa', () => {
    it('deve deletar uma pessoa com sucesso', async () => {
      const mockPessoaId = pessoaEntityListMock[1].id;
      const deleteSpy = jest
        .spyOn(pessoaService, 'delete')
        .mockResolvedValue(undefined);

      await pessoaController.delete(mockPessoaId);
      expect(deleteSpy).toHaveBeenCalledWith(mockPessoaId);
      expect(pessoaService.delete).toHaveBeenCalledWith(mockPessoaId);
      expect(pessoaService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
