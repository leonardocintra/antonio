import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { Pessoa } from './pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  async findAll(): Promise<Pessoa[]> {
    return await this.pessoaRepository.find();
  }

  async findByUuid(uuid: string) {
    return await this.pessoaRepository.findOneByOrFail({ id: uuid });
  }

  async create(pessoa: CreatePessoaDto): Promise<CreatePessoaDto> {
    const novaPessoa = this.pessoaRepository.create(pessoa);
    await this.pessoaRepository.save(novaPessoa);

    return pessoa;
  }
}
