import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { VariationsModule } from './variations/variations.module';

@Module({
  controllers: [],
  providers: [],
  imports: [ProductsModule, CategoriesModule, VariationsModule],
})
export class CatalogsModule {}
