import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EstadosBrasileiros } from '../enum/estadosBrasileiros.enum';
import { IsNull } from 'typeorm';

export class CreateEnderecoDto {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(8)
  @MinLength(8)
  @ApiProperty()
  cep: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  endereco: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @ApiProperty()
  numero: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EstadosBrasileiros)
  @MaxLength(2)
  @MinLength(2)
  @ApiProperty()
  uf: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  referencia: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  complemento: string;
}
