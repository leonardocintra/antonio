import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateEnderecoDto } from '../../endereco/dto/createEnderecoDto';
import { CreateTefoneDto } from '../../telefone/dto/createTelefoneDto';
import { User } from '../../users/entity/user.entity';
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

  @IsOptional()
  @MaxLength(1)
  @IsEnum(SexoEnum)
  sexo: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  usuarioInsert: User;

  usuarioUpdate: User;

  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  @ApiProperty()
  enderecos: CreateEnderecoDto[];

  @ValidateNested()
  @Type(() => CreateTefoneDto)
  @ApiProperty()
  telefones: CreateTefoneDto[];
}
