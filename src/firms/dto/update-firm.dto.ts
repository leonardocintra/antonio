import { PartialType } from '@nestjs/swagger';
import { CreateFirmDto } from './create-firm.dto';

export class UpdateFirmDto extends PartialType(CreateFirmDto) {}
