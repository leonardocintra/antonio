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
export class User {
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

  constructor(user?: Partial<User>) {
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
