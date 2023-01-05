import { OmitType } from '@nestjs/swagger';
import { Pessoa } from '../entity/pessoa.entity';

export class IndexPessoaSwagger extends OmitType(Pessoa, [
  'ativo',
  'createdAt',
  'updateddAt',
]) {}
