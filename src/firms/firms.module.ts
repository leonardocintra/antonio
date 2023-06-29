import { Module } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { FirmsController } from './firms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firm } from '../entities/firm.entity';
import { PessoaModule } from '../pessoa/pessoa.module';
import { EnderecoModule } from '../pessoa/endereco/endereco.module';

@Module({
  imports: [TypeOrmModule.forFeature([Firm]), PessoaModule, EnderecoModule],
  controllers: [FirmsController],
  providers: [FirmsService],
  exports: [FirmsService],
})
export class FirmsModule {}
