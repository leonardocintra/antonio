import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ViaCep {
  @MaxLength(8)
  @MinLength(8)
  @IsNotEmpty()
  @IsNumberString()
  cep: string;

  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
