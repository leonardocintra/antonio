import { Endereco } from '../../src/pessoa/endereco/entities/endereco.entity';

export const enderecoEntityListMock: Endereco[] = [
  new Endereco({
    id: 1,
    ativo: true,
    bairro: 'Centro',
    cep: '14444444',
    cidade: 'Ibiraci',
    uf: 'MG',
    endereco: 'Rua das flores amarelas',
    numero: '133',
    referencia: null,
    complemento: null,
    ibge: 0,
    validado: false,
    validado_em: null,
    campo_invalido: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  }),
];
