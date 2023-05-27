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
import { VariationsValuesService } from './variations-values.service';
import { CreateVariationsValueDto } from './dto/create-variations-value.dto';
import { UpdateVariationsValueDto } from './dto/update-variations-value.dto';
import { ApiTags } from '@nestjs/swagger';
import { CatarinaConstants } from '../../../helpers/constants';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@ApiTags('catalog.variations-values')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/catalogs/variations/values')
export class VariationsValuesController {
  constructor(
    private readonly variationsValuesService: VariationsValuesService,
  ) {}

  @Post()
  create(
    @Req() req,
    @Body() createVariationsValueDto: CreateVariationsValueDto,
  ) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.variationsValuesService.create(createVariationsValueDto);
  }

  @Get()
  findAll() {
    return this.variationsValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variationsValuesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationsValueDto: UpdateVariationsValueDto,
  ) {
    return this.variationsValuesService.update(+id, updateVariationsValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variationsValuesService.remove(+id);
  }
}
