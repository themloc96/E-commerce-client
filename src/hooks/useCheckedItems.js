import { useState } from 'react';
import { generateUId } from '../utils/helpers';

function useCheckedItems() {
  const [items, setItems] = useState([]);

  const handleChangeItems = newItems =>
    setItems(() =>
      newItems?.map(item => {
        return {
          ...item,
          uniqueId: generateUId(),
        };
      }),
    );
  
  const handleChangeChecked = (isChecked, uniqueId) => {
    setItems(() =>
      items.map(item => {
        if (uniqueId === item.uniqueId) {
          return {
            ...item,
            checked: isChecked,
          };
        }
        return item;
      }),
    );
  };
  
  const handleChangeAllChecked = (e) => {
    const isChecked = e?.target?.checked;
    setItems(() =>
      items?.map(item => {
        return {
          ...item,
          checked: isChecked,
        };
      }),
    );
  };

  return {
    items,
    handleChangeItems,
    handleChangeChecked,
    handleChangeAllChecked,
  };
}

export default useCheckedItems;
