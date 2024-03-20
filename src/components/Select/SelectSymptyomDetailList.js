/* eslint-disable no-extra-boolean-cast */
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Controller } from 'react-hook-form';

import { getDetailedSymptomsFn } from '../../apis/after-service';
import Dropdown from '../Input/Dropdown';
import { convertSelectListData } from '../../utils/helpers';

function SelectSymptyomDetailList({
  fieldName,
  rules,
  control,
  errors,
  defaultValue,
}) {
  const { data } = useQuery(['getDetailedSymptoms'], getDetailedSymptomsFn);
  const { list: detailSymptomList } = data || { list: [] };
  const dataList = convertSelectListData({
    data: detailSymptomList,
    textField: 'name',
    valueField: 'id',
  });

  const defaultOptionIndex = dataList.findIndex(
    item => item.label === defaultValue,
  );

  return (
    <Controller
      name={fieldName}
      rules={rules}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <Dropdown
            className={`w-full relative z-[1] ${
              !!errors.detailedSymptom ? '!border-error' : ''
            }`}
            options={dataList}
            onOptionChange={option => {
              onChange(option?.label);
            }}
            valueOfSelect={dataList?.find(item => item.label === value) || null}
            isConfigIcon
            defaultOptionIndex={defaultOptionIndex || 0}
            defaultChecked={value}
            placeHolderText={defaultValue}
          />
        );
      }}
    />
  );
}

export default SelectSymptyomDetailList;
