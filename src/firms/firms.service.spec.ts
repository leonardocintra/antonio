import { Test, TestingModule } from '@nestjs/testing';
import { FirmsService } from './firms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Firm } from '../entities/firm.entity';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../entities/usuario.entity';
import { PessoaService } from '../pessoa/pessoa.service';
import { Pessoa } from '../entities/pessoa.entity';
import { EnderecoService } from '../pessoa/endereco/endereco.service';
import { TelefoneService } from '../pessoa/telefone/telefone.service';
import { ViacepService } from '../pessoa/endereco/viacep/viacep.service';
import { Endereco } from '../entities/endereco.entity';
import { Telefone } from '../entities/telefone.entity';
import { HttpService } from '@nestjs/axios';

describe('FirmsService', () => {
  let firmService: FirmsService;
  let firmRepository: Repository<Firm>;
  let usuariosService: UsuariosService;
  let pessoaService: PessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirmsService,
        {
          provide: getRepositoryToken(Firm),
          useValue: {},
        },
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            findById: jest.fn(),
          },
        },
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
        TelefoneService,
        {
          provide: getRepositoryToken(Telefone),
          useValue: {},
        },
        ViacepService,
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    firmRepository = module.get<Repository<Firm>>(getRepositoryToken(Firm));
    firmService = module.get<FirmsService>(FirmsService);
    usuariosService = module.get<UsuariosService>(UsuariosService);
    pessoaService = module.get<PessoaService>(PessoaService);
  });

  it('should be defined', () => {
    expect(firmService).toBeDefined();
    expect(usuariosService).toBeDefined();
    expect(firmRepository).toBeDefined();
    expect(pessoaService).toBeDefined();
  });
});
