import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from '../pessoa/entity/pessoa.entity';
import { CreateTefoneDto } from './dto/createTelefoneDto';
import { Telefone } from './entity/telefone.entity';

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
}
