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
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { ApiTags } from '@nestjs/swagger';
import { CatarinaConstants } from '../../helpers/constants';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { VariationsService } from './variations.service';
import { CreateVariationsValueDto } from './dto/create-variations-value.dto';

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
  findAll(@Req() req) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.variationsService.findAllByUserIdAndFirmSlugOrFail(userId, firm);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.variationsService.findOneVariation(+id, userId, firm);
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

  @Post(':id/values')
  async createValues(
    @Req() req,
    @Param('id') id: number,
    @Body() createVariationsValueDto: CreateVariationsValueDto,
  ) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.variationsService.createVariationValues(
      id,
      createVariationsValueDto,
      userId,
      firm,
    );
  }

  @Delete(':variationId/values/:variationValueId')
  async removeValues(
    @Req() req,
    @Param('variationId') variationId: number,
    @Param('variationValueId') variationValueId: number,
  ) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.variationsService.removeVariationValues(
      variationValueId,
      variationId,
      userId,
      firm,
    );
  }
}
