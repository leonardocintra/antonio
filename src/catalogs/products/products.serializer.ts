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

function serializers(products: Product[]) {
  return products.map((product) => {
    return serializer(product);
  });
}

function serializer(product: Product) {
  return {
    id: product.id,
    active: product.active,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categories: product.categories ? product.categories : [],
    variations: product.variations
      ? _productVariationSerializer(product.variations)
      : [],
  };
}

function _productVariationSerializer(productVariations: ProductVariation[]) {
  const datas: VariationsType[] = [];

  for (const element of productVariations) {
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

export const productSerializer = {
  serializer,
  serializers,
};
