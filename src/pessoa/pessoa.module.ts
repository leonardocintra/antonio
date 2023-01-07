import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaController } from './pessoa.controller';
import { Pessoa } from './entity/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { EnderecoModule } from '../endereco/endereco.module';
import { TelefoneModule } from '../telefone/telefone.module';
import { CronService } from './cron/cron.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa]), EnderecoModule, TelefoneModule, HttpModule],
  controllers: [PessoaController],
  providers: [PessoaService, CronService],
  exports: [PessoaService],
})
export class PessoaModule {}
