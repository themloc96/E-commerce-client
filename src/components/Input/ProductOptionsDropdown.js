import React, { useRef, useState } from 'react';
// import { useOnClickOutside } from '../../hooks';
// import ArrowDownIcon from '../Svg/ArrowDownIcon';
import '../../styles/components/dropdown.scss';
import { formatNumber } from '../../utils/helpers';

function ProductOptionsDropdown(props) {
  const {
    options,
    onOptionChange,
    defaultOptionIndex = 0,
    placeHolderText,
    valueOfSelect,
  } = props;
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] =
    useState(defaultOptionIndex);

  const toggling = event => {
    event.preventDefault();
    if (isOpen === true) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const onOptionClicked = selectedIndex => () => {
    setSelectedOptionIndex(selectedIndex);
    setIsOpen(false);
    setOptionSelected(true);

    if (onOptionChange) {
      onOptionChange(options[selectedIndex]);
    }
  };

  const handleTogglinhBlur = event => {
    event.preventDefault();
    setIsOpen(false);
  };

  // useOnClickOutside(dropdownRef, () => setIsOpen(false));
  return (
    <div className={`dropdown-wrap ${isOpen ? 'open' : ''}`}>
      <div className="dropdown-container">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="dropdown-header"
          onClick={toggling}
          onBlur={handleTogglinhBlur}
        >
          <div
            className="text text-title-custom text-black/[0.6] ml-[19px]"
            style={{ marginTop: '-1px' }}
          >
            {(!optionSelected && placeHolderText) || !valueOfSelect
              ? placeHolderText
              : options[selectedOptionIndex].label}
          </div>
          <div className="w-[10px] h-[10px] lg:w-[19.2px] lg:h-6 arrow-img">
            <img src="/assets/arrow/down.png" alt="down" />
          </div>
        </div>
        <div className="dropdown-list-container">
          <ul className="dropdown-list" ref={dropdownRef}>
            {options.map((option, index) =>
              placeHolderText || index !== selectedOptionIndex ? (
                <li
                  className={`item-list ${
                    index === selectedOptionIndex ? 'item-selected' : ''
                  }`}
                  onClick={onOptionClicked(index)}
                  key={option.label}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{option.label}</span>
                    <span>
                      {formatNumber(Math.round(option.price * 1.1))}원
                    </span>
                  </div>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductOptionsDropdown;
