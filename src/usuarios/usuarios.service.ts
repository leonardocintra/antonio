import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuarioRepository.save(
      this.usuarioRepository.create(createUsuarioDto),
    );
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string): Promise<Usuario> {
    return await this.findByParam({ id });
  }

  async findOneByUsername(username: string): Promise<Usuario> {
    return await this.findByParam({ username });
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);
    return await this.usuarioRepository.save(
      this.usuarioRepository.merge(usuario, updateUsuarioDto),
    );
  }

  async remove(uuid: string): Promise<void> {
    await this.usuarioRepository.delete(uuid);
  }

  private async findByParam(where: {}): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOneByOrFail(where);
    } catch (error) {
      throw new NotFoundException('Usuario não encontrado.', error.message);
    }
  }
}
