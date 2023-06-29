import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';
import { Pessoa } from '../../src/entities/pessoa.entity';

export const pessoaEntityMockUpdated: Pessoa = new Pessoa({
  id: 3,
  nome: 'Luisa',
  cpfCnpj: '44743873410',
  sexo: SexoEnum.FEMININO,
  email: 'Luisa.ncintra@outlook.com',
});

export const pessoaEntityListMock: Pessoa[] = [
  new Pessoa({
    id: 1,
    nome: 'Leonardo Nascimento Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.MASCULINO,
    email: 'leonardo.ncintra@outlook.com',
  }),
  new Pessoa({
    id: 2,
    nome: 'Juliana Rosa Rodrigues Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.FEMININO,
    email: 'juliana.ncintra@outlook.com',
  }),
];
