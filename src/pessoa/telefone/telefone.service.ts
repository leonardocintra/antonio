import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTefoneDto } from './dto/create-telefone.dto';
import { Telefone } from '../../entities/telefone.entity';
import { Pessoa } from '../../entities/pessoa.entity';

@Injectable()
export class TelefoneService {
  constructor(
    @InjectRepository(Telefone)
    private readonly telefoneRepository: Repository<Telefone>,
  ) {}

  async create(telefone: CreateTefoneDto, pessoa: Pessoa) {
    const telefoneCreated = this.telefoneRepository.create(telefone);
    telefoneCreated.pessoa = pessoa;
    return await this.telefoneRepository.save(telefoneCreated);
  }

  async findByPessoa({ pessoa }: { pessoa: Pessoa }): Promise<Telefone[]> {
    const enderecos = await this.telefoneRepository.find({
      where: {
        pessoa: {
          id: pessoa.id,
        },
      },
    });
    return enderecos;
  }
}
