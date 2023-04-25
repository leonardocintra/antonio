import { Module } from '@nestjs/common';
import { VariationsValuesService } from './variations-values.service';
import { VariationsValuesController } from './variations-values.controller';

@Module({
  controllers: [VariationsValuesController],
  providers: [VariationsValuesService]
})
export class VariationsValuesModule {}
