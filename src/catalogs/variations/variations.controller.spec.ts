import { Test, TestingModule } from '@nestjs/testing';
import { VariationsController } from './variations.controller';
import { VariationsService } from './variations.service';
import { FirmsService } from '../../firms/firms.service';
import { Variation } from '../../entities/variation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Firm } from '../../entities/firm.entity';
import { HttpService } from '@nestjs/axios';
import { EnderecoService } from '../../pessoa/endereco/endereco.service';
import { Endereco } from '../../entities/endereco.entity';
import { ViacepService } from '../../pessoa/endereco/viacep/viacep.service';
import { Pessoa } from '../../entities/pessoa.entity';
import { PessoaService } from '../../pessoa/pessoa.service';
import { Telefone } from '../../entities/telefone.entity';
import { TelefoneService } from '../../pessoa/telefone/telefone.service';
import { Usuario } from '../../entities/usuario.entity';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { VariationValue } from '../../entities/variation-value.entity';

describe('VariationsController', () => {
  let controller: VariationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationsController],
      providers: [
        VariationsService,
        {
          provide: getRepositoryToken(Variation),
          useValue: {},
        },
        {
          provide: getRepositoryToken(VariationValue),
          useValue: {},
        },
        FirmsService,
        {
          provide: getRepositoryToken(Firm),
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

    controller = module.get<VariationsController>(VariationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
