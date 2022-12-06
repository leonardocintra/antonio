import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';
import { Pessoa } from '../../src/entity/pessoa.entity';

export const pessoaEntityMockUpdated: Pessoa = new Pessoa({
  id: '2d2a5822-5424-4030-9ab7-3a70a52d0843',
  nome: 'Luisa',
  sobrenome: 'Cintra',
  cpfCnpj: '44743873410',
  sexo: SexoEnum.FEMININO,
  email: 'Luisa.ncintra@outlook.com',
});

export const pessoaEntityListMock: Pessoa[] = [
  new Pessoa({
    id: '26c971c2-b831-4df0-9947-319900a92064',
    nome: 'Leonardo',
    sobrenome: 'Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.MASCULINO,
    email: 'leonardo.ncintra@outlook.com',
  }),
  new Pessoa({
    id: '2d2a5822-5424-4030-9ab7-3a70a52d0843',
    nome: 'Juliana',
    sobrenome: 'Cintra',
    cpfCnpj: '56655835453',
    sexo: SexoEnum.FEMININO,
    email: 'juliana.ncintra@outlook.com',
  }),
];
