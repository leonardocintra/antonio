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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/usuarios')
@ApiTags('usuario')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo usuario' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.usuariosService.create(createUsuarioDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        CatarinaException.QueryFailedErrorException(err);
      } else {
        throw err;
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas os usuarios cadastrados' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuario pelo seu id' })
  findOne(@Param('id') id: number) {
    return this.usuariosService.findOne(id);
  }

  @Get('/username/:username')
  @ApiOperation({ summary: 'Busca um usurio pelo username' })
  async findOneByUsername(@Param('username') username: string) {
    try {
      return await this.usuariosService.findOneByUsername(username);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        CatarinaException.EntityNotFoundException('username', err);
      } else {
        throw err;
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuario pelo seu id' })
  update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuario pelo seu id' })
  remove(@Param('id') id: number) {
    return this.usuariosService.remove(id);
  }
}
