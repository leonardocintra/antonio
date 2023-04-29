import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VariationsValuesService } from './variations-values.service';
import { CreateVariationsValueDto } from './dto/create-variations-value.dto';
import { UpdateVariationsValueDto } from './dto/update-variations-value.dto';

@Controller('api/v1/catalogs/variations/values')
export class VariationsValuesController {
  constructor(
    private readonly variationsValuesService: VariationsValuesService,
  ) {}

  @Post()
  create(@Body() createVariationsValueDto: CreateVariationsValueDto) {
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
