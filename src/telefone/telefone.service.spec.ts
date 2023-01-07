import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Telefone } from './entity/telefone.entity';
import { TelefoneService } from './telefone.service';

describe('TelefoneService', () => {
  let telefoneService: TelefoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelefoneService,
        {
          provide: getRepositoryToken(Telefone),
          useValue: {},
        },
      ],
    }).compile();

    telefoneService = module.get<TelefoneService>(TelefoneService);
  });

  it('should be defined', () => {
    expect(telefoneService).toBeDefined();
  });
});
