import { Injectable } from '@nestjs/common';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { Variation } from './entities/variation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirmsService } from '../../firms/firms.service';
import { CatarinaException } from '../../helpers/http.exception';
import { CreateVariationsValueDto } from './dto/create-variations-value.dto';
import { VariationsValue } from './entities/variations-value.entity';

@Injectable()
export class VariationsService {
  constructor(
    @InjectRepository(Variation)
    private readonly variationRepository: Repository<Variation>,
    @InjectRepository(VariationsValue)
    private readonly variationsValuesRepository: Repository<VariationsValue>,
    private readonly firmService: FirmsService,
  ) {}

  async create(
    createVariationDto: CreateVariationDto,
    userId: number,
    firmSlug: string,
  ): Promise<Variation> {
    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
    try {
      const variation = this.variationRepository.create(createVariationDto);
      variation.firm = firm;
      return await this.variationRepository.save(variation);
    } catch (err) {
      CatarinaException.QueryFailedErrorException(err);
    }
  }

  async findAllByUserIdAndFirmSlug(
    userId: number,
    firmSlug: string,
  ): Promise<Variation[]> {
    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);

    return await this.variationRepository.find({
      where: {
        firm: {
          id: firm.id,
        },
      },
    });
  }

  async findOne(id: number, userId: number, firmSlug: string) {
    const firm = await this.firmService.findBySlugAndUserId(firmSlug, userId);
    return await this.variationRepository.findOneOrFail({
      where: {
        id,
        firm: {
          id: firm.id,
        },
      },
    });
  }

  update(id: number, updateVariationDto: UpdateVariationDto) {
    return `This action updates a #${id} variation`;
  }

  remove(id: number) {
    return `This action removes a #${id} variation`;
  }

  async createVariationValues(
    variationId: number,
    createVariationsValueDto: CreateVariationsValueDto,
    userId: number,
    firmSlug: string,
  ) {
    try {
      const variation = await this.findOne(variationId, userId, firmSlug);
      
      if (variation) {
        const created = this.variationsValuesRepository.create(
          createVariationsValueDto,
        );
        created.variation = variation;
        return this.variationsValuesRepository.save(created);
      } else {
        throw new Error();
      }
    } catch (err) {
      CatarinaException.EntityNotFoundException('Variation', err);
    }
  }
}
