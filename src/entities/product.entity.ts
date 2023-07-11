import {
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  Entity,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import slugify from 'slugify';
import { Firm } from './firm.entity';
import { BaseTable } from './commons/baseTable';
import { ProductVariation } from './product-variation.entity';

@Entity()
@Unique(['firm', 'slug'])
export class Product extends BaseTable {
  @Column({ default: true })
  active: boolean;

  @Column({ length: 60, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 100, nullable: false })
  slug: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(
    () => ProductVariation,
    (productVariation) => productVariation.product,
  )
  @JoinTable()
  variations: ProductVariation[];

  @ManyToOne(() => Firm, { nullable: false })
  firm: Firm;

  @BeforeInsert()
  setSlug() {
    this.slug = slugify(this.name, {
      lower: true,
    });
  }

  constructor(product?: Partial<Product>) {
    super();
    this.name = product?.name;
    this.active = product?.active;
    this.description = product?.description;
    this.slug = product?.slug;
    this.price = product?.price;
    this.categories = product?.categories;
    this.firm = product?.firm;
  }
}
