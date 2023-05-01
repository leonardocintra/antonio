import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PessoaService } from '../pessoa/pessoa.service';

@Injectable()
export class FirmsService {
  constructor(
    @InjectRepository(Firm)
    private readonly firmRepository: Repository<Firm>,
    private readonly pessoaService: PessoaService,
    private readonly usuarioService: UsuariosService,
  ) {}

  async create(createFirmDto: CreateFirmDto, userUuid: string): Promise<Firm> {
    const pessoa = await this.pessoaService.create(
      createFirmDto.pessoa,
      userUuid,
    );
    const firmCreated = await this.firmRepository.create(createFirmDto);
    firmCreated.usuarioResponsavel = pessoa.usuarioInsert;
    firmCreated.pessoa = pessoa;
    return await this.firmRepository.save(firmCreated);
  }

  findAll() {
    return `This action returns all firms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firm`;
  }

  update(id: number, updateFirmDto: UpdateFirmDto) {
    return `This action updates a #${id} firm`;
  }

  async remove(id: number) {
    return await this.firmRepository.delete(id);
  }
}
