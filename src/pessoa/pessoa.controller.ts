import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { Pessoa } from './pessoa.entity';
import { PessoaService } from './pessoa.service';

@Controller('api/v1/pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Get()
  getPessoas(): Promise<Pessoa[]> {
    return this.pessoaService.findAll();
  }

  @Post()
  createPessoa(@Body() pessoa: CreatePessoaDto) {
    return this.pessoaService.create(pessoa);
  }
}
