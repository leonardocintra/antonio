import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endereco } from './entity/endereco.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { CreateEnderecoDto } from './dto/createEnderecoDto';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,
  ) {}

  async create(endereco: CreateEnderecoDto, pessoa: Pessoa): Promise<Endereco> {
    const enderecoCreated = this.enderecoRepository.create(endereco);
    enderecoCreated.pessoa = pessoa;
    return await this.enderecoRepository.save(enderecoCreated);
  }

  async findByUuid(uuid: string): Promise<Endereco> {
    try {
      return await this.enderecoRepository.findOneByOrFail({
        id: uuid,
      });
    } catch (error) {
      throw new NotFoundException('Endereço', error.message);
    }
  }

  async findByPessoa(pessoa: Pessoa): Promise<Endereco[]> {
    const enderecos = await this.enderecoRepository.find({
      where: {
        pessoa: {
          id: pessoa.id,
        },
      },
    });
    return enderecos;
  }
}
