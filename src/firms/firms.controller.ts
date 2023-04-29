import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Controller('firms')
export class FirmsController {
  constructor(private readonly firmsService: FirmsService) {}

  @Post()
  create(@Body() createFirmDto: CreateFirmDto) {
    return this.firmsService.create(createFirmDto);
  }

  @Get()
  findAll() {
    return this.firmsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firmsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFirmDto: UpdateFirmDto) {
    return this.firmsService.update(+id, updateFirmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.firmsService.remove(+id);
  }
}
