import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CatarinaException } from '../../helpers/http.exception';
import { UsuariosService } from '../../usuarios/usuarios.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly usuarioService: UsuariosService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userUuid: string,
  ): Promise<Category> {
    try {
      const user = await this.usuarioService.findOne(userUuid);      
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (err) {
      CatarinaException.QueryFailedErrorException(err);
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
