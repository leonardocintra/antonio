import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';

@Module({
  providers: [EnderecoService],
  controllers: [EnderecoController],
})
export class EnderecoModule {}
