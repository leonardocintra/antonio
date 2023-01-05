import { Injectable } from '@nestjs/common';
import { CreateEnderecoDto } from '../endereco/dto/createEnderecoDto';
import { EnderecoService } from '../endereco/endereco.service';
import { Endereco } from '../endereco/entity/endereco.entity';
import { PessoaService } from '../pessoa/pessoa.service';

@Injectable()
export class PessoaEnderecoService {
  constructor(
    private readonly pessoaService: PessoaService,
    private readonly enderecoService: EnderecoService,
  ) {}

  async createEnderecoByPessoa(
    endereco: CreateEnderecoDto,
    pessoaId: string,
  ): Promise<Endereco> {
    const pessoa = await this.pessoaService.findByUuid(pessoaId);
    return await this.enderecoService.create(endereco, pessoa);
  }
}
