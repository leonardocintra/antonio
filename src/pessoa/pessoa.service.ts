import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { UpdatePessoaDto } from './dto/updatePessoaDto';
import { Pessoa } from '../entity/pessoa.entity';
import { EnderecoService } from '../endereco/endereco.service';

@Injectable()
export class PessoaService {
  private readonly logger = new Logger(PessoaService.name);

  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly enderecoService: EnderecoService,
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
      throw new NotFoundException('Pessoa', error.message);
    }
  }

  async create(pessoa: CreatePessoaDto): Promise<Pessoa> {
    const pessoaSaved = await this.pessoaRepository.save(
      this.pessoaRepository.create(pessoa),
    );
    if (pessoa.enderecos) {
      pessoa.enderecos.map(async (e) => {
        const enderecoSaved = await this.enderecoService.create(e, pessoaSaved);
        pessoaSaved.enderecos.push(enderecoSaved);
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
    await this.pessoaRepository.softDelete(id);
  }
}
