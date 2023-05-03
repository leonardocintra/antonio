import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';
import { Repository } from 'typeorm';
import { PessoaService } from '../pessoa/pessoa.service';
import { CatarinaException } from '../helpers/http.exception';

@Injectable()
export class FirmsService {
  constructor(
    @InjectRepository(Firm)
    private readonly firmRepository: Repository<Firm>,
    private readonly pessoaService: PessoaService,
  ) {}

  async create(createFirmDto: CreateFirmDto, userId: number): Promise<Firm> {
    const pessoa = await this.pessoaService.create(
      createFirmDto.pessoa,
      userId,
    );
    const firmCreated = await this.firmRepository.create(createFirmDto);
    firmCreated.usuarioResponsavel = pessoa.usuarioInsert;
    firmCreated.usuarios = [pessoa.usuarioInsert];
    firmCreated.pessoa = pessoa;
    return await this.firmRepository.save(firmCreated);
  }

  async findAllByUserId(id: number): Promise<Firm[]> {
    try {
      const firms = await this.firmRepository
        .createQueryBuilder('firm')
        .leftJoinAndSelect('firm.usuarios', 'usuario')
        .where('usuario.id = :id', { id })
        .getMany();
      return firms;
    } catch (error) {
      CatarinaException.QueryFailedErrorException(error);
    }
  }

  async findOne(id: number) {
    return await this.firmRepository.findOneByOrFail({ id });
  }

  update(id: number, updateFirmDto: UpdateFirmDto) {
    return `This action updates a #${id} firm`;
  }

  async remove(id: number) {
    return await this.firmRepository.delete(id);
  }
}
