import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CatarinaException } from '../../helpers/http.exception';
import { FirmsService } from '../../firms/firms.service';
import { Category } from '../../entities/category.entity';
import { VariationsService } from '../variations/variations.service';
import { ProductVariation } from '../../entities/product-variation.entity';
import { VariationValue } from '../../entities/variation-value.entity';
import { ResponseProductDto } from './dto/response-product.dto';
import { productSerializer } from './products.serializer';

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
  ): Promise<ResponseProductDto> {
    const created = this.productRepository.create(createProductDto);
    created.firm = await this.firmService.findBySlugAndUserIdOrFail(
      firmSlug,
      userId,
    );

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
      removeVariationsOriginals();

      const variationsDto = createProductDto.variations;
      const variationsDb =
        await this.variationsService.findAllByUserIdAndFirmSlugOrFail(
          userId,
          firmSlug,
        );

      const variationsValuesDb: VariationValue[] = [];

      // variations values
      variationsDb.forEach((variation) => {
        variation.variationsValues.forEach((vv) => {
          vv.variation = variation;
          variationsValuesDb.push(vv);
        });
      });

      variationsDto.forEach((vDto) => {
        if (vDto.variationsValues) {
          vDto.variationsValues.forEach((vvDto) => {
            const variationValue: VariationValue = variationsValuesDb.find(
              (vv) => vv.id === vvDto.id,
            );

            const productVariation: ProductVariation = new ProductVariation();

            if (variationValue) {
              productVariation.variation = variationsDb.find(
                (v) => v.id === vDto.id,
              );
              productVariation.variationValue = variationValue;
              created.variations.push(productVariation);
            }
          });
        } else {
          const productVariation: ProductVariation = new ProductVariation();
          productVariation.variation = variationsDb.find(
            (v) => v.id === vDto.id,
          );
          created.variations.push(productVariation);
        }
      });
    }

    try {
      const result = await this.productRepository.save(created);
      return productSerializer.serializer(result);
    } catch (err) {
      CatarinaException.QueryFailedErrorException(err);
    }

    function removeVariationsOriginals() {
      for (let i = 0; i <= created.variations.length; i++) {
        created.variations.pop();
      }
    }
  }

  async findAllByUserIdAndFirmSlug(
    userId: number,
    firmSlug: string,
  ): Promise<ResponseProductDto[]> {
    const firm = await this.firmService.findBySlugAndUserIdOrFail(
      firmSlug,
      userId,
    );

    const products = await this.productRepository.find({
      relations: {
        categories: true,
        variations: {
          variation: true,
          variationValue: true,
        },
      },
      where: {
        firm: {
          id: firm.id,
        },
      },
    });
    return productSerializer.serializers(products);
  }

  async findOne(
    slug: string,
    firmSlug: string,
    userId: number,
  ): Promise<ResponseProductDto> {
    try {
      const firm = await this.firmService.findBySlugAndUserIdOrFail(
        firmSlug,
        userId,
      );
      const product = await this.productRepository.findOneOrFail({
        relations: {
          categories: true,
          variations: {
            variation: true,
            variationValue: true,
          },
        },
        where: {
          slug,
          firm: {
            id: firm.id,
          },
        },
      });
      return productSerializer.serializer(product);
    } catch (err) {
      CatarinaException.EntityNotFoundException('Product', err);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number, firmSlug: string, userId: number) {
    const firm = await this.firmService.findBySlugAndUserIdOrFail(
      firmSlug,
      userId,
    );
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
