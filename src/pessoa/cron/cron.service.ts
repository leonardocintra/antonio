import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Util } from '../../../test/utils';
import { CreatePessoaDto } from '../dto/createPessoaDto';
import { Pessoa } from '../entity/pessoa.entity';
import { SexoEnum } from '../enum/sexoEnum';
import { PessoaService } from '../pessoa.service';

const BASE_URL = 'http://localhost:3000/api/v1/pessoa';
const HEADERS = {
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZmJiZWFhYi1mYjFjLTRlM2ItYmRhNC0yYTQzMTU0NTA5ZGYiLCJlbWFpbCI6Imxlb25hcmRvLm5jaW50cmFAb3V0bG9vay5jb20iLCJpYXQiOjE2NzI5NTEzODQsImV4cCI6MTY3Mjk1NjM4NH0.bBlJ1ckL56nroLxv310NfjxBmd43Y3Bz-7XOqWx-Ys0',
  },
};

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly pessoaService: PessoaService) { }

  async deletePessoaTeste() {
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'Gerando pessoas em testes' })
  async createPessoaTeste() {
    const pessoa = this.getPessoaMock();
    const response = await this.httpService.axiosRef.post<Pessoa>(BASE_URL, pessoa, HEADERS);
    if (response.status !== HttpStatus.CREATED) {
      this.logger.error(response);
    }
    const pessoaId = response.data.id;
    this.logger.log('..POST OK: ' + pessoaId);
    await this.deletePessoa(pessoaId);
  }

  private async deletePessoa(pessoaId: string) {
    const response = await this.httpService.axiosRef.delete(BASE_URL + `/${pessoaId}`, HEADERS);
    if (response.status === HttpStatus.NO_CONTENT) {
      this.logger.log('DELETE OK: ' + pessoaId);
    } else {
      this.logger.error(response);
    }
  }

  private getPessoaMock(): CreatePessoaDto {
    return {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
      cpfCnpj: Util.getRandomCPF(),
      sexo: SexoEnum.FEMININO,
      email: faker.internet.email(
        faker.name.firstName(),
        faker.name.lastName(),
        'catarina.fakerjs.dev',
      ),
      enderecos: [
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: faker.address.stateAbbr(),
          complemento: 'CASA',
          referencia: faker.music.genre(),
          endereco: faker.address.street(),
          numero: faker.address.buildingNumber(),
        },
        {
          bairro: faker.address.street(),
          cep: faker.address.zipCode('########'),
          cidade: faker.address.cityName(),
          uf: faker.address.stateAbbr(),
          complemento: faker.animal.dog(),
          referencia: faker.music.genre(),
          endereco: faker.address.street(),
          numero: faker.address.buildingNumber(),
        },
      ],
      telefones: [
        {
          area: faker.phone.number('##'),
          numero: faker.phone.number('########'),
          tipo: 'mobile',
        },
      ],
    };
  }
}
