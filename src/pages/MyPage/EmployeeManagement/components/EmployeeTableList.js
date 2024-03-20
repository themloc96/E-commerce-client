import React from 'react';

// components
import { IndCheckbox } from '../../../../components/WTable/IndCheckbox';

// utils
import { formatShortDate } from '../../../../utils/helper.dateTime';

// constants
import { MEMBER_STATUS } from '../../../../constants/jsonData/member';

function EmployeeTableList({
  employeeList,
  onChangeCheckedAll,
  onChangeEmployeeChecked,
  isFetching,
}) {
  const isCheckedAll =
    employeeList?.length === 0
      ? false
      : employeeList.every(item => item.checked);

  return (
    <div className="employee-table-wrap">
      <table>
        <tr>
          <th className="employee-table-col-1 td-1">
            <IndCheckbox onChange={onChangeCheckedAll} checked={isCheckedAll} />
          </th>
          <th className="employee-table-col-2">가입일</th>
          <th className="employee-table-col-3">아이디</th>
          <th className="employee-table-col-4">연락처</th>
          <th className="employee-table-col-5">아이디</th>
          <th className="employee-table-col-6">승인여부</th>
        </tr>
        {employeeList
          .filter(item => item.memberType !== 'ACCOUNT')
          .map(item => {
            const {
              createdAt,
              id,
              username,
              phone,
              name,
              memberStatus,
              checked,
            } = item;
            return (
              <tr className="employee--has-border">
                <td className="td-1">
                  <IndCheckbox
                    onChange={e => {
                      onChangeEmployeeChecked(e, id);
                    }}
                    checked={checked}
                  />
                </td>
                <td>{formatShortDate(createdAt)}</td>
                <td>{username}</td>
                <td className="mobile-disable">{phone}</td>
                <td>{name}</td>
                <td>{MEMBER_STATUS[memberStatus]}</td>
              </tr>
            );
          })}
      </table>
    </div>
  );
}

export default EmployeeTableList;
