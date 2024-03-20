import React, { forwardRef, useEffect, useState } from 'react';
// eslint import/no-unresolved
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { Input } from '../../../../components/Input';
import { formatShortDate } from '../../../../utils/helper.dateTime';

registerLocale('ko', ko);

function InstallationDate({ errors, register, setValue }) {
  const [startDate, setStartDate] = useState();
  useEffect(() => {
    setValue('installationDate', startDate);
  }, [startDate]);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      classes="!w-[187px] md:!w-[192px] h-[35px] md:h-[60px] !mt-0 md:!mt-2 md:!pl-[18px]"
      label=""
      name="installationDate"
      type="text"
      value={value}
      onChange={onClick}
      placeholder={`${formatShortDate(new Date())}`}
      helperText={errors.installationDate?.message}
      error={!!errors.installationDate}
      register={register}
    />
  ));
  return (
    <div
      className={`flex md:flex-col md:items-start customer-label-input${
        errors.installationDate ? '' : ' items-center'
      }`}
    >
      <label
        className="flex-1 mb-[2px] md:flex-none md:pt-[0px] pt-[15px]"
        htmlFor="고객명"
      >
        설치일
      </label>

      <DatePicker
        popperClassName="w-[187px] md:!w-[192px] h-[35px] md:h-[60px] !mt-0 md:!mt-2"
        selected={startDate}
        onChange={date => setStartDate(date)}
        customInput={<CustomInput />}
        locale="ko"
        dateFormat="yyyy-MM-dd"
      />
    </div>
  );
}

export default InstallationDate;
