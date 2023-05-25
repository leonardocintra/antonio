import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CatarinaException } from '../../helpers/http.exception';
import { FirmsService } from '../../firms/firms.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly firmService: FirmsService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    firmSlug: string,
    userId: number,
  ): Promise<CreateProductDto> {
    const created = this.productRepository.create(createProductDto);

    if (createProductDto.categories) {
      const categories =
        await this.categoriesService.findAllByUserIdAndFirmSlug(
          userId,
          firmSlug,
        );

      try {
        // valida se a categoria pertence a firma/empresa/loja
        let validCategory = true;
        const categoryToSave = [];
        createProductDto.categories.map((categorie) => {
          categoryToSave.push(categorie.id);
        });

        categoryToSave.map((category) => {
          const finded = categories.filter((c) => {
            return category === c.id;
          });

          if (finded.length === 0) {
            validCategory = false;
          }
        });

        if (!validCategory) {
          throw new Error();
        }
      } catch (err) {
        CatarinaException.EntityNotFoundException('Category', err);
      }
      created.categories = categories;
    }

    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);

    try {
      created.firm = firm;
      return await this.productRepository.save(created);
    } catch (err) {
      CatarinaException.QueryFailedErrorException(err);
    }
  }

  async findAllByUserIdAndFirmSlug(userId: number, firmSlug: string) {
    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
    return await this.productRepository.find({
      relations: {
        categories: true,
      },
      where: {
        firm: {
          id: firm.id,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
