import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { CatarinaException } from '../helpers/http.exception';

@Controller('api/v1/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.usuariosService.create(createUsuarioDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        CatarinaException.DuplicateEntryException(err);
      } else {
        throw err;
      }
    }
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Get('/username/:username')
  async findOneByUsername(@Param('username') username: string) {
    try {
      return await this.usuariosService.findOneByUsername(username);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        CatarinaException.EntityNotFoundException('username', err)
      } else {
        throw err;
      }
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
