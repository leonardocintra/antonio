import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UsuariosModule } from '../../usuarios/usuarios.module';
import { FirmsModule } from '../../firms/firms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UsuariosModule, FirmsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
