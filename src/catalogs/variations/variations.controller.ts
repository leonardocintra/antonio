import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariationsService } from './variations.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';

@Controller('variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsService) {}

  @Post()
  create(@Body() createVariationDto: CreateVariationDto) {
    return this.variationsService.create(createVariationDto);
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
  update(@Param('id') id: string, @Body() updateVariationDto: UpdateVariationDto) {
    return this.variationsService.update(+id, updateVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variationsService.remove(+id);
  }
}
