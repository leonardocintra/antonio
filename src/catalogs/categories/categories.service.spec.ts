import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { FirmsService } from '../../firms/firms.service';
import { Firm } from '../../firms/entities/firm.entity';
import { PessoaService } from '../../pessoa/pessoa.service';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { TelefoneService } from '../../pessoa/telefone/telefone.service';
import { EnderecoService } from '../../pessoa/endereco/endereco.service';
import { Telefone } from '../../pessoa/telefone/entities/telefone.entity';
import { Endereco } from '../../pessoa/endereco/entities/endereco.entity';
import { ViacepService } from '../../pessoa/endereco/viacep/viacep.service';
import { HttpService } from '@nestjs/axios';

describe('CategoriesService', () => {
  let categoryRepository: Repository<Category>;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {},
        },
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
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
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });
});
