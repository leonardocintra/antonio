import { OmitType } from '@nestjs/swagger';
import { Pessoa } from '../../entities/pessoa.entity';

export class IndexPessoaSwagger extends OmitType(Pessoa, ['ativo']) {}
