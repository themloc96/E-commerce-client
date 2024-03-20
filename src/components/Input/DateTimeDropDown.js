import React, { useState } from 'react';
import Dropdown from './Dropdown';
import '../../styles/components/date-time-dropdown.scss';

function DateTimeDropDown() {
  const [yearOptionState, setYearOptionState] = useState();
  const [monthOptionState, setMonthOptionState] = useState();
  const minOffset = 0;
  const maxOffset = 10;
  const thisYear = new Date().getFullYear();
  const yearOptions = [];
  const monthOptions = [];

  for (let i = minOffset; i <= maxOffset; i += 1) {
    const localYear = thisYear - i;
    const option = { value: localYear, label: localYear };
    yearOptions.push(option);
  }
  for (let i = 1; i <= 12; i += 1) {
    const localMonth = i.toString().padStart(2, '0');
    const option = { value: localMonth, label: localMonth };
    monthOptions.push(option);
  }

  return (
    <div className="date-time-dropdown select-wrap-box">
      <Dropdown
        placeHolderText={yearOptions[0].value}
        options={yearOptions}
        onOptionChange={option => {
          setYearOptionState(option.value);
        }}
        valueOfSelect={yearOptionState}
        defaultOptionIndex={0}
      />
      <Dropdown
        className="month-dropdown"
        placeHolderText={monthOptions[0].value}
        options={monthOptions}
        onOptionChange={option => {
          setMonthOptionState(option.value);
        }}
        valueOfSelect={monthOptionState}
        defaultOptionIndex={0}
      />
    </div>
  );
}

export default DateTimeDropDown;
