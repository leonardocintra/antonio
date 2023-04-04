import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EstadosBrasileiros } from '../enum/estadosBrasileiros.enum';

export class CreateEnderecoDto {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(8)
  @MinLength(8)
  @ApiProperty()
  cep: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  endereco: string;

  @IsNotEmpty()
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

  @MaxLength(100)
  @ApiProperty()
  referencia: string;

  @MaxLength(50)
  @ApiProperty()
  complemento: string;
}
