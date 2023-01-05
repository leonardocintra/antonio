import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateEnderecoDto } from '../endereco/dto/createEnderecoDto';
import { PessoaEnderecoService } from './pessoa-endereco.service';

@Controller('api/v1/endereco/pessoa')
export class PessoaEnderecoController {
  constructor(private readonly pessoaEnderecoService: PessoaEnderecoService) {}

  @Post(':id')
  async createEndereco(
    @Param('id', new ParseUUIDPipe()) pessoaId: string,
    @Body() body: CreateEnderecoDto,
  ) {
    return this.pessoaEnderecoService.createEnderecoByPessoa(body, pessoaId);
  }
}
