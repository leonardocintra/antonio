import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { MessagesHelper } from '../../helpers/messages.helper';
import { RegExHelper } from '../../helpers/regex.helper';

export class CreateUsuarioDto {
  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  username: string;

  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty()
  @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
