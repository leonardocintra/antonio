import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TelefoneTipo } from '../pessoa/telefone/enum/telefoneTipoEnum';
import { Pessoa } from './pessoa.entity';
import { BaseTable } from './commons/baseTable';

@Entity()
export class Telefone extends BaseTable {
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

  @ManyToOne(() => Pessoa, (pessoa: Pessoa) => pessoa.telefones, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  pessoa: Pessoa;

  constructor(telefone?: Partial<Telefone>) {
    super();
    this.id = telefone?.id;
    this.area = telefone?.area;
    this.numero = telefone?.numero;
    this.tipo = telefone?.tipo;
    this.ativo = telefone?.ativo;
  }
}
