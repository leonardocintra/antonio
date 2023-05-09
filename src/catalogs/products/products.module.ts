import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { FirmsModule } from '../../firms/firms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule, FirmsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
