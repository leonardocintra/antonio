import { CreatePessoaDto } from '../../src/pessoa/dto/create-pessoa.dto';
import { UpdatePessoaDto } from '../../src/pessoa/dto/update-pessoa.dto';
import { SexoEnum } from '../../src/pessoa/enum/sexoEnum';
import { faker } from '@faker-js/faker';
import { Util } from '../utils';

export const updatePessoaDtoMock: UpdatePessoaDto = {
  id: 3,
  nome: 'Luisa',
  cpfCnpj: '44743873410',
  sexo: SexoEnum.FEMININO,
  email: 'Luisa.ncintra@outlook.com',
  ativo: true,
};

export const createPessoaDtoMock: CreatePessoaDto = {
  nome: faker.name.fullName(),
  cpfCnpj: Util.getRandomCPF(),
  sexo: SexoEnum.FEMININO,
  email: faker.internet.email(),
  enderecos: [],
  telefones: [],
  usuarioInsert: undefined,
  usuarioUpdate: undefined,
};

export const createPessoaEnderecoTelefoneDtoMock: CreatePessoaDto = {
  nome: faker.name.fullName(),
  cpfCnpj: Util.getRandomCPF(),
  sexo: SexoEnum.FEMININO,
  email: faker.internet.email(),
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
      complemento: 'AP 11 Bloco 10',
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
  usuarioInsert: undefined,
  usuarioUpdate: undefined,
};
