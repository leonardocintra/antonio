import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CatarinaException } from '../../helpers/http.exception';
import { FirmsService } from '../../firms/firms.service';
import { Category } from '../categories/entities/category.entity';
import { VariationsService } from '../variations/variations.service';
import { Variation } from '../variations/entities/variation.entity';
import { VariationsValue } from '../variations/entities/variations-value.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly variationsService: VariationsService,
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
        const categoryToSave = [];
        createProductDto.categories.map((categorie) => {
          categoryToSave.push(categorie.id);
        });

        const validsCategories: Category[] = categories.filter((category) =>
          categoryToSave.includes(category.id),
        );

        if (validsCategories.length === createProductDto.categories.length) {
          created.categories = validsCategories;
        } else {
          throw new Error();
        }
      } catch (err) {
        CatarinaException.EntityNotFoundException('Category', err);
      }
    }

    if (createProductDto.variations) {
      let messageEntityNotFound = 'Variation';
      const variations =
        await this.variationsService.findAllByUserIdAndFirmSlug(
          userId,
          firmSlug,
        );

      try {
        // valida se a variação (variation) pertence a firma/empresa/loja
        const variationToSave = [];
        createProductDto.variations.map((variation) => {
          variationToSave.push(variation.id);
        });

        const validsVariations: Variation[] = variations.filter((variation) =>
          variationToSave.includes(variation.id),
        );

        if (validsVariations.length === createProductDto.variations.length) {
          created.variations = validsVariations;
        } else {
          throw new Error();
        }

        // Variations values
        createProductDto.variations.forEach((variationDto) => {
          if (variationDto.variationsValues) {
            const variationValuesToSave: VariationsValue[] = [];
            const variationsValuesDb: VariationsValue[] = [];

            variations.forEach((element) => {
              element.variationsValues.forEach((vv) => {
                variationsValuesDb.push(vv);
              });
            });

            variationDto.variationsValues.forEach((element) => {
              variationsValuesDb.forEach((vvDb) => {
                if (vvDb.id === element.id) {
                  variationValuesToSave.push(vvDb);
                }
              });
            });

            if (variationValuesToSave.length > 0) {
              created.variationsValues = variationValuesToSave;
            } else {
              messageEntityNotFound = 'Variation Values';
              throw new Error();
            }
          }
        });
      } catch (err) {
        CatarinaException.EntityNotFoundException(messageEntityNotFound, err);
      }
    }

    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);

    try {
      created.firm = firm;
      return await this.productRepository.save(created);
    } catch (err) {
      CatarinaException.QueryFailedErrorException(err);
    }
  }

  async findAllByUserIdAndFirmSlug(
    userId: number,
    firmSlug: string,
  ): Promise<Product[]> {
    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
    return await this.productRepository.find({
      relations: {
        categories: true,
        variations: {
          variationsValues: true,
        },
      },
      where: {
        firm: {
          id: firm.id,
        },
      },
    });
  }

  async findOne(slug: string, firmSlug: string, userId: number) {
    try {
      const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
      return await this.productRepository.findOneOrFail({
        relations: {
          categories: true,
          variations: {
            variationsValues: true,
          },
        },
        where: {
          slug,
          firm: {
            id: firm.id,
          },
        },
      });
    } catch (err) {
      CatarinaException.EntityNotFoundException('Product', err);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number, firmSlug: string, userId: number) {
    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
    const deleted = await this.productRepository
      .createQueryBuilder('product')
      .delete()
      .from(Product)
      .where('id = :id and firmId = :firmId', { id, firmId: firm.id })
      .execute();

    if (deleted.affected > 0) {
      return deleted;
    } else {
      CatarinaException.EntityNotFoundException('Product', null);
    }
  }
}
