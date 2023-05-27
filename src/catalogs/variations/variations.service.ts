import { Injectable } from '@nestjs/common';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { Variation } from './entities/variation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirmsService } from '../../firms/firms.service';

@Injectable()
export class VariationsService {
  constructor(
    @InjectRepository(Variation)
    private readonly productRepository: Repository<Variation>,
    private readonly firmService: FirmsService,
  ) {}

  async create(
    createVariationDto: CreateVariationDto,
    userId: number,
    firmSlug: string,
  ) {
    // const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
    return 'This action adds a new variation';
  }

  findAll() {
    return `This action returns all variations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variation`;
  }

  update(id: number, updateVariationDto: UpdateVariationDto) {
    return `This action updates a #${id} variation`;
  }

  remove(id: number) {
    return `This action removes a #${id} variation`;
  }
}
