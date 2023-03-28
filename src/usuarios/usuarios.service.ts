import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(novoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string): Promise<Usuario> {
    return await this.usuarioRepository.findOneByOrFail({ id });
  }

  async findOneByUsername(username: string): Promise<Usuario> {
    return await this.usuarioRepository.findOneByOrFail({ username });
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
}
