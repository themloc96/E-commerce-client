import React from 'react';
import '../../styles/components/field-search.scss';

function FieldSearch(props) {
  const { placeholder, onClick = () => {}, onChange, onKeyDown } = props;
  return (
    <div className="field-search">
      <input
        type="text"
        placeholder={placeholder || 'Searching ...'}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button onClick={onClick}>
        <img alt="btn-search" src="/assets/icons/search.png" />
      </button>
    </div>
  );
}

export default FieldSearch;
