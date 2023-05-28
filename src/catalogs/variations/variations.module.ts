import { Module } from '@nestjs/common';
import { VariationsController } from './variations.controller';
import { Variation } from './entities/variation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariationsService } from './variations.service';
import { FirmsModule } from '../../firms/firms.module';
import { VariationsValue } from './entities/variations-value.entity';

@Module({
  controllers: [VariationsController],
  providers: [VariationsService],
  imports: [
    TypeOrmModule.forFeature([Variation, VariationsValue]),
    FirmsModule,
  ],
})
export class VariationsModule {}
