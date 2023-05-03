import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CatarinaException } from '../../helpers/http.exception';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { FirmsService } from '../../firms/firms.service';
import { Firm } from '../../firms/entities/firm.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly usuarioService: UsuariosService,
    private readonly firmService: FirmsService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    try {
      const user = await this.usuarioService.findOne(userId);
      const firms = await this.firmService.findAllByUserId(user.id);
      // TODO: precisa filtar a firma caso o usuario tenha mais de uma
      // const firm = firms.filter((f) => f.id === createCategoryDto.firmId);

      const category = this.categoryRepository.create(createCategoryDto);
      category.firm = firms[0];
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
