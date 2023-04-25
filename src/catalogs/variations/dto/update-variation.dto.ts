import { PartialType } from '@nestjs/swagger';
import { CreateVariationDto } from './create-variation.dto';

export class UpdateVariationDto extends PartialType(CreateVariationDto) {}
