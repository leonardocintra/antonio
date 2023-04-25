import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ViaCep } from '../dto/viacep.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ViacepService {
  constructor(private readonly httpService: HttpService) {}

  async findByCep(cep: string): Promise<ViaCep> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`),
    );
    return data;
  }
}
