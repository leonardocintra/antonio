import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { Pessoa } from '../entity/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { EnderecoService } from '../endereco/endereco.service';
import { IndexPessoaSwagger } from './swagger/index-pessoa.swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/pessoa')
@UseGuards(JwtAuthGuard)
@ApiTags('pessoa')
export class PessoaController {
  constructor(
    private readonly pessoaService: PessoaService,
    private readonly enderecoService: EnderecoService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as pessoas cadastradas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pessoas cadastradas',
    isArray: true,
    type: IndexPessoaSwagger,
  })
  async getPessoas(): Promise<Pessoa[]> {
    return await this.pessoaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar pessoa by UUID' })
  @ApiResponse({
    status: 200,
    description: 'Lista dados de uma pessoa especifica',
  })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Pessoa> {
    return await this.pessoaService.findByUuid(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar uma pessoa especifica' })
  @ApiResponse({ status: 204, description: 'Pessoa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.pessoaService.deleteByUuid(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma pessoa' })
  @ApiResponse({ status: 201, description: 'Pessoa cadastrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos no cadastro' })
  async createPessoa(@Body() pessoa: CreatePessoaDto) {
    try {
      return await this.pessoaService.create(pessoa);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      } else {
        throw error;
      }
    }
  }

  @Get(':id/enderecos')
  @ApiOperation({
    summary: 'Busca enderecos cadastrado de uma pessoa especifica',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dados de endereço de uma pessoa',
  })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async getEnderecoByPessoaId(@Param('id', new ParseUUIDPipe()) id: string) {
    const pessoa = await this.pessoaService.findByUuid(id);
    return this.enderecoService.findByPessoa(pessoa);
  }
}
