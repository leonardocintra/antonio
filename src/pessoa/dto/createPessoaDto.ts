import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SexoEnum } from '../enum/sexoEnum';

export class CreatePessoaDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  nome: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  sobrenome: string;

  @IsNotEmpty()
  @MaxLength(14)
  @MinLength(11)
  @ApiProperty()
  cpfCnpj: string;

  @ApiPropertyOptional({ default: 'm' })
  sexo: SexoEnum;

  @IsEmail()
  @ApiProperty()
  email: string;
}
