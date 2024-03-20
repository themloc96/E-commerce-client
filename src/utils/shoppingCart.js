const LS_SHOPPING_CART = 'shopping_cart_';

export const getProductsFromCartLS = () => {
  return JSON.parse(localStorage.getItem(LS_SHOPPING_CART)) || [];
};

export const saveProductToCartLS = ({
  product,
  quantity,
  quantityOption,
  totalAmount,
  selectedOption,
}) => {
  const products = getProductsFromCartLS();
  if (products?.length === 0 || !products) {
    const newProduct = {
      ...product,
      quantity,
      quantityOption,
      totalAmount,
      selectedOption,
    };
    newProduct.description = '';
    localStorage.setItem(LS_SHOPPING_CART, JSON.stringify([{ ...newProduct }]));
    return [{ ...newProduct }];
  }
  const index = products.findIndex(
    item =>
      item.id === product.id && item.selectedOption.id === selectedOption.id,
  );
  if (index !== -1) {
    const newProduct = products[index];
    newProduct.quantity += quantity;
    newProduct.totalAmount = totalAmount;
    newProduct.selectedOption = selectedOption;
  } else {
    products.push({
      ...product,
      quantity,
      quantityOption,
      totalAmount,
      selectedOption,
    });
  }
  localStorage.setItem(LS_SHOPPING_CART, JSON.stringify(products));
  // eslint-disable-next-line consistent-return
  return products;
};

export const removeProductsFromCartLS = () => {
  localStorage.removeItem(LS_SHOPPING_CART);
};

export const updateProductsToCartLS = products => {
  removeProductsFromCartLS();
  localStorage.setItem(LS_SHOPPING_CART, JSON.stringify(products));
};
// ENDREGION Local storage

export function updateProductChecked({ products, id, optionId, isChecked }) {
  if (products?.length === 0) return [];
  return products?.map(item => {
    if (item.id === id && item.selectedOption.id === optionId) {
      return {
        ...item,
        checked: isChecked,
      };
    }
    return {
      ...item,
    };
  });
}

export function updateQuantity({ type, id, products, optionId }) {
  let newProducts = products;
  switch (type) {
    case 'INCREASE': {
      newProducts = products.map(item => {
        if (id === item.id && optionId === item.selectedOption.id) {
          const quantity = item.quantity + 1;
          const totalAmount = quantity * item.price;
          return {
            ...item,
            quantity,
            totalAmount,
          };
        }
        return item;
      });
      break;
    }
    case 'DESCREASE': {
      newProducts = products.map(item => {
        if (id === item.id && optionId === item.selectedOption.id) {
          const quantity =
            item.quantity > 1 ? item.quantity - 1 : item.quantity;
          const totalAmount = quantity * item.price;
          return {
            ...item,
            quantity,
            totalAmount,
          };
        }
        return item;
      });
      break;
    }
    default:
      break;
  }
  return newProducts;
}
