import { Module } from '@nestjs/common';
import { VariationsValuesService } from './variations-values.service';
import { VariationsValuesController } from './variations-values.controller';
import { VariationsValue } from './entities/variations-value.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VariationsValue])],
  controllers: [VariationsValuesController],
  providers: [VariationsValuesService],
})
export class VariationsValuesModule {}
