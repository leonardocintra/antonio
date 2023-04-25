import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pessoa } from '../../entities/pessoa.entity';

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(endereco?: Partial<Endereco>) {
    this.id = endereco?.id;
    this.numero = endereco?.numero;
    this.endereco = endereco?.endereco;
    this.bairro = endereco?.bairro;
    this.cidade = endereco?.cidade;
    this.uf = endereco?.uf;
    this.ativo = endereco?.ativo;
    this.referencia = endereco?.referencia;
    this.complemento = endereco?.complemento;
    this.createdAt = endereco?.createdAt;
    this.updatedAt = endereco?.updatedAt;
    this.deletedAt = endereco?.deletedAt;
  }
}
