import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { VariationsModule } from './variations/variations.module';

@Module({
  controllers: [CatalogsController],
  providers: [CatalogsService],
  imports: [ProductsModule, CategoriesModule, VariationsModule]
})
export class CatalogsModule {}
