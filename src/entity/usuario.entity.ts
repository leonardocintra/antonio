import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updateddAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
  deletedAt: string;

  constructor(usuario?: Partial<Usuario>) {
    this.id = usuario?.id;
    this.username = usuario?.username;
    this.password = usuario?.password;
    this.email = usuario?.email;
    this.ativo = usuario?.ativo;
    this.createdAt = usuario?.createdAt;
    this.updateddAt = usuario?.updateddAt;
    this.deletedAt = usuario?.deletedAt;
  }
}
