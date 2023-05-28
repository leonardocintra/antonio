import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsHexColor,
  IsOptional,
} from 'class-validator';

export class CreateVariationsValueDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  value: string;

  @IsHexColor()
  @IsOptional()
  color: string;
}
