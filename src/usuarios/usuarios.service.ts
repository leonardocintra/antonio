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

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioRepository.save(
      this.usuarioRepository.create(createUsuarioDto),
    );
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string) {
    return await this.usuarioRepository.findOneByOrFail({ id });
  }

  async findOneByUsername(username: string) {
    return await this.usuarioRepository.findOneByOrFail({ username });
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(uuid: string) {
    return `This action removes a #${uuid} usuario`;
  }
}
