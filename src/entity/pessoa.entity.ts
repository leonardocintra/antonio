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
import { ApiProperty } from '@nestjs/swagger';
import { Telefone } from './telefone.entity';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 100 })
  @ApiProperty()
  nome: string;

  @Column({ length: 100 })
  @ApiProperty()
  sobrenome: string;

  @Column({
    unique: true,
    length: 14,
  })
  @ApiProperty()
  cpfCnpj: string;

  @Column({ type: 'enum', enum: SexoEnum, default: SexoEnum.MASCULINO })
  @ApiProperty()
  sexo: string;

  @Column({
    unique: true,
  })
  @ApiProperty()
  email: string;

  @Column({ default: true })
  @ApiProperty()
  ativo: boolean;

  @OneToMany(() => Endereco, (endereco) => endereco.pessoa)
  @ApiProperty()
  enderecos: Endereco[];

  @OneToMany(() => Telefone, (telefone) => telefone.pessoa)
  @ApiProperty()
  telefones: Telefone[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updateddAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
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
