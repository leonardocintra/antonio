import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Endereco } from './entities/endereco.entity';
import { EnderecoService } from './endereco.service';
import { ViacepService } from './viacep/viacep.service';
import { HttpModule, HttpService } from '@nestjs/axios';

describe('EnderecoService', () => {
  let enderecoService: EnderecoService;
  let viaCepService: ViacepService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EnderecoService,
        {
          provide: getRepositoryToken(Endereco),
          useValue: {},
        },
        ViacepService,
      ],
    }).compile();

    enderecoService = module.get<EnderecoService>(EnderecoService);
    viaCepService = module.get<ViacepService>(ViacepService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(enderecoService).toBeDefined();
    expect(viaCepService).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
