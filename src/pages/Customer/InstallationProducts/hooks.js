/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSearchProductsFn } from '../../../apis/customer.api';
import useSearchValue from '../../../hooks/useSearchValue';

function useProducts() {
  const search = useSearchValue();
  const [products, setProducts] = useState([]);
  const { searchValue } = search;
  // Fetch data list table
  const foundQuery = useQuery(
    [`v1/product/popup`, [searchValue]],
    () => getSearchProductsFn({ search: searchValue }),
    {
      refetchOnMount: true,
      staleTime: 0,
      onSuccess: data => {
        const newItems = data?.list
          ?.filter(raw => raw.public !== false && raw.usage !== false)
          .map(item => {
            const { code, modelName, price, id } = item;
            return {
              id,
              code,
              modelName,
              price,
              checked: false,
            };
          });
        setProducts(newItems);
      },
    },
  );
  const handleChangeChecked = (isChecked, id) => {
    const newProducts = products?.map(item => {
      if (item?.id === id) {
        return {
          ...item,
          checked: isChecked,
        };
      }
      return {
        ...item,
        checked: false,
      };
    });
    setProducts(newProducts);
  };

  return {
    ...foundQuery,
    ...search,
    products,
    handleChangeChecked,
  };
}

function useTogglePortal() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  useEffect(() => {
    if (isPortalOpen) {
      document.getElementById('footer')
        ? (document.getElementById('footer').style.display = 'none')
        : null;
      document.getElementById('mobile-header')
        ? (document.getElementById('mobile-header').style.display = 'none')
        : null;
      document.getElementById('customer')
        ? (document.getElementById('customer').style.display = 'none')
        : null;
    } else {
      document.getElementById('footer')
        ? (document.getElementById('footer').style.display = 'block')
        : null;
      document.getElementById('mobile-header')
        ? (document.getElementById('mobile-header').style.display = 'block')
        : null;
      document.getElementById('customer')
        ? (document.getElementById('customer').style.display = 'block')
        : null;
    }

    return () => {
      document.getElementById('footer')
        ? (document.getElementById('footer').style.display = 'block')
        : null;
      document.getElementById('mobile-header')
        ? (document.getElementById('mobile-header').style.display = 'block')
        : null;
      document.getElementById('customer')
        ? (document.getElementById('customer').style.display = 'block')
        : null;
    };
  }, [isPortalOpen]);
  const togglePortal = () => setIsPortalOpen(prev => !prev);
  return { isPortalOpen, togglePortal };
}
export { useTogglePortal };
export default useProducts;
