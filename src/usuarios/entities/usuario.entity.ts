import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @BeforeInsert()
  criptografarSenha() {
    this.password = hashSync(this.password, 10);
  }

  constructor(user?: Partial<Usuario>) {
    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.email = user?.email;
    this.ativo = user?.ativo;
    this.createdAt = user?.createdAt;
    this.updateddAt = user?.updateddAt;
    this.deletedAt = user?.deletedAt;
  }
}
