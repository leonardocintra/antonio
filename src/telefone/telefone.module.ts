import { Module } from '@nestjs/common';
import { TelefoneService } from './telefone.service';
import { TelefoneController } from './telefone.controller';

@Module({
  providers: [TelefoneService],
  controllers: [TelefoneController],
})
export class TelefoneModule {}
