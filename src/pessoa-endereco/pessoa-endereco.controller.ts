import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEnderecoDto } from '../endereco/dto/createEnderecoDto';
import { Endereco } from '../endereco/entity/endereco.entity';
import { PessoaEnderecoService } from './pessoa-endereco.service';

@Controller('api/v1/endereco/pessoa')
@UseGuards(JwtAuthGuard)
@ApiTags('pessoa-endereco')
export class PessoaEnderecoController {
  constructor(private readonly pessoaEnderecoService: PessoaEnderecoService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Busca enderecos cadastrado de uma pessoa especifica',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dados de endereço de uma pessoa',
  })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async getEnderecoByPessoaId(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Endereco[]> {
    return await this.pessoaEnderecoService.getEnderecoByPessoa(id);
  }

  @Post(':id')
  @ApiOperation({
    summary: 'Cadastrar um novo endereço baseado numa pessoa especifica',
  })
  @ApiResponse({ status: 201, description: 'Endereço cadastrado com sucesso!' })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async createEndereco(
    @Param('id', new ParseUUIDPipe()) pessoaId: string,
    @Body() body: CreateEnderecoDto,
  ) {
    return this.pessoaEnderecoService.createEnderecoByPessoa(body, pessoaId);
  }
}
