import {
  Column,
  OneToMany,
  JoinColumn,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { VariationValue } from './variation-value.entity';
import { Firm } from './firm.entity';
import { BaseTable } from './commons/baseTable';

@Entity()
@Unique(['firm', 'name'])
export class Variation extends BaseTable {
  // Variation: color, weight, categoria (python, java, etc) etc...

  @Column({ nullable: false, length: 50 })
  name: string;

  @OneToMany(
    () => VariationValue,
    (variationValues: VariationValue) => variationValues.variation,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  variationsValues: VariationValue[];

  @ManyToOne(() => Firm, { nullable: false })
  firm: Firm;
}
