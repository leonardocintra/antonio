import {
  IsArray,
  IsDecimal,
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

  @IsArray()
  @IsOptional()
  categories: ProductCategoriesDto[];
}
