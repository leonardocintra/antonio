import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VariationsService } from './variations.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { ApiTags } from '@nestjs/swagger';
import { CatarinaConstants } from '../../helpers/constants';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('catalog.variations')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/catalogs/variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsService) {}

  @Post()
  async create(@Req() req, @Body() createVariationDto: CreateVariationDto) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.variationsService.create(createVariationDto, userId, firm);
  }

  @Get()
  findAll() {
    return this.variationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationDto: UpdateVariationDto,
  ) {
    return this.variationsService.update(+id, updateVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variationsService.remove(+id);
  }
}
