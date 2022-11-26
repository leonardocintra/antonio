import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePessoaDto } from './dto/createPessoaDto';
import { PessoaService } from './pessoa.service';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Get()
  getPessoas() {
    return this.pessoaService.getAll();
  }

  @Post()
  createPessoa(@Body() pessoa: CreatePessoaDto) {
    return this.pessoaService.create(pessoa);
  }
}
