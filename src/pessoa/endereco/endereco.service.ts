import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endereco } from './entities/endereco.entity';
import { Pessoa } from '../entities/pessoa.entity';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { ViacepService } from './viacep/viacep.service';
import { compareTwoStrings } from 'string-similarity';

@Injectable()
export class EnderecoService {
  private readonly logger = new Logger(EnderecoService.name);

  constructor(
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,
    private readonly viaCepService: ViacepService,
  ) {}

  async create(endereco: CreateEnderecoDto, pessoa: Pessoa): Promise<Endereco> {
    const enderecoCreated = this.enderecoRepository.create(endereco);
    enderecoCreated.pessoa = pessoa;
    return await this.enderecoRepository.save(enderecoCreated);
  }

  async findByUuid({ uuid }: { uuid: string }): Promise<Endereco> {
    try {
      return await this.enderecoRepository.findOneByOrFail({
        id: uuid,
      });
    } catch (error) {
      throw new NotFoundException('Endereço', error.message);
    }
  }

  async findByPessoa({ pessoa }: { pessoa: Pessoa }): Promise<Endereco[]> {
    const enderecos = await this.enderecoRepository.find({
      where: {
        pessoa: {
          id: pessoa.id,
        },
      },
    });
    return enderecos;
  }

  async validate({ id }: { id: string }): Promise<void> {
    const validarViaEnderecoViaCep =
      process.env.VALIDAR_ENDERECO_VIA_CEP === 'true' ? true : false;

    if (!validarViaEnderecoViaCep) {
      await this.updateInvalidField(
        id,
        `ViaCEP: VALIDACAO DESLIGADA - ${new Date()}`,
      );
      return;
    }

    const endereco = await this.findByUuid({ uuid: id });
    const viacep = await this.viaCepService.findByCep(endereco.cep);

    // TODO: viacep esta retornando "erro" em vez de 404 quando nao encontra um CEP
    if (!viacep.cep) {
      await this.updateInvalidField(
        id,
        `ViaCEP: CEP não encontrado - ${endereco.cep}`,
      );
      return;
    }

    if (viacep.uf !== endereco.uf) {
      await this.updateInvalidField(id, `ViaCEP: UF diferente  - ${viacep.uf}`);
      return;
    }

    if (compareTwoStrings(viacep.localidade, endereco.cidade) < 0.8) {
      await this.updateInvalidField(
        id,
        `ViaCEP: endereço diferente. API: ${viacep.localidade}`,
      );
      return;
    }

    if (
      viacep.bairro !== '' &&
      compareTwoStrings(viacep.bairro, endereco.bairro) < 0.7
    ) {
      await this.updateInvalidField(
        id,
        `ViaCEP: bairro diferente. API: ${viacep.bairro}`,
      );
      return;
    }

    this.enderecoRepository.update(id, {
      ibge: parseInt(viacep.ibge, 10),
      validado: true,
      validado_em: new Date(),
      campo_invalido: null,
    });
  }

  private async updateInvalidField(id: string, invalidField: string) {
    await this.enderecoRepository.update(id, {
      campo_invalido: invalidField,
    });
  }
}
