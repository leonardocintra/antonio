import {
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Variation } from '../../variations/entities/variation.entity';
import slugify from 'slugify';
import { Firm } from '../../../firms/entities/firm.entity';

@Entity()
@Unique(['firm', 'slug'])
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @ManyToMany(() => Variation, (variation) => variation.products, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  variations: Variation[];

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => Firm, { nullable: false })
  firm: Firm;

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

  constructor(product?: Partial<Product>) {
    this.id = product?.id;
    this.name = product?.name;
    this.active = product?.active;
    this.description = product?.description;
    this.slug = product?.slug;
    this.price = product?.price;
    this.categories = product?.categories;
    this.variations = product?.variations;
    this.firm = product?.firm;
  }
}
