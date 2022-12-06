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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { Pessoa } from './entity/pessoa.entity';
import { PessoaService } from './pessoa.service';

@Controller('api/v1/pessoa')
@ApiTags('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todas as pessoas cadastradas', })
  async getPessoas(): Promise<Pessoa[]> {
    return await this.pessoaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar pessoa by UUID', })
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Pessoa> {
    return await this.pessoaService.findByUuid(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar uma pessoa especifica', })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.pessoaService.deleteByUuid(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma pessoa', })
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
}
