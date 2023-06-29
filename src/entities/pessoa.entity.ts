import { SexoEnum } from '../pessoa/enum/sexoEnum';

import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Endereco } from './endereco.entity';
import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import { Usuario } from './usuario.entity';
import { Telefone } from './telefone.entity';
import { BaseTable } from './commons/baseTable';

@Entity()
export class Pessoa extends BaseTable {
  @Column({ length: 100 })
  @ApiProperty()
  nome: string;

  @Column({
    unique: true,
    length: 14,
    nullable: false,
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

  @OneToMany(() => Endereco, (endereco: Endereco) => endereco.pessoa, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty()
  @JoinColumn()
  enderecos: Endereco[];

  @OneToMany(() => Telefone, (telefone: Telefone) => telefone.pessoa, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty()
  @JoinColumn()
  telefones: Telefone[];

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuarioInsert: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuarioUpdate: Usuario;

  @BeforeInsert()
  criptografarDados() {
    const salts = 10;
    this.nome = hashSync(this.nome, salts);
  }

  constructor(pessoa?: Partial<Pessoa>) {
    super();
    this.id = pessoa?.id;
    this.nome = pessoa?.nome;
    this.cpfCnpj = pessoa?.cpfCnpj;
    this.sexo = pessoa?.sexo;
    this.email = pessoa?.email;
    this.ativo = pessoa?.ativo;
    this.usuarioInsert = pessoa?.usuarioInsert;
    this.usuarioUpdate = pessoa?.usuarioUpdate;
    this.enderecos = pessoa?.enderecos;
    this.telefones = pessoa?.telefones;
  }
}
