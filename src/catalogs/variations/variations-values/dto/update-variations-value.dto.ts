import { PartialType } from '@nestjs/swagger';
import { CreateVariationsValueDto } from './create-variations-value.dto';

export class UpdateVariationsValueDto extends PartialType(CreateVariationsValueDto) {}
