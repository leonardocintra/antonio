import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Firm } from '../../firms/entities/firm.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

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

  // @ManyToMany(() => Firm, (firm) => firm.usuarios)
  // @JoinTable()
  // firms: Firm[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updateddAt: string;

  @BeforeInsert()
  criptografarSenha() {
    this.password = hashSync(this.password, 10);
  }

  constructor(usuario?: Partial<Usuario>) {
    this.id = usuario?.id;
    this.username = usuario?.username;
    this.password = usuario?.password;
    this.email = usuario?.email;
    this.ativo = usuario?.ativo;
    //this.firms = usuario?.firms;
    this.createdAt = usuario?.createdAt;
    this.updateddAt = usuario?.updateddAt;
  }
}
