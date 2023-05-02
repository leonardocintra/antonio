import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Category } from '../../catalogs/categories/entities/category.entity';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { type } from 'os';

@Entity()
export class Firm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 300, nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ length: 100, nullable: false, unique: true })
  slug: string;

  // cadastrar dados juridicos da empresa/loja
  @OneToOne(() => Pessoa, { nullable: false })
  @JoinColumn()
  pessoa: Pessoa;

  @ManyToMany(() => Usuario)
  @JoinTable()
  usuarios: Usuario[];

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn()
  usuarioResponsavel: Usuario;

  @OneToMany(() => Category, (category) => category.firm)
  categories: Category[];

  @BeforeInsert()
  setSlug() {
    const word = slugify(this.name, {
      lower: true,
    });
    this.slug = word + '-' + uuidv4();
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updateddAt: string;
}
