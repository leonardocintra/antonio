import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaController } from './pessoa.controller';
import { Pessoa } from './entity/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { EnderecoModule } from '../endereco/endereco.module';
import { TelefoneModule } from '../telefone/telefone.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    EnderecoModule,
    TelefoneModule,
    UsuariosModule,
  ],
  controllers: [PessoaController],
  providers: [PessoaService],
  exports: [PessoaService],
})
export class PessoaModule {}
