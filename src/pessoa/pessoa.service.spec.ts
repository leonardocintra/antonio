import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import {
  pessoaEntityListMock,
  pessoaEntityMockUpdated,
} from '../../test/mocks/pessoaEntityMock';
import {
  createPessoaDtoMock,
  updatePessoaDtoMock,
} from '../../test/mocks/pessoaDtoMock';
import { EnderecoService } from './endereco/endereco.service';
import { Endereco } from './endereco/entities/endereco.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Telefone } from './telefone/entities/telefone.entity';
import { TelefoneService } from './telefone/telefone.service';
import { HttpModule } from '@nestjs/axios';
import { ViacepService } from './endereco/viacep/viacep.service';
import { enderecoEntityListMock } from '../../test/mocks/enderecoEntityMock';

describe('PessoaService', () => {
  let pessoaService: PessoaService;
  let enderecoService: EnderecoService;
  let telefoneService: TelefoneService;
  let usuarioService: UsuariosService;
  let pessoaRepository: Repository<Pessoa>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TelefoneService,
        {
          provide: getRepositoryToken(Telefone),
          useValue: {
            find: jest.fn(),
          },
        },
        EnderecoService,
        {
          provide: getRepositoryToken(Endereco),
          useValue: {
            find: jest.fn().mockResolvedValue(enderecoEntityListMock[0]),
            findOneByOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
          },
        },
        ViacepService,
        PessoaService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {
            find: jest.fn().mockResolvedValue(pessoaEntityListMock),
            findOneByOrFail: jest
              .fn()
              .mockResolvedValue(pessoaEntityListMock[0]),
            create: jest.fn().mockReturnValue(pessoaEntityListMock[1]),
            save: jest.fn().mockReturnValue(pessoaEntityListMock[1]),
            merge: jest.fn().mockReturnValue(pessoaEntityMockUpdated),
            delete: jest.fn().mockReturnValue(undefined),
          },
        },
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    pessoaService = module.get<PessoaService>(PessoaService);
    enderecoService = module.get<EnderecoService>(EnderecoService);
    telefoneService = module.get<TelefoneService>(TelefoneService);
    usuarioService = module.get<UsuariosService>(UsuariosService);
    pessoaRepository = module.get<Repository<Pessoa>>(
      getRepositoryToken(Pessoa),
    );
  });

  it('should be defined', () => {
    expect(pessoaService).toBeDefined();
    expect(enderecoService).toBeDefined();
    expect(pessoaRepository).toBeDefined();
    expect(telefoneService).toBeDefined();
    expect(usuarioService).toBeDefined();
  });

  describe('findAll pessoas', () => {
    it('deve retornar uma lista de pessoas cadastradas com sucesso', async () => {
      // arrange
      // act
      const result = await pessoaService.findAll();
      // assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(pessoaEntityListMock);
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

  describe('findById pessoa', () => {
    it('deve retornar uma pessoa por id com sucesso', async () => {
      // arrange
      // act
      const result = await pessoaService.findById(1);
      // assert
      expect(result).toEqual(pessoaEntityListMock[0]);
      expect(result.nome).toEqual('Leonardo Nascimento Cintra');
      expect(result.enderecos).toBeDefined();
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
      expect(pessoaService.findById(111)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create pessoa', () => {
    it('deve dar erro na hora de criar uma pessoa', async () => {
      const data = createPessoaDtoMock;

      jest.spyOn(pessoaRepository, 'save').mockRejectedValueOnce(new Error());

      expect(pessoaService.create(data, 1)).rejects.toThrowError();
    });

    it('deve criar uma pessoa com sucesso', async () => {
      // arrange
      const data = createPessoaDtoMock;
      jest
        .spyOn(usuarioService, 'findOne')
        .mockResolvedValue(new Usuario(data));
      // act
      const result = await pessoaService.create(data, 1);
      // assert
      expect(result).toEqual(pessoaEntityListMock[1]);
      expect(pessoaRepository.save).toHaveBeenCalledTimes(1);
      expect(pessoaRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update pessoa', () => {
    it('deve retornar um exception', () => {
      // arrange
      const data: UpdatePessoaDto = updatePessoaDtoMock;
      jest.spyOn(pessoaRepository, 'save').mockRejectedValueOnce(new Error());
      // act
      // assert
      expect(pessoaService.update(2, data)).rejects.toThrowError();
    });

    it('deve retornar um not found exception quando der erro no update', () => {
      // arrange
      const data: UpdatePessoaDto = updatePessoaDtoMock;
      jest
        .spyOn(pessoaRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());
      // act
      // assert
      expect(pessoaService.update(1, data)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('deve atualizar uma pessoa com sucesso', async () => {
      // arrange
      const data: UpdatePessoaDto = updatePessoaDtoMock;
      // Precisa re-mockar essa linha
      // save: jest.fn().mockReturnValue(pessoaEntityListMock[1]),
      jest
        .spyOn(pessoaRepository, 'save')
        .mockResolvedValueOnce(pessoaEntityMockUpdated);

      // act
      const result = await pessoaService.update(1, data);

      // assert
      expect(result).toEqual(pessoaEntityMockUpdated);
    });
  });

  describe('delete pessoa', () => {
    it('deve dar exception quando ocorrer um erro ao salvar', async () => {
      jest.spyOn(pessoaRepository, 'delete').mockRejectedValueOnce(new Error());

      expect(pessoaService.delete(32)).rejects.toThrowError();
    });

    it('deve dar not found exception quando pessoa nao existe', async () => {
      jest
        .spyOn(pessoaRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());

      expect(pessoaService.delete(13232)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('deve deletar uma pessoa com sucesso', async () => {
      // act
      const result = await pessoaService.delete(1);

      // assert
      expect(result).toBeUndefined();
      expect(pessoaRepository.delete).toBeCalledTimes(1);
      expect(pessoaRepository.findOneByOrFail).toBeCalledTimes(1);
    });
  });
});
