import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from './commons/baseTable';

@Entity()
export class Usuario extends BaseTable {
  @Column({ length: 100, unique: true })
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({
    unique: true,
  })
  @ApiProperty()
  email: string;

  @Column({ default: true })
  @ApiProperty()
  ativo: boolean;

  @BeforeInsert()
  criptografarSenha() {
    this.password = hashSync(this.password, 10);
  }

  constructor(usuario?: Partial<Usuario>) {
    super();
    this.id = usuario?.id;
    this.username = usuario?.username;
    this.password = usuario?.password;
    this.email = usuario?.email;
    this.ativo = usuario?.ativo;
  }
}
