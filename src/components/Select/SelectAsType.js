/* eslint-disable no-extra-boolean-cast */
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import Dropdown from '../Input/Dropdown';
import { convertSelectListData } from '../../utils/helpers';

function SelectAsType({ defaultValue, fieldName, rules, control, errors }) {

  const dataList = convertSelectListData({
    data: [
      { label: '무상', value: 'FREE' }, // 무상
      { label: '유상', value: 'PAID' }, // 유상
    ],
    textField: 'label',
    valueField: 'value',
  });

  const handleConvertText = value => {
    const textValue = dataList?.find(item => item.value === value) || null;
    if (textValue) {
      if (textValue.value === 'PAID') {
        textValue.label = '유상';
      } else if (textValue.value === 'FREE') {
        textValue.label = '무상';
      }
    }
    return textValue;
  };

  const defaultOptionIndex = dataList.findIndex(
    item => item.value === defaultValue,
  );

  return (
    <Controller
      name={fieldName}
      rules={rules}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <Dropdown
            placeHolderText={defaultValue}
            className={`w-full ${
              !!errors.representativeSymptom ? '!border-error' : ''
            }`}
            options={dataList}
            onOptionChange={option => onChange(option?.value)}
            valueOfSelect={handleConvertText(value)}
            isConfigIcon
            defaultOptionIndex={defaultOptionIndex}
            defaultChecked={value === 'FREE' ? '무상' : '유상'}
          />
        );
      }}
    />
  );
}

export default SelectAsType;
