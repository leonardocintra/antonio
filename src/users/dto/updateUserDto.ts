import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty()
  username: string;
}
