import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import slugify from 'slugify';
import { Firm } from './firm.entity';
import { BaseTable } from './commons/baseTable';

@Entity()
@Unique(['firm', 'slug'])
export class Category extends BaseTable {
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

  @BeforeInsert()
  setSlug() {
    this.slug = slugify(this.name, {
      lower: true,
    });
  }

  constructor(category?: Partial<Category>) {
    super();
    this.name = category?.name;
    this.description = category?.description;
    this.slug = category?.slug;
    this.parentId = category?.parentId;
    this.products = category?.products;
  }
}
