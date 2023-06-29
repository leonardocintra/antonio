import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { Usuario } from './usuario.entity';
import { Category } from './category.entity';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { BaseTable } from './commons/baseTable';

@Entity()
export class Firm extends BaseTable {
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
}
