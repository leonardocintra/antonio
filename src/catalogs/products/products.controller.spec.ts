import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { FirmsService } from '../../firms/firms.service';
import { Category } from '../../entities/category.entity';
import { Firm } from '../../entities/firm.entity';
import { PessoaService } from '../../pessoa/pessoa.service';
import { Pessoa } from '../../entities/pessoa.entity';
import { HttpService } from '@nestjs/axios';
import { EnderecoService } from '../../pessoa/endereco/endereco.service';
import { Endereco } from '../../entities/endereco.entity';
import { ViacepService } from '../../pessoa/endereco/viacep/viacep.service';
import { Telefone } from '../../entities/telefone.entity';
import { TelefoneService } from '../../pessoa/telefone/telefone.service';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Usuario } from '../../entities/usuario.entity';
import { Variation } from '../../entities/variation.entity';
import { VariationsService } from '../variations/variations.service';
import { VariationValue } from '../../entities/variation-value.entity';
import { ProductVariation } from '../../entities/product-variation.entity';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ProductVariation),
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

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
