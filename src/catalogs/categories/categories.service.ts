import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CatarinaException } from '../../helpers/http.exception';
import { FirmsService } from '../../firms/firms.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly firmService: FirmsService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
    firmSlug: string
  ): Promise<Category> {
    const firm = await this.firmService.findBySlugAndUserIdOrFail(firmSlug, userId);
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      category.firm = firm;
      return await this.categoryRepository.save(category);
    } catch (err) {
      CatarinaException.QueryFailedErrorException(err);
    }
  }

  async findAllByUserIdAndFirmSlug(
    userId: number,
    firmSlug: string,
  ): Promise<Category[]> {
    const firm = await this.firmService.findBySlugAndUserIdOrFail(firmSlug, userId);
    return await this.categoryRepository.find({
      where: {
        firm: {
          id: firm.id,
        },
      },
    });
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
