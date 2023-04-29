import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity()
export class Firm {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 300, nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  // cadastrar dados juridicos da empresa/loja
  @OneToOne(() => Pessoa, { nullable: false })
  @JoinColumn()
  pessoa: Pessoa;

  // usaurio que cadastrou / responsavel
  @ManyToOne(() => Usuario, (user) => user.firms)
  @JoinColumn()
  usuarioResponsavel: Usuario;

  // usuarios que controlam e/ou administram essa loja/empresa
  // usuarios: Usuario[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updateddAt: string;
}
