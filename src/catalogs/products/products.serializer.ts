import { ProductVariation } from '../../entities/product-variation.entity';
import { Product } from '../../entities/product.entity';

type VariationsType = {
  id: number;
  name: string;
  values?: VariationValueType[];
};

type VariationValueType = {
  id: number;
  value: string;
  color?: string;
};

export default function productSerializer(product: Product) {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categories: product.categories,
    variations: productVariationSerializer(product.variations),
  };
}

function productVariationSerializer(productVariations: ProductVariation[]) {
  let datas: VariationsType[] = [];

  for (let element of productVariations) {
    const data = datas.find((v) => v.id === element.variation.id);
    if (data) {
      data.values.push({
        id: element.variationValue.id,
        value: element.variationValue.value,
        color: element.variationValue.color,
      });
    } else {
      if (element.variationValue) {
        datas.push({
          id: element.variation.id,
          name: element.variation.name,
          values: [
            {
              id: element.variationValue.id,
              value: element.variationValue.value,
              color: element.variationValue.color,
            },
          ],
        });
      } else {
        datas.push({
          id: element.variation.id,
          name: element.variation.name,
        });
      }
    }
  }
  return datas;
}
