import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import { EnderecoService } from './endereco/endereco.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TelefoneService } from './telefone/telefone.service';

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
      const enderecos = await this.enderecoService.findByPessoa({ pessoa });
      pessoa.enderecos = enderecos;
      return pessoa;
    } catch (error) {
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

    // TODO: postar na fila rabbitMQ e depois outro processo valida
    if (pessoaSaved.enderecos) {
      pessoaSaved.enderecos.map((e) => {
        this.enderecoService.validate({ id: e.id });
      });
    }

    this.logger.log(`Pessoa created successfully - ${pessoaSaved.id}`);
    return pessoaSaved;
  }

  async update(id: string, data: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findByUuid(id);

    this.pessoaRepository.merge(pessoa, data);
    return await this.pessoaRepository.save(pessoa);
  }

  async delete(id: string): Promise<void> {
    await this.findByUuid(id);
    await this.pessoaRepository.delete(id);
  }
}
