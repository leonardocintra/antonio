import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';
import { Endereco } from '../../entities/endereco.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViacepService } from './viacep/viacep.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Endereco]), HttpModule],
  providers: [EnderecoService, ViacepService],
  controllers: [EnderecoController],
  exports: [EnderecoService],
})
export class EnderecoModule {}
