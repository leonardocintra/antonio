import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { VariationsValue } from './variations-value.entity';
import { Firm } from '../../../firms/entities/firm.entity';

@Entity()
@Unique(['firm', 'name'])
export class Variation {
  // Variation: color, weight, categoria (python, java, etc) etc...

  @PrimaryGeneratedColumn('increment')
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

  @ManyToOne(() => Firm, { nullable: false })
  firm: Firm;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
