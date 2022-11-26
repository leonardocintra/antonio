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

  getAll() {
    return this.pessoaRepository.find();
  }

  async create(pessoa: CreatePessoaDto) {
    const novaPessoa = this.pessoaRepository.create(pessoa);
    await this.pessoaRepository.save(novaPessoa);

    return pessoa;
  }
}
