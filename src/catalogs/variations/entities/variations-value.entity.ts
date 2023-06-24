import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
} from 'typeorm';
import { Variation } from './variation.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class VariationsValue {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, length: 40 })
  value: string;

  @Column({ nullable: true, length: 20 })
  color: string;

  @ManyToOne(
    () => Variation,
    (variation: Variation) => variation.variationsValues,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  variation: Variation;

  @ManyToMany(() => Product, (product) => product.variations)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
