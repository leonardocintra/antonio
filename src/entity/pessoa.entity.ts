import { SexoEnum } from '../pessoa/enum/sexoEnum';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Endereco } from './endereco.entity';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  sobrenome: string;

  @Column({
    unique: true,
    length: 14,
  })
  cpfCnpj: string;

  @Column({ type: 'enum', enum: SexoEnum, default: SexoEnum.MASCULINO })
  sexo: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Endereco, (endereco) => endereco.pessoa)
  enderecos: Endereco[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updateddAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  constructor(pessoa?: Partial<Pessoa>) {
    this.id = pessoa?.id;
    this.nome = pessoa?.nome;
    this.sobrenome = pessoa?.sobrenome;
    this.cpfCnpj = pessoa?.cpfCnpj;
    this.sexo = pessoa?.sexo;
    this.email = pessoa?.email;
    this.ativo = pessoa?.ativo;
    this.enderecos = pessoa?.enderecos;
    this.createdAt = pessoa?.createdAt;
    this.updateddAt = pessoa?.updateddAt;
    this.deletedAt = pessoa?.deletedAt;
  }
}
