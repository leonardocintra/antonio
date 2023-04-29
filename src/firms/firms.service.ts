import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Injectable()
export class FirmsService {
  create(createFirmDto: CreateFirmDto) {
    return 'This action adds a new firm';
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

  remove(id: number) {
    return `This action removes a #${id} firm`;
  }
}
