import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { TelefoneTipo } from '../enum/telefoneTipoEnum';

export class CreateTefoneDto {
  @IsNotEmpty()
  @MaxLength(2)
  @MinLength(2)
  @ApiProperty()
  area: string;

  @IsNotEmpty()
  @MaxLength(9)
  @MinLength(7)
  @ApiProperty()
  numero: string;

  @IsNotEmpty()
  @MaxLength(10)
  @IsEnum(TelefoneTipo)
  @ApiProperty()
  tipo: string;
}
