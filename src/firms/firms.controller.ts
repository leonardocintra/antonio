import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FirmsService } from './firms.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CatarinaException } from '../helpers/http.exception';

@UseGuards(JwtAuthGuard)
@ApiTags('firms')
@Controller('api/v1/firms')
export class FirmsController {
  constructor(private readonly firmsService: FirmsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma loja/empresa/firma, etc' })
  @ApiResponse({ status: 201, description: 'Firma cadastrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos no cadastro' })
  create(@Req() req, @Body() createFirmDto: CreateFirmDto) {
    try {
      const userUuid = req.user.id;
      return this.firmsService.create(createFirmDto, userUuid);
    } catch (error) {
      CatarinaException.QueryFailedErrorException(error);
    }
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.firmsService.findAllByUserId(userId);
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
