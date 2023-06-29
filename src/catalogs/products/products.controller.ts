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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CatarinaConstants } from '../../helpers/constants';

@UseGuards(JwtAuthGuard)
@ApiTags('catalog.products')
@Controller('api/v1/catalogs/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Req() req, @Body() createProductDto: CreateProductDto) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    const products = await this.productsService.create(
      createProductDto,
      firm,
      userId,
    );
    return products;
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.productsService.findAllByUserIdAndFirmSlug(userId, firm);
  }

  @Get(':slug')
  findOneBySlug(@Req() req, @Param('slug') slug: string) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.productsService.findOne(slug, firm, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const firm = req.headers[CatarinaConstants.FIRM_SLUG];
    return this.productsService.remove(+id, firm, userId);
  }
}
