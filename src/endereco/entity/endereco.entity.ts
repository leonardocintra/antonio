import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Pessoa } from '../../pessoa/entity/pessoa.entity';

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

  @Column({ length: 100 })
  referencia: string;

  @Column({ length: 50 })
  complemento: string;

  @Column({ default: true })
  ativo: boolean;

  @ManyToOne(() => Pessoa, (pessoa) => pessoa.enderecos, {
    nullable: false,
    cascade: true,
  })
  pessoa: Pessoa;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updateddAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

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
    this.updateddAt = endereco?.updateddAt;
    this.deletedAt = endereco?.deletedAt;
  }
}
