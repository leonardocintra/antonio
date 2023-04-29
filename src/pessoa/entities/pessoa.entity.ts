import { SexoEnum } from '../enum/sexoEnum';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Endereco } from '../endereco/entities/endereco.entity';
import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Telefone } from '../telefone/entities/telefone.entity';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updateddAt: string;

  @BeforeInsert()
  criptografarDados() {
    const salts = 10;
    this.nome = hashSync(this.nome, salts);
  }

  constructor(pessoa?: Partial<Pessoa>) {
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
    this.createdAt = pessoa?.createdAt;
    this.updateddAt = pessoa?.updateddAt;
  }
}
