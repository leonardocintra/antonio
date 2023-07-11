import { Entity, ManyToOne } from 'typeorm';
import { BaseTable } from './commons/baseTable';
import { Product } from './product.entity';
import { VariationValue } from './variation-value.entity';
import { Variation } from './variation.entity';

@Entity()
export class ProductVariation extends BaseTable {
  @ManyToOne(() => Product, (product: Product) => product.variations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Variation, { nullable: false })
  variation: Variation;

  @ManyToOne(() => VariationValue, { nullable: true })
  variationValue: VariationValue;
}
