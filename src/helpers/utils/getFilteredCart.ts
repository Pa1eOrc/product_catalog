import { Carts } from '../../type/Carts';
import { Product } from '../../type/Product';

export function getFilteredCarts(carts: Product[]): Carts[] {
  const filteredCarts: { [id: string]: Carts } = {};

  carts.forEach((cart) => {
    const {
      id,
      price,
      name,
      image,
      itemId,
      category,
    } = cart;

    if (filteredCarts[id]) {
      filteredCarts[id].count += 1;
    } else {
      filteredCarts[id] = {
        id,
        count: 1,
        price,
        name,
        image,
        itemId,
        category,
      };
    }
  });

  const sortedCarts = Object.keys(filteredCarts)
    .sort()
    .map(id => filteredCarts[id]);

  return sortedCarts;
}
