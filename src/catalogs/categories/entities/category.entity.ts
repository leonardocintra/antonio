import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import slugify from "slugify";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  active: boolean;

  @Column({ length: 50, nullable: false, unique: true })
  name: string;

  @Column({ length: 150, nullable: false })
  description: string;

  @Column({ length: 150, nullable: false, unique: true })
  slug: string;

  @Column({ nullable: true })
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
