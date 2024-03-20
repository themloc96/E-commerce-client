import React from 'react';
import { useQuery } from '@tanstack/react-query';

import useSearchValue from '../../../../hooks/useSearchValue';
import { useCheckedItems } from '../../../../hooks';
import { getMaterialPopupFn } from '../../../../apis/product.api';

function useMaterials() {
  const search = useSearchValue();
  const checkedItems = useCheckedItems();

  const foundQuery = useQuery(
    [`/v1/product/material/popup`, search.searchValue],
    () => {
      return getMaterialPopupFn({ search: search.searchValue });
    },
    {
      keepPreviousData: true,
      onSuccess: data => {
        checkedItems.handleChangeItems(data.list);
      },
    },
  );
  const handleResetChecked = () => {
    checkedItems.handleChangeItems(
      checkedItems.items?.map(item => {
        return {
          ...item,
          checked: false,
        };
      }),
    );
  };
  return {
    ...search,
    ...checkedItems,
    ...foundQuery,
    handleResetChecked,
  };
}

export default useMaterials;
