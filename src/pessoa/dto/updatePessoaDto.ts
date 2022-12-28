import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { SexoEnum } from '../enum/sexoEnum';

export class UpdatePessoaDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsNotEmpty()
  @MaxLength(100)
  sobrenome: string;

  @IsNotEmpty()
  @MaxLength(14)
  @MinLength(11)
  cpfCnpj: string;

  @IsOptional()
  @MaxLength(1)
  @IsEnum(SexoEnum)
  sexo: string;

  @IsEmail()
  email: string;

  ativo: boolean;
}
