import { Injectable } from '@nestjs/common';
import { CreateEnderecoDto } from '../endereco/dto/createEnderecoDto';
import { EnderecoService } from '../endereco/endereco.service';
import { Endereco } from '../endereco/entities/endereco.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { PessoaService } from '../pessoa/pessoa.service';

@Injectable()
export class PessoaEnderecoService {
  constructor(
    private readonly pessoaService: PessoaService,
    private readonly enderecoService: EnderecoService,
  ) {}

  async getEnderecoByPessoa(pessoaId: string): Promise<Endereco[]> {
    const pessoa = await this.getPessoaByUuid(pessoaId);
    return await this.enderecoService.findByPessoa(pessoa);
  }

  async createEnderecoByPessoa(
    endereco: CreateEnderecoDto,
    pessoaId: string,
  ): Promise<Endereco> {
    const pessoa = await this.getPessoaByUuid(pessoaId);
    return await this.enderecoService.create(endereco, pessoa);
  }

  private async getPessoaByUuid(pessoaId: string): Promise<Pessoa> {
    return await this.pessoaService.findByUuid(pessoaId);
  }
}
