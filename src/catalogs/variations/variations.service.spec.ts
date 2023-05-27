import { Test, TestingModule } from '@nestjs/testing';
import { VariationsService } from './variations.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Firm } from '../../firms/entities/firm.entity';
import { FirmsService } from '../../firms/firms.service';
import { EnderecoService } from '../../pessoa/endereco/endereco.service';
import { Endereco } from '../../pessoa/endereco/entities/endereco.entity';
import { ViacepService } from '../../pessoa/endereco/viacep/viacep.service';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { PessoaService } from '../../pessoa/pessoa.service';
import { Telefone } from '../../pessoa/telefone/entities/telefone.entity';
import { TelefoneService } from '../../pessoa/telefone/telefone.service';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Variation } from './entities/variation.entity';

describe('VariationsService', () => {
  let service: VariationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariationsService,
        {
          provide: getRepositoryToken(Variation),
          useValue: {},
        },
        FirmsService,
        {
          provide: getRepositoryToken(Firm),
          useValue: {},
        },
        PessoaService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {},
        },
        TelefoneService,
        {
          provide: getRepositoryToken(Telefone),
          useValue: {},
        },
        EnderecoService,
        {
          provide: getRepositoryToken(Endereco),
          useValue: {},
        },
        ViacepService,
        {
          provide: HttpService,
          useValue: {},
        },
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<VariationsService>(VariationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
