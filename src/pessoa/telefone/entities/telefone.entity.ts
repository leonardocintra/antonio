import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TelefoneTipo } from '../enum/telefoneTipoEnum';
import { Pessoa } from '../../entities/pessoa.entity';

@Entity()
export class Telefone {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty()
  id: string;

  @Column({ length: 3 })
  @ApiProperty()
  area: string;

  @Column({ length: 9 })
  @ApiProperty()
  numero: string;

  @Column({
    type: 'enum',
    enum: TelefoneTipo,
    default: TelefoneTipo.MOBILE,
  })
  @ApiProperty()
  tipo: string;

  @Column({ default: true })
  @ApiProperty()
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updateddAt: string;

  @ManyToOne(() => Pessoa, (pessoa: Pessoa) => pessoa.telefones, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  pessoa: Pessoa;

  constructor(telefone?: Partial<Telefone>) {
    this.id = telefone?.id;
    this.area = telefone?.area;
    this.numero = telefone?.numero;
    this.tipo = telefone?.tipo;
    this.ativo = telefone?.ativo;
    this.createdAt = telefone?.createdAt;
    this.updateddAt = telefone?.updateddAt;
  }
}
