import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

class ProductCategoriesDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  id: number;
}

class ProductVariationsValuesDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  id: number;
}

class ProductVariationsDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  id: number;

  @Type(() => ProductVariationsValuesDto)
  @IsArray()
  @IsOptional()
  variationsValues: ProductVariationsValuesDto[];
}

export class CreateProductDto {
  @IsOptional()
  active: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @IsString()
  @MaxLength(300)
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(1)
  @Max(9999)
  price: number;

  @Type(() => ProductCategoriesDto)
  @IsArray()
  @IsOptional()
  categories: ProductCategoriesDto[];

  @Type(() => ProductVariationsDto)
  @IsArray()
  @IsOptional()
  variations: ProductVariationsDto[];
}
