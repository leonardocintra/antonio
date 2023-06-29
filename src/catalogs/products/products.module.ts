import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { FirmsModule } from '../../firms/firms.module';
import { VariationsModule } from '../variations/variations.module';
import { ProductVariation } from '../../entities/product-variation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariation]),
    CategoriesModule,
    FirmsModule,
    VariationsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
