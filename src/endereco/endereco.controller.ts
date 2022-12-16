import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';

@Controller('api/v1/endereco')
@ApiTags('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Get(':id')
  async getEnderecoById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.enderecoService.findByUuid(id);
  }
}
