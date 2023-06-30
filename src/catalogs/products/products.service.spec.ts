import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../entities/category.entity';
import { HttpService } from '@nestjs/axios';
import { Firm } from '../../entities/firm.entity';
import { FirmsService } from '../../firms/firms.service';
import { EnderecoService } from '../../pessoa/endereco/endereco.service';
import { Endereco } from '../../entities/endereco.entity';
import { ViacepService } from '../../pessoa/endereco/viacep/viacep.service';
import { Pessoa } from '../../entities/pessoa.entity';
import { PessoaService } from '../../pessoa/pessoa.service';
import { Telefone } from '../../entities/telefone.entity';
import { TelefoneService } from '../../pessoa/telefone/telefone.service';
import { Usuario } from '../../entities/usuario.entity';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { VariationsService } from '../variations/variations.service';
import { Variation } from '../../entities/variation.entity';
import { VariationValue } from '../../entities/variation-value.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {},
        },
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {},
        },
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

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
