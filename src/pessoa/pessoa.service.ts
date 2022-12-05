import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { UpdatePessoaDto } from './dto/updatePessoaDto';
import { Pessoa } from './entity/pessoa.entity';

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
    try {
      return await this.pessoaRepository.findOneByOrFail({ id: uuid });
    } catch (error) {
      throw new NotFoundException('Pessoa', error.message);
    }
  }

  async create(pessoa: CreatePessoaDto): Promise<Pessoa> {
    return this.pessoaRepository.save(this.pessoaRepository.create(pessoa));
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
