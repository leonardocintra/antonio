import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { BaseTable } from './commons/baseTable';

@Entity()
export class Endereco extends BaseTable {
  @Column({ length: 8 })
  cep: string;

  @Column({ length: 100 })
  endereco: string;

  @Column({ length: 10 })
  numero: string;

  @Column({ length: 100 })
  bairro: string;

  @Column({ length: 100 })
  cidade: string;

  @Column({ length: 2 })
  uf: string;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ length: 50, nullable: true })
  complemento: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: 0 })
  ibge: number;

  @Column({ default: false })
  validado: boolean;

  @Column({ nullable: true })
  validado_em: Date;

  @Column({ nullable: true })
  campo_invalido: string;

  @ManyToOne(() => Pessoa, (pessoa: Pessoa) => pessoa.enderecos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pessoa: Pessoa;

  constructor(endereco?: Partial<Endereco>) {
    super();
    this.id = endereco?.id;
    this.numero = endereco?.numero;
    this.endereco = endereco?.endereco;
    this.bairro = endereco?.bairro;
    this.cidade = endereco?.cidade;
    this.uf = endereco?.uf;
    this.ativo = endereco?.ativo;
    this.referencia = endereco?.referencia;
    this.complemento = endereco?.complemento;
  }
}
