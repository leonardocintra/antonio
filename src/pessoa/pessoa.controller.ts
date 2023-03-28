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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { IndexPessoaSwagger } from './swagger/index-pessoa.swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/pessoa')
@UseGuards(JwtAuthGuard)
@ApiTags('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

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
  async createPessoa(
    @Req() req,
    @Body() body: CreatePessoaDto,
  ): Promise<Pessoa> {
    try {
      const userUuid = req.user.id;
      return await this.pessoaService.create(body, userUuid);
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
}
