import { useNavigate } from 'react-router-dom';
import { afterServiceStatus } from '../../../constants';

function TableDataAsStatus({ data = [], currentPage }) {
  const navigate = useNavigate();

  const convertAsStatus = status => {
    switch (status) {
      case afterServiceStatus.CC:
        return '상담완료';
      case afterServiceStatus.AC:
        return 'A/S 접수완료';
      case afterServiceStatus.AF:
        return 'A/S 조치완료';
      case afterServiceStatus.AAC:
        return 'A/S 조치확정';
      case afterServiceStatus.AM:
        return 'A/S 출동중';
      case afterServiceStatus.T:
        return '임시저장';
      case afterServiceStatus.C:
        return '취소';
      case afterServiceStatus.AAD:
        return '조치내역 입력필요';
      default:
        return '';
    }
  };

  const asFeeTypeObj = {
    FREE: '무상',
    PAID: '유상',
  };

  const handleOpenDetail = (status, id) => {
    switch (status) {
      // case 'AF':
      //   navigate(`/as/action-result/case-one/${id}`);
      //   break;
      case 'AAD':
        navigate(`/as/status/detail/enter-action-details/${id}`);
        break;
      default:
        navigate(`/as/status/detail/as-reception/${id}`);
        break;
    }
  };

  return (
    <div className="table-as-status">
      <table>
        <thead>
          <tr className="header">
            <th className="col-1">
              <span>No</span>
            </th>
            <th className="col-2">
              <span>접수일</span>
            </th>
            <th className="col-3">
              <span>출동구분</span>
            </th>
            <th className="col-4">
              <span>유/무상</span>
            </th>
            <th className="col-5">
              <span>고객명</span>
            </th>
            <th className="col-6">
              <span>연락처</span>
            </th>
            <th className="col-7">
              <span>주소</span>
            </th>
            <th className="col-8">
              <span>모델명</span>
            </th>
            <th className="col-9">
              <span>상태</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <td className="col-1">
                  <span>{Number(currentPage) * 20 + index + 1}</span>
                </td>
                <td className="col-2">
                  <span>{item.createdAt.split(' ')[0].replace(/-/g, '.')}</span>
                </td>
                <td className="col-3">
                  <span
                    style={{
                      color:
                        item.asDispatchCategory === 'GENERAL' ? '' : '#f00',
                    }}
                  >
                    {item.asDispatchCategory === 'GENERAL'
                      ? '출동접수'
                      : '긴급출동'}
                  </span>
                </td>
                <td className="col-4">
                  <span>{asFeeTypeObj[item.asFeeType]}</span>
                </td>
                <td className="col-5">
                  <span>{item.customerName || ''}</span>
                </td>
                <td className="col-6">
                  <span>{item.customerPhoneNumber || ''}</span>
                </td>
                <td className="col-7">
                  <span>{item.customerAddress || ''}</span>
                </td>
                <td className="col-8">
                  <span>{item.productModelName}</span>
                </td>
                <td className="col-9 situation">
                  <button
                    onClick={() => handleOpenDetail(item.asStatus, item.id)}
                  >
                    <span>{convertAsStatus(item.asStatus)}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default TableDataAsStatus;
