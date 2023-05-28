import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Variation } from './variation.entity';

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
    (variation: Variation) => variation.variationValues,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  variation: Variation;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
