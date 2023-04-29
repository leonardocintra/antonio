import { Module } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { FirmsController } from './firms.controller';

@Module({
  controllers: [FirmsController],
  providers: [FirmsService]
})
export class FirmsModule {}
