import { CreatePessoaDto } from '../../src/pessoa/dto/createPessoaDto';
import { UpdatePessoaDto } from '../../src/pessoa/dto/updatePessoaDto';
import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';

export const updatePessoaDtoMock: UpdatePessoaDto = {
  id: '2d2a5822-5424-4030-9ab7-3a70a52d0843',
  nome: 'Luisa',
  sobrenome: 'Cintra',
  cpfCnpj: '44743873410',
  sexo: SexoEnum.FEMININO,
  email: 'Luisa.ncintra@outlook.com',
  ativo: true,
};

export const createPessoaDtoMock: CreatePessoaDto = {
  nome: 'Juliana',
  sobrenome: 'Cintra',
  cpfCnpj: '56655835453',
  sexo: SexoEnum.FEMININO,
  email: 'juliana.ncintra@outlook.com',
  enderecos: [],
};
