import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreatePessoaDto } from '../../pessoa/dto/create-pessoa.dto';
import { Type } from 'class-transformer';

export class CreateFirmDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description: string;

  @ValidateNested()
  @Type(() => CreatePessoaDto)
  pessoa: CreatePessoaDto;
}
