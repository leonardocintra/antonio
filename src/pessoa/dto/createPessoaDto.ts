import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePessoaDto {
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

  sexo: string;

  @IsEmail()
  email: string;
}
