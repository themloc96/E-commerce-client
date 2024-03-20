/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from 'react';
import { useWindowDimensions } from '../../../../hooks';
import { formatCost } from '../../../../utils/helpers';

function DropdownSurcharge(props) {
  const {
    totalSurchargeAmount,
    options,
    placeHolderText,
    className = '',
  } = props;
  const { width } = useWindowDimensions();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const initialSelectedItems = options.filter(option => option.isActive);
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  const toggling = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = option => {
    if (selectedItems.includes(option)) {
      setSelectedItems(selectedItems.filter(item => item !== option));
    } else {
      setSelectedItems([...selectedItems, option]);
    }
  };

  const handleTogglingBlur = () => {
    setIsOpen(false);
  };

  const getOptionText = label => {
    switch (label) {
      case 'NIGHT':
        return '야간';
      case 'DISTANCE':
        return '거리';
      case 'HOLIDAY':
        return '휴일';
      case 'OTHERS':
        return '거리';
      default:
        return label;
    }
  };

  const getSelectedItemsText = () => {
    return selectedItems.map(item => getOptionText(item.label)).join(', ');
  };

  const formatPrice = value => {
    const cost = formatCost(Math.floor(value));
    return cost.replace(/,/g, ',');
  };

  return (
    <div className="registration-number row">
      <div className="col-70">
        <div className="label-optional-surcharge">
          {/* 할증료 선택(다중선택 가능) */}
          할증료 선택
        </div>
        <div className={`dropdown-wrap ${isOpen ? 'open ' : ''}${className}`}>
          <div className="dropdown-container">
            <div
              className="dropdown-header"
              // onClick={toggling}
              onBlur={handleTogglingBlur}
              style={{ cursor: 'default' }}
            >
              <div
                className="text f14Regular text-black/[0.6] ml-[19px]"
                style={{ marginTop: '-1px' }}
              >
                {selectedItems.length > 0
                  ? getSelectedItemsText()
                  : placeHolderText}
              </div>
              {/* <div className="w-[10px] h-[10px] lg:w-[19.2px] lg:h-6 arrow-img">
                <img src="/assets/arrow/down.png" alt="down" />
              </div> */}
            </div>
            <div className="dropdown-list-container">
              <ul className="dropdown-list" ref={dropdownRef}>
                {options.map(option => (
                  <li
                    className={`item-list ${
                      selectedItems.includes(option) ? 'item-selected' : ''
                    }`}
                    key={option.label}
                    onClick={() => handleItemClick(option)}
                  >
                    <div>
                      <span>{getOptionText(option.label)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-30">
        <div className="label-optional-surcharge">
          {width > 767 ? '할증료' : ''}
        </div>
        <div className="wrapper-field">
          <div className="field full">
            <input value={formatPrice(totalSurchargeAmount)} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropdownSurcharge;
