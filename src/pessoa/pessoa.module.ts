import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaController } from './pessoa.controller';
import { Pessoa } from './entity/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { EnderecoModule } from '../endereco/endereco.module';
import { TelefoneModule } from '../telefone/telefone.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa]), EnderecoModule, TelefoneModule],
  controllers: [PessoaController],
  providers: [PessoaService],
  exports: [PessoaService],
})
export class PessoaModule { }
