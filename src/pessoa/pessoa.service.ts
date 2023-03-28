import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { UpdatePessoaDto } from './dto/updatePessoaDto';
import { Pessoa } from './entity/pessoa.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { TelefoneService } from '../telefone/telefone.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class PessoaService {
  private readonly logger = new Logger(PessoaService.name);

  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly enderecoService: EnderecoService,
    private readonly telefoneService: TelefoneService,
    private readonly usuarioService: UsuariosService,
  ) {}

  async findAll(): Promise<Pessoa[]> {
    return await this.pessoaRepository.find();
  }

  async findByUuid(uuid: string): Promise<Pessoa> {
    try {
      const pessoa = await this.pessoaRepository.findOneByOrFail({ id: uuid });
      const enderecos = await this.enderecoService.findByPessoa(pessoa);
      pessoa.enderecos = enderecos;
      return pessoa;
    } catch (error) {
      this.logger.error(error.message);
      throw new NotFoundException('Pessoa', error.message);
    }
  }

  async create(pessoa: CreatePessoaDto, userUuid: string): Promise<Pessoa> {
    const user = await this.usuarioService.findOne(userUuid);
    pessoa.usuarioInsert = user;
    pessoa.usuarioUpdate = user;

    const pessoaSaved = await this.pessoaRepository.save(
      this.pessoaRepository.create(pessoa),
    );
    if (pessoa.enderecos) {
      pessoa.enderecos.map(async (e) => {
        const enderecoSaved = await this.enderecoService.create(e, pessoaSaved);
        pessoaSaved.enderecos.push(enderecoSaved);
      });
    }

    if (pessoa.telefones) {
      pessoa.telefones.map(async (t) => {
        const telefoneSaved = await this.telefoneService.create(t, pessoaSaved);
        pessoaSaved.telefones.push(telefoneSaved);
      });
    }
    return pessoaSaved;
  }

  async update(id: string, data: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findByUuid(id);

    this.pessoaRepository.merge(pessoa, data);
    return await this.pessoaRepository.save(pessoa);
  }

  async deleteByUuid(id: string) {
    await this.findByUuid(id);
    await this.pessoaRepository.delete(id);
  }
}
