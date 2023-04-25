import { Injectable } from '@nestjs/common';
import { CreateVariationsValueDto } from './dto/create-variations-value.dto';
import { UpdateVariationsValueDto } from './dto/update-variations-value.dto';

@Injectable()
export class VariationsValuesService {
  create(createVariationsValueDto: CreateVariationsValueDto) {
    return 'This action adds a new variationsValue';
  }

  findAll() {
    return `This action returns all variationsValues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variationsValue`;
  }

  update(id: number, updateVariationsValueDto: UpdateVariationsValueDto) {
    return `This action updates a #${id} variationsValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} variationsValue`;
  }
}
