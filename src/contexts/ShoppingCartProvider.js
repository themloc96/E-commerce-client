/* eslint-disable react/function-component-definition */
import { createContext, useContext, useMemo, useState } from 'react';
import { getProductsFromCartLS } from '../utils/shoppingCart';

export const ShoppingCartContext = createContext(undefined);

const ShoppingCartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const value = useMemo(() => ({ products, setProducts }), [products]);

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

const useShoppingCartContext = () => {
  const context = useContext(ShoppingCartContext);
  if (context) {
    return context;
  }
  throw new Error(
    `useShoppingCartContext must be used within a AuthShoppingCartContext`,
  );
};

export { ShoppingCartProvider, useShoppingCartContext };
