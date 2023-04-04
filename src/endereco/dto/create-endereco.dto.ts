import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEnderecoDto {
  @IsNotEmpty()
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
  @MaxLength(100)
  @ApiProperty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  cidade: string;

  @IsNotEmpty()
  @MaxLength(2)
  @MinLength(2)
  @ApiProperty()
  uf: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  referencia: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  complemento: string;
}
