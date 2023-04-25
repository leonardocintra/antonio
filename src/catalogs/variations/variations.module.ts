import { Module } from '@nestjs/common';
import { VariationsService } from './variations.service';
import { VariationsController } from './variations.controller';
import { VariationsValuesModule } from './variations-values/variations-values.module';

@Module({
  controllers: [VariationsController],
  providers: [VariationsService],
  imports: [VariationsValuesModule]
})
export class VariationsModule {}
