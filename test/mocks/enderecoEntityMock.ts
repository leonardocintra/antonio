import { Endereco } from '../../src/pessoa/endereco/entities/endereco.entity';

export const enderecoEntityListMock: Endereco[] = [
  new Endereco({
    ativo: true,
    bairro: 'Centro',
    cep: '14444444',
    cidade: 'Ibiraci',
    uf: 'MG',
    endereco: 'Rua das flores amarelas',
    id: '26c971c2-b831-4df0-9947-319900a92064',
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
