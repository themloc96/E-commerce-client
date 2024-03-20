import React, { useRef, useState } from 'react';
// import { useOnClickOutside } from '../../hooks';
// import ArrowDownIcon from '../Svg/ArrowDownIcon';
import '../../styles/components/dropdown.scss';

function Dropdown(props) {
  const {
    options,
    onOptionChange,
    defaultOptionIndex,
    placeHolderText,
    valueOfSelect,
    className = '',
    setValueOfSelect = () => {},
    checkFlag,
    defaultChecked,
    isConfigIcon = false,
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

  const resetMonthIndex = () => {
    if (options.length > selectedOptionIndex) {
      if (checkFlag) setValueOfSelect(options[selectedOptionIndex]?.label);
      return options[selectedOptionIndex]?.label;
    }
    setSelectedOptionIndex(0);
    return options[0].label;
  };

  const restMonthSelectItem = index => {
    if (options.length > selectedOptionIndex) {
      return index === selectedOptionIndex;
    }
    return index === 0;
  };
  // useOnClickOutside(dropdownRef, () => setIsOpen(false));
  return (
    <div className={`dropdown-wrap ${isOpen ? 'open ' : ''}${className}`}>
      <div className="dropdown-container">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="dropdown-header"
          onClick={toggling}
          onBlur={handleTogglinhBlur}
        >
          <div
            className="text f14Regular text-black/[0.6] ml-[19px]"
            style={{ marginTop: '-1px' }}
          >
            {(!optionSelected && placeHolderText) || !valueOfSelect
              ? placeHolderText
              : resetMonthIndex()}
          </div>
          <div className="w-[10px] h-[10px] lg:w-[19.2px] lg:h-6 arrow-img">
            {isConfigIcon ? (
              <img src="/assets/arrow/top_24px@3x.png" alt="down" />
            ) : (
              <img src="/assets/arrow/down.png" alt="down" />
            )}
          </div>
        </div>
        <div className="dropdown-list-container">
          <ul className="dropdown-list" ref={dropdownRef}>
            {options.map((option, index) =>
              placeHolderText || index !== selectedOptionIndex ? (
                <li
                  className={`item-list ${
                    restMonthSelectItem(index) ||
                    option?.label?.toString() === defaultChecked
                      ? 'item-selected'
                      : ''
                  }`}
                  onClick={onOptionClicked(index)}
                  key={option.label}
                >
                  <div>
                    <span>{option.label}</span>
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

export default Dropdown;
