import { Module } from '@nestjs/common';
import { VariationsService } from './variations.service';
import { VariationsController } from './variations.controller';
import { VariationsValuesModule } from './variations-values/variations-values.module';
import { Variation } from './entities/variation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmsModule } from '../../firms/firms.module';

@Module({
  controllers: [VariationsController],
  providers: [VariationsService],
  imports: [
    TypeOrmModule.forFeature([Variation]),
    VariationsValuesModule,
    FirmsModule,
  ],
})
export class VariationsModule {}
