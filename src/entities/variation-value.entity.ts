import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { Variation } from './variation.entity';
import { BaseTable } from './commons/baseTable';

@Entity()
export class VariationValue extends BaseTable {
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
  @JoinColumn()
  variation: Variation;
}
