import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { VariationsValue } from '../variations-values/entities/variations-value.entity';

@Entity()
export class Variation {
  // Variation: color, weight, etc...

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @OneToMany(
    () => VariationsValue,
    (variationValues: VariationsValue) => variationValues.variation,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  variationValues: VariationsValue[];

  @ManyToMany(() => Product, (product) => product.variations)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
