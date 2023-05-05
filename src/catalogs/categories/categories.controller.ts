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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('categories')
@Controller('api/v1/catalogs/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  
  @Post()
  create(@Req() req, @Body() createCategoryDto: CreateCategoryDto) {
    const userId = req.user.id;
    return this.categoriesService.create(createCategoryDto, userId);
  }
  
  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    const firm = req.headers['firm-slug'];
    return this.categoriesService.findAllByUserIdAndFirmSlug(userId, firm);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
