import { useRef, useState } from 'react';

function useSearchValue(defaultValue = '') {
  const searchRef = useRef();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const handleChangeSearchValue = e => {
    searchRef.current = {
      value: e?.target?.value,
    };
  };
  const handleSearch = () => {
    setSearchValue(searchRef?.current?.value);
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return {
    searchValue,
    handleChangeSearchValue,
    handleSearch,
    handleKeyDown,
  };
}

export default useSearchValue;
