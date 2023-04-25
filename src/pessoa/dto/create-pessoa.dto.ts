import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateEnderecoDto } from '../endereco/dto/create-endereco.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { SexoEnum } from '../enum/sexoEnum';
import { CreateTefoneDto } from '../telefone/dto/create-telefone.dto';

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
  @IsNumberString()
  cpfCnpj: string;

  @IsOptional()
  @MaxLength(1)
  @IsEnum(SexoEnum)
  sexo: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  usuarioInsert: Usuario;

  usuarioUpdate: Usuario;

  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  @ApiProperty()
  enderecos: CreateEnderecoDto[];

  @ValidateNested()
  @Type(() => CreateTefoneDto)
  @ApiProperty()
  telefones: CreateTefoneDto[];
}
