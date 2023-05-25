import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import slugify from 'slugify';
import { Firm } from '../../../firms/entities/firm.entity';

@Entity()
@Unique(['firm', 'slug'])
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Firm, (firm) => firm.categories, { nullable: false })
  firm: Firm;

  @Column({ default: true })
  active: boolean;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 150, nullable: true })
  description: string;

  @Column({ length: 150, nullable: false, unique: false })
  slug: string;

  @Column({ nullable: true, name: 'parent_id' })
  parentId: number;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  setSlug() {
    this.slug = slugify(this.name, {
      lower: true,
    });
  }

  constructor(category?: Partial<Category>) {
    this.id = category?.id;
    this.name = category?.name;
    this.description = category?.description;
    this.slug = category?.slug;
    this.parentId = category?.parentId;
    this.products = category?.products;
  }
}
