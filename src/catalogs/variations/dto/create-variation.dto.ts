import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateVariationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
