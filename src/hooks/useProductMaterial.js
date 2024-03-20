import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useSearchValue from './useSearchValue';
import { getMaterialPopupFn } from '../apis/product.api';
import useCheckedItems from './useCheckedItems';

function useProductMaterial({ isOpen }) {
  const searchValue = useSearchValue();
  const checkedItem = useCheckedItems();
  const foundQuery = useQuery(
    [`/v1/product/material/popup`, searchValue],
    () => {
      return getMaterialPopupFn({ search: searchValue });
    },
    {
      onSuccess: data => {
        checkedItem.handleChangeItems(data.list);
      },
      enabled: isOpen,
    },
  );
}

export default useProductMaterial;
