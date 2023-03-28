import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { Endereco } from '../endereco/entity/endereco.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { PessoaService } from '../pessoa/pessoa.service';
import { Telefone } from '../telefone/entity/telefone.entity';
import { TelefoneService } from '../telefone/telefone.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PessoaEnderecoService } from './pessoa-endereco.service';

describe('PessoaEnderecoService', () => {
  let pessoaEnderecoService: PessoaEnderecoService;
  let pessoaService: PessoaService;
  let enderecoService: EnderecoService;
  let usuarioService: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaEnderecoService,
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
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {},
        },
      ],
    }).compile();

    pessoaEnderecoService = module.get<PessoaEnderecoService>(
      PessoaEnderecoService,
    );
    enderecoService = module.get<EnderecoService>(EnderecoService);
    pessoaService = module.get<PessoaService>(PessoaService);
    usuarioService = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(pessoaEnderecoService).toBeDefined();
    expect(enderecoService).toBeDefined();
    expect(pessoaService).toBeDefined();
    expect(usuarioService).toBeDefined();
  });
});
