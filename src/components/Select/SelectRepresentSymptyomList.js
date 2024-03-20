/* eslint-disable no-extra-boolean-cast */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Controller } from 'react-hook-form';

import Dropdown from '../Input/Dropdown';
import { getRepresentSymptomsFn } from '../../apis/after-service';
import { convertSelectListData } from '../../utils/helpers';

function SelectRepresentSymptyomList({
  fieldName,
  rules,
  control,
  errors,
  defaultValue,
}) {
  const { data } = useQuery(['getRepresentSymptoms'], getRepresentSymptomsFn);
  const { list: symptomList } = data || { list: [] };
  const dataList = convertSelectListData({
    data: symptomList,
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
            className={`w-full ${
              !!errors.representativeSymptom ? '!border-error' : ''
            }`}
            options={dataList}
            onOptionChange={option => onChange(option?.label)}
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

export default SelectRepresentSymptyomList;
