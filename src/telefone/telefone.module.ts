import { Module } from '@nestjs/common';
import { TelefoneService } from './telefone.service';
import { TelefoneController } from './telefone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telefone } from './entity/telefone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Telefone])],
  providers: [TelefoneService],
  controllers: [TelefoneController],
  exports: [TelefoneService],
})
export class TelefoneModule {}
