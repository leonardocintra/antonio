import { Module } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { FirmsController } from './firms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PessoaModule } from '../pessoa/pessoa.module';
import { EnderecoModule } from '../pessoa/endereco/endereco.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Firm]),
    PessoaModule,
    UsuariosModule,
    EnderecoModule,
  ],
  controllers: [FirmsController],
  providers: [FirmsService],
})
export class FirmsModule {}
